<script lang="ts">
	import type { KasusPublik } from '$lib/engine/permainan';
	import { namaHari } from '$lib/engine/waktu';
	import { JENIS } from '$lib/teks';
	import Bintang from './Bintang.svelte';
	import DaftarPengakuan from './DaftarPengakuan.svelte';
	import Ikon from './Ikon.svelte';
	import Modal from './Modal.svelte';
	import Potret from './Potret.svelte';

	let {
		kasus,
		mulai,
		tutup,
		sibuk = false
	}: { kasus: KasusPublik; mulai?: () => void; tutup?: () => void; sibuk?: boolean } = $props();

	const jenis = $derived(JENIS[kasus.jenis] ?? { label: kasus.jenis, pakai: '', dimana: '' });
</script>

<Modal judul={kasus.judul} {tutup} lebar={760} varian="map">
	<p class="meta">
		Kasus #{kasus.id} · {namaHari(kasus.tanggal)} · <Bintang jumlah={kasus.kesulitan.bintang} warna="var(--tinta)" /> ·
		{jenis.label}
	</p>

	<div class="cerita">
		<Potret id="nenek" ukuran={58} label="Nenek Sumarni" />
		<p>{kasus.context_card.cerita}</p>
	</div>

	<div class="pilihan">
		<section>
			<h3 class="label">Siapa</h3>
			<ul>
				{#each kasus.pilihan.siapa as p (p.id)}
					<li><Potret id={p.id} ukuran={34} /><span>{p.nama}</span></li>
				{/each}
			</ul>
		</section>
		<section>
			<h3 class="label">Pakai apa</h3>
			<p class="arti">{jenis.pakai}</p>
			<ul>
				{#each kasus.pilihan.pakai as p (p.id)}
					<li><span class="ikon"><Ikon id={p.id} ukuran={28} /></span><span>{p.nama}</span></li>
				{/each}
			</ul>
		</section>
		<section>
			<h3 class="label">Di mana</h3>
			<p class="arti">{jenis.dimana}</p>
			<ul>
				{#each kasus.pilihan.dimana as p (p.id)}
					<li><span class="ikon"><Ikon id={p.id} ukuran={28} /></span><span>{p.nama}</span></li>
				{/each}
			</ul>
		</section>
		{#if kasus.pilihan.kenapa}
			<section>
				<h3 class="label">Kenapa</h3>
				<p class="arti">motif pelaku</p>
				<ul>
					{#each kasus.pilihan.kenapa as p (p.id)}
						<li><span class="ikon tanya">?</span><span>{p.nama}</span></li>
					{/each}
				</ul>
			</section>
		{/if}
	</div>

	{#if kasus.pengakuan.length}
		<div class="blok-pengakuan">
			<h3 class="label">Pengakuan</h3>
			<DaftarPengakuan {kasus} />
		</div>
	{/if}

	<div class="clue">
		<h3 class="label">Clue awal</h3>
		<ol>
			{#each kasus.context_card.clue_awal as c (c.id)}
				<li>{c.teks}</li>
			{/each}
		</ol>
	</div>

	<p class="aturan">
		Jatah periksa: <strong>{kasus.jatah_periksa}</strong> benda · Kesempatan menuduh: <strong>{kasus.maks_tuduhan}</strong>
	</p>

	{#if mulai}
		<div class="aksi">
			<button class="tombol merah" onclick={mulai} disabled={sibuk}>Mulai menyelidiki</button>
		</div>
	{/if}
</Modal>

<style>
	.meta {
		font-weight: 600;
		color: var(--coklat-teks);
		margin: -6px 0 14px;
		font-size: 14px;
	}
	.cerita {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		background: var(--krem);
		border: 2px solid var(--tinta);
		border-radius: 10px;
		padding: 12px 14px;
		font-size: 16px;
	}
	.pilihan {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
		gap: 12px;
		margin: 16px 0;
	}
	.tanya {
		font-family: var(--font-judul);
		background: var(--mustard);
	}
	.blok-pengakuan {
		margin-bottom: 16px;
	}
	section {
		background: var(--krem);
		border: 2px solid var(--tinta);
		border-radius: 10px;
		padding: 10px 12px;
	}
	.label {
		color: var(--merah-bata);
		margin-bottom: 4px;
	}
	.arti {
		font-size: 12px;
		color: var(--coklat-teks);
		margin-bottom: 6px;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 6px;
	}
	li {
		display: flex;
		align-items: center;
		gap: 8px;
		font-weight: 600;
		font-size: 14px;
	}
	.ikon {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		background: #fff8e6;
		border: 2px solid var(--tinta);
		border-radius: 50%;
	}
	.clue {
		background: var(--mustard);
		border: 2px solid var(--tinta);
		border-radius: 10px;
		padding: 10px 14px;
	}
	.clue .label {
		color: var(--tinta);
	}
	.clue ol {
		margin: 4px 0 0;
		padding-left: 20px;
		display: grid;
		gap: 4px;
		font-weight: 500;
	}
	.aturan {
		margin-top: 12px;
		font-size: 14px;
		color: var(--coklat-teks);
	}
	.aksi {
		display: flex;
		justify-content: flex-end;
		margin-top: 14px;
	}
</style>
