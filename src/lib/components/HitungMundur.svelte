<script lang="ts">
	// Hitung mundur memakai selisih jam server, bukan jam perangkat (dokumen 06 bagian 3).
	import { untrack } from 'svelte';
	import { pakaiT } from '$lib/i18n';

	const t = pakaiT();

	let { berikutnya, serverTime }: { berikutnya: string; serverTime: string } = $props();

	const selisih = untrack(() => Date.parse(serverTime)) - Date.now();
	let sekarang = $state(Date.now() + selisih);

	$effect(() => {
		const detak = setInterval(() => (sekarang = Date.now() + selisih), 1000);
		return () => clearInterval(detak);
	});

	const sisa = $derived(Math.max(0, Math.floor((Date.parse(berikutnya) - sekarang) / 1000)));
	const teks = $derived.by(() => {
		const hari = Math.floor(sisa / 86400);
		const jam = [Math.floor((sisa % 86400) / 3600), Math.floor((sisa % 3600) / 60), sisa % 60]
			.map((n) => String(n).padStart(2, '0'))
			.join(':');
		return hari ? `${hari === 1 ? t('umum.hari_satu') : t('umum.hari', { n: hari })} ${jam}` : jam;
	});
</script>

{#if sisa > 0}
	<span class="hitung" aria-live="off">{teks}</span>
{:else}
	<span class="hitung">{t('umum.kasus_baru_terbit')} <a href="/" data-sveltekit-reload>{t('umum.muat_ulang')}</a></span>
{/if}

<style>
	.hitung {
		font-family: var(--font-judul);
		font-variant-numeric: tabular-nums;
		letter-spacing: 1px;
	}
</style>
