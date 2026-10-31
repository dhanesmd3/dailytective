<!--
	Buku Catatan (GDD bagian 6): bukti, tersangka, dan papan coret.
	Tanda di papan coret hanya alat bantu pemain dan tidak memengaruhi tuduhan.
-->
<script lang="ts">
	import type { Tanda } from '$lib/client/lokal';
	import type { BuktiDitemukan, KasusPublik } from '$lib/engine/permainan';
	import type { Kategori } from '$lib/engine/types';
	import { pakaiT, type KunciTeks } from '$lib/i18n';
	import { labelAtribut, labelKategori } from '$lib/teks';
	import DaftarPengakuan from './DaftarPengakuan.svelte';
	import Ikon from './Ikon.svelte';
	import Potret from './Potret.svelte';

	let {
		kasus,
		diperiksa,
		coret = $bindable(),
		namaBenda,
		bukaContext
	}: {
		kasus: KasusPublik;
		diperiksa: BuktiDitemukan[];
		coret: Record<string, Tanda>;
		namaBenda: (id: string) => string;
		bukaContext: () => void;
	} = $props();

	const t = pakaiT();
	type Tab = 'bukti' | 'tersangka' | 'coret';
	let tab = $state<Tab>('bukti');

	const bukti = $derived(diperiksa.filter((d) => d.hasil === 'clue').sort((a, b) => (a.nomor ?? 0) - (b.nomor ?? 0)));
	const kosong = $derived(diperiksa.filter((d) => d.hasil === 'kosong'));

	function tandai(kat: Kategori, id: string, t: Tanda) {
		const k = `${kat}:${id}`;
		const baru = { ...coret };
		if (baru[k] === t) delete baru[k];
		else baru[k] = t;
		coret = baru;
	}

	const TANDA: { t: Tanda; label: KunciTeks }[] = [
		{ t: 'x', label: 'buku.gugur' },
		{ t: '?', label: 'buku.ragu' },
		{ t: 'v', label: 'buku.yakin' }
	];
</script>

