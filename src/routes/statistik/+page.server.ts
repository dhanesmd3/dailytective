import { statistikPemain } from '$lib/server/layanan';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url, locals }) => ({ statistik: statistikPemain(locals.pemainId, url) });
