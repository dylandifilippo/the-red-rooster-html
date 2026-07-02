import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher'

function renderAt(locale: string) {
  render(
    <NextIntlClientProvider locale={locale} messages={fr}>
      <LanguageSwitcher />
    </NextIntlClientProvider>,
  )
}

describe('LanguageSwitcher', () => {
  it('renders the three locales with correct hrefs', () => {
    renderAt('fr')
    expect(screen.getByRole('link', { name: 'FR' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'NL' })).toHaveAttribute('href', '/nl')
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('href', '/en')
  })
  it('marks the active locale', () => {
    renderAt('fr')
    expect(screen.getByRole('link', { name: 'FR' })).toHaveAttribute('aria-current', 'true')
  })
  it('styles the active locale with ink text and an accent underline', () => {
    renderAt('fr')
    const active = screen.getByRole('link', { name: 'FR' })
    expect(active.className).toContain('text-ink')
    expect(active.className).toContain('border-b-2')
    expect(active.className).toContain('border-accent')
  })
  it('styles inactive locales with soft ink text', () => {
    renderAt('fr')
    const inactive = screen.getByRole('link', { name: 'NL' })
    expect(inactive.className).toContain('text-ink-soft')
  })
})
