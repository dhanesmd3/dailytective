<script lang="ts">
	import type { StatistikPribadi } from '$lib/engine/permainan';
	import Modal from './Modal.svelte';

	let { statistik, tutup }: { statistik: StatistikPribadi; tutup: () => void } = $props();

	const baris = $derived([
		{ label: '1', nilai: statistik.distribusi[1] },
		{ label: '2', nilai: statistik.distribusi[2] },
		{ label: '3', nilai: statistik.distribusi[3] },
		{ label: 'Gagal', nilai: statistik.distribusi.gagal }
	]);
	const maks = $derived(Math.max(1, ...baris.map((b) => b.nilai)));
</script>

<Modal judul="Statistik kamu" {tutup} lebar={460}>
	<dl class="angka">
		<div><dt>Dimainkan</dt><dd>{statistik.dimainkan}</dd></div>
		<div><dt>Terpecahkan</dt><dd>{statistik.persen_menang}%</dd></div>
		<div><dt>Streak</dt><dd>{statistik.streak}</dd></div>
		<div><dt>Terpanjang</dt><dd>{statistik.streak_terpanjang}</dd></div>
	</dl>
	<h3 class="label">Distribusi tebakan</h3>
	<ul class="distribusi">
		{#each baris as b (b.label)}
			<li>
				<span class="kunci">{b.label}</span>
				<span class="batang" class:gagal={b.label === 'Gagal'} style:width="{Math.max(8, (b.nilai / maks) * 100)}%">{b.nilai}</span>
			</li>
		{/each}
	</ul>
	<p class="catatan">Rata-rata periksa per kasus: <strong>{statistik.rata_periksa}</strong></p>
	<p class="catatan">Progres tersimpan di perangkat ini tanpa perlu daftar.</p>
</Modal>

<style>
	.angka {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 8px;
		margin: 0 0 16px;
	}
	.angka div {
		text-align: center;
		background: #fff8e6;
		border: 2px solid var(--tinta);
		border-radius: 8px;
		padding: 6px 4px;
	}
	dt {
		font-size: 11px;
		font-weight: 700;
		color: var(--coklat-teks);
	}
	dd {
		margin: 0;
		font-family: var(--font-judul);
		font-size: 24px;
	}
	.label {
		color: var(--merah-bata);
		margin-bottom: 8px;
	}
	.distribusi {
		list-style: none;
		margin: 0 0 14px;
		padding: 0;
		display: grid;
		gap: 5px;
	}
	.distribusi li {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.kunci {
		width: 44px;
		font-weight: 700;
		font-size: 13px;
	}
	.batang {
		background: var(--hijau-sukses);
		color: var(--krem);
		font-weight: 700;
		font-size: 13px;
		text-align: right;
		padding: 2px 8px;
		border: 2px solid var(--tinta);
		border-radius: 6px;
		min-width: 28px;
	}
	.batang.gagal {
		background: var(--merah-bata);
	}
	.catatan {
		font-size: 13px;
		color: var(--coklat-teks);
		margin-top: 4px;
	}
</style>
