export const STUDENT_YEAR_STORAGE_KEY = 'admin:selected_student_year';
export const STUDENT_YEAR_CHANGE_EVENT = 'admin:student-year-change';

export type StudentYearOption = {
  label: string;
  value: string;
};

const MIN_STUDENT_YEAR = 2025;

export function normalizeStudentYear(value?: string | null) {
  const match = String(value ?? '').match(/\d{4}/);
  const year = Number(match?.[0] ?? getCurrentStudentYear());
  const currentYear = Number(getCurrentStudentYear());
  const normalizedYear = Math.min(
    Math.max(year, MIN_STUDENT_YEAR),
    currentYear
  );
  return String(normalizedYear);
}

export function getCurrentStudentYear() {
  return String(new Date().getFullYear());
}

export function getStudentYearOptions() {
  const currentYear = Number(getCurrentStudentYear());
  const options: StudentYearOption[] = [];

  for (let year = currentYear; year >= MIN_STUDENT_YEAR; year -= 1) {
    const value = String(year);
    options.push({ label: value, value });
  }

  return options;
}

export function getStoredStudentYear() {
  if (typeof window === 'undefined') return getCurrentStudentYear();
  const stored = normalizeStudentYear(
    localStorage.getItem(STUDENT_YEAR_STORAGE_KEY)
  );
  localStorage.setItem(STUDENT_YEAR_STORAGE_KEY, stored);
  return stored;
}

export function setStoredStudentYear(value: string) {
  if (typeof window === 'undefined') return;
  const normalizedValue = normalizeStudentYear(value);
  localStorage.setItem(STUDENT_YEAR_STORAGE_KEY, normalizedValue);
  window.dispatchEvent(
    new CustomEvent(STUDENT_YEAR_CHANGE_EVENT, { detail: normalizedValue })
  );
}
