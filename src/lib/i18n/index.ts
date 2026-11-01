// Akses teks dua bahasa. Bahasa aktif datang dari server (cookie dt_bahasa) lewat data layout,
// disimpan di context Svelte supaya aman untuk SSR (tidak ada state global yang dibagi antar-permintaan).

import { getContext, setContext } from 'svelte';
import { BAHASA, KAMUS, type Bahasa, type KunciTeks } from './kamus';

export { BAHASA, type Bahasa, type KunciTeks };

export const COOKIE_BAHASA = 'dt_bahasa';
const KUNCI_KONTEKS = Symbol('bahasa');

export type Param = Record<string, string | number>;
export type FungsiT = ((kunci: KunciTeks, param?: Param) => string) & { readonly bahasa: Bahasa };

export function apakahBahasa(x: unknown): x is Bahasa {
	return typeof x === 'string' && (BAHASA as readonly string[]).includes(x);
}

/** Bahasa bawaan dari header Accept-Language: Indonesia/Melayu → id, selain itu → en. */
export function bahasaDariHeader(header: string | null): Bahasa {
	if (!header) return 'id';
	const utama = header.split(',')[0].trim().toLowerCase();
	return utama.startsWith('id') || utama.startsWith('ms') ? 'id' : 'en';
}

export function terjemah(bahasa: Bahasa, kunci: KunciTeks, param?: Param): string {
	let s = KAMUS[bahasa][kunci] ?? KAMUS.id[kunci] ?? kunci;
	if (param) for (const [k, v] of Object.entries(param)) s = s.replaceAll(`{${k}}`, String(v));
	return s;
}

export function buatT(bahasa: () => Bahasa): FungsiT {
	const t = ((kunci: KunciTeks, param?: Param) => terjemah(bahasa(), kunci, param)) as FungsiT;
	Object.defineProperty(t, 'bahasa', { get: bahasa });
	return t;
}

/** Dipanggil sekali di layout akar. */
export function pasangBahasa(bahasa: () => Bahasa): void {
	setContext(KUNCI_KONTEKS, buatT(bahasa));
}

/** Dipanggil di bagian script komponen: `const t = pakaiT();`, lalu `t('kunci')` di template. */
export function pakaiT(): FungsiT {
	return getContext<FungsiT>(KUNCI_KONTEKS) ?? buatT(() => 'id');
}

/** Mengganti bahasa: simpan di cookie, lalu muat ulang data dari server. */
export async function gantiBahasa(bahasa: Bahasa): Promise<void> {
	document.cookie = `${COOKIE_BAHASA}=${bahasa}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
	const { goto, invalidateAll } = await import('$app/navigation');
	// ?lang= di URL akan mengalahkan cookie di server, jadi dibuang dulu
	const url = new URL(location.href);
	if (url.searchParams.has('lang')) {
		url.searchParams.delete('lang');
		await goto(url, { replaceState: true, invalidateAll: true });
		return;
	}
	await invalidateAll();
}
