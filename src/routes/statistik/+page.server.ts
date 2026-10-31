import { statistikPemain } from '$lib/server/layanan';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => ({ statistik: await statistikPemain(locals.pemainId, url) });
