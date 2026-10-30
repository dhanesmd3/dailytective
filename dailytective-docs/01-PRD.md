# 01 · PRD: Product Requirements Document

*Dailytective · v1.0 · 30 Oktober 2026*

---

## 1. Ringkasan

Dailytective adalah game detektif harian berbasis web. Setiap hari pukul 06.00 WIB terbit satu kasus baru yang sama untuk semua pemain. Pemain membaca context card, memeriksa benda-benda di dalam rumah untuk mencari bukti dengan jatah terbatas, lalu menuduh **siapa** pelakunya, **pakai apa**, dan **di mana**. Satu sesi berlangsung 3–8 menit dan hasilnya bisa dibagikan tanpa membocorkan jawaban.

## 2. Latar belakang dan masalah

- Game harian singkat (Wordle, Katla, Connections) sudah jadi kebiasaan banyak orang, tapi hampir semuanya bermain dengan kata atau angka.
- Teka-teki detektif harian terbukti diminati. Murdle berawal dari situs teka-teki harian dan berkembang jadi seri buku dengan penjualan lebih dari 1 juta eksemplar. Tapi formatnya berupa teka-teki logika tertulis, dengan clue yang langsung diberikan.
- Game detektif harian yang ada umumnya berbahasa Inggris dan bernuansa Barat. Belum ada yang berlatar keseharian Indonesia.

**Peluang:** game detektif harian yang *visual* dan *bisa dijelajahi*, terasa dekat dengan keseharian pemain Indonesia, dan cukup singkat untuk dimainkan setiap hari.

## 3. Tujuan

### Tujuan produk
1. Pemain menjadikan Dailytective kebiasaan harian.
2. Pemain membagikan hasil dan mengajak orang lain, sehingga pertumbuhan terjadi secara organik.
3. Setiap kasus terasa adil: bisa dipecahkan dengan logika, bukan tebakan.

### Tujuan bisnis (tahap awal)
1. Membuktikan bahwa konsepnya disukai, diukur dari retensi dan tingkat share.
2. Membangun basis pemain sebelum memikirkan monetisasi.

### Bukan tujuan (non-goals) untuk MVP
- Monetisasi dalam bentuk apa pun
- Aplikasi native Android/iOS atau aplikasi unduhan desktop
- Multiplayer real-time
- Lebih dari satu lokasi (rumah)
- Mode cerita/level
- Grup atau liga dengan papan skor
- Bahasa selain Indonesia

## 4. Target pemain

| Persona | Gambaran | Yang dicari | Implikasi desain |
|---|---|---|---|
| **Rina, 27, karyawan kantor** | Main Wordle tiap pagi, suka konten misteri di TikTok | Hiburan singkat di sela kerja, bisa dibahas dengan teman kantor | Sesi ≤8 menit, nyaman di desktop, share card yang menarik |
| **Fajar, 21, mahasiswa** | Penggemar Detective Conan dan board game | Tantangan logika yang beneran menantang | Hari sulit yang serius, aturan yang adil, statistik pribadi |
| **Bu Ani, 45, ibu rumah tangga** | Aktif di grup WhatsApp keluarga, main game ringan di HP | Teka-teki santai yang bisa dikirim ke keluarga | Tampilan HP yang jelas, hari mudah yang ramah pemula, tanpa login |

Target utama MVP: **usia 18–40 yang sudah terbiasa dengan game harian dan aktif di media sosial.**

## 5. Prinsip produk

1. **Adil di atas segalanya.** Setiap kasus punya tepat satu jawaban yang bisa dideduksi. Kasus yang ambigu lebih merusak daripada kasus yang terlalu mudah.
2. **Setiap pilihan bermakna.** Memeriksa benda menghabiskan jatah, dan tebakan salah tetap memberi informasi.
3. **Singkat dan selesai.** Satu kasus, 3–8 menit, lalu tunggu besok.
4. **Bebas spoiler.** Pemain bisa pamer hasil tanpa merusak kasus untuk orang lain.
5. **Dekat dan hangat.** Rumah, orang, dan kejadiannya terasa familiar bagi pemain Indonesia.

## 6. User stories

