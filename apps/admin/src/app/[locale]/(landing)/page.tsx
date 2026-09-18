import type { Metadata } from 'next';
import { ShipSmartHomePage } from './ship-smart-home';
import { ShipSmartJsonLd } from './ship-smart-json-ld';

const title = 'ShipSmart — Smarter Global Shipping and Logistics';
const description =
  'Plan, manage, and track shipments across road, ocean, and air with ShipSmart’s connected logistics platform.';

const localeMetadata = {
  en: { openGraphLocale: 'en_US' },
  uz: { openGraphLocale: 'uz_UZ' },
  ru: { openGraphLocale: 'ru_RU' },
} as const;

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const canonicalPath = `/${locale}`;
  const openGraphLocale =
    localeMetadata[locale as keyof typeof localeMetadata]?.openGraphLocale ??
    localeMetadata.en.openGraphLocale;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        'en-US': '/en',
        'uz-UZ': '/uz',
        'ru-RU': '/ru',
        'x-default': '/en',
      },
    },
    openGraph: {
      type: 'website',
      url: canonicalPath,
      siteName: 'ShipSmart',
      locale: openGraphLocale,
      title,
      description,
      images: [
        {
          url: '/images/shipsmart-hero.png',
          width: 1672,
          height: 941,
          alt: 'ShipSmart global shipping and logistics platform',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/shipsmart-hero.png'],
    },
  };
}

export default async function Page({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <>
      <ShipSmartJsonLd locale={locale} />
      <ShipSmartHomePage />
    </>
  );
}
