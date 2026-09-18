import { PLACEHOLDER_AVATAR, PLACEHOLDER_GLOBAL } from "@core/config/constants";
import { Lesson } from "@core/types";
import { isValid, parse } from "date-fns";

export function fullName(u: any) {
  const n = [u?.first_name, u?.last_name].filter(Boolean).join(" ").trim();
  return n || u?.username || "—";
}

export function isImageExt(ext?: string) {
  if (!ext) return false;
  const e = String(ext).toLowerCase();
  return ["png", "jpg", "jpeg", "gif", "webp", "avif"].includes(e);
}
export function isVideoExt(ext?: string) {
  const e = String(ext || "").toLowerCase();
  return ["mp4", "mov", "m4v", "webm", "mkv"].includes(e);
}

export function thumbUrl(th: any, type?: string) {
  if (!th) return type === "avatar" ? PLACEHOLDER_AVATAR : PLACEHOLDER_GLOBAL;
  if (typeof th === "string") return th;
  return isImageExt(th?.extension)
    ? th?.url
    : type === "avatar"
      ? PLACEHOLDER_AVATAR
      : PLACEHOLDER_GLOBAL;
}

export function formatDuration(d: any) {
  if (typeof d === "number") {
    if (d >= 60) {
      const h = Math.floor(d / 60);
      const m = d % 60;
      return m ? `${h}h ${m}m` : `${h}h`;
    }
    return `${d}m`;
  }
  return d || "—";
}

//Lesson utils

export const isPublished = (l: Lesson) => (l.status?.value ?? 0) === 1;

export const isComingSoon = (l: Lesson) => {
  if (!l?.starts_at) return false;
  const parsed = parse(l.starts_at, "dd.MM.yyyy HH:mm", new Date());
  const isFuture = isValid(parsed) && parsed.getTime() > Date.now();
  return isFuture;
};

export const isLocked = (l: Lesson, isPublic?: boolean) => {
  if (isPublic === true) {
    return !isPublic;
  } else {
    return (l?.progress?.status?.value ?? null) === 1;
  }
};
