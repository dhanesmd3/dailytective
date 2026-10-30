import { json } from '@sveltejs/kit';
import { dataHariIni } from '$lib/server/layanan';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url, locals }) => json(dataHariIni(url, locals.pemainId));
