import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'
import { Nav } from '@/components/ui/Nav'
import { Footer } from '@/components/ui/Footer'
import { Marquee } from '@/components/ui/Marquee'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Programs } from '@/components/sections/Programs'
import { Instructors } from '@/components/sections/Instructors'
import { Schedule } from '@/components/sections/Schedule'
import { Faq } from '@/components/sections/Faq'
import { Pricing } from '@/components/sections/Pricing'
import { Contact } from '@/components/sections/Contact'
import { buildLocalBusinessJsonLd } from '@/lib/jsonld'

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  setRequestLocale(locale)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildLocalBusinessJsonLd()) }}
      />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Programs />
        <Instructors />
        <Schedule />
        <Faq />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
