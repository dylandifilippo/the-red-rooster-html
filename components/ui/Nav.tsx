'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from './LanguageSwitcher'
import { CtaButton } from './CtaButton'

const ANCHORS = ['about', 'programs', 'instructors', 'schedule', 'faq', 'pricing', 'contact'] as const

export function Nav() {
  const t = useTranslations('nav')
  const ta = useTranslations('a11y')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex flex-col border-b border-hairline backdrop-blur ${open ? 'h-dvh bg-canvas' : 'bg-canvas/90'}`}
    >
      <div className="mx-auto flex w-full max-w-7xl shrink-0 items-center justify-between gap-6 px-6 py-4">
        <a href="#top" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt={ta('logoAlt')} width={163} height={28} className="h-7 w-auto" />
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
        <nav className="min-h-0 flex-1 overflow-y-auto border-t border-hairline bg-canvas px-6 py-6 lg:hidden">
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
