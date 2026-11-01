<script lang="ts">
	import { pakaiT, type KunciTeks } from '$lib/i18n';
	import Modal from './Modal.svelte';
	import PratinjauMain from './PratinjauMain.svelte';

	let { selesai }: { selesai: () => void } = $props();
	const t = pakaiT();
	const JUMLAH = 4;
	let langkah = $state(0);
	const judul = $derived(t(`ob.${langkah + 1}.judul` as KunciTeks));
	const isi = $derived(t(`ob.${langkah + 1}.isi` as KunciTeks));
</script>

<Modal judul={t('ob.judul')} tutup={selesai} labelTutup={t('umum.tutup')} lebar={560}>
	{#key langkah}
		<PratinjauMain {langkah} />
	{/key}
	<div class="titik" aria-hidden="true">
		{#each Array.from({ length: JUMLAH }, (_, i) => i) as i (i)}
			<span class:aktif={i === langkah}></span>
		{/each}
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
	.titik {
		display: flex;
		justify-content: center;
		gap: 6px;
		margin: -4px 0 8px;
	}
	.titik span {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		border: 2px solid var(--tinta);
	}
	.titik span.aktif {
		background: var(--tinta);
		width: 20px;
		border-radius: 999px;
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
</style>
