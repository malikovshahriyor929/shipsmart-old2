import { Link } from '@core/i18n/routing';
import Image from 'next/image';
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  ChevronDown,
  Clock3,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import LandingLayout from '@/layouts/landing/landing-layout';

export type LandingItem = {
  title: string;
  slug: string;
  summary: string;
};

export type LandingSection = {
  title: string;
  slug: string;
  summary: string;
  items: LandingItem[];
};

export const landingSections: LandingSection[] = [
  {
    title: 'Solutions',
    slug: 'solutions',
    summary:
      'Freight solutions designed around the people, capacity, and urgency behind every shipment.',
    items: [
      {
        title: 'For Shippers',
        slug: 'for-shippers',
        summary:
          'Flexible transportation support, visibility, and capacity for shipper teams.',
      },
      {
        title: 'For Carriers',
        slug: 'for-carriers',
        summary:
          'Quality freight opportunities and clear communication for carrier partners.',
      },
      {
        title: 'Expedited Freight',
        slug: 'expedited-freight',
        summary:
          'Urgent capacity for shipments that need fast, reliable execution.',
      },
      {
        title: 'Dedicated Capacity',
        slug: 'dedicated-capacity',
        summary:
          'Committed equipment and drivers for predictable lanes and priority freight.',
      },
      {
        title: 'Nationwide Freight Brokerage',
        slug: 'nationwide-freight-brokerage',
        summary:
          'Nationwide truckload and LTL coverage backed by a vetted carrier network.',
      },
    ],
  },
  {
    title: 'Shippers',
    slug: 'shippers',
    summary:
      'Flexible freight programs for teams that need reliable coverage, visibility, and execution.',
    items: [
      {
        title: 'Managed Transportation',
        slug: 'managed-transportation',
        summary:
          'Outsourced freight planning, tendering, tracking, and performance management.',
      },
      {
        title: 'Freight Brokerage',
        slug: 'freight-brokerage',
        summary:
          'Truckload and LTL brokerage backed by vetted capacity and responsive operations.',
      },
      {
        title: 'Warehousing',
        slug: 'warehousing',
        summary:
          'Storage, fulfillment support, and distribution coordination for growing networks.',
      },
      {
        title: 'Dedicated Capacity',
        slug: 'dedicated-capacity',
        summary:
          'Committed equipment and drivers for predictable lanes and high-priority freight.',
      },
      {
        title: 'Capacity Solutions',
        slug: 'capacity-solutions',
        summary:
          'Surge support and strategic capacity planning for seasonal or volatile demand.',
      },
      {
        title: 'Project Logistics',
        slug: 'project-logistics',
        summary:
          'Detailed routing, milestone planning, and execution for complex shipments.',
      },
      {
        title: 'White Glove',
        slug: 'white-glove',
        summary:
          'High-touch logistics for sensitive, valuable, or appointment-critical freight.',
      },
      {
        title: 'International Logistics',
        slug: 'international-logistics',
        summary:
          'Cross-border and global shipment coordination with dependable communication.',
      },
      {
        title: 'Expedited Freight',
        slug: 'expedited-freight',
        summary:
          'Fast-turn capacity for urgent shipments with proactive tracking and updates.',
      },
    ],
  },
  {
    title: 'Carriers',
    slug: 'carriers',
    summary:
      'Carrier partnerships built around clear communication, quality freight, and efficient setup.',
    items: [
      {
        title: 'Become a Carrier',
        slug: 'become-a-carrier',
        summary:
          'Join the ShipSmart carrier network and connect with freight that fits your lanes.',
      },
      {
        title: 'Available Loads',
        slug: 'available-loads',
        summary:
          'Find shipment opportunities across dry van, flatbed, reefer, and specialized freight.',
      },
      {
        title: 'Carrier Setup Packet',
        slug: 'carrier-setup-packet',
        summary:
          'Everything needed to onboard quickly and keep documentation organized.',
      },
      {
        title: 'Insurance Requirements',
        slug: 'insurance-requirements',
        summary:
          'Coverage expectations and compliance details for approved carrier partners.',
      },
      {
        title: 'Carrier Benefits',
        slug: 'carrier-benefits',
        summary:
          'Reliable freight, fast communication, and a team focused on long-term relationships.',
      },
    ],
  },
  {
    title: 'Services',
    slug: 'services',
    summary:
      'Core freight modes for domestic, regional, specialized, and time-sensitive shipping.',
    items: [
      {
        title: 'Dry Van',
        slug: 'dry-van',
        summary:
          'Reliable enclosed truckload capacity for palletized, boxed, and general freight.',
      },
      {
        title: 'Flatbed',
        slug: 'flatbed',
        summary:
          'Open-deck capacity for oversized, industrial, construction, and machinery moves.',
      },
      {
        title: 'Reefer',
        slug: 'reefer',
        summary:
          'Temperature-controlled shipping for food, beverage, pharma, and protected freight.',
      },
      {
        title: 'Heavy Haul',
        slug: 'heavy-haul',
        summary:
          'Specialized routing and equipment coordination for over-dimensional shipments.',
      },
      {
        title: 'Drayage',
        slug: 'drayage',
        summary:
          'Port and rail container moves with clear tracking from pickup to delivery.',
      },
      {
        title: 'Expedited',
        slug: 'expedited',
        summary:
          'Urgent freight options for shipments that cannot wait for standard transit.',
      },
      {
        title: 'White Glove',
        slug: 'white-glove',
        summary:
          'Premium handling for delicate, high-value, or appointment-driven deliveries.',
      },
    ],
  },
  {
    title: 'Industries',
    slug: 'industries',
    summary:
      'Freight programs tailored to the operating demands of high-volume industries.',
    items: [
      {
        title: 'Manufacturing',
        slug: 'manufacturing',
        summary:
          'Inbound materials and outbound goods moved with production schedules in mind.',
      },
      {
        title: 'Food & Beverage',
        slug: 'food-and-beverage',
        summary:
          'Temperature-aware and time-sensitive freight coordination for food supply chains.',
      },
      {
        title: 'Retail',
        slug: 'retail',
        summary:
          'Store replenishment, distribution, and seasonal surge capacity for retailers.',
      },
      {
        title: 'Construction',
        slug: 'construction',
        summary:
          'Jobsite, equipment, and material logistics with appointment-focused execution.',
      },
      {
        title: 'Automotive',
        slug: 'automotive',
        summary:
          'Parts, supplier, and production freight with dependable status visibility.',
      },
      {
        title: 'Government',
        slug: 'government',
        summary:
          'Compliant logistics support for public-sector and mission-critical shipments.',
      },
      {
        title: 'Pharma',
        slug: 'pharma',
        summary:
          'Careful coordination for protected, time-sensitive, and regulated freight.',
      },
      {
        title: 'Energy',
        slug: 'energy',
        summary:
          'Industrial logistics for equipment, parts, and field operations.',
      },
      {
        title: 'Technology',
        slug: 'technology',
        summary:
          'Secure handling and tracked delivery for electronics and technology products.',
      },
      {
        title: 'Packaging',
        slug: 'packaging',
        summary:
          'Reliable transport for packaging materials, finished goods, and distribution needs.',
      },
    ],
  },
  {
    title: 'Technology',
    slug: 'technology',
    summary:
      'Visibility tools that keep shipment status, milestones, and exceptions easy to manage.',
    items: [
      {
        title: 'Real-Time Tracking',
        slug: 'real-time-tracking',
        summary:
          'Monitor shipment movement and important milestones as freight progresses.',
      },
      {
        title: 'Shipment Visibility',
        slug: 'shipment-visibility',
        summary:
          'Centralized updates that reduce check calls and improve operational confidence.',
      },
      {
        title: 'Digital Freight Management',
        slug: 'digital-freight-management',
        summary:
          'Freight workflows, documents, and communication organized in one operating model.',
      },
    ],
  },
  {
    title: 'Company',
    slug: 'company',
    summary:
      'A logistics partner focused on coverage, service quality, and practical execution.',
    items: [
      {
        title: 'About',
        slug: 'about',
        summary:
          'Learn how ShipSmart supports shippers and carriers across freight networks.',
      },
      {
        title: 'Why Choose Us',
        slug: 'why-choose-us',
        summary:
          'Service standards, communication practices, and logistics discipline that set us apart.',
      },
      {
        title: 'Carrier Network',
        slug: 'carrier-network',
        summary:
          'A vetted network designed to provide coverage across modes, regions, and industries.',
      },
      {
        title: 'Case Studies',
        slug: 'case-studies',
        summary:
          'Examples of logistics problems solved through planning, capacity, and visibility.',
      },
      {
        title: 'Testimonials',
        slug: 'testimonials',
        summary:
          'Feedback from teams that rely on ShipSmart for consistent freight execution.',
      },
    ],
  },
  {
    title: 'Resources',
    slug: 'resources',
    summary:
      'Practical logistics content for teams planning shipments, managing risk, and tracking trends.',
    items: [
      {
        title: 'About Us',
        slug: 'about-us',
        summary:
          'Learn about ShipSmart, our operating approach, and the team behind every shipment.',
      },
      {
        title: 'Why Choose Us',
        slug: 'why-choose-us',
        summary:
          'See the service standards and freight expertise that guide our work.',
      },
      {
        title: 'Case Studies',
        slug: 'case-studies',
        summary:
          'Explore examples of freight challenges solved through planning and execution.',
      },
      {
        title: 'Logistics Blog',
        slug: 'logistics-blog',
        summary:
          'Freight operations notes, shipping strategy, and logistics best practices.',
      },
      {
        title: 'FAQ',
        slug: 'faq',
        summary:
          'Answers to common questions about quoting, tracking, carrier setup, and service options.',
      },
    ],
  },
  {
    title: 'Contact',
    slug: 'contact',
    summary:
      'Connect with the ShipSmart team for help with a shipment, capacity, or logistics planning.',
    items: [
      {
        title: 'Contact Us',
        slug: 'contact-us',
        summary:
          'Reach the ShipSmart team for questions, support, and freight coordination.',
      },
      {
        title: 'Request Information',
        slug: 'request-information',
        summary:
          'Tell us about your transportation needs and receive the right next steps.',
      },
    ],
  },
];

