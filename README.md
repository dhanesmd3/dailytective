# Dailytective · Prototipe (Fase 1)

Satu kasus detektif setiap hari dari rumah Nenek. Dokumen desain ada di [dailytective-docs/](dailytective-docs/README.md).

## Menjalankan

```bash
npm install
npm run dev          # http://localhost:5173
```

Kasus prototipe terjadwal **2–6 November 2026**. Sebelum tanggal itu, beranda menampilkan "Belum ada kasus hari ini".
Saat `npm run dev`, **mode pratinjau** aktif otomatis: beranda menampilkan daftar semua kasus, dan `?tanggal=2026-11-02`
bisa dipakai untuk melompat tanggal. Tombol **Ulangi** di halaman kasus menghapus progres supaya kasus bisa dimainkan lagi.

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server pengembangan (mode pratinjau aktif) |
| `npm test` | Unit test solver, aturan main, streak, waktu rilis, teks share |
| `npm run cek-kasus` | Validator skema + solver S1–S6 untuk semua kasus di `kasus/` (keluar dengan kode 1 kalau gagal, siap untuk CI) |
| `npm run cek-kasus -- 2026-11-04` | Cek satu kasus, lengkap dengan daftar jalur bukti minimal |
| `npm run check` | Type check (svelte-check) |
| `npm run build && npm start` | Build produksi (adapter-node) |

Variabel lingkungan: lihat [.env.example](.env.example). `DT_SECRET` **wajib** diisi di luar lokal.

## Struktur

```
data/               karakter, barang, lokasi, ruangan (+ posisi hotspot dalam persen)
kasus/YYYY-MM-DD.json  satu file per kasus: bagian publik + isi benda + solusi (hanya dibaca server)
tools/cek-kasus.ts  CLI validator + solver untuk penulis kasus
tests/fixtures/     contoh "Bolu Pandan yang Dicuil" dari dokumen 04
src/lib/engine/     logika murni: solver, validator, aturan main, waktu WIB (bisa di-unit-test)
src/lib/server/     muat data, token pemain anonim, penyimpanan sesi, layanan API
src/lib/components/ UI: ruangan, Buku Catatan, papan tuduhan, hasil, potret & ikon sementara
src/routes/api/     GET kasus/hari-ini · POST kasus/{id}/mulai|periksa|tuduh · GET saya · (pratinjau) GET pratinjau, DELETE kasus/{id}/sesi
```

## Keamanan jawaban (dokumen 06 bagian 4)

- Data awal hanya berisi context card, pilihan, dan state ruangan. Isi benda dikirim **satu per satu** saat diperiksa.
- Tuduhan divalidasi di server; solusi dan penjelasan hanya ikut di respons saat kasus selesai.
- Kasus yang tanggalnya belum tiba dijawab 404, dan folder `kasus/` tidak pernah disajikan sebagai file statis.
- ID pemain anonim adalah token HMAC di cookie `httpOnly` (bukan `localStorage`, supaya tidak bisa dibaca script).

## Penyesuaian khusus prototipe

- **Jatah periksa 6 (★) dan 7 (★★)**, bukan 10. Dengan satu ruangan berisi 12 benda, jatah 10 berarti hampir semua benda bisa
  diperiksa dan pilihan jadi tidak bermakna. Aturan S3 (bukti minimum ≤ jatah − 4) tetap dipenuhi.
- Pilihan "Di mana" memakai titik di dalam Ruang Tamu (kolong sofa, rak buku, dst.) atau ruangan lain yang ditunjuk
  oleh bukti di Ruang Tamu.
- Penyimpanan sesi memakai file `.data/sesi.json` lewat antarmuka `PenyimpananSesi`, supaya bisa diganti Postgres/Supabase.
- Ilustrasi ruangan, potret, dan ikon adalah vektor sementara buatan kode, bukan aset final.

## Belum ada (sesuai roadmap fase 2+)

Ruangan selain Ruang Tamu · tersangka berbohong (Jumat–Sabtu) dan kategori motif (Minggu) · login & sinkron ·
statistik global · gambar kartu hasil · PWA (manifest, service worker) · rate limit · analitik · grid deduksi ·
pengaturan (suara, kontras tinggi) · kasus latihan · generator kasus.
