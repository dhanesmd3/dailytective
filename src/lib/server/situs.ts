// Alamat utama situs untuk canonical, sitemap, dan Open Graph.
// DT_SITUS (mis. https://dailytective.dhanesworo.site) membuat alamat lain seperti *.vercel.app
// menunjuk ke domain utama, supaya Google tidak menganggapnya konten ganda.

import { env } from '$env/dynamic/private';

export function alamatSitus(url: URL): string {
	return (env.DT_SITUS || url.origin).replace(/\/+$/, '');
}

/** Halaman publik yang boleh muncul di mesin pencari. /kasus dan /statistik sengaja tidak. */
export const HALAMAN_PUBLIK = ['/', '/cara-main', '/tentang', '/privasi'];
