import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { programs } from '@/content/programs'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Programs() {
  const t = useTranslations('programs')
  return (
    <section id="programs" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading id="programs" />
        <div className="grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((p, i) => (
            <article key={p.id} className="bg-canvas">
              <Image src={p.image} alt={t(`${p.id}.title`)} width={370} height={208} className="h-44 w-full object-cover" />
              <div className="px-5 py-6">
                <p className="font-sans text-[10px] tracking-[0.3em] text-accent">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 font-serif-display text-xl">{t(`${p.id}.title`)}</h3>
                <p className="mt-3 font-sans text-xs leading-relaxed text-ink-muted">{t(`${p.id}.description`)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
