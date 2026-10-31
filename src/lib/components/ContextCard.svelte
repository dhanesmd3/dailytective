<!--
	Context card (GDD bagian 4). Kalau isinya muat di layar, tampil satu halaman. Kalau tidak (layar pendek,
	kasus besar dengan pengakuan atau motif), dibagi dua slide: "Kasus" (cerita & pilihan) dan "Petunjuk".
-->
<script lang="ts">
	import { tick } from 'svelte';
	import type { KasusPublik } from '$lib/engine/permainan';
	import { namaHari } from '$lib/engine/waktu';
	import { pakaiT } from '$lib/i18n';
	import { labelJenis } from '$lib/teks';
	import Bintang from './Bintang.svelte';
	import DaftarPengakuan from './DaftarPengakuan.svelte';
	import Ikon from './Ikon.svelte';
	import Modal from './Modal.svelte';
	import Potret from './Potret.svelte';

	let {
		kasus,
		mulai,
		tutup,
		sibuk = false
	}: { kasus: KasusPublik; mulai?: () => void; tutup?: () => void; sibuk?: boolean } = $props();

	const t = pakaiT();
	const jenis = $derived(labelJenis(t, kasus.jenis));

	/** null = sedang mengukur; false = satu halaman; true = dua slide */
	let modeSlide = $state<boolean | null>(null);
	let slide = $state(0);
	let wadahIsi = $state<HTMLDivElement>();

	async function ukur() {
		modeSlide = null;
		await tick();
		const area = wadahIsi?.closest('.isi');
		modeSlide = !!area && area.scrollHeight > area.clientHeight + 4;
		slide = 0;
	}

	$effect(() => {
		ukur();
		let tunda: ReturnType<typeof setTimeout>;
		const saatUbah = () => {
			clearTimeout(tunda);
			tunda = setTimeout(ukur, 150);
		};
		window.addEventListener('resize', saatUbah);
		return () => {
			window.removeEventListener('resize', saatUbah);
			clearTimeout(tunda);
		};
	});

	const tampilKasus = $derived(!modeSlide || slide === 0);
	const tampilPetunjuk = $derived(!modeSlide || slide === 1);
	const slideTerakhir = $derived(!modeSlide || slide === 1);

	async function keSlide(n: number) {
		slide = n;
		await tick();
		wadahIsi?.closest('.isi')?.scrollTo({ top: 0 });
	}
</script>

