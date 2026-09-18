'use client';

import { useMemo, useState } from 'react';
import { t } from 'i18next';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import { Popover, Text, Title } from 'rizzui';
import { PiCalendarBlank, PiClockBold } from 'react-icons/pi';
import cn from '@core/utils/class-names';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MdArrowOutward } from 'react-icons/md';
import { FiArrowDownRight } from 'react-icons/fi';
import { RegionChartData } from '@core/components/shared/admin-dashboard/dashboard/type';

type MetricKey = 'pageview' | 'timeOnPage' | 'visitors';

type DataPoint = {
  date: string;
  value: number;
  parsed: Date;
};

type MetricConfig = {
  label: string;
  labelKey: string;
  total: number;
  change: number;
  data: DataPoint[];
  colors: { stroke: string; fill: string };
  postfix?: string;
};

type LineGraphProps = {
  className?: string;
  chartData?: RegionChartData | null;
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
  onDateRangeChange?: (range: { from: Date | null; to: Date | null }) => void;
};

type QuickPreset =
  | 'today'
  | 'hourly'
  | 'week'
  | 'month'
  | '3months'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | '1year'
  | 'yearly'
  | 'custom';

const monthMap: Record<string, number> = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
};

function labelToDate(label: string, year: number) {
  const [mon, day] = label.split(' ');
  const monthIndex = monthMap[mon?.toUpperCase()] ?? 0;
  return new Date(year, monthIndex, Number(day) || 1);
}

function parseDateLabel(value: string) {
  if (!value) return new Date();
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) {
    const [day, month, year] = value.split('.').map(Number);
    return new Date(year, month - 1, day);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split('-').map(Number);
    return new Date(year, month - 1, 1);
  }
  const fallback = new Date(value);
  if (!Number.isNaN(fallback.getTime())) return fallback;
  const now = new Date();
  return labelToDate(value, now.getFullYear());
}

const metricBase: Record<
  MetricKey,
  {
    label: string;
    labelKey: string;
    colors: { stroke: string; fill: string };
    postfix?: string;
  }
> = {
  pageview: {
    label: 'Pageview',
    labelKey: 'dashboard.metric-pageview',
    colors: { stroke: '#2563eb', fill: '#60a5fa' },
  },
  timeOnPage: {
    label: 'Time on page',
    labelKey: 'dashboard.metric-time-on-page',
    colors: { stroke: '#10b981', fill: '#34d399' },
    postfix: ' min',
  },
  visitors: {
    label: 'Visitors',
    labelKey: 'dashboard.metric-visitors',
    colors: { stroke: '#0f6bd6', fill: '#2aa3f5' },
  },
};

const buildEmptyMetricConfigs = (): Record<MetricKey, MetricConfig> => ({
  pageview: { ...metricBase.pageview, total: 0, change: 0, data: [] },
  timeOnPage: { ...metricBase.timeOnPage, total: 0, change: 0, data: [] },
  visitors: { ...metricBase.visitors, total: 0, change: 0, data: [] },
});

const tabs: MetricKey[] = ['pageview', 'timeOnPage', 'visitors'];

