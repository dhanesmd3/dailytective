# Dailytective · Fase 2 (produksi, sebagian)

Satu kasus detektif setiap hari dari rumah Nenek. Dokumen desain ada di [dailytective-docs/](dailytective-docs/README.md).

## Menjalankan

```bash
npm install
npm run dev          # http://localhost:5173
```

Kasus terjadwal **2–8 November 2026** (satu minggu penuh). Sebelum tanggal itu, beranda menampilkan "Belum ada kasus hari ini".
Saat `npm run dev`, **mode pratinjau** aktif otomatis: beranda menampilkan daftar semua kasus, dan `?tanggal=2026-11-07`
bisa dipakai untuk melompat tanggal. Tombol **Ulangi** di halaman kasus menghapus progres supaya kasus bisa dimainkan lagi.

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server pengembangan (mode pratinjau aktif) |
| `npm test` | Unit test: solver, pengakuan, motif, aturan main, streak, waktu rilis, hotspot ruangan, generator, rate limit |
| `npm run cek-kasus` | Validator skema + solver S1–S6 untuk semua kasus di `kasus/` (kode keluar 1 kalau gagal; dipakai CI) |
| `npm run cek-kasus -- 2026-11-07` | Cek satu kasus, lengkap dengan jalur bukti minimal dan sebaran ruangan |
| `npm run buat-draf -- 2026-11-14 pencurian 7` | Generator: draf kasus yang lolos solver ke `draf/`, teksnya bertanda `[DRAF]` |
| `npm run check` | Type check (svelte-check) |
| `npm run build && npm start` | Build produksi lokal (adapter-node) |

Variabel lingkungan: lihat [.env.example](.env.example). Di luar `npm run dev`, server **menolak jalan** tanpa `DT_SECRET` (≥ 32 karakter).

## Deploy ke Vercel

Build di Vercel otomatis memakai `@sveltejs/adapter-vercel` (region Singapura, `sin1`); di tempat lain tetap adapter-node.
Karena serverless tidak punya disk yang bertahan, sesi pemain disimpan di **Upstash Redis**.

1. **Add New → Project**, impor repo ini. Framework terdeteksi sebagai SvelteKit; pengaturan build biarkan bawaan.
2. Sebelum klik Deploy, isi **Environment Variables**: `DT_SECRET` (buat dengan perintah di `.env.example`).
   Jangan isi `DT_PRATINJAU` atau `DT_TANGGAL` di produksi.
3. Setelah project jadi: tab **Storage → Create Database → Upstash (Redis)**, region **Singapore**, plan Free,
   lalu sambungkan ke project. Vercel mengisi `KV_REST_API_URL` dan `KV_REST_API_TOKEN` sendiri.
4. **Deployments → Redeploy** supaya variabel barunya terbaca.
5. Domain: **Settings → Domains**, tambahkan misalnya `dailytective.dhanesworo.site`, lalu buat record DNS yang
   diminta Vercel (subdomain: `CNAME` ke alamat yang ditampilkan Vercel) di panel tempat domain dibeli.

Tanpa Redis, server di Vercel sengaja menolak permintaan dengan galat yang jelas, bukan diam-diam kehilangan progres.
Rate limit masih di memori per instance: di Vercel perlindungannya lebih longgar, cukup untuk playtest.

## Alur penulis kasus

1. `npm run buat-draf -- <tanggal> <jenis> [seed]` membuat draf yang sudah lolos solver, sesuai jadwal mingguan
   (Jumat–Sabtu dengan pengakuan, Minggu dengan motif dan jatah 12).
2. Tulis ulang semua teks `[DRAF]`: cerita, bukti (tulis yang *terlihat*), teks kosong, penjelasan, komentar Nenek.
3. Tambahkan blok `"terjemahan": { "en": { ... } }` (judul, cerita, clue_awal, pengakuan, benda, teks_kosong_bawaan,
   penjelasan, komentar_nenek). Kasus tetap bisa terbit tanpa terjemahan lengkap; teks yang kurang tampil dalam bahasa
   Indonesia dan `cek-kasus` memberi peringatan.
