<!-- Lapisan pencahayaan (lapisan 5): malam = gelap kebiruan + cahaya lampu hangat, sore = jingga, siang = netral. -->
<script lang="ts">
	import type { Waktu } from '$lib/engine/types';

	let { waktu, lampu = { x: 600, y: 60 }, id }: { waktu: Waktu; lampu?: { x: number; y: number }; id: string } = $props();
</script>

{#if waktu === 'malam'}
	<defs>
		<radialGradient id="cahaya-{id}" cx={lampu.x} cy={lampu.y} r="620" gradientUnits="userSpaceOnUse">
			<stop offset="0" stop-color="#FFD98A" stop-opacity="0.22" />
			<stop offset="1" stop-color="#FFD98A" stop-opacity="0" />
		</radialGradient>
	</defs>
	<rect width="1200" height="700" fill="#141A3A" opacity="0.2" pointer-events="none" />
	<rect width="1200" height="700" fill="url(#cahaya-{id})" pointer-events="none" />
{:else if waktu === 'sore'}
	<rect width="1200" height="700" fill="#E58A3A" opacity="0.12" pointer-events="none" />
{/if}
