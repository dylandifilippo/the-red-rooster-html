import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { Marquee } from '../components/ui/Marquee'

describe('Marquee', () => {
  it('is hidden from assistive tech', () => {
    render(
      <NextIntlClientProvider locale="fr" messages={fr}>
        <Marquee />
      </NextIntlClientProvider>,
    )
    const [firstMatch] = screen.getAllByText(fr.programs['bjj-adults'].title)
    const wrapper = firstMatch.closest('[aria-hidden]')
    expect(wrapper).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders each discipline name six times (2 halves x 3 reps, duplicated track for the loop)', () => {
    render(
      <NextIntlClientProvider locale="fr" messages={fr}>
        <Marquee />
      </NextIntlClientProvider>,
    )
    const names = [
      fr.programs['bjj-adults'].title,
      fr.programs['bjj-kids'].title,
      fr.programs['grappling'].title,
      fr.programs['lutte'].title,
    ]
    let total = 0
    for (const name of names) {
      const matches = screen.getAllByText(name)
      expect(matches).toHaveLength(6)
      total += matches.length
    }
    expect(total).toBe(24)
  })
})
