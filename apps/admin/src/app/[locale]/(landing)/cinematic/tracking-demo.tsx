'use client';

import { useId, useState, type FormEvent } from 'react';

const DEMO_TRACKING_NUMBER = 'SS-2026-849215';

const timeline = [
  {
    title: 'Shipment collected',
    detail: 'Tashkent Cargo Terminal',
    date: 'August 10',
    state: 'complete',
  },
  {
    title: 'Export cleared',
    detail: 'Departed Tashkent, Uzbekistan',
    date: 'August 11',
    state: 'complete',
  },
  {
    title: 'In transit',
    detail: 'Dubai Logistics Hub',
    date: 'Current',
    state: 'current',
  },
  {
    title: 'European gateway',
    detail: 'Customs and transfer',
    date: 'August 16',
    state: 'upcoming',
  },
  {
    title: 'Final delivery',
    detail: 'Rotterdam, Netherlands',
    date: 'August 18',
    state: 'upcoming',
  },
] as const;

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="m21 21-4.3-4.3m2.3-5.2a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path
        d="M6.5 18.5c2.5 0 2.5-3.2 5-3.2s2.5-6.8 6-6.8M7.8 5.8a2.8 2.8 0 1 1-5.6 0 2.8 2.8 0 0 1 5.6 0Zm14 0a2.8 2.8 0 1 1-5.6 0 2.8 2.8 0 0 1 5.6 0ZM8 18.3a2.8 2.8 0 1 1-5.6 0 2.8 2.8 0 0 1 5.6 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M20 10c0 5.7-8 11-8 11s-8-5.3-8-11a8 8 0 1 1 16 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function TrackingResult() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#071b34] shadow-[0_32px_90px_rgba(2,12,27,0.32)]">
      <div className="relative overflow-hidden border-b border-white/10 px-6 py-7 sm:px-8">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-24 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl"
        />
        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-blue-200/55">
              Tracking number
            </p>
            <p className="mt-2 text-lg font-semibold tracking-[-0.02em] text-white">
              {DEMO_TRACKING_NUMBER}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3.5 py-2 text-xs font-bold text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
            </span>
            In transit
          </div>
        </div>

        <div className="relative mt-7 flex items-start gap-3 rounded-2xl border border-blue-300/15 bg-white/[0.055] p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-950/30">
            <LocationIcon />
          </span>
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-blue-100/45">
              Current location
            </p>
            <p className="mt-1 text-base font-semibold text-white">
              Dubai Logistics Hub
            </p>
            <p className="mt-1 text-xs text-blue-100/50">
              Last update · 12 minutes ago
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-7 sm:px-8">
        <dl className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.19em] text-blue-100/45">
              Origin
            </dt>
            <dd className="mt-2 text-sm font-semibold text-white">
              Tashkent, Uzbekistan
            </dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.19em] text-blue-100/45">
              Destination
            </dt>
            <dd className="mt-2 text-sm font-semibold text-white">
              Rotterdam, Netherlands
            </dd>
          </div>
        </dl>

        <div
          className="mt-7"
          role="progressbar"
          aria-label="Shipment progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={68}
        >
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.19em] text-blue-100/45">
                Journey progress
              </p>
              <p className="mt-1 text-xs text-blue-100/55">On schedule</p>
            </div>
            <span className="text-2xl font-semibold tracking-[-0.04em] text-white">
              68%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="relative h-full w-[68%] overflow-hidden rounded-full bg-blue-500">
              <span
                aria-hidden="true"
                className="absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent to-white/35"
              />
            </div>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between gap-5 rounded-2xl bg-blue-600 px-5 py-4 text-white">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-blue-100/75">
              Estimated arrival
            </p>
            <p className="mt-1 text-base font-semibold">August 18, 2026</p>
          </div>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">
            On time
          </span>
        </div>

        <div className="mt-8 border-t border-white/10 pt-7">
          <h3 className="text-sm font-semibold text-white">
            Shipment timeline
          </h3>
          <div className="relative mt-5">
            <span
              aria-hidden="true"
              className="absolute bottom-5 left-[0.6875rem] top-3 w-px bg-white/10"
            />
            <ol className="relative" aria-label="Shipment timeline">
              {timeline.map((event) => {
                const isComplete = event.state === 'complete';
                const isCurrent = event.state === 'current';

                return (
                  <li
                    key={event.title}
                    className="relative grid grid-cols-[1.5rem_1fr_auto] gap-3 pb-5 last:pb-0"
                  >
                    <span
                      aria-hidden="true"
                      className={`relative z-10 mt-1 h-[0.875rem] w-[0.875rem] rounded-full border-[3px] ${
                        isComplete
                          ? 'border-emerald-300 bg-emerald-300'
                          : isCurrent
                            ? 'border-blue-300 bg-blue-500 shadow-[0_0_0_5px_rgba(96,165,250,0.12)]'
                            : 'border-[#334a64] bg-[#071b34]'
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm font-semibold ${isCurrent ? 'text-blue-300' : isComplete ? 'text-white' : 'text-blue-100/45'}`}
                      >
                        {event.title}
                      </p>
                      <p className="mt-0.5 text-xs text-blue-100/40">
                        {event.detail}
                      </p>
                    </div>
                    <span
                      className={`pt-0.5 text-[0.68rem] font-semibold ${isCurrent ? 'text-blue-300' : 'text-blue-100/40'}`}
                    >
                      {event.date}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyResult() {
  return (
    <div className="relative grid min-h-[34rem] overflow-hidden rounded-[2rem] border border-slate-200 bg-[#f4f8fc] p-7 sm:p-10">
      <div
        aria-hidden="true"
        className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-200/55 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-cyan-100/65 blur-3xl"
      />
      <div className="relative m-auto max-w-sm text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-blue-100 bg-white text-blue-600 shadow-[0_18px_45px_rgba(29,78,216,0.12)]">
          <RouteIcon />
        </span>
        <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em] text-[#071b34]">
          Your route, made visible.
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          Enter the demo tracking number to see live status, location, ETA, and
          every milestone in one view.
        </p>
        <div className="mt-7 flex items-center justify-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-blue-600">
          <span className="h-px w-7 bg-blue-300" /> Live shipment intelligence{' '}
          <span className="h-px w-7 bg-blue-300" />
        </div>
      </div>
    </div>
  );
}

export function TrackingDemo() {
  const inputId = useId();
  const hintId = useId();
  const errorId = useId();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedTrackingNumber = trackingNumber.trim().toUpperCase();

    if (!normalizedTrackingNumber) {
      setShowResult(false);
      setError('Enter a tracking number to continue.');
      return;
    }

    if (normalizedTrackingNumber !== DEMO_TRACKING_NUMBER) {
      setShowResult(false);
      setError(
        `Shipment not found. Try the demo number ${DEMO_TRACKING_NUMBER}.`
      );
      return;
    }

    setTrackingNumber(normalizedTrackingNumber);
    setError(null);
    setShowResult(true);
  }

  function useDemoNumber() {
    setTrackingNumber(DEMO_TRACKING_NUMBER);
    setError(null);
    setShowResult(false);
  }

  return (
    <section
      className="relative overflow-hidden rounded-[2.5rem] bg-white px-5 py-16 shadow-[0_34px_100px_rgba(15,47,82,0.1)] ring-1 ring-slate-200/80 sm:px-8 sm:py-20 lg:px-12"
      aria-labelledby="tracking-demo-title"
    >
      <div
        aria-hidden="true"
        className="absolute -left-28 top-1/3 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start xl:gap-20">
          <div className="lg:sticky lg:top-28">
            <p className="flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-blue-600">
              <span className="h-px w-9 bg-blue-500" /> Live tracking
            </p>
            <h2
              id="tracking-demo-title"
              className="mt-6 max-w-lg text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[#071b34] sm:text-5xl xl:text-[4rem]"
            >
              Know where your freight is. Always.
            </h2>
            <p className="mt-6 max-w-md text-base leading-8 text-slate-600">
              Follow every shipment from origin to final delivery with timely
              milestones, predictive ETAs, and clear exception visibility.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-9 max-w-lg">
              <label
                htmlFor={inputId}
                className="text-xs font-bold uppercase tracking-[0.17em] text-[#173a68]"
              >
                Tracking number
              </label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <input
                    id={inputId}
                    type="text"
                    value={trackingNumber}
                    onChange={(event) => {
                      setTrackingNumber(event.target.value);
                      setShowResult(false);
                      if (error) setError(null);
                    }}
                    placeholder="Enter tracking number"
                    autoComplete="off"
                    spellCheck={false}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${hintId} ${errorId}` : hintId}
                    className={`h-14 w-full rounded-2xl border bg-white px-5 pr-12 text-sm font-semibold text-[#071b34] outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:ring-4 ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'}`}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    <SearchIcon />
                  </span>
                </div>
                <button
                  type="submit"
                  className="h-14 rounded-2xl bg-blue-600 px-7 text-sm font-bold text-white shadow-[0_14px_30px_rgba(37,99,235,0.23)] transition hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 active:translate-y-0"
                >
                  Track shipment
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p id={hintId} className="text-xs text-slate-500">
                  Demo shipment available for instant preview.
                </p>
                <button
                  type="button"
                  onClick={useDemoNumber}
                  className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  Use {DEMO_TRACKING_NUMBER}
                </button>
              </div>
              {error ? (
                <p
                  id={errorId}
                  role="alert"
                  className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {error}
                </p>
              ) : null}
            </form>

            <div className="mt-9 grid max-w-lg grid-cols-3 gap-3 border-t border-slate-200 pt-7">
              {[
                ['24/7', 'Visibility'],
                ['98.7%', 'On-time updates'],
                ['Global', 'Coverage'],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="text-lg font-semibold tracking-[-0.04em] text-[#071b34]">
                    {value}
                  </p>
                  <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.13em] text-slate-400">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div aria-live="polite" aria-atomic="true">
            {showResult ? <TrackingResult /> : <EmptyResult />}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrackingDemo;
