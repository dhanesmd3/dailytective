// Solver kasus (dokumen 04, bagian 4). Kombinasi maksimal 5^4 = 625 (dengan motif), jadi cukup dicoba semua.

import type {
	Karakter,
	KasusFile,
	Kategori,
	Kombinasi,
	Kondisi,
	Logika,
	NilaiAtribut,
	Operator,
	PilihanKasus
} from './types';
import { KATEGORI } from './types';

export type PetaKarakter = Map<string, Karakter>;

export function petaKarakter(karakter: Karakter[]): PetaKarakter {
	return new Map(karakter.map((k) => [k.id, k]));
}

/** Kategori yang dipakai kasus ini: selalu siapa/pakai/dimana, ditambah kenapa kalau ada motif. */
export function kategoriDari(pilihan: PilihanKasus): Kategori[] {
	return KATEGORI.filter((k) => (pilihan[k]?.length ?? 0) > 0);
}

export function semuaKombinasi(pilihan: PilihanKasus): Kombinasi[] {
	let hasil: Partial<Kombinasi>[] = [{}];
	for (const kat of kategoriDari(pilihan)) {
		hasil = hasil.flatMap((k) => pilihan[kat]!.map((id) => ({ ...k, [kat]: id })));
	}
	return hasil as Kombinasi[];
}

function bandingkan(kiri: NilaiAtribut, op: Operator, kanan: NilaiAtribut): boolean {
	switch (op) {
		case '=':
			return kiri === kanan;
		case '!=':
			return kiri !== kanan;
		case '<':
			return kiri < kanan;
		case '<=':
			return kiri <= kanan;
		case '>':
			return kiri > kanan;
		case '>=':
			return kiri >= kanan;
	}
}

/** Apakah pelaku `siapaId` punya atribut tertentu. "ciri" dicek sebagai keanggotaan daftar ciri. */
export function punyaAtribut(
	siapaId: string,
	atribut: string,
	nilai: NilaiAtribut,
	op: Operator = '=',
	kar: PetaKarakter
): boolean {
	const k = kar.get(siapaId);
	if (!k) throw new Error(`Karakter tidak dikenal: ${siapaId}`);
	if (atribut === 'ciri') {
		const punya = k.ciri.includes(String(nilai));
		return op === '!=' ? !punya : punya;
	}
	const sebenarnya = (k.atribut as unknown as Record<string, NilaiAtribut>)[atribut];
	if (sebenarnya === undefined) throw new Error(`Atribut tidak dikenal: ${atribut}`);
	return bandingkan(sebenarnya, op, nilai);
}

export function cocokKondisi(kondisi: Kondisi, k: Kombinasi, kar: PetaKarakter): boolean {
	for (const kat of KATEGORI) {
		const nilai = kondisi[kat];
		if (nilai !== undefined && k[kat] !== nilai) return false;
	}
	if (kondisi.atribut) {
		for (const [nama, nilai] of Object.entries(kondisi.atribut)) {
			if (!punyaAtribut(k.siapa, nama, nilai, '=', kar)) return false;
		}
	}
	if (kondisi.bukan && cocokKondisi(kondisi.bukan, k, kar)) return false;
	return true;
}

/** Nilai kebenaran satu clue untuk satu kombinasi. */
export function evaluasi(logika: Logika, k: Kombinasi, kar: PetaKarakter): boolean {
	switch (logika.tipe) {
		case 'atribut':
			return punyaAtribut(k.siapa, logika.atribut, logika.nilai, logika.op ?? '=', kar);
		case 'atribut_bukan':
			return !punyaAtribut(k.siapa, logika.atribut, logika.nilai, logika.op ?? '=', kar);
		case 'fakta':
			return KATEGORI.every((kat) => logika[kat] === undefined || k[kat] === logika[kat]);
		case 'bukan':
			return KATEGORI.every((kat) => logika[kat] === undefined || k[kat] !== logika[kat]);
		case 'jika_maka': {
			if (!cocokKondisi(logika.jika, k, kar)) return true;
			const maka = Array.isArray(logika.maka) ? logika.maka : [logika.maka];
			return maka.every((m) => cocokKondisi(m, k, kar));
		}
	}
}

