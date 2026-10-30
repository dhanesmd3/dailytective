# 06 · Spesifikasi Teknis

*Dailytective · v1.0 · 30 Oktober 2026*

> **Asumsi:** "desktop app" diwujudkan sebagai **web app desktop-first** yang bisa di-*install* sebagai PWA di Windows/Mac (Chrome, Edge, dan Safari macOS lewat "Add to Dock"), dan menyesuaikan tampilannya di HP. Kalau ke depan dibutuhkan aplikasi unduhan, web app yang sama bisa dibungkus dengan Tauri atau Electron tanpa menulis ulang game-nya.

---

## 1. Gambaran arsitektur

```
┌─────────────────────────────┐        ┌────────────────────────────┐
│  Web app (PWA)              │        │  API (serverless)           │
│  • UI game                  │ HTTPS  │  • kasus hari ini           │
│  • progres lokal            │◄──────►│  • periksa benda            │
│  • service worker (cache)   │        │  • validasi tuduhan         │
└─────────────────────────────┘        │  • statistik                │
            ▲                          └─────────────┬──────────────┘
            │ aset statis (CDN)                      │
            │                                        ▼
┌─────────────────────────────┐        ┌────────────────────────────┐
│  CDN: gambar, font, JS       │        │  Database (Postgres)        │
└─────────────────────────────┘        │  • kasus + solusi           │
                                       │  • sesi main                │
┌─────────────────────────────┐        │  • akun (opsional)          │
│  Repo kasus (privat)         │  CI   │  • statistik agregat        │
│  JSON + validator + solver   ├──────►└────────────────────────────┘
└─────────────────────────────┘ impor
```

## 2. Rekomendasi stack

Ini rekomendasi, bukan keharusan. Pilih yang paling dikuasai tim.

| Bagian | Rekomendasi | Alternatif | Alasan |
|---|---|---|---|
| Bahasa | TypeScript | – | Solver, validator, dan app memakai satu bahasa dan berbagi tipe data |
| Framework web | SvelteKit | Next.js, Nuxt | Bundel kecil dan cepat; ada rute API bawaan |
| Styling | CSS biasa dengan *custom properties* (token dari dokumen 05) | Tailwind | Token warna dari art direction langsung dipakai |
| Hosting + API | Cloudflare Pages + Workers | Vercel, Netlify | CDN global, murah, cocok untuk lonjakan trafik pagi hari |
| Database + auth | Supabase (Postgres + Auth) | Firebase, Neon + Auth.js | Postgres untuk statistik; login Google/email sudah tersedia |
| Analitik | Plausible atau PostHog | Umami | Ramah privasi; Plausible tanpa cookie |
| Error monitoring | Sentry | – | – |
| Test | Vitest (unit), Playwright (end-to-end) | – | – |

## 3. Rilis harian

- Satu kasus per tanggal **WIB (Asia/Jakarta, UTC+7, tanpa daylight saving)**.
- Kasus baru aktif pukul **06.00 WIB = 23.00 UTC hari sebelumnya**.
- **Server** yang menentukan "kasus hari ini", bukan jam di perangkat pemain. Ini mencegah pemain melompat ke kasus besok dengan mengubah jam perangkat.
- Pemain di zona waktu lain mendapat kasus yang sama pada saat yang sama.
- Hitung mundur di layar memakai selisih jam server yang dikirim API.
- Kasus masa depan **tidak boleh** bisa diakses publik, termasuk lewat URL file statis.

## 4. Keamanan jawaban dan clue

Ini keputusan teknis paling penting. Di desktop, DevTools sangat mudah dibuka.

| Data | Dikirim ke pemain? | Cara |
|---|---|---|
| Context card, pilihan, state ruangan | Ya, di awal | `GET /api/kasus/hari-ini` |
| Isi benda (clue / kosong) | **Satu per satu**, saat diperiksa | `POST /api/kasus/{id}/periksa` |
| Solusi dan penjelasan | **Hanya setelah kasus selesai** (menang atau 3 tuduhan habis) | Disertakan di respons tuduhan terakhir |

