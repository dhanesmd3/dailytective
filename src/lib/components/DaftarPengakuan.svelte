<!-- Pengakuan tersangka di hari berbohong (GDD bagian 10). Tepat satu bohong, dan pembohongnya pelaku. -->
<script lang="ts">
	import type { KasusPublik } from '$lib/engine/permainan';
	import { pakaiT } from '$lib/i18n';
	import Potret from './Potret.svelte';

	let { kasus, kecil = false }: { kasus: KasusPublik; kecil?: boolean } = $props();
	const t = pakaiT();
	const nama = (id: string) => kasus.pilihan.siapa.find((s) => s.id === id)?.nama ?? id;
</script>

<div class="pengakuan" class:kecil>
	<p class="peringatan">{t('cc.pembohong')}</p>
	<ul>
		{#each kasus.pengakuan as p (p.oleh)}
			<li>
				<Potret id={p.oleh} ukuran={kecil ? 30 : 40} />
				<div>
					<strong>{nama(p.oleh)}</strong>
					<q>{p.teks}</q>
				</div>
			</li>
		{/each}
	</ul>
</div>

<style>
	.pengakuan {
		background: #fff8e6;
		border: 2px solid var(--tinta);
		border-radius: 10px;
		padding: 10px 12px;
	}
	.peringatan {
		font-weight: 700;
		color: var(--merah-bata);
		font-size: 14px;
		margin-bottom: 8px;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 8px;
	}
	li {
		display: flex;
		gap: 10px;
		align-items: flex-start;
	}
	strong {
		display: block;
		font-size: 13px;
	}
	q {
		font-style: italic;
		font-weight: 500;
	}
	.kecil q {
		font-size: 13px;
	}
</style>