/** Satu syarat yang harus dipenuhi kombinasi. Clue biasa dan aturan pengakuan sama-sama berbentuk ini. */
export type Syarat = (k: Kombinasi) => boolean;

export function syaratClue(logika: Logika, kar: PetaKarakter): Syarat {
	return (k) => evaluasi(logika, k, kar);
}

/**
 * Aturan hari berbohong: pengakuan pelaku SALAH, pengakuan tersangka lain BENAR.
 * Pelaku yang tidak memberi pengakuan tidak mungkin (setiap tersangka memberi satu).
 */
export function syaratPengakuan(kasus: KasusFile, kar: PetaKarakter): Syarat | null {
	if (!kasus.pengakuan?.length) return null;
	return (k) =>
		kasus.pengakuan.some((p) => p.oleh === k.siapa) &&
		kasus.pengakuan.every((p) => {
			const benar = evaluasi(kasus.logika[p.id], k, kar);
			return p.oleh === k.siapa ? !benar : benar;
		});
}

export function saring(kombinasi: Kombinasi[], syarat: Syarat[]): Kombinasi[] {
	return kombinasi.filter((k) => syarat.every((s) => s(k)));
}

/** Versi lama yang menerima logika langsung; dipakai test dan alat bantu. */
export function saringLogika(kombinasi: Kombinasi[], logika: Logika[], kar: PetaKarakter): Kombinasi[] {
	return saring(kombinasi, logika.map((l) => syaratClue(l, kar)));
}

export function samaKombinasi(a: Kombinasi, b: Kombinasi): boolean {
	return KATEGORI.every((kat) => a[kat] === b[kat]);
}

/** Jumlah bagian tuduhan yang tepat (feedback "X dari 3/4 benar"). */
export function hitungBenar(tuduhan: Kombinasi, solusi: Kombinasi): number {
	return KATEGORI.filter((kat) => solusi[kat] !== undefined && tuduhan[kat] === solusi[kat]).length;
}

// --- Analisis lengkap S1–S6 ---

export interface HasilCek {
	lolos: boolean;
	pesan: string;
}

export type KodeCek = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6';

export interface LaporanSolver {
	idKasus: number;
	totalKombinasi: number;
	sisaSetelahClueAwal: number;
	sisaSetelahSemua: Kombinasi[];
	/** Himpunan bukti TKP yang minimal (tidak bisa dikurangi lagi), urut dari yang terkecil. */
	jalur: string[][];
	buktiMinimum: number | null;
	clueTunggalMenjawab: string[];
	clueSalahUntukSolusi: string[];
	/** Ruangan tempat clue TKP berada (dokumen 04: sebar di minimal 3 ruangan). */
	sebaranRuangan: string[];
	cek: Record<KodeCek, HasilCek>;
	/** Target kasar dari dokumen 04 bagian 4.3. Bukan syarat lolos. */
	catatanTarget: string[];
	lolos: boolean;
}

const BATAS_SUBSET = 16; // 2^16 subset masih cepat; kasus normal punya <= 14 clue TKP

/** Id clue TKP yang punya logika (benda berhasil "clue"). Clue "pendukung" tidak dipakai solver. */
export function idClueTkp(kasus: KasusFile): string[] {
	return Object.values(kasus.benda)
		.filter((b) => b.hasil === 'clue' && b.id_clue)
		.map((b) => b.id_clue as string);
}

