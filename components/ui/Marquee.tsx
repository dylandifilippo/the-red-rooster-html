import { useTranslations } from 'next-intl'
import { programs } from '@/content/programs'

export function Marquee() {
  const t = useTranslations('programs')
  const names = programs.map((p) => t(`${p.id}.title`))
  return (
    <div aria-hidden="true" className="overflow-hidden border-y-2 border-ink py-4">
      <div className="marquee-track flex w-max">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 gap-16 pr-16">
            {[0, 1, 2].map((rep) =>
              names.map((n, i) => (
                <span key={`${rep}-${n}`} className={`font-poster text-xl ${i % 2 ? 'text-accent' : 'text-ink'}`}>
                  {n}
                </span>
              )),
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
