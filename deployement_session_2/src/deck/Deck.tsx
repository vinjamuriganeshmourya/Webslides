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
import { ContinuityContext, computeContinuity, NO_CONTINUITY } from '@/motion/continuity'

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
 * (plain arrows jump whole slides as a cut, Ctrl+← / → step the build). No overview, notes, or
 * click-to-advance.
 */
export function Deck({ slides, transition = 'slide' }: DeckProps) {
  const total = slides.length
  const rootRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(() => hashIndex(total))
  const [direction, setDirection] = useState(1)
  const [step, setStepState] = useState(0) // current fragment within the slide
  const [maxStep, setMaxStep] = useState(0) // total fragments in the slide
  /*
    `cut` skips the slide-to-slide transition and nothing else.

    It replaced a flag called `instant` that did two jobs at once: skip the
    transition AND mount the slide with every animation already finished. Now
    that the plain arrows cut, that second job would have switched off every
    entrance in the deck. Arriving with the build already revealed is handled
    separately, by `pendingFull` below.
  */
  const [cut, setCut] = useState(false)
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
    (i: number, dir: number, opts: { cut?: boolean } = {}) => {
      const clamped = Math.min(Math.max(i, 0), total - 1)
      setDirection(dir)
      setCut(opts.cut ?? false)
      setIndex(clamped)
      maxRef.current = 0
      setMaxStep(0)
      setStep(0)
    },
    [total, setStep],
  )

  // "Next" (Ctrl+→): reveal the next fragment, or advance to the next slide with
  // the deck's transition.
  const next = useCallback(() => {
    if (stepRef.current < maxRef.current) setStep(stepRef.current + 1)
    else if (indexRef.current < total - 1) gotoSlide(indexRef.current + 1, 1)
  }, [total, gotoSlide, setStep])

  // "Prev" (Ctrl+←): hide the last fragment, or go back a slide with the
  // transition, landing revealed.
  const prev = useCallback(() => {
    if (stepRef.current > 0) setStep(stepRef.current - 1)
    else if (indexRef.current > 0) {
      pendingFull.current = true
      gotoSlide(indexRef.current - 1, -1)
    }
  }, [gotoSlide, setStep])

  // "Prev slide" (←): one slide back as a cut, landing with the build already
  // revealed. This is the key that gets tapped while presenting.
  const prevSlide = useCallback(() => {
    if (indexRef.current > 0) {
      pendingFull.current = true
      gotoSlide(indexRef.current - 1, -1, { cut: true })
    }
  }, [gotoSlide])

  // "Next slide" (→): mirror of prevSlide — one slide forward as a cut, skipping
  // the build steps and landing revealed.
  const nextSlide = useCallback(() => {
    if (indexRef.current < total - 1) {
      pendingFull.current = true
      gotoSlide(indexRef.current + 1, 1, { cut: true })
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

  /*
    WHAT CARRIED OVER FROM THE OUTGOING SLIDE.

    Recomputed ONLY when `index` changes, and cached in a ref for the rest of the
    slide's life. That is load-bearing, not an optimisation.

    The first version derived this every render from a `prevIndexRef` updated in an
    effect. It looked right and was subtly broken: `Stepper` reports its step count
    on mount, which calls `setMaxStep`, which re-renders — and by then the effect
    had already moved the ref forward, so continuity collapsed to nothing, the
    header swapped its held parts back to animated ones, and React remounted them.
    A remounted `Reveal` starts from `hidden`, so the kicker animated in anyway,
    roughly 100ms late. The whole feature silently did nothing.

    Comparing against the cached index instead makes the pair (outgoing, incoming)
    a function of the navigation itself rather than of render timing, so it is also
    correct for hash jumps and the overview grid, not just the arrow keys.
  */
  const contRef = useRef({ index, carry: NO_CONTINUITY, held: false })
  if (contRef.current.index !== index) {
    contRef.current = { index, ...computeContinuity(slides[contRef.current.index], current) }
  }
  const { carry, held } = contRef.current

  /*
    Plain arrows jump a whole slide as a cut; Ctrl+arrows step the build and play
    the deck's transition when they cross a slide boundary.

    `held` also forces the cut. Two content slides in one concept are one idea
    being developed, so pushing the second one in from the right restages
    something the room is already looking at — and it would slide the static
    header across the screen, which is the opposite of holding it still.
  */
  const kind: SlideTransition = cut || held ? 'none' : (current?.transition ?? transition)

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
              transition={cut ? { duration: 0 } : slideTransition}
              className="absolute inset-0"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/*
                NOT `landFull`. Landing a slide fully revealed means "do not wait
                for clicks", not "do not animate": the plain arrows are now the
                normal way through the deck, so feeding that flag into
                InstantContext switched every entrance animation in the deck off.
                Fragments still arrive built, because `pendingFull` sets the step
                to the slide's maximum; what plays is each slide's own entrance.
              */}
              <InstantContext.Provider value={false}>
                <ContinuityContext.Provider value={carry}>
                  <Stepper step={step} onMax={onMax}>
                    {current?.element}
                  </Stepper>
                </ContinuityContext.Provider>
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
