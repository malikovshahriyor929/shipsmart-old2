import './src/env.mjs';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */

const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        pathname: '/redqteam.com/isomorphic-furyroad/public/**',
      },
      {
        protocol: 'https',
        hostname: 'isomorphic-furyroad.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '172.24.24.249',
      },
      {
        protocol: 'https',
        hostname: '172.24.25.174',
      },
      {
        protocol: 'https',
        hostname: 'api.milliydastur.uz',
      },
    ],
  },
  reactStrictMode: true,
  transpilePackages: ['@shipsmart/core'],
};

export default withNextIntl(nextConfig);
