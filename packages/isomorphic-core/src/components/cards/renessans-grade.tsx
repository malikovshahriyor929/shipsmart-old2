import cn from "@core/utils/class-names";
import { PiCalendarBlank, PiClockBold } from "react-icons/pi";
import Card from "./card";
import { Title } from "rizzui/index";

export type CoursePoint = {
  slot_no: number;
  course_id: string;
  course_name: string;
  point: number;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const themeByPoint = (point: number) => {
  if (point >= 90) {
    return {
      bg: "bg-sky-50 dark:bg-sky-900/20",
      ring: "ring-sky-100 dark:ring-sky-800/60",
      point: "text-sky-700 dark:text-sky-200",
      text: "text-slate-800 dark:text-slate-100",
      muted: "text-slate-600 dark:text-slate-300",
      accent: "bg-sky-300 dark:bg-sky-500/60",
      gradeBg: "bg-sky-100/70 dark:bg-sky-800/40",
      gradeText: "text-sky-800 dark:text-sky-100",
      gradeRing: "ring-sky-200 dark:ring-sky-700",
    };
  }
  if (point >= 70) {
    return {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      ring: "ring-emerald-100 dark:ring-emerald-800/60",
      point: "text-emerald-700 dark:text-emerald-200",
      text: "text-slate-800 dark:text-slate-100",
      muted: "text-slate-600 dark:text-slate-300",
      accent: "bg-emerald-300 dark:bg-emerald-500/60",
      gradeBg: "bg-emerald-100/70 dark:bg-emerald-800/40",
      gradeText: "text-emerald-800 dark:text-emerald-100",
      gradeRing: "ring-emerald-200 dark:ring-emerald-700",
    };
  }
  if (point >= 60) {
    return {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      ring: "ring-amber-100 dark:ring-amber-800/60",
      point: "text-amber-700 dark:text-amber-200",
      text: "text-slate-800 dark:text-slate-100",
      muted: "text-slate-600 dark:text-slate-300",
      accent: "bg-amber-300 dark:bg-amber-500/60",
      gradeBg: "bg-amber-100/70 dark:bg-amber-800/40",
      gradeText: "text-amber-800 dark:text-amber-100",
      gradeRing: "ring-amber-200 dark:ring-amber-700",
    };
  }
  return {
    bg: "bg-red-50/90 dark:bg-red-900/30",
    ring: "ring-red-100 dark:ring-red-800/60",
    point: "text-red-700 dark:text-red-200",
    text: "text-red-800 dark:text-red-100",
    muted: "text-red-600 dark:text-red-300",
    accent: "bg-red-300 dark:bg-red-500/60",
    gradeBg: "bg-red-100/80 dark:bg-red-800/40",
    gradeText: "text-red-800 dark:text-red-100",
    gradeRing: "ring-red-200 dark:ring-red-700",
  };
};

const gradeFromPoint = (point: number) => {
  if (point >= 70) return 5;
  if (point >= 50) return 4;
  if (point >= 40) return 3;
  return 2;
};

const RenesansGradeCard = ({
  item,
  index,
}: {
  item: CoursePoint;
  index: number;
}) => {
  const theme = themeByPoint(item.point);
  const grade = gradeFromPoint(item.point);
  return (
    <Card
      key={item.slot_no}
      className={cn("overflow-hidden ring-1", theme.bg, theme.ring)}
    >
      <div className="p-6 pl-0">
        <div className="relative flex items-start justify-between gap-4">
          <div
            className={cn(
              "absolute -top-2 left-0 h-[35px] w-1 rounded-r-lg",
              theme.accent,
              // "dark:bg-gray-200"
            )}
          />
          <div className="space-y-3 pl-6">
            <Title as="h3" className={cn("text-lg font-semibold", theme.text)}>
              {item.course_name}
            </Title>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span
                className={cn("inline-flex items-center gap-1", theme.muted)}
              >
                <PiCalendarBlank className={cn("h-4 w-4", theme.muted)} />
                {formatDate(item.created_at)}
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span
                className={cn("inline-flex items-center gap-1", theme.muted)}
              >
                <PiClockBold className="h-4 w-4" />
                Slot #{item.slot_no}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div
              className={cn("text-3xl font-black leading-none", theme.point)}
            >
              {grade}
            </div>
            <div
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold ring-1 bg-transparent",
                // theme.gradeBg,
                theme.gradeText,
                theme.gradeRing,
              )}
            >
              {item.point} points
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RenesansGradeCard;
