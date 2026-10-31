<!--
	Kamar Nenek versi sementara. Kanvas 1200 x 700. Posisi hotspot di data/ruangan.json harus cocok dengan koordinat di sini.
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
		ranjang: { x: 930, y: 372, s: 0.8 },
		lantai: { x: 360, y: 660, s: 0.9 },
		lemari: { x: 140, y: 102, s: 0.55 }
	};
	const belang = $derived(state.belang ? POS[state.belang] : null);
</script>

<svg viewBox="0 0 1200 700" class="ruang" aria-hidden="true">
	<defs>
		<pattern id="kn-dinding" width="60" height="60" patternUnits="userSpaceOnUse">
			<rect width="60" height="60" fill="#E6D2B5" />
			<circle cx="15" cy="15" r="4" fill="#D9B8A0" /><circle cx="45" cy="45" r="4" fill="#D9B8A0" />
			<path d="M15 9 v-4 M45 39 v-4" stroke="#B9967C" stroke-width="2" />
		</pattern>
	</defs>
	<g stroke={T} stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
		<rect x="-5" y="-5" width="1210" height="490" fill="url(#kn-dinding)" stroke="none" />
		<rect x="-5" y="460" width="1210" height="25" fill={W.kayuMuda} />
		<rect x="-5" y="482" width="1210" height="225" fill={W.lantai} />
		{#each [540, 600, 660] as y (y)}<line x1="0" y1={y} x2="1200" y2={y} stroke={W.garisLantai} stroke-width="2.5" />{/each}
		<line x1="0" y1="482" x2="1200" y2="482" stroke-width="4" />
		<ellipse cx="560" cy="610" rx="240" ry="50" fill="#8C2F5B" />
		<ellipse cx="560" cy="610" rx="210" ry="38" fill="none" stroke={W.mustard} stroke-width="3" stroke-dasharray="10 8" />

		<!-- lemari pakaian · kn_lemari -->
		<rect x="45" y="110" width="190" height="385" fill={W.kayuMuda} />
		<rect x="45" y="96" width="190" height="18" fill={W.kayuTua} />
		<rect x="56" y="124" width="80" height="356" rx="3" fill={W.kayu} stroke-width="2.5" />
		<rect x="144" y="124" width="80" height="356" rx="3" fill={W.kayu} stroke-width="2.5" />
		<rect x="70" y="150" width="52" height="150" rx="26" fill="#BFE0EA" stroke-width="2.5" />
		<circle cx="132" cy="300" r="5" fill={W.mustard} stroke-width="2" /><circle cx="148" cy="300" r="5" fill={W.mustard} stroke-width="2" />

		<!-- cermin rias (dekorasi) -->
		<ellipse cx="325" cy="210" rx="56" ry="78" fill={W.kayuTua} />
		<ellipse cx="325" cy="210" rx="44" ry="66" fill="#CFE6EE" stroke-width="2.5" />
		<path d="M300 170 q10 -20 26 -24" fill="none" stroke="#fff" stroke-width="4" />

		<!-- meja rias · kn_rias -->
		<rect x="255" y="335" width="145" height="160" fill={W.kayu} />
		<rect x="248" y="324" width="159" height="14" rx="3" fill={W.kayuTua} />
		<rect x="268" y="372" width="119" height="42" rx="3" fill={W.kayuMuda} stroke-width="2.5" />
		<rect x="268" y="424" width="119" height="42" rx="3" fill={W.kayuMuda} stroke-width="2.5" />
		<circle cx="327" cy="393" r="4" fill={W.mustard} stroke-width="1.5" /><circle cx="327" cy="445" r="4" fill={W.mustard} stroke-width="1.5" />
		<!-- botol (dekorasi) -->
		<rect x="378" y="296" width="14" height="28" rx="3" fill={W.merah} stroke-width="2" />

		<!-- kotak perhiasan · kn_kotak -->
		{#if tambah.has('kotak_terbuka')}
			<rect x="290" y="300" width="80" height="24" fill="#8C2F5B" />
			<path d="M290 300 l8 -26 h80 l-8 26" fill="#A8457A" />
			<rect x="300" y="304" width="60" height="10" fill="#2B1D14" stroke-width="1.5" />
		{:else}
			<rect x="290" y="296" width="80" height="28" fill="#8C2F5B" />
			<path d="M286 296 q44 -24 88 0 Z" fill="#A8457A" />
			<circle cx="330" cy="304" r="4" fill={W.mustard} stroke-width="1.5" />
		{/if}

		<!-- jendela · kn_jendela -->
		<rect x="420" y="70" width="180" height="210" fill={W.kayuTua} />
		<rect x="432" y="82" width="156" height="186" fill={warnaLangit(waktu)} stroke-width="2.5" />
		{#if waktu === 'malam'}
			<circle cx="540" cy="130" r="16" fill={W.krem} stroke-width="2" /><circle cx="532" cy="125" r="14" fill={warnaLangit(waktu)} stroke="none" />
		{/if}
		<line x1="510" y1="82" x2="510" y2="268" stroke={W.kayuTua} stroke-width="5" />
		<path d="M424 66 h70 q-10 110 0 216 h-56 q-20 -110 -14 -216 Z" fill="#F4E7C9" />
		<path d="M596 66 h-70 q10 110 0 216 h56 q20 -110 14 -216 Z" fill="#F4E7C9" />
		<path d="M440 120 q8 70 0 140 M580 120 q-8 70 0 140" fill="none" stroke="#D9C6A0" stroke-width="2.5" />

		<!-- rak sajadah & Al-Qur'an · kn_rakdoa -->
		<rect x="432" y="360" width="156" height="135" fill={W.kayu} />
		<line x1="432" y1="428" x2="588" y2="428" stroke-width="3" />
		<rect x="446" y="392" width="62" height="34" rx="3" fill={W.hijau} stroke-width="2.5" />
		<path d="M446 404 h62 M446 414 h62" stroke={W.mustard} stroke-width="2" />
		<path d="M526 426 l18 -30 l18 30 Z" fill={W.kayuTua} stroke-width="2.5" />
		<rect x="530" y="384" width="28" height="20" fill={W.hijau} stroke-width="2" />
		<rect x="446" y="440" width="62" height="44" rx="3" fill="#F4E7C9" stroke-width="2.5" />
		<rect x="520" y="446" width="56" height="38" rx="3" fill={W.merah} stroke-width="2.5" />

		<!-- tongkat Nenek (dekorasi) -->
		<path d="M612 300 q-12 0 -12 14 M612 300 l-6 194" fill="none" stroke={W.kayuTua} stroke-width="7" />

		<!-- foto Kakek · kn_foto -->
		<rect x="790" y="80" width="100" height="110" fill={W.mustard} stroke-width="4" />
		<rect x="802" y="92" width="76" height="86" fill="#D9C6A0" stroke-width="2" />
		<circle cx="840" cy="128" r="18" fill="#E2B48F" stroke-width="2" />
		<path d="M822 120 q18 -22 36 0" fill="#3A3A3A" stroke-width="2" />
		<path d="M828 134 h8 M844 134 h8" stroke-width="2" />
		<path d="M814 178 q26 -30 52 0" fill="#3A3A3A" stroke-width="2" />
		<path d="M832 140 q8 5 16 0" fill="none" stroke-width="2.5" />

		<!-- ranjang · kn_ranjang -->
		<rect x="630" y="230" width="430" height="190" rx="14" fill={W.kayuTua} />
		<path d="M650 240 q195 -44 390 0" fill="none" stroke={W.mustard} stroke-width="3" />
		<rect x="636" y="380" width="418" height="70" rx="8" fill="#F4F2EA" />
		<path d="M640 410 h410" stroke="#D9D2C2" stroke-width="2.5" />
		<rect x="636" y="410" width="418" height="44" fill="#3E5C8A" />
		<path d="M660 420 l14 14 l14 -14 l14 14 l14 -14 M960 420 l14 14 l14 -14 l14 14 l14 -14" fill="none" stroke={W.mustard} stroke-width="2.5" />
		<rect x="666" y="336" width="150" height="56" rx="24" fill="#F4F2EA" />
		<rect x="874" y="336" width="150" height="56" rx="24" fill="#F4F2EA" />
		<rect x="630" y="450" width="430" height="20" fill={W.kayuTua} />
		<!-- kolong ranjang · kn_kolong -->
		<rect x="640" y="470" width="410" height="54" fill="#3A2616" stroke="none" opacity="0.85" />
		<rect x="636" y="470" width="16" height="56" fill={W.kayuTua} stroke-width="2.5" />
		<rect x="1038" y="470" width="16" height="56" fill={W.kayuTua} stroke-width="2.5" />

		<!-- kotak obat · kn_obat -->
		<rect x="1080" y="204" width="76" height="74" rx="4" fill="#F4F2EA" />
		<rect x="1080" y="204" width="76" height="14" fill="#D9D2C2" stroke-width="2.5" />
		<path d="M1118 230 v34 M1101 247 h34" stroke={W.merah} stroke-width="9" stroke-linecap="butt" />
		<circle cx="1148" cy="250" r="3" fill={T} stroke="none" />

		<!-- meja kecil & jam weker · kn_weker -->
		<rect x="1076" y="390" width="84" height="105" fill={W.kayu} />
		<rect x="1088" y="410" width="60" height="30" rx="3" fill={W.kayuMuda} stroke-width="2.5" />
		<circle cx="1118" cy="356" r="24" fill={W.merah} />
		<circle cx="1118" cy="356" r="17" fill={W.krem} stroke-width="2" />
		<path d="M1118 356 v-11 M1118 356 l7 4" stroke-width="2.5" />
		<circle cx="1100" cy="334" r="7" fill={W.mustard} stroke-width="2" /><circle cx="1136" cy="334" r="7" fill={W.mustard} stroke-width="2" />
		<path d="M1102 378 l-5 10 M1134 378 l5 10" stroke-width="3" />

		<!-- kipas angin · kn_kipas -->
		<path d="M128 668 h60 M158 668 v-96" stroke-width="6" />
		<circle cx="158" cy="540" r="44" fill="#BFE0EA" stroke-width="3" />
		<path d="M158 540 q-28 -30 -10 -38 q14 10 10 38 q30 -22 36 -4 q-14 14 -36 4 q4 36 -14 38 q-8 -16 14 -38" fill={W.biru} stroke-width="2" />
		<circle cx="158" cy="540" r="7" fill={T} />
		<path d="M118 528 h80 M126 512 h64 M126 568 h64" stroke="#8FB7C4" stroke-width="1.5" />

		<!-- sandal · kn_sandal -->
		<g transform="rotate(-8 740 590)">
			<rect x="702" y="572" width="34" height="56" rx="16" fill={W.hijau} />
			<path d="M706 590 q13 -10 26 0" fill="none" stroke={W.mustard} stroke-width="5" />
		</g>
		<g transform="rotate(10 790 590)">
			<rect x="770" y="572" width="34" height="56" rx="16" fill={W.hijau} />
			<path d="M774 590 q13 -10 26 0" fill="none" stroke={W.mustard} stroke-width="5" />
		</g>

		{#if belang}<Belang x={belang.x} y={belang.y} s={belang.s} />{/if}
	</g>
	<Cahaya {waktu} id="kamar" lampu={{ x: 840, y: 40 }} />
</svg>

<style>
	.ruang {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
