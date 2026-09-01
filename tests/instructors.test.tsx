import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { Instructors } from '../components/sections/Instructors'

function setup() {
  return render(
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
    expect(screen.queryByText('Les Instructeurs')).not.toBeInTheDocument()
  })

  it('renders all four team members with name and role', () => {
    // Scoped per card rather than a global getByText: two instructors can
    // share a role wording (Sebastien and Mike are both "Instructeur ceinture
    // noire"), and a global query throws on multiple matches.
    const { container } = setup()
    const cards = Array.from(container.querySelectorAll('figure'))
    const ids = ['pierre', 'sebastien', 'mike', 'hugues'] as const
    expect(cards).toHaveLength(ids.length)
    ids.forEach((id, i) => {
      expect(cards[i].textContent, id).toContain(fr.team[id].name)
      expect(cards[i].textContent, id).toContain(fr.team[id].role)
    })
  })

  it('renders a portrait image with alt text for every member', () => {
    setup()
    for (const id of ['pierre', 'sebastien', 'mike', 'hugues'] as const) {
      expect(screen.getByAltText(fr.team[id].name)).toBeInTheDocument()
    }
    expect(screen.getAllByRole('img')).toHaveLength(4)
  })

  it('keeps full 3:4 portraits with top anchoring (belts stay visible)', () => {
    setup()
    for (const img of screen.getAllByRole('img')) {
      expect(img.className).toContain('aspect-[3/4]')
      expect(img.className).toContain('object-cover')
      expect(img.className).toContain('object-top')
    }
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
