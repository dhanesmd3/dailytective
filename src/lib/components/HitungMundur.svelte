<script lang="ts">
	// Hitung mundur memakai selisih jam server, bukan jam perangkat (dokumen 06 bagian 3).
	import { untrack } from 'svelte';

	let { berikutnya, serverTime }: { berikutnya: string; serverTime: string } = $props();

	const selisih = untrack(() => Date.parse(serverTime)) - Date.now();
	let sekarang = $state(Date.now() + selisih);

	$effect(() => {
		const t = setInterval(() => (sekarang = Date.now() + selisih), 1000);
		return () => clearInterval(t);
	});

	const sisa = $derived(Math.max(0, Math.floor((Date.parse(berikutnya) - sekarang) / 1000)));
	const teks = $derived.by(() => {
		const hari = Math.floor(sisa / 86400);
		const jam = [Math.floor((sisa % 86400) / 3600), Math.floor((sisa % 3600) / 60), sisa % 60]
			.map((n) => String(n).padStart(2, '0'))
			.join(':');
		return hari ? `${hari} hari ${jam}` : jam;
	});
</script>

{#if sisa > 0}
	<span class="hitung" aria-live="off">{teks}</span>
{:else}
	<span class="hitung">Kasus baru sudah terbit. <a href="/" data-sveltekit-reload>Muat ulang</a></span>
{/if}

<style>
	.hitung {
		font-family: var(--font-judul);
		font-variant-numeric: tabular-nums;
		letter-spacing: 1px;
	}
</style>
