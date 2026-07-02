import { schedule as scheduleContent } from '@/content/schedule'
import type { ClassSlot, DaySchedule } from '@/content/types'

export type TimetableCell = ClassSlot | null

export interface TimetableRow {
  start: string
  cells: TimetableCell[]
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
  return starts.map((start) => ({
    start,
    cells: schedule.map((day) => day.slots.find((s) => s.start === start) ?? null),
  }))
}

/** BJJ Kids sessions get the ink fill in the poster timetable; every other
 * program (adults, grappling, lutte) gets the accent/red fill. */
export function isKidsSlot(slot: ClassSlot): boolean {
  return slot.programId === 'bjj-kids'
}
