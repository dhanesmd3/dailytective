// Mengubah data dunia dan kasus ke bahasa pemain. Hasilnya salinan dengan struktur yang sama, jadi solver,
// aturan main, dan server tidak perlu tahu soal bahasa. Teks yang belum diterjemahkan tetap bahasa Indonesia.

import type { DataDunia, KasusFile } from './types';

export type BahasaData = 'id' | 'en';

export function duniaDalam(dunia: DataDunia, bahasa: BahasaData): DataDunia {
	if (bahasa === 'id') return dunia;
	return {
		karakter: dunia.karakter.map((k) =>
			k.en
				? { ...k, nama: k.en.nama, peran: k.en.peran, kebiasaan: k.en.kebiasaan, atribut: { ...k.atribut, rambut: k.en.rambut } }
				: k
		),
		barang: dunia.barang.map((b) => ({ ...b, nama: b.nama_en ?? b.nama })),
		lokasi: dunia.lokasi.map((l) => ({ ...l, nama: l.nama_en ?? l.nama })),
		motif: dunia.motif.map((m) => ({ ...m, nama: m.nama_en ?? m.nama })),
		ruangan: dunia.ruangan.map((r) => ({
			...r,
			nama: r.nama_en ?? r.nama,
			benda: r.benda.map((b) => ({ ...b, nama: b.nama_en ?? b.nama }))
		}))
	};
}

export function kasusDalam(kasus: KasusFile, bahasa: BahasaData): KasusFile {
	const tr = bahasa === 'id' ? undefined : kasus.terjemahan?.[bahasa];
	if (!tr) return kasus;
	return {
		...kasus,
		judul: tr.judul ?? kasus.judul,
		context_card: {
			cerita: tr.cerita ?? kasus.context_card.cerita,
			clue_awal: kasus.context_card.clue_awal.map((c) => ({ ...c, teks: tr.clue_awal?.[c.id] ?? c.teks }))
		},
		pengakuan: kasus.pengakuan.map((p) => ({ ...p, teks: tr.pengakuan?.[p.id] ?? p.teks })),
		benda: Object.fromEntries(
			Object.entries(kasus.benda).map(([id, b]) => [id, { ...b, teks: tr.benda?.[id] ?? b.teks }])
		),
		teks_kosong_bawaan: tr.teks_kosong_bawaan ?? kasus.teks_kosong_bawaan,
		penjelasan: kasus.penjelasan.map((p, i) => ({ ...p, teks: tr.penjelasan?.[i] ?? p.teks })),
		komentar_nenek: tr.komentar_nenek ?? kasus.komentar_nenek
	};
}

/** Daftar teks yang belum diterjemahkan, untuk peringatan validator. */
export function terjemahanKurang(kasus: KasusFile, bahasa: 'en'): string[] {
	const tr = kasus.terjemahan?.[bahasa];
	if (!tr) return ['seluruh kasus'];
	const kurang: string[] = [];
	if (!tr.judul) kurang.push('judul');
	if (!tr.cerita) kurang.push('cerita');
	for (const c of kasus.context_card.clue_awal) if (!tr.clue_awal?.[c.id]) kurang.push(`clue_awal.${c.id}`);
	for (const p of kasus.pengakuan) if (!tr.pengakuan?.[p.id]) kurang.push(`pengakuan.${p.id}`);
	for (const id of Object.keys(kasus.benda)) if (!tr.benda?.[id]) kurang.push(`benda.${id}`);
	if (!tr.teks_kosong_bawaan) kurang.push('teks_kosong_bawaan');
	if ((tr.penjelasan?.length ?? 0) !== kasus.penjelasan.length) kurang.push('penjelasan');
	if (!tr.komentar_nenek) kurang.push('komentar_nenek');
	return kurang;
}
