<!--
	Potret sementara (fase 1). Dirakit dari lapisan seperti sistem modular di dokumen 05 bagian 5:
	latar → badan → kepala → rambut/penutup kepala → wajah (dapat diganti per ekspresi) → kacamata.
	Ciri yang dipakai sebagai clue (kacamata, rambut) wajib terlihat jelas.
-->
<script lang="ts">
	type Ekspresi = 'normal' | 'gugup' | 'tertangkap';
	let {
		id,
		ekspresi = 'normal',
		ukuran = 64,
		label
	}: { id: string; ekspresi?: Ekspresi; ukuran?: number; label?: string } = $props();

	const uid = $props.id();

	const WARNA: Record<string, { kulit: string; baju: string; latar: string }> = {
		benny: { kulit: '#E3A877', baju: '#7A4A22', latar: '#E8C98F' },
		lia: { kulit: '#F0C29A', baju: '#8C2F5B', latar: '#EBC6B4' },
		hendra: { kulit: '#E8B88E', baju: '#2E6B5E', latar: '#C9D6C0' },
		dimas: { kulit: '#DDA67A', baju: '#5A6270', latar: '#C3C8D6' },
		sekar: { kulit: '#F2C9A0', baju: '#9A84B0', latar: '#DCCFE6' },
		sri: { kulit: '#C98E5F', baju: '#9C6B4E', latar: '#E6CFA6' },
		tono: { kulit: '#B97C4E', baju: '#33476B', latar: '#BFCADB' },
		joko: { kulit: '#8F5A36', baju: '#6E7F4E', latar: '#D3D9AE' },
		wati: { kulit: '#EDBE96', baju: '#3E5C8A', latar: '#F0C8CF' },
		raka: { kulit: '#E6B48A', baju: '#E2A72E', latar: '#F3DE9A' },
		nenek: { kulit: '#E2B48F', baju: '#8C5A3C', latar: '#EAD7B5' }
	};
	const w = $derived(WARNA[id] ?? { kulit: '#E0B08A', baju: '#6B5643', latar: '#E8D4A8' });
	const T = '#1F1812';
	const RAMBUT = '#2A1A12';
	const kacamata = $derived(['hendra', 'sekar', 'wati'].includes(id));
	const mataY = $derived(id === 'sekar' ? 52 : 50);
</script>

<svg
	viewBox="0 0 100 100"
	width={ukuran}
	height={ukuran}
	role={label ? 'img' : undefined}
	aria-label={label}
	aria-hidden={label ? undefined : 'true'}
	class="potret"
