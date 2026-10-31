import { describe, expect, it } from 'vitest';
import { PembatasLaju } from './ratelimit';

describe('PembatasLaju', () => {
	it('mengizinkan sampai kapasitas, lalu menolak, lalu terisi ulang', () => {
		const p = new PembatasLaju(3, 1);
		const t = 1_000_000;
		expect([p.izinkan('ip', t), p.izinkan('ip', t), p.izinkan('ip', t), p.izinkan('ip', t)]).toEqual([true, true, true, false]);
		expect(p.izinkan('ip-lain', t)).toBe(true);
		expect(p.izinkan('ip', t + 1000)).toBe(true);
		expect(p.izinkan('ip', t + 1000)).toBe(false);
	});
});
