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
  /** Highest claimed step on this slide. 0 until the children have registered. */
  max: number
  /** Move the slide's build to an exact step. Clamped by the caller. */
  setStep?: (n: number) => void
  /** Replay this slide from the top of its build, as the R key does. */
  replay?: () => void
}

const StepContext = createContext<StepContextValue | null>(null)

/** When ?all is in the URL, every Step is shown at once (used for thumbnails/QA). */
const REVEAL_ALL =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('all')

export function Stepper({
  step,
  onMax,
  max = 0,
  setStep,
  replay,
  children,
}: {
  step: number
  onMax: (max: number) => void
  /**
   * The deck's current step total, fed back in so a figure can draw its own
   * controls (`useStepControls`). Optional, because the single-file export
   * renderer mounts a Stepper with no player behind it.
   */
  max?: number
  setStep?: (n: number) => void
  replay?: () => void
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

  const value = useMemo(
    () => ({ step, claim, max, setStep, replay }),
    [step, claim, max, setStep, replay],
  )
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

/**
 * Claim `count` build steps at once and get back which of them have been reached.
 *
 * WHY `useReveal()` IN A LOOP DOES NOT WORK
 *
 * `useReveal` calls `useId()` and claims that id. Called `count` times from one
 * component the ids do not come out distinct in the way the registry needs, so
 * every beat claimed the SAME order: the whole figure appeared on the first
 * click and the deck reported one step, which made the arrow key advance the
 * slide instead of the build.
 *
 * This calls exactly two hooks whatever `count` is, and derives `count` stable
 * ids from one base, so the registry gets `count` distinct claims in order.
 *
 * Used by the flow-chart lab, where a figure's parts are laid out by explicit
 * beat index rather than in render order, so it cannot rely on `<Step>` claiming
 * as it renders.
 */
export function useClaimedSteps(count: number): boolean[] {
  const ctx = useContext(StepContext)
  const base = useId()
  if (!ctx) return Array.from({ length: count }, () => true)
  const orders = Array.from({ length: count }, (_, i) => ctx.claim(`${base}-${i}`))
  return orders.map((order) => REVEAL_ALL || ctx.step >= order)
}

/**
 * The controls a stepped figure draws on the slide: Back, Next and Replay.
 *
 * WHY A FIGURE DRAWS ITS OWN CONTROLS
 *
 * A walk figure is making a claim about TIME. A frame that merely changes when
 * a key is pressed does not say there is a sequence to walk, so three buttons
 * say it before anything moves: there is a flow, it has a direction, and it can
 * be gone back through. `pedagogy-to-components` §5.6 is the rule.
 *
 * ONE COUNTER, NOT TWO
 *
 * These drive the DECK's step, the same one `Ctrl+arrow` and `R` drive. A
 * figure holding its own index would drift from the keyboard, and the drift
 * shows up as the buttons and the clicker disagreeing in front of a class.
 *
 * `back` and `next` are clamped to this slide's own build and never cross into
 * the neighbouring slide: moving between slides is the player's job, not a
 * figure's. At the ends the corresponding button reports itself unavailable
 * rather than doing something surprising.
 *
 * Outside a <Stepper>, or under `?all`, every action is a no-op and `available`
 * is false, so the overview thumbnails and the QA harnesses never render a live
 * control.
 */
export function useStepControls(): {
  step: number
  max: number
  canBack: boolean
  canNext: boolean
  available: boolean
  back: () => void
  next: () => void
  replay: () => void
} {
  const ctx = useContext(StepContext)
  const noop = useCallback(() => {}, [])
  const set = ctx?.setStep
  const step = ctx?.step ?? 0
  const max = ctx?.max ?? 0

  const back = useCallback(() => set?.(Math.max(0, step - 1)), [set, step])
  const next = useCallback(() => set?.(Math.min(max, step + 1)), [set, step, max])
  const replay = ctx?.replay ?? noop

  const available = !REVEAL_ALL && !!ctx && !!set
  return {
    step,
    max,
    canBack: available && step > 0,
    canNext: available && step < max,
    available,
    back: available ? back : noop,
    next: available ? next : noop,
    replay: available ? replay : noop,
  }
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
