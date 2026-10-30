# 04 · Spesifikasi Kasus

*Dailytective · v1.0 · 30 Oktober 2026*

Dokumen ini menjelaskan bagaimana satu kasus disusun, disimpan, dicek, dan diterbitkan. Kualitas kasus adalah inti produk, jadi semua aturan di sini bersifat **wajib**.

---

## 1. Anatomi kasus

```
Kasus
├── Metadata        id, tanggal, judul, jenis, kesulitan
├── Context card    cerita, clue awal
├── Pilihan         siapa[], pakai[], dimana[] (+ kenapa[] di hari Minggu)
├── Pengakuan       (hanya di hari dengan tersangka berbohong)
├── State ruangan   perubahan tampilan ruangan untuk kasus ini
├── Bukti TKP       isi setiap benda: clue, pendukung, atau kosong
├── Solusi          kombinasi yang benar (disimpan terpisah, tidak dikirim ke pemain)
└── Penjelasan      alur logika untuk layar hasil
```

## 2. Jenis clue

Setiap clue punya **teks** (yang dibaca pemain) dan **logika** (yang dibaca solver). Teks dan logika harus menyatakan hal yang sama persis.

| Tipe | Arti | Contoh teks | Logika |
|---|---|---|---|
| `atribut` | Pelaku punya atribut tertentu | "Pelakunya kidal." | `{"tipe":"atribut","atribut":"tangan","nilai":"kidal"}` |
| `atribut_bukan` | Pelaku tidak punya atribut tertentu | "Pelakunya tidak berkacamata." | `{"tipe":"atribut_bukan","atribut":"kacamata","nilai":true}` |
| `fakta` | Satu kategori sudah pasti | "Remah bolu berceceran di meja teras." | `{"tipe":"fakta","dimana":"teras"}` |
| `bukan` | Satu pilihan pasti salah | "Semua sendok bersih dan lengkap." | `{"tipe":"bukan","pakai":"sendok"}` |
| `jika_maka` | Kalau A benar, B juga benar | "Siapa pun yang memakai tangan kosong melakukannya di Dapur." | `{"tipe":"jika_maka","jika":{"pakai":"tangan_kosong"},"maka":{"dimana":"dapur"}}` |
| `alibi` | Kalau tersangka X pelakunya, lokasinya pasti Y | "Dimas tidak keluar dari Ruang Kerja semalaman." | `{"tipe":"jika_maka","jika":{"siapa":"dimas"},"maka":{"dimana":"ruang_kerja"}}` |
| `atribut_kombinasi` | Hubungan atribut dengan pilihan | "Orang setinggi itu tidak mungkin memakai jepit rambut." | `{"tipe":"jika_maka","jika":{"atribut":{"tinggi":"tinggi"}},"maka":{"bukan":{"pakai":"jepit_rambut"}}}` |
| `pengakuan` | Pernyataan tersangka (hari berbohong) | Raka: "Aku tidak pernah masuk Dapur." | `{"tipe":"pengakuan","oleh":"raka","isi":{"bukan":{"dimana":"dapur"}}}` |
| `pendukung` | Memperkuat cerita, tidak diperlukan untuk menyelesaikan | "Rol rambut merah muda tergeletak di samping pot." | `null` |

**Aturan tipe `pendukung`:**
- Boleh mengarah ke jawaban, tapi solver tidak memakainya.
- Tidak boleh bertentangan dengan solusi.
- Maksimal 2 per kasus, supaya pemain tidak merasa dihukum kalau memakainya untuk menebak.

**Yang tidak dipakai di MVP:** clue berbasis urutan waktu yang rumit ("A datang setelah B tapi sebelum C"). Kalau waktu disebut dalam teks, logikanya tetap diterjemahkan ke salah satu tipe di atas.

## 3. Format data

### 3.1 File kasus (dikirim ke pemain)

Disimpan sebagai `cases/2026-11-02.json`. **Tidak berisi solusi.**

