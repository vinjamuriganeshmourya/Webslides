import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { PanelButton, TraceCaption } from '@/ui'
import { useInstant } from '@/motion/instant'
import { Assign, Boxes, BOX, boxX, type BoxState } from './common'
import { Confetti, Press } from './motion'

/**
 * THE SLICE MACHINE: predict, then run. PF 15 slide 11.
 *
 * The reference's five levels, copied from its own data: the expression, the
 * four options, which one is right, the boxes it lands on, and the sentence
 * that says why. `Run it` is LOCKED until an option is picked; that gate is the
 * whole activity.
 *
 * THE MACHINE IS A BOX WITH THREE STATIONS, after the pedagogy team's Robo
 * Machine (reference clip, 0:31 to 0:36: ARGUMENT slot, the machine body with
 * its gear, RETURNS slot, a caption under each, and a "Watch: …" line while it
 * runs). Here the words are the slice's own (user, 2026-10-01):
 *
 *   SLICE    the three numbers, coloured as slide 9 colours them, go IN
 *   code     the body: the string in its boxes, read by a pointer; each box
 *            the slice lands on turns blue as the pointer reaches it, the gear
 *            turns while it runs
 *   RESULT   what comes OUT: the output in green, or an empty dashed box when
 *            the slice hands back nothing
 *
 * Each station lights amber for its stage and dims when the stage has passed,
 * the arrows between them turn blue as the pass crosses them, and only then the
 * verdict: the options turn right and wrong together, the caption says why, and
 * a right pick gets the deck's one piece of confetti.
 *
 * Local state, not build steps: the machine is played, not presented, and the
 * deck's arrow keys still change slide. Leaving the slide resets it.
 *
 * Every `land` and `out` below is Python's real answer (`"a1b2c3d4"[a:b:c]`),
 * checked on CPython 3.12.3. `start` is where the slice begins looking, so
 * the pointer has somewhere to stand on the level that lands nowhere.
 */
const SRC = 'a1b2c3d4'

interface Level {
  expr: string
  start: number
  opts: [string, string, string, string]
  right: number
  land: number[]
  out: string
  why: string
}

const LEVELS: Level[] = [
  { expr: 'code[0:8:2]', start: 0, opts: ['a1b2', 'abcd', '1234', 'abc'], right: 1, land: [0, 2, 4, 6], out: 'abcd', why: 'Starts at 0 and jumps two, so it lands on 0, 2, 4, 6.' },
  { expr: 'code[1:8:2]', start: 1, opts: ['abcd', '1b2c', '1234', '123'], right: 2, land: [1, 3, 5, 7], out: '1234', why: 'Same jump, one place later, so it lands on 1, 3, 5, 7.' },
  { expr: 'code[1:6:3]', start: 1, opts: ['12c', '1c', '1b2c3', '1c4'], right: 1, land: [1, 4], out: '1c', why: 'Lands on 1, then 4. The next one would be 7, and 7 is not under 6, so it stops.' },
  { expr: 'code[2:8:3]', start: 2, opts: ['b2c', 'bc4', 'b34', 'b3'], right: 3, land: [2, 5], out: 'b3', why: 'Lands on 2, then 5. The next would be 8, and the stop is 8, so it stops.' },
  {
    expr: 'code[6:2:2]',
    start: 6,
    opts: ['d4', 'nothing at all', '4d', 'c3d'],
    right: 1,
    land: [],
    out: '',
    why: 'The start is already past the stop, so it never lands anywhere. You get an empty string, and print shows a blank line.',
  },
]

const LETTERS = ['A', 'B', 'C', 'D']

/** Where the pass is: nothing yet, the slice going in, the boxes being read, the result out, the verdict. */
type Stage = 'idle' | 'in' | 'run' | 'out' | 'done'

const HOUSE = 'cubic-bezier(0.22, 1, 0.36, 1)'

/* The three numbers wear the colours slide 9 gave them. */
const START = colors.brandDark
const STOP = '#C2185B'
const STEP = '#7C3AED'

/* A station's two looks: lit amber for its stage, quiet white otherwise. */
const quiet: CSSProperties = { background: colors.white, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }
const amber: CSSProperties = { background: '#FFF8EC', boxShadow: `0 0 0 2px ${colors.warning}` }
const green: CSSProperties = { background: '#E9F8EF', boxShadow: `0 0 0 2px ${colors.success}` }

