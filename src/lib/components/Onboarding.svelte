<script lang="ts">
	import { pakaiT, type KunciTeks } from '$lib/i18n';
	import Ikon from './Ikon.svelte';
	import Modal from './Modal.svelte';
	import Potret from './Potret.svelte';

	let { selesai }: { selesai: () => void } = $props();
	const t = pakaiT();
	const JUMLAH = 3;
	let langkah = $state(0);
	const judul = $derived(t(`ob.${langkah + 1}.judul` as KunciTeks));
	const isi = $derived(t(`ob.${langkah + 1}.isi` as KunciTeks));
</script>

<Modal judul={t('ob.judul')} tutup={selesai} labelTutup={t('umum.tutup')} lebar={520}>
	<div class="gambar" aria-hidden="true">
		{#if langkah === 0}
			<Potret id="nenek" ukuran={110} />
		{:else if langkah === 1}
			<div class="benda">
				<Ikon id="rak_buku" ukuran={70} />
				<svg viewBox="0 0 32 32" width="56" height="56" class="kaca"
					><circle cx="13" cy="13" r="9" fill="rgba(244,231,201,.6)" stroke="#1F1812" stroke-width="3.5" /><path
						d="M20 20l9 9"
						stroke="#1F1812"
						stroke-width="5"
						stroke-linecap="round"
					/></svg
				>
			</div>
		{:else}
			<div class="kartu-mini">
				<Potret id="dimas" ukuran={60} /><Ikon id="obeng" ukuran={52} /><Ikon id="dapur" ukuran={52} />
			</div>
		{/if}
	</div>
	<p class="nomor">{t('ob.langkah', { n: langkah + 1, m: JUMLAH })}</p>
	<h3>{judul}</h3>
	<p class="isi">{isi}</p>

	{#snippet kaki()}
		<div class="aksi">
			{#if langkah > 0}
				<button class="tombol krem kecil" onclick={() => langkah--}>{t('umum.kembali')}</button>
			{/if}
			{#if langkah < JUMLAH - 1}
				<button class="tombol" onclick={() => langkah++}>{t('umum.lanjut')}</button>
			{:else}
				<button class="tombol merah" onclick={selesai}>{t('ob.mulai')}</button>
			{/if}
		</div>
	{/snippet}
</Modal>

<style>
	.gambar {
		display: grid;
		place-items: center;
		height: 140px;
		background: #fff8e6;
		border: 2px solid var(--tinta);
		border-radius: 10px;
		margin-bottom: 14px;
	}
	.benda {
		position: relative;
	}
	.kaca {
		position: absolute;
		right: -40px;
		bottom: -14px;
		animation: goyang 1.4s ease-in-out infinite;
	}
	.kartu-mini {
		display: flex;
		gap: 12px;
		align-items: center;
	}
	.nomor {
		font-size: 12px;
		font-weight: 700;
		color: var(--coklat-teks);
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	h3 {
		font-size: 20px;
		margin: 4px 0 8px;
	}
	.isi {
		font-size: 15px;
	}
	.aksi {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
	}
	@keyframes goyang {
		50% {
			transform: translate(-10px, -6px);
		}
	}
</style>
