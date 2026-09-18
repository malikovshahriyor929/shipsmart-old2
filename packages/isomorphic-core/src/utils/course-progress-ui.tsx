// utils/course-progress-ui.ts
export type Tone = "success" | "warning" | "danger" | "secondary";

export interface StudentCourseProgressUIArgs {
  isStudent: boolean;
  isEnrolled: boolean;
  completionPercent?: number; // 0..100

  /**
   * How many lessons student is behind the latest published lesson.
   * Examples:
   *  - 0..3 => on track (green)
   *  - 4..10 => "X lessons behind" (amber)
   *  - >=11 => very low performance (red)
   * If null/undefined => fallback to "on track" (started but unknown gap)
   */
  behindBy?: number | null;

  // thresholds
  onTrackMaxBehind?: number; // default 3
  lowPerformanceMinBehind?: number; // default 11 (>=11 => red)
  t?: (key: string, opts?: any) => string;
}

export interface StudentCourseProgressUI {
  label: string;
  tone: Tone;
  textClassName: string;
  dotClassName: string;

  showProgressbar: boolean;
  progressValue: number; // 0..100
  progressColor: Tone;
  showPercent: boolean;

  behindBy: number | null;
}

const clampPct = (n: number) => Math.min(100, Math.max(0, n));

export function getStudentCourseProgressUI(
  args: StudentCourseProgressUIArgs,
): StudentCourseProgressUI {
  const {
    isStudent,
    isEnrolled,
    completionPercent = 0,
    behindBy = null,
    onTrackMaxBehind = 3,
    lowPerformanceMinBehind = 11,
    t,
  } = args;

  const tr = (key: string, opts?: any) =>
    t ? t(key, opts) : fallbackEn(key, opts);

  // Non-student safe default
  if (!isStudent) {
    return {
      label: "",
      tone: "secondary",
      textClassName: "text-gray-700",
      dotClassName: "bg-gray-700",
      showProgressbar: false,
      progressValue: 0,
      progressColor: "secondary",
      showPercent: false,
      behindBy: null,
    };
  }

  // Not enrolled
  if (!isEnrolled) {
    return {
      label: tr("courses.not-enrolled"),
      tone: "secondary",
      textClassName: "text-gray-700",
      dotClassName: "bg-gray-700",
      showProgressbar: false,
      progressValue: 0,
      progressColor: "secondary",
      showPercent: false,
      behindBy: null,
    };
  }

  const pct = clampPct(Number(completionPercent) || 0);

  // Completed (keep keyword)
  if (pct >= 100) {
    return {
      label: tr("courses.studentProgress-completed"),
      tone: "success",
      textClassName: "text-green",
      dotClassName: "bg-green",
      showProgressbar: true,
      progressValue: 100,
      progressColor: "success",
      showPercent: true,
      behindBy: 0,
    };
  }

  // Not started (keep keyword "Enrolled")
  if (pct <= 0) {
    return {
      label: tr("courses.card-enrolled"),
      tone: "secondary",
      textClassName: "text-primary dark:text-gray-700",
      dotClassName: "bg-gray-700",
      showProgressbar: true, // set false if you don't want a 0% bar
      progressValue: pct,
      progressColor: "secondary",
      showPercent: true,
      behindBy: null,
    };
  }

  // Started but gap unknown => default to on track (green)
  if (
    behindBy === null ||
    behindBy === undefined ||
    Number.isNaN(Number(behindBy))
  ) {
    return {
      label: tr("courses.studentProgress-on-track"),
      tone: "success",
      textClassName: "text-green",
      dotClassName: "bg-green",
      showProgressbar: true,
      progressValue: pct,
      progressColor: "success",
      showPercent: true,
      behindBy: null,
    };
  }

  const gap = Math.max(0, Math.floor(Number(behindBy)));

  if (gap <= onTrackMaxBehind) {
    return {
      label: tr("courses.studentProgress-on-track"),
      tone: "success",
      textClassName: "text-green",
      dotClassName: "bg-green",
      showProgressbar: true,
      progressValue: pct,
      progressColor: "success",
      showPercent: true,
      behindBy: gap,
    };
  }

  if (gap >= lowPerformanceMinBehind) {
    return {
      label: tr("courses.studentProgress-very-low-performance"),
      tone: "danger",
      textClassName: "text-red-600",
      dotClassName: "bg-red-600",
      showProgressbar: true,
      progressValue: pct,
      progressColor: "danger",
      showPercent: true,
      behindBy: gap,
    };
  }

  return {
    label: tr("courses.studentProgress-lessons-behind", { count: gap }),
    tone: "warning",
    textClassName: "text-amber-600",
    dotClassName: "bg-amber-500",
    showProgressbar: true,
    progressValue: pct,
    progressColor: "warning",
    showPercent: true,
    behindBy: gap,
  };
}

function fallbackEn(key: string, opts?: any): string {
  switch (key) {
    case "courses.not-enrolled":
      return "Not enrolled";
    case "courses.card-enrolled":
      return "Enrolled";
    case "courses.studentProgress-completed":
      return "Completed";

    // new status keys (meaning aligned)
    case "courses.studentProgress-on-track":
      return "On track";
    case "courses.studentProgress-very-low-performance":
      return "Very low performance";
    case "courses.studentProgress-lessons-behind": {
      const c = Number(opts?.count ?? 0);
      return `${c} lesson${c === 1 ? "" : "s"} behind`;
    }

    default:
      return key;
  }
}