/* ------------------------------------------------------------------ glyphs */

function Gear({ size = 18, spin = false }: { size?: number; spin?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={spin ? 'sm-spin shrink-0' : 'shrink-0'}
      aria-hidden
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  )
}

function Tri({ size = 9 }: { size?: number }) {
  return (
    <svg viewBox="0 0 10 12" width={size} height={size * 1.2} fill="currentColor" className="shrink-0" aria-hidden>
      <path d="M1 1l8 5-8 5z" />
    </svg>
  )
}

/** The arrow between two stations. Blue once the pass has crossed it. */
function Arrow({ on, tween }: { on: boolean; tween: string }) {
  return (
    <svg
      viewBox="0 0 44 16"
      width="44"
      height="16"
      fill="none"
      stroke={on ? colors.brandDark : colors.muted}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="justify-self-center"
      style={{ transition: tween, opacity: on ? 1 : 0.6 }}
      aria-hidden
    >
      <path d="M3 8h36M33 3l6 5-6 5" />
    </svg>
  )
}

/** The caption under a station: quiet until its stage, then in its stage's colour. */
function Cap({ on, tone, tween, children }: { on: boolean; tone: string; tween: string; children: ReactNode }) {
  return (
    <span
      className="flex items-center justify-center gap-1.5 text-[16px] font-semibold"
      style={{ color: on ? tone : colors.muted, opacity: on ? 1 : 0.8, transition: tween }}
    >
      {children}
    </span>
  )
}

/* The pointer's glide: ease-in-out, because it is a thing moving across the
   screen, not a thing arriving (`animate` skill, step 5), and as long as the
   travel beat below so it is still gliding when the box it reaches lights up. */
const GLIDE = 'cubic-bezier(0.77, 0, 0.175, 1)'

/**
 * The reader under the boxes. `x` is the centre of the box it points at.
 *
 * It moves on `left`, deliberately, and on the main thread: a transform
 * transition puts this one 18px shape on its own compositor layer, and under
 * the stage's CSS `zoom` a composited layer can rasterise at one scale and
 * settle at another, which showed as a shimmer at the end of every hop in
 * full view (user, 2026-10-01). One tiny absolutely positioned element
 * re-laid-out per frame costs nothing; the shimmer cost the illusion.
 */
function Pointer({ x, top, shown, instant, travel }: { x: number; top: number; shown: boolean; instant: boolean; travel: number }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 18 13"
      width="18"
      height="13"
      className="absolute block"
      style={{
        top,
        left: x - 9,
        opacity: shown ? 1 : 0,
        transition: instant ? 'none' : `left ${travel}ms ${GLIDE}, opacity 420ms ${HOUSE}`,
      }}
    >
      <path d="M9 0.5 L17.5 12.5 H0.5 Z" fill={colors.brandDark} />
    </svg>
  )
}

/* ---------------------------------------------------------------- machine */

