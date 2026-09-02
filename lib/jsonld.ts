import { schedule } from '@/content/schedule'
import { contact } from '@/content/contact'
import { pricing } from '@/content/pricing'
import type { Weekday } from '@/content/types'

const SITE = 'https://theredroosteracademy.com'

/**
 * Google shows this in the local-business panel. Derived from
 * content/pricing.ts rather than written out, so it cannot drift from the
 * rates the Pricing section renders.
 */
function priceRange(): string {
  const prices = pricing.flatMap((g) => g.cards.map((c) => c.price))
  return `${Math.min(...prices)} EUR-${Math.max(...prices)} EUR`
}

const DAY_NAMES: Record<Weekday, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  friday: 'Friday',
  sunday: 'Sunday',
}

export function buildLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    '@id': `${SITE}/#academy`,
    name: 'The Red Rooster Academy',
    url: SITE,
    priceRange: priceRange(),
    telephone: contact.phone,
    image: `${SITE}/images/hero.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address.street,
      addressLocality: contact.address.city,
      postalCode: contact.address.postalCode,
      addressCountry: contact.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: contact.geo.lat, longitude: contact.geo.lng },
    sameAs: [contact.facebook, contact.instagram],
    openingHoursSpecification: schedule.map((day) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: DAY_NAMES[day.day],
      opens: day.slots[0].start,
      closes: day.slots[day.slots.length - 1].end,
    })),
  }
}
