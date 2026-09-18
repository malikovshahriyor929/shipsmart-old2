export function parseDueAt(input: unknown): Date | null {
  if (!input) return null;
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;

  // Normalize: trim, convert NBSP to space, collapse spaces
  const s = String(input).trim().replace(/\u00A0/g, ' ').replace(/\s+/g, ' ');
  if (!s) return null;

  // 1) Proper ISO with T and offset or Z → let Date handle (safe)
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) {
    const dt = new Date(s);
    return isNaN(dt.getTime()) ? null : dt;
  }

  // Helper to build & validate a local Date
  const mkLocal = (y: number, m1: number, d: number, hh: number, mm: number, ss = 0) => {
    if (m1 < 1 || m1 > 12 || d < 1 || d > 31 || hh < 0 || hh > 23 || mm < 0 || mm > 59 || ss < 0 || ss > 59) {
      return null;
    }
    const mo = m1 - 1;
    const dt = new Date(y, mo, d, hh, mm, ss, 0);
    // strict check (avoid Date normalization like 31-Nov → 1-Dec)
    if (
      dt.getFullYear() !== y ||
      dt.getMonth() !== mo ||
      dt.getDate() !== d ||
      dt.getHours() !== hh ||
      dt.getMinutes() !== mm ||
      dt.getSeconds() !== ss
    ) {
      return null;
    }
    return dt;
  };

  // 2) YYYY-MM-DD HH:mm[:ss] or with "T" instead of space; allow 1–2 digit HH/mm/ss
  let m =
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(s);
  if (m) {
    const y = +m[1], m1 = +m[2], d = +m[3], hh = +m[4], mm = +m[5], ss = m[6] ? +m[6] : 0;
    return mkLocal(y, m1, d, hh, mm, ss);
  }

  // 3) dd.MM.yyyy HH:mm[:ss] (in case one item came in this format)
  m = /^(\d{2})\.(\d{2})\.(\d{4})[ T]?(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(s);
  if (m) {
    const d = +m[1], m1 = +m[2], y = +m[3], hh = +m[4], mm = +m[5], ss = m[6] ? +m[6] : 0;
    return mkLocal(y, m1, d, hh, mm, ss);
  }

  // Unknown format
  return null;
}