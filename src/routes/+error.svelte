<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/components/Logo.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { pakaiT } from '$lib/i18n';

	const t = pakaiT();
</script>

<Seo judul="{page.status} · Dailytective" deskripsi={t('galat.umum')} indeks={false} />

<main>
	<Logo ukuran={30} />
	<p class="kode">{page.status}</p>
	<p>{page.status === 404 ? t('galat.tidak_ditemukan') : (page.error?.message ?? t('galat.umum'))}</p>
	<a class="tombol" href="/">{t('beranda.kembali')}</a>
</main>

<style>
	main {
		max-width: 520px;
		margin: 14vh auto;
		padding: 0 16px;
		display: grid;
		gap: 14px;
		justify-items: center;
		text-align: center;
	}
	.kode {
		font-family: var(--font-judul);
		font-size: 64px;
		color: var(--mustard);
		line-height: 1;
	}
</style>
