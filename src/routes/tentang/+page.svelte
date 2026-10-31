<script lang="ts">
	import HalamanStatis from '$lib/components/HalamanStatis.svelte';
	import Potret from '$lib/components/Potret.svelte';
</script>

<HalamanStatis judul="Tentang Dailytective">
	<p><strong>Dailytective</strong> adalah game detektif harian. Setiap hari ada satu kejadian di rumah Nenek Sumarni: kue yang dicuil, uang arisan yang raib, guci yang pecah. Jelajahi ruangannya, kumpulkan bukti, lalu tebak siapa pelakunya, pakai apa, dan di mana.</p>
	<p>Setiap kasus dicek oleh solver otomatis supaya punya tepat satu jawaban yang bisa dideduksi, lalu dimainkan dulu oleh manusia sebelum terbit.</p>

	<h2>Penghuni rumah</h2>
	<div class="tokoh">
		{#each ['nenek', 'benny', 'lia', 'hendra', 'dimas', 'sekar', 'sri', 'tono', 'joko', 'wati', 'raka'] as id (id)}
			<Potret {id} ukuran={52} />
		{/each}
	</div>
	<p>Nenek tidak pernah jadi tersangka. Si Belang, kucing rumah, juga tidak, meski sering tidur di tempat yang mencurigakan.</p>

	<h2>Jangan spoiler</h2>
	<p>Bagikan hasilmu dengan tombol <em>Salin hasil</em>. Teksnya tidak membocorkan jawaban, jadi temanmu tetap bisa menikmati kasusnya.</p>
</HalamanStatis>

<style>
	.tokoh {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: 6px 0 10px;
	}
</style>
