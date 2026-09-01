import { describe, it, expect } from 'vitest'
import { buildLocalBusinessJsonLd } from '../lib/jsonld'

describe('LocalBusiness JSON-LD', () => {
  const ld = buildLocalBusinessJsonLd() as Record<string, unknown>
  it('is a SportsActivityLocation with correct identity', () => {
    expect(ld['@type']).toBe('SportsActivityLocation')
    expect(ld.name).toBe('The Red Rooster Academy')
    expect(ld.telephone).toBe('+32478677355')
  })
  it('derives opening hours from the schedule data', () => {
    const hours = ld.openingHoursSpecification as Array<Record<string, unknown>>
    expect(hours).toHaveLength(5)
    expect(hours[0]).toMatchObject({ dayOfWeek: 'Monday', opens: '18:30', closes: '21:00' })
    expect(hours[4]).toMatchObject({ dayOfWeek: 'Sunday', opens: '16:00', closes: '17:00' })
    expect(hours.map((h) => h.dayOfWeek)).not.toContain('Thursday')
  })
})
