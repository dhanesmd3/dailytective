<!--
	Papan tuduhan (GDD bagian 7). Pilih satu kartu per baris, lalu TUDUH.
	Kartu yang dicoret di Buku Catatan tampil redup tapi tetap bisa dipilih.
-->
<script lang="ts">
	import type { Tanda } from '$lib/client/lokal';
	import type { KasusPublik } from '$lib/engine/permainan';
	import type { Kategori, Kombinasi, Tuduhan } from '$lib/engine/types';
	import { KATEGORI_LABEL, umpanBalik } from '$lib/teks';
	import Ikon from './Ikon.svelte';
	import Potret from './Potret.svelte';

	let {
		kasus,
		tuduhan,
		coret,
		sibuk,
		ontuduh
	}: {
		kasus: KasusPublik;
		tuduhan: Tuduhan[];
		coret: Record<string, Tanda>;
		sibuk: boolean;
		ontuduh: (k: Kombinasi) => void;
	} = $props();

	let pilihan = $state<Partial<Kombinasi>>({});
	const dari = $derived(kasus.kategori.length);
	const lengkap = $derived(kasus.kategori.every((k) => !!pilihan[k]));
	const ganda = $derived(lengkap && tuduhan.some((t) => kasus.kategori.every((k) => t[k] === pilihan[k])));
	const sisa = $derived(kasus.maks_tuduhan - tuduhan.length);
	const terakhir = $derived(tuduhan.at(-1));

	const nama = (kat: Kategori, id: string | undefined) =>
		(id && kasus.pilihan[kat]?.find((p) => p.id === id)?.nama) ?? id ?? '…';
	const ringkas = $derived(kasus.kategori.map((k) => (pilihan[k] ? nama(k, pilihan[k]) : '…')).join(' · '));

	function kirim() {
		if (!lengkap || ganda || sibuk) return;
		ontuduh(pilihan as Kombinasi);
	}
</script>

