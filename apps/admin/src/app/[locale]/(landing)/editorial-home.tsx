'use client';

import Image from 'next/image';
import { type RefObject, useEffect, useRef, useState } from 'react';
import { Link } from '@core/i18n/routing';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import LandingLayout from '@/layouts/landing/landing-layout';

const LANDING_ASSET_ROOT = '/shipsmart-landing';

const partnerGridLogos = [
  'partner-1.svg',
  'partner-1.svg',
  'partner-2.svg',
  'partner-4.svg',
  'partner-1.svg',
  'partner-3.svg',
  'partner-1.svg',
  'partner-4.svg',
  'partner-1.svg',
  'partner-1.svg',
];

const stats = [
  { value: '48', label: 'State nationwide coverage' },
  { value: '1.8M+', label: 'Sq. ft. connected warehousing' },
  { value: '24/7', label: 'Operations and shipment support' },
  { value: 'Live', label: 'Tracking and proactive visibility' },
];

const advantages = [
  {
    number: '01',
    title: 'End-to-end',
    text: 'Transportation control from planning and pickup through final delivery.',
  },
  {
    number: '02',
    title: 'Flexible',
    text: 'Capacity that scales with seasonal peaks, urgent loads, and long-term programs.',
  },
  {
    number: '03',
    title: 'Visible',
    text: 'Real-time tracking, milestone updates, and one source of shipment truth.',
  },
  {
    number: '04',
    title: 'Accountable',
    text: 'Dedicated specialists who own the load and communicate before issues grow.',
  },
];

const darkAdvantages = [
  {
    iconImage: `${LANDING_ASSET_ROOT}/icons/user.svg`,
    title: 'Single Point of Contact',
    text: 'One dedicated team manages planning, execution, tracking, and support — no hand-offs and no confusion.',
  },
  {
    iconImage: `${LANDING_ASSET_ROOT}/icons/chart.svg`,
    title: 'Scalable Logistics Solutions',
    text: 'From a single lane to a nationwide program, our asset-plus-network model flexes with your growth.',
  },
  {
    iconImage: `${LANDING_ASSET_ROOT}/icons/box.svg`,
    title: 'Reduced Operational Burden',
    text: 'We absorb carrier sourcing, compliance, execution, and tracking complexity so your team does not have to.',
  },
  {
    iconImage: `${LANDING_ASSET_ROOT}/icons/growth-box.svg`,
    title: 'Improved Efficiency',
    text: 'Optimized routing and dedicated capacity reduce transit times, delays, and avoidable disruptions.',
  },
  {
    iconImage: `${LANDING_ASSET_ROOT}/icons/money.svg`,
    title: 'Lower Transportation Costs',
    text: 'Asset-based operations plus a vetted network drive long-term cost stability and dependable coverage.',
  },
];

const solutions = [
  {
    title: 'Managed Transportation',
    description:
      'A single team to plan, source, track and optimize your freight across modes, facilities and markets.',
    iconImage: `${LANDING_ASSET_ROOT}/icons/manage.svg`,
    image: `${LANDING_ASSET_ROOT}/ship18.png`,
  },
  {
    title: 'Dedicated Capacity',
    description:
      'Reliable equipment and consistent drivers for repeat lanes, scheduled routes and high-priority freight.',
    iconImage: `${LANDING_ASSET_ROOT}/icons/gear.svg`,
    image: `${LANDING_ASSET_ROOT}/ship6.svg`,
  },
  {
    title: 'Freight Brokerage',
    description:
      'Responsive access to vetted capacity for everyday loads, surges and challenging markets.',
    iconImage: `${LANDING_ASSET_ROOT}/icons/box2.svg`,
    image: `${LANDING_ASSET_ROOT}/ship4.svg`,
  },
  {
    title: 'Warehousing & Distribution',
    description:
      'Connected storage, fulfillment and distribution capacity integrated with your transportation network.',
    iconImage: `${LANDING_ASSET_ROOT}/icons/warehouse.svg`,
    image: `${LANDING_ASSET_ROOT}/ship7.svg`,
  },
  {
    title: 'Expedited & Specialized',
    description:
      'Fast, hands-on support for time-critical, oversized, open-deck and project-driven freight.',
    iconImage: `${LANDING_ASSET_ROOT}/icons/flash.svg`,
    image: `${LANDING_ASSET_ROOT}/ship8.svg`,
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Plan the right solution',
    text: 'We align equipment, timing, lane requirements and service expectations before the load moves.',
  },
  {
    number: '02',
    title: 'Secure capacity',
    text: 'Asset-based equipment and trusted carrier partners are matched to the exact freight profile.',
  },
  {
    number: '03',
    title: 'Track every milestone',
    text: 'Live visibility and proactive communication keep your team informed at each critical stage.',
  },
  {
    number: '04',
    title: 'Improve continuously',
    text: 'Performance data identifies savings, service gains and smarter decisions for the next shipment.',
  },
];

const marqueeServices = [
  'Managed Transportation',
  'Dedicated Capacity',
  'Freight Brokerage',
  'Real-Time Tracking',
  'Warehousing & Distribution',
  'Expedited Freight',
  'Reefer & Dry Van',
  'Specialized Logistics',
  'Nationwide Coverage',
  'Last-Mile Delivery',
  'Reliable On-Time Delivery',
];

