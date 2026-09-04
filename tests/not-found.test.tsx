import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import nl from '../messages/nl.json'
import NotFound from '../app/[locale]/not-found'

function setup(locale: 'fr' | 'nl', messages: typeof fr) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <NotFound />
    </NextIntlClientProvider>,
  )
}

describe('NotFound', () => {
  it('names the error and links back to the French home page', () => {
    setup('fr', fr)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(fr.notFound.title)
    expect(screen.getByRole('link', { name: fr.notFound.back })).toHaveAttribute('href', '/')
  })
  it('links back to the localized home page for other locales', () => {
    setup('nl', nl)
    expect(screen.getByRole('link', { name: nl.notFound.back })).toHaveAttribute('href', '/nl')
  })
})
