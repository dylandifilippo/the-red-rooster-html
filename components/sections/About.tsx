import { useTranslations } from 'next-intl'
import { Reveal } from '@/lib/motion/Reveal'

export function About() {
  const t = useTranslations('about')
  return (
    <section id="about" className="border-t-2 border-ink py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="grid gap-16 lg:grid-cols-[2fr_1fr]">
          <p className="text-[clamp(26px,2.6vw,40px)] font-bold leading-[1.3] text-ink">{t('lead')}</p>
          <div>
            <p className="text-[15px] leading-relaxed text-ink-soft">{t('body')}</p>
            <div className="mt-8">
              <p className="text-lg font-bold text-ink">{t('signatureName')}</p>
              <p className="text-[13px] text-ink-soft">{t('signatureRole')}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
