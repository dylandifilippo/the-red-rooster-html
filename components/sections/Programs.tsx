import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { programs } from '@/content/programs'
import { Reveal } from '@/lib/motion/Reveal'

// Cell-specific grid spans for the asymmetric bento (spec §5): BJJ Adultes is
// the tall anchor cell on the left, Lutte is the wide red banner underneath
// the two small photo cells.
const CELL_SPAN: Partial<Record<(typeof programs)[number]['id'], string>> = {
  'bjj-adults': 'lg:row-span-2',
  lutte: 'lg:col-span-2',
}

export function Programs() {
  const t = useTranslations('programs')
  return (
    <section id="programs" className="border-t-2 border-ink py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-poster text-[clamp(34px,4.4vw,64px)] text-ink">{t('heading')}</h2>
        <div className="mt-12 grid auto-rows-[240px] grid-cols-1 gap-[2px] border-2 border-ink bg-ink lg:grid-cols-[1.5fr_1fr_1fr] lg:grid-rows-[280px_280px]">
          {programs.map((p, i) => {
            const isBig = p.id === 'bjj-adults'
            const isLutte = p.id === 'lutte'
            return (
              <Reveal
                key={p.id}
                delay={i * 0.06}
                className={`group relative overflow-hidden ${isLutte ? 'bg-accent' : 'bg-paper'} ${CELL_SPAN[p.id] ?? ''}`}
              >
                {isLutte ? (
                  <div className="flex h-full flex-col justify-end p-5">
                    <h3 className="font-poster text-2xl text-white">{t('lutte.title')}</h3>
                    <p className="mt-1 text-[13.5px] leading-snug text-white">{t('lutte.description')}</p>
                  </div>
                ) : (
                  <>
                    <Image
                      src={p.image}
                      alt={t(`${p.id}.title`)}
                      fill
                      sizes={isBig ? '(min-width: 1024px) 40vw, 92vw' : '(min-width: 1024px) 27vw, 92vw'}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/85 to-transparent"
                    />
                    <div className="absolute bottom-0 left-0 p-5">
                      <h3 className={`font-poster text-paper ${isBig ? 'text-4xl' : 'text-2xl'}`}>{t(`${p.id}.title`)}</h3>
                      <p className="mt-1 text-[13.5px] leading-snug text-paper/85">{t(`${p.id}.description`)}</p>
                    </div>
                  </>
                )}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
