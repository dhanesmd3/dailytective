<script lang="ts">
	import { ONBOARDING } from '$lib/teks';
	import Ikon from './Ikon.svelte';
	import Modal from './Modal.svelte';
	import Potret from './Potret.svelte';

	let { selesai }: { selesai: () => void } = $props();
	let langkah = $state(0);
	const isi = $derived(ONBOARDING[langkah]);
</script>

<Modal judul="Cara main" tutup={selesai} lebar={520}>
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
	<p class="nomor">Langkah {langkah + 1} dari {ONBOARDING.length}</p>
	<h3>{isi.judul}</h3>
	<p class="isi">{isi.isi}</p>
	<div class="aksi">
		{#if langkah > 0}
			<button class="tombol krem kecil" onclick={() => langkah--}>Kembali</button>
		{/if}
		{#if langkah < ONBOARDING.length - 1}
			<button class="tombol" onclick={() => langkah++}>Lanjut</button>
		{:else}
			<button class="tombol merah" onclick={selesai}>Langsung ke kasus hari ini</button>
		{/if}
	</div>
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
		margin-top: 18px;
	}
	@keyframes goyang {
		50% {
			transform: translate(-10px, -6px);
		}
	}
</style>