<div class="papan">
	{#key tuduhan.length}
		{#if terakhir && terakhir.benar < dari}
			<div class="umpan" role="alert">
				<span class="stempel">{terakhir.benar} dari {dari}</span>
				<p>{umpanBalik(terakhir.benar, dari)} {sisa > 0 ? `Sisa ${sisa} kesempatan.` : ''}</p>
			</div>
		{/if}
	{/key}

	{#each kasus.kategori as k (k)}
		<fieldset>
			<legend class="label">{KATEGORI_LABEL[k]}</legend>
			<div class="baris">
				{#each kasus.pilihan[k] ?? [] as p (p.id)}
					{@const dipilih = pilihan[k] === p.id}
					<label class="kartu-pilihan" class:dipilih class:redup={coret[`${k}:${p.id}`] === 'x'}>
						<input type="radio" name={k} value={p.id} bind:group={pilihan[k]} class="sr-only" />
						<span class="gambar">
							{#if k === 'siapa'}
								<Potret id={p.id} ukuran={68} ekspresi={dipilih ? 'gugup' : 'normal'} />
							{:else if k === 'kenapa'}
								<span class="motif" aria-hidden="true">?</span>
							{:else}
								<Ikon id={p.id} ukuran={52} />
							{/if}
						</span>
						<span class="nama">{p.nama}</span>
					</label>
				{/each}
			</div>
		</fieldset>
	{/each}

	<div class="aksi">
		<p class="ringkas" aria-live="polite">{ringkas}</p>
		{#if ganda}<p class="peringatan">Kombinasi ini sudah pernah kamu tuduhkan.</p>{/if}
		<button class="tombol merah tuduh" disabled={!lengkap || ganda || sibuk || sisa <= 0} onclick={kirim}>
			Tuduh
		</button>
		<span class="redup">Sisa kesempatan: {sisa} dari {kasus.maks_tuduhan}</span>
	</div>

	{#if tuduhan.length}
		<div class="riwayat">
			<h3 class="label">Tuduhan sebelumnya</h3>
			<ol>
				{#each tuduhan as t, i (i)}
					<li>
						<span>{i + 1}.</span>
						<span class="kombinasi">{kasus.kategori.map((k) => nama(k, t[k])).join(' · ')}</span>
						<span class="skor" class:benar={t.benar === dari}>{t.benar} dari {dari} benar</span>
					</li>
				{/each}
			</ol>
		</div>
	{/if}
</div>

<style>
	.papan {
		display: grid;
		gap: 14px;
	}
	fieldset {
		border: none;
		margin: 0;
		padding: 0;
	}
	legend {
		color: var(--mustard);
		margin-bottom: 8px;
		font-size: 15px;
	}
	.baris {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
	.kartu-pilihan {
		width: 128px;
		background: var(--krem);
		color: var(--tinta);
		border: 3px solid var(--tinta);
		border-radius: 10px;
		box-shadow: 0 4px 0 var(--tinta);
		padding: 10px 8px 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		cursor: pointer;
		transition: transform 120ms, box-shadow 120ms;
		text-align: center;
	}
	.kartu-pilihan:has(:focus-visible) {
		outline: 3px solid var(--mustard);
		outline-offset: 3px;
	}
	.kartu-pilihan.dipilih {
		border-color: var(--merah-bata);
		box-shadow: 0 0 0 3px var(--merah-bata), 0 8px 0 var(--tinta);
		transform: translateY(-4px);
	}
	.kartu-pilihan.redup {
		opacity: 0.45;
	}
	.kartu-pilihan.redup.dipilih {
		opacity: 0.8;
	}
	.gambar {
		height: 68px;
		display: grid;
		place-items: center;
	}
	.motif {
		width: 52px;
		height: 52px;
		display: grid;
		place-items: center;
		border: 2.5px solid var(--tinta);
		border-radius: 50%;
		background: var(--mustard);
		font-family: var(--font-judul);
		font-size: 28px;
	}
	/* di layar sempit tiap baris kartu bisa digeser ke samping */
	@media (max-width: 640px) {
		.baris {
			flex-wrap: nowrap;
			overflow-x: auto;
			padding: 6px 2px 10px;
			scroll-snap-type: x mandatory;
		}
		.kartu-pilihan {
			flex: 0 0 112px;
			width: 112px;
			scroll-snap-align: start;
		}
	}
	.nama {
		font-weight: 700;
		font-size: 14px;
		line-height: 1.2;
	}
	.aksi {
		display: flex;
		align-items: center;
		gap: 14px;
		flex-wrap: wrap;
		border-top: 2px dashed var(--coklat-teks);
		padding-top: 14px;
	}
	.ringkas {
		font-weight: 700;
		flex: 1 1 220px;
	}
	.peringatan {
		color: #ffb4a6;
		font-weight: 600;
		flex-basis: 100%;
		order: 3;
	}
	.tuduh {
		font-size: 18px;
		padding: 12px 34px;
	}
	.umpan {
		display: flex;
		align-items: center;
		gap: 18px;
		background: var(--krem);
		color: var(--tinta);
		border: 3px solid var(--tinta);
		border-radius: 10px;
		padding: 12px 16px;
		animation: getar 400ms;
	}
	.umpan .stempel {
		color: var(--merah-bata);
		font-size: 18px;
		animation: hentak 400ms cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	.umpan p {
		font-weight: 600;
	}
	.riwayat ol {
		list-style: none;
		margin: 6px 0 0;
		padding: 0;
		display: grid;
		gap: 6px;
	}
	.riwayat li {
		display: flex;
		gap: 10px;
		align-items: center;
		background: rgba(244, 231, 201, 0.08);
		border: 2px solid var(--coklat-teks);
		border-radius: 8px;
		padding: 6px 10px;
		font-size: 14px;
	}
	.riwayat .label {
		color: var(--krem-redup);
	}
	.kombinasi {
		flex: 1;
		font-weight: 600;
	}
	.skor {
		background: var(--merah-bata);
		color: var(--krem);
		border-radius: 999px;
		padding: 2px 10px;
		font-weight: 700;
		font-size: 12px;
	}
	.skor.benar {
		background: var(--hijau-sukses);
	}
	@keyframes getar {
		20%, 60% { transform: translateX(-5px); }
		40%, 80% { transform: translateX(5px); }
	}
	@keyframes hentak {
		from {
			transform: rotate(-8deg) scale(1.8);
			opacity: 0;
		}
	}
</style>
