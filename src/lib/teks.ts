// Teks UI yang dipakai berulang. Dipisah dari komponen supaya mudah disunting dan diterjemahkan nanti.

export const JENIS: Record<string, { label: string; pakai: string; dimana: string }> = {
	pencurian: { label: 'Pencurian', pakai: 'alat untuk mengambil atau membuka', dimana: 'tempat barang disembunyikan' },
	kehilangan: { label: 'Kehilangan', pakai: 'wadah atau cara membawa', dimana: 'tempat barang akhirnya berada' },
	sabotase: { label: 'Sabotase', pakai: 'bahan atau alat sabotase', dimana: 'tempat sabotase dilakukan' },
	kejahilan: { label: 'Kejahilan', pakai: 'alat yang dipakai', dimana: 'tempat kejadian' },
	pecah_rusak: { label: 'Pecah/rusak', pakai: 'benda penyebab', dimana: 'ruangan kejadian' },
	pembunuhan: { label: 'Pembunuhan', pakai: 'senjata', dimana: 'lokasi' }
};

/** Feedback tuduhan salah (GDD bagian 7). Hanya menyebut jumlah, tidak bagian mana. */
export function umpanBalik(benar: number, dari: number): string {
	const angka = ['Nol', 'Satu', 'Dua', 'Tiga'];
	if (benar === 0) return 'Meleset semua. Tidak ada satu pun yang tepat.';
	if (benar === dari - 1) return `Hampir! ${angka[benar]} bagian tepat.`;
	return `${angka[benar]} bagian tepat, ${angka[dari - benar].toLowerCase()} lainnya salah.`;
}

export const KATEGORI_LABEL = { siapa: 'Siapa', pakai: 'Pakai apa', dimana: 'Di mana', kenapa: 'Kenapa' } as const;

export const ONBOARDING = [
	{ judul: 'Setiap hari ada satu kasus di rumah Nenek.', isi: 'Kasus baru terbit pukul 06.00 WIB. Semua pemain mendapat kasus yang sama.' },
	{ judul: 'Periksa benda untuk menemukan bukti. Jatahmu terbatas!', isi: 'Memeriksa benda baru memakai satu jatah. Memeriksa ulang gratis. Pilih dengan cermat.' },
	{ judul: 'Tebak Siapa, Pakai apa, dan Di mana. Kamu punya 3 kesempatan.', isi: 'Kalau salah, kamu diberi tahu berapa bagian yang tepat, tapi tidak bagian yang mana.' }
];

export function labelAtribut(a: Record<string, unknown>): { label: string; nilai: string }[] {
	const tinggi = { tinggi: 'Tinggi', sedang: 'Sedang', pendek: 'Pendek' } as Record<string, string>;
	return [
		{ label: 'Tinggi', nilai: `${tinggi[String(a.tinggi)] ?? a.tinggi} (${a.tinggi_cm} cm)` },
		{ label: 'Tangan', nilai: a.tangan === 'kidal' ? 'Kidal' : 'Kanan' },
		{ label: 'Sepatu', nilai: String(a.sepatu) },
		{ label: 'Rambut', nilai: String(a.rambut) },
		{ label: 'Kacamata', nilai: a.kacamata ? 'Ya' : 'Tidak' },
		{ label: 'Tinggal', nilai: a.tinggal_di_rumah ? 'Di rumah ini' : 'Dari luar' }
	];
}
