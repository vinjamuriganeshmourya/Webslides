import { useId } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { iconByName } from '@/ui/icons'
import { E, T, perSegment } from './timing'
import type { FlowFigureProps, FlowLeg, FlowStation, StationLogo } from './types'

/**
 * CargoTrack — the figure argues that ONE object made the journey.
 *
 * WHAT IT ARGUES
 * Slide 20 exists to land a single sentence: the environment travelled inside
 * the image. Three boxes with arrows between them cannot say that, because
 * three boxes are three subjects and the room reads them as three places that
 * happen to be connected. Here the subject is the CARGO. A sealed, layered tile
 * carrying the image name is drawn once, and it is the only thing that moves.
 * The stations are demoted to platforms hanging off a rail: stops the cargo
 * passes through, not the point of the picture. When the tile is still sitting
 * on the last platform, unchanged, having crossed two machines and a registry,
 * the argument has already been made without a caption.
 *
 * WHY THIS GEOMETRY
 * A rail plus platforms, rather than a row of peers. Every station hangs BELOW
 * a single continuous line, so the line — the route — is the spine of the
 * figure and the stations are visibly subordinate to it. The cargo rides ON the
 * rail: the tile sits directly above the line with a short coupling and a shoe
 * that touch it, so at rest it is parked AT a station and not floating in the
 * white space above the figure. Each leg pill hangs UNDER the segment it names,
 * on a tick drawn down from the middle of that segment, so a label is attached
 * to a stretch of track and not filed in a band of its own. Both of those are
 * fixes: the first pass parked the tile in the top-right corner with nothing
 * under it, and floated the two pills in a row along the top edge where neither
 * one touched the segment it described.
 *
 * HOW PUSH AND PULL ARE DRAWN, AND WHAT THE FIRST PASS GOT WRONG
 * The first pass read a `direction: 'forward' | 'reverse'` field and drew a
 * `reverse` leg right to left, in teal, with the arrowhead at the NEAR end, on
 * the theory that a pull is a request travelling back to the hub. On screen that
 * put the blue push head and the teal pull head nose to nose at the hub, which
 * in a still frame reads as the image arriving at Docker Hub and bouncing off
 * it. Worse, it is false: `docker pull` moves image data OUT of the registry and
 * onto the machine. The payload travels along the chain in both commands.
 *
 * So: every payload arrow on this figure runs `stations[i]` to `stations[i + 1]`
 * at full weight, with the head at the far end. Nothing points back up the
 * chain at full weight, ever. The one thing that differs between the two
 * commands is WHO TYPED IT, and that is `leg.issuedBy`: `left` for a leg the
 * station before it runs (`docker push`, `docker build`), `right` for a leg the
 * station after it runs (`docker pull`). A `right` leg is marked three ways,
 * all of them subordinate to the payload arrow: the segment is teal instead of
 * brand blue, a 1.5px dashed hairline with a 3px head runs back to the hub in
 * the strip above the rail, and the pill carries a hairline footer naming the
 * station that asked. A hairline is not a shipment, and it is never the only
 * mark on the leg.
 *
 * WHAT IT COSTS (worse than the other variants)
 * 1. THE FIGURE CANNOT NAME ITS OWN CARGO, SO IT GUESSES. `FlowFigureProps` has
 *    no field for the thing that travels, because the other three variants do
 *    not draw one. `cargoName()` therefore INFERS the tile's label from station
 *    copy: it takes the `hub` station's caption, falls back to the first
 *    station's caption, and keeps only the text after the last `/`. That works
 *    on this deck because the hub caption happens to be
 *    `ravi123/nxttrendz-backend`, and it is a guess everywhere else: a hub
 *    captioned `free tier` would put "free tier" on the tile, and a figure whose
 *    stations carry no captions leaves the tile as an unlabelled stack of
 *    layers. ONE OPTIONAL CONTRACT FIELD WOULD END THE GUESS — see the note on
 *    `cargoName` for the exact shape.
 * 2. It is the slowest of the four to read: a journey has to be watched, so the
 *    tile parks at its last stop about 2.2s in, and the caption lands at 2.7s.
 *    Point at it mid-sentence and you may be pointing at a rail the cargo has
 *    not reached yet.
 * 3. It cannot carry a branch. One rail, one cargo, one route: a fan-out from
 *    the hub to three machines has to become three separate stops in a line,
 *    which quietly claims an order that does not exist.
 * 4. Station copy has to be short. A platform is 178px wide at four stations,
 *    so "nxttrendz-backend on your laptop" has to become "your laptop" with the
 *    detail in the caption. A boxes-in-a-row figure is more forgiving.
 *
 * MOTION BEATS (played once, then it stops; `useInstant` mounts the last frame)
 * Every duration and delay below is a sum of `T` members from `./timing`, and
 * every curve is an `E` member. There are no literal seconds in this file.
 *   1. `rail`      — Line drawing, `T.draw`. The route traces itself, and it is
 *                    the slowest beat because it leads.
 *   2. `platforms` — Stagger of Scale in, `T.stagger` apart, `T.enter` each,
 *                    left to right, so stations exist before any leg joins them.
 *   3. `hub lift`  — the hub takes its turn in the same stagger but on `E.pop`,
 *                    so it overshoots where its neighbours do not.
 *   4. `hub ring`  — Pulse, exactly one ring, `T.accent`, as the hub lands. The
 *                    single emphasis beat in the figure, and it does not repeat.
 *   5. `cargo`     — Scale in on the first platform, `T.enter`, on the same
 *                    beat as that platform, so the tile and its stop arrive
 *                    together and the tile is never a mark on its own.
 *   6. per leg, in story order:
 *        `leg line`  — Line drawing along the segment, `T.enter`, always drawn
 *                      source to target. Shorter than the rail on purpose: the
 *                      rail owns `T.draw` so that it stays the slowest mark.
 *        `request`   — only on an `issuedBy: 'right'` leg. Fade in with the
 *                      line, `T.label`. Dashed, so it cannot animate its own
 *                      path length, which is right for a subordinate mark.
 *        `leg pill`  — Fade in + rise, `T.label`, on the tail of the line.
 *        `cargo run` — Translate, `T.travel`, `E.inOut` per segment. A
 *                      Continuity transition: the tile keeps its identity across
 *                      every stop, which is the whole figure. It starts
 *                      `T.stagger` into the line so the cargo rides the mark
 *                      that is still being drawn.
 *   7. `caption`   — Fade in, last, once the cargo has parked.
 */

