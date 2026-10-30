# 02 · Game Design Document

*Dailytective · v1.0 · 30 Oktober 2026*

---

## 1. Inti permainan

**Satu kalimat:** Setiap hari ada satu kejadian di rumah Nenek. Selidiki ruangannya, lalu tebak siapa pelakunya, pakai apa, dan di mana.

**Fantasi pemain:** "Aku detektif yang jeli. Aku menemukan apa yang dilewatkan orang lain, dan aku memecahkan kasus dengan logika, bukan tebakan."

**Tiga pilar:**
1. **Menjelajah:** clue harus dicari, tidak diberikan begitu saja.
2. **Menalar:** semua clue saling mengunci menuju satu jawaban.
3. **Ritual harian:** singkat, sekali sehari, dan seru untuk dibandingkan dengan orang lain.

## 2. Alur satu sesi

```
Beranda ─► Context card ─► TKP ◄──► Papan tuduhan ─► Hasil & share
                            ▲            │
                            └────────────┘
                     (bebas bolak-balik sampai menang
                      atau 3 tuduhan habis)
```

| Tahap | Yang dilakukan pemain | Perkiraan waktu |
|---|---|---|
| Context card | Membaca cerita, pilihan, dan clue awal | 30–60 detik |
| TKP | Memeriksa benda, membaca bukti | 2–4 menit |
| Papan tuduhan | Mencoret, membaca ciri tersangka, menuduh | 1–2 menit |
| Hasil | Melihat jawaban dan penjelasan, lalu share | 30 detik |

## 3. Elemen kasus

Setiap kasus terdiri dari:

| Elemen | Keterangan | Contoh |
|---|---|---|
| **Jenis kasus** | Kategori kejadian | Pencurian, kehilangan, sabotase, kejahilan, pecah/rusak, pembunuhan (spesial) |
| **Siapa** | 3–5 tersangka dari 10 pemeran tetap | Om Benny, Tante Lia, Dimas, Mbok Sri |
| **Pakai apa** | 3–5 barang atau cara | Kunci cadangan, obeng, jepit rambut, linggis |
| **Di mana** | 3–5 ruangan atau titik di rumah | Kamar Nenek, Ruang Kerja, Dapur, Teras |
| **Clue awal** | 1–3 clue gratis di context card | "Pelakunya kidal." |
| **Ciri tersangka** | Atribut tetap setiap pemeran | Tinggi, tangan dominan, ukuran sepatu, kebiasaan |
| **Benda TKP** | Benda yang bisa diperiksa; sebagian berisi clue | Jam dinding berhenti di 21.15 |
| **Solusi** | Tepat satu kombinasi Siapa–Pakai apa–Di mana | Om Benny + kunci cadangan + Ruang Kerja |
| **Penjelasan** | Alur logika yang ditampilkan setelah kasus selesai | – |

### Arti "Pakai apa" dan "Di mana" per jenis kasus

| Jenis | Pakai apa | Di mana |
|---|---|---|
| Pencurian | Alat untuk mengambil atau membuka | Tempat barang disembunyikan |
| Kehilangan | Wadah atau cara membawa | Tempat barang akhirnya berada |
| Sabotase | Bahan atau alat sabotase | Tempat sabotase dilakukan |
| Kejahilan | Alat yang dipakai | Tempat kejadian |
| Pecah/rusak | Benda penyebab | Ruangan kejadian |
| Pembunuhan (spesial) | Senjata | Lokasi |

Label di layar tetap **Siapa**, **Pakai apa**, dan **Di mana** untuk semua jenis kasus. Penjelasannya ada di context card.

## 4. Context card

Kartu pembuka yang muncul di awal setiap kasus.

**Isi:**
1. Nomor kasus, tanggal, dan label kesulitan (misalnya "Kasus #128 · Kamis · ★★☆")
2. Judul kasus
3. Jenis kasus
4. Cerita 2–3 kalimat: apa yang terjadi, kapan, siapa yang melapor (biasanya Nenek)
5. Daftar pilihan: tersangka (dengan potret), barang, dan lokasi
6. Clue awal, sesuai kesulitan
7. Tombol **"Mulai menyelidiki"**

