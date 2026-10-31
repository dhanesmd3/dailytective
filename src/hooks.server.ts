import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { error, json, type Handle } from '@sveltejs/kit';
import { PembatasLaju } from '$lib/server/ratelimit';
import { bacaToken, buatToken } from '$lib/server/token';

const COOKIE = 'dt_pemain';
const RAHASIA_DEV = 'dailytective-dev-secret-hanya-untuk-lokal';
const PANJANG_MIN = 32;

/**
 * Rahasia penanda tangan token. Di luar `npm run dev`, DT_SECRET wajib diisi: rahasia bawaan ada di kode
 * (dan di repo), jadi kalau dipakai di server sungguhan siapa pun bisa memalsukan ID pemain.
 */
function rahasia(): string {
	if (env.DT_SECRET && env.DT_SECRET.length >= PANJANG_MIN) return env.DT_SECRET;
	if (dev) return env.DT_SECRET || RAHASIA_DEV;
	console.error(`[dailytective] DT_SECRET belum diatur atau kurang dari ${PANJANG_MIN} karakter. Permintaan ditolak.`);
	error(500, 'Server belum dikonfigurasi');
}

/** Aksi API (periksa, tuduh, mulai): 30 beruntun, terisi 1 per detik per IP. */
const pembatas = new PembatasLaju(30, 1);

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api/') && event.request.method !== 'GET') {
		let ip = 'tidak-diketahui';
		try {
			ip = event.getClientAddress();
		} catch {
			// beberapa adapter tidak menyediakan alamat klien
		}
		if (!pembatas.izinkan(ip)) return json({ error: 'terlalu_banyak' }, { status: 429, headers: { 'retry-after': '5' } });
	}

	const kunci = rahasia();
	let id = bacaToken(event.cookies.get(COOKIE), kunci);
	if (!id) {
		const baru = buatToken(kunci);
		id = baru.id;
		event.cookies.set(COOKIE, baru.token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 365 * 2
		});
	}
	event.locals.pemainId = id;
	return resolve(event);
};
