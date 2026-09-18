'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Clock3, Radar, ShieldCheck } from 'lucide-react';

export default function AuthWrapperOne({
  children,
  title,
  bannerTitle,
  bannerDescription,
  description,
  pageImage,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  description?: string;
  bannerTitle?: string;
  bannerDescription?: string;
  pageImage?: React.ReactNode;
  isSocialLoginActive?: boolean;
  isSignIn?: boolean;
}) {
  return (
    <div
      className="min-h-screen w-full overflow-x-hidden bg-[#f2f2f2] p-3 text-[#111214] sm:p-5 lg:h-dvh lg:min-h-0 lg:overflow-hidden lg:p-3"
      style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1700px] flex-col sm:min-h-[calc(100vh-2.5rem)] lg:h-full lg:min-h-0">
        <header className="flex min-h-[68px] items-center justify-between gap-4 px-1 pb-3 sm:px-2 lg:min-h-[52px] lg:pb-2">
          <Link
            href="/"
            aria-label="ShipSmart home"
            className="inline-flex rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#03a1fe]"
          >
            <Image
              src="/shipsmart-landing/logo.svg"
              alt="ShipSmart Solutions"
              width={311}
              height={69}
              priority
              unoptimized
              className="h-auto w-[170px] sm:w-[205px] lg:w-[180px]"
            />
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#fefefe] px-4 text-xs font-semibold text-[#17181b] shadow-[0_1px_0_rgba(0,0,0,.03)] transition hover:-translate-y-0.5 sm:px-5 sm:text-sm"
          >
            Back to website
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </header>

        <main className="grid flex-1 gap-3 lg:min-h-0 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
          <section className="flex min-w-0 items-center rounded-[1.75rem] bg-[#fefefe] px-5 py-12 sm:px-10 lg:min-h-0 lg:px-10 lg:py-5 xl:px-14 [@media(max-height:650px)]:py-2">
            <div className="mx-auto w-full max-w-[470px]">
              <div className="mb-9 lg:mb-5 [@media(max-height:650px)]:mb-3">
                <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-3.5 py-2 text-xs font-semibold text-[#4d4f54] shadow-[0_4px_20px_rgba(10,20,36,.04)] lg:mb-3 lg:py-1.5 [@media(max-height:650px)]:hidden">
                  <span className="h-2 w-2 rounded-full bg-[#03a1fe]" />
                  Client portal
                </p>
                <h1 className="text-[2.35rem] font-semibold leading-[1.02] tracking-[-0.055em] text-[#111214] sm:text-[3rem] lg:text-[2.5rem] xl:text-[2.75rem] [@media(max-height:650px)]:text-[2.1rem]">
                  {title}
                </h1>
              </div>
              {description ? (
                <p className="-mt-4 mb-8 text-sm leading-6 text-[#696b70]">
                  {description}
                </p>
              ) : null}
              {children}
              <p className="mt-8 text-center text-xs leading-5 text-[#85878b] lg:mt-4 [@media(max-height:650px)]:hidden">
                Protected access for authorized ShipSmart team members.
              </p>
            </div>
          </section>

          <section className="relative hidden min-w-0 overflow-hidden rounded-[1.75rem] bg-[#0b2b4d] text-white lg:flex lg:min-h-0">
            <div className="absolute inset-0">{pageImage}</div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,20,39,.08)_0%,rgba(4,20,39,.12)_35%,rgba(4,20,39,.92)_100%)]" />

            <div className="relative z-10 flex w-full flex-col justify-between p-6 xl:p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#07182f]/35 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Secure operations workspace
                </span>
                <span className="rounded-full border border-white/20 bg-[#07182f]/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/80 backdrop-blur-md">
                  ShipSmart
                </span>
              </div>

              <div className="max-w-[680px]">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/65">
                  Connected logistics platform
                </p>
                <h2 className="max-w-[620px] text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-white xl:text-[3.5rem]">
                  {bannerTitle ?? 'Admin Portal'}
                </h2>
                <p className="mt-3 max-w-[590px] text-sm leading-5 text-white/70 xl:text-[15px] xl:leading-6">
                  {bannerDescription ||
                    'Manage freight operations, quotes, visibility, and customer workflows from one connected workspace.'}
                </p>

                <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-[1.1rem] border border-white/15 bg-[#07182f]/40 backdrop-blur-md">
                  {[
                    { icon: Radar, label: 'Live tracking' },
                    { icon: ShieldCheck, label: 'Secure access' },
                    { icon: Clock3, label: '24/7 visibility' },
                  ].map(({ icon: FeatureIcon, label }, index) => {
                    return (
                      <div
                        key={label}
                        className={`flex min-h-[72px] flex-col justify-between gap-2 p-3 ${
                          index > 0 ? 'border-l border-white/15' : ''
                        }`}
                      >
                        <FeatureIcon className="h-5 w-5 text-[#61bcff]" />
                        <span className="text-xs font-semibold text-white/85 xl:text-sm">
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
