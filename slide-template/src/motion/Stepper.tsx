import {
  createContext,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { motion } from 'framer-motion'
import { revealVariants, type RevealDirection } from './presets'
import { useInstant } from './instant'

/**
 * Click-to-reveal fragment system ("build" animations).
 *
 * A slide's header/base content shows immediately (use <Reveal>), while body
 * content wrapped in <Step> is revealed one click at a time. The <Deck>
 * advances the step on ArrowRight / click; when all steps are shown, the next
 * click moves to the next slide.
 *
 * Each <Step> claims a monotonically-increasing order on first render (in
 * source/visual order). It becomes visible once the current step reaches it.
 */

interface StepContextValue {
  step: number
  claim: (id: string) => number
}

const StepContext = createContext<StepContextValue | null>(null)

/** When ?all is in the URL, every Step is shown at once (used for thumbnails/QA). */
const REVEAL_ALL =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('all')

export function Stepper({
  step,
  onMax,
  children,
}: {
  step: number
  onMax: (max: number) => void
  children: ReactNode
}) {
  const reg = useRef<{ map: Map<string, number>; next: number }>({
    map: new Map(),
    next: 0,
  })

  const claim = useCallback((id: string) => {
    const r = reg.current
    const existing = r.map.get(id)
    if (existing !== undefined) return existing
    const n = r.next + 1 // steps are 1-based; step 0 shows only the base content
    r.map.set(id, n)
    r.next = n
    return n
  }, [])

  // After children have rendered (and claimed), report the total step count.
  useLayoutEffect(() => {
    onMax(reg.current.next)
  })

  const value = useMemo(() => ({ step, claim }), [step, claim])
  return <StepContext.Provider value={value}>{children}</StepContext.Provider>
}

/**
 * Claims a single build step and returns whether it has been revealed yet.
 *
 * Unlike <Step>, this does NOT mount/unmount or hide its subject — it lets a
 * slide restyle content that is already on screen once a click lands. The quiz
 * uses it to keep every option visible from the start and only highlight the
 * correct one after a click, so the answer is never shown before the class has
 * seen the full set of choices.
 *
 * Outside a <Stepper> (overview thumbnails) or with ?all, it returns true.
 */
export function useReveal(): boolean {
  const ctx = useContext(StepContext)
  const id = useId()
  const order = ctx ? ctx.claim(id) : 0
  return REVEAL_ALL || !ctx || ctx.step >= order
}

type Tag = 'div' | 'li' | 'span' | 'section' | 'p'

/**
 * A single click-revealed fragment. Outside a <Stepper> (e.g. overview
 * thumbnails) it renders fully visible.
 */
export function Step({
  children,
  dir = 'up',
  className,
  style,
  as = 'div',
}: {
  children: ReactNode
  dir?: RevealDirection
  className?: string
  style?: CSSProperties
  as?: Tag
}) {
  const ctx = useContext(StepContext)
  const instant = useInstant()
  const id = useId()
  const order = ctx ? ctx.claim(id) : 0
  const shown = REVEAL_ALL || !ctx || ctx.step >= order
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      style={style}
      // duration 0 when instant → the fragment snaps in with no build animation
      variants={revealVariants(dir, instant ? 0 : undefined)}
      initial={false}
      animate={shown ? 'show' : 'hidden'}
    >
      {children}
    </MotionTag>
  )
}
