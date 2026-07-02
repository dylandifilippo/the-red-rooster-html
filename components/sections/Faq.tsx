'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { faqIds } from '@/content/faq'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/lib/motion/Reveal'

export function Faq() {
  const t = useTranslations('faq')
  const [openId, setOpenId] = useState<string | null>(null)
  return (
    <section id="faq" className="border-t border-hairline">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <SectionHeading id="faq" />
        {/* Reveal only fades/translates the list in once on scroll; the
            accordion open/close interaction itself is left un-animated
            (instant `hidden` toggle), per the motion restraint rules. */}
        <Reveal>
          <ul className="divide-y divide-hairline border-y border-hairline">
            {faqIds.map((id) => {
              const open = openId === id
              return (
                <li key={id}>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`faq-${id}`}
                    onClick={() => setOpenId(open ? null : id)}
                    className="flex w-full items-baseline justify-between gap-6 py-5 text-left"
                  >
                    <span className="font-serif-display text-lg">{t(`items.${id}.question`)}</span>
                    <span aria-hidden className="font-sans text-accent">{open ? '−' : '+'}</span>
                  </button>
                  <div id={`faq-${id}`} hidden={!open} className="pb-6">
                    <p className="font-sans text-sm leading-relaxed text-ink-muted">{t(`items.${id}.answer`)}</p>
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
