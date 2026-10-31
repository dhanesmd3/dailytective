// Panggilan API dari browser. Parameter ?tanggal= di URL halaman (mode pratinjau) ikut diteruskan.

import type { BuktiDitemukan, HasilTuduh, StatistikPribadi } from '$lib/engine/permainan';
import type { Kombinasi, Tuduhan } from '$lib/engine/types';
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
	resetSesi: (id: number) => panggil<{ ok: true }>('DELETE', `/api/kasus/${id}/sesi`)
};

export const PESAN_GALAT: Record<string, string> = {
	jatah_habis: 'Jatah periksa sudah habis. Saatnya menuduh!',
	kasus_selesai: 'Kasus ini sudah selesai.',
	tuduhan_habis: 'Kesempatan menuduh sudah habis.',
	tuduhan_ganda: 'Kombinasi itu sudah pernah kamu tuduhkan.',
	pilihan_tidak_valid: 'Pilihan tuduhan tidak valid.',
	benda_tidak_dikenal: 'Benda itu tidak bisa diperiksa.',
	terlalu_banyak: 'Pelan-pelan, Detektif. Coba lagi beberapa detik lagi.'
};

export function pesanGalat(e: unknown): string {
	if (e instanceof GalatApi) return PESAN_GALAT[e.kode] ?? 'Ada masalah. Coba lagi sebentar.';
	return 'Butuh koneksi untuk menyelidiki. Coba lagi.';
}
