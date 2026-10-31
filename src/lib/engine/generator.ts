// Generator kasus semi-otomatis (dokumen 04 bagian 8). Membantu penulis, tidak menggantikannya:
// keluarannya draf yang LOLOS solver, dengan teks bertanda [DRAF] yang wajib ditulis ulang.

import { analisis, petaKarakter, type LaporanSolver } from './solver';
import type { DataDunia, IsiBenda, JenisKasus, KasusFile, Kombinasi, Logika, Pengakuan, PilihanKasus } from './types';
import { indeksHari, namaHari } from './waktu';

export const PENANDA_DRAF = '[DRAF]';

export interface OpsiGenerator {
	tanggal: string;
	id: number;
	jenis: JenisKasus;
	/** Bawaan: sesuai jadwal mingguan (GDD bagian 10). */
	bintang?: 1 | 2 | 3;
	seed?: number;
	solusi?: Partial<Kombinasi>;
	percobaan?: number;
}

export interface HasilGenerator {
	kasus: KasusFile;
	laporan: LaporanSolver;
	percobaan: number;
}

const BINTANG_PER_HARI = [3, 1, 1, 2, 2, 2, 3] as const;
const UKURAN = { 1: 3, 2: 4, 3: 5 } as const;
const CLUE_AWAL = { 1: 3, 2: 2, 3: 1 } as const;
const TARGET_SISA = { 1: [6, 12], 2: [15, 35], 3: [40, 400] } as const;
const TARGET_BUKTI = { 1: [2, 2], 2: [3, 3], 3: [4, 5] } as const;

const KELOMPOK_BARANG: Record<JenisKasus, string> = {
	pencurian: 'membuka',
	kehilangan: 'membawa',
	sabotase: 'sabotase',
	kejahilan: 'kejahilan',
	pecah_rusak: 'merusak',
	pembunuhan: 'merusak'
};

/** RNG deterministik (mulberry32) supaya draf bisa diulang dengan seed yang sama. */
function rng(seed: number) {
	let a = seed >>> 0;
	const acak = () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
	const ambil = <T>(xs: readonly T[]) => xs[Math.floor(acak() * xs.length)];
	const kocok = <T>(xs: readonly T[]) => {
		const h = [...xs];
		for (let i = h.length - 1; i > 0; i--) {
			const j = Math.floor(acak() * (i + 1));
			[h[i], h[j]] = [h[j], h[i]];
		}
		return h;
	};
	return { acak, ambil, kocok, sampel: <T>(xs: readonly T[], n: number) => kocok(xs).slice(0, n) };
}

interface Calon {
	logika: Logika;
	teks: string;
	/** Ruangan yang cocok untuk menaruh clue ini (untuk clue TKP). */
	ruangan?: string;
}

