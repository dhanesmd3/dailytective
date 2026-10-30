// Tipe data bersama untuk mesin kasus, server, dan UI. Lihat dokumen 04 (Spesifikasi Kasus).

export type Kategori = 'siapa' | 'pakai' | 'dimana';
export const KATEGORI: readonly Kategori[] = ['siapa', 'pakai', 'dimana'];

export type Kombinasi = Record<Kategori, string>;

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
	/** Atribut pelaku, mis. { "tangan": "kidal" }. Atribut "ciri" berarti "punya ciri ini". */
	atribut?: Record<string, NilaiAtribut>;
	/** Negasi: kondisi di dalamnya TIDAK terpenuhi. */
	bukan?: Kondisi;
}

export type Logika =
	| { tipe: 'atribut'; atribut: string; nilai: NilaiAtribut; op?: Operator }
	| { tipe: 'atribut_bukan'; atribut: string; nilai: NilaiAtribut; op?: Operator }
	| { tipe: 'fakta'; siapa?: string; pakai?: string; dimana?: string }
	| { tipe: 'bukan'; siapa?: string; pakai?: string; dimana?: string }
	| { tipe: 'jika_maka'; jika: Kondisi; maka: Kondisi | Kondisi[] };

export interface ClueAwal {
	id: string;
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
	pilihan: Record<Kategori, string[]>;
	pengakuan: unknown[];
	state_ruangan: Record<string, StateRuangan>;
	benda: Record<string, IsiBenda>;
	teks_kosong_bawaan: string;
	// --- rahasia: tidak pernah dikirim ke pemain sebelum kasus selesai ---
	solusi: Kombinasi;
	logika: Record<string, Logika>;
	penjelasan: Penjelasan[];
	komentar_nenek: string;
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
}

export interface Barang {
	id: string;
	nama: string;
	kelompok: string;
}

export interface Lokasi {
	id: string;
	nama: string;
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
	posisi?: PosisiHotspot;
}

export interface Ruangan {
	id: string;
	nama: string;
	ilustrasi: boolean;
	benda: BendaRuangan[];
}

export interface DataDunia {
	karakter: Karakter[];
	barang: Barang[];
	lokasi: Lokasi[];
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
}
