import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { schedule } from '../content/schedule'
import { timetableRows } from '../lib/timetable'
import { Schedule } from '../components/sections/Schedule'

function setup() {
  return render(
    <NextIntlClientProvider locale="fr" messages={fr}>
      <Schedule />
    </NextIntlClientProvider>,
  )
}

describe('Schedule section', () => {
  it('renders the heading, no kicker', () => {
    setup()
    expect(screen.getByRole('heading', { level: 2, name: fr.schedule.heading })).toBeInTheDocument()
    expect(screen.queryByText(/Nº/)).not.toBeInTheDocument()
    expect(screen.queryByText(fr.sections.schedule.title)).not.toBeInTheDocument()
  })

  it('renders a desktop table with a column for every day and a row for every unique start time', () => {
    setup()
    const table = screen.getByRole('table')
    const rows = timetableRows()

    for (const day of schedule) {
      expect(within(table).getByRole('columnheader', { name: fr.days[day.day] })).toBeInTheDocument()
    }
    expect(within(table).queryByText('Jeudi')).not.toBeInTheDocument()

    for (const row of rows) {
      expect(within(table).getByRole('rowheader', { name: row.start })).toBeInTheDocument()
    }
  })

  it('places every content slot in the correct day column and time row of the table', () => {
    setup()
    const table = screen.getByRole('table')
    schedule.forEach((day) => {
      const dayColumn = within(table)
        .getAllByRole('columnheader')
        .find((th) => th.textContent === fr.days[day.day])
      const dayIndex = dayColumn ? Array.from(dayColumn.parentElement!.children).indexOf(dayColumn) : -1
      expect(dayIndex).toBeGreaterThan(-1)

      for (const slot of day.slots) {
        const rowHeader = within(table).getByRole('rowheader', { name: slot.start })
        const row = rowHeader.parentElement!
        const cell = row.children[dayIndex]
        expect(cell?.textContent).toBe(fr.programs[slot.programId].title)
      }
    })
  })

  it('keeps an aria-hidden mobile card variant so the table stays the single a11y source', () => {
    const { container } = setup()
    const mobile = container.querySelector('[aria-hidden="true"]')
    expect(mobile).toBeTruthy()
    // The mobile variant repeats every day heading and program name.
    expect(within(mobile as HTMLElement).getAllByText('BJJ Adultes').length).toBeGreaterThan(0)
  })

  it('renders the free trial note', () => {
    setup()
    expect(screen.getByText(fr.schedule.note)).toBeInTheDocument()
  })
})