export function buatDraf(dunia: DataDunia, opsi: OpsiGenerator): HasilGenerator {
	const r = rng(opsi.seed ?? Date.parse(opsi.tanggal));
	const kar = petaKarakter(dunia.karakter);
	const hari = indeksHari(opsi.tanggal);
	const bintang = opsi.bintang ?? BINTANG_PER_HARI[hari];
	const n = UKURAN[bintang];
	const pakaiMotif = hari === 0;
	const pakaiBohong = hari === 5 || hari === 6;
	const jatah = hari === 0 ? 12 : 10;
	const maks = opsi.percobaan ?? 400;

	const namaK = new Map(dunia.karakter.map((k) => [k.id, k.nama]));
	const namaB = new Map(dunia.barang.map((b) => [b.id, b.nama.toLowerCase()]));
	const namaL = new Map(dunia.lokasi.map((l) => [l.id, l.nama]));
	const namaM = new Map(dunia.motif.map((m) => [m.id, m.nama.toLowerCase()]));
	const ruanganIlustrasi = dunia.ruangan.filter((r) => r.ilustrasi).map((r) => r.id);
	const calonAtribut = calonAtributUntuk(kar);

	for (let percobaan = 1; percobaan <= maks; percobaan++) {
		// 1. Pilihan dan solusi
		const pilihan: PilihanKasus = {
			siapa: r.sampel(dunia.karakter.map((k) => k.id), n),
			pakai: r.sampel(dunia.barang.filter((b) => b.kelompok === KELOMPOK_BARANG[opsi.jenis]).map((b) => b.id), n),
			dimana: r.sampel(dunia.lokasi.filter((l) => l.jenis === 'ruangan' && ruanganIlustrasi.includes(l.id)).map((l) => l.id), n)
		};
		if (pakaiMotif) pilihan.kenapa = r.sampel(dunia.motif.map((m) => m.id), n);
		const solusi: Kombinasi = {
			siapa: opsi.solusi?.siapa ?? r.ambil(pilihan.siapa),
			pakai: opsi.solusi?.pakai ?? r.ambil(pilihan.pakai),
			dimana: opsi.solusi?.dimana ?? r.ambil(pilihan.dimana)
		};
		if (pilihan.kenapa) solusi.kenapa = opsi.solusi?.kenapa ?? r.ambil(pilihan.kenapa);
		for (const k of ['siapa', 'pakai', 'dimana'] as const)
			if (!pilihan[k].includes(solusi[k])) pilihan[k][0] = solusi[k];

		// 2. Calon clue awal: syarat bersyarat dan atribut (selalu benar untuk solusi)
		const pelaku = kar.get(solusi.siapa)!;
		const lain = <T extends string>(xs: T[], kecuali: T) => xs.filter((x) => x !== kecuali);
		const calonAwal: Calon[] = [];
		for (const s of lain(pilihan.siapa, solusi.siapa)) {
			const d = r.ambil(pilihan.dimana);
			calonAwal.push({
				logika: { tipe: 'jika_maka', jika: { siapa: s }, maka: { dimana: d } },
				teks: `${namaK.get(s)} tidak keluar dari ${namaL.get(d)} sepanjang malam.`
			});
		}
		for (const p of lain(pilihan.pakai, solusi.pakai)) {
			const d = r.ambil(pilihan.dimana);
			calonAwal.push({
				logika: { tipe: 'jika_maka', jika: { pakai: p }, maka: { dimana: d } },
				teks: `Siapa pun yang memakai ${namaB.get(p)} melakukannya di ${namaL.get(d)}.`
			});
		}
		calonAwal.push(...calonAtribut(pelaku.id, pilihan.siapa));

		// 3. Calon clue TKP: fakta, bukan, dan atribut, ditaruh di ruangan yang masuk akal
		const calonTkp: Calon[] = [
			{ logika: { tipe: 'fakta', dimana: solusi.dimana }, teks: `Ada jejak kejadian yang jelas di sini, di ${namaL.get(solusi.dimana)}.`, ruangan: solusi.dimana },
			{ logika: { tipe: 'fakta', pakai: solusi.pakai }, teks: `Ada ${namaB.get(solusi.pakai)} dengan bekas baru dipakai.` }
		];
		for (const d of lain(pilihan.dimana, solusi.dimana))
			calonTkp.push({ logika: { tipe: 'bukan', dimana: d }, teks: `${namaL.get(d)} rapi dan tidak tersentuh malam itu.`, ruangan: d });
		for (const p of lain(pilihan.pakai, solusi.pakai))
			calonTkp.push({ logika: { tipe: 'bukan', pakai: p }, teks: `${cap(namaB.get(p)!)} ada di tempatnya dan jelas tidak dipakai.` });
		for (const s of lain(pilihan.siapa, solusi.siapa))
			calonTkp.push({ logika: { tipe: 'bukan', siapa: s }, teks: `Ada bukti ${namaK.get(s)} berada jauh dari kejadian sepanjang malam.` });
		calonTkp.push(...calonAtribut(pelaku.id, pilihan.siapa));
		if (pilihan.kenapa) {
			calonTkp.push({ logika: { tipe: 'fakta', kenapa: solusi.kenapa }, teks: `Sebuah catatan mengungkap alasannya: ${namaM.get(solusi.kenapa!)}.` });
			for (const m of lain(pilihan.kenapa, solusi.kenapa!))
				calonTkp.push({ logika: { tipe: 'bukan', kenapa: m }, teks: `Jelas ini bukan soal ${namaM.get(m)}.` });
		}

		// 4. Pengakuan (Jumat–Sabtu): pelaku berbohong tentang dirinya, yang lain jujur
		const pengakuan: Pengakuan[] = [];
		const logikaPengakuan: Record<string, Logika> = {};
		if (pakaiBohong) {
			pilihan.siapa.forEach((s, i) => {
				const id = `P${i + 1}`;
				if (s === solusi.siapa) {
					logikaPengakuan[id] = { tipe: 'jika_maka', jika: { siapa: s }, maka: { bukan: { dimana: solusi.dimana } } };
					pengakuan.push({ id, oleh: s, teks: `Aku tidak ke ${namaL.get(solusi.dimana)} sama sekali malam ini.` });
				} else {
					const p = r.ambil(lain(pilihan.pakai, solusi.pakai));
					logikaPengakuan[id] = { tipe: 'jika_maka', jika: { siapa: s }, maka: { bukan: { pakai: p } } };
					pengakuan.push({ id, oleh: s, teks: `Aku tidak menyentuh ${namaB.get(p)}.` });
				}
			});
		}

		// 5. Pilih clue awal dan clue TKP secara acak, lalu uji dengan solver
		const awal = r.sampel(calonAwal, CLUE_AWAL[bintang]);
		const jumlahTkp = Math.min(calonTkp.length, bintang === 1 ? 6 : bintang === 2 ? 7 : 9);
		const tkp = r.sampel(calonTkp, jumlahTkp);

		const kasus = rakit({
			opsi, bintang, jatah, pilihan, solusi, pengakuan, logikaPengakuan, awal, tkp, dunia, r, hari
		});
		const lap = analisis(kasus, kar);
		const [sisaMin, sisaMaks] = TARGET_SISA[bintang];
		const [buktiMin, buktiMaks] = TARGET_BUKTI[bintang];
		const dekatTarget =
			lap.sisaSetelahClueAwal >= sisaMin * 0.6 &&
			lap.sisaSetelahClueAwal <= sisaMaks * 1.3 &&
			lap.buktiMinimum !== null &&
			lap.buktiMinimum >= buktiMin - 1 &&
			lap.buktiMinimum <= buktiMaks;
		if (lap.lolos && (dekatTarget || percobaan > maks * 0.8)) {
			kasus.penjelasan = penjelasanDari(kasus, lap);
			return { kasus, laporan: lap, percobaan };
		}
	}
	throw new Error(`Tidak menemukan draf yang lolos solver dalam ${maks} percobaan; coba seed lain`);
}

