<!--
	Satu sesi kasus: context card → TKP ⇄ papan tuduhan → hasil (GDD bagian 2).
	Semua aturan (jatah, tuduhan, solusi) diputuskan server; komponen ini hanya menampilkan.
-->
<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { page } from '$app/state';
	import { api, pesanGalat, GalatApi } from '$lib/client/api';
	import { baca, KUNCI, tulis, type Tanda } from '$lib/client/lokal';
	import type { BuktiDitemukan, HasilAkhir, KasusPublik, StatistikPribadi } from '$lib/engine/permainan';
	import type { Kombinasi, StatusSesi, Tuduhan } from '$lib/engine/types';
	import { namaHari } from '$lib/engine/waktu';
	import type { DataHariIni } from '$lib/server/layanan';
	import { JENIS } from '$lib/teks';
	import Bintang from './Bintang.svelte';
	import BukuCatatan from './BukuCatatan.svelte';
	import ContextCard from './ContextCard.svelte';
	import Hasil from './Hasil.svelte';
	import KartuBukti from './KartuBukti.svelte';
	import Logo from './Logo.svelte';
	import Onboarding from './Onboarding.svelte';
	import PapanTuduhan from './PapanTuduhan.svelte';
	import Ruangan from './Ruangan.svelte';
	import StatistikModal from './StatistikModal.svelte';

	let { data, kasus: kasusProp }: { data: DataHariIni; kasus: KasusPublik } = $props();

	// Komponen ini di-{#key} per tanggal, jadi cukup memakai nilai awal dari server;
	// setelah itu state diperbarui dari respons API.
	const kasus = untrack(() => kasusProp);
	const awal = untrack(() => data.sesi);
	let diperiksa = $state<BuktiDitemukan[]>(awal?.periksa ?? []);
	let sisaJatah = $state(awal?.sisa_jatah ?? kasus.jatah_periksa);
	let tuduhan = $state<Tuduhan[]>(awal?.tuduhan ?? []);
	let status = $state<StatusSesi | null>(awal?.status ?? null);
	let akhir = $state<HasilAkhir | null>(awal?.akhir ?? null);
	let statistik = $state<StatistikPribadi>(untrack(() => data.statistik));

	let tampilan = $state<'tkp' | 'tuduhan' | 'hasil'>(awal?.akhir ? 'hasil' : 'tkp');
	let modal = $state<null | 'context' | 'statistik' | 'onboarding'>(null);
	let buktiAktif = $state<BuktiDitemukan | null>(null);
	let sibukBenda = $state<string | null>(null);
	let sibukTuduh = $state(false);
	let sibukMulai = $state(false);
	let pesan = $state('');
	let coret = $state<Record<string, Tanda>>({});

	const q = page.url.search;
	const namaBendaPeta = new Map(kasus.ruangan.flatMap((r) => r.benda.map((b) => [b.id, b.nama] as const)));
	const namaBenda = (id: string) => namaBendaPeta.get(id) ?? id;
	const jenis = JENIS[kasus.jenis]?.label ?? kasus.jenis;

	let siap = $state(false);
	onMount(() => {
		coret = baca(KUNCI.coret(kasus.tanggal), {});
		if (!baca(KUNCI.onboarding, false)) modal = 'onboarding';
		else if (status === null) modal = 'context';
		siap = true;
	});
	$effect(() => {
		if (siap) tulis(KUNCI.coret(kasus.tanggal), coret);
	});
	$effect(() => {
		if (siap) tulis(KUNCI.sesi(kasus.tanggal), { id: kasus.id, periksa: diperiksa, tuduhan, status });
	});
	$effect(() => {
		if (siap) tulis(KUNCI.statistik, statistik);
	});

	let timerPesan: ReturnType<typeof setTimeout>;
	function tampilkanPesan(p: string) {
		pesan = p;
		clearTimeout(timerPesan);
		timerPesan = setTimeout(() => (pesan = ''), 3500);
	}

	function selesaiOnboarding() {
		tulis(KUNCI.onboarding, true);
		modal = status === null ? 'context' : null;
	}

	async function mulai() {
		sibukMulai = true;
		try {
			await api.mulai(kasus.id);
			status = 'berjalan';
			modal = null;
		} catch (e) {
			tampilkanPesan(pesanGalat(e));
		} finally {
			sibukMulai = false;
		}
	}

	async function periksa(benda: string) {
		const lama = diperiksa.find((d) => d.benda === benda);
		if (lama) {
			buktiAktif = lama;
			return;
		}
		if (status !== null && status !== 'berjalan') return;
		if (sisaJatah <= 0) {
			tampilkanPesan('Jatah periksa sudah habis. Saatnya menuduh!');
			return;
		}
		sibukBenda = benda;
		try {
			const r = await api.periksa(kasus.id, benda);
			const bukti: BuktiDitemukan = { benda: r.benda, hasil: r.hasil, nomor: r.nomor, teks: r.teks };
			diperiksa = [...diperiksa, bukti];
			sisaJatah = r.sisa_jatah;
			buktiAktif = bukti;
			status ??= 'berjalan';
		} catch (e) {
			if (e instanceof GalatApi && e.kode === 'jatah_habis') sisaJatah = 0;
			tampilkanPesan(pesanGalat(e));
		} finally {
			sibukBenda = null;
		}
	}

	async function tuduh(k: Kombinasi) {
		sibukTuduh = true;
		try {
			const r = await api.tuduh(kasus.id, k);
			tuduhan = r.tuduhan;
			status ??= 'berjalan';
			if (r.selesai && r.akhir) {
				akhir = r.akhir;
				status = r.akhir.menang ? 'menang' : 'kalah';
				if (r.statistik) statistik = r.statistik;
				tampilan = 'hasil';
				window.scrollTo({ top: 0 });
			}
		} catch (e) {
			tampilkanPesan(pesanGalat(e));
		} finally {
			sibukTuduh = false;
		}
	}

	async function resetSesi() {
		if (!confirm('Hapus progres kasus ini dan mulai ulang? (hanya mode pratinjau)')) return;
		await api.resetSesi(kasus.id);
		location.reload();
	}
