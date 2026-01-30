import Constants from 'expo-constants';

const extra = (Constants.manifest && Constants.manifest.extra) || (Constants as any).expoConfig?.extra || {};
export const BASE_URL = extra.BASE_URL || 'http://192.168.1.100:3000';

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const res = await fetch(url, { ...opts });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json().catch(() => null);
}
