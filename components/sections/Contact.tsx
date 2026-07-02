import { useTranslations } from 'next-intl'
import { contact } from '@/content/contact'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { MapEmbed } from '@/components/ui/MapEmbed'
import { Reveal } from '@/lib/motion/Reveal'

export function Contact() {
  const t = useTranslations('contact')
  return (
    <section id="contact" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading id="contact" />
        <Reveal className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-ink-muted">{t('callUs')}</p>
              <a href={`tel:${contact.phone}`} className="mt-2 block font-serif-display text-3xl transition-colors hover:text-accent">
                {contact.phoneDisplay}
              </a>
              <a href={contact.whatsappUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block font-sans text-sm text-accent underline">
                {t('whatsapp')} ↗
              </a>
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-ink-muted">{t('addressLabel')}</p>
              <a href={contact.mapsUrl} target="_blank" rel="noreferrer" className="mt-2 block font-serif-display text-xl transition-colors hover:text-accent">
                {contact.address.street}, {contact.address.postalCode} {contact.address.city}
              </a>
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-ink-muted">{t('hoursLabel')}</p>
              <a href="#schedule" className="mt-2 inline-block font-sans text-sm underline">{t('hoursLink')} →</a>
            </div>
          </div>
          <MapEmbed />
        </Reveal>
      </div>
    </section>
  )
}
