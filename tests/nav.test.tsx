import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { Nav } from '../components/ui/Nav'

function setup() {
  render(
    <NextIntlClientProvider locale="fr" messages={fr}>
      <Nav />
    </NextIntlClientProvider>,
  )
}

describe('Nav', () => {
  it('renders the brand as a text wordmark, not an image', () => {
    setup()
    expect(screen.getByText('THE RED ROOSTER ACADEMY')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders the trial CTA using the nav cta message', () => {
    setup()
    expect(screen.getAllByText(fr.nav.cta).length).toBeGreaterThan(0)
  })

  it('toggles the mobile panel and locks body scroll while open', async () => {
    setup()
    const user = userEvent.setup()
    const toggle = screen.getByRole('button', { name: fr.a11y.openMenu })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(document.body.style.overflow).toBe('hidden')
    await user.click(screen.getByRole('button', { name: fr.a11y.closeMenu }))
    expect(document.body.style.overflow).not.toBe('hidden')
  })
})
