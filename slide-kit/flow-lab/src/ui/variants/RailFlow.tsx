import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { accentByTone, colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { iconByName } from '@/ui/icons'
import type { FlowFigureProps, FlowLeg, FlowStation, StationLogo } from './types'
import { E, T, perSegment } from './timing'

/**
 * RAILFLOW — the horizontal rail.
 *
 * WHAT IT ARGUES
 *   An image has ONE journey, and every place it passes through is a stop on
 *   that journey rather than a box that happens to sit near another box. The
 *   rail is drawn first and drawn edge to edge, so the room sees the line before
 *   it sees anything standing on it; the stations then land ON the line. The
 *   commands ride the rail as mono pills, because `docker push` is not a place
 *   the image visits, it is the movement between two places: the command IS the
 *   edge. The registry is raised off the rail and drawn larger, so "the shared
 *   place in the middle" is a fact of the geometry and not something the caption
 *   has to assert.
 *
 * THE DIRECTION BUG THIS FILE WAS REWRITTEN TO KILL
 *   The first pass drew a `reverse` leg OFF the rail, on a lower track, in a
 *   full-weight 3px teal stroke with a large arrowhead, running from the
 *   receiving machine back into Docker Hub. Read literally — and a slide is read
 *   literally, from the back of a room — that claims `docker pull` moves the
 *   image FROM the machine INTO the hub, which is the exact opposite of a pull.
 *
 *   What it draws now: the payload always travels along the chain, on the rail,
 *   `stations[i]` to `stations[i + 1]`, same 5px brand stroke and same arrowhead
 *   for every leg. `docker push` paints laptop -> hub. `docker pull` paints
 *   hub -> machine. There is exactly one direction of image travel in this
 *   figure and it never turns around.
 *
 *   Who typed the command is the only real difference between the two, so it is
 *   still shown, and shown as strictly subordinate: `issuedBy: 'right'` adds a
 *   1.5px dashed teal hairline dropping off the rail, running back under the
 *   cards, with a small arrowhead into the station that was asked and a muted
 *   caption ("the machine asks for it"). Hairline, dashed, below, and never the
 *   only mark on the leg — so it reads as a request, not as cargo.
 *
 * WHY THIS GEOMETRY MAKES THAT ARGUMENT
 *   Continuity is the whole claim, so the rail is a real stroked path that runs
 *   behind the opaque cards: it is never interrupted, only occluded, which is
 *   what makes three cards read as three stops. Vertical position carries rank
 *   (raised = the hub everything reaches toward) and weight carries kind
 *   (on-rail 5px = the image itself, sub-rail hairline = a request for it), so
 *   direction never has to be spent on either.
 *
 * WHAT IT COSTS
 *   The rail is a single line, so it cannot fork, it cannot show two sources
 *   feeding one hub, and it has no answer for a step that happens in place.
 *   Labelling ON the rail also caps the deck at three stations: an on-rail pill
 *   needs ~140px of clear gap, and the raised hub is 296px wide so that a
 *   25-character repository name never wraps mid-token, which leaves 150px of
 *   gap either side and nothing to spare for a fourth stop.
 *
 * MOTION BEATS (named, all timings from `./timing`)
 *   1. `Line drawing` — the rail traces itself left to right, `T.draw`. The
 *      journey exists before any of its stops do.
 *   2. `Stagger` of `Scale in` — the stations land on the rail in story order,
 *      `T.stagger` apart, `T.enter` each, from 0.97 and 8px out.
 *   3. `Fade in` — the hub's stem and rail node, mid-entrance of the hub card,
 *      so the raised card visibly attaches to the line.
 *   4. `Line drawing` + `Slide in` — each leg paints its rail segment in brand,
 *      left to right, `T.travel`, then its mono pill rises onto the rail.
 *   5. `Line drawing` — a leg with `issuedBy: 'right'` then draws its dashed
 *      request hairline, after its payload has already moved, so the room reads
 *      cargo first and the asking second.
 *   6. `Pulse` — a finite beacon on the hub node, two cycles then done. Gated on
 *      `useInstant` and `prefers-reduced-motion`.
 *   7. `Fade in` — the figure's caption, last. Whole figure lands by ~2.6s.
 */

/* ---------------------------------------------------------------- */
/* Geometry. Fixed canvas, so these are pixels and not a breakpoint. */
/* ---------------------------------------------------------------- */

const W = 980
/** The rail's own y. Everything else is measured off it. */
const RAIL_Y = 164
/** The request hairline's track, clear of the card bottoms. */
const REQ_Y = 254

/** 184 not 200: the extra 16px per card is what buys each on-rail pill its gap. */
const CARD_W = 184
const CARD_H = 116
/** Wide enough for `ravi123/nxttrendz-backend` on one line at 16px mono. */
const HUB_W = 296
const HUB_H = 132
/** How far the hub's centre sits above the rail. This is the hierarchy, and it
    is set so HUB_TOP lands on exactly 0: see `figureBottom` below. */
const HUB_LIFT = 98

const CARD_TOP = RAIL_Y - CARD_H / 2
const CARD_BOTTOM = RAIL_Y + CARD_H / 2
const HUB_TOP = RAIL_Y - HUB_LIFT - HUB_H / 2
const HUB_BOTTOM = RAIL_Y - HUB_LIFT + HUB_H / 2

const MARGIN_X = CARD_W / 2 + 8

/** Only these five PNGs exist. Literal paths: a template literal ships broken. */
const LOGO_SRC: Record<StationLogo, string> = {
  docker: '/assets/tech/docker.png',
  git: '/assets/tech/git.png',
  python: '/assets/tech/python.png',
  nodejs: '/assets/tech/nodejs.png',
  makefile: '/assets/tech/makefile.png',
}

/** Low-alpha wash off a token hue, the way `DataTable` does it. */
function washOf(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

const isHub = (s: FlowStation) => s.kind === 'hub'
/** Absent means the station before the leg typed it. See `types.ts`. */
const askedByReceiver = (l: FlowLeg) => (l.issuedBy ?? 'left') === 'right'

function stationColor(s: FlowStation) {
  if (s.tone) return accentByTone[s.tone]
  return isHub(s) ? colors.brandDeep : colors.brand
}

/* ---------------------------------------------------------------- */
/* A station. Raised and larger when it is the hub.                  */
/* ---------------------------------------------------------------- */

function StationCard({
  station,
  cx,
  delay,
  t,
  instant,
}: {
  station: FlowStation
  cx: number
  delay: number
  t: number
  instant: boolean
}) {
  const hub = isHub(station)
  const color = stationColor(station)
  const w = hub ? HUB_W : CARD_W
  const h = hub ? HUB_H : CARD_H
  const top = hub ? HUB_TOP : CARD_TOP
  const logo = station.logo ? LOGO_SRC[station.logo] : null

  return (
    <motion.div
      className={`absolute grid place-items-center bg-surface-card text-center ${
        hub ? 'rounded-xl2 shadow-card' : 'rounded-card shadow-card-soft'
      }`}
      style={{
        left: cx - w / 2,
        top,
        width: w,
        height: h,
        border: hub ? `2px solid ${color}` : `1px solid ${colors.line}`,
        padding: hub ? '10px 12px' : '8px 10px',
      }}
      initial={instant ? false : { opacity: 0, transform: `translateY(${hub ? -10 : 10}px) scale(0.97)` }}
      animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
      transition={{ duration: T.enter * t, delay: delay * t, ease: E.out }}
    >
      <div>
        {logo ? (
          <span
            className="mx-auto mb-1 grid place-items-center rounded-xl"
            style={{
              background: washOf(color, 0.1),
              color,
              width: hub ? 38 : 32,
              height: hub ? 38 : 32,
            }}
          >
            <img
              src={logo}
              alt=""
              draggable={false}
              className="object-contain"
              style={{ width: hub ? 24 : 20, height: hub ? 24 : 20 }}
            />
          </span>
        ) : (
          station.icon && <StationIcon name={station.icon} color={color} hub={hub} />
        )}
        <p
          className={`font-heading font-bold leading-tight ${hub ? 'text-body' : 'text-body-sm'}`}
          style={{ color: hub ? color : colors.ink }}
        >
          {station.label}
        </p>
        {station.caption && (
          <p className="mt-0.5 text-body-sm leading-tight" style={{ color: colors.muted }}>
            {station.caption}
          </p>
        )}
      </div>
    </motion.div>
  )
}

function StationIcon({
  name,
  color,
  hub,
}: {
  name: NonNullable<FlowStation['icon']>
  color: string
  hub: boolean
}) {
  const Icon = iconByName[name]
  if (!Icon) return null
  return (
    <span
      className="mx-auto mb-1 grid place-items-center rounded-xl"
      style={{ background: washOf(color, 0.1), color, width: hub ? 38 : 32, height: hub ? 38 : 32 }}
    >
      <Icon width={hub ? 20 : 17} height={hub ? 20 : 17} />
    </span>
  )
}

/* ---------------------------------------------------------------- */
/* The figure                                                        */
/* ---------------------------------------------------------------- */

export function RailFlow({ stations, legs, caption, className = '' }: FlowFigureProps) {
  const instant = useInstant()
  const reduce = useReducedMotion()
  const t = instant ? 0 : 1
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')

  const n = stations.length
  const centers = stations.map((_, i) =>
    n === 1 ? W / 2 : MARGIN_X + (i * (W - 2 * MARGIN_X)) / (n - 1),
  )
  const halfOf = (i: number) => (isHub(stations[i]) ? HUB_W : CARD_W) / 2
  const bottomOf = (i: number) => (isHub(stations[i]) ? HUB_BOTTOM : CARD_BOTTOM)
  /* Where a station meets the rail. A raised hub meets it at its node, not at
     its card edge, or the leg's segment stops short and the coloured stroke
     hides entirely behind the pill. */
  const railOut = (i: number) => (isHub(stations[i]) ? centers[i] + 14 : centers[i] + halfOf(i) + 6)
  const railIn = (i: number) => (isHub(stations[i]) ? centers[i] - 14 : centers[i] - halfOf(i) - 8)

  /* The rail overhangs the outer stations a little, so it reads as a line the
     journey sits on rather than a connector cut to fit three boxes. */
  const railFrom = centers[0] - halfOf(0) - 34
  const railTo = centers[n - 1] + halfOf(n - 1) + 34

  const hasRequest = legs.some((l, i) => i + 1 < n && askedByReceiver(l))
  /* The raised hub's top edge is y=0 by construction (RAIL_Y - HUB_LIFT -
     HUB_H / 2), and the figure's last mark is its caption, so the container is
     exactly the ink and nothing more. That is what lets `ContentSlide`'s
     `justify-center` actually centre it: an unpainted band inside the container
     would centre the band and hang the figure low, which is what it did. */
  const figureBottom = hasRequest ? 300 : 236
  const captionTop = figureBottom
  const H = caption ? captionTop + 30 : figureBottom

  /* Beat clock. Named so the delays read as the story, not as magic numbers.
     Every number below is `T` or a fraction of `T`; there are no loose seconds
     in this file. */
  const railStart = T.lead
  /* The stations start while the rail is still drawing: the line is already
     unmistakably a line by halfway, and waiting for it costs 400ms of nothing. */
  const stationDelay = (i: number) => railStart + T.draw * 0.5 + i * T.stagger
  const stationsEnd = stationDelay(n - 1) + T.enter

  /* Legs run in story order, and a leg's payload always moves before its
     request hairline: cargo first, the asking second. */
  const legDelay = (i: number) => stationsEnd + i * T.stagger
  const pillDelay = (i: number) => legDelay(i) + T.travel * 0.6
  const requestDelay = (i: number) => legDelay(i) + T.travel * 0.35
  const lastLegEnd = legs.length ? pillDelay(Math.min(legs.length, n - 1) - 1) + T.label : stationsEnd

  return (
    <div className={`relative mx-auto ${className}`} style={{ width: W, height: H }}>
      <svg className="absolute inset-0" width={W} height={H} style={{ overflow: 'visible' }} aria-hidden>
        <defs>
          {/* ONE payload arrowhead for every leg, because every leg carries the
              same thing in the same direction. */}
          <marker
            id={`rf-${uid}-payload`}
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth={3.6}
            markerHeight={3.6}
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.brand} />
          </marker>
          {/* The request head is deliberately small: it is a knock on the door,
              not a delivery. */}
          <marker
            id={`rf-${uid}-request`}
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth={5}
            markerHeight={5}
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.teal} />
          </marker>
        </defs>

        {/* THE RAIL. One stroke, edge to edge, drawn before anything stands on
            it. It runs BEHIND the opaque cards, so it is never broken, only
            occluded, which is what makes the stops read as one journey. */}
        <motion.path
          d={`M ${railFrom} ${RAIL_Y} L ${railTo} ${RAIL_Y}`}
          fill="none"
          stroke={washOf(colors.brandDeep, 0.22)}
          strokeWidth={5}
          strokeLinecap="round"
          initial={instant ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: T.draw * t, delay: railStart * t, ease: E.inOut }}
        />

        {/* Hub stem + rail node: the raised card visibly attaches to the line. */}
        {stations.map((s, i) =>
          isHub(s) ? (
            <motion.g
              key={`stem${i}`}
              initial={instant ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: T.label * t, delay: (stationDelay(i) + T.enter * 0.5) * t, ease: E.out }}
            >
              <path
                d={`M ${centers[i]} ${HUB_BOTTOM} L ${centers[i]} ${RAIL_Y}`}
                stroke={stationColor(s)}
                strokeWidth={3}
                strokeLinecap="round"
              />
              <circle cx={centers[i]} cy={RAIL_Y} r={8} fill={colors.white} stroke={stationColor(s)} strokeWidth={3} />
            </motion.g>
          ) : null,
        )}

        {/* THE PAYLOAD. Every leg paints its own segment OF the rail, left to
            right, `stations[i]` -> `stations[i + 1]`, in the same weight and the
            same colour. `docker pull` is drawn hub -> machine, because that is
            the way the image moves. Nothing here ever points back up the chain. */}
        {legs.map((_leg, i) => {
          if (i + 1 >= n) return null
          return (
            <motion.path
              key={`leg${i}`}
              d={`M ${railOut(i)} ${RAIL_Y} L ${railIn(i + 1)} ${RAIL_Y}`}
              fill="none"
              stroke={colors.brand}
              strokeWidth={5}
              strokeLinecap="round"
              markerEnd={`url(#rf-${uid}-payload)`}
              initial={instant ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: T.travel * t, delay: legDelay(i) * t, ease: E.inOut }}
            />
          )
        })}

        {/* WHO ASKED. A hairline dashed drop off the rail, under the cards, back
            to the station that was asked. The request really does travel this
            way; the image does not, which is why this is 1.5px and dashed and
            the payload above it is 5px and solid. */}
        {legs.map((leg, i) => {
          if (i + 1 >= n || !askedByReceiver(leg)) return null
          const x2 = centers[i + 1]
          /* The asked-of station's end is offset off its centre line when that
             station is the raised hub: dead centre puts this line, and its
             arrowhead, underneath the hub's own stem and rail node, where the
             head is simply invisible. 30px left of centre clears both and still
             lands under the hub card. */
          const x1 = centers[i] - (isHub(stations[i]) ? 30 : 0)
          const d = [
            `M ${x2} ${bottomOf(i + 1) + 8}`,
            `L ${x2} ${REQ_Y - 14}`,
            `Q ${x2} ${REQ_Y} ${x2 - 14} ${REQ_Y}`,
            `L ${x1 + 14} ${REQ_Y}`,
            `Q ${x1} ${REQ_Y} ${x1} ${REQ_Y - 14}`,
            `L ${x1} ${bottomOf(i) + 6}`,
          ].join(' ')
          return (
            <motion.path
              key={`ask${i}`}
              d={d}
              fill="none"
              stroke={washOf(colors.teal, 0.7)}
              strokeWidth={1.5}
              strokeDasharray="6 7"
              strokeLinecap="round"
              markerEnd={`url(#rf-${uid}-request)`}
              initial={instant ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: T.travel * 0.7 * t, delay: requestDelay(i) * t, ease: E.inOut }}
            />
          )
        })}
      </svg>

      {/* A finite beacon on the hub node. It says "this is what the others reach
          toward", it runs twice, and then it is gone. The one emphasis beat. */}
      {!instant && !reduce &&
        stations.map((s, i) =>
          isHub(s) ? (
            <motion.span
              key={`beacon${i}`}
              className="pointer-events-none absolute rounded-pill"
              style={{
                left: centers[i] - 18,
                top: RAIL_Y - 18,
                width: 36,
                height: 36,
                border: `2px solid ${washOf(stationColor(s), 0.55)}`,
              }}
              initial={{ opacity: 0, transform: 'scale(0.5)' }}
              animate={{ opacity: [0, 0.7, 0], transform: ['scale(0.5)', 'scale(1.15)', 'scale(1.5)'] }}
              transition={{
                duration: T.accent,
                times: [0, 0.4, 1],
                delay: stationDelay(i) + T.enter,
                repeat: 1,
                /* Three keyframes is two segments. One four-number curve here
                   would be read as four per-segment easings. */
                /* The cast is `timing.ts`: `perSegment`'s default argument
                   narrows its curve parameter to `E.inOut`'s own four literals,
                   so passing any other house curve is a type error. */
                ease: perSegment(3, E.pop as unknown as typeof E.inOut),
              }}
            />
          ) : null,
        )}

      {stations.map((s, i) => (
        <StationCard
          key={`st${i}`}
          station={s}
          cx={centers[i]}
          delay={stationDelay(i)}
          t={t}
          instant={instant}
        />
      ))}

      {/* THE COMMANDS. On the rail, in mono, because the command is the edge. */}
      {legs.map((leg, i) => {
        if (i + 1 >= n) return null
        const gapStart = centers[i] + halfOf(i)
        const gapEnd = centers[i + 1] - halfOf(i + 1)
        const mid = (railOut(i) + railIn(i + 1)) / 2
        /* The gloss stays inside the clear gap between the two cards, so it can
           wrap without ever reaching a card. */
        const subWidth = Math.max(gapEnd - gapStart - 8, 120)
        return (
          /* The wrapper owns the centring as a STATIC transform and the inner
             element owns the animated one: framer rewrites `transform` every
             frame, so one element can never hold both. */
          <div
            key={`pill${i}`}
            className="absolute"
            style={{ left: mid, top: RAIL_Y, transform: 'translate(-50%, -50%)' }}
          >
            <motion.div
              className="relative"
              initial={instant ? false : { opacity: 0, transform: 'translateY(6px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              transition={{ duration: T.label * t, delay: pillDelay(i) * t, ease: E.out }}
            >
              <div
                className="flex items-center gap-1.5 whitespace-nowrap rounded-pill border-2 bg-surface-card px-3 py-1 font-mono text-body-sm font-bold shadow-card-soft"
                style={{ borderColor: colors.brand, color: colors.brand }}
              >
                {leg.label}
              </div>
              {leg.sub && (
                <p
                  className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 text-center text-body-sm leading-tight"
                  style={{ width: subWidth, color: colors.muted }}
                >
                  {leg.sub}
                </p>
              )}
            </motion.div>
          </div>
        )
      })}

      {/* The caption for the request hairline. It says the one thing the two
          commands actually differ on, and it sits on the hairline's own track so
          it can never be mistaken for a label on the rail. */}
      {legs.map((leg, i) => {
        if (i + 1 >= n || !askedByReceiver(leg)) return null
        return (
          <motion.p
            key={`ask-label${i}`}
            className="absolute text-center text-body-sm leading-tight"
            style={{
              left: (centers[i] + centers[i + 1]) / 2,
              top: REQ_Y + 10,
              width: 300,
              transform: 'translateX(-50%)',
              color: colors.teal,
            }}
            initial={instant ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: T.label * t, delay: (requestDelay(i) + T.travel * 0.5) * t, ease: E.out }}
          >
            the machine asks for it
          </motion.p>
        )
      })}

      {caption && (
        <motion.p
          className="absolute left-0 right-0 text-center text-body-sm font-semibold"
          style={{ top: captionTop, color: colors.body }}
          initial={instant ? false : { opacity: 0, transform: 'translateY(6px)' }}
          animate={{ opacity: 1, transform: 'translateY(0px)' }}
          transition={{ duration: T.label * t, delay: lastLegEnd * t, ease: E.out }}
        >
          {caption}
        </motion.p>
      )}
    </div>
  )
}

export default RailFlow
