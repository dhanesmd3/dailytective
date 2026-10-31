<script lang="ts">
	import HalamanStatis from '$lib/components/HalamanStatis.svelte';
</script>

<HalamanStatis judul="Cara main">
	<p>Setiap hari pukul <strong>06.00 WIB</strong> ada satu kasus baru di rumah Nenek. Semua pemain mendapat kasus yang sama, dan setiap kasus hanya bisa dimainkan sekali.</p>

	<h2>1. Baca context card</h2>
	<p>Context card berisi cerita kejadian, daftar <strong>Siapa</strong>, <strong>Pakai apa</strong>, dan <strong>Di mana</strong>, serta beberapa clue awal gratis. Kamu bisa membukanya lagi kapan saja dari Buku Catatan.</p>

	<h2>2. Periksa benda di TKP</h2>
	<ul>
		<li>Rumah Nenek punya 5 ruangan. Pindah ruangan gratis.</li>
		<li>Memeriksa benda baru memakai <strong>1 jatah periksa</strong>. Memeriksa ulang benda yang sama gratis.</li>
		<li>Benda berisi bukti ditandai lingkaran kuning bernomor. Benda kosong ditandai garis putus-putus.</li>
		<li>Semua bukti terkumpul di Buku Catatan.</li>
	</ul>

	<h2>3. Menalar</h2>
	<p>Di Buku Catatan, tandai pilihan sebagai <em>gugur</em>, <em>ragu</em>, atau <em>yakin</em>. Tab Tersangka berisi ciri tetap setiap tokoh: tinggi, tangan dominan, ukuran sepatu, kacamata, dan kebiasaan. Ciri ini sering jadi kunci.</p>

	<h2>4. Menuduh</h2>
	<ul>
		<li>Pilih satu kartu di setiap baris, lalu tekan <strong>TUDUH</strong>. Kamu boleh menuduh kapan saja.</li>
		<li>Kamu punya <strong>3 kesempatan</strong>. Kalau salah, kamu diberi tahu berapa bagian yang tepat, tapi tidak bagian yang mana.</li>
		<li>Kombinasi yang sama tidak bisa dituduhkan dua kali.</li>
	</ul>

	<h2>Jadwal kesulitan</h2>
	<ul>
		<li><strong>Senin–Selasa ★☆☆</strong>: 3 pilihan per baris, 3 clue awal.</li>
		<li><strong>Rabu–Kamis ★★☆</strong>: 4 pilihan per baris, 2 clue awal.</li>
		<li><strong>Jumat ★★☆</strong> dan <strong>Sabtu ★★★</strong>: salah satu tersangka berbohong. Pembohongnya selalu pelaku.</li>
		<li><strong>Minggu ★★★</strong>: kasus besar dengan baris keempat, <strong>Kenapa</strong> (motif). Jatah periksa 12.</li>
	</ul>

	<h2>Gelar</h2>
	<ul>
		<li><strong>Detektif Legendaris</strong>: benar di tebakan pertama dengan paling banyak 5 periksa.</li>
		<li><strong>Detektif Ulung</strong>: benar di tebakan pertama.</li>
		<li><strong>Detektif Tekun</strong>: benar di tebakan kedua.</li>
		<li><strong>Detektif Beruntung</strong>: benar di tebakan ketiga.</li>
	</ul>
	<p>Streak bertambah setiap hari kamu memecahkan kasus, dan terputus kalau gagal atau tidak bermain.</p>
</HalamanStatis>
