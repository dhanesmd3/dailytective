<script lang="ts">
	import { teksShare, type BuktiDitemukan, type HasilAkhir, type KasusPublik, type StatistikPribadi } from '$lib/engine/permainan';
	import type { Kategori, Tuduhan } from '$lib/engine/types';
	import { formatDurasi } from '$lib/engine/waktu';
	import { KATEGORI_LABEL } from '$lib/teks';
	import HitungMundur from './HitungMundur.svelte';
	import Ikon from './Ikon.svelte';
	import Potret from './Potret.svelte';

	let {
		kasus,
		akhir,
		diperiksa,
		tuduhan,
		statistik,
		berikutnya,
		serverTime,
		namaBenda,
		bukaStatistik
	}: {
		kasus: KasusPublik;
		akhir: HasilAkhir;
		diperiksa: BuktiDitemukan[];
		tuduhan: Tuduhan[];
		statistik: StatistikPribadi;
		berikutnya: string;
		serverTime: string;
		namaBenda: (id: string) => string;
		bukaStatistik: () => void;
	} = $props();

	const nama = (kat: Kategori, id: string) => kasus.pilihan[kat].find((p) => p.id === id)?.nama ?? id;
	const ditemukan = $derived(new Map(diperiksa.filter((d) => d.hasil === 'clue').map((d) => [d.benda, d.nomor])));

	function labelBukti(idClue: string): { teks: string; ketemu: boolean } {
		const awal = kasus.context_card.clue_awal.findIndex((c) => c.id === idClue);
		if (awal >= 0) return { teks: `Clue awal ${awal + 1}`, ketemu: true };
		const b = akhir.semua_bukti[idClue]?.benda;
		if (b && ditemukan.has(b)) return { teks: `Bukti #${ditemukan.get(b)}`, ketemu: true };
		return { teks: `Tak ditemukan · ${b ? namaBenda(b) : idClue}`, ketemu: false };
	}

	const terlewat = $derived(
		Object.entries(akhir.semua_bukti).filter(([, v]) => v.benda && !ditemukan.has(v.benda))
	);

	let pesanSalin = $state('');
	const teks = $derived(
		teksShare({
			id: kasus.id,
			bintang: kasus.kesulitan.bintang,
			jatah: kasus.jatah_periksa,
			periksa: diperiksa.map((d) => d.hasil === 'clue'),
			tuduhanBenar: tuduhan.map((t) => t.benar === 3),
			maksTuduhan: kasus.maks_tuduhan,
			menang: akhir.menang,
			durasiDetik: akhir.durasi_detik,
			streak: statistik.streak,
			situs: typeof location === 'undefined' ? 'dailytective.com' : location.host
		})
	);

	async function bagikan() {
		try {
			await navigator.clipboard.writeText(teks);
			pesanSalin = 'Disalin! Tempel di grup, tapi jangan spoiler ya.';
		} catch {
			pesanSalin = 'Tidak bisa menyalin otomatis. Salin teks di atas secara manual.';
		}
	}
</script>

