const description =
  'Plan, manage, and track shipments across road, ocean, and air with ShipSmart’s connected logistics platform.';

type ShipSmartJsonLdProps = {
  locale: string;
};

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(
    /\/$/,
    ''
  );
}

export function ShipSmartJsonLd({ locale }: ShipSmartJsonLdProps) {
  const baseUrl = getBaseUrl();
  const pageUrl = `${baseUrl}/${locale}`;
  const organizationId = `${baseUrl}/#organization`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: 'ShipSmart',
        url: baseUrl,
        description,
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        name: 'ShipSmart',
        url: baseUrl,
        description,
        inLanguage: locale,
        publisher: {
          '@id': organizationId,
        },
      },
      {
        '@type': 'Service',
        '@id': `${pageUrl}#logistics-service`,
        name: 'Global Shipping and Logistics',
        serviceType: 'Freight transportation and logistics management',
        url: pageUrl,
        description,
        areaServed: 'Worldwide',
        provider: {
          '@id': organizationId,
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'ShipSmart logistics services',
          itemListElement: [
            'Road freight',
            'Ocean freight',
            'Air freight',
            'Warehousing and fulfillment',
            'Real-time shipment tracking',
          ].map((name) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name,
            },
          })),
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
      }}
    />
  );
}
