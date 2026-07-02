import { schedule } from '@/content/schedule'
import type { ClassSlot } from '@/content/types'

export type TimetableCell = ClassSlot | null

export interface TimetableRow {
  start: string
  cells: TimetableCell[]
}

/**
 * Derives the poster timetable grid from `content/schedule.ts`: one row per
 * unique sorted class start time, one cell per day (in content order),
 * holding that day's slot at that start time (or `null`). Never hardcode
 * times or the day/row layout elsewhere: a schedule content edit must
 * reflow the whole table.
 */
export function timetableRows(): TimetableRow[] {
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
