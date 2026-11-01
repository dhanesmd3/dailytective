<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { api } from '$lib/client/api';
	import { baca, KUNCI, tulis } from '$lib/client/lokal';
	import Bintang from '$lib/components/Bintang.svelte';
	import HitungMundur from '$lib/components/HitungMundur.svelte';
	import KakiSitus from '$lib/components/KakiSitus.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Onboarding from '$lib/components/Onboarding.svelte';
	import Potret from '$lib/components/Potret.svelte';
	import PengaturanModal from '$lib/components/PengaturanModal.svelte';
	import StatistikModal from '$lib/components/StatistikModal.svelte';
	import { formatTanggal, namaHari } from '$lib/engine/waktu';
	import { gantiBahasa, pakaiT, type KunciTeks } from '$lib/i18n';
	import { labelJenis } from '$lib/teks';

	let { data } = $props();

	const t = pakaiT();
	let modal = $state<null | 'onboarding' | 'statistik' | 'pengaturan'>(null);
	let daftarPratinjau = $state<Awaited<ReturnType<typeof api.pratinjau>>['kasus']>([]);

	const q = $derived(page.url.search);
	const sesi = $derived(data.sesi);
	const st = $derived(data.statistik);

	onMount(async () => {
		if (!baca(KUNCI.onboarding, false)) modal = 'onboarding';
		if (data.pratinjau) daftarPratinjau = (await api.pratinjau()).kasus;
	});

	function selesaiOnboarding() {
		tulis(KUNCI.onboarding, true);
		modal = null;
	}

	const TOKOH = ['benny', 'lia', 'hendra', 'dimas', 'sekar', 'sri', 'tono', 'joko', 'wati', 'raka'];
</script>

<svelte:head>
	<title>{t('beranda.judul_tab')}</title>
</svelte:head>

