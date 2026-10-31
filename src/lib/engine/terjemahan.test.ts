import { describe, expect, it } from 'vitest';
import { bahasaDariHeader, terjemah } from '../i18n';
import { KAMUS } from '../i18n/kamus';
import { muatDunia, muatSemuaKasus } from '../server/data';
import { kasusPublik, teksShare } from './permainan';
import { analisis, petaKarakter } from './solver';
import { duniaDalam, kasusDalam, terjemahanKurang } from './terjemahan';

const dunia = muatDunia();
const semua = muatSemuaKasus().map((k) => k.kasus);

describe('terjemahan kasus', () => {
	it.each(semua.map((k) => [k.tanggal, k] as const))('%s lengkap dalam bahasa Inggris', (_, kasus) => {
		expect(terjemahanKurang(kasus, 'en')).toEqual([]);
	});

	it('mengganti teks tanpa mengubah logika, solusi, atau hasil solver', () => {
		const kar = petaKarakter(dunia.karakter);
		for (const kasus of semua) {
			const en = kasusDalam(kasus, 'en');
			expect(en.judul).not.toBe(kasus.judul);
			expect(en.solusi).toEqual(kasus.solusi);
			expect(en.logika).toEqual(kasus.logika);
			expect(Object.keys(en.benda)).toEqual(Object.keys(kasus.benda));
			expect(analisis(en, kar).jalur).toEqual(analisis(kasus, kar).jalur);
		}
	});

	it('bahasa Indonesia mengembalikan kasus apa adanya', () => {
		expect(kasusDalam(semua[0], 'id')).toBe(semua[0]);
	});

	it('data publik berbahasa Inggris tetap tidak membocorkan isi benda atau solusi', () => {
		const kasus = semua.find((k) => k.tanggal === '2026-11-02')!;
		const pub = JSON.stringify(kasusPublik(kasusDalam(kasus, 'en'), duniaDalam(dunia, 'en')));
		expect(pub).toContain('The Missing Jar of Pineapple Tarts');
		expect(pub).toContain('Housekeeper'); // peran Mbok Sri dalam bahasa Inggris
		expect(pub).not.toContain('batik shopping bag'); // teks clue B8
		expect(pub).not.toContain('"solusi"');
		expect(pub).not.toContain('terjemahan');
	});
});

describe('terjemahan data dunia', () => {
	it('semua tokoh, barang, lokasi, motif, ruangan, dan benda punya nama Inggris', () => {
		const en = duniaDalam(dunia, 'en');
		expect(dunia.karakter.every((k) => k.en)).toBe(true);
		expect(dunia.barang.every((b) => b.nama_en)).toBe(true);
		expect(dunia.lokasi.every((l) => l.nama_en)).toBe(true);
		expect(dunia.motif.every((m) => m.nama_en)).toBe(true);
		expect(dunia.ruangan.flatMap((r) => [r, ...r.benda]).every((x) => x.nama_en)).toBe(true);
		expect(en.karakter.find((k) => k.id === 'benny')?.nama).toBe('Uncle Benny');
		// atribut logika tidak berubah
		expect(en.karakter.find((k) => k.id === 'benny')?.atribut.tangan).toBe('kidal');
	});
});

describe('kamus UI', () => {
	it('bahasa Inggris punya semua kunci, tanpa sisa teks kosong', () => {
		expect(Object.keys(KAMUS.en).sort()).toEqual(Object.keys(KAMUS.id).sort());
		expect(Object.values(KAMUS.en).every((s) => s.trim().length > 0)).toBe(true);
	});

	it('mengganti parameter dan memilih bahasa dari header browser', () => {
		expect(terjemah('en', 'umum.kasus_no', { id: 7 })).toBe('Case #7');
		expect(terjemah('id', 'umum.kasus_no', { id: 7 })).toBe('Kasus #7');
		expect(bahasaDariHeader('id-ID,id;q=0.9,en;q=0.8')).toBe('id');
		expect(bahasaDariHeader('en-US,en;q=0.9')).toBe('en');
		expect(bahasaDariHeader('ja-JP')).toBe('en');
		expect(bahasaDariHeader(null)).toBe('id');
	});

	it('teks share memakai label bahasa pemain', () => {
		const t = teksShare({
			id: 2, bintang: 1, jatah: 10, periksa: [true, false], tuduhanBenar: [false, true], maksTuduhan: 3,
			menang: true, durasiDetik: 65, streak: 3, situs: 'dailytective.com',
			label: { periksa: (n) => `${n} checks`, tebakan: (n) => `guess #${n}`, ditutup: 'case closed' }
		});
		expect(t).toContain('2 checks');
		expect(t).toContain('guess #2');
	});
});
