'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Props = {
  children: React.ReactNode
  className?: string
  yPercent?: number
}

/**
 * Subtle scroll-scrubbed vertical parallax for a single element (e.g. a
 * hero photo). Intended to be nested inside an `overflow-hidden` wrapper
 * so the translated content never reveals empty space at the edges.
 * No-op under reduced motion.
 */
export function Parallax({ children, className, yPercent = -8 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(ref.current, {
          yPercent,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
