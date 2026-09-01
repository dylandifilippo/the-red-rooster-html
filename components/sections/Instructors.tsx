import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { team } from '@/content/team'
import { Reveal } from '@/lib/motion/Reveal'

/**
 * Divider classes for one cell of the instructor grid (1 col -> 2 cols at
 * sm -> 4 cols at lg). `divide-*` cannot express this: on a wrapping grid
 * it walks DOM order, so it draws a left edge on the cell that starts a
 * new row. Each cell therefore carries its own borders, and every side is
 * given exactly one value per breakpoint, never two competing utilities
 * whose winner would depend on stylesheet order rather than class order.
 */
function cellBorders(i: number, count: number) {
  return [
    'border-ink',
    // 1 col: a rule above every cell but the first.
    i === 0 ? '' : 'border-t-2',
    // 2 cols: rule above the second row only; right edge on the left column.
    i < 2 ? 'sm:border-t-0' : 'sm:border-t-2',
    i % 2 === 0 ? 'sm:border-r-2' : 'sm:border-r-0',
    // 4 cols: single row, so right edges only, none after the last cell.
    'lg:border-t-0',
    i === count - 1 ? 'lg:border-r-0' : 'lg:border-r-2',
  ]
    .filter(Boolean)
    .join(' ')
}

export function Instructors() {
  const t = useTranslations('team')
  return (
    <section id="instructors" className="border-t-2 border-ink py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-poster text-[clamp(34px,4.4vw,64px)] text-ink">{t('heading')}</h2>
        <div className="mt-12 grid border-2 border-ink sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <Reveal
              key={m.id}
              className={`h-full ${cellBorders(i, team.length)}`}
              delay={i * 0.08}
            >
              <figure className="flex h-full flex-col bg-white">
                <Image
                  src={m.image}
                  alt={t(`${m.id}.name`)}
                  width={480}
                  height={640}
                  className="aspect-[3/4] h-auto w-full object-cover object-top grayscale-[0.2] transition hover:grayscale-0"
                />
                <figcaption className="flex-1 border-t-2 border-ink px-4 py-4">
                  <p className="font-poster text-[17px] text-ink">{t(`${m.id}.name`)}</p>
                  <p className="text-[13px] text-ink-soft">{t(`${m.id}.role`)}</p>
                  <ul className="mt-2 space-y-1">
                    {(t.raw(`${m.id}.creds`) as string[]).map((c, ci) => (
                      <li key={ci} className="text-[12.5px] leading-relaxed text-ink-soft">
                        {c}
                      </li>
                    ))}
                  </ul>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
