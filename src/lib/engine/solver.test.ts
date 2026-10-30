import { describe, expect, it } from 'vitest';
import bolu from '../../../tests/fixtures/bolu-pandan.json';
import { muatDunia } from '../server/data';
import { analisis, evaluasi, hitungBenar, petaKarakter, saring, semuaKombinasi } from './solver';
import type { KasusFile, Logika } from './types';
import { validasiKasus } from './validator';

const dunia = muatDunia();
const kar = petaKarakter(dunia.karakter);
const kasus = bolu as unknown as KasusFile;

describe('solver: contoh "Bolu Pandan yang Dicuil" (dokumen 04 bagian 5)', () => {
	const lap = analisis(kasus, kar);

	it('menyisakan 9 kombinasi setelah clue awal', () => {
		expect(lap.totalKombinasi).toBe(27);
		expect(lap.sisaSetelahClueAwal).toBe(9);
	});

	it('menghasilkan solusi tunggal Bu Wati + pisau roti + Teras (S1)', () => {
		expect(lap.sisaSetelahSemua).toEqual([{ siapa: 'wati', pakai: 'pisau_roti', dimana: 'teras' }]);
		expect(lap.cek.S1.lolos).toBe(true);
	});

	it('menemukan 4 jalur bukti minimal persis seperti dokumen (S3, S4)', () => {
		expect(lap.buktiMinimum).toBe(2);
		const jalur = lap.jalur.map((j) => [...j].sort().join('+')).sort();
		expect(jalur).toEqual(['B1+B2', 'B1+B3', 'B2+B7+B8', 'B3+B7+B8']);
	});

	it('tidak ada clue tunggal yang langsung menjawab, dan semua cek lolos', () => {
		expect(lap.clueTunggalMenjawab).toEqual([]);
		expect(lap.lolos).toBe(true);
	});

	it('lolos validator skema', () => {
		const v = validasiKasus(kasus, dunia);
		// Bolu Pandan memakai benda di Teras/Dapur/Ruang Kerja yang belum digambar: itu peringatan, bukan galat.
		expect(v.galat).toEqual([]);
	});
});

describe('solver: tipe clue', () => {
	const pilihan = { siapa: ['benny', 'sekar', 'joko'], pakai: ['obeng', 'sapu'], dimana: ['dapur', 'teras'] };
	const semua = semuaKombinasi(pilihan);
	const jumlah = (l: Logika) => saring(semua, [l], kar).length;

	it('atribut dan atribut_bukan', () => {
		expect(jumlah({ tipe: 'atribut', atribut: 'kacamata', nilai: true })).toBe(4); // Sekar
		expect(jumlah({ tipe: 'atribut_bukan', atribut: 'kacamata', nilai: true })).toBe(8);
		expect(jumlah({ tipe: 'atribut', atribut: 'sepatu', nilai: 42, op: '<' })).toBe(8); // Sekar 37, Joko 41
		expect(jumlah({ tipe: 'atribut', atribut: 'ciri', nilai: 'merokok_kretek' })).toBe(4); // Benny
	});

	it('fakta dan bukan', () => {
		expect(jumlah({ tipe: 'fakta', dimana: 'teras' })).toBe(6);
		expect(jumlah({ tipe: 'bukan', pakai: 'sapu' })).toBe(6);
	});

	it('jika_maka dengan atribut, negasi, dan beberapa akibat', () => {
		// Orang bertubuh tinggi tidak memakai sapu
		const l: Logika = { tipe: 'jika_maka', jika: { atribut: { tinggi: 'tinggi' } }, maka: { bukan: { pakai: 'sapu' } } };
		expect(evaluasi(l, { siapa: 'benny', pakai: 'sapu', dimana: 'dapur' }, kar)).toBe(false);
		expect(evaluasi(l, { siapa: 'sekar', pakai: 'sapu', dimana: 'dapur' }, kar)).toBe(true);
		const dua: Logika = { tipe: 'jika_maka', jika: { siapa: 'joko' }, maka: [{ pakai: 'sapu' }, { dimana: 'teras' }] };
		expect(jumlah(dua)).toBe(9); // Joko hanya sapu+teras
	});

	it('hitungBenar memberi jumlah bagian yang tepat', () => {
		const sol = { siapa: 'wati', pakai: 'pisau_roti', dimana: 'teras' };
		expect(hitungBenar({ siapa: 'wati', pakai: 'sendok', dimana: 'teras' }, sol)).toBe(2);
		expect(hitungBenar({ siapa: 'dimas', pakai: 'sendok', dimana: 'dapur' }, sol)).toBe(0);
	});
});
