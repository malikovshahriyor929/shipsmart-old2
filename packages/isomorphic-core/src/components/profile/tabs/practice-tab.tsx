"use client";

import React, { useMemo } from "react";
import {
  PiCheckCircleBold,
  PiXCircleBold,
  PiMinusCircleBold,
  PiHourglassBold,
  PiPlayBold,
  PiEyeBold,
  PiCaretDoubleLeftBold,
  PiCaretLeftBold,
  PiCaretRightBold,
  PiCaretDoubleRightBold,
} from "react-icons/pi";
import cn from "@core/utils/class-names";
import { ProfileType } from "@core/types";
import { t } from "i18next";
import TablePagination from "@core/components/table/pagination";
import { Flex } from "rizzui/flex";
import { Text } from "rizzui/typography";
import { Grid } from "rizzui/grid";
import { ActionIcon } from "rizzui/action-icon";
import { Empty, EmptyProductBoxIcon } from "rizzui/empty";
import { EmptyFallback } from "@core/ui/empty-fallback";

/**
 * components/practice/result-card.tsx
 * Compact result card tailored to your provided data shape.
 * iMajor design cues: navy background tint + amber accent (#ffb703), glass, subtle borders.
 */

// --- Brand tokens (aligning with your iMajor style) ---
const TOKENS = {
  navy: "#0a2342",
  amber: "#ffb703",
};

