import { describe, expect, it } from 'vitest';
import bolu from '../../../tests/fixtures/bolu-pandan.json';
import { muatDunia } from '../server/data';
import {
	analisis,
	evaluasi,
	hitungBenar,
	petaKarakter,
	saring,
	saringLogika,
	semuaKombinasi,
	syaratPengakuan
} from './solver';
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
	const jumlah = (l: Logika) => saringLogika(semua, [l], kar).length;

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

	it('atribut_kombinasi: "orang setinggi itu tidak mungkin memakai X"', () => {
		const l: Logika = { tipe: 'jika_maka', jika: { atribut: { tinggi: 'tinggi' } }, maka: { bukan: { pakai: 'obeng' } } };
		// Benny tinggi: obeng gugur (2 kombinasi); Sekar & Joko tidak terpengaruh
		expect(jumlah(l)).toBe(10);
	});

	it('hitungBenar memberi jumlah bagian yang tepat', () => {
		const sol = { siapa: 'wati', pakai: 'pisau_roti', dimana: 'teras' };
		expect(hitungBenar({ siapa: 'wati', pakai: 'sendok', dimana: 'teras' }, sol)).toBe(2);
		expect(hitungBenar({ siapa: 'dimas', pakai: 'sendok', dimana: 'dapur' }, sol)).toBe(0);
	});
});

describe('solver: kategori motif (Minggu)', () => {
	it('menambah dimensi ke-4 dan feedback dari 4', () => {
		const pilihan = { siapa: ['benny', 'lia'], pakai: ['obeng'], dimana: ['dapur', 'teras'], kenapa: ['utang', 'iri', 'iseng'] };
		expect(semuaKombinasi(pilihan)).toHaveLength(12);
		const sol = { siapa: 'benny', pakai: 'obeng', dimana: 'dapur', kenapa: 'utang' };
		expect(hitungBenar({ ...sol, kenapa: 'iri' }, sol)).toBe(3);
		expect(hitungBenar(sol, sol)).toBe(4);
		const l: Logika = { tipe: 'jika_maka', jika: { siapa: 'lia' }, maka: { kenapa: 'iri' } };
		expect(saringLogika(semuaKombinasi(pilihan), [l], kar)).toHaveLength(8);
	});
});

describe('solver: tersangka berbohong (contoh dokumen 04 bagian 6)', () => {
	const kasusBohong = {
		pilihan: {
			siapa: ['benny', 'lia', 'raka', 'sri'],
			pakai: ['kunci_cadangan', 'obeng', 'sendok', 'garpu'],
			dimana: ['kamar_nenek', 'ruang_tamu', 'ruang_kerja', 'dapur']
		},
		pengakuan: [
			{ id: 'P1', oleh: 'benny', teks: 'Aku tidak menyentuh kunci cadangan.' },
			{ id: 'P2', oleh: 'lia', teks: 'Aku di Ruang Tamu terus, tidak ke Kamar Nenek.' },
			{ id: 'P3', oleh: 'raka', teks: 'Aku tidak pernah masuk Ruang Kerja.' },
			{ id: 'P4', oleh: 'sri', teks: 'Sendok dan garpu semua masih di dapur.' }
		],
		logika: {
			P1: { tipe: 'bukan', pakai: 'kunci_cadangan' },
			P2: { tipe: 'jika_maka', jika: { siapa: 'lia' }, maka: { bukan: { dimana: 'kamar_nenek' } } },
			P3: { tipe: 'jika_maka', jika: { siapa: 'raka' }, maka: { bukan: { dimana: 'ruang_kerja' } } },
			P4: { tipe: 'jika_maka', jika: {}, maka: [{ bukan: { pakai: 'sendok' } }, { bukan: { pakai: 'garpu' } }] }
		}
	} as unknown as KasusFile;

	it('pengakuan pelaku salah, pengakuan lain benar', () => {
		const sisa = saring(semuaKombinasi(kasusBohong.pilihan), [syaratPengakuan(kasusBohong, kar)!]);
		const per = (s: string) => sisa.filter((k) => k.siapa === s);
		// Benny bohong -> ia memakai kunci cadangan, di mana saja
		expect(per('benny')).toHaveLength(4);
		expect(per('benny').every((k) => k.pakai === 'kunci_cadangan')).toBe(true);
		// Lia bohong -> Kamar Nenek; yang lain jujur -> bukan kunci, bukan sendok/garpu -> obeng
		expect(per('lia')).toEqual([{ siapa: 'lia', pakai: 'obeng', dimana: 'kamar_nenek' }]);
		expect(per('raka')).toEqual([{ siapa: 'raka', pakai: 'obeng', dimana: 'ruang_kerja' }]);
		// Mbok Sri bohong -> sendok atau garpu
		expect(per('sri')).toHaveLength(8);
		expect(sisa).toHaveLength(14);
	});
});
