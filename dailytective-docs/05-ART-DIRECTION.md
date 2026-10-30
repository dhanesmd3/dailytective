# 05 · Art Direction

*Dailytective · v1.0 · 30 Oktober 2026*

---

## 1. Arah visual

**Kata kunci:** board game di meja kayu · karikatur jenaka · hangat · rumah Indonesia · misteri ringan

**Bayangan besarnya:** pemain seolah duduk di depan papan permainan detektif di atas meja kayu, di malam hari. Semua elemen terasa seperti benda fisik: kartu karton, token, papan bermotif, stempel tinta. Ilustrasi ruangan dan tokoh bergaya **karikatur** seperti ilustrasi di kotak dan kartu board game: proporsi dilebih-lebihkan, garis tepi tegas, warna datar dengan bayangan sederhana.

**Bukan:** horor, realistis, gelap pekat, gaya anime, atau gaya flat korporat yang dingin.

**Referensi:** mockup di canvas desain **Daily Mystery Board Game** (TKP interior, papan tersangka, hasil, versi desktop).

## 2. Warna

### Palet utama

| Token | Hex | Nama | Pemakaian |
|---|---|---|---|
| `--kayu-gelap` | `#2B1D14` | Meja kayu | Latar halaman |
| `--kayu-garis` | `#2F2017` | Serat kayu | Garis motif latar |
| `--tinta` | `#1F1812` | Tinta | Garis tepi, teks di atas krem, bayangan kartu |
| `--krem` | `#F4E7C9` | Karton | Kartu, panel, teks di atas latar gelap |
| `--krem-redup` | `#CDB89A` | Karton tua | Teks sekunder di latar gelap |
| `--mustard` | `#E2A72E` | Mustard | Aksen utama, bukti, tombol sekunder, nomor kasus |
| `--merah-bata` | `#B23A2A` | Merah bata | Tombol TUDUH, stempel, tuduhan salah, coretan |
| `--hijau-tua` | `#2E6B5E` | Hijau botol | Furnitur, aksen sekunder |
| `--hijau-sukses` | `#2E6B47` | Hijau daun | Kasus terpecahkan |
| `--biru-malam` | `#3E5C8A` | Biru malam | Aksen sekunder, langit malam |
| `--coklat-teks` | `#6B5643` | Coklat | Label di atas kartu krem |

### Warna status
| Status | Warna | Catatan |
|---|---|---|
| Benda berisi bukti | Lingkaran `--mustard` dengan garis `--tinta` | Selalu ditambah ikon/nomor, tidak hanya warna |
| Benda kosong | Garis putus-putus `--tinta` + lapisan gelap 14% | Bentuk garis berbeda dari bukti, tidak hanya warna |
| Terpilih | Garis `--merah-bata` | – |
| Tuduhan salah | `--merah-bata` | Disertai teks "X dari 3 benar" |
| Tuduhan benar | `--hijau-sukses` | Disertai teks |

### Aturan
- Teks di atas `--kayu-gelap` memakai `--krem` (kontras tinggi) atau `--krem-redup` untuk teks sekunder.
- Teks di atas `--krem` memakai `--tinta` atau `--coklat-teks`.
- **Teks putih/krem di atas `--mustard` dilarang** karena kontrasnya tidak cukup. Pakai `--tinta`.
- Status tidak boleh dibedakan dengan warna saja. Selalu sertakan bentuk, ikon, atau teks.
- Semua pasangan warna teks–latar wajib lolos WCAG AA (4,5:1 untuk teks biasa).

## 3. Tipografi

| Peran | Font | Ukuran desktop | Ukuran HP | Catatan |
|---|---|---|---|---|
| Logo & judul besar | **Alfa Slab One** | 32–40 px | 22–28 px | Hanya untuk judul, label kartu, tombol utama |
| Label kartu / tombol utama | Alfa Slab One | 14–16 px | 13–15 px | Huruf kapital, `letter-spacing` 0,5–1 px |
| Teks isi | **Work Sans** 400–500 | 15–16 px | 14–15 px | Tinggi baris 1,4–1,5 |
| Teks tebal / nama | Work Sans 600–700 | 14–17 px | 13–15 px | – |
| Teks kecil / label | Work Sans 600 | 12–13 px | 12 px | Minimum 12 px |

Kedua font tersedia gratis di Google Fonts dengan lisensi Open Font License.

## 4. Elemen papan permainan

