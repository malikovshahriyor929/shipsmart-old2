import type { ShipmentDetail } from './types';
import ShipmentStatusBadge from './status-badge';
import {
  PiArrowDownBold,
  PiArrowSquareOutBold,
  PiBroadcastBold,
  PiCalendarBlankBold,
  PiCurrencyDollarBold,
  PiMapPinBold,
  PiPackageBold,
  PiPhoneBold,
  PiSpinnerGapBold,
  PiTruckBold,
  PiUserBold,
  PiXBold,
} from 'react-icons/pi';

const numberFormatter = new Intl.NumberFormat('en-US');
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

function formatDate(value?: string) {
  if (!value) return 'Appointment pending';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatDateTime(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function DataPoint({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-slate-800">
        {value === undefined || value === '' ? '—' : value}
      </dd>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-950">
      <Icon className="h-4 w-4 text-mainBlue" />
      {children}
    </h3>
  );
}

export default function ShipmentDetailPanel({
  shipment,
  loading,
  onClose,
}: {
  shipment: ShipmentDetail;
  loading: boolean;
  onClose?: () => void;
}) {
  return (
    <aside className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {loading ? (
        <div className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden bg-blue-100">
          <div className="h-full w-1/2 animate-pulse bg-blue-600" />
        </div>
      ) : null}

      <div className="sticky top-0 z-[1] border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-950">
                PRO #{shipment.pro}
              </h2>
              <ShipmentStatusBadge status={shipment.status} />
              {loading ? (
                <PiSpinnerGapBold className="h-4 w-4 animate-spin text-mainBlue" />
              ) : null}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {shipment.loadDescription}
            </p>
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close shipment details"
              className="shrink-0 rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBlue"
            >
              <PiXBold className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="max-h-[calc(100vh-168px)] space-y-6 overflow-y-auto p-5">
        <section>
          <SectionTitle icon={PiMapPinBold}>Route & stops</SectionTitle>
          {shipment.stops.length > 0 ? (
            <div className="mt-4 space-y-2">
              {shipment.stops.map((stop, index) => (
                <div key={`${stop.stopNumber}-${stop.type}`}>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${
                          stop.type === 'pickup'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        <PiMapPinBold className="h-4 w-4" />
                      </span>
                      {index < shipment.stops.length - 1 ? (
                        <span className="my-1 h-8 w-px bg-slate-200" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1 pb-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        {stop.type === 'pickup' ? 'Pick up' : 'Delivery'}
                      </p>
                      <p className="mt-1 truncate text-sm font-bold text-slate-900">
                        {stop.name}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {[stop.address, stop.city, stop.state, stop.zip]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-700">
                        <PiCalendarBlankBold className="h-3.5 w-3.5 text-slate-400" />
                        {formatDate(stop.date)}
                        {stop.hours ? ` · ${stop.hours}` : ''}
                      </p>
                    </div>
                  </div>
                  {index < shipment.stops.length - 1 ? (
                    <PiArrowDownBold className="sr-only" />
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-500">
              Stop information will appear when the detail endpoint returns it.
            </p>
          )}
        </section>

        {shipment.macroPointLoad ? (
          <section className="border-t border-slate-100 pt-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <SectionTitle icon={PiBroadcastBold}>
                  MacroPoint live tracking
                </SectionTitle>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold">
                  {shipment.macroPointLoad.orderStatus ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                      {shipment.macroPointLoad.orderStatus}
                    </span>
                  ) : null}
                  {shipment.macroPointLoad.lastUpdated ? (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                      Updated{' '}
                      {formatDateTime(shipment.macroPointLoad.lastUpdated)}
                    </span>
                  ) : null}
                </div>
              </div>
              <a
                href={shipment.macroPointLoad.orderHyperlink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-bold text-slate-700 transition hover:border-mainBlue hover:text-mainBlue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBlue"
              >
                Open
                <PiArrowSquareOutBold className="h-3.5 w-3.5" />
              </a>
            </div>

            <p className="mt-3 text-[11px] leading-4 text-slate-500">
              Open the live order in a new browser tab.
            </p>
          </section>
        ) : null}

        <section className="border-t border-slate-100 pt-5">
          <SectionTitle icon={PiPackageBold}>Load information</SectionTitle>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
            <DataPoint
              label="Equipment"
              value={
                [shipment.equipmentCode, shipment.equipmentDescription]
                  .filter(Boolean)
                  .join(' · ') || shipment.mode
              }
            />
            <DataPoint
              label="Weight"
              value={
                shipment.weight
                  ? `${numberFormatter.format(shipment.weight)} lb`
                  : undefined
              }
            />
            <DataPoint
              label="Customer miles"
              value={
                shipment.customerMiles
                  ? numberFormatter.format(shipment.customerMiles)
                  : undefined
              }
            />
            <DataPoint
              label="Truck miles"
              value={
                shipment.truckMiles
                  ? numberFormatter.format(shipment.truckMiles)
                  : undefined
              }
            />
            <DataPoint label="Truck #" value={shipment.truckNumber} />
            <DataPoint label="Dispatcher" value={shipment.dispatcher} />
            <DataPoint
              label="Customer ref"
              value={shipment.customerReference}
            />
            <DataPoint label="Mode" value={shipment.mode} />
          </dl>
        </section>

        <section className="border-t border-slate-100 pt-5">
          <SectionTitle icon={PiUserBold}>Customer & carrier</SectionTitle>
          <div className="mt-4 grid gap-3">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Customer
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {shipment.customer.name}
              </p>
              {shipment.customer.phone ? (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <PiPhoneBold className="h-3.5 w-3.5" />
                  {shipment.customer.phone}
                </p>
              ) : null}
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Carrier
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {shipment.carrier?.name ?? 'Carrier not assigned'}
              </p>
              {shipment.carrier ? (
                <p className="mt-1 text-xs text-slate-500">
                  {[
                    shipment.carrier.mcNumber
                      ? `MC ${shipment.carrier.mcNumber}`
                      : '',
                    shipment.carrier.dotNumber
                      ? `DOT ${shipment.carrier.dotNumber}`
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' · ') || 'Authority details unavailable'}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 pt-5">
          <SectionTitle icon={PiCurrencyDollarBold}>Financials</SectionTitle>
          <dl className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-slate-50 p-3">
              <DataPoint
                label="Customer rate"
                value={currencyFormatter.format(shipment.customerTotal)}
              />
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <DataPoint
                label="Carrier rate"
                value={currencyFormatter.format(shipment.carrierTotal)}
              />
            </div>
            <div className="rounded-lg bg-emerald-50 p-3">
              <DataPoint
                label="Gross profit"
                value={currencyFormatter.format(shipment.grossProfit)}
              />
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <DataPoint
                label="Net margin"
                value={`${(shipment.netMargin * 100).toFixed(1)}%`}
              />
            </div>
          </dl>
        </section>

        {shipment.drivers.length > 0 ? (
          <section className="border-t border-slate-100 pt-5">
            <SectionTitle icon={PiTruckBold}>Drivers</SectionTitle>
            <div className="mt-3 space-y-2">
              {shipment.drivers.map((driver) => (
                <div
                  key={`${driver.name}-${driver.phone}`}
                  className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2.5"
                >
                  <p className="text-sm font-semibold text-slate-800">
                    {driver.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {driver.phone ?? '—'}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {shipment.requirements.length > 0 ? (
          <section className="border-t border-slate-100 pt-5">
            <SectionTitle icon={PiPackageBold}>Requirements</SectionTitle>
            <div className="mt-3 flex flex-wrap gap-2">
              {shipment.requirements.map((requirement) => (
                <span
                  key={requirement}
                  className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700"
                >
                  {requirement}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {shipment.specialInstructions ? (
          <section className="border-t border-slate-100 pt-5">
            <SectionTitle icon={PiPackageBold}>
              Special instructions
            </SectionTitle>
            <p className="mt-3 whitespace-pre-line rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              {shipment.specialInstructions}
            </p>
          </section>
        ) : null}
      </div>
    </aside>
  );
}
