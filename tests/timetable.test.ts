import { describe, it, expect } from 'vitest'
import { schedule } from '../content/schedule'
import { timetableRows, isKidsSlot } from '../lib/timetable'

describe('timetableRows', () => {
  const rows = timetableRows()
  const days = schedule.map((d) => d.day)

  it('renders rows for exactly the sorted unique start times', () => {
    const expectedStarts = [...new Set(schedule.flatMap((d) => d.slots.map((s) => s.start)))].sort()
    expect(rows.map((r) => r.start)).toEqual(expectedStarts)
  })

  it('gives every row one cell per day, in content order', () => {
    for (const row of rows) {
      expect(row.cells).toHaveLength(days.length)
    }
  })

  it('places every content slot in its day column at its start-time row', () => {
    schedule.forEach((day, dayIndex) => {
      for (const slot of day.slots) {
        const row = rows.find((r) => r.start === slot.start)
        expect(row, `expected a row for start time ${slot.start}`).toBeDefined()
        expect(row!.cells[dayIndex]).toEqual(slot)
      }
    })
  })

  it('leaves a cell null exactly where a day has no slot at that row start time', () => {
    for (const row of rows) {
      row.cells.forEach((cell, dayIndex) => {
        const hasSlot = schedule[dayIndex].slots.some((s) => s.start === row.start)
        expect(cell !== null).toBe(hasSlot)
      })
    }
  })
})

describe('isKidsSlot', () => {
  it('is true only for bjj-kids slots, false for every other program', () => {
    for (const day of schedule) {
      for (const slot of day.slots) {
        expect(isKidsSlot(slot)).toBe(slot.programId === 'bjj-kids')
      }
    }
  })
})
