import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { pricing } from '../content/pricing'
import { Pricing } from '../components/sections/Pricing'

function setup() {
  return render(
    <NextIntlClientProvider locale="fr" messages={fr}>
      <Pricing />
    </NextIntlClientProvider>,
  )
}

describe('Pricing section', () => {
  it('renders the heading, no kicker', () => {
    setup()
    expect(screen.getByRole('heading', { level: 2, name: fr.pricing.heading })).toBeInTheDocument()
    expect(screen.queryByText(/Nº/)).not.toBeInTheDocument()
  })

  it('gives every price in content/pricing.ts its own tile, in content order', () => {
    // Asserting per tile rather than over the whole section: two groups can
    // quote the same amount (adults' 10-class card and lutte's month are both
    // 60), so a substring search over the rendered text would still pass with
    // one of them missing.
    const { container } = setup()
    const grid = container.querySelector('#pricing .grid')
    const cards = pricing.flatMap((g) => g.cards.map((c) => ({ group: g, card: c })))
    const tiles = Array.from(grid?.children ?? [])
    expect(tiles).toHaveLength(cards.length + 1) // + the free-trial tile

    cards.forEach(({ group, card }, i) => {
      const tile = tiles[i + 1].textContent ?? ''
      const where = `${group.id}.${card.id}`
      expect(tile, where).toContain(`${card.price}${fr.pricing.currency}`)
      expect(tile, where).toContain(fr.pricing[group.id].title)
    })
  })

  it('sets no price or label in type smaller than the tile label size', () => {
    const { container } = setup()
    const section = container.querySelector('#pricing')
    // Walk every element instead of using an attribute selector: jsdom's
    // parser silently matches nothing for [class*="text-["], which made an
    // earlier version of this test pass against 14px type.
    const small = Array.from(section?.querySelectorAll('*') ?? []).filter((el) => {
      const px = /text-\[(\d+)px\]/.exec(String(el.className))
      return px !== null && Number(px[1]) < 16
    })
    expect(small.map((el) => el.textContent)).toEqual([])
  })

  it('renders the free trial tile from messages', () => {
    setup()
    expect(screen.getByText(fr.pricing.trial.value)).toBeInTheDocument()
    expect(screen.getByText(fr.pricing.trial.label)).toBeInTheDocument()
  })

  it('opens the dark band: bg-ink text-paper, top border only', () => {
    const { container } = setup()
    const section = container.querySelector('#pricing')
    expect(section?.className).toContain('bg-ink')
    expect(section?.className).toContain('text-paper')
    expect(section?.className).toContain('border-t-2')
  })

  it('has zero em-dashes in rendered output', () => {
    const { container } = setup()
    expect(container.textContent).not.toMatch(/[—–]/)
  })
})
