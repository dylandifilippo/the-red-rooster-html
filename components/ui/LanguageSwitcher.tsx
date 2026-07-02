'use client'
import { useLocale, useTranslations } from 'next-intl'
import { routing } from '@/i18n/routing'

const LABELS: Record<string, string> = { fr: 'FR', nl: 'NL', en: 'EN' }

export function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('a11y')
  return (
    <nav aria-label={t('languageSwitcher')} className="flex items-center gap-3 font-sans text-xs tracking-[0.18em]">
      {routing.locales.map((l) => (
        <a
          key={l}
          href={l === routing.defaultLocale ? '/' : `/${l}`}
          aria-current={l === locale ? 'true' : undefined}
          className={l === locale ? 'text-accent' : 'text-ink-muted transition-colors hover:text-ink'}
        >
          {LABELS[l]}
        </a>
      ))}
    </nav>
  )
}
