/**
 * A real screen capture, framed for a slide, with an annotation layer.
 *
 * Hard rule 11: a raw capture is evidence, not a slide asset. Crop where a
 * crop keeps the meaning, keep the context that carries it (a terminal keeps
 * its `PS <path>>` prompt, a browser keeps its address bar), and never retouch
 * the pixels: if a capture is wrong, re-run and capture again. Nothing in this
 * file alters the image. Every mark is drawn OVER it, and the magnifier is the
 * same file shown again through a smaller window.
 *
 * Console captures are the case the annotation layer exists for. A full AWS
 * console screen is 1568 or 1920 px wide and lands on the slide at roughly
 * half size, so a "click here" target that was 30 px in the capture is 15 px
 * in the room. Cropping it would put the target under the eye but lose the
 * one thing a beginner needs, which is where on the screen it lives. So the
 * screen stays whole and the layer does the pointing:
 *
 *   highlight / highlights   the box, or several boxes revealed in order
 *   spotlight                dim everything that is not a box
 *   step                     a circled number on a box, so the caption can
 *                            say "1, 2, 3"
 *   inset                    a 2x magnifier of a box beside or below the
 *                            capture, for targets too small to read
 *   pointer                  the label moved clear of the box, with an arrow
 *                            back to it
 *
 * One box is still the default and still enough for most captures. A deck
 * where every capture wears three boxes and a spotlight teaches the learner
 * to ignore boxes. Reach for the extras when the target is small, when the
 * order of clicks matters, or when the screen is busy enough that a box alone
 * does not win the eye.
 */

import { useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { alpha, mix, onColor, warningSoft, warningDeep } from './tokenHelpers'
import { annotation } from './annotationPreset'
import { Reveal, RevealGroup } from '@/motion/Reveal'
import { useInstant } from '@/motion/instant'

export type ShotLabelSide = 'below' | 'above' | 'left' | 'right'

export interface ShotHighlight {
  /** Box position as a percentage of the image, so it survives any render size. */
  left: number
  top: number
  width: number
  height: number
  /** Short label for the box. Sits just below it unless `labelAt` says otherwise. */
  label?: ReactNode
  /** Circled number at the box's top-left corner, matching a numbered caption. */
  step?: number
  /**
   * Which corner the circled number sits on.
   *
   * Default: top-left, or top-right when the label sits left or above. Two
   * boxes stacked near one another put their badges (and one box's badge and
   * the other's label pill) on top of each other, which a reviewer sees
   * immediately and no harness can: `qa`, `align-check` and `video-safe` all
   * measure the frame, not what is drawn inside it (hard rule 17). So a slide
   * that stacks boxes moves the lower badge to the corner furthest from its
   * neighbour.
   */
  badgeAt?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  /** Which side of the box the label sits on. */
  labelAt?: ShotLabelSide
  /** Move the label clear of the box and draw an arrow from it back to the box. */
  pointer?: boolean
  /** Force the magnifier on or off for this box, overriding Shot's `inset`. */
  inset?: boolean
}

export interface ShotInsetOptions {
  /** Where the magnified copies go. Default right of the capture. */
  at?: 'right' | 'bottom'
  /** Magnification of the rendered region. Default 2. */
  zoom?: number
  /** `small` (default) magnifies boxes narrower than 8 percent of the image; `all` magnifies every box. */
  only?: 'small' | 'all'
}

export interface AnnotatedShotProps {
  src: string
  alt: string
  /** What the learner is looking at. Not a repeat of the slide title. */
  caption?: ReactNode
  /** One box. Kept for every existing deck; the same as `highlights={[highlight]}`. */
  highlight?: ShotHighlight
  /** Several boxes, revealed one after another in array order. */
  highlights?: ShotHighlight[]
  /** Dim everything outside the boxes. */
  spotlight?: boolean
  /** Shorthand for `highlight.step` when there is one box. */
  step?: number
  /** Shorthand for `highlight.pointer` when there is one box. */
  pointer?: boolean
  /** Magnifier: `true` for every box, `'auto'` for boxes under 8 percent wide, or options. */
  inset?: boolean | 'auto' | ShotInsetOptions
  /** Width of the capture frame in px. Set it when insets sit beside the capture. */
  frameWidth?: number
  /** Technology mark shown beside the caption (rule 12: a named technology carries its logo). */
  mark?: { src: string; alt: string }
  className?: string
}

/* Geometry constants, all in px on the 1280x720 canvas. */
const GAP = 18 // frame to inset
const INSET_STACK_GAP = 12 // between insets
const SMALL_BOX_PCT = 8 // an inset is offered below this width
const MIN_SRC_W_PCT = 10 // the magnifier never shows less than this much of the image
const MIN_SRC_H_PCT = 14
const LABEL_GAP = 8
const POINTER_GAP = 46
const BADGE = 28
/** Clear air between the badge and the box's border, so the badge never sits on the content. */
const BADGE_GAP = 6

/**
 * WHICH SIDE OF ITS BOX A BADGE SITS ON, DECIDED FOR THE WHOLE SET.
 *
 * User, 2026-09-16, after badges collided on three slides: when two highlights
 * would put their badges near each other, alternate the sides, so the first
 * badge hangs off the left of its box and the next off the right. Boxes in a
 * capture are usually stacked down one column, so alternating is what actually
 * keeps them apart, and it needs no per-slide coordinates.
 *
 * Order of precedence: an explicit `badgeAt` on the box wins; then the label,
 * because a badge must never land on its own label; then the alternation.
 */
function badgeSide(box: ShotHighlight, index: number): { right: boolean; bottom: boolean } {
  if (box.badgeAt) return { right: box.badgeAt.endsWith('right'), bottom: box.badgeAt.startsWith('bottom') }
  const side = box.labelAt ?? 'below'
  if (box.label && (side === 'left' || side === 'above')) return { right: true, bottom: false }
  if (box.label && side === 'right') return { right: false, bottom: false }
  return { right: index % 2 === 1, bottom: false }
}

const DIM = colors.ink
const DIM_OPACITY = 0.58

/**
 * One highlight is amber, as it always was: it collides with neither the deck
 * blue nor a terminal's green. Several highlights each take their own colour,
 * in this order, so a learner can tell "the blue one" from "the orange one"
 * without reading the numbers. Every stop was checked on both the AWS dark
 * header and the light page.
 */
const SINGLE = colors.warning
const PALETTE = [colors.brand, colors.accent, colors.teal, colors.success]

export interface HighlightColor {
  line: string
  glow: string
  badgeText: string
  pillBg: string
  pillText: string
}

function paletteFor(count: number): HighlightColor[] {
  return Array.from({ length: count }, (_, i) => {
    const line = count === 1 ? SINGLE : PALETTE[i % PALETTE.length]
    return {
      line,
      glow: alpha(line, 0.45),
      badgeText: onColor(line),
      // The pill is a pale tint of the colour with the colour's own dark
      // reading as text: legible on the dark header and on the white page,
      // and still obviously "this box's colour".
      pillBg: line === SINGLE ? warningSoft : mix(line, colors.white, 0.84),
      pillText: line === SINGLE ? warningDeep : mix(line, colors.ink, 0.45),
    }
  })
}

type Anchor = 'right' | 'bottom' | 'top' | 'left'

interface InsetGeom {
  index: number
  x: number
  y: number
  w: number
  h: number
  src: { l: number; t: number; w: number; h: number } // % of image
  /** Which edge of the box the connector leaves from. */
  anchor: Anchor
  /** Connector points from the box up to (not including) the inset port. */
  route: [number, number][]
}

interface Rect {
  x: number
  y: number
  w: number
  h: number
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

/** The image region a magnifier shows: the box, widened to a legible minimum. */
function insetSource(b: ShotHighlight) {
  const w = Math.max(b.width, MIN_SRC_W_PCT)
  const h = Math.max(b.height, MIN_SRC_H_PCT)
  const l = clamp(b.left + b.width / 2 - w / 2, 0, 100 - w)
  const t = clamp(b.top + b.height / 2 - h / 2, 0, 100 - h)
  return { l, t, w, h }
}

function boxRect(b: ShotHighlight, W: number, H: number): Rect {
  return { x: (b.left / 100) * W, y: (b.top / 100) * H, w: (b.width / 100) * W, h: (b.height / 100) * H }
}

const LABEL_H = 30
const LABEL_CHAR_W = 8.5 // 14px JetBrains Mono, near enough for an obstacle
const LABEL_PAD = 24

/**
 * Where a box's label lands, estimated rather than measured: the connector
 * is laid out before the label has painted, and a pill of mono text is
 * predictable enough that a character count does the job.
 */
function labelRect(b: ShotHighlight, r: Rect): Rect | null {
  if (!b.label) return null
  const chars = typeof b.label === 'string' || typeof b.label === 'number' ? String(b.label).length : 14
  const w = chars * LABEL_CHAR_W + LABEL_PAD
  const gap = b.pointer ? POINTER_GAP : LABEL_GAP
  const side = b.labelAt ?? 'below'
  const cx = r.x + r.w / 2
  switch (side) {
    case 'above':
      return { x: b.pointer ? cx - w / 2 : r.x, y: r.y - gap - LABEL_H, w, h: LABEL_H }
    case 'left':
      return { x: r.x - gap - w, y: r.y + r.h / 2 - LABEL_H / 2, w, h: LABEL_H }
    case 'right':
      return { x: r.x + r.w + gap, y: r.y + r.h / 2 - LABEL_H / 2, w, h: LABEL_H }
    case 'below':
    default:
      return { x: b.pointer ? cx - w / 2 : r.x, y: r.y + r.h + gap, w, h: LABEL_H }
  }
}

/** Liang-Barsky: does the segment pass through the rectangle? */
function segmentHitsRect(x1: number, y1: number, x2: number, y2: number, r: Rect): boolean {
  let t0 = 0
  let t1 = 1
  const dx = x2 - x1
  const dy = y2 - y1
  const edges: [number, number][] = [
    [-dx, x1 - r.x],
    [dx, r.x + r.w - x1],
    [-dy, y1 - r.y],
    [dy, r.y + r.h - y1],
  ]
  for (const [p, q] of edges) {
    if (p === 0) {
      if (q < 0) return false
      continue
    }
    const t = q / p
    if (p < 0) {
      if (t > t1) return false
      if (t > t0) t0 = t
    } else {
      if (t < t0) return false
      if (t < t1) t1 = t
    }
  }
  return t0 <= t1
}

/** Midpoint of the box edge a connector leaves from. */
function anchorPoint(r: Rect, a: Anchor): [number, number] {
  switch (a) {
    case 'right':
      return [r.x + r.w, r.y + r.h / 2]
    case 'left':
      return [r.x, r.y + r.h / 2]
    case 'top':
      return [r.x + r.w / 2, r.y]
    case 'bottom':
    default:
      return [r.x + r.w / 2, r.y + r.h]
  }
}

/** Where the connector arrives on the inset. */
function insetPort(g: { x: number; y: number; w: number; h: number }, at: 'right' | 'bottom'): [number, number] {
  return at === 'right' ? [g.x, g.y + g.h / 2] : [g.x + g.w / 2, g.y]
}

const PLACE_STEP = 8
const OBSTACLE_PAD = 6

/**
 * Lay the magnifiers out beside (or under) the frame. Each one starts level
 * with its box, then the connector is tried from each edge of the box; if
 * every straight line would cut through another box, the inset slides along
 * its column (alternately further and nearer) until one is clear. A
 * connector that crosses a box the learner is meant to read is the collision
 * this exists to avoid.
 */
function layoutInsets(
  boxes: ShotHighlight[],
  wanted: boolean[],
  W: number,
  H: number,
  at: 'right' | 'bottom',
  zoom: number,
): InsetGeom[] {
  const rects = boxes.map((b) => boxRect(b, W, H))
  const pad = (r: Rect): Rect => ({ x: r.x - OBSTACLE_PAD, y: r.y - OBSTACLE_PAD, w: r.w + 2 * OBSTACLE_PAD, h: r.h + 2 * OBSTACLE_PAD })
  // Every box and every label is something the line must not cross. A box's
  // own label counts too: a connector through its own caption is no better.
  const obstacles = boxes.map((b, i) => {
    const l = labelRect(b, rects[i])
    return { box: pad(rects[i]), label: l ? pad(l) : null }
  })

  // Edges to try, nearest the inset first. The side a label sits on is skipped
  // so the line never runs through the label.
  const anchorsFor = (b: ShotHighlight): Anchor[] => {
    const order: Anchor[] = at === 'right' ? ['right', 'bottom', 'top'] : ['bottom', 'right', 'left']
    const labelSide = b.label ? (b.labelAt ?? 'below') : null
    const taken: Anchor | null = labelSide === 'below' ? 'bottom' : labelSide === 'above' ? 'top' : labelSide
    return order.filter((a) => a !== taken)
  }

  const items = boxes
    .map((b, index) => ({ b, index }))
    .filter(({ index }) => wanted[index])
    .map(({ b, index }) => {
      const src = insetSource(b)
      const w = (src.w / 100) * W * zoom
      const h = (src.h / 100) * H * zoom
      const r = rects[index]
      const preferred = at === 'right' ? clamp(r.y + r.h / 2 - h / 2, 0, Math.max(0, H - h)) : clamp(r.x + r.w / 2 - w / 2, 0, Math.max(0, W - w))
      const limit = at === 'right' ? Math.max(0, H - h) : Math.max(0, W - w)
      const others: Rect[] = obstacles.flatMap((o, i) => (i === index ? (o.label ? [o.label] : []) : [o.box, ...(o.label ? [o.label] : [])]))

      const clearOf = (x1: number, y1: number, x2: number, y2: number) => !others.some((o) => segmentHitsRect(x1, y1, x2, y2, o))
      const portFor = (candidate: number) =>
        insetPort(at === 'right' ? { x: W + GAP, y: candidate, w, h } : { x: candidate, y: H + GAP, w, h }, at)

      let along = preferred
      let anchor: Anchor = anchorsFor(b)[0]
      let route: [number, number][] = [anchorPoint(r, anchor)]
      let found = false

      // 1. A straight line from some edge of the box, sliding the inset along
      //    its column until one is clear.
      for (let k = 0; !found && k * PLACE_STEP <= limit; k++) {
        for (const sign of k === 0 ? [1] : [1, -1]) {
          const candidate = clamp(preferred + sign * k * PLACE_STEP, 0, limit)
          const [px, py] = portFor(candidate)
          const clear = anchorsFor(b).find((a) => {
            const [ax, ay] = anchorPoint(r, a)
            return clearOf(ax, ay, px, py)
          })
          if (clear) {
            along = candidate
            anchor = clear
            route = [anchorPoint(r, anchor)]
            found = true
            break
          }
        }
      }

      // 2. No straight line exists (a box between this one and the inset with
      //    labels closing the gaps). Leave the box at right angles instead,
      //    then run along a lane that is clear all the way to the inset.
      const departures: Anchor[] = at === 'right' ? ['bottom', 'top'] : ['right', 'left']
      for (let k = 0; !found && k * PLACE_STEP <= limit; k++) {
        for (const sign of k === 0 ? [1] : [1, -1]) {
          const candidate = clamp(preferred + sign * k * PLACE_STEP, 0, limit)
          const [px, py] = portFor(candidate)
          for (const a of departures.filter((d) => anchorsFor(b).includes(d))) {
            const [ax, ay] = anchorPoint(r, a)
            const elbow: [number, number] = at === 'right' ? [ax, py] : [px, ay]
            if (clearOf(ax, ay, elbow[0], elbow[1]) && clearOf(elbow[0], elbow[1], px, py)) {
              along = candidate
              anchor = a
              route = [[ax, ay], elbow]
              found = true
              break
            }
          }
          if (found) break
        }
      }
      return { index, src, w, h, along, anchor, route }
    })

  // Stack in column order, then keep the whole stack inside the frame.
  items.sort((a, b) => a.along - b.along)
  let cursor = 0
  const placed = items.map((it) => {
    const along = Math.max(cursor, it.along)
    cursor = along + (at === 'right' ? it.h : it.w) + INSET_STACK_GAP
    return { ...it, along }
  })
  const extent = at === 'right' ? H : W
  const overflow = Math.max(0, cursor - INSET_STACK_GAP - extent)
  return placed.map(({ index, src, w, h, along, anchor, route }) => {
    const a = Math.max(0, along - overflow)
    return at === 'right'
      ? { index, src, w, h, anchor, route, x: W + GAP, y: a }
      : { index, src, w, h, anchor, route, x: a, y: H + GAP }
  })
}

export function AnnotatedShot({
  src,
  alt,
  caption,
  highlight,
  highlights,
  spotlight = false,
  step,
  pointer,
  inset,
  frameWidth,
  mark,
  className = '',
}: AnnotatedShotProps) {
  const instant = useInstant()
  const maskId = useId()
  const imgRef = useRef<HTMLImageElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  // Rendered size of the capture in layout px. The stage is scaled with a
  // transform, so offsetWidth (layout) is right and getBoundingClientRect
  // (viewport) would be wrong. Measured, not assumed: the frame width is a
  // prop but the height follows the file's aspect ratio.
  useLayoutEffect(() => {
    const img = imgRef.current
    if (!img) return
    const read = () => setSize({ w: img.offsetWidth, h: img.offsetHeight })
    read()
    const ro = new ResizeObserver(read)
    ro.observe(img)
    return () => ro.disconnect()
  }, [])

  const boxes: ShotHighlight[] = highlights ?? (highlight ? [{ ...highlight, step: highlight.step ?? step, pointer: highlight.pointer ?? pointer }] : [])

  const insetOpts: ShotInsetOptions | null =
    inset === undefined || inset === false
      ? null
      : inset === true
        ? { only: 'all' }
        : inset === 'auto'
          ? { only: 'small' }
          : inset
  const insetAt = insetOpts?.at ?? 'right'
  const zoom = insetOpts?.zoom ?? 2
  const wanted = boxes.map((b) => {
    if (b.inset !== undefined) return b.inset
    if (!insetOpts) return false
    return insetOpts.only === 'all' || b.width < SMALL_BOX_PCT
  })

  const { w: W, h: H } = size
  const measured = W > 0 && H > 0
  const insets = measured ? layoutInsets(boxes, wanted, W, H, insetAt, zoom) : []
  const palette = paletteFor(boxes.length)

  /*
    Room around the frame. Insets take the right or bottom; badges and labels
    on a box that touches an edge hang OUTSIDE the image, and the wrapper grows
    by that much so they leave neither the slide nor the well. Before this the
    annotation layer lived inside the rounded, overflow-hidden frame and a
    badge on the search box lost its top half.
  */
  const hang = { top: 0, left: 0, right: 0, bottom: 0 }
  if (measured) {
    for (const b of boxes) {
      const r = boxRect(b, W, H)
      const badgeRight = badgeSide(b, boxes.indexOf(b)).right
      if (b.step !== undefined) {
        const out = BADGE + BADGE_GAP + 2
        hang.top = Math.max(hang.top, -r.y)
        hang.bottom = Math.max(hang.bottom, r.y + r.h - H)
        if (badgeRight) hang.right = Math.max(hang.right, r.x + r.w + out - W)
        else hang.left = Math.max(hang.left, out - r.x)
      }
      const l = labelRect(b, r)
      if (l) {
        hang.top = Math.max(hang.top, -l.y)
        hang.left = Math.max(hang.left, -l.x)
        hang.right = Math.max(hang.right, l.x + l.w - W)
        hang.bottom = Math.max(hang.bottom, l.y + l.h - H)
      }
    }
  }
  const insetRight = insetAt === 'right' && insets.length ? GAP + Math.max(...insets.map((i) => i.w)) : 0
  const insetBottom = insetAt === 'bottom' && insets.length ? GAP + Math.max(...insets.map((i) => i.h)) : 0
  const pad = {
    top: Math.ceil(hang.top),
    left: Math.ceil(hang.left),
    right: Math.ceil(Math.max(insetRight, hang.right)),
    bottom: Math.ceil(Math.max(insetBottom, hang.bottom)),
  }

  const boxesDelay = spotlight ? annotation.boxesAfterDim : annotation.boxesPlain
  const insetDelay = boxesDelay + boxes.length * annotation.stagger + annotation.insetGap
  const insetTransition = { ...annotation.inset, delay: insetDelay }

  return (
    <figure className={`m-0 ${className}`}>
      <div className="w-fit" style={{ paddingTop: pad.top, paddingLeft: pad.left, paddingRight: pad.right, paddingBottom: pad.bottom }}>
        {/* Everything below is positioned against the frame's own origin. */}
        <div className="relative w-fit">
          {/* The frame clips the IMAGE and the dim, and nothing else. */}
          <div
            className="relative overflow-hidden rounded-card shadow-card ring-1 ring-black/10"
            style={frameWidth ? { width: frameWidth } : undefined}
          >
            <img ref={imgRef} src={src} alt={alt} draggable={false} className="block h-auto w-full select-none" />

            {spotlight && boxes.length > 0 && (
              /*
                The dim is one rect with the boxes cut out of it, so several
                boxes share one spotlight. viewBox 0..100 with preserveAspectRatio
                none lets the holes be the same percentages as the boxes.
              */
              <motion.svg
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                initial={instant ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={annotation.dim}
              >
                <mask id={maskId}>
                  <rect width="100" height="100" fill="white" />
                  {boxes.map((b, i) => (
                    <rect key={i} x={b.left} y={b.top} width={b.width} height={b.height} fill="black" />
                  ))}
                </mask>
                <rect width="100" height="100" fill={DIM} fillOpacity={DIM_OPACITY} mask={`url(#${maskId})`} />
              </motion.svg>
            )}
          </div>

          {/* The annotation layer: a sibling over the frame, never clipped by it. */}
          {boxes.length > 0 && (
            <RevealGroup className="pointer-events-none absolute inset-0 overflow-visible" stagger={annotation.stagger} delayChildren={boxesDelay}>
              {boxes.map((b, i) => (
                <Reveal
                  key={i}
                  dir="scale"
                  className="absolute"
                  style={{ left: `${b.left}%`, top: `${b.top}%`, width: `${b.width}%`, height: `${b.height}%` }}
                >
                  <HighlightBox box={b} index={i} glow={spotlight} color={palette[i]} />
                </Reveal>
              ))}
            </RevealGroup>
          )}

          {insets.map((g) => (
            <Inset key={g.index} geom={g} box={boxes[g.index]} color={palette[g.index]} src={src} zoom={zoom} instant={instant} transition={insetTransition} />
          ))}

          {insets.length > 0 && (
            <motion.svg
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 overflow-visible"
              width={W + pad.right}
              height={H + pad.bottom}
              initial={instant ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={insetTransition}
            >
              {insets.map((g) => {
                const points = [...g.route, insetPort(g, insetAt)]
                const [x1, y1] = points[0]
                const c = palette[g.index].line
                return (
                  <g key={g.index} stroke={c} fill="none">
                    <polyline points={points.map(([x, y]) => `${x},${y}`).join(' ')} strokeWidth={1.5} strokeDasharray="4 3" strokeLinejoin="round" />
                    <circle cx={x1} cy={y1} r={3} fill={c} stroke="none" />
                  </g>
                )
              })}
            </motion.svg>
          )}
        </div>
      </div>

      {caption && (
        <figcaption
          className="mt-2 flex items-center justify-center gap-2 text-center text-[13px] leading-snug text-ink-soft"
          style={{ width: frameWidth ? frameWidth + pad.left + pad.right : undefined }}
        >
          {mark && <img src={mark.src} alt={mark.alt} draggable={false} className="h-5 w-auto select-none" />}
          <span>{caption}</span>
        </figcaption>
      )}
    </figure>
  )
}

/* ------------------------------------------------------------------ */

function HighlightBox({ box, index, glow, color }: { box: ShotHighlight; index: number; glow: boolean; color: HighlightColor }) {
  const side = box.labelAt ?? 'below'
  const { right: badgeRight, bottom: badgeBottom } = badgeSide(box, index)
  const gap = box.pointer ? POINTER_GAP : LABEL_GAP
  return (
    <>
      <span
        aria-hidden
        className="absolute inset-0 rounded-[4px]"
        style={{
          border: `3px solid ${color.line}`,
          boxShadow: glow
            ? `0 0 0 3px ${alpha(color.line, 0.3)}, 0 0 22px 6px ${color.glow}`
            : `0 0 0 3px ${alpha(color.line, 0.28)}`,
        }}
      />
      {box.step !== undefined && (
        /* Top-left corner, unless the label sits on the left or above-left,
           where a short box would put the two on top of each other. */
        <span
          aria-hidden
          className="absolute grid place-items-center rounded-full font-heading font-bold"
          style={{
            width: BADGE,
            height: BADGE,
            color: color.badgeText,
            /*
              THE BADGE SITS OUTSIDE THE BOX, ALWAYS.

              User, 2026-09-16: "a highlight must make its content easier to
              read, never harder". A badge hung half over the corner covered the
              first characters of what the box was pointing at (the VPC id on
              The Default VPC). So it is pushed fully clear on the horizontal
              axis and aligned to the box's own top or bottom edge; the overlay
              layer is a sibling of the frame, so it may hang outside the image,
              and `hang` below reserves the room for it.
            */
            ...(badgeRight ? { right: -(BADGE + BADGE_GAP) } : { left: -(BADGE + BADGE_GAP) }),
            ...(badgeBottom ? { bottom: 0 } : { top: 0 }),
            fontSize: 15,
            background: color.line,
            boxShadow: `0 0 0 2px ${colors.white}, 0 2px 8px ${alpha(colors.ink, 0.35)}`,
          }}
        >
          {box.step}
        </span>
      )}
      {box.label && (
        <span aria-hidden className="absolute" style={labelAnchor(side, gap, !!box.pointer)}>
          <span
            className="block whitespace-nowrap rounded-full px-3 py-1 font-mono"
            style={{
              fontSize: 14,
              color: color.pillText,
              background: color.pillBg,
              boxShadow: `0 0 0 1.5px ${alpha(color.line, 0.7)}`,
              transform: labelShift(side, !!box.pointer),
            }}
          >
            {box.label}
          </span>
        </span>
      )}
      {box.label && box.pointer && <PointerArrow side={side} color={color.line} />}
    </>
  )
}

/** Where the label's anchor point sits relative to the box. */
function labelAnchor(side: ShotLabelSide, gap: number, centred: boolean): CSSProperties {
  const along = centred ? '50%' : '0'
  switch (side) {
    case 'above':
      return { left: along, bottom: `calc(100% + ${gap}px)` }
    case 'left':
      return { right: `calc(100% + ${gap}px)`, top: '50%' }
    case 'right':
      return { left: `calc(100% + ${gap}px)`, top: '50%' }
    case 'below':
    default:
      return { left: along, top: `calc(100% + ${gap}px)` }
  }
}

/** Pull the label back over its anchor so it is centred on the box or its edge. */
function labelShift(side: ShotLabelSide, centred: boolean): string {
  if (side === 'left') return 'translateY(-50%)'
  if (side === 'right') return 'translateY(-50%)'
  return centred ? 'translateX(-50%)' : 'none'
}

/**
 * The arrow from a pushed-out label to the box edge. Drawn inside the box's
 * own coordinate space so it needs no measurement: it spans the gap between
 * the box edge and the label.
 */
function PointerArrow({ side, color }: { side: ShotLabelSide; color: string }) {
  const len = POINTER_GAP - 4
  const horizontal = side === 'left' || side === 'right'
  const style: CSSProperties = horizontal
    ? { top: '50%', height: 16, width: len, marginTop: -8, ...(side === 'left' ? { right: '100%' } : { left: '100%' }) }
    : { left: '50%', width: 16, height: len, marginLeft: -8, ...(side === 'above' ? { bottom: '100%' } : { top: '100%' }) }
  // Line runs from the label end to the box end; the head sits at the box end.
  const [x1, y1, x2, y2] = horizontal
    ? side === 'left'
      ? [2, 8, len - 2, 8]
      : [len - 2, 8, 2, 8]
    : side === 'above'
      ? [8, 2, 8, len - 2]
      : [8, len - 2, 8, 2]
  const head =
    side === 'left'
      ? `M${len - 8},3 L${len - 1},8 L${len - 8},13`
      : side === 'right'
        ? `M8,3 L1,8 L8,13`
        : side === 'above'
          ? `M3,${len - 8} L8,${len - 1} L13,${len - 8}`
          : `M3,8 L8,1 L13,8`
  return (
    <svg aria-hidden className="absolute overflow-visible" style={style} width={horizontal ? len : 16} height={horizontal ? 16 : len}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <path d={head} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * The magnifier: the same file, shown through a window the size of the
 * region times `zoom`, positioned with background-size and
 * background-position so no second image is ever produced. The box is drawn
 * again inside it so the eye lands on the same target twice.
 */
function Inset({
  geom,
  box,
  color,
  src,
  zoom,
  instant,
  transition,
}: {
  geom: InsetGeom
  box: ShotHighlight
  color: HighlightColor
  src: string
  zoom: number
  instant: boolean
  transition: typeof annotation.inset
}) {
  const { l, t, w, h } = geom.src
  const posX = w >= 100 ? 0 : (l * 100) / (100 - w)
  const posY = h >= 100 ? 0 : (t * 100) / (100 - h)
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute overflow-hidden rounded-[8px] bg-white shadow-card"
      style={{
        left: geom.x,
        top: geom.y,
        width: geom.w,
        height: geom.h,
        border: `2px solid ${color.line}`,
        backgroundImage: `url(${src})`,
        backgroundSize: `${(100 * 100) / w}% ${(100 * 100) / h}%`,
        backgroundPosition: `${posX}% ${posY}%`,
        backgroundRepeat: 'no-repeat',
      }}
      initial={instant ? false : { opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={transition}
    >
      <span
        className="absolute rounded-[3px]"
        style={{
          left: `${((box.left - l) / w) * 100}%`,
          top: `${((box.top - t) / h) * 100}%`,
          width: `${(box.width / w) * 100}%`,
          height: `${(box.height / h) * 100}%`,
          border: `2px solid ${color.line}`,
          boxShadow: `0 0 0 2px ${alpha(color.line, 0.3)}`,
        }}
      />
      <span
        className="absolute bottom-1 right-1 rounded-full px-1.5 font-mono leading-tight"
        style={{ fontSize: 10, color: color.pillText, background: color.pillBg }}
      >
        {zoom}x
      </span>
    </motion.div>
  )
}