```json
{
  "versi_skema": 1,
  "id": 129,
  "tanggal": "2026-11-02",
  "judul": "Bolu Pandan yang Dicuil",
  "jenis": "kejahilan",
  "kesulitan": { "bintang": 1, "label": "Senin" },
  "jatah_periksa": 10,
  "context_card": {
    "cerita": "Nenek membuat bolu pandan untuk arisan besok pagi. Pukul 22.00 ia mendapati sepotong besar sudah hilang. \"Siapa yang tega?\" tanyanya sambil memegang pisau kue.",
    "clue_awal": [
      { "id": "A1", "teks": "Yang mencuil bolu itu kidal." },
      { "id": "A2", "teks": "Siapa pun yang memakai tangan kosong melakukannya di Dapur." },
      { "id": "A3", "teks": "Dimas tidak keluar dari Ruang Kerja sejak pukul 20.00 sampai tengah malam." }
    ]
  },
  "pilihan": {
    "siapa":  ["dimas", "sri", "wati"],
    "pakai":  ["sendok", "pisau_roti", "tangan_kosong"],
    "dimana": ["dapur", "ruang_kerja", "teras"]
  },
  "pengakuan": [],
  "state_ruangan": {
    "teras":  { "tambah": ["piring_kecil_remah", "pisau_di_kursi", "rol_rambut_pink"] },
    "dapur":  { "tambah": ["bolu_di_meja"] }
  },
  "benda": {
    "tk_meja":     { "hasil": "clue",      "id_clue": "B1", "teks": "Remah bolu berceceran di meja teras, di sebelah piring kecil." },
    "dp_rakpiring":{ "hasil": "clue",      "id_clue": "B2", "teks": "Semua sendok bersih dan lengkap. Tidak ada yang dipakai malam ini." },
    "tk_kursi":    { "hasil": "clue",      "id_clue": "B3", "teks": "Ada pisau roti di dudukan kursi rotan. Krim pandan masih menempel." },
    "tk_pot":      { "hasil": "pendukung", "id_clue": "B4", "teks": "Rol rambut merah muda tergeletak di samping pot." },
    "rk_komputer": { "hasil": "pendukung", "id_clue": "B5", "teks": "Game masih menyala. Riwayatnya menunjukkan Dimas bermain tanpa jeda sejak 20.05." },
    "dp_meja":     { "hasil": "clue",      "id_clue": "B6", "teks": "Bolunya di sini. Bekas potongannya rapi dan lurus, bukan dicuil tangan." },
    "dp_wastafel": { "hasil": "clue",      "id_clue": "B7", "teks": "Wastafel kering dan lantai bersih. Tidak ada remah di dapur sama sekali." },
    "rk_sampah":   { "hasil": "clue",      "id_clue": "B8", "teks": "Isinya bungkus keripik dan kertas coretan. Tidak ada remah bolu." },
    "rt_kolong":   { "hasil": "kosong",    "teks": "Cuma satu kaus kaki yang entah milik siapa." },
    "dp_kulkas":   { "hasil": "kosong",    "teks": "Penuh rantang. Si Belang menatapmu penuh harap." }
  },
  "teks_kosong_bawaan": "Kamu memeriksanya dengan teliti, tapi tidak ada yang mencurigakan."
}
```

Benda yang tidak disebut di `benda` otomatis memakai `teks_kosong_bawaan`. Untuk variasi, tulis teks kosong khusus minimal untuk 6–10 benda.

### 3.2 File solusi (hanya di server)

Disimpan terpisah, misalnya `solutions/2026-11-02.json`, dan **tidak pernah** dikirim ke pemain sebelum kasus selesai.

```json
{
  "id": 129,
  "solusi": { "siapa": "wati", "pakai": "pisau_roti", "dimana": "teras" },
  "logika": {
    "A1": { "tipe": "atribut", "atribut": "tangan", "nilai": "kidal" },
    "A2": { "tipe": "jika_maka", "jika": { "pakai": "tangan_kosong" }, "maka": { "dimana": "dapur" } },
    "A3": { "tipe": "jika_maka", "jika": { "siapa": "dimas" }, "maka": { "dimana": "ruang_kerja" } },
    "B1": { "tipe": "fakta", "dimana": "teras" },
    "B2": { "tipe": "bukan", "pakai": "sendok" },
    "B3": { "tipe": "fakta", "pakai": "pisau_roti" },
    "B6": { "tipe": "bukan", "pakai": "tangan_kosong" },
    "B7": { "tipe": "bukan", "dimana": "dapur" },
    "B8": { "tipe": "bukan", "dimana": "ruang_kerja" }
  },
  "penjelasan": [
    { "teks": "Pelakunya kidal, jadi tinggal Dimas atau Bu Wati.", "bukti": ["A1"] },
    { "teks": "Remah bolu ada di meja teras, jadi kejadiannya di Teras.", "bukti": ["B1"] },
    { "teks": "Dimas tidak keluar dari Ruang Kerja, jadi bukan dia. Pelakunya Bu Wati.", "bukti": ["A3", "B1"] },
    { "teks": "Pisau roti berkrim pandan ditemukan di kursi teras.", "bukti": ["B3"] }
  ],
  "komentar_nenek": "Wati, Wati… kalau mau, bilang saja. Nenek kan bikin dua loyang."
}
```

