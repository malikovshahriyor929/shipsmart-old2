'use client';

import { useMemo, useState } from 'react';
import { PiMagnifyingGlassBold } from 'react-icons/pi';

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type PayloadRow = {
  path: string;
  value: string;
  valueType: string;
  isEmpty: boolean;
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

const dateOnlyFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T/;

const GROUP_LABELS: Record<string, string> = {
  accessorial_lines: 'Accessorial charges',
  bids: 'Load bids',
  bill_to: 'Billing account',
  carrier: 'Carrier profile',
  carrier_bids: 'Carrier bids',
  consignee_confirmation_notes: 'Delivery confirmation notes',
  created_by_user: 'Created by',
  cross_town_dest_ramp: 'Destination transfer ramp',
  cross_town_pu_ramp: 'Pickup transfer ramp',
  customer: 'Customer profile',
  customer_confirmation_notes: 'Customer confirmation notes',
  dest_ramp: 'Destination ramp',
  dispatcher_actual: 'Actual dispatcher',
  dispatcher_assigned_user: 'Assigned dispatcher',
  dynamic_reference_tags: 'Reference tags',
  events: 'Shipment events',
  instruction: 'Instructions',
  intermodal_type: 'Intermodal details',
  items: 'Freight items',
  lane_price_weights: 'Lane pricing',
  load_info: 'Load information',
  lock: 'Record lock',
  macropoint_load: 'MacroPoint tracking',
  mode_record: 'Transportation mode',
  notes: 'Internal notes',
  notes_count: 'Notes summary',
  office: 'Office',
  open_events: 'Open events',
  pick_stops: 'Pickup and delivery stops',
  pickup_confirmation_notes: 'Pickup confirmation notes',
  pickup_ramp: 'Pickup ramp',
  pro: 'PRO number',
  repeated_shipment_pro: 'Related shipment',
  reserved_by_user: 'Reserved by',
  sales_representative: 'Sales representative',
  selected_ltl_quote: 'Selected LTL quote',
  service_representative_user: 'Service representative',
  shipment_critical_update_log: 'Critical update history',
  shipment_subscriptions: 'Shipment notifications',
  status: 'Shipment status',
  tariff: 'Tariff',
  tenant: 'Organization',
};

const INITIALLY_OPEN_GROUPS = new Set([
  'load_info',
  'pick_stops',
  'instruction',
  'macropoint_load',
]);

function isRecord(value: JsonValue): value is { [key: string]: JsonValue } {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function displayValue(value: JsonValue): string {
  if (value === null || value === '') return 'Not provided';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'string') {
    if (ISO_DATE_PATTERN.test(value)) {
      return dateOnlyFormatter.format(new Date(`${value}T12:00:00`));
    }
    if (ISO_DATE_TIME_PATTERN.test(value)) {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) return dateFormatter.format(date);
    }
    return value;
  }
  return String(value);
}

function humanizeSegment(value: string) {
  const withItems = value.replace(/\[(\d+)\]/g, (_, index: string) => {
    return ` · Item ${Number(index) + 1}`;
  });
  const words = withItems.replaceAll('_', ' ').trim();
  return words.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function humanizePath(path: string) {
  return path.split('.').map(humanizeSegment).join(' › ');
}

function groupLabel(groupName: string) {
  return GROUP_LABELS[groupName] ?? humanizeSegment(groupName);
}

function flattenValue(
  value: JsonValue,
  path = '',
  rows: PayloadRow[] = []
): PayloadRow[] {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      rows.push({
        path: path || 'value',
        value: 'None',
        valueType: 'array',
        isEmpty: true,
      });
      return rows;
    }

    value.forEach((entry, index) => {
      flattenValue(entry, `${path}[${index}]`, rows);
    });
    return rows;
  }

  if (isRecord(value)) {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      rows.push({
        path: path || 'value',
        value: 'None',
        valueType: 'object',
        isEmpty: true,
      });
      return rows;
    }

    entries.forEach(([key, entry]) => {
      flattenValue(entry, path ? `${path}.${key}` : key, rows);
    });
    return rows;
  }

  rows.push({
    path: path || 'value',
    value: displayValue(value),
    valueType: value === null ? 'null' : typeof value,
    isEmpty: value === null || value === '',
  });
  return rows;
}

