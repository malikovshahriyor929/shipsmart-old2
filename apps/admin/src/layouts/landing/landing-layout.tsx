'use client';

import type { ReactNode, RefObject } from 'react';
import cn from '@core/utils/class-names';
import { LandingFooter } from './landing-footer';
import { LandingHeader } from './landing-header';

type LandingLayoutProps = {
  children: ReactNode;
  className?: string;
  mainClassName?: string;
  rootRef?: RefObject<HTMLDivElement | null>;
};

export default function LandingLayout({
  children,
  className,
  mainClassName,
  rootRef,
}: LandingLayoutProps) {
  return (
    <div
      ref={rootRef}
      id="top"
      className={cn(
        'ss-original-landing min-h-screen overflow-x-hidden bg-[#fefefe] text-[#111214] selection:bg-[#4ba6f8] selection:text-white',
        className
      )}
      style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
    >
      <LandingHeader />
      <main className={mainClassName}>{children}</main>
      <LandingFooter />
    </div>
  );
}