const industryCards = [
  {
    title: 'Manufacturing',
    text: 'Precision Logistics for Industrial Production',
    image: `${LANDING_ASSET_ROOT}/industry/manafacture.svg`,
    imageClass:
      'bottom-0 right-0 h-[78%] w-[54%] object-contain object-right-bottom',
    className: 'bg-white',
  },
  {
    title: 'Retail',
    text: 'Fast Replenishment for Retail Networks',
    image: `${LANDING_ASSET_ROOT}/industry/retail.svg`,
    imageClass: 'inset-0 h-full w-full object-cover',
    className: 'bg-[#0b2b4d] text-white',
  },
  {
    title: 'Automotive',
    text: 'Just-in-Time Transportation',
    image: `${LANDING_ASSET_ROOT}/industry/automative.svg`,
    imageClass:
      'bottom-0 right-0 h-full w-[48%] object-contain object-right-bottom',
    className: 'bg-white',
  },
  {
    title: 'Food & Beverage',
    text: 'Temperature-Controlled Supply Chain',
    image: `${LANDING_ASSET_ROOT}/industry/food.svg`,
    imageClass: 'inset-0 h-full w-full object-cover',
    className: 'bg-[#0b2b4d] text-white',
  },
  {
    title: 'Construction',
    text: 'Heavy Equipment & Project Logistics',
    image: `${LANDING_ASSET_ROOT}/industry/contruction.svg`,
    imageClass:
      'bottom-0 right-0 h-[88%] w-full object-contain object-center-bottom',
    className: 'bg-white',
  },
  {
    title: 'Industrial & Heavy Equipment',
    text: 'Specialized transport for oversized, heavy and complex freight',
    image: `${LANDING_ASSET_ROOT}/ship10.svg`,
    imageClass: 'inset-0 h-full w-full object-cover',
    className: 'bg-[#0b2b4d] text-white lg:row-span-2',
  },
  {
    title: 'Consumer Goods',
    text: 'Reliable Nationwide Distribution',
    image: `${LANDING_ASSET_ROOT}/industry/consumer.svg`,
    imageClass:
      'bottom-0 right-0 h-[72%] w-[52%] object-contain object-right-bottom',
    className: 'bg-white',
  },
  {
    title: 'E-commerce',
    text: 'Speed for Modern Commerce',
    image: `${LANDING_ASSET_ROOT}/industry/ecommerce.svg`,
    imageClass: 'inset-0 h-full w-full object-cover',
    className: 'bg-[#0b2b4d] text-white',
  },
];

const faqs = [
  {
    question: 'What freight services does Ship Smart Solutions provide?',
    answer:
      'We provide managed transportation, freight brokerage, dedicated capacity, warehousing and distribution, expedited freight, project logistics and specialized transportation solutions tailored to your supply chain.',
  },
  {
    question: 'Is Ship Smart Solutions an asset-based logistics provider?',
    answer:
      'Yes. Our asset-backed capacity is supported by a carefully managed carrier network, giving customers both control and flexibility.',
  },
  {
    question: 'Can I track my shipment in real time?',
    answer:
      'Yes. ShipSmart provides live milestones, shipment status, and proactive updates from pickup through final delivery.',
  },
  {
    question: 'What areas does Ship Smart Solutions serve?',
    answer:
      'We support nationwide freight programs across the United States, including recurring lanes and multi-location transportation networks.',
  },
  {
    question: 'Do you handle temperature-controlled freight?',
    answer:
      'Yes. Our reefer solutions support temperature-sensitive freight with the equipment, monitoring, and communication required for every load.',
  },
  {
    question: 'Can you transport oversized or specialized freight?',
    answer:
      'Yes. We coordinate specialized equipment, route planning, permits, and execution for oversized, heavy, and complex freight.',
  },
  {
    question: 'Do you offer warehousing and distribution services?',
    answer:
      'Yes. ShipSmart connects storage, inventory visibility, cross-dock, fulfillment, distribution, and transportation in one program.',
  },
  {
    question: 'How do I request a freight quote?',
    answer:
      'Submit your shipment details and our operations team will review the lane, equipment, and timing before responding.',
  },
];

function prepareScrubText(element: HTMLElement) {
  if (element.dataset.ssSplit === 'true') {
    return Array.from(element.querySelectorAll<HTMLElement>('.ss-scrub-char'));
  }

  const label = element.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.textContent?.trim()
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });
  const textNodes: Text[] = [];
  let currentNode = walker.nextNode();

  while (currentNode) {
    textNodes.push(currentNode as Text);
    currentNode = walker.nextNode();
  }

  let charIndex = 0;
  textNodes.forEach((textNode) => {
    const fragment = document.createDocumentFragment();
    const parts = textNode.data.split(/(\s+)/);

    parts.forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        fragment.append(document.createTextNode(part));
        return;
      }

      const word = document.createElement('span');
      word.className = 'ss-scrub-word';
      Array.from(part).forEach((character) => {
        const characterElement = document.createElement('span');
        characterElement.className = 'ss-scrub-char';
        characterElement.dataset.ssCharIndex = String(charIndex);
        characterElement.setAttribute('aria-hidden', 'true');
        characterElement.textContent = character;
        word.append(characterElement);
        charIndex += 1;
      });
      fragment.append(word);
    });

    textNode.replaceWith(fragment);
  });

  element.dataset.ssSplit = 'true';
  element.setAttribute('aria-label', label);
  return Array.from(element.querySelectorAll<HTMLElement>('.ss-scrub-char'));
}

