const mem = new Map<string, unknown>();

export function clearCache() {
	mem.clear();
}

export async function getCache(key: string, init: () => Promise<unknown>) {
	if (mem.get(key) === undefined) {
		const value = await init();
		mem.set(key, value);
	}
	return mem.get(key);
}