<Modal judul={kasus.judul} {tutup} labelTutup={t('umum.tutup')} lebar={760} varian="map">
	<div bind:this={wadahIsi} class="wadah-isi">
		<p class="meta">
			{t('umum.kasus_no', { id: kasus.id })} · {namaHari(kasus.tanggal, t.bahasa)} ·
			<Bintang jumlah={kasus.kesulitan.bintang} warna="var(--tinta)" /> · {jenis.label}
		</p>

		{#if modeSlide}
			<div class="langkah" role="tablist" aria-label={kasus.judul}>
				{#each [t('cc.halaman_kasus'), t('cc.halaman_petunjuk')] as label, i (i)}
					<button role="tab" aria-selected={slide === i} class:aktif={slide === i} onclick={() => keSlide(i)}>
						<span class="nomor">{i + 1}</span>{label}
					</button>
				{/each}
			</div>
		{/if}

		{#if tampilKasus}
			<div class="cerita">
				<Potret id="nenek" ukuran={58} />
				<p>{kasus.context_card.cerita}</p>
			</div>

			<div class="pilihan">
				<section>
					<h3 class="label">{t('kat.siapa')}</h3>
					<ul>
						{#each kasus.pilihan.siapa as p (p.id)}
							<li><Potret id={p.id} ukuran={34} /><span>{p.nama}</span></li>
						{/each}
					</ul>
				</section>
				<section>
					<h3 class="label">{t('kat.pakai')}</h3>
					<p class="arti">{jenis.pakai}</p>
					<ul>
						{#each kasus.pilihan.pakai as p (p.id)}
							<li><span class="ikon"><Ikon id={p.id} ukuran={28} /></span><span>{p.nama}</span></li>
						{/each}
					</ul>
				</section>
				<section>
					<h3 class="label">{t('kat.dimana')}</h3>
					<p class="arti">{jenis.dimana}</p>
					<ul>
						{#each kasus.pilihan.dimana as p (p.id)}
							<li><span class="ikon"><Ikon id={p.id} ukuran={28} /></span><span>{p.nama}</span></li>
						{/each}
					</ul>
				</section>
				{#if kasus.pilihan.kenapa}
					<section>
						<h3 class="label">{t('kat.kenapa')}</h3>
						<p class="arti">{t('kat.kenapa_arti')}</p>
						<ul>
							{#each kasus.pilihan.kenapa as p (p.id)}
								<li><span class="ikon tanya">?</span><span>{p.nama}</span></li>
							{/each}
						</ul>
					</section>
				{/if}
			</div>
		{/if}

		{#if tampilPetunjuk}
			{#if kasus.pengakuan.length}
				<div class="blok-pengakuan">
					<h3 class="label">{t('cc.pengakuan')}</h3>
					<DaftarPengakuan {kasus} />
				</div>
			{/if}

			<div class="clue">
				<h3 class="label">{t('cc.clue_awal')}</h3>
				<ol>
					{#each kasus.context_card.clue_awal as c, i (c.id)}
						<li><span class="penanda" aria-hidden="true">{i + 1}</span><span>{c.teks}</span></li>
					{/each}
				</ol>
			</div>

			<p class="aturan">{t('cc.aturan', { jatah: kasus.jatah_periksa, maks: kasus.maks_tuduhan })}</p>
		{/if}
	</div>

	{#snippet kaki()}
		<div class="aksi">
			{#if modeSlide}
				<span class="titik" aria-hidden="true">
					<span class:aktif={slide === 0}></span><span class:aktif={slide === 1}></span>
				</span>
				{#if slide === 1}
					<button class="tombol krem kecil" onclick={() => keSlide(0)}>{t('umum.kembali')}</button>
				{/if}
			{/if}
			{#if !slideTerakhir}
				<button class="tombol" onclick={() => keSlide(1)}>{t('cc.ke_petunjuk')} →</button>
			{:else if mulai}
				<button class="tombol merah" onclick={mulai} disabled={sibuk || modeSlide === null}>{t('cc.mulai')}</button>
			{:else if tutup}
				<button class="tombol krem" onclick={tutup}>{t('umum.tutup')}</button>
			{/if}
		</div>
	{/snippet}
</Modal>

<style>
	.meta {
		font-weight: 600;
		color: var(--coklat-teks);
		margin: -2px 0 14px;
		font-size: 14px;
	}
	.langkah {
		display: flex;
		gap: 8px;
		margin-bottom: 14px;
	}
	.langkah button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: transparent;
		border: 2px solid var(--tinta);
		border-radius: 999px;
		padding: 5px 14px 5px 6px;
		font-weight: 700;
		cursor: pointer;
		color: var(--tinta);
	}
	.langkah button.aktif {
		background: var(--tinta);
		color: var(--krem);
	}
	.langkah .nomor {
		display: grid;
		place-items: center;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: var(--mustard);
		color: var(--tinta);
		font-size: 12px;
	}
	.cerita {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		background: var(--krem);
		border: 2px solid var(--tinta);
		border-radius: 10px;
		padding: 12px 14px;
		font-size: 16px;
	}
	.pilihan {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
		gap: 12px;
		margin: 16px 0;
	}
	section {
		background: var(--krem);
		border: 2px solid var(--tinta);
		border-radius: 10px;
		padding: 10px 12px;
	}
	.label {
		color: var(--merah-bata);
		margin-bottom: 4px;
	}
	.arti {
		font-size: 12px;
		color: var(--coklat-teks);
		margin-bottom: 6px;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 6px;
	}
	ul li {
		display: flex;
		align-items: center;
		gap: 8px;
		font-weight: 600;
		font-size: 14px;
	}
	.ikon {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		background: #fff8e6;
		border: 2px solid var(--tinta);
		border-radius: 50%;
		flex-shrink: 0;
	}
	.tanya {
		font-family: var(--font-judul);
		background: var(--mustard);
	}
	.blok-pengakuan {
		margin-bottom: 16px;
	}
	.clue {
		background: var(--mustard);
		border: 2px solid var(--tinta);
		border-radius: 10px;
		padding: 10px 14px 12px;
	}
	.clue .label {
		color: var(--tinta);
	}
	.clue ol {
		list-style: none;
		margin: 6px 0 0;
		padding: 0;
		display: grid;
		gap: 8px;
		font-weight: 500;
	}
	.clue li {
		display: flex;
		gap: 10px;
		align-items: flex-start;
	}
	/* penanda clue: nomor dalam lingkaran tinta, seperti token papan permainan */
	.penanda {
		flex-shrink: 0;
		display: grid;
		place-items: center;
		width: 24px;
		height: 24px;
		margin-top: 1px;
		border-radius: 50%;
		background: var(--tinta);
		color: var(--mustard);
		font-family: var(--font-judul);
		font-size: 13px;
	}
	.aturan {
		margin-top: 12px;
		font-size: 14px;
		color: var(--coklat-teks);
	}
	.aksi {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 10px;
	}
	.titik {
		display: inline-flex;
		gap: 6px;
		margin-right: auto;
	}
	.titik span {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 2px solid var(--tinta);
	}
	.titik span.aktif {
		background: var(--tinta);
	}
</style>