function useEditorialMotion(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>('main > section')
    );
    const motionItems = Array.from(
      root.querySelectorAll<HTMLElement>('[data-ss-motion]')
    );
    const zoomFrames = Array.from(
      root.querySelectorAll<HTMLElement>('.ss-zoom-frame')
    );
    const revealItems = Array.from(
      new Set<HTMLElement>([...motionItems, ...zoomFrames])
    );
    const heroZoomItems = Array.from(
      root.querySelectorAll<HTMLElement>('[data-ss-hero-zoom]')
    );
    const parallaxItems = Array.from(
      root.querySelectorAll<HTMLElement>('[data-ss-parallax]')
    );
    const scrubItems = Array.from(
      root.querySelectorAll<HTMLElement>('[data-ss-scrub-text]')
    ).map((element) => ({
      element,
      characters: prepareScrubText(element),
    }));
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    root.classList.add('ss-motion-ready');
    sections.forEach((section, index) => {
      section.dataset.ssSection = String(index);
    });

    if (reducedMotion) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      heroZoomItems.forEach((item) => item.classList.add('is-visible'));
      scrubItems.forEach(({ characters }) => {
        characters.forEach((character) => {
          character.style.opacity = '1';
          character.style.transform = 'none';
        });
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -4% 0px', threshold: 0.06 }
    );

    revealItems.forEach((item) => observer.observe(item));

    const heroZoomObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          heroZoomObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.01 }
    );

    heroZoomItems.forEach((item) => heroZoomObserver.observe(item));

    let frame = 0;
    const updateScrollMotion = () => {
      frame = 0;
      root.classList.toggle('ss-has-scrolled', window.scrollY > 560);

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const passProgress = Math.max(
          0,
          Math.min(
            1,
            (viewportHeight - rect.top) / (viewportHeight + rect.height)
          )
        );
        const isActive =
          rect.top < viewportHeight * 0.72 &&
          rect.bottom > viewportHeight * 0.22;

        section.style.setProperty(
          '--ss-section-progress',
          passProgress.toFixed(4)
        );
        section.classList.toggle('is-ss-active', isActive);
        section.classList.toggle('is-ss-before', rect.top >= viewportHeight);
        section.classList.toggle('is-ss-after', rect.bottom <= 0);
      });

      parallaxItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const viewportProgress =
          (rect.top + rect.height / 2 - window.innerHeight / 2) /
          window.innerHeight;
        const offset = Math.max(-34, Math.min(34, viewportProgress * -26));
        item.style.setProperty('--ss-parallax-y', `${offset}px`);
      });

      scrubItems.forEach(({ element, characters }) => {
        const section = element.closest<HTMLElement>('section');
        const rect =
          section?.getBoundingClientRect() ?? element.getBoundingClientRect();
        const start = window.innerHeight * 0.88;
        const travel = Math.max(
          window.innerHeight * 0.82,
          Math.min(rect.height, window.innerHeight * 1.45)
        );
        const progress = Math.max(0, Math.min(1, (start - rect.top) / travel));
        const totalDuration = 0.72 + Math.max(0, characters.length - 1) * 0.035;
        const timelineTime = progress * totalDuration;

        characters.forEach((character, index) => {
          const localProgress = Math.max(
            0,
            Math.min(1, (timelineTime - index * 0.035) / 0.72)
          );
          const easedProgress = 1 - Math.pow(1 - localProgress, 2);
          character.style.opacity = String(0.34 + easedProgress * 0.66);
          character.style.transform = `translate3d(${
            -5 * (1 - easedProgress)
          }px, 0, 0)`;
          character.style.willChange =
            progress > 0 && progress < 1 ? 'transform, opacity' : 'auto';
        });
      });
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateScrollMotion);
    };

    updateScrollMotion();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      observer.disconnect();
      heroZoomObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      root.classList.remove('ss-motion-ready', 'ss-has-scrolled');
      sections.forEach((section) => {
        section.classList.remove('is-ss-active', 'is-ss-before', 'is-ss-after');
        section.style.removeProperty('--ss-section-progress');
        delete section.dataset.ssSection;
      });
    };
  }, [rootRef]);
}

