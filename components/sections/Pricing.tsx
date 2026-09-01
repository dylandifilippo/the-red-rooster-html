import { useTranslations } from 'next-intl'
import { pricing } from '@/content/pricing'
import { Reveal } from '@/lib/motion/Reveal'

/**
 * Every price in content/pricing.ts gets its own tile, in content order,
 * behind the free-trial tile. There is deliberately no secondary list: a
 * price set in smaller type under the grid reads as fine print, so the grid
 * is the only place a price ever appears, and all tiles share one treatment.
 */
export function Pricing() {
  const t = useTranslations('pricing')
  const tiles = pricing.flatMap((group) =>
    group.cards.map((card) => ({ key: `${group.id}-${card.id}`, group, card })),
  )

  return (
    <section id="pricing" className="border-t-2 border-ink bg-ink py-24 text-paper lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-poster text-[clamp(34px,4.4vw,64px)] text-paper">{t('heading')}</h2>
        <Reveal className="mt-12">
          {/* The 2px gap over the container background draws the rules, so the
              number of tiles can change without any per-cell border work. */}
          <div className="grid gap-[2px] border-2 border-[#3a3835] bg-[#3a3835] sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col justify-center gap-2 bg-accent px-8 py-10">
              <p className="font-poster text-[44px] leading-none text-white">{t('trial.value')}</p>
              <p className="text-[16px] text-white">{t('trial.label')}</p>
            </div>
            {tiles.map(({ key, group, card }) => (
              <div key={key} className="flex flex-col justify-center gap-2 bg-ink px-8 py-10">
                <p className="flex items-baseline gap-2">
                  <span className="font-poster text-[44px] leading-none text-paper">
                    {card.price}
                    {t('currency')}
                  </span>
                  <span className="font-sans text-[16px] font-semibold text-paper-muted">
                    {card.id === 'monthly' ? t('perMonth') : t(`cards.${card.id}`)}
                  </span>
                </p>
                <p className="text-[16px] text-paper-muted">{t(`${group.id}.title`)}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
