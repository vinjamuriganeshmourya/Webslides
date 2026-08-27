import { motion } from 'framer-motion'
import { accentByTone, colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { iconByName } from '@/ui/icons'
import { E, T, perSegment } from './timing'
import type { FlowFigureProps, FlowLeg, FlowStation, StationLogo } from './types'

/**
 * HUB ORBIT — the registry as the centre of gravity.
 *
 * WHAT IT ARGUES
 *
 *   There is one shared place, and it is in the middle. Everything that makes
 *   an image feeds INTO that place from the left; everything that runs the
 *   image draws OUT of it to the right. The claim of session 6 slide 20 is not
 *   "three things in a row", it is "one copy, many machines", and the geometry
 *   has to say that before a word is read.
 *
 * WHY THIS GEOMETRY MAKES THAT ARGUMENT
 *
 *   The `hub` station is drawn once, large, raised, centred, and wrapped in a
 *   soft ring. Its card is 284x130 against 216x104 for a source or a target, so
 *   hierarchy is a size difference the eye resolves before it resolves any
 *   label. The two halves are mirror images of each other about the hub, which
 *   makes "in" and "out" a spatial fact rather than a caption.
 *
 *   The two outer stations sit on ONE BAND with the hub: their top edge is the
 *   hub's bottom edge, so the figure reads left to right along a shallow arc
 *   instead of dropping into a V and forcing the eye to start in the middle.
 *   The first pass put them 179px below the hub's centre line; it is 117px now,
 *   and the whole diagram is 254px tall instead of 318px.
 *
 *   Direction is curvature, not an arrow glyph. A leg INTO the hub leaves its
 *   station at once and arrives flat: a push lifts. A leg OUT of the hub leaves
 *   flat and then drops into the machine: a pull falls. Push and pull therefore
 *   have different silhouettes at a glance, which is the failure the kit's
 *   `FlowChart` could not fix by relabelling. The command that travels rides on
 *   the curve itself, as a pill, so a command is never promoted into a box of
 *   its own. A hub leg therefore leaves the outer card's TOP edge rather than its
 *   side: the corridor between card and hub is 104px and a command pill is about
 *   140px, so a pill hung in the corridor punches through the hub's border,
 *   which is exactly what the first fix pass rendered. Over the card's top edge
 *   there is 130px of clear canvas, the payload curve arcs through it, and the
 *   pill hangs at that curve's midpoint. The corridor is then left free for the
 *   hairline that says who asked.
 *
 * WHAT THE ARROWS CLAIM, AND WHAT THEY USED TO CLAIM
 *
 *   The old file read `leg.direction`, and `direction: 'reverse'` meant "this
 *   leg is the opposite movement". That name invited every reader, including the
 *   three sibling variants, to reverse the arrowhead as well, which tells the
 *   room that `docker pull` moves an image FROM the machine INTO Docker Hub.
 *   That is the exact opposite of what a pull does.
 *
 *   The field is now `leg.issuedBy`, and it names WHO TYPED THE COMMAND and
 *   nothing else. The payload arrow in this figure always points from
 *   `stations[i]` to `stations[i + 1]`: laptop -> Hub for a push, Hub -> machine
 *   for a pull. Who asked is drawn as a dashed hairline that leaves the issuing
 *   station, bows under the payload curve, and ends in a 9px head, with the word
 *   "asks" at its tail. It is 1.5px against 3px, dashed against solid, and at
 *   40% alpha, so it can never be mistaken for the thing that travels. That
 *   asymmetry is the whole point: on a push the hairline runs with the payload,
 *   on a pull it runs against it, and that is the only real difference between
 *   the two commands.
 *
 *   The target side is drawn as a small stack: two offset card edges at low
 *   alpha behind the one real target. One image serves many machines, and a
 *   single flat card quietly denies that. The ghosts carry no label and invent
 *   no second machine, because the caller passed one.
 *
 * WHAT IT COSTS
 *
 *   It is the worst of the four at a CHAIN. The figure spends its whole width
 *   budget on the middle, so a story with more than one station on a side gets
 *   two cramped 176px cards on a short diagonal and legs too short to carry a
 *   labelled pill comfortably. Anything shaped like `A -> B -> C -> D` with no
 *   shared place at its centre should not use this figure: a track or timeline
 *   variant will read better, and slide 38's four stages (build, push, pull,
 *   run) are exactly that shape. This file renders slide 38 honestly by putting
 *   the two in-place stages (`docker build`, `docker run`) in the captions of
 *   the machines they happen ON, and keeping only the two stages that really
 *   travel on the legs. Nothing is faked into a node, but `build` and `run` do
 *   not get the billing a chain figure would give them.
 *
 *   It is also the least dense: three stations and two legs fill 972x254.
 *
 * MOTION BEATS (see .agents/skills/animation-vocabulary)
 *
 *   Every number comes from `./timing`. A slide figure is that skill's
 *   EXPLANATORY tier, not its interactive tier, so the scale is roughly double
 *   the first pass and the whole figure lands at about 2.5s.
 *
 *   1. `hub scale-in`        T.enter from T.lead, scale 0.97 -> 1 + fade, E.out.
 *                            The centre of gravity exists before anything orbits.
 *   2. `station stagger`     T.enter each, T.stagger apart, fade + translate
 *                            toward the hub. Left first, so reading order is
 *                            left to right.
 *   3. `path draw`           T.draw, `pathLength` 0 -> 1, E.inOut. The leading
 *                            beat. Legs come in story order, and the second
 *                            starts at 0.65 of the first so the pair reads as
 *                            one movement rather than two.
 *   4. `ask hairline`        T.label, at 0.55 of its own draw, under the payload.
 *   5. `label fade-up`       T.label, the command pill rises 6px onto its curve.
 *   6. `arrowhead pop`       T.label, E.pop, on the frame the draw lands. The one
 *                            emphasis beat in the figure.
 *   7. `caption fade in`     T.label, last.
 *   8. `hub ring pulse`      T.travel * 3, two cycles then STOPS. Scale and
 *                            opacity only, on the ring alone, per-segment eased.
 *                            Suppressed under `useInstant()` and
 *                            `prefers-reduced-motion`.
 */

/* ------------------------------------------------------------------ */
/* Geometry. Fixed canvas, so these are numbers and not breakpoints.  */
/* ------------------------------------------------------------------ */

const W = 972
const DH = 254 // the diagram; the figure caption adds ~36 under it

const HUB = { w: 284, h: 130, y: 8 }
const HUB_X = (W - HUB.w) / 2
const HUB_R = HUB_X + HUB.w
const HUB_CY = HUB.y + HUB.h / 2

/** Both hub anchors sit BELOW the hub's middle, because every other station is
 *  below it. A leg that left the exact centre would cut across the repo name. */
const HUB_L = { x: HUB_X - 2, y: HUB_CY + 30 }
const HUB_R_ANCHOR = { x: HUB_R + 2, y: HUB_CY + 30 }

/** The outer stations' TOP edge is the hub's BOTTOM edge, which is what puts the
 *  three of them on one band. Everything above that line, out to the hub, is
 *  empty, and that is where a command pill goes. */
const LANE_BOTTOM = HUB.y + HUB.h + 104
const SIDE = { w: 216, h: 104, inset: 24 }
/** How far each ghost card edge peeks out from behind the real target. The inset
 *  is >= 2 * GHOST_STEP so the deepest ghost stays inside the canvas. */
const GHOST_STEP = 8

interface Rect {
  x: number
  y: number
  w: number
  h: number
}

/**
 * Slots for one side lane. `j` counts from the OUTSIDE in, so the slot nearest
 * the hub is always the last one: higher and closer, which is what makes the
 * lane read as a rise toward the middle.
 */
function laneSlots(count: number, side: 'left' | 'right'): Rect[] {
  if (count <= 0) return []
  if (count === 1) {
    const { w, h, inset } = SIDE
    return [{ x: side === 'left' ? inset : W - inset - w, y: LANE_BOTTOM - h, w, h }]
  }
  /* The cramped case this variant is honestly bad at. It renders, it does not
     collide, and it is the reason the header block tells you to pick a track
     figure instead. */
  const w = 176
  const h = 92
  return Array.from({ length: count }, (_, j) => ({
    w,
    h,
    x: side === 'left' ? 12 + j * 70 : W - 12 - w - j * 70,
    y: LANE_BOTTOM - h - j * 96,
  }))
}

const rightOf = (r: Rect) => ({ x: r.x + r.w + 2, y: r.y + r.h * 0.33 })
const leftOf = (r: Rect) => ({ x: r.x - 2, y: r.y + r.h * 0.33 })
const aboveOf = (r: Rect) => ({ x: r.x + r.w * 0.62, y: r.y - 2 })
const belowOf = (r: Rect) => ({ x: r.x + r.w * 0.38, y: r.y + r.h + 2 })

interface Pt {
  x: number
  y: number
}

/** Cubic Bezier point, used to hang the command pill on the curve it belongs to. */
function cubicAt(p0: Pt, c1: Pt, c2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t
  const a = u * u * u
  const b = 3 * u * u * t
  const c = 3 * u * t * t
  const d = t * t * t
  return {
    x: a * p0.x + b * c1.x + c * c2.x + d * p3.x,
    y: a * p0.y + b * c1.y + c * c2.y + d * p3.y,
  }
}

/** Low-alpha wash from a TOKEN hue. No literal hex reaches this file. */
function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

/** Literal strings only: a template literal here ships a broken image in the
 *  single-file build. */
const LOGO_SRC: Record<StationLogo, string> = {
  docker: '/assets/tech/docker.png',
  git: '/assets/tech/git.png',
  python: '/assets/tech/python.png',
  nodejs: '/assets/tech/nodejs.png',
  makefile: '/assets/tech/makefile.png',
}

const REDUCED =
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

/* ------------------------------------------------------------------ */
/* Pieces                                                             */
/* ------------------------------------------------------------------ */

function StationMark({ station, size }: { station: FlowStation; size: number }) {
  const tone = station.tone ?? 'brand'
  const hue = accentByTone[tone]
  if (station.logo) {
    return (
      <img
        src={LOGO_SRC[station.logo]}
        alt=""
        draggable={false}
        className="shrink-0 object-contain"
        style={{ width: size, height: size }}
      />
    )
  }
  const Icon = station.icon ? iconByName[station.icon] : null
  if (!Icon) return null
  return (
    <span
      className="grid shrink-0 place-items-center rounded-xl"
      style={{ width: size, height: size, background: withAlpha(hue, 0.12), color: hue }}
    >
      <Icon width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} />
    </span>
  )
}

