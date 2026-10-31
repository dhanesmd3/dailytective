<script lang="ts">
	import HalamanStatis from '$lib/components/HalamanStatis.svelte';
</script>

<!-- Draf. Wajib ditinjau sebelum launch (TODO fase 3: kebijakan privasi final, UU PDP). -->
<HalamanStatis judul="Privasi">
	<p><em>Draf, belum final.</em></p>

	<h2>Tanpa akun, tanpa data pribadi</h2>
	<p>Kamu bisa bermain tanpa mendaftar. Kami tidak meminta nama, email, atau nomor telepon.</p>

	<h2>Yang kami simpan</h2>
	<ul>
		<li><strong>ID pemain anonim</strong> di cookie, berupa kode acak, supaya progres dan streak kamu tersimpan. ID ini tidak terhubung dengan identitasmu.</li>
		<li><strong>Progres permainan</strong> di server: benda yang kamu periksa, tuduhanmu, dan waktu bermain.</li>
		<li><strong>Di perangkatmu</strong> (penyimpanan lokal): coretan Buku Catatan, pengaturan, dan salinan statistik.</li>
	</ul>
	<p>Data ini dipakai untuk menjalankan game dan menyetel tingkat kesulitan kasus, tidak dijual, dan tidak dipakai untuk iklan.</p>

	<h2>Menghapus data</h2>
	<p>Hapus cookie dan data situs di browsermu untuk memulai dari awal. Progres yang tersimpan di server tidak lagi terhubung denganmu setelah cookie dihapus.</p>
</HalamanStatis>
