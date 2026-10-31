// Membuat draf kasus yang lolos solver ke folder draf/ (tidak dibaca server).
// Pemakaian: npm run buat-draf -- <tanggal> <jenis> [seed] [id]
//   contoh: npm run buat-draf -- 2026-11-14 pencurian 7
// Setelah menulis ulang semua teks bertanda [DRAF], pindahkan file ke kasus/ lalu jalankan npm run cek-kasus.

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buatDraf } from '../src/lib/engine/generator';
import type { JenisKasus } from '../src/lib/engine/types';
import { apakahTanggalValid, namaHari } from '../src/lib/engine/waktu';
import { muatDunia, muatSemuaKasus } from '../src/lib/server/data';

const [tanggal, jenis, seed, id] = process.argv.slice(2);
const JENIS = ['pencurian', 'kehilangan', 'sabotase', 'kejahilan', 'pecah_rusak'];
if (!tanggal || !apakahTanggalValid(tanggal) || !JENIS.includes(jenis)) {
	console.error(`Pemakaian: npm run buat-draf -- <YYYY-MM-DD> <${JENIS.join('|')}> [seed] [id]`);
	process.exit(1);
}

const kasusAda = muatSemuaKasus().map((k) => k.kasus);
const idBaru = id ? Number(id) : Math.max(0, ...kasusAda.map((k) => k.id)) + 1;
const { kasus, laporan, percobaan } = buatDraf(muatDunia(), {
	tanggal,
	id: idBaru,
	jenis: jenis as JenisKasus,
	seed: seed ? Number(seed) : undefined
});

mkdirSync('draf', { recursive: true });
const path = join('draf', `${tanggal}.json`);
if (existsSync(path)) {
	console.error(`${path} sudah ada; hapus dulu kalau ingin membuat ulang.`);
	process.exit(1);
}
writeFileSync(path, JSON.stringify(kasus, null, 2) + '\n');

console.log(`Draf #${idBaru} · ${namaHari(tanggal)} · ${'★'.repeat(kasus.kesulitan.bintang)} · ${jenis} → ${path} (${percobaan} percobaan)`);
console.log(`  solusi: ${Object.values(kasus.solusi).join(' + ')}`);
console.log(`  sisa setelah clue awal: ${laporan.sisaSetelahClueAwal} · bukti minimum: ${laporan.buktiMinimum} · jalur: ${laporan.jalur.length}`);
for (const t of laporan.catatanTarget) console.log(`  ~ ${t}`);
console.log('Langkah berikutnya: tulis ulang semua teks [DRAF], tambah clue pendukung & state ruangan, lalu pindahkan ke kasus/.');
