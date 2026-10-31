<script lang="ts">
	import { pengaturan, simpanPengaturan } from '$lib/client/pengaturan.svelte';
	import { bunyi } from '$lib/client/suara';
	import { gantiBahasa, pakaiT, type Bahasa } from '$lib/i18n';
	import Modal from './Modal.svelte';

	let { tutup }: { tutup: () => void } = $props();
	const t = pakaiT();
	let gantiSibuk = $state(false);

	const PILIHAN = [
		{ kunci: 'suara', label: 'atur.suara', ket: 'atur.suara_ket' },
		{ kunci: 'kontrasTinggi', label: 'atur.kontras', ket: 'atur.kontras_ket' },
		{ kunci: 'kurangiAnimasi', label: 'atur.animasi', ket: 'atur.animasi_ket' }
	] as const;
	// Nama bahasa selalu ditulis dalam bahasanya sendiri supaya mudah dikenali.
	const BAHASA: { kode: Bahasa; nama: string }[] = [
		{ kode: 'id', nama: 'Bahasa Indonesia' },
		{ kode: 'en', nama: 'English' }
	];

	function ubah(kunci: (typeof PILIHAN)[number]['kunci']) {
		pengaturan[kunci] = !pengaturan[kunci];
		simpanPengaturan();
		if (kunci === 'suara' && pengaturan.suara) bunyi('bukti');
	}

	async function pilihBahasa(b: Bahasa) {
		if (b === t.bahasa || gantiSibuk) return;
		gantiSibuk = true;
		await gantiBahasa(b);
		gantiSibuk = false;
	}
</script>

<Modal judul={t('atur.judul')} {tutup} labelTutup={t('umum.tutup')} lebar={460}>
	<ul>
		<li class="bahasa">
			<div>
				<strong id="lbl-bahasa">{t('atur.bahasa')} · Language</strong>
				<p>{t('atur.bahasa_ket')}</p>
			</div>
			<div class="pilih-bahasa" role="radiogroup" aria-labelledby="lbl-bahasa">
				{#each BAHASA as b (b.kode)}
					<button
						role="radio"
						aria-checked={t.bahasa === b.kode}
						lang={b.kode}
						disabled={gantiSibuk}
						onclick={() => pilihBahasa(b.kode)}>{b.nama}</button
					>
				{/each}
			</div>
		</li>
		{#each PILIHAN as p (p.kunci)}
			<li>
				<div>
					<strong id="lbl-{p.kunci}">{t(p.label)}</strong>
					<p>{t(p.ket)}</p>
				</div>
				<button
					class="saklar"
					role="switch"
					aria-checked={pengaturan[p.kunci]}
					aria-labelledby="lbl-{p.kunci}"
					onclick={() => ubah(p.kunci)}
				>
					<span></span>
				</button>
			</li>
		{/each}
	</ul>
	<p class="catatan">{t('atur.catatan')}</p>
</Modal>

<style>
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 12px;
	}
	li {
		display: flex;
		gap: 14px;
		align-items: center;
		justify-content: space-between;
		border: 2px solid var(--tinta);
		border-radius: 10px;
		padding: 10px 12px;
		background: #fff8e6;
	}
	li.bahasa {
		flex-wrap: wrap;
	}
	li p {
		font-size: 13px;
		color: var(--coklat-teks);
	}
	.pilih-bahasa {
		display: inline-flex;
		border: 2.5px solid var(--tinta);
		border-radius: 999px;
		overflow: hidden;
	}
	.pilih-bahasa button {
		background: transparent;
		border: none;
		padding: 6px 12px;
		font-weight: 700;
		font-size: 13px;
		cursor: pointer;
		color: var(--tinta);
	}
	.pilih-bahasa button[aria-checked='true'] {
		background: var(--tinta);
		color: var(--krem);
	}
	.saklar {
		flex-shrink: 0;
		width: 56px;
		height: 32px;
		border-radius: 999px;
		border: 2.5px solid var(--tinta);
		background: #d8cfc0;
		position: relative;
		cursor: pointer;
	}
	.saklar span {
		position: absolute;
		top: 3px;
		left: 3px;
		width: 21px;
		height: 21px;
		border-radius: 50%;
		background: var(--krem);
		border: 2px solid var(--tinta);
		transition: transform 120ms;
	}
	.saklar[aria-checked='true'] {
		background: var(--hijau-sukses);
	}
	.saklar[aria-checked='true'] span {
		transform: translateX(24px);
	}
	.catatan {
		margin-top: 12px;
		font-size: 13px;
		color: var(--coklat-teks);
	}
</style>