| Elemen | Gaya |
|---|---|
| **Latar** | Serat kayu gelap dengan garis horizontal halus |
| **Kartu** | Krem, garis tepi `--tinta` 2–3 px, sudut 8–10 px, bayangan padat ke bawah 3–5 px (tanpa blur) |
| **Token** | Lingkaran krem bergaris tinta dengan bayangan padat |
| **Bingkai papan** | Pola kotak-kotak mustard/krem, seperti tepi papan board game |
| **Stempel** | Teks Alfa Slab One di dalam kotak bergaris merah bata, miring 6–10° |
| **Tombol utama** | Seperti tombol karton: warna penuh, garis tinta, bayangan padat; saat ditekan, bayangan hilang dan tombol turun 2 px |
| **Chip ruangan** | Pil bergaris mustard; yang aktif terisi mustard |
| **Ikon** | Garis tebal (2 px pada 24 px), ujung membulat, tanpa emoji di UI |

**Hindari:** gradien warna-warni, efek kaca (*glassmorphism*), bayangan blur yang lembut, kartu dengan garis aksen di sisi kiri.

## 5. Gaya karikatur tokoh

### Prinsip
1. **Satu ciri utama yang dilebih-lebihkan** per tokoh (kepala botak Om Benny, sanggul tinggi Tante Lia, kacamata tebal Om Hendra).
2. **Siluet harus bisa dikenali** meski hanya berupa bayangan hitam.
3. **Kepala besar, badan kecil** (rasio kepala ±1:2,5), seperti ilustrasi kartu board game.
4. **Garis tepi tinta** 2,5–3 px pada ukuran kartu, dengan ketebalan sedikit bervariasi agar terasa digambar tangan.
5. **Warna datar + satu tingkat bayangan.** Tanpa tekstur rumit.
6. Atribut yang dipakai sebagai clue **wajib terlihat jelas**: kacamata, rambut, dan, di potret seluruh badan, tangan yang memegang barang sesuai tangan dominan.

### Atribut visual wajib per tokoh

| Tokoh | Wajib terlihat |
|---|---|
| Om Benny | Botak, kumis tebal, perut buncit, batik, jam emas |
| Tante Lia | Sanggul tinggi, lipstik merah bata, anting besar, tas tangan |
| Om Hendra | Kacamata tebal, rambut ikal beruban, kardigan, pulpen di saku |
| Dimas | Gondrong diikat, hoodie, headphone di leher, kantung mata |
| Sekar | Jilbab pastel, kacamata bulat, buku tebal |
| Mbok Sri | Sanggul kecil, celemek, lap di bahu, sandal jepit |
| Pak Tono | Cepak, seragam satpam, topi, renteng kunci |
| Pak Joko | Caping, handuk di leher, sepatu bot, kulit terbakar matahari |
| Bu Wati | Rol rambut, daster bunga, kacamata di ujung hidung, kipas |
| Raka | Rambut klimis, kemeja motif, HP di tangan |
| Nenek | Sanggul putih, kebaya, kacamata tergantung, tongkat |
| Si Belang | Kucing oranye-putih, gemuk |

### Sistem modular
Tokoh dirakit dari lapisan terpisah supaya konsisten dan mudah ditambah:

```
latar kartu
└── badan & baju
    └── leher & aksesoris leher (handuk, headphone)
        └── kepala (bentuk wajah, warna kulit)
            └── telinga
                └── mata (dapat diganti per ekspresi)
                    └── alis (dapat diganti per ekspresi)
                        └── hidung
                            └── mulut (dapat diganti per ekspresi)
                                └── kumis / janggut
                                    └── rambut / jilbab / caping / topi
                                        └── kacamata
```

### Ekspresi
| Ekspresi | Dipakai di | Ciri |
|---|---|---|
| Normal | Context card, papan tuduhan | Senyum tipis, khas tiap tokoh |
| Gugup | Saat dipilih di papan tuduhan | Keringat, mata melirik, senyum kaku |
| Tertangkap | Layar hasil (pelaku) | Kaget, mulut terbuka, atau malu-malu |

## 6. Ilustrasi ruangan

### Sudut pandang
- **Tampak depan** sedikit dari atas, seperti panggung teater: dinding belakang, lantai, furnitur di depan.
- Rasio kanvas utama **12:7** (contoh: 2160 × 1260 px). Di desktop tampil penuh; di HP bisa digeser ke samping.
- Area penting (benda yang bisa diklik) tidak boleh berada di 3% tepi kanvas.

### Aturan *hidden object*
1. **Kepadatan seimbang:** ±12 benda yang bisa diklik di antara ±10–20 benda dekorasi.
2. **Tidak ada yang mencolok:** benda yang bisa diklik digambar dengan gaya, kecerahan, dan ketebalan garis yang sama dengan dekorasi.
3. **Ukuran minimum:** area klik setiap benda minimal **44 × 44 px** pada tampilan HP (lebar kanvas 720 px) dan **48 × 48 px** di desktop.
4. **Tidak tumpang tindih:** area klik antar benda tidak boleh bertumpuk.
5. **Detail clue harus terbaca** di ukuran tampilan HP (contoh: bekas lipstik di cangkir minimal 6 px).