/* ---------------------------------------------------------------- */
/* Geometry. Fixed pixels: the canvas is 1280x720 and never reflows. */
/* ---------------------------------------------------------------- */

/** Never wider than 980. */
const W = 960

const CHIP_W = 196
const CHIP_H = 58
/** Tile bottom to rail. The coupling and the shoe live in here. */
const COUPLE_H = 24
const CARGO_TOP = 6
const RAIL_Y = CARGO_TOP + CHIP_H + COUPLE_H
/** The dashed request hairline, in the strip between rail and tile. */
const REQ_Y = RAIL_Y - 12
/** Pill tick down from the segment, then the pill. */
const TICK_H = 14
const PILL_TOP = RAIL_Y + TICK_H
/** Deep enough that a pill plus its hairline footer clears the platform tops:
 *  TICK_H + the tallest pill (about 64px) + a few px of air. */
const STEM_H = 90
const ST_TOP = RAIL_Y + STEM_H
const ST_H = 104
const HUB_EXTRA = 18
const H = ST_TOP + ST_H + HUB_EXTRA

/* --- the beat map. Sums of `T`, never a literal second. ---------- */
const RAIL_AT = T.lead
const ST_AT = T.lead + T.stagger * 1.5
const ST_STEP = T.stagger
/** The cargo arrives with the platform it is standing on. */
const CARGO_AT = ST_AT
/** A leg opens as the cargo on the leg before it is settling, not after. */
const LEG_GAP = T.travel - T.stagger * 0.5

/** Only these five PNGs exist, and each path must be a literal string or the
 *  single-file build inlines nothing and ships a broken image. */
const LOGO_SRC: Record<StationLogo, string> = {
  docker: '/assets/tech/docker.png',
  git: '/assets/tech/git.png',
  python: '/assets/tech/python.png',
  nodejs: '/assets/tech/nodejs.png',
  makefile: '/assets/tech/makefile.png',
}

/** framer wants a mutable tuple; `E` and `perSegment` hand back readonly ones. */
const c4 = (curve: readonly number[]) => [...curve] as [number, number, number, number]

