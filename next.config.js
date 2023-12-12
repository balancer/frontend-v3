const { withSentryConfig } = require("@sentry/nextjs")
const { sentryOptions, sentryWebpackPluginOptions } = require('./sentry.config')

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
        hostname: '**',
      },
    ],
  },
  pageExtensions: ['tsx', `${process.env.PROTOCOL}.tsx`],
}

module.exports = withSentryConfig(
  nextConfig,
  sentryWebpackPluginOptions,
  sentryOptions
);
