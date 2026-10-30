<!--
	TKP: ilustrasi ruangan + hotspot benda (dokumen 02 bagian 5, dokumen 06 bagian 8).
	Aturan anti-bocoran: kursor kaca pembesar sama di seluruh ruangan, tidak ada efek hover pada hotspot.
	Keberadaan benda tidak rahasia (bisa di-Tab dan ditampilkan sebagai daftar); yang rahasia adalah isinya.
-->
<script lang="ts">
	import type { BuktiDitemukan, KasusPublik } from '$lib/engine/permainan';
	import type { PosisiHotspot } from '$lib/engine/types';
	import RuangTamu from './RuangTamu.svelte';

	let {
		kasus,
		diperiksa,
		sisaJatah,
		bisaPeriksa,
		sibuk,
		onperiksa
	}: {
		kasus: KasusPublik;
		diperiksa: BuktiDitemukan[];
		sisaJatah: number;
		bisaPeriksa: boolean;
		sibuk: string | null;
		onperiksa: (benda: string) => void;
	} = $props();

	let ruangAktif = $state('ruang_tamu');
	let modeDaftar = $state(false);
	let denyut = $state<{ x: number; y: number; k: number } | null>(null);

	const ruang = $derived(kasus.ruangan.find((r) => r.id === ruangAktif)!);
	const benda = $derived(ruang.benda.filter((b) => b.posisi) as { id: string; nama: string; posisi: PosisiHotspot }[]);
	const hasil = $derived(new Map(diperiksa.map((d) => [d.benda, d])));

	function klik(e: MouseEvent, id: string) {
		const kotak = (e.currentTarget as HTMLElement).closest('.panggung')!.getBoundingClientRect();
		if (e.clientX || e.clientY) {
			denyut = { x: ((e.clientX - kotak.left) / kotak.width) * 100, y: ((e.clientY - kotak.top) / kotak.height) * 100, k: Date.now() };
		}
		onperiksa(id);
	}
</script>