/** A source or a target. Small, plain, and deliberately identical on both
 *  sides: the only thing that separates the two halves is which way the curve
 *  bends, so the cards must not add a second, competing signal.
 *
 *  The label is `text-body` and `nowrap`, not `text-body-lg`. At 22px in a
 *  216px card, "Every machine" wrapped to two lines and "Any machine" did not,
 *  so the two sides of slide 38 stopped being mirror images of each other. 19px
 *  keeps every station label in this deck on one line, and the hub still reads
 *  as the bigger card by 26px against 19px. */
function SideCard({
  station,
  rect,
  ghosts,
  delay,
  instant,
}: {
  station: FlowStation
  rect: Rect
  ghosts: number
  delay: number
  instant: boolean
}) {
  const t = instant ? 0 : 1
  const hue = accentByTone[station.tone ?? 'brand']
  /* Stations lean IN as they arrive, so the entrance itself points at the hub. */
  const lean = rect.x < W / 2 ? 10 : -10

  return (
    <motion.div
      className="absolute"
      style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
      initial={instant ? false : { opacity: 0, transform: `translateX(${-lean}px)` }}
      animate={{ opacity: 1, transform: 'translateX(0px)' }}
      transition={{ duration: T.enter * t, delay: delay * t, ease: E.out }}
    >
      {/* One image serves MANY machines. Two card edges, no labels, no invented
          second machine. */}
      {Array.from({ length: ghosts }, (_, k) => (
        <span
          key={k}
          className="absolute rounded-card border"
          style={{
            left: (k + 1) * GHOST_STEP,
            top: (k + 1) * GHOST_STEP,
            width: rect.w,
            height: rect.h,
            borderColor: withAlpha(hue, 0.3 - k * 0.12),
            background: withAlpha(colors.white, 0.7),
          }}
        />
      ))}
      <div
        className="absolute inset-0 flex flex-col justify-center gap-1 rounded-card border bg-surface-card px-4 shadow-card-soft"
        style={{ borderColor: withAlpha(hue, 0.55) }}
      >
        <div className="flex items-center gap-2.5">
          <StationMark station={station} size={26} />
          <p className="whitespace-nowrap font-heading text-body font-bold leading-tight text-ink">
            {station.label}
          </p>
        </div>
        {station.caption != null && (
          <p
            className="whitespace-nowrap text-body-sm leading-tight"
            style={{ color: colors.body }}
          >
            {station.caption}
          </p>
        )}
      </div>
    </motion.div>
  )
}

