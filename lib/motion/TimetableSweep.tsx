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
 * Wraps the desktop poster timetable (`Schedule.tsx`). The first time it
 * scrolls into view, sweeps every filled cell's inner `.timetable-fill`
 * wrapper in from scaleX 0 (transform-origin left), staggered 0.05s each -
 * a left-to-right "the week filling in" reveal that draws the eye to the
 * data that converts (spec: Motion spec, Timetable). Animating the inner
 * <span> rather than the <td> itself, since table cells don't transform
 * reliably. The mobile stacked cards render outside this wrapper and are
 * never targeted. No-op (static markup already final-state) when the user
 * prefers reduced motion.
 */
export function TimetableSweep({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.timetable-fill', {
          scaleX: 0,
          transformOrigin: 'left center',
          stagger: 0.05,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
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
