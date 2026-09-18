'use client';

import { useState } from 'react';
import {
  Anchor,
  ArrowUpRight,
  Boxes,
  CircleDollarSign,
  Clock3,
  Globe2,
  MapPin,
  Navigation,
  PackageCheck,
  Plane,
  RadioTower,
  Route,
  ScanLine,
  ShieldCheck,
  Ship,
  Truck,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';

type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
  detail: string;
  secondaryDetail: string;
  accent: string;
  softAccent: string;
};

const services: Service[] = [
  {
    title: 'Ocean Freight',
    description:
      'Flexible FCL and LCL shipping across dependable global lanes, coordinated from booking through final port release.',
    icon: Ship,
    detail: 'Port-to-port coordination',
    secondaryDetail: 'Live vessel milestones',
    accent: 'from-[#1769FF] to-[#41D9FF]',
    softAccent: 'bg-[#DDEBFF]',
  },
  {
    title: 'Air Freight',
    description:
      'Priority air capacity for urgent, high-value, and time-sensitive shipments that cannot afford to wait.',
    icon: Plane,
    detail: 'Priority uplift planning',
    secondaryDetail: 'Time-critical handling',
    accent: 'from-[#5B7CFF] to-[#8FD8FF]',
    softAccent: 'bg-[#E7E9FF]',
  },
  {
    title: 'Road Transport',
    description:
      'Reliable full-truckload and less-than-truckload coverage with connected dispatch and proactive exception support.',
    icon: Truck,
    detail: 'Regional and cross-border',
    secondaryDetail: 'Connected dispatch',
    accent: 'from-[#1769FF] to-[#1FBE70]',
    softAccent: 'bg-[#DFF7ED]',
  },
  {
    title: 'Warehousing',
    description:
      'Secure storage, cross-dock, fulfillment, and inventory flow designed around the way your supply chain actually moves.',
    icon: Warehouse,
    detail: 'Flexible storage',
    secondaryDetail: 'Inventory visibility',
    accent: 'from-[#0A4D8C] to-[#3B82F6]',
    softAccent: 'bg-[#DCEEFF]',
  },
  {
    title: 'Customs Support',
    description:
      'Documentation, classification, and clearance guidance that keeps international freight compliant and moving forward.',
    icon: ScanLine,
    detail: 'Clearance coordination',
    secondaryDetail: 'Document control',
    accent: 'from-[#165BCE] to-[#41D9FF]',
    softAccent: 'bg-[#DDF7FF]',
  },
  {
    title: 'Last-Mile Delivery',
    description:
      'A precise final handoff with scheduled delivery windows, live status, and confirmation at the destination.',
    icon: PackageCheck,
    detail: 'Scheduled handoff',
    secondaryDetail: 'Proof of delivery',
    accent: 'from-[#1769FF] to-[#25C982]',
    softAccent: 'bg-[#DFF9EE]',
  },
];

const advantages = [
  {
    title: 'Real-time tracking',
    text: 'Every milestone stays visible.',
    icon: RadioTower,
  },
  {
    title: 'Reliable global network',
    text: 'Connected partners across every leg.',
    icon: Globe2,
  },
  {
    title: 'Transparent pricing',
    text: 'Clear costs before freight moves.',
    icon: CircleDollarSign,
  },
  {
    title: 'Smart route optimization',
    text: 'A better path for time and distance.',
    icon: Route,
  },
];

