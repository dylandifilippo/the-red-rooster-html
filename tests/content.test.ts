import { describe, it, expect } from 'vitest'
import { programs } from '../content/programs'
import { team } from '../content/team'
import { schedule } from '../content/schedule'
import { pricing } from '../content/pricing'
import { faqIds } from '../content/faq'
import { contact } from '../content/contact'

const TIME = /^\d{2}:\d{2}$/

describe('content integrity', () => {
  it('has the four programs, no judo', () => {
    expect(programs.map((p) => p.id)).toEqual(['bjj-adults', 'bjj-kids', 'grappling', 'lutte'])
  })
  it('has the three instructors', () => {
    expect(team.map((m) => m.id)).toEqual(['pierre', 'sebastien', 'mike'])
  })
  it('schedule slots use HH:MM and known programs', () => {
    for (const day of schedule) {
      expect(day.slots.length).toBeGreaterThan(0)
      for (const slot of day.slots) {
        expect(slot.start).toMatch(TIME)
        expect(slot.end).toMatch(TIME)
        expect(slot.start < slot.end).toBe(true)
        expect(programs.map((p) => p.id)).toContain(slot.programId)
      }
    }
  })
  it('matches the current real timetable', () => {
    const monday = schedule.find((d) => d.day === 'monday')
    expect(monday?.slots).toEqual([
      { programId: 'bjj-kids', start: '18:30', end: '19:30' },
      { programId: 'bjj-adults', start: '19:30', end: '21:00' },
    ])
    expect(schedule.map((d) => d.day)).toEqual(['monday', 'tuesday', 'wednesday', 'friday'])
  })
  it('pricing matches current rates', () => {
    const adults = pricing.find((g) => g.id === 'adults')
    const kids = pricing.find((g) => g.id === 'kids')
    expect(adults?.cards.map((c) => c.price)).toEqual([7, 60, 80])
    expect(kids?.cards.map((c) => c.price)).toEqual([5, 40])
  })
  it('has 10 unique faq ids', () => {
    expect(faqIds).toHaveLength(10)
    expect(new Set(faqIds).size).toBe(10)
  })
  it('contact is consistent', () => {
    expect(contact.phone).toBe('+32478677355')
    expect(contact.whatsappUrl).toBe('https://wa.me/32478677355')
    expect(contact.address.postalCode).toBe('6240')
  })
  it('images referenced by content exist in public/', async () => {
    const { existsSync } = await import('node:fs')
    for (const p of [...programs.map((x) => x.image), ...team.map((x) => x.image)]) {
      expect(existsSync(`public${p}`), p).toBe(true)
    }
  })
})
