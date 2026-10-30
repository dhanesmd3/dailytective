<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		judul,
		tutup,
		lebar = 560,
		varian = 'kartu',
		children
	}: { judul: string; tutup?: () => void; lebar?: number; varian?: 'kartu' | 'map'; children: Snippet } = $props();

	const uid = $props.id();
	let kotak: HTMLDivElement;

	$effect(() => {
		const sebelumnya = document.activeElement as HTMLElement | null;
		kotak.focus();
		return () => sebelumnya?.focus?.();
	});

	function tombol(e: KeyboardEvent) {
		if (e.key === 'Escape' && tutup) {
			e.stopPropagation();
			tutup();
		}
	}
</script>

<div class="latar" role="presentation" onclick={(e) => e.target === e.currentTarget && tutup?.()} onkeydown={tombol}>
	<div
		bind:this={kotak}
		class="kotak {varian}"
		style:max-width="{lebar}px"
		role="dialog"
		aria-modal="true"
		aria-labelledby="judul-{uid}"
		tabindex="-1"
	>
		<div class="kepala">
			<h2 id="judul-{uid}">{judul}</h2>
			{#if tutup}
				<button class="tutup" onclick={tutup} aria-label="Tutup">
					<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"
						><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg
					>
				</button>
			{/if}
		</div>
		{@render children()}
	</div>
</div>

<style>
	.latar {
		position: fixed;
		inset: 0;
		background: rgba(20, 12, 8, 0.72);
		display: grid;
		place-items: center;
		padding: 16px;
		z-index: 50;
		overflow-y: auto;
	}
	.kotak {
		width: 100%;
		background: var(--krem);
		color: var(--tinta);
		border: 3px solid var(--tinta);
		border-radius: 12px;
		box-shadow: 0 6px 0 var(--tinta);
		padding: 22px 24px 24px;
		animation: naik 300ms cubic-bezier(0.2, 0.9, 0.3, 1.2);
		max-height: calc(100vh - 32px);
		overflow-y: auto;
	}
	.kotak:focus {
		outline: none;
	}
	.kotak.map {
		background: #e9cf96;
		border-radius: 4px 12px 12px 12px;
		position: relative;
		margin-top: 22px;
		overflow: visible;
	}
	.kotak.map::before {
		content: '';
		position: absolute;
		top: -24px;
		left: -3px;
		width: 160px;
		height: 24px;
		background: #e9cf96;
		border: 3px solid var(--tinta);
		border-bottom: none;
		border-radius: 10px 10px 0 0;
	}
	.kepala {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 14px;
	}
	h2 {
		font-size: 24px;
	}
	.tutup {
		flex-shrink: 0;
		background: none;
		border: 2px solid var(--tinta);
		border-radius: 8px;
		width: 36px;
		height: 36px;
		display: grid;
		place-items: center;
		cursor: pointer;
		color: var(--tinta);
	}
	@keyframes naik {
		from {
			transform: translateY(40px);
			opacity: 0;
		}
	}
</style>