/**
 * Who typed it, defaulting to the station before the leg. This NEVER decides
 * which way the payload arrow points — see the header. It picks the leg's colour
 * and whether the subordinate request marks are drawn.
 */
const issuer = (leg: FlowLeg): 'left' | 'right' => leg.issuedBy ?? 'left'
const asked = (leg: FlowLeg) => issuer(leg) === 'right'
const legColor = (leg: FlowLeg) => (asked(leg) ? colors.teal : colors.brand)

/**
 * The cargo's name, INFERRED, because the contract has no field for it. The
 * tile borrows the image name from whichever station is the `hub` — a registry
 * caption IS the image name on this deck — and falls back to the first
 * station's caption. The repository owner is the hub's business, so
 * `ravi123/nxttrendz-backend` is trimmed to `nxttrendz-backend`: what travels
 * is the image, not the account it is filed under.
 *
 * THE GUESS IS LOAD-BEARING AND IT IS WRONG AS OFTEN AS IT IS RIGHT. One
 * optional field on `FlowFigureProps` would remove it entirely:
 *
 *   cargo?: { label: ReactNode; kind?: ReactNode }
 *
 * `label` is what is written on the tile (`nxttrendz-backend`) and `kind` is
 * the eyebrow above it, which is hardcoded to "image" today (`image`, `commit`,
 * `bundle`). Optional, so the other three variants ignore it and nothing else
 * in the lab has to change; when it is absent this function stays as the
 * fallback. Until that field exists, a figure whose hub caption is not an image
 * name will put the wrong words on the tile, and only a human reading the slide
 * will notice.
 */
function cargoName(stations: FlowStation[]): string | null {
  const hub = stations.find((s) => s.kind === 'hub')
  const raw = [hub?.caption, stations[0]?.caption].find((c) => typeof c === 'string') as
    | string
    | undefined
  if (!raw) return null
  const tail = raw.split('/').pop()
  return tail && /[a-z]/.test(tail) ? tail.trim() : null
}

/* ---------------------------------------------------------------- */

/** Three stacked layers: the tile is sealed, and it has a stack inside it. */
function Layers({ color }: { color: string }) {
  return (
    <span className="flex shrink-0 flex-col gap-1">
      {[0.95, 0.7, 0.45].map((a, i) => (
        <span
          key={i}
          className="block rounded-pill"
          style={{ width: 22, height: 4, background: color, opacity: a }}
        />
      ))}
    </span>
  )
}

function Platform({ station, hub }: { station: FlowStation; hub: boolean }) {
  const Icon = station.icon ? iconByName[station.icon] : null
  const edge = hub ? colors.brand : colors.line
  return (
    <div
      className={`flex h-full flex-col items-center justify-center gap-1.5 rounded-card border-2 bg-surface-card px-3 text-center ${
        hub ? 'shadow-card' : 'shadow-card-soft'
      }`}
      style={{ borderColor: edge, background: hub ? `${colors.brand}0A` : colors.white }}
    >
      {station.logo ? (
        <img
          src={LOGO_SRC[station.logo]}
          alt=""
          draggable={false}
          className="object-contain"
          style={{ height: hub ? 34 : 26, width: hub ? 34 : 26 }}
        />
      ) : Icon ? (
        <span
          className="grid place-items-center rounded-xl"
          style={{
            height: hub ? 34 : 28,
            width: hub ? 34 : 28,
            background: `${colors.brand}14`,
            color: colors.brand,
          }}
        >
          <Icon width={hub ? 19 : 16} height={hub ? 19 : 16} />
        </span>
      ) : null}
      <p
        className="font-heading font-bold leading-tight"
        style={{ color: hub ? colors.brandDeep : colors.ink, fontSize: hub ? 18 : 16 }}
      >
        {station.label}
      </p>
      {station.caption && (
        <p className="font-mono text-xs leading-tight" style={{ color: colors.body }}>
          {station.caption}
        </p>
      )}
    </div>
  )
}

