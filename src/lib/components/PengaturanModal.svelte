<script lang="ts">
	import { pengaturan, simpanPengaturan } from '$lib/client/pengaturan.svelte';
	import { bunyi } from '$lib/client/suara';
	import Modal from './Modal.svelte';

	let { tutup }: { tutup: () => void } = $props();

	const PILIHAN = [
		{ kunci: 'suara', label: 'Suara', ket: 'Bunyi saat memeriksa benda, menemukan bukti, dan menuduh.' },
		{ kunci: 'kontrasTinggi', label: 'Kontras tinggi', ket: 'Teks dan garis lebih tegas, latar lebih gelap.' },
		{ kunci: 'kurangiAnimasi', label: 'Kurangi animasi', ket: 'Matikan getaran, stempel, dan kartu meluncur.' }
	] as const;

	function ubah(kunci: (typeof PILIHAN)[number]['kunci']) {
		pengaturan[kunci] = !pengaturan[kunci];
		simpanPengaturan();
		if (kunci === 'suara' && pengaturan.suara) bunyi('bukti');
	}
</script>

<Modal judul="Pengaturan" {tutup} lebar={440}>
	<ul>
		{#each PILIHAN as p (p.kunci)}
			<li>
				<div>
					<strong id="lbl-{p.kunci}">{p.label}</strong>
					<p>{p.ket}</p>
				</div>
				<button
					class="saklar"
					role="switch"
					aria-checked={pengaturan[p.kunci]}
					aria-labelledby="lbl-{p.kunci}"
					onclick={() => ubah(p.kunci)}
				>
					<span></span>
				</button>
			</li>
		{/each}
	</ul>
	<p class="catatan">Pengaturan tersimpan di perangkat ini. Kurangi animasi juga otomatis aktif kalau sistem operasimu memintanya.</p>
</Modal>

<style>
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 12px;
	}
	li {
		display: flex;
		gap: 14px;
		align-items: center;
		justify-content: space-between;
		border: 2px solid var(--tinta);
		border-radius: 10px;
		padding: 10px 12px;
		background: #fff8e6;
	}
	li p {
		font-size: 13px;
		color: var(--coklat-teks);
	}
	.saklar {
		flex-shrink: 0;
		width: 56px;
		height: 32px;
		border-radius: 999px;
		border: 2.5px solid var(--tinta);
		background: #d8cfc0;
		position: relative;
		cursor: pointer;
	}
	.saklar span {
		position: absolute;
		top: 3px;
		left: 3px;
		width: 21px;
		height: 21px;
		border-radius: 50%;
		background: var(--krem);
		border: 2px solid var(--tinta);
		transition: transform 120ms;
	}
	.saklar[aria-checked='true'] {
		background: var(--hijau-sukses);
	}
	.saklar[aria-checked='true'] span {
		transform: translateX(24px);
	}
	.catatan {
		margin-top: 12px;
		font-size: 13px;
		color: var(--coklat-teks);
	}
</style>
