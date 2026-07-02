import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { Schedule } from '../components/sections/Schedule'

describe('Schedule section', () => {
  it('renders each training day with its classes and times', () => {
    render(
      <NextIntlClientProvider locale="fr" messages={fr}>
        <Schedule />
      </NextIntlClientProvider>,
    )
    expect(screen.getByText('Lundi')).toBeInTheDocument()
    expect(screen.queryByText('Jeudi')).not.toBeInTheDocument()
    expect(screen.getAllByText('BJJ Adultes').length).toBe(3)
    expect(screen.getAllByText(/18:30\s*–\s*19:30/).length).toBe(2)
  })
})
