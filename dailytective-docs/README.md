# Dailytective: Dokumentasi Proyek

> Satu kasus detektif setiap hari. Jelajahi TKP, kumpulkan bukti, lalu tebak **Siapa – Pakai apa – Di mana**.

*Versi dokumen 1.0 · 30 Oktober 2026 · status: pra-produksi*

---

## Isi dokumentasi

| # | File | Isi | Dibaca oleh |
|---|---|---|---|
| 01 | [PRD](01-PRD.md) | Masalah, tujuan, target pemain, kebutuhan fitur, metrik keberhasilan, ruang lingkup MVP | Semua |
| 02 | [Desain Game (GDD)](02-GDD.md) | Alur main, aturan, context card, TKP, tuduhan, skor, kesulitan, layar | Desainer, developer, penulis kasus |
| 03 | [Karakter & Dunia](03-KARAKTER-DAN-DUNIA.md) | 10 pemeran tetap, rumah, 5 ruangan, daftar benda | Penulis kasus, ilustrator |
| 04 | [Spesifikasi Kasus](04-SPEK-KASUS.md) | Format data, jenis clue, generator & solver, panduan menulis, contoh kasus lengkap, QA | Penulis kasus, developer |
| 05 | [Art Direction](05-ART-DIRECTION.md) | Palet, tipografi, gaya karikatur, aturan ruangan, daftar aset | Ilustrator, desainer UI |
| 06 | [Spesifikasi Teknis](06-SPEK-TEKNIS.md) | Arsitektur, rilis harian, keamanan jawaban, data, analitik | Developer |
| 07 | [Launch & Growth](07-LAUNCH-DAN-GROWTH.md) | Playtest, pra-launch, promosi, kalender konten | Pemilik produk, marketing |
| 08 | [TODO & Roadmap](08-TODO.md) | Semua pekerjaan per fase, dalam bentuk checklist | Semua |

## Ringkasan produk

| Aspek | Keputusan |
|---|---|
| Nama | **Dailytective** |
| Format | Game harian: satu kasus per hari, semua pemain dapat kasus yang sama |
| Rilis | Setiap hari pukul **06.00 WIB** |
| Platform | **Desktop dulu** (web app yang bisa di-*install* sebagai PWA), tampilan HP menyesuaikan |
| Alur | Context card → TKP (*hidden object*) → Papan tuduhan → Hasil & share |
| Tuduhan | **Siapa – Pakai apa – Di mana**, 3 kesempatan, feedback "X dari 3 benar" |
| Tema | Pencurian, kehilangan, sabotase, kejahilan. Pembunuhan hanya edisi spesial. |
| Karakter | **10 pemeran tetap** + Nenek sebagai tokoh pembawa kasus |
| Lokasi | **1 rumah** (5 ruangan) untuk sementara |
| Gaya | Karikatur ala ilustrasi board game, nuansa papan permainan |
| Akun | Tidak wajib. Login opsional untuk sinkron streak. |
| Monetisasi | Belum ada di MVP |

## Log keputusan

| Tanggal | Keputusan | Alasan |
|---|---|---|
| 29 Okt 2026 | Format harian, bukan level | Kelangkaan bikin pemain kembali; semua orang bisa membahas kasus yang sama |
| 29 Okt 2026 | TKP berupa interior *hidden object*, bukan denah | Lebih imersif, dan mencari clue jadi keputusan strategis |
| 29 Okt 2026 | Tuduhan Siapa–Pakai apa–Di mana, bukan memilih 1 dari 30 orang | Membaca 30 profil terlalu berat untuk game harian |
| 29 Okt 2026 | Tema kasus tidak selalu pembunuhan | Ramah semua umur; kasus serius terasa spesial |
| 30 Okt 2026 | Nama Dailytective | – |
| 30 Okt 2026 | Desktop dulu, HP menyesuaikan | Pilihan pemilik produk |
| 30 Okt 2026 | Karakter dikurangi jadi 10 | Lebih mudah dikenal pemain dan lebih ringan diproduksi |
| 30 Okt 2026 | Ada context card di awal kasus | Memberi konteks dan clue awal gratis |
| 30 Okt 2026 | Tanpa login wajib, tanpa monetisasi dulu | Mengurangi hambatan main di awal |
| 30 Okt 2026 | Satu rumah dulu | Fokus produksi; lokasi baru bisa ditambah nanti |

## Asumsi yang perlu dikonfirmasi

- **"Desktop app"** diartikan sebagai web app desktop-first yang bisa di-*install* (PWA) di Windows/Mac. Kalau yang dimaksud aplikasi unduhan (.exe/.dmg, Steam, Microsoft Store), dokumen 06 perlu direvisi.
- **10 karakter** diartikan sebagai 10 tersangka, dengan Nenek di luar hitungan karena ia pembawa kasus dan tidak pernah jadi tersangka.

## Referensi visual

Mockup layar (HP dan desktop) ada di canvas desain **Daily Mystery Board Game** dalam percakapan ini. Mockup papan tuduhan di sana masih versi lama (30 tersangka) dan perlu diganti sesuai GDD.
