// Lapisan layanan antara route API dan mesin permainan: menentukan "hari ini", memuat kasus,
// dan menyusun respons. Semua keputusan soal tanggal dibuat di server (dokumen 06 bagian 3).

import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { error, json } from '@sveltejs/kit';
import {
	GalatPermainan,
	hasilAkhir,
	hitungStatistik,
	kasusPublik,
	lihatBenda,
	semuaBendaIds,
	type GalatMain
} from '$lib/engine/permainan';
import { duniaDalam, kasusDalam } from '$lib/engine/terjemahan';
import type { DataDunia, KasusFile, Sesi } from '$lib/engine/types';
import type { Bahasa } from '$lib/i18n/kamus';
import { apakahTanggalValid, rilisBerikutnya, tanggalKasusAktif } from '$lib/engine/waktu';
import { duniaBundel, kasusBundel } from './bundel';
import { penyimpanan } from './store';

/** Mode pratinjau: boleh melompat tanggal lewat ?tanggal= dan mengulang sesi. Otomatis aktif saat dev. */
export const pratinjau = dev || env.DT_PRATINJAU === '1';

interface Katalog {
	dunia: DataDunia;
	/** Data dunia yang sudah diterjemahkan, per bahasa. */
	duniaPer: Record<Bahasa, DataDunia>;
	bendaDikenal: Set<string>;
	perTanggal: Map<string, KasusFile>;
	perId: Map<number, KasusFile>;
}

let cache: Katalog | null = null;

/** Saat dev, Vite memuat ulang modul ini kalau JSON kasus berubah, jadi cache ikut tersusun ulang. */
export function katalog(): Katalog {
	if (cache) return cache;
	const dunia = duniaBundel();
	const semua = kasusBundel();
	cache = {
		dunia,
		duniaPer: { id: dunia, en: duniaDalam(dunia, 'en') },
		bendaDikenal: semuaBendaIds(dunia),
		perTanggal: new Map(semua.map((k) => [k.tanggal, k])),
		perId: new Map(semua.map((k) => [k.id, k]))
	};
	return cache;
}

/** Tanggal "hari ini" menurut server, atau tanggal pratinjau kalau diizinkan. */
export function hariIni(url: URL, sekarang = new Date()): string {
	const minta = url.searchParams.get('tanggal');
	if (pratinjau && minta && apakahTanggalValid(minta)) return minta;
	if (env.DT_TANGGAL && apakahTanggalValid(env.DT_TANGGAL)) return env.DT_TANGGAL;
	return tanggalKasusAktif(sekarang);
}

/**
 * Kasus berdasarkan id, dalam bahasa pemain; kasus yang belum terbit diperlakukan seperti tidak ada.
 * Terjemahan hanya mengubah teks, jadi logika, solusi, dan id tetap sama.
 */
export function kasusTerbit(id: number, url: URL, bahasa: Bahasa = 'id'): KasusFile {
	const kasus = katalog().perId.get(id);
	if (!kasus || kasus.tanggal > hariIni(url)) error(404, 'Kasus tidak ditemukan');
	return kasusDalam(kasus, bahasa);
}

export async function statistikPemain(pemainId: string, url: URL) {
	const tanggal = [...katalog().perTanggal.keys()];
	return hitungStatistik(await penyimpanan().milikPemain(pemainId), tanggal, hariIni(url));
}

/** Progres pemain dalam bentuk yang aman dikirim: hanya isi benda yang sudah ia periksa. */
export function sesiTampil(kasus: KasusFile, sesi: Sesi) {
	return {
		status: sesi.status,
		mulai_at: sesi.mulai_at,
		periksa: sesi.periksa.map((b) => lihatBenda(kasus, sesi, b)),
		sisa_jatah: kasus.jatah_periksa - sesi.periksa.length,
		tuduhan: sesi.tuduhan,
		akhir: sesi.status === 'berjalan' ? null : hasilAkhir(kasus, sesi)
	};
}

/**  harus sudah dalam bahasa pemain (lihat kasusTerbit/kasusDalam). */
export function responsKasus(kasus: KasusFile, sesi: Sesi | null, bahasa: Bahasa) {
	return {
		kasus: kasusPublik(kasus, katalog().duniaPer[bahasa]),
		sesi: sesi ? sesiTampil(kasus, sesi) : null
	};
}

export function infoWaktu(url: URL) {
	const tanggal = hariIni(url);
	return {
		server_time: new Date().toISOString(),
		hari_ini: tanggal,
		berikutnya: rilisBerikutnya(tanggal).toISOString(),
		pratinjau
	};
}

/** Isi lengkap "kasus hari ini" untuk satu pemain: dipakai GET /api/kasus/hari-ini dan load halaman. */
export async function dataHariIni(url: URL, pemainId: string, bahasa: Bahasa) {
	const asli = katalog().perTanggal.get(hariIni(url));
	const kasus = asli ? kasusDalam(asli, bahasa) : null;
	const [sesi, statistik] = await Promise.all([
		kasus ? penyimpanan().ambil(pemainId, kasus.id) : null,
		statistikPemain(pemainId, url)
	]);
	return {
		...infoWaktu(url),
		...(kasus ? responsKasus(kasus, sesi, bahasa) : { kasus: null, sesi: null }),
		statistik
	};
}

export type DataHariIni = Awaited<ReturnType<typeof dataHariIni>>;
export type SesiTampil = ReturnType<typeof sesiTampil>;

const STATUS_GALAT: Record<GalatMain, number> = {
	jatah_habis: 409,
	kasus_selesai: 409,
	tuduhan_habis: 409,
	tuduhan_ganda: 409,
	benda_tidak_dikenal: 400,
	pilihan_tidak_valid: 400
};

export function tanganiGalat(e: unknown): Response {
	if (e instanceof GalatPermainan) return json({ error: e.kode }, { status: STATUS_GALAT[e.kode] });
	throw e;
}

export async function bacaBody(request: Request): Promise<Record<string, unknown>> {
	try {
		const b = await request.json();
		if (b && typeof b === 'object') return b as Record<string, unknown>;
	} catch {
		// diteruskan ke error di bawah
	}
	error(400, 'Body harus JSON');
}

export function idDariParam(param: string): number {
	const id = Number(param);
	if (!Number.isInteger(id) || id < 1) error(400, 'id kasus tidak valid');
	return id;
}
