// Logika tanggal rilis. Kasus baru aktif pukul 06.00 WIB (UTC+7, tanpa daylight saving) = 23.00 UTC hari sebelumnya.

const JAM = 3600_000;

/** Tanggal kasus yang aktif pada waktu `sekarang`, format YYYY-MM-DD. */
export function tanggalKasusAktif(sekarang: Date): string {
	// 06.00 WIB = 23.00 UTC kemarin, jadi geser +1 jam lalu ambil tanggal UTC-nya.
	return new Date(sekarang.getTime() + JAM).toISOString().slice(0, 10);
}

/** Waktu rilis kasus berikutnya setelah kasus bertanggal `tanggal`. */
export function rilisBerikutnya(tanggal: string): Date {
	const [y, m, d] = tanggal.split('-').map(Number);
	return new Date(Date.UTC(y, m - 1, d, 23, 0, 0));
}

export function tambahHari(tanggal: string, n: number): string {
	const [y, m, d] = tanggal.split('-').map(Number);
	return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const NAMA_BULAN = [
	'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
	'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function indeksHari(tanggal: string): number {
	const [y, m, d] = tanggal.split('-').map(Number);
	return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

const NAMA_HARI_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const NAMA_BULAN_EN = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
];

export function namaHari(tanggal: string, bahasa: 'id' | 'en' = 'id'): string {
	return (bahasa === 'en' ? NAMA_HARI_EN : NAMA_HARI)[indeksHari(tanggal)];
}

export function formatTanggal(tanggal: string, bahasa: 'id' | 'en' = 'id'): string {
	const [y, m, d] = tanggal.split('-').map(Number);
	return bahasa === 'en' ? `${NAMA_BULAN_EN[m - 1]} ${d}, ${y}` : `${d} ${NAMA_BULAN[m - 1]} ${y}`;
}

export function apakahTanggalValid(tanggal: string): boolean {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) return false;
	const [y, m, d] = tanggal.split('-').map(Number);
	const t = new Date(Date.UTC(y, m - 1, d));
	return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

/** Format durasi detik jadi m:ss. */
export function formatDurasi(detik: number): string {
	const m = Math.floor(detik / 60);
	const s = Math.floor(detik % 60);
	return `${m}:${String(s).padStart(2, '0')}`;
}
