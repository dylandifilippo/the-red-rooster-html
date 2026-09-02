import { schedule as scheduleContent } from '@/content/schedule'
import type { ClassSlot, DaySchedule } from '@/content/types'

export type TimetableCell = ClassSlot | null

export interface TimetableRow {
  start: string
  /**
   * The end time shared by every slot on the row, or null when they differ.
   * The row header speaks for a whole row, so it can only carry an end time
   * that holds for all of it; a mixed row falls back to the start alone.
   */
  end: string | null
  cells: TimetableCell[]
}

/** One spelling of a time span, so the table and the cards cannot diverge. */
export function timeRange(start: string, end: string | null): string {
  return end ? `${start} - ${end}` : start
}

/**
 * Derives the poster timetable grid from `content/schedule.ts` (or an
 * injected `schedule`, for tests): one row per unique sorted class start
 * time, one cell per day (in content order), holding that day's slot at
 * that start time (or `null`). Never hardcode times or the day/row layout
 * elsewhere: a schedule content edit must reflow the whole table.
 *
 * Throws if any single day lists two slots with the same start time: the
 * row builder can only hold one slot per day/start cell, so a duplicate
 * would silently disappear instead of surfacing as a content bug.
 */
export function timetableRows(schedule: DaySchedule[] = scheduleContent): TimetableRow[] {
  for (const day of schedule) {
    const seen = new Set<string>()
    for (const slot of day.slots) {
      if (seen.has(slot.start)) {
        throw new Error(`timetableRows: duplicate start ${slot.start} on ${day.day}`)
      }
      seen.add(slot.start)
    }
  }

  const starts = [...new Set(schedule.flatMap((d) => d.slots.map((s) => s.start)))].sort()
  return starts.map((start) => {
    const cells = schedule.map((day) => day.slots.find((s) => s.start === start) ?? null)
    const ends = new Set(cells.flatMap((c) => (c ? [c.end] : [])))
    return { start, end: ends.size === 1 ? [...ends][0] : null, cells }
  })
}

/** BJJ Kids sessions get the ink fill in the poster timetable; every other
 * program (adults, grappling, lutte) gets the accent/red fill. */
export function isKidsSlot(slot: ClassSlot): boolean {
  return slot.programId === 'bjj-kids'
}
