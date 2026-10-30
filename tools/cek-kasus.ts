// Cek semua kasus di folder kasus/: validator skema + solver S1–S6.
// Pemakaian: npm run cek-kasus            (semua kasus)
//            npm run cek-kasus -- 2026-11-02 (satu kasus, dengan rincian jalur)
// Keluar dengan kode 1 kalau ada kasus yang gagal, supaya bisa dipakai di CI.

import { analisis, petaKarakter } from '../src/lib/engine/solver';
import { validasiKasus, validasiKoleksi } from '../src/lib/engine/validator';
import { muatDunia, muatSemuaKasus } from '../src/lib/server/data';

const filter = process.argv[2];
const dunia = muatDunia();
const kar = petaKarakter(dunia.karakter);
const semua = muatSemuaKasus();
const dipilih = filter ? semua.filter((k) => k.file.startsWith(filter)) : semua;

let gagal = 0;

for (const g of validasiKoleksi(semua.map((k) => k.kasus))) {
	console.log(`✗ koleksi: ${g}`);
	gagal++;
}

for (const { file, kasus } of dipilih) {
	const v = validasiKasus(kasus, dunia);
	console.log(`\n━━ ${file} · #${kasus.id} · ${'★'.repeat(kasus.kesulitan.bintang)} · ${kasus.judul}`);
	for (const g of v.galat) console.log(`  ✗ ${g}`);
	for (const p of v.peringatan) console.log(`  ! ${p}`);
	if (v.galat.length) {
		console.log('  → validator gagal, solver dilewati');
		gagal++;
		continue;
	}
	const lap = analisis(kasus, kar);
	for (const [kode, c] of Object.entries(lap.cek)) console.log(`  ${c.lolos ? '✓' : '✗'} ${kode} ${c.pesan}`);
	for (const t of lap.catatanTarget) console.log(`  ~ target: ${t}`);
	if (filter || !lap.lolos) {
		console.log(`  jalur bukti minimal:`);
		for (const j of lap.jalur) console.log(`    · ${j.join(' + ')}`);
		if (lap.sisaSetelahSemua.length > 1)
			for (const k of lap.sisaSetelahSemua) console.log(`    sisa: ${k.siapa} + ${k.pakai} + ${k.dimana}`);
	}
	if (!lap.lolos) gagal++;
}

console.log(`\n${dipilih.length - gagal}/${dipilih.length} kasus lolos`);
process.exit(gagal ? 1 : 0);
