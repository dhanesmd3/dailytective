# 08 · TODO dan Roadmap

*Dailytective · v1.0 · 30 Oktober 2026*

Centang setiap item yang selesai. Kolom referensi menunjuk dokumen yang menjelaskan detailnya.

---

## Roadmap

| Fase | Minggu | Fokus | Selesai kalau… |
|---|---|---|---|
| **0. Fondasi** | 1–2 | Nama, aturan, karakter, kasus kertas | Kasus kertas bisa dipecahkan dan terasa seru |
| **1. Prototipe** | 3–6 | Web app desktop: 1 ruangan, alur lengkap, 5 kasus | Playtester kembali besoknya tanpa diingatkan |
| **2. Produksi** | 7–10 | 5 ruangan, 11 tokoh, solver, 30+ kasus, layout HP, PWA | Stok kasus cukup untuk 30 hari |
| **3. Beta** | 11–12 | Beta tertutup, analitik, perbaikan | Retensi D7 ≥ 20%, tingkat penyelesaian ≥ 75% |
| **Launch** | 13 | Rilis publik + kampanye | Kasus #1 terbit pukul 06.00 WIB |
| **4. Bertumbuh** | 14+ | Konten rutin, fitur lanjutan | Sesuai metrik bulanan |

---

## Fase 0: Fondasi (minggu 1–2)

### Keputusan dan legal
- [ ] Cek dan amankan domain dailytective.com / .id / .app
- [ ] Amankan handle @dailytective di TikTok, Instagram, X, Threads
- [ ] Cek nama Dailytective di database merek DJKI, lalu ajukan pendaftaran
- [ ] Putuskan siapa yang mengerjakan ilustrasi
- [ ] Konfirmasi asumsi: desktop = web app/PWA (README)

### Desain game · [02](02-GDD.md)
- [ ] Finalkan aturan jatah periksa, tuduhan, feedback, gelar
- [ ] Finalkan jadwal kesulitan mingguan
- [ ] Finalkan isi dan format context card
- [ ] Tulis teks onboarding 3 langkah

### Karakter dan dunia · [03](03-KARAKTER-DAN-DUNIA.md)
- [ ] Review 10 tersangka + Nenek + Si Belang (nama, atribut, sifat)
- [ ] Kunci tabel atribut tetap (tinggi, tangan, sepatu, kacamata, rambut)
- [ ] Finalkan 60 benda tetap di 5 ruangan
- [ ] Finalkan bank 36 barang

### Kasus · [04](04-SPEK-KASUS.md)
- [ ] Finalkan skema JSON kasus v1
- [ ] Tulis 3 kasus manual (★, ★★, ★★★) dengan context card
- [ ] Cek ketiganya secara manual dengan aturan S1–S6
- [ ] **Playtest kertas** dengan 8–10 orang
- [ ] Catat hasil playtest dan revisi aturan

### Visual · [05](05-ART-DIRECTION.md)
- [ ] Sketsa kasar 11 tokoh (cukup hitam-putih)
- [ ] Sketsa layout 5 ruangan
- [ ] Brief untuk ilustrator (kalau memakai ilustrator)

---

## Fase 1: Prototipe (minggu 3–6)

### Setup · [06](06-SPEK-TEKNIS.md)
- [ ] Pilih stack final
- [ ] Buat repo app dan repo kasus (privat)
- [ ] Setup hosting, database, lingkungan lokal/staging/produksi
- [ ] Setup CI dasar (lint, test)

### Mesin kasus
- [ ] Data `karakter.json`, `ruangan.json`, `barang.json`
- [ ] Validator skema kasus
- [ ] Solver v1: tipe `atribut`, `atribut_bukan`, `fakta`, `bukan`, `jika_maka`
- [ ] Cek S1–S6 + laporan bukti minimum dan jalur
- [ ] Unit test solver memakai contoh kasus "Bolu Pandan yang Dicuil"

### API
- [ ] ID pemain anonim (token bertanda tangan)
- [ ] `GET /api/kasus/hari-ini` dengan logika tanggal WIB
- [ ] `POST /periksa` dengan batas jatah
- [ ] `POST /tuduh` dengan feedback jumlah benar dan solusi hanya di akhir
- [ ] Penyimpanan sesi

### Front-end desktop
- [ ] Token desain (warna, font, kartu, tombol)
- [ ] Context card
- [ ] TKP: 1 ruangan (Ruang Tamu) dengan hotspot berbasis persen
- [ ] Panel bukti + Buku Catatan (bukti, tersangka, papan coret)
- [ ] Papan tuduhan 3 baris kartu + riwayat tuduhan
- [ ] Layar hasil + penjelasan + teks share
- [ ] Penyimpanan progres lokal
- [ ] Mode "atur tanggal" untuk pratinjau lokal

### Konten
- [ ] Ilustrasi Ruang Tamu versi sementara (boleh vektor sederhana)
- [ ] Ikon tokoh versi sementara
- [ ] 5 kasus yang semua clue-nya ada di Ruang Tamu + context card

### Validasi
- [ ] Playtest prototipe 30–50 orang selama 5 hari berturut-turut
- [ ] Ukur: kembali di hari ke-2, waktu main, tingkat menang
- [ ] Wawancara 10 playtester
- [ ] Putuskan: lanjut, revisi aturan, atau pivot

---

## Fase 2: Produksi (minggu 7–10)

### Aset visual · [05](05-ART-DIRECTION.md)
- [ ] Style guide final
- [ ] Logo dan ikon aplikasi
- [ ] 11 tokoh × 3 ekspresi (modular, berlapis)
- [ ] Si Belang dalam 4 pose
- [ ] 5 ruangan berlapis (arsitektur, furnitur, benda tetap)
- [ ] Pencahayaan siang/sore/malam
- [ ] ±40 benda sementara
- [ ] 36 ikon barang + 5 ikon lokasi
- [ ] Bingkai context card, stempel, kartu
- [ ] Ilustrasi onboarding
- [ ] Templat OG image per kasus

