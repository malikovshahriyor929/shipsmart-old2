'use client';

import HeliumLayout from '@/layouts/helium/helium-layout';

type LayoutProps = {
  children: React.ReactNode;
};

export default function DefaultLayout({ children }: LayoutProps) {
  return <HeliumLayout>{children}</HeliumLayout>;
}
