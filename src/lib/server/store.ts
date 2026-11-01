// Penyimpanan sesi pemain. Dua implementasi dengan antarmuka yang sama:
// - Redis (Upstash, lewat REST) kalau variabel Redis diisi: dipakai di Vercel, karena serverless tidak
//   punya disk yang bertahan dan tiap permintaan bisa jalan di instance berbeda.
// - File .data/sesi.json untuk lokal dan server biasa dengan satu instance.

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { error } from '@sveltejs/kit';
import type { RedisClientType } from 'redis';
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

/**
 * Redis lewat koneksi biasa (redis://, rediss://), untuk database yang hanya memberi REDIS_URL,
 * misalnya produk "Redis" (Redis Cloud) di Vercel. Klien dibuat sekali per instance dan dipakai ulang.
 */
export class PenyimpananRedisTcp implements PenyimpananSesi {
	private klien: Promise<RedisClientType> | null = null;

	constructor(private url: string) {}

	private sambung(): Promise<RedisClientType> {
		this.klien ??= (async () => {
			const { createClient } = await import('redis');
			// Gagal cepat (3 percobaan) supaya permintaan tidak menggantung kalau Redis tidak terjangkau.
			const k = createClient({
				url: this.url,
				socket: {
					connectTimeout: 5000,
					reconnectStrategy: (coba) => (coba >= 3 ? new Error('Redis tidak terjangkau') : 200 * (coba + 1))
				}
			}) as RedisClientType;
			k.on('error', (e) => console.error('[dailytective] Redis:', e));
			await k.connect();
			return k;
		})().catch((e) => {
			this.klien = null;
			throw e;
		});
		return this.klien;
	}

	async ambil(pemainId: string, kasusId: number): Promise<Sesi | null> {
		const isi = await (await this.sambung()).hGet(`dt:sesi:${pemainId}`, String(kasusId));
		return isi ? (JSON.parse(isi) as Sesi) : null;
	}

	async simpan(sesi: Sesi): Promise<void> {
		await (await this.sambung()).hSet(`dt:sesi:${sesi.pemain_id}`, String(sesi.kasus_id), JSON.stringify(sesi));
	}

	async hapus(pemainId: string, kasusId: number): Promise<void> {
		await (await this.sambung()).hDel(`dt:sesi:${pemainId}`, String(kasusId));
	}

	async milikPemain(pemainId: string): Promise<Sesi[]> {
		const semua = await (await this.sambung()).hVals(`dt:sesi:${pemainId}`);
		return semua.map((s) => JSON.parse(s) as Sesi);
	}
}

export type KonfigRedis = { jenis: 'rest'; url: string; token: string } | { jenis: 'tcp'; url: string };

/**
 * Mencari koneksi Redis dari variabel lingkungan. Integrasi Vercel bisa memberi awalan bebas
 * (KV_REST_API_URL, STORAGE_KV_REST_API_URL, ...), jadi yang dicocokkan akhiran namanya.
 * REST (Upstash) didahulukan; REDIS_URL/KV_URL dipakai kalau hanya itu yang ada.
 */
export function konfigRedis(e: Record<string, string | undefined> = process.env): KonfigRedis | null {
	for (const [akhiranUrl, akhiranToken] of [
		['KV_REST_API_URL', 'KV_REST_API_TOKEN'],
		['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN']
	]) {
		for (const nama of Object.keys(e).filter((n) => n.endsWith(akhiranUrl))) {
			const url = e[nama];
			const token = e[nama.slice(0, -akhiranUrl.length) + akhiranToken];
			if (url && token) return { jenis: 'rest', url, token };
		}
	}
	const tcp = Object.keys(e)
		.filter((n) => /(^|_)(REDIS_URL|KV_URL)$/.test(n))
		.map((n) => e[n])
		.find((v) => v && /^rediss?:\/\//.test(v));
	return tcp ? { jenis: 'tcp', url: tcp } : null;
}

let instance: PenyimpananSesi | null = null;

export function penyimpanan(): PenyimpananSesi {
	if (instance) return instance;
	const redis = konfigRedis();
	if (redis?.jenis === 'rest') {
		instance = new PenyimpananRedis(redis.url, redis.token);
	} else if (redis?.jenis === 'tcp') {
		instance = new PenyimpananRedisTcp(redis.url);
	} else if (process.env.VERCEL) {
		// Disk Vercel tidak bertahan: lebih baik gagal jelas daripada progres pemain hilang diam-diam.
		console.error('[dailytective] Database Redis belum tersambung: tidak ada KV_REST_API_URL/TOKEN atau REDIS_URL.');
		error(500, 'Server belum dikonfigurasi: database belum tersambung');
	} else {
		instance = new PenyimpananFile(join(process.env.DT_AKAR ?? process.cwd(), '.data', 'sesi.json'));
	}
	return instance;
}
