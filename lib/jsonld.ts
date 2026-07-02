import { schedule } from '@/content/schedule'
import { contact } from '@/content/contact'
import type { Weekday } from '@/content/types'

const DAY_NAMES: Record<Weekday, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  friday: 'Friday',
}

export function buildLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: 'The Red Rooster Academy',
    url: 'https://theredroosteracademy.com',
    telephone: contact.phone,
    image: 'https://theredroosteracademy.com/images/hero.jpg',
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