function RiseLine({
  text,
  accent = false,
  startIndex = 0,
}: {
  text: string;
  accent?: boolean;
  startIndex?: number;
}) {
  let characterIndex = startIndex;

  return (
    <span
      className={`ss-rise-line block ${accent ? 'text-[#0183d0]' : ''}`}
      aria-hidden="true"
    >
      {text.split(' ').map((word, wordIndex, words) => (
        <span key={`${word}-${wordIndex}`}>
          <span className="ss-rise-word">
            {Array.from(word).map((character) => {
              const delay = characterIndex * 30;
              characterIndex += 1;
              return (
                <span
                  key={`${character}-${characterIndex}`}
                  className="ss-rise-char"
                  style={{ animationDelay: `${delay}ms` }}
                >
                  {character}
                </span>
              );
            })}
          </span>
          {wordIndex < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  );
}

function Hero() {
  const firstLine = 'Smarter freight.';
  const secondLine = 'Stronger supply chains.';
  const secondLineStart = Array.from(firstLine).filter(
    (character) => character !== ' '
  ).length;

  return (
    <section className="ss-section-hero bg-[#f2f2f2] px-4 pb-10 pt-32 sm:px-6 sm:pt-40 lg:pb-6 lg:pt-[10.75rem]">
      <div className="mx-auto max-w-[1660px]">
        <div className="ss-editorial-hero-copy mx-auto max-w-[942px] text-center">
          <p
            className="ss-hero-fade-up mx-auto inline-flex max-w-full rounded-full bg-white px-3 py-1.5 text-[0.68rem] font-semibold text-[#303030] sm:px-4 sm:text-sm"
            style={{ animationDelay: '50ms' }}
          >
            Asset-based logistics + managed transportation
          </p>
          <h1
            aria-label={`${firstLine} ${secondLine}`}
            className="mt-3 text-[2.2rem] font-bold leading-[0.92] tracking-[-0.075em] text-[#0f0f0f] sm:text-[5.1rem] sm:leading-[0.9] lg:text-[5.25rem]"
          >
            <RiseLine text={firstLine} />
            <RiseLine text={secondLine} accent startIndex={secondLineStart} />
          </h1>
          <p
            className="ss-hero-fade-up mx-auto mt-7 max-w-[20rem] text-base leading-5 text-[#585959] sm:max-w-[650px]"
            style={{ animationDelay: '200ms' }}
          >
            Ship Smart Solutions combines dependable capacity, nationwide reach
            and real-time visibility to move every load with confidence—from
            pickup to final mile.
          </p>
          <div
            className="ss-hero-fade-up mt-5 flex flex-wrap justify-center gap-3"
            style={{ animationDelay: '300ms' }}
          >
            <Link
              href="/get-quote"
              className="inline-flex min-h-[50px] min-w-[258px] items-center justify-center gap-3 rounded-full bg-[#1d1d1d] px-7 text-base font-semibold text-[#fefefe] transition hover:-translate-y-0.5 hover:bg-black"
            >
              Get a Freight Quote <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/client-portal"
              className="inline-flex min-h-[50px] min-w-[177px] items-center justify-center rounded-full bg-white px-7 text-base font-semibold text-[#1d1d1d] transition hover:-translate-y-0.5"
            >
              Ship with us
            </Link>
          </div>
        </div>

        <div
          data-ss-hero-zoom
          className="ss-editorial-hero-media relative mt-10 aspect-[4/5] overflow-hidden rounded-2xl bg-[#5ca4e8] sm:aspect-[1720/700] lg:mt-16"
        >
          <Image
            src={`${LANDING_ASSET_ROOT}/main-bg.svg`}
            alt="Container ship moving global freight"
            fill
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 1660px"
            className="ss-editorial-hero-image object-cover object-center"
          />
          <div className="ss-editorial-quote absolute left-5 top-5 sm:left-12 sm:top-12">
            <Image
              src={`${LANDING_ASSET_ROOT}/rate.svg`}
              alt="Rated five stars by global businesses"
              width={318}
              height={85}
              unoptimized
              className="h-auto w-[230px] sm:w-[318px]"
            />
          </div>
          <p className="absolute right-6 top-8 hidden text-sm font-semibold uppercase tracking-[0.12em] text-white/80 sm:block lg:right-14 lg:top-14">
            Built to move business forward
          </p>
          <div className="absolute bottom-8 left-7 right-7 flex items-end justify-between text-white sm:bottom-12 sm:left-12 sm:right-12">
            <div>
              <p className="text-4xl font-bold tracking-[-0.05em] sm:text-6xl">
                99.8%
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                Network performance
              </p>
            </div>
            <a
              href="#about"
              className="hidden items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] sm:flex"
            >
              Scroll <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section
      id="about"
      className="overflow-hidden bg-white px-5 py-24 sm:px-8 lg:h-[1335px] lg:px-0 lg:py-0"
    >
      <div className="relative mx-auto h-full max-w-[1515px] lg:pt-[160px]">
        <div className="grid gap-14 lg:grid-cols-[390px_1fr] lg:gap-[86px]">
          <aside>
            <p
              data-ss-motion="left"
              className="text-xs font-bold uppercase tracking-[0.08em] text-[#17181b]"
            >
              About us <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
            </p>
            <p
              data-ss-motion
              className="mt-10 max-w-[350px] text-[15px] leading-[1.55] text-[#77797e] lg:mt-[200px]"
            >
              Ship Smart Solutions combines dependable capacity, smart
              technology, and hands-on expertise to keep freight moving safely,
              efficiently, and on time.
            </p>
            <div className="mt-3 flex -space-x-4" aria-hidden="true">
              {[0, 1, 2, 3].map((avatar) => (
                <Image
                  key={avatar}
                  src={`${LANDING_ASSET_ROOT}/user.svg`}
                  alt=""
                  width={57}
                  height={57}
                  unoptimized
                  className="h-[57px] w-[57px]"
                />
              ))}
            </div>
            <Link
              href="/get-quote"
              data-ss-motion
              data-ss-delay="1"
              className="mt-7 inline-flex min-h-[50px] items-center gap-3 rounded-full bg-[#4ba6f8] px-7 text-sm font-semibold text-white"
            >
              Discover Our Story <ArrowUpRight className="h-4 w-4" />
            </Link>
          </aside>

          <div>
            <p
              data-ss-motion
              className="inline-flex rounded-full border border-black/[0.06] bg-white px-4 py-2 text-xs font-medium text-[#4d4f54] shadow-[0_4px_20px_rgba(10,20,36,.04)]"
            >
              <span className="mr-2 h-2 w-2 rounded-full bg-[#4ba6f8]" />
              Built to move freight smarter
            </p>
            <h2
              data-ss-scrub-text
              className="mt-5 max-w-[1010px] text-4xl font-semibold leading-[1.08] tracking-[-0.055em] text-[#111214] sm:text-5xl lg:text-[3.55rem]"
            >
              Plan. Coordinate. Deliver. We turn complex freight challenges into
              reliable logistics{' '}
              <span className="text-[#9a9a9a]">solutions.</span>
            </h2>

            <div className="mt-16 grid gap-[72px] lg:grid-cols-2">
              <div
                data-ss-motion="left"
                className="ss-zoom-frame relative h-[330px] overflow-hidden rounded-[1rem]"
              >
                <Image
                  src={`${LANDING_ASSET_ROOT}/ship16.svg`}
                  alt="ShipSmart freight operations"
                  fill
                  priority
                  unoptimized
                  sizes="483px"
                  className="ss-zoom-media object-cover"
                />
              </div>
              <div
                data-ss-motion="right"
                className="ss-zoom-frame relative h-[426px] overflow-hidden rounded-[1rem]"
              >
                <Image
                  src={`${LANDING_ASSET_ROOT}/ship11.svg`}
                  alt="ShipSmart warehouse operations"
                  fill
                  unoptimized
                  sizes="483px"
                  className="ss-zoom-media object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-8 lg:absolute lg:inset-x-0 lg:bottom-[100px] lg:grid-cols-4 lg:gap-0">
          {stats.map((stat, index) => (
            <article
              key={stat.label}
              data-ss-motion
              className={`min-h-[170px] px-2 ${
                index > 0 ? 'lg:border-l lg:border-black/10 lg:pl-14' : ''
              }`}
            >
              <Image
                src={`${LANDING_ASSET_ROOT}/icons/about-icon${index + 1}.svg`}
                alt=""
                width={26}
                height={26}
                unoptimized
                className="h-[26px] w-[26px]"
              />
              <p className="mt-5 text-[4.5rem] font-semibold leading-none tracking-[-0.075em] text-[#111214]">
                {stat.value}
              </p>
              <p className="mt-4 max-w-[15rem] text-sm leading-5 text-[#77797e]">
                {stat.label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function NetworkSection() {
  return (
    <section
      id="network"
      className="relative overflow-hidden bg-[#f2f2f2] px-5 py-20 sm:px-8 lg:min-h-[760px] lg:px-3 lg:py-24"
    >
      <div className="mx-auto grid max-w-[2000px] gap-12 lg:grid-cols-[minmax(440px,0.9fr)_minmax(0,1.8fr)] lg:gap-8">
        <div data-ss-motion="left" className="lg:pt-1">
          <p className="text-xs font-bold uppercase tracking-[0.03em] text-[#17181b]">
            Trusted by 100+ businesses{' '}
            <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
          </p>
          <h2
            data-ss-scrub-text
            className="mt-7 max-w-[420px] text-4xl font-semibold uppercase leading-[1.08] tracking-[-0.055em] text-[#111214]"
          >
            Key lanes &amp; strategic partners
          </h2>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {partnerGridLogos.map((logo, index) => (
              <div
                key={`${logo}-${index}`}
                data-ss-motion
                data-ss-delay={String(index % 4)}
                className="grid aspect-square place-items-center rounded-[22px] border border-black/10 bg-white px-7 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${LANDING_ASSET_ROOT}/${logo}`}
                  alt=""
                  width={180}
                  height={80}
                  className="h-auto max-h-[76px] w-auto max-w-full"
                />
              </div>
            ))}
          </div>

          <div
            data-ss-motion
            className="mt-12 text-center lg:w-[calc((100%_-_3rem)/5)]"
          >
            <p className="text-lg tracking-[0.08em] text-[#111214]">★★★★★</p>
            <p className="mt-1 whitespace-nowrap text-xs font-bold uppercase text-[#111214]">
              Customer reviews{' '}
              <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  const capsuleImages = ['ship11.svg', 'ship6.svg', 'ship19.svg', 'ship16.svg'];

  return (
    <section
      id="advantages"
      className="overflow-hidden bg-white px-5 py-24 sm:px-8 lg:h-[971px] lg:px-3 lg:py-[88px]"
    >
      <div className="relative mx-auto h-full max-w-[1683px]">
        <p
          data-ss-motion
          className="text-xs font-bold uppercase tracking-[0.08em] text-[#1f2023]"
        >
          Why Ship Smart <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
        </p>
        <h2
          data-ss-scrub-text
          className="mt-5 max-w-[1180px] text-5xl font-semibold leading-[0.94] tracking-[-0.06em] text-[#1d1d1d] sm:text-7xl lg:text-[4rem]"
        >
          One logistics partner.
          <span className="mt-2 block text-[#278fdf]">
            One connected network.
          </span>
        </h2>
        <Link
          href="/get-quote"
          data-ss-motion="right"
          className="mt-8 inline-flex min-h-[50px] items-center gap-3 rounded-full bg-[#111214] px-6 text-sm font-semibold text-white lg:absolute lg:right-0 lg:top-[126px] lg:mt-0"
        >
          More About Us <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:mt-20 lg:flex lg:gap-6">
          {advantages.map((item, index) => (
            <article
              key={item.number}
              data-ss-motion="right"
              className={`grid min-w-0 gap-5 lg:w-[405px] lg:shrink-0 lg:grid-cols-[100px_1fr] ${
                ['', 'lg:mt-[82px]', 'lg:mt-[164px]', 'lg:mt-[246px]'][index]
              }`}
              style={{ transitionDelay: `${index * 70}ms` }}
            >
              <div className="relative h-[270px] w-[100px] overflow-hidden rounded-full bg-[#e6e7e8]">
                <Image
                  src={`${LANDING_ASSET_ROOT}/${capsuleImages[index]}`}
                  alt=""
                  fill
                  unoptimized
                  sizes="100px"
                  className="object-cover"
                />
                <span className="absolute left-1/2 top-6 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full bg-white text-xl font-semibold text-[#929397]">
                  {item.number}
                </span>
              </div>
              <div className="border-b border-black/10 pb-5 pt-[68px]">
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#111214]">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-[270px] text-[15px] leading-[1.6] text-[#77797e]">
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DarkAdvantagesSection() {
  return (
    <section className="overflow-hidden bg-[#07182f] px-5 py-24 text-white sm:px-8 lg:h-[1389px] lg:px-3 lg:py-[120px]">
      <div className="relative mx-auto h-full max-w-[1683px]">
        <div>
          <p
            data-ss-motion="left"
            className="text-xs font-bold uppercase tracking-[0.04em] text-white"
          >
            Our 3PL advantage{' '}
            <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
          </p>
          <h2
            data-ss-scrub-text
            className="mt-5 max-w-[1050px] text-5xl font-semibold leading-[1.08] tracking-[-0.055em] text-white sm:text-7xl lg:text-[4rem]"
          >
            A unique combination that traditional brokers can&apos;t match
          </h2>
          <p
            data-ss-motion
            className="mt-5 max-w-[930px] text-lg font-medium leading-[1.25] text-white"
          >
            Ship Smart operates dedicated equipment and specialized open-deck
            capacity, then adds a vetted nationwide carrier network when your
            lanes require more.
          </p>
          <Link
            href="/get-quote"
            data-ss-motion="right"
            className="mt-8 inline-flex min-h-[50px] items-center gap-3 rounded-full bg-[#4ba6f8] px-7 text-sm font-semibold text-white lg:absolute lg:right-0 lg:top-[205px] lg:mt-0"
          >
            Explore More <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-16 grid gap-10 lg:mt-[62px] lg:grid-cols-[545px_1fr] lg:gap-[165px]">
          <div
            data-ss-motion="left"
            className="ss-zoom-frame relative h-[545px] overflow-hidden rounded-[1rem]"
          >
            <Image
              src={`${LANDING_ASSET_ROOT}/ship9.svg`}
              alt="ShipSmart truck at a freight terminal"
              fill
              unoptimized
              sizes="545px"
              className="ss-zoom-media object-cover"
            />
          </div>

          <div className="border-t border-white/10">
            {darkAdvantages.map(({ iconImage, title, text }, index) => (
              <article
                key={title}
                data-ss-motion="right"
                className="grid min-h-[172px] gap-6 border-b border-white/10 py-8 lg:grid-cols-[170px_1fr_auto] lg:items-start"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <Image
                  src={iconImage}
                  alt=""
                  width={37}
                  height={37}
                  unoptimized
                  className="h-9 w-9 object-contain brightness-0 invert"
                />
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.035em] text-white sm:text-2xl">
                    {title}
                  </h3>
                  <p className="mt-3 max-w-[650px] text-sm leading-6 text-white/55 sm:text-base">
                    {text}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-white" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SolutionsSection() {
  const [activeSolution, setActiveSolution] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const selected = solutions[activeSolution];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia('(max-width: 1023px)').matches) return;

    let frame = 0;
    const updateActiveSolution = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const scrollDistance = Math.max(
        1,
        rect.height - window.innerHeight - 400
      );
      const progress = Math.max(
        0,
        Math.min(0.999, (-rect.top - 400) / scrollDistance)
      );
      const nextIndex = Math.floor(progress * solutions.length);
      setActiveSolution((current) =>
        current === nextIndex ? current : nextIndex
      );
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSolution);
    };

    updateActiveSolution();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="bg-white px-5 py-24 sm:px-8 lg:h-[3233px] lg:px-3 lg:py-0"
    >
      <div className="mx-auto max-w-[1683px] lg:h-full lg:pt-[120px]">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p
              data-ss-motion
              className="text-xs font-bold uppercase tracking-[0.08em] text-[#1f2023]"
            >
              Solutions built around your freight{' '}
              <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
            </p>
            <h2
              data-ss-scrub-text
              className="mt-5 max-w-[1050px] text-5xl font-semibold leading-[1.05] tracking-[-0.055em] text-[#1d1d1d] sm:text-7xl lg:text-[4rem]"
            >
              From one load to a complete
              <span className="block text-[#278fdf]">
                transportation program.
              </span>
            </h2>
          </div>
          <Link
            href="/get-quote"
            data-ss-motion="right"
            className="inline-flex min-h-[50px] shrink-0 items-center gap-3 self-start rounded-full bg-[#111214] px-7 text-sm font-semibold text-white lg:self-end"
          >
            View All Solutions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-20 grid gap-10 lg:sticky lg:top-[105px] lg:grid-cols-[405px_1fr] lg:gap-[165px]">
          <div
            role="tablist"
            aria-label="Freight solutions"
            className="border-t border-black/10"
          >
            {solutions.map((solution, index) => (
              <button
                key={solution.title}
                type="button"
                role="tab"
                aria-selected={activeSolution === index}
                onClick={() => setActiveSolution(index)}
                className={`flex min-h-[50px] w-full items-center justify-between border-b border-black/10 px-0 text-left text-xl font-medium tracking-[-0.035em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ba6f8] sm:text-2xl ${
                  activeSolution === index
                    ? 'bg-[#dedede] px-4 text-[#111214]'
                    : 'text-[#111214] hover:bg-[#f2f2f2] hover:px-4'
                }`}
              >
                {solution.title}
                {activeSolution === index ? (
                  <ArrowRight className="h-5 w-5" />
                ) : null}
              </button>
            ))}
          </div>

          <div
            key={selected.title}
            role="tabpanel"
            className="ss-solution-panel grid min-h-[333px] overflow-hidden rounded-[1rem] bg-[#f2f2f2] lg:grid-cols-[1fr_396px]"
          >
            <div className="flex min-h-[333px] flex-col justify-center p-8 sm:p-14 lg:p-[60px]">
              <span className="grid h-14 w-14 place-items-center text-[#4ba6f8]">
                <Image
                  src={selected.iconImage}
                  alt=""
                  width={45}
                  height={45}
                  unoptimized
                  className="h-11 w-11 object-contain"
                />
              </span>
              <p className="mt-7 max-w-[565px] text-2xl font-medium leading-[1.18] tracking-[-0.035em] text-[#111214] sm:text-3xl">
                {selected.description}
              </p>
            </div>
            <div className="relative min-h-[300px] lg:min-h-[333px]">
              <Image
                key={selected.image}
                src={selected.image}
                alt={`${selected.title} by ShipSmart`}
                fill
                priority
                unoptimized
                sizes="396px"
                className="ss-solution-image object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="overflow-hidden bg-[#0b172c] px-5 py-24 text-white sm:px-8 lg:h-[873px] lg:px-3 lg:py-[135px]">
      <div className="relative mx-auto h-full max-w-[1683px]">
        <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p
              data-ss-motion="left"
              className="text-xs font-bold uppercase tracking-[0.04em] text-white"
            >
              A simpler way to move freight{' '}
              <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
            </p>
            <h2
              data-ss-scrub-text
              className="mt-4 max-w-[900px] text-5xl font-medium leading-[0.98] tracking-[-0.055em] text-white sm:text-7xl lg:text-[5rem]"
            >
              Clear process.
              <span className="block text-[#278fdf]">Fewer surprises.</span>
            </h2>
          </div>
          <div className="pb-3">
            <p
              data-ss-motion
              data-ss-delay="1"
              className="max-w-[420px] text-sm leading-6 text-white/65"
            >
              Every shipment follows a visible workflow, with one accountable
              team from strategy through delivery.
            </p>
            <Link
              href="/get-quote"
              data-ss-motion
              data-ss-delay="2"
              className="mt-10 inline-flex min-h-[50px] items-center gap-3 rounded-full bg-[#4ba6f8] px-7 text-sm font-semibold text-white"
            >
              Explore More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-[88px] grid border-t border-white/10 md:grid-cols-2 lg:absolute lg:inset-x-0 lg:bottom-[-135px] lg:mt-0 lg:h-[370px] lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <article
              key={step.number}
              data-ss-motion
              className={`relative border-b border-white/10 px-8 py-9 lg:border-b-0 lg:px-9 lg:py-12 ${
                index > 0 ? 'lg:border-l lg:border-white/10' : ''
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <span className="block h-3 w-3 rounded-full bg-white/75" />
              <span className="mt-8 block text-[4rem] font-light leading-none tracking-[-0.06em] text-white/60">
                {step.number}
              </span>
              <h3 className="mt-6 text-xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-2xl">
                {step.title}
              </h3>
              <p className="mt-4 max-w-[310px] text-sm leading-6 text-white/55">
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesMarquee() {
  return (
    <section
      aria-label="ShipSmart services"
      className="overflow-hidden bg-[#4ba6f8] py-8 text-white lg:h-[98px] lg:py-0"
    >
      <div className="ss-services-marquee flex min-w-max items-center lg:h-full">
        {[...marqueeServices, ...marqueeServices].map((service, index) => (
          <span
            key={`${service}-${index}`}
            aria-hidden={index >= marqueeServices.length}
            className="flex items-center text-lg font-semibold tracking-[-0.035em] text-white sm:text-2xl lg:text-[2rem]"
          >
            <span className="px-7 sm:px-10">{service}</span>
            <span className="h-3 w-3 rotate-45 bg-white/85" />
          </span>
        ))}
      </div>
    </section>
  );
}

function VisibilitySection() {
  return (
    <section className="overflow-hidden bg-[#fefefe] px-5 py-24 sm:px-8 lg:h-[843px] lg:px-[76px] lg:py-[92px]">
      <div className="mx-auto grid h-full max-w-[1555px] gap-14 lg:grid-cols-[620px_1fr] lg:gap-[90px]">
        <div className="relative z-10">
          <p
            data-ss-motion="left"
            className="text-xs font-bold uppercase tracking-[0.04em] text-[#17181b]"
          >
            Technology &amp; visibility{' '}
            <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
          </p>
          <h2
            data-ss-scrub-text
            className="mt-7 max-w-[620px] text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-[#111214] sm:text-6xl lg:text-[4rem]"
          >
            See every shipment.
            <span className="block text-[#969696]">Act before delays.</span>
          </h2>
          <p
            data-ss-motion
            data-ss-delay="1"
            className="mt-8 max-w-[500px] text-[15px] leading-[1.65] text-[#77797e]"
          >
            One connected view brings together live status, shipment documents,
            milestones and performance insights—without chasing updates across
            emails and spreadsheets.
          </p>
          <div className="mt-8 flex max-w-[545px] flex-wrap gap-2">
            {[
              'Real-time shipment tracking',
              'Automated milestone updates',
              'Digital freight management',
              'Actionable performance reporting',
            ].map((item, index) => (
              <span
                key={item}
                data-ss-motion
                style={{ transitionDelay: `${index * 70}ms` }}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.035em] text-[#4f5156]"
              >
                {item}
              </span>
            ))}
          </div>
          <Link
            href="/about-us"
            data-ss-motion
            data-ss-delay="2"
            className="mt-10 inline-flex min-h-[50px] items-center gap-3 rounded-full bg-[#111214] px-7 text-sm font-semibold text-white"
          >
            More About Us <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative min-h-[620px] lg:min-h-0">
          <div
            data-ss-motion="left"
            className="ss-zoom-frame absolute bottom-0 left-0 z-10 h-[350px] w-[53%] overflow-hidden rounded-[1.25rem] lg:bottom-[29px] lg:h-[350px] lg:w-[334px]"
          >
            <Image
              src={`${LANDING_ASSET_ROOT}/ship19.svg`}
              alt="ShipSmart operations specialist monitoring live freight"
              fill
              unoptimized
              sizes="(max-width: 1024px) 53vw, 334px"
              className="ss-zoom-media object-cover"
            />
          </div>
          <div
            data-ss-motion="right"
            data-ss-delay="1"
            className="ss-zoom-frame absolute right-0 top-0 h-[520px] w-[64%] overflow-hidden rounded-[1.25rem] lg:h-[582px] lg:w-[407px]"
          >
            <Image
              src={`${LANDING_ASSET_ROOT}/gps-ship.png`}
              alt="ShipSmart live GPS shipment visibility"
              fill
              unoptimized
              sizes="(max-width: 1024px) 64vw, 407px"
              className="ss-zoom-media object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function IndustriesSection() {
  return (
    <section className="bg-[#f2f2f2] px-5 py-24 sm:px-8 lg:h-[1413px] lg:px-3 lg:py-[100px]">
      <div className="mx-auto max-w-[1683px]">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p
              data-ss-motion
              className="text-xs font-bold uppercase tracking-[0.04em] text-[#17181b]"
            >
              Industries we serve{' '}
              <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
            </p>
            <h2
              data-ss-scrub-text
              className="mt-7 max-w-[980px] text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-[#111214] sm:text-6xl lg:text-[4rem]"
            >
              Logistics expertise for the industries that keep business moving.
            </h2>
          </div>
          <Link
            href="/get-quote"
            data-ss-motion="right"
            className="inline-flex min-h-[50px] shrink-0 items-center gap-3 self-start rounded-full bg-[#111214] px-6 text-sm font-semibold text-white lg:self-auto"
          >
            More About Us <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:auto-rows-[270px] lg:grid-cols-3">
          {industryCards.map((card, index) => {
            const dark = card.className.includes('text-white');
            return (
              <article
                key={card.title}
                data-ss-motion
                className={`group relative min-h-[270px] overflow-hidden rounded-[1.5rem] border border-black/[0.06] ${card.className}`}
                style={{ transitionDelay: `${(index % 3) * 70}ms` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt=""
                  className={`pointer-events-none absolute max-w-none transition-transform duration-700 ease-out group-hover:scale-[1.04] ${card.imageClass}`}
                />
                {dark ? (
                  <div className="absolute inset-0 bg-gradient-to-b from-[#07182f]/80 via-[#07182f]/45 to-[#07182f]/85" />
                ) : null}
                <div
                  className={`relative z-10 flex h-full min-h-[270px] flex-col p-7 ${
                    card.title === 'Construction'
                      ? 'justify-start gap-4'
                      : 'justify-between'
                  }`}
                >
                  <h3
                    className={`max-w-[90%] text-2xl font-semibold uppercase leading-[1.02] tracking-[-0.04em] ${
                      dark ? 'text-white' : 'text-[#111214]'
                    }`}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={`text-lg font-medium leading-tight tracking-[-0.025em] ${
                      card.title === 'Construction'
                        ? 'max-w-full'
                        : 'max-w-[74%]'
                    } ${dark ? 'text-white/90' : 'text-[#66686d]'}`}
                  >
                    {card.text}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WarehouseSection() {
  const features = [
    {
      title: 'Flexible Storage',
      text: 'Scalable space for changing inventory needs.',
    },
    {
      title: 'Inventory Visibility',
      text: 'Clear insight across storage and distribution.',
    },
    {
      title: 'Cross-Dock & Fulfillment',
      text: 'Faster throughput from inbound to final delivery.',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#f2f2f2] px-5 py-24 sm:px-8 lg:h-[1599px] lg:px-7 lg:py-0">
      <div className="relative mx-auto h-full max-w-[1651px]">
        <div className="relative z-20 lg:absolute lg:inset-x-0 lg:top-[155px]">
          <p
            data-ss-motion
            className="text-xs font-bold uppercase tracking-[0.04em] text-[#17181b]"
          >
            Smart warehouse solutions{' '}
            <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
          </p>
          <h2
            data-ss-scrub-text
            className="mt-7 max-w-[1350px] text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-[#111214] sm:text-6xl lg:text-[4rem]"
          >
            Space, systems, and speed — all connected.
          </h2>
        </div>

        <div className="relative z-20 mt-14 grid gap-8 lg:absolute lg:inset-x-0 lg:top-[350px] lg:mt-0 lg:grid-cols-[534px_1fr] lg:gap-[166px]">
          <div
            data-ss-motion="left"
            className="ss-zoom-frame relative h-[470px] overflow-hidden rounded-[1.25rem]"
          >
            <Image
              src={`${LANDING_ASSET_ROOT}/ship11.svg`}
              alt="ShipSmart warehouse operations specialist"
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 534px"
              className="ss-zoom-media object-cover"
            />
          </div>

          <div className="relative min-h-[470px]">
            <p
              data-ss-motion="right"
              className="max-w-[680px] text-[15px] leading-[1.65] text-[#77797e]"
            >
              Warehousing, distribution, fulfillment, and transportation operate
              as one connected logistics program—giving your business the space,
              visibility, and flexibility to keep inventory moving.
            </p>
            <Link
              href="/about-us"
              data-ss-motion="right"
              data-ss-delay="1"
              className="mt-7 inline-flex min-h-[50px] items-center gap-3 rounded-full bg-[#111214] px-7 text-sm font-semibold text-white"
            >
              More About Us <ArrowUpRight className="h-4 w-4" />
            </Link>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:absolute lg:inset-x-0 lg:top-[190px] lg:mt-0 lg:grid-cols-[457px_1fr] lg:gap-[15px]">
              <article
                data-ss-motion
                className="flex min-h-[279px] flex-col justify-between rounded-[1.25rem] bg-[#4ba6f8] p-8 text-white"
              >
                <p className="text-[4.5rem] font-semibold leading-none tracking-[-0.075em] text-white">
                  1.8M +
                </p>
                <p className="max-w-[210px] text-xs font-bold uppercase leading-5 tracking-[0.08em] text-white/85">
                  Square feet of warehouse space
                </p>
              </article>

              <div className="grid overflow-hidden rounded-[1.25rem] bg-white">
                {features.map((feature, index) => (
                  <article
                    key={feature.title}
                    data-ss-motion
                    className={`flex min-h-[93px] items-center gap-5 px-6 ${
                      index > 0 ? 'border-t border-black/[0.07]' : ''
                    }`}
                    style={{ transitionDelay: `${index * 80}ms` }}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#edf6fe] text-sm font-semibold text-[#4ba6f8]">
                      {index + 1}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-[#111214]">
                        {feature.title}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[#85878b]">
                        {feature.text}
                      </span>
                    </span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="ss-zoom-frame relative z-10 mt-10 h-[520px] overflow-hidden rounded-[1.25rem] lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:h-[768px] lg:rounded-b-none">
          <Image
            src={`${LANDING_ASSET_ROOT}/warehouse.svg`}
            alt="ShipSmart connected warehousing and distribution"
            fill
            unoptimized
            sizes="100vw"
            className="ss-zoom-media object-cover"
          />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f2f2f2] to-transparent lg:h-12" />
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section className="bg-[#f2f2f2] px-5 py-24 sm:px-8 lg:h-[1216px] lg:px-12 lg:py-[102px]">
      <div className="mx-auto max-w-[1000px]">
        <div className="text-center">
          <p
            data-ss-motion
            className="text-xs font-bold uppercase tracking-[0.04em] text-[#17181b]"
          >
            FAQ <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
          </p>
          <h2
            data-ss-scrub-text
            className="mt-7 text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-[#111214] sm:text-6xl lg:text-[4rem]"
          >
            Frequently Asked Questions.
          </h2>
        </div>

        <div
          data-ss-motion
          className="mx-auto mt-[70px] grid max-w-[800px] gap-3"
        >
          {faqs.map((faq, index) => {
            const isOpen = index === openFaq;
            return (
              <article
                key={faq.question}
                className="overflow-hidden rounded-[1rem] border border-black/[0.07] bg-[#f8f8f8]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  className="flex min-h-[82px] w-full items-center justify-between gap-6 px-7 py-5 text-left text-base font-semibold tracking-[-0.025em] text-[#111214] sm:px-8 sm:text-lg"
                >
                  {faq.question}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-black/10 text-lg font-normal text-[#111214]">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[690px] px-7 pb-7 text-sm leading-6 text-[#6f7175] sm:px-8">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[#0e0f10] px-5 py-24 text-white sm:px-8 lg:h-[600px] lg:px-12 lg:py-0">
      <div className="relative mx-auto flex h-full min-h-[410px] max-w-[1200px] flex-col items-center justify-center text-center">
        <div className="max-w-[1050px]">
          <p
            data-ss-motion
            className="mx-auto inline-flex rounded-full bg-white/[0.08] px-4 py-2 text-xs font-medium text-white/75"
          >
            Ready to move?
          </p>
          <h2
            data-ss-scrub-text
            className="mt-8 text-5xl font-semibold leading-[0.96] tracking-[-0.065em] text-white sm:text-6xl lg:text-[4.5rem]"
          >
            Let’s move your business forward.
          </h2>
          <p
            data-ss-motion
            data-ss-delay="1"
            className="mx-auto mt-7 max-w-[650px] text-sm leading-6 text-white/45"
          >
            Tell us about your freight needs and our logistics team will connect
            with you to build the right transportation solution.
          </p>
          <form
            onSubmit={(event) => event.preventDefault()}
            data-ss-motion
            data-ss-delay="2"
            className="mx-auto mt-9 flex min-h-[60px] max-w-[380px] items-center rounded-full bg-white p-1.5"
          >
            <label htmlFor="landing-cta-email" className="sr-only">
              Email
            </label>
            <input
              id="landing-cta-email"
              type="email"
              placeholder="Email"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-[#111214] outline-none placeholder:text-[#8a8b8e]"
            />
            <button
              type="submit"
              className="inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-full bg-[#4ba6f8] px-5 text-sm font-semibold text-white"
            >
              Get started <ArrowUpRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export function EditorialHome() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEditorialMotion(rootRef);

  return (
    <LandingLayout rootRef={rootRef}>
      <Hero />
      <AboutSection />
      <NetworkSection />
      <WhySection />
      <DarkAdvantagesSection />
      <SolutionsSection />
      <ProcessSection />
      <ServicesMarquee />
      <VisibilitySection />
      <IndustriesSection />
      <WarehouseSection />
      <FaqSection />
      <FinalCta />
    </LandingLayout>
  );
}
