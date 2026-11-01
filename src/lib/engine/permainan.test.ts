import { describe, expect, it } from 'vitest';
import bolu from '../../../tests/fixtures/bolu-pandan.json';
import { muatDunia } from '../server/data';
import {
	bukaJawaban,
	GalatPermainan,
	gelar,
	hasilAkhir,
	type HasilAkhir,
	hitungStatistik,
	kasusPublik,
	periksa,
	semuaBendaIds,
	sesiBaru,
	teksShare,
	tuduh,
	ulangi
} from './permainan';
import type { KasusFile, Sesi } from './types';
import { rilisBerikutnya, tanggalKasusAktif } from './waktu';

const dunia = muatDunia();
const kasus = bolu as unknown as KasusFile;
const benda = semuaBendaIds(dunia);
const t0 = new Date('2026-11-02T00:00:00Z');

function kodeGalat(f: () => unknown): string | undefined {
	try {
		f();
	} catch (e) {
		if (e instanceof GalatPermainan) return e.kode;
		throw e;
	}
}

describe('data publik', () => {
	it('tidak membocorkan solusi, logika, penjelasan, atau isi benda', () => {
		const pub = JSON.stringify(kasusPublik(kasus, dunia));
		expect(pub).not.toContain('pisau roti di dudukan'); // teks clue B3
		expect(pub).not.toContain('"solusi"');
		expect(pub).not.toContain('"logika"');
		expect(pub).not.toContain('komentar_nenek');
		expect(pub).not.toContain('Wati, Wati');
	});
});

describe('periksa', () => {
	it('mengurangi jatah untuk benda baru, gratis untuk benda yang sama', () => {
		let s = sesiBaru('p1', kasus, t0);
		const r1 = periksa(kasus, s, 'tk_meja', benda);
		expect(r1.bukti).toMatchObject({ hasil: 'clue', nomor: 1 });
		expect(r1.sisa_jatah).toBe(9);
		s = r1.sesi;
		const r2 = periksa(kasus, s, 'tk_meja', benda);
		expect(r2.sisa_jatah).toBe(9);
		const r3 = periksa(kasus, r2.sesi, 'rt_jam', benda);
		expect(r3.bukti).toMatchObject({ hasil: 'kosong', nomor: null, teks: kasus.teks_kosong_bawaan });
		const r4 = periksa(kasus, r3.sesi, 'tk_pot', benda);
		// Clue pendukung tampil sama dengan clue biasa
		expect(r4.bukti).toMatchObject({ hasil: 'clue', nomor: 2 });
	});

	it('menolak saat jatah habis dan benda tidak dikenal', () => {
		let s: Sesi = { ...sesiBaru('p1', kasus, t0), periksa: [...benda].slice(0, 10) };
		expect(kodeGalat(() => periksa(kasus, s, [...benda][20], benda))).toBe('jatah_habis');
		expect(kodeGalat(() => periksa(kasus, s, 'tidak_ada', benda))).toBe('benda_tidak_dikenal');
		// memeriksa ulang tetap boleh
		s = periksa(kasus, s, [...benda][0], benda).sesi;
		expect(s.periksa).toHaveLength(10);
	});
});

