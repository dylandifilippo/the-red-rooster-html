'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from './LanguageSwitcher'

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
      className={`fixed inset-x-0 top-0 z-50 flex flex-col border-b-2 border-ink bg-paper ${open ? 'h-dvh' : ''}`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl shrink-0 items-center justify-between gap-6 px-7">
        <a href="#top" className="font-poster text-[15px] text-ink">
          THE RED ROOSTER ACADEMY
        </a>
        <nav className="hidden items-center gap-6 lg:flex">
          {ANCHORS.map((a) => (
            <a key={a} href={`#${a}`} className="text-[13px] font-semibold text-ink underline-offset-4 hover:underline hover:decoration-accent hover:decoration-2">
              {t(a)}
            </a>
          ))}
          <LanguageSwitcher />
          <a href="#contact" className="inline-block bg-ink px-4.5 py-2.5 text-[13px] font-bold text-paper transition-colors hover:bg-ink/90">
            {t('cta')}
          </a>
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
        <nav className="min-h-0 flex-1 overflow-y-auto border-t-2 border-ink bg-paper px-7 py-8 lg:hidden">
          <ul className="flex flex-col gap-8">
            {ANCHORS.map((a) => (
              <li key={a}>
                <a href={`#${a}`} onClick={() => setOpen(false)} className="font-poster text-[34px] text-ink">
                  {t(a)}
                </a>
              </li>
            ))}
            <li className="pt-4">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="inline-block bg-accent px-4.5 py-2.5 text-[13px] font-bold text-white"
              >
                {t('cta')}
              </a>
            </li>
            <li className="pt-2"><LanguageSwitcher /></li>
          </ul>
        </nav>
      )}
    </header>
  )
}
