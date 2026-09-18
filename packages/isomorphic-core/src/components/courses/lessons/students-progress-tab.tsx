'use client';

import { useMemo, useState } from 'react';
import Pagination from '@core/components/pagination';
import { Badge, Button, Input, Text, Title, Tooltip } from 'rizzui';
import {
  PiCheckCircleDuotone,
  PiClock,
  PiDotOutlineFill,
  PiFunnelSimple,
  PiPerson,
  PiSortAscendingBold,
  PiSortDescendingBold,
  PiVideoBold,
} from 'react-icons/pi';
import cn from '@core/utils/class-names';
import SmartImage from '@core/ui/smart-image';
import { PLACEHOLDER_AVATAR } from '@core/config/constants';
import type { StudentProgressItem, _Meta } from '@core/types';
import { t } from 'i18next';

export default function StudentProgressTab({
  data,
  total,
  meta,
  page = 1,
  perPage = 30,
  totalPages = 1,
  query = '',
  statusFilter = 'all',
  onPageChange,
  onQueryChange,
  onStatusFilterChange,
}: {
  data: StudentProgressItem[];
  total?: number;
  meta?: _Meta;
  page?: number;
  perPage?: number;
  totalPages?: number;
  query?: string;
  statusFilter?: 'all' | 'completed' | 'inprogress' | 'notstarted';
  onPageChange?: (page: number) => void;
  onQueryChange?: (value: string) => void;
  onStatusFilterChange?: (
    value: 'all' | 'completed' | 'inprogress' | 'notstarted'
  ) => void;
}) {
  const [sortKey, setSortKey] = useState<'name' | 'status' | 'lastViewed'>(
    'status'
  );
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const list = Array.isArray(data) ? data : [];
  const effectivePaginationTotal = useMemo(() => {
    const filteredTotal = Number(meta?.filtered_total);
    if (Number.isFinite(filteredTotal)) return filteredTotal;
    return total ?? list.length;
  }, [list.length, meta?.filtered_total, total]);

  const totals = useMemo(() => {
    const metaCompleted = Number(meta?.completed);
    const metaInProgress = Number(meta?.in_progress);
    const metaNotStarted = Number(meta?.not_started);
    const metaFilteredTotal = Number(meta?.total);

    if (
      Number.isFinite(metaCompleted) &&
      Number.isFinite(metaInProgress) &&
      Number.isFinite(metaNotStarted)
    ) {
      return {
        total: Number.isFinite(metaFilteredTotal)
          ? metaFilteredTotal
          : total ?? list.length,
        completed: metaCompleted,
        inprogress: metaInProgress,
        notstarted: metaNotStarted,
      };
    }

    const completed = list.filter(
      (x) =>
        x.progress?.status?.label?.toLowerCase() === 'completed' ||
        x.progress?.status?.value === 3
    ).length;
    const inprogress = list.filter((x) => {
      const lab = x.progress?.status?.label?.toLowerCase();
      const val = x.progress?.status?.value;
      return lab === 'in progress' || val === 2;
    }).length;
    const resolvedTotal = total ?? list.length;
    const notstarted = Math.max(resolvedTotal - completed - inprogress, 0);
    return { total: resolvedTotal, completed, inprogress, notstarted };
  }, [list, meta, total]);

  const filtered = useMemo(() => {
    const arr = [...list];
    const dir = sortDir === 'asc' ? 1 : -1;
    arr.sort((a, b) => {
      if (sortKey === 'name') {
        const an = `${a.student.first_name || ''} ${a.student.last_name || ''}`
          .trim()
          .toLowerCase();
        const bn = `${b.student.first_name || ''} ${b.student.last_name || ''}`
          .trim()
          .toLowerCase();
        return an.localeCompare(bn) * dir;
      }
      if (sortKey === 'status') {
        const av = normalizeStatus(a.progress?.status);
        const bv = normalizeStatus(b.progress?.status);
        return (av - bv) * dir;
      }
      // lastViewed
      const at = a.progress?.last_viewed_at ?? 0;
      const bt = b.progress?.last_viewed_at ?? 0;
      return (at - bt) * dir;
    });

    return arr;
  }, [list, sortKey, sortDir]);

  return (
    <div className="space-y-4">
      {/* Summary */ }
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label={ t('courses.studentProgress-total') } value={ totals.total } />
        <StatCard label={ t('courses.studentProgress-completed') } value={ totals.completed } tone="success" />
        <StatCard
          label={ t('courses.studentProgress-in-progress') }
          value={ totals.inprogress }
          tone="warning"
        />
        <StatCard label={ t('courses.studentProgress-not-started') } value={ totals.notstarted } tone="muted" />
      </div>

      {/* Controls */ }
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white/70 dark:bg-gray-100 p-3 backdrop-blur">
        <div className="min-w-[220px] flex-1">
          <Input
            size="sm"
            value={ query }
            placeholder={ t('courses.studentProgress-search-placeholder') }
            onChange={ (e) => onQueryChange?.(e.target.value) }
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={ statusFilter === 'all' ? 'solid' : 'outline' }
            onClick={ () => onStatusFilterChange?.('all') }
          >
            <PiFunnelSimple className="mr-2 h-4 w-4" /> { t('courses.studentProgress-filter-all') }
          </Button>
          <Button
            size="sm"
            variant={ statusFilter === 'completed' ? 'solid' : 'outline' }
            className={
              statusFilter === 'completed' ? 'bg-green text-white hover:bg-green dark:hover:bg-green' : ''
            }
            onClick={ () => onStatusFilterChange?.('completed') }
          >
            <PiCheckCircleDuotone className="mr-2 h-4 w-4" />  { t('courses.studentProgress-filter-completed') }
          </Button>
          <Button
            size="sm"
            variant={ statusFilter === 'inprogress' ? 'solid' : 'outline' }
            className={
              statusFilter === 'inprogress' ? 'bg-amber-500 hover:bg-amber-500 dark:hover:bg-amber-500 text-white' : ''
            }
            onClick={ () => onStatusFilterChange?.('inprogress') }
          >
            <PiVideoBold className="mr-2 h-4 w-4" /> { t('courses.studentProgress-filter-in-progress') }
          </Button>
          <Button
            size="sm"
            variant={ statusFilter === 'notstarted' ? 'solid' : 'outline' }
            onClick={ () => onStatusFilterChange?.('notstarted') }
          >
            <PiClock className="mr-2 h-4 w-4" /> { t('courses.studentProgress-filter-not-started') }
          </Button>
        </div>

        {/* <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSortKey('name')}
            className={sortKey === 'name' ? 'ring-1 ring-mainBlue/40' : ''}
          >
            Name
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSortKey('status')}
            className={sortKey === 'status' ? 'ring-1 ring-mainBlue/40' : ''}
          >
            Status
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSortKey('lastViewed')}
            className={
              sortKey === 'lastViewed' ? 'ring-1 ring-mainBlue/40' : ''
            }
          >
            Last viewed
          </Button>

          <Button
            size="sm"
            onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
          >
            {sortDir === 'asc' ? (
              <PiSortAscendingBold className="h-4 w-4" />
            ) : (
              <PiSortDescendingBold className="h-4 w-4" />
            )}
          </Button>
        </div> */}
      </div>

      {/* Grid */ }
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        { filtered.map((item) => {
          const s = item.student ?? {};
          const p = item.progress ?? {};
          const fullName =
            `${s.first_name || ''} ${s.last_name || ''}`.trim() ||
            (s.username ?? '—');
          const avatarUrl = s.avatar?.url || PLACEHOLDER_AVATAR;
          const status = statusFromValue(p.status?.value, p.status?.label, t);
          const statusTone = statusToneClass(p.status?.value, status);

          return (
            <div
              key={ String(s.id) }
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white/70 dark:bg-blue-900/20 dark:border-blue-900/30 p-4 shadow-sm backdrop-blur transition hover:shadow-md"
            >
              {/* top-line accent */ }
              {/* <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-mainBlue/60 via-amber-400 to-mainBlue/60 opacity-80" /> */ }

              <div className="flex items-start gap-3">
                <div className="relative">
                  <SmartImage
                    src={ avatarUrl }
                    alt={ fullName }
                    className="size-12 overflow-hidden rounded-full ring-1 ring-gray-200"
                    imgClassName="object-cover"
                    fallbackSrc={ PLACEHOLDER_AVATAR }
                  />
                  {/* <span
                    className={cn(
                      'absolute -bottom-0.5 -right-0.5 inline-flex items-center justify-center rounded-full p-0.5',
                      s.online ? 'bg-green-500' : 'bg-gray-300'
                    )}
                  >
                    <PiDotOutlineFill className="h-3 w-3 text-white" />
                  </span> */}
                  { s.online ? (
                    <Badge
                      renderAsDot
                      color="success"
                      enableOutlineRing
                      size="lg"
                      className="absolute bottom-0 right-0"
                    />
                  ) : (
                    <Badge
                      renderAsDot
                      enableOutlineRing
                      size="lg"
                      className="absolute bottom-0 right-0 bg-gray-400"
                    />
                  ) }
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Title
                      as="h6"
                      className="truncate text-sm font-semibold text-gray-800"
                    >
                      { fullName }
                    </Title>
                    { s.username && (
                      <p
                        className="text-xs text-primary dark:text-gray-700"
                      // size="sm"
                      // variant="flat"
                      // className="bg-mainBlue/10 text-mainBlue ring-1 ring-mainBlue/20"
                      >
                        (@{ s.username })
                      </p>
                    ) }
                  </div>

                  {/* <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-gray-600">
                    {s.email && (
                      <a href={`mailto:${s.email}`} className="hover:underline">
                        {s.email}
                      </a>
                    )}
                    {s.phone_number && <span>• {s.phone_number}</span>}
                  </div> */}

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    { s.student_no && (
                      <Badge
                        size="sm"
                        variant="flat"
                        className="bg-gray-100 text-gray-700 ring-1 ring-gray-200"
                      >
                        { t('courses.studentProgress-id') } { s.student_no }
                      </Badge>
                    ) }
                    <Badge
                      size="sm"
                      className={ cn('text-white', statusTone.bg) }
                    >
                      { status }
                    </Badge>

                    <Badge
                      size="sm"
                      variant="flat"
                      className="bg-gray-50 text-gray-700 ring-1 ring-gray-200"
                    >
                      { t('courses.studentProgress-viewed') } { fmtSeconds(p.viewed_duration ?? 0) }
                    </Badge>

                    { p.completed_at && (
                      <Badge
                        size="sm"
                        variant="flat"
                        className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                      >
                        { t('courses.studentProgress-completed-on') } { p.completed_at }
                      </Badge>
                    ) }
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-gray-500">
                {/* <Tooltip
                  content={
                    s.last_seen_at
                      ? `Last seen ${s.last_seen_at}`
                      : 'Last seen: —'
                  }
                  size="sm"
                > */}
                <span className="inline-flex items-center gap-1">
                  {/* <PiPerson className="h-4 w-4" /> Last seen:{' '} */ }
                  { t('courses.studentProgress-last-seen-at') } { s.last_seen_at ? s.last_seen_at : '—' }
                </span>
                {/* </Tooltip> */ }

                {/* <span className="inline-flex items-center gap-1">
                  <PiClock className="h-4 w-4" />
                  Last viewed: {fmtEpoch(p.last_viewed_at)}
                </span> */}
              </div>
            </div>
          );
        }) }
      </div>

      { !filtered.length && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white/60 dark:bg-gray-100 p-8 text-center">
          <Title as="h6" className="mb-1 text-sm text-gray-800">
            { t('courses.studentProgress-empty-title') }
          </Title>
          <Text className="text-xs text-gray-500">
            { t('courses.studentProgress-empty-desc') }
          </Text>
        </div>
      ) }

      { totalPages > 1 && onPageChange && (
        <Pagination
          total={ effectivePaginationTotal }
          pageSize={ perPage }
          current={ page }
          onChange={ onPageChange }
          className="justify-center pt-2"
        />
      ) }
    </div>
  );
}

