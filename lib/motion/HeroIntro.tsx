'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Props = {
  children: React.ReactNode
  className?: string
}

/**
 * Hero-only intro: on mount, staggers the three headline lines (`.hero-line`)
 * up into place, and drives a scroll-scrubbed parallax on the framed photo
 * (`.hero-image`). Targets are queried via selectors scoped to this
 * component's own container (useGSAP `scope`), never the global document.
 * No-op when the user prefers reduced motion; the static markup already
 * renders in its final position, so no initial hidden styles are needed.
 */
export function HeroIntro({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.hero-line', {
          y: 40,
          opacity: 0,
          stagger: 0.08,
          duration: 0.9,
          ease: 'expo.out',
        })

        gsap.to('.hero-image', {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })

      // useGSAP's automatic cleanup reverts everything created in this
      // context (including the matchMedia instance) on unmount.
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
