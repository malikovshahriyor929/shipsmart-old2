'use client';

import { Link } from '@core/i18n/routing';
import { ArrowUpRight, Check, ChevronDown, Phone } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import LandingLayout from '@/layouts/landing/landing-layout';

const LANDING_ASSET_ROOT = '/shipsmart-landing';

const nextSteps = [
  {
    number: '01',
    title: 'Review your details',
    text: 'We review your shipment information, timing, and requirements.',
  },
  {
    number: '02',
    title: 'Match the right capacity',
    text: 'We identify the best equipment, route, and solution for your shipment.',
  },
  {
    number: '03',
    title: 'Send your quote',
    text: 'You receive clear pricing, timing, and the next steps from our team.',
  },
];

const fieldClass =
  'mt-2 h-12 w-full rounded-xl border border-black/[0.10] bg-white px-4 text-sm font-medium text-[#17181b] outline-none transition placeholder:text-[#9a9da3] hover:border-black/20 focus:border-[#03a1fe] focus:ring-4 focus:ring-[#03a1fe]/10';

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block text-xs font-bold text-[#17181b]">
      {label}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className={fieldClass}
      />
    </label>
  );
}

function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="rounded-[2rem] bg-white p-5 shadow-[0_22px_70px_rgba(10,26,51,.12)] sm:p-8 lg:p-10"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="border-b border-black/[0.08] pb-7">
        <h2 className="text-2xl font-bold tracking-[-0.045em] text-[#111214] sm:text-[1.875rem]">
          Tell us about your shipment
        </h2>
      </div>

      <div className="mt-7 grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <Field
          label="Company name *"
          name="company"
          placeholder="Your company"
          required
        />
        <Field
          label="Contact name *"
          name="contact"
          placeholder="Full name"
          required
        />
        <Field
          label="Email *"
          name="email"
          type="email"
          placeholder="name@company.com"
          required
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          placeholder="(555) 123-4567"
        />
        <Field
          label="Origin city *"
          name="origin"
          placeholder="City, State"
          required
        />
        <Field
          label="Destination city *"
          name="destination"
          placeholder="City, State"
          required
        />
        <label className="block text-xs font-bold text-[#17181b]">
          Freight type *
          <span className="relative mt-2 block">
            <select
              name="freightType"
              required
              defaultValue=""
              className={`${fieldClass} mt-0 appearance-none pr-11`}
            >
              <option value="" disabled>
                Select freight type
              </option>
              <option>Dry van</option>
              <option>Reefer</option>
              <option>Flatbed / open deck</option>
              <option>Expedited</option>
              <option>Warehousing & distribution</option>
              <option>Other / specialized</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#77797e]" />
          </span>
        </label>
        <Field
          name="weight"
          label="Approx. weight"
          placeholder="e.g., 12,000 lbs"
        />
        <Field
          name="pickupDate"
          label="Pickup date"
          type="date"
          placeholder="Select date"
        />
        <label className="block text-xs font-bold text-[#17181b] sm:col-span-2">
          Shipment notes
          <textarea
            name="notes"
            placeholder="Equipment, accessorials, cargo details, or anything else we should know."
            className={`${fieldClass} min-h-28 resize-y py-3.5`}
          />
        </label>
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-[#17181b] px-7 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#03a1fe]/25"
        >
          {submitted ? (
            <>
              Request received <Check className="h-4 w-4" />
            </>
          ) : (
            <>
              Submit quote request <ArrowUpRight className="h-4 w-4" />
            </>
          )}
        </button>
        <Link
          href="/get-quote/freight-details"
          className="inline-flex items-center justify-center gap-2 text-center text-sm font-bold text-[#03a1fe] transition hover:text-[#018fe5]"
        >
          Need to provide freight details first?{' '}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {submitted ? (
        <p
          role="status"
          className="mt-5 rounded-2xl bg-[#eaf7ff] px-4 py-3 text-sm font-semibold text-[#075987]"
        >
          Thanks — your request is ready for our logistics team to review.
        </p>
      ) : null}
    </form>
  );
}

export function EditorialQuotePage() {
  return (
    <LandingLayout className="bg-[#f2f2f2]">
      <section className="px-4 pb-24 pt-32 sm:px-6 sm:pt-40 lg:px-8 lg:pt-[10.75rem]">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 xl:grid-cols-[0.95fr_1.05fr] xl:items-start xl:gap-16">
            <div className="pb-2 xl:pt-7">
              <h1 className="max-w-[680px] text-[3.35rem] font-bold leading-[0.92] tracking-[-0.07em] text-[#111214] sm:text-[4.75rem] lg:text-[5.5rem]">
                Let&apos;s move your{' '}
                <span className="text-[#03a1fe]">freight.</span>
              </h1>
              <p className="mt-7 max-w-[570px] text-base leading-7 text-[#585959] sm:text-[1.0625rem]">
                Share a few shipment details and our logistics team will build
                the right solution for your lane, timing, and cargo.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4">
                {['Fast response', 'Nationwide coverage', '24/7 support'].map(
                  (item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#303030]"
                    >
                      <span className="grid h-5 w-5 place-items-center rounded-full border-2 border-[#03a1fe] text-[#03a1fe]">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="relative min-h-[31rem] overflow-hidden rounded-[2rem] bg-[#5ca4e8] sm:min-h-[39rem] xl:min-h-[720px]">
              <Image
                src={`${LANDING_ASSET_ROOT}/main-bg.svg`}
                alt="Container ship moving global freight"
                fill
                priority
                unoptimized
                sizes="(max-width: 1280px) 100vw, 820px"
                className="object-cover object-center"
              />
              <a
                href="tel:+13312154701"
                className="absolute bottom-6 right-6 flex items-center gap-3 rounded-[1.4rem] bg-white p-3.5 pr-5 shadow-[0_16px_45px_rgba(6,19,37,.18)] transition hover:-translate-y-1 sm:bottom-10 sm:right-10"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#e8f6ff] text-[#03a1fe]">
                  <Phone className="h-5 w-5 fill-current" />
                </span>
                <span>
                  <span className="block text-[11px] font-semibold text-[#585959]">
                    Prefer to talk?
                  </span>
                  <span className="mt-0.5 block text-sm font-bold text-[#111214] sm:text-base">
                    (331) 215-4701
                  </span>
                </span>
              </a>
            </div>
          </div>

          <div className="relative z-10 mt-6 max-w-[1040px] xl:-mt-[19rem]">
            <QuoteForm />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <h2 className="text-4xl font-bold tracking-[-0.055em] text-[#111214] sm:text-[2.75rem]">
            What happens next
          </h2>
          <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-0">
            {nextSteps.map((step, index) => (
              <article
                key={step.number}
                className={`lg:min-h-[220px] lg:px-10 ${
                  index === 0 ? 'lg:pl-0' : 'lg:border-l lg:border-black/10'
                }`}
              >
                <p className="text-[2.75rem] font-bold tracking-[-0.06em] text-[#03a1fe]">
                  {step.number}
                </p>
                <h3 className="mt-5 text-lg font-bold tracking-[-0.035em]">
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
    </LandingLayout>
  );
}
