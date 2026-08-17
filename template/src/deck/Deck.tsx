import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { DeckProps } from './types'
import { DeckContext } from './DeckContext'
import { SlideStage } from './SlideStage'
import { ProgressBar } from './ProgressBar'
import { DeckControls } from './DeckControls'
import { useKeyboardNav } from './useKeyboardNav'
import { useFullscreen } from './useFullscreen'
import { slideVariants, slideTransition, type SlideTransition } from '@/motion/presets'
import { Stepper } from '@/motion/Stepper'
import { InstantContext } from '@/motion/instant'

function hashIndex(total: number): number {
  if (typeof window === 'undefined') return 0
  const m = window.location.hash.match(/#\/(\d+)/)
  if (!m) return 0
  const n = Number(m[1]) - 1
  return Math.min(Math.max(n, 0), total - 1)
}

/**
 * A full-page deck: the slide fills the viewport edge-to-edge (no padding or
 * letterbox chrome). Kept on top: the progress bar, the slide/animation-step
 * counter, the ◀ ▶ arrows, and a fullscreen toggle. Navigation is ← / → only
 * (Ctrl+← / → jump a whole slide instantly). No overview, notes, or
 * click-to-advance.
 */
export function Deck({ slides, transition = 'slide' }: DeckProps) {
  const total = slides.length
  const rootRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(() => hashIndex(total))
  const [direction, setDirection] = useState(1)
  const [step, setStepState] = useState(0) // current fragment within the slide
  const [maxStep, setMaxStep] = useState(0) // total fragments in the slide
  const [instant, setInstant] = useState(false) // skip the slide transition for this move
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(rootRef)

  // Refs mirror state so nav callbacks read the latest values without stale closures.
  const stepRef = useRef(0)
  const maxRef = useRef(0)
  const indexRef = useRef(index)
  const pendingFull = useRef(false) // when entering a slide fully-built, reveal all
  indexRef.current = index

  const setStep = useCallback((n: number) => {
    stepRef.current = n
    setStepState(n)
  }, [])

  // Reported by <Stepper> once the active slide has registered its fragments.
  const onMax = useCallback(
    (m: number) => {
      maxRef.current = m
      setMaxStep(m)
      if (pendingFull.current) {
        pendingFull.current = false
        setStep(m)
      }
    },
    [setStep],
  )

  const gotoSlide = useCallback(
    (i: number, dir: number, immediate = false) => {
      const clamped = Math.min(Math.max(i, 0), total - 1)
      setDirection(dir)
      setInstant(immediate)
      setIndex(clamped)
      maxRef.current = 0
      setMaxStep(0)
      setStep(0)
    },
    [total, setStep],
  )

  // "Next": reveal the next fragment, or advance to the next slide.
  const next = useCallback(() => {
    if (stepRef.current < maxRef.current) setStep(stepRef.current + 1)
    else if (indexRef.current < total - 1) gotoSlide(indexRef.current + 1, 1)
  }, [total, gotoSlide, setStep])

  // "Prev": hide the last fragment, or go back to the previous slide (revealed).
  const prev = useCallback(() => {
    if (stepRef.current > 0) setStep(stepRef.current - 1)
    else if (indexRef.current > 0) {
      pendingFull.current = true
      gotoSlide(indexRef.current - 1, -1)
    }
  }, [gotoSlide, setStep])

  // "Prev slide" (Ctrl+←): jump straight to the previous slide, skipping any
  // remaining fragment un-reveals AND the transition animation. Lands fully revealed.
  const prevSlide = useCallback(() => {
    if (indexRef.current > 0) {
      pendingFull.current = true
      gotoSlide(indexRef.current - 1, -1, true)
    }
  }, [gotoSlide])

  // "Next slide" (Ctrl+→): mirror of prevSlide — jump straight to the next
  // slide, skipping the transition AND all of its build steps (lands revealed).
  const nextSlide = useCallback(() => {
    if (indexRef.current < total - 1) {
      pendingFull.current = true
      gotoSlide(indexRef.current + 1, 1, true)
    }
  }, [total, gotoSlide])

  const goTo = useCallback(
    (i: number) => gotoSlide(i, i >= indexRef.current ? 1 : -1),
    [gotoSlide],
  )

  // React to browser back/forward (hash changes).
  useEffect(() => {
    const onHash = () => {
      const target = hashIndex(total)
      gotoSlide(target, target >= indexRef.current ? 1 : -1)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [total, gotoSlide])

  // Reflect current slide in the URL hash.
  useEffect(() => {
    const id = slides[index]?.id ?? String(index + 1)
    window.history.replaceState(null, '', `#/${index + 1}${id ? `-${id}` : ''}`)
  }, [index, slides])

  useKeyboardNav({ next, prev, prevSlide, nextSlide })

  const ctx = useMemo(
    () => ({
      index,
      total,
      direction,
      goTo,
      next,
      prev,
      isFirst: index === 0,
      isLast: index === total - 1,
    }),
    [index, total, direction, goTo, next, prev],
  )

  const current = slides[index]
  // Ctrl+←/→ set `instant`, forcing a cut (no enter/exit animation) for that move.
  const kind: SlideTransition = instant ? 'none' : (current?.transition ?? transition)

  return (
    <DeckContext.Provider value={ctx}>
      <div ref={rootRef} className="relative h-full w-full overflow-hidden bg-[#060c1c]">
        <ProgressBar index={index} total={total} onDot={goTo} />

        <SlideStage>
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={current?.id ?? index}
              custom={direction}
              variants={slideVariants(kind)}
              initial="enter"
              animate="center"
              exit="exit"
              transition={instant ? { duration: 0 } : slideTransition}
              className="absolute inset-0"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <InstantContext.Provider value={instant}>
                <Stepper step={step} onMax={onMax}>
                  {current?.element}
                </Stepper>
              </InstantContext.Provider>
            </motion.div>
          </AnimatePresence>
        </SlideStage>

        <DeckControls
          index={index}
          total={total}
          step={step}
          maxStep={maxStep}
          isFirst={index === 0}
          isLast={index === total - 1}
          isFullscreen={isFullscreen}
          next={next}
          prev={prev}
          toggleFullscreen={toggleFullscreen}
        />
      </div>
    </DeckContext.Provider>
  )
}
