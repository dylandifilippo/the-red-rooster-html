import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom doesn't implement matchMedia. GSAP's matchMedia()/ScrollTrigger
// (used by lib/motion/Reveal.tsx and lib/motion/Parallax.tsx) call it on
// import, so every test needs a minimal stub.
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList
}

afterEach(() => {
  cleanup()
})
