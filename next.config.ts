import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/**
 * Paths the old static site (GitHub Pages, until 2026-09-04) exposed and that
 * search engines or old social posts may still link to.
 */
const legacyRedirects = [
  { source: '/index.html', destination: '/', permanent: true },
  { source: '/images/technique.jpg', destination: '/images/og.jpg', permanent: true },
]

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

export default withNextIntl(nextConfig)
