import { error, json } from '@sveltejs/kit';
import { penyimpanan } from '$lib/server/store';
import { kasusDalam } from '$lib/engine/terjemahan';
import { katalog, pratinjau } from '$lib/server/layanan';
import type { RequestHandler } from './$types';

/** Daftar semua kasus untuk mode pratinjau lokal. Tidak tersedia di produksi. */
export const GET: RequestHandler = async ({ locals }) => {
	if (!pratinjau) error(404, 'Tidak ditemukan');
	const store = penyimpanan();
	const urut = [...katalog().perTanggal.values()].sort((a, b) => a.tanggal.localeCompare(b.tanggal));
	const status = await Promise.all(urut.map((k) => store.ambil(locals.pemainId, k.id)));
	const daftar = urut.map((k, i) => ({
		id: k.id,
		tanggal: k.tanggal,
		judul: kasusDalam(k, locals.bahasa).judul,
		bintang: k.kesulitan.bintang,
		status: status[i]?.status ?? null
	}));
	return json({ kasus: daftar });
};
