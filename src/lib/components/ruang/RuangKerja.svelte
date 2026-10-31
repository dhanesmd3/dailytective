<!--
	Ruang Kerja versi sementara. Kanvas 1200 x 700. Posisi hotspot di data/ruangan.json harus cocok dengan koordinat di sini.
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
	const POS: Record<string, { x: number; y: number; s: number }> = {
		kursi: { x: 318, y: 540, s: 0.7 },
		lantai: { x: 700, y: 664, s: 0.9 },
		arsip: { x: 1058, y: 222, s: 0.55 }
	};
	const belang = $derived(state.belang ? POS[state.belang] : null);
	const MAP = ['#B23A2A', '#E2A72E', '#3E5C8A', '#2E6B5E', '#F4E7C9', '#B23A2A', '#3E5C8A'];
</script>

<svg viewBox="0 0 1200 700" class="ruang" aria-hidden="true">
	<g stroke={T} stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
		<rect x="-5" y="-5" width="1210" height="490" fill="#B9C7A8" stroke="none" />
		{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as i (i)}
			<line x1={i * 100} y1="0" x2={i * 100} y2="482" stroke="#AEBC9C" stroke-width="2" />
		{/each}
		<rect x="-5" y="482" width="1210" height="225" fill={W.lantai} />
		{#each [540, 600, 660] as y (y)}<line x1="0" y1={y} x2="1200" y2={y} stroke={W.garisLantai} stroke-width="2.5" />{/each}
		<line x1="0" y1="482" x2="1200" y2="482" stroke-width="4" />
		<rect x="220" y="540" width="760" height="130" rx="8" fill="#3E5C8A" />
		<rect x="240" y="552" width="720" height="106" rx="6" fill="none" stroke={W.mustard} stroke-width="3" />

		<!-- lampu (dekorasi) -->
		<line x1="640" y1="0" x2="640" y2="24" stroke-width="2.5" />
		<path d="M612 46 L622 24 L658 24 L668 46 Z" fill={W.mustard} />

		<!-- rak buku & map · rk_rak -->
		<rect x="45" y="100" width="190" height="395" fill={W.kayuSedang} />
		{#each [180, 260, 340, 420] as y (y)}<line x1="45" y1={y} x2="235" y2={y} stroke-width="3" />{/each}
		{#each [[110, 180], [190, 260], [270, 340], [350, 420]] as [y1, y2], baris (baris)}
			{#each MAP as w, i (i)}
				<rect x={56 + i * 24} y={y1 + 10 + ((i + baris) % 3) * 4} width="20" height={y2 - y1 - 10 - ((i + baris) % 3) * 4} fill={w} stroke-width="2" />
			{/each}
		{/each}
		<rect x="58" y="432" width="70" height="54" fill={W.krem} stroke-width="2.5" />
		<rect x="140" y="438" width="80" height="48" fill={W.mustard} stroke-width="2.5" />

		<!-- papan tulis kecil · rk_papan -->
		<rect x="270" y="90" width="150" height="110" fill={W.kayuTua} />
		<rect x="280" y="100" width="130" height="90" fill="#F7F7F2" stroke-width="2" />
		<path d="M292 120 h70 M292 140 h96 M292 160 h54" stroke={W.biru} stroke-width="3" />
		<rect x="300" y="194" width="40" height="8" rx="2" fill={W.merah} stroke-width="1.5" />

		<!-- sertifikat (dekorasi) -->
		<rect x="560" y="90" width="110" height="80" fill={W.krem} stroke-width="3" />
		<rect x="568" y="98" width="94" height="64" fill="none" stroke={W.mustard} stroke-width="2.5" />
		<circle cx="615" cy="148" r="8" fill={W.merah} stroke-width="2" />

		<!-- jendela · rk_jendela -->
		<rect x="760" y="70" width="180" height="210" fill={W.kayuTua} />
		<rect x="772" y="82" width="156" height="186" fill={warnaLangit(waktu)} stroke-width="2.5" />
		{#if waktu === 'malam'}
			<g fill={W.krem} stroke="none"><circle cx="800" cy="120" r="2.5" /><circle cx="880" cy="160" r="2" /><circle cx="840" cy="230" r="2.5" /></g>
		{/if}
		<line x1="850" y1="82" x2="850" y2="268" stroke={W.kayuTua} stroke-width="5" />
		<line x1="772" y1="175" x2="928" y2="175" stroke={W.kayuTua} stroke-width="5" />
		{#each [100, 125, 150] as y (y)}<line x1="772" y1={y} x2="928" y2={y} stroke="#C9B48A" stroke-width="5" />{/each}

		<!-- lemari arsip · rk_arsip -->
		<rect x="980" y="230" width="160" height="265" fill="#9AA5A8" />
		{#each [242, 326, 410] as y (y)}
			<rect x="992" y={y} width="136" height="74" rx="3" fill="#B8C2C4" stroke-width="2.5" />
			<rect x="1040" y={y + 12} width="40" height="12" fill={W.krem} stroke-width="1.5" />
			<rect x="1046" y={y + 40} width="28" height="8" rx="3" fill={T} stroke="none" />
		{/each}
		<circle cx="1030" cy="206" r="22" fill={W.biru} />
		<path d="M1014 200 q16 -8 32 4 M1018 216 q12 4 22 -2" fill="none" stroke={W.hijau} stroke-width="4" />
		<path d="M1030 228 v4 M1012 232 h36" stroke-width="3" />

		<!-- meja kerja · rk_meja (badan kiri) & rk_laci (badan kanan) -->
		<rect x="300" y="384" width="300" height="111" fill={W.kayu} />
		<rect x="316" y="398" width="268" height="84" rx="4" fill={W.kayuMuda} stroke-width="2.5" />
		<rect x="600" y="384" width="150" height="111" fill={W.kayu} />
		{#each [394, 428, 462] as y (y)}
			<rect x="612" y={y} width="126" height="28" rx="3" fill={W.kayuMuda} stroke-width="2.5" />
			<circle cx="675" cy={y + 14} r="4" fill={W.mustard} stroke-width="1.5" />
		{/each}
		<rect x="290" y="360" width="470" height="26" rx="4" fill={W.kayuTua} />
		{#if tambah.has('kertas_berserakan')}
			<path d="M330 360 l40 -6 l6 8 l-40 6 Z M520 362 l34 -10 l8 8 l-34 10 Z" fill="#fff" stroke-width="2" />
		{/if}

		<!-- printer · rk_printer -->
		<rect x="310" y="306" width="112" height="54" rx="6" fill="#DDE1E2" />
		<rect x="326" y="292" width="80" height="16" fill="#fff" stroke-width="2" />
		<line x1="322" y1="330" x2="410" y2="330" stroke-width="2.5" />
		<circle cx="404" cy="318" r="3" fill="#3BB273" stroke-width="1.5" />

		<!-- komputer · rk_komputer -->
		<rect x="450" y="228" width="150" height="104" rx="6" fill="#2F2F2F" />
		<rect x="460" y="238" width="130" height="84" fill={waktu === 'malam' ? '#3E5C8A' : '#5A6270'} stroke-width="2" />
		<path d="M470 262 h60 M470 278 h90 M470 294 h40" stroke="#BFE0EA" stroke-width="3" />
		<path d="M515 332 v18 M490 356 h70" stroke-width="5" />
		<rect x="466" y="348" width="104" height="10" rx="3" fill="#5A6270" stroke-width="2" />

		<!-- asbak · rk_asbak -->
		<ellipse cx="672" cy="352" rx="30" ry="9" fill="#9AA5A8" />
		<path d="M642 352 v6 q30 12 60 0 v-6" fill="#7E8A8D" />
		<path d="M664 346 l22 -14" stroke={W.krem} stroke-width="5" />
		<path d="M686 332 l3 -2" stroke={W.merah} stroke-width="5" />

		<!-- lampu meja (dekorasi) -->
		<path d="M720 358 h30 M735 358 v-50 l-20 -30" fill="none" stroke-width="4" />
		<path d="M700 288 l20 -26 l22 14 l-14 24 Z" fill={W.hijau} />

		<!-- tempat sampah kertas · rk_sampah -->
		<path d="M782 432 h70 l-8 82 h-54 Z" fill="#8C6A3E" />
		<path d="M796 444 l6 66 M817 444 v66 M838 444 l-6 66" stroke="#6B4F2C" stroke-width="2.5" />
		<path d="M796 432 q8 -16 18 -4 q8 -14 20 0" fill="#fff" stroke-width="2" />

		<!-- kursi putar · rk_kursi -->
		<rect x="262" y="508" width="118" height="70" rx="18" fill={W.merah} />
		<rect x="268" y="572" width="106" height="24" rx="10" fill="#8E2E21" />
		<path d="M321 596 v40 M276 652 l45 -16 l45 16" fill="none" stroke-width="6" />
		<circle cx="276" cy="656" r="6" fill={T} /><circle cx="366" cy="656" r="6" fill={T} />

		<!-- brankas kecil · rk_brankas -->
		<rect x="900" y="540" width="130" height="112" rx="6" fill="#4A4F55" />
		<rect x="912" y="552" width="106" height="88" rx="4" fill="#5A6066" stroke-width="2.5" />
		<circle cx="950" cy="596" r="18" fill="#9AA5A8" stroke-width="2.5" />
		<path d="M950 580 v8 M966 596 h-8 M950 612 v-8 M934 596 h8" stroke-width="2" />
		<rect x="990" y="584" width="10" height="26" rx="3" fill="#9AA5A8" stroke-width="2" />
		{#if tambah.has('brankas_terbuka')}
			<path d="M912 552 l-40 14 v86 l40 -12 Z" fill="#5A6066" />
			<rect x="914" y="554" width="102" height="84" fill="#2B1D14" stroke="none" />
		{/if}

		{#if belang}<Belang x={belang.x} y={belang.y} s={belang.s} />{/if}
	</g>
	<Cahaya {waktu} id="kerja" lampu={{ x: 640, y: 40 }} />
</svg>

<style>
	.ruang {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
