<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { api } from '$lib/client/api';
	import { baca, KUNCI, tulis } from '$lib/client/lokal';
	import Bintang from '$lib/components/Bintang.svelte';
	import HitungMundur from '$lib/components/HitungMundur.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Onboarding from '$lib/components/Onboarding.svelte';
	import Potret from '$lib/components/Potret.svelte';
	import StatistikModal from '$lib/components/StatistikModal.svelte';
	import { formatTanggal, namaHari } from '$lib/engine/waktu';
	import { JENIS } from '$lib/teks';

	let { data } = $props();

	let modal = $state<null | 'onboarding' | 'statistik'>(null);
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
	<title>Dailytective · Satu kasus detektif setiap hari</title>
</svelte:head>

<main>
	<header>
		<Logo ukuran={40} />
		<p class="tagline">Satu kasus detektif setiap hari dari rumah Nenek.</p>
	</header>

	<div class="papan">
		{#if data.kasus}
			{@const k = data.kasus}
			<article class="kasus kartu">
				<p class="meta">
					Kasus #{k.id} · {namaHari(k.tanggal)}, {formatTanggal(k.tanggal)} · <Bintang jumlah={k.kesulitan.bintang} warna="var(--tinta)" />
				</p>
				<h1>{k.judul}</h1>
				<p class="jenis">{JENIS[k.jenis]?.label ?? k.jenis}</p>
				<div class="tersangka" aria-label="Tersangka">
					{#each k.pilihan.siapa as s (s.id)}
						<Potret id={s.id} ukuran={54} label={s.nama} />
					{/each}
				</div>
				{#if !sesi}
					<p>Nenek menunggumu. Kamu punya {k.jatah_periksa} jatah periksa dan {k.maks_tuduhan} kesempatan menuduh.</p>
					<a class="tombol merah besar" href="/kasus{q}">Buka kasus</a>
				{:else if sesi.status === 'berjalan'}
					<p>Penyelidikan berjalan: {sesi.periksa.length} benda diperiksa, {sesi.tuduhan.length} tuduhan.</p>
					<a class="tombol merah besar" href="/kasus{q}">Lanjutkan</a>
				{:else}
					<p class="selesai" class:menang={sesi.status === 'menang'}>
						<span class="stempel">{sesi.status === 'menang' ? 'Terpecahkan' : 'Kasus ditutup'}</span>
						{sesi.akhir?.gelar}
					</p>
					<a class="tombol besar" href="/kasus{q}">Lihat hasil</a>
				{/if}
			</article>
		{:else}
			<article class="kasus kartu">
				<h1>Belum ada kasus hari ini</h1>
				<p>Rumah Nenek sedang tenang. Kembali lagi saat kasus berikutnya terbit.</p>
			</article>
		{/if}

		<aside class="samping">
			<div class="kotak">
				<span class="label redup">Kasus berikutnya</span>
				<p class="besar"><HitungMundur berikutnya={data.berikutnya} serverTime={data.server_time} /></p>
				<p class="redup kecil">Terbit setiap hari pukul 06.00 WIB</p>
			</div>
			<div class="kotak">
				<span class="label redup">Streak</span>
				<p class="besar">{st.streak} <span class="kecil redup">hari · terpanjang {st.streak_terpanjang}</span></p>
				<p class="redup kecil">{st.dimainkan} dimainkan · {st.persen_menang}% terpecahkan</p>
			</div>
			<div class="tombol-baris">
				<button class="tombol-teks" onclick={() => (modal = 'statistik')}>Statistik</button>
				<button class="tombol-teks" onclick={() => (modal = 'onboarding')}>Cara main</button>
			</div>
		</aside>
	</div>

	<section class="pemeran" aria-label="Para pemeran">
		<span class="label redup">Penghuni dan tamu rumah Nenek</span>
		<div class="deret">
			{#each TOKOH as t (t)}
				<Potret id={t} ukuran={44} />
			{/each}
		</div>
	</section>

	{#if data.pratinjau}
		<section class="pratinjau">
			<h2>Mode pratinjau</h2>
			<p class="redup kecil">
				Hanya muncul saat <code>npm run dev</code> atau <code>DT_PRATINJAU=1</code>. Hari ini menurut server: {data.hari_ini}.
			</p>
			<ul>
				{#each daftarPratinjau as p (p.id)}
					<li class:aktif={p.tanggal === data.hari_ini}>
						<span class="tgl">{p.tanggal} · {namaHari(p.tanggal)}</span>
						<span class="jdl">#{p.id} {p.judul}</span>
						<Bintang jumlah={p.bintang} />
						<span class="st">{p.status ?? 'belum main'}</span>
						<a href="/?tanggal={p.tanggal}">beranda</a>
						<a href="/kasus?tanggal={p.tanggal}">main</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</main>

{#if modal === 'onboarding'}
	<Onboarding selesai={selesaiOnboarding} />
{:else if modal === 'statistik'}
	<StatistikModal statistik={st} tutup={() => (modal = null)} />
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
	code {
		background: rgba(244, 231, 201, 0.1);
		padding: 1px 5px;
		border-radius: 4px;
	}
</style>
