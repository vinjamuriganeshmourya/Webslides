import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { SLIDE_HEIGHT, SLIDE_WIDTH } from '@/design/tokens'

export interface DeckSlide {
  /** Stable name, carried in the URL hash so a slide can be linked to. */
  id: string
  element: ReactNode
}

export interface DeckMeta {
  title: string
}

/**
 * THE PLAYER. One slide at a time, a cut between them, nothing animated.
 *
 * This deck is static by design, so the player does not carry the kit's
 * step-reveal, transition and annotation machinery. What it keeps from the kit
 * is the contract a presenter and the harnesses rely on:
 *
 *   - the slide is a fixed 1920x1080 stage, zoomed to fit the viewport and
 *     letterboxed, never stretched;
 *   - the URL hash is `#/<n>-<id>` (1-based), read on load and on `hashchange`,
 *     so `?…#/3` opens slide 3 and the harnesses can drive the deck by URL;
 *   - → / PageDown advance, ← / PageUp go back, Home / End jump to the ends,
 *     F toggles fullscreen; PageUp/Down because that is what a clicker sends.
 *
 * A small control bar sits bottom-left (the slides keep their mark bottom-
 * right) and fades out while the pointer is still.
 */
export function Deck({ slides, meta }: { slides: DeckSlide[]; meta: DeckMeta }) {
  const total = slides.length
  const [index, setIndex] = useState(() => hashIndex(total))
  const clamp = useCallback((n: number) => Math.min(Math.max(n, 0), total - 1), [total])
  const go = useCallback((n: number) => setIndex(clamp(n)), [clamp])

  /* hash <-> index, both directions */
  useEffect(() => {
    const slide = slides[index]
    window.history.replaceState(null, '', `#/${index + 1}${slide ? `-${slide.id}` : ''}`)
  }, [index, slides])
  useEffect(() => {
    const onHash = () => setIndex(hashIndex(total))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [total])

  useEffect(() => {
    document.title = meta.title
  }, [meta.title])

  /* keys */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          e.preventDefault()
          setIndex((i) => clamp(i + 1))
          break
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault()
          setIndex((i) => clamp(i - 1))
          break
        case 'Home':
          e.preventDefault()
          setIndex(0)
          break
        case 'End':
          e.preventDefault()
          setIndex(total - 1)
          break
        case 'f':
        case 'F':
          toggleFullscreen()
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [clamp, total])

  /* the control bar hides while the pointer is still */
  const [idle, setIdle] = useState(false)
  const idleTimer = useRef<number | undefined>(undefined)
  useEffect(() => {
    const wake = () => {
      setIdle(false)
      window.clearTimeout(idleTimer.current)
      idleTimer.current = window.setTimeout(() => setIdle(true), 2500)
    }
    wake()
    window.addEventListener('mousemove', wake)
    return () => {
      window.removeEventListener('mousemove', wake)
      window.clearTimeout(idleTimer.current)
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Stage>{slides[index]?.element}</Stage>

      <div
        className="deck-controls"
        data-idle={idle}
        style={{
          position: 'absolute',
          left: 16,
          bottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '4px 6px',
          borderRadius: 10,
          background: 'rgba(6,12,28,0.72)',
          color: '#fff',
          fontSize: 14,
          fontVariantNumeric: 'tabular-nums',
          userSelect: 'none',
        }}
      >
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous slide">
          ◀
        </button>
        <span style={{ minWidth: 56, textAlign: 'center' }}>
          {index + 1} / {total}
        </span>
        <button type="button" onClick={() => go(index + 1)} disabled={index === total - 1} aria-label="Next slide">
          ▶
        </button>
        <button type="button" onClick={toggleFullscreen} aria-label="Toggle fullscreen" title="Fullscreen (F)">
          ⛶
        </button>
      </div>
    </div>
  )
}

function hashIndex(total: number): number {
  if (typeof window === 'undefined') return 0
  const m = window.location.hash.match(/#\/(\d+)/)
  if (!m) return 0
  return Math.min(Math.max(Number(m[1]) - 1, 0), total - 1)
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch(() => {})
  } else {
    document.exitFullscreen?.().catch(() => {})
  }
}

/**
 * The 1920x1080 stage, zoomed to fit its parent and centred.
 *
 * `zoom` re-lays the slide out at the projected size rather than scaling a
 * texture, which keeps text sharp. Browsers that do not support it (checked
 * with `CSS.supports`, not a version sniff) get a transform instead, which is
 * soft but never wrong.
 */
function Stage({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [useZoom] = useState(() => {
    try {
      return Boolean(window.CSS?.supports?.('zoom', '2'))
    } catch {
      return false
    }
  })

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const compute = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width && height) setScale(Math.min(width / SLIDE_WIDTH, height / SLIDE_HEIGHT))
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', flexShrink: 0, width: SLIDE_WIDTH * scale, height: SLIDE_HEIGHT * scale }}>
        <div
          className="slide-stage"
          style={
            useZoom
              ? { position: 'relative', width: SLIDE_WIDTH, height: SLIDE_HEIGHT, zoom: scale }
              : {
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: SLIDE_WIDTH,
                  height: SLIDE_HEIGHT,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                }
          }
        >
          {children}
        </div>
      </div>
    </div>
  )
}
