import { error, json } from '@sveltejs/kit';
import { penyimpanan } from '$lib/server/store';
import { idDariParam, kasusTerbit, pratinjau } from '$lib/server/layanan';
import type { RequestHandler } from './$types';

/** Hanya untuk pratinjau: hapus sesi supaya kasus bisa dimainkan ulang. */
export const DELETE: RequestHandler = ({ params, url, locals }) => {
	if (!pratinjau) error(404, 'Tidak ditemukan');
	const kasus = kasusTerbit(idDariParam(params.id), url);
	penyimpanan().hapus(locals.pemainId, kasus.id);
	return json({ ok: true });
};
