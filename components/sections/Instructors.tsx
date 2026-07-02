import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { team } from '@/content/team'
import { Reveal } from '@/lib/motion/Reveal'

export function Instructors() {
  const t = useTranslations('team')
  return (
    <section id="instructors" className="border-t-2 border-ink py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-poster text-[clamp(34px,4.4vw,64px)] text-ink">{t('heading')}</h2>
        <div className="mt-12 grid border-2 border-ink divide-y-2 divide-ink lg:grid-cols-3 lg:divide-y-0 lg:divide-x-2">
          {team.map((m, i) => (
            <Reveal key={m.id} className="h-full" delay={i * 0.08}>
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
