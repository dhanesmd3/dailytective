<script lang="ts">
	import Permainan from '$lib/components/Permainan.svelte';
	import HitungMundur from '$lib/components/HitungMundur.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { pakaiT } from '$lib/i18n';

	let { data } = $props();
	const t = pakaiT();
</script>

<svelte:head>
	<title>{data.kasus ? `${t('umum.kasus_no', { id: data.kasus.id })} · ${data.kasus.judul}` : 'Dailytective'}</title>
</svelte:head>

{#if data.kasus}
	{#key `${data.hari_ini}:${data.kasus.id}:${data.bahasa}`}
		<Permainan {data} kasus={data.kasus} />
	{/key}
{:else}
	<main class="kosong">
		<Logo ukuran={30} />
		<h1>{t('beranda.belum_ada')}</h1>
		<p class="redup">{t('beranda.terbit_dalam')} <HitungMundur berikutnya={data.berikutnya} serverTime={data.server_time} /></p>
		<a class="tombol" href="/">{t('beranda.kembali')}</a>
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
