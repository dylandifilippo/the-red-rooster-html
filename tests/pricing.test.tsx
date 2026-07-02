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

  it('renders every price from content/pricing.ts, none dropped', () => {
    const { container } = setup()
    const text = container.textContent ?? ''
    for (const group of pricing) {
      for (const card of group.cards) {
        expect(
          text.includes(`${card.price}${fr.pricing.currency}`),
          `expected ${group.id}.${card.id} (${card.price}) to render`,
        ).toBe(true)
      }
    }
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
