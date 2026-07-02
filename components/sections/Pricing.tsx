import { useTranslations } from 'next-intl'
import { pricing } from '@/content/pricing'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Pricing() {
  const t = useTranslations('pricing')
  return (
    <section id="pricing" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading id="pricing" />
        <div className="grid gap-14 lg:grid-cols-2">
          {pricing.map((group) => (
            <div key={group.id}>
              <h3 className="font-serif-display text-2xl">{t(`${group.id}.title`)}</h3>
              <dl className="mt-6 divide-y divide-hairline border-y border-hairline">
                {group.cards.map((card) => (
                  <div key={card.id} className="flex items-baseline justify-between py-4">
                    <dt className="font-sans text-sm">{t(`cards.${card.id}`)}</dt>
                    <dd className="font-serif-display text-3xl">
                      {card.price}
                      <span className="ml-1 text-lg text-accent">{t('currency')}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
