// Memuat data dunia (data/) dan kasus (kasus/) dari disk. Dipakai tools/ (CLI) dan unit test.
// Server memakai bundel.ts: di Vercel tidak ada folder proyek yang bisa dibaca saat runtime.
// Modul ini sengaja tanpa import $lib/$env supaya bisa dipakai juga oleh tools/.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DataDunia, KasusFile } from '../engine/types';

const AKAR = process.env.DT_AKAR ?? process.cwd();

/** Nama file kasus yang sah: YYYY-MM-DD.json. */
export const POLA_FILE_KASUS = /^\d{4}-\d{2}-\d{2}\.json$/;

function bacaJson<T>(path: string): T {
	return JSON.parse(readFileSync(path, 'utf8')) as T;
}

/** Menyusun DataDunia dari isi file data/<nama>.json, dari mana pun sumbernya. */
export function rakitDunia(baca: (nama: string) => any): DataDunia {
	return {
		karakter: baca('karakter').tersangka,
		barang: baca('barang').barang,
		lokasi: baca('lokasi').lokasi,
		motif: baca('motif').motif,
		ruangan: baca('ruangan').ruangan
	};
}

export function muatDunia(akar = AKAR): DataDunia {
	return rakitDunia((nama) => bacaJson(join(akar, 'data', `${nama}.json`)));
}

export function muatSemuaKasus(akar = AKAR): { file: string; kasus: KasusFile }[] {
	const d = join(akar, 'kasus');
	return readdirSync(d)
		.filter((f) => POLA_FILE_KASUS.test(f))
		.sort()
		.map((f) => ({ file: f, kasus: bacaJson<KasusFile>(join(d, f)) }));
}
