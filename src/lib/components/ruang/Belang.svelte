<!--
	Si Belang (lapisan 6): kucing kampung oranye-putih yang gemuk, rebahan ala "roti tawar" (loaf).
	Titik (0, 0) = tengah bawah badan. Ukuran ±105 x 75 pada skala 1 (kumis sampai x -57, telinga y -63, ekor y +10);
	posisi & skala diatur tiap ruangan. `hidup` menyalakan animasi kecil (napas, kedip, kepala, telinga), dipakai di footer.
-->
<script lang="ts">
	let {
		x,
		y,
		s = 1,
		tidur = false,
		hidup = false
	}: { x: number; y: number; s?: number; tidur?: boolean; hidup?: boolean } = $props();
	const T = '#1F1812';
	const ORANYE = '#E8873A';
	const BELANG = '#B85A1C';
	const PUTIH = '#F7F1E3';
	const PINK = '#E89BA8';
</script>

<g transform="translate({x} {y}) scale({s})" stroke={T} stroke-linejoin="round" stroke-linecap="round" class:hidup>
<g class="napas">
	<!-- badan: bentuk roti tawar, punggung melengkung -->
	<path d="M-26 0 C-38 -1 -40 -20 -30 -30 C-14 -44 26 -44 40 -28 C50 -16 48 -1 36 0 Z" fill={ORANYE} stroke-width="2.6" />
	<!-- belang di punggung & paha -->
	<g fill="none" stroke={BELANG} stroke-width="3.2">
		<path d="M-6 -40 q2 7 -1 13" />
		<path d="M6 -41 q3 8 0 15" />
		<path d="M18 -39 q3 8 0 14" />
		<path d="M29 -34 q3 6 1 12" />
		<path d="M36 -18 q-6 3 -11 2" />
		<path d="M38 -9 q-6 3 -11 1" />
	</g>
	<!-- dada & perut putih -->
	<path d="M-30 -2 C-34 -10 -32 -22 -24 -26 C-18 -18 -14 -8 -10 0 Z" fill={PUTIH} stroke="none" />

	<!-- ekor melingkar di depan badan, ujung putih -->
	<path d="M38 -6 C44 4 20 8 -4 5 C-12 4 -16 2 -18 -1" fill="none" stroke={T} stroke-width="9" />
	<path d="M38 -6 C44 4 20 8 -4 5 C-12 4 -16 2 -18 -1" fill="none" stroke={ORANYE} stroke-width="5.5" />
	<path d="M-6 5 C-12 4 -16 2 -18 -1" fill="none" stroke={PUTIH} stroke-width="5.5" />
	<path d="M16 6 q2 -3 0 -6 M26 5 q2 -3 0 -6" fill="none" stroke={BELANG} stroke-width="2.2" />

	<!-- kaki depan putih, terlipat -->
	<ellipse cx="-34" cy="-2" rx="8" ry="4.5" fill={PUTIH} stroke-width="2.2" />
	<ellipse cx="-22" cy="-1" rx="8" ry="4.5" fill={PUTIH} stroke-width="2.2" />
	<path d="M-39 -2 v2 M-36 -2 v2 M-27 -1 v2 M-24 -1 v2" stroke-width="1.2" />

	<g class="kepala">
	<!-- telinga -->
	<path d="M-50 -44 L-52 -63 L-38 -52 Z" fill={ORANYE} stroke-width="2.4" />
	<path d="M-49 -48 L-50 -58 L-42 -52 Z" fill={PINK} stroke="none" />
	<g class="telinga">
		<path d="M-27 -52 L-14 -63 L-15 -44 Z" fill={ORANYE} stroke-width="2.4" />
		<path d="M-23 -52 L-16 -58 L-17 -48 Z" fill={PINK} stroke="none" />
	</g>

	<!-- kepala: sedikit lebih lebar daripada tinggi -->
	<ellipse cx="-33" cy="-38" rx="19" ry="16" fill={ORANYE} stroke-width="2.6" />
	<!-- tanda "M" di dahi -->
	<path d="M-41 -49 l3 5 l3 -5 l3 5 l3 -5" fill="none" stroke={BELANG} stroke-width="2.2" />
	<path d="M-51 -40 h5 M-51 -35 h5 M-15 -40 h-5 M-15 -35 h-5" stroke={BELANG} stroke-width="2.2" />
	<!-- moncong putih -->
	<path d="M-44 -31 q4 -7 11 -7 q7 0 11 7 q-3 7 -11 7 q-8 0 -11 -7 Z" fill={PUTIH} stroke="none" />

	<!-- mata -->
	{#if tidur}
		<path d="M-45 -40 q4 3 8 0 M-29 -40 q4 3 8 0" fill="none" stroke-width="2" />
	{:else}
		<g class="mata">
		<path d="M-46 -40 q4 -5 9 0 q-4 4 -9 0 Z" fill="#B6D244" stroke-width="1.8" />
		<path d="M-29 -40 q4 -5 9 0 q-4 4 -9 0 Z" fill="#B6D244" stroke-width="1.8" />
		<path d="M-41.5 -42.5 v5 M-24.5 -42.5 v5" stroke-width="2.2" />
		<circle cx="-43" cy="-41" r="0.9" fill="#fff" stroke="none" />
		<circle cx="-26" cy="-41" r="0.9" fill="#fff" stroke="none" />
		</g>
	{/if}

	<!-- hidung, mulut, kumis -->
	<path d="M-36 -34.5 h6 l-3 3.2 Z" fill={PINK} stroke-width="1.4" />
	<path d="M-33 -31.3 v1.6 q-2 2.5 -4.5 0.6 M-33 -29.7 q2 2.5 4.5 0.6" fill="none" stroke-width="1.4" />
	<g stroke-width="1" opacity="0.85">
		<path d="M-41 -31 l-16 -2 M-41 -29 l-16 2 M-41 -27 l-14 5" />
		<path d="M-25 -31 l16 -2 M-25 -29 l16 2 M-25 -27 l14 5" />
	</g>
	</g>
</g>
</g>

<style>
	/* Animasi hanya untuk mode hidup. Durasi sengaja tidak sama, jadi gerakannya tidak terasa berulang. */
	.hidup .napas {
		transform-box: fill-box;
		transform-origin: 50% 100%;
		animation: napas 3.6s ease-in-out infinite;
	}
	.hidup .kepala {
		transform-box: fill-box;
		transform-origin: 72% 88%;
		animation: miring 11s ease-in-out infinite;
	}
	.hidup .mata {
		transform-box: fill-box;
		transform-origin: 50% 50%;
		animation: kedip 5.3s infinite;
	}
	.hidup .telinga {
		transform-box: fill-box;
		transform-origin: 25% 100%;
		animation: kedut 7.7s infinite;
	}
	@keyframes napas {
		50% {
			transform: scale(1.012, 1.03);
		}
	}
	/* diam, menoleh miring seperti penasaran, lalu kembali */
	@keyframes miring {
		0%,
		30% {
			transform: none;
		}
		36%,
		46% {
			transform: rotate(-7deg);
		}
		54%,
		66% {
			transform: rotate(3deg);
		}
		74%,
		100% {
			transform: none;
		}
	}
	/* kedip sekali, lalu kedip dua kali beruntun */
	@keyframes kedip {
		0%,
		43%,
		47%,
		88%,
		92.5%,
		97%,
		100% {
			transform: none;
		}
		45%,
		90%,
		95% {
			transform: scaleY(0.1);
		}
	}
	@keyframes kedut {
		0%,
		80%,
		87%,
		100% {
			transform: none;
		}
		82% {
			transform: rotate(16deg);
		}
		84.5% {
			transform: rotate(-5deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.hidup * {
			animation: none !important;
		}
	}
</style>