describe('tuduh', () => {
	const salah = { siapa: 'dimas', pakai: 'sendok', dimana: 'teras' };
	const benar = { siapa: 'wati', pakai: 'pisau_roti', dimana: 'teras' };

	it('memberi jumlah benar tanpa solusi sebelum selesai, dan solusi saat menang', () => {
		const s = sesiBaru('p1', kasus, t0);
		const r1 = tuduh(kasus, s, salah, t0);
		expect(r1.hasil).toEqual({ benar: 1, dari: 3, tuduhan_ke: 1, selesai: false, akhir: undefined });
		const r2 = tuduh(kasus, r1.sesi, benar, new Date(t0.getTime() + 402_000));
		expect(r2.hasil.selesai).toBe(true);
		expect(r2.hasil.akhir?.menang).toBe(true);
		expect(r2.hasil.akhir?.gelar).toBe('Detektif Tekun');
		expect(r2.hasil.akhir?.durasi_detik).toBe(402);
		expect(r2.sesi.status).toBe('menang');
		expect(kodeGalat(() => tuduh(kasus, r2.sesi, salah, t0))).toBe('kasus_selesai');
	});

	it('menolak kombinasi ganda dan pilihan di luar daftar', () => {
		const s = tuduh(kasus, sesiBaru('p1', kasus, t0), salah, t0).sesi;
		expect(kodeGalat(() => tuduh(kasus, s, salah, t0))).toBe('tuduhan_ganda');
		expect(kodeGalat(() => tuduh(kasus, s, { ...salah, siapa: 'benny' }, t0))).toBe('pilihan_tidak_valid');
	});

	it('dengan motif, menang hanya kalau 4 dari 4 tepat dan field asing dibuang', () => {
		const km = {
			...kasus,
			pilihan: { ...kasus.pilihan, kenapa: ['iseng', 'iri', 'utang'] },
			solusi: { ...kasus.solusi, kenapa: 'iseng' }
		} as KasusFile;
		const s = sesiBaru('p1', km, t0);
		const r1 = tuduh(km, s, { ...benar, kenapa: 'iri' }, t0);
		expect(r1.hasil).toMatchObject({ benar: 3, dari: 4, selesai: false });
		expect(kodeGalat(() => tuduh(km, r1.sesi, benar, t0))).toBe('pilihan_tidak_valid');
		const r2 = tuduh(km, r1.sesi, { ...benar, kenapa: 'iseng' }, t0);
		expect(r2.hasil.akhir?.menang).toBe(true);
		// tuduhan 3 kategori tidak boleh membawa kenapa liar
		const r3 = tuduh(kasus, sesiBaru('p1', kasus, t0), { ...benar, kenapa: 'x' }, t0);
		expect(r3.sesi.tuduhan[0]).toEqual({ ...benar, benar: 3 });
	});

	it('kalah setelah 3 tuduhan salah', () => {
		let s = sesiBaru('p1', kasus, t0);
		for (const dimana of ['dapur', 'teras', 'ruang_kerja']) s = tuduh(kasus, s, { ...salah, dimana }, t0).sesi;
		expect(s.status).toBe('kalah');
	});
});

describe('mengulang kasus', () => {
	const salah = { siapa: 'dimas', pakai: 'sendok', dimana: 'teras' };
	const benar = { siapa: 'wati', pakai: 'pisau_roti', dimana: 'teras' };
	const t1 = new Date(t0.getTime() + 600_000);

	function gagal(): { sesi: Sesi; akhir: HasilAkhir } {
		let s = periksa(kasus, sesiBaru('p1', kasus, t0), [...benda][0], benda).sesi;
		let r;
		for (const dimana of ['dapur', 'teras', 'ruang_kerja']) {
			r = tuduh(kasus, s, { ...salah, dimana }, t0);
			s = r.sesi;
		}
		return { sesi: s, akhir: r!.hasil.akhir! };
	}

	it('gagal tidak mengirim jawaban, dan menawarkan ulang', () => {
		const { akhir } = gagal();
		expect(akhir.menang).toBe(false);
		expect(akhir.jawaban).toBeNull();
		expect(akhir.bisa_ulang).toBe(true);
		expect(JSON.stringify(akhir)).not.toContain('wati');
		expect(JSON.stringify(akhir)).not.toContain(kasus.komentar_nenek);
	});

	it('ulangi mengosongkan jatah & tuduhan, menyimpan percobaan pertama', () => {
		const s = ulangi(gagal().sesi, t1);
		expect(s).toMatchObject({ status: 'berjalan', periksa: [], tuduhan: [], percobaan: 2, selesai_at: null });
		expect(s.pertama?.status).toBe('kalah');
		expect(s.pertama?.tuduhan).toHaveLength(3);
		expect(kodeGalat(() => ulangi(s, t1))).toBe('tidak_bisa_ulang');

		const r = tuduh(kasus, s, benar, new Date(t1.getTime() + 90_000));
		const akhir = r.hasil.akhir!;
		expect(akhir.menang).toBe(true);
		expect(akhir.jawaban?.solusi).toEqual(kasus.solusi);
		expect(akhir.kode_gelar).toBe('pantang_menyerah');
		expect(akhir.durasi_detik).toBe(90);
		expect(akhir.pertama).toMatchObject({ menang: false, tuduhan_benar: [false, false, false] });
		expect(akhir.pertama?.periksa).toHaveLength(1);
		// percobaan pertama yang ulang kedua kalinya tetap disimpan apa adanya
		let s2 = s;
		for (const dimana of ['dapur', 'teras', 'ruang_kerja']) s2 = tuduh(kasus, s2, { ...salah, dimana }, t1).sesi;
		expect(ulangi(s2, t1)).toMatchObject({ percobaan: 3, pertama: s.pertama });
	});

	it('membuka jawaban menutup kesempatan mengulang', () => {
		const s = bukaJawaban(gagal().sesi);
		const akhir = hasilAkhir(kasus, s);
		expect(akhir.jawaban?.solusi).toEqual(kasus.solusi);
		expect(akhir.bisa_ulang).toBe(false);
		expect(kodeGalat(() => ulangi(s, t1))).toBe('tidak_bisa_ulang');
		expect(kodeGalat(() => bukaJawaban(sesiBaru('p1', kasus, t0)))).toBe('kasus_selesai');
	});

	it('statistik memakai percobaan pertama, termasuk saat ulangan sedang berjalan atau menang', () => {
		const ulang = ulangi(gagal().sesi, t1);
		const menangUlang = tuduh(kasus, ulang, benar, t1).sesi;
		for (const s of [ulang, menangUlang]) {
			const st = hitungStatistik([s], [kasus.tanggal], kasus.tanggal);
			expect(st).toMatchObject({ dimainkan: 1, menang: 0, streak: 0 });
			expect(st.distribusi.gagal).toBe(1);
		}
	});
});