### 3.3 Data karakter, benda, dan barang

Disimpan sekali, dipakai semua kasus:

- `data/karakter.json`: id, nama, peran, atribut tetap (lihat dokumen 03)
- `data/ruangan.json`: id ruangan, nama, daftar benda tetap beserta posisi hotspot
- `data/barang.json`: id, nama, ikon, kelompok

### 3.4 Validasi skema

Setiap kasus wajib lolos pengecekan otomatis:
- [ ] Semua id di `pilihan` ada di data karakter, barang, dan ruangan
- [ ] Jumlah pilihan sesuai kesulitan (3/4/5)
- [ ] Jumlah clue awal sesuai kesulitan (3/2/1)
- [ ] Semua id benda ada di data ruangan
- [ ] Setiap `id_clue` punya logika di file solusi (kecuali `pendukung`)
- [ ] Solusi ada di dalam `pilihan`
- [ ] Tanggal tidak bentrok dengan kasus lain

## 4. Solver

### 4.1 Cara kerja
Jumlah kombinasi sangat kecil (maksimal 5 × 5 × 5 = 125, atau 625 dengan motif), jadi solver cukup **mencoba semua kombinasi** dan mengecek tiap clue.

```
untuk setiap kombinasi (siapa, pakai, dimana):
    lolos = semua clue (yang dipilih) bernilai benar untuk kombinasi ini
    di hari berbohong: pengakuan pelaku harus SALAH,
                       pengakuan tersangka lain harus BENAR
kumpulkan kombinasi yang lolos
```

### 4.2 Pengecekan wajib

| # | Cek | Syarat lolos |
|---|---|---|
| S1 | **Solusi tunggal**: semua clue awal + semua clue TKP | Tepat 1 kombinasi, dan itu solusinya |
| S2 | **Tidak ditebak dari awal**: hanya clue awal | ≥ 3 kombinasi tersisa (Senin) / ≥ 6 (hari lain) |
| S3 | **Bukti minimum**: himpunan clue TKP terkecil yang, bersama clue awal, menghasilkan solusi tunggal | Ukurannya ≤ jatah periksa − 4 (ada ruang untuk salah pilih) |
| S4 | **Lebih dari satu jalur**: banyaknya himpunan bukti minimum yang berbeda | ≥ 2 |
| S5 | **Tidak ada clue tunggal yang langsung menjawab**: tidak ada satu clue TKP yang, bersama clue awal, langsung menyisakan 1 kombinasi | Wajib untuk ★★ dan ★★★ |
| S6 | **Konsistensi**: semua clue bernilai benar untuk solusi | Wajib |
| S7 | **Pendukung tidak menyesatkan**: clue `pendukung` tidak bertentangan dengan solusi | Dicek manual |

### 4.3 Skor kesulitan

Solver juga menghitung angka yang membantu menyetel kesulitan:

| Faktor | Cara hitung |
|---|---|
| Sisa kombinasi setelah clue awal | Makin banyak, makin sulit |
| Ukuran bukti minimum | Makin besar, makin sulit |
| Jumlah jalur | Makin sedikit, makin sulit |
| Rasio benda clue : benda kosong di ruangan yang relevan | Makin kecil, makin sulit |
| Ada pengakuan bohong | +1 tingkat |

Target kasar:

| Bintang | Sisa kombinasi setelah clue awal | Bukti minimum | Jalur |
|---|---|---|---|
| ★☆☆ | 6–12 | 2 | ≥ 3 |
| ★★☆ | 15–35 | 3 | 2–4 |
| ★★★ | 40+ | 4–5 | 2–3 |