**Aturan:**
- Clue awal tidak boleh langsung menunjuk jawaban. Fungsinya mempersempit kemungkinan dan mengarahkan ke ruangan yang perlu diperiksa.
- Context card bisa dibuka lagi dari Buku Catatan kapan saja.
- Nada ceritanya hangat dan sedikit jenaka, tidak menakutkan.

**Contoh:**
> **Kasus #129 · Senin · ★☆☆ · Kejahilan**
> **Bolu Pandan yang Dicuil**
> Nenek membuat bolu pandan untuk arisan besok pagi. Pukul 22.00 ia mendapati sepotong besar sudah hilang. "Siapa yang tega?" tanyanya sambil memegang pisau kue.
>
> **Siapa:** Dimas · Mbok Sri · Bu Wati
> **Pakai apa:** Sendok · Pisau roti · Tangan kosong
> **Di mana:** Dapur · Ruang Kerja · Teras
>
> **Clue awal**
> • Yang mencuil bolu itu kidal.
> • Siapa pun yang memakai tangan kosong melakukannya di Dapur.
> • Dimas tidak keluar dari Ruang Kerja sejak pukul 20.00 sampai tengah malam.
>
> *(Kasus ini dibahas lengkap di dokumen 04.)*

## 5. TKP (Tempat Kejadian Perkara)

### Ruangan
- Rumah punya 5 ruangan: Ruang Tamu, Dapur, Kamar Nenek, Ruang Kerja, Teras & Kebun.
- Semua ruangan selalu bisa dikunjungi, apa pun kasusnya.
- Pindah ruangan gratis.
- Setiap ruangan punya ±12 benda yang bisa diperiksa (total ±60), dicampur dengan dekorasi yang tidak bisa diklik.

### Jatah periksa
- Jatah standar **10 periksa** per kasus.
- Memeriksa benda baru mengurangi jatah 1. Memeriksa ulang benda yang sama gratis.
- Saat jatah habis, pemain masih bisa membaca bukti yang sudah ditemukan, tapi tidak bisa memeriksa benda baru.
- Tuduhan tidak memerlukan jatah periksa.

### Hasil memeriksa
| Hasil | Tampilan | Contoh teks |
|---|---|---|
| **Bukti** | Benda dilingkari kuning; kartu bukti bernomor muncul; masuk Buku Catatan | "Jarumnya berhenti di 21.15. Tutup baterainya terbuka dan kosong." |
| **Kosong** | Benda diberi garis putus-putus; kartu abu-abu | "Di balik lukisan tidak ada apa-apa." |

Teks untuk benda kosong ditulis bervariasi dan sedikit jenaka, supaya memeriksa tetap terasa menyenangkan meski tidak dapat bukti.

### Aturan anti-bocoran
- Kursor sama di seluruh ruangan (kaca pembesar). Tidak ada efek hover khusus pada benda yang bisa diklik.
- Benda berisi clue tidak boleh digambar mencolok dibanding benda kosong.
- Benda yang relevan di satu kasus bisa kosong di kasus lain.

### State ruangan
Ruangan yang sama bisa tampil berbeda per kasus: barang berpindah, pecah, hilang, atau muncul (cangkir, jejak lumpur, kotak kosong). Ini memberi kejutan bagi pemain rutin ("kemarin vasnya tidak di situ").

## 6. Buku Catatan

Panel yang selalu bisa diakses. Di desktop berupa sidebar, di HP berupa lembar yang ditarik dari bawah.

**Isi:**
1. **Context card** (bisa dibuka ulang)
2. **Bukti**: semua clue dari TKP, bernomor, diurutkan sesuai waktu ditemukan
3. **Tersangka**: potret dan ciri singkat tiap tersangka
4. **Papan coret**: tiga kolom (Siapa / Pakai apa / Di mana); setiap pilihan bisa ditandai ✕ (gugur), ? (ragu), atau ✓ (yakin)
5. **Grid deduksi** (P1): tabel hubungan antar kategori. Desainnya harus berbeda dari grid Murdle, misalnya berupa kartu yang dibalik, bukan tabel centang.

