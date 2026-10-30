// Solver kasus (dokumen 04, bagian 4). Kombinasi maksimal 5 x 5 x 5 = 125, jadi cukup dicoba semua.

import type {
	Karakter,
	KasusFile,
	Kategori,
	Kombinasi,
	Kondisi,
	Logika,
	NilaiAtribut,
	Operator
} from './types';
import { KATEGORI } from './types';

export type PetaKarakter = Map<string, Karakter>;

export function petaKarakter(karakter: Karakter[]): PetaKarakter {
	return new Map(karakter.map((k) => [k.id, k]));
}

export function semuaKombinasi(pilihan: Record<Kategori, string[]>): Kombinasi[] {
	const hasil: Kombinasi[] = [];
	for (const siapa of pilihan.siapa)
		for (const pakai of pilihan.pakai)
			for (const dimana of pilihan.dimana) hasil.push({ siapa, pakai, dimana });
	return hasil;
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

export function saring(kombinasi: Kombinasi[], logika: Logika[], kar: PetaKarakter): Kombinasi[] {
	return kombinasi.filter((k) => logika.every((l) => evaluasi(l, k, kar)));
}

export function samaKombinasi(a: Kombinasi, b: Kombinasi): boolean {
	return KATEGORI.every((kat) => a[kat] === b[kat]);
}

/** Jumlah bagian tuduhan yang tepat (feedback "X dari 3 benar"). */
export function hitungBenar(tuduhan: Kombinasi, solusi: Kombinasi): number {
	return KATEGORI.filter((kat) => tuduhan[kat] === solusi[kat]).length;
}

// --- Analisis lengkap S1–S6 ---

export interface HasilCek {
	lolos: boolean;
	pesan: string;
}

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
	cek: Record<'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6', HasilCek>;
	/** Target kasar dari dokumen 04 bagian 4.3. Bukan syarat lolos. */
	catatanTarget: string[];
	lolos: boolean;
}

const BATAS_SUBSET = 16; // 2^16 subset masih cepat; kasus normal punya <= 12 clue TKP

/** Id clue TKP yang punya logika (benda berhasil "clue"). Clue "pendukung" tidak dipakai solver. */
export function idClueTkp(kasus: KasusFile): string[] {
	return Object.values(kasus.benda)
		.filter((b) => b.hasil === 'clue' && b.id_clue)
		.map((b) => b.id_clue as string);
}

export function analisis(kasus: KasusFile, kar: PetaKarakter): LaporanSolver {
	const semua = semuaKombinasi(kasus.pilihan);
	const logikaDari = (ids: string[]) =>
		ids.map((id) => {
			const l = kasus.logika[id];
			if (!l) throw new Error(`Clue ${id} tidak punya logika`);
			return l;
		});

	const idAwal = kasus.context_card.clue_awal.map((c) => c.id);
	const idTkp = idClueTkp(kasus);
	if (idTkp.length > BATAS_SUBSET) {
		throw new Error(`Terlalu banyak clue TKP (${idTkp.length}) untuk dianalisis; maksimal ${BATAS_SUBSET}`);
	}

	const sisaAwal = saring(semua, logikaDari(idAwal), kar);
	const sisaSemua = saring(sisaAwal, logikaDari(idTkp), kar);

	const unik = (ids: string[]) => {
		const sisa = saring(sisaAwal, logikaDari(ids), kar);
		return sisa.length === 1 && samaKombinasi(sisa[0], kasus.solusi);
	};

	// Cari semua himpunan clue TKP yang menghasilkan solusi tunggal, lalu ambil yang minimal.
	// Menambah clue hanya bisa mempersempit, jadi cukup cek dengan membuang satu clue.
	const jalur: string[][] = [];
	const n = idTkp.length;
	for (let mask = 1; mask < 1 << n; mask++) {
		const ids = idTkp.filter((_, i) => mask & (1 << i));
		if (!unik(ids)) continue;
		const minimal = ids.every((buang) => !unik(ids.filter((x) => x !== buang)));
		if (minimal) jalur.push(ids);
	}
	jalur.sort((a, b) => a.length - b.length || a.join().localeCompare(b.join()));
	const buktiMinimum = jalur.length ? jalur[0].length : null;

	const clueTunggalMenjawab = idTkp.filter((id) => saring(sisaAwal, logikaDari([id]), kar).length === 1);

	const clueSalahUntukSolusi = [...idAwal, ...idTkp].filter(
		(id) => !evaluasi(kasus.logika[id], kasus.solusi, kar)
	);

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
			pesan: `${sisaAwal.length} kombinasi tersisa setelah clue awal (minimal ${minSisaAwal})`
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

	return {
		idKasus: kasus.id,
		totalKombinasi: semua.length,
		sisaSetelahClueAwal: sisaAwal.length,
		sisaSetelahSemua: sisaSemua,
		jalur,
		buktiMinimum,
		clueTunggalMenjawab,
		clueSalahUntukSolusi,
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
	return `${k.siapa} + ${k.pakai} + ${k.dimana}`;
}
