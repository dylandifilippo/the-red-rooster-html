import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { Gallery } from '../components/sections/Gallery'
import { gallery } from '../content/gallery'

function setup() {
  render(
    <NextIntlClientProvider locale="fr" messages={fr}>
      <Gallery />
    </NextIntlClientProvider>,
  )
}

describe('Gallery', () => {
  it('renders the section with id="gallery"', () => {
    setup()
    expect(document.querySelector('#gallery')).toBeInTheDocument()
  })

  it('renders the section heading', () => {
    setup()
    expect(screen.getByRole('heading', { level: 2, name: fr.gallery.heading })).toBeInTheDocument()
  })

  it('renders no section kicker (no "Nº" chapter number)', () => {
    setup()
    expect(screen.queryByText(/Nº/)).not.toBeInTheDocument()
  })

  it('renders exactly 6 images, each with the matching fr alt text', () => {
    setup()
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(6)
    fr.gallery.alts.forEach((alt) => {
      expect(screen.getByAltText(alt)).toBeInTheDocument()
    })
  })

  it('applies col-span-2 to both-breakpoint span-2 cells and lg:col-span-2 to the lg-only cell', () => {
    setup()
    const images = screen.getAllByRole('img')
    gallery.forEach((photo, i) => {
      const cell = images[i].closest('div')
      expect(cell, photo.src).toBeTruthy()
      if (photo.span === 2) {
        expect(cell?.className).toContain('col-span-2')
        expect(cell?.className).not.toContain('lg:col-span-2')
      } else if (photo.span === 'lg-2') {
        expect(cell?.className).toContain('lg:col-span-2')
        expect(cell?.className).not.toContain(' col-span-2')
      } else {
        expect(cell?.className).not.toContain('col-span-2')
      }
    })
  })

  it('never renders an em-dash or en-dash anywhere in the section', () => {
    setup()
    const section = document.querySelector('#gallery') as HTMLElement
    expect(section).toBeTruthy()
    expect(section.textContent).not.toMatch(/[—–]/)
  })
})
