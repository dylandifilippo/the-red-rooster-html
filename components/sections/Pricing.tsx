import { useTranslations } from 'next-intl'
import { pricing } from '@/content/pricing'
import { Reveal } from '@/lib/motion/Reveal'

// Featured tile per group is that group's highest recurring-commitment
// tier: adults' explicit id='monthly' card, kids' top id='card10' card
// (kids have no 'monthly' tier in content/pricing.ts). All remaining
// cards render as plain price lines below the grid so no price is ever
// dropped.
const ADULTS_FEATURED_ID = 'monthly'
const KIDS_FEATURED_ID = 'card10'

export function Pricing() {
  const t = useTranslations('pricing')
  const adults = pricing.find((g) => g.id === 'adults')!
  const kids = pricing.find((g) => g.id === 'kids')!
  const adultsFeatured = adults.cards.find((c) => c.id === ADULTS_FEATURED_ID)!
  const adultsRest = adults.cards.filter((c) => c.id !== ADULTS_FEATURED_ID)
  const kidsFeatured = kids.cards.find((c) => c.id === KIDS_FEATURED_ID)!
  const kidsRest = kids.cards.filter((c) => c.id !== KIDS_FEATURED_ID)

  return (
    <section id="pricing" className="border-t-2 border-ink bg-ink py-24 text-paper lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-poster text-[clamp(34px,4.4vw,64px)] text-paper">{t('heading')}</h2>
        <Reveal className="mt-12">
          <div className="grid gap-[2px] border-2 border-[#3a3835] bg-[#3a3835] lg:grid-cols-3">
            <div className="flex flex-col justify-center gap-2 bg-accent px-8 py-10">
              <p className="font-poster text-[44px] leading-none text-white">{t('trial.value')}</p>
              <p className="text-[14px] text-white">{t('trial.label')}</p>
            </div>
            <div className="flex flex-col justify-center gap-2 bg-ink px-8 py-10">
              <p className="flex items-baseline gap-2">
                <span className="font-poster text-[44px] leading-none text-paper">
                  {adultsFeatured.price}
                  {t('currency')}
                </span>
                <span className="font-sans text-[16px] font-semibold text-paper-muted">{t('perMonth')}</span>
              </p>
              <p className="text-[14px] text-paper-muted">{t('adults.title')}</p>
            </div>
            <div className="flex flex-col justify-center gap-2 bg-ink px-8 py-10">
              <p className="flex items-baseline gap-2">
                <span className="font-poster text-[44px] leading-none text-paper">
                  {kidsFeatured.price}
                  {t('currency')}
                </span>
                <span className="font-sans text-[16px] font-semibold text-paper-muted">
                  {t(`cards.${kidsFeatured.id}`)}
                </span>
              </p>
              <p className="text-[14px] text-paper-muted">{t('kids.title')}</p>
            </div>
          </div>
          <p className="mt-6 text-[14px] text-paper-muted">
            {t('adults.title')}
            {': '}
            {adultsRest.map((c) => `${t(`cards.${c.id}`)} ${c.price}${t('currency')}`).join(' · ')}
          </p>
          <p className="mt-1 text-[14px] text-paper-muted">
            {t('kids.title')}
            {': '}
            {kidsRest.map((c) => `${t(`cards.${c.id}`)} ${c.price}${t('currency')}`).join(' · ')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
