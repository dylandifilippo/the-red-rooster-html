import { useTranslations } from 'next-intl'
import { schedule } from '@/content/schedule'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Schedule() {
  const tDays = useTranslations('days')
  const tPrograms = useTranslations('programs')
  const t = useTranslations('schedule')
  return (
    <section id="schedule" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading id="schedule" />
        <dl className="divide-y divide-hairline border-y border-hairline">
          {schedule.map((day) => (
            <div key={day.day} className="grid gap-2 py-5 sm:grid-cols-[140px_1fr]">
              <dt className="font-serif-display text-xl">{tDays(day.day)}</dt>
              <dd className="flex flex-wrap gap-x-10 gap-y-2">
                {day.slots.map((slot) => (
                  <span key={`${slot.programId}${slot.start}`} className="font-sans text-sm">
                    <span>{tPrograms(`${slot.programId}.title`)}</span>{' '}
                    <span className="text-ink-muted">{slot.start} – {slot.end}</span>
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 font-sans text-xs text-ink-muted">{t('note')}</p>
      </div>
    </section>
  )
}
