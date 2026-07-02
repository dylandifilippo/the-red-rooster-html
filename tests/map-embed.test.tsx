import { act, render } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { MapEmbed } from '../components/ui/MapEmbed'

type IOCallback = (entries: Array<{ isIntersecting: boolean }>) => void

let capturedCallback: IOCallback | null = null
const observe = vi.fn()
const disconnect = vi.fn()

class MockIntersectionObserver {
  constructor(callback: IOCallback) {
    capturedCallback = callback
  }
  observe = observe
  disconnect = disconnect
  unobserve = vi.fn()
}

beforeEach(() => {
  capturedCallback = null
  observe.mockClear()
  disconnect.mockClear()
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function setup() {
  return render(
    <NextIntlClientProvider locale="fr" messages={fr}>
      <MapEmbed />
    </NextIntlClientProvider>,
  )
}

describe('MapEmbed auto-load', () => {
  it('renders no iframe until the wrapper scrolls into proximity', () => {
    const { container } = setup()
    expect(container.querySelector('iframe')).toBeNull()
    expect(observe).toHaveBeenCalledTimes(1)

    act(() => {
      capturedCallback?.([{ isIntersecting: true }])
    })

    const iframe = container.querySelector('iframe')
    expect(iframe).toHaveAttribute('title', expect.stringContaining('Google Maps'))
    expect(disconnect).toHaveBeenCalled()
  })

  it('ignores non-intersecting entries', () => {
    const { container } = setup()
    act(() => {
      capturedCallback?.([{ isIntersecting: false }])
    })
    expect(container.querySelector('iframe')).toBeNull()
  })
})
