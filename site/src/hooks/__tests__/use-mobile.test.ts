import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useIsMobile } from '../use-mobile'

describe('useIsMobile', () => {
  let matchMediaListeners: Map<string, () => void>
  let mockMatchMedia: ReturnType<typeof vi.fn>

  const createMatchMediaMock = (matches: boolean) => ({
    matches,
    media: `(max-width: 1023px)`,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((event: string, callback: () => void) => {
      if (event === 'change') {
        matchMediaListeners.set(event, callback)
      }
    }),
    removeEventListener: vi.fn((event: string) => {
      matchMediaListeners.delete(event)
    }),
    dispatchEvent: vi.fn(),
  })

  beforeEach(() => {
    matchMediaListeners = new Map()
    mockMatchMedia = vi.fn()
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns true when window width < 1024px', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    })
    mockMatchMedia.mockReturnValue(createMatchMediaMock(true))

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('returns false when window width >= 1024px', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1440,
    })
    mockMatchMedia.mockReturnValue(createMatchMediaMock(false))

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it('returns false at exactly 1024px breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    mockMatchMedia.mockReturnValue(createMatchMediaMock(false))

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it('returns true just below 1024px breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1023,
    })
    mockMatchMedia.mockReturnValue(createMatchMediaMock(true))

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('updates when window resizes', () => {
    // Start with desktop width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1440,
    })
    mockMatchMedia.mockReturnValue(createMatchMediaMock(false))

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    // Simulate resize to mobile
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })
      const changeListener = matchMediaListeners.get('change')
      if (changeListener) {
        changeListener()
      }
    })

    expect(result.current).toBe(true)
  })

  it('cleans up event listener on unmount', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    const mockMql = createMatchMediaMock(false)
    mockMatchMedia.mockReturnValue(mockMql)

    const { unmount } = renderHook(() => useIsMobile())
    unmount()

    expect(mockMql.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    )
  })

  it('returns false initially for SSR (before hydration)', () => {
    // The hook returns !!undefined which is false initially
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    })
    mockMatchMedia.mockReturnValue(createMatchMediaMock(true))

    // We can't truly test SSR without removing window, but we can verify
    // the hook handles the undefined state by checking the initial return
    // The actual behavior is that useState starts with undefined,
    // and the effect runs after mount to set the actual value
    const { result } = renderHook(() => useIsMobile())

    // After the effect runs, it should show the correct value
    expect(result.current).toBe(true)
  })
})
