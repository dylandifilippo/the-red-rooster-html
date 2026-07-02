'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from './LanguageSwitcher'
import { CtaButton } from './CtaButton'

const ANCHORS = ['about', 'programs', 'instructors', 'schedule', 'faq', 'pricing', 'contact'] as const

export function Nav() {
  const t = useTranslations('nav')
  const ta = useTranslations('a11y')
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <a href="#top" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt={ta('logoAlt')} width={40} height={40} />
          <span className="font-sans text-xs font-semibold tracking-[0.22em]">THE RED ROOSTER ACADEMY</span>
        </a>
        <nav className="hidden items-center gap-6 lg:flex">
          {ANCHORS.map((a) => (
            <a key={a} href={`#${a}`} className="font-sans text-[11px] uppercase tracking-[0.15em] text-ink-muted transition-colors hover:text-ink">
              {t(a)}
            </a>
          ))}
          <LanguageSwitcher />
          <CtaButton href="#contact" variant="outline">{t('cta')}</CtaButton>
        </nav>
        <button
          type="button"
          className="lg:hidden"
          aria-expanded={open}
          aria-label={open ? ta('closeMenu') : ta('openMenu')}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden className="block h-px w-6 bg-ink" />
          <span aria-hidden className="mt-1.5 block h-px w-6 bg-ink" />
        </button>
      </div>
      {open && (
        <nav className="border-t border-hairline px-6 py-6 lg:hidden">
          <ul className="flex flex-col gap-4">
            {ANCHORS.map((a) => (
              <li key={a}>
                <a href={`#${a}`} onClick={() => setOpen(false)} className="font-sans text-sm uppercase tracking-[0.15em]">
                  {t(a)}
                </a>
              </li>
            ))}
            <li className="pt-2"><LanguageSwitcher /></li>
          </ul>
        </nav>
      )}
    </header>
  )
}