### Lapisan
Setiap ruangan dibuat berlapis supaya bisa diubah per kasus tanpa digambar ulang:

| Lapisan | Isi | Berubah per kasus? |
|---|---|---|
| 1. Arsitektur | Dinding, lantai, jendela, pintu | Tidak |
| 2. Furnitur tetap | Sofa, lemari, rak, meja | Tidak |
| 3. Benda tetap | Jam, lukisan, telepon, dll. | Kadang (pindah posisi, pecah) |
| 4. Benda sementara | Cangkir, piring, jejak lumpur, barang kasus | Ya |
| 5. Pencahayaan | Siang, sore, malam | Ya |
| 6. Si Belang | Posisi berganti | Ya |

### Waktu
- **Malam** (default kebanyakan kasus): jendela gelap dengan bulan, lampu kuning hangat
- **Siang:** jendela terang, bayangan lebih pendek
- **Sore:** cahaya oranye dari jendela

## 7. Daftar aset MVP

| Aset | Jumlah | Format | Ukuran sumber |
|---|---|---|---|
| Logo Dailytective (horizontal, ikon) | 2 | SVG | Vektor |
| Ikon aplikasi (PWA) | 1 set | PNG | 512, 192, 180, 32 px |
| Gambar preview link (OG) | 1 + 1 per kasus (otomatis) | PNG | 1200 × 630 |
| Potret tokoh (setengah badan) × 3 ekspresi | 11 × 3 | SVG atau WebP | 600 × 600 |
| Ikon tokoh (kepala) | 11 | SVG | 128 × 128 |
| Si Belang (beberapa pose) | 4 | SVG/WebP | Sesuai ruangan |
| Ruangan (arsitektur + furnitur + benda tetap) | 5 | SVG berlapis atau WebP per lapisan | 2160 × 1260 |
| Variasi pencahayaan | 5 × 3 | Lapisan overlay | 2160 × 1260 |
| Benda sementara (bank awal) | ±40 | SVG/WebP | Sesuai ukuran di ruangan |
| Ikon barang ("Pakai apa") | 36 | SVG | 96 × 96 |
| Ikon lokasi ("Di mana") | 5 | SVG | 96 × 96 |
| Kartu context card (bingkai map kasus) | 1 | SVG | – |
| Stempel (TERBUKTI, KASUS DITUTUP) | 2 | SVG | – |
| Kartu hasil untuk share | Templat | HTML/SVG yang dirender jadi PNG | 1080 × 1080, 1080 × 1920 |
| Ilustrasi onboarding | 3 | SVG/WebP | 1200 × 800 |

### Konvensi nama file
```
karakter/benny_normal.svg
karakter/benny_gugup.svg
karakter/benny_tertangkap.svg
ruangan/ruang-tamu/01_arsitektur.svg
ruangan/ruang-tamu/03_benda_rt_jam.svg
benda-sementara/cangkir_lipstik.svg
barang/kunci_cadangan.svg
```
ID di nama file harus sama dengan ID di data (`data/karakter.json`, `data/ruangan.json`, `data/barang.json`).

## 8. Animasi

| Momen | Animasi | Durasi |
|---|---|---|
| Membuka context card | Map kasus terbuka dari bawah | 300 ms |
| Memeriksa benda | Lingkaran kecil berdenyut di titik klik | 200 ms |
| Bukti ditemukan | Kartu bukti meluncur masuk, cahaya mustard di benda | 300 ms |
| Memilih kartu tuduhan | Kartu naik 4 px | 120 ms |
| Tuduhan salah | Papan bergetar pelan, stempel "X DARI 3" | 400 ms |
| Kasus terpecahkan | Stempel TERBUKTI menghentak + konfeti kertas kecil | 600 ms |

Semua animasi dimatikan atau disederhanakan saat pengaturan **Kurangi animasi** aktif, atau saat sistem operasi meminta `prefers-reduced-motion`.

## 9. Brief singkat untuk ilustrator

> Kami membuat game detektif harian bernama **Dailytective**, berlatar rumah Nenek di Indonesia. Gaya yang kami cari adalah **karikatur ala ilustrasi board game**: kepala besar, satu ciri wajah yang dilebih-lebihkan, garis tepi tinta tegas, warna datar dengan satu tingkat bayangan, nuansa hangat dan jenaka.
>
> Pekerjaan tahap 1: **11 tokoh** (masing-masing 3 ekspresi, dibuat modular berlapis) dan **5 ruangan interior** tampak depan berlapis, dengan ±12 benda yang bisa diklik per ruangan yang menyatu dengan dekorasi.
>
> Lampiran: dokumen 03 (profil tokoh dan daftar benda), dokumen 05 (palet, aturan), dan mockup layar.
>
> Hak cipta semua aset diserahkan penuh kepada pemilik Dailytective.