>
	<defs>
		<clipPath id="klip-{uid}"><circle cx="50" cy="50" r="47" /></clipPath>
	</defs>
	<circle cx="50" cy="50" r="47" fill={w.latar} />
	<g clip-path="url(#klip-{uid})" stroke={T} stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
		<!-- lapisan belakang kepala -->
		{#if id === 'dimas'}
			<ellipse cx="77" cy="44" rx="6" ry="13" transform="rotate(28 77 44)" fill={RAMBUT} />
		{:else if id === 'nenek'}
			<circle cx="50" cy="23" r="10" fill="#EEE8DC" />
		{/if}

		<!-- badan -->
		{#if id === 'sekar'}
			<path d="M10 102 C12 82 28 74 50 74 C72 74 88 82 90 102 Z" fill={w.baju} />
		{:else}
			<path d="M12 102 C14 82 30 76 50 76 C70 76 86 82 88 102 Z" fill={w.baju} />
		{/if}
		{#if id === 'benny'}
			<g fill="#E2A72E" stroke="none">
				<circle cx="30" cy="88" r="2.2" /><circle cx="40" cy="94" r="2.2" /><circle cx="60" cy="94" r="2.2" /><circle cx="70" cy="88" r="2.2" /><circle cx="50" cy="88" r="2.2" />
			</g>
		{:else if id === 'hendra'}
			<path d="M42 77 L50 92 L58 77" fill="#F4E7C9" />
			<line x1="67" y1="80" x2="67" y2="90" stroke="#3E5C8A" stroke-width="3" />
		{:else if id === 'dimas'}
			<path d="M30 81 C30 69 70 69 70 81" fill="none" stroke-width="4" />
			<rect x="24" y="75" width="8" height="12" rx="3" fill="#B23A2A" />
			<rect x="68" y="75" width="8" height="12" rx="3" fill="#B23A2A" />
			<line x1="45" y1="82" x2="44" y2="94" stroke-width="2" /><line x1="55" y1="82" x2="56" y2="94" stroke-width="2" />
		{:else if id === 'sri'}
			<path d="M38 77 L42 102 M62 77 L58 102" stroke="#F4E7C9" stroke-width="4" />
			<rect x="60" y="74" width="20" height="10" rx="2" fill="#EDE3CC" transform="rotate(14 70 79)" />
			<line x1="64" y1="77" x2="63" y2="83" stroke="#B23A2A" stroke-width="2" />
		{:else if id === 'tono'}
			<rect x="30" y="86" width="9" height="6" rx="1" fill="#E2A72E" />
			<line x1="50" y1="77" x2="50" y2="102" stroke-width="2" />
		{:else if id === 'joko'}
			<path d="M30 78 C40 86 60 86 70 78 L72 85 C60 93 40 93 28 85 Z" fill="#EDE3CC" />
		{:else if id === 'wati'}
			<g stroke="none"><circle cx="30" cy="90" r="3" fill="#F4E7C9" /><circle cx="46" cy="95" r="3" fill="#F4E7C9" /><circle cx="64" cy="89" r="3" fill="#F4E7C9" /><circle cx="76" cy="97" r="3" fill="#F4E7C9" /></g>
			<g stroke="none" fill="#E2A72E"><circle cx="30" cy="90" r="1.2" /><circle cx="46" cy="95" r="1.2" /><circle cx="64" cy="89" r="1.2" /><circle cx="76" cy="97" r="1.2" /></g>
		{:else if id === 'raka'}
			<path d="M28 90 l5 -6 l5 6 M58 92 l5 -6 l5 6" fill="none" stroke-width="2" />
			<path d="M42 77 L50 86 L58 77" fill="#F4E7C9" />
		{:else if id === 'nenek'}
			<circle cx="50" cy="86" r="3.5" fill="#E2A72E" />
			<path d="M32 62 C34 80 42 88 46 90 M68 62 C66 80 58 88 54 90" fill="none" stroke-width="1" />
			<circle cx="45" cy="91" r="3.6" fill="none" stroke-width="1.8" /><circle cx="55" cy="91" r="3.6" fill="none" stroke-width="1.8" />
		{/if}

		<!-- leher & kepala -->
		<rect x="43" y="66" width="14" height="13" fill={w.kulit} />
		{#if id === 'sekar'}
			<path d="M21 58 C18 24 82 24 79 58 C79 74 70 84 50 86 C30 84 21 74 21 58 Z" fill="#C9B3D9" />
			<ellipse cx="50" cy="55" rx="17" ry="20" fill={w.kulit} />
			<path d="M33 46 C38 36 62 36 67 46" fill="none" stroke="#B49BC6" stroke-width="2" />
		{:else}
			<ellipse cx="28" cy="53" rx="4.5" ry="6.5" fill={w.kulit} />
			<ellipse cx="72" cy="53" rx="4.5" ry="6.5" fill={w.kulit} />
			<ellipse cx="50" cy="50" rx={id === 'benny' ? 24 : 22} ry="25" fill={w.kulit} />
		{/if}

		<!-- rambut / penutup kepala -->
		{#if id === 'benny'}
			<ellipse cx="40" cy="33" rx="7" ry="3" fill="#FFF8E8" stroke="none" opacity="0.6" transform="rotate(-24 40 33)" />
			<path d="M26 50 q1 -6 4 -8 M74 50 q-1 -6 -4 -8" fill="none" stroke={RAMBUT} stroke-width="3" />
		{:else if id === 'lia'}
			<ellipse cx="50" cy="17" rx="12" ry="12" fill={RAMBUT} />
			<rect x="43" y="26" width="14" height="4" rx="1" fill="#E2A72E" />
			<path d="M28 48 C27 26 73 26 72 48 C67 35 33 35 28 48 Z" fill={RAMBUT} />
			<circle cx="27" cy="63" r="3.5" fill="#E2A72E" /><circle cx="73" cy="63" r="3.5" fill="#E2A72E" />
		{:else if id === 'hendra'}
			<g fill="#BDB6AA" stroke-width="2">
				<circle cx="30" cy="42" r="6" /><circle cx="33" cy="33" r="6" /><circle cx="40" cy="27" r="6" /><circle cx="49" cy="25" r="6" />
				<circle cx="58" cy="26" r="6" /><circle cx="66" cy="31" r="6" /><circle cx="70" cy="40" r="6" />
			</g>
		{:else if id === 'dimas'}
			<path d="M27 54 C22 22 78 22 73 54 C72 44 66 36 56 35 C50 40 40 40 34 36 C30 40 28 46 27 54 Z" fill={RAMBUT} />
		{:else if id === 'sri'}
			<circle cx="68" cy="28" r="7" fill={RAMBUT} />
			<path d="M28 46 C28 25 72 25 72 46 C66 35 34 35 28 46 Z" fill={RAMBUT} />
			<line x1="50" y1="27" x2="50" y2="36" stroke="#5A3A26" stroke-width="1.5" />
		{:else if id === 'tono'}
			<rect x="26" y="40" width="5" height="10" fill={RAMBUT} stroke="none" /><rect x="69" y="40" width="5" height="10" fill={RAMBUT} stroke="none" />
			<path d="M27 40 C27 18 73 18 73 40 Z" fill="#2C3E5C" />
			<path d="M23 40 L77 40 L81 46 L19 46 Z" fill="#1F2A40" />
			<circle cx="50" cy="30" r="4.5" fill="#E2A72E" />
		{:else if id === 'joko'}
			<path d="M29 46 q2 -5 5 -6 M71 46 q-2 -5 -5 -6" fill="none" stroke="#C9C2B5" stroke-width="3" />
			<path d="M6 40 L50 10 L94 40 C72 47 28 47 6 40 Z" fill="#D9B26A" />
			<path d="M50 10 L30 44 M50 10 L50 46 M50 10 L70 44" fill="none" stroke="#A88545" stroke-width="1.5" />
		{:else if id === 'wati'}
			<path d="M28 47 C27 27 73 27 72 47 C67 37 33 37 28 47 Z" fill="#5A3A26" />
			<g fill="#E89BB0">
				<rect x="30" y="22" width="11" height="14" rx="4" /><rect x="44.5" y="17" width="11" height="14" rx="4" /><rect x="59" y="22" width="11" height="14" rx="4" />
			</g>
		{:else if id === 'raka'}
			<path d="M27 47 C24 20 76 18 74 44 C66 33 52 29 41 33 C35 35 30 40 27 47 Z" fill={T} />
			<path d="M44 26 C52 24 62 26 68 31" fill="none" stroke="#FFF8E8" stroke-width="2" opacity="0.6" />
		{:else if id === 'nenek'}
			<path d="M28 47 C27 26 73 26 72 47 C67 36 33 36 28 47 Z" fill="#EEE8DC" />
			<path d="M40 62 q-3 2 -4 -1 M60 62 q3 2 4 -1" fill="none" stroke-width="1.2" />
		{/if}

		<!-- wajah -->
		{#if ekspresi === 'tertangkap'}
			<path d="M37 {mataY - 9} q5 -4 9 -1 M54 {mataY - 10} q5 -3 9 1" fill="none" stroke-width="2.2" />
			<circle cx="42" cy={mataY} r="3.4" fill="#fff" stroke-width="1.5" /><circle cx="58" cy={mataY} r="3.4" fill="#fff" stroke-width="1.5" />
			<circle cx="42" cy={mataY} r="1.5" fill={T} stroke="none" /><circle cx="58" cy={mataY} r="1.5" fill={T} stroke="none" />
		{:else}
			<path d="M37 {mataY - 6} q5 -3 9 0 M54 {mataY - 6} q5 -3 9 0" fill="none" stroke-width={id === 'benny' ? 3.4 : 2.2} />
			{#if ekspresi === 'gugup'}
				<circle cx="43.5" cy={mataY} r="2.5" fill={T} stroke="none" /><circle cx="59.5" cy={mataY} r="2.5" fill={T} stroke="none" />
			{:else}
				<circle cx="42" cy={mataY} r="2.6" fill={T} stroke="none" /><circle cx="58" cy={mataY} r="2.6" fill={T} stroke="none" />
			{/if}
		{/if}
		{#if id === 'dimas'}
			<path d="M38 55 q4 2 8 0 M54 55 q4 2 8 0" fill="none" stroke="#9A6A4A" stroke-width="1.4" />
		{/if}
		<path d="M50 {mataY + 2} q-3 6 0 7" fill="none" stroke-width="2" />

		{#if id === 'benny'}
			<path
				d="M37 60 C41 54 48 56 50 58 C52 56 59 54 63 60 C65 64 60 64 58 62 C55 61 52 62 50 63 C48 62 45 61 42 62 C40 64 35 64 37 60 Z"
				fill={RAMBUT}
			/>
		{/if}

		{#if ekspresi === 'tertangkap'}
			<ellipse cx="50" cy="67" rx="4.5" ry="5" fill={id === 'lia' ? '#B23A2A' : T} />
		{:else if ekspresi === 'gugup'}
			<path d="M43 66 q3 -2 4.5 0 q3 2 4.5 0 q3 -2 4.5 0" fill="none" stroke-width="2" />
			<path d="M73 30 q4 6 0 8 q-4 -2 0 -8 Z" fill="#9FD3F0" stroke-width="1.5" />
		{:else if id === 'lia'}
			<ellipse cx="50" cy="65" rx="5.5" ry="2.8" fill="#B23A2A" stroke-width="1.5" />
		{:else if id === 'tono'}
			<line x1="44" y1="65" x2="56" y2="65" stroke-width="2.2" />
		{:else if id === 'dimas'}
			<path d="M44 65 q6 3 12 -2" fill="none" stroke-width="2.2" />
		{:else if id === 'raka'}
			<path d="M42 63 q8 7 16 0 Z" fill="#fff" stroke-width="2" />
		{:else}
			<path d="M44 {id === 'benny' ? 67 : 64} q6 4 12 0" fill="none" stroke-width="2.2" />
		{/if}

		<!-- kacamata -->
		{#if id === 'hendra'}
			<circle cx="42" cy="50" r="7.5" fill="#fff" fill-opacity="0.2" stroke-width="3.2" />
			<circle cx="58" cy="50" r="7.5" fill="#fff" fill-opacity="0.2" stroke-width="3.2" />
			<line x1="49.5" y1="50" x2="50.5" y2="50" stroke-width="3" />
		{:else if id === 'sekar'}
			<circle cx="42" cy="52" r="6.2" fill="none" stroke-width="2" />
			<circle cx="58" cy="52" r="6.2" fill="none" stroke-width="2" />
			<line x1="48.2" y1="52" x2="51.8" y2="52" stroke-width="2" />
		{:else if id === 'wati'}
			<path d="M39 57 a4.5 4 0 0 0 9 0 Z M52 57 a4.5 4 0 0 0 9 0 Z" fill="#fff" fill-opacity="0.3" stroke-width="2" />
			<line x1="48" y1="57" x2="52" y2="57" stroke-width="2" />
		{/if}

		<!-- benda di depan -->
		{#if id === 'sekar'}
			<rect x="10" y="80" width="24" height="17" rx="2" fill="#B23A2A" transform="rotate(-12 22 88)" />
			<line x1="13" y1="84" x2="31" y2="80" stroke="#F4E7C9" stroke-width="1.5" />
		{:else if id === 'wati'}
			<path d="M60 92 L78 72 A26 26 0 0 1 90 90 Z" fill="#B23A2A" />
			<path d="M60 92 L83 77 M60 92 L87 84" stroke="#F4E7C9" stroke-width="1.2" />
		{:else if id === 'raka'}
			<rect x="70" y="68" width="13" height="22" rx="3" fill={T} />
			<rect x="72.5" y="71" width="8" height="15" rx="1" fill="#3E5C8A" stroke="none" />
		{/if}
	</g>
	<circle cx="50" cy="50" r="47" fill="none" stroke={T} stroke-width="3" />
</svg>

<style>
	.potret {
		display: block;
		flex-shrink: 0;
	}
</style>
