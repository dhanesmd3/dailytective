<script lang="ts">
	import HalamanStatis from '$lib/components/HalamanStatis.svelte';
	import { pakaiT } from '$lib/i18n';

	const t = pakaiT();
</script>

<HalamanStatis judul={t('nav.cara_main')}>
	{#if t.bahasa === 'en'}
		<p>Every day at <strong>06:00 Jakarta time (UTC+7)</strong> there's a new case at Grandma's house. Every player gets the same case, and only your first attempt counts toward your stats.</p>

		<h2>1. Read the case card</h2>
		<p>The case card tells you what happened, lists the options for <strong>Who</strong>, <strong>With what</strong>, and <strong>Where</strong>, and gives you a few free starting clues. You can reopen it any time from the Notebook.</p>

		<h2>2. Check items at the crime scene</h2>
		<ul>
			<li>Grandma's house has 5 rooms. Moving between rooms is free.</li>
			<li>Checking a new item uses <strong>1 check</strong>. Rechecking the same item is free.</li>
			<li>Items with evidence get a numbered yellow circle. Empty items get a dashed outline.</li>
			<li>All your evidence is collected in the Notebook.</li>
		</ul>

		<h2>3. Reason it out</h2>
		<p>In the Notebook, mark each option as <em>ruled out</em>, <em>unsure</em>, or <em>certain</em>. The Suspects tab lists everyone's fixed traits: height, dominant hand, shoe size, glasses, and habits. These are often the key.</p>

		<h2>4. Accuse</h2>
		<ul>
			<li>Pick one card in each row, then press <strong>ACCUSE</strong>. You can accuse at any time.</li>
			<li>You get <strong>3 tries</strong>. If you're wrong, you learn how many parts were right, but not which ones.</li>
			<li>You can't make the exact same accusation twice.</li>
			<li>Missed all 3? The answer stays secret. <strong>Retry the case</strong> from scratch, or <strong>show the answer</strong> if you give up (after that, no more retries). Retries don't change your stats or streak.</li>
		</ul>

		<h2>Difficulty schedule</h2>
		<ul>
			<li><strong>Monday–Tuesday ★☆☆</strong>: 3 options per row, 3 starting clues.</li>
			<li><strong>Wednesday–Thursday ★★☆</strong>: 4 options per row, 2 starting clues.</li>
			<li><strong>Friday ★★☆</strong> and <strong>Saturday ★★★</strong>: one suspect is lying. The liar is always the culprit.</li>
			<li><strong>Sunday ★★★</strong>: a big case with a fourth row, <strong>Why</strong> (the motive). You get 12 checks.</li>
		</ul>

		<h2>Titles</h2>
		<ul>
			<li><strong>Legendary Detective</strong>: right on the first guess, using 5 checks or fewer.</li>
			<li><strong>Ace Detective</strong>: right on the first guess.</li>
			<li><strong>Diligent Detective</strong>: right on the second guess.</li>
			<li><strong>Lucky Detective</strong>: right on the third guess.</li>
			<li><strong>Never-Give-Up Detective</strong>: solved after retrying the case.</li>
		</ul>
		<p>Your streak grows every day you solve the case, and resets if you fail or skip a day.</p>
	{:else}
		<p>Setiap hari pukul <strong>06.00 WIB</strong> ada satu kasus baru di rumah Nenek. Semua pemain mendapat kasus yang sama, dan hanya percobaan pertamamu yang dihitung di statistik.</p>

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
			<li>Meleset tiga kali? Jawabannya tetap dirahasiakan. <strong>Ulangi kasus</strong> dari awal, atau <strong>tampilkan jawaban</strong> kalau sudah menyerah (setelah itu tidak bisa diulang lagi). Mengulang tidak mengubah statistik maupun streak.</li>
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
			<li><strong>Detektif Pantang Menyerah</strong>: terpecahkan setelah mengulang kasus.</li>
		</ul>
		<p>Streak bertambah setiap hari kamu memecahkan kasus, dan terputus kalau gagal atau tidak bermain.</p>
	{/if}
</HalamanStatis>
