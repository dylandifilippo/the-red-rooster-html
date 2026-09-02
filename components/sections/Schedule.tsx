import { useTranslations } from 'next-intl'
import { schedule } from '@/content/schedule'
import type { ClassSlot } from '@/content/types'
import { timetableRows, isKidsSlot, timeRange } from '@/lib/timetable'
import { TimetableSweep } from '@/lib/motion/TimetableSweep'

// Kids sessions get the ink fill, every other program (adults, grappling,
// lutte) gets the accent/red fill, empty cells stay white. Shared by both
// the desktop table and the mobile stacked cards so the fill coding never
// drifts between the two variants.
function fillClass(slot: ClassSlot | null): string {
  if (!slot) return 'bg-white'
  return isKidsSlot(slot) ? 'bg-ink text-paper font-bold' : 'bg-accent text-white font-bold'
}

// 1px internal column separators, skipped on the first day column so they
// never double up against the 2px border-r that already separates the time
// column from the day columns.
function columnBorder(dayIndex: number): string {
  return dayIndex === 0 ? '' : 'border-l border-[#dedbd3]'
}

export function Schedule() {
  const tDays = useTranslations('days')
  const tPrograms = useTranslations('programs')
  const t = useTranslations('schedule')
  const rows = timetableRows()

  return (
    <section id="schedule" className="border-t-2 border-ink py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-poster text-[clamp(34px,4.4vw,64px)] text-ink">{t('heading')}</h2>

        {/* Desktop: a real table, derived from content/schedule.ts (rows =
            sorted unique start times, columns = days in content order).
            Hidden below `lg` via `hidden lg:table`, which removes it from
            the a11y tree there too — see the mobile cards below. */}
        <TimetableSweep className="mt-12 overflow-x-auto border-2 border-ink bg-white">
          <table className="hidden w-full border-collapse lg:table">
            <caption className="sr-only">{t('heading')}</caption>
            <thead>
              <tr>
                <th className="border-r-2 border-ink bg-ink px-4 py-3.5" />
                {schedule.map((day, i) => (
                  <th
                    key={day.day}
                    scope="col"
                    className={`bg-ink px-4 py-3.5 text-left text-[14px] font-bold uppercase tracking-normal text-paper ${columnBorder(i)}`}
                  >
                    {tDays(day.day)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.start}>
                  <th
                    scope="row"
                    className="border-r-2 border-ink px-4 py-5 text-left font-mono text-[15px] font-semibold"
                  >
                    {timeRange(row.start, row.end)}
                  </th>
                  {row.cells.map((slot, i) => (
                    <td
                      key={schedule[i].day}
                      className={`px-4 py-5 text-[14.5px] ${columnBorder(i)} ${fillClass(slot)}`}
                    >
                      {slot && (
                        <span className="timetable-fill block">{tPrograms(`${slot.programId}.title`)}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </TimetableSweep>

        {/* Mobile (< lg): per-day stacked cards, same fill coding, derived
            from the same data. `hidden lg:table` above already removes the
            desktop table from the a11y tree below `lg`, and `lg:hidden`
            below removes these cards from it at `lg` and up, so exactly one
            variant is ever exposed to assistive tech — neither should carry
            an unconditional aria-hidden. Slots are sorted by start so the
            card order always matches the desktop table's chronological
            rows, regardless of content order. */}
        <div className="mt-12 flex flex-col gap-6 lg:hidden">
          {schedule.map((day) => (
            <div key={day.day} className="border-2 border-ink bg-white">
              <p className="font-poster bg-ink px-4 py-3 text-xl text-paper">{tDays(day.day)}</p>
              <ul className="divide-y divide-[#dedbd3]">
                {[...day.slots]
                  .sort((a, b) => a.start.localeCompare(b.start))
                  .map((slot) => (
                    <li
                      key={`${slot.programId}-${slot.start}`}
                      className={`flex items-center justify-between gap-4 px-4 py-3 text-[14.5px] ${fillClass(slot)}`}
                    >
                      <span className="font-mono font-semibold">{timeRange(slot.start, slot.end)}</span>
                      <span className="font-bold">{tPrograms(`${slot.programId}.title`)}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-ink-soft">{t('note')}</p>
      </div>
    </section>
  )
}
