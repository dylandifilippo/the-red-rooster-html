import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { archivo } from '@/lib/fonts'
import './globals.css'

/**
 * Reached only for paths the locale middleware does not cover (paths with a
 * dot, e.g. an old /css/style.css). Renders in the default locale.
 */
export default async function RootNotFound() {
  const locale = routing.defaultLocale
  const t = await getTranslations({ locale, namespace: 'notFound' })
  return (
    <html lang={locale} className={archivo.variable}>
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center text-ink">
          <p className="font-poster text-[30px] text-accent sm:text-[44px]">404</p>
          <h1 className="font-poster mt-2 text-[32px] leading-none sm:text-[56px]">{t('title')}</h1>
          <p className="mt-6 max-w-md text-lg">{t('body')}</p>
          <Link
            href="/"
            className="mt-10 border-2 border-ink px-7 py-[14px] font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            {t('back')}
          </Link>
        </main>
      </body>
    </html>
  )
}
