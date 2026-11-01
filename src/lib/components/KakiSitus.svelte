<!-- Footer halaman beranda & halaman statis: tepi papan kotak-kotak, merek, tautan, dan Si Belang. -->
<script lang="ts">
	import { pakaiT } from '$lib/i18n';
	import Logo from './Logo.svelte';
	import Belang from './ruang/Belang.svelte';

	const t = pakaiT();
	const tahun = new Date().getFullYear();
</script>

<footer class="kaki">
	<div class="pita" aria-hidden="true"></div>
	<div class="dalam">
		<div class="merek">
			<a href="/" class="logo" aria-label={t('umum.beranda_aria')}><Logo ukuran={26} /></a>
			<p>{t('umum.tagline')}</p>
			<p class="redup">{t('kaki.jadwal')}</p>
		</div>

		<nav aria-label={t('kaki.main')}>
			<h2>{t('kaki.main')}</h2>
			<a href="/">{t('kaki.kasus_hari_ini')}</a>
			<a href="/cara-main">{t('nav.cara_main')}</a>
			<a href="/statistik">{t('nav.statistik')}</a>
		</nav>

		<nav aria-label={t('kaki.info')}>
			<h2>{t('kaki.info')}</h2>
			<a href="/tentang">{t('nav.tentang')}</a>
			<a href="/privasi">{t('nav.privasi')}</a>
		</nav>

		<div class="sapa" aria-hidden="true">
			<span class="gelembung">{t('kaki.sapa')}</span>
			<svg viewBox="-48 -50 100 54" width="110" height="60"><Belang x={0} y={0} s={0.9} tidur /></svg>
		</div>
	</div>
	<p class="hak">{t('kaki.hak', { tahun })}</p>
</footer>

<style>
	/* kertas krem seperti kartu di dalam game, kontras dengan latar kayu gelap */
	.kaki {
		margin-top: 48px;
		background-color: var(--krem);
		background-image: repeating-linear-gradient(0deg, rgba(107, 86, 67, 0.07) 0 1px, transparent 1px 7px);
		color: var(--tinta);
		border-top: 3px solid var(--tinta);
	}
	/* tepi papan permainan, sama dengan bingkai kotak-kotak di beranda */
	.pita {
		height: 14px;
		background: repeating-conic-gradient(var(--mustard) 0 25%, var(--tinta) 0 50%) 0 0 / 14px 14px;
		border-bottom: 3px solid var(--tinta);
	}
	.dalam {
		max-width: 1040px;
		margin: 0 auto;
		padding: 28px 20px 18px;
		display: grid;
		grid-template-columns: minmax(0, 1.6fr) repeat(2, minmax(110px, 0.7fr)) auto;
		gap: 24px 32px;
		align-items: start;
	}
	@media (max-width: 760px) {
		.dalam {
			grid-template-columns: 1fr 1fr;
		}
		.merek,
		.sapa {
			grid-column: 1 / -1;
		}
		.sapa {
			justify-self: start;
		}
	}
	.merek {
		display: grid;
		gap: 8px;
		font-size: 14px;
	}
	.logo {
		text-decoration: none;
		justify-self: start;
	}
	/* versi logo untuk latar terang */
	.logo :global(.logo) {
		color: var(--tinta);
	}
	.logo :global(.aksen) {
		color: var(--merah-bata);
	}
	.redup {
		color: var(--coklat-teks);
	}
	nav {
		display: grid;
		gap: 8px;
		font-weight: 600;
		font-size: 14px;
	}
	h2 {
		font-size: 13px;
		letter-spacing: 1.5px;
		text-transform: uppercase;
		color: var(--merah-bata);
		margin-bottom: 2px;
	}
	nav a {
		color: var(--tinta);
		text-decoration: none;
		justify-self: start;
	}
	nav a:hover,
	nav a:focus-visible {
		text-decoration: underline;
		text-decoration-color: var(--merah-bata);
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
	}
	.sapa {
		display: grid;
		justify-items: end;
		gap: 4px;
	}
	.gelembung {
		position: relative;
		background: #fff8e6;
		color: var(--tinta);
		border: 2.5px solid var(--tinta);
		border-radius: 12px;
		padding: 6px 12px;
		font-weight: 700;
		font-size: 13px;
		white-space: nowrap;
		box-shadow: var(--bayangan-kecil);
	}
	/* ekor balon mengarah ke kepala Si Belang */
	.gelembung::after {
		content: '';
		position: absolute;
		right: 70px;
		bottom: -9px;
		width: 12px;
		height: 12px;
		background: #fff8e6;
		border-right: 2.5px solid var(--tinta);
		border-bottom: 2.5px solid var(--tinta);
		transform: rotate(45deg);
	}
	.hak {
		max-width: 1040px;
		margin: 0 auto;
		padding: 12px 20px 22px;
		border-top: 1.5px dashed rgba(107, 86, 67, 0.5);
		font-size: 12px;
		color: var(--coklat-teks);
	}
</style>
