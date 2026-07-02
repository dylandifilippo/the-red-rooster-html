import { describe, it, expect } from 'vitest'
import fr from '../messages/fr.json'
import nl from '../messages/nl.json'
import en from '../messages/en.json'

const DASH_RE = /[—–]/

function collectStrings(value: unknown, path: string, out: Array<[string, string]>): void {
  if (typeof value === 'string') {
    if (DASH_RE.test(value)) out.push([path, value])
    return
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => collectStrings(v, `${path}[${i}]`, out))
    return
  }
  if (value !== null && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      collectStrings(v, path ? `${path}.${k}` : k, out)
    }
  }
}

describe('message catalogs contain no em-dash or en-dash', () => {
  it.each([
    ['fr', fr],
    ['nl', nl],
    ['en', en],
  ])('%s.json has no — or – in any string value', (locale, catalog) => {
    const hits: Array<[string, string]> = []
    collectStrings(catalog, '', hits)
    expect(hits, `${locale}.json contains banned dash characters: ${JSON.stringify(hits)}`).toEqual([])
  })
})
