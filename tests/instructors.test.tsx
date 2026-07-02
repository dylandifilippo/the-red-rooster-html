import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { Instructors } from '../components/sections/Instructors'

function setup() {
  render(
    <NextIntlClientProvider locale="fr" messages={fr}>
      <Instructors />
    </NextIntlClientProvider>,
  )
}

describe('Instructors', () => {
  it('renders the section heading', () => {
    setup()
    expect(screen.getByRole('heading', { level: 2, name: fr.team.heading })).toBeInTheDocument()
  })

  it('renders no section kicker (no "Nº" chapter number or section title label)', () => {
    setup()
    expect(screen.queryByText(/Nº/)).not.toBeInTheDocument()
    expect(screen.queryByText(fr.sections.instructors.title)).not.toBeInTheDocument()
  })

  it('renders all three team members with name and role', () => {
    setup()
    for (const id of ['pierre', 'sebastien', 'mike'] as const) {
      expect(screen.getByText(fr.team[id].name)).toBeInTheDocument()
      expect(screen.getByText(fr.team[id].role)).toBeInTheDocument()
    }
  })

  it('renders a portrait image with alt text for every member', () => {
    setup()
    for (const id of ['pierre', 'sebastien', 'mike'] as const) {
      expect(screen.getByAltText(fr.team[id].name)).toBeInTheDocument()
    }
    expect(screen.getAllByRole('img')).toHaveLength(3)
  })

  it('renders credential text for members that have creds', () => {
    setup()
    for (const cred of fr.team.pierre.creds) {
      expect(screen.getByText(cred)).toBeInTheDocument()
    }
  })

  it('never renders an em-dash anywhere in the section', () => {
    setup()
    const section = document.querySelector('#instructors') as HTMLElement
    expect(section).toBeTruthy()
    expect(section.textContent).not.toMatch(/[—–]/)
  })
})
