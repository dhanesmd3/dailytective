// Validator skema kasus (dokumen 04, bagian 3.4). Galat = wajib diperbaiki; peringatan = perlu dicek penulis.

import { PENANDA_DRAF } from './generator';
import { terjemahanKurang } from './terjemahan';
import type { DataDunia, KasusFile, Kategori, Kondisi, Logika } from './types';
import { KATEGORI } from './types';
import { apakahTanggalValid, indeksHari, namaHari } from './waktu';

export interface HasilValidasi {
	galat: string[];
	peringatan: string[];
}

const UKURAN_PER_BINTANG = { 1: 3, 2: 4, 3: 5 } as const;
const CLUE_AWAL_PER_BINTANG = { 1: 3, 2: 2, 3: 1 } as const;
/** Jadwal mingguan GDD bagian 10, indeks 0 = Minggu. */
const BINTANG_PER_HARI = [3, 1, 1, 2, 2, 2, 3] as const;
const ATRIBUT_DIKENAL = ['tinggi', 'tinggi_cm', 'tangan', 'sepatu', 'kacamata', 'kelamin', 'tinggal_di_rumah', 'ciri'];
const JENIS = ['pencurian', 'kehilangan', 'sabotase', 'kejahilan', 'pecah_rusak', 'pembunuhan'];
const MAKS_KATA_BUKTI = 25;