<div class="hasil">
	<div class="kiri">
		<div class="status" class:menang={akhir.menang}>
			<span class="stempel">{akhir.menang ? 'Terpecahkan' : 'Kasus ditutup'}</span>
			<p class="gelar">{akhir.gelar}</p>
		</div>

		<div class="jawaban kartu">
			<h2>Jawabannya</h2>
			<div class="tiga">
				<div class="bagian">
					<Potret id={akhir.solusi.siapa} ukuran={96} ekspresi="tertangkap" />
					<span class="label">{KATEGORI_LABEL.siapa}</span>
					<strong>{nama('siapa', akhir.solusi.siapa)}</strong>
				</div>
				<div class="bagian">
					<span class="lingkar"><Ikon id={akhir.solusi.pakai} ukuran={64} /></span>
					<span class="label">{KATEGORI_LABEL.pakai}</span>
					<strong>{nama('pakai', akhir.solusi.pakai)}</strong>
				</div>
				<div class="bagian">
					<span class="lingkar"><Ikon id={akhir.solusi.dimana} ukuran={64} /></span>
					<span class="label">{KATEGORI_LABEL.dimana}</span>
					<strong>{nama('dimana', akhir.solusi.dimana)}</strong>
				</div>
			</div>
			<blockquote>
				<Potret id="nenek" ukuran={52} label="Nenek Sumarni" />
				<p>"{akhir.komentar_nenek}"</p>
			</blockquote>
		</div>

		<div class="penjelasan kartu">
			<h2>Alur logikanya</h2>
			<ol>
				{#each akhir.penjelasan as l, i (i)}
					<li>
						<p>{l.teks}</p>
						<span class="bukti">
							{#each l.bukti as b (b)}
								{@const lb = labelBukti(b)}
								<span class="chip" class:terlewat={!lb.ketemu}>{lb.teks}</span>
							{/each}
						</span>
					</li>
				{/each}
			</ol>
			{#if terlewat.length}
				<details>
					<summary>Bukti yang tidak kamu periksa ({terlewat.length})</summary>
					<ul>
						{#each terlewat as [id, v] (id)}
							<li><strong>{namaBenda(v.benda!)}:</strong> {v.teks}</li>
						{/each}
					</ul>
				</details>
			{/if}
		</div>
	</div>

	<div class="kanan">
		<div class="statistik kartu">
			<h2>Kasus #{kasus.id}</h2>
			<dl>
				<div><dt>Periksa</dt><dd>{diperiksa.length}<small>/{kasus.jatah_periksa}</small></dd></div>
				<div><dt>Tebakan</dt><dd>{akhir.menang ? `ke-${tuduhan.length}` : 'gagal'}</dd></div>
				<div><dt>Waktu</dt><dd>{formatDurasi(akhir.durasi_detik)}</dd></div>
			</dl>
			<div class="streak">
				<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
					<path
						d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2.5 1.2-4 2.5-5 .2 1.8 1 2.8 2 3.2C11 8.6 11 5 12 2z"
						fill={statistik.streak ? '#E2A72E' : 'none'}
						stroke="#1F1812"
						stroke-width="2"
						stroke-linejoin="round"
					/>
				</svg>
				<div>
					<strong>{statistik.streak}</strong> hari berturut-turut
					<span class="redup-krem">Terpanjang: {statistik.streak_terpanjang}</span>
				</div>
			</div>
			<button class="tombol krem kecil" onclick={bukaStatistik}>Statistik lengkap</button>
		</div>

		<div class="share kartu">
			<h2>Bagikan</h2>
			<pre aria-label="Teks yang akan dibagikan">{teks}</pre>
			<button class="tombol" onclick={bagikan}>Salin hasil</button>
			<p class="pesan" aria-live="polite">{pesanSalin || 'Jangan spoiler ya! Teks ini tidak membocorkan jawaban.'}</p>
		</div>

		<div class="berikut">
			<span class="label">Kasus berikutnya</span>
			<HitungMundur {berikutnya} {serverTime} />
		</div>
	</div>
</div>

<style>
	.hasil {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) minmax(280px, 1fr);
		gap: 20px;
		align-items: start;
	}
	@media (max-width: 900px) {
		.hasil {
			grid-template-columns: 1fr;
		}
	}
	.kiri,
	.kanan {
		display: grid;
		gap: 16px;
	}
	.kartu {
		padding: 16px 18px;
	}
	.kartu h2 {
		font-size: 19px;
		margin-bottom: 10px;
	}
	.status {
		display: flex;
		align-items: center;
		gap: 22px;
		padding: 8px 4px;
		color: #ff8e7a;
	}
	.status.menang {
		color: #7fd19b;
	}
	.status .stempel {
		font-size: 30px;
		animation: hentak 600ms cubic-bezier(0.3, 1.6, 0.5, 1);
		background: rgba(244, 231, 201, 0.06);
	}
	.gelar {
		font-family: var(--font-judul);
		font-size: 22px;
		color: var(--krem);
	}
	.tiga {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
		text-align: center;
	}
	.bagian {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.bagian .label {
		color: var(--coklat-teks);
		font-size: 12px;
		margin-top: 4px;
	}
	.lingkar {
		width: 96px;
		height: 96px;
		display: grid;
		place-items: center;
		background: #fff8e6;
		border: 3px solid var(--tinta);
		border-radius: 50%;
	}
	blockquote {
		display: flex;
		gap: 12px;
		align-items: center;
		margin: 16px 0 0;
		background: #fff8e6;
		border: 2px solid var(--tinta);
		border-radius: 10px;
		padding: 10px 12px;
		font-style: italic;
		font-weight: 500;
	}
	.penjelasan ol {
		margin: 0;
		padding-left: 22px;
		display: grid;
		gap: 10px;
	}
	.penjelasan li p {
		font-weight: 500;
	}
	.bukti {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		margin-top: 4px;
	}
	.chip {
		font-size: 12px;
		font-weight: 700;
		background: var(--mustard);
		border: 2px solid var(--tinta);
		border-radius: 999px;
		padding: 1px 9px;
	}
	.chip.terlewat {
		background: transparent;
		border-style: dashed;
		color: var(--coklat-teks);
	}
	details {
		margin-top: 14px;
		font-size: 14px;
	}
	summary {
		cursor: pointer;
		font-weight: 700;
	}
	details ul {
		margin: 8px 0 0;
		padding-left: 18px;
		display: grid;
		gap: 4px;
	}
	dl {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
		margin: 0 0 12px;
	}
	dl div {
		background: #fff8e6;
		border: 2px solid var(--tinta);
		border-radius: 8px;
		text-align: center;
		padding: 6px;
	}
	dt {
		font-size: 12px;
		color: var(--coklat-teks);
		font-weight: 600;
	}
	dd {
		margin: 0;
		font-family: var(--font-judul);
		font-size: 22px;
	}
	dd small {
		font-size: 13px;
		color: var(--coklat-teks);
	}
	.streak {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 12px;
	}
	.streak strong {
		font-family: var(--font-judul);
		font-size: 22px;
	}
	.redup-krem {
		display: block;
		font-size: 12px;
		color: var(--coklat-teks);
	}
	pre {
		background: #fff8e6;
		border: 2px dashed var(--tinta);
		border-radius: 8px;
		padding: 10px 12px;
		font-family: var(--font-isi);
		font-size: 14px;
		white-space: pre-wrap;
		margin: 0 0 12px;
	}
	.pesan {
		font-size: 13px;
		color: var(--coklat-teks);
		margin-top: 8px;
	}
	.berikut {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		font-size: 22px;
		color: var(--krem);
		padding: 0 4px;
	}
	.berikut .label {
		font-size: 13px;
		color: var(--krem-redup);
	}
	@keyframes hentak {
		from {
			transform: rotate(-8deg) scale(2.2);
			opacity: 0;
		}
	}
</style>
