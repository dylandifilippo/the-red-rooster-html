import { useTranslations } from 'next-intl'

export function Marquee() {
  const t = useTranslations('marquee')
  const words = t.raw('words') as string[]
  return (
    <div aria-hidden="true" className="overflow-hidden border-y-2 border-ink py-4">
      <div className="marquee-track flex w-max">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 gap-16 pr-16">
            {[0, 1].map((rep) =>
              words.map((w, i) => (
                <span key={`${rep}-${w}`} className={`font-poster text-xl ${i % 2 ? 'text-accent' : 'text-ink'}`}>
                  {w}
                </span>
              )),
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