export function validasiKasus(kasus: KasusFile, dunia: DataDunia): HasilValidasi {
	const galat: string[] = [];
	const peringatan: string[] = [];

	const idKarakter = new Set(dunia.karakter.map((k) => k.id));
	const idBarang = new Set(dunia.barang.map((b) => b.id));
	const idLokasi = new Set(dunia.lokasi.map((l) => l.id));
	const bendaKeRuangan = new Map<string, { ruangan: string; ilustrasi: boolean }>();
	for (const r of dunia.ruangan)
		for (const b of r.benda) bendaKeRuangan.set(b.id, { ruangan: r.id, ilustrasi: r.ilustrasi });

	if (kasus.versi_skema !== 1) galat.push(`versi_skema harus 1, didapat ${kasus.versi_skema}`);
	if (!Number.isInteger(kasus.id) || kasus.id < 1) galat.push('id harus bilangan bulat positif');
	if (!apakahTanggalValid(kasus.tanggal)) galat.push(`tanggal tidak valid: ${kasus.tanggal}`);
	if (!kasus.judul?.trim()) galat.push('judul kosong');
	if (!JENIS.includes(kasus.jenis)) galat.push(`jenis tidak dikenal: ${kasus.jenis}`);
	if (!kasus.context_card?.cerita?.trim()) galat.push('context_card.cerita kosong');
	if (!kasus.komentar_nenek?.trim()) peringatan.push('komentar_nenek kosong');
	if (!kasus.teks_kosong_bawaan?.trim()) galat.push('teks_kosong_bawaan kosong');
	if (!Number.isInteger(kasus.jatah_periksa) || kasus.jatah_periksa < 1) galat.push('jatah_periksa harus >= 1');

	// Pilihan
	const bintang = kasus.kesulitan?.bintang;
	if (![1, 2, 3].includes(bintang)) {
		galat.push(`kesulitan.bintang harus 1, 2, atau 3`);
		return { galat, peringatan };
	}
	const ukuran = UKURAN_PER_BINTANG[bintang];
	const kenal = { siapa: idKarakter, pakai: idBarang, dimana: idLokasi, kenapa: new Set(dunia.motif.map((m) => m.id)) };
	const kategori = KATEGORI.filter((k) => k !== 'kenapa' || kasus.pilihan?.kenapa !== undefined);
	for (const kat of kategori) {
		const daftar = kasus.pilihan?.[kat] ?? [];
		if (daftar.length !== ukuran)
			galat.push(`pilihan.${kat} berisi ${daftar.length}, seharusnya ${ukuran} untuk bintang ${bintang}`);
		if (new Set(daftar).size !== daftar.length) galat.push(`pilihan.${kat} punya id ganda`);
		for (const id of daftar) if (!kenal[kat].has(id)) galat.push(`pilihan.${kat}: id "${id}" tidak ada di data`);
	}
	if (kasus.pilihan?.siapa?.includes('nenek')) galat.push('Nenek tidak boleh jadi tersangka');

	// Solusi
	for (const kat of kategori) {
		const s = kasus.solusi?.[kat];
		if (!s) galat.push(`solusi.${kat} kosong`);
		else if (!kasus.pilihan[kat]?.includes(s)) galat.push(`solusi.${kat} "${s}" tidak ada di pilihan`);
	}
	if (kasus.solusi?.kenapa && !kasus.pilihan.kenapa) galat.push('solusi.kenapa diisi tapi pilihan.kenapa tidak ada');

	// Pengakuan (hari berbohong): satu per tersangka, masing-masing punya logika
	const pengakuan = kasus.pengakuan ?? [];
	if (pengakuan.length) {
		const oleh = pengakuan.map((p) => p.oleh);
		const tersangka = kasus.pilihan.siapa ?? [];
		if (new Set(oleh).size !== oleh.length) galat.push('pengakuan: satu tersangka hanya boleh memberi satu pengakuan');
		for (const s of tersangka) if (!oleh.includes(s)) galat.push(`pengakuan: ${s} belum memberi pengakuan`);
		for (const p of pengakuan) {
			if (!tersangka.includes(p.oleh)) galat.push(`pengakuan ${p.id}: "${p.oleh}" bukan tersangka kasus ini`);
			if (!p.teks?.trim()) galat.push(`pengakuan ${p.id}: teks kosong`);
			if (!kasus.logika?.[p.id]) galat.push(`pengakuan ${p.id} tidak punya logika`);
		}
	}

	// Clue awal
	const clueAwal = kasus.context_card?.clue_awal ?? [];
	const jumlahAwal = CLUE_AWAL_PER_BINTANG[bintang];
	if (clueAwal.length !== jumlahAwal)
		galat.push(`clue awal berjumlah ${clueAwal.length}, seharusnya ${jumlahAwal} untuk bintang ${bintang}`);

	const semuaIdClue = new Set<string>();
	const tambahId = (id: string, asal: string) => {
		if (semuaIdClue.has(id)) galat.push(`id clue "${id}" dipakai lebih dari sekali (${asal})`);
		semuaIdClue.add(id);
	};
	for (const c of clueAwal) {
		tambahId(c.id, 'clue awal');
		if (!kasus.logika?.[c.id]) galat.push(`clue awal ${c.id} tidak punya logika`);
	}
	for (const p of pengakuan) tambahId(p.id, 'pengakuan');

	// Benda TKP
	let jumlahPendukung = 0;
	let jumlahKosongKhusus = 0;
	for (const [idBenda, isi] of Object.entries(kasus.benda ?? {})) {
		const r = bendaKeRuangan.get(idBenda);
		if (!r) {
			galat.push(`benda "${idBenda}" tidak ada di data ruangan`);
			continue;
		}
		if (!r.ilustrasi) peringatan.push(`benda "${idBenda}" ada di ruangan ${r.ruangan} yang belum punya ilustrasi`);
		if (!['clue', 'pendukung', 'kosong'].includes(isi.hasil)) galat.push(`benda "${idBenda}": hasil tidak dikenal`);
		if (!isi.teks?.trim()) galat.push(`benda "${idBenda}": teks kosong`);
		if (isi.hasil === 'kosong') {
			jumlahKosongKhusus++;
			if (isi.id_clue) galat.push(`benda "${idBenda}" kosong tapi punya id_clue`);
			continue;
		}
		if (!isi.id_clue) {
			galat.push(`benda "${idBenda}" (${isi.hasil}) tidak punya id_clue`);
			continue;
		}
		tambahId(isi.id_clue, `benda ${idBenda}`);
		if (isi.hasil === 'clue' && !kasus.logika?.[isi.id_clue])
			galat.push(`clue ${isi.id_clue} (${idBenda}) tidak punya logika`);
		if (isi.hasil === 'pendukung') {
			jumlahPendukung++;
			if (kasus.logika?.[isi.id_clue]) peringatan.push(`clue pendukung ${isi.id_clue} punya logika; solver mengabaikannya`);
		}
		const kata = isi.teks.trim().split(/\s+/).length;
		if (kata > MAKS_KATA_BUKTI) peringatan.push(`teks bukti ${isi.id_clue} ${kata} kata (maks. ${MAKS_KATA_BUKTI})`);
	}
	if (jumlahPendukung > 2) galat.push(`clue pendukung ${jumlahPendukung}, maksimal 2`);
	if (jumlahKosongKhusus < 4)
		peringatan.push(`hanya ${jumlahKosongKhusus} teks kosong khusus; disarankan 6–10 untuk variasi`);

	// Logika
	for (const [id, l] of Object.entries(kasus.logika ?? {})) {
		if (!semuaIdClue.has(id)) peringatan.push(`logika ${id} tidak dipakai clue mana pun`);
		for (const p of periksaLogika(l, kasus)) galat.push(`logika ${id}: ${p}`);
	}

	// Penjelasan
	if (!kasus.penjelasan?.length) galat.push('penjelasan kosong');
	for (const [i, langkah] of (kasus.penjelasan ?? []).entries()) {
		for (const b of langkah.bukti)
			if (!semuaIdClue.has(b)) galat.push(`penjelasan langkah ${i + 1} merujuk clue "${b}" yang tidak ada`);
	}

	// State ruangan
	for (const idR of Object.keys(kasus.state_ruangan ?? {}))
		if (!dunia.ruangan.some((r) => r.id === idR)) galat.push(`state_ruangan: ruangan "${idR}" tidak dikenal`);

	// Jadwal kesulitan mingguan
	if (apakahTanggalValid(kasus.tanggal)) {
		const hari = indeksHari(kasus.tanggal);
		if (BINTANG_PER_HARI[hari] !== bintang)
			peringatan.push(`${namaHari(kasus.tanggal)} seharusnya bintang ${BINTANG_PER_HARI[hari]}, kasus ini bintang ${bintang}`);
		if (kasus.kesulitan.label !== namaHari(kasus.tanggal))
			peringatan.push(`kesulitan.label "${kasus.kesulitan.label}" tidak sama dengan hari "${namaHari(kasus.tanggal)}"`);
		const hariBohong = hari === 5 || hari === 6;
		if (hariBohong && !pengakuan.length) peringatan.push(`${namaHari(kasus.tanggal)} seharusnya memakai tersangka berbohong (pengakuan)`);
		if (!hariBohong && pengakuan.length) peringatan.push(`pengakuan dipakai di hari ${namaHari(kasus.tanggal)}; jadwalnya hanya Jumat–Sabtu`);
		if (hari === 0 && !kasus.pilihan.kenapa) peringatan.push('Minggu seharusnya memakai kategori motif (pilihan.kenapa)');
		if (hari !== 0 && kasus.pilihan.kenapa) peringatan.push(`motif dipakai di hari ${namaHari(kasus.tanggal)}; jadwalnya hanya Minggu`);
		const jatah = hari === 0 ? 12 : 10;
		if (kasus.jatah_periksa !== jatah) peringatan.push(`jatah periksa ${kasus.jatah_periksa}, jadwal ${namaHari(kasus.tanggal)} memakai ${jatah}`);
	}
	// Terjemahan bahasa Inggris (kasus tetap bisa terbit; teks yang kurang tampil dalam bahasa Indonesia)
	const kurang = terjemahanKurang(kasus, 'en');
	if (kurang.length) peringatan.push(`terjemahan en belum lengkap: ${kurang.slice(0, 6).join(', ')}${kurang.length > 6 ? ', …' : ''}`);
	for (const id of Object.keys(kasus.terjemahan?.en?.benda ?? {}))
		if (!kasus.benda?.[id]) galat.push(`terjemahan en: benda "${id}" tidak ada di kasus`);

	// Draf dari generator tidak boleh terbit sebelum ditulis ulang
	const semuaTeks = JSON.stringify([kasus.judul, kasus.context_card, kasus.benda, kasus.pengakuan, kasus.penjelasan, kasus.komentar_nenek]);
	if (semuaTeks.includes(PENANDA_DRAF)) galat.push(`masih ada teks ${PENANDA_DRAF} dari generator; tulis ulang sebelum terbit`);

	if (pengakuan.length && !(kasus.context_card?.cerita ?? '').toLowerCase().includes('berbohong'))
		peringatan.push('kasus memakai pengakuan; context card sebaiknya menyebut "Salah satu tersangka berbohong."');

	return { galat, peringatan };
}

