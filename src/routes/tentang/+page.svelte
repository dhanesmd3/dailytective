<script lang="ts">
	import HalamanStatis from '$lib/components/HalamanStatis.svelte';
	import Potret from '$lib/components/Potret.svelte';
	import { pakaiT } from '$lib/i18n';

	const t = pakaiT();
	const TOKOH = ['nenek', 'benny', 'lia', 'hendra', 'dimas', 'sekar', 'sri', 'tono', 'joko', 'wati', 'raka'];
</script>

<HalamanStatis judul={t.bahasa === 'en' ? 'About Dailytective' : 'Tentang Dailytective'}>
	{#if t.bahasa === 'en'}
		<p><strong>Dailytective</strong> is a daily detective game. Every day something happens at Grandma Sumarni's house in Indonesia: a nibbled cake, missing savings-club money, a broken heirloom vase. Search the rooms, collect evidence, then work out who did it, with what, and where.</p>
		<p>Every case is checked by an automatic solver so it has exactly one answer you can deduce, and is played by humans before it goes out.</p>

		<h2>The household</h2>
		<div class="tokoh">
			{#each TOKOH as id (id)}<Potret {id} ukuran={52} />{/each}
		</div>
		<p>Grandma is never a suspect. Neither is Belang the cat, even though it keeps napping in suspicious places.</p>
		<p>A few words you'll meet: <em>Om</em> and <em>Tante</em> mean uncle and aunt, <em>Pak</em> and <em>Bu</em> mean Mr. and Mrs., and <em>Mbok</em> is a warm Javanese title for an older woman.</p>

		<h2>No spoilers</h2>
		<p>Share your result with the <em>Copy result</em> button. The text doesn't reveal the answer, so your friends can still enjoy the case.</p>
	{:else}
		<p><strong>Dailytective</strong> adalah game detektif harian. Setiap hari ada satu kejadian di rumah Nenek Sumarni: kue yang dicuil, uang arisan yang raib, guci yang pecah. Jelajahi ruangannya, kumpulkan bukti, lalu tebak siapa pelakunya, pakai apa, dan di mana.</p>
		<p>Setiap kasus dicek oleh solver otomatis supaya punya tepat satu jawaban yang bisa dideduksi, lalu dimainkan dulu oleh manusia sebelum terbit.</p>

		<h2>Penghuni rumah</h2>
		<div class="tokoh">
			{#each TOKOH as id (id)}<Potret {id} ukuran={52} />{/each}
		</div>
		<p>Nenek tidak pernah jadi tersangka. Si Belang, kucing rumah, juga tidak, meski sering tidur di tempat yang mencurigakan.</p>

		<h2>Jangan spoiler</h2>
		<p>Bagikan hasilmu dengan tombol <em>Salin hasil</em>. Teksnya tidak membocorkan jawaban, jadi temanmu tetap bisa menikmati kasusnya.</p>
	{/if}
</HalamanStatis>

<style>
	.tokoh {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: 6px 0 10px;
	}
</style>
