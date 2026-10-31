import { dataHariIni } from '$lib/server/layanan';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url, locals }) => dataHariIni(url, locals.pemainId, locals.bahasa);
