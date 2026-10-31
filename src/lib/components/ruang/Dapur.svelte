<!--
	Dapur versi sementara. Kanvas 1200 x 700. Posisi hotspot di data/ruangan.json harus cocok dengan koordinat di sini.
	Benda yang bisa diklik digambar dengan gaya yang sama dengan dekorasi.
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
		lantai: { x: 900, y: 662, s: 0.9 },
		meja: { x: 420, y: 538, s: 0.7 },
		kulkas: { x: 128, y: 148, s: 0.55 }
	};
	const belang = $derived(state.belang ? POS[state.belang] : null);
	const UBIN = Array.from({ length: 8 }, (_, i) => i);
</script>

<svg viewBox="0 0 1200 700" class="ruang" aria-hidden="true">
	<defs>
		<pattern id="dp-ubin" width="44" height="44" patternUnits="userSpaceOnUse">
			<rect width="44" height="44" fill="#EDEBE3" />
			<path d="M0 0 H44 M0 0 V44" stroke="#C9C4B4" stroke-width="2" />
		</pattern>
		<pattern id="dp-lantai" width="80" height="80" patternUnits="userSpaceOnUse">
			<rect width="80" height="80" fill="#C9B79A" />
			<rect width="40" height="40" fill="#A88E6C" />
			<rect x="40" y="40" width="40" height="40" fill="#A88E6C" />
		</pattern>
	</defs>
	<g stroke={T} stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
		<!-- arsitektur -->
		<rect x="-5" y="-5" width="1210" height="490" fill="#D7CFA8" stroke="none" />
		<rect x="-5" y="240" width="1210" height="245" fill="url(#dp-ubin)" stroke="none" />
		<line x1="0" y1="240" x2="1200" y2="240" stroke-width="3" />
		<rect x="-5" y="482" width="1210" height="225" fill="url(#dp-lantai)" />
		<line x1="0" y1="482" x2="1200" y2="482" stroke-width="4" />

		<!-- lampu (dekorasi) -->
		<line x1="600" y1="0" x2="600" y2="26" stroke-width="2.5" />
		<path d="M574 48 L584 26 L616 26 L626 48 Z" fill={W.hijau} />

		<!-- kulkas · dp_kulkas -->
		<rect x="50" y="150" width="150" height="345" rx="12" fill="#DDE6E8" />
		<line x1="50" y1="262" x2="200" y2="262" stroke-width="3" />
		<rect x="178" y="185" width="8" height="50" rx="3" fill="#9AA5A8" stroke-width="2" />
		<rect x="178" y="285" width="8" height="80" rx="3" fill="#9AA5A8" stroke-width="2" />
		<circle cx="90" cy="200" r="8" fill={W.merah} stroke-width="2" />
		<rect x="105" y="300" width="34" height="26" fill={W.krem} stroke-width="2" transform="rotate(-6 122 313)" />
		<circle cx="80" cy="330" r="7" fill={W.mustard} stroke-width="2" />

		<!-- kalender · dp_kalender -->
		<circle cx="270" cy="66" r="3" fill={T} />
		<rect x="232" y="72" width="76" height="106" fill={W.krem} stroke-width="2.5" />
		<rect x="232" y="72" width="76" height="24" fill={W.merah} stroke-width="2.5" />
		{#each [0, 1, 2, 3] as r (r)}
			{#each [0, 1, 2, 3, 4] as c (c)}
				<rect x={240 + c * 13} y={104 + r * 17} width="9" height="11" fill="none" stroke-width="1.5" />
			{/each}
		{/each}

		<!-- gantungan kunci · dp_kunci -->
		<rect x="338" y="110" width="90" height="30" rx="4" fill={W.kayu} />
		{#each [[352, W.mustard], [374, W.merah], [396, W.biru], [416, W.hijau]] as [x, w] (x)}
			<line x1={x} y1="140" x2={x} y2="160" stroke-width="2" />
			<circle cx={x} cy="166" r="6" fill="none" stroke-width="2.5" />
			<path d="M{x} 172 v18 m0 -6 h5 m-5 6 h4" fill="none" stroke-width="2.5" />
			<rect x={Number(x) - 5} y="148" width="10" height="7" fill={String(w)} stroke-width="1.5" />
		{/each}

		<!-- rak piring · dp_rakpiring -->
		<rect x="462" y="210" width="178" height="18" fill="#9AA5A8" />
		<path d="M466 210 V130 M636 210 V130" stroke-width="3" />
		{#each [0, 1, 2, 3, 4, 5] as i (i)}
			<ellipse cx={486 + i * 18} cy="176" rx="7" ry="32" fill="#F4F2EA" stroke-width="2.5" />
		{/each}
		<path d="M598 210 v-36 h30 v36" fill={W.mustard} stroke-width="2.5" />
		<path d="M604 174 v-18 h18 v18" fill="#F4F2EA" stroke-width="2.5" />

		<!-- jendela belakang · dp_jendela -->
		<rect x="680" y="70" width="180" height="180" fill={W.kayuTua} />
		<rect x="692" y="82" width="156" height="156" fill={warnaLangit(waktu)} stroke-width="2.5" />
		{#if waktu === 'malam'}
			<circle cx="810" cy="120" r="14" fill={W.krem} stroke-width="2" />
		{/if}
		<line x1="770" y1="82" x2="770" y2="238" stroke={W.kayuTua} stroke-width="5" />
		<path d="M692 82 h156 v54 q-39 14 -78 0 q-39 14 -78 0 Z" fill={W.merah} />
		<path d="M700 96 h140" stroke={W.krem} stroke-width="2" stroke-dasharray="6 6" />

		<!-- panci gantung (dekorasi) -->
		<line x1="895" y1="100" x2="1015" y2="100" stroke-width="4" />
		<path d="M915 100 v20" stroke-width="2" /><circle cx="915" cy="150" r="28" fill="#9AA5A8" /><circle cx="915" cy="150" r="16" fill="#C9D2D4" stroke-width="2" />
		<path d="M975 100 v14" stroke-width="2" /><rect x="955" y="114" width="40" height="70" rx="18" fill={W.merah} />

		<!-- meja dapur & lemari bawah -->
		<rect x="230" y="345" width="770" height="150" fill={W.hijau} />
		{#each [[240, 290], [300, 345], [660, 730], [740, 810], [820, 890], [900, 990]] as [a, b] (a)}
			<rect x={a + 6} y="356" width={b - a - 12} height="128" rx="4" fill="none" stroke="#1F4A41" stroke-width="2.5" />
			<circle cx={b - 16} cy="420" r="3.5" fill={W.mustard} stroke-width="1.5" />
		{/each}
		<rect x="222" y="328" width="786" height="20" rx="3" fill="#E8E1CF" />

		<!-- laci sendok & pisau · dp_laci -->
		{#each [356, 402, 448] as y (y)}
			<rect x="548" y={y} width="94" height="38" rx="3" fill="#357A6B" stroke-width="2.5" />
			<rect x="583" y={y + 15} width="24" height="7" rx="3" fill={W.mustard} stroke-width="1.5" />
		{/each}

		<!-- kompor · dp_kompor -->
		<rect x="242" y="308" width="156" height="22" rx="4" fill="#3A3A3A" />
		<ellipse cx="282" cy="308" rx="22" ry="5" fill="#555" stroke-width="2" />
		<ellipse cx="358" cy="308" rx="22" ry="5" fill="#555" stroke-width="2" />
		<path d="M262 306 v-34 q0 -6 6 -6 h28 q6 0 6 6 v34 Z" fill={W.merah} />
		<path d="M258 272 h48" stroke-width="4" />

		<!-- penanak nasi · dp_magiccom -->
		<path d="M438 328 v-38 q0 -18 36 -18 q36 0 36 18 v38 Z" fill="#F4F2EA" />
		<path d="M440 290 q34 -12 68 0" fill="none" stroke-width="2.5" />
		<circle cx="474" cy="312" r="5" fill={W.merah} stroke-width="1.5" />
		<path d="M452 302 l6 -4 6 4 M490 302 l6 -4 6 4" fill="none" stroke={W.hijau} stroke-width="2" />

		<!-- wastafel · dp_wastafel -->
		<rect x="690" y="330" width="160" height="16" rx="3" fill="#B8C2C4" />
		<path d="M770 330 v-34 q0 -16 18 -16 h14 v10" fill="none" stroke-width="6" />
		<path d="M770 330 v-34 q0 -16 18 -16 h14 v10" fill="none" stroke="#C9D2D4" stroke-width="2.5" />
		<path d="M752 318 h12 M776 318 h12" stroke-width="3" />

		<!-- toples kerupuk · dp_toples -->
		<rect x="906" y="248" width="64" height="14" rx="3" fill={W.merah} />
		<path d="M902 262 h72 v58 q0 10 -10 10 h-52 q-10 0 -10 -10 Z" fill="#E4EEF0" />
		<g fill="#F2D27A" stroke-width="1.5">
			<circle cx="920" cy="300" r="10" /><circle cx="944" cy="296" r="11" /><circle cx="958" cy="312" r="9" /><circle cx="928" cy="318" r="8" />
		</g>
		<path d="M912 270 v40" stroke="#fff" stroke-width="3" />

		<!-- tempat sampah · dp_sampah -->
		<path d="M1028 432 h68 l-6 86 h-56 Z" fill={W.biru} />
		<rect x="1022" y="420" width="80" height="14" rx="4" fill="#2D466B" />
		<path d="M1046 448 v54 M1062 448 v54 M1078 448 v54" stroke="#2D466B" stroke-width="2.5" />

		<!-- kursi makan (dekorasi) -->
		<path d="M258 500 v160 M300 500 v160 M258 560 h42 M258 500 h42" fill="none" stroke-width="6" stroke={W.kayuTua} />
		<path d="M780 500 v160 M822 500 v160 M780 560 h42 M780 500 h42" fill="none" stroke-width="6" stroke={W.kayuTua} />

		<!-- meja makan · dp_meja -->
		<rect x="352" y="562" width="14" height="88" fill={W.kayuTua} />
		<rect x="726" y="562" width="14" height="88" fill={W.kayuTua} />
		<rect x="330" y="540" width="430" height="26" rx="5" fill={W.kayu} />
		<path d="M336 566 l20 18 l20 -18 l20 18 l20 -18 l20 18 l20 -18" fill="none" stroke={W.krem} stroke-width="2.5" />
		{#if tambah.has('tudung_terbuka')}
			<path d="M600 540 q-6 -40 40 -46 q40 6 36 46" fill={W.mustard} transform="rotate(-24 640 520)" />
			<ellipse cx="545" cy="536" rx="38" ry="7" fill="#F4F2EA" stroke-width="2.5" />
		{:else}
			<path d="M500 540 q0 -44 50 -44 q50 0 50 44 Z" fill={W.mustard} />
			<path d="M515 520 q35 -14 70 0" fill="none" stroke={W.kayuTua} stroke-width="2" />
			<circle cx="550" cy="494" r="5" fill={W.merah} stroke-width="2" />
		{/if}
		<path d="M420 540 v-14 h28 v14" fill="#F4F2EA" stroke-width="2.5" />

		{#if tambah.has('jejak_lumpur')}
			{#each [[1150, 650], [1090, 620], [1030, 640], [970, 610], [910, 630]] as [x, y], i (i)}
				<ellipse cx={x} cy={y} rx="16" ry="7" fill="#5A3A26" stroke="none" opacity="0.5" />
			{/each}
		{/if}

		{#if belang}<Belang x={belang.x} y={belang.y} s={belang.s} />{/if}
	</g>
	<Cahaya {waktu} id="dapur" />
</svg>

<style>
	.ruang {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
