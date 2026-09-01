import type { DaySchedule } from './types'

export const schedule: DaySchedule[] = [
  {
    day: 'monday',
    slots: [
      { programId: 'bjj-kids', start: '18:30', end: '19:30' },
      { programId: 'bjj-adults', start: '19:30', end: '21:00' },
    ],
  },
  { day: 'tuesday', slots: [{ programId: 'lutte', start: '19:30', end: '21:00' }] },
  {
    day: 'wednesday',
    slots: [
      { programId: 'bjj-kids', start: '18:30', end: '19:30' },
      { programId: 'bjj-adults', start: '19:30', end: '21:00' },
    ],
  },
  { day: 'friday', slots: [{ programId: 'bjj-adults', start: '19:30', end: '21:00' }] },
  { day: 'sunday', slots: [{ programId: 'lutte', start: '16:00', end: '17:00' }] },
]
