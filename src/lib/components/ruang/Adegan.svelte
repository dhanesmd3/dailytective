<!-- Memilih ilustrasi sesuai id ruangan. -->
<script lang="ts">
	import type { StateRuangan } from '$lib/engine/types';
	import RuangTamu from '../RuangTamu.svelte';
	import Dapur from './Dapur.svelte';
	import KamarNenek from './KamarNenek.svelte';
	import RuangKerja from './RuangKerja.svelte';
	import Teras from './Teras.svelte';

	let { id, state }: { id: string; state?: StateRuangan } = $props();
</script>

{#if id === 'ruang_tamu'}
	<RuangTamu {state} />
{:else if id === 'dapur'}
	<Dapur {state} />
{:else if id === 'kamar_nenek'}
	<KamarNenek {state} />
{:else if id === 'ruang_kerja'}
	<RuangKerja {state} />
{:else if id === 'teras'}
	<Teras {state} />
{/if}
