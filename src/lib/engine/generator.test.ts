import { describe, expect, it } from 'vitest';
import { muatDunia } from '../server/data';
import { buatDraf, PENANDA_DRAF } from './generator';
import { analisis, petaKarakter } from './solver';
import { validasiKasus } from './validator';

const dunia = muatDunia();
const kar = petaKarakter(dunia.karakter);

// 2–8 November 2026 = Senin–Minggu
describe.each([
	['2026-11-02', 'kejahilan'],
	['2026-11-03', 'kehilangan'],
	['2026-11-04', 'pencurian'],
	['2026-11-05', 'pecah_rusak'],
	['2026-11-06', 'sabotase'],
	['2026-11-07', 'pencurian'],
	['2026-11-08', 'kehilangan']
] as const)('generator %s (%s)', (tanggal, jenis) => {
	const { kasus } = buatDraf(dunia, { tanggal, jenis, id: 900, seed: 42 });

	it('menghasilkan draf yang lolos solver S1–S6', () => {
		expect(analisis(kasus, kar).lolos).toBe(true);
	});

	it('mengikuti jadwal mingguan dan hanya gagal validasi karena teks [DRAF]', () => {
		const v = validasiKasus(kasus, dunia);
		expect(v.galat).toEqual([expect.stringContaining(PENANDA_DRAF)]);
		const hari = new Date(`${tanggal}T00:00:00Z`).getUTCDay();
		expect(kasus.pengakuan.length > 0).toBe(hari === 5 || hari === 6);
		expect(kasus.pilihan.kenapa !== undefined).toBe(hari === 0);
	});

	it('deterministik untuk seed yang sama', () => {
		expect(buatDraf(dunia, { tanggal, jenis, id: 900, seed: 42 }).kasus).toEqual(kasus);
	});
});
