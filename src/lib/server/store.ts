// Penyimpanan sesi untuk prototipe: satu file JSON di .data/sesi.json.
// Antarmukanya sengaja kecil supaya nanti bisa diganti Postgres/Supabase (dokumen 06 bagian 6)
// tanpa mengubah route API.

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Sesi } from '../engine/types';

export interface PenyimpananSesi {
	ambil(pemainId: string, kasusId: number): Sesi | null;
	simpan(sesi: Sesi): void;
	hapus(pemainId: string, kasusId: number): void;
	milikPemain(pemainId: string): Sesi[];
}

const kunci = (pemainId: string, kasusId: number) => `${pemainId}:${kasusId}`;

export class PenyimpananFile implements PenyimpananSesi {
	private data: Record<string, Sesi>;

	constructor(private path: string) {
		this.data = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {};
	}

	ambil(pemainId: string, kasusId: number): Sesi | null {
		return this.data[kunci(pemainId, kasusId)] ?? null;
	}

	simpan(sesi: Sesi): void {
		this.data[kunci(sesi.pemain_id, sesi.kasus_id)] = sesi;
		this.tulis();
	}

	hapus(pemainId: string, kasusId: number): void {
		delete this.data[kunci(pemainId, kasusId)];
		this.tulis();
	}

	milikPemain(pemainId: string): Sesi[] {
		return Object.values(this.data).filter((s) => s.pemain_id === pemainId);
	}

	private tulis(): void {
		mkdirSync(dirname(this.path), { recursive: true });
		const sementara = `${this.path}.tmp`;
		writeFileSync(sementara, JSON.stringify(this.data));
		renameSync(sementara, this.path);
	}
}

let instance: PenyimpananSesi | null = null;

export function penyimpanan(): PenyimpananSesi {
	instance ??= new PenyimpananFile(join(process.env.DT_AKAR ?? process.cwd(), '.data', 'sesi.json'));
	return instance;
}