export function CargoTrack({ stations, legs, caption, className = '' }: FlowFigureProps) {
  const instant = useInstant()
  const t = instant ? 0 : 1
  /* useId() emits colons, which are legal in an id but break `url(#…)`. */
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')

  const n = stations.length
  const cardW = n <= 3 ? 210 : 178
  const hubW = cardW + 36
  const pad = Math.max(hubW / 2, CHIP_W / 2) + 6
  const step = n > 1 ? (W - pad * 2) / (n - 1) : 0
  const cx = (i: number) => pad + i * step

  /* --- schedule. The legs open as the last platform lands, so the journey
     overlaps the tail of the stagger instead of queueing behind it. --------- */
  let cursor = ST_AT + T.stagger * Math.max(0, n - 1)
  const beats = legs.slice(0, Math.max(0, n - 1)).map((leg) => {
    const lineAt = cursor
    const pillAt = cursor + T.stagger * 2
    const runAt = cursor + T.stagger
    cursor = runAt + LEG_GAP
    return { leg, request: asked(leg), lineAt, pillAt, runAt }
  })
  const lastRun = beats.length ? beats[beats.length - 1].runAt : 0
  /* The cargo track's keyframe times MUST end at exactly 1. Leaving slack after
     the last keyframe made framer interpolate past it and walk the tile back to
     the first platform before snapping to the last one. */
  const journeyEnd = beats.length ? lastRun + T.travel : CARGO_AT + T.enter
  const captionAt = journeyEnd + T.stagger

  /* The cargo's whole journey as one keyframe track, so the tile is a single
     element that never remounts: that is what makes it read as one object. */
  const lastStop = Math.min(n - 1, beats.length)
  const total = journeyEnd
  const xs: string[] = [`translateX(${cx(0) - CHIP_W / 2}px)`]
  const times: number[] = [0]
  beats.forEach((b, i) => {
    const from = `translateX(${cx(i) - CHIP_W / 2}px)`
    const to = `translateX(${cx(i + 1) - CHIP_W / 2}px)`
    xs.push(from, to)
    times.push(Math.min(1, b.runAt / total), Math.min(1, (b.runAt + T.travel) / total))
  })
  /* Float division can land the final time a hair over 1, and framer answers a
     time above 1 by flashing keyframe zero on the last frame: the tile blinked
     back to the first platform before settling on the last one. Pin it. */
  if (times.length > 1) times[times.length - 1] = 1
  const parked = `translateX(${cx(lastStop) - CHIP_W / 2}px)`

  const name = cargoName(stations)

  return (
    <div className={className}>
      <div className="relative" style={{ width: W, height: H }}>
        {/* ---- the route, and the coloured legs laid over it ---- */}
        <svg
          className="absolute left-0 top-0"
          width={W}
          height={H}
          style={{ overflow: 'visible' }}
          aria-hidden
        >
          <defs>
            {/* the payload head, at full weight, in each leg colour */}
            <marker
              id={`ct-p-${uid}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.brand} />
            </marker>
            <marker
              id={`ct-pt-${uid}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.teal} />
            </marker>
            {/* the request head. Deliberately tiny, and the only mark on this
                figure that points back up the chain. */}
            <marker
              id={`ct-q-${uid}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="3.4"
              markerHeight="3.4"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.teal} opacity={0.75} />
            </marker>
          </defs>

          {/* beat 1 — Line drawing: the route exists before anything stands on it */}
          <motion.path
            d={`M 8 ${RAIL_Y} L ${W - 8} ${RAIL_Y}`}
            fill="none"
            stroke={colors.line}
            strokeWidth={5}
            strokeLinecap="round"
            initial={instant ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: T.draw * t, delay: RAIL_AT * t, ease: c4(E.out) }}
          />

          {/* the stems: each platform hangs off the rail it serves */}
          {stations.map((s, i) => (
            <motion.line
              key={`stem${i}`}
              x1={cx(i)}
              y1={RAIL_Y}
              x2={cx(i)}
              y2={ST_TOP}
              stroke={s.kind === 'hub' ? colors.brand : colors.line}
              strokeWidth={s.kind === 'hub' ? 3 : 2}
              initial={instant ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: T.label * t, delay: (ST_AT + i * ST_STEP) * t }}
            />
          ))}

          {/* beat 6a — the PAYLOAD. Always source → target, always full weight,
              head at the far end. Colour says who typed the command; it never
              says which way the bytes went. */}
          {beats.map((b, i) => {
            const a = cx(i)
            const z = cx(i + 1)
            return (
              <motion.path
                key={`leg${i}`}
                d={`M ${a + 8} ${RAIL_Y} L ${z - 8} ${RAIL_Y}`}
                fill="none"
                stroke={legColor(b.leg)}
                strokeWidth={5}
                strokeLinecap="round"
                markerEnd={`url(#ct-${b.request ? 'pt' : 'p'}-${uid})`}
                initial={instant ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: T.enter * t, delay: b.lineAt * t, ease: c4(E.out) }}
              />
            )
          })}

          {/* beat 6a' — the REQUEST, on a leg the far station typed. A hairline,
              dashed, a third the weight of the payload, in the strip above the
              rail. It fades in rather than drawing itself, because a dashed
              stroke and framer's pathLength both own strokeDasharray. */}
          {beats.map((b, i) =>
            b.request ? (
              <motion.path
                key={`req${i}`}
                d={`M ${cx(i + 1) - 16} ${REQ_Y} L ${cx(i) + 18} ${REQ_Y}`}
                fill="none"
                stroke={colors.teal}
                strokeWidth={1.5}
                strokeDasharray="5 4"
                opacity={0.75}
                markerEnd={`url(#ct-q-${uid})`}
                initial={instant ? false : { opacity: 0 }}
                animate={{ opacity: 0.75 }}
                transition={{ duration: T.label * t, delay: b.lineAt * t, ease: c4(E.out) }}
              />
            ) : null,
          )}

          {/* the tick that ties each pill to its own segment */}
          {beats.map((b, i) => (
            <motion.line
              key={`tick${i}`}
              x1={(cx(i) + cx(i + 1)) / 2}
              y1={RAIL_Y}
              x2={(cx(i) + cx(i + 1)) / 2}
              y2={PILL_TOP}
              stroke={legColor(b.leg)}
              strokeWidth={2}
              initial={instant ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: T.label * t, delay: b.pillAt * t, ease: c4(E.out) }}
            />
          ))}
        </svg>

        {/* ---- collars: where a platform meets the rail. The hub's is fat. ---- */}
        {stations.map((s, i) => {
          const hub = s.kind === 'hub'
          const d = hub ? 16 : 10
          return (
            <motion.span
              key={`collar${i}`}
              className="absolute rounded-pill border-2"
              style={{
                left: cx(i) - d / 2,
                top: RAIL_Y - d / 2,
                width: d,
                height: d,
                borderColor: hub ? colors.brand : colors.line,
                background: colors.white,
              }}
              initial={instant ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: T.enter * t, delay: (ST_AT + i * ST_STEP) * t, ease: c4(E.out) }}
            />
          )
        })}

        {/* beat 4 — Pulse. One ring off the hub collar as it lands, then gone. */}
        {stations.map((s, i) =>
          s.kind === 'hub' ? (
            <motion.span
              key={`ring${i}`}
              className="pointer-events-none absolute rounded-pill"
              style={{
                left: cx(i) - 11,
                top: RAIL_Y - 11,
                width: 22,
                height: 22,
                border: `2px solid ${colors.brand}`,
              }}
              initial={instant ? false : { opacity: 0.45, scale: 0.97 }}
              animate={{ opacity: 0, scale: 2.4 }}
              transition={{
                duration: T.accent * t,
                delay: (ST_AT + i * ST_STEP + T.enter) * t,
                ease: c4(E.out),
              }}
            />
          ) : null,
        )}

        {/* ---- beat 2/3 — the platforms, staggered left to right ---- */}
        {stations.map((s, i) => {
          const hub = s.kind === 'hub'
          const w = hub ? hubW : cardW
          return (
            <div
              key={`st${i}`}
              className="absolute"
              style={{
                left: cx(i) - w / 2,
                top: ST_TOP,
                width: w,
                height: hub ? ST_H + HUB_EXTRA : ST_H,
              }}
            >
              <motion.div
                className="h-full"
                initial={instant ? false : { opacity: 0, scale: 0.97, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: T.enter * t,
                  delay: (ST_AT + i * ST_STEP) * t,
                  /* the hub overshoots where its neighbours do not */
                  ease: c4(hub ? E.pop : E.out),
                }}
              >
                <Platform station={s} hub={hub} />
              </motion.div>
            </div>
          )
        })}

        {/* ---- beat 6b — the leg labels, hanging under their own segment ---- */}
        {beats.map((b, i) => {
          const color = legColor(b.leg)
          const Arrow = iconByName.arrow
          const target = stations[i + 1]
          const source = stations[i]
          return (
            <div
              key={`pill${i}`}
              className="absolute"
              style={{
                left: (cx(i) + cx(i + 1)) / 2,
                top: PILL_TOP,
                transform: 'translateX(-50%)',
              }}
            >
              <motion.div
                className="rounded-card border-2 bg-surface-card px-3 py-1.5 shadow-card-soft"
                style={{ borderColor: color, background: `${color}0A` }}
                initial={instant ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: T.label * t, delay: b.pillAt * t, ease: c4(E.out) }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-center">
                    <span
                      className="block whitespace-nowrap font-mono text-body-sm font-bold"
                      style={{ color }}
                    >
                      {b.leg.label}
                    </span>
                    {b.leg.sub && (
                      <span className="block whitespace-nowrap text-xs" style={{ color: colors.body }}>
                        {b.leg.sub}
                      </span>
                    )}
                  </span>
                  {/* the payload runs left to right on every leg, so the glyph
                      inside the pill does too */}
                  <Arrow width={16} height={16} style={{ color }} className="shrink-0" />
                </div>
                {/* WHO TYPED IT, as a hairline footer: smaller, muted, under a
                    rule, and never a second arrow. */}
                <div
                  className="mt-1 flex items-center justify-center gap-1 border-t pt-1"
                  style={{ borderColor: `${color}33` }}
                >
                  <span
                    className="block h-0 w-3 shrink-0 border-t border-dashed"
                    style={{ borderColor: b.request ? colors.teal : colors.muted }}
                  />
                  <span
                    className="whitespace-nowrap text-[10px] leading-none"
                    style={{ color: colors.muted }}
                  >
                    {b.request ? 'asked for by ' : 'typed on '}
                    {(b.request ? target : source)?.label}
                  </span>
                </div>
              </motion.div>
            </div>
          )
        })}

        {/* ---- beat 5/6c — THE CARGO. The only thing that moves, and it rides
             ON the rail: tile, coupling, shoe, all in one moving element. ---- */}
        <motion.div
          className="absolute"
          style={{ left: 0, top: CARGO_TOP, width: CHIP_W, height: CHIP_H + COUPLE_H }}
          initial={instant ? false : { transform: xs[0] }}
          animate={{ transform: instant ? parked : xs }}
          transition={
            instant
              ? { duration: 0 }
              : {
                  duration: total,
                  times,
                  /* ONE EASING PER SEGMENT, not one for the whole track. A
                     four-number curve on a five-keyframe track is read as four
                     per-segment easings, and the cargo ran to the hub and then
                     all the way back to the start. `perSegment` exists for
                     exactly this. */
                  ease: perSegment(xs.length).map(c4),
                }
          }
        >
          <motion.div
            className="flex flex-col items-center"
            initial={instant ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: T.enter * t, delay: CARGO_AT * t, ease: c4(E.out) }}
          >
            <div
              className="flex w-full items-center gap-3 rounded-card border-2 bg-surface-card px-3 shadow-card"
              style={{ borderColor: colors.brand, height: CHIP_H, background: colors.white }}
            >
              <Layers color={colors.brand} />
              <span className="min-w-0">
                <span
                  className="block text-xs font-bold uppercase tracking-wide"
                  style={{ color: colors.muted }}
                >
                  image
                </span>
                {name && (
                  <span
                    className="block truncate font-mono text-xs font-bold"
                    style={{ color: colors.brandDeep }}
                  >
                    {name}
                  </span>
                )}
              </span>
            </div>
            {/* the coupling: this is what puts the tile ON the rail rather than
                floating above it, and it travels with the tile */}
            <span
              className="block"
              style={{ width: 2, height: COUPLE_H - 4, background: colors.brand }}
            />
            <span
              className="block rounded-pill"
              style={{ width: 26, height: 4, background: colors.brand }}
            />
          </motion.div>
        </motion.div>
      </div>

      {caption && (
        <motion.p
          className="text-center text-body-sm"
          style={{ width: W, color: colors.body }}
          initial={instant ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: T.label * t, delay: captionAt * t, ease: c4(E.out) }}
        >
          {caption}
        </motion.p>
      )}
    </div>
  )
}

export default CargoTrack
