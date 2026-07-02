import { useTranslations } from 'next-intl'

type SectionId = 'about' | 'programs' | 'instructors' | 'schedule' | 'faq' | 'pricing' | 'contact'

export function SectionHeading({ id }: { id: SectionId }) {
  const t = useTranslations('sections')
  return (
    <header className="mb-10">
      <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-accent">
        {t(`${id}.number`)} — {t(`${id}.title`)}
      </p>
    </header>
  )
}
