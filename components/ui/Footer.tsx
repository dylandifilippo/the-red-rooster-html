import { useTranslations } from 'next-intl'
import { contact } from '@/content/contact'

export function Footer() {
  const t = useTranslations('footer')
  return (
    <footer className="border-t border-hairline px-6 py-10 text-center font-sans text-xs text-ink-muted">
      <div className="mb-4 flex justify-center gap-6">
        <a href={contact.facebook} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">Facebook</a>
        <a href={contact.instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">Instagram</a>
      </div>
      <p>© {new Date().getFullYear()} The Red Rooster Academy — {t('rights')}</p>
      <p className="mt-1">
        {t('credit')}{' '}
        <a href="https://dylandifilippo.dev/" target="_blank" rel="noreferrer" className="underline transition-colors hover:text-ink">
          Dylan Di Filippo
        </a>
      </p>
    </footer>
  )
}
