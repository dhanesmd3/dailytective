// Data dunia dan kasus yang dimasukkan ke bundle server saat build (import.meta.glob), supaya server
// serverless seperti Vercel tidak perlu membaca folder proyek saat runtime. Modul ini ada di $lib/server,
// jadi SvelteKit menolak kalau ada kode klien yang mengimpornya: isi kasus tidak pernah sampai ke browser.
// Saat dev, Vite memantau pola glob ini, jadi kasus yang diedit atau ditambah langsung terbaca.

import type { DataDunia, KasusFile } from '../engine/types';
import { POLA_FILE_KASUS, rakitDunia } from './data';

const fileData = import.meta.glob('/data/*.json', { eager: true, import: 'default' });
const fileKasus = import.meta.glob<KasusFile>('/kasus/*.json', { eager: true, import: 'default' });

export function duniaBundel(): DataDunia {
	return rakitDunia((nama) => {
		const isi = fileData[`/data/${nama}.json`];
		if (!isi) throw new Error(`data/${nama}.json tidak ditemukan`);
		return isi;
	});
}

export function kasusBundel(): KasusFile[] {
	return Object.entries(fileKasus)
		.filter(([path]) => POLA_FILE_KASUS.test(path.slice('/kasus/'.length)))
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([, kasus]) => kasus);
}
