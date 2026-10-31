// Pengaturan pemain (PRD F-72): suara, kontras tinggi, kurangi animasi. Disimpan per perangkat.
// Atribut di <html> juga dipasang lebih awal oleh skrip kecil di app.html supaya tidak berkedip.

import { baca, KUNCI, tulis } from './lokal';

export interface Pengaturan {
	suara: boolean;
	kontrasTinggi: boolean;
	kurangiAnimasi: boolean;
}

const BAWAAN: Pengaturan = { suara: false, kontrasTinggi: false, kurangiAnimasi: false };

export const pengaturan = $state<Pengaturan>({ ...BAWAAN });

export function muatPengaturan(): void {
	Object.assign(pengaturan, BAWAAN, baca<Partial<Pengaturan>>(KUNCI.pengaturan, {}));
	terapkan();
}

export function simpanPengaturan(): void {
	tulis(KUNCI.pengaturan, { ...pengaturan });
	terapkan();
}

function terapkan(): void {
	const html = document.documentElement;
	html.toggleAttribute('data-kontras-tinggi', pengaturan.kontrasTinggi);
	html.toggleAttribute('data-kurangi-animasi', pengaturan.kurangiAnimasi);
}
