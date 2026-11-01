<!--
	Tag <head> untuk mesin pencari dan pratinjau link (WhatsApp, X, Discord).
	Satu URL melayani dua bahasa: tanpa parameter = Indonesia, ?lang=en = Inggris (dihubungkan lewat hreflang).
-->
<script lang="ts">
	import { page } from '$app/state';
	import { pakaiT } from '$lib/i18n';

	let {
		judul,
		deskripsi,
		indeks = true,
		jsonld
	}: { judul: string; deskripsi: string; indeks?: boolean; jsonld?: unknown } = $props();

	const t = pakaiT();
	const situs = $derived(page.data.situs as string);
	const urlId = $derived(situs + page.url.pathname);
	const urlEn = $derived(`${urlId}?lang=en`);
	const kanonik = $derived(t.bahasa === 'en' ? urlEn : urlId);
	// '<' di-escape supaya isi JSON tidak bisa menutup tag <script>
	const skrip = $derived(
		jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</` + 'script>' : ''
	);
</script>

<svelte:head>
	<title>{judul}</title>
	<meta name="description" content={deskripsi} />
	{#if indeks}
		<link rel="canonical" href={kanonik} />
		<link rel="alternate" hreflang="id" href={urlId} />
		<link rel="alternate" hreflang="en" href={urlEn} />
		<link rel="alternate" hreflang="x-default" href={urlId} />
	{:else}
		<meta name="robots" content="noindex, follow" />
	{/if}
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Dailytective" />
	<meta property="og:title" content={judul} />
	<meta property="og:description" content={deskripsi} />
	<meta property="og:url" content={kanonik} />
	<meta property="og:image" content="{situs}/og.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={t('seo.og_alt')} />
	<meta property="og:locale" content={t.bahasa === 'en' ? 'en_US' : 'id_ID'} />
	<meta property="og:locale:alternate" content={t.bahasa === 'en' ? 'id_ID' : 'en_US'} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={judul} />
	<meta name="twitter:description" content={deskripsi} />
	<meta name="twitter:image" content="{situs}/og.png" />
	{@html skrip}
</svelte:head>
