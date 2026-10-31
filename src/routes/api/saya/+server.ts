import { json } from '@sveltejs/kit';
import { statistikPemain } from '$lib/server/layanan';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => json(await statistikPemain(locals.pemainId, url));
