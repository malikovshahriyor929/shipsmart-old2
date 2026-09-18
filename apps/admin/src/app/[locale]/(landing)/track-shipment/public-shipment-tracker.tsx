'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Radar,
  Search,
  ShieldCheck,
  Truck,
} from 'lucide-react';

const LANDING_ASSET_ROOT = '/shipsmart-landing';

const MACROPOINT_URL =
  'https://MacroPoint-Lite.com/Gateway.aspx?Token=862c42fb-0214-4671-97cd-4d0bcc62b89a&Resource=OrderDetail';

const PUBLIC_SHIPMENT = {
  pro: '10444',
  status: 'Dispatched',
  description: 'Palletized lumber',
  equipment: 'Van',
  pickup: {
    city: 'Arcata, CA',
    date: 'Jul 20, 2026',
    time: '11:00 AM',
  },
  delivery: {
    city: 'Forney, TX',
    date: 'Jul 22, 2026',
    time: '8:00 AM–4:00 PM',
  },
} as const;

const trackingSteps = [
  {
    number: '01',
    title: 'Enter your load number',
    text: 'Use the ShipSmart load number provided by your logistics specialist.',
  },
  {
    number: '02',
    title: 'Review the latest status',
    text: 'See pickup, delivery, equipment, and the shipment’s current milestone.',
  },
  {
    number: '03',
    title: 'Open live visibility',
    text: 'Continue to the secure tracking view for real-time location updates.',
  },
] as const;

function RouteStop({
  type,
  city,
  date,
  time,
}: {
  type: 'Pickup' | 'Delivery';
  city: string;
  date: string;
  time: string;
}) {
  return (
    <div className="relative min-w-0 pl-10">
      <span className="absolute left-0 top-0 grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-white/10 text-[#55b8ff]">
        <MapPin className="h-3.5 w-3.5" />
      </span>
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">
        {type}
      </p>
      <p className="mt-1 text-sm font-bold text-white">{city}</p>
      <p className="mt-1 flex items-center gap-1.5 text-xs leading-5 text-white/50">
        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
        {date} · {time}
      </p>
    </div>
  );
}

