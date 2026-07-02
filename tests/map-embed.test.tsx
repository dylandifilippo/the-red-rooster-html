import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { MapEmbed } from '../components/ui/MapEmbed'

describe('MapEmbed facade', () => {
  it('renders no iframe until activated', async () => {
    const { container } = render(
      <NextIntlClientProvider locale="fr" messages={fr}>
        <MapEmbed />
      </NextIntlClientProvider>,
    )
    expect(container.querySelector('iframe')).toBeNull()
    await userEvent.setup().click(screen.getByRole('button', { name: /Afficher la carte/ }))
    expect(container.querySelector('iframe')).toHaveAttribute('title', expect.stringContaining('Google Maps'))
  })
})
