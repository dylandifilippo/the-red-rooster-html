import { useTranslations } from 'next-intl'
import { contact } from '@/content/contact'

export function Footer() {
  const t = useTranslations('footer')
  return (
    <footer className="border-t border-paper/15 bg-ink py-8 text-[13px] text-paper-muted">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="font-poster text-[13px] text-paper">THE RED ROOSTER ACADEMY</p>
        <div className="flex gap-6">
          <a href={contact.facebook} target="_blank" rel="noreferrer" className="transition-colors hover:text-paper">
            Facebook
          </a>
          <a href={contact.instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-paper">
            Instagram
          </a>
        </div>
        <div className="sm:text-right">
          <p>
            © {new Date().getFullYear()} The Red Rooster Academy. {t('rights')}.
          </p>
          <p>
            {t('credit')}{' '}
            <a href="https://dylandifilippo.dev/" target="_blank" rel="noreferrer" className="underline transition-colors hover:text-paper">
              Dylan Di Filippo
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