function periksaLogika(l: Logika, kasus: KasusFile): string[] {
	const masalah: string[] = [];
	const cekId = (kat: Kategori, id: string | undefined) => {
		if (id !== undefined && !kasus.pilihan[kat]?.includes(id)) masalah.push(`${kat} "${id}" tidak ada di pilihan`);
	};
	const cekKondisi = (k: Kondisi) => {
		for (const kat of KATEGORI) cekId(kat, k[kat]);
		for (const a of Object.keys(k.atribut ?? {}))
			if (!ATRIBUT_DIKENAL.includes(a)) masalah.push(`atribut "${a}" tidak dikenal`);
		if (k.bukan) cekKondisi(k.bukan);
	};
	switch (l.tipe) {
		case 'atribut':
		case 'atribut_bukan':
			if (!ATRIBUT_DIKENAL.includes(l.atribut)) masalah.push(`atribut "${l.atribut}" tidak dikenal`);
			break;
		case 'fakta':
		case 'bukan': {
			const isi = KATEGORI.filter((kat) => l[kat] !== undefined);
			if (isi.length === 0) masalah.push(`${l.tipe} harus menyebut siapa/pakai/dimana`);
			if (l.tipe === 'bukan' && isi.length > 1) masalah.push('bukan hanya boleh menyebut satu kategori');
			for (const kat of KATEGORI) cekId(kat, l[kat]);
			break;
		}
		case 'jika_maka':
			cekKondisi(l.jika);
			for (const m of Array.isArray(l.maka) ? l.maka : [l.maka]) cekKondisi(m);
			break;
		default:
			masalah.push(`tipe "${(l as { tipe: string }).tipe}" tidak dikenal`);
	}
	return masalah;
}

/** Cek lintas kasus: tanggal dan id tidak boleh bentrok. */
export function validasiKoleksi(daftar: KasusFile[]): string[] {
	const galat: string[] = [];
	const tanggal = new Map<string, number>();
	const id = new Map<number, string>();
	for (const k of daftar) {
		if (tanggal.has(k.tanggal)) galat.push(`tanggal ${k.tanggal} dipakai kasus #${tanggal.get(k.tanggal)} dan #${k.id}`);
		tanggal.set(k.tanggal, k.id);
		if (id.has(k.id)) galat.push(`id #${k.id} dipakai di ${id.get(k.id)} dan ${k.tanggal}`);
		id.set(k.id, k.tanggal);
	}
	return galat;
}