### Game · [02](02-GDD.md)
- [ ] 5 ruangan dengan navigasi chip
- [ ] State ruangan per kasus (lapisan benda sementara, pencahayaan, posisi Si Belang)
- [ ] Hari berbohong: tampilan pengakuan tersangka
- [ ] Hari Minggu: kategori motif (4 kategori, feedback "X dari 4")
- [ ] Onboarding 3 langkah
- [ ] Beranda + hitung mundur + layar "sudah main hari ini"
- [ ] Streak dan statistik pribadi
- [ ] Gelar
- [ ] Pengaturan: suara, kontras tinggi, kurangi animasi
- [ ] Animasi (dokumen 05, bagian 8)
- [ ] Halaman cara main, tentang, privasi

### Layout HP
- [ ] TKP bisa digeser dan diperbesar
- [ ] Buku Catatan sebagai lembar dari bawah
- [ ] Papan tuduhan bisa digeser
- [ ] Uji di 390 px dan 360 px

### Teknis · [06](06-SPEK-TEKNIS.md)
- [ ] Solver v2: `atribut_kombinasi`, `pengakuan`, motif
- [ ] Generator semi-otomatis (P1)
- [ ] Pratinjau kasus lokal
- [ ] Alur PR kasus + CI (validator + solver wajib lolos)
- [ ] Job impor kasus ke database
- [ ] Peringatan stok kasus dan kegagalan rilis
- [ ] PWA: manifest, service worker, uji *install* di Windows, Mac, Android, iOS
- [ ] Rate limit API
- [ ] Analitik event (dokumen 06, bagian 9)
- [ ] Sentry
- [ ] Optimasi performa sesuai anggaran

### Konten · [04](04-SPEK-KASUS.md)
- [ ] Panduan menulis kasus final
- [ ] **30 kasus** lolos validator, solver, review, dan playtest
- [ ] Teks kosong yang bervariasi untuk setiap kasus
- [ ] Komentar Nenek untuk setiap kasus
- [ ] Kalender kasus 3 bulan pertama, termasuk kasus bertema

---

## Fase 3: Beta (minggu 11–12)

- [ ] Undang 100–300 orang dari daftar tunggu
- [ ] Jalankan 14 hari berturut-turut
- [ ] Dashboard metrik: retensi, penyelesaian, tingkat menang per kesulitan, share
- [ ] Kalibrasi kesulitan dari data beta
- [ ] Perbaiki bug dan bagian yang membingungkan
- [ ] Login opsional Google/email + penggabungan progres (kalau masuk MVP)
- [ ] Teks share + preview link final
- [ ] Uji beban rilis 06.00 WIB
- [ ] Uji end-to-end lengkap di semua browser dan perangkat target
- [ ] Audit aksesibilitas (keyboard, pembaca layar, kontras)
- [ ] Kebijakan privasi final
- [ ] Stok kasus ≥ 30 hari setelah tanggal launch

---

## Pra-launch (paralel dengan fase 1–3) · [07](07-LAUNCH-DAN-GROWTH.md)

- [ ] Landing page + form daftar tunggu
- [ ] Profil media sosial lengkap
- [ ] Konten build in public 2–3× seminggu
- [ ] Seri perkenalan 11 tokoh
- [ ] Daftar komunitas, kreator, dan media
- [ ] Press kit
- [ ] Kalender konten 4 minggu pertama setelah launch
- [ ] Siapkan 7 video teka-teki untuk minggu pertama

---

## Launch (minggu 13)

- [ ] H-3: teaser
- [ ] H-1: email ke daftar tunggu
- [ ] H-1: cek kasus #1–#7 sudah terjadwal dan lolos QA
- [ ] H: pantau rilis 06.00 WIB, error, dan beban server
- [ ] H: posting di semua kanal dan kirim ke komunitas
- [ ] H+1 s/d H+7: video teka-teki harian, balas komentar
- [ ] H+7: rekap minggu pertama + evaluasi metrik

---

## Fase 4: Bertumbuh (setelah launch)

### Rutin
- [ ] Setiap hari: pantau rilis dan error
- [ ] Setiap minggu: tulis dan QA minimal 7 kasus, evaluasi tingkat menang per kasus
- [ ] Setiap bulan: evaluasi metrik dan tentukan prioritas fitur

### Backlog fitur (urut prioritas, dievaluasi bulanan)
- [ ] Gambar kartu hasil untuk Story
- [ ] Statistik global per kasus
- [ ] Arsip kasus
- [ ] Panel admin web untuk penulis kasus
- [ ] Grup/liga keluarga dan teman
- [ ] Suara dan musik
- [ ] Karakter tambahan
- [ ] State ruangan dan dekorasi musiman
- [ ] Lokasi baru (musim kedua)
- [ ] Mode cerita
- [ ] Monetisasi
- [ ] Aplikasi unduhan desktop (Tauri/Electron) atau aplikasi HP

---

## Definition of Done

Sebuah tugas dianggap selesai kalau:
- **Fitur:** berjalan di desktop dan HP, lolos test, sudah dicek dengan keyboard, dan event analitiknya terkirim
- **Kasus:** lolos validator, solver (S1–S6), review teks, dan playtest oleh minimal 2 orang
- **Aset:** sesuai art direction, memakai konvensi nama file, ukurannya sesuai anggaran performa
- **Dokumen:** diperbarui kalau ada keputusan yang berubah, dan dicatat di log keputusan README
