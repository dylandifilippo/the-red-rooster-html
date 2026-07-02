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
    const [firstMatch] = screen.getAllByText(fr.marquee.words[0])
    const wrapper = firstMatch.closest('[aria-hidden]')
    expect(wrapper).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders each technique word four times (2 halves x 2 reps, duplicated track for the loop)', () => {
    render(
      <NextIntlClientProvider locale="fr" messages={fr}>
        <Marquee />
      </NextIntlClientProvider>,
    )
    const words = fr.marquee.words
    let total = 0
    for (const word of words) {
      const matches = screen.getAllByText(word)
      expect(matches).toHaveLength(4)
      total += matches.length
    }
    expect(words).toHaveLength(8)
    expect(total).toBe(32)
  })
})
