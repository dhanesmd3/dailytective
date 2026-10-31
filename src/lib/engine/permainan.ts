// Aturan main (dokumen 02). Fungsi murni: menerima kasus + sesi, mengembalikan sesi baru dan respons.
// Server memanggil fungsi ini lalu menyimpan sesinya.

import { hitungBenar, kategoriDari, samaKombinasi } from './solver';
import type { DataDunia, KasusFile, Kategori, Kombinasi, Penjelasan, Sesi, StateRuangan, Tuduhan } from './types';

export const MAKS_TUDUHAN = 3;

// --- Data publik ---

export interface PilihanTampil {
	siapa: { id: string; nama: string; peran: string; atribut: Record<string, unknown>; kebiasaan: string }[];
	pakai: { id: string; nama: string }[];
	dimana: { id: string; nama: string }[];
	kenapa?: { id: string; nama: string }[];
}

export interface KasusPublik {
	id: number;
	tanggal: string;
	judul: string;
	jenis: string;
	kesulitan: { bintang: number; label: string };
	jatah_periksa: number;
	maks_tuduhan: number;
	/** Kategori tuduhan kasus ini: 3, atau 4 kalau ada motif. */
	kategori: Kategori[];
	context_card: KasusFile['context_card'];
	pilihan: PilihanTampil;
	/** Pernyataan tersangka di hari berbohong. Teks saja; logikanya tetap di server. */
	pengakuan: { id: string; oleh: string; teks: string }[];
	state_ruangan: Record<string, StateRuangan>;
	ruangan: { id: string; nama: string; ilustrasi: boolean; benda: { id: string; nama: string; posisi?: unknown }[] }[];
}

/** Bagian kasus yang boleh dikirim di awal. TIDAK berisi isi benda, logika, maupun solusi. */
export function kasusPublik(kasus: KasusFile, dunia: DataDunia): KasusPublik {
	const kar = new Map(dunia.karakter.map((k) => [k.id, k]));
	const bar = new Map(dunia.barang.map((b) => [b.id, b]));
	const lok = new Map(dunia.lokasi.map((l) => [l.id, l]));
	const mot = new Map(dunia.motif.map((m) => [m.id, m]));
	return {
		id: kasus.id,
		tanggal: kasus.tanggal,
		judul: kasus.judul,
		jenis: kasus.jenis,
		kesulitan: kasus.kesulitan,
		jatah_periksa: kasus.jatah_periksa,
		maks_tuduhan: MAKS_TUDUHAN,
		kategori: kategoriDari(kasus.pilihan),
		context_card: kasus.context_card,
		pengakuan: (kasus.pengakuan ?? []).map((p) => ({ id: p.id, oleh: p.oleh, teks: p.teks })),
		pilihan: {
			siapa: kasus.pilihan.siapa.map((id) => {
				const k = kar.get(id)!;
				return { id, nama: k.nama, peran: k.peran, atribut: { ...k.atribut }, kebiasaan: k.kebiasaan };
			}),
			pakai: kasus.pilihan.pakai.map((id) => ({ id, nama: bar.get(id)!.nama })),
			dimana: kasus.pilihan.dimana.map((id) => ({ id, nama: lok.get(id)!.nama })),
			kenapa: kasus.pilihan.kenapa?.map((id) => ({ id, nama: mot.get(id)!.nama }))
		},
		state_ruangan: kasus.state_ruangan,
		ruangan: dunia.ruangan.map((r) => ({ id: r.id, nama: r.nama, ilustrasi: r.ilustrasi, benda: r.benda }))
	};
}

// --- Sesi ---

export function sesiBaru(pemainId: string, kasus: KasusFile, sekarang: Date): Sesi {
	return {
		pemain_id: pemainId,
		kasus_id: kasus.id,
		tanggal: kasus.tanggal,
		periksa: [],
		tuduhan: [],
		status: 'berjalan',
		mulai_at: sekarang.toISOString(),
		selesai_at: null
	};
}