/** The hub. Bigger, higher, centred, ringed: every one of those is the same
 *  claim said a different way, because the room has to get it without being
 *  told. */
function HubCard({
  station,
  delay,
  pulseAt,
  instant,
}: {
  station: FlowStation
  delay: number
  pulseAt: number
  instant: boolean
}) {
  const t = instant ? 0 : 1
  const hue = accentByTone[station.tone ?? 'brand']
  const ambient = !instant && !REDUCED

  return (
    <motion.div
      className="absolute"
      style={{ left: HUB_X, top: HUB.y, width: HUB.w, height: HUB.h }}
      initial={instant ? false : { opacity: 0, transform: 'scale(0.97)' }}
      animate={{ opacity: 1, transform: 'scale(1)' }}
      transition={{ duration: T.enter * t, delay: delay * t, ease: E.out }}
    >
      {/* The ring is the gravity. It is the only thing in the figure allowed to
          keep moving, it moves on transform and opacity only, and it stops.
          Three keyframes, so the easing is per-segment: one four-number curve
          on a multi-keyframe track is read as per-segment easings and the
          motion runs to the end and comes back. */}
      <motion.span
        className="absolute rounded-xl2 border-2"
        style={{ inset: -11, borderColor: withAlpha(hue, 0.24) }}
        initial={ambient ? { opacity: 0.5, transform: 'scale(1)' } : false}
        animate={
          ambient
            ? {
                opacity: [0.5, 0.9, 0.5],
                transform: ['scale(1)', 'scale(1.035)', 'scale(1)'],
              }
            : { opacity: 0.5 }
        }
        transition={
          ambient
            ? { duration: T.travel * 3, delay: pulseAt, repeat: 1, ease: perSegment(3) }
            : { duration: 0 }
        }
      />
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl2 border-2 shadow-card"
        style={{ borderColor: hue, background: withAlpha(hue, 0.06) }}
      >
        <div className="flex items-center gap-3">
          <StationMark station={station} size={34} />
          <p className="font-heading text-body-xl font-bold leading-tight text-ink">
            {station.label}
          </p>
        </div>
        {station.caption != null && (
          <p
            className="max-w-full px-4 text-center font-mono text-body-sm font-bold leading-tight"
            style={{ color: colors.brandDark }}
          >
            {station.caption}
          </p>
        )}
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* The figure                                                         */
/* ------------------------------------------------------------------ */

interface Drawn {
  leg: FlowLeg
  /** The payload path, ALWAYS stations[i] -> stations[i + 1]. */
  d: string
  tip: Pt
  angle: number
  pill: Pt
  hue: string
  /** The dashed hairline that says who typed the command, or null when the leg
   *  is a same-side chain leg with no room for one. */
  ask: { d: string; tip: Pt; angle: number; mid: Pt } | null
  /** The hairline's word: `asks` for a pull, `sends` for a push. */
  askWord: string
}

/** The subordinate mark: a bowed hairline from the issuing station toward the
 *  other one, inset at both ends so its small head never lands on the payload
 *  arrowhead. Quadratic, because it only has to be a hint of a return. */
function askArc(from: Pt, to: Pt, bow: number) {
  const inset = 0.14
  const a = { x: from.x + (to.x - from.x) * inset, y: from.y + (to.y - from.y) * inset + bow * 0.5 }
  const b = { x: to.x - (to.x - from.x) * inset, y: to.y - (to.y - from.y) * inset + bow * 0.5 }
  const c = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 + bow }
  /* Tangent at the end of a quadratic is c -> b. The caption hangs off the
     arc's own midpoint, which is the deepest point of the bow and the one place
     in the corridor nothing else reaches. */
  return {
    d: `M ${a.x} ${a.y} Q ${c.x} ${c.y}, ${b.x} ${b.y}`,
    tip: b,
    angle: (Math.atan2(b.y - c.y, b.x - c.x) * 180) / Math.PI,
    mid: { x: (a.x + 2 * c.x + b.x) / 4, y: (a.y + 2 * c.y + b.y) / 4 },
  }
}

export function HubOrbit({ stations, legs, caption, className = '' }: FlowFigureProps) {
  const instant = useInstant()
  const t = instant ? 0 : 1

  const found = stations.findIndex((s) => s.kind === 'hub')
  /* No `hub` passed at all is the degenerate case this variant is named after
     not handling: the middle station is promoted so the figure still draws,
     but the picture then claims a centre the content does not have. */
  const hubIndex = found >= 0 ? found : Math.floor((stations.length - 1) / 2)

  const leftRects = laneSlots(hubIndex, 'left')
  const nRight = Math.max(0, stations.length - hubIndex - 1)
  const rightRects = laneSlots(nRight, 'right')

  /** Rect for a station index, or null for the hub itself. */
  const rectFor = (i: number): Rect | null => {
    if (i === hubIndex) return null
    if (i < hubIndex) return leftRects[i] ?? null
    return rightRects[nRight - 1 - (i - hubIndex - 1)] ?? null
  }

  const drawn: Drawn[] = []
  legs.forEach((leg, i) => {
    if (i + 1 >= stations.length) return
    const ra = rectFor(i)
    const rb = rectFor(i + 1)

    let p0: Pt
    let p3: Pt
    /* Where the subordinate hairline runs, when there is one. It uses the card's
       SIDE edge and the hub's side anchor, so it lives entirely in the corridor
       between the two and never crosses either card. */
    /* Both are in CHAIN order: `askFrom` belongs to stations[i], `askTo` to
       stations[i + 1], exactly like the payload. `issuedBy` then only has to
       decide which of the two the hairline leaves from. Getting these two the
       other way round on one side of the hub is what made the first render draw
       the pull's hairline as the Hub asking the machine. */
    let askFrom: Pt | null = null
    let askTo: Pt | null = null
    if (i + 1 === hubIndex && ra) {
      /* Over the top of the card, not out of its side: the corridor between the
         card and the hub is 104px, a command pill is ~140px, and the first fix
         pass put the pill straight through the hub's left border. Above the
         card's top edge there is 130px of clear canvas all the way to the hub. */
      p0 = aboveOf(ra)
      p3 = HUB_L
      askFrom = rightOf(ra)
      askTo = HUB_L
    } else if (i === hubIndex && rb) {
      p0 = HUB_R_ANCHOR
      p3 = aboveOf(rb)
      askFrom = HUB_R_ANCHOR
      askTo = leftOf(rb)
    } else if (ra && rb && i + 1 < hubIndex) {
      p0 = aboveOf(ra)
      p3 = belowOf(rb)
    } else if (ra && rb) {
      p0 = belowOf(ra)
      p3 = aboveOf(rb)
    } else {
      return
    }

    const dx = p3.x - p0.x
    const dy = p3.y - p0.y
    /* Curvature is the MOVEMENT, and the movement is read off the geometry, not
       off a prop. Into the hub: leave the station at once and arrive flat, so a
       push lifts. Out of the hub: leave flat and drop into the machine, so a
       pull falls. Neither of these touches the arrowhead. */
    const toHub = i + 1 === hubIndex
    const fromHub = i === hubIndex

    const c1 = fromHub
      ? { x: p0.x + dx * 0.45, y: p0.y }
      : { x: p0.x + dx * 0.1, y: p0.y + dy * 0.85 }
    const c2 = fromHub
      ? { x: p3.x - dx * 0.1, y: p3.y - dy * 0.85 }
      : { x: p3.x - dx * 0.45, y: p3.y }

    /* The pill hangs at the midpoint of its own curve. On a hub leg that lands
       in the corridor between the outer card and the hub, ABOVE the card's top
       edge, which is the only patch of this canvas that is empty on both legs.
       A same-side chain leg has no such room, so its pill drops into the lane
       below. */
    const chain = !toHub && !fromHub
    const mid = cubicAt(p0, c1, c2, p3, 0.5)
    const pill = chain
      ? { x: mid.x + (p0.x < W / 2 ? 100 : -100), y: mid.y + 56 }
      : { x: mid.x, y: mid.y - 8 }

    /* WHO ASKED. `left` (the default) means the station before the leg typed the
       command, `right` means the station after it did. It never turns the
       payload arrow around: the hairline is what changes. */
    const issuedBy = leg.issuedBy ?? 'left'
    const ask =
      askFrom == null || askTo == null
        ? null
        : issuedBy === 'right'
          ? askArc(askTo, askFrom, 40)
          : askArc(askFrom, askTo, 40)

    drawn.push({
      leg,
      /* The hairline's word depends on WHICH END TYPED THE COMMAND. "asks" is
         only true of a pull: the receiving machine requests the image. On a
         push the sending station is not asking anyone for anything, it is
         handing the image over, so the same word there was simply wrong. */
      askWord: issuedBy === 'right' ? 'asks' : 'sends',
      d: `M ${p0.x} ${p0.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p3.x} ${p3.y}`,
      tip: p3,
      angle: (Math.atan2(p3.y - c2.y, p3.x - c2.x) * 180) / Math.PI,
      pill,
      hue: fromHub ? accentByTone.accent : accentByTone.brand,
      ask,
    })
  })

  /* The whole schedule, in `T` units and nothing else. Hub at T.lead, the outer
     stations T.stagger apart behind it, the legs once the stations have landed,
     each leg at 0.65 of the one before, the caption a beat after the last draw.
     Slide 20 therefore finishes at about 2.5s. */
  const hubBeat = T.lead
  const stationBeat = (i: number) => T.lead + T.stagger * ((i < hubIndex ? i : i - 1) + 1)
  const legLead = T.lead + T.stagger * 2 + T.enter
  const legBeat = (i: number) => legLead + i * T.draw * 0.65
  const capBeat = legBeat(Math.max(0, drawn.length - 1)) + T.draw * 0.85

  return (
    <div className={className} style={{ width: W }}>
      <div className="relative" style={{ width: W, height: DH }}>
        <svg
          className="absolute inset-0 z-10"
          width={W}
          height={DH}
          style={{ overflow: 'visible' }}
          aria-hidden
        >
          {drawn.map((g, i) => (
            <g key={`leg-${i}`}>
              {/* WHO ASKED, first and quietest: 1.5px against 3px, dashed
                  against solid, 40% alpha, and a 9px head. On a push it runs
                  with the payload, on a pull it runs against it, and that is
                  the only difference between the two commands. */}
              {g.ask != null && (
                <motion.g
                  initial={instant ? false : { opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{
                    duration: T.label * t,
                    delay: (legBeat(i) + T.draw * 0.55) * t,
                    ease: E.out,
                  }}
                >
                  <path
                    d={g.ask.d}
                    fill="none"
                    stroke={colors.body}
                    strokeWidth={1.5}
                    strokeDasharray="4 5"
                    strokeLinecap="round"
                  />
                  <g transform={`translate(${g.ask.tip.x} ${g.ask.tip.y}) rotate(${g.ask.angle})`}>
                    <path d="M 0 0 L -9 -4.5 L -9 4.5 Z" fill={colors.body} />
                  </g>
                </motion.g>
              )}
              <motion.path
                d={g.d}
                fill="none"
                stroke={g.hue}
                strokeWidth={3}
                strokeLinecap="round"
                initial={instant ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: T.draw * t, delay: legBeat(i) * t, ease: E.inOut }}
              />
              {/* The arrowhead is a real triangle on the curve's own tangent, not
                  a marker: a marker would be painted from the first frame and
                  the destination would be announced before the line arrives.
                  It sits at stations[i + 1], always. */}
              <g transform={`translate(${g.tip.x} ${g.tip.y}) rotate(${g.angle})`}>
                <motion.path
                  d="M 0 0 L -12 -6.5 L -12 6.5 Z"
                  fill={g.hue}
                  initial={instant ? false : { opacity: 0, transform: 'scale(0.97)' }}
                  animate={{ opacity: 1, transform: 'scale(1)' }}
                  transition={{
                    duration: T.label * t,
                    delay: (legBeat(i) + T.draw * 0.88) * t,
                    ease: E.pop,
                  }}
                />
              </g>
            </g>
          ))}
        </svg>

        {/* Stations sit ABOVE the curves, so a leg can terminate a couple of
            pixels inside a card edge and never show a seam. */}
        <div className="absolute inset-0 z-20">
          {stations.map((s, i) => {
            if (i === hubIndex) {
              return (
                <HubCard
                  key={`s-${i}`}
                  station={s}
                  delay={hubBeat}
                  pulseAt={capBeat + T.label}
                  instant={instant}
                />
              )
            }
            const rect = rectFor(i)
            if (!rect) return null
            const isFarthestTarget = i === stations.length - 1 && i > hubIndex
            return (
              <SideCard
                key={`s-${i}`}
                station={s}
                rect={rect}
                ghosts={isFarthestTarget ? 2 : 0}
                delay={stationBeat(i)}
                instant={instant}
              />
            )
          })}
        </div>

        {/* The command rides on its own curve. This is the whole reason the kit's
            FlowChart had to be replaced: a command is not a station. */}
        <div className="absolute inset-0 z-30">
          {drawn.map((g, i) => (
            /* Outer div does the centring with a static transform; the inner one
               owns the animated transform, so the two never fight. */
            <div
              key={`pill-${i}`}
              className="absolute"
              style={{ left: g.pill.x, top: g.pill.y, transform: 'translate(-50%, -50%)' }}
            >
              <motion.div
                className="rounded-pill border-2 bg-surface-card px-3.5 py-1.5 text-center shadow-card-soft"
                style={{ borderColor: g.hue, whiteSpace: 'nowrap' }}
                initial={instant ? false : { opacity: 0, transform: 'translateY(6px)' }}
                animate={{ opacity: 1, transform: 'translateY(0px)' }}
                transition={{
                  duration: T.label * t,
                  delay: (legBeat(i) + T.draw * 0.7) * t,
                  ease: E.out,
                }}
              >
                <span className="block font-mono text-body-sm font-bold" style={{ color: g.hue }}>
                  {g.leg.label}
                </span>
                {g.leg.sub != null && (
                  <span className="block text-body-sm leading-tight" style={{ color: colors.body }}>
                    {g.leg.sub}
                  </span>
                )}
              </motion.div>
            </div>
          ))}

          {/* The word at the tail of the hairline. Four letters, no border, no
              background: it names the return track without competing with it. */}
          {drawn.map((g, i) =>
            g.ask == null ? null : (
              <motion.span
                key={`ask-${i}`}
                className="absolute text-body-sm font-semibold"
                style={{
                  left: g.ask.mid.x,
                  top: g.ask.mid.y + 14,
                  transform: 'translate(-50%, 0)',
                  color: withAlpha(colors.body, 0.75),
                  whiteSpace: 'nowrap',
                }}
                initial={instant ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: T.label * t,
                  delay: (legBeat(i) + T.draw * 0.6) * t,
                  ease: E.out,
                }}
              >
                {g.askWord}
              </motion.span>
            ),
          )}
        </div>
      </div>

      {caption != null && (
        <motion.p
          className="mt-2 text-center text-body-sm font-semibold"
          style={{ color: colors.body }}
          initial={instant ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: T.label * t, delay: capBeat * t, ease: E.out }}
        >
          {caption}
        </motion.p>
      )}
    </div>
  )
}

export default HubOrbit
