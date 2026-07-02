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
        <div className="relative mt-10 lg:mt-14">
          {/* Panel sits beside the photo, its right edge crossing it by ~2% of the
              container (≈3% of the image, Dylan's spec) at every lg width. */}
          <div className="hero-panel mb-8 flex flex-col justify-center lg:absolute lg:bottom-10 lg:left-0 lg:z-10 lg:mb-0 lg:w-[32%] lg:border-2 lg:border-ink lg:bg-paper lg:p-8">
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
          <div className="hero-frame relative w-full overflow-hidden border-2 border-ink aspect-[4/3] lg:aspect-[16/9] lg:w-[70%] lg:ml-auto">
            <Image
              src="/images/hero.jpg"
              alt={ta('heroAlt')}
              width={2560}
              height={1920}
              priority
              sizes="(min-width: 1024px) 72vw, 92vw"
              className="hero-image absolute left-0 -top-[17%] h-[120%] w-full object-cover"
            />
          </div>
        </div>
      </HeroIntro>
    </section>
  )
}
