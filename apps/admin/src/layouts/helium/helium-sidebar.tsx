'use client';

import { siteConfig } from '@/config/site.config';
import cn from '@core/utils/class-names';
import { Link } from '@core/i18n/routing';
import { HeliumSidebarMenu } from './helium-sidebar-menu';
import { useTranslations } from 'next-intl';
import { PiPackageBold, PiSquaresFourBold } from 'react-icons/pi';

export default function HeliumSidebar({ className }: { className?: string }) {
  const t = useTranslations();
  return (
    <aside
      className={cn(
        'fixed inset-y-0 start-0 z-50 w-[252px] p-2.5 dark:bg-gray-100/50 2xl:w-[264px]',
        className
      )}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#07182f] px-2.5 py-3 shadow-[0_18px_45px_rgba(7,24,47,0.12)] dark:border-gray-200 dark:bg-gray-100">
        <div className="shrink-0 border-b border-white/10 px-2.5 pb-4 pt-1 dark:border-gray-200">
          <div className="flex items-center">
            <Link
              href={'/dashboard'}
              aria-label={t('commons.siteLogo') ?? siteConfig.title}
              className="group flex min-w-0 items-center gap-3 text-white dark:text-gray-900"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#07182f] transition-transform duration-200 group-hover:scale-[1.03] dark:bg-[#07182f] dark:text-white">
                <PiSquaresFourBold className="h-5 w-5" />
              </span>
              <span className="whitespace-nowrap text-[15px] font-semibold tracking-[-0.02em]">
                Admin Portal
              </span>
            </Link>
          </div>
        </div>

        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto scroll-smooth pt-4">
          <HeliumSidebarMenu />
        </div>

        <div className="mx-2 mt-auto flex shrink-0 items-center gap-3 border-t border-white/10 px-1 pb-1 pt-4 text-white">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-[#03a1fe]/35 bg-[#03a1fe]/10 text-[#03a1fe]">
            <PiPackageBold className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] font-bold tracking-[0.2em]">
              SHIPSMART
            </span>
            <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.22em] text-[#03a1fe]">
              Operations
            </span>
          </span>
        </div>
      </div>
    </aside>
  );
}