4. Pindahkan ke `kasus/`, jalankan `npm run cek-kasus`. Validator menolak file yang masih berisi `[DRAF]`.
5. Buka PR. CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) menjalankan type check, test, validator + solver, dan build.
6. Playtest lewat mode pratinjau, dalam kedua bahasa.

## Dua bahasa (Indonesia & English)

- Bahasa dipilih lewat tombol ID/EN di beranda atau Pengaturan, disimpan di cookie `dt_bahasa`.
  Pengunjung baru mengikuti bahasa browser (Indonesia/Melayu → `id`, lainnya → `en`).
- Teks UI: [src/lib/i18n/kamus.ts](src/lib/i18n/kamus.ts). TypeScript memastikan kunci `en` sama dengan `id`.
- Nama tokoh, barang, lokasi, motif, dan benda: field `en` / `nama_en` di `data/`.
- Isi kasus: blok `terjemahan.en` di setiap file kasus. Server mengirim teks sesuai bahasa pemain;
  logika, solusi, dan sesi tidak berubah, jadi pemain bisa ganti bahasa di tengah kasus.

## Struktur

```
data/                  karakter, barang, lokasi, motif, ruangan (+ hotspot 5 ruangan dalam persen)
kasus/YYYY-MM-DD.json  satu file per kasus: publik + isi benda + solusi (hanya dibaca server)
tools/                 cek-kasus (validator + solver), buat-draf (generator)
src/lib/engine/        logika murni: solver (bitset), validator, generator, aturan main, waktu WIB
src/lib/server/        muat data, token pemain, penyimpanan sesi, rate limit, layanan API
src/lib/components/    UI; ruang/ berisi ilustrasi 5 ruangan + Si Belang + pencahayaan
src/service-worker.ts  PWA: cache aset, API selalu lewat jaringan, halaman offline
src/routes/            beranda, kasus, statistik, cara-main, tentang, privasi, api/
```

## Keamanan jawaban (dokumen 06 bagian 4)

- Data awal hanya berisi context card, pilihan, pengakuan (teksnya saja), dan state ruangan. Isi benda dikirim **satu per satu**.
- Tuduhan divalidasi di server; solusi dan penjelasan hanya ikut di respons saat kasus selesai.
- Kasus yang belum terbit dijawab 404; `?tanggal=` dan endpoint pratinjau mati di produksi.
- ID pemain anonim: token HMAC di cookie `httpOnly`. Aksi API dibatasi 30 beruntun / 1 per detik per IP.
- Service worker tidak pernah meng-cache `/api/*`.

## Catatan desain

- **Hari berbohong menyisakan lebih sedikit kombinasi** daripada target kasar dokumen 04 (kasus #5: 8, kasus #6: 19, target 15–35 / 40+),
  karena pengakuan pelaku dipaksa salah. Tingkat kesulitannya datang dari mencari bukti di 60 benda. Target perlu dikalibrasi saat beta.
- Kasus #1–#5 dibuat saat prototipe dengan semua clue di Ruang Tamu; `cek-kasus` memberi catatan "disarankan minimal 3 ruangan".
- Ilustrasi ruangan, potret, dan ikon masih vektor sementara buatan kode, menunggu aset ilustrator.
- Sesi pemain: Upstash Redis kalau `KV_REST_API_*` diisi (Vercel), selain itu file `.data/sesi.json` (lokal, satu instance).
- Data dunia dan kasus dimasukkan ke bundle server saat build ([bundel.ts](src/lib/server/bundel.ts)); tidak pernah ke bundle klien.

## Belum ada

Database + job impor kasus · login & sinkron · analitik · Sentry · peringatan stok kasus · statistik global ·
gambar kartu hasil & OG image · grid deduksi · kasus latihan · aset final ilustrator · 23 kasus lagi untuk target 30.