**Kenapa isi benda tidak dikirim sekaligus:** kalau semua isi benda ada di data awal, pemain bisa membaca semua clue lewat DevTools tanpa memakai jatah periksa, dan jatah periksa jadi tidak berarti.

**Kenapa tidak memakai hash di sisi pemain:** dengan hanya 27–125 kombinasi, hash jawaban bisa dibobol dengan mencoba semua kombinasi dalam sekejap. Feedback "X dari 3 benar" juga tidak bisa dihitung dari satu hash. Jadi validasi harus di server.

**Batasan yang diterima:** pemain tanpa akun bisa membuka sesi baru (misalnya jendela penyamaran) untuk mencoba lagi. Ini hanya merugikan dirinya sendiri dan sedikit mengotori statistik global. Batasi dengan *rate limit* per IP. Kalau nanti ada papan skor, papan skor hanya untuk pemain yang login.

## 5. API

Semua respons JSON. Pemain diidentifikasi dengan **ID pemain anonim** (dibuat server saat kunjungan pertama, dikirim sebagai token bertanda tangan).

### `GET /api/kasus/hari-ini`
```json
{
  "server_time": "2026-11-02T06:12:03+07:00",
  "berikutnya": "2026-11-03T06:00:00+07:00",
  "kasus": { "id": 129, "tanggal": "2026-11-02", "judul": "…", "context_card": { }, "pilihan": { }, "state_ruangan": { }, "jatah_periksa": 10 },
  "sesi": { "periksa": ["tk_meja"], "tuduhan": [], "status": "berjalan" }
}
```
`sesi` berisi progres pemain kalau ia sudah mulai, sehingga bisa melanjutkan di tab lain.

### `POST /api/kasus/{id}/periksa`
Request: `{ "benda": "tk_meja" }`
```json
{ "hasil": "clue", "nomor": 1, "teks": "Remah bolu berceceran di meja teras.", "sisa_jatah": 8 }
```
- Memeriksa ulang benda yang sama tidak mengurangi jatah.
- Kalau jatah habis: `409` dengan `{ "error": "jatah_habis" }`.

### `POST /api/kasus/{id}/tuduh`
Request: `{ "siapa": "wati", "pakai": "pisau_roti", "dimana": "teras" }`
```json
{ "benar": 2, "tuduhan_ke": 1, "selesai": false }
```
Saat selesai (menang atau tuduhan ke-3):
```json
{
  "benar": 3, "tuduhan_ke": 2, "selesai": true, "menang": true,
  "solusi": { "siapa": "wati", "pakai": "pisau_roti", "dimana": "teras" },
  "penjelasan": [ ],
  "komentar_nenek": "…",
  "gelar": "Detektif Tekun"
}
```
- Kombinasi yang sudah pernah dituduhkan ditolak dengan `409`.

### `GET /api/kasus/{id}/statistik`
Hanya bisa diakses setelah pemain selesai. Isinya persentase menang per tebakan dan rata-rata periksa.

### `GET /api/saya`
Statistik pribadi: jumlah main, persentase menang, distribusi tebakan, streak saat ini, streak terpanjang.

### `POST /api/akun/sambung` (P1)
Setelah login, menggabungkan riwayat ID anonim ke akun. Kalau ada konflik streak, ambil yang lebih panjang.

## 6. Model data

