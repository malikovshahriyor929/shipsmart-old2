// apps/admin/src/app/api/auth/[...nextauth]/auth-options.ts
import axios from 'axios';
import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { env } from '@/env.mjs';
import { pagesOptions } from '@core/components/shared/api/auth/[...nextauth]/pages-options';
import { PLACEHOLDER_AVATAR } from '@core/config/constants';
import getRoleCode from '@core/utils/auth/get-role-code';

const RAW_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
const API_BASE_URL = RAW_API_BASE_URL ? `${RAW_API_BASE_URL}/en` : '';
const DEV_ADMIN_LOGIN = 'admin@shipsmart.test';
const DEV_ADMIN_USERNAME = 'admin';
const DEV_ADMIN_PASSWORD = 'admin123';
const DEV_ACCESS_TOKEN = 'dev-admin-access-token';
const DEV_REFRESH_TOKEN = 'dev-admin-refresh-token';
const isDevAuthEnabled = process.env.NODE_ENV !== 'production';

function computeAccessExpiry(exp: number | string | null | undefined) {
  const value = Number(exp);
  if (!Number.isFinite(value) || value <= 0) return Date.now();

  if (value > 1_000_000_000_000) return value;
  if (value > 1_000_000_000) return value * 1000;

  return Date.now() + value * 1000;
}

async function refreshAccessToken(token: any) {
  try {
    if (isDevAuthEnabled && token?.refreshToken === DEV_REFRESH_TOKEN) {
      return {
        ...token,
        accessToken: DEV_ACCESS_TOKEN,
        accessTokenExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
        refreshToken: DEV_REFRESH_TOKEN,
        error: undefined,
      };
    }

    if (!API_BASE_URL) throw new Error('Missing NEXT_PUBLIC_API_URL');
    if (!token?.refreshToken) throw new Error('Missing refreshToken');

    const res = await axios.post(
      `${API_BASE_URL}/v1/auth/refresh`,
      {
        refresh_token: token.refreshToken,
        token: process.env.NEXT_PUBLIC_SECRET_TOKEN,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        timeout: 10000,
        validateStatus: () => true,
      }
    );

    const data = res.status === 200 ? res.data?.data : null;

    if (!data?.access_token) {
      console.error('[admin][refresh] ❌ rejected:', res.status, res.data);
      throw new Error('No access_token returned');
    }

    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpiry: computeAccessExpiry(data.access_exp),
      refreshToken: data.refresh_token ?? token.refreshToken, // ROTATION ✅
      error: undefined,
    };
  } catch (err: any) {
    console.error('[admin][refresh] ❌ failed:', err?.response?.data || err);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}

export const authOptions: NextAuthOptions = {
  debug: false,
  pages: pagesOptions,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },

  callbacks: {
    async signIn({ user }) {
      const code = (user as any)?.roleCode ?? getRoleCode((user as any)?.role);
      if (code !== 2) return false; // AccessDenied
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          user,
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          accessTokenExpiry: (user as any).accessTokenExpiry,
          error: undefined,
        };
      }

      if (
        token.accessTokenExpiry &&
        Date.now() < (token.accessTokenExpiry as number) - 15_000
      ) {
        return token;
      }

      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (!session.user) session.user = {} as any;

      (session.user as any).id = String((token as any).user?.id ?? '');
      (session.user as any).role = (token as any).user?.role;
      (session.user as any).roleCode = (token as any).user?.roleCode;
      (session.user as any).avatar = (token as any).user?.avatar;

      (session.user as any).accessToken = token.accessToken as
        | string
        | undefined;
      (session.user as any).refreshToken = token.refreshToken as
        | string
        | undefined;
      (session.user as any).accessTokenExpiry = token.accessTokenExpiry as
        | number
        | undefined;

      if ((token as any).error) (session as any).error = (token as any).error;
      return session;
    },

    async redirect({ url, baseUrl }) {
      const base =
        typeof baseUrl === 'string'
          ? baseUrl
          : process.env.NEXTAUTH_URL || 'http://localhost:3000';
      if (typeof url === 'string' && url.startsWith('/')) return base + url;
      try {
        const u = new URL(String(url));
        const b = new URL(String(base));
        if (u.origin === b.origin) return u.toString();
      } catch {}
      return base;
    },
  },

  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        login: { label: 'Login', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) return null;

        if (isDevAuthEnabled) {
          const login = credentials.login.trim().toLowerCase();
          const isStaticAdmin =
            (login === DEV_ADMIN_LOGIN || login === DEV_ADMIN_USERNAME) &&
            credentials.password === DEV_ADMIN_PASSWORD;

          if (!isStaticAdmin) return null;

          return {
            id: 'dev-admin',
            email: DEV_ADMIN_LOGIN,
            name: 'Admin',
            avatar: PLACEHOLDER_AVATAR,
            role: { id: 2, text: 'admin' },
            roleCode: 2,
            accessToken: DEV_ACCESS_TOKEN,
            refreshToken: DEV_REFRESH_TOKEN,
            accessTokenExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
          } as any;
        }

        if (!API_BASE_URL) return null;

        const res = await axios.post(
          `${API_BASE_URL}/v1/auth/login`,
          {
            login: credentials.login,
            password: credentials.password,
            token: process.env.NEXT_PUBLIC_SECRET_TOKEN,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
            timeout: 10000,
            validateStatus: () => true,
          }
        );

        if (
          res.status !== 200 ||
          !res.data?.success ||
          !res.data?.data?.access_token ||
          !res.data?.data?.user
        ) {
          console.error('[admin][authorize] rejected:', res.status, res.data);
          return null;
        }

        const d = res.data.data;
        const roleCode = getRoleCode(d.user?.role);

        return {
          id: String(d.user.id),
          email: d.user.email,
          name: `${d.user.first_name ?? ''} ${d.user.last_name ?? ''}`.trim(),
          avatar: d.user.avatar ?? PLACEHOLDER_AVATAR,
          role: d.user.role,
          roleCode,
          accessToken: d.access_token,
          refreshToken: d.refresh_token,
          accessTokenExpiry: computeAccessExpiry(d.access_exp),
        } as any;
      },
    }),

    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID || '',
      clientSecret: env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
};
