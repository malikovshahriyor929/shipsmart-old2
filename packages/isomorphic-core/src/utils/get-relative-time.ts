// import { t } from "i18next";
// import { formatDate } from "./format-date";

// export function getRelativeTime(date: Date | string): string {
//   if (!date) return "";

//   // Convert string date to Date object if necessary
//   const parsedDate =
//     typeof date === "string" ? parseCustomDateFormat(date) : new Date(date);

//   if (!isValidDate(parsedDate)) return "";

//   const now = new Date();
//   const elapsedSeconds = Math.floor(
//     (now.getTime() - parsedDate.getTime()) / 1000
//   );

//   if (elapsedSeconds >= 31536000) {
//     return formatDate(parsedDate);
//   }

//   const intervals: [number, string][] = [
//     [2592000, "month"],
//     [86400, "day"],
//     [3600, "hour"],
//     [60, "minute"],
//     [1, "second"],
//   ];

//   for (const [seconds, unit] of intervals) {
//     const intervalValue = Math.floor(elapsedSeconds / seconds);
//     if (intervalValue >= 1) {
//       return t(`relative.${unit}`, { intervalValue });
//       return intervalValue === 1
//         ? `${intervalValue} ${unit} ago`
//         : `${intervalValue} ${unit}s ago`;
//     }
//   }

//   return t("relative.justNow");
//   // "just now";
// }

// function parseCustomDateFormat(dateStr: string): Date {
//   const [datePart, timePart] = dateStr.split(" ");
//   const [day, month, year] = datePart.split(".").map(Number);
//   const [hours, minutes] = timePart ? timePart.split(":").map(Number) : [0, 0];

//   return new Date(year, month - 1, day, hours, minutes);
// }

// function isValidDate(date: Date): boolean {
//   return date instanceof Date && !isNaN(date.getTime());
// }

import { t } from 'i18next';
import { formatDate } from './format-date';

export function getRelativeTime(date: Date | string): string {
  if (!date) return '';

  const parsedDate =
    typeof date === 'string' ? parseCustomDateFormat(date) : new Date(date);

  if (!isValidDate(parsedDate)) return '';

  const now = new Date();
  const elapsedSeconds = Math.floor((now.getTime() - parsedDate.getTime()) / 1000);

  // ≥ 12 months → show full date
  if (elapsedSeconds >= 31536000) {
    return formatDate(parsedDate);
  }

  const intervals: Array<[number, 'month' | 'day' | 'hour' | 'minute' | 'second']> = [
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
    [1, 'second'],
  ];

  for (const [seconds, unit] of intervals) {
    const count = Math.floor(elapsedSeconds / seconds);
    if (count >= 1) {
      // 1) Try standard i18next pluralization with {count}
      const baseKey = `relative.${unit}`;
      let out = t(baseKey, { count });

      // 2) If not translated (or key echoed), try key_one/key_other
      const looksUntranslated = !out || out === baseKey;
      if (looksUntranslated) {
        const altKey = count === 1 ? `${baseKey}_one` : `${baseKey}_other`;
        out = t(altKey, { count });
      }

      // 3) Final fallback to English
      if (!out || out === baseKey) {
        return `${count} ${unit}${count === 1 ? '' : 's'} ago`;
      }
      return out;
    }
  }

  // zero case
  const j = t('relative.justNow');
  return j && j !== 'relative.justNow' ? j : 'just now';
}

function parseCustomDateFormat(dateStr: string): Date {
  const [datePart = '', timePart] = dateStr.split(' ');
  const [day = 1, month = 1, year = 0] = datePart.split('.').map(Number);
  const [hours = 0, minutes = 0] = timePart ? timePart.split(':').map(Number) : [0, 0];
  return new Date(year, month - 1, day, hours, minutes);
}

function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}
