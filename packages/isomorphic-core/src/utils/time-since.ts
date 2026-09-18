export function parseDDMMYYYY_HHMM(s?: string | null): number | null {
  if (!s) return null;
  const [dmy, hm] = s.split(" ");
  if (!dmy) return null;
  const [dd, mm, yyyy] = dmy.split(".").map((v) => parseInt(v, 10));
  const [HH, MM] = (hm || "00:00").split(":").map((v) => parseInt(v, 10));
  if (!yyyy || !mm || !dd) return null;
  const ts = new Date(
    yyyy,
    (mm ?? 1) - 1,
    dd ?? 1,
    HH ?? 0,
    MM ?? 0,
    0,
    0
  ).getTime();
  return Number.isFinite(ts) ? ts : null;
}