<aside class="buku" aria-label={t('buku.judul')}>
	<div class="judul">
		<h2>{t('buku.judul')}</h2>
		<button class="tombol krem kecil" onclick={bukaContext}>{t('buku.context')}</button>
	</div>
	<div class="tab" role="tablist">
		{#each [['bukti', t('buku.tab_bukti')], ['tersangka', t('buku.tab_tersangka')], ['coret', t('buku.tab_coret')]] as [id, label] (id)}
			<button role="tab" aria-selected={tab === id} class:aktif={tab === id} onclick={() => (tab = id as Tab)}>
				{label}{#if id === 'bukti' && bukti.length}<span class="hitung">{bukti.length}</span>{/if}
			</button>
		{/each}
	</div>

	<div class="isi">
		{#if tab === 'bukti'}
			<h3 class="sub">{t('cc.clue_awal')}</h3>
			<ul class="daftar-clue">
				{#each kasus.context_card.clue_awal as c, i (c.id)}
					<li class="clue awal"><span class="tag">{t('buku.awal_n', { n: i + 1 })}</span><p>{c.teks}</p></li>
				{/each}
			</ul>
			{#if kasus.pengakuan.length}
				<h3 class="sub">{t('cc.pengakuan')}</h3>
				<DaftarPengakuan {kasus} kecil />
			{/if}
			<h3 class="sub">{t('buku.bukti_tkp')}</h3>
			{#if bukti.length === 0}
				<p class="kosong-teks">{t('buku.belum_bukti')}</p>
			{:else}
				<ul class="daftar-clue">
					{#each bukti as b (b.benda)}
						<li class="clue"><span class="tag">#{b.nomor} · {namaBenda(b.benda)}</span><p>{b.teks}</p></li>
					{/each}
				</ul>
			{/if}
			{#if kosong.length}
				<h3 class="sub">{t('buku.kosong')}</h3>
				<p class="kosong-teks">{kosong.map((k) => namaBenda(k.benda)).join(' · ')}</p>
			{/if}
		{:else if tab === 'tersangka'}
			<ul class="tersangka">
				{#each kasus.pilihan.siapa as s (s.id)}
					<li>
						<div class="nama-tersangka">
							<Potret id={s.id} ukuran={52} />
							<div>
								<strong>{s.nama}</strong>
								<span class="peran">{s.peran}</span>
							</div>
						</div>
						<dl>
							{#each labelAtribut(t, s.atribut) as a (a.label)}
								<dt>{a.label}</dt>
								<dd>{a.nilai}</dd>
							{/each}
							<dt>{t('atr.kebiasaan')}</dt>
							<dd>{s.kebiasaan}</dd>
						</dl>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="kosong-teks">{t('buku.coret_ket')}</p>
			{#each kasus.kategori as kat (kat)}
				<h3 class="sub">{labelKategori(t, kat)}</h3>
				<ul class="coret">
					{#each kasus.pilihan[kat] ?? [] as p (p.id)}
						{@const tanda = coret[`${kat}:${p.id}`]}
						<li class:gugur={tanda === 'x'}>
							<span class="gambar">
								{#if kat === 'siapa'}<Potret id={p.id} ukuran={30} />{:else if kat === 'kenapa'}<span class="tanya">?</span>{:else}<Ikon
										id={p.id}
										ukuran={26}
									/>{/if}
							</span>
							<span class="nama-pilihan">{p.nama}</span>
							<span class="tanda">
								{#each TANDA as d (d.t)}
									<button
										class="t-{d.t === '?' ? 'q' : d.t}"
										aria-pressed={tanda === d.t}
										aria-label="{p.nama}: {t(d.label)}"
										onclick={() => tandai(kat, p.id, d.t)}
									>
										<svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
											{#if d.t === 'x'}
												<path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
											{:else if d.t === 'v'}
												<path d="M4 10l4 4 8-9" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
											{:else}
												<path d="M7 7a3 3 0 1 1 4 2.8c-.8.4-1 1-1 1.7" stroke="currentColor" stroke-width="2.6" fill="none" stroke-linecap="round" />
												<circle cx="10" cy="15.5" r="1.6" fill="currentColor" />
											{/if}
										</svg>
									</button>
								{/each}
							</span>
						</li>
					{/each}
				</ul>
			{/each}
		{/if}
	</div>
</aside>

<style>
	.buku {
		background: var(--krem);
		color: var(--tinta);
		border: 3px solid var(--tinta);
		border-radius: 12px;
		box-shadow: 0 5px 0 var(--tinta);
		display: flex;
		flex-direction: column;
		min-height: 0;
		max-height: calc(100vh - 110px);
		position: sticky;
		top: 12px;
	}
	.judul {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 14px 8px;
		gap: 8px;
	}
	h2 {
		font-size: 19px;
	}
	.judul .tombol {
		white-space: nowrap;
	}
	.tab {
		display: flex;
		border-bottom: 2.5px solid var(--tinta);
		padding: 0 10px;
		gap: 4px;
	}
	.tab button {
		flex: 1;
		background: transparent;
		border: 2.5px solid transparent;
		border-bottom: none;
		border-radius: 8px 8px 0 0;
		padding: 7px 4px;
		font-weight: 700;
		font-size: 13px;
		cursor: pointer;
		color: var(--coklat-teks);
		margin-bottom: -2.5px;
	}
	.tab button.aktif {
		background: #fbf3df;
		border-color: var(--tinta);
		color: var(--tinta);
	}
	.hitung {
		display: inline-block;
		margin-left: 5px;
		background: var(--mustard);
		border: 1.5px solid var(--tinta);
		border-radius: 999px;
		font-size: 11px;
		padding: 0 6px;
	}
	.isi {
		background: #fbf3df;
		overflow-y: auto;
		padding: 10px 14px 16px;
		border-radius: 0 0 10px 10px;
		flex: 1;
	}
	.sub {
		font-size: 13px;
		letter-spacing: 1px;
		text-transform: uppercase;
		color: var(--merah-bata);
		margin: 12px 0 6px;
	}
	.sub:first-child {
		margin-top: 2px;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.daftar-clue {
		display: grid;
		gap: 8px;
	}
	.clue {
		background: var(--mustard);
		border: 2px solid var(--tinta);
		border-radius: 8px;
		padding: 7px 10px;
		box-shadow: 0 2px 0 var(--tinta);
		animation: masuk 300ms ease-out;
	}
	.clue.awal {
		background: #fff8e6;
	}
	.clue p {
		font-size: 14px;
		font-weight: 500;
	}
	.tag {
		display: inline-block;
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--coklat-teks);
	}
	.clue:not(.awal) .tag {
		color: var(--tinta);
	}
	.kosong-teks {
		font-size: 13px;
		color: var(--coklat-teks);
	}
	.tersangka {
		display: grid;
		gap: 10px;
	}
	.tersangka li {
		border: 2px solid var(--tinta);
		border-radius: 10px;
		padding: 8px 10px;
		background: var(--krem);
	}
	.nama-tersangka {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 6px;
	}
	.nama-tersangka strong {
		display: block;
		font-size: 15px;
	}
	.peran {
		font-size: 12px;
		color: var(--coklat-teks);
	}
	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 2px 10px;
		margin: 0;
		font-size: 13px;
	}
	dt {
		color: var(--coklat-teks);
		font-weight: 600;
	}
	dd {
		margin: 0;
		font-weight: 500;
	}
	.coret {
		display: grid;
		gap: 5px;
	}
	.coret li {
		display: flex;
		align-items: center;
		gap: 8px;
		border: 2px solid var(--tinta);
		border-radius: 8px;
		padding: 4px 6px;
		background: var(--krem);
	}
	.coret li.gugur .nama-pilihan {
		text-decoration: line-through;
		text-decoration-color: var(--merah-bata);
		text-decoration-thickness: 2.5px;
		color: var(--coklat-teks);
	}
	.coret li.gugur .gambar {
		opacity: 0.45;
	}
	.gambar {
		display: grid;
		place-items: center;
		width: 30px;
	}
	.tanya {
		display: grid;
		place-items: center;
		width: 26px;
		height: 26px;
		border: 2px solid var(--tinta);
		border-radius: 50%;
		background: var(--mustard);
		font-family: var(--font-judul);
	}
	.nama-pilihan {
		flex: 1;
		font-weight: 600;
		font-size: 14px;
	}
	.tanda {
		display: flex;
		gap: 3px;
	}
	.tanda button {
		width: 30px;
		height: 30px;
		display: grid;
		place-items: center;
		border: 2px solid var(--tinta);
		border-radius: 6px;
		background: transparent;
		cursor: pointer;
		color: var(--coklat-teks);
	}
	.tanda button[aria-pressed='true'] {
		color: var(--krem);
	}
	.tanda .t-x[aria-pressed='true'] {
		background: var(--merah-bata);
	}
	.tanda .t-q[aria-pressed='true'] {
		background: var(--mustard);
		color: var(--tinta);
	}
	.tanda .t-v[aria-pressed='true'] {
		background: var(--hijau-sukses);
	}
	@keyframes masuk {
		from {
			transform: translateX(16px);
			opacity: 0;
		}
	}
</style>
