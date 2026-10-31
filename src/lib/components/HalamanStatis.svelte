<script lang="ts">
	import type { Snippet } from 'svelte';
	import Logo from './Logo.svelte';

	let { judul, children }: { judul: string; children: Snippet } = $props();
</script>

<svelte:head><title>{judul} · Dailytective</title></svelte:head>

<main>
	<a href="/" class="kembali" aria-label="Kembali ke beranda"><Logo ukuran={24} /></a>
	<article class="kartu">
		<h1>{judul}</h1>
		{@render children()}
	</article>
	<nav aria-label="Halaman lain">
		<a href="/cara-main">Cara main</a>
		<a href="/statistik">Statistik</a>
		<a href="/tentang">Tentang</a>
		<a href="/privasi">Privasi</a>
	</nav>
</main>

<style>
	main {
		max-width: 760px;
		margin: 0 auto;
		padding: 28px 16px 60px;
		display: grid;
		gap: 20px;
	}
	.kembali {
		text-decoration: none;
	}
	article {
		padding: 24px 26px;
	}
	h1 {
		font-size: 30px;
		margin-bottom: 14px;
	}
	article :global(h2) {
		font-size: 19px;
		margin: 20px 0 8px;
		color: var(--merah-bata);
	}
	article :global(p),
	article :global(li) {
		font-size: 15.5px;
		line-height: 1.55;
	}
	article :global(p + p) {
		margin-top: 10px;
	}
	article :global(ul),
	article :global(ol) {
		padding-left: 22px;
		margin: 8px 0;
		display: grid;
		gap: 4px;
	}
	article :global(a) {
		color: var(--merah-bata);
	}
	nav {
		display: flex;
		gap: 16px;
		flex-wrap: wrap;
		font-weight: 600;
	}
</style>
