<script lang="ts">
	import HalamanStatis from '$lib/components/HalamanStatis.svelte';
	import { pakaiT } from '$lib/i18n';

	const t = pakaiT();
</script>

<!-- Draf. Wajib ditinjau sebelum launch (TODO fase 3: kebijakan privasi final, UU PDP). -->
<HalamanStatis judul={t('nav.privasi')} deskripsi={t('seo.privasi.desk')}>
	{#if t.bahasa === 'en'}
		<p><em>Draft, not final.</em></p>

		<h2>No account, no personal data</h2>
		<p>You can play without signing up. We don't ask for your name, email, or phone number.</p>

		<h2>What we store</h2>
		<ul>
			<li><strong>An anonymous player ID</strong> in a cookie: a random code so your progress and streak are saved. It isn't linked to who you are.</li>
			<li><strong>Your game progress</strong> on our server: the items you checked, your accusations, and how long you played.</li>
			<li><strong>On your device</strong> (local storage): your Notebook marks, settings, and a copy of your stats. Your language choice is kept in a cookie.</li>
		</ul>
		<p>We use this data to run the game and to tune how hard the cases are. We don't sell it or use it for ads.</p>

		<h2>Deleting your data</h2>
		<p>Clear the cookies and site data in your browser to start over. Progress stored on the server is no longer linked to you once the cookie is gone.</p>
	{:else}
		<p><em>Draf, belum final.</em></p>

		<h2>Tanpa akun, tanpa data pribadi</h2>
		<p>Kamu bisa bermain tanpa mendaftar. Kami tidak meminta nama, email, atau nomor telepon.</p>

		<h2>Yang kami simpan</h2>
		<ul>
			<li><strong>ID pemain anonim</strong> di cookie, berupa kode acak, supaya progres dan streak kamu tersimpan. ID ini tidak terhubung dengan identitasmu.</li>
			<li><strong>Progres permainan</strong> di server: benda yang kamu periksa, tuduhanmu, dan waktu bermain.</li>
			<li><strong>Di perangkatmu</strong> (penyimpanan lokal): coretan Buku Catatan, pengaturan, dan salinan statistik. Pilihan bahasa disimpan di cookie.</li>
		</ul>
		<p>Data ini dipakai untuk menjalankan game dan menyetel tingkat kesulitan kasus, tidak dijual, dan tidak dipakai untuk iklan.</p>

		<h2>Menghapus data</h2>
		<p>Hapus cookie dan data situs di browsermu untuk memulai dari awal. Progres yang tersimpan di server tidak lagi terhubung denganmu setelah cookie dihapus.</p>
	{/if}
</HalamanStatis>
