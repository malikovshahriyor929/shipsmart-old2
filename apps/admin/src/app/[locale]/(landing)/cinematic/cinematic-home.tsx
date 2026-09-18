'use client';

import dynamic from 'next/dynamic';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MutableRefObject,
} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Link } from '@core/i18n/routing';
import {
  ArrowRight,
  Box,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  FileCheck2,
  Gauge,
  Globe2,
  LockKeyhole,
  Menu,
  PackageCheck,
  Radar,
  Route,
  ShieldCheck,
  Ship,
  Sparkles,
  Truck,
  X,
} from 'lucide-react';
import { JOURNEY_STEPS } from './scene-config';
import { ServicesAdvantages } from './services-advantages';
import { TrackingDemo } from './tracking-demo';

const ShipSmartCanvas = dynamic(() => import('./ship-smart-canvas'), {
  ssr: false,
  loading: () => null,
});

function useExperiencePreferences() {
  const [preferences, setPreferences] = useState({
    reducedMotion: false,
    mobile: false,
    webgl: true,
  });

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 767px)');

    function supportsWebGL() {
      try {
        const canvas = document.createElement('canvas');
        return Boolean(
          window.WebGLRenderingContext &&
            (canvas.getContext('webgl2') || canvas.getContext('webgl'))
        );
      } catch {
        return false;
      }
    }

    function update() {
      setPreferences({
        reducedMotion: motionQuery.matches,
        mobile: mobileQuery.matches,
        webgl: supportsWebGL(),
      });
    }

    update();
    motionQuery.addEventListener('change', update);
    mobileQuery.addEventListener('change', update);
    return () => {
      motionQuery.removeEventListener('change', update);
      mobileQuery.removeEventListener('change', update);
    };
  }, []);

  return preferences;
}