export interface BuktiDitemukan {
	benda: string;
	hasil: 'clue' | 'kosong';
	/** Nomor urut bukti (1, 2, ...) kalau berisi clue. */
	nomor: number | null;
	teks: string;
}

/** Apa yang dilihat pemain saat memeriksa benda. Clue "pendukung" tampil sama persis dengan clue biasa. */
export function lihatBenda(kasus: KasusFile, sesi: Sesi, bendaId: string): BuktiDitemukan {
	const isi = kasus.benda[bendaId];
	if (!isi || isi.hasil === 'kosong') {
		return { benda: bendaId, hasil: 'kosong', nomor: null, teks: isi?.teks ?? kasus.teks_kosong_bawaan };
	}
	const berisi = sesi.periksa.filter((b) => {
		const i = kasus.benda[b];
		return i && i.hasil !== 'kosong';
	});
	const idx = berisi.indexOf(bendaId);
	return { benda: bendaId, hasil: 'clue', nomor: idx === -1 ? null : idx + 1, teks: isi.teks };
}

export type GalatMain =
	| 'jatah_habis'
	| 'benda_tidak_dikenal'
	| 'kasus_selesai'
	| 'tuduhan_habis'
	| 'tuduhan_ganda'
	| 'pilihan_tidak_valid';

export class GalatPermainan extends Error {
	constructor(public kode: GalatMain) {
		super(kode);
	}
}

export function semuaBendaIds(dunia: DataDunia): Set<string> {
	return new Set(dunia.ruangan.flatMap((r) => r.benda.map((b) => b.id)));
}

export function periksa(
	kasus: KasusFile,
	sesi: Sesi,
	bendaId: string,
	bendaDikenal: Set<string>
): { sesi: Sesi; bukti: BuktiDitemukan; sisa_jatah: number } {
	if (!bendaDikenal.has(bendaId)) throw new GalatPermainan('benda_tidak_dikenal');
	let baru = sesi;
	if (!sesi.periksa.includes(bendaId)) {
		// Memeriksa benda baru butuh jatah; memeriksa ulang gratis, bahkan setelah kasus selesai.
		if (sesi.status !== 'berjalan') throw new GalatPermainan('kasus_selesai');
		if (sesi.periksa.length >= kasus.jatah_periksa) throw new GalatPermainan('jatah_habis');
		baru = { ...sesi, periksa: [...sesi.periksa, bendaId] };
	}
	return {
		sesi: baru,
		bukti: lihatBenda(kasus, baru, bendaId),
		sisa_jatah: kasus.jatah_periksa - baru.periksa.length
	};
}

export interface HasilAkhir {
	menang: boolean;
	solusi: Kombinasi;
	penjelasan: Penjelasan[];
	komentar_nenek: string;
	gelar: string;
	kode_gelar: KodeGelar;
	/** Semua clue di kasus ini, termasuk yang tidak ditemukan, untuk penjelasan di layar hasil. */
	semua_bukti: Record<string, { benda: string | null; teks: string }>;
	durasi_detik: number;
}

export interface HasilTuduh {
	benar: number;
	/** Jumlah kategori (3, atau 4 dengan motif). */
	dari: number;
	tuduhan_ke: number;
	selesai: boolean;
	akhir?: HasilAkhir;
}