Penandaan di papan coret murni alat bantu pemain dan tidak memengaruhi tuduhan.

## 7. Papan tuduhan

### Tampilan
Tiga baris kartu: **Siapa**, **Pakai apa**, **Di mana**. Pemain memilih satu kartu di tiap baris, lalu menekan **TUDUH**.

### Aturan
- Maksimal **3 tuduhan** per kasus.
- Kombinasi yang sama persis tidak bisa dituduhkan dua kali.
- Kartu yang dicoret pemain di Buku Catatan tampil redup, tapi tetap bisa dipilih.

### Feedback tuduhan salah
Game hanya menyebut **jumlah** bagian yang benar, tanpa menyebut bagian mana:

| Hasil | Pesan |
|---|---|
| 0 dari 3 | "Meleset semua. Tidak ada satu pun yang tepat." |
| 1 dari 3 | "Satu bagian tepat, dua lainnya salah." |
| 2 dari 3 | "Hampir! Dua bagian tepat." |
| 3 dari 3 | Kasus terpecahkan |

Tuduhan sebelumnya dan hasilnya tetap terlihat di papan, supaya pemain bisa menalar dari situ.

### Saat 3 tuduhan habis
Kasus dinyatakan gagal. Jawaban dan penjelasan tetap ditampilkan, dan streak terputus.

## 8. Hasil

**Isi layar hasil:**
1. Status: **TERPECAHKAN** atau **KASUS DITUTUP**
2. Jawaban: potret pelaku, barang, dan lokasi
3. **Penjelasan** alur logika 3–5 langkah, dengan nomor bukti yang mendukung tiap langkah
4. Statistik kasus: periksa terpakai, tebakan ke berapa, waktu
5. Gelar (lihat bagian 9)
6. Streak
7. Tombol **Bagikan**
8. Hitung mundur ke kasus berikutnya
9. Statistik global (P1): "41% pemain menebak tepat di tebakan pertama"

### Format teks share (tanpa spoiler)
```
Dailytective #128 🔎 ★★☆
🟨🟨⬛🟨🟨⬛🟨⬜⬜⬜  7 periksa
🟥🟩⬜  tebakan ke-2
⏱ 6:42 · 🔥 12
dailytective.com
```
- 🟨 benda berisi bukti · ⬛ benda kosong · ⬜ jatah tidak dipakai
- 🟥 tuduhan salah · 🟩 tuduhan benar · ⬜ tidak dipakai

## 9. Skor dan gelar

Tidak ada skor angka. Hasil dinilai dari **tebakan ke berapa** dan **jumlah periksa**:

| Gelar | Syarat |
|---|---|
| **Detektif Legendaris** | Benar di tebakan 1, periksa ≤ 5 |
| **Detektif Ulung** | Benar di tebakan 1 |
| **Detektif Tekun** | Benar di tebakan 2 |
| **Detektif Beruntung** | Benar di tebakan 3 |
| **Kasus Ditutup** | Gagal |

## 10. Kesulitan

### Jadwal mingguan
| Hari | Bintang | Ukuran | Clue awal | Jatah periksa | Tambahan |
|---|---|---|---|---|---|
| Senin | ★☆☆ | 3 × 3 × 3 | 3 | 10 | – |
| Selasa | ★☆☆ | 3 × 3 × 3 | 3 | 10 | – |
| Rabu | ★★☆ | 4 × 4 × 4 | 2 | 10 | – |
| Kamis | ★★☆ | 4 × 4 × 4 | 2 | 10 | – |
| Jumat | ★★☆ | 4 × 4 × 4 | 2 | 10 | Satu tersangka berbohong |
| Sabtu | ★★★ | 5 × 5 × 5 | 1 | 10 | Satu tersangka berbohong, bukti lebih tersebar |
| Minggu | ★★★ | 5 × 5 × 5 | 1 | 12 | Kasus besar + motif sebagai kategori ke-4 |