/** Clue atribut yang benar untuk pelaku dan benar-benar menyaring (tidak semua/tidak satu pun tersangka cocok). */
function calonAtributUntuk(kar: ReturnType<typeof petaKarakter>) {
	return function calonAtribut(pelakuId: string, tersangka: string[]): Calon[] {
		const p = kar.get(pelakuId)!;
		const hasil: Calon[] = [];
		const bagi = (lolos: (id: string) => boolean) => {
			const n = tersangka.filter(lolos).length;
			return n > 0 && n < tersangka.length;
		};
		const a = p.atribut;
		if (bagi((id) => kar.get(id)!.atribut.tangan === a.tangan))
			hasil.push({ logika: { tipe: 'atribut', atribut: 'tangan', nilai: a.tangan }, teks: `Pelakunya ${a.tangan === 'kidal' ? 'kidal' : 'bertangan kanan'}.` });
		if (bagi((id) => kar.get(id)!.atribut.kacamata === a.kacamata))
			hasil.push({ logika: { tipe: a.kacamata ? 'atribut' : 'atribut_bukan', atribut: 'kacamata', nilai: true }, teks: a.kacamata ? 'Ada bekas lensa kacamata di sini: pelakunya berkacamata.' : 'Pelakunya tidak berkacamata.' });
		if (bagi((id) => kar.get(id)!.atribut.tinggi === a.tinggi))
			hasil.push({ logika: { tipe: 'atribut', atribut: 'tinggi', nilai: a.tinggi }, teks: `Pelakunya bertubuh ${a.tinggi}.` });
		const ambang = 42; // membagi 10 tersangka jadi 5 : 5 (dokumen 03)
		const besar = a.sepatu >= ambang;
		if (bagi((id) => kar.get(id)!.atribut.sepatu >= ambang === besar))
			hasil.push({
				logika: { tipe: 'atribut', atribut: 'sepatu', nilai: ambang, op: besar ? '>=' : '<' },
				teks: `Ada jejak sepatu pelaku: ukurannya ${besar ? `${ambang} ke atas` : `di bawah ${ambang}`}.`
			});
		if (bagi((id) => kar.get(id)!.atribut.kelamin === a.kelamin))
			hasil.push({ logika: { tipe: 'atribut', atribut: 'kelamin', nilai: a.kelamin }, teks: `Pelakunya ${a.kelamin === 'L' ? 'laki-laki' : 'perempuan'}.` });
		return hasil;
	};
}

