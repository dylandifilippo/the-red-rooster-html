import { describe, it, expect } from 'vitest'
import { readFileSync, statSync } from 'node:fs'
import { routing } from '../i18n/routing'
import { OG_IMAGE, OG_LOCALES, localePath } from '../lib/seo'
import fr from '../messages/fr.json'
import nl from '../messages/nl.json'
import en from '../messages/en.json'

/**
 * Width and height straight out of the JPEG frame header. Reading the file is
 * the whole point of the test below: the numbers in lib/seo.ts are what
 * scrapers trust, and nothing else would notice if the asset were replaced by
 * one of a different size.
 */
function jpegSize(buf: Buffer): { width: number; height: number } {
  let i = 2 // skip the SOI marker
  while (i < buf.length - 8) {
    if (buf[i] !== 0xff) {
      i++
      continue
    }
    const marker = buf[i + 1]
    const isFrameHeader =
      marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)
    if (isFrameHeader) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) }
    i += 2 + buf.readUInt16BE(i + 2)
  }
  throw new Error('no JPEG frame header found')
}

describe('social and canonical metadata', () => {
  it('ships an og image matching the size it declares', () => {
    const file = `public${OG_IMAGE.url}`
    expect(jpegSize(readFileSync(file))).toEqual({
      width: OG_IMAGE.width,
      height: OG_IMAGE.height,
    })
  })

  it('keeps the og image small enough to be scraped', () => {
    // Scrapers fetch this before rendering a card and some give up on a slow
    // download, so the file stays well under the 1 MB the hero photo weighs.
    expect(statSync(`public${OG_IMAGE.url}`).size).toBeLessThan(300 * 1024)
  })

  it('declares a 1.91:1 card, the ratio Facebook and X lay out', () => {
    expect(OG_IMAGE.width / OG_IMAGE.height).toBeCloseTo(1.91, 1)
  })

  it('has a territory-qualified og locale for every routed locale', () => {
    for (const locale of routing.locales) {
      expect(OG_LOCALES[locale], locale).toMatch(/^[a-z]{2}_[A-Z]{2}$/)
    }
    expect(Object.keys(OG_LOCALES).sort()).toEqual([...routing.locales].sort())
  })

  it('maps the default locale to / and the others to a prefix', () => {
    expect(localePath('fr')).toBe('/')
    expect(localePath('nl')).toBe('/nl')
    expect(localePath('en')).toBe('/en')
  })

  it('has share-card alt text in every catalog', () => {
    for (const [locale, catalog] of [
      ['fr', fr],
      ['nl', nl],
      ['en', en],
    ] as const) {
      expect(catalog.meta.ogAlt.length, locale).toBeGreaterThan(10)
    }
  })
})