function Navbar({ scrolled, menuOpen, onMenuToggle }: { scrolled: boolean; menuOpen: boolean; onMenuToggle: () => void }) {
  const navItems = [
    { label: 'Services', href: '#services' },
    { label: 'Solutions', href: '#advantages' },
    { label: 'Tracking', href: '#tracking' },
    { label: 'About', href: '/company/about' },
    { label: 'Contact', href: '/contact/contact-us' },
  ];

  return (
    <header className={`ss-cinematic-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="mx-auto flex h-[4.75rem] max-w-[1440px] items-center px-5 sm:px-8 lg:px-12">
        <a href="#top" className="flex shrink-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#1769ff] text-white shadow-[0_10px_30px_rgba(23,105,255,.28)]">
            <Ship className="h-5 w-5" />
          </span>
          <span className="text-xl font-bold tracking-[-0.045em] text-[#07111f]">ShipSmart</span>
        </a>

        <nav className="mx-auto hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {navItems.map((item) =>
            item.href.startsWith('#') ? (
              <a key={item.label} href={item.href} className="rounded-md px-1 py-2 text-sm font-semibold text-[#243247] transition hover:text-[#1769ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                {item.label}
              </a>
            ) : (
              <Link key={item.label} href={item.href} className="rounded-md px-1 py-2 text-sm font-semibold text-[#243247] transition hover:text-[#1769ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="ml-auto hidden items-center gap-3 sm:flex">
          <Link href="/track-shipment" className="inline-flex h-11 items-center justify-center rounded-xl border border-[#07111f]/10 bg-white/65 px-4 text-sm font-semibold text-[#07111f] backdrop-blur-md transition hover:border-blue-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            Track shipment
          </Link>
          <Link href="/get-quote" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1769ff] px-5 text-sm font-semibold text-white shadow-[0_12px_34px_rgba(23,105,255,.28)] transition hover:-translate-y-0.5 hover:bg-[#0f59df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
            Get a quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button type="button" onClick={onMenuToggle} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} className="ml-auto grid h-11 w-11 place-items-center rounded-xl border border-[#07111f]/10 bg-white/75 text-[#07111f] backdrop-blur-md sm:hidden">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div id="mobile-navigation" className={`overflow-hidden border-t border-[#07111f]/10 bg-white/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 sm:hidden ${menuOpen ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="grid gap-1 px-5 py-5" aria-label="Mobile navigation">
          {navItems.map((item) =>
            item.href.startsWith('#') ? (
              <a key={item.label} href={item.href} onClick={onMenuToggle} className="rounded-xl px-4 py-3 text-base font-semibold text-[#07111f] hover:bg-blue-50">{item.label}</a>
            ) : (
              <Link key={item.label} href={item.href} onClick={onMenuToggle} className="rounded-xl px-4 py-3 text-base font-semibold text-[#07111f] hover:bg-blue-50">{item.label}</Link>
            )
          )}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link href="/track-shipment" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 px-3 text-sm font-semibold text-[#07111f]">Track shipment</Link>
            <Link href="/get-quote" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#1769ff] px-3 text-sm font-semibold text-white">Get a quote</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

function JourneyLoading({ ready }: { ready: boolean }) {
  return (
    <div className={`ss-journey-loader ${ready ? 'is-ready' : ''}`} aria-hidden={ready}>
      <div className="text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#1769ff] text-white shadow-[0_18px_55px_rgba(23,105,255,.32)]">
          <Ship className="h-7 w-7" />
        </span>
        <p className="mt-5 text-sm font-semibold tracking-[-0.01em] text-[#07111f]">Preparing your journey</p>
        <div className="mx-auto mt-4 h-1 w-44 overflow-hidden rounded-full bg-[#07111f]/10">
          <span className="ss-loading-line block h-full rounded-full bg-[#1769ff]" />
        </div>
      </div>
    </div>
  );
}

function JourneyProgress({ activeStep }: { activeStep: number }) {
  return (
    <aside className="absolute left-6 top-1/2 z-30 hidden -translate-y-1/2 xl:block" aria-label="Shipping journey progress">
      <div className="w-52 rounded-[1.5rem] border border-white/50 bg-white/72 p-5 shadow-[0_24px_70px_rgba(7,17,31,.1)] backdrop-blur-xl">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#657084]">Journey</p>
        <ol className="relative mt-5 grid gap-4">
          <span className="absolute bottom-3 left-[0.4375rem] top-3 w-px bg-[#07111f]/10" />
          {JOURNEY_STEPS.map((step, index) => (
            <li key={step.id} className="relative grid grid-cols-[1rem_1fr] gap-3">
              <span className={`relative z-10 mt-1 h-2.5 w-2.5 rounded-full border-2 transition-all duration-500 ${index <= activeStep ? 'border-[#1769ff] bg-[#1769ff] shadow-[0_0_0_4px_rgba(23,105,255,.1)]' : 'border-slate-300 bg-white'}`} />
              <span className={`text-xs font-semibold leading-5 transition-colors ${index === activeStep ? 'text-[#1769ff]' : 'text-[#657084]'}`}>{step.title}</span>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}

function HeroSection() {
  return (
    <section id="top" className="relative flex min-h-[100dvh] items-center px-5 pb-24 pt-28 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="max-w-2xl">
          <h1 className="text-[3.8rem] font-semibold leading-[0.92] tracking-[-0.065em] text-[#07111f] sm:text-7xl lg:text-[6.6rem]">
            Shipping made smarter.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-[#526074] sm:text-xl sm:leading-9">
            Move packages across cities, borders, and oceans with transparent tracking and intelligent logistics.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/get-quote" className="pointer-events-auto inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#1769ff] px-6 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(23,105,255,.28)] transition hover:-translate-y-0.5 hover:bg-[#0e59df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
              Get a quote <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#tracking" className="pointer-events-auto inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#07111f]/12 bg-white/72 px-6 text-sm font-semibold text-[#07111f] backdrop-blur-md transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              Track a shipment <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.24em] text-[#657084]">Fast. Transparent. Global.</p>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#526074]">
        Scroll to explore
        <span className="relative h-8 w-5 rounded-full border border-[#07111f]/25"><span className="ss-scroll-dot absolute left-1/2 top-1 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#1769ff]" /></span>
      </div>
    </section>
  );
}

function StorySection({ step, index }: { step: (typeof JOURNEY_STEPS)[number]; index: number }) {
  return (
    <section id={step.id} className="relative flex min-h-[108dvh] items-center px-5 py-24 sm:px-8 lg:px-12">
      <div className={`mx-auto flex w-full max-w-[1320px] ${step.align === 'right' ? 'justify-end' : 'justify-start'}`}>
        <article data-story-card data-step-index={index} className="pointer-events-auto w-full max-w-md rounded-[1.75rem] border border-white/60 bg-white/76 p-6 shadow-[0_28px_90px_rgba(7,17,31,.12)] backdrop-blur-xl sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold tracking-[0.18em] text-[#1769ff]">{step.number}</span>
            <span className="h-px flex-1 bg-[#07111f]/10" />
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#657084]">Live journey</span>
          </div>
          <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-[#07111f] sm:text-5xl">{step.title}</h2>
          <p className="mt-5 text-base leading-8 text-[#657084]">{step.description}</p>
          <div className="mt-7 flex flex-wrap gap-2">
            {step.labels.map((label, labelIndex) => (
              <span key={label} className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${labelIndex === 0 ? 'border-blue-200 bg-blue-50 text-[#1769ff]' : 'border-[#07111f]/10 bg-white/70 text-[#465267]'}`}>
                {labelIndex === 0 ? <CircleCheck className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-[#41d9ff]" />}
                {label}
              </span>
            ))}
          </div>
          {step.id === 'visible' ? (
            <div className="mt-7 rounded-2xl border border-[#07111f]/10 bg-[#07111f] p-4 text-white">
              <div className="flex items-center justify-between text-xs"><span className="text-white/55">Journey progress</span><span className="font-bold text-[#77e9b1]">68%</span></div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><span className="block h-full w-[68%] rounded-full bg-gradient-to-r from-[#1769ff] to-[#41d9ff]" /></div>
            </div>
          ) : null}
          {step.id === 'complete' ? (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/get-quote" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#1769ff] px-5 text-sm font-semibold text-white">Start shipping <ArrowRight className="h-4 w-4" /></Link>
              <a href="#tracking" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#07111f]/10 bg-white px-5 text-sm font-semibold text-[#07111f]">Track a shipment</a>
            </div>
          ) : null}
        </article>
      </div>
    </section>
  );
}

const operations = [
  { icon: Radar, title: 'Plan before freight moves', text: 'Model routes, align capacity, and confirm documents before pickup.' },
  { icon: Gauge, title: 'Control every exception', text: 'Live milestones surface delays early so your team can respond faster.' },
  { icon: FileCheck2, title: 'Keep every handoff aligned', text: 'One shared operating view connects shippers, ports, carriers, and customers.' },
];

function OperationsSection() {
  return (
    <section className="bg-white px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div data-ss-motion="left">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1769ff]">Operations intelligence</p>
            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-[#07111f] sm:text-6xl">Built for every handoff.</h2>
            <p className="mt-6 max-w-lg text-base leading-8 text-[#657084] sm:text-lg">ShipSmart turns a complex logistics network into one clear operating rhythm — from the first booking to proof of delivery.</p>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-[#07111f]/10 bg-[#f7f9fc]">
            {operations.map(({ icon: Icon, title, text }, index) => (
              <div key={title} data-ss-motion="up" data-ss-delay={index} className="group grid gap-5 border-b border-[#07111f]/10 p-6 last:border-b-0 sm:grid-cols-[3.5rem_1fr_auto] sm:items-center sm:p-8">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-blue-100 bg-white text-[#1769ff] shadow-[0_10px_28px_rgba(23,105,255,.08)]"><Icon className="h-6 w-6" /></span>
                <div><h3 className="text-xl font-semibold tracking-[-0.03em] text-[#07111f]">{title}</h3><p className="mt-2 text-sm leading-7 text-[#657084]">{text}</p></div>
                <span className="hidden h-10 w-10 place-items-center rounded-full border border-[#07111f]/10 text-[#07111f] transition group-hover:translate-x-1 group-hover:border-blue-300 group-hover:text-[#1769ff] sm:grid"><ArrowRight className="h-4 w-4" /></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  const trustItems = [
    { icon: LockKeyhole, title: 'Protected shipment data', text: 'Permission-aware access keeps sensitive logistics information controlled.' },
    { icon: ShieldCheck, title: 'Verified operating partners', text: 'Every carrier and handoff follows ShipSmart’s operational standards.' },
    { icon: Clock3, title: 'Proactive exception response', text: 'Clear alerts and a reachable team keep critical timelines moving.' },
    { icon: Globe2, title: 'One global operating view', text: 'Road, ocean, air, and warehouse activity stay connected in one workflow.' },
  ];

  return (
    <section className="overflow-hidden bg-[#07182e] px-5 py-24 text-white sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-24">
        <div data-ss-motion="left">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#41d9ff]">Trust by design</p>
          <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl">Confidence engineered into every mile.</h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-blue-100/60 sm:text-lg">Secure data, verified capacity, and proactive people work together behind every shipment.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {trustItems.map(({ icon: Icon, title, text }, index) => (
              <article key={title} data-ss-motion="up" data-ss-delay={index} className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-sm"><Icon className="h-6 w-6 text-[#41d9ff]" /><h3 className="mt-5 text-lg font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-7 text-blue-100/55">{text}</p></article>
            ))}
          </div>
        </div>
        <div data-ss-motion="right" className="relative min-h-[34rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b2749] p-7 shadow-[0_34px_90px_rgba(0,0,0,.24)]">
          <div className="absolute inset-0 opacity-[.12] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="relative flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[.18em] text-white/45">Control layer</span><span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-300" /> All systems connected</span></div>
          <div className="relative mx-auto mt-20 grid h-44 w-44 place-items-center rounded-full border border-blue-300/25 bg-blue-500/10 shadow-[0_0_90px_rgba(23,105,255,.28)]"><div className="absolute inset-5 rounded-full border border-cyan-300/20" /><ShieldCheck className="h-20 w-20 stroke-[1.2] text-[#41d9ff]" /></div>
          <div className="relative mt-16 grid grid-cols-3 gap-3 text-center">{['Identity', 'Routing', 'Handoffs'].map((label) => <div key={label} className="rounded-xl border border-white/10 bg-white/[.06] px-2 py-3 text-xs font-semibold text-white/70">{label}<Check className="mx-auto mt-2 h-4 w-4 text-emerald-300" /></div>)}</div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-[#f7f9fc] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div data-ss-motion="up" className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[2.5rem] bg-[#1769ff] px-7 py-16 text-white shadow-[0_34px_90px_rgba(23,105,255,.24)] sm:px-12 lg:px-16 lg:py-20">
        <div className="absolute -right-20 -top-36 h-96 w-96 rounded-full border-[56px] border-white/[.08]" />
        <div className="absolute bottom-[-5rem] right-[12%] h-48 w-72 rotate-[-8deg] rounded-[1.5rem] border border-white/20 bg-[#0d57c8] shadow-[0_30px_50px_rgba(2,28,90,.28)]"><span className="absolute inset-x-0 top-1/2 h-6 -translate-y-1/2 bg-white/15" /><span className="absolute left-1/2 inset-y-0 w-6 -translate-x-1/2 bg-white/15" /></div>
        <div className="relative max-w-2xl"><h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl">Ready to move smarter?</h2><p className="mt-5 text-base leading-8 text-blue-100 sm:text-lg">Plan, track, and manage your next shipment with ShipSmart.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/get-quote" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-[#1769ff]">Get a quote <ArrowRight className="h-4 w-4" /></Link><Link href="/contact/contact-us" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/35 px-6 text-sm font-semibold text-white">Contact our team</Link></div></div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#061426] px-5 text-white sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1320px] gap-12 py-16 lg:grid-cols-[1.25fr_2fr]">
        <div><div className="flex items-center gap-3 text-xl font-bold"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#1769ff]"><Ship className="h-5 w-5" /></span>ShipSmart</div><p className="mt-5 max-w-sm text-sm leading-7 text-blue-100/50">Connected transportation, real-time visibility, and accountable execution across every mile.</p></div>
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
          {[{ title: 'Services', links: ['Ocean Freight', 'Air Freight', 'Road Transport', 'Warehousing'] }, { title: 'Solutions', links: ['Real-time Tracking', 'Route Optimization', 'Customs Support'] }, { title: 'Company', links: ['About', 'Careers', 'Contact'] }, { title: 'Legal', links: ['Privacy', 'Terms', 'Accessibility'] }].map((column) => <div key={column.title}><p className="text-xs font-bold uppercase tracking-[.18em] text-blue-100/35">{column.title}</p><div className="mt-4 grid gap-2.5 text-sm text-blue-100/60">{column.links.map((link) => <span key={link}>{link}</span>)}</div></div>)}
        </div>
      </div>
      <div className="mx-auto flex max-w-[1320px] flex-col gap-3 border-t border-white/10 py-5 text-xs text-blue-100/35 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 ShipSmart Solutions. All rights reserved.</span><span>info@shipsmart.com · (800) 123-4567</span></div>
    </footer>
  );
}

export function CinematicHome() {
  const journeyRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0) as MutableRefObject<number>;
  const progressBarRef = useRef<HTMLSpanElement>(null);
  const activeStepRef = useRef(-1);
  const navScrolledRef = useRef(false);
  const [activeStep, setActiveStep] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const { reducedMotion, mobile, webgl } = useExperiencePreferences();

  const handleCanvasReady = useCallback(() => {
    window.setTimeout(() => setCanvasReady(true), 450);
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const journey = journeyRef.current;
    if (!journey) return;

    let lenis: Lenis | null = null;
    const updateLenis = (time: number) => lenis?.raf(time * 1000);

    if (!reducedMotion) {
      lenis = new Lenis({ duration: 1.08, smoothWheel: true, wheelMultiplier: 0.92 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);
    }

    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-story-card]');
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: journey,
          start: 'top top',
          end: 'bottom bottom',
          scrub: reducedMotion ? 0.1 : 0.82,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            if (progressBarRef.current) progressBarRef.current.style.transform = `scaleX(${self.progress})`;
            const nextStep = Math.min(JOURNEY_STEPS.length - 1, Math.max(0, Math.floor(self.progress * JOURNEY_STEPS.length)));
            if (activeStepRef.current !== nextStep) {
              activeStepRef.current = nextStep;
              setActiveStep(nextStep);
            }
            const nextScrolled = self.progress > 0.012 || window.scrollY > 20;
            if (navScrolledRef.current !== nextScrolled) {
              navScrolledRef.current = nextScrolled;
              setScrolled(nextScrolled);
            }
          },
        },
      });

      cards.forEach((card, index) => {
        const start = (index + 0.72) / (JOURNEY_STEPS.length + 1);
        timeline.fromTo(card, { autoAlpha: 0.28, y: 76, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.055 }, start);
        if (index < cards.length - 1) timeline.to(card, { autoAlpha: 0.34, y: -44, scale: 0.985, duration: 0.05 }, start + 0.085);
      });
    }, journey);

    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(frame);
      context.revert();
      if (lenis) {
        gsap.ticker.remove(updateLenis);
        lenis.destroy();
      }
    };
  }, [reducedMotion]);

  return (
    <div className="ss-cinematic min-h-screen overflow-x-clip bg-[#f7f9fc] text-[#07111f]">
      <Navbar scrolled={scrolled} menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((open) => !open)} />
      <span className="fixed inset-x-0 top-0 z-[70] h-1 origin-left scale-x-0 bg-gradient-to-r from-[#1769ff] via-[#41d9ff] to-[#1fbe70]" ref={progressBarRef} />

      <main>
        <div ref={journeyRef} className="relative bg-[linear-gradient(180deg,#edf5fc_0%,#f7f9fc_52%,#eef6fd_100%)]">
          <div className="sticky top-0 z-0 h-[100dvh] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(65,217,255,.18),transparent_34%),linear-gradient(180deg,#dceefa_0%,#eff6fb_64%,#d5e2ec_100%)]" />
            {webgl ? <ShipSmartCanvas progressRef={progressRef} reducedMotion={reducedMotion} mobile={mobile} onReady={handleCanvasReady} /> : <div className="absolute inset-0 bg-[url('/shipsmart/hero-container-ship.jpg')] bg-cover bg-center opacity-80" role="img" aria-label="Container ship at a modern port" />}
            <JourneyLoading ready={!webgl || canvasReady} />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(247,249,252,.97)_0%,rgba(247,249,252,.75)_34%,rgba(247,249,252,.08)_64%,transparent_100%)] lg:bg-[linear-gradient(90deg,rgba(247,249,252,.96)_0%,rgba(247,249,252,.72)_30%,rgba(247,249,252,.03)_60%,transparent_100%)]" />
            <JourneyProgress activeStep={activeStep} />
          </div>
          <div className="pointer-events-none relative z-20 -mt-[100dvh]">
            <HeroSection />
            {JOURNEY_STEPS.map((step, index) => <StorySection key={step.id} step={step} index={index} />)}
          </div>
        </div>

        <ServicesAdvantages />
        <OperationsSection />
        <TrustSection />
        <div id="tracking" className="bg-[#f7f9fc] px-4 py-20 sm:px-8 lg:px-12 lg:py-28"><div className="mx-auto max-w-[1320px]"><TrackingDemo /></div></div>
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

export default CinematicHome;
