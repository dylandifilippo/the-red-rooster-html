import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { schedule } from '../content/schedule'
import { timetableRows, timeRange } from '../lib/timetable'
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
    expect(screen.queryByText('Le Planning')).not.toBeInTheDocument()
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
      const label = timeRange(row.start, row.end)
      expect(within(table).getByRole('rowheader', { name: label })).toBeInTheDocument()
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
        // Addressed by the row's own label: the header carries the end time
        // shared by the whole row, which is not necessarily this slot's.
        const row = timetableRows().find((r) => r.start === slot.start)!
        const rowHeader = within(table).getByRole('rowheader', {
          name: timeRange(row.start, row.end),
        })
        const cell = rowHeader.parentElement!.children[dayIndex]
        expect(cell?.textContent).toBe(fr.programs[slot.programId].title)
      }
    })
  })

  it('keeps a mobile card variant, exposed to assistive tech (not aria-hidden), for below-lg viewports', () => {
    const { container } = setup()
    const mobile = container.querySelector('.lg\\:hidden')
    expect(mobile).toBeTruthy()
    expect(mobile).not.toHaveAttribute('aria-hidden')
    // The mobile variant repeats every day heading and program name.
    expect(within(mobile as HTMLElement).getAllByText('BJJ Adultes').length).toBeGreaterThan(0)
  })

  it('renders mobile card slots in chronological order within each day, regardless of content order', () => {
    const { container } = setup()
    const mobile = container.querySelector('.lg\\:hidden') as HTMLElement
    schedule.forEach((day) => {
      const expectedStarts = [...day.slots]
        .sort((a, b) => a.start.localeCompare(b.start))
        .map((s) => timeRange(s.start, s.end))
      const dayCard = within(mobile)
        .getAllByText(fr.days[day.day])
        .map((el) => el.closest('div'))
        .find(Boolean) as HTMLElement
      const starts = within(dayCard)
        .getAllByRole('listitem')
        .map((li) => li.querySelector('.font-mono')?.textContent)
      expect(starts).toEqual(expectedStarts)
    })
  })

  it('renders the free trial note', () => {
    setup()
    expect(screen.getByText(fr.schedule.note)).toBeInTheDocument()
  })
})
