<!--
	Teras & Kebun versi sementara. Kanvas 1200 x 700. Latar kebun di belakang, lantai teras di depan.
	Posisi hotspot di data/ruangan.json harus cocok dengan koordinat di sini.
-->
<script lang="ts">
	import type { StateRuangan } from '$lib/engine/types';
	import Belang from './Belang.svelte';
	import Cahaya from './Cahaya.svelte';
	import { W, warnaLangit } from './warna';

	let { state = {} }: { state?: StateRuangan } = $props();
	const T = W.tinta;
	const tambah = $derived(new Set(state.tambah ?? []));
	const waktu = $derived(state.waktu ?? 'malam');
	const langit = $derived(warnaLangit(waktu));
	const POS: Record<string, { x: number; y: number; s: number }> = {
		kursi: { x: 214, y: 558, s: 0.75 },
		lantai: { x: 760, y: 676, s: 0.85 },
		gudang: { x: 162, y: 236, s: 0.6 }
	};
	const belang = $derived(state.belang ? POS[state.belang] : null);
	const PAGAR = Array.from({ length: 31 }, (_, i) => i * 40);
</script>

<svg viewBox="0 0 1200 700" class="ruang" aria-hidden="true">
	<g stroke={T} stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
		<!-- langit & kebun -->
		<rect x="-5" y="-5" width="1210" height="480" fill={langit} stroke="none" />
		{#if waktu === 'malam'}
			<circle cx="760" cy="80" r="26" fill={W.krem} stroke-width="2.5" /><circle cx="748" cy="72" r="24" fill={langit} stroke="none" />
			<g fill={W.krem} stroke="none"><circle cx="300" cy="50" r="2.5" /><circle cx="600" cy="40" r="2" /><circle cx="1100" cy="70" r="2.5" /></g>
		{:else}
			<path d="M640 90 q14 -24 38 -10 q20 -18 40 2 q22 0 18 18 h-96 q-12 -4 0 -10 Z" fill="#fff" stroke-width="2.5" />
		{/if}
		<!-- pohon belimbing (dekorasi) -->
		<path d="M640 330 q-6 -90 10 -150" fill="none" stroke={W.kayuTua} stroke-width="16" />
		<circle cx="600" cy="150" r="70" fill="#3F7D5A" /><circle cx="690" cy="130" r="60" fill="#3F7D5A" /><circle cx="650" cy="200" r="58" fill="#357050" />
		<g fill={W.mustard} stroke-width="2"><path d="M590 170 l6 14 l6 -14 Z" /><path d="M700 160 l6 14 l6 -14 Z" /><path d="M640 220 l6 14 l6 -14 Z" /></g>
		<!-- pagar -->
		<rect x="-5" y="300" width="1210" height="16" fill="#D9C6A0" />
		{#each PAGAR as x (x)}
			<path d="M{x + 8} 330 v-110 l8 -12 l8 12 v110 Z" fill="#E8D9B8" stroke-width="2.5" />
		{/each}
		<rect x="-5" y="330" width="1210" height="145" fill="#6E9E58" stroke="none" />
		<line x1="0" y1="330" x2="1200" y2="330" stroke-width="3" />
		{#each [[420, 360], [560, 420], [880, 370], [1150, 450], [470, 455]] as [x, y] (x)}
			<path d="M{x} {y} q4 -14 8 0 q4 -14 8 0" fill="none" stroke="#3F6E36" stroke-width="2.5" />
		{/each}

		<!-- jemuran · tk_jemuran -->
		<path d="M70 300 V100 M380 300 V100" stroke={W.kayuTua} stroke-width="7" />
		<path d="M70 112 Q225 132 380 112" fill="none" stroke-width="2.5" />
		<path d="M110 118 h56 v80 l-10 -6 l-10 6 l-10 -6 l-10 6 l-10 -6 l-6 6 Z" fill={W.merah} stroke-width="2.5" />
		<path d="M190 124 h70 v54 h-70 Z" fill={W.krem} stroke-width="2.5" />
		<path d="M200 140 h50 M200 156 h50" stroke={W.biru} stroke-width="2.5" />
		<path d="M284 122 h56 l6 30 h-16 v60 h-36 v-60 h-16 Z" fill={W.mustard} stroke-width="2.5" />

		<!-- sangkar burung · tk_sangkar -->
		<path d="M495 80 v20" stroke-width="3" />
		<path d="M455 196 v-60 q40 -50 80 0 v60 Z" fill="#E8D9B8" fill-opacity="0.4" />
		{#each [468, 482, 495, 508, 522] as x (x)}<line x1={x} y1={x === 495 ? 106 : 120} x2={x} y2="196" stroke-width="2" />{/each}
		<rect x="450" y="192" width="90" height="12" rx="3" fill={W.kayu} />
		<path d="M486 168 q10 -16 22 -4 l8 -4 l-4 8 q-6 12 -26 6 Z" fill="#7FB0E0" stroke-width="2" />

		<!-- gudang alat · tk_gudang -->
		<path d="M50 290 L160 236 L270 290 Z" fill={W.merah} />
		<rect x="62" y="290" width="196" height="180" fill="#A2794E" />
		{#each [90, 120, 150, 180, 210, 240] as x (x)}<line x1={x} y1="292" x2={x} y2="468" stroke="#8A6640" stroke-width="2.5" />{/each}
		<rect x="122" y="340" width="76" height="130" fill="#7A5634" />
		<circle cx="186" cy="408" r="4" fill={W.mustard} stroke-width="1.5" />

		<!-- selang air · tk_selang -->
		<circle cx="335" cy="430" r="36" fill="#3F8E5A" />
		<circle cx="335" cy="430" r="24" fill="none" stroke="#2F6E44" stroke-width="5" />
		<circle cx="335" cy="430" r="10" fill={W.mustard} stroke-width="2.5" />
		<path d="M300 466 h70" stroke-width="5" />
		<path d="M368 440 q30 10 20 34" fill="none" stroke="#3F8E5A" stroke-width="7" />

		<!-- kandang ayam · tk_kandang -->
		<path d="M612 336 L710 292 L808 336 Z" fill={W.kayuTua} />
		<rect x="622" y="336" width="176" height="104" fill="#C9A66B" />
		<rect x="640" y="356" width="80" height="70" fill="#E8D9B8" fill-opacity="0.5" />
		{#each [656, 672, 688, 704] as x (x)}<line x1={x} y1="356" x2={x} y2="426" stroke-width="2" />{/each}
		<rect x="736" y="370" width="46" height="70" fill="#7A5634" />
		<ellipse cx="682" cy="408" rx="16" ry="12" fill="#fff" stroke-width="2" /><path d="M690 396 l4 -6 l3 6" fill={W.merah} stroke-width="1.5" />

		<!-- gerbang belakang · tk_gerbang -->
		<rect x="900" y="170" width="16" height="250" fill={W.kayuTua} />
		<rect x="1044" y="170" width="16" height="250" fill={W.kayuTua} />
		<path d="M916 196 q64 -40 128 0" fill="none" stroke-width="5" />
		<rect x="916" y="200" width="128" height="220" fill={W.hijau} />
		{#each [936, 958, 980, 1002, 1024] as x (x)}<line x1={x} y1="200" x2={x} y2="420" stroke="#1F4A41" stroke-width="3" />{/each}
		<line x1="916" y1="300" x2="1044" y2="300" stroke="#1F4A41" stroke-width="4" />
		<rect x="1024" y="296" width="14" height="22" rx="3" fill={W.mustard} stroke-width="2" />

		<!-- kotak surat · tk_kotaksurat -->
		<rect x="1102" y="330" width="12" height="96" fill={W.kayuTua} />
		<path d="M1080 330 v-60 q28 -26 56 0 v60 Z" fill={W.merah} />
		<rect x="1094" y="284" width="28" height="6" rx="2" fill={T} stroke="none" />
		<path d="M1136 290 v-30 h14 v10 h-14" fill={W.mustard} stroke-width="2" />

		<!-- lantai teras -->
		<rect x="-5" y="472" width="1210" height="235" fill="#C2856A" />
		<line x1="0" y1="472" x2="1200" y2="472" stroke-width="4" />
		<rect x="-5" y="472" width="1210" height="16" fill="#9C6650" />
		{#each [540, 610, 680] as y (y)}<line x1="0" y1={y} x2="1200" y2={y} stroke="#A86F58" stroke-width="2.5" />{/each}
		{#each [100, 300, 500, 700, 900, 1100] as x (x)}<line x1={x} y1="488" x2={x - 40} y2="700" stroke="#A86F58" stroke-width="2.5" />{/each}

		<!-- kursi rotan · tk_kursi -->
		<path d="M128 640 q0 -120 92 -120 q92 0 92 120" fill="none" stroke="#B5833D" stroke-width="16" />
		<path d="M128 640 q0 -120 92 -120 q92 0 92 120" fill="none" stroke-width="3" />
		<ellipse cx="220" cy="600" rx="86" ry="22" fill="#D9A55A" />
		<path d="M150 610 l-10 50 M290 610 l10 50" stroke="#8C6230" stroke-width="7" />
		<path d="M160 596 h120 M170 606 h100" stroke="#B5833D" stroke-width="2" />

		<!-- meja teras · tk_meja -->
		<ellipse cx="430" cy="540" rx="86" ry="22" fill="#B5833D" />
		<path d="M430 562 v70 M396 640 h68" stroke="#8C6230" stroke-width="7" />
		<path d="M410 532 v-14 h24 v14" fill={W.krem} stroke-width="2.5" />
		<ellipse cx="460" cy="534" rx="16" ry="5" fill="#F4F2EA" stroke-width="2" />
		{#if tambah.has('remah_kue')}
			<g fill={W.mustard} stroke="none"><circle cx="390" cy="540" r="3" /><circle cx="400" cy="546" r="2.5" /><circle cx="470" cy="548" r="3" /></g>
		{/if}

		<!-- pot bunga · tk_pot -->
		<path d="M566 600 h56 l-8 50 h-40 Z" fill={W.merah} />
		<path d="M640 590 h56 l-8 60 h-40 Z" fill="#C25F1E" />
		<path d="M594 600 q-14 -40 -6 -66 M594 600 q16 -36 8 -60" fill="none" stroke="#3F6E36" stroke-width="4" />
		<circle cx="588" cy="530" r="11" fill="#E89BB0" stroke-width="2" /><circle cx="602" cy="538" r="9" fill={W.mustard} stroke-width="2" />
		<path d="M668 590 q-20 -30 -4 -66 q18 30 4 66 M668 590 q22 -26 24 -54" fill="#3F7D5A" stroke-width="2.5" />

		<!-- sepatu bot · tk_bot -->
		<path d="M762 650 v-72 h30 v50 h22 q10 0 10 12 v10 Z" fill="#3A3A3A" />
		<path d="M808 650 v-72 h30 v50 h22 q10 0 10 12 v10 Z" fill="#3A3A3A" />
		<path d="M764 600 h26 M810 600 h26" stroke="#7A5634" stroke-width="5" />

		<!-- bak sampah · tk_sampah -->
		<rect x="944" y="512" width="92" height="138" rx="10" fill={W.hijau} />
		<rect x="936" y="500" width="108" height="20" rx="6" fill="#1F4A41" />
		<path d="M966 540 v90 M990 540 v90 M1014 540 v90" stroke="#1F4A41" stroke-width="3" />

		<!-- lampu dinding (dekorasi) -->
		<rect x="1150" y="400" width="30" height="40" rx="6" fill={W.mustard} />

		{#if tambah.has('jejak_lumpur')}
			{#each [[860, 620], [900, 590], [880, 560], [920, 530]] as [x, y], i (i)}
				<ellipse cx={x} cy={y} rx="15" ry="7" fill="#5A3A26" stroke="none" opacity="0.5" />
			{/each}
		{/if}
		{#if belang}<Belang x={belang.x} y={belang.y} s={belang.s} />{/if}
	</g>
	<Cahaya {waktu} id="teras" lampu={{ x: 1165, y: 420 }} />
</svg>

<style>
	.ruang {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
