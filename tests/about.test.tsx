import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { About } from '../components/sections/About'

function setup() {
  render(
    <NextIntlClientProvider locale="fr" messages={fr}>
      <About />
    </NextIntlClientProvider>,
  )
}

describe('About', () => {
  it('renders the lead paragraph, body copy, and founder name/role', () => {
    setup()
    expect(screen.getByText(fr.about.lead)).toBeInTheDocument()
    expect(screen.getByText(fr.about.body)).toBeInTheDocument()
    expect(screen.getByText(fr.about.signatureName)).toBeInTheDocument()
    expect(screen.getByText(fr.about.signatureRole)).toBeInTheDocument()
  })

  it('renders no section kicker (no "Nº" chapter number or section title label)', () => {
    setup()
    expect(screen.queryByText(/Nº/)).not.toBeInTheDocument()
    expect(screen.queryByText("L'Académie")).not.toBeInTheDocument()
  })
})
