<script lang="ts">
	import Permainan from '$lib/components/Permainan.svelte';
	import HitungMundur from '$lib/components/HitungMundur.svelte';
	import Logo from '$lib/components/Logo.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.kasus ? `Kasus #${data.kasus.id} · ${data.kasus.judul}` : 'Dailytective'}</title>
</svelte:head>

{#if data.kasus}
	{#key `${data.hari_ini}:${data.kasus.id}`}
		<Permainan {data} kasus={data.kasus} />
	{/key}
{:else}
	<main class="kosong">
		<Logo ukuran={30} />
		<h1>Belum ada kasus hari ini</h1>
		<p class="redup">Kasus berikutnya terbit dalam <HitungMundur berikutnya={data.berikutnya} serverTime={data.server_time} /></p>
		<a class="tombol" href="/">Kembali ke beranda</a>
	</main>
{/if}

<style>
	.kosong {
		max-width: 520px;
		margin: 12vh auto;
		padding: 0 16px;
		display: grid;
		gap: 16px;
		justify-items: center;
		text-align: center;
	}
</style>
