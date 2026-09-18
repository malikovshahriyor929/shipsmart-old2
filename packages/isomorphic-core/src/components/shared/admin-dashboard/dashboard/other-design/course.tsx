'use client';

import React from 'react';
import { Avatar, Badge, Empty, EmptyProductBoxIcon, Text, Title, Tooltip } from 'rizzui';
import {
  PiChalkboardTeacher,
  PiClock,
  PiCheckCircle,
  PiBookOpenText,
} from 'react-icons/pi';
import cn from '@core/utils/class-names';
import WidgetCard from '@core/components/cards/widget-card';
import { CoursesSection, CoursesStudent } from '@core/components/shared/admin-dashboard/dashboard/type';
import { t } from 'i18next';

/* ------------------------------------------------------------------ */
/* Card                                                               */
/* ------------------------------------------------------------------ */
export function colorByPercent(pct?: number) {
  const v = Number.isFinite(pct) ? Math.max(0, Math.min(100, Number(pct))) : 0;
  if (v < 30) return 'text-red-600';
  if (v < 50) return 'text-yellow-600';
  if (v < 70) return 'text-amber-600';
  if (v < 100) return 'text-green-600';
  return 'text-green-700'; // exactly 100%
}
export default function CoursesGridCard({
  data,
  loading,
  className,
}: {
  data: CoursesSection | undefined;
  loading: boolean;
  className?: string;
}) {
  const s = data?.summary;

  return (
    <WidgetCard
      titleClassName="text-gray-700 font-semibold sm:text-sm "
      headerClassName="items-center"
      className={ cn('min-h-[20rem] @container', className) }
    >
      {/* Header */ }
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-0.5">
          <Title as="h3" className="text-lg font-semibold text-mainBlue">
            { t('dashboard.dashboard-4-title') }
          </Title>
          <Text className="text-sm text-gray-500">
            { t('dashboard.dashboard-4-avg-progress-full') }:{ ' ' }
            <span className="font-semibold text-green-600">
              { (s?.average_progress ?? 0).toFixed(1) }%
            </span>
          </Text>
        </div>
        <Badge
          color="primary"
          variant="flat"
          className="rounded-full uppercase bg-mainBlue/10 text-mainBlue hover:bg-mainBlue/20 dark:bg-mainBlue dark:text-white"
        >
          { s?.period ?? '—' }
        </Badge>
      </div>

      {/* Divider */ }
      <div className="my-3 h-px w-full bg-gray-100 dark:bg-gray-800" />

      {/* Summary strip */ }
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryPill
          label={ t('dashboard.dashboard-4-pill-total') }
          value={ s?.total_courses ?? 0 }
          color="text-mainBlue"
        />
        <SummaryPill
          label={ t('dashboard.dashboard-4-pill-active') }
          value={ s?.active_courses ?? 0 }
          color='text-blue-500'
        />
        <SummaryPill
          label={ t('dashboard.dashboard-4-pill-completed') }
          value={ s?.completed_courses ?? 0 }
          color="text-green-600"
        />
        <SummaryPill
          label={ t('dashboard.dashboard-4-pill-avg-progress') }
          value={ `${(s?.average_progress ?? 0).toFixed(1)}%` }
          color={ colorByPercent(s?.average_progress) }
        />
      </div>

      {/* Grid of student tiles */ }
      { !loading && !data?.students && data?.students?.length == 0 ? <>
        <div className='flex items-center justify-center h-[80%]'>
          <Empty
            image={ <EmptyProductBoxIcon className='size-40' /> }
            text={ t('dashboard.dashboard-4-empty-no-students') }
          />
        </div>
      </>
        : <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
          { loading
            ? Array.from({ length: 6 }).map((_, i) => <TileSkeleton key={ i } />) :
            (data?.students ?? []).map((row) => (
              <StudentTile key={ row.student.id } row={ row } />
            )) }
        </div>
      }
    </WidgetCard>
  );
}

