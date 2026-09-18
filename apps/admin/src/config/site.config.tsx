import { Metadata } from 'next';
import { LAYOUT_OPTIONS } from '@core/config/enums';
import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

enum MODE {
  DARK = 'dark',
  LIGHT = 'light',
}

export const siteConfig = {
  title: 'Admin Portal',
  description:
    'Freight logistics admin portal for managed transportation, carrier capacity, shipment visibility, and quote workflows.',
  logo: '',
  icon: '',
  mode: MODE.LIGHT,
  layout: LAYOUT_OPTIONS.HELIUM,
  // TODO: favicon
};

export const metaObject = (
  title?: string,
  openGraph?: OpenGraph,
  description: string = siteConfig.description
): Metadata => {
  return {
    title: title ?? siteConfig.title,
    description,
    openGraph: openGraph ?? {
      title: title ?? siteConfig.title,
      description,
      url: 'http://localhost:3000/',
      siteName: 'Admin Portal',
      locale: 'en_US',
      type: 'website',
    },
  };
};