function secondsToHMS(s?: number) {
  const total = Math.max(0, Math.floor(s || 0));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const sec = total % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

function clampPct(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

// --- Small stat chip ---
const Stat: React.FC<{
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  barPct?: number;
  barClass?: string;
}> = ({ title, value, icon, barPct, barClass }) => (
  <div className="rounded-xl bg-white/70 dark:bg-gray-100 p-3 text-gray-800 ring-1 ring-gray-200 backdrop-blur">
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-700">
      {icon}
      <span>{title}</span>
    </div>
    <div className="mt-0.5 text-xl font-semibold">{value}</div>
    {typeof barPct === "number" && (
      <div className="mt-2 h-1.5 w-full rounded bg-gray-200">
        <div
          className={cn("h-1.5 rounded", barClass || "bg-gray-700")}
          style={{ width: `${clampPct(barPct)}%` }}
        />
      </div>
    )}
  </div>
);

// --- Main compact card ---
export default function ResultCard({
  data,
}: {
  data: ProfileType["latest_practices"][number];
}) {
  const scorePct = useMemo(() => {
    const fallback =
      data.total_questions > 0
        ? Math.round((data.correct_answers / data.total_questions) * 100)
        : 0;
    return clampPct(data.percentage_score || fallback);
  }, [data.percentage_score, data.correct_answers, data.total_questions]);

  const answeredPct = useMemo(() => {
    return data.total_questions > 0
      ? Math.round((data.answered_questions / data.total_questions) * 100)
      : 0;
  }, [data.answered_questions, data.total_questions]);

  const passed = data.is_passed;

  const durationSec = data.time_taken_seconds || 0;

  const statusTone = data.status?.label?.toLowerCase().includes("progress")
    ? "bg-amber-500 text-white"
    : passed
      ? "bg-emerald-600 text-white"
      : "bg-rose-600 text-white";

  return (
    <div
      className={cn(
        "w-full rounded-2xl border p-4 transition",
        "ring-1 ring-white/10 backdrop-blur",
        passed
          ? "border-emerald-400 bg-emerald-50 dark:bg-gray-100"
          : data.status.label?.toLowerCase().includes("progress")
            ? "border-amber-400 bg-amber-50 dark:bg-gray-100"
            : "border-rose-400 bg-rose-50 dark:bg-gray-100",
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {data.course_name || "—"}
          </div>
          <h3 className="truncate text-base font-semibold text-slate-900">
            {data.lesson_title}
          </h3>
          {/* { data.lesson_title && (
            <div className="truncate text-xs text-slate-600">{ data.lesson_title }</div>
          ) } */}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
              statusTone,
            )}
          >
            {/* { data.status?.label || (passed ? "Passed" : "Failed") } */}
            {data.status?.label ||
              (passed
                ? t("profile.practiceCard.status.passed")
                : t("profile.practiceCard.status.failed"))}
          </span>
          {/* { data.difficulty?.label && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-medium text-gray-800 ring-1 ring-gray-200">
              { data.difficulty.label }
            </span>
          ) } */}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[96px,1fr,1fr,1fr] md:grid-cols-2 min-[960px]:grid-cols-[96px,1fr,1fr,1fr] ">
        <div className="relative mx-auto h-24 w-24">
          <div className="absolute inset-0 rounded-full bg-white dark:bg-gray-100 ring-1 ring-gray-200" />
          <div
            className={`absolute inset-2 rounded-full`}
            style={{
              background: `conic-gradient(${clampPct(scorePct) > 80 ? "#22c55e" : TOKENS.amber} ${clampPct(scorePct)}%, #e5e7eb ${clampPct(scorePct)}% 100%)`,
            }}
          />
          <div className="absolute inset-5 grid place-items-center rounded-full bg-white dark:bg-gray-100 ring-1 ring-gray-200">
            <div className="text-center">
              <div className="text-lg font-extrabold text-gray-900">
                {scorePct}%
              </div>
              {/* <div className="text-[11px] font-medium text-gray-500">Score</div> */}
            </div>
          </div>
        </div>

        {/* Stats grid (3 small chips) */}
        <Stat
          // title="Correct"
          title={t("profile.practiceCard.labels.correct")}
          value={
            <span className="inline-flex items-center gap-1">
              <PiCheckCircleBold className="h-4 w-4 text-emerald-600" />
              <span>
                {data.correct_answers}/{data.total_questions}
              </span>
            </span>
          }
          barPct={
            (data.correct_answers / Math.max(1, data.total_questions)) * 100
          }
          barClass="bg-emerald-500"
        />

        <Stat
          // title="Completed"
          title={t("profile.practiceCard.labels.completed")}
          value={`${answeredPct}%`}
          barPct={answeredPct}
          barClass="bg-sky-500"
        />

        <Stat
          // title="Time"
          title={t("profile.practiceCard.labels.time")}
          value={
            <span className="inline-flex items-center gap-1">
              <PiHourglassBold className="h-4 w-4 text-amber-600" />
              {secondsToHMS(durationSec)}
            </span>
          }
        />
      </div>
    </div>
  );
}

export function ResultCardList({
  items,
  total,
  per_page,
  page,
  onPageChange,
}: {
  items: ProfileType["latest_practices"];
  total?: number;
  per_page?: number;
  page?: number;
  onPageChange?: (page: number) => void;
}) {
  const currentPage = page ?? 1;
  const perPage = per_page ?? items.length ?? 1;
  const totalItems = total ?? items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const handleFirstPage = () => {
    if (!onPageChange || !canPrev) return;
    onPageChange(1);
  };

  const handlePrevPage = () => {
    if (!onPageChange || !canPrev) return;
    onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (!onPageChange || !canNext) return;
    onPageChange(currentPage + 1);
  };

  const handleLastPage = () => {
    if (!onPageChange || !canNext) return;
    onPageChange(totalPages);
  };
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-2">
      <div className="md:col-span-2 mb-3  ">
        <Flex justify="end" align="center">
          <Text className="font-normal text-gray-600 dark:text-primary-dark">
            {/* Page { table.getState().pagination.pageIndex + 1 } of{ " " }
          { table.getPageCount().toLocaleString() } */}
            {t("commons.pagination.page-x-of-y", {
              current: currentPage,
              total: totalPages,
            })}
          </Text>
          <Grid gap="2" columns="4">
            <ActionIcon
              size="sm"
              rounded="lg"
              variant="outline"
              type="button"
              aria-label={t("commons.pagination.aria-first") ?? "Go to first page"}
              onClick={handleFirstPage}
              disabled={!canPrev}
              className="text-gray-900 shadow-sm disabled:text-gray-400 disabled:shadow-none dark:bg-gray-100 dark:border-gray-100"
            >
              <PiCaretDoubleLeftBold className="size-3.5" />
            </ActionIcon>
            <ActionIcon
              size="sm"
              rounded="lg"
              variant="outline"
              type="button"
              aria-label={t("commons.pagination.aria-prev") ?? "Go to previous page"}
              onClick={handlePrevPage}
              disabled={!canPrev}
              className="text-gray-900 shadow-sm disabled:text-gray-400 disabled:shadow-none dark:bg-gray-100 dark:border-gray-100"
            >
              <PiCaretLeftBold className="size-3.5" />
            </ActionIcon>
            <ActionIcon
              size="sm"
              rounded="lg"
              variant="outline"
              type="button"
              aria-label={t("commons.pagination.aria-next") ?? "Go to next page"}
              onClick={handleNextPage}
              disabled={!canNext}
              className="text-gray-900 shadow-sm disabled:text-gray-400 disabled:shadow-none dark:bg-gray-100 dark:border-gray-100"
            >
              <PiCaretRightBold className="size-3.5" />
            </ActionIcon>
            <ActionIcon
              size="sm"
              rounded="lg"
              variant="outline"
              type="button"
              aria-label={t("commons.pagination.aria-last") ?? "Go to last page"}
              onClick={handleLastPage}
              disabled={!canNext}
              className="text-gray-900 shadow-sm disabled:text-gray-400 disabled:shadow-none dark:bg-gray-100 dark:border-gray-100"
            >
              <PiCaretDoubleRightBold className="size-3.5" />
            </ActionIcon>
          </Grid>
        </Flex>
      </div>
      {items.length > 0 ? (
        items.map((it) => <ResultCard key={it.id} data={it} />)
      ) : (
        <EmptyFallback
          className="md:col-span-2 w-full  mx-auto"
          withBorder
          text={t("profile.fallbacks.no-data")}
        />
      )}
    </div>
  );
}