function rakit(x: {
	opsi: OpsiGenerator;
	bintang: 1 | 2 | 3;
	jatah: number;
	pilihan: PilihanKasus;
	solusi: Kombinasi;
	pengakuan: Pengakuan[];
	logikaPengakuan: Record<string, Logika>;
	awal: Calon[];
	tkp: Calon[];
	dunia: DataDunia;
	r: ReturnType<typeof rng>;
	hari: number;
}): KasusFile {
	const logika: Record<string, Logika> = { ...x.logikaPengakuan };
	const clue_awal = x.awal.map((c, i) => {
		logika[`A${i + 1}`] = c.logika;
		return { id: `A${i + 1}`, teks: c.teks };
	});

	// Taruh clue TKP: clue berlokasi ke ruangannya, sisanya disebar supaya minimal 3 ruangan terisi.
	const ruangan = x.dunia.ruangan.filter((r) => r.ilustrasi);
	const terpakai = new Set<string>();
	const benda: Record<string, IsiBenda> = {};
	let putaran = 0;
	x.tkp.forEach((c, i) => {
		const id = `B${i + 1}`;
		logika[id] = c.logika;
		const target = ruangan.find((r) => r.id === c.ruangan) ?? ruangan[putaran++ % ruangan.length];
		const kosong = target.benda.filter((b) => !terpakai.has(b.id));
		const b = x.r.ambil(kosong.length ? kosong : ruangan.flatMap((r) => r.benda).filter((b) => !terpakai.has(b.id)));
		terpakai.add(b.id);
		benda[b.id] = { hasil: 'clue', id_clue: id, teks: `${PENANDA_DRAF} ${c.teks}` };
	});
	// Beberapa benda kosong khusus sebagai pengingat untuk penulis
	for (const r of ruangan) {
		const b = x.r.ambil(r.benda.filter((b) => !terpakai.has(b.id)));
		if (!b) continue;
		terpakai.add(b.id);
		benda[b.id] = { hasil: 'kosong', teks: `${PENANDA_DRAF} Teks kosong yang jenaka untuk ${b.nama.toLowerCase()}.` };
	}

	return {
		versi_skema: 1,
		id: x.opsi.id,
		tanggal: x.opsi.tanggal,
		judul: `${PENANDA_DRAF} Judul kasus`,
		jenis: x.opsi.jenis,
		kesulitan: { bintang: x.bintang, label: namaHari(x.opsi.tanggal) },
		jatah_periksa: x.jatah,
		context_card: {
			cerita: `${PENANDA_DRAF} Cerita 2–3 kalimat: apa yang terjadi, kapan, dan siapa yang melapor.${x.pengakuan.length ? ' Salah satu tersangka berbohong.' : ''}`,
			clue_awal
		},
		pilihan: x.pilihan,
		pengakuan: x.pengakuan,
		state_ruangan: {},
		benda,
		teks_kosong_bawaan: 'Kamu memeriksanya dengan teliti, tapi tidak ada yang mencurigakan.',
		solusi: x.solusi,
		logika,
		penjelasan: [],
		komentar_nenek: `${PENANDA_DRAF} Komentar Nenek yang hangat dan jenaka.`
	};
}

/** Penjelasan otomatis dari jalur bukti terpendek. Penulis tetap harus menulis ulang dengan bahasa manusia. */
function penjelasanDari(kasus: KasusFile, lap: LaporanSolver) {
	const ids = [...kasus.context_card.clue_awal.map((c) => c.id), ...kasus.pengakuan.map((p) => p.id), ...lap.jalur[0]];
	return [
		{ teks: `${PENANDA_DRAF} Jelaskan alur logikanya langkah demi langkah memakai clue berikut.`, bukti: ids },
		{ teks: `${PENANDA_DRAF} Jalur lain yang juga sah: ${lap.jalur.slice(1, 4).map((j) => j.join(' + ')).join(' · ') || '-'}.`, bukti: [] }
	];
}

function cap(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1);
}
