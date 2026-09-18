import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, CheckCircle2, FileText } from "lucide-react";
import { TaskType } from "@core/types";
import { FiAlertCircle } from "react-icons/fi";
import { PiCalendar } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

function parseUzDatetime(input: string): Date | null {
  // Format: "YYYY.MM.DD HH:mm:ss"
  const m = input.match(/(\d{4})\.(\d{2})\.(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
  if (!m) return null;
  const [, y, mo, d, hh, mm, ss] = m;
  return new Date(Number(y), Number(mo) - 1, Number(d), Number(hh), Number(mm), Number(ss));
}

function clsx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const Pill: React.FC<{ color?: string; children: React.ReactNode; title?: string }> = ({ children, title }) => (
  <span
    title={title}
    className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide"
    style={{
      borderColor: "rgba(255,255,255,.12)",
      background: "rgba(255,255,255,.04)",
    }}
  >
    {children}
  </span>
);

const SectionRow: React.FC<{ icon: React.ReactNode; label: string; hint?: string; danger?: boolean }> = ({
  icon,
  label,
  hint,
  danger,
}) => (
  <div className="flex items-center gap-2 text-[13px] ">
    <span
      className={clsx("flex h-5 w-5 items-center justify-center rounded-md border", danger && "border-red-400/40")}
      style={{ borderColor: "rgba(255,255,255,.12)", background: "rgba(255,255,255,.04)" }}
    >
      {icon}
    </span>
    <span className="truncate">{label}</span>
    {hint && <span className={clsx("ml-auto text-[12px]", danger ? "text-red-300" : "text-slate-400")}>{hint}</span>}
  </div>
);

function timeUntil(due: Date | null, t: (k: string, o?: any) => string) {
  if (!due) return { label: "—", overdue: false };
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const overdue = diffMs < 0;
  const abs = Math.abs(diffMs);
  const days = Math.floor(abs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((abs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const mins = Math.floor((abs % (60 * 60 * 1000)) / (60 * 1000));

  const compact =
    days > 0
      ? `${days}${t("profile.time.days_short")} ${hours}${t("profile.time.hours_short")}`
      : hours > 0
      ? `${hours}${t("profile.time.hours_short")} ${mins}${t("profile.time.minutes_short")}`
      : `${mins}${t("profile.time.minutes_short")}`;

  const label = overdue
    ? t("profile.task.due.overdue", { label: compact }) // "Overdue · {{label}}"
    : t("profile.task.due.in", { label: compact }); // "Due in {{label}}"

  return { label, overdue };
}

export const AdvisorTaskCard: React.FC<{ item: TaskType }> = ({ item }) => {
  const due = parseUzDatetime(item.task_due_at);
  const tu = timeUntil(due, t);
  const statusOk = item.status?.label?.toUpperCase() === "SUBMITTED";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="group relative overflow-hidden rounded-2xl border p-5 dark:bg-gray-100 "
      aria-label={t("profile.task.card-aria")}
    >
      <h3 className="line-clamp-4 max-h-24 text-lg mb-2 font-semibold text-mainBlue truncate ">
        {item.task_title}
      </h3>

      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-1.5">
          {statusOk ? (
            <>
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium text-green-700">
                {t("profile.task.status.submitted")}
              </span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs font-medium text-amber-700">
                {t("profile.task.status.in-progress")}
              </span>
            </>
          )}
        </div>

        <div
          className={`flex items-center gap-2 justify-between text-sm  p-2 rounded-lg ${
            tu.overdue ? "bg-red-100/60" : "bg-blue-100/40 dark:bg-gray-50"
          }`}
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <PiCalendar className="w-6 h-6 dark:!text-primary" style={{ color: tu.overdue ? "#dc2626" : "#2563eb" }} />
            <span className={`font-medium ${tu.overdue ? "text-red-700" : "text-blue-700 dark:text-primary"}`}>{tu.label}</span>
          </div>
          <span className={`font-medium ${tu.overdue ? "text-red-700" : "text-blue-700 dark:text-primary"}`}>
            {item.task_due_at.slice(0, 16)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1 ">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-mainBlue dark:text-gray-700">
          {t("profile.task.section.description")}
        </p>
        <p className="max-h-24 text- flex-1 overflow-hidden text-ellipsis whitespace-pre-line line-clamp-3 truncate">
          {item.task_description}
        </p>
      </div>

      {item.advisor_comment && (
        <div className="mt-4 flex flex-col gap-0.5 ">
          <div className="text-[12px] font-semibold uppercase tracking-wider text-mainBlue dark:text-gray-700">
            {t("profile.task.section.advisor-comment")}
          </div>
          <div className="max-h-24 text-sm text- flex-1 overflow-hidden text-ellipsis whitespace-pre-line line-clamp-3 truncate">
            {item.advisor_comment}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const AdvisorTaskList: React.FC<{ data: TaskType[] }> = ({ data }) => {
  return (
    <div
      className="grid grid-cols-1 gap-4 min-[700px]:grid-cols-2 min-[1300px]:grid-cols-3 dark:border-0"
      style={{
        borderRadius: "1.25rem",
        border: "1px solid rgba(255,255,255,.08)",
      }}
      aria-label={t("profile.task.list-aria")}
    >
      {data.map((it) => (
        <AdvisorTaskCard key={it.id} item={it} />
      ))}
    </div>
  );
};
