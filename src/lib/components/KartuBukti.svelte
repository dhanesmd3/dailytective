<script lang="ts">
	import type { BuktiDitemukan } from '$lib/engine/permainan';

	let { bukti, nama, tutup }: { bukti: BuktiDitemukan; nama: string; tutup: () => void } = $props();
</script>

<div class="kartu-bukti" class:kosong={bukti.hasil === 'kosong'} role="status">
	<div class="kepala">
		<span class="label">{bukti.hasil === 'clue' ? `Bukti #${bukti.nomor}` : 'Kosong'}</span>
		<span class="nama">{nama}</span>
		<button class="tutup" onclick={tutup} aria-label="Tutup kartu">
			<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"
				><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg
			>
		</button>
	</div>
	<p>{bukti.teks}</p>
</div>

<style>
	.kartu-bukti {
		background: var(--mustard);
		color: var(--tinta);
		border: 3px solid var(--tinta);
		border-radius: 10px;
		box-shadow: 0 4px 0 var(--tinta);
		padding: 10px 14px 12px;
		animation: masuk 300ms cubic-bezier(0.2, 0.9, 0.3, 1.2);
	}
	.kartu-bukti.kosong {
		background: #d8cfc0;
	}
	.kepala {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 4px;
	}
	.label {
		background: var(--tinta);
		color: var(--krem);
		border-radius: 6px;
		padding: 2px 8px;
	}
	.nama {
		font-weight: 700;
		flex: 1;
	}
	.tutup {
		background: none;
		border: 2px solid var(--tinta);
		border-radius: 6px;
		width: 30px;
		height: 30px;
		display: grid;
		place-items: center;
		cursor: pointer;
		color: var(--tinta);
	}
	p {
		font-size: 16px;
		font-weight: 500;
	}
	@keyframes masuk {
		from {
			transform: translateY(24px);
			opacity: 0;
		}
	}
</style>
