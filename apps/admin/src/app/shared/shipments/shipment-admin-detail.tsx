import type { ReactNode } from 'react';
import {
  PiArrowSquareOutBold,
  PiBroadcastBold,
  PiCalendarBlankBold,
  PiClockBold,
  PiCurrencyDollarBold,
  PiMapPinBold,
  PiPackageBold,
  PiPhoneBold,
  PiSpinnerGapBold,
  PiTruckBold,
  PiUserBold,
} from 'react-icons/pi';
import RawPayloadInspector from './raw-payload-inspector';
import ShipmentStatusBadge from './status-badge';
import type { ShipmentDetail, ShipmentStop } from './types';

const numberFormatter = new Intl.NumberFormat('en-US');
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

function formatDate(value?: string) {
  if (!value) return 'Appointment pending';
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T12:00:00`
    : value;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatDateTime(value?: string) {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date);
}

function AdminSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="flex items-center gap-2 text-sm font-bold text-slate-950">
        <Icon className="h-4 w-4 text-mainBlue" />
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DetailRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value?: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-3 border-b border-slate-100 py-2 first:pt-0 last:border-0 last:pb-0">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd
        className={`break-words text-xs font-semibold text-slate-800 ${
          valueClassName ?? ''
        }`}
      >
        {value === undefined || value === '' ? '—' : value}
      </dd>
    </div>
  );
}

function SummaryMetric({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
        <Icon className="h-4 w-4 text-mainBlue" />
        {label}
      </div>
      <p
        className="mt-2 truncate text-sm font-bold text-slate-950"
        title={value}
      >
        {value}
      </p>
      {detail ? (
        <p className="mt-1 truncate text-[11px] text-slate-500" title={detail}>
          {detail}
        </p>
      ) : null}
    </div>
  );
}

function stopLocation(stop?: ShipmentStop) {
  if (!stop) return 'Location pending';
  return [stop.city, stop.state].filter(Boolean).join(', ') || stop.name;
}

function stopAddress(stop?: ShipmentStop) {
  if (!stop) return '';
  return [stop.address, stop.city, stop.state, stop.zip]
    .filter(Boolean)
    .join(', ');
}

function RouteStopBlock({
  label,
  stop,
  align = 'left',
}: {
  label: string;
  stop?: ShipmentStop;
  align?: 'left' | 'right';
}) {
  return (
    <div className={align === 'right' ? 'text-right' : undefined}>
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-base font-bold tracking-[-0.02em] text-slate-950">
        {stopLocation(stop)}
      </p>
      <p className="mt-1 text-xs leading-5 text-slate-500">
        {stopAddress(stop)}
      </p>
      <p
        className={`mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700 ${
          align === 'right' ? 'justify-end' : ''
        }`}
      >
        <PiCalendarBlankBold className="h-3.5 w-3.5 text-mainBlue" />
        {formatDate(stop?.date)}
        {stop?.hours ? ` · ${stop.hours}` : ''}
      </p>
    </div>
  );
}

function RoutePanel({ shipment }: { shipment: ShipmentDetail }) {
  const pickup =
    shipment.stops.find((stop) => stop.type === 'pickup') ?? shipment.stops[0];
  const delivery =
    shipment.stops.find((stop) => stop.type === 'delivery') ??
    shipment.stops.at(-1);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-start">
        <RouteStopBlock label="Pickup" stop={pickup} />
        <div
          aria-hidden="true"
          className="relative mt-8 hidden h-px w-24 bg-slate-200 sm:block lg:w-36"
        >
          <span className="absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-mainBlue bg-white" />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-mainBlue ring-4 ring-blue-50" />
          <PiTruckBold className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 bg-white px-0.5 text-mainBlue" />
        </div>
        <RouteStopBlock label="Delivery" stop={delivery} align="right" />
      </div>
    </section>
  );
}

function TrackingPanel({ shipment }: { shipment: ShipmentDetail }) {
  const tracking = shipment.macroPointLoad;
  if (!tracking) return null;

  const trackingStart = [
    tracking.trackStartDate ? formatDate(tracking.trackStartDate) : '',
    tracking.trackStartTime,
    tracking.trackStartTimezone,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <PiBroadcastBold className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
              Live tracking
            </p>
            <h2 className="mt-0.5 text-sm font-bold text-slate-950">
              {tracking.orderStatus ?? 'Tracking status unavailable'}
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              Last update: {formatDateTime(tracking.lastUpdated)}
            </p>
          </div>
        </div>
        <a
          href={tracking.orderHyperlink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-mainBlue px-4 text-xs font-bold text-white transition hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBlue focus-visible:ring-offset-2"
        >
          Track on MacroPoint
          <PiArrowSquareOutBold className="h-4 w-4" />
        </a>
      </div>
      <dl className="grid sm:grid-cols-2 xl:grid-cols-4">
        <div className="border-b border-slate-100 px-5 py-3 sm:border-r xl:border-b-0">
          <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
            Tracking started
          </dt>
          <dd className="mt-1 text-xs font-semibold text-slate-800">
            {trackingStart || 'Not available'}
          </dd>
        </div>
        <div className="border-b border-slate-100 px-5 py-3 xl:border-b-0 xl:border-r">
          <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
            Update frequency
          </dt>
          <dd className="mt-1 text-xs font-semibold text-slate-800">
            {tracking.trackingInterval
              ? `Every ${tracking.trackingInterval} minutes`
              : 'Not available'}
          </dd>
        </div>
        <div className="border-b border-slate-100 px-5 py-3 sm:border-b-0 sm:border-r">
          <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
            Tracking duration
          </dt>
          <dd className="mt-1 text-xs font-semibold text-slate-800">
            {tracking.trackingDuration
              ? `${numberFormatter.format(tracking.trackingDuration)} hours`
              : 'Not available'}
          </dd>
        </div>
        <div className="px-5 py-3">
          <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
            Driver phone
          </dt>
          <dd className="mt-1 text-xs font-semibold text-slate-800">
            {tracking.driverCell ? (
              <a
                className="hover:text-mainBlue hover:underline"
                href={`tel:${tracking.driverCell}`}
              >
                {tracking.driverCell}
              </a>
            ) : (
              'Not available'
            )}
          </dd>
        </div>
      </dl>
    </section>
  );
}

export default function ShipmentAdminDetail({
  shipment,
  loading,
}: {
  shipment: ShipmentDetail;
  loading: boolean;
}) {
  const equipment =
    [shipment.equipmentCode, shipment.equipmentDescription]
      .filter(Boolean)
      .join(' · ') || shipment.mode;

  return (
    <div className="relative min-w-0">
      {loading ? (
        <div className="fixed right-5 top-5 z-50 inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs font-bold text-mainBlue shadow-lg">
          <PiSpinnerGapBold className="h-4 w-4 animate-spin" />
          Refreshing shipment
        </div>
      ) : null}

      <header className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-[-0.035em] text-slate-950 sm:text-3xl">
              PRO #{shipment.pro}
            </h1>
            <ShipmentStatusBadge status={shipment.status} />
          </div>
          <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs font-medium text-slate-500">
            <span>{shipment.loadDescription}</span>
            {shipment.truckNumber ? (
              <>
                <span aria-hidden="true">·</span>
                <span>Truck {shipment.truckNumber}</span>
              </>
            ) : null}
            {shipment.dispatcher ? (
              <>
                <span aria-hidden="true">·</span>
                <span>Dispatcher: {shipment.dispatcher}</span>
              </>
            ) : null}
            <span aria-hidden="true">·</span>
            <span>Updated {formatDateTime(shipment.updatedAt)}</span>
          </p>
        </div>
      </header>

      <section
        aria-label="Shipment summary"
        className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <SummaryMetric
          icon={PiPackageBold}
          label="Freight"
          value={shipment.loadDescription}
          detail={
            shipment.customerReference
              ? `Customer ref: ${shipment.customerReference}`
              : 'No customer reference'
          }
        />
        <SummaryMetric
          icon={PiTruckBold}
          label="Equipment"
          value={equipment}
          detail={
            shipment.truckNumber
              ? `Assigned truck: ${shipment.truckNumber}`
              : 'Truck not assigned'
          }
        />
        <SummaryMetric
          icon={PiCurrencyDollarBold}
          label="Customer rate"
          value={currencyFormatter.format(shipment.customerTotal)}
          detail={`Carrier rate: ${currencyFormatter.format(
            shipment.carrierTotal
          )}`}
        />
        <SummaryMetric
          icon={PiClockBold}
          label="Distance & weight"
          value={
            shipment.customerMiles
              ? `${numberFormatter.format(shipment.customerMiles)} miles`
              : 'Mileage pending'
          }
          detail={
            shipment.weight
              ? `${numberFormatter.format(shipment.weight)} lb`
              : 'Weight pending'
          }
        />
      </section>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-4">
          <RoutePanel shipment={shipment} />
          <TrackingPanel shipment={shipment} />
          {shipment.rawPayload ? (
            <RawPayloadInspector payload={shipment.rawPayload} />
          ) : (
            <section className="rounded-xl border border-dashed border-slate-300 bg-white p-5">
              <h2 className="text-sm font-bold text-slate-900">
                Complete integration payload
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                Raw payload data is not available for this fallback row.
              </p>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <AdminSection icon={PiPackageBold} title="Load information">
            <dl>
              <DetailRow label="Mode" value={shipment.mode} />
              <DetailRow label="Equipment" value={equipment} />
              <DetailRow
                label="Weight"
                value={
                  shipment.weight
                    ? `${numberFormatter.format(shipment.weight)} lb`
                    : undefined
                }
              />
              <DetailRow
                label="Billable weight"
                value={
                  shipment.billableWeight
                    ? `${numberFormatter.format(shipment.billableWeight)} lb`
                    : undefined
                }
              />
              <DetailRow
                label="Customer miles"
                value={
                  shipment.customerMiles
                    ? numberFormatter.format(shipment.customerMiles)
                    : undefined
                }
              />
              <DetailRow
                label="Truck miles"
                value={
                  shipment.truckMiles
                    ? numberFormatter.format(shipment.truckMiles)
                    : undefined
                }
              />
              <DetailRow label="Truck" value={shipment.truckNumber} />
              <DetailRow label="Dispatcher" value={shipment.dispatcher} />
              <DetailRow
                label="Customer ref"
                value={shipment.customerReference}
              />
              <DetailRow
                label="Created"
                value={formatDateTime(shipment.createdAt)}
              />
            </dl>
          </AdminSection>

          <AdminSection icon={PiUserBold} title="Customer & carrier">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  Customer
                </p>
                <p className="mt-1 text-xs font-bold text-slate-900">
                  {shipment.customer.name}
                </p>
                {shipment.customer.phone ? (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <PiPhoneBold className="h-3.5 w-3.5" />
                    {shipment.customer.phone}
                  </p>
                ) : null}
              </div>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  Carrier
                </p>
                <p className="mt-1 text-xs font-bold text-slate-900">
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
                      shipment.carrier.scacNumber
                        ? `SCAC ${shipment.carrier.scacNumber}`
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' · ') || 'Authority details unavailable'}
                  </p>
                ) : null}
              </div>
            </div>
          </AdminSection>

          <AdminSection icon={PiCurrencyDollarBold} title="Financials">
            <dl>
              <DetailRow
                label="Customer rate"
                value={currencyFormatter.format(shipment.customerTotal)}
              />
              <DetailRow
                label="Carrier rate"
                value={currencyFormatter.format(shipment.carrierTotal)}
              />
              <DetailRow
                label="Gross profit"
                value={currencyFormatter.format(shipment.grossProfit)}
                valueClassName="text-emerald-700"
              />
              <DetailRow
                label="Net margin"
                value={`${(shipment.netMargin * 100).toFixed(1)}%`}
                valueClassName="text-emerald-700"
              />
            </dl>
          </AdminSection>

          <AdminSection icon={PiTruckBold} title="Drivers">
            {shipment.drivers.length > 0 ? (
              <ol className="space-y-3">
                {shipment.drivers.map((driver, index) => (
                  <li
                    key={`${driver.name}-${driver.phone}`}
                    className="flex gap-2 text-xs"
                  >
                    <span className="font-bold text-slate-400">
                      {index + 1}.
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">{driver.name}</p>
                      <p className="mt-0.5 text-slate-500">
                        {driver.phone ?? 'Phone unavailable'}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs text-slate-500">No drivers assigned.</p>
            )}
          </AdminSection>

          <AdminSection icon={PiMapPinBold} title="Requirements">
            {shipment.requirements.length > 0 ? (
              <ul className="space-y-2">
                {shipment.requirements.map((requirement) => (
                  <li
                    key={requirement}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-mainBlue" />
                    {requirement}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">No special requirements.</p>
            )}
          </AdminSection>

          {shipment.specialInstructions ? (
            <AdminSection icon={PiMapPinBold} title="Special instructions">
              <p className="whitespace-pre-line text-xs leading-5 text-slate-600">
                {shipment.specialInstructions}
              </p>
            </AdminSection>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
