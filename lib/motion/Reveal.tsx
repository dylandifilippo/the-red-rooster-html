'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Props = {
  children: React.ReactNode
  className?: string
  delay?: number
}

/**
 * Fades + translates its children into view the first time they scroll
 * into the viewport. No-op (children render fully visible, no animation)
 * when the user prefers reduced motion.
 */
export function Reveal({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(ref.current, {
          autoAlpha: 0,
          y: 36,
          duration: 0.9,
          delay,
          ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true },
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
