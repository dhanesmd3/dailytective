import adapterNode from '@sveltejs/adapter-node';
import adapterVercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Di Vercel (variabel VERCEL diisi otomatis saat build) pakai adapter Vercel, region Singapura supaya dekat
// dengan pemain Indonesia. Di tempat lain (lokal, CI, VPS) tetap adapter-node: `npm run build && npm start`.
const adapter = process.env.VERCEL ? adapterVercel({ runtime: 'nodejs22.x', regions: ['sin1'] }) : adapterNode();

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter
	}
};

export default config;
