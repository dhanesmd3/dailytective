// ID pemain anonim sebagai token bertanda tangan HMAC: "<uuid>.<tanda tangan>".
// Pemain tidak bisa memalsukan ID orang lain tanpa mengetahui DT_SECRET.

import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

function tandaTangan(id: string, rahasia: string): string {
	return createHmac('sha256', rahasia).update(id).digest('base64url');
}

export function buatToken(rahasia: string): { id: string; token: string } {
	const id = randomUUID();
	return { id, token: `${id}.${tandaTangan(id, rahasia)}` };
}

/** Mengembalikan ID pemain kalau token sah, atau null. */
export function bacaToken(token: string | undefined, rahasia: string): string | null {
	if (!token) return null;
	const titik = token.lastIndexOf('.');
	if (titik < 1) return null;
	const id = token.slice(0, titik);
	const ttd = Buffer.from(token.slice(titik + 1));
	const seharusnya = Buffer.from(tandaTangan(id, rahasia));
	if (ttd.length !== seharusnya.length || !timingSafeEqual(ttd, seharusnya)) return null;
	return id;
}
