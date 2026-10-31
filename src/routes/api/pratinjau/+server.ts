import { error, json } from '@sveltejs/kit';
import { penyimpanan } from '$lib/server/store';
import { kasusDalam } from '$lib/engine/terjemahan';
import { katalog, pratinjau } from '$lib/server/layanan';
import type { RequestHandler } from './$types';

/** Daftar semua kasus untuk mode pratinjau lokal. Tidak tersedia di produksi. */
export const GET: RequestHandler = ({ locals }) => {
	if (!pratinjau) error(404, 'Tidak ditemukan');
	const store = penyimpanan();
	const daftar = [...katalog().perTanggal.values()]
		.sort((a, b) => a.tanggal.localeCompare(b.tanggal))
		.map((k) => ({
			id: k.id,
			tanggal: k.tanggal,
			judul: kasusDalam(k, locals.bahasa).judul,
			bintang: k.kesulitan.bintang,
			status: store.ambil(locals.pemainId, k.id)?.status ?? null
		}));
	return json({ kasus: daftar });
};