| ID | Sebagai… | Saya ingin… | Supaya… |
|---|---|---|---|
| US-01 | pemain baru | langsung main tanpa daftar | tidak ada hambatan untuk mencoba |
| US-02 | pemain baru | memahami cara main dalam ±1 menit | tidak bingung dan tidak menyerah |
| US-03 | pemain | membaca cerita kasus dan clue awal | tahu apa yang harus diselidiki |
| US-04 | pemain | memeriksa benda di setiap ruangan | menemukan bukti |
| US-05 | pemain | melihat semua bukti yang sudah saya temukan di satu tempat | tidak perlu mengingat-ingat |
| US-06 | pemain | mencoret kemungkinan yang sudah gugur | penalaran saya tetap rapi |
| US-07 | pemain | menuduh kombinasi Siapa–Pakai apa–Di mana | menyelesaikan kasus |
| US-08 | pemain | tahu berapa bagian tuduhan saya yang benar | tebakan berikutnya lebih terarah |
| US-09 | pemain | melihat penjelasan lengkap setelah kasus selesai | paham alur logikanya, termasuk kalau saya kalah |
| US-10 | pemain | membagikan hasil tanpa membocorkan jawaban | bisa pamer dan mengajak teman |
| US-11 | pemain rutin | melihat streak dan statistik saya | punya alasan untuk kembali besok |
| US-12 | pemain rutin | melanjutkan progres di perangkat lain | streak tidak hilang saat ganti perangkat |
| US-13 | pemain | tahu kapan kasus berikutnya terbit | bisa kembali tepat waktu |
| US-14 | penulis kasus | membuat, mengecek, dan menjadwalkan kasus | stok kasus selalu tersedia dan berkualitas |

## 7. Kebutuhan fungsional

Prioritas: **P0** wajib ada saat launch · **P1** sebaiknya ada saat launch · **P2** setelah launch

### 7.1 Kasus harian
| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-01 | Satu kasus terbit setiap hari pukul 06.00 WIB, sama untuk semua pemain | P0 |
| F-02 | Pemain hanya bisa memainkan kasus hari ini satu kali | P0 |
| F-03 | Hitung mundur ke kasus berikutnya | P0 |
| F-04 | Tingkat kesulitan berganti sesuai jadwal mingguan | P0 |
| F-05 | Arsip kasus sebelumnya (bisa dimainkan, tidak memengaruhi streak) | P2 |

### 7.2 Context card
| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-10 | Menampilkan judul, jenis kasus, cerita singkat, dan pilihan Siapa/Pakai apa/Di mana | P0 |
| F-11 | Menampilkan 1–3 clue awal gratis sesuai kesulitan | P0 |
| F-12 | Bisa dibuka lagi kapan saja selama bermain | P0 |

### 7.3 TKP
| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-20 | Ilustrasi interior untuk setiap ruangan, dengan navigasi antar ruangan | P0 |
| F-21 | Benda bisa diklik; memeriksa benda baru mengurangi jatah periksa | P0 |
| F-22 | Benda yang sudah diperiksa ditandai berbeda: berisi clue atau kosong | P0 |
| F-23 | Memeriksa ulang benda yang sama tidak mengurangi jatah | P0 |
| F-24 | Kursor dan efek hover tidak membocorkan benda mana yang punya clue | P0 |
| F-25 | Di HP, ruangan bisa digeser dan diperbesar | P1 |

### 7.4 Buku Catatan
| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-30 | Semua clue (context card, ciri tersangka, bukti TKP) terkumpul di satu tempat | P0 |
| F-31 | Pemain bisa mencoret atau menandai pilihan Siapa/Pakai apa/Di mana | P0 |
| F-32 | Grid deduksi untuk menandai hubungan antar kategori | P1 |

### 7.5 Tuduhan
| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-40 | Pemain memilih 1 Siapa + 1 Pakai apa + 1 Di mana, lalu menuduh | P0 |
| F-41 | Maksimal 3 tuduhan per kasus | P0 |
| F-42 | Tuduhan salah memberi feedback "X dari 3 benar" tanpa menyebut bagian mana | P0 |
| F-43 | Kombinasi yang sama tidak bisa dituduhkan dua kali | P0 |
| F-44 | Tuduhan bisa dilakukan kapan saja, termasuk sebelum jatah periksa habis | P0 |

### 7.6 Hasil dan share
| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-50 | Layar hasil menampilkan jawaban dan penjelasan alur logika | P0 |
| F-51 | Statistik kasus: periksa terpakai, tebakan ke berapa, waktu | P0 |
| F-52 | Tombol share: salin teks ringkas dengan emoji + link, tanpa spoiler | P0 |
| F-53 | Gambar kartu hasil untuk Story/feed | P1 |
| F-54 | Statistik global: persentase pemain yang berhasil per tebakan | P1 |

### 7.7 Progres dan akun
| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-60 | Progres dan streak tersimpan di perangkat tanpa login | P0 |
| F-61 | Statistik pribadi: jumlah main, persentase menang, distribusi tebakan, streak | P0 |
| F-62 | Login opsional (Google/email) untuk sinkron antar perangkat | P1 |
| F-63 | Saat login pertama, progres lokal digabung ke akun | P1 |

### 7.8 Onboarding dan lain-lain
| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-70 | Cara main singkat (maks. 3 layar) saat pertama kali bermain | P0 |
| F-71 | Kasus latihan yang sangat mudah | P1 |
| F-72 | Pengaturan: suara, kontras tinggi, kurangi animasi | P1 |
| F-73 | Bisa di-*install* sebagai aplikasi (PWA) | P1 |

