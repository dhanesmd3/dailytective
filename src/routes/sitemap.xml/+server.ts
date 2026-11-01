import { alamatSitus, HALAMAN_PUBLIK } from '$lib/server/situs';
import type { RequestHandler } from './$types';

/** Setiap halaman publik dalam dua bahasa, saling terhubung lewat hreflang. */
export const GET: RequestHandler = ({ url }) => {
	const situs = alamatSitus(url);
	const entri = HALAMAN_PUBLIK.flatMap((path) => {
		const id = situs + path;
		const en = `${id}?lang=en`;
		const alternatif = [
			`<xhtml:link rel="alternate" hreflang="id" href="${id}"/>`,
			`<xhtml:link rel="alternate" hreflang="en" href="${en}"/>`,
			`<xhtml:link rel="alternate" hreflang="x-default" href="${id}"/>`
		].join('');
		const frekuensi = path === '/' ? 'daily' : 'monthly';
		return [id, en].map((loc) => `<url><loc>${loc}</loc>${alternatif}<changefreq>${frekuensi}</changefreq></url>`);
	});
	const xml =
		'<?xml version="1.0" encoding="UTF-8"?>\n' +
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
		entri.join('\n') +
		'\n</urlset>\n';
	return new Response(xml, {
		headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' }
	});
};
