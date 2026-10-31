// Aturan hidden object (dokumen 05 bagian 6) untuk posisi hotspot di data/ruangan.json.
import { describe, expect, it } from 'vitest';
import { muatDunia } from '../server/data';

const dunia = muatDunia();
const LEBAR = 1200;
const TINGGI = 700;
/** Area klik minimal 48 px di desktop. Ruangan tampil ±880 px lebar, jadi ±64 satuan kanvas. */
const MIN_KANVAS = 64;
const TEPI = 3; // persen

describe.each(dunia.ruangan.filter((r) => r.ilustrasi))('hotspot $nama', (ruang) => {
	const kotak = ruang.benda.map((b) => ({ id: b.id, ...b.posisi! }));

	it('punya 12 benda dan semuanya berposisi', () => {
		expect(ruang.benda).toHaveLength(12);
		expect(ruang.benda.every((b) => b.posisi)).toBe(true);
	});

	it('tidak berada di 3% tepi kanvas', () => {
		for (const k of kotak) {
			expect(k.x, k.id).toBeGreaterThanOrEqual(TEPI);
			expect(k.y, k.id).toBeGreaterThanOrEqual(TEPI);
			expect(k.x + k.w, k.id).toBeLessThanOrEqual(100 - TEPI);
			expect(k.y + k.h, k.id).toBeLessThanOrEqual(100 - TEPI);
		}
	});

	it('cukup besar untuk diklik', () => {
		for (const k of kotak) {
			expect((k.w / 100) * LEBAR, k.id).toBeGreaterThanOrEqual(MIN_KANVAS);
			expect((k.h / 100) * TINGGI, k.id).toBeGreaterThanOrEqual(MIN_KANVAS);
		}
	});

	it('tidak saling bertumpuk', () => {
		const tumpuk: string[] = [];
		for (let i = 0; i < kotak.length; i++)
			for (let j = i + 1; j < kotak.length; j++) {
				const a = kotak[i];
				const b = kotak[j];
				// toleransi 0,05% untuk pembulatan
				if (a.x + a.w > b.x + 0.05 && b.x + b.w > a.x + 0.05 && a.y + a.h > b.y + 0.05 && b.y + b.h > a.y + 0.05)
					tumpuk.push(`${a.id} × ${b.id}`);
			}
		expect(tumpuk).toEqual([]);
	});
});
