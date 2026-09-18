'use client';

import {
  PiArrowUpRightBold,
  PiCheckCircleBold,
  PiClockBold,
  PiMapPinLineBold,
  PiPackageBold,
  PiTruckBold,
  PiWarningCircleBold,
} from 'react-icons/pi';
import { Link } from '@core/i18n/routing';
import { routes } from '@/config/routes';

const stats = [
  {
    label: 'Active Shipments',
    value: '148',
    detail: '32 in transit today',
    trend: '+12%',
    icon: PiTruckBold,
  },
  {
    label: 'Pending Quotes',
    value: '27',
    detail: '9 need carrier pricing',
    trend: '+6%',
    icon: PiPackageBold,
  },
  {
    label: 'On-Time Delivery',
    value: '96.4%',
    detail: 'Last 30 days',
    trend: '+2.1%',
    icon: PiCheckCircleBold,
  },
  {
    label: 'Exceptions',
    value: '6',
    detail: '2 require dispatch action',
    trend: '-4',
    icon: PiWarningCircleBold,
  },
];

const shipments = [
  {
    id: 'SS-10482',
    lane: 'Dallas, TX -> Chicago, IL',
    mode: 'Dry Van',
    status: 'In Transit',
    eta: 'Today 18:40',
  },
  {
    id: 'SS-10479',
    lane: 'Los Angeles, CA -> Phoenix, AZ',
    mode: 'Reefer',
    status: 'Pickup Scheduled',
    eta: 'Tomorrow 09:15',
  },
  {
    id: 'SS-10471',
    lane: 'Savannah, GA -> Atlanta, GA',
    mode: 'Drayage',
    status: 'At Port',
    eta: 'Today 14:20',
  },
  {
    id: 'SS-10466',
    lane: 'Seattle, WA -> Denver, CO',
    mode: 'Flatbed',
    status: 'Carrier Assigned',
    eta: 'Jul 12, 11:00',
  },
];

const quoteQueue = [
  {
    customer: 'Northline Manufacturing',
    service: 'Heavy Haul',
    lane: 'Detroit, MI -> Nashville, TN',
    age: '18m',
  },
  {
    customer: 'FreshWay Foods',
    service: 'Reefer',
    lane: 'Fresno, CA -> Las Vegas, NV',
    age: '34m',
  },
  {
    customer: 'Civic Build Group',
    service: 'Flatbed',
    lane: 'Austin, TX -> Tulsa, OK',
    age: '51m',
  },
];

const capacity = [
  { label: 'Dry Van', available: 42, demand: 58 },
  { label: 'Flatbed', available: 18, demand: 24 },
  { label: 'Reefer', available: 12, demand: 21 },
  { label: 'Expedited', available: 8, demand: 10 },
];

