<!--
	Cuplikan bergerak untuk onboarding: seperti apa layar game di tiap langkah.
	Dibangun dari komponen asli (ilustrasi ruangan, kartu bukti, potret, ikon) dengan data contoh,
	jadi ikut berubah kalau tampilan game berubah, ikut bahasa pemain, dan tidak membocorkan kasus sungguhan.
-->
<script lang="ts">
	import { pakaiT } from '$lib/i18n';
	import { labelKategori, umpanBalik } from '$lib/teks';
	import Bintang from './Bintang.svelte';
	import Ikon from './Ikon.svelte';
	import KartuBukti from './KartuBukti.svelte';
	import Potret from './Potret.svelte';
	import Adegan from './ruang/Adegan.svelte';

	let { langkah }: { langkah: number } = $props();
	const t = pakaiT();
	const JATAH = 6;
</script>

<div class="layar" aria-hidden="true">
	<span class="contoh">{t('ob.contoh')}</span>

	{#if langkah === 0}
		<div class="adegan-kasus">
			<span class="jam">06.00 WIB</span>
			<div class="cc">
				<p class="meta">{t('umum.kasus_no', { id: 1 })} · <Bintang jumlah={2} warna="var(--tinta)" /></p>
				<strong>{t('ob.demo.judul')}</strong>
				<div class="kutip"><Potret id="nenek" ukuran={40} /><p>"{t('ob.demo.cerita')}"</p></div>
				<div class="deret">
					{#each ['dimas', 'sekar', 'raka', 'wati'] as id, i (id)}
						<span class="muncul" style:animation-delay="{0.5 + i * 0.25}s"><Potret {id} ukuran={34} /></span>
					{/each}
				</div>
			</div>
		</div>
	{:else if langkah === 1}
		<!-- kotak 12:7 seukuran ilustrasi, jadi persen posisi hotspot (data/ruangan.json) tetap pas -->
		<div class="adegan-tkp">
			<Adegan id="ruang_tamu" state={{ waktu: 'siang', belang: 'sofa' }} />
			<span class="denyut"></span>
			<svg viewBox="0 0 32 32" width="40" height="40" class="kaca">
				<circle cx="13" cy="13" r="9" fill="rgba(244,231,201,.55)" stroke="#1F1812" stroke-width="3.5" />
				<path d="M20 20l9 9" stroke="#1F1812" stroke-width="5" stroke-linecap="round" />
			</svg>
		</div>
		<div class="jatah">
			{#each Array.from({ length: JATAH }, (_, i) => i) as i (i)}
				<span class="bulat" class:terpakai={i < 2} class:baru={i === 1}></span>
			{/each}
		</div>
		<div class="kartu-contoh">
				<KartuBukti bukti={{ benda: 'rt_rak', hasil: 'clue', nomor: 1, teks: t('ob.demo.bukti') }} nama={t('ob.demo.benda')} tutup={() => {}} />
		</div>
	{:else if langkah === 2}
		<div class="adegan-papan">
			<div class="slot-baris">
				<div class="slot"><span class="lbl">{labelKategori(t, 'siapa')}</span><Potret id="dimas" ukuran={52} /><b>Dimas</b></div>
				<div class="slot"><span class="lbl">{labelKategori(t, 'pakai')}</span><Ikon id="obeng" ukuran={48} /><b>{t('ob.demo.barang')}</b></div>
				<div class="slot"><span class="lbl">{labelKategori(t, 'dimana')}</span><Ikon id="dapur" ukuran={48} /><b>{t('ob.demo.lokasi')}</b></div>
			</div>
			<div class="vonis">
				<span class="tombol merah kecil tekan">{t('tuduh.tombol')}</span>
				<span class="stempel cap">{t('tuduh.x_dari_y', { benar: 2, dari: 3 })}</span>
				<span class="umpan">{umpanBalik(t, 2, 3)}</span>
			</div>
		</div>
	{:else}
		<div class="adegan-gagal">
			<span class="stempel merah">{t('hasil.belum_terpecahkan')}</span>
			<ol>
				{#each [1, 2, 1] as benar, i (i)}
					<li><span class="garis"></span><span class="chip">{t('tuduh.x_dari_y_benar', { benar, dari: 3 })}</span></li>
				{/each}
			</ol>
			<div class="aksi">
				<span class="tombol merah kecil denyar">{t('hasil.ulangi')}</span>
				<span class="tombol krem kecil">{t('hasil.buka_jawaban')}</span>
			</div>
		</div>
	{/if}
</div>

<style>
	.layar {
		position: relative;
		height: 210px;
		overflow: hidden;
		border: 2.5px solid var(--tinta);
		border-radius: 10px;
		margin-bottom: 14px;
		background-color: var(--kayu-gelap);
		background-image: repeating-linear-gradient(0deg, var(--kayu-garis) 0 2px, transparent 2px 11px);
		color: var(--krem);
		pointer-events: none;
		user-select: none;
	}
	.contoh {
		position: absolute;
		top: 8px;
		left: 8px;
		z-index: 5;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 1.5px;
		text-transform: uppercase;
		background: var(--tinta);
		color: var(--mustard);
		border-radius: 999px;
		padding: 2px 8px;
	}

	/* 1 · context card */
	.adegan-kasus {
		height: 100%;
		display: grid;
		place-items: center;
	}
	.jam {
		position: absolute;
		top: 8px;
		right: 10px;
		font-family: var(--font-judul);
		font-size: 13px;
		color: var(--mustard);
	}
	.cc {
		width: min(330px, 86%);
		background: var(--krem);
		color: var(--tinta);
		border: 2.5px solid var(--tinta);
		border-radius: 10px;
		box-shadow: 0 4px 0 var(--tinta);
		padding: 10px 14px 12px;
		display: grid;
		gap: 6px;
		animation: naik 700ms cubic-bezier(0.2, 0.9, 0.3, 1.2) both;
	}
	.meta {
		font-size: 11px;
		font-weight: 700;
		color: var(--coklat-teks);
		text-transform: uppercase;
	}
	.cc strong {
		font-family: var(--font-judul);
		font-weight: 400;
		font-size: 18px;
		line-height: 1.15;
	}
	.kutip {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12.5px;
		font-style: italic;
		font-weight: 500;
	}
	.deret {
		display: flex;
		gap: 6px;
	}
	.muncul {
		animation: naik 400ms cubic-bezier(0.2, 0.9, 0.3, 1.4) both;
	}

	/* 2 · TKP */
	.adegan-tkp {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		aspect-ratio: 12 / 7;
	}
	.adegan-tkp :global(svg.ruang) {
		width: 100%;
		height: 100%;
		display: block;
	}
	.jatah {
		position: absolute;
		top: 8px;
		right: 10px;
		display: flex;
		gap: 4px;
		background: rgba(31, 24, 18, 0.85);
		border-radius: 999px;
		padding: 5px 8px;
	}
	.bulat {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--mustard);
		border: 1.5px solid var(--krem);
	}
	.bulat.terpakai {
		background: transparent;
	}
	.bulat.baru {
		animation: pakai 5s infinite;
	}
	/* kaca pembesar bergerak ke rak buku (hotspot rt_rak, ±31% x 45%), lalu kartu bukti muncul */
	.kaca {
		position: absolute;
		/* pusat lensa ada di (16, 16) px dari pojok svg */
		left: calc(31% - 16px);
		top: calc(45% - 16px);
		animation: cari 5s ease-in-out infinite;
		filter: drop-shadow(0 2px 0 rgba(0, 0, 0, 0.35));
	}
	.denyut {
		position: absolute;
		left: 31%;
		top: 45%;
		width: 54px;
		height: 54px;
		margin: -27px 0 0 -27px;
		border: 3px solid var(--mustard);
		border-radius: 50%;
		opacity: 0;
		animation: denyut 5s infinite;
	}
	/* di kanan bawah, supaya rak buku yang diperiksa (kiri) tetap terlihat */
	.kartu-contoh {
		position: absolute;
		right: 8px;
		bottom: 8px;
		width: min(62%, 300px);
		font-size: 13px;
		animation: kartu 5s infinite;
	}
	.kartu-contoh :global(.kartu-bukti) {
		padding: 6px 10px 8px;
		animation: none;
	}
	.kartu-contoh :global(.kartu-bukti p) {
		font-size: 12.5px;
		line-height: 1.35;
	}
	.kartu-contoh :global(.label) {
		font-size: 11px;
		white-space: nowrap;
	}
	.kartu-contoh :global(.tutup) {
		display: none;
	}

	/* 3 · papan tuduhan */
	.adegan-papan {
		height: 100%;
		display: grid;
		align-content: center;
		justify-items: center;
		gap: 12px;
		padding: 18px 12px 10px;
	}
	.slot-baris {
		display: flex;
		gap: 10px;
	}
	.slot {
		width: 96px;
		display: grid;
		justify-items: center;
		gap: 3px;
		background: var(--krem);
		color: var(--tinta);
		border: 2.5px solid var(--tinta);
		border-radius: 10px;
		box-shadow: 0 3px 0 var(--tinta);
		padding: 6px 4px 7px;
		font-size: 12.5px;
		animation: naik 450ms cubic-bezier(0.2, 0.9, 0.3, 1.3) both;
	}
	.slot:nth-child(2) {
		animation-delay: 0.2s;
	}
	.slot:nth-child(3) {
		animation-delay: 0.4s;
	}
	.lbl {
		font-size: 10px;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.8px;
		color: var(--merah-bata);
	}
	.vonis {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
		justify-content: center;
		min-height: 40px;
	}
	.tekan {
		animation: tekan 4s infinite;
	}
	.cap {
		color: var(--mustard);
		font-size: 18px;
		animation: cap 4s infinite;
	}
	.umpan {
		font-size: 13px;
		font-weight: 600;
		animation: muncul-pudar 4s infinite;
	}

	/* 4 · gagal → ulangi */
	.adegan-gagal {
		height: 100%;
		display: grid;
		align-content: center;
		justify-items: center;
		gap: 10px;
		padding: 18px 16px 10px;
	}
	.stempel.merah {
		color: #ff8e7a;
		font-size: 20px;
		animation: cap-sekali 700ms cubic-bezier(0.3, 1.6, 0.5, 1) both;
	}
	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 5px;
		width: min(300px, 90%);
	}
	li {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.garis {
		flex: 1;
		height: 9px;
		border-radius: 5px;
		background: rgba(244, 231, 201, 0.25);
	}
	.chip {
		font-size: 11px;
		font-weight: 700;
		background: var(--krem);
		color: var(--tinta);
		border: 2px solid var(--tinta);
		border-radius: 999px;
		padding: 0 8px;
	}
	.aksi {
		display: flex;
		gap: 10px;
		align-items: center;
		flex-wrap: wrap;
		justify-content: center;
	}
	.denyar {
		animation: denyar 1.6s ease-in-out infinite;
	}

	@keyframes naik {
		from {
			transform: translateY(18px);
			opacity: 0;
		}
	}
	@keyframes cari {
		0%,
		100% {
			left: calc(72% - 16px);
			top: calc(60% - 16px);
		}
		35%,
		85% {
			left: calc(31% - 16px);
			top: calc(45% - 16px);
		}
	}
	@keyframes denyut {
		0%,
		34% {
			opacity: 0;
			transform: scale(0.4);
		}
		38% {
			opacity: 1;
		}
		50%,
		100% {
			opacity: 0;
			transform: scale(1.5);
		}
	}
	@keyframes kartu {
		0%,
		38% {
			transform: translateY(130%);
		}
		46%,
		88% {
			transform: none;
		}
		96%,
		100% {
			transform: translateY(130%);
		}
	}
	@keyframes pakai {
		0%,
		38% {
			background: var(--mustard);
		}
		40%,
		100% {
			background: transparent;
		}
	}
	@keyframes tekan {
		0%,
		22% {
			transform: none;
			box-shadow: 0 3px 0 var(--tinta);
		}
		26% {
			transform: translateY(2px);
			box-shadow: 0 1px 0 var(--tinta);
		}
		30%,
		100% {
			transform: none;
		}
	}
	@keyframes cap {
		0%,
		28% {
			opacity: 0;
			transform: rotate(-8deg) scale(2);
		}
		36%,
		90% {
			opacity: 1;
			transform: rotate(-4deg);
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes cap-sekali {
		from {
			opacity: 0;
			transform: rotate(-8deg) scale(2);
		}
		to {
			transform: rotate(-3deg);
		}
	}
	@keyframes muncul-pudar {
		0%,
		36% {
			opacity: 0;
		}
		44%,
		90% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes denyar {
		50% {
			transform: scale(1.06);
			box-shadow: 0 0 0 5px rgba(226, 167, 46, 0.45), 0 3px 0 var(--tinta);
		}
	}
	/* tanpa animasi: tampilkan keadaan akhirnya saja */
	@media (prefers-reduced-motion: reduce) {
		.layar *,
		.layar :global(*) {
			animation: none !important;
		}
		.bulat.baru {
			background: transparent;
		}
	}
</style>