Angka ini dikalibrasi ulang setelah beta berdasarkan tingkat menang per hari.

## 5. Contoh kasus lengkap: "Bolu Pandan yang Dicuil" (★☆☆)

Data lengkapnya ada di bagian 3.1 dan 3.2.

### Hasil solver

**Setelah clue awal saja (S2):**
- A1 (kidal) → Siapa ∈ {Dimas, Bu Wati}. Mbok Sri gugur.
- Bu Wati: 3 barang × 3 lokasi = 9, dikurangi kombinasi tangan kosong di luar Dapur (A2) = **7**
- Dimas: lokasi harus Ruang Kerja (A3), dan tangan kosong gugur (A2) = **2**
- Total **9 kombinasi** ✅ (target ★: 6–12)

**Himpunan bukti minimum (S3, S4):**

| Jalur | Bukti | Penalaran |
|---|---|---|
| 1 | B1 + B2 | Teras → Dimas gugur → Bu Wati; bukan sendok, bukan tangan kosong (A2) → pisau roti |
| 2 | B1 + B3 | Teras → Bu Wati; pisau roti langsung |
| 3 | B7 + B8 + B2 | Bukan Dapur, bukan Ruang Kerja → Teras → Bu Wati; bukan sendok → pisau roti |
| 4 | B7 + B8 + B3 | Seperti jalur 3, pisau roti langsung |

- Bukti minimum: **2** ✅ (≤ 10 − 4)
- Jalur: **4** ✅
- Tidak ada satu clue yang langsung menjawab ✅ (B1 sendirian menyisakan 2 kombinasi: Bu Wati + sendok/pisau)

**Benda yang relevan:** 6 benda clue + 2 pendukung, dari 60 benda di rumah.

### Penjelasan di layar hasil
1. Pelakunya kidal, jadi tinggal Dimas atau Bu Wati. *(A1)*
2. Remah bolu ada di meja teras, jadi kejadiannya di Teras. *(B1)*
3. Dimas tidak keluar dari Ruang Kerja, jadi bukan dia. Pelakunya **Bu Wati**. *(A3)*
4. Pisau roti berkrim pandan ditemukan di kursi teras. Alatnya **pisau roti**. *(B3)*

> *"Wati, Wati… kalau mau, bilang saja. Nenek kan bikin dua loyang."*

## 6. Contoh pengakuan (hari berbohong)

Kasus ★★☆ hari Jumat, 4 tersangka. Context card menyebut: *"Salah satu tersangka berbohong."*

| Tersangka | Pengakuan | Logika |
|---|---|---|
| Om Benny | "Aku tidak menyentuh kunci cadangan." | bukan pakai kunci_cadangan |
| Tante Lia | "Aku di Ruang Tamu terus, tidak ke Kamar Nenek." | Lia → bukan Kamar Nenek |
| Raka | "Aku tidak pernah masuk Ruang Kerja." | Raka → bukan Ruang Kerja |
| Mbok Sri | "Sendok dan garpu semua masih di dapur." | bukan sendok, bukan garpu |

Solver menganggap pengakuan pelaku **salah** dan pengakuan tersangka lain **benar**, lalu mengecek S1–S6 seperti biasa. Bukti di TKP harus memungkinkan pemain menemukan pengakuan mana yang bertentangan dengan bukti.

## 7. Panduan menulis kasus

### Langkah
1. **Pilih jenis kasus dan tanggal.** Cek kalender tema dan jadwal kesulitan.
2. **Tentukan solusi lebih dulu**: Siapa, Pakai apa, Di mana.
3. **Pilih pengecoh** untuk tiap kategori. Usahakan ada pengecoh yang masuk akal (tersangka yang kebiasaannya cocok, barang yang mirip fungsinya).
4. **Tulis clue awal** yang mempersempit tanpa menjawab.
5. **Sebar clue TKP** di minimal 3 ruangan. Pastikan ada lebih dari satu jalur.
6. **Tambah 1–2 clue pendukung** untuk rasa cerita.
7. **Tulis teks kosong** yang bervariasi untuk 6–10 benda.
8. **Tentukan state ruangan**: barang apa yang muncul, pindah, atau rusak.
9. **Jalankan solver.** Ulangi langkah 4–5 sampai lolos semua cek.
10. **Tulis penjelasan** dan komentar Nenek.
11. **Playtest** oleh 2–3 orang yang belum tahu jawabannya.

