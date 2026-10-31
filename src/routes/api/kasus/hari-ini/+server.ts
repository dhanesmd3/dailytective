import { json } from '@sveltejs/kit';
import { dataHariIni } from '$lib/server/layanan';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => json(await dataHariIni(url, locals.pemainId, locals.bahasa));
