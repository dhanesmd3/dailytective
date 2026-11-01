import { describe, expect, it } from 'vitest';
import type { Sesi } from '../engine/types';
import { konfigRedis, PenyimpananRedis } from './store';

/** Redis palsu yang menjawab seperti REST API Upstash, cukup untuk HGET/HSET/HDEL/HVALS. */
function redisPalsu() {
	const db = new Map<string, Map<string, string>>();
	const panggilan: unknown[][] = [];
	const ambil = (async (_url: string, init: RequestInit) => {
		const [cmd, key, ...rest] = JSON.parse(String(init.body)) as string[];
		panggilan.push([cmd, key, ...rest]);
		const h = db.get(key) ?? new Map<string, string>();
		db.set(key, h);
		let result: unknown = null;
		if (cmd === 'HGET') result = h.get(String(rest[0])) ?? null;
		if (cmd === 'HSET') result = (h.set(String(rest[0]), rest[1]), 1);
		if (cmd === 'HDEL') result = Number(h.delete(String(rest[0])));
		if (cmd === 'HVALS') result = [...h.values()];
		return new Response(JSON.stringify({ result }), { status: 200 });
	}) as unknown as typeof fetch;
	return { ambil, panggilan };
}

const sesi = (kasus_id: number, pemain_id = 'p1') =>
	({ pemain_id, kasus_id, status: 'berjalan', periksa: [], tuduhan: [] }) as unknown as Sesi;

describe('PenyimpananRedis', () => {
	it('menyimpan, membaca, mendaftar, dan menghapus sesi per pemain', async () => {
		const { ambil } = redisPalsu();
		const store = new PenyimpananRedis('https://redis.contoh', 'rahasia', ambil);

		expect(await store.ambil('p1', 1)).toBeNull();
		await store.simpan(sesi(1));
		await store.simpan(sesi(2));
		await store.simpan(sesi(1, 'p2'));

		expect((await store.ambil('p1', 1))?.kasus_id).toBe(1);
		expect((await store.milikPemain('p1')).map((s) => s.kasus_id).sort()).toEqual([1, 2]);
		expect(await store.milikPemain('p2')).toHaveLength(1);

		await store.hapus('p1', 1);
		expect(await store.ambil('p1', 1)).toBeNull();
		expect(await store.milikPemain('p1')).toHaveLength(1);
	});

	it('mengirim token dan melempar galat kalau Redis menolak', async () => {
		let header = '';
		const gagal = (async (_url: string, init: RequestInit) => {
			header = new Headers(init.headers).get('authorization') ?? '';
			return new Response(JSON.stringify({ error: 'WRONGPASS' }), { status: 401 });
		}) as unknown as typeof fetch;
		const store = new PenyimpananRedis('https://redis.contoh', 'rahasia', gagal);
		await expect(store.ambil('p1', 1)).rejects.toThrow(/WRONGPASS/);
		expect(header).toBe('Bearer rahasia');
	});
});

describe('konfigRedis', () => {
	it('membaca variabel dari integrasi Vercel maupun Upstash langsung', () => {
		expect(konfigRedis({})).toBeNull();
		expect(konfigRedis({ KV_REST_API_URL: 'u' })).toBeNull();
		expect(konfigRedis({ KV_REST_API_URL: 'u', KV_REST_API_TOKEN: 't' })).toEqual({ jenis: 'rest', url: 'u', token: 't' });
		expect(konfigRedis({ UPSTASH_REDIS_REST_URL: 'u2', UPSTASH_REDIS_REST_TOKEN: 't2' })).toEqual({
			jenis: 'rest',
			url: 'u2',
			token: 't2'
		});
	});

	it('menerima awalan bebas dan tidak memakai token read-only', () => {
		expect(
			konfigRedis({
				STORAGE_KV_REST_API_URL: 'u',
				STORAGE_KV_REST_API_READ_ONLY_TOKEN: 'ro',
				STORAGE_KV_REST_API_TOKEN: 't'
			})
		).toEqual({ jenis: 'rest', url: 'u', token: 't' });
	});

	it('memakai REDIS_URL kalau hanya itu yang ada, dan REST kalau keduanya ada', () => {
		expect(konfigRedis({ REDIS_URL: 'rediss://default:x@host:6379' })).toEqual({
			jenis: 'tcp',
			url: 'rediss://default:x@host:6379'
		});
		expect(konfigRedis({ REDIS_URL: 'rediss://h', KV_URL: 'rediss://h', KV_REST_API_URL: 'u', KV_REST_API_TOKEN: 't' })?.jenis).toBe('rest');
		expect(konfigRedis({ REDIS_URL: 'https://bukan-redis' })).toBeNull();
	});
});
