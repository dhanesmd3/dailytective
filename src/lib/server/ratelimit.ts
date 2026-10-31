// Rate limit per IP (dokumen 06 bagian 11) dengan token bucket di memori.
// Cukup untuk satu instance server. Kalau nanti berjalan di banyak instance/edge, ganti dengan KV/Redis.

export interface Ember {
	token: number;
	terakhir: number;
}

export class PembatasLaju {
	private ember = new Map<string, Ember>();

	/**
	 * @param kapasitas jumlah permintaan beruntun yang diizinkan
	 * @param perDetik laju isi ulang token
	 */
	constructor(
		private kapasitas: number,
		private perDetik: number
	) {}

	/** true kalau permintaan boleh lanjut. */
	izinkan(kunci: string, sekarang = Date.now()): boolean {
		const e = this.ember.get(kunci) ?? { token: this.kapasitas, terakhir: sekarang };
		e.token = Math.min(this.kapasitas, e.token + ((sekarang - e.terakhir) / 1000) * this.perDetik);
		e.terakhir = sekarang;
		const boleh = e.token >= 1;
		if (boleh) e.token -= 1;
		this.ember.set(kunci, e);
		if (this.ember.size > 10_000) this.bersihkan(sekarang);
		return boleh;
	}

	private bersihkan(sekarang: number): void {
		const penuh = (this.kapasitas / this.perDetik) * 1000;
		for (const [k, e] of this.ember) if (sekarang - e.terakhir > penuh) this.ember.delete(k);
	}
}
