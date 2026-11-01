import { error, json } from '@sveltejs/kit';
import { ulangi } from '$lib/engine/permainan';
import { penyimpanan } from '$lib/server/store';
import { idDariParam, kasusTerbit, sesiTampil, tanganiGalat } from '$lib/server/layanan';
import type { RequestHandler } from './$types';

/** Setelah gagal (dan jawaban belum dibuka): mulai lagi dengan jatah dan tuduhan penuh. */
export const POST: RequestHandler = async ({ params, url, locals }) => {
	const kasus = kasusTerbit(idDariParam(params.id), url, locals.bahasa);
	const store = penyimpanan();
	const sesi = await store.ambil(locals.pemainId, kasus.id);
	if (!sesi) error(404, 'Sesi tidak ditemukan');
	try {
		const baru = ulangi(sesi, new Date());
		await store.simpan(baru);
		return json({ sesi: sesiTampil(kasus, baru) });
	} catch (e) {
		return tanganiGalat(e);
	}
};
