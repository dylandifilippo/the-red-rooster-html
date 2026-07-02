import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { contact } from '../content/contact'
import { Contact } from '../components/sections/Contact'

function setup() {
  return render(
    <NextIntlClientProvider locale="fr" messages={fr}>
      <Contact />
    </NextIntlClientProvider>,
  )
}

describe('Contact section', () => {
  it('renders the heading, no kicker', () => {
    setup()
    expect(screen.getByRole('heading', { level: 2, name: fr.contact.heading })).toBeInTheDocument()
    expect(screen.queryByText(/Nº/)).not.toBeInTheDocument()
  })

  it('phone is a tap-to-call hero element', () => {
    setup()
    const link = screen.getByRole('link', { name: contact.phoneDisplay })
    expect(link).toHaveAttribute('href', `tel:${contact.phone}`)
  })

  it('keeps the exact WhatsApp deep link', () => {
    setup()
    const link = screen.getByRole('link', { name: new RegExp(fr.contact.whatsapp) })
    expect(link).toHaveAttribute('href', contact.whatsappUrl)
  })

  it('renders the address', () => {
    setup()
    expect(screen.getByText(contact.address.street)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(contact.address.city))).toBeInTheDocument()
  })

  it('continues the dark band with no top border and no visible seam', () => {
    const { container } = setup()
    const section = container.querySelector('#contact')
    expect(section?.className).toContain('bg-ink')
    expect(section?.className).not.toMatch(/border-t/)
  })
})
