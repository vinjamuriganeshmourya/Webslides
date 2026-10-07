import { useEffect, useRef, useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { BeatCaption } from './common'
import { StepControls } from './controls'

/**
 * EVERY BALL HAS A NUMBER. PF 16 slide 4, the hook, twenty beats.
 *
 * The room counts balls the way the live-score app does, over by over, before
 * "nested" has a name. Reason for the picture: to create a need. The outcome,
 * in the room's words: "six balls, twenty times, is a loop inside a loop".
 *
 * A world picture, so drawn as the real object (course rule R5): the score
 * card with its flag, score, over line, `LIVE` pill, the six chips of this
 * over and the overs bar, over a cricket ground with the bowler and the batter
 * named on it. Beside it the plan, in indented plain English, with the outer
 * frame for the overs and the inner frame for the balls, and four counters.
 * On the last beat the cricket is taken out of the plan and the shape is left.
 *
 * THE BOWLING, AS THE REFERENCE DRAWS IT (review, 2026-10-01: "the bowling
 * animation is missing"). On every ball beat a red ball leaves the bowler's
 * hand, grows as it comes down the pitch, reaches the batter and goes where
 * the shot sends it: a dot ball stops at the crease, a single and a two go
 * into the field, a four runs to the rope, a six climbs over it. The result
 * pops up beside the batter ("Dot ball", "FOUR!") at the moment of contact.
 * The reference's own timing: 1700ms for the flight, the bubble at 62%.
 *
 * THE PLAN SHOWS THE FLOW. Two dashed flow lines with arrowheads, orange from
 * the outer loop's head down to "end of over" and blue from the inner head
 * down to "bowl one ball", and a red ball marker sitting on whichever line is
 * running now. "Back up the blue arrow" draws the blue line again from the
 * top; "back up the orange arrow" does the same to the orange one.
 *
 * Every number is the reference's own: over 1 is 1, 0, 4, 1, 0, 2 (8 runs),
 * over 2 is 0, 1, 6, 1, 1, 0 (9 runs), the innings closes at 176-5.
 */

/* The app's own palette, like session 15's CHAT: a drawn product screen. */
const FIELD = { grass: '#2F8F4E', grassDark: '#27803F', pitch: '#D9C38A', pitchEdge: '#B89C5E', fielder: '#F6A623', rope: '#F3F6FB' } as const
const SIX = '#7C3AED'
const BALL = 'radial-gradient(circle at 35% 35%, #FF6B5E, #C62828)'

type Run = 0 | 1 | 2 | 4 | 6
/** Which plan line is running: 1 new bowler, 2 bowl one ball, 3 end of over, 4 innings over. */
type Blk = 0 | 1 | 2 | 3 | 4

interface Beat {
  cap: string[]
  blk: Blk
  focus?: 'outer' | 'inner'
  /** draw the flow line again from its top */
  pulse?: 'blue' | 'orange'
  /** a ball is bowled on this beat, with this result */
  run?: Run
  score: string
  over: string
  slots: 1 | 2 | 20
  filled: number
  oversDone: number
  banner?: string
  striker: string
  bowler?: string
  counters: [number | string, number | string, number | string, number | string]
  shape?: boolean
}

const OVER_1: Run[] = [1, 0, 4, 1, 0, 2]
const OVER_2: Run[] = [0, 1, 6, 1, 1, 0]
const OVER_20: Run[] = [1, 4, 0, 6, 1, 2]
const SLOTS = { 1: { pre: '0.', runs: OVER_1 }, 2: { pre: '1.', runs: OVER_2 }, 20: { pre: '19.', runs: OVER_20 } } as const

/** The result beside the batter, the reference's words. */
const BUB: Record<Run, string> = { 0: 'Dot ball', 1: '1 run', 2: '2 runs', 4: 'FOUR!', 6: 'SIX!' }

const NOT_STARTED = 'Innings not started'
const O1 = 'Over 1 · Starc bowling'
const O2 = 'Over 2 · Zampa bowling'
const O20 = 'Over 20 · Starc bowling'

const BEATS: Beat[] = [
  { cap: ['India are batting', 'Every ball gets a number on the app'], blk: 0, score: '0-0', over: NOT_STARTED, slots: 1, filled: 0, oversDone: 0, striker: 'Rohit', counters: [0, 0, 0, 0] },
  { cap: ['The app counts overs: 20 of them in a T20 innings'], blk: 0, focus: 'outer', score: '0-0', over: NOT_STARTED, slots: 1, filled: 0, oversDone: 0, striker: 'Rohit', counters: [0, 0, 0, 0] },
  { cap: ['Inside every over, it counts balls: 1 to 6'], blk: 0, focus: 'inner', score: '0-0', over: NOT_STARTED, slots: 1, filled: 0, oversDone: 0, striker: 'Rohit', counters: [0, 0, 0, 0] },
  { cap: ['Over 1 starts', 'Starc comes on to bowl'], blk: 1, score: '0-0', over: O1, slots: 1, filled: 0, oversDone: 0, striker: 'Rohit', bowler: 'Starc', counters: [1, 0, 0, 0] },
  { cap: ['Ball 1: 1 run', 'The app shows it as 0.1'], blk: 2, run: 1, score: '1-0', over: O1, slots: 1, filled: 1, oversDone: 0, striker: 'Rohit', bowler: 'Starc', counters: [1, 1, 0, 0] },
  { cap: ['Back up the blue arrow', 'Ball 0.2: no run'], blk: 2, run: 0, pulse: 'blue', score: '1-0', over: O1, slots: 1, filled: 2, oversDone: 0, striker: 'Gill', bowler: 'Starc', counters: [1, 2, 0, 0] },
  { cap: ['Back up the blue arrow', 'Ball 0.3: FOUR'], blk: 2, run: 4, pulse: 'blue', score: '5-0', over: O1, slots: 1, filled: 3, oversDone: 0, striker: 'Gill', bowler: 'Starc', counters: [1, 3, 0, 0] },
  { cap: ['Back up the blue arrow', 'Ball 0.4: 1 run'], blk: 2, run: 1, pulse: 'blue', score: '6-0', over: O1, slots: 1, filled: 4, oversDone: 0, striker: 'Gill', bowler: 'Starc', counters: [1, 4, 0, 0] },
  { cap: ['Back up the blue arrow', 'Ball 0.5: no run'], blk: 2, run: 0, pulse: 'blue', score: '6-0', over: O1, slots: 1, filled: 5, oversDone: 0, striker: 'Rohit', bowler: 'Starc', counters: [1, 5, 0, 0] },
  { cap: ['Back up the blue arrow', 'Ball 0.6: 2 runs'], blk: 2, run: 2, pulse: 'blue', score: '8-0', over: O1, slots: 1, filled: 6, oversDone: 0, striker: 'Rohit', bowler: 'Starc', counters: [1, 6, 0, 0] },
  { cap: ['No balls left in this over', 'End of over 1, 8 runs'], blk: 3, score: '8-0', over: O1, slots: 1, filled: 6, oversDone: 1, banner: 'End of over 1 · 8 runs', striker: 'Rohit', bowler: 'Starc', counters: [1, 6, 1, 0] },
  { cap: ['Your guess: after 0.6, what number does the app show next?'], blk: 3, score: '8-0', over: O1, slots: 1, filled: 6, oversDone: 1, banner: 'After 0.6, what comes next?', striker: 'Rohit', bowler: 'Starc', counters: [1, 6, 1, 0] },
  { cap: ['Back up the orange arrow', 'Over 2 starts: Zampa comes on', 'The balls start again from 1'], blk: 1, pulse: 'orange', score: '8-0', over: O2, slots: 2, filled: 0, oversDone: 1, striker: 'Gill', bowler: 'Zampa', counters: [2, 6, 1, 0] },
  { cap: ['Balls 1.1 to 1.6', 'Six balls, one more time'], blk: 2, score: '17-0', over: O2, slots: 2, filled: 6, oversDone: 1, striker: 'Rohit', bowler: 'Zampa', counters: [2, 12, 1, 0] },
  { cap: ['End of over 2, 9 runs'], blk: 3, score: '17-0', over: O2, slots: 2, filled: 6, oversDone: 2, banner: 'End of over 2 · 9 runs', striker: 'Rohit', bowler: 'Zampa', counters: [2, 12, 2, 0] },
  { cap: ['Overs 3 to 20 go the same way: new bowler, six balls, over ends'], blk: 3, score: '176-5', over: O20, slots: 20, filled: 6, oversDone: 20, striker: 'Rohit', bowler: 'Starc', counters: [20, '?', 20, 0] },
  { cap: ['No overs left', 'Innings over'], blk: 4, score: '176-5', over: O20, slots: 20, filled: 6, oversDone: 20, banner: 'Innings over · IND 176-5', striker: 'Rohit', bowler: 'Starc', counters: [20, '?', 20, 1] },
  { cap: ['Your guess: how many balls were bowled in the whole innings?'], blk: 0, score: '176-5', over: O20, slots: 20, filled: 6, oversDone: 20, banner: 'Innings over · IND 176-5', striker: 'Rohit', bowler: 'Starc', counters: [20, '?', 20, 1] },
  { cap: ['120 balls: 6 balls in each of the 20 overs'], blk: 0, score: '176-5', over: O20, slots: 20, filled: 6, oversDone: 20, banner: 'Innings over · IND 176-5', striker: 'Rohit', bowler: 'Starc', counters: [20, 120, 20, 1] },
  { cap: ['Take the cricket out of the plan, and this shape is left'], blk: 0, score: '176-5', over: O20, slots: 20, filled: 6, oversDone: 20, banner: 'Innings over · IND 176-5', striker: 'Rohit', bowler: 'Starc', counters: [20, 120, 20, 1], shape: true },
]

/* ------------------------------------------------------------------ pieces */

function Flag() {
  return (
    <svg width="26" height="18" viewBox="0 0 26 18" aria-hidden className="shrink-0 rounded-[3px]">
      <rect width="26" height="6" fill="#FF9933" />
      <rect y="6" width="26" height="6" fill="#FFFFFF" />
      <rect y="12" width="26" height="6" fill="#138808" />
      <circle cx="13" cy="9" r="2.2" fill="none" stroke="#000080" strokeWidth="0.9" />
    </svg>
  )
}

/** One ball of the over: empty and dashed until bowled, then its runs. 0 grey, 4 blue, 6 purple, as the app draws them. */
function Slot({ label, value, tween }: { label: string; value: Run | null; tween: string }) {
  const has = value !== null
  const look =
    value === 6 ? { bg: SIX, fg: colors.white } : value === 4 ? { bg: colors.brand, fg: colors.white } : value === 0 ? { bg: colors.surface, fg: colors.muted } : { bg: colors.white, fg: colors.ink }
  return (
    <span className="flex w-[40px] flex-col items-center gap-1">
      <span
        className="grid h-[32px] w-[32px] place-items-center rounded-full font-mono text-[15px] font-bold"
        style={{
          background: has ? look.bg : 'transparent',
          color: has ? look.fg : 'transparent',
          boxShadow: has && value !== 0 && value !== 4 && value !== 6 ? `inset 0 0 0 1.5px ${colors.line}` : 'none',
          border: has ? 'none' : `1.5px dashed ${colors.line}`,
          transform: has ? 'none' : 'scale(0.9)',
          transition: tween,
        }}
      >
        {has ? value : ''}
      </span>
      <span className="font-mono text-[11px] leading-none" style={{ color: has ? colors.muted : 'transparent', transition: tween }}>
        {label}
      </span>
    </span>
  )
}

function ScoreCard({ b, tween }: { b: Beat; tween: string }) {
  const s = SLOTS[b.slots]
  return (
    <div className="rounded-card bg-white px-4 pb-3 pt-3 shadow-card-soft ring-1 ring-line">
      <div className="flex items-center gap-3">
        <Flag />
        <span className="font-heading text-[16px] font-bold" style={{ color: colors.ink }}>IND</span>
        <span className="font-mono text-[24px] font-bold leading-none" style={{ color: colors.ink, transition: tween }}>{b.score}</span>
        <span className="ml-1 text-[14px]" style={{ color: colors.body }}>{b.over}</span>
        <span className="ml-auto flex items-center gap-1.5 rounded-pill px-2 py-0.5 text-[11px] font-bold tracking-wider text-white" style={{ background: colors.danger }}>
          <span className="h-1.5 w-1.5 rounded-full bg-white" /> LIVE
        </span>
      </div>
      <div className="mt-2.5 flex items-center gap-3">
        <span className="w-[62px] text-[12px] font-semibold" style={{ color: colors.muted }}>This over</span>
        <span className="flex gap-1.5">
          {s.runs.map((r, i) => (
            <Slot key={`${b.slots}-${i}`} label={`${s.pre}${i + 1}`} value={i < b.filled ? r : null} tween={tween} />
          ))}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <span className="w-[62px] text-[12px] font-semibold" style={{ color: colors.muted }}>Overs</span>
        <span className="flex flex-1 gap-[3px]">
          {Array.from({ length: 20 }, (_, i) => (
            <span key={i} className="h-[8px] flex-1 rounded-[2px]" style={{ background: i < b.oversDone ? colors.brand : colors.surface2, transition: tween }} />
          ))}
        </span>
        <span className="w-[44px] text-right font-mono text-[12px]" style={{ color: colors.body }}>{b.oversDone}/20</span>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------- ground */

/* fielders, as fractions of the oval's box */
const FIELDERS: [number, number][] = [
  [0.5, 0.1], [0.2, 0.22], [0.8, 0.2], [0.09, 0.5], [0.91, 0.5], [0.22, 0.8], [0.78, 0.82], [0.5, 0.92], [0.36, 0.33],
]

/* The ground is drawn 520 x 210 (the SVG's 236 squeezed to 210), so the ball,
   a 16px DOM dot, flies in those pixels. The bowler's hand is (252, 46), the
   batter's crease (252, 150); where the ball ends depends on the shot.

   THE FLIGHT IS ON THE MAIN THREAD, DELIBERATELY. It animates `left`, `top`,
   `width` and `height`, never `transform`, and the ball carries no
   `will-change`. A transform animation is handed to the compositor, and under
   the stage's CSS `zoom` a GPU-composited layer can be drawn at the unzoomed
   offset: the ball left the pitch in a real browser window while every
   headless measurement said it was on it (review, 2026-10-01). Session 15's
   pointer had the same fault and the same fix. Four layout properties on one
   16px element cost nothing. */
const FLIGHT_MS = 1700
const BUBBLE_AT = 0.62
const BALL_PX = 16
const DEST: Record<Run, [number, number]> = { 0: [262, 168], 1: [330, 140], 2: [170, 176], 4: [470, 104], 6: [48, 14] }

/** One point of the flight: the ball's top-left corner at (x, y) in the ground's pixels, drawn `s` times its size. */
const at = (x: number, y: number, s = 1, opacity = 1, offset = 1): Keyframe => {
  const d = BALL_PX * s
  const c = (BALL_PX - d) / 2
  return { left: `${x + c}px`, top: `${y + c}px`, width: `${d}px`, height: `${d}px`, opacity, offset }
}

function flight(run: Run): Keyframe[] {
  const [dx, dy] = DEST[run]
  const kf: Keyframe[] = [at(252, 46, 1, 0, 0), at(253, 60, 1, 1, 0.28), at(250, 100, 1.45, 1, 0.38), at(248, 135, 0.95, 1, 0.48), at(252, 150, 1.1, 1, 0.56)]
  /* a six goes up before it comes down */
  if (run === 6) kf.push(at((252 + dx) / 2, (150 + dy) / 2, 2.8, 1, 0.78))
  kf.push(at(dx, dy, 1, 1, 1))
  return kf
}

/** Put the ball at a point with no motion: the instant jump, and the `?all` sweep. */
function place(el: HTMLElement, run: Run) {
  const [dx, dy] = DEST[run]
  const k = at(dx, dy)
  el.style.left = String(k.left)
  el.style.top = String(k.top)
  el.style.width = String(k.width)
  el.style.height = String(k.height)
  el.style.opacity = '1'
}

function Ground({ b, beat, tween, instant }: { b: Beat; beat: number; tween: string; instant: boolean }) {
  const ball = useRef<HTMLSpanElement>(null)
  const [bubble, setBubble] = useState(false)

  /* THE DELIVERY. One flight per ball beat, keyed by the beat so a replayed
     beat bowls again. Under an instant jump the ball sits where the shot sent
     it and the result is already up. */
  useEffect(() => {
    const el = ball.current
    if (!el) return
    el.getAnimations().forEach((a) => a.cancel())
    setBubble(false)
    if (b.run === undefined) {
      el.style.opacity = '0'
      return
    }
    if (instant) {
      place(el, b.run)
      setBubble(true)
      return
    }
    el.style.opacity = ''
    el.animate(flight(b.run), { duration: FLIGHT_MS, easing: 'linear', fill: 'forwards' })
    const t = window.setTimeout(() => setBubble(true), FLIGHT_MS * BUBBLE_AT)
    return () => window.clearTimeout(t)
  }, [beat, b.run, instant])

  return (
    <div className="relative mx-auto mt-2" style={{ width: 520, height: 210 }}>
      <svg viewBox="0 0 520 236" width="520" height="210" preserveAspectRatio="none" className="block" aria-hidden>
        <defs>
          <clipPath id="ch-oval">
            <ellipse cx="260" cy="118" rx="256" ry="114" />
          </clipPath>
        </defs>
        <ellipse cx="260" cy="118" rx="256" ry="114" fill={FIELD.grass} />
        <g clipPath="url(#ch-oval)">
          {Array.from({ length: 7 }, (_, i) => (
            <ellipse key={i} cx="260" cy="118" rx={240 - i * 34} ry={104 - i * 15} fill="none" stroke={FIELD.grassDark} strokeWidth="16" opacity={i % 2 ? 0.55 : 0} />
          ))}
        </g>
        <ellipse cx="260" cy="118" rx="256" ry="114" fill="none" stroke={FIELD.rope} strokeWidth="3" />
        <ellipse cx="260" cy="118" rx="150" ry="66" fill="none" stroke={FIELD.rope} strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="5 6" />
        <rect x="244" y="52" width="32" height="132" rx="3" fill={FIELD.pitch} stroke={FIELD.pitchEdge} strokeWidth="1.5" />
        <rect x="246" y="60" width="28" height="2" fill="#FFFFFF" opacity="0.8" />
        <rect x="246" y="174" width="28" height="2" fill="#FFFFFF" opacity="0.8" />
        {FIELDERS.map(([fx, fy], i) => (
          <circle key={i} cx={8 + fx * 504} cy={8 + fy * 220} r="6" fill={FIELD.fielder} stroke="#FFFFFF" strokeWidth="1.5" />
        ))}
        {/* the batter, and the bowler once one has come on */}
        <circle cx="260" cy="176" r="7" fill={colors.brandDark} stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="260" cy="60" r="7" fill={FIELD.fielder} stroke="#FFFFFF" strokeWidth="1.5" style={{ opacity: b.bowler ? 1 : 0, transition: tween }} />
      </svg>
      {/* the ball: a DOM dot the flight keyframes move, on the main thread (see FLIGHT_MS) */}
      <span
        ref={ball}
        aria-hidden
        className="pointer-events-none absolute block rounded-full"
        style={{ left: 252, top: 46, width: BALL_PX, height: BALL_PX, background: BALL, boxShadow: '0 2px 6px rgba(198,40,40,0.45)', opacity: 0 }}
      />
      {/* the result, beside the batter, at the moment of contact */}
      <span
        key={`bub-${beat}`}
        aria-hidden
        className={`absolute whitespace-nowrap rounded-pill bg-white px-3 py-1 text-[13px] font-bold shadow-card-soft ${bubble && !instant ? 'sm-bump' : ''}`}
        style={{ left: 150, top: 136, color: colors.brandDark, opacity: bubble ? 1 : 0 }}
      >
        {b.run !== undefined ? BUB[b.run] : ''}
      </span>
      {/* the names are labels, so they are DOM (content rule 17) */}
      <span className="absolute left-1/2 -translate-x-1/2 rounded-pill bg-white/95 px-2.5 py-0.5 text-[12px] font-bold shadow-sm" style={{ top: 164, color: colors.ink, transition: tween }}>
        {b.striker}
      </span>
      <span className="absolute left-1/2 -translate-x-1/2 rounded-pill bg-white/95 px-2.5 py-0.5 text-[12px] font-bold shadow-sm" style={{ top: 24, color: colors.ink, opacity: b.bowler ? 1 : 0, transition: tween }}>
        {b.bowler ?? ''}
      </span>
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-pill px-4 py-1.5 text-[15px] font-bold text-white shadow-card-soft"
        style={{ background: colors.brandDeep, opacity: b.banner ? 1 : 0, transform: `translate(-50%, -50%) ${b.banner ? 'none' : 'translateY(8px)'}`, transition: tween }}
      >
        {b.banner ?? ''}
      </span>
    </div>
  )
}

/* ---------------------------------------------------------------- the plan */

/* Fixed geometry, so the flow lines and the marker can be drawn to the pixel.
   The outer dashed box holds the outer head, "a new bowler comes on", the
   inner box and "end of over"; "innings over" sits under it, outside, as the
   reference draws it. Widths are the column's: 520 for the plan, the side
   notes to its right. */
const PW = 500
const ROW = 34
const HEAD = 26
const L = {
  outer: { left: 0, top: 0, width: PW, height: 228 },
  headA: { left: 14, top: 10 },
  b1: { left: 36, top: 44, width: PW - 36 - 14 },
  inner: { left: 36, top: 86, width: PW - 36 - 14, height: 88 },
  headB: { left: 48, top: 96 },
  b2: { left: 72, top: 130, width: PW - 72 - 26 },
  b3: { left: 36, top: 182, width: PW - 36 - 14 },
  b4: { left: 0, top: 236, width: PW },
} as const
const BLK_POS = { 1: L.b1, 2: L.b2, 3: L.b3, 4: L.b4 } as const

function Head({ x, y, color, children, tint, tween, mono }: { x: number; y: number; color: string; children: ReactNode; tint: boolean; tween: string; mono: boolean }) {
  return (
    <div className="absolute flex items-center gap-2" style={{ left: x, top: y, height: HEAD }}>
      <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden>
        <path d="M2 2l8 4-8 4z" fill={color} />
      </svg>
      <span className={`rounded-md px-1.5 text-[16px] font-bold leading-none ${mono ? 'font-mono' : ''}`} style={{ color: colors.ink, background: tint ? '#FFF3D6' : 'transparent', transition: tween }}>
        {children}
      </span>
    </div>
  )
}

function Line({ box, lit, tween, mono, children, note }: { box: { left: number; top: number; width: number }; lit: boolean; tween: string; mono: boolean; children: ReactNode; note?: string }) {
  return (
    <div
      className={`absolute flex items-center justify-center rounded-lg text-[15px] leading-none ${mono ? 'font-mono font-semibold' : 'font-mono font-medium'}`}
      style={{
        left: box.left,
        top: box.top,
        width: box.width,
        height: ROW,
        background: lit ? '#FDE68A' : '#D8E8FB',
        color: lit ? colors.ink : '#1F4E79',
        boxShadow: `inset 0 0 0 1.5px ${lit ? colors.warning : '#B5D0F3'}`,
        transition: tween,
      }}
    >
      {children}
      {note && (
        <span className="absolute right-3 text-[11px] font-semibold" style={{ color: '#6B8AAE' }}>
          {note}
        </span>
      )}
    </div>
  )
}

/** The two flow lines, dashed, with arrowheads into the lines they lead to. `pulse` redraws one from its top. */
function Flow({ pulse, beat }: { pulse?: 'blue' | 'orange'; beat: number }) {
  const orange = `M20 ${L.headA.top + HEAD} V${L.b3.top + ROW / 2} H30`
  const blue = `M54 ${L.headB.top + HEAD} V${L.b2.top + ROW / 2} H66`
  const yO = L.b3.top + ROW / 2
  const yB = L.b2.top + ROW / 2
  return (
    <svg className="pointer-events-none absolute left-0 top-0 overflow-visible" width={PW} height={L.b4.top + ROW} aria-hidden>
      <path key={pulse === 'orange' ? `o-${beat}` : 'o'} d={orange} fill="none" stroke={colors.accent} strokeWidth={pulse === 'orange' ? 3 : 2} strokeDasharray={pulse === 'orange' ? undefined : '5 4'} className={pulse === 'orange' ? 'sm-dash' : ''} />
      <path d={`M30 ${yO - 5} L36 ${yO} L30 ${yO + 5} Z`} fill={colors.accent} />
      <path key={pulse === 'blue' ? `b-${beat}` : 'b'} d={blue} fill="none" stroke={colors.brand} strokeWidth={pulse === 'blue' ? 3 : 2} strokeDasharray={pulse === 'blue' ? undefined : '5 4'} className={pulse === 'blue' ? 'sm-dash' : ''} />
      <path d={`M66 ${yB - 5} L72 ${yB} L66 ${yB + 5} Z`} fill={colors.brand} />
    </svg>
  )
}

function Plan({ b, beat, tween, instant }: { b: Beat; beat: number; tween: string; instant: boolean }) {
  const shape = !!b.shape
  const kw = (t: string) => <span style={{ color: '#C2185B' }}>{t}</span>
  const tok = !shape && b.blk ? BLK_POS[b.blk] : null
  return (
    <div className="relative" style={{ width: PW, height: L.b4.top + ROW }}>
      {/* the frames */}
      <div className="absolute rounded-xl" style={{ ...L.outer, border: `2px dashed ${colors.accent}`, background: b.focus === 'outer' ? '#FFF8EC' : 'transparent', transition: tween }} />
      <div className="absolute rounded-xl" style={{ ...L.inner, border: `2px dashed ${colors.brand}`, background: b.focus === 'inner' ? '#EAF3FF' : 'transparent', transition: tween }} />
      {/* the side notes, the reference's "20 times" and "6 times, in every over" */}
      <span className="absolute whitespace-nowrap text-[14px] font-bold" style={{ left: PW + 10, top: 12, color: colors.accent }}>20 times</span>
      <span className="absolute whitespace-nowrap text-[13px] font-bold leading-tight" style={{ left: PW + 10, top: 98, color: colors.brand }}>
        6 times, in
        <br />
        every over
      </span>
      <Flow pulse={instant ? undefined : b.pulse} beat={beat} />
      <Head x={L.headA.left} y={L.headA.top} color={colors.accent} tint={b.focus === 'outer'} tween={tween} mono={shape}>
        {shape ? <>{kw('for')} item {kw('in')} sequence A:</> : 'every over, 20 of them:'}
      </Head>
      <Line box={L.b1} lit={b.blk === 1 && !shape} tween={tween} mono={shape} note={shape ? 'new bowler' : undefined}>
        {shape ? 'Block 1' : 'a new bowler comes on'}
      </Line>
      <Head x={L.headB.left} y={L.headB.top} color={colors.brand} tint={b.focus === 'inner'} tween={tween} mono={shape}>
        {shape ? <>{kw('for')} item {kw('in')} sequence B:</> : 'every ball, 1 to 6:'}
      </Head>
      <Line box={L.b2} lit={b.blk === 2 && !shape} tween={tween} mono={shape} note={shape ? 'one ball' : undefined}>
        {shape ? 'Block 2' : 'bowl one ball'}
      </Line>
      <Line box={L.b3} lit={b.blk === 3 && !shape} tween={tween} mono={shape} note={shape ? 'end of over' : undefined}>
        {shape ? 'Block 3' : 'end of over, show the runs'}
      </Line>
      <Line box={L.b4} lit={b.blk === 4 && !shape} tween={tween} mono={shape} note={shape ? 'innings over' : undefined}>
        {shape ? 'Block 4' : 'innings over'}
      </Line>
      {/* the ball marker: where the plan is right now */}
      <span
        aria-hidden
        className="absolute block h-4 w-4 rounded-full"
        style={{
          left: (tok?.left ?? L.b1.left) - 8,
          top: (tok?.top ?? L.b1.top) + ROW / 2 - 8,
          background: BALL,
          boxShadow: '0 2px 6px rgba(198,40,40,0.45)',
          opacity: tok ? 1 : 0,
          transition: instant ? 'none' : 'left 450ms ease, top 450ms ease, opacity 300ms',
        }}
      />
    </div>
  )
}

const COUNTERS = ['New bowler', 'Balls bowled', 'Over ends', 'Innings over']
const BLOCKS = ['Block 1 ran', 'Block 2 ran', 'Block 3 ran', 'Block 4 ran']

/* ----------------------------------------------------------------- figure */

export function CricketHook() {
  const beat = useBeats(BEATS.length)
  const instant = useInstant()
  const tween = useTween(480)
  const b = BEATS[beat - 1]
  return (
    <>
      <div className="flex items-start gap-7">
        <div className="w-[520px] shrink-0">
          <ScoreCard b={b} tween={tween} />
          <Ground b={b} beat={beat} tween={tween} instant={instant} />
          <div className="mt-2 grid grid-cols-4 gap-2.5">
            {b.counters.map((v, i) => {
              const hot = (i === 1 && (beat === 19 || beat === 18)) || (i === 3 && beat === 17)
              return (
                <div key={i} className="rounded-xl bg-white px-3 py-2 ring-1 ring-line" style={{ boxShadow: hot ? `0 0 0 2px ${colors.brand}` : 'none', transition: tween }}>
                  <p className="text-[11px] font-semibold leading-tight" style={{ color: colors.muted }}>{b.shape ? BLOCKS[i] : COUNTERS[i]}</p>
                  <p className="mt-0.5 font-mono text-[22px] font-bold leading-none" style={{ color: v === '?' ? colors.muted : colors.brandDark, transition: tween }}>
                    {v}
                    {beat === 19 && i === 1 && <span className="ml-1.5 text-[12px] font-semibold" style={{ color: colors.muted }}>= 20 × 6</span>}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <BeatCaption n={beat} lines={b.cap} size={17} />
          <Plan b={b} beat={beat} tween={tween} instant={instant} />
        </div>
      </div>
      <StepControls at={beat} total={BEATS.length} />
    </>
  )
}
