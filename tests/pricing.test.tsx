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
    // trial tile, then one tile per card, then any aria-hidden row pads.
    const real = tiles.filter((el) => !el.hasAttribute('aria-hidden'))
    expect(real).toHaveLength(cards.length + 1)

    cards.forEach(({ group, card }, i) => {
      const tile = real[i + 1].textContent ?? ''
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

  it('leaves no hole in the tile grid at 4 or 2 columns', () => {
    // An empty cell would show the container background (the rule colour) as
    // a grey block, so the component pads the last row. Guards future edits
    // to content/pricing.ts, which change the tile count.
    const { container } = setup()
    const cells = container.querySelector('#pricing .grid')?.children.length ?? 0
    expect(cells % 4, `${cells} cells do not fill 4 columns`).toBe(0)
    expect(cells % 2, `${cells} cells do not fill 2 columns`).toBe(0)
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
