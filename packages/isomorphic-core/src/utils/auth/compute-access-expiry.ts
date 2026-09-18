export default function computeAccessExpiry(raw: unknown): number {
  const nowMs = Date.now();
  const nowSec = Math.floor(nowMs / 1000);
  if (typeof raw !== "number") return nowMs + 15 * 60 * 1000;
  if (raw > nowSec + 60 && raw < 9999999999) return raw * 1000; // epoch sec
  if (raw > 30 && raw <= 86400) return nowMs + raw * 1000; // ttl sec
  if (raw > 9999999999) return raw; // epoch ms
  return nowMs + 15 * 60 * 1000;
}
