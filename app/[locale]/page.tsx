import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { use } from 'react'

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  setRequestLocale(locale)
  const t = useTranslations('meta')
  return <main className="p-10 font-serif-display text-3xl">{t('title')}</main>
}
