<!-- Si Belang (lapisan 6). Posisi per ruangan diatur oleh komponen ruangan; skala menyesuaikan perspektif. -->
<script lang="ts">
	let { x, y, s = 1 }: { x: number; y: number; s?: number } = $props();
	const T = '#1F1812';
</script>

<g transform="translate({x} {y}) scale({s})" stroke={T} stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
	<path d="M34 -4 q30 -6 24 -30" fill="none" stroke-width="9" />
	<path d="M34 -4 q30 -6 24 -30" fill="none" stroke-width="5" stroke="#E8873A" />
	<ellipse cx="0" cy="-14" rx="40" ry="20" fill="#E8873A" />
	<path d="M-20 -30 q6 14 0 30 M0 -34 q6 16 0 38 M18 -32 q6 14 0 30" fill="none" stroke="#C25F1E" stroke-width="3" />
	<ellipse cx="-10" cy="-2" rx="22" ry="7" fill="#F4E7C9" stroke="none" />
	<circle cx="-36" cy="-24" r="16" fill="#F4E7C9" />
	<path d="M-48 -34 l2 -16 l10 10 Z M-30 -38 l8 -12 l4 14 Z" fill="#E8873A" />
	<path d="M-43 -24 q3 2 6 0 M-32 -24 q3 2 6 0" fill="none" stroke-width="2" />
	<path d="M-37 -18 l-1 2 l2 0 Z" fill="#B23A2A" stroke-width="1.5" />
</g>
