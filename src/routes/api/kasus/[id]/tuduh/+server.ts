import { json } from '@sveltejs/kit';
import { sesiBaru, tuduh } from '$lib/engine/permainan';
import { penyimpanan } from '$lib/server/store';
import { bacaBody, idDariParam, kasusTerbit, statistikPemain, tanganiGalat } from '$lib/server/layanan';
import type { RequestHandler } from './$types';

/** Validasi tuduhan di server. Solusi hanya ikut di respons kalau kasus selesai. */
export const POST: RequestHandler = async ({ params, url, request, locals }) => {
	const kasus = kasusTerbit(idDariParam(params.id), url, locals.bahasa);
	const body = await bacaBody(request);
	// Mesin yang memutuskan kategori mana yang dipakai kasus ini; field lain dibuang di sana.
	const kombinasi = {
		siapa: String(body.siapa ?? ''),
		pakai: String(body.pakai ?? ''),
		dimana: String(body.dimana ?? ''),
		...(body.kenapa !== undefined ? { kenapa: String(body.kenapa) } : {})
	};

	const store = penyimpanan();
	const sesi = (await store.ambil(locals.pemainId, kasus.id)) ?? sesiBaru(locals.pemainId, kasus, new Date());
	try {
		const r = tuduh(kasus, sesi, kombinasi, new Date());
		await store.simpan(r.sesi);
		return json({
			...r.hasil,
			tuduhan: r.sesi.tuduhan,
			statistik: r.hasil.selesai ? await statistikPemain(locals.pemainId, url) : undefined
		});
	} catch (e) {
		return tanganiGalat(e);
	}
};
