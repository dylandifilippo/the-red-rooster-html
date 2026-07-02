import { describe, it, expect } from 'vitest'
import fr from '../messages/fr.json'
import { faqIds } from '../content/faq'
import { programs } from '../content/programs'
import { team } from '../content/team'

describe('fr catalog covers content ids', () => {
  it('has question+answer for every faq id', () => {
    for (const id of faqIds) {
      const item = (fr.faq.items as Record<string, { question: string; answer: string }>)[id]
      expect(item?.question, id).toBeTruthy()
      expect(item?.answer, id).toBeTruthy()
    }
  })
  it('has title+description for every program', () => {
    for (const p of programs) {
      const item = (fr.programs as Record<string, { title: string; description: string }>)[p.id]
      expect(item?.title, p.id).toBeTruthy()
      expect(item?.description, p.id).toBeTruthy()
    }
  })
  it('has name+role for every instructor', () => {
    for (const m of team) {
      const item = (fr.team as Record<string, { name: string; role: string }>)[m.id]
      expect(item?.name, m.id).toBeTruthy()
      expect(item?.role, m.id).toBeTruthy()
    }
  })
  it('mentions no judo anywhere', () => {
    expect(JSON.stringify(fr).toLowerCase()).not.toContain('judo')
  })
})
