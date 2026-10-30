<!--
	Ilustrasi Ruang Tamu versi sementara. Kanvas 1200 x 700 (rasio 12:7, dokumen 05 bagian 6).
	Lapisan: arsitektur → furnitur & benda tetap → benda sementara (per kasus) → Si Belang → pencahayaan.
	Aturan hidden object: benda yang bisa diklik digambar dengan gaya yang sama dengan dekorasi.
	Posisi hotspot ada di data/ruangan.json (persen), cocok dengan koordinat di sini.
-->
<script lang="ts">
	import type { StateRuangan } from '$lib/engine/types';

	let { state = {} }: { state?: StateRuangan } = $props();

	const T = '#1F1812';
	const tambah = $derived(new Set(state.tambah ?? []));
	const waktu = $derived(state.waktu ?? 'malam');
	const langit = $derived(waktu === 'siang' ? '#A9CFE3' : waktu === 'sore' ? '#E9A35A' : '#22304F');

	const POSISI_BELANG: Record<string, { x: number; y: number; s: number }> = {
		lantai: { x: 470, y: 648, s: 1 },
		sofa: { x: 790, y: 372, s: 0.85 },
		kursi: { x: 1022, y: 512, s: 0.85 },
		keset: { x: 118, y: 500, s: 0.85 },
		rak: { x: 402, y: 150, s: 0.6 }
	};
	const belang = $derived(state.belang ? POSISI_BELANG[state.belang] : null);

	const SAMBUNGAN_LANTAI: [number, number, number][] = [
		[150, 482, 530], [420, 530, 580], [760, 482, 530], [1040, 530, 580], [260, 580, 640], [960, 580, 640], [620, 640, 700]
	];
	const BARIS_BUKU: [number, number, string[]][] = [
		[170, 230, ['#B23A2A', '#E2A72E', '#2E6B5E', '#3E5C8A', '#F4E7C9', '#B23A2A']],
		[240, 300, ['#3E5C8A', '#3E5C8A', '#E2A72E', '#7A4A22', '#2E6B5E']],
		[310, 370, ['#F4E7C9', '#B23A2A', '#2E6B5E', '#E2A72E', '#3E5C8A', '#7A4A22']],
		[380, 440, ['#2E6B5E', '#E2A72E', '#B23A2A', '#F4E7C9']]
	];
	const KEPALA_FOTO: [number, number, string][] = [
		[484, 196, '#2A1A12'], [503, 190, '#EEE8DC'], [522, 196, '#BDB6AA'], [541, 192, '#2A1A12'], [558, 198, '#5A3A26']
	];
	const JEJAK: [number, number][] = [[205, 548], [262, 536], [318, 560], [372, 548], [428, 572], [484, 560], [540, 584]];
</script>

