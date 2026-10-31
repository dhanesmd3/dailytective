/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// Service worker PWA (dokumen 06 bagian 8):
// - aset statis (JS, CSS, ikon) di-cache saat install;
// - /api/* SELALU lewat jaringan, tidak pernah di-cache (isi benda dan jawaban harus dari server);
// - halaman: jaringan dulu, salinan terakhir sebagai cadangan, lalu pesan offline.

import { build, files, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;
const CACHE = `dailytective-${version}`;
const ASET = [...build, ...files];

sw.addEventListener('install', (event) => {
	event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASET)).then(() => sw.skipWaiting()));
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
			.then(() => sw.clients.claim())
	);
});

const HALAMAN_OFFLINE = `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline · Dailytective</title></head>
<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#2B1D14;color:#F4E7C9;font-family:system-ui,sans-serif;text-align:center;padding:16px">
<div><h1 style="font-family:Georgia,serif">Butuh koneksi untuk menyelidiki</h1><p>Sambungkan lagi ke internet, lalu muat ulang halaman ini.</p>
<button onclick="location.reload()" style="font:inherit;padding:10px 18px;border-radius:8px;border:2px solid #1F1812;background:#E2A72E;cursor:pointer">Coba lagi</button></div></body></html>`;

sw.addEventListener('fetch', (event) => {
	const req = event.request;
	if (req.method !== 'GET') return;
	const url = new URL(req.url);
	if (url.origin !== sw.location.origin) return;
	if (url.pathname.startsWith('/api/')) return;

	if (ASET.includes(url.pathname)) {
		event.respondWith(caches.match(url.pathname).then((r) => r ?? fetch(req)));
		return;
	}

	if (req.mode === 'navigate') {
		event.respondWith(
			fetch(req)
				.then((res) => {
					if (res.ok) {
						const salinan = res.clone();
						caches.open(CACHE).then((c) => c.put(req, salinan));
					}
					return res;
				})
				.catch(async () => {
					const lama = await caches.match(req);
					return lama ?? new Response(HALAMAN_OFFLINE, { headers: { 'content-type': 'text/html; charset=utf-8' } });
				})
		);
	}
});
