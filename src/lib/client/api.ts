// Panggilan API dari browser. Parameter ?tanggal= di URL halaman (mode pratinjau) ikut diteruskan.

import type { BuktiDitemukan, HasilTuduh, StatistikPribadi } from '$lib/engine/permainan';
import type { Kombinasi, Tuduhan } from '$lib/engine/types';
import type { FungsiT, KunciTeks } from '$lib/i18n';
import type { SesiTampil } from '$lib/server/layanan';

export class GalatApi extends Error {
	constructor(
		public status: number,
		public kode: string
	) {
		super(kode);
	}
}

function denganTanggal(path: string): string {
	const tanggal = new URLSearchParams(location.search).get('tanggal');
	return tanggal ? `${path}?tanggal=${encodeURIComponent(tanggal)}` : path;
}

async function panggil<T>(method: string, path: string, body?: unknown): Promise<T> {
	const res = await fetch(denganTanggal(path), {
		method,
		headers: body ? { 'content-type': 'application/json' } : undefined,
		body: body ? JSON.stringify(body) : undefined
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new GalatApi(res.status, data.error ?? data.message ?? `http_${res.status}`);
	return data as T;
}

export const api = {
	mulai: (id: number) => panggil<{ sesi: SesiTampil }>('POST', `/api/kasus/${id}/mulai`),
	periksa: (id: number, benda: string) =>
		panggil<BuktiDitemukan & { sisa_jatah: number }>('POST', `/api/kasus/${id}/periksa`, { benda }),
	tuduh: (id: number, k: Kombinasi) =>
		panggil<HasilTuduh & { tuduhan: Tuduhan[]; statistik?: StatistikPribadi }>('POST', `/api/kasus/${id}/tuduh`, k),
	statistik: () => panggil<StatistikPribadi>('GET', '/api/saya'),
	pratinjau: () =>
		panggil<{ kasus: { id: number; tanggal: string; judul: string; bintang: number; status: string | null }[] }>(
			'GET',
			'/api/pratinjau'
		),
	ulangi: (id: number) => panggil<{ sesi: SesiTampil }>('POST', `/api/kasus/${id}/ulangi`),
	bukaJawaban: (id: number) => panggil<{ sesi: SesiTampil }>('POST', `/api/kasus/${id}/jawaban`),
	resetSesi: (id: number) => panggil<{ ok: true }>('DELETE', `/api/kasus/${id}/sesi`)
};

const KODE_GALAT = [
	'jatah_habis',
	'kasus_selesai',
	'tuduhan_habis',
	'tuduhan_ganda',
	'pilihan_tidak_valid',
	'benda_tidak_dikenal',
	'terlalu_banyak',
	'tidak_bisa_ulang'
];

export function pesanGalat(t: FungsiT, e: unknown): string {
	if (e instanceof GalatApi) return KODE_GALAT.includes(e.kode) ? t(`galat.${e.kode}` as KunciTeks) : t('galat.umum');
	return t('galat.koneksi');
}
