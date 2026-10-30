// Penyimpanan lokal (dokumen 06 bagian 6). Semua akses dibungkus try/catch: kalau localStorage
// tidak tersedia (mode privat, situs diblokir), game tetap jalan dan progres diambil dari server.
// Token pemain TIDAK disimpan di sini; server menyimpannya di cookie httpOnly.

export function baca<T>(kunci: string, cadangan: T): T {
	try {
		const v = localStorage.getItem(kunci);
		return v === null ? cadangan : (JSON.parse(v) as T);
	} catch {
		return cadangan;
	}
}

export function tulis(kunci: string, nilai: unknown): void {
	try {
		localStorage.setItem(kunci, JSON.stringify(nilai));
	} catch {
		// diabaikan: penyimpanan lokal hanya kenyamanan
	}
}

export function hapus(kunci: string): void {
	try {
		localStorage.removeItem(kunci);
	} catch {
		// diabaikan
	}
}

export const KUNCI = {
	onboarding: 'dt_onboarding',
	statistik: 'dt_statistik',
	pengaturan: 'dt_pengaturan',
	sesi: (tanggal: string) => `dt_sesi_${tanggal}`,
	coret: (tanggal: string) => `dt_coret_${tanggal}`
};

export type Tanda = 'x' | '?' | 'v';
