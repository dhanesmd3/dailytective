import { json } from '@sveltejs/kit';
import { sesiBaru } from '$lib/engine/permainan';
import { penyimpanan } from '$lib/server/store';
import { idDariParam, kasusTerbit, sesiTampil } from '$lib/server/layanan';
import type { RequestHandler } from './$types';

/** Memulai sesi (waktu main dihitung dari sini). Aman dipanggil berulang. */
export const POST: RequestHandler = ({ params, url, locals }) => {
	const kasus = kasusTerbit(idDariParam(params.id), url, locals.bahasa);
	const store = penyimpanan();
	let sesi = store.ambil(locals.pemainId, kasus.id);
	if (!sesi) {
		sesi = sesiBaru(locals.pemainId, kasus, new Date());
		store.simpan(sesi);
	}
	return json({ sesi: sesiTampil(kasus, sesi) });
};