export function tuduh(kasus: KasusFile, sesi: Sesi, k: Kombinasi, sekarang: Date): { sesi: Sesi; hasil: HasilTuduh } {
	if (sesi.status !== 'berjalan') throw new GalatPermainan('kasus_selesai');
	if (sesi.tuduhan.length >= MAKS_TUDUHAN) throw new GalatPermainan('tuduhan_habis');
	const kategori = kategoriDari(kasus.pilihan);
	const bersih: Partial<Kombinasi> = {};
	for (const kat of kategori) {
		const nilai = k[kat];
		if (typeof nilai !== 'string' || !kasus.pilihan[kat]!.includes(nilai)) throw new GalatPermainan('pilihan_tidak_valid');
		bersih[kat] = nilai;
	}
	const kombinasi = bersih as Kombinasi;
	if (sesi.tuduhan.some((t) => samaKombinasi(t, kombinasi))) throw new GalatPermainan('tuduhan_ganda');

	const benar = hitungBenar(kombinasi, kasus.solusi);
	const tuduhan: Tuduhan = { ...kombinasi, benar };
	const daftar = [...sesi.tuduhan, tuduhan];
	const menang = benar === kategori.length;
	const selesai = menang || daftar.length >= MAKS_TUDUHAN;
	const baru: Sesi = {
		...sesi,
		tuduhan: daftar,
		status: selesai ? (menang ? 'menang' : 'kalah') : 'berjalan',
		selesai_at: selesai ? sekarang.toISOString() : null
	};
	return {
		sesi: baru,
		hasil: {
			benar,
			dari: kategori.length,
			tuduhan_ke: daftar.length,
			selesai,
			akhir: selesai ? hasilAkhir(kasus, baru) : undefined
		}
	};
}

/** Isi layar hasil. Hanya boleh dipanggil untuk sesi yang sudah selesai. */
export function hasilAkhir(kasus: KasusFile, sesi: Sesi): HasilAkhir {
	if (sesi.status === 'berjalan') throw new Error('Sesi belum selesai');
	const semua_bukti: HasilAkhir['semua_bukti'] = {};
	for (const c of kasus.context_card.clue_awal) semua_bukti[c.id] = { benda: null, teks: c.teks };
	for (const p of kasus.pengakuan ?? []) semua_bukti[p.id] = { benda: null, teks: p.teks };
	for (const [benda, isi] of Object.entries(kasus.benda))
		if (isi.id_clue) semua_bukti[isi.id_clue] = { benda, teks: isi.teks };
	const menang = sesi.status === 'menang';
	return {
		menang,
		solusi: kasus.solusi,
		penjelasan: kasus.penjelasan,
		komentar_nenek: kasus.komentar_nenek,
		gelar: gelar(menang, sesi.tuduhan.length, sesi.periksa.length),
		kode_gelar: kodeGelar(menang, sesi.tuduhan.length, sesi.periksa.length),
		semua_bukti,
		durasi_detik: durasiDetik(sesi)
	};
}

export function durasiDetik(sesi: Sesi): number {
	if (!sesi.selesai_at) return 0;
	return Math.max(0, Math.round((Date.parse(sesi.selesai_at) - Date.parse(sesi.mulai_at)) / 1000));
}

export type KodeGelar = 'legendaris' | 'ulung' | 'tekun' | 'beruntung' | 'ditutup';

/** Gelar (GDD bagian 9) sebagai kode; UI menerjemahkannya lewat kamus `gelar.<kode>`. */
export function kodeGelar(menang: boolean, tebakanKe: number, jumlahPeriksa: number): KodeGelar {
	if (!menang) return 'ditutup';
	if (tebakanKe === 1) return jumlahPeriksa <= 5 ? 'legendaris' : 'ulung';
	if (tebakanKe === 2) return 'tekun';
	return 'beruntung';
}

const NAMA_GELAR: Record<KodeGelar, string> = {
	legendaris: 'Detektif Legendaris',
	ulung: 'Detektif Ulung',
	tekun: 'Detektif Tekun',
	beruntung: 'Detektif Beruntung',
	ditutup: 'Kasus Ditutup'
};

/** Nama gelar dalam bahasa Indonesia (dipakai alat bantu dan test). */
export function gelar(menang: boolean, tebakanKe: number, jumlahPeriksa: number): string {
	return NAMA_GELAR[kodeGelar(menang, tebakanKe, jumlahPeriksa)];
}

// --- Statistik pribadi (GDD bagian 11) ---

