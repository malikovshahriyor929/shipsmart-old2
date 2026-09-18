'use client';

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  PiArrowClockwiseBold,
  PiCaretLeftBold,
  PiCaretRightBold,
  PiDownloadSimpleBold,
  PiFunnelBold,
  PiMagnifyingGlassBold,
  PiPackageBold,
  PiTruckBold,
  PiWarningCircleBold,
} from 'react-icons/pi';
import { getShipments } from './api';
import { demoShipments } from './demo-data';
import ShipmentTable from './shipment-table';
import type { ShipmentDataSource, ShipmentListItem } from './types';

const PAGE_SIZES = [20, 35, 50];

function escapeCsv(value: string | number) {
  const text = String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadShipments(shipments: ShipmentListItem[]) {
  const header = [
    'PRO',
    'Status',
    'Customer',
    'Carrier',
    'Description',
    'Customer Rate',
    'Carrier Rate',
    'Margin',
    'Mode',
  ];
  const rows = shipments.map((shipment) => [
    shipment.pro,
    shipment.status,
    shipment.customer.name,
    shipment.carrier?.name ?? '',
    shipment.loadDescription,
    shipment.customerTotal,
    shipment.carrierTotal,
    shipment.customerTotal - shipment.carrierTotal,
    shipment.mode,
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map(escapeCsv).join(','))
    .join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'shipments.csv';
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function ShipmentsWorkspace() {
  const [shipments, setShipments] = useState<ShipmentListItem[]>(demoShipments);
  const [source, setSource] = useState<ShipmentDataSource>('demo');
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [apiNotice, setApiNotice] = useState('');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [status, setStatus] = useState('ACTIVE');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    setIsRefreshing(true);
    try {
      const response = await getShipments(signal);
      if (response.length === 0) {
        throw new Error('The shipment endpoint returned an empty list.');
      }
      setShipments(response);
      setSource('api');
      setApiNotice('');
    } catch {
      if (signal?.aborted) return;
      setShipments(demoShipments);
      setSource('demo');
      setApiNotice(
        'API unavailable — showing attached sample data. Click Refresh to retry.'
      );
    } finally {
      if (!signal?.aborted) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void refresh(controller.signal);
    return () => controller.abort();
  }, [refresh]);

  useEffect(() => {
    setPage(1);
  }, [deferredQuery, status, pageSize]);

  const statuses = useMemo(
    () =>
      Array.from(new Set(shipments.map((shipment) => shipment.status))).sort(),
    [shipments]
  );

  const statusCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const shipment of shipments) {
      counts.set(shipment.status, (counts.get(shipment.status) ?? 0) + 1);
    }
    return counts;
  }, [shipments]);

  const filteredShipments = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();
    return shipments.filter((shipment) => {
      const matchesStatus =
        status === 'ALL' ||
        (status === 'ACTIVE'
          ? !['DELIVERED', 'VOIDED'].includes(shipment.status)
          : shipment.status === status);
      if (!matchesStatus) return false;
      if (!normalizedQuery) return true;

      return [
        shipment.pro,
        shipment.status,
        shipment.customer.name,
        shipment.carrier?.name ?? '',
        shipment.loadDescription,
        shipment.mode,
      ].some((value) => String(value).toLowerCase().includes(normalizedQuery));
    });
  }, [deferredQuery, shipments, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredShipments.length / pageSize)
  );
  const safePage = Math.min(page, totalPages);
  const visibleShipments = filteredShipments.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );
  const startRecord =
    filteredShipments.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endRecord = Math.min(safePage * pageSize, filteredShipments.length);

  const activeCount = shipments.filter(
    (shipment) => !['DELIVERED', 'VOIDED'].includes(shipment.status)
  ).length;
  const unassignedCount = shipments.filter(
    (shipment) => shipment.carrier === null
  ).length;

  return (
    <div className="min-w-0 space-y-4 pb-8">
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mainBlue text-white">
                <PiTruckBold className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-950">
                  Active Shipments
                </h1>
                <p className="mt-0.5 text-sm text-slate-500">
                  Dispatch, carrier and load visibility in one table.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-2 text-xs font-semibold ${
                source === 'api'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-amber-200 bg-amber-50 text-amber-800'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  source === 'api' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              {source === 'api' ? 'Live API' : 'Sample data'}
            </span>
            <button
              type="button"
              onClick={() => void refresh()}
              disabled={isRefreshing}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
            >
              <PiArrowClockwiseBold
                className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex items-center gap-3 px-5 py-3">
            <PiPackageBold className="h-5 w-5 text-mainBlue" />
            <div>
              <p className="text-xs text-slate-500">Total shipments</p>
              <p className="text-lg font-bold text-slate-950">
                {shipments.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3">
            <PiTruckBold className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs text-slate-500">Active loads</p>
              <p className="text-lg font-bold text-slate-950">{activeCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3">
            <PiWarningCircleBold className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-xs text-slate-500">Carrier unassigned</p>
              <p className="text-lg font-bold text-slate-950">
                {unassignedCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      {apiNotice ? (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <PiWarningCircleBold className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="line-clamp-2">{apiNotice}</p>
        </div>
      ) : null}

      <div className="min-w-0">
        <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-3">
            <div className="relative min-w-[240px] flex-1 sm:max-w-md">
              <PiMagnifyingGlassBold className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search PRO, customer, carrier or description"
                className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-xs font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-mainBlue focus:ring-2 focus:ring-mainBlue/10"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="relative">
                <PiFunnelBold className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  aria-label="Filter shipments by status"
                  className="h-9 rounded-md border border-slate-200 bg-white pl-9 pr-8 text-xs font-bold text-slate-700 outline-none focus:border-mainBlue"
                >
                  <option value="ACTIVE">Active ({activeCount})</option>
                  <option value="ALL">All ({shipments.length})</option>
                  {statuses.map((option) => (
                    <option key={option} value={option}>
                      {option} ({statusCounts.get(option)})
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={() => downloadShipments(filteredShipments)}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-mainBlue px-3 text-xs font-bold text-white transition hover:bg-[#19376f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBlue focus-visible:ring-offset-2"
              >
                <PiDownloadSimpleBold className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          </div>

          {visibleShipments.length > 0 ? (
            <ShipmentTable shipments={visibleShipments} />
          ) : (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
              <PiMagnifyingGlassBold className="h-8 w-8 text-slate-300" />
              <h2 className="mt-3 text-sm font-bold text-slate-800">
                No shipments found
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Try another search or status filter.
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>
                Showing{' '}
                <strong className="text-slate-800">{startRecord}</strong>
                {'–'}
                <strong className="text-slate-800">{endRecord}</strong> of{' '}
                <strong className="text-slate-800">
                  {filteredShipments.length}
                </strong>
              </span>
              <label className="flex items-center gap-2">
                Rows
                <select
                  value={pageSize}
                  onChange={(event) => setPageSize(Number(event.target.value))}
                  className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs font-bold text-slate-700"
                >
                  {PAGE_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={safePage === 1}
                aria-label="Previous page"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:text-mainBlue disabled:cursor-not-allowed disabled:opacity-40"
              >
                <PiCaretLeftBold className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-[72px] text-center text-xs font-semibold text-slate-600">
                {safePage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={safePage === totalPages}
                aria-label="Next page"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:text-mainBlue disabled:cursor-not-allowed disabled:opacity-40"
              >
                <PiCaretRightBold className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
