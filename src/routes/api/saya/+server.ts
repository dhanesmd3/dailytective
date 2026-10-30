import { json } from '@sveltejs/kit';
import { statistikPemain } from '$lib/server/layanan';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url, locals }) => json(statistikPemain(locals.pemainId, url));
