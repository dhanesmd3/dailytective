<script lang="ts">
	import { pakaiT } from '$lib/i18n';

	let { jumlah, warna = 'var(--mustard)' }: { jumlah: number; warna?: string } = $props();
	const t = pakaiT();
</script>

<span class="bintang" aria-label={t('umum.bintang_aria', { n: jumlah })} role="img">
	{#each [1, 2, 3] as i (i)}
		<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
			<path
				d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"
				fill={i <= jumlah ? warna : 'none'}
				stroke={warna}
				stroke-width="2"
				stroke-linejoin="round"
			/>
		</svg>
	{/each}
</span>

<style>
	.bintang {
		display: inline-flex;
		gap: 1px;
		vertical-align: -2px;
	}
</style>
