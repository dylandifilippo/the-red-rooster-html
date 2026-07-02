import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { gallery } from '@/content/gallery'
import { Reveal } from '@/lib/motion/Reveal'

// Grid arithmetic (2-col grid on mobile, 3-col grid on lg+; zero empty cells
// on either breakpoint):
//   mobile units: 2 + 1 + 1 + 2 + 1 + 1 = 8  -> 4 clean rows of 2
//   lg units:     2 + 1 + 1 + 2 + 1 + 2 = 9  -> 3 clean rows of 3
// The last photo (IMG_3705) is single-wide on mobile (span 1, no extra
// class) but double-wide on lg only (span 'lg-2' -> lg:col-span-2), which
// is what makes both totals divide evenly. See GalleryPhoto in
// content/types.ts for the span encoding.
function spanClass(span: (typeof gallery)[number]['span']): string {
  if (span === 2) return 'col-span-2'
  if (span === 'lg-2') return 'lg:col-span-2'
  return ''
}

function sizesFor(span: (typeof gallery)[number]['span']): string {
  return span === 1 ? '(min-width: 1024px) 33vw, 92vw' : '(min-width: 1024px) 66vw, 92vw'
}

export function Gallery() {
  const t = useTranslations('gallery')
  const alts = t.raw('alts') as string[]

  return (
    <section id="gallery" className="border-t-2 border-ink py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-poster text-[clamp(34px,4.4vw,64px)] text-ink">{t('heading')}</h2>
        {/* Fixed row heights, not per-cell aspect ratios: grid rows size to their
            tallest cell, so an aspect-locked span-2 cell would leave ink holes
            beside shorter span-1 neighbors (same technique as Programs). */}
        <div className="mt-12 grid auto-rows-[44vw] grid-cols-2 gap-[2px] border-2 border-ink bg-ink sm:auto-rows-[36vw] lg:auto-rows-[300px] lg:grid-cols-3">
          {gallery.map((photo, i) => (
            <Reveal
              key={photo.src}
              delay={i * 0.06}
              className={`relative overflow-hidden ${spanClass(photo.span)}`}
            >
              <Image src={photo.src} alt={alts[i]} fill sizes={sizesFor(photo.span)} className="object-cover" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
