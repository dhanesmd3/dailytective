// Efek suara sederhana (GDD bagian 14) disintesis dengan Web Audio, tanpa file audio.
// Mati secara default; hanya berbunyi kalau pemain menyalakan suara di pengaturan.

import { pengaturan } from './pengaturan.svelte';

type Efek = 'periksa' | 'bukti' | 'kosong' | 'salah' | 'menang';

let ctx: AudioContext | null = null;

function nada(frekuensi: number, mulai: number, durasi: number, jenis: OscillatorType = 'sine', volume = 0.15) {
	if (!ctx) return;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = jenis;
	osc.frequency.value = frekuensi;
	const t = ctx.currentTime + mulai;
	gain.gain.setValueAtTime(0, t);
	gain.gain.linearRampToValueAtTime(volume, t + 0.01);
	gain.gain.exponentialRampToValueAtTime(0.0001, t + durasi);
	osc.connect(gain).connect(ctx.destination);
	osc.start(t);
	osc.stop(t + durasi + 0.02);
}

export function bunyi(efek: Efek): void {
	if (!pengaturan.suara) return;
	try {
		ctx ??= new AudioContext();
		switch (efek) {
			case 'periksa':
				nada(220, 0, 0.06, 'triangle', 0.12);
				break;
			case 'bukti':
				nada(880, 0, 0.18);
				nada(1320, 0.09, 0.3);
				break;
			case 'kosong':
				nada(180, 0, 0.18, 'sine', 0.1);
				break;
			case 'salah':
				nada(196, 0, 0.5, 'triangle', 0.16);
				nada(185, 0.02, 0.5, 'triangle', 0.1);
				break;
			case 'menang':
				[523, 659, 784, 1047].forEach((f, i) => nada(f, i * 0.11, 0.35, 'triangle', 0.14));
				break;
		}
	} catch {
		// Web Audio tidak tersedia: abaikan
	}
}
