import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { Hero } from '../components/sections/Hero'

function setup() {
  render(
    <NextIntlClientProvider locale="fr" messages={fr}>
      <Hero />
    </NextIntlClientProvider>,
  )
}

describe('Hero', () => {
  it('renders the headline as three stacked lines', () => {
    setup()
    expect(screen.getByText(fr.hero.line1)).toBeInTheDocument()
    expect(screen.getByText(fr.hero.line2)).toBeInTheDocument()
    expect(screen.getByText(fr.hero.line3)).toBeInTheDocument()
  })

  it('renders a primary CTA linking to #contact and a secondary CTA linking to #schedule', () => {
    setup()
    const primary = screen.getByRole('link', { name: fr.hero.cta })
    const secondary = screen.getByRole('link', { name: fr.hero.scheduleCta })
    expect(primary).toHaveAttribute('href', '#contact')
    expect(secondary).toHaveAttribute('href', '#schedule')
  })

  it('renders the hero photo with its accessible alt text', () => {
    setup()
    expect(screen.getByAltText(fr.a11y.heroAlt)).toBeInTheDocument()
  })
})