### Variabel yang bisa disetel
- Jumlah pilihan per kategori
- Jumlah clue awal
- Jumlah bukti yang diperlukan (minimum) dibanding bukti yang tersedia
- Seberapa tersebar bukti di berbagai ruangan
- Jumlah benda pengecoh
- Ada atau tidaknya tersangka yang berbohong
- Kategori tambahan (motif) di hari Minggu

### Mekanik "tersangka berbohong" (Jumat–Minggu)
- Context card menyebutkan: *"Salah satu tersangka berbohong."*
- Setiap tersangka memberi satu **pengakuan**. Tepat satu pengakuan bohong, dan **pembohongnya selalu pelaku**.
- Pemain harus menemukan pengakuan yang bertentangan dengan bukti.

### Kategori motif (Minggu)
Kategori ke-4: **Kenapa**. Contoh pilihan: utang, iri, warisan, iseng, salah paham. Feedback tuduhan menjadi "X dari 4 benar".

## 11. Streak dan statistik

- **Streak** bertambah kalau kasus hari itu terpecahkan, dan terputus kalau gagal atau tidak dimainkan.
- **Statistik pribadi:** jumlah kasus dimainkan, % terpecahkan, streak saat ini, streak terpanjang, distribusi tebakan (1/2/3/gagal), rata-rata periksa.
- Kasus dari arsip (P2) tidak memengaruhi streak.

## 12. Onboarding

Ditampilkan saat pertama kali membuka game:
1. **"Setiap hari ada satu kasus di rumah Nenek."** (ilustrasi rumah)
2. **"Periksa benda untuk menemukan bukti. Jatahmu terbatas!"** (animasi klik benda)
3. **"Tebak Siapa, Pakai apa, dan Di mana. Kamu punya 3 kesempatan."** (animasi papan tuduhan)

Setelah itu muncul tawaran: **"Coba kasus latihan"** (P1) atau **"Langsung ke kasus hari ini"**.

## 13. Daftar layar

| Layar | Desktop | HP | Mockup |
|---|---|---|---|
| Beranda | Kartu kasus hari ini, streak, hitung mundur | Sama, satu kolom | Belum |
| Onboarding | Modal 3 langkah | Layar penuh 3 langkah | Belum |
| Context card | Modal besar berbentuk map kasus | Layar penuh | Belum |
| TKP | Ruangan besar + sidebar Buku Catatan | Ruangan bisa digeser + lembar bukti di bawah | Ada (desktop & HP) |
| Buku Catatan | Sidebar dengan tab | Lembar dari bawah | Sebagian |
| Papan tuduhan | 3 baris kartu + sidebar bukti | 3 baris kartu bisa digeser | Perlu dibuat ulang |
| Hasil | Dua kolom: jawaban + statistik | Satu kolom | Ada (HP) |
| Statistik pribadi | Modal | Layar penuh | Belum |
| Pengaturan | Modal | Layar penuh | Belum |
| Cara main | Modal | Layar penuh | Belum |
| Sudah main hari ini | Hasil hari ini + hitung mundur | Sama | Belum |
| Error/offline | Pesan + tombol coba lagi | Sama | Belum |

## 14. Audio (opsional, P2)

- Klik memeriksa benda (bunyi kertas atau kayu)
- Bukti ditemukan (denting)
- Benda kosong (bunyi pelan)
- Tuduhan salah (bunyi bel rendah)
- Kasus terpecahkan (stempel + fanfare pendek)
- Musik latar lembut bernuansa misteri jenaka, mati secara default

## 15. Pengembangan berikutnya

- **Arsip:** semua kasus sebelumnya bisa dimainkan
- **Grup/liga:** papan skor mingguan untuk keluarga atau teman, diundang via link
- **Mode cerita:** rangkaian 10 kasus yang saling terhubung dengan kesulitan bertahap
- **Musim baru:** lokasi baru (kantor, sekolah, kos) dengan pemeran tambahan
- **Edisi spesial:** kasus bertema hari besar