/* ------------------------------------------------------------------ */
/* Summary Pill                                                        */
/* ------------------------------------------------------------------ */
function SummaryPill({
  label,
  value,
  color
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="flex flex-col items-start justify-center rounded-lg bg-gray-50/70 p-4 dark:bg-gray-800/40">
      <Text className="text-xs font-medium text-gray-500 dark:text-white/80">
        { label }
      </Text>
      <Title as="h4" className={ cn('text-lg font-semibold dark:text-white', color) }>
        { value }
      </Title>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Student Tile                                                        */
/* ------------------------------------------------------------------ */
function StudentTile({ row }: { row: CoursesStudent }) {
  const { student, enrolled_courses_count, learned_lessons, total_lessons, total_spent_time, last_viewed_at } = row;
  // const progress = Math.max(0, Math.min(100, avg_progress ?? 0));

  return (
    <div className="group rounded-2xl border border-mainBlue/20 p-4 transition hover:shadow-sm dark:border-gray-700">
      {/* Top: avatar + name */ }
      <div className="mb-3 flex items-center gap-3">
        {/* Progress ring behind avatar (conic-gradient, no lib) */ }
        <div
          className="relative grid place-items-center rounded-full p-[3px]"
          style={ {
            background: `conic-gradient(var(--ringColor, #2563eb) ${100}%, #E5E7EB ${0}%)`,
          } }
        >
          <div className="rounded-full bg-white p-0.5 dark:bg-gray-900">
            <Avatar
              src={ student.avatar?.url ?? '/default-avatar.png' }
              name={ `${student.first_name} ${student.last_name}` }
              className="size-12"
            />
          </div>
        </div>
        <div className="min-w-0">
          <Tooltip content={ `${student.first_name} ${student.last_name}` }>
            <Text className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              { student.first_name } { student.last_name }
            </Text>
          </Tooltip>
          <Text className="truncate text-[12px] text-gray-500">
            #{ student.student_no }
          </Text>
        </div>
      </div>

      {/* Stats chips */ }
      <div className=" grid grid-cols-2 gap-2">
        <Tooltip content={ t('dashboard.dashboard-4-tooltip-enrolled', { count: enrolled_courses_count }) }>
          <Badge
            variant="flat"
            className="rounded-md justify-start bg-mainBlue/10 text-mainBlue dark:bg-mainBlue/30 dark:text-mainBlue"
          >
            { t('dashboard.dashboard-4-badge-enrolled', { count: enrolled_courses_count }) }
          </Badge>
        </Tooltip>
        <Tooltip content={ t('dashboard.dashboard-4-tooltip-learned', { learned: learned_lessons, total: total_lessons }) }>
          <Badge
            variant="flat"
            className="rounded-md justify-start bg-green-50 flex items-center gap-1  text-green-700 dark:bg-green-900/30 dark:text-green-300"
          >
            { t('dashboard.dashboard-4-badge-learned', { learned: learned_lessons, total: total_lessons }) }
          </Badge>
        </Tooltip>
        <Tooltip content={ t('dashboard.dashboard-4-tooltip-time-spent', { time: total_spent_time }) }>
          <Badge
            variant="flat"
            className="rounded-md justify-start bg-yellow-50 flex items-center gap-1  text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
          >
            { t('dashboard.dashboard-4-badge-time', { time: total_spent_time }) }
          </Badge>
        </Tooltip>
        <Tooltip content={ t('dashboard.dashboard-4-tooltip-last-viewed', { date: last_viewed_at ?? '-' }) }>
          <Badge
            variant="flat"
            className="rounded-md justify-start bg-blue-50 flex items-center gap-1  text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
          >
            { t('dashboard.dashboard-4-badge-last', { date: (last_viewed_at ?? '-').slice(0, 10) }) }
          </Badge>
        </Tooltip>
      </div>

      {/* Progress bar */ }
      {/* <div>
        <div className="mb-1 flex items-center justify-between text-[11px] text-gray-500">
          <span>Progress</span>
          <span className="font-medium text-mainBlue dark:text-white">
            { progress.toFixed(1) }%
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-700">
          <div
            className="h-2.5 rounded-full bg-mainBlue transition-[width] dark:bg-mainBlue"
            style={ { width: `${progress}%` } }
          />
        </div>
      </div> */}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Skeletons                                                           */
/* ------------------------------------------------------------------ */
function TileSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 p-4 dark:border-gray-800">
      <div className="mb-3 flex items-center gap-3">
        <div className="size-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="min-w-0 space-y-1">
          <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-2 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      <div className="mb-3 flex gap-2">
        <div className="h-6 w-20 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
        <div className="h-6 w-28 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-10 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-2.5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}
