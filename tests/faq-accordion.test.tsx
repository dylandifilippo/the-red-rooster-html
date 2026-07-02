import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { Faq } from '../components/sections/Faq'

function setup() {
  render(
    <NextIntlClientProvider locale="fr" messages={fr}>
      <Faq />
    </NextIntlClientProvider>,
  )
}

describe('FAQ accordion', () => {
  it('renders 10 collapsed questions as buttons', () => {
    setup()
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(10)
    for (const b of buttons) expect(b).toHaveAttribute('aria-expanded', 'false')
  })
  it('expands on click and collapses the previous one', async () => {
    setup()
    const user = userEvent.setup()
    const [first, second] = screen.getAllByRole('button')
    await user.click(first)
    expect(first).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/excellent moyen de se mettre en forme/)).toBeVisible()
    await user.click(second)
    expect(first).toHaveAttribute('aria-expanded', 'false')
    expect(second).toHaveAttribute('aria-expanded', 'true')
  })
})