<main>
	<header>
		<div class="atas">
			<Logo ukuran={40} />
			<div class="bahasa" role="group" aria-label="{t('atur.bahasa')} · Language">
				{#each [['id', 'ID'], ['en', 'EN']] as const as [kode, label] (kode)}
					<button aria-pressed={t.bahasa === kode} lang={kode} onclick={() => gantiBahasa(kode)}>{label}</button>
				{/each}
			</div>
		</div>
		<p class="tagline">{t('umum.tagline')}</p>
	</header>

	<div class="papan">
		{#if data.kasus}
			{@const k = data.kasus}
			<article class="kasus kartu">
				<p class="meta">
					{t('umum.kasus_no', { id: k.id })} · {namaHari(k.tanggal, t.bahasa)}, {formatTanggal(k.tanggal, t.bahasa)} · <Bintang jumlah={k.kesulitan.bintang} warna="var(--tinta)" />
				</p>
				<h1>{k.judul}</h1>
				<p class="jenis">{labelJenis(t, k.jenis).label}</p>
				<div class="tersangka" aria-label={t('beranda.tersangka')}>
					{#each k.pilihan.siapa as s (s.id)}
						<Potret id={s.id} ukuran={54} label={s.nama} />
					{/each}
				</div>
				{#if !sesi}
					<p>{t('beranda.menunggu', { jatah: k.jatah_periksa, maks: k.maks_tuduhan })}</p>
					<a class="tombol merah besar" href="/kasus{q}">{t('beranda.buka')}</a>
				{:else if sesi.status === 'berjalan'}
					<p>{t('beranda.berjalan', { p: sesi.periksa.length, t: sesi.tuduhan.length })}</p>
					<a class="tombol merah besar" href="/kasus{q}">{t('beranda.lanjutkan')}</a>
				{:else}
					<p class="selesai" class:menang={sesi.status === 'menang'}>
						{#if sesi.akhir?.jawaban || sesi.status === 'menang'}
							<span class="stempel">{sesi.status === 'menang' ? t('hasil.terpecahkan') : t('hasil.ditutup')}</span>
							{sesi.akhir ? t(`gelar.${sesi.akhir.kode_gelar}` as KunciTeks) : ''}
						{:else}
							<span class="stempel">{t('hasil.belum_terpecahkan')}</span>
						{/if}
					</p>
					{#if sesi.akhir?.bisa_ulang}
						<a class="tombol merah besar" href="/kasus{q}">{t('hasil.ulangi')}</a>
					{:else}
						<a class="tombol besar" href="/kasus{q}">{t('beranda.lihat_hasil')}</a>
					{/if}
				{/if}
			</article>
		{:else}
			<article class="kasus kartu">
				<h1>{t('beranda.belum_ada')}</h1>
				<p>{t('beranda.tenang')}</p>
			</article>
		{/if}

		<aside class="samping">
			<div class="kotak">
				<span class="label redup">{t('beranda.berikutnya')}</span>
				<p class="besar"><HitungMundur berikutnya={data.berikutnya} serverTime={data.server_time} /></p>
				<p class="redup kecil">{t('beranda.jadwal')}</p>
			</div>
			<div class="kotak">
				<span class="label redup">{t('beranda.streak')}</span>
				<p class="besar">{st.streak} <span class="kecil redup">{t('beranda.streak_ket', { n: st.streak_terpanjang })}</span></p>
				<p class="redup kecil">{t('beranda.ringkas', { d: st.dimainkan, p: st.persen_menang })}</p>
			</div>
			<div class="tombol-baris">
				<button class="tombol-teks" onclick={() => (modal = 'statistik')}>{t('main.statistik')}</button>
				<button class="tombol-teks" onclick={() => (modal = 'onboarding')}>{t('main.cara_main')}</button>
				<button class="tombol-teks" onclick={() => (modal = 'pengaturan')}>{t('main.pengaturan')}</button>
			</div>
		</aside>
	</div>

	<section class="pemeran" aria-label={t('beranda.pemeran')}>
		<span class="label redup">{t('beranda.pemeran')}</span>
		<div class="deret">
			{#each TOKOH as tokoh (tokoh)}
				<Potret id={tokoh} ukuran={44} />
			{/each}
		</div>
	</section>

	{#if data.pratinjau}
		<section class="pratinjau">
			<h2>{t('beranda.pratinjau')}</h2>
			<p class="redup kecil">{t('beranda.pratinjau_ket', { tanggal: data.hari_ini })}</p>
			<ul>
				{#each daftarPratinjau as p (p.id)}
					<li class:aktif={p.tanggal === data.hari_ini}>
						<span class="tgl">{p.tanggal} · {namaHari(p.tanggal, t.bahasa)}</span>
						<span class="jdl">#{p.id} {p.judul}</span>
						<Bintang jumlah={p.bintang} />
						<span class="st">{p.status ?? t('beranda.belum_main')}</span>
						<a href="/?tanggal={p.tanggal}">{t('beranda.beranda')}</a>
						<a href="/kasus?tanggal={p.tanggal}">{t('beranda.main')}</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</main>

<KakiSitus />

{#if modal === 'onboarding'}
	<Onboarding selesai={selesaiOnboarding} />
{:else if modal === 'statistik'}
	<StatistikModal statistik={st} tutup={() => (modal = null)} />
{:else if modal === 'pengaturan'}
	<PengaturanModal tutup={() => (modal = null)} />
{/if}

<style>
	main {
		max-width: 1040px;
		margin: 0 auto;
		padding: 40px 20px 60px;
		display: grid;
		gap: 28px;
	}
	header {
		display: grid;
		gap: 8px;
	}
	.atas {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}
	.bahasa {
		display: inline-flex;
		border: 2px solid var(--krem-redup);
		border-radius: 999px;
		overflow: hidden;
	}
	.bahasa button {
		background: transparent;
		border: none;
		color: var(--krem);
		font-weight: 700;
		font-size: 13px;
		padding: 6px 12px;
		min-height: 34px;
		cursor: pointer;
	}
	.bahasa button[aria-pressed='true'] {
		background: var(--krem);
		color: var(--tinta);
	}
	.tagline {
		color: var(--krem-redup);
		font-size: 17px;
	}
	.papan {
		display: grid;
		grid-template-columns: minmax(0, 1.6fr) minmax(240px, 1fr);
		gap: 22px;
		padding: 18px;
		border: 3px solid var(--tinta);
		border-radius: 14px;
		/* bingkai kotak-kotak ala tepi papan permainan */
		background:
			linear-gradient(var(--kayu-gelap), var(--kayu-gelap)) padding-box,
			repeating-conic-gradient(var(--mustard) 0 25%, var(--krem) 0 50%) 0 0 / 24px 24px border-box;
		border: 12px solid transparent;
		box-shadow: 0 0 0 3px var(--tinta), 0 10px 0 3px var(--tinta);
	}
	@media (max-width: 760px) {
		.papan {
			grid-template-columns: 1fr;
		}
	}
	.kasus {
		padding: 22px 24px;
		display: grid;
		gap: 12px;
		align-content: start;
	}
	.meta {
		font-weight: 600;
		color: var(--coklat-teks);
		font-size: 14px;
	}
	h1 {
		font-size: 34px;
	}
	.jenis {
		font-family: var(--font-judul);
		color: var(--merah-bata);
		font-size: 14px;
		letter-spacing: 1px;
		text-transform: uppercase;
	}
	.tersangka {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}
	.tombol.besar {
		font-size: 18px;
		padding: 14px 30px;
		justify-self: start;
	}
	.selesai {
		display: flex;
		align-items: center;
		gap: 16px;
		margin: 4px 0 10px;
		font-family: var(--font-judul);
		font-size: 18px;
	}
	.selesai .stempel {
		color: var(--merah-bata);
		font-size: 18px;
	}
	.selesai.menang .stempel {
		color: var(--hijau-sukses);
	}
	.samping {
		display: grid;
		gap: 14px;
		align-content: start;
	}
	.kotak {
		border: 2px solid var(--coklat-teks);
		border-radius: 10px;
		padding: 12px 14px;
	}
	.besar {
		font-size: 28px;
		font-family: var(--font-judul);
	}
	.kecil {
		font-size: 13px;
		font-family: var(--font-isi);
	}
	.tombol-baris {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.pemeran {
		display: grid;
		gap: 10px;
	}
	.deret {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}
	.pratinjau {
		border: 2px dashed var(--biru-malam);
		border-radius: 12px;
		padding: 16px 18px;
	}
	.pratinjau h2 {
		font-size: 18px;
		margin-bottom: 4px;
	}
	.pratinjau ul {
		list-style: none;
		padding: 0;
		margin: 12px 0 0;
		display: grid;
		gap: 6px;
	}
	.pratinjau li {
		display: flex;
		gap: 12px;
		align-items: center;
		flex-wrap: wrap;
		font-size: 14px;
		padding: 6px 10px;
		border-radius: 8px;
		background: rgba(62, 92, 138, 0.15);
	}
	.pratinjau li.aktif {
		outline: 2px solid var(--mustard);
	}
	.tgl {
		font-variant-numeric: tabular-nums;
		color: var(--krem-redup);
		width: 150px;
	}
	.jdl {
		font-weight: 700;
		flex: 1;
	}
	.st {
		font-size: 12px;
		color: var(--krem-redup);
		width: 80px;
	}
</style>
