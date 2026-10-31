<script lang="ts">
	import { onMount } from 'svelte';
	import { muatPengaturan } from '$lib/client/pengaturan.svelte';
	import '../app.css';

	let { children } = $props();

	onMount(muatPengaturan);
</script>

{@render children()}