export function SliceMachine() {
  const instant = useInstant()
  const [at, setAt] = useState(0)
  const [pick, setPick] = useState(-1)
  const [stage, setStage] = useState<Stage>('idle')
  /* `aim` is the box the pointer is heading for; `landed` is how many boxes have
     lit. They are separate because a box must light when the pointer ARRIVES,
     not when it sets off: the first cut lit each box the instant its timer
     fired, 280ms before the pointer got there, so the highlight ran ahead of
     the arrow and the arrow read as lagging (user, 2026-10-01). */
  const [aim, setAim] = useState<number | null>(null)
  const [landed, setLanded] = useState(0)
  const timers = useRef<number[]>([])
  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }
  useEffect(() => clear, [])

  const L = LEVELS[at]
  /* One beat of the pass, and how much of it the pointer spends travelling.
     Explanatory tier: the room reads each landing, and sees the lit box rest
     for the remainder of the beat before the pointer sets off again. */
  const T = instant ? 0 : 600
  const TRAVEL = instant ? 0 : 380
  /* Named properties, never `all`: a stage change repaints colour and ring, nothing else. */
  const tween = instant ? 'none' : `background-color 360ms ${HOUSE}, box-shadow 360ms ${HOUSE}, opacity 360ms ${HOUSE}, color 360ms ${HOUSE}, stroke 360ms ${HOUSE}`
  const ran = stage !== 'idle'
  const done = stage === 'done'
  const outShown = stage === 'out' || done

  const run = () => {
    if (ran || pick < 0) return
    const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))
    setStage('in')
    later(() => {
      setStage('run')
      setAim(L.start)
    }, T)
    L.land.forEach((i, n) => {
      later(() => setAim(i), T * (n + 1))
      later(() => setLanded(n + 1), T * (n + 1) + TRAVEL)
    })
    /* one beat of rest after the last landing, then the result, then the verdict */
    const outAt = T * (L.land.length + 2)
    later(() => setStage('out'), outAt)
    later(() => setStage('done'), outAt + (instant ? 0 : 420))
  }
  const next = () => {
    if (at + 1 >= LEVELS.length) return
    clear()
    setAt(at + 1)
    setPick(-1)
    setStage('idle')
    setAim(null)
    setLanded(0)
  }

  const states: Record<number, BoxState> = {}
  L.land.slice(0, landed).forEach((i) => (states[i] = 'hit'))
  /* the box that has just lit carries the halo while the machine is still reading */
  const lit = landed ? L.land[landed - 1] : undefined
  const celebrate = done && pick === L.right
  const [a, b, c] = L.expr.slice(L.expr.indexOf('[') + 1, -1).split(':')

  const status = !ran
    ? pick < 0
      ? 'Pick one first. Run stays locked until you do.'
      : 'Locked in. Now run it.'
    : done
      ? at + 1 < LEVELS.length
        ? 'Next level when you are ready.'
        : 'That is the last one.'
      : 'Watch: slice goes in → boxes are read → result comes out'

  let caption: ReactNode
  if (done)
    caption = (
      <>
        <b>{L.out ? `"${L.out}"` : 'nothing at all'}.</b> {L.why}
      </>
    )
  else if (at === 0)
    caption = (
      <>
        <b>Levels one to three are the three you just wrote down.</b> Hands up for your answer, then we run it.
      </>
    )
  else
    caption = (
      <>
        <b>Say your answer out loud before the press.</b> A guess you kept to yourself is not a prediction.
      </>
    )

  return (
    <div className="flex flex-col">
      {/* THE MACHINE BOX: slice in, the body reads the boxes, result out. */}
      <div className="relative rounded-card px-4 pb-2 pt-2.5" style={{ background: colors.surface, boxShadow: `inset 0 0 0 1px ${colors.line}` }}>
        <span className="absolute right-4 top-2.5 text-[16px] font-semibold" style={{ color: colors.muted }}>
          level {at + 1} of {LEVELS.length}
        </span>
        <div className="grid items-center gap-y-1" style={{ gridTemplateColumns: '156px 44px 1fr 44px 156px' }}>
          {/* IN: the slice */}
          <div className="flex flex-col items-center gap-1">
            <div
              className="flex h-[58px] w-[136px] items-center justify-center gap-1 rounded-xl font-mono text-[24px] font-bold"
              style={{ ...(stage === 'in' ? amber : quiet), opacity: stage === 'idle' || stage === 'in' ? 1 : 0.7, transition: tween }}
            >
              <span style={{ color: colors.ink }}>[</span>
              <span style={{ color: START }}>{a}</span>
              <span style={{ color: colors.muted }}>:</span>
              <span style={{ color: STOP }}>{b}</span>
              <span style={{ color: colors.muted }}>:</span>
              <span style={{ color: STEP }}>{c}</span>
              <span style={{ color: colors.ink }}>]</span>
            </div>
            <span className="text-[16px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>slice</span>
          </div>
          <Arrow on={ran && stage !== 'in'} tween={tween} />

          {/* RUN: the body. The string in its boxes, the pointer reading them, the gear turning. */}
          <div className="flex justify-center">
            <div className="relative rounded-2xl px-5 pb-3 pt-2" style={{ ...(stage === 'run' ? amber : quiet), transition: tween }}>
              <div className="flex items-center gap-2" style={{ color: stage === 'run' ? colors.warning : colors.muted, transition: tween }}>
                <Gear spin={stage === 'run' && !instant} />
                <Assign name="code" value={SRC} size={19} />
              </div>
              <div className="relative mt-2">
                <Boxes chars={[...SRC]} size="sm" states={states} focus={stage === 'run' ? lit : undefined} />
                {/* the pointer, the same one slide 10 draws under the box the slice is
                    looking at. An SVG, not a CSS border triangle: border triangles
                    have aliased edges, and in full view the stage scale magnifies
                    them. It moves on transform alone, on its own layer. */}
                <Pointer x={boxX(aim ?? L.start, 'sm')} top={BOX.sm.h + 22} shown={aim !== null} instant={instant} travel={TRAVEL} />
              </div>
            </div>
          </div>
          <Arrow on={outShown} tween={tween} />

          {/* OUT: the result. A question mark until the pass hands it over. */}
          <div className="flex flex-col items-center gap-1">
            <div
              className="flex h-[58px] min-w-[136px] items-center justify-center rounded-xl px-4 font-mono text-[24px] font-bold"
              style={{ ...(outShown ? green : quiet), color: '#137A3A', transition: tween }}
            >
              {!outShown ? (
                <span style={{ color: colors.muted }}>?</span>
              ) : L.out ? (
                L.out
              ) : (
                <span className="block h-[28px] w-[60px] rounded-lg" style={{ border: `2px dashed ${colors.line}` }} />
              )}
            </div>
            <span className="text-[16px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>result</span>
          </div>

          {/* the station captions, one per column */}
          <Cap on={stage === 'in'} tone={colors.warning} tween={tween}>
            <Tri /> in
          </Cap>
          <span />
          <Cap on={stage === 'run'} tone={colors.warning} tween={tween}>
            <Gear size={14} spin={stage === 'run' && !instant} /> run
          </Cap>
          <span />
          <Cap on={outShown} tone={colors.success} tween={tween}>
            out <Tri />
          </Cap>
        </div>
      </div>

      <p className="mt-2 text-[22px]" style={{ color: colors.body }}>
        What does <b className="font-mono" style={{ color: colors.ink }}>{L.expr}</b> give you?
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {L.opts.map((o, k) => {
          const isRight = done && k === L.right
          const isWrong = done && k !== L.right
          const picked = k === pick
          return (
            <button
              key={k}
              type="button"
              disabled={ran}
              aria-pressed={picked}
              onKeyDown={(e) => e.key !== 'Enter' && e.key !== ' ' && e.currentTarget.blur()}
              onClick={() => !ran && setPick(k)}
              className="sm-tap relative flex h-[44px] items-center gap-3 rounded-xl bg-white px-4 text-left"
              style={{
                boxShadow: `inset 0 0 0 ${picked || isRight ? 3 : 2}px ${
                  isRight ? colors.success : isWrong && picked ? colors.danger : picked ? colors.brand : colors.line
                }`,
                background: isRight ? '#E9F8EF' : isWrong && picked ? '#FDECEC' : picked ? colors.surface2 : colors.white,
                opacity: isWrong && !picked ? 0.55 : 1,
                transition: instant
                  ? 'none'
                  : `box-shadow 360ms ${HOUSE}, background-color 360ms ${HOUSE}, opacity 360ms ${HOUSE}, transform 160ms ${HOUSE}`,
              }}
            >
              <span
                className="grid h-7 w-7 place-items-center rounded-md font-mono text-[16px] font-bold"
                style={{
                  background: picked ? colors.brand : colors.surface2,
                  color: picked ? colors.white : colors.body,
                  transform: picked ? 'scale(1.1)' : 'none',
                  transition: instant ? 'none' : `background-color 240ms ${HOUSE}, color 240ms ${HOUSE}, transform 240ms ${HOUSE}`,
                }}
              >
                {LETTERS[k]}
              </span>
              <span className="font-mono text-[21px] font-semibold" style={{ color: colors.ink }}>{o}</span>
              {celebrate && isRight && <Confetti seed={at + 1} />}
            </button>
          )
        })}
      </div>
      <div className="mt-2.5 flex items-center gap-2">
        <Press>
          <PanelButton onClick={run} disabled={ran || pick < 0}>Run it</PanelButton>
        </Press>
        <Press>
          <PanelButton ghost onClick={next} disabled={!done || at + 1 >= LEVELS.length}>Next level</PanelButton>
        </Press>
        <span className="ml-auto text-[17px]" style={{ color: colors.muted }}>{status}</span>
      </div>
      <div className="mt-2">
        <TraceCaption>{caption}</TraceCaption>
      </div>
    </div>
  )
}
