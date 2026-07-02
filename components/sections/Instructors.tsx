import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { team } from '@/content/team'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Instructors() {
  const t = useTranslations('team')
  return (
    <section id="instructors" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading id="instructors" />
        <div className="grid gap-10 sm:grid-cols-3">
          {team.map((m) => (
            <article key={m.id}>
              <Image src={m.image} alt={t(`${m.id}.name`)} width={480} height={640} className="h-72 w-full object-cover object-top" />
              <h3 className="mt-5 font-serif-display text-2xl">{t(`${m.id}.name`)}</h3>
              <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.2em] text-ink-muted">{t(`${m.id}.role`)}</p>
              <ul className="mt-3 space-y-1">
                {(t.raw(`${m.id}.creds`) as string[]).map((c) => (
                  <li key={c} className="font-sans text-xs leading-relaxed text-ink-muted">— {c}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
