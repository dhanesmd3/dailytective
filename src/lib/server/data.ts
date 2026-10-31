// Memuat data dunia (data/) dan kasus (kasus/) dari disk. Folder kasus/ hanya dibaca server,
// tidak pernah disajikan sebagai file statis, jadi kasus masa depan tidak bisa diintip lewat URL.
// Modul ini sengaja tanpa import $lib/$env supaya bisa dipakai juga oleh tools/ (CLI).

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DataDunia, KasusFile } from '../engine/types';

const AKAR = process.env.DT_AKAR ?? process.cwd();

function bacaJson<T>(path: string): T {
	return JSON.parse(readFileSync(path, 'utf8')) as T;
}

export function muatDunia(akar = AKAR): DataDunia {
	const d = join(akar, 'data');
	return {
		karakter: bacaJson<{ tersangka: DataDunia['karakter'] }>(join(d, 'karakter.json')).tersangka,
		barang: bacaJson<{ barang: DataDunia['barang'] }>(join(d, 'barang.json')).barang,
		lokasi: bacaJson<{ lokasi: DataDunia['lokasi'] }>(join(d, 'lokasi.json')).lokasi,
		motif: bacaJson<{ motif: DataDunia['motif'] }>(join(d, 'motif.json')).motif,
		ruangan: bacaJson<{ ruangan: DataDunia['ruangan'] }>(join(d, 'ruangan.json')).ruangan
	};
}

export function muatSemuaKasus(akar = AKAR): { file: string; kasus: KasusFile }[] {
	const d = join(akar, 'kasus');
	return readdirSync(d)
		.filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
		.sort()
		.map((f) => ({ file: f, kasus: bacaJson<KasusFile>(join(d, f)) }));
}
