import { Toaster } from 'react-hot-toast';
import AuthProvider from '@core/components/shared/api/auth/[...nextauth]/auth-provider';
import GlobalDrawer from '@core/components/shared/drawer-views/container';
import GlobalModal from '@core/components/shared/modal-views/container';
import { JotaiProvider, ThemeProvider } from '@/app/shared/theme-provider';
import { siteConfig } from '@/config/site.config';
import {
  inter,
  lexendDeca,
  montserrat,
} from '@core/components/shared/fonts';
import cn from '@core/utils/class-names';
import NextProgress from '@core/components/next-progress';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import I18nextBridge from './i18next-bridge';

import './react-big-calendar.css';
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <div
      dir="ltr"
      className={cn(
        inter.variable,
        lexendDeca.variable,
        montserrat.variable,
        'font-inter'
      )}
    >
      <AuthProvider session={null}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <I18nextBridge locale={locale} messages={messages}>
            <ThemeProvider>
              <NextProgress />
              <JotaiProvider>
                {children}
                <Toaster containerClassName="z-[999]" />
                <GlobalDrawer />
                <GlobalModal />
              </JotaiProvider>
            </ThemeProvider>
          </I18nextBridge>
        </NextIntlClientProvider>
      </AuthProvider>
    </div>
  );
}
