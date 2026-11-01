<!-- Pengganti confirm() bawaan browser: kartu di tengah layar dengan gaya yang sama seperti modal lain. -->
<script lang="ts">
	import { pakaiT } from '$lib/i18n';
	import Modal from './Modal.svelte';

	let {
		judul,
		pesan,
		labelYa,
		ya,
		batal
	}: { judul: string; pesan: string; labelYa: string; ya: () => void; batal: () => void } = $props();
	const t = pakaiT();
</script>

<Modal {judul} tutup={batal} labelTutup={t('umum.tutup')} lebar={440}>
	<p>{pesan}</p>
	{#snippet kaki()}
		<div class="aksi">
			<button class="tombol krem kecil" onclick={batal}>{t('umum.batal')}</button>
			<button class="tombol merah" onclick={ya}>{labelYa}</button>
		</div>
	{/snippet}
</Modal>

<style>
	p {
		font-size: 15.5px;
		line-height: 1.5;
	}
	.aksi {
		display: flex;
		justify-content: flex-end;
		flex-wrap: wrap;
		gap: 10px;
	}
</style>