### Gaya bahasa
- Bahasa Indonesia sehari-hari yang rapi. Tidak kaku, tidak terlalu gaul.
- Teks bukti: 1–2 kalimat, maksimal 25 kata. Tulis apa yang *terlihat*, bukan kesimpulannya.
  - ✅ "Remah bolu berceceran di meja teras."
  - ❌ "Ini membuktikan bolu dimakan di teras."
- Nama tokoh ditulis lengkap dengan sapaan: "Om Benny", "Mbok Sri", "Bu Wati".
- Humor ringan boleh, terutama di teks kosong dan komentar Nenek.

### Yang dilarang
- Clue yang butuh pengetahuan dari luar game
- Clue yang bergantung pada kasus sebelumnya
- Memakai atribut tetap secara tidak konsisten
- Clue yang bisa dibaca dua arti
- Menjadikan Nenek tersangka
- Kekerasan grafis, konten seksual, atau stereotip yang merendahkan

## 8. Generator semi-otomatis (P1)

Generator membantu penulis, tidak menggantikannya.

**Input:** jenis kasus, kesulitan, tanggal, dan (opsional) solusi yang diinginkan.

**Proses:**
1. Memilih tersangka, barang, dan lokasi secara acak dari bank (dengan aturan kecocokan per jenis kasus)
2. Memilih solusi
3. Menyusun clue awal dan clue TKP dari templat logika, lalu memasangkannya ke benda yang masuk akal (clue lokasi Teras dipasang di benda Teras, dan seterusnya)
4. Menjalankan solver dan mengulang sampai lolos
5. Menghasilkan draf teks dari templat

**Output:** draf kasus yang lolos solver. Penulis lalu memperbaiki teks, menambah humor dan clue pendukung, dan memeriksa ulang.

## 9. Alur QA dan penerbitan

```
Draf ─► Validasi skema ─► Solver (S1–S6) ─► Review teks ─► Playtest 2–3 orang ─► Dijadwalkan ─► Terbit 06.00 WIB
          ✗ perbaiki        ✗ perbaiki        ✗ perbaiki      ✗ perbaiki
```

### Checklist review manusia
- [ ] Ceritanya masuk akal dan sesuai karakter
- [ ] Teks bukti hanya menyatakan yang terlihat
- [ ] Tidak ada typo
- [ ] Clue pendukung tidak menyesatkan
- [ ] Teks kosong bervariasi dan tidak membocorkan apa-apa
- [ ] Penjelasan mudah diikuti
- [ ] Kesulitan terasa sesuai hari

### Checklist playtest
- [ ] Playtester berhasil menyelesaikan dalam ≤ 8 menit
- [ ] Playtester bisa menjelaskan alasannya, bukan hanya menebak
- [ ] Tidak ada yang merasa dicurangi setelah membaca penjelasan
- [ ] Catat benda mana saja yang diperiksa (untuk menyetel penempatan clue)

### Setelah terbit
- Pantau tingkat menang, rata-rata tebakan, dan benda yang paling sering diperiksa
- Kasus dengan tingkat menang < 50% atau > 95% ditinjau ulang, dan pelajarannya dicatat untuk kasus berikutnya
- Kalau ditemukan kesalahan logika setelah terbit: perbaiki secepatnya, umumkan, dan jangan putus streak pemain yang terdampak

## 10. Kalender tema (awal)

| Periode | Ide kasus |
|---|---|
| Tahun Baru | Kembang api disembunyikan |
| Imlek | Angpao Nenek tertukar |
| Ramadan | Takjil hilang sebelum magrib |
| Lebaran | Nastar sekaleng habis sebelum tamu datang |
| 17 Agustus | Bendera untuk lomba hilang, karung balap disabotase |
| Musim hujan | Jejak lumpur misterius di ruang tamu |
| Hari Guru | Nilai ujian Om Hendra tercoret-coret |
| Natal | Hiasan pohon terang tetangga pecah |
| Tren viral | Disesuaikan minggu itu |
