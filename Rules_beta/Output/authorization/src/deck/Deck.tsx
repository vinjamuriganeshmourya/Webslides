import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { DeckProps } from './types'
import { DeckContext } from './DeckContext'
import { SlideStage } from './SlideStage'
import { ProgressBar } from './ProgressBar'
import { DeckControls } from './DeckControls'
import {
  initialArrowMode,
  rememberArrowMode,
  useKeyboardNav,
  type ArrowMode,
} from './useKeyboardNav'
import { SlidePicker } from './SlidePicker'
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
 * letterbox chrome). Kept on top: the progress bar, the slide counter, the ◀ ▶
 * arrows, a jump-to-slide button, the arrow-key mode pill, and a fullscreen
 * toggle.
 *
 * NAVIGATION
 *
 *   →  /  ←        whole slide as a cut, or one build step: whichever the mode
 *                  pill says. `S` swaps the pair, and the choice is remembered
 *                  per browser.
 *   Ctrl+→ / ←     the other one of the pair
 *   PageDown / Up  the same as the plain arrows, because that is what a clicker
 *                  sends and a clicker cannot send Ctrl
 *   G              jump to a slide, by name or number
 *
 * Speaker notes and click-to-advance are still intentionally omitted.
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

  /*
    WHAT THE PLAIN ARROWS DO, AND WHERE THE PICKER LIVES.

    The mode is initialised from the URL, then the harness flag, then this
    browser's last choice, then the default: see `initialArrowMode`. It is
    remembered on change rather than in an effect, so a render can never write it.
  */
  const [arrowMode, setArrowMode] = useState<ArrowMode>(initialArrowMode)
  const [pickerOpen, setPickerOpen] = useState(false)

  const toggleArrowMode = useCallback(() => {
    setArrowMode((m) => {
      const nextMode: ArrowMode = m === 'slides' ? 'steps' : 'slides'
      rememberArrowMode(nextMode)
      return nextMode
    })
  }, [])

  const openPicker = useCallback(() => setPickerOpen(true), [])
  const closePicker = useCallback(() => setPickerOpen(false), [])

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

  /*
    THE PICKER OWNS THE ARROW KEYS WHILE IT IS OPEN.

    Both this and the picker listen on `window`, so without the flag an arrow press
    would move the picker's cursor AND change the slide behind it, and the deck
    would be somewhere else by the time the presenter pressed Enter.
  */
  useKeyboardNav({
    next,
    prev,
    prevSlide,
    nextSlide,
    arrowMode,
    toggleArrowMode,
    openPicker,
    enabled: !pickerOpen,
  })

  /*
    A JUMP FROM THE PICKER LANDS FULLY REVEALED, like the plain-arrow cut does.

    Anything else would be a trap: the presenter jumps to slide 12 to answer a
    question and gets its first build step, so the slide they wanted to show is
    two thirds absent and they have to guess how many presses it takes to restore
    it in front of the room.
  */
  const pickSlide = useCallback(
    (i: number) => {
      setPickerOpen(false)
      if (i === indexRef.current) return
      pendingFull.current = true
      gotoSlide(i, i >= indexRef.current ? 1 : -1, { cut: true })
    },
    [gotoSlide],
  )

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

        <SlideStage flip={kind === 'flip'}>
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
              /*
                `preserve-3d` ONLY FOR THE FLIP, AND THAT IS HALF THE BLUR FIX.

                It used to be unconditional. Together with the `perspective` on
                the stage wrapper it put every slide of every deck into a 3D
                rendering context, and a 3D context is a promise to the
                compositor that the subtree will be transformed in space: the
                subtree gets flattened into a texture up front, and a texture
                cannot be re-rasterised when an ancestor scales it. That is the
                soft text, paid for on all 44 slides to support one transition no
                shipping deck uses. `rotateY` is the only variant that needs it;
                see `slideVariants`.
              */
              style={kind === 'flip' ? { transformStyle: 'preserve-3d' } : undefined}
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
          arrowMode={arrowMode}
          toggleArrowMode={toggleArrowMode}
          openPicker={openPicker}
        />

        {/* NEVER IN THE DOM UNLESS OPEN. It covers the whole stage, so parked at
            `opacity: 0` it would be reported by `qa.mjs` as content that scrolls
            and by `video-safe.mjs` as covering the instructor video, on every
            slide of every deck. */}
        <AnimatePresence>
          {pickerOpen && (
            <SlidePicker
              slides={slides}
              index={index}
              onPick={pickSlide}
              onClose={closePicker}
            />
          )}
        </AnimatePresence>
      </div>
    </DeckContext.Provider>
  )
}
