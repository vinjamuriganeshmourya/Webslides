import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * THE ONE PICTURE OF PF 20 "WORKING WITH LISTS".
 *
 * The spec's note for the whole session: "a name is a tag with an arrow; a
 * list is a row of boxes. Two names on one list are two tags with arrows into
 * ONE row of boxes, never two rows. Use it on every card from C5 on." This file
 * draws exactly that, and nothing else draws memory in the deck:
 *
 *   tag     a variable name, a dark chip with an arrow leaving it
 *   row     a list object, drawn short: one row of joined boxes
 *   obj     a value object (a string), with its id label under it
 *   cube    an item object drawn as the original deck draws it (C7, C12)
 *   ref     an arrow leaving a SLOT of a row: a list that holds another list
 *           (C11) or the cubes it holds (C7, C12)
 *
 * Everything is placed by coordinates the card gives, never measured from the
 * DOM, so an arrow is right by construction and the harnesses see one stable
 * box. Every move is a tween of those coordinates: a tag that is re-pointed
 * lifts off one object and lands on the other (the arrow's path morphs), a row
 * that is re-placed slides, a box that joins a row can fly in from where its
 * value came from (`from`). An object nothing points at any more greys and
 * stays grey (C6, E1's must lines).
 *
 * Template colours only (content rule 37): tags brandDark, arrows the accent
 * (the original deck's red arrows become the template's one warm hue), a box
 * that just changed takes the accent ring, a box that just joined the brand
 * tint. Explanatory-tier timing (generate-slides 4b), and under `useInstant()`
 * everything lands still.
 */

/* ------------------------------------------------------------------ sizes */

const MONO = 0.6 /* JetBrains Mono's advance, per px of font size */
export const textW = (s: string, font: number) => s.length * font * MONO

export const SIZES = {
  lg: { h: 56, font: 22, pad: 30, tagFont: 20, tagH: 38 },
  md: { h: 48, font: 19, pad: 26, tagFont: 18, tagH: 34 },
  sm: { h: 40, font: 16, pad: 20, tagFont: 16, tagH: 30 },
  xs: { h: 32, font: 13, pad: 14, tagFont: 13, tagH: 26 },
} as const
export type MSize = keyof typeof SIZES

const ARROW = colors.accent
const MOVE = { duration: 0.72, ease: [0.22, 1, 0.36, 1] as const }
const ENTER = { duration: 0.52, ease: [0.22, 1, 0.36, 1] as const }

/* ------------------------------------------------------------------ model */

export type Item = string | { ref: string }

export interface MNode {
  id: string
  kind: 'row' | 'obj' | 'cube'
  x: number
  y: number
  /** row: its items; a `{ ref }` item is a slot holding an arrow */
  items?: Item[]
  /** obj, cube: the value drawn */
  text?: string
  /** under the object: its id label */
  note?: ReactNode
  size?: MSize
  /** every box of a row this wide (else the longest item decides) */
  boxW?: number
  grey?: boolean
  /** row: boxes that just changed (accent ring) */
  hot?: number[]
  /** row: boxes that just joined (brand tint) */
  fresh?: number[]
  /** row: a box that refused a change (danger ring) */
  bad?: number[]
  /** row: a box that refuses a change: it shakes once */
  shake?: number
  /** row: draw the position under each box */
  positions?: boolean
  /** row: per box, the canvas point it flies in from when it first mounts */
  from?: Record<number, { x: number; y: number; delay?: number }>
  /** fade the whole node (used while a picture turns into its short form) */
  fade?: number
  /** a name drawn inside the object box instead of its value (C7's list object) */
  emptySlots?: boolean
  /** extra delay for this node's entrance, seconds */
  delay?: number
}

export interface MTag {
  name: string
  x: number
  y: number
  /** the node it points at; null draws the tag with no arrow */
  to: string | null
  /** where the arrow leaves the tag: its right side, its bottom, or its top */
  side?: 'right' | 'down' | 'up'
  /** a question mark in place of the name's arrow (G1: the asked variable stays hidden) */
  masked?: boolean
  /** raise a right-side arrow into an arc this high, to clear an object it would cross */
  lift?: number
  delay?: number
  fade?: number
}

export interface MRef {
  from: string
  slot: number
  to: string
  fade?: number
  delay?: number
}

/* -------------------------------------------------------------- geometry */

export function rowBoxW(n: MNode) {
  const s = SIZES[n.size ?? 'md']
  if (n.boxW) return n.boxW
  const longest = (n.items ?? []).reduce<number>((m, t) => Math.max(m, typeof t === 'string' ? t.length : 1), 1)
  return Math.max(s.h, Math.round(longest * s.font * MONO + s.pad))
}

/** The rectangle a node occupies on the canvas (the boxes, not the note under them). */
export function rectOf(n: MNode) {
  const s = SIZES[n.size ?? 'md']
  if (n.kind === 'row') {
    const bw = rowBoxW(n)
    const k = Math.max(1, (n.items ?? []).length)
    return { x: n.x, y: n.y, w: k * bw - (k - 1) * 2, h: s.h, bw }
  }
  if (n.kind === 'cube') {
    const c = s.h
    return { x: n.x, y: n.y, w: c, h: c, bw: c }
  }
  const w = Math.max(s.h, Math.round(textW(n.text ?? '', s.font) + s.pad))
  return { x: n.x, y: n.y, w, h: s.h, bw: w }
}

export function tagW(name: string, size: MSize = 'md') {
  const s = SIZES[size]
  return Math.round(textW(name, s.tagFont) + 24)
}

/** Centre of slot `i` of a row node. */
export function slotCentre(n: MNode, i: number) {
  const r = rectOf(n)
  return { x: r.x + i * (r.bw - 2) + r.bw / 2, y: r.y + r.h / 2 }
}

const f = (v: number) => v.toFixed(1)

/*
  EVERY ARROW ARRIVES STRAIGHT. The last `TAIL` px of every connector is a
  straight segment on the arrowhead's own axis, so the line meets the head at
  its centre whatever the curve did before it (content rule 46; on PF 20 slide
  22 the curve was still bending under the head and entered it off-centre).
  Every path is M · C · L, one shape, so a re-pointed arrow still morphs.
*/
const TAIL = 12

function tagPath(t: MTag, size: MSize, target: ReturnType<typeof rectOf>, off: number) {
  const s = SIZES[size]
  const tw = tagW(t.name, size)
  const ex = target.x - 3
  const ey = target.y + target.h / 2 + off
  const bx = ex - TAIL
  if ((t.side ?? 'right') === 'right') {
    const sx = t.x + tw
    const sy = t.y + s.tagH / 2
    const k = Math.max(20, (bx - sx) / 2)
    const lift = t.lift ?? 0
    return `M${f(sx)} ${f(sy)} C${f(sx + k)} ${f(sy - lift)} ${f(bx - k)} ${f(ey - lift)} ${f(bx)} ${f(ey)} L${f(ex)} ${f(ey)}`
  }
  const sx = t.x + Math.min(tw / 2, 22)
  const sy = t.side === 'down' ? t.y + s.tagH : t.y
  return `M${f(sx)} ${f(sy)} C${f(sx)} ${f(ey)} ${f((sx + bx) / 2)} ${f(ey)} ${f(bx)} ${f(ey)} L${f(ex)} ${f(ey)}`
}

function refPath(from: MNode, slot: number, to: MNode) {
  const a = slotCentre(from, slot)
  const r = rectOf(to)
  if (r.y > a.y + 30) {
    const ex = r.x + r.w / 2
    const ey = r.y - 3
    const by = ey - TAIL
    const my = (a.y + by) / 2
    return `M${f(a.x)} ${f(a.y)} C${f(a.x)} ${f(my)} ${f(ex)} ${f(my)} ${f(ex)} ${f(by)} L${f(ex)} ${f(ey)}`
  }
  if (r.y + r.h < a.y - 30) {
    const ex = r.x + r.w / 2
    const ey = r.y + r.h + 3
    const by = ey + TAIL
    const my = (a.y + by) / 2
    return `M${f(a.x)} ${f(a.y)} C${f(a.x)} ${f(my)} ${f(ex)} ${f(my)} ${f(ex)} ${f(by)} L${f(ex)} ${f(ey)}`
  }
  const ex = r.x - 3
  const ey = r.y + r.h / 2
  const bx = ex - TAIL
  return `M${f(a.x)} ${f(a.y)} C${f((a.x + bx) / 2)} ${f(a.y)} ${f((a.x + bx) / 2)} ${f(ey)} ${f(bx)} ${f(ey)} L${f(ex)} ${f(ey)}`
}

/* ------------------------------------------------------------------ parts */

function boxLook(state: 'plain' | 'hot' | 'fresh' | 'bad', grey: boolean) {
  if (grey) return { bg: colors.surface, ring: colors.muted, ink: colors.muted, dash: true }
  if (state === 'bad') return { bg: '#FDECEC', ring: colors.danger, ink: colors.danger, thick: true }
  if (state === 'hot') return { bg: '#FFF4EC', ring: colors.accent, ink: colors.ink, thick: true }
  if (state === 'fresh') return { bg: colors.surface2, ring: colors.brand, ink: colors.brandDark, thick: true }
  return { bg: colors.white, ring: colors.brandDark, ink: colors.ink }
}

function RowNode({ n, instant }: { n: MNode; instant: boolean }) {
  const s = SIZES[n.size ?? 'md']
  const r = rectOf(n)
  const items = n.items ?? []
  const hot = new Set(n.hot ?? [])
  const fresh = new Set(n.fresh ?? [])
  const bad = new Set(n.bad ?? [])
  return (
    <div className="relative" style={{ width: r.w, height: s.h }}>
      {items.length === 0 && (
        <span className="absolute inset-0 grid place-items-center rounded-xl font-mono" style={{ border: `2px dashed ${colors.line}`, color: colors.muted, fontSize: s.font - 2 }}>
          [ ]
        </span>
      )}
      {items.map((it, i) => {
        const st = bad.has(i) ? 'bad' : hot.has(i) ? 'hot' : fresh.has(i) ? 'fresh' : 'plain'
        const L = boxLook(st, !!n.grey)
        const fly = n.from?.[i]
        const left = i * (r.bw - 2)
        const isRef = typeof it !== 'string'
        const radius = items.length === 1 ? 10 : i === 0 ? '10px 0 0 10px' : i === items.length - 1 ? '0 10px 10px 0' : 0
        return (
          <motion.div
            key={i}
            className="absolute top-0"
            style={{ left, width: r.bw, height: s.h, zIndex: st === 'plain' ? 0 : 1 }}
            initial={instant ? false : fly ? { x: fly.x - (n.x + left), y: fly.y - n.y, opacity: 0.5 } : { opacity: 0, x: -10 }}
            animate={n.shake === i && !instant ? { x: [0, -9, 9, -7, 7, -3, 0], y: 0, opacity: 1 } : { x: 0, y: 0, opacity: 1 }}
            transition={n.shake === i ? { duration: 0.6, ease: 'easeInOut' } : { ...MOVE, delay: instant ? 0 : (fly?.delay ?? 0) }}
          >
            <span
              className="grid h-full w-full place-items-center font-mono font-semibold"
              style={{
                borderRadius: radius,
                background: L.bg,
                color: L.ink,
                fontSize: s.font,
                border: `${L.thick ? 3 : 2}px ${L.dash ? 'dashed' : 'solid'} ${L.ring}`,
                transition: instant ? 'none' : 'background-color 420ms, border-color 420ms, color 420ms',
                whiteSpace: 'nowrap',
              }}
            >
              {isRef ? (
                <span className="block rounded-full" style={{ width: 12, height: 12, background: n.grey ? colors.muted : ARROW }} />
              ) : (
                <motion.span key={it} initial={instant ? false : { opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={ENTER}>
                  {it}
                </motion.span>
              )}
            </span>
            {n.positions && (
              <span className="absolute left-1/2 -translate-x-1/2 font-mono leading-none" style={{ top: s.h + 6, fontSize: 15, color: colors.muted }}>
                {i}
              </span>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

function ObjNode({ n }: { n: MNode }) {
  const s = SIZES[n.size ?? 'md']
  const r = rectOf(n)
  const grey = !!n.grey
  return (
    <div className="relative" style={{ width: r.w, height: s.h }}>
      <span
        className="grid h-full w-full place-items-center rounded-xl font-mono font-semibold"
        style={{
          fontSize: s.font,
          background: grey ? colors.surface : colors.white,
          color: grey ? colors.muted : colors.success,
          border: `2px ${grey ? 'dashed' : 'solid'} ${grey ? colors.muted : colors.brandDark}`,
          whiteSpace: 'pre',
          transition: 'background-color 420ms, color 420ms, border-color 420ms',
        }}
      >
        {n.text}
      </span>
      {n.note !== undefined && (
        <span className="absolute left-0 whitespace-nowrap font-mono text-[14px] leading-tight" style={{ top: s.h + 6, color: grey ? colors.muted : colors.body }}>
          {n.note}
        </span>
      )}
    </div>
  )
}

/** An item object, drawn as the original deck draws it: a small cube. */
function CubeNode({ n }: { n: MNode }) {
  const s = SIZES[n.size ?? 'md']
  const c = s.h
  const d = Math.round(c * 0.22)
  const grey = !!n.grey
  const face = grey ? colors.surface : colors.surface2
  const top = grey ? colors.surface : colors.white
  const side = grey ? colors.surface : colors.line
  const ring = grey ? colors.muted : colors.brandDark
  return (
    <div className="relative" style={{ width: c, height: c }}>
      {/* the front face is the node's rectangle; the top and the side rise behind it */}
      <svg aria-hidden className="absolute overflow-visible" style={{ left: 0, top: -d }} width={c + d} height={c + d}>
        <polygon points={`1,${d} ${d},1 ${c + d - 1},1 ${c},${d}`} fill={top} stroke={ring} strokeWidth={2} strokeLinejoin="round" />
        <polygon points={`${c},${d} ${c + d - 1},1 ${c + d - 1},${c} ${c},${c + d - 1}`} fill={side} stroke={ring} strokeWidth={2} strokeLinejoin="round" />
        <rect x={1} y={d} width={c - 1} height={c - 1} fill={face} stroke={ring} strokeWidth={2} />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-mono font-bold" style={{ color: grey ? colors.muted : colors.brandDark, fontSize: s.font }}>
        {n.text}
      </span>
      {n.note !== undefined && (
        <span className="absolute left-0 whitespace-nowrap font-mono text-[14px]" style={{ top: c + 6, color: colors.body }}>
          {n.note}
        </span>
      )}
    </div>
  )
}

function Tag({ t, size }: { t: MTag; size: MSize }) {
  const s = SIZES[size]
  return (
    <span
      className="grid place-items-center rounded-lg font-mono font-bold"
      style={{
        width: tagW(t.name, size),
        height: s.tagH,
        fontSize: s.tagFont,
        background: t.masked ? colors.white : colors.brandDark,
        color: t.masked ? colors.brandDark : colors.white,
        border: t.masked ? `2px dashed ${colors.brandDark}` : '2px solid transparent',
        whiteSpace: 'nowrap',
      }}
    >
      {t.name}
    </span>
  )
}

/* ------------------------------------------------------------------ canvas */

export function Memory({
  width,
  height,
  nodes,
  tags = [],
  refs = [],
  size = 'md',
  className = '',
}: {
  width: number
  height: number
  nodes: MNode[]
  tags?: MTag[]
  refs?: MRef[]
  /** the tags' size; nodes carry their own */
  size?: MSize
  className?: string
}) {
  const instant = useInstant()
  const byId = new Map(nodes.map((n) => [n.id, n]))
  /* Two arrows that land on the same object land a little apart, so both
     arrowheads are seen: the picture's whole argument is that there are TWO. */
  const landing = new Map<string, number>()
  const offs = tags.map((t) => {
    if (!t.to || t.masked) return 0
    const k = landing.get(t.to) ?? 0
    landing.set(t.to, k + 1)
    return k
  })
  const totals = new Map(landing)
  const spread = (t: MTag, k: number) => {
    const n = totals.get(t.to ?? '') ?? 1
    return n <= 1 ? 0 : (k - (n - 1) / 2) * 12
  }
  const mid = `mem-head-${width}-${height}`
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width, height }}>
      {nodes.map((n) => (
        <motion.div
          key={n.id}
          className="absolute left-0 top-0"
          initial={instant ? false : { x: n.x, y: n.y + 12, opacity: 0 }}
          animate={{ x: n.x, y: n.y, opacity: n.fade ?? (n.grey ? 0.55 : 1) }}
          transition={{ x: MOVE, y: MOVE, opacity: { ...ENTER, delay: instant ? 0 : n.delay ?? 0 } }}
        >
          {n.kind === 'row' ? <RowNode n={n} instant={instant} /> : n.kind === 'cube' ? <CubeNode n={n} /> : <ObjNode n={n} />}
        </motion.div>
      ))}
      {tags.map((t) => (
        <motion.div
          key={`tag-${t.name}`}
          className="absolute left-0 top-0 z-10"
          initial={instant ? false : { x: t.x, y: t.y - 10, opacity: 0 }}
          animate={{ x: t.x, y: t.y, opacity: t.fade ?? 1 }}
          transition={{ x: MOVE, y: MOVE, opacity: { ...ENTER, delay: instant ? 0 : t.delay ?? 0 } }}
        >
          <Tag t={t} size={size} />
        </motion.div>
      ))}
      <svg className="pointer-events-none absolute left-0 top-0 overflow-visible" width={width} height={height} aria-hidden>
        <defs>
          {/*
            SMALL, FIXED-SIZE HEADS (content rule 45). `userSpaceOnUse`, so the
            head is 9px whatever the line's width; the SVG default scales a
            marker by the stroke and drew 19px heads on 2.75px lines. `refX`
            keeps the tip exactly where it was, 3px past the path's end, at
            the box's edge. `refY` is the head's own centre line, so the line
            ends on its axis (rule 46).
          */}
          <marker id={mid} viewBox="0 0 10 10" refX="6.8" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 Z" fill={ARROW} />
          </marker>
        </defs>
        {tags.map((t, i) => {
          const target = t.to ? byId.get(t.to) : undefined
          if (!target || t.masked) return null
          const d = tagPath(t, size, rectOf(target), spread(t, offs[i]))
          return (
            <motion.path
              key={`a-${t.name}`}
              fill="none"
              stroke={ARROW}
              strokeWidth={2.75}
              strokeLinecap="round"
              markerEnd={`url(#${mid})`}
              initial={instant ? false : { d, opacity: 0 }}
              animate={{ d, opacity: t.fade ?? 1 }}
              transition={{ d: MOVE, opacity: { ...ENTER, delay: instant ? 0 : (t.delay ?? 0) + 0.15 } }}
            />
          )
        })}
        {refs.map((r) => {
          const a = byId.get(r.from)
          const b = byId.get(r.to)
          if (!a || !b) return null
          const d = refPath(a, r.slot, b)
          return (
            <motion.path
              key={`r-${r.from}-${r.slot}`}
              fill="none"
              stroke={ARROW}
              strokeWidth={2.5}
              strokeLinecap="round"
              markerEnd={`url(#${mid})`}
              initial={instant ? false : { d, opacity: 0 }}
              animate={{ d, opacity: r.fade ?? 1 }}
              transition={{ d: MOVE, opacity: { ...ENTER, delay: instant ? 0 : (r.delay ?? 0) + 0.15 } }}
            />
          )
        })}
      </svg>
    </div>
  )
}

/* ------------------------------------------------------- from a spec step */

export interface SpecStep {
  line: number
  code?: string
  caption: string
  points: Record<string, string>
  lists: Record<string, Item[]>
  printed?: string[]
  vars?: Record<string, string>
}

export interface StepLayout {
  /** where each list id's row sits */
  rows: Record<string, { x: number; y: number }>
  /** where each name's tag sits, and which side its arrow leaves */
  tags: Record<string, { x: number; y: number; side?: MTag['side'] }>
  size?: MSize
  boxW?: number
  /** list ids drawn grey, and drawn even when no step lists them */
  grey?: string[]
}

/**
 * The picture after one step of a spec trace: one row per list id in
 * `lists`, one tag per name in `points`, a slot arrow for every `{ ref }`.
 * Boxes that differ from the previous step take the accent ring, boxes past
 * the previous length the brand tint.
 */
export function pictureOf(step: SpecStep | null, prev: SpecStep | null, lay: StepLayout, keep: Record<string, Item[]> = {}) {
  const nodes: MNode[] = []
  const refs: MRef[] = []
  const lists = { ...keep, ...(step?.lists ?? {}) }
  for (const [id, items] of Object.entries(lists)) {
    const at = lay.rows[id]
    if (!at) continue
    const before = prev?.lists[id]
    const hot: number[] = []
    const fresh: number[] = []
    if (before) {
      items.forEach((v, i) => {
        if (i >= before.length) fresh.push(i)
        else if (typeof v === 'string' && v !== before[i]) hot.push(i)
      })
    }
    nodes.push({ id, kind: 'row', x: at.x, y: at.y, items, size: lay.size, boxW: lay.boxW, hot, fresh, grey: lay.grey?.includes(id) })
    items.forEach((v, i) => {
      if (typeof v !== 'string') refs.push({ from: id, slot: i, to: v.ref })
    })
  }
  const tags: MTag[] = Object.entries(step?.points ?? {}).map(([name, to]) => ({ name, to, ...lay.tags[name] }))
  return { nodes, tags, refs }
}

/* ------------------------------------------------------------- phases */

/**
 * Movement inside ONE press (the spec allows it: "Movement inside one press is
 * fine; a press that plays by itself is not"). When `step` has just gone
 * forward by one, the phases play 0, 1, 2 … `gap` ms apart; landing on a step
 * any other way (back, a jump, Replay, an instant jump) shows its last phase
 * at once, still.
 */
export function usePhase(step: number, phases: number, gap = 950): number {
  const instant = useInstant()
  const prev = useRef(step)
  const [ph, setPh] = useState(phases - 1)
  useLayoutEffect(() => {
    const fwd = step === prev.current + 1
    prev.current = step
    if (!fwd || instant || phases <= 1) {
      setPh(phases - 1)
      return
    }
    setPh(0)
    const ts = Array.from({ length: phases - 1 }, (_, i) => window.setTimeout(() => setPh(i + 1), gap * (i + 1)))
    return () => ts.forEach((t) => window.clearTimeout(t))
  }, [step, phases, gap, instant])
  return ph
}
