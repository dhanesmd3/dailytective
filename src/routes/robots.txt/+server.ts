import { alamatSitus } from '$lib/server/situs';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) =>
	new Response(['User-agent: *', 'Allow: /', 'Disallow: /api/', '', `Sitemap: ${alamatSitus(url)}/sitemap.xml`, ''].join('\n'), {
		headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600' }
	});
