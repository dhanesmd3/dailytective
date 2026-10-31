// Teks UI yang butuh sedikit logika (jenis kasus, feedback tuduhan, atribut). Teksnya sendiri ada di i18n/kamus.ts.

import type { Kategori } from '$lib/engine/types';
import type { FungsiT, KunciTeks } from '$lib/i18n';

const JENIS = ['pencurian', 'kehilangan', 'sabotase', 'kejahilan', 'pecah_rusak', 'pembunuhan'] as const;

export function labelJenis(t: FungsiT, jenis: string): { label: string; pakai: string; dimana: string } {
	if (!(JENIS as readonly string[]).includes(jenis)) return { label: jenis, pakai: '', dimana: '' };
	return {
		label: t(`jenis.${jenis}` as KunciTeks),
		pakai: t(`jenis.${jenis}.pakai` as KunciTeks),
		dimana: t(`jenis.${jenis}.dimana` as KunciTeks)
	};
}

export function labelKategori(t: FungsiT, k: Kategori): string {
	return t(`kat.${k}` as KunciTeks);
}

/** Feedback tuduhan salah (GDD bagian 7). Hanya menyebut jumlah, tidak bagian mana. */
export function umpanBalik(t: FungsiT, benar: number, dari: number): string {
	const angka = t.bahasa === 'en' ? ['Zero', 'One', 'Two', 'Three'] : ['Nol', 'Satu', 'Dua', 'Tiga'];
	if (benar === 0) return t('tuduh.meleset');
	if (benar === dari - 1) return t('tuduh.hampir', { n: angka[benar] });
	return t('tuduh.sebagian', { n: angka[benar], m: angka[dari - benar].toLowerCase() });
}

export function labelAtribut(t: FungsiT, a: Record<string, unknown>): { label: string; nilai: string }[] {
	return [
		{ label: t('atr.tinggi'), nilai: `${t(`atr.tinggi.${a.tinggi}` as KunciTeks)} (${a.tinggi_cm} cm)` },
		{ label: t('atr.tangan'), nilai: a.tangan === 'kidal' ? t('atr.kidal') : t('atr.kanan') },
		{ label: t('atr.sepatu'), nilai: String(a.sepatu) },
		{ label: t('atr.rambut'), nilai: String(a.rambut) },
		{ label: t('atr.kacamata'), nilai: a.kacamata ? t('atr.ya') : t('atr.tidak') },
		{ label: t('atr.tinggal'), nilai: a.tinggal_di_rumah ? t('atr.di_rumah') : t('atr.dari_luar') }
	];
}