export default function ShipSmartDashboard() {
  return (
    <div className="space-y-3 pb-4 2xl:space-y-4">
      <section className="px-2 py-3 2xl:py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0183d0]">
              ShipSmart Operations
            </p>
            <h1 className="mt-2 text-[2rem] font-semibold leading-none tracking-[-0.045em] text-[#111214] sm:text-[2.35rem]">
              Freight Control Dashboard
            </h1>
          </div>
          <div className="flex h-10 items-center gap-2 rounded-full bg-[#07182f] px-4 text-xs font-semibold text-white">
            <span className="h-2 w-2 rounded-full bg-[#03a1fe] shadow-[0_0_0_4px_rgba(3,161,254,0.16)]" />
            <PiClockBold className="h-4 w-4 text-[#03a1fe]" />
            Live operations view
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="group relative min-h-[166px] overflow-hidden rounded-[22px] border border-black/[0.07] bg-white p-4 transition-colors hover:border-[#03a1fe]/30 2xl:p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-xl bg-[#edf7ff] p-3 text-[#0183d0] transition-colors group-hover:bg-[#03a1fe] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-[#0183d0]">
                  {item.trend}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm font-semibold text-[#4f5156]">
                  {item.label}
                </p>
                <p className="mt-1.5 text-[2rem] font-semibold leading-none tracking-[-0.04em] text-[#111214]">
                  {item.value}
                </p>
                <p className="mt-2 text-xs text-[#77797e]">{item.detail}</p>
              </div>
              <span className="absolute inset-x-7 bottom-0 h-[3px] rounded-full bg-[#03a1fe] opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_0.8fr]">
        <div className="min-w-0 rounded-[24px] border border-black/[0.07] bg-white p-4 2xl:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-[-0.035em] text-[#111214]">
                Priority Shipments
              </h2>
              <p className="mt-1 text-sm text-[#77797e]">
                Loads that need dispatch visibility today.
              </p>
            </div>
            <Link
              href={routes.shipments.list}
              aria-label="Open priority shipments"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-black/[0.06] bg-[#edf7ff] text-[#0183d0] transition hover:border-[#03a1fe]/35 hover:bg-[#03a1fe] hover:text-white"
            >
              <PiArrowUpRightBold className="h-4 w-4" />
            </Link>
          </div>

          <div className="shipment-table-scroll mt-4 overflow-x-auto">
            <div className="min-w-[680px]">
              <div className="grid grid-cols-[0.75fr_1.65fr_0.65fr_1fr_0.9fr] gap-3 border-y border-black/[0.07] bg-[#f7f7f5] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#77797e]">
                <span>Load</span>
                <span>Lane</span>
                <span>Mode</span>
                <span>Status</span>
                <span>ETA</span>
              </div>
              {shipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="grid grid-cols-[0.75fr_1.65fr_0.65fr_1fr_0.9fr] gap-3 border-b border-black/[0.07] px-4 py-3.5 text-sm transition-colors hover:bg-[#edf7ff]/70"
                >
                  <span className="font-bold text-[#0183d0]">
                    {shipment.id}
                  </span>
                  <span className="truncate text-[#4f5156]">
                    {shipment.lane.replace('->', '→')}
                  </span>
                  <span className="text-[#77797e]">{shipment.mode}</span>
                  <span className="font-semibold text-[#111214]">
                    {shipment.status}
                  </span>
                  <span className="text-[#77797e]">{shipment.eta}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-black/[0.07] bg-white p-4 2xl:p-5">
          <h2 className="text-xl font-bold tracking-[-0.035em] text-[#111214]">
            Quote Queue
          </h2>
          <p className="mt-1 text-sm text-[#77797e]">
            New quote requests waiting for pricing.
          </p>
          <div className="mt-5 border-t border-black/[0.08]">
            {quoteQueue.map((quote) => (
              <div
                key={`${quote.customer}-${quote.service}`}
                className="border-b border-black/[0.08] py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#111214]">
                      {quote.customer}
                    </p>
                    <p className="mt-1 truncate text-xs text-[#77797e]">
                      {quote.lane.replace('->', '→')}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#edf7ff] px-2.5 py-1 text-[11px] font-bold text-[#0183d0]">
                    {quote.age}
                  </span>
                </div>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#0183d0]">
                  {quote.service}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[24px] border border-black/[0.07] bg-white p-4 2xl:p-5">
          <h2 className="text-xl font-bold tracking-[-0.035em] text-[#111214]">
            Capacity Snapshot
          </h2>
          <div className="mt-5 space-y-5">
            {capacity.map((item) => {
              const percent = Math.round((item.available / item.demand) * 100);
              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-[#111214]">
                      {item.label}
                    </span>
                    <span className="text-xs text-[#77797e]">
                      {item.available}/{item.demand} trucks
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#e6e7e8]">
                    <div
                      className="h-full rounded-full bg-[#03a1fe]"
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[24px] bg-[#07182f] p-4 text-white 2xl:p-6">
          <div className="relative z-[1] flex items-start gap-4">
            <div className="rounded-xl bg-[#03a1fe] p-3 text-white">
              <PiMapPinLineBold className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-[-0.035em] text-white">
                Network Notes
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                Midwest dry van demand is above available capacity. Prioritize
                carrier outreach for Chicago, Indianapolis, and Columbus lanes.
                Reefer requests are increasing across California and Nevada.
              </p>
            </div>
          </div>
          <span className="absolute -bottom-24 -right-20 h-56 w-56 rounded-full border-[38px] border-[#03a1fe]/10" />
        </div>
      </section>
    </div>
  );
}
