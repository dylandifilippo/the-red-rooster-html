import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { Programs } from '../components/sections/Programs'

function setup() {
  render(
    <NextIntlClientProvider locale="fr" messages={fr}>
      <Programs />
    </NextIntlClientProvider>,
  )
}

describe('Programs', () => {
  it('renders the section heading', () => {
    setup()
    expect(screen.getByRole('heading', { level: 2, name: fr.programs.heading })).toBeInTheDocument()
  })

  it('renders no section kicker (no "Nº" chapter number or section title label)', () => {
    setup()
    expect(screen.queryByText(/Nº/)).not.toBeInTheDocument()
    expect(screen.queryByText(fr.sections.programs.title)).not.toBeInTheDocument()
  })

  it('renders all four programs with their title and description', () => {
    setup()
    for (const id of ['bjj-adults', 'bjj-kids', 'grappling', 'lutte'] as const) {
      expect(screen.getByText(fr.programs[id].title)).toBeInTheDocument()
      expect(screen.getByText(fr.programs[id].description)).toBeInTheDocument()
    }
  })

  it('renders images for the three photo programs only, none for lutte', () => {
    setup()
    expect(screen.getByAltText(fr.programs['bjj-adults'].title)).toBeInTheDocument()
    expect(screen.getByAltText(fr.programs['bjj-kids'].title)).toBeInTheDocument()
    expect(screen.getByAltText(fr.programs['grappling'].title)).toBeInTheDocument()
    expect(screen.queryByAltText(fr.programs['lutte'].title)).not.toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(3)
  })
})
