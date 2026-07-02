'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { contact } from '@/content/contact'

export function MapEmbed() {
  const t = useTranslations('contact')
  const [active, setActive] = useState(false)
  if (!active) {
    return (
      <button
        type="button"
        onClick={() => setActive(true)}
        className="flex h-72 w-full items-center justify-center border border-hairline font-sans text-xs uppercase tracking-[0.2em] text-ink-muted transition-colors hover:border-accent hover:text-ink"
      >
        {t('mapCta')} ↗
      </button>
    )
  }
  return (
    <iframe
      src={contact.mapsEmbedUrl}
      title={t('mapTitle')}
      className="h-72 w-full border-0"
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  )
}
