import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function About() {
  const t = useTranslations('about')
  const ta = useTranslations('a11y')
  return (
    <section id="about" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading id="about" />
        <div className="grid gap-10 lg:grid-cols-2">
          <p className="font-serif-display text-2xl leading-snug">{t('lead')}</p>
          <div>
            <p className="font-sans text-sm leading-relaxed text-ink-muted">{t('body')}</p>
            <div className="mt-8">
              <Image src="/images/signature.png" alt={ta('signatureAlt')} width={140} height={60} className="opacity-80" />
              <p className="mt-2 font-serif-display text-lg">{t('signatureName')}</p>
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-ink-muted">{t('signatureRole')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
