import { describe, it, expect } from 'vitest'
import fr from '../messages/fr.json'
import nl from '../messages/nl.json'
import en from '../messages/en.json'

function flatKeys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v !== null && typeof v === 'object' && !Array.isArray(v)
      ? flatKeys(v, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  )
}

describe('message catalogs', () => {
  it('nl has exactly the fr keys', () => {
    expect(flatKeys(nl).sort()).toEqual(flatKeys(fr).sort())
  })
  it('en has exactly the fr keys', () => {
    expect(flatKeys(en).sort()).toEqual(flatKeys(fr).sort())
  })
  it('no empty values in any catalog', () => {
    for (const cat of [fr, nl, en]) {
      for (const key of flatKeys(cat)) {
        const val = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], cat)
        expect(val, key).not.toBe('')
      }
    }
  })
})