function normalizePayload(payload: unknown): JsonValue {
  if (payload === undefined) return {};
  return JSON.parse(JSON.stringify(payload)) as JsonValue;
}

function PayloadTable({ rows }: { rows: PayloadRow[] }) {
  return (
    <div className="max-h-[460px] overflow-auto border-t border-slate-200">
      <table className="w-full table-fixed border-collapse text-left">
        <thead className="sticky top-0 z-[1] bg-slate-50">
          <tr className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
            <th className="w-[46%] border-b border-slate-200 px-3 py-2">
              Field
            </th>
            <th className="border-b border-slate-200 px-3 py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={`${row.path}-${index}`}
              className="align-top text-[11px] odd:bg-white even:bg-slate-50/60"
            >
              <td className="break-words border-b border-r border-slate-100 px-3 py-2 leading-5">
                <span className="block text-[11px] font-semibold text-slate-700">
                  {humanizePath(row.path)}
                </span>
                <span className="mt-0.5 block break-all font-mono text-[9px] text-slate-400">
                  {row.path}
                </span>
              </td>
              <td className="break-words border-b border-slate-100 px-3 py-2 text-[11px] font-medium leading-5 text-slate-800">
                <span
                  className={
                    row.isEmpty
                      ? 'font-normal italic text-slate-400'
                      : undefined
                  }
                >
                  {row.value}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function RawPayloadInspector({ payload }: { payload: unknown }) {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { groups, totalFields } = useMemo(() => {
    const normalizedPayload = normalizePayload(payload);
    return {
      groups: isRecord(normalizedPayload)
        ? Object.entries(normalizedPayload)
        : [['payload', normalizedPayload] as const],
      totalFields: flattenValue(normalizedPayload).length,
    };
  }, [payload]);
  const normalizedQuery = query.trim().toLowerCase();

  return (
    <details
      onToggle={(event) => setIsExpanded(event.currentTarget.open)}
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-mainBlue [&::-webkit-details-marker]:hidden">
        <div>
          <h2 className="text-sm font-bold text-slate-950">
            Additional shipment data
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Search all {totalFields.toLocaleString()} TMS fields when you need
            deeper details
          </p>
        </div>
        <span className="text-xs font-bold text-mainBlue group-open:hidden">
          Expand
        </span>
        <span className="hidden text-xs font-bold text-mainBlue group-open:inline">
          Collapse
        </span>
      </summary>

      {isExpanded ? (
        <div className="border-t border-slate-200 bg-slate-50/50 p-3">
          <label className="relative mb-3 block">
            <span className="sr-only">Search shipment data</span>
            <PiMagnifyingGlassBold className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search fields, values, or source names"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-mainBlue focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <div className="grid items-start gap-3 xl:grid-cols-2">
            {groups.map(([groupName, groupValue]) => {
              const allRows = flattenValue(groupValue);
              const rows = normalizedQuery
                ? allRows.filter((row) => {
                    const searchValue = [
                      groupName,
                      groupLabel(groupName),
                      row.path,
                      humanizePath(row.path),
                      row.value,
                    ]
                      .join(' ')
                      .toLowerCase();
                    return searchValue.includes(normalizedQuery);
                  })
                : allRows;
              if (rows.length === 0) return null;

              return (
                <details
                  key={groupName}
                  open={
                    normalizedQuery.length > 0 ||
                    INITIALLY_OPEN_GROUPS.has(groupName)
                  }
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-xs font-bold text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-mainBlue [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0">
                      <span className="block truncate">
                        {groupLabel(groupName)}
                      </span>
                      <span className="mt-0.5 block truncate font-mono text-[9px] font-normal text-slate-400">
                        {groupName}
                      </span>
                    </span>
                    <span className="shrink-0 rounded bg-slate-100 px-2 py-0.5 font-sans text-[10px] font-bold text-slate-500">
                      {normalizedQuery
                        ? `${rows.length} of ${allRows.length}`
                        : rows.length}
                    </span>
                  </summary>
                  <PayloadTable rows={rows} />
                </details>
              );
            })}
          </div>
        </div>
      ) : null}
    </details>
  );
}
