<script lang="ts">
	let { ukuran = 26 }: { ukuran?: number } = $props();
</script>

<span class="logo" style:font-size="{ukuran}px">
	<svg viewBox="0 0 64 64" width={ukuran * 1.1} height={ukuran * 1.1} aria-hidden="true">
		<circle cx="27" cy="27" r="15" fill="#F4E7C9" stroke="#E2A72E" stroke-width="6" />
		<path d="M38 38l14 14" stroke="#E2A72E" stroke-width="8" stroke-linecap="round" />
	</svg>
	<span>Daily<span class="aksen">tective</span></span>
</span>

<style>
	.logo {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-judul);
		color: var(--krem);
		letter-spacing: 0.5px;
		line-height: 1;
	}
	.aksen {
		color: var(--mustard);
	}
</style>