<div class="tkp">
	<div class="atas">
		<div class="chip-ruang" role="tablist" aria-label="Ruangan">
			{#each kasus.ruangan as r (r.id)}
				<button
					class="chip"
					class:aktif={r.id === ruangAktif}
					role="tab"
					aria-selected={r.id === ruangAktif}
					disabled={!r.ilustrasi}
					title={r.ilustrasi ? undefined : 'Belum tersedia di prototipe'}
					onclick={() => (ruangAktif = r.id)}
				>
					{r.nama}{#if !r.ilustrasi}<span class="segera">segera</span>{/if}
				</button>
			{/each}
		</div>
		<div class="jatah" aria-live="polite">
			<span class="label">Jatah periksa</span>
			<span class="token" aria-hidden="true">
				{#each Array.from({ length: kasus.jatah_periksa }, (_, i) => i) as i (i)}
					<span class="bulat" class:terpakai={i < kasus.jatah_periksa - sisaJatah}></span>
				{/each}
			</span>
			<span><strong>{sisaJatah}</strong> tersisa</span>
		</div>
	</div>

	<div class="panggung">
		<RuangTamu state={kasus.state_ruangan[ruangAktif]} />
		{#each benda as b (b.id)}
			{@const h = hasil.get(b.id)}
			<button
				class="hotspot"
				style:left="{b.posisi.x}%"
				style:top="{b.posisi.y}%"
				style:width="{b.posisi.w}%"
				style:height="{b.posisi.h}%"
				aria-label={h ? `${b.nama}: sudah diperiksa, ${h.hasil === 'clue' ? `bukti #${h.nomor}` : 'kosong'}` : `Periksa ${b.nama}`}
				disabled={sibuk !== null}
				onclick={(e) => klik(e, b.id)}
			>
				{#if h?.hasil === 'clue'}
					<span class="tanda-bukti"></span>
					<span class="nomor">{h.nomor}</span>
				{:else if h}
					<span class="tanda-kosong"></span>
				{/if}
			</button>
		{/each}
		{#if denyut}
			{#key denyut.k}
				<span class="denyut" style:left="{denyut.x}%" style:top="{denyut.y}%"></span>
			{/key}
		{/if}
		{#if !bisaPeriksa}
			<span class="pita">Jatah periksa habis. Kamu masih bisa membaca ulang bukti.</span>
		{/if}
	</div>

	<div class="bawah">
		<button class="tombol-teks" onclick={() => (modeDaftar = !modeDaftar)} aria-expanded={modeDaftar}>
			{modeDaftar ? 'Sembunyikan daftar benda' : 'Tampilkan sebagai daftar'}
		</button>
		<span class="redup">Klik benda untuk memeriksa. Memeriksa ulang benda yang sama gratis.</span>
	</div>

	{#if modeDaftar}
		<ul class="daftar">
			{#each benda as b (b.id)}
				{@const h = hasil.get(b.id)}
				<li>
					<button class="tombol krem kecil" disabled={sibuk !== null} onclick={() => onperiksa(b.id)}>
						{b.nama}
						{#if h}<span class="status">{h.hasil === 'clue' ? `Bukti #${h.nomor}` : 'kosong'}</span>{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.tkp {
		display: grid;
		gap: 10px;
	}
	.atas {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
	}
	.chip-ruang {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.chip {
		border: 2px solid var(--mustard);
		background: transparent;
		color: var(--krem);
		border-radius: 999px;
		padding: 5px 12px;
		font-weight: 600;
		font-size: 13px;
		cursor: pointer;
		min-height: 34px;
	}
	.chip.aktif {
		background: var(--mustard);
		color: var(--tinta);
	}
	.chip:disabled {
		border-color: var(--coklat-teks);
		color: var(--krem-redup);
		cursor: not-allowed;
	}
	.segera {
		font-size: 11px;
		margin-left: 6px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
	.jatah {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
	}
	.jatah .label {
		color: var(--krem-redup);
		font-size: 12px;
	}
	.token {
		display: inline-flex;
		gap: 4px;
	}
	.bulat {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--mustard);
		border: 2px solid var(--tinta);
		box-shadow: 0 2px 0 var(--tinta);
	}
	.bulat.terpakai {
		background: transparent;
		border-color: var(--coklat-teks);
		box-shadow: none;
	}

	.panggung {
		position: relative;
		aspect-ratio: 12 / 7;
		border: 3px solid var(--tinta);
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 0 0 6px var(--mustard), 0 0 0 9px var(--tinta), 0 12px 0 6px var(--tinta);
		margin: 9px;
		/* kursor kaca pembesar yang sama di seluruh ruangan */
		cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='13' cy='13' r='9' fill='rgba(244,231,201,0.35)' stroke='%231F1812' stroke-width='4'/%3E%3Ccircle cx='13' cy='13' r='9' fill='none' stroke='%23F4E7C9' stroke-width='1.5'/%3E%3Cpath d='M20 20l9 9' stroke='%231F1812' stroke-width='5' stroke-linecap='round'/%3E%3C/svg%3E") 13 13, zoom-in;
	}
	.hotspot {
		position: absolute;
		background: transparent;
		border: none;
		padding: 0;
		margin: 0;
		cursor: inherit;
		border-radius: 8px;
	}
	.hotspot:disabled {
		cursor: progress;
	}
	.hotspot:focus-visible {
		outline: 3px dashed var(--mustard);
		outline-offset: 0;
	}
	.tanda-bukti {
		position: absolute;
		inset: 4%;
		border: 4px solid var(--mustard);
		border-radius: 50%;
		box-shadow: 0 0 0 2px var(--tinta), inset 0 0 0 2px var(--tinta);
		animation: sorot 300ms ease-out;
	}
	.nomor {
		position: absolute;
		top: -2px;
		right: -2px;
		min-width: 26px;
		height: 26px;
		padding: 0 5px;
		border-radius: 13px;
		background: var(--mustard);
		color: var(--tinta);
		border: 2px solid var(--tinta);
		font-family: var(--font-judul);
		font-size: 14px;
		line-height: 22px;
		box-shadow: 0 2px 0 var(--tinta);
	}
	.tanda-kosong {
		position: absolute;
		inset: 4%;
		border: 3px dashed var(--tinta);
		border-radius: 10px;
		background: rgba(31, 24, 18, 0.14);
	}
	.denyut {
		position: absolute;
		width: 44px;
		height: 44px;
		margin: -22px 0 0 -22px;
		border-radius: 50%;
		border: 3px solid var(--krem);
		pointer-events: none;
		animation: denyut 260ms ease-out forwards;
	}
	.pita {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(31, 24, 18, 0.85);
		color: var(--krem);
		text-align: center;
		padding: 6px;
		font-weight: 600;
		font-size: 13px;
		pointer-events: none;
	}
	.bawah {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
		font-size: 13px;
	}
	.daftar {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.daftar .tombol {
		text-transform: none;
		font-family: var(--font-isi);
		font-weight: 600;
		letter-spacing: 0;
	}
	.status {
		font-size: 11px;
		background: var(--tinta);
		color: var(--krem);
		border-radius: 999px;
		padding: 1px 7px;
	}
	@keyframes denyut {
		from {
			transform: scale(0.3);
			opacity: 1;
		}
		to {
			transform: scale(1.4);
			opacity: 0;
		}
	}
	@keyframes sorot {
		from {
			transform: scale(1.3);
			opacity: 0;
		}
	}
</style>
