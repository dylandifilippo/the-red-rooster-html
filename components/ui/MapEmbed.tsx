'use client'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { contact } from '@/content/contact'

export function MapEmbed() {
  const t = useTranslations('contact')
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (active) return
    if (typeof IntersectionObserver === 'undefined') {
      const id = window.setTimeout(() => setActive(true), 0)
      return () => window.clearTimeout(id)
    }
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true)
          observer.disconnect()
        }
      },
      { rootMargin: '600px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [active])

  if (!active) {
    return <div ref={ref} aria-hidden className="h-72 w-full border border-hairline" />
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