describe('gelar', () => {
	it('mengikuti tabel GDD', () => {
		expect(gelar(true, 1, 5)).toBe('Detektif Legendaris');
		expect(gelar(true, 1, 6)).toBe('Detektif Ulung');
		expect(gelar(true, 2, 3)).toBe('Detektif Tekun');
		expect(gelar(true, 3, 3)).toBe('Detektif Beruntung');
		expect(gelar(false, 3, 3)).toBe('Kasus Ditutup');
	});
});

describe('statistik dan streak', () => {
	const tanggal = ['2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05'];
	const sesi = (t: string, status: Sesi['status'], n = 1): Sesi => ({
		pemain_id: 'p', kasus_id: 1, tanggal: t, periksa: ['a', 'b'], status,
		tuduhan: Array.from({ length: n }, () => ({ siapa: 'a', pakai: 'b', dimana: 'c', benar: 0 })),
		mulai_at: '', selesai_at: ''
	});

	it('streak berlanjut kalau kasus hari ini belum selesai', () => {
		const st = hitungStatistik([sesi('2026-11-03', 'menang'), sesi('2026-11-04', 'menang', 2)], tanggal, '2026-11-05');
		expect(st.streak).toBe(2);
		expect(st.distribusi).toEqual({ 1: 1, 2: 1, 3: 0, gagal: 0 });
	});

	it('streak putus kalau gagal atau tidak main', () => {
		expect(hitungStatistik([sesi('2026-11-02', 'menang'), sesi('2026-11-04', 'menang')], tanggal, '2026-11-05').streak).toBe(1);
		const st = hitungStatistik([sesi('2026-11-02', 'menang'), sesi('2026-11-03', 'menang'), sesi('2026-11-04', 'kalah', 3)], tanggal, '2026-11-04');
		expect(st.streak).toBe(0);
		expect(st.streak_terpanjang).toBe(2);
		expect(st.persen_menang).toBe(67);
	});
});

describe('waktu rilis WIB', () => {
	it('berganti kasus tepat pukul 06.00 WIB', () => {
		expect(tanggalKasusAktif(new Date('2026-11-01T22:59:59Z'))).toBe('2026-11-01'); // 05.59 WIB
		expect(tanggalKasusAktif(new Date('2026-11-01T23:00:00Z'))).toBe('2026-11-02'); // 06.00 WIB
		expect(rilisBerikutnya('2026-11-02').toISOString()).toBe('2026-11-02T23:00:00.000Z');
	});
});

describe('teks share', () => {
	it('mengikuti format GDD tanpa spoiler', () => {
		const t = teksShare({
			id: 128, bintang: 2, jatah: 10,
			periksa: [true, true, false, true, true, false, true],
			tuduhanBenar: [false, true], maksTuduhan: 3, menang: true,
			durasiDetik: 402, streak: 12, situs: 'dailytective.com'
		});
		expect(t).toBe(
			'Dailytective #128 🔎 ★★☆\n🟨🟨⬛🟨🟨⬛🟨⬜⬜⬜  7 periksa\n🟥🟩⬜  tebakan ke-2\n⏱ 6:42 · 🔥 12\ndailytective.com'
		);
	});
});