function formatDurationFromSeconds(seconds: number) {
  const totalSeconds = Math.max(0, Math.round(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  }
  return `${minutes}m ${secs.toString().padStart(2, '0')}s`;
}

function formatYAxisValue(value: number, metric: MetricKey) {
  if (metric === 'timeOnPage') {
    if (value >= 3600) {
      const hours = value / 3600;
      return `${hours.toFixed(hours >= 10 ? 0 : 1)}h`;
    }
    if (value >= 60) {
      return `${Math.round(value / 60)}m`;
    }
    return `${Math.round(value)}s`;
  }
  return value >= 1000
    ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`
    : value.toLocaleString('en-US');
}

function formatHeadline(metric: MetricKey, value: number) {
  if (metric === 'timeOnPage') return formatDurationFromSeconds(value);
  return value.toLocaleString('en-US');
}

export default function LineGraph({
  className,
  chartData,
  dateRange,
  onDateRangeChange,
}: LineGraphProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('visitors');
  const [rangePreset, setRangePreset] = useState<QuickPreset>('month');

  const metrics = useMemo(() => {
    const base = buildEmptyMetricConfigs();
    if (!chartData) return base;

    const visitorsDaily = chartData.visitors?.daily_visitors ?? [];
    const sortedVisitors = [...visitorsDaily].sort(
      (a, b) => parseDateLabel(a.date).getTime() - parseDateLabel(b.date).getTime()
    );

    const pageviewData: DataPoint[] = sortedVisitors.map(({ date, total_sessions }) => ({
      date,
      value: total_sessions ?? 0,
      parsed: parseDateLabel(date),
    }));

    const visitorData: DataPoint[] = sortedVisitors.map(({ date, unique_visitors }) => ({
      date,
      value: unique_visitors ?? 0,
      parsed: parseDateLabel(date),
    }));

    const rawTimeSeries =
      chartData.viewing_time_by_period?.daily?.length
        ? chartData.viewing_time_by_period.daily
        : chartData.platform_usage_time?.daily ?? [];

    const sortedTimeSeries = [...rawTimeSeries].sort(
      (a, b) => parseDateLabel(a.period).getTime() - parseDateLabel(b.period).getTime()
    );

    const timeOnPageData: DataPoint[] = sortedTimeSeries.map(({ period, seconds }) => ({
      date: period,
      value: seconds,
      parsed: parseDateLabel(period),
    }));

    return {
      pageview: {
        ...base.pageview,
        total: chartData.visitors?.total_visits ?? 0,
        data: pageviewData,
      },
      timeOnPage: {
        ...base.timeOnPage,
        total: timeOnPageData.length
          ? timeOnPageData[timeOnPageData.length - 1]?.value ?? 0
          : 0,
        data: timeOnPageData,
      },
      visitors: {
        ...base.visitors,
        total: chartData.visitors?.total_visitors ?? 0,
        data: visitorData,
      },
    };
  }, [chartData]);

  const range = dateRange ?? { from: null, to: null };
  const selectedMetric = metrics[activeMetric];
  const selectedData = selectedMetric.data;

  const filteredData = useMemo(() => {
    if (!range.from || !range.to) return selectedData;
    return selectedData.filter(
      (point) =>
        point.parsed.getTime() >= range.from!.getTime() &&
        point.parsed.getTime() <= range.to!.getTime()
    );
  }, [range.from, range.to, selectedData]);

  const chartPoints = filteredData.length ? filteredData : selectedData;

  const maxValue = useMemo(() => {
    if (!chartPoints.length) return 0;
    return Math.max(...chartPoints.map((point) => point.value));
  }, [chartPoints]);

  const upperDomain = useMemo(
    () =>
      activeMetric === 'timeOnPage'
        ? maxValue + Math.max(60, maxValue * 0.12)
        : maxValue + Math.max(60, maxValue * 0.12),
    [activeMetric, maxValue]
  );

  const gradientId = `lineGradient-${activeMetric}`;

  const formatRangeLabel = useMemo(() => {
    const fmt = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    if (!range.from || !range.to) return t('dashboard.select-range') ?? 'Select range';
    return `${fmt.format(range.from)} — ${fmt.format(range.to)}`;
  }, [range.from, range.to]);

  const currentTotal =
    chartPoints.length > 0
      ? chartPoints[chartPoints.length - 1].value
      : selectedMetric.total;

  const computedChange = useMemo(() => {
    if (chartPoints.length >= 2) {
      const first = chartPoints[0].value || 0;
      const last = chartPoints[chartPoints.length - 1].value || 0;
      if (first === 0) return selectedMetric.change;
      return ((last - first) / first) * 100;
    }
    return selectedMetric.change;
  }, [chartPoints, selectedMetric.change]);

  const updateRange = (nextRange: { from: Date | null; to: Date | null }) => {
    onDateRangeChange?.(nextRange);
  };

  const applyPreset = (preset: QuickPreset) => {
    setRangePreset(preset);
    const anchor = selectedData[selectedData.length - 1]?.parsed ?? new Date();
    const to = new Date(anchor);
    const from = new Date(anchor);
    const shiftDays = (days: number) => {
      const d = new Date(to);
      d.setDate(to.getDate() - days);
      return d;
    };

    switch (preset) {
      case 'today':
        updateRange({ from: to, to });
        return;
      case 'hourly':
        updateRange({ from: shiftDays(1), to });
        return;
      case 'week':
        updateRange({ from: shiftDays(7), to });
        return;
      case 'month':
        from.setMonth(to.getMonth() - 1);
        break;
      case '3months':
        from.setMonth(to.getMonth() - 3);
        break;
      case 'daily':
        from.setDate(to.getDate() - 14);
        break;
      case 'weekly':
        from.setDate(to.getDate() - 60);
        break;
      case 'monthly':
        from.setMonth(to.getMonth() - 6);
        break;
      case '1year':
        from.setFullYear(to.getFullYear() - 1);
        break;
      case 'yearly':
        from.setFullYear(to.getFullYear() - 1);
        break;
      default:
        break;
    }

    updateRange({ from, to });
  };

  const renderTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null;
    const value = payload[0].value ?? 0;

    return (
      <div className="rounded-lg bg-mainBlue px-3 py-2 text-white shadow-lg">
        <p className="text-xs text-[#e5e5ef] opacity-70">
          {t(selectedMetric.labelKey) ?? selectedMetric.label}
        </p>
        <p className="text-lg font-semibold">
          {activeMetric === 'timeOnPage'
            ? formatDurationFromSeconds(Number(value))
            : Number(value).toLocaleString('en-US')}
        </p>
      </div>
    );
  };

  return (
    <div
      className={cn(
        'rounded-2xl bg-[#f4f7fb] p-5 shadow-sm',
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Title as="h3" className="text-4xl font-bold text-[#112855]">
              {formatHeadline(activeMetric, currentTotal)}
            </Title>
            <span
              className={cn(
                'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                computedChange >= 0
                  ? 'bg-green-50 text-[#22c55e]'
                  : 'bg-red-50 text-red-500'
              )}
            >
              {computedChange >= 0 ? (
                <MdArrowOutward className="h-4 w-4" />
              ) : (
                <FiArrowDownRight className="h-4 w-4" />
              )}
              {Math.abs(computedChange).toFixed(1)}%
            </span>
          </div>
          <Text className="text-sm text-[#64748b]">
            {t(selectedMetric.labelKey) ?? selectedMetric.label}
          </Text>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
          aria-pressed={activeMetric === tab}
          onClick={() => setActiveMetric(tab)}
          className={cn(
            'rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200',
            activeMetric === tab
              ? 'border-transparent bg-[linear-gradient(131deg,#123d8d_0%,#15bb9a_100%)] text-white shadow-lg shadow-blue-100'
              : 'border-[#d7e3f4] bg-white text-[#112855] hover:border-[#112855]/30'
          )}
        >
          {t(metrics[tab].labelKey) ?? metrics[tab].label}
        </button>
      ))}
          <Popover placement="bottom-end">
            <Popover.Trigger>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-[#0f1d44] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#162b5c]"
              >
                <PiCalendarBlank className="h-5 w-5" />
                <span className="hidden sm:inline">{formatRangeLabel}</span>
              </button>
            </Popover.Trigger>
            <Popover.Content className="z-50 w-[420px] max-w-[90vw] rounded-xl border border-[#d7e3f4] bg-white p-4 shadow-2xl">
              {({ setOpen }) => (
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-2">
                    {(
                      [
                        'today',
                        'week',
                        'month',
                        '3months',
                        '1year',
                      ] as QuickPreset[]
                    ).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className={cn(
                          'rounded-full px-3 py-1 text-xs font-semibold transition',
                          rangePreset === preset
                            ? 'bg-[#0f1d44] text-white shadow-sm'
                            : 'bg-[#f1f5f9] text-[#112855] hover:bg-[#e5edf7]'
                        )}
                      >
                        {t('dashboard.preset-' + preset) ??
                          (preset === '3months'
                            ? '3 months'
                            : preset === '1year'
                              ? '1 year'
                              : preset.charAt(0).toUpperCase() + preset.slice(1))}
                      </button>
                    ))}
                  </div>
                  <div className="rounded-xl  bg-[#f8fbff] p-3">
                    <ReactDatePicker
                      inline
                      selectsRange
                      startDate={range.from}
                      endDate={range.to}
                      onChange={(dates) => {
                        const [start, end] = dates as [Date | null, Date | null];
                        setRangePreset('custom');
                        updateRange({ from: start, to: end });
                      }}
                      calendarStartDay={1}
                      monthsShown={1}
                      dayClassName={(date) =>
                        cn(
                          'rounded-md text-sm',
                          range.from &&
                            range.to &&
                            date >= range.from &&
                            date <= range.to &&
                            '!bg-[linear-gradient(131deg,#123d8d_0%,#15bb9a_100%)] !text-white',
                          'hover:!bg-[#e5edf7]'
                        )
                      }
                      weekDayClassName={() => 'text-[#64748b] text-xs font-semibold w-full'}
                      monthClassName={() => 'rounded-lg px-2 pb-2 text-[#0f1d44] !w-full'}
                      calendarClassName='!border-0 bg-trasparent !w-full'
                      renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                        <div className="mb-2 flex items-center justify-between px-2 text-sm font-semibold text-[#0f1d44]">
                          <button
                            type="button"
                            onClick={decreaseMonth}
                            className="rounded-md px-2 py-1 hover:bg-[#e5edf7]"
                          >
                            {'<'}
                          </button>
                          <span>
                            {date.toLocaleString('en-US', {
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                          <button
                            type="button"
                            onClick={increaseMonth}
                            className="rounded-md px-2 py-1 hover:bg-[#e5edf7]"
                          >
                            {'>'}
                          </button>
                        </div>
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#64748b]">
                    <span className="flex items-center gap-2">
                      <PiClockBold className="h-4 w-4" />
                      <span>{t('dashboard.range') ?? 'Range'}</span>
                    </span>
                    <span className="font-semibold text-[#0f1d44]">{formatRangeLabel}</span>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-lg bg-[linear-gradient(131deg,#123d8d_0%,#15bb9a_100%)] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
                    >
                      {t('dashboard.apply') ?? 'Apply'}
                    </button>
                  </div>
                </div>
              )}
            </Popover.Content>
          </Popover>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-white p-4 shadow-inner">
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartPoints}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={selectedMetric.colors.fill} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={selectedMetric.colors.fill} stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickMargin={12}
              />
              <YAxis
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value: number) => formatYAxisValue(value, activeMetric)}
                domain={[0, upperDomain]}
                width={50}
              />
              <Tooltip
                content={renderTooltip}
                cursor={{
                  stroke: selectedMetric.colors.stroke,
                  strokeOpacity: 0.15,
                  strokeWidth: 2,
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={selectedMetric.colors.stroke}
                fill={`url(#${gradientId})`}
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: selectedMetric.colors.stroke,
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