<svg viewBox="0 0 1200 700" class="ruang" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
	<defs>
		<radialGradient id="rt-cahaya" cx="600" cy="60" r="620" gradientUnits="userSpaceOnUse">
			<stop offset="0" stop-color="#FFD98A" stop-opacity="0.22" />
			<stop offset="1" stop-color="#FFD98A" stop-opacity="0" />
		</radialGradient>
		<pattern id="rt-dinding" width="40" height="40" patternUnits="userSpaceOnUse">
			<rect width="40" height="40" fill="#D9C59B" />
			<rect x="0" width="20" height="40" fill="#D2BD91" />
			<circle cx="30" cy="20" r="2" fill="#C8B184" />
		</pattern>
	</defs>

	<g stroke={T} stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
		<!-- 1. ARSITEKTUR -->
		<rect x="-5" y="-5" width="1210" height="490" fill="url(#rt-dinding)" stroke="none" />
		<rect x="-5" y="380" width="1210" height="102" fill="#7A4E2D" />
		<line x1="0" y1="380" x2="1200" y2="380" stroke-width="5" />
		{#each [80, 230, 380, 530, 680, 830, 980, 1130] as x (x)}
			<rect x={x - 50} y="395" width="100" height="72" rx="3" fill="none" stroke="#5E3A20" stroke-width="2.5" />
		{/each}
		<rect x="-5" y="482" width="1210" height="225" fill="#9A6A42" />
		{#each [530, 580, 640, 700] as y (y)}
			<line x1="0" y1={y} x2="1200" y2={y} stroke="#845733" stroke-width="2.5" />
		{/each}
		{#each SAMBUNGAN_LANTAI as [x, y1, y2] (`${x}-${y1}`)}
			<line x1={x} y1={y1} x2={x} y2={y2} stroke="#845733" stroke-width="2.5" />
		{/each}
		<line x1="0" y1="482" x2="1200" y2="482" stroke-width="4" />

		<!-- lampu gantung (dekorasi) -->
		<line x1="600" y1="0" x2="600" y2="30" stroke-width="2.5" />
		<path d="M572 52 L582 28 L618 28 L628 52 Z" fill="#E2A72E" />
		<ellipse cx="600" cy="56" rx="9" ry="5" fill="#FFF3C4" stroke-width="2" />

		<!-- pintu depan (dekorasi) -->
		<rect x="42" y="122" width="146" height="362" fill="#5E3A20" />
		<rect x="52" y="132" width="126" height="352" fill="#8B5A2B" />
		<rect x="68" y="150" width="94" height="130" rx="4" fill="#7A4E2D" stroke-width="2.5" />
		<rect x="68" y="300" width="94" height="160" rx="4" fill="#7A4E2D" stroke-width="2.5" />
		<circle cx="164" cy="300" r="7" fill="#E2A72E" />
		<!-- saklar & tempat payung (dekorasi) -->
		<rect x="200" y="238" width="18" height="26" rx="3" fill="#F4E7C9" stroke-width="2.5" />
		<rect x="10" y="420" width="26" height="72" rx="3" fill="#3E5C8A" />
		<path d="M18 420 L14 340 M28 420 L34 352 q6 -8 0 -12" fill="none" stroke-width="3.5" />

		<!-- jam dinding · rt_jam -->
		<circle cx="115" cy="70" r="34" fill="#F4E7C9" stroke-width="4" />
		{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as i (i)}
			<line
				x1={115 + 26 * Math.sin((i * Math.PI) / 6)}
				y1={70 - 26 * Math.cos((i * Math.PI) / 6)}
				x2={115 + 30 * Math.sin((i * Math.PI) / 6)}
				y2={70 - 30 * Math.cos((i * Math.PI) / 6)}
				stroke-width="2.5"
			/>
		{/each}
		<line x1="115" y1="70" x2="115" y2="48" stroke-width="3.5" />
		<line x1="115" y1="70" x2="131" y2="78" stroke-width="3" />

		<!-- keset & rak sepatu · rt_keset -->
		<rect x="45" y="490" width="150" height="26" rx="5" fill="#B23A2A" />
		<path d="M60 497 h120 M60 509 h120" stroke="#E2A72E" stroke-width="2.5" />
		<rect x="198" y="405" width="88" height="90" fill="#6B4426" />
		<line x1="198" y1="435" x2="286" y2="435" stroke-width="2.5" />
		<line x1="198" y1="465" x2="286" y2="465" stroke-width="2.5" />
		<path d="M206 432 q0 -12 12 -12 l14 6 v6 Z" fill="#1F1812" stroke-width="2" />
		<path d="M244 432 q0 -10 10 -10 l18 4 v6 Z" fill="#B23A2A" stroke-width="2" />
		<path d="M206 462 h24 v-8 h-24 Z" fill="#E2A72E" stroke-width="2" />
		<path d="M244 462 q2 -10 14 -10 l12 4 v6 Z" fill="#F4E7C9" stroke-width="2" />
		<path d="M210 492 h26 v-6 h-26 Z" fill="#3E5C8A" stroke-width="2" />

		<!-- rak buku · rt_rak -->
		<rect x="305" y="160" width="125" height="335" fill="#6B4426" />
		{#each [230, 300, 370, 440] as y (y)}
			<line x1="305" y1={y} x2="430" y2={y} stroke-width="3" />
		{/each}
		{#each BARIS_BUKU as [y1, y2, warna], baris (baris)}
			{#each warna as w, i (i)}
				<rect
					x={313 + i * (110 / warna.length)}
					y={y1 + ((i * 7 + baris * 3) % 12)}
					width={110 / warna.length - 3}
					height={y2 - y1 - ((i * 7 + baris * 3) % 12)}
					fill={w}
					stroke-width="2"
				/>
			{/each}
		{/each}
		<rect x="318" y="452" width="40" height="36" rx="3" fill="#E2A72E" stroke-width="2.5" />
		<rect x="368" y="458" width="50" height="30" rx="3" fill="#F4E7C9" stroke-width="2.5" />
		<!-- vas di atas rak (dekorasi) -->
		<path d="M340 160 q-8 -20 6 -36 h14 q14 16 6 36 Z" fill="#2E6B5E" />
		<path d="M352 124 q-6 -20 -20 -26 M354 124 q4 -22 18 -28" fill="none" stroke="#2E6B5E" stroke-width="4" />

		<!-- hiasan kristik (dekorasi) -->
		<rect x="478" y="70" width="84" height="48" rx="3" fill="#F4E7C9" stroke-width="2.5" />
		<path d="M490 86 h60 M490 98 h44 M490 108 h52" stroke="#B23A2A" stroke-width="2" stroke-dasharray="4 3" />

		<!-- foto keluarga · rt_foto -->
		<rect x="455" y="140" width="130" height="100" fill="#5E3A20" stroke-width="3.5" />
		<rect x="467" y="152" width="106" height="76" fill="#E8D4A8" stroke-width="2" />
		{#each KEPALA_FOTO as [x, y, rambut] (x)}
			<path d="M{x - 9} 228 q9 -16 18 0" fill="#9C6B4E" stroke-width="1.5" />
			<circle cx={x} cy={y} r="8" fill="#E3B08A" stroke-width="1.5" />
			<path d="M{x - 8} {y - 2} q8 -10 16 0" fill={rambut} stroke-width="1.5" />
			{#if tambah.has('kumis_foto')}
				<path d="M{x - 5} {y + 3} q2.5 -3 5 0 q2.5 -3 5 0" fill="none" stroke={T} stroke-width="2.2" />
			{/if}
		{/each}

		<!-- lemari kecil bawah telepon · rt_lemari -->
		<rect x="455" y="375" width="130" height="108" fill="#7A4E2D" />
		{#if tambah.has('lemari_terbuka')}
			<rect x="460" y="382" width="58" height="96" fill="#2B1D14" stroke-width="2.5" />
			<path d="M460 382 L428 394 L428 470 L460 478 Z" fill="#8B5A2B" />
			<rect x="522" y="382" width="58" height="96" fill="#8B5A2B" stroke-width="2.5" />
			<circle cx="530" cy="430" r="4" fill="#E2A72E" stroke-width="2" />
		{:else}
			<rect x="460" y="382" width="58" height="96" fill="#8B5A2B" stroke-width="2.5" />
			<rect x="522" y="382" width="58" height="96" fill="#8B5A2B" stroke-width="2.5" />
			<circle cx="510" cy="430" r="4" fill="#E2A72E" stroke-width="2" />
			<circle cx="530" cy="430" r="4" fill="#E2A72E" stroke-width="2" />
		{/if}
		<rect x="462" y="483" width="10" height="12" fill="#5E3A20" stroke-width="2" />
		<rect x="568" y="483" width="10" height="12" fill="#5E3A20" stroke-width="2" />
		<rect x="448" y="368" width="144" height="10" rx="2" fill="#5E3A20" />

		<!-- telepon rumah · rt_telepon -->
		<path d="M488 368 L496 340 L544 340 L552 368 Z" fill="#B23A2A" />
		<circle cx="520" cy="354" r="10" fill="#F4E7C9" stroke-width="2.5" />
		<circle cx="520" cy="354" r="3" fill={T} stroke="none" />
		<path d="M484 336 q4 -14 14 -12 h44 q10 -2 14 12 l-10 4 q-4 -6 -10 -6 h-32 q-6 0 -10 6 Z" fill="#B23A2A" />
		<path d="M552 362 q24 6 18 26 q-4 14 8 22" fill="none" stroke-width="2" />

		<!-- lukisan pemandangan · rt_lukisan -->
		<rect x="655" y="80" width="200" height="135" fill="#E2A72E" stroke-width="4" />
		<rect x="669" y="94" width="172" height="107" fill="#BFE0EA" stroke-width="2.5" />
		<path d="M669 170 L722 118 L758 152 L790 124 L841 170 Z" fill="#3E5C8A" stroke-width="2.5" />
		<circle cx="808" cy="116" r="11" fill="#F4E7C9" stroke-width="2" />
		<path d="M669 170 h172 v31 h-172 Z" fill="#2E6B5E" stroke-width="2.5" />
		<path d="M680 182 h40 M736 190 h46 M796 180 h34" stroke="#7FB069" stroke-width="2.5" />

		<!-- sofa (badan) -->
		<rect x="615" y="290" width="280" height="96" rx="20" fill="#2E6B5E" />
		<rect x="610" y="415" width="290" height="30" rx="6" fill="#245448" />
		<rect x="630" y="372" width="250" height="48" rx="10" fill="#357A6B" />
		<rect x="598" y="330" width="46" height="112" rx="16" fill="#2E6B5E" />
		<rect x="866" y="330" width="46" height="112" rx="16" fill="#2E6B5E" />
		<!-- kolong sofa · rt_kolong -->
		<rect x="618" y="445" width="276" height="50" fill="#3A2616" stroke="none" opacity="0.85" />
		<rect x="622" y="445" width="14" height="50" fill="#5E3A20" stroke-width="2.5" />
		<rect x="876" y="445" width="14" height="50" fill="#5E3A20" stroke-width="2.5" />
		<rect x="740" y="445" width="12" height="44" fill="#5E3A20" stroke-width="2.5" />
		<!-- bantal sofa · rt_sofa -->
		<path d="M648 320 q42 -10 86 2 l-4 62 q-40 8 -80 -2 Z" fill="#E2A72E" />
		<path d="M772 322 q40 -8 82 4 l-6 60 q-38 8 -74 -2 Z" fill="#B23A2A" />
		<circle cx="690" cy="352" r="4" fill={T} stroke="none" />
		<path d="M796 344 l10 10 l10 -10 l10 10 l10 -10" fill="none" stroke="#F4E7C9" stroke-width="2.5" />

		<!-- karpet (dekorasi) -->
		<ellipse cx="750" cy="608" rx="270" ry="62" fill="#B23A2A" />
		<ellipse cx="750" cy="608" rx="240" ry="48" fill="none" stroke="#E2A72E" stroke-width="3" stroke-dasharray="14 10" />

		<!-- meja kopi · rt_meja -->
		<rect x="636" y="566" width="14" height="58" fill="#5E3A20" />
		<rect x="850" y="566" width="14" height="58" fill="#5E3A20" />
		<rect x="630" y="556" width="240" height="16" fill="#5E3A20" />
		<rect x="618" y="538" width="264" height="22" rx="6" fill="#6B4426" />

		<!-- jendela & tirai · rt_tirai -->
		<rect x="940" y="90" width="200" height="240" fill="#5E3A20" />
		<rect x="952" y="102" width="176" height="216" fill={langit} stroke-width="2.5" />
		{#if waktu === 'malam'}
			<circle cx="1080" cy="150" r="20" fill="#F4E7C9" stroke-width="2.5" />
			<circle cx="1070" cy="144" r="18" fill={langit} stroke="none" />
			<g fill="#F4E7C9" stroke="none"><circle cx="985" cy="140" r="2.5" /><circle cx="1015" cy="200" r="2" /><circle cx="1100" cy="250" r="2.5" /></g>
		{:else if waktu === 'siang'}
			<path d="M980 200 q10 -18 28 -8 q14 -14 28 2 q16 0 14 14 h-70 q-10 -2 0 -8 Z" fill="#fff" stroke-width="2" />
		{/if}
		<line x1="1040" y1="102" x2="1040" y2="318" stroke-width="5" stroke="#5E3A20" />
		<line x1="952" y1="210" x2="1128" y2="210" stroke-width="5" stroke="#5E3A20" />
		<rect x="932" y="326" width="216" height="12" rx="2" fill="#5E3A20" />
		<line x1="912" y1="72" x2="1168" y2="72" stroke-width="5" />
		<circle cx="910" cy="72" r="7" fill="#E2A72E" /><circle cx="1170" cy="72" r="7" fill="#E2A72E" />
		<path d="M916 74 h66 q-6 80 4 140 q6 60 -8 160 h-54 q8 -100 -4 -160 q-10 -60 -4 -140 Z" fill="#3E5C8A" />
		<path d="M1164 74 h-66 q6 80 -4 140 q-6 60 8 160 h54 q-8 -100 4 -160 q10 -60 4 -140 Z" fill="#3E5C8A" />
		<path d="M936 90 q-4 120 4 270 M960 90 q6 130 -4 270 M1144 90 q4 120 -4 270 M1120 90 q-6 130 4 270" fill="none" stroke="#4E6E9E" stroke-width="3" />
		<path d="M916 222 q30 10 64 -2 M1164 222 q-30 10 -64 -2" fill="none" stroke="#E2A72E" stroke-width="5" />

		<!-- kursi mustard · rt_kursi -->
		<rect x="958" y="405" width="128" height="104" rx="22" fill="#E2A72E" />
		<rect x="948" y="500" width="148" height="56" rx="12" fill="#EDB84A" />
		<rect x="934" y="470" width="42" height="104" rx="14" fill="#E2A72E" />
		<rect x="1068" y="470" width="42" height="104" rx="14" fill="#E2A72E" />
		<path d="M950 574 l-6 54 M1096 574 l6 54" stroke-width="7" />
		<path d="M950 574 l-6 54 M1096 574 l6 54" stroke="#5E3A20" stroke-width="3" />
		<path d="M980 440 q42 -14 84 0" fill="none" stroke="#C98E22" stroke-width="3" />

		<!-- tanaman pot (dekorasi) -->
		<path d="M1126 600 h56 l-8 54 h-40 Z" fill="#B23A2A" />
		<path d="M1154 600 q-40 -40 -22 -96 q24 26 22 96 M1154 600 q34 -50 20 -116 q-30 34 -20 116 M1154 600 q4 -60 -6 -88" fill="#2E6B5E" />

		<!-- 4. BENDA SEMENTARA (per kasus) -->
		{#if tambah.has('jejak_sepatu')}
			{#each JEJAK as [x, y], i (i)}
				<ellipse cx={x} cy={y} rx="13" ry="6" fill="#5A3A26" stroke="none" opacity="0.45" transform="rotate(-8 {x} {y})" />
			{/each}
		{/if}
		{#if tambah.has('bekas_toples')}
			<ellipse cx="704" cy="548" rx="24" ry="6" fill="none" stroke="#8C6A3E" stroke-width="3" />
			<circle cx="740" cy="550" r="2" fill="#E2A72E" stroke="none" /><circle cx="748" cy="546" r="1.6" fill="#E2A72E" stroke="none" />
		{/if}
		{#if tambah.has('amplop_kosong')}
			<g transform="rotate(-10 530 520)">
				<rect x="506" y="506" width="50" height="30" rx="2" fill="#F4E7C9" stroke-width="2.5" />
				<path d="M506 506 l25 -14 l25 14" fill="#E8D4A8" stroke-width="2.5" />
			</g>
		{/if}
		{#if tambah.has('tripod_kosong')}
			<path d="M760 540 L742 470 M760 540 L760 470 M760 540 L778 470" fill="none" stroke-width="3" />
			<rect x="744" y="452" width="32" height="20" rx="4" fill={T} />
			<rect x="750" y="456" width="20" height="12" rx="2" fill="#5A6270" stroke="none" />
		{/if}

		<!-- 6. SI BELANG -->
		{#if belang}
			<g transform="translate({belang.x} {belang.y}) scale({belang.s})" stroke-width="3">
				<path d="M34 -4 q30 -6 24 -30" fill="none" stroke-width="9" stroke={T} />
				<path d="M34 -4 q30 -6 24 -30" fill="none" stroke-width="5" stroke="#E8873A" />
				<ellipse cx="0" cy="-14" rx="40" ry="20" fill="#E8873A" />
				<path d="M-20 -30 q6 14 0 30 M0 -34 q6 16 0 38 M18 -32 q6 14 0 30" fill="none" stroke="#C25F1E" stroke-width="3" />
				<ellipse cx="-10" cy="-2" rx="22" ry="7" fill="#F4E7C9" stroke="none" />
				<circle cx="-36" cy="-24" r="16" fill="#F4E7C9" />
				<path d="M-48 -34 l2 -16 l10 10 Z M-30 -38 l8 -12 l4 14 Z" fill="#E8873A" />
				<path d="M-43 -24 q3 2 6 0 M-32 -24 q3 2 6 0" fill="none" stroke-width="2" />
				<path d="M-37 -18 l-1 2 l2 0 Z" fill="#B23A2A" stroke-width="1.5" />
			</g>
		{/if}
	</g>

	<!-- 5. PENCAHAYAAN -->
	{#if waktu === 'malam'}
		<rect width="1200" height="700" fill="#141A3A" opacity="0.2" />
		<rect width="1200" height="700" fill="url(#rt-cahaya)" />
	{:else if waktu === 'sore'}
		<rect width="1200" height="700" fill="#E58A3A" opacity="0.12" />
	{/if}
</svg>

<style>
	.ruang {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
