import { alamatSitus } from '$lib/server/situs';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, url }) => ({ bahasa: locals.bahasa, situs: alamatSitus(url) });