export const landingNav = [
  { title: 'Track Shipment', href: '/track-shipment' },
  ...landingSections.map(({ title, slug }) => ({ title, href: `/${slug}` })),
  { title: 'Login', href: '/auth/sign-in' },
  { title: 'Get Quote', href: '/get-quote' },
];

const metrics = [
  { value: '24/7', label: 'Shipment support' },
  { value: '50+', label: 'Freight modes and industries' },
  { value: '1', label: 'Coordinated operating view' },
];

export function getSection(sectionSlug: string) {
  return landingSections.find((section) => section.slug === sectionSlug);
}

export function getItem(sectionSlug: string, itemSlug: string) {
  const section = getSection(sectionSlug);
  return {
    section,
    item: section?.items.find((entry) => entry.slug === itemSlug),
  };
}

export function LandingShell({ children }: { children: React.ReactNode }) {
  return (
    <LandingLayout mainClassName="pt-24 sm:pt-28">{children}</LandingLayout>
  );
}

export function HomePage() {
  return (
    <LandingShell>
      <section className="relative isolate overflow-visible bg-[#dceffc] lg:min-h-[640px]">
        <Image
          src="/images/shipsmart-hero.png"
          alt="Container ship leaving port"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(220,239,252,0.98)_0%,rgba(220,239,252,0.92)_32%,rgba(220,239,252,0.18)_63%,rgba(220,239,252,0)_80%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-44 lg:pt-32">
          <div className="max-w-xl">
            <h1 className="max-w-[22rem] text-[2.65rem] font-semibold leading-[1.06] tracking-[-0.04em] text-[#0b1f3a] sm:max-w-xl sm:text-6xl lg:text-7xl">
              Freight delivered. Peace of mind included.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-slate-700 sm:text-lg">
              Reliable freight by ocean, air, and ground. Fast, secure, and
              fully transparent from pickup to delivery.
            </p>
            <Link
              href="/get-quote"
              className="mt-8 inline-flex items-center gap-3 rounded-md bg-[#1769e0] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-[#105bc8]"
            >
              Get a shipping quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="relative z-10 mx-4 -mb-20 mt-4 max-w-7xl rounded-xl bg-white p-5 shadow-[0_16px_45px_rgba(22,54,100,0.16)] sm:mx-6 lg:absolute lg:inset-x-8 lg:-bottom-20 lg:mx-auto lg:mt-0 lg:p-6">
          <form
            className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1.15fr_1.15fr_1.05fr_.55fr_auto]"
            action="/get-quote"
          >
            {[
              ['From', 'City or port'],
              ['To', 'City or port'],
              ['Freight type', 'Select freight type'],
              ['Weight', 'lb'],
            ].map(([label, placeholder], index) => (
              <label
                key={label}
                className="block text-xs font-semibold text-[#0b1f3a]"
              >
                {label}
                <span className="mt-2 flex h-11 items-center justify-between rounded-md border border-slate-200 px-3 text-sm font-normal text-slate-400">
                  {placeholder}
                  {index < 2 && <MapPin className="h-4 w-4 text-[#1769e0]" />}
                  {index === 2 && (
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  )}
                </span>
              </label>
            ))}
            <button
              type="submit"
              className="mt-auto h-11 rounded-md bg-[#1769e0] px-6 text-sm font-semibold text-white transition hover:bg-[#105bc8]"
            >
              Calculate
            </button>
          </form>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto grid max-w-7xl gap-12 px-4 pb-24 pt-36 sm:px-6 lg:grid-cols-[1fr_.9fr] lg:items-center lg:px-8"
      >
        <div>
          <span className="block h-1 w-12 bg-orange-500" />
          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.035em] text-[#0b1f3a] sm:text-5xl">
            Why ShipSmart?
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            Our mission is to move your freight safely and on time while giving
            you complete confidence at every step.
          </p>
          <Link
            href="/solutions"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1769e0] hover:text-[#0b1f3a]"
          >
            Learn more <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="mt-11 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {[
              [
                ShieldCheck,
                'Reliable and secure',
                'Your freight is protected and monitored at every stage of the journey.',
              ],
              [
                Clock3,
                'On-time delivery',
                'Optimized routes and proactive coordination keep every shipment on schedule.',
              ],
              [
                Boxes,
                'Transparent pricing',
                'Clear, upfront pricing with no hidden charges or last-minute surprises.',
              ],
              [
                BadgeCheck,
                '24/7 customer support',
                'Our experienced logistics team is ready to help whenever you need us.',
              ],
            ].map(([Icon, title, copy]) => {
              const FeatureIcon = Icon as typeof ShieldCheck;
              return (
                <div key={title as string} className="flex gap-3">
                  <span className="mt-0.5 text-[#1769e0]">
                    <FeatureIcon className="h-7 w-7 stroke-[1.7]" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#0b1f3a]">
                      {title as string}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {copy as string}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[5rem_1.5rem_5rem_1.5rem] bg-[#b8ddfb] p-5 sm:max-w-lg">
          <Image
            src="/images/shipsmart-port-cranes.png"
            alt="ShipSmart cargo operations at a container port"
            width={960}
            height={720}
            sizes="(max-width: 640px) 100vw, 512px"
            className="h-[420px] w-full rounded-[4rem_1rem_4rem_1rem] object-cover object-center"
          />
        </div>
      </section>

      <section className="bg-[#061b3a] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
              Track your shipment in real time
            </h2>
            <p className="mt-4 text-slate-300">
              See where your freight is at every point in its journey.
            </p>
          </div>
          <div className="mt-10 grid overflow-hidden rounded-xl border border-blue-300/20 bg-[#082a57] lg:grid-cols-[290px_1fr]">
            <div className="p-6">
              <p className="text-xs text-slate-400">Shipment number</p>
              <div className="mt-1 flex items-center justify-between">
                <strong>SSM-2026-05123</strong>
                <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                  In transit
                </span>
              </div>
              <div className="mt-8 space-y-6 text-sm">
                <div>
                  <p className="text-xs text-slate-400">From</p>
                  <p className="mt-1 font-semibold">Shanghai, China</p>
                </div>
                <div className="border-l border-dashed border-blue-300/70 pl-4">
                  <p className="text-xs text-slate-400">To</p>
                  <p className="mt-1 font-semibold">Tashkent, Uzbekistan</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Estimated delivery</p>
                  <p className="mt-1 font-semibold">June 10, 2026</p>
                </div>
              </div>
              <Link
                href="/track-shipment"
                className="mt-8 block rounded-md border border-white/60 px-4 py-3 text-center text-sm font-semibold hover:bg-white/10"
              >
                View shipment details
              </Link>
            </div>
            <div className="relative min-h-[340px] overflow-hidden bg-[#061b3a]">
              <Image
                src="/images/eurasia-tracking-map.png"
                alt="Freight route between Tashkent and Shanghai"
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover object-center opacity-90"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,27,58,.18),transparent_38%,rgba(6,27,58,.08))]" />
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 1000 520"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M 555 245 C 605 170, 700 145, 768 228"
                  fill="none"
                  stroke="rgba(255,255,255,.92)"
                  strokeWidth="3"
                  strokeDasharray="7 8"
                />
                <path
                  d="M 555 245 C 575 215, 600 195, 625 181"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute left-[53.5%] top-[43%] -translate-x-1/2 -translate-y-1/2">
                <span className="absolute -inset-3 rounded-full bg-orange-400/20" />
                <span className="relative grid h-9 w-9 place-items-center rounded-full bg-orange-500 ring-4 ring-white/20" />
                <span className="absolute left-1/2 top-12 -translate-x-1/2 whitespace-nowrap text-sm font-semibold text-white">
                  Toshkent
                </span>
              </div>
              <div className="absolute left-[74.5%] top-[41%] -translate-x-1/2 -translate-y-1/2">
                <span className="absolute -inset-3 rounded-full bg-sky-300/20" />
                <span className="relative grid h-9 w-9 place-items-center rounded-full bg-sky-300 ring-4 ring-white/20" />
                <span className="absolute left-1/2 top-12 -translate-x-1/2 whitespace-nowrap text-sm font-semibold text-white">
                  Shanghai
                </span>
              </div>
              <div className="absolute left-[62.5%] top-[35%] -translate-x-1/2 -translate-y-1/2">
                <span className="absolute -inset-3 rounded-full bg-blue-400/25" />
                <span className="relative grid h-10 w-10 place-items-center rounded-full bg-[#1769e0] shadow-lg shadow-blue-950/50">
                  <Truck className="h-5 w-5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#dceffc] px-4 py-20 sm:px-6 lg:px-8">
        <Image
          src="/images/shipsmart-cta-banner.png"
          alt="Container handling supervised by a ShipSmart logistics professional"
          fill
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(220,239,252,.98)_0%,rgba(220,239,252,.92)_36%,rgba(220,239,252,.15)_64%,transparent_82%)]" />
        <div className="mx-auto max-w-7xl">
          <div className="max-w-xl">
            <h2 className="text-4xl font-semibold tracking-[-0.035em] text-[#0b1f3a] sm:text-5xl">
              Reliable care for every shipment.
            </h2>
            <p className="mt-5 text-slate-600">
              Shipping with ShipSmart is simple, fast, and secure.
            </p>
            <Link
              href="/get-quote"
              className="mt-8 inline-flex w-fit items-center gap-3 rounded-md bg-[#1769e0] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-[#105bc8]"
            >
              Get a shipping quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </LandingShell>
  );
}