export interface StatistikPribadi {
	dimainkan: number;
	menang: number;
	persen_menang: number;
	streak: number;
	streak_terpanjang: number;
	distribusi: { 1: number; 2: number; 3: number; gagal: number };
	rata_periksa: number;
}

/**
 * Streak dihitung atas tanggal-tanggal yang punya kasus (hari tanpa kasus tidak memutus streak).
 * Kasus hari ini yang belum selesai juga tidak memutus streak.
 */
export function hitungStatistik(sesiPemain: Sesi[], tanggalKasus: string[], hariIni: string): StatistikPribadi {
	const perTanggal = new Map(sesiPemain.map((s) => [s.tanggal, s]));
	const selesai = sesiPemain.filter((s) => s.status !== 'berjalan' && s.tanggal <= hariIni);
	const menang = selesai.filter((s) => s.status === 'menang');
	const distribusi = { 1: 0, 2: 0, 3: 0, gagal: 0 };
	for (const s of selesai) {
		if (s.status === 'menang') distribusi[s.tuduhan.length as 1 | 2 | 3]++;
		else distribusi.gagal++;
	}

	const urut = tanggalKasus.filter((t) => t <= hariIni).sort();
	let streak = 0;
	for (let i = urut.length - 1; i >= 0; i--) {
		const s = perTanggal.get(urut[i]);
		if (urut[i] === hariIni && (!s || s.status === 'berjalan')) continue;
		if (s?.status === 'menang') streak++;
		else break;
	}
	let terpanjang = 0;
	let jalan = 0;
	for (const t of urut) {
		if (perTanggal.get(t)?.status === 'menang') terpanjang = Math.max(terpanjang, ++jalan);
		else jalan = 0;
	}

	return {
		dimainkan: selesai.length,
		menang: menang.length,
		persen_menang: selesai.length ? Math.round((menang.length / selesai.length) * 100) : 0,
		streak,
		streak_terpanjang: terpanjang,
		distribusi,
		rata_periksa: selesai.length
			? Math.round((selesai.reduce((n, s) => n + s.periksa.length, 0) / selesai.length) * 10) / 10
			: 0
	};
}

// --- Teks share (GDD bagian 8) ---

export function teksShare(p: {
	id: number;
	bintang: number;
	jatah: number;
	/** true = benda berisi bukti, false = kosong, urut sesuai pemeriksaan */
	periksa: boolean[];
	tuduhanBenar: boolean[];
	maksTuduhan: number;
	menang: boolean;
	durasiDetik: number;
	streak: number;
	situs: string;
	/** Label dalam bahasa pemain. Bawaan: bahasa Indonesia. */
	label?: { periksa: (n: number) => string; tebakan: (n: number) => string; ditutup: string };
}): string {
	const label = p.label ?? {
		periksa: (n: number) => `${n} periksa`,
		tebakan: (n: number) => `tebakan ke-${n}`,
		ditutup: 'kasus ditutup'
	};
	const bintang = '★'.repeat(p.bintang) + '☆'.repeat(3 - p.bintang);
	const kotak =
		p.periksa.map((b) => (b ? '🟨' : '⬛')).join('') + '⬜'.repeat(Math.max(0, p.jatah - p.periksa.length));
	const tuduhan =
		p.tuduhanBenar.map((b) => (b ? '🟩' : '🟥')).join('') +
		'⬜'.repeat(Math.max(0, p.maksTuduhan - p.tuduhanBenar.length));
	const ket = p.menang ? label.tebakan(p.tuduhanBenar.length) : label.ditutup;
	const m = Math.floor(p.durasiDetik / 60);
	const s = String(p.durasiDetik % 60).padStart(2, '0');
	return [
		`Dailytective #${p.id} 🔎 ${bintang}`,
		`${kotak}  ${label.periksa(p.periksa.length)}`,
		`${tuduhan}  ${ket}`,
		`⏱ ${m}:${s} · 🔥 ${p.streak}`,
		p.situs
	].join('\n');
}
