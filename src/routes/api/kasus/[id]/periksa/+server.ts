import { error, json } from '@sveltejs/kit';
import { periksa, sesiBaru } from '$lib/engine/permainan';
import { penyimpanan } from '$lib/server/store';
import { bacaBody, idDariParam, kasusTerbit, katalog, tanganiGalat } from '$lib/server/layanan';
import type { RequestHandler } from './$types';

/** Membuka isi SATU benda. Isi benda lain tidak pernah dikirim. */
export const POST: RequestHandler = async ({ params, url, request, locals }) => {
	const kasus = kasusTerbit(idDariParam(params.id), url, locals.bahasa);
	const { benda } = await bacaBody(request);
	if (typeof benda !== 'string') error(400, 'benda wajib diisi');

	const store = penyimpanan();
	const sesi = store.ambil(locals.pemainId, kasus.id) ?? sesiBaru(locals.pemainId, kasus, new Date());
	try {
		const r = periksa(kasus, sesi, benda, katalog().bendaDikenal);
		store.simpan(r.sesi);
		return json({ ...r.bukti, sisa_jatah: r.sisa_jatah });
	} catch (e) {
		return tanganiGalat(e);
	}
};
