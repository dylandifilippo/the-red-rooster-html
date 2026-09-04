import { useLocale, useTranslations } from 'next-intl'
import { localePath } from '@/lib/seo'

export default function NotFound() {
  const t = useTranslations('notFound')
  const home = localePath(useLocale())
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center text-ink">
      <p className="font-poster text-[30px] text-accent sm:text-[44px]">404</p>
      <h1 className="font-poster mt-2 text-[32px] leading-none sm:text-[56px]">{t('title')}</h1>
      <p className="mt-6 max-w-md text-lg">{t('body')}</p>
      <a
        href={home}
        className="mt-10 border-2 border-ink px-7 py-[14px] font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
      >
        {t('back')}
      </a>
    </main>
  )
}