/* ---------- helpers ---------- */

function normalizeStatus(
  s?: { value?: number | null; label?: string | null } | null
) {
  if (!s) return 0;
  if (s.value != null) return s.value;
  const lab = s.label?.toLowerCase();
  if (lab === 'completed') return 3;
  if (lab === 'in progress') return 2;
  if (lab === 'soon' || lab === 'not started') return 1;
  return 1;
}
function statusFromValue(
  val?: number | null,
  fallback?: string | null,
  translate?: typeof t
) {
  if (val === 3)
    return translate?.('courses.studentProgress-completed') || 'Completed';
  if (val === 2)
    return translate?.('courses.studentProgress-in-progress') || 'In Progress';
  if (val === 1)
    return translate?.('courses.studentProgress-not-started') || 'Not Started';
  if (fallback) return fallback;
  return '—';
}
function statusToneClass(val?: number | null, fallback?: string) {
  if (val === 3 || fallback?.toLowerCase() === 'completed')
    return { bg: 'bg-green' };
  if (val === 2 || fallback?.toLowerCase() === 'in progress')
    return { bg: 'bg-amber-500' };
  return { bg: 'bg-gray-500' };
}
function fmtSeconds(sec: number) {
  if (!sec || sec <= 0) return '0s';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
function fmtEpoch(ts?: number | null) {
  if (!ts) return '—';
  try {
    const d = new Date(ts * 1000);
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${mo}-${da} ${hh}:${mm}`;
  } catch {
    return '—';
  }
}

/* ---------- small stat card ---------- */
function StatCard({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: number;
  tone?: 'default' | 'success' | 'warning' | 'muted';
}) {
  const color =
    tone === 'success'
      ? 'text-emerald-600'
      : tone === 'warning'
        ? 'text-amber-600'
        : tone === 'muted'
          ? 'text-gray-500'
          : 'text-mainBlue dark:text-gray-700';

  return (
    <div className="rounded-xl border border-gray-200 bg-white/70 dark:bg-gray-100 p-4 backdrop-blur">
      <Text className="text-xs text-gray-500">{ label }</Text>
      <div className={ cn('mt-1 text-2xl font-semibold', color) }>{ value }</div>
    </div>
  );
}