export function SectionPage({ section }: { section: LandingSection }) {
  return (
    <LandingShell>
      <PageHero
        eyebrow="ShipSmart"
        title={section.title}
        summary={section.summary}
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {section.items.map((item) => (
            <Link
              key={item.slug}
              href={`/${section.slug}/${item.slug}`}
              className="rounded border border-slate-200 p-5 hover:border-emerald-300 hover:shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-slate-950">
                  {item.title}
                </h2>
                <ArrowRight className="h-5 w-5 text-emerald-700" />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.summary}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </LandingShell>
  );
}

type ServiceDetailContent = {
  title: string;
  hero: string;
  primaryCta: string;
  secondaryCta: string;
  overviewTitle: string;
  overview: string;
  capabilities: Array<{ title: string; text: string }>;
  proofTitle: string;
  proof: string;
  proofPoints: string[];
  processTitle: string;
  process: Array<{ title: string; text: string }>;
  faqs: Array<{ question: string; answer: string }>;
  closingTitle: string;
  closing: string;
};

const serviceDetailContent: Record<string, ServiceDetailContent> = {
  'shippers/managed-transportation': {
    title: 'Managed Transportation Services, Anchored by Our Own Capacity',
    hero: 'Ship Smart Solutions provides managed transportation services for shippers who want to hand off the day-to-day of moving freight to one accountable partner. We plan lanes, execute shipments, manage carriers, and give you visibility across your network - anchored by our own asset-based capacity rather than a pure brokerage that owns nothing.',
    primaryCta: 'Request a Managed Transportation Consult',
    secondaryCta: 'Talk to a Logistics Specialist',
    overviewTitle: 'What Managed Transportation Covers',
    overview:
      'A single program across the work you may be managing today across multiple vendors - coordinated by one accountable team.',
    capabilities: [
      {
        title: 'Lane planning',
        text: 'Build the right mix of modes and lanes for your freight.',
      },
      {
        title: 'Carrier management',
        text: 'Source, vet, and manage capacity without adding internal overhead.',
      },
      {
        title: 'Execution & dispatch',
        text: 'Handle booking, tendering, and day-to-day problem solving.',
      },
      {
        title: 'Visibility & reporting',
        text: 'Keep freight and lane performance in one clear view.',
      },
      {
        title: 'Freight audit & payment',
        text: 'Review invoices and handle payment to help catch billing errors.',
      },
      {
        title: 'Continuous optimization',
        text: 'Use performance and cost reviews to keep improving the program.',
      },
    ],
    proofTitle: 'Why the Asset Base Changes Your Program',
    proof:
      'Most managed-transportation providers design and broker, but own nothing. An asset-based program starts from committed capacity and uses a vetted carrier network to supplement it.',
    proofPoints: [
      'Committed capacity first on core lanes.',
      'Planning, execution, and capacity under one roof.',
      'Overflow network for surge and specialty freight.',
    ],
    processTitle: 'How a Managed Transportation Program Starts',
    process: [
      {
        title: 'Assessment',
        text: 'We review lanes, volumes, modes, and current pain points.',
      },
      {
        title: 'Program design',
        text: 'We define committed lanes, network coverage, and reporting.',
      },
      {
        title: 'Onboarding',
        text: 'We set up execution, visibility, and TMS connections.',
      },
      {
        title: 'Run & optimize',
        text: 'We execute daily and keep improving cost and service.',
      },
    ],
    faqs: [
      {
        question: 'What are managed transportation services?',
        answer:
          'They outsource freight planning, execution, carrier management, dispatch, visibility, and reporting to one accountable provider.',
      },
      {
        question: 'How is asset-based management different?',
        answer:
          'Core lanes run on owned fleet capacity first, with a vetted network filling overflow instead of the program relying entirely on the spot market.',
      },
      {
        question: 'Will I still have visibility into freight?',
        answer:
          'Yes. The program includes a client portal, performance reporting, and optional TMS connectivity.',
      },
      {
        question: 'Does it cover all freight modes?',
        answer:
          'A single program can span reefer, dry van, flatbed, open deck, and expedited freight.',
      },
    ],
    closingTitle: 'Hand Off the Freight, Keep the Control',
    closing:
      'Get a managed transportation program built on committed capacity, one accountable partner, and visibility you can act on.',
  },
  'shippers/freight-brokerage': {
    title: 'Freight Brokerage That Extends Our Own Fleet',
    hero: 'Ship Smart Solutions offers freight brokerage as an extension of our asset-based fleet, not our whole business. When your volume exceeds our own trucks or a lane needs specialized equipment, we cover it through a vetted carrier network held to strict standards - with the same tracking, accountability, and fraud protection you would get on our own equipment.',
    primaryCta: 'Get a Freight Quote',
    secondaryCta: 'Talk to a Capacity Specialist',
    overviewTitle: 'Brokerage Built on an Asset Base',
    overview:
      'We start from a fleet and broker only what we need to, so your freight keeps one standard of visibility and accountability.',
    capabilities: [
      {
        title: 'Owned capacity first',
        text: 'Your freight goes on our own trucks whenever possible.',
      },
      {
        title: 'Vetted network',
        text: 'Pre-qualified carriers cover overflow and specialized lanes.',
      },
      {
        title: 'Same visibility',
        text: 'Tracking, updates, and documents stay consistent either way.',
      },
      {
        title: 'One accountable team',
        text: 'We stay involved from capacity planning through delivery.',
      },
      {
        title: 'Carrier vetting',
        text: 'FMCSA authority, insurance, and safety are verified before hauling.',
      },
      {
        title: 'Fraud protection',
        text: 'Controls help ensure the booked carrier is the carrier that arrives.',
      },
    ],
    proofTitle: 'How We Protect Your Freight From Broker Fraud',
    proof:
      'Freight fraud and double brokering are real operational risks. Because we run a carrier fleet ourselves, we know what legitimate carrier operations look like and monitor the network accordingly.',
    proofPoints: [
      'Authority, insurance, and safety verification.',
      'Double-brokering controls and compliance monitoring.',
      'Cargo protection requirements across the network.',
    ],
    processTitle: 'How Brokerage Works With Ship Smart',
    process: [
      {
        title: 'Request a quote',
        text: 'Share your lane, equipment, and timing.',
      },
      {
        title: 'Fleet check',
        text: 'Owned capacity is assigned whenever it is available.',
      },
      {
        title: 'Cover overflow',
        text: 'Vetted, monitored carriers handle the remaining freight.',
      },
      {
        title: 'Track to delivery',
        text: 'You keep one accountable team and consistent visibility.',
      },
    ],
    faqs: [
      {
        question: 'Are you a broker or a carrier?',
        answer:
          'Ship Smart is primarily an asset-based carrier. Brokerage extends the owned fleet for overflow, off-network lanes, and specialized equipment.',
      },
      {
        question: 'When is freight brokered?',
        answer:
          'When demand exceeds fleet capacity, a lane is outside the usual network, or a load needs equipment not available on that run.',
      },
      {
        question: 'Do brokered loads have tracking?',
        answer:
          'Yes. Updates, documents, and visibility stay consistent whether freight is on an owned truck or a vetted network carrier.',
      },
      {
        question: 'Do you cover freight nationwide?',
        answer:
          'Yes. The owned fleet and vetted network provide coverage across all 48 states.',
      },
    ],
    closingTitle: 'Reach and Accountability in One Partner',
    closing:
      'Get the capacity of a broker network and the accountability of a carrier that owns its trucks, with fraud protection built in.',
  },
  'shippers/warehousing': {
    title: 'Warehousing Services Connected to Transportation',
    hero: 'Ship Smart Solutions provides warehousing services that connect directly to our own trucks, so your product moves from storage to delivery through one accountable provider instead of a warehouse handing off to a separate carrier. From 3PL warehousing and cold storage to cross-docking, pick-and-pack, and order fulfillment, we manage the space and transportation together.',
    primaryCta: 'Get a Warehousing Quote',
    secondaryCta: 'Talk to a 3PL Specialist',
    overviewTitle: 'What We Handle',
    overview:
      'A full range of warehousing, distribution, and fulfillment services connected to transportation under one provider.',
    capabilities: [
      {
        title: '3PL warehousing',
        text: 'Short- and long-term storage with inventory management and reporting.',
      },
      {
        title: 'Cold storage',
        text: 'Temperature-controlled storage connected to refrigerated transport.',
      },
      {
        title: 'Cross-docking',
        text: 'Move inbound freight to outbound trucks with minimal storage time.',
      },
      {
        title: 'Pick-and-pack',
        text: 'Accurate order assembly for retail and e-commerce shipments.',
      },
      {
        title: 'Order fulfillment',
        text: 'E-commerce and B2B fulfillment for marketplace and retail channels.',
      },
      {
        title: 'Distribution',
        text: 'Nationwide distribution from a central Midwest position.',
      },
    ],
    proofTitle: 'Why Storage and Transportation Belong Together',
    proof:
      'Most shippers run a warehouse and a carrier as separate vendors. Under one asset-based provider, product moves from dock to truck through a single, coordinated handoff.',
    proofPoints: [
      'One handoff from storage to delivery.',
      'Tighter timing between dock and scheduled truck.',
      'An unbroken cold chain from shelf to destination.',
    ],
    processTitle: 'How Warehousing With Ship Smart Works',
    process: [
      {
        title: 'Share your needs',
        text: 'Tell us volume, product type, storage duration, and fulfillment requirements.',
      },
      {
        title: 'Design the solution',
        text: 'We match storage, cold storage, cross-dock, or fulfillment to your product.',
      },
      {
        title: 'Manage inventory',
        text: 'Receiving, storage, and pick-pack-ship run on your timelines.',
      },
      {
        title: 'Move it on our trucks',
        text: 'Outbound freight moves with one team accountable through delivery.',
      },
    ],
    faqs: [
      {
        question: 'What warehousing services do you offer?',
        answer:
          '3PL warehousing, cold storage, cross-docking, pick-and-pack, order fulfillment, inventory management, and nationwide distribution.',
      },
      {
        question: 'Do you offer cold storage?',
        answer:
          'Yes. Temperature-controlled storage connects directly to reefer transport to help keep the cold chain unbroken.',
      },
      {
        question: 'Do you handle e-commerce fulfillment?',
        answer:
          'Yes. Pick-and-pack and order fulfillment support e-commerce, B2B, retail replenishment, and marketplace orders.',
      },
      {
        question: 'Where is the warehousing operation located?',
        answer:
          'Operations are based in Naperville, Illinois, within the Chicago metro and centrally positioned for national distribution.',
      },
    ],
    closingTitle: 'One Provider for Storage and Delivery',
    closing:
      'Connect warehousing, fulfillment, and transportation under one accountable team and close the gap between your dock and your customer.',
  },
};

function ServiceDetailPage({ content }: { content: ServiceDetailContent }) {
  return (
    <LandingShell>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8 lg:py-24">
          <div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
              {content.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {content.hero}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/get-quote"
                className="inline-flex items-center gap-2 rounded bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                {content.primaryCta} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact/contact-us"
                className="inline-flex items-center gap-2 rounded border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                {content.secondaryCta}
              </Link>
            </div>
          </div>
          <div className="self-center rounded border border-white/15 bg-white/5 p-6">
            <p className="text-sm font-semibold text-emerald-300">
              One accountable operating view
            </p>
            <div className="mt-6 grid gap-4">
              {content.proofPoints.map((point, index) => (
                <div
                  key={point}
                  className="flex items-start gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded bg-emerald-400/15 text-sm font-semibold text-emerald-300">
                    0{index + 1}
                  </span>
                  <p className="pt-1 text-sm leading-6 text-slate-200">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold text-slate-950">
            {content.overviewTitle}
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            {content.overview}
          </p>
        </div>
        <div className="mt-10 grid divide-y divide-slate-200 border-y border-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-3">
          {content.capabilities.map((capability) => (
            <div
              key={capability.title}
              className="md:nth-[2n+1]:pl-0 lg:nth-[3n+1]:pl-0 p-6 first:pl-0"
            >
              <BadgeCheck className="h-5 w-5 text-emerald-700" />
              <h3 className="mt-5 text-lg font-semibold text-slate-950">
                {capability.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {capability.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div className="border-l-2 border-emerald-400 pl-5">
            <h2 className="text-3xl font-semibold leading-tight">
              {content.proofTitle}
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              {content.proof}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {content.proofPoints.map((point) => (
              <div
                key={point}
                className="border-t border-white/20 pt-4 text-sm leading-6 text-slate-200"
              >
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-slate-950">
          {content.processTitle}
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-4">
          {content.process.map((step, index) => (
            <div key={step.title} className="border-t border-slate-300 pt-5">
              <div className="text-4xl font-semibold text-emerald-700">
                0{index + 1}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-950">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-slate-950">
          Frequently asked questions
        </h2>
        <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
          {content.faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="cursor-pointer list-none pr-8 text-base font-semibold text-slate-950 marker:content-none">
                {faq.question}
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded bg-emerald-600 px-6 py-8 text-slate-950 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold">{content.closingTitle}</h2>
            <p className="mt-3 text-base leading-7 text-emerald-950">
              {content.closing}
            </p>
          </div>
          <Link
            href="/get-quote"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {content.primaryCta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </LandingShell>
  );
}

export function DetailPage({
  section,
  item,
}: {
  section: LandingSection;
  item: LandingItem;
}) {
  const serviceContent = serviceDetailContent[`${section.slug}/${item.slug}`];

  if (serviceContent) {
    return <ServiceDetailPage content={serviceContent} />;
  }

  const bullets = [
    `Dedicated ShipSmart operations support for ${item.title.toLowerCase()}.`,
    'Clear communication from quote through delivery.',
    'Mode, capacity, and visibility planning matched to shipment requirements.',
  ];

  return (
    <LandingShell>
      <PageHero
        eyebrow={section.title}
        title={item.title}
        summary={item.summary}
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">
            Freight support built around execution
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            ShipSmart combines planning, carrier coordination, tracking, and
            exception management so your team can move freight with fewer
            handoffs and clearer accountability.
          </p>
          <div className="mt-8 grid gap-3">
            {bullets.map((bullet) => (
              <div
                key={bullet}
                className="flex gap-3 rounded border border-slate-200 p-4"
              >
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                <p className="text-sm leading-6 text-slate-700">{bullet}</p>
              </div>
            ))}
          </div>
        </div>
        <aside className="rounded border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-950">
            Request a quote
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Share shipment details and the operations team can match the right
            service path.
          </p>
          <Link
            href="/get-quote"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Start Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </section>
    </LandingShell>
  );
}

export function QuotePage() {
  return (
    <LandingShell>
      <PageHero
        eyebrow="Get Quote"
        title="Tell us what you need to move."
        summary="Use this page as the quote entry point for shippers, carriers, and specialized logistics requests."
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="space-y-4">
          {[
            {
              icon: MapPin,
              title: 'Lane details',
              text: 'Origin, destination, timing, and appointment requirements.',
            },
            {
              icon: PackageCheck,
              title: 'Freight profile',
              text: 'Mode, weight, dimensions, commodity, and handling needs.',
            },
            {
              icon: Clock3,
              title: 'Service priority',
              text: 'Standard, expedited, white glove, or project-based support.',
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex gap-4 rounded border border-slate-200 p-5"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded bg-emerald-50 text-emerald-700">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-semibold text-slate-950">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
        <form className="grid gap-4 rounded border border-slate-200 bg-white p-5 shadow-sm">
          {[
            'Company name',
            'Contact name',
            'Email',
            'Phone',
            'Origin city',
            'Destination city',
          ].map((label) => (
            <label
              key={label}
              className="grid gap-2 text-sm font-semibold text-slate-800"
            >
              {label}
              <input className="h-11 rounded border border-slate-300 px-3 text-sm font-normal outline-none focus:border-emerald-600" />
            </label>
          ))}
          <label className="grid gap-2 text-sm font-semibold text-slate-800">
            Shipment notes
            <textarea className="min-h-28 rounded border border-slate-300 px-3 py-3 text-sm font-normal outline-none focus:border-emerald-600" />
          </label>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Submit Quote Request <ArrowRight className="h-4 w-4" />
          </button>
          <Link
            href="/get-quote/freight-details"
            className="text-center text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Need to provide freight details first?
          </Link>
        </form>
      </section>
    </LandingShell>
  );
}

export function ClientPortalPage() {
  return (
    <LandingShell>
      <PageHero
        eyebrow="Client Portal"
        title="Your freight operations, in one place."
        summary="Sign in to access shipment information, documents, and account support through the ShipSmart client portal."
      />
      <section className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6 lg:px-8">
        <Link
          href="/auth/sign-in"
          className="inline-flex items-center gap-2 rounded bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Sign in to Client Portal <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </LandingShell>
  );
}

export function FreightDetailsPage() {
  return (
    <LandingShell>
      <PageHero
        eyebrow="Get a Quote"
        title="Share your freight details."
        summary="Provide the shipment information our operations team needs to match the right service and capacity."
      />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
          {[
            'Pickup date',
            'Freight mode',
            'Weight',
            'Dimensions',
            'Commodity',
            'Handling requirements',
          ].map((label) => (
            <label
              key={label}
              className="grid gap-2 text-sm font-semibold text-slate-800"
            >
              {label}
              <input className="h-11 rounded border border-slate-300 px-3 text-sm font-normal outline-none focus:border-emerald-600" />
            </label>
          ))}
        </div>
      </section>
    </LandingShell>
  );
}

function PageHero({
  eyebrow,
  title,
  summary,
}: {
  eyebrow: string;
  title: string;
  summary: string;
}) {
  return (
    <section className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200">
          {summary}
        </p>
      </div>
    </section>
  );
}
