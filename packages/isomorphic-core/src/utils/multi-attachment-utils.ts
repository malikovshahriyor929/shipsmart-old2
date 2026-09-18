import { UploadResult } from "@core/types";

export const toUploads = (v: unknown): UploadResult[] =>
  Array.isArray(v) ? v as UploadResult[] : v ? [v as UploadResult] : [];

// when sending to API, take the first public_id (or null)
export const firstPublicId = (v: unknown): string | null => {
  if (!v) return null;
  const arr = Array.isArray(v) ? v : [v];
  const item = arr[0] as any;
  return typeof item === "string" ? item : (item?.public_id ?? null);
};
