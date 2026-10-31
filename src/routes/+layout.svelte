<script lang="ts">
	import { onMount } from 'svelte';
	import { muatPengaturan } from '$lib/client/pengaturan.svelte';
	import { pasangBahasa } from '$lib/i18n';
	import '../app.css';

	let { data, children } = $props();

	pasangBahasa(() => data.bahasa);
	onMount(muatPengaturan);
</script>

{@render children()}
