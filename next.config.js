/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'assets-cdn.trustwallet.com',
      },
      {
        protocol: 'https',
        hostname: 'beethoven-assets.s3.eu-central-1.amazonaws.com',
      },
    ],
  },
  pageExtensions: ['tsx', `${process.env.PROTOCOL}.tsx`],
}

module.exports = nextConfig
