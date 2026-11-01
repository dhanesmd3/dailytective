// Tipe data bersama untuk mesin kasus, server, dan UI. Lihat dokumen 04 (Spesifikasi Kasus).

/** 'kenapa' (motif) hanya dipakai di kasus besar hari Minggu (GDD bagian 10). */
export type Kategori = 'siapa' | 'pakai' | 'dimana' | 'kenapa';
export const KATEGORI: readonly Kategori[] = ['siapa', 'pakai', 'dimana', 'kenapa'];

export interface Kombinasi {
	siapa: string;
	pakai: string;
	dimana: string;
	kenapa?: string;
}

export type PilihanKasus = { siapa: string[]; pakai: string[]; dimana: string[]; kenapa?: string[] };

export type JenisKasus =
	| 'pencurian'
	| 'kehilangan'
	| 'sabotase'
	| 'kejahilan'
	| 'pecah_rusak'
	| 'pembunuhan';

export type NilaiAtribut = string | number | boolean;
export type Operator = '=' | '!=' | '<' | '<=' | '>' | '>=';

/** Syarat atas satu kombinasi. Semua field yang diisi harus terpenuhi. */
export interface Kondisi {
	siapa?: string;
	pakai?: string;
	dimana?: string;
	kenapa?: string;
	/** Atribut pelaku, mis. { "tangan": "kidal" }. Atribut "ciri" berarti "punya ciri ini". */
	atribut?: Record<string, NilaiAtribut>;
	/** Negasi: kondisi di dalamnya TIDAK terpenuhi. */
	bukan?: Kondisi;
}

export type Logika =
	| { tipe: 'atribut'; atribut: string; nilai: NilaiAtribut; op?: Operator }
	| { tipe: 'atribut_bukan'; atribut: string; nilai: NilaiAtribut; op?: Operator }
	| { tipe: 'fakta'; siapa?: string; pakai?: string; dimana?: string; kenapa?: string }
	| { tipe: 'bukan'; siapa?: string; pakai?: string; dimana?: string; kenapa?: string }
	| { tipe: 'jika_maka'; jika: Kondisi; maka: Kondisi | Kondisi[] };

export interface ClueAwal {
	id: string;
	teks: string;
}

/**
 * Pernyataan tersangka di hari berbohong (GDD bagian 10). Logikanya ada di `logika[id]`.
 * Tepat satu pengakuan bohong, dan pembohongnya selalu pelaku.
 */
export interface Pengakuan {
	id: string;
	oleh: string;
	teks: string;
}

export type HasilBenda = 'clue' | 'pendukung' | 'kosong';

export interface IsiBenda {
	hasil: HasilBenda;
	id_clue?: string;
	teks: string;
}

export type Waktu = 'malam' | 'siang' | 'sore';

export interface StateRuangan {
	/** Benda sementara (lapisan 4) yang digambar di ruangan untuk kasus ini. Dekorasi, tidak bisa diklik. */
	tambah?: string[];
	/** Posisi Si Belang. */
	belang?: string;
	waktu?: Waktu;
}

export interface Penjelasan {
	teks: string;
	bukti: string[];
}

/** Satu file kasus di folder `kasus/`. Berisi bagian publik DAN bagian rahasia; server yang memisahkannya. */
export interface KasusFile {
	versi_skema: 1;
	id: number;
	tanggal: string;
	judul: string;
	jenis: JenisKasus;
	kesulitan: { bintang: 1 | 2 | 3; label: string };
	jatah_periksa: number;
	context_card: { cerita: string; clue_awal: ClueAwal[] };
	pilihan: PilihanKasus;
	pengakuan: Pengakuan[];
	state_ruangan: Record<string, StateRuangan>;
	benda: Record<string, IsiBenda>;
	teks_kosong_bawaan: string;
	// --- rahasia: tidak pernah dikirim ke pemain sebelum kasus selesai ---
	solusi: Kombinasi;
	logika: Record<string, Logika>;
	penjelasan: Penjelasan[];
	komentar_nenek: string;
	/** Terjemahan teks kasus, per kode bahasa. Yang tidak diterjemahkan memakai teks Indonesia. */
	terjemahan?: Partial<Record<'en', TerjemahanKasus>>;
}

export interface TerjemahanKasus {
	judul?: string;
	cerita?: string;
	clue_awal?: Record<string, string>;
	pengakuan?: Record<string, string>;
	benda?: Record<string, string>;
	teks_kosong_bawaan?: string;
	/** Urutan sama dengan `penjelasan` di kasus. */
	penjelasan?: string[];
	komentar_nenek?: string;
}

// --- Data dunia (folder data/) ---

export interface AtributKarakter {
	tinggi: 'tinggi' | 'sedang' | 'pendek';
	tinggi_cm: number;
	tangan: 'kidal' | 'kanan';
	sepatu: number;
	rambut: string;
	kacamata: boolean;
	kelamin: 'L' | 'P';
	tinggal_di_rumah: boolean;
}

export interface Karakter {
	id: string;
	nama: string;
	peran: string;
	usia: number;
	atribut: AtributKarakter;
	ciri: string[];
	kebiasaan: string;
	en?: { nama: string; peran: string; rambut: string; kebiasaan: string };
}

export interface Barang {
	id: string;
	nama: string;
	nama_en?: string;
	kelompok: string;
}

export interface Motif {
	id: string;
	nama: string;
	nama_en?: string;
}

export interface Lokasi {
	id: string;
	nama: string;
	nama_en?: string;
	jenis: 'ruangan' | 'titik';
	ruangan?: string;
}

export interface PosisiHotspot {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface BendaRuangan {
	id: string;
	nama: string;
	nama_en?: string;
	posisi?: PosisiHotspot;
}

export interface Ruangan {
	id: string;
	nama: string;
	nama_en?: string;
	ilustrasi: boolean;
	benda: BendaRuangan[];
}

export interface DataDunia {
	karakter: Karakter[];
	barang: Barang[];
	lokasi: Lokasi[];
	motif: Motif[];
	ruangan: Ruangan[];
}

// --- Sesi main ---

export interface Tuduhan extends Kombinasi {
	benar: number;
}

export type StatusSesi = 'berjalan' | 'menang' | 'kalah';

export interface Sesi {
	pemain_id: string;
	kasus_id: number;
	tanggal: string;
	periksa: string[];
	tuduhan: Tuduhan[];
	status: StatusSesi;
	mulai_at: string;
	selesai_at: string | null;
	/** Percobaan ke berapa. Tidak ada = 1 (belum pernah mengulang). */
	percobaan?: number;
	/** Hasil percobaan pertama. Statistik, streak, dan teks share memakai ini, bukan percobaan ulang. */
	pertama?: RingkasanPercobaan;
	/** Pemain yang gagal memilih melihat jawaban. Sesudahnya kasus tidak bisa diulang. */
	jawaban_dibuka?: boolean;
}

export type RingkasanPercobaan = Pick<Sesi, 'periksa' | 'tuduhan' | 'status' | 'mulai_at' | 'selesai_at'>;