function ServiceVisual({
  service,
  isActive,
}: {
  service: Service;
  isActive: boolean;
}) {
  const Icon = service.icon;

  return (
    <div
      aria-hidden={!isActive}
      className={`absolute inset-0 overflow-hidden rounded-[2rem] border border-white/70 bg-[#071D38] transition-all duration-700 ease-out motion-reduce:transition-none ${
        isActive
          ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-5 scale-[0.985] opacity-0'
      }`}
    >
      <div
        className={`absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br ${service.accent} opacity-35 blur-3xl`}
      />
      <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-[#1769FF]/20 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="absolute left-[8%] right-[8%] top-[13%] flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
        <span>ShipSmart network</span>
        <span>Live operation</span>
      </div>

      <div className="absolute left-[12%] top-[31%] h-px w-[70%] overflow-hidden bg-white/15">
        <span
          className={`block h-full w-2/3 bg-gradient-to-r ${service.accent} transition-transform duration-1000 ${isActive ? 'translate-x-0' : '-translate-x-full'}`}
        />
      </div>
      <div className="absolute left-[12%] top-[31%] h-3 w-3 -translate-y-1/2 rounded-full border-[3px] border-[#071D38] bg-white shadow-[0_0_0_4px_rgba(65,217,255,.22)]" />
      <div className="absolute right-[17%] top-[31%] h-3 w-3 -translate-y-1/2 rounded-full border-[3px] border-[#071D38] bg-[#41D9FF] shadow-[0_0_22px_rgba(65,217,255,.7)]" />

      <div className="absolute left-1/2 top-[47%] grid h-36 w-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[2.25rem] border border-white/15 bg-white/[0.09] shadow-[0_24px_70px_rgba(0,0,0,.25)] backdrop-blur-xl sm:h-44 sm:w-44">
        <span
          className={`absolute inset-4 rounded-[1.75rem] bg-gradient-to-br ${service.accent} opacity-20`}
        />
        <Icon className="relative h-16 w-16 stroke-[1.25] text-white sm:h-20 sm:w-20" />
      </div>

      <div className="absolute bottom-[10%] left-[7%] right-[7%] grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-md">
          <Anchor className="h-4 w-4 text-[#41D9FF]" />
          <p className="mt-3 text-sm font-medium text-white">
            {service.detail}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-md">
          <Navigation className="h-4 w-4 text-[#41D9FF]" />
          <p className="mt-3 text-sm font-medium text-white">
            {service.secondaryDetail}
          </p>
        </div>
      </div>
    </div>
  );
}

function RouteMap() {
  return (
    <div className="relative min-h-[470px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#081B34] sm:min-h-[540px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_42%,rgba(23,105,255,.2),transparent_36%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.22)_1px,transparent_1px)] [background-size:48px_48px]" />

      <svg
        aria-label="Optimized freight route from Tashkent through Dubai to Rotterdam"
        className="absolute inset-x-0 top-[11%] h-[68%] w-full"
        viewBox="0 0 900 440"
        role="img"
      >
        <defs>
          <linearGradient
            id="route-gradient"
            x1="130"
            x2="775"
            y1="280"
            y2="110"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#41D9FF" />
            <stop offset="0.48" stopColor="#1769FF" />
            <stop offset="1" stopColor="#1FBE70" />
          </linearGradient>
          <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g
          fill="#A9C4E6"
          fillOpacity="0.08"
          stroke="#A9C4E6"
          strokeOpacity="0.12"
          strokeWidth="1"
        >
          <path d="M47 176l39-46 53-9 40 18 46-10 43 23 34 53-20 32-63 1-31 35-47-9-38-38-42-9z" />
          <path d="M267 74l51-35 66 9 37 31 72-6 39 29-8 50-52 12-30 46-51 12-40-27-70-13-22-48z" />
          <path d="M455 242l46-29 58 2 29 24 62-6 43 33-13 51-56 14-41 48-72-8-27-42-44-36z" />
          <path d="M620 72l73-31 65 20 27 46 65 16-13 56-47 12-55-26-37 22-66-31-26-43z" />
          <path d="M719 312l50-27 71 28 18 49-45 34-66-8-37-38z" />
        </g>

        <path
          d="M170 260C292 220 324 334 445 252C544 185 568 151 725 128"
          fill="none"
          stroke="#1769FF"
          strokeOpacity="0.17"
          strokeWidth="18"
        />
        <path
          d="M170 260C292 220 324 334 445 252C544 185 568 151 725 128"
          fill="none"
          filter="url(#route-glow)"
          pathLength="100"
          stroke="url(#route-gradient)"
          strokeDasharray="3 5"
          strokeLinecap="round"
          strokeWidth="4"
        />

        <g>
          <circle
            cx="170"
            cy="260"
            fill="#071D38"
            r="16"
            stroke="#41D9FF"
            strokeWidth="3"
          />
          <circle cx="170" cy="260" fill="#41D9FF" r="5" />
          <circle
            cx="445"
            cy="252"
            fill="#071D38"
            r="16"
            stroke="#1769FF"
            strokeWidth="3"
          />
          <circle cx="445" cy="252" fill="#1769FF" r="5" />
          <circle
            cx="725"
            cy="128"
            fill="#071D38"
            r="16"
            stroke="#1FBE70"
            strokeWidth="3"
          />
          <circle cx="725" cy="128" fill="#1FBE70" r="5" />
        </g>

        <g fill="#FFFFFF" fontFamily="Arial, sans-serif">
          <text x="139" y="304" fontSize="15" fontWeight="700">
            Tashkent
          </text>
          <text x="421" y="296" fontSize="15" fontWeight="700">
            Dubai
          </text>
          <text x="691" y="91" fontSize="15" fontWeight="700">
            Rotterdam
          </text>
        </g>
      </svg>

      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 text-[11px] font-semibold text-white/70 backdrop-blur-md sm:left-7 sm:top-7">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#1FBE70] opacity-70 motion-safe:animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1FBE70]" />
        </span>
        Live route
      </div>

      <div className="absolute right-5 top-5 rounded-2xl border border-white/10 bg-white/[0.07] p-3.5 text-white backdrop-blur-md sm:right-7 sm:top-7 sm:p-4">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
          <Clock3 className="h-3.5 w-3.5 text-[#41D9FF]" /> ETA
        </div>
        <p className="mt-2 text-sm font-semibold">On schedule</p>
      </div>

      <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#07182E]/80 p-4 backdrop-blur-xl sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#1769FF] text-white">
            <Boxes className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-white/45">Shipment</p>
            <p className="mt-0.5 text-sm font-semibold text-white">
              SS-2026-849215
            </p>
          </div>
        </div>
        <div className="hidden h-8 w-px bg-white/10 sm:block" />
        <div>
          <p className="text-xs text-white/45">Current checkpoint</p>
          <p className="mt-0.5 text-sm font-semibold text-white">
            Dubai Logistics Hub
          </p>
        </div>
        <div className="hidden h-8 w-px bg-white/10 md:block" />
        <div className="flex items-center gap-2 text-sm font-semibold text-[#77E9B1]">
          <ShieldCheck className="h-4 w-4" /> In transit
        </div>
      </div>
    </div>
  );
}

export function ServicesAdvantages() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <section
        id="services"
        className="overflow-hidden bg-[#F7F9FC] px-5 py-24 text-[#07111F] sm:px-8 lg:px-12 lg:py-36"
      >
        <div className="mx-auto max-w-[1320px]">
          <div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-end lg:gap-20">
            <div>
              <h2 className="max-w-xl text-4xl font-semibold leading-[1.04] tracking-[-0.05em] text-[#07111F] sm:text-5xl lg:text-[4rem]">
                One network. Every way forward.
              </h2>
              <p className="mt-6 max-w-lg text-base leading-8 text-[#657084] sm:text-lg">
                Choose the right mode for every shipment while one ShipSmart
                team keeps the entire journey connected.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 border-y border-[#07111F]/10 sm:grid-cols-3">
              {services.map((service, index) => {
                const Icon = service.icon;
                const isActive = index === activeIndex;

                return (
                  <button
                    key={service.title}
                    aria-pressed={isActive}
                    className={`group relative flex min-h-24 items-center gap-3 border-b border-[#07111F]/10 px-1 py-5 text-left transition-colors duration-300 focus-visible:z-10 focus-visible:rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769FF] focus-visible:ring-offset-4 sm:px-3 ${
                      isActive
                        ? 'text-[#1769FF]'
                        : 'text-[#657084] hover:text-[#07111F]'
                    }`}
                    onClick={() => setActiveIndex(index)}
                    type="button"
                  >
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-all duration-300 ${isActive ? 'bg-[#1769FF] text-white shadow-[0_10px_24px_rgba(23,105,255,.24)]' : 'bg-white text-[#657084] group-hover:text-[#1769FF]'}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold leading-tight">
                      {service.title}
                    </span>
                    <span
                      className={`absolute bottom-[-1px] left-0 h-0.5 bg-[#1769FF] transition-all duration-500 ${isActive ? 'w-full' : 'w-0'}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-14 grid overflow-hidden rounded-[2.25rem] border border-[#07111F]/10 bg-white shadow-[0_36px_90px_rgba(25,54,91,.09)] lg:grid-cols-[0.82fr_1.18fr]">
            <div className="flex min-h-[430px] flex-col justify-between p-7 sm:p-10 lg:min-h-[590px] lg:p-14">
              <div className="relative min-h-[235px]">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  const isActive = activeIndex === index;

                  return (
                    <div
                      key={service.title}
                      aria-hidden={!isActive}
                      className={`absolute inset-0 transition-all duration-500 ease-out motion-reduce:transition-none ${
                        isActive
                          ? 'translate-y-0 opacity-100'
                          : 'pointer-events-none translate-y-4 opacity-0'
                      }`}
                    >
                      <span
                        className={`grid h-14 w-14 place-items-center rounded-2xl ${service.softAccent} text-[#1769FF]`}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <p className="mt-9 text-xs font-semibold uppercase tracking-[0.2em] text-[#1769FF]">
                        {String(index + 1).padStart(2, '0')} /{' '}
                        {String(services.length).padStart(2, '0')}
                      </p>
                      <h3 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-[#07111F] sm:text-5xl">
                        {service.title}
                      </h3>
                      <p className="mt-5 max-w-md text-base leading-8 text-[#657084]">
                        {service.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <a
                className="mt-10 inline-flex w-fit items-center gap-3 rounded-full border border-[#07111F]/15 px-5 py-3 text-sm font-semibold text-[#07111F] transition hover:border-[#1769FF] hover:bg-[#1769FF] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769FF] focus-visible:ring-offset-4"
                href="#tracking"
              >
                Plan this shipment <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <div className="relative min-h-[490px] bg-[#ECF3FC] p-3 sm:min-h-[550px] sm:p-5 lg:min-h-[590px]">
              {services.map((service, index) => (
                <ServiceVisual
                  key={service.title}
                  isActive={activeIndex === index}
                  service={service}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="advantages" className="bg-white px-5 py-24 text-[#07111F] sm:px-8 lg:px-12 lg:py-36">
        <div className="mx-auto max-w-[1320px]">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <h2 className="max-w-xl text-4xl font-semibold leading-[1.04] tracking-[-0.05em] text-[#07111F] sm:text-5xl lg:text-[4rem]">
              Clarity across every border.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-[#657084] lg:justify-self-end lg:text-lg">
              ShipSmart turns a complex international route into one connected
              operating view — from the first pickup to the final handoff.
            </p>
          </div>

          <div className="mt-14 overflow-hidden rounded-[2.5rem] border border-[#07111F]/10 bg-[#071D38] p-3 shadow-[0_40px_100px_rgba(7,29,56,.18)] sm:p-5 lg:p-7">
            <div className="grid gap-4 xl:grid-cols-[1.6fr_0.75fr]">
              <RouteMap />

              <div className="flex flex-col rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 text-white sm:p-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41D9FF]">
                      Control tower
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-white">
                      One intelligent route
                    </h3>
                  </div>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.08] text-[#41D9FF]">
                    <Navigation className="h-5 w-5" />
                  </span>
                </div>

                <div className="flex-1 divide-y divide-white/10">
                  {advantages.map(({ icon: Icon, title, text }, index) => (
                    <div
                      key={title}
                      className="group flex gap-4 py-5 first:pt-6"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-[#41D9FF] transition group-hover:border-[#41D9FF]/40 group-hover:bg-[#41D9FF]/10">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-white/30">
                            0{index + 1}
                          </span>
                          <h4 className="text-sm font-semibold text-white">
                            {title}
                          </h4>
                        </div>
                        <p className="text-white/48 mt-1.5 text-sm leading-6">
                          {text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-2 rounded-2xl border border-[#41D9FF]/20 bg-[#41D9FF]/[0.07] p-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-[#41D9FF]" />
                    <p className="text-xs font-medium text-white/75">
                      Tashkent → Dubai → Rotterdam
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ServicesAdvantages;
