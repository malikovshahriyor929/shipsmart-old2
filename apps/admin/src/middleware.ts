import { NextRequest } from 'next/server';
import withAuth from 'next-auth/middleware';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@core/i18n/routing';
import { pagesOptions } from '@core/components/shared/api/auth/[...nextauth]/pages-options';

// List of public pages (no auth required)
const publicPages = [
  '/',
  '/auth/sign-in',
  '/auth/otp',
  '/auth/forgot-password',
  '/auth/request-reset-password',
];

const landingPrefixes = [
  'track-shipment',
  'client-portal',
  'solutions',
  'shippers',
  'carriers',
  'services',
  'industries',
  'technology',
  'company',
  'resources',
  'contact',
  'get-quote',
];

// Create the Next-Intl middleware for handling i18n routing
const intlMiddleware = createMiddleware({
  ...routing,
});

// Auth middleware wraps intlMiddleware so that i18n works for both authed and public pages
const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token !== null,
    },
    pages: {
      ...pagesOptions,
      signIn: '/auth/sign-in',
      error: '/auth/sign-in',
    },
  }
);

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join('|')}))?(${publicPages
      .flatMap((p) => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  );
  const landingPathnameRegex = RegExp(
    `^(/(${routing.locales.join('|')}))?/(${landingPrefixes.join('|')})(/.*)?/?$`,
    'i'
  );
  const isPublicPage =
    publicPathnameRegex.test(req.nextUrl.pathname) ||
    landingPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return (authMiddleware as any)(req);
  }
}

export const config = {
  matcher: [
    '/((?!api|_next|.*\\..*).*)',
  ],
};