function ShipmentResult() {
  return (
    <section
      aria-label={`Shipment ${PUBLIC_SHIPMENT.pro} summary`}
      className="mt-5 overflow-hidden rounded-[1.75rem] bg-[#0b2b4d] p-5 text-white shadow-[0_22px_60px_rgba(6,25,48,.18)] sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">
            Shipment
          </p>
          <p className="mt-1 text-xl font-bold tracking-[-0.035em]">
            #{PUBLIC_SHIPMENT.pro}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f7ff] px-3.5 py-2 text-xs font-bold text-[#0878bd]">
          <CheckCircle2 className="h-4 w-4" />
          {PUBLIC_SHIPMENT.status}
        </span>
      </div>

      <div className="relative mt-6 grid gap-6 sm:grid-cols-2">
        <span
          aria-hidden="true"
          className="absolute left-[13px] top-7 hidden h-[calc(100%-3.5rem)] w-px bg-white/10 sm:block"
        />
        <RouteStop type="Pickup" {...PUBLIC_SHIPMENT.pickup} />
        <RouteStop type="Delivery" {...PUBLIC_SHIPMENT.delivery} />
      </div>

      <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-[#55b8ff]">
            <Package className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/35">
              Freight
            </p>
            <p className="mt-0.5 text-xs font-semibold text-white/80">
              {PUBLIC_SHIPMENT.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-[#55b8ff]">
            <Truck className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/35">
              Equipment
            </p>
            <p className="mt-0.5 text-xs font-semibold text-white/80">
              {PUBLIC_SHIPMENT.equipment}
            </p>
          </div>
        </div>
      </div>

      <a
        href={MACROPOINT_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#03a1fe] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#008de5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#03a1fe]/30"
      >
        Open live tracking
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </section>
  );
}

function TrackingVisual() {
  return (
    <div className="relative min-h-[34rem] overflow-hidden rounded-[2rem] bg-[#0b2b4d] sm:min-h-[42rem] xl:min-h-[720px]">
      <Image
        src={`${LANDING_ASSET_ROOT}/gps-ship.png`}
        alt="ShipSmart trucks connected across a live digital route map"
        fill
        priority
        unoptimized
        sizes="(max-width: 1280px) 100vw, 760px"
        className="object-cover object-center"
      />

      <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#08223d]/70 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md sm:left-8 sm:top-8">
        <Radar className="h-4 w-4 text-[#55b8ff]" />
        Live shipment visibility
      </div>
      <p className="absolute right-6 top-8 hidden text-[11px] font-bold uppercase tracking-[0.16em] text-white/65 sm:block">
        Shipsmart tracking
      </p>

      <div className="absolute inset-x-5 bottom-5 rounded-[1.6rem] border border-white/15 bg-[#071a2e]/80 p-5 text-white backdrop-blur-md sm:inset-x-8 sm:bottom-8 sm:p-7">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="max-w-[25rem] text-3xl font-bold leading-[1] tracking-[-0.055em] sm:text-[2.7rem]">
              Every mile.
              <br />
              One connected view.
            </p>
            <p className="mt-4 max-w-sm text-xs leading-5 text-white/50 sm:text-sm">
              Clear milestones and secure live visibility from pickup through
              final delivery.
            </p>
          </div>
          <div className="hidden shrink-0 text-right sm:block">
            <p className="text-3xl font-bold tracking-[-0.05em] text-[#55b8ff]">
              24/7
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">
              Visibility
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicShipmentTracker() {
  const [loadNumber, setLoadNumber] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = loadNumber.trim().replace(/^#/, '');

    if (normalized !== PUBLIC_SHIPMENT.pro) {
      setShowResult(false);
      setError(
        'We could not verify that load number. Check the number or contact ShipSmart support.'
      );
      return;
    }

    setLoadNumber(PUBLIC_SHIPMENT.pro);
    setError('');
    setShowResult(true);
  }

  return (
    <>
      <section className="bg-[#f2f2f2] px-4 pb-20 pt-32 sm:px-6 sm:pt-40 lg:px-8 lg:pb-24 lg:pt-[10.75rem]">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 xl:grid-cols-[0.88fr_1.12fr] xl:items-start xl:gap-14">
            <div className="xl:pt-7">
              <h1 className="max-w-[650px] text-[3.25rem] font-bold leading-[0.92] tracking-[-0.07em] text-[#111214] sm:text-[4.7rem] lg:text-[5.35rem]">
                Track your shipment.{' '}
                <span className="text-[#03a1fe]">Stay in control.</span>
              </h1>
              <p className="mt-7 max-w-[570px] text-base leading-7 text-[#585959] sm:text-[1.0625rem]">
                Enter your load number to see its latest status, route, and
                secure live tracking from pickup through delivery.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-9 rounded-[2rem] bg-white p-5 shadow-[0_22px_70px_rgba(10,26,51,.10)] sm:p-7"
              >
                <label
                  htmlFor="public-load-number"
                  className="text-xs font-bold text-[#17181b]"
                >
                  Load number
                </label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search
                      aria-hidden="true"
                      className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#85878c]"
                    />
                    <input
                      id="public-load-number"
                      inputMode="numeric"
                      autoComplete="off"
                      value={loadNumber}
                      onChange={(event) => {
                        setLoadNumber(event.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter load number, e.g. 10444"
                      aria-describedby={
                        error ? 'tracking-search-error' : 'tracking-search-help'
                      }
                      className="h-14 w-full rounded-full border border-black/10 bg-[#f8f8f7] pl-12 pr-5 text-sm font-semibold text-[#17181b] outline-none transition placeholder:font-normal placeholder:text-[#9a9da3] hover:border-black/20 focus:border-[#03a1fe] focus:bg-white focus:ring-4 focus:ring-[#03a1fe]/10"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex h-14 shrink-0 items-center justify-center gap-3 rounded-full bg-[#17181b] px-7 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#03a1fe] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#03a1fe]/25"
                  >
                    Find shipment
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {error ? (
                  <p
                    id="tracking-search-error"
                    role="alert"
                    className="mt-4 rounded-2xl bg-[#fff0ef] px-4 py-3 text-sm font-semibold leading-5 text-[#b42318]"
                  >
                    {error}
                  </p>
                ) : (
                  <p
                    id="tracking-search-help"
                    className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#77797e]"
                  >
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#03a1fe]" />
                    Public tracking displays only essential shipment details.
                  </p>
                )}
              </form>

              {showResult ? (
                <ShipmentResult />
              ) : (
                <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-[#303030]">
                    <CheckCircle2 className="h-4 w-4 text-[#03a1fe]" />
                    Secure access
                  </span>
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-[#303030]">
                    <Clock3 className="h-4 w-4 text-[#03a1fe]" />
                    24/7 visibility
                  </span>
                  <a
                    href="tel:+13312154701"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#03a1fe] transition hover:text-[#018fe5]"
                  >
                    Need help? (331) 215-4701
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>

            <TrackingVisual />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-[620px] text-4xl font-bold leading-[1] tracking-[-0.055em] text-[#111214] sm:text-[3.25rem]">
              Live visibility,
              <br />
              without the guesswork.
            </h2>
            <p className="max-w-[420px] text-sm leading-6 text-[#77797e]">
              One load number connects you to the shipment details that matter
              most.
            </p>
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-3 lg:gap-0">
            {trackingSteps.map((step, index) => (
              <article
                key={step.number}
                className={`lg:min-h-[220px] lg:px-10 ${
                  index === 0 ? 'lg:pl-0' : 'lg:border-l lg:border-black/10'
                }`}
              >
                <p className="text-[2.75rem] font-bold tracking-[-0.06em] text-[#03a1fe]">
                  {step.number}
                </p>
                <h3 className="mt-5 text-lg font-bold tracking-[-0.035em] text-[#111214]">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-[#77797e]">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
