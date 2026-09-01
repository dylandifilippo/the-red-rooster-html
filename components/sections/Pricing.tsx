import { useTranslations } from 'next-intl'
import { pricing } from '@/content/pricing'
import type { PriceCard } from '@/content/types'
import { Reveal } from '@/lib/motion/Reveal'

/**
 * Each group gets one featured tile showing its highest recurring-commitment
 * tier, chosen in this order: a monthly subscription, else a 10-class card,
 * else the single class (kids have no monthly tier in content/pricing.ts,
 * lutte has no card). Every card the tile does not show is listed as a plain
 * price line under the grid, so no price in content/pricing.ts is dropped.
 */
const FEATURED_PRIORITY = ['monthly', 'card10', 'single']

function featuredOf(cards: PriceCard[]): PriceCard {
  for (const id of FEATURED_PRIORITY) {
    const card = cards.find((c) => c.id === id)
    if (card) return card
  }
  return cards[0]
}

export function Pricing() {
  const t = useTranslations('pricing')
  const groups = pricing.map((group) => {
    const featured = featuredOf(group.cards)
    return { ...group, featured, rest: group.cards.filter((c) => c.id !== featured.id) }
  })
  const withRest = groups.filter((g) => g.rest.length > 0)

  return (
    <section id="pricing" className="border-t-2 border-ink bg-ink py-24 text-paper lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-poster text-[clamp(34px,4.4vw,64px)] text-paper">{t('heading')}</h2>
        <Reveal className="mt-12">
          {/* Trial tile plus one tile per group; the 2px gap over the container
              background draws the rules, so the count of tiles can change
              without any per-cell border bookkeeping. */}
          <div className="grid gap-[2px] border-2 border-[#3a3835] bg-[#3a3835] sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col justify-center gap-2 bg-accent px-8 py-10">
              <p className="font-poster text-[44px] leading-none text-white">{t('trial.value')}</p>
              <p className="text-[14px] text-white">{t('trial.label')}</p>
            </div>
            {groups.map((g) => (
              <div key={g.id} className="flex flex-col justify-center gap-2 bg-ink px-8 py-10">
                <p className="flex items-baseline gap-2">
                  <span className="font-poster text-[44px] leading-none text-paper">
                    {g.featured.price}
                    {t('currency')}
                  </span>
                  <span className="font-sans text-[16px] font-semibold text-paper-muted">
                    {g.featured.id === 'monthly' ? t('perMonth') : t(`cards.${g.featured.id}`)}
                  </span>
                </p>
                <p className="text-[14px] text-paper-muted">{t(`${g.id}.title`)}</p>
              </div>
            ))}
          </div>
          {withRest.map((g, i) => (
            <p key={g.id} className={`${i === 0 ? 'mt-6' : 'mt-1'} text-[14px] text-paper-muted`}>
              {t(`${g.id}.title`)}
              {': '}
              {g.rest.map((c) => `${t(`cards.${c.id}`)} ${c.price}${t('currency')}`).join(' · ')}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
