import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { contact } from '../content/contact'
import { Footer } from '../components/ui/Footer'

function setup() {
  return render(
    <NextIntlClientProvider locale="fr" messages={fr}>
      <Footer />
    </NextIntlClientProvider>,
  )
}

describe('Footer', () => {
  it('keeps the social links', () => {
    setup()
    expect(screen.getByRole('link', { name: /Facebook/i })).toHaveAttribute('href', contact.facebook)
    expect(screen.getByRole('link', { name: /Instagram/i })).toHaveAttribute('href', contact.instagram)
  })

  it('renders the copyright with no em-dash or en-dash', () => {
    const { container } = setup()
    expect(container.textContent).not.toMatch(/[—–]/)
  })

  it('closes the dark band: bg-ink, hairline top border at 15% paper', () => {
    const { container } = setup()
    const footer = container.querySelector('footer')
    expect(footer?.className).toContain('bg-ink')
    expect(footer?.className).toContain('border-paper/15')
  })
})
