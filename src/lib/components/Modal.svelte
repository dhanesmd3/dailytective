<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		judul,
		tutup,
		labelTutup = 'Tutup',
		lebar = 560,
		varian = 'kartu',
		children,
		kaki
	}: {
		judul: string;
		tutup?: () => void;
		labelTutup?: string;
		lebar?: number;
		varian?: 'kartu' | 'map';
		children: Snippet;
		/** Bagian bawah yang selalu terlihat (tombol aksi), di luar area yang bisa di-scroll. */
		kaki?: Snippet;
	} = $props();

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
	<!-- Tab map ada di wadah luar supaya kotak di dalamnya tetap bisa di-scroll -->
	<div class="wadah {varian}" style:max-width="{lebar}px">
		<div
			bind:this={kotak}
			class="kotak"
			role="dialog"
			aria-modal="true"
			aria-labelledby="judul-{uid}"
			tabindex="-1"
		>
			<div class="kepala">
				<h2 id="judul-{uid}">{judul}</h2>
				{#if tutup}
					<button class="tutup" onclick={tutup} aria-label={labelTutup}>
						<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"
							><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg
						>
					</button>
				{/if}
			</div>
			<div class="isi">
				{@render children()}
			</div>
			{#if kaki}
				<div class="kaki">{@render kaki()}</div>
			{/if}
		</div>
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
	}
	.wadah {
		width: 100%;
		position: relative;
		animation: naik 300ms cubic-bezier(0.2, 0.9, 0.3, 1.2);
	}
	.wadah.map {
		margin-top: 22px;
	}
	.wadah.map::before {
		content: '';
		position: absolute;
		top: -21px;
		left: 0;
		width: 160px;
		height: 24px;
		background: #e9cf96;
		border: 3px solid var(--tinta);
		border-bottom: none;
		border-radius: 10px 10px 0 0;
	}
	.kotak {
		display: flex;
		flex-direction: column;
		max-height: calc(100vh - 32px);
		max-height: calc(100dvh - 32px);
		background: var(--krem);
		color: var(--tinta);
		border: 3px solid var(--tinta);
		border-radius: 12px;
		box-shadow: 0 6px 0 var(--tinta);
		position: relative;
	}
	.wadah.map .kotak {
		background: #e9cf96;
		border-radius: 4px 12px 12px 12px;
		max-height: calc(100vh - 54px);
		max-height: calc(100dvh - 54px);
	}
	.kotak:focus {
		outline: none;
	}
	.kepala {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
		padding: 22px 24px 12px;
	}
	.isi {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		padding: 2px 24px 22px;
	}
	.kaki {
		border-top: 2px dashed rgba(31, 24, 18, 0.35);
		padding: 12px 24px 16px;
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
	@media (max-width: 640px) {
		.kepala {
			padding: 16px 16px 10px;
		}
		.isi {
			padding: 2px 16px 16px;
		}
		.kaki {
			padding: 10px 16px 12px;
		}
		h2 {
			font-size: 21px;
		}
	}
	@keyframes naik {
		from {
			transform: translateY(40px);
			opacity: 0;
		}
	}
</style>
