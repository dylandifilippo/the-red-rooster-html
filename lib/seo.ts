import { routing } from '@/i18n/routing'

export const SITE_URL = 'https://theredroosteracademy.com'
export const SITE_NAME = 'The Red Rooster Academy'

/** Facebook wants a territory-qualified locale, not a bare language code. */
export const OG_LOCALES: Record<string, string> = {
  fr: 'fr_BE',
  nl: 'nl_BE',
  en: 'en_GB',
}

/**
 * The share card. Declaring the real pixel size matters as much as shipping
 * the file: without it a scraper has to download the image before it can lay
 * the card out, and some (WhatsApp in particular) give up first and show no
 * preview at all. `tests/metadata.test.ts` reads the JPEG header of the file
 * on disk and compares it to these numbers, so the declaration cannot drift
 * away from the asset.
 */
export const OG_IMAGE = { url: '/images/og.jpg', width: 1200, height: 630 } as const

/** Path for a locale, matching `localePrefix: 'as-needed'` in i18n/routing.ts. */
export function localePath(locale: string): string {
  return locale === routing.defaultLocale ? '/' : `/${locale}`
}