export function analisis(kasus: KasusFile, kar: PetaKarakter, bendaKeRuangan?: Map<string, string>): LaporanSolver {
	const semua = semuaKombinasi(kasus.pilihan);
	const syaratDari = (ids: string[]) =>
		ids.map((id) => {
			const l = kasus.logika[id];
			if (!l) throw new Error(`Clue ${id} tidak punya logika`);
			return syaratClue(l, kar);
		});

	const idAwal = kasus.context_card.clue_awal.map((c) => c.id);
	const idTkp = idClueTkp(kasus);
	if (idTkp.length > BATAS_SUBSET) {
		throw new Error(`Terlalu banyak clue TKP (${idTkp.length}) untuk dianalisis; maksimal ${BATAS_SUBSET}`);
	}

	// Pengakuan adalah informasi gratis seperti clue awal.
	const syaratAwal = syaratDari(idAwal);
	const pengakuan = syaratPengakuan(kasus, kar);
	if (pengakuan) syaratAwal.push(pengakuan);

	const sisaAwal = saring(semua, syaratAwal);
	const sisaSemua = saring(sisaAwal, syaratDari(idTkp));

	// Setiap clue TKP diubah sekali jadi bitset kombinasi (dari sisaAwal) yang lolos; sebuah subset clue
	// cukup di-AND. Hasil per subset dimemo, jadi pencarian semua subset tetap cepat untuk 5x5x5(x5).
	const n = idTkp.length;
	const kata = Math.max(1, Math.ceil(sisaAwal.length / 32));
	const bitClue = syaratDari(idTkp).map((s) => {
		const b = new Uint32Array(kata);
		sisaAwal.forEach((k, i) => {
			if (s(k)) b[i >> 5] |= 1 << (i & 31);
		});
		return b;
	});
	const idxSolusi = sisaAwal.findIndex((k) => samaKombinasi(k, kasus.solusi));
	const memo = new Int8Array(1 << n).fill(-1);
	const jumlahSisa = (mask: number): number => {
		if (sisaAwal.length === 0) return 0;
		let total = 0;
		for (let w = 0; w < kata; w++) {
			let v = w === kata - 1 && sisaAwal.length % 32 ? (1 << sisaAwal.length % 32) - 1 : 0xffffffff;
			for (let i = 0; i < n; i++) if (mask & (1 << i)) v &= bitClue[i][w];
			v = v - ((v >>> 1) & 0x55555555);
			v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
			total += (((v + (v >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24;
		}
		return total;
	};
	const unikMask = (mask: number): boolean => {
		if (memo[mask] === -1) {
			const lolosSolusi = idxSolusi >= 0 && Array.from({ length: n }).every((_, i) => !(mask & (1 << i)) || (bitClue[i][idxSolusi >> 5] >>> (idxSolusi & 31)) & 1);
			memo[mask] = lolosSolusi && jumlahSisa(mask) === 1 ? 1 : 0;
		}
		return memo[mask] === 1;
	};

	// Cari semua himpunan clue TKP yang menghasilkan solusi tunggal, lalu ambil yang minimal.
	// Menambah clue hanya bisa mempersempit, jadi cukup cek dengan membuang satu clue.
	const jalur: string[][] = [];
	for (let mask = 1; mask < 1 << n; mask++) {
		if (!unikMask(mask)) continue;
		let minimal = true;
		for (let i = 0; i < n && minimal; i++) if (mask & (1 << i) && unikMask(mask & ~(1 << i))) minimal = false;
		if (minimal) jalur.push(idTkp.filter((_, i) => mask & (1 << i)));
	}
	jalur.sort((a, b) => a.length - b.length || a.join().localeCompare(b.join()));
	const buktiMinimum = jalur.length ? jalur[0].length : null;

	const clueTunggalMenjawab = idTkp.filter((_, i) => jumlahSisa(1 << i) === 1);

	const clueSalahUntukSolusi = [...idAwal, ...idTkp].filter(
		(id) => !evaluasi(kasus.logika[id], kasus.solusi, kar)
	);
	if (pengakuan && !pengakuan(kasus.solusi)) clueSalahUntukSolusi.push('pengakuan (pelaku harus satu-satunya pembohong)');

	const sebaranRuangan = bendaKeRuangan
		? [...new Set(Object.entries(kasus.benda).filter(([, b]) => b.hasil === 'clue').map(([id]) => bendaKeRuangan.get(id) ?? '?'))]
		: [];

	const bintang = kasus.kesulitan.bintang;
	const minSisaAwal = bintang === 1 ? 3 : 6;
	const batasBukti = kasus.jatah_periksa - 4;

	const cek: LaporanSolver['cek'] = {
		S1: {
			lolos: sisaSemua.length === 1 && samaKombinasi(sisaSemua[0], kasus.solusi),
			pesan:
				sisaSemua.length === 1
					? samaKombinasi(sisaSemua[0], kasus.solusi)
						? 'Tepat 1 kombinasi tersisa dan itu solusinya'
						: `Kombinasi tersisa bukan solusi: ${fmt(sisaSemua[0])}`
					: `${sisaSemua.length} kombinasi tersisa dengan semua clue (harus 1)`
		},
		S2: {
			lolos: sisaAwal.length >= minSisaAwal,
			pesan: `${sisaAwal.length} kombinasi tersisa setelah clue awal${pengakuan ? ' dan pengakuan' : ''} (minimal ${minSisaAwal})`
		},
		S3: {
			lolos: buktiMinimum !== null && buktiMinimum <= batasBukti,
			pesan:
				buktiMinimum === null
					? 'Tidak ada himpunan bukti yang menghasilkan solusi tunggal'
					: `Bukti minimum ${buktiMinimum} (maksimal ${batasBukti} = jatah ${kasus.jatah_periksa} - 4)`
		},
		S4: {
			lolos: jalur.length >= 2,
			pesan: `${jalur.length} jalur bukti minimal (minimal 2)`
		},
		S5: {
			lolos: bintang === 1 || clueTunggalMenjawab.length === 0,
			pesan:
				clueTunggalMenjawab.length === 0
					? 'Tidak ada satu clue TKP yang langsung menjawab'
					: `Clue ${clueTunggalMenjawab.join(', ')} langsung menjawab bersama clue awal` +
						(bintang === 1 ? ' (diizinkan untuk bintang 1)' : '')
		},
		S6: {
			lolos: clueSalahUntukSolusi.length === 0,
			pesan:
				clueSalahUntukSolusi.length === 0
					? 'Semua clue benar untuk solusi'
					: `Clue ${clueSalahUntukSolusi.join(', ')} bernilai salah untuk solusi`
		}
	};

	const target = TARGET[bintang];
	const catatanTarget: string[] = [];
	if (sisaAwal.length < target.sisaAwal[0] || sisaAwal.length > target.sisaAwal[1])
		catatanTarget.push(
			`Sisa kombinasi setelah clue awal ${sisaAwal.length}, target ${target.sisaAwal[0]}–${target.sisaAwal[1] === Infinity ? '∞' : target.sisaAwal[1]}`
		);
	if (buktiMinimum !== null && (buktiMinimum < target.bukti[0] || buktiMinimum > target.bukti[1]))
		catatanTarget.push(`Bukti minimum ${buktiMinimum}, target ${target.bukti[0]}–${target.bukti[1]}`);
	if (jalur.length < target.jalur[0] || jalur.length > target.jalur[1])
		catatanTarget.push(
			`Jalur ${jalur.length}, target ${target.jalur[0]}–${target.jalur[1] === Infinity ? '∞' : target.jalur[1]}`
		);
	if (bendaKeRuangan && sebaranRuangan.length < 3)
		catatanTarget.push(`Clue TKP hanya di ${sebaranRuangan.length} ruangan (${sebaranRuangan.join(', ')}); disarankan minimal 3`);

	return {
		idKasus: kasus.id,
		totalKombinasi: semua.length,
		sisaSetelahClueAwal: sisaAwal.length,
		sisaSetelahSemua: sisaSemua,
		jalur,
		buktiMinimum,
		clueTunggalMenjawab,
		clueSalahUntukSolusi,
		sebaranRuangan,
		cek,
		catatanTarget,
		lolos: Object.values(cek).every((c) => c.lolos)
	};
}

const TARGET: Record<1 | 2 | 3, { sisaAwal: [number, number]; bukti: [number, number]; jalur: [number, number] }> = {
	1: { sisaAwal: [6, 12], bukti: [2, 2], jalur: [3, Infinity] },
	2: { sisaAwal: [15, 35], bukti: [3, 3], jalur: [2, 4] },
	3: { sisaAwal: [40, Infinity], bukti: [4, 5], jalur: [2, 3] }
};

function fmt(k: Kombinasi): string {
	return KATEGORI.filter((kat) => k[kat]).map((kat) => k[kat]).join(' + ');
}
