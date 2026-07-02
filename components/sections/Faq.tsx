'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { faqIds } from '@/content/faq'
import { Reveal } from '@/lib/motion/Reveal'

export function Faq() {
  const t = useTranslations('faq')
  const [openId, setOpenId] = useState<string | null>(null)
  return (
    <section id="faq" className="border-t-2 border-ink py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-poster text-[clamp(34px,4.4vw,64px)] text-ink">{t('heading')}</h2>
        {/* Reveal only fades/translates the list in once on scroll; the
            accordion open/close interaction itself is left un-animated
            (instant `hidden` toggle), per the motion restraint rules. */}
        <Reveal>
          <ul className="mt-12 max-w-3xl">
            {faqIds.map((id, i) => {
              const open = openId === id
              const isLast = i === faqIds.length - 1
              return (
                <li key={id} className={`border-t-2 border-ink ${isLast ? 'border-b-2' : ''}`}>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`faq-${id}`}
                    onClick={() => setOpenId(open ? null : id)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    <span className="text-[17px] font-bold text-ink">{t(`items.${id}.question`)}</span>
                    <span
                      aria-hidden
                      className={`text-2xl font-bold leading-none text-accent transition-transform motion-reduce:transition-none ${open ? 'rotate-45' : ''}`}
                    >
                      +
                    </span>
                  </button>
                  <div id={`faq-${id}`} hidden={!open} className="pb-6">
                    <p className="max-w-[60ch] text-[15px] leading-relaxed text-ink-soft">
                      {t(`items.${id}.answer`)}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
