export default async function forceDownload(url: string, filename?: string) {
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