export const TABLE_PERSIST_TTL_MS = 30 * 60 * 1000;

type PersistedEnvelope<T> = {
  value: T;
  expiresAt: number;
};

export function stableStringify(obj: Record<string, unknown>) {
  const keys = Object.keys(obj).sort();
  return JSON.stringify(
    keys.reduce(
      (acc, key) => {
        acc[key] = obj[key];
        return acc;
      },
      {} as Record<string, unknown>
    )
  );
}

export function buildPersistedTableId(
  base: string,
  params?: Record<string, unknown>
) {
  if (!params || Object.keys(params).length === 0) {
    return base;
  }

  return `${base}:${stableStringify(params)}`;
}

export function readPersistedValue<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedEnvelope<T>;
    if (!parsed?.expiresAt || Date.now() > parsed.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.value ?? null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function writePersistedValue<T>(
  key: string,
  value: T,
  ttlMs = TABLE_PERSIST_TTL_MS
) {
  if (typeof window === 'undefined') return;

  const payload: PersistedEnvelope<T> = {
    value,
    expiresAt: Date.now() + ttlMs,
  };

  localStorage.setItem(key, JSON.stringify(payload));
}

export function removePersistedValue(key: string) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}