### 7.9 Alat internal
| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-80 | Format data kasus dan validator skema | P0 |
| F-81 | Solver yang memastikan solusi tunggal dan kasus bisa dipecahkan dalam jatah | P0 |
| F-82 | Pratinjau kasus sebelum terbit | P0 |
| F-83 | Penjadwalan kasus per tanggal | P0 |
| F-84 | Generator kasus semi-otomatis | P1 |

## 8. Kebutuhan non-fungsional

| Aspek | Kebutuhan |
|---|---|
| Performa | Halaman siap dimainkan dalam <3 detik di koneksi 4G; ukuran unduhan awal <1,5 MB |
| Perangkat | Desktop: Chrome, Edge, Safari, Firefox versi terbaru. HP: Android 10+ dan iOS 16+. |
| Layout | Desktop 1280–1920 px sebagai layout utama; tetap nyaman di 1024 px dan di HP 360 px |
| Ketersediaan | Kasus harian tersedia ≥99,5% waktu; rilis 06.00 WIB tepat waktu |
| Keamanan | Jawaban kasus tidak bisa diketahui dari kode atau data di sisi pemain |
| Aksesibilitas | Bisa dimainkan dengan keyboard; kontras teks memenuhi WCAG AA; label untuk pembaca layar |
| Privasi | Tanpa login, tidak ada data pribadi yang dikumpulkan. Sesuai UU Pelindungan Data Pribadi. |
| Bahasa | Bahasa Indonesia; teks disimpan terpisah dari kode agar mudah diterjemahkan nanti |

## 9. Metrik keberhasilan

Angka target berikut adalah **hipotesis awal** dan perlu dikalibrasi setelah beta.

| Metrik | Definisi | Target 3 bulan pertama |
|---|---|---|
| **Retensi D1** | % pemain baru yang kembali main besoknya | ≥ 35% |
| **Retensi D7** | % pemain baru yang masih main 7 hari kemudian | ≥ 20% |
| **Tingkat penyelesaian** | % sesi yang berakhir dengan menang atau kalah (tidak ditinggal) | ≥ 75% |
| **Tingkat menang** | % kasus yang terpecahkan | 60–85% (di luar itu, kesulitan perlu disetel) |
| **Tingkat share** | % pemain yang menekan tombol share | ≥ 10% |
| **Waktu main** | Median durasi sesi | 3–8 menit |
| **Pemain harian (DAU)** | Pemain unik per hari | 1.000 di bulan ke-1, 10.000 di bulan ke-3 |

**North star metric:** jumlah pemain yang menyelesaikan kasus minimal 4 hari dalam seminggu.

## 10. Ruang lingkup

### MVP (launch)
- Kasus harian dengan context card, TKP 5 ruangan, Buku Catatan, papan tuduhan, hasil & share
- 10 pemeran tetap + Nenek
- Progres lokal, streak, statistik pribadi
- Cara main
- Stok minimal 30 kasus yang lolos QA
- Layout desktop dan HP

### Setelah launch (urut prioritas)
1. Login opsional dan sinkron (kalau belum masuk MVP)
2. Statistik global dan gambar kartu hasil
3. Arsip kasus
4. Grup/liga keluarga dan teman
5. Karakter tambahan dan state ruangan baru
6. Lokasi baru (musim kedua)
7. Mode cerita
8. Monetisasi
9. Aplikasi native

## 11. Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Kasus ambigu atau punya lebih dari satu solusi | Pemain merasa dicurangi, lalu berhenti | Solver wajib untuk setiap kasus + playtest manusia |
| Kehabisan kasus | Rilis harian terhenti | Stok ≥30 hari sebelum launch, generator semi-otomatis |
| Terlalu sulit untuk pemain baru | Tingkat penyelesaian rendah | Jadwal kesulitan mingguan, kasus latihan, clue awal lebih banyak di hari mudah |
| Terlalu mudah | Tidak ada rasa puas | Hari sulit dengan tersangka berbohong; pantau tingkat menang per hari |
| Jawaban bocor lewat DevTools | Kompetisi tidak adil, statistik rusak | Validasi jawaban di server |
| Jawaban tersebar di media sosial | Spoiler | Share card tanpa spoiler; ajakan "jangan spoiler" di layar hasil |
| Dianggap tiruan Murdle | Citra buruk | Pembeda yang jelas: TKP yang dijelajahi, visual karikatur, latar lokal; desain grid berbeda |
| Ilustrasi mahal dan lambat | Launch mundur | Benda per kasus sebagai lapisan terpisah, sehingga ruangan cukup digambar sekali |
| Pemain bosan dengan rumah yang sama | Retensi turun setelah beberapa bulan | Variasi state ruangan, kasus bertema, lokasi baru di musim kedua |

## 12. Pertanyaan terbuka

- Siapa yang mengerjakan ilustrasi?
- Apakah domain dailytective.com / .id / .app dan handle media sosial tersedia?
- Apakah nama Dailytective bisa didaftarkan sebagai merek di DJKI?
- Apakah login opsional masuk MVP atau langsung setelah launch?
