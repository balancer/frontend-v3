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
  pageExtensions: ['tsx', `${process.env.PROTOCOL}.tsx`],
}

module.exports = nextConfig
