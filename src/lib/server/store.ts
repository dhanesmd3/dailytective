// Penyimpanan sesi pemain. Dua implementasi dengan antarmuka yang sama:
// - Redis (Upstash, lewat REST) kalau variabel Redis diisi: dipakai di Vercel, karena serverless tidak
//   punya disk yang bertahan dan tiap permintaan bisa jalan di instance berbeda.
// - File .data/sesi.json untuk lokal dan server biasa dengan satu instance.

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Sesi } from '../engine/types';

export interface PenyimpananSesi {
	ambil(pemainId: string, kasusId: number): Promise<Sesi | null>;
	simpan(sesi: Sesi): Promise<void>;
	hapus(pemainId: string, kasusId: number): Promise<void>;
	milikPemain(pemainId: string): Promise<Sesi[]>;
}

const kunci = (pemainId: string, kasusId: number) => `${pemainId}:${kasusId}`;

export class PenyimpananFile implements PenyimpananSesi {
	private data: Record<string, Sesi>;

	constructor(private path: string) {
		this.data = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {};
	}

	async ambil(pemainId: string, kasusId: number): Promise<Sesi | null> {
		return this.data[kunci(pemainId, kasusId)] ?? null;
	}

	async simpan(sesi: Sesi): Promise<void> {
		this.data[kunci(sesi.pemain_id, sesi.kasus_id)] = sesi;
		this.tulis();
	}

	async hapus(pemainId: string, kasusId: number): Promise<void> {
		delete this.data[kunci(pemainId, kasusId)];
		this.tulis();
	}

	async milikPemain(pemainId: string): Promise<Sesi[]> {
		return Object.values(this.data).filter((s) => s.pemain_id === pemainId);
	}

	private tulis(): void {
		mkdirSync(dirname(this.path), { recursive: true });
		const sementara = `${this.path}.tmp`;
		writeFileSync(sementara, JSON.stringify(this.data));
		renameSync(sementara, this.path);
	}
}

/**
 * Satu hash per pemain: dt:sesi:<pemainId> → { <kasusId>: JSON sesi }.
 * Jadi riwayat satu pemain (untuk statistik & streak) terbaca dengan satu HVALS.
 */
export class PenyimpananRedis implements PenyimpananSesi {
	constructor(
		private url: string,
		private token: string,
		private ambilHttp: typeof fetch = fetch
	) {}

	private hash(pemainId: string) {
		return `dt:sesi:${pemainId}`;
	}

	private async perintah<T>(...args: (string | number)[]): Promise<T> {
		const res = await this.ambilHttp(this.url, {
			method: 'POST',
			headers: { authorization: `Bearer ${this.token}`, 'content-type': 'application/json' },
			body: JSON.stringify(args)
		});
		const isi = (await res.json().catch(() => ({}))) as { result?: T; error?: string };
		if (!res.ok || isi.error) throw new Error(`Redis ${args[0]} gagal: ${isi.error ?? res.status}`);
		return isi.result as T;
	}

	async ambil(pemainId: string, kasusId: number): Promise<Sesi | null> {
		const isi = await this.perintah<string | null>('HGET', this.hash(pemainId), kasusId);
		return isi ? (JSON.parse(isi) as Sesi) : null;
	}

	async simpan(sesi: Sesi): Promise<void> {
		await this.perintah('HSET', this.hash(sesi.pemain_id), sesi.kasus_id, JSON.stringify(sesi));
	}

	async hapus(pemainId: string, kasusId: number): Promise<void> {
		await this.perintah('HDEL', this.hash(pemainId), kasusId);
	}

	async milikPemain(pemainId: string): Promise<Sesi[]> {
		const semua = await this.perintah<string[]>('HVALS', this.hash(pemainId));
		return semua.map((s) => JSON.parse(s) as Sesi);
	}
}

/** Alamat & token REST Redis. Integrasi Upstash di Vercel mengisi KV_REST_API_*; Upstash langsung UPSTASH_REDIS_REST_*. */
export function konfigRedis(e: Record<string, string | undefined> = process.env) {
	const url = e.KV_REST_API_URL ?? e.UPSTASH_REDIS_REST_URL;
	const token = e.KV_REST_API_TOKEN ?? e.UPSTASH_REDIS_REST_TOKEN;
	return url && token ? { url, token } : null;
}

let instance: PenyimpananSesi | null = null;

export function penyimpanan(): PenyimpananSesi {
	if (instance) return instance;
	const redis = konfigRedis();
	if (redis) {
		instance = new PenyimpananRedis(redis.url, redis.token);
	} else if (process.env.VERCEL) {
		// Disk Vercel tidak bertahan: lebih baik gagal jelas daripada progres pemain hilang diam-diam.
		throw new Error('[dailytective] Di Vercel, sambungkan database Upstash Redis (KV_REST_API_URL/KV_REST_API_TOKEN).');
	} else {
		instance = new PenyimpananFile(join(process.env.DT_AKAR ?? process.cwd(), '.data', 'sesi.json'));
	}
	return instance;
}
