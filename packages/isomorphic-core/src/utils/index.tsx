import { PiFileBold, PiFileDocBold, PiFileImageBold, PiFilePdfBold, PiFileXlsBold } from "react-icons/pi";

export function getFileIconByExt(ext?: string) {
  const e = (ext || '').toLowerCase();
  if (e === 'pdf') return <PiFilePdfBold className="h-10 w-10 text-red-500" />;
  if (e === 'doc' || e === 'docx') return <PiFileDocBold className="h-10 w-10 text-blue-500" />;
  if (e === 'xls' || e === 'xlsx' || e === 'csv') return <PiFileXlsBold className="h-10 w-10 text-green-500" />;
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(e)) return <PiFileImageBold className="h-10 w-10 text-purple-500" />;
  return <PiFileBold className="h-10 w-10 text-gray-500" />;
}
export async function forceDownload(url: string, filename?: string) {
  const res = await fetch(url, { credentials: 'omit' }); // token already in URL
  if (!res.ok) throw new Error(`Failed to download: ${res.status}`);
  const blob = await res.blob();
  const a = document.createElement('a');
  const objectUrl = URL.createObjectURL(blob);
  a.href = objectUrl;
  a.download = filename || 'file';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}

export function normalizePassportInput(raw: string): string {
  if (!raw) return '';
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');

  let letters = 0;
  let out = '';

  for (const ch of cleaned) {
    if (out.length >= 9) break;
    if (letters < 2) {
      if (/[A-Z]/.test(ch)) {
        out += ch;
        letters++;
      }
    } else {
      if (/[0-9]/.test(ch)) {
        out += ch;
      }
    }
  }

  return out;
}

export function formatDateYmdHmLocal(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    pad(date.getDate()) +
    '.' +
    pad(date.getMonth() + 1) +
    '.' +
    date.getFullYear() +
    ' ' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes())
  );
}