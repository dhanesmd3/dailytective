<script lang="ts">
	import HalamanStatis from '$lib/components/HalamanStatis.svelte';

	let { data } = $props();
	const st = $derived(data.statistik);
	const baris = $derived([
		{ label: 'Tebakan 1', nilai: st.distribusi[1] },
		{ label: 'Tebakan 2', nilai: st.distribusi[2] },
		{ label: 'Tebakan 3', nilai: st.distribusi[3] },
		{ label: 'Gagal', nilai: st.distribusi.gagal }
	]);
	const maks = $derived(Math.max(1, ...baris.map((b) => b.nilai)));
</script>

<HalamanStatis judul="Statistik kamu">
	<dl>
		<div><dt>Dimainkan</dt><dd>{st.dimainkan}</dd></div>
		<div><dt>Terpecahkan</dt><dd>{st.persen_menang}%</dd></div>
		<div><dt>Streak</dt><dd>{st.streak}</dd></div>
		<div><dt>Terpanjang</dt><dd>{st.streak_terpanjang}</dd></div>
		<div><dt>Rata-rata periksa</dt><dd>{st.rata_periksa}</dd></div>
	</dl>
	<h2>Distribusi tebakan</h2>
	<ul class="batang">
		{#each baris as b (b.label)}
			<li>
				<span>{b.label}</span>
				<span class="isi" class:gagal={b.label === 'Gagal'} style:width="{Math.max(6, (b.nilai / maks) * 100)}%">{b.nilai}</span>
			</li>
		{/each}
	</ul>
</HalamanStatis>

<style>
	dl {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 10px;
		margin: 0;
	}
	dl div {
		background: #fff8e6;
		border: 2px solid var(--tinta);
		border-radius: 10px;
		padding: 10px;
		text-align: center;
	}
	dt {
		font-size: 12px;
		font-weight: 700;
		color: var(--coklat-teks);
	}
	dd {
		margin: 0;
		font-family: var(--font-judul);
		font-size: 28px;
	}
	.batang {
		list-style: none;
		padding: 0 !important;
	}
	.batang li {
		display: grid;
		grid-template-columns: 90px 1fr;
		align-items: center;
		gap: 10px;
	}
	.isi {
		background: var(--hijau-sukses);
		color: var(--krem);
		border: 2px solid var(--tinta);
		border-radius: 6px;
		padding: 2px 8px;
		text-align: right;
		font-weight: 700;
	}
	.isi.gagal {
		background: var(--merah-bata);
	}
</style>
