import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { CtaButton } from '@/components/ui/CtaButton'
import { Parallax } from '@/lib/motion/Parallax'

export function Hero() {
  const t = useTranslations('hero')
  const ta = useTranslations('a11y')
  return (
    <section id="top" className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-36 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-accent">{t('location')}</p>
        <h1 className="mt-5 font-serif-display text-5xl leading-[1.1] font-medium lg:text-6xl">
          {t.rich('headline', { em: (chunks) => <em className="text-accent">{chunks}</em> })}
        </h1>
        <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-ink-muted">{t('sub')}</p>
        <div className="mt-9 flex flex-wrap gap-4">
          <CtaButton href="#contact">{t('ctaPrimary')}</CtaButton>
          <CtaButton href="#schedule" variant="outline">{t('ctaSecondary')}</CtaButton>
        </div>
      </div>
      <figure className="relative">
        <div className="overflow-hidden">
          <Parallax>
            <Image src="/images/hero.jpg" alt={ta('heroAlt')} width={1920} height={1080} priority className="h-auto w-full scale-110 object-cover" />
          </Parallax>
        </div>
        <figcaption className="absolute -bottom-3 -left-3 bg-accent px-4 py-2 font-sans text-[10px] uppercase tracking-[0.25em] text-white">
          {t('photoTag')}
        </figcaption>
      </figure>
    </section>
  )
}