```sql
-- Kasus
create table kasus (
  id            int primary key,
  tanggal       date unique not null,
  data_publik   jsonb not null,      -- context card, pilihan, state ruangan
  isi_benda     jsonb not null,      -- hasil per benda, TIDAK dikirim utuh
  solusi        jsonb not null,      -- siapa/pakai/dimana + logika + penjelasan
  kesulitan     smallint not null,
  versi_skema   smallint not null,
  dibuat_at     timestamptz default now()
);

-- Pemain (anonim atau terhubung akun)
create table pemain (
  id            uuid primary key,
  user_id       uuid null references auth.users,
  dibuat_at     timestamptz default now()
);

-- Satu sesi = satu pemain memainkan satu kasus
create table sesi (
  pemain_id     uuid references pemain,
  kasus_id      int references kasus,
  periksa       text[] default '{}',
  tuduhan       jsonb default '[]',  -- [{siapa,pakai,dimana,benar}]
  status        text default 'berjalan',  -- berjalan | menang | kalah
  mulai_at      timestamptz default now(),
  selesai_at    timestamptz null,
  primary key (pemain_id, kasus_id)
);

-- Statistik agregat per kasus (diperbarui berkala)
create table statistik_kasus (
  kasus_id      int primary key references kasus,
  pemain        int, menang int,
  menang_t1 int, menang_t2 int, menang_t3 int,
  rata_periksa  numeric, median_detik int
);
```

**Penyimpanan lokal di perangkat** (untuk main tanpa login dan tampilan instan):

| Kunci | Isi |
|---|---|
| `dt_token` | Token ID pemain anonim |
| `dt_sesi_{tanggal}` | Salinan progres hari itu |
| `dt_statistik` | Cache statistik pribadi |
| `dt_pengaturan` | Suara, kontras, kurangi animasi |
| `dt_onboarding` | Sudah melihat cara main atau belum |

Semua akses penyimpanan lokal dibungkus `try/catch`. Kalau tidak tersedia (mode privat tertentu), game tetap jalan dan progres hanya diambil dari server.

## 7. Alur konten kasus

Untuk MVP, panel admin diganti dengan alur berbasis repo yang lebih sederhana:

```
Repo privat: dailytective-kasus
├── data/karakter.json, ruangan.json, barang.json
├── kasus/2026-11-02.json         ← satu file per kasus (publik + isi benda + solusi)
├── tools/validasi.ts             ← cek skema
├── tools/solver.ts               ← cek S1–S6 (dokumen 04)
└── tools/pratinjau               ← jalankan game lokal dengan kasus tertentu
```

1. Penulis membuat file kasus di cabang baru, lalu membuka pull request.
2. CI menjalankan validator dan solver. Pull request tidak bisa digabung kalau gagal.
3. Reviewer memeriksa teks dan memainkan pratinjau.
4. Setelah digabung, job impor memasukkan kasus ke database.
5. API hanya melayani kasus yang `tanggal <= hari ini (WIB)`.

Panel admin berbasis web (P1) bisa dibuat belakangan untuk penulis yang tidak memakai Git.

### Peringatan otomatis
- **Stok kasus < 14 hari:** kirim peringatan ke tim
- **Kasus besok belum ada pukul 18.00 WIB:** peringatan mendesak
- **Pukul 06.01 WIB kasus hari ini tidak bisa diambil:** peringatan darurat

## 8. Front-end

### Struktur halaman
| Rute | Layar |
|---|---|
| `/` | Beranda (atau langsung ke kasus hari ini kalau sudah pernah main) |
| `/kasus` | Context card → TKP → tuduhan → hasil, sebagai satu halaman dengan beberapa tahap |
| `/statistik` | Statistik pribadi |
| `/cara-main` | Cara main |
| `/privasi`, `/tentang` | Halaman statis |

### Layout responsif
| Lebar | Layout |
|---|---|
| ≥ 1280 px | Ruangan besar + sidebar 340 px (Buku Catatan) |
| 1024–1279 px | Ruangan + sidebar 300 px |
| 640–1023 px | Ruangan penuh lebar, Buku Catatan sebagai panel geser |
| < 640 px | Ruangan bisa digeser horizontal, Buku Catatan sebagai lembar dari bawah |

### Hotspot ruangan
- Posisi hotspot disimpan dalam **persen** terhadap kanvas ruangan (`data/ruangan.json`), supaya tetap tepat di semua ukuran layar.
- Kursor kaca pembesar di seluruh ruangan. Tidak ada efek hover pada hotspot.
- **Aksesibilitas keyboard:** semua benda yang bisa diklik di ruangan aktif bisa dijangkau dengan Tab, punya label ("Periksa jam dinding"), dan bisa ditampilkan sebagai daftar. Yang dirahasiakan adalah *isi* benda, bukan *keberadaannya*, jadi ini tidak membocorkan clue.

