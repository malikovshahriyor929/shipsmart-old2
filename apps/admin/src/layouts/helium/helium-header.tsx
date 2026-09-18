'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Link } from '@core/i18n/routing';
import HamburgerButton from '@core/layouts/hamburger-button';
import StyledThemeSwitch from '@core/layouts/settings/theme-switcher';
import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';

const ProfileMenu = dynamic(() => import('@/layouts/profile-menu'), {
  ssr: false,
  loading: () => (
    <div className="h-9 w-9 rounded-full bg-gray-100 shadow sm:h-10 sm:w-10" />
  ),
});

const MobileSidebar = dynamic(() => import('./helium-sidebar'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full bg-[#07182f] p-5 dark:bg-gray-100">
      <div className="h-20 w-20 rounded-full bg-white/10" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-9 rounded-md bg-white/10" />
        ))}
      </div>
    </div>
  ),
});

function HeaderMenuRight() {
  return (
    <div className="ms-auto flex shrink-0 items-center gap-2 text-[#07182f] dark:text-gray-700 xs:gap-3">
      <Link
        href={'/'}
        className="hidden h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-black/[0.09] bg-white px-4 text-xs font-semibold leading-none text-[#0183d0] transition hover:border-[#03a1fe]/50 hover:bg-[#edf7ff] sm:inline-flex"
      >
        View website <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
      </Link>
      <div className="grid h-10 w-10 place-items-center rounded-xl border border-black/[0.08] bg-[#f7f7f5] [&>div]:h-full [&>div]:w-full">
        <StyledThemeSwitch />
      </div>
      <ProfileMenu />
    </div>
  );
}

export default function Header() {
  const t = useTranslations();
  return (
    <header
      className={
        'sticky top-2 z-[990] mx-3 mt-2 flex min-h-[58px] items-center rounded-[18px] border border-black/[0.06] bg-white/95 px-4 py-2.5 backdrop-blur-xl dark:bg-gray-50/90 md:px-5'
      }
    >
      <div className="flex w-full max-w-2xl items-center">
        <HamburgerButton
          view={
            <MobileSidebar className="static h-full w-full xl:p-0 2xl:w-full [&>div]:xl:rounded-none" />
          }
        />
        <Link
          href={'/'}
          aria-label={t('commons.siteLogo') ?? 'Site Logo'}
          className="me-2 w-[145px] shrink-0 lg:me-5 xl:hidden"
        >
          <Image
            src="/shipsmart-landing/logo.svg"
            alt="ShipSmart Solutions"
            width={311}
            height={69}
            unoptimized
            className="h-auto w-full"
          />
        </Link>
      </div>
      <HeaderMenuRight />
    </header>
  );
}
