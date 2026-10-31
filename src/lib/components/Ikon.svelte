<!--
	Ikon barang ("Pakai apa") dan lokasi ("Di mana") versi sementara. Garis tebal, ujung membulat (dokumen 05).
	Barang tanpa ikon khusus memakai ikon label.
-->
<script lang="ts">
	let { id, ukuran = 40 }: { id: string; ukuran?: number } = $props();
	const T = '#1F1812';
	const M = '#E2A72E';
	const R = '#B23A2A';
	const H = '#2E6B5E';
	const B = '#3E5C8A';
	const K = '#F4E7C9';
</script>

<svg viewBox="0 0 48 48" width={ukuran} height={ukuran} aria-hidden="true">
	<g fill="none" stroke={T} stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
		{#if id === 'kantong_kresek'}
			<path d="M12 18 L36 18 L33 42 L15 42 Z" fill="#fff" />
			<path d="M16 18 C16 8 22 8 22 18 M26 18 C26 8 32 8 32 18" />
			<path d="M18 26 l2 10 M28 26 l-1 10" stroke-width="1.6" />
		{:else if id === 'sarung'}
			<path d="M10 12 L38 12 L36 40 L12 40 Z" fill={H} />
			<path d="M10 22 L38 22 M11 31 L37 31 M19 12 L18 40 M29 12 L30 40" stroke={K} stroke-width="2" />
		{:else if id === 'tas_belanja'}
			<path d="M10 18 L38 18 L35 42 L13 42 Z" fill={M} />
			<path d="M17 18 C17 8 31 8 31 18" />
			<path d="M15 28 h18 M15 34 h18" stroke={R} stroke-width="2" />
		{:else if id === 'toples_kosong'}
			<rect x="14" y="8" width="20" height="7" rx="2" fill={R} />
			<path d="M12 15 L36 15 L36 38 Q36 42 32 42 L16 42 Q12 42 12 38 Z" fill="#DDEEF0" />
			<path d="M17 21 v14" stroke="#fff" stroke-width="2.4" />
		{:else if id === 'garam' || id === 'gula' || id === 'micin'}
			<path d="M16 16 h16 l2 26 h-20 Z" fill="#fff" />
			<path d="M14 10 h20 v6 h-20 Z" fill={id === 'gula' ? M : id === 'garam' ? B : R} />
			<g fill={T} stroke="none"><circle cx="20" cy="13" r="1.2" /><circle cx="24" cy="13" r="1.2" /><circle cx="28" cy="13" r="1.2" /></g>
			<path d="M19 28 h10" stroke={id === 'gula' ? M : id === 'garam' ? B : R} stroke-width="4" />
		{:else if id === 'cabai_bubuk'}
			<path d="M14 18 h20 v22 q0 4 -4 4 h-12 q-4 0 -4 -4 Z" fill={R} />
			<rect x="14" y="10" width="20" height="8" rx="2" fill={T} />
			<path d="M20 30 q4 -8 10 -4 q-2 8 -10 4 Z" fill={M} stroke-width="1.8" />
		{:else if id === 'kecap' || id === 'cuka'}
			<path d="M20 6 h8 v8 l6 8 v20 q0 2 -2 2 h-16 q-2 0 -2 -2 v-20 l6 -8 Z" fill={id === 'kecap' ? '#3A2616' : '#EAF2E3'} />
			<rect x="19" y="4" width="10" height="5" rx="1" fill={R} stroke-width="2" />
			<rect x="16" y="26" width="16" height="10" fill={id === 'kecap' ? M : H} stroke-width="1.8" />
		{:else if id === 'kardus'}
			<path d="M8 18 L24 12 L40 18 V38 L24 44 L8 38 Z" fill="#C9A66B" />
			<path d="M8 18 L24 24 L40 18 M24 24 V44" />
			<path d="M16 15 L32 21" stroke={R} stroke-width="3" />
		{:else if id === 'keranjang_cucian'}
			<path d="M8 16 L40 16 L36 42 L12 42 Z" fill={M} />
			<path d="M10 24 h28 M11 32 h26 M18 16 l-1 26 M30 16 l1 26" stroke-width="1.8" />
		{:else if id === 'spidol'}
			<path d="M10 38 L32 16 L38 22 L16 44 Z" fill={T} />
			<path d="M32 16 L36 8 L44 16 L38 22" fill={K} />
			<path d="M10 38 L6 44 L12 42" />
		{:else if id === 'cat_air'}
			<rect x="6" y="20" width="26" height="16" rx="3" fill={K} />
			<circle cx="13" cy="28" r="3" fill={R} stroke-width="1.6" /><circle cx="21" cy="28" r="3" fill={B} stroke-width="1.6" />
			<path d="M30 30 L42 10" stroke-width="3" /><path d="M42 10 l3 -4" stroke={T} stroke-width="5" />
		{:else if id === 'selotip'}
			<path d="M20 36 H44 l-3 3 3 3 H20 Z" fill="#F2E3A8" />
			<circle cx="20" cy="24" r="14" fill="#F2E3A8" />
			<circle cx="20" cy="24" r="6" fill={K} />
			<path d="M10 16 a12 12 0 0 1 8 -5" stroke="#fff" stroke-width="2" />
		{:else if id === 'kunci_cadangan'}
			<circle cx="15" cy="17" r="8" fill={M} /><circle cx="15" cy="17" r="2.5" fill={K} />
			<path d="M21 23 L40 42 M32 34 l4 -4 M36 38 l4 -4" />
		{:else if id === 'jepit_rambut'}
			<path d="M12 8 L36 40 M20 8 L40 36" stroke-width="3" />
			<path d="M12 8 Q16 4 20 8" />
			<circle cx="37" cy="39" r="3" fill={R} />
		{:else if id === 'obeng'}
			<path d="M8 40 L18 30" stroke={R} stroke-width="7" />
			<path d="M18 30 L38 10" stroke-width="3.2" /><path d="M36 8 l4 4" stroke-width="3" />
		{:else if id === 'kartu_atm'}
			<rect x="6" y="12" width="36" height="24" rx="3" fill={B} />
			<rect x="11" y="18" width="8" height="6" rx="1" fill={M} stroke-width="1.6" />
			<path d="M11 30 h22" stroke={K} stroke-width="2" />
		{:else if id === 'bola'}
			<circle cx="24" cy="24" r="16" fill="#fff" />
			<path d="M24 16 l7 5 -3 8 h-8 l-3 -8 Z" fill={T} stroke-width="1.6" />
			<path d="M24 8 v8 M38 18 l-7 3 M33 37 l-5 -8 M15 37 l5 -8 M10 18 l7 3" stroke-width="1.6" />
		{:else if id === 'sapu'}
			<path d="M34 6 L22 28" stroke-width="3" />
			<path d="M14 26 L30 32 L24 44 L6 38 Z" fill={M} />
			<path d="M11 39 l4 -8 M16 41 l4 -8 M21 43 l3 -7" stroke-width="1.6" />
		{:else if id === 'gagang_pel'}
			<path d="M30 4 L22 34" stroke-width="3" />
			<path d="M10 34 h24 l2 8 h-28 Z" fill="#DDEEF0" />
			<path d="M13 42 v3 M19 42 v3 M25 42 v3 M31 42 v3" stroke-width="2" />
		{:else if id === 'pintu_dibanting'}
			<rect x="10" y="6" width="22" height="38" rx="1" fill="#8B5A2B" />
			<circle cx="27" cy="26" r="1.8" fill={M} />
			<path d="M36 14 l6 -3 M37 24 h7 M36 34 l6 3" stroke={R} stroke-width="2.6" />
		{:else if id === 'kolong_sofa'}
			<path d="M6 18 h36 v12 h-36 Z" fill={H} />
			<path d="M9 30 v6 M39 30 v6" />
			<path d="M14 40 h20" stroke={R} stroke-dasharray="3 4" />
			<path d="M24 34 v7 l-3 -3 M24 41 l3 -3" stroke={R} />
		{:else if id === 'rak_buku'}
			<rect x="10" y="6" width="28" height="38" rx="1" fill="#8B5A2B" />
			<path d="M10 19 h28 M10 32 h28" />
			<path d="M14 8 v11 M18 9 v10 M23 8 v11 M15 21 v11 M20 22 v10 M30 21 v11" stroke={K} stroke-width="2.4" />
		{:else if id === 'lemari_telepon'}
			<rect x="10" y="24" width="28" height="18" rx="1" fill="#8B5A2B" />
			<path d="M24 24 v18" /><circle cx="21" cy="33" r="1" fill={M} /><circle cx="27" cy="33" r="1" fill={M} />
			<path d="M14 22 Q14 14 24 14 Q34 14 34 22 Z" fill={R} />
			<path d="M16 12 h16" stroke-width="3.6" />
		{:else if id === 'balik_lukisan'}
			<rect x="8" y="10" width="32" height="26" rx="1" fill={M} />
			<rect x="12" y="14" width="24" height="18" fill="#BFE0EA" stroke-width="1.6" />
			<path d="M12 32 l8 -10 6 7 4 -4 6 7" fill={H} stroke-width="1.6" />
			<path d="M36 40 l4 4 M40 36 l4 4" stroke={R} />
		{:else if id === 'balik_tirai'}
			<path d="M6 8 h36" stroke-width="3" />
			<path d="M8 8 C10 20 6 30 10 42 h8 C16 30 20 20 18 8 Z" fill={B} />
			<path d="M40 8 C38 20 42 30 38 42 h-8 C32 30 28 20 30 8 Z" fill={B} />
		{:else if id === 'ruang_tamu'}
			<path d="M8 22 h32 v12 h-32 Z" fill={H} /><path d="M6 24 v14 M42 24 v14 M8 34 h32" />
			<rect x="12" y="16" width="10" height="7" rx="2" fill={M} stroke-width="1.8" />
		{:else if id === 'dapur'}
			<path d="M10 20 h28 v6 q0 12 -14 12 q-14 0 -14 -12 Z" fill="#9AA5A8" />
			<path d="M6 20 h36 M18 12 q2 -4 0 -6 M26 12 q2 -4 0 -6" />
		{:else if id === 'teras'}
			<path d="M16 44 h16 l-2 -12 h-12 Z" fill={R} />
			<path d="M24 32 V20 M24 24 q-10 -2 -10 -12 q10 2 10 12 M24 20 q8 -2 10 -10 q-9 1 -10 10" fill={H} stroke-width="2" />
		{:else if id === 'ruang_kerja'}
			<rect x="10" y="8" width="28" height="20" rx="2" fill={B} />
			<path d="M24 28 v6 M16 34 h16 M6 40 h36" />
		{:else if id === 'kamar_nenek'}
			<path d="M6 40 V18 M42 40 V28 M6 28 h36 M6 34 h36" />
			<rect x="9" y="22" width="12" height="6" rx="2" fill={K} />
			<path d="M21 28 h21 v6 H6" fill={R} />
		{:else if id === 'pos_jaga'}
			<path d="M8 20 L24 8 L40 20 Z" fill={R} />
			<rect x="11" y="20" width="26" height="22" fill={K} />
			<rect x="16" y="25" width="10" height="8" fill="#BFE0EA" stroke-width="1.8" />
			<path d="M30 30 v12" />
		{:else}
			<path d="M8 22 L22 8 H38 V24 L24 38 Z" fill={M} />
			<circle cx="31" cy="15" r="2.5" fill={K} />
		{/if}
	</g>
</svg>
