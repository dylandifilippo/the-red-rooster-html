import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { HeroIntro } from '@/lib/motion/HeroIntro'

export function Hero() {
  const t = useTranslations('hero')
  const ta = useTranslations('a11y')
  return (
    <section id="top" className="bg-paper pt-24">
      <HeroIntro className="mx-auto max-w-7xl px-6 pb-16">
        <h1 className="font-poster text-[clamp(52px,9vw,150px)] max-[540px]:text-[8.6vw] leading-[0.9]">
          <span className="hero-line block whitespace-nowrap text-ink">{t('line1')}</span>
          <span className="hero-line block whitespace-nowrap text-transparent [-webkit-text-stroke:2px_var(--color-ink)]">
            {t('line2')}
          </span>
          <span className="hero-line block whitespace-nowrap text-accent">{t('line3')}</span>
        </h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col justify-center">
            <p className="max-w-[40ch] text-[17px] text-ink-soft">{t('sub')}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#contact" className="bg-accent px-8 py-4 font-bold text-white transition-colors hover:bg-[#a93a26]">
                {t('cta')}
              </a>
              <a href="#schedule" className="border-2 border-ink px-7 py-[14px] font-semibold text-ink transition-colors hover:bg-ink hover:text-paper">
                {t('scheduleCta')}
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden border-2 border-ink lg:aspect-auto">
            <Image
              src="/images/hero.jpg"
              alt={ta('heroAlt')}
              width={2560}
              height={1920}
              priority
              sizes="(min-width: 1024px) 55vw, 92vw"
              className="hero-image absolute left-0 -top-[17%] h-[120%] w-full object-cover"
            />
          </div>
        </div>
      </HeroIntro>
    </section>
  )
}
