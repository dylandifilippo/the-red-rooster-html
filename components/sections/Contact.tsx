import { useTranslations } from 'next-intl'
import { contact } from '@/content/contact'
import { MapEmbed } from '@/components/ui/MapEmbed'
import { Reveal } from '@/lib/motion/Reveal'

export function Contact() {
  const t = useTranslations('contact')
  return (
    <section id="contact" className="bg-ink pt-20 pb-24 text-paper lg:pt-24 lg:pb-32">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-poster text-[clamp(34px,4.4vw,64px)] text-paper">{t('heading')}</h2>
        <Reveal className="mt-12 grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <a
              href={`tel:${contact.phone}`}
              className="inline-block border-b-[3px] border-accent pb-1 font-mono text-[clamp(24px,3.4vw,44px)] font-semibold text-paper"
            >
              {contact.phoneDisplay}
            </a>
            <div>
              <a
                href={contact.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-accent px-8 py-4 text-[13px] font-bold text-white transition-colors hover:bg-accent/90"
              >
                {t('whatsapp')}
              </a>
            </div>
            <div className="space-y-1 text-[15px] text-paper-muted">
              <a href={contact.mapsUrl} target="_blank" rel="noreferrer" className="block transition-colors hover:text-paper">
                {contact.address.street}
              </a>
              <p>
                {contact.address.postalCode} {contact.address.city}
              </p>
              <a href="#schedule" className="mt-2 inline-block underline">
                {t('hoursLink')}
              </a>
            </div>
          </div>
          <MapEmbed />
        </Reveal>
      </div>
    </section>
  )
}