### PWA
- Manifest: nama "Dailytective", ikon, warna tema `#2B1D14`, `display: standalone`
- Service worker: cache aset statis dan gambar ruangan. Data kasus dan aksi (periksa, tuduh) tetap butuh koneksi.
- Saat offline: tampilkan pesan "Butuh koneksi untuk menyelidiki", dengan progres yang sudah ada tetap terlihat.

### Anggaran performa
| Item | Target |
|---|---|
| JS awal (gzip) | < 120 KB |
| Total unduhan awal | < 1,5 MB |
| Gambar ruangan aktif | < 300 KB (WebP) atau SVG teroptimasi |
| Siap dimainkan (4G, HP kelas menengah) | < 3 detik |
| Respons API periksa/tuduh | < 300 ms (p95) |

Ruangan aktif dimuat lebih dulu. Ruangan lain dimuat di latar belakang setelah ruangan aktif selesai.

## 9. Analitik

Tanpa data pribadi. Setiap event membawa `kasus_id`, `perangkat` (desktop/tablet/hp), dan ID pemain anonim (di-hash).

| Event | Properti |
|---|---|
| `buka_app` | sumber (langsung/share/sosmed), pemain baru atau lama |
| `lihat_onboarding` | langkah terakhir yang dilihat |
| `mulai_kasus` | – |
| `buka_context_card` | ke berapa kali dibuka |
| `pindah_ruangan` | ruangan |
| `periksa` | benda, hasil (clue/kosong), urutan |
| `buka_catatan` | – |
| `coret` | kategori |
| `tuduh` | tuduhan ke, jumlah benar |
| `selesai` | menang/kalah, tebakan, periksa, durasi |
| `share` | format (teks/gambar), tujuan kalau diketahui |
| `login` | metode |

Data ini sekaligus dipakai untuk menyetel kesulitan dan penempatan clue (dokumen 04, bagian 9).

## 10. Pengujian

| Jenis | Cakupan |
|---|---|
| Unit | Solver (semua tipe clue, hari berbohong, motif), validator skema, perhitungan streak, perhitungan gelar |
| Integrasi | API periksa dan tuduh: batas jatah, tuduhan ganda, solusi hanya keluar setelah selesai |
| Zona waktu | Pergantian hari tepat 06.00 WIB; pemain di zona waktu lain; jam perangkat yang salah |
| End-to-end | Alur lengkap menang dan kalah di desktop dan HP (Playwright) |
| Visual | Tampilan di 1920, 1440, 1280, 1024, 768, 390, dan 360 px |
| Aksesibilitas | Navigasi keyboard, pembaca layar, kontras |
| Beban | Simulasi lonjakan pemain pukul 06.00–08.00 WIB |
| Perangkat | Chrome/Edge/Safari/Firefox desktop; Android kelas bawah; iPhone |

## 11. Keamanan dan privasi

- Rate limit per IP pada endpoint periksa dan tuduh
- Token pemain ditandatangani server dan tidak bisa dipalsukan
- Kunci rahasia hanya ada di server
- Tanpa login: tidak ada data pribadi yang dikumpulkan. Dengan login: hanya email dan nama dari penyedia login.
- Kebijakan privasi sesuai UU Pelindungan Data Pribadi; pengguna bisa menghapus akunnya
- Analitik tanpa cookie (Plausible), sehingga tidak perlu banner persetujuan cookie

## 12. Lingkungan

| Lingkungan | Fungsi | Catatan |
|---|---|---|
| Lokal | Pengembangan, pratinjau kasus | Bisa mengatur "tanggal hari ini" secara manual |
| Staging | Uji sebelum rilis | Database terpisah, bisa melompat tanggal |
| Produksi | Pemain sungguhan | Tanggal mengikuti jam server WIB |