</script>

<div class="halaman">
	<header>
		<a href="/{q}" class="beranda" aria-label="Beranda Dailytective"><Logo ukuran={22} /></a>
		<div class="meta">
			<span class="nomor">Kasus #{kasus.id}</span>
			<span>{namaHari(kasus.tanggal)}</span>
			<Bintang jumlah={kasus.kesulitan.bintang} />
			<span class="redup">{jenis}</span>
			<strong class="judul">{kasus.judul}</strong>
		</div>
		<nav>
			{#if data.pratinjau}
				<span class="pratinjau" title="Mode pratinjau lokal">Pratinjau {kasus.tanggal}</span>
				<button class="tombol-teks" onclick={resetSesi}>Ulangi</button>
			{/if}
			<button class="tombol-teks" onclick={() => (modal = 'context')}>Context card</button>
			<button class="tombol-teks" onclick={() => (modal = 'onboarding')}>Cara main</button>
			<button class="tombol-teks" onclick={() => (modal = 'statistik')}>Statistik</button>
		</nav>
	</header>

	{#if tampilan === 'hasil' && akhir}
		<main class="satu-kolom">
			<Hasil
				{kasus}
				{akhir}
				{diperiksa}
				{tuduhan}
				{statistik}
				berikutnya={data.berikutnya}
				serverTime={data.server_time}
				{namaBenda}
				bukaStatistik={() => (modal = 'statistik')}
			/>
		</main>
	{:else}
		<main class="dua-kolom">
			<section class="panggung-utama">
				<div class="tab-tahap" role="tablist" aria-label="Tahap">
					<button role="tab" aria-selected={tampilan === 'tkp'} class:aktif={tampilan === 'tkp'} onclick={() => (tampilan = 'tkp')}>
						TKP <span class="angka">{kasus.jatah_periksa - sisaJatah}/{kasus.jatah_periksa} periksa</span>
					</button>
					<button
						role="tab"
						aria-selected={tampilan === 'tuduhan'}
						class:aktif={tampilan === 'tuduhan'}
						onclick={() => {
							tampilan = 'tuduhan';
							buktiAktif = null;
						}}
					>
						Papan tuduhan <span class="angka">{tuduhan.length}/{kasus.maks_tuduhan} tuduhan</span>
					</button>
				</div>

				{#if tampilan === 'tkp'}
					<Ruangan {kasus} {diperiksa} {sisaJatah} bisaPeriksa={sisaJatah > 0} sibuk={sibukBenda} onperiksa={periksa} />
					{#if buktiAktif}
						<div class="kartu-aktif">
							<KartuBukti bukti={buktiAktif} nama={namaBenda(buktiAktif.benda)} tutup={() => (buktiAktif = null)} />
						</div>
					{/if}
					{#if sisaJatah === 0}
						<div class="ajak">
							<p>Jatah periksa habis. Bukti sudah cukup?</p>
							<button class="tombol merah" onclick={() => (tampilan = 'tuduhan')}>Ke papan tuduhan</button>
						</div>
					{/if}
				{:else}
					<PapanTuduhan {kasus} {tuduhan} {coret} sibuk={sibukTuduh} ontuduh={tuduh} />
				{/if}
			</section>

			<BukuCatatan {kasus} {diperiksa} bind:coret {namaBenda} bukaContext={() => (modal = 'context')} />
		</main>
	{/if}
</div>

{#if modal === 'onboarding'}
	<Onboarding selesai={selesaiOnboarding} />
{:else if modal === 'context'}
	<ContextCard
		{kasus}
		mulai={status === null ? mulai : undefined}
		tutup={status === null ? undefined : () => (modal = null)}
		sibuk={sibukMulai}
	/>
{:else if modal === 'statistik'}
	<StatistikModal {statistik} tutup={() => (modal = null)} />
{/if}

{#if pesan}
	<div class="toast" role="status">{pesan}</div>
{/if}

<style>
	.halaman {
		max-width: 1680px;
		margin: 0 auto;
		padding: 12px 20px 40px;
	}
	header {
		display: flex;
		align-items: center;
		gap: 18px;
		flex-wrap: wrap;
		padding-bottom: 12px;
		border-bottom: 2px solid var(--kayu-garis);
		margin-bottom: 14px;
	}
	.beranda {
		text-decoration: none;
	}
	.meta {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
		flex: 1;
		font-size: 14px;
		font-weight: 600;
	}
	.nomor {
		font-family: var(--font-judul);
		color: var(--mustard);
		letter-spacing: 0.5px;
	}
	.judul {
		font-family: var(--font-judul);
		font-weight: 400;
		font-size: 17px;
	}
	nav {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		align-items: center;
	}
	.pratinjau {
		font-size: 12px;
		font-weight: 700;
		background: var(--biru-malam);
		border: 2px solid var(--krem-redup);
		border-radius: 6px;
		padding: 3px 8px;
	}
	.dua-kolom {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 340px;
		gap: 22px;
		align-items: start;
	}
	@media (max-width: 1279px) {
		.dua-kolom {
			grid-template-columns: minmax(0, 1fr) 300px;
		}
	}
	@media (max-width: 1023px) {
		.dua-kolom {
			grid-template-columns: 1fr;
		}
		.dua-kolom :global(.buku) {
			position: static;
			max-height: none;
		}
	}
	.panggung-utama {
		display: grid;
		gap: 12px;
		min-width: 0;
		position: relative;
	}
	.tab-tahap {
		display: flex;
		gap: 8px;
	}
	.tab-tahap button {
		font-family: var(--font-judul);
		font-size: 15px;
		letter-spacing: 0.5px;
		text-transform: uppercase;
		background: transparent;
		color: var(--krem);
		border: 2.5px solid var(--krem-redup);
		border-radius: 9px;
		padding: 8px 16px;
		cursor: pointer;
		min-height: 44px;
	}
	.tab-tahap button.aktif {
		background: var(--krem);
		color: var(--tinta);
		border-color: var(--tinta);
		box-shadow: 0 3px 0 var(--tinta);
	}
	.angka {
		font-family: var(--font-isi);
		font-weight: 600;
		font-size: 12px;
		text-transform: none;
		letter-spacing: 0;
		margin-left: 6px;
		opacity: 0.8;
	}
	.kartu-aktif {
		position: sticky;
		bottom: 12px;
		z-index: 5;
	}
	.ajak {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		background: rgba(178, 58, 42, 0.18);
		border: 2px solid var(--merah-bata);
		border-radius: 10px;
		padding: 10px 14px;
		font-weight: 600;
	}
	.satu-kolom {
		max-width: 1200px;
		margin: 0 auto;
	}
	.toast {
		position: fixed;
		left: 50%;
		bottom: 22px;
		transform: translateX(-50%);
		background: var(--tinta);
		color: var(--krem);
		border: 2px solid var(--mustard);
		border-radius: 10px;
		padding: 10px 18px;
		font-weight: 600;
		z-index: 60;
		box-shadow: 0 4px 0 #000;
	}
</style>
