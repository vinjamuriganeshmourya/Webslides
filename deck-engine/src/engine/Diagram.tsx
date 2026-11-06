import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { TILE_SKIN } from '@/decks/figures/card'
import { Arrow, Label, REDUCED, STILL, type LabelTone } from '@/decks/figures/scene'
import { NET, NoMark, litRing } from '@/decks/figures/net/frames'
import { Ripple, fx, iconUrl } from '@/decks/figures/net/fx'
import { Icon, Rich } from './icon'
import type { DiagramArrow, DiagramBox, DiagramChip, DiagramNode, DiagramSpec } from './types'

/**
 * THE GENERIC DIAGRAM: a `DiagramSpec` (boxes, nodes, chips, arrows, packets,
 * steps) drawn with the course's own pieces, so a figure written as data meets
 * the hand-drawn Session 5 figures by construction.
 *
 *   boxes    in the order given (a parent before its children). `kind` picks
 *            the house style: vpc (1.5px dashed brand rim, faint tint), public
 *            (green `SubnetBox`), private (teal), zone (hairline, light tint),
 *            region (faint dashed), plain (white tile), danger (red). The label
 *            chip sits INSIDE the top-left corner (`labelAt: 'bottom'` for the
 *            foot), 10px in, with its icon and a mono `sub` line under it.
 *   nodes    centred on (x, y): an icon on a tile / disc (the `Gateway` look),
 *            bare, or a library person; the label chip below (or `labelPos`).
 *            `loop` is one quiet continuous loop that never rests between
 *            cycles and is held under `?still`, thumbnails and reduced motion.
 *   chips    a `Label` pill centred on (x, y).
 *   arrows   from the RIM of the source to the RIM of the target, 3px clear:
 *            a disc's circle, a tile's rounded square, a box's or chip's
 *            rounded rectangle (and a node's own label when the line would
 *            cross it), so every head lands. Straight arrows are the scene
 *            `Arrow` (G8: the line draws, then the head; exit head first);
 *            `bend` / `via` arrows are an elbow with rounded corners and the
 *            same timing. `blocked` is a red line whose head lands on a
 *            `NoMark` set 11px before the target.
 *   packets  a dot riding the arrows' own routes (through each middle node's
 *            centre) at constant speed, fading in and out while it moves, so
 *            the loop restarts with no rest (R8.1). `back` rides there and back.
 *   steps    see `DiagramSpec.steps`. An arrow never shows before both its ends,
 *            a packet never before its whole path.
 *
 * LIMITS AN AUTHOR MUST RESPECT (the renderer cannot move things for you; in
 * dev a console warning names each breach):
 *   - a box's label chip needs its top 44px (or bottom 44px with `labelAt:
 *     'bottom'`, 62px with a `sub` line) clear of nodes and child boxes, and
 *     a child box sits >= 10px inside its parent on every side;
 *   - a node's body and label stay >= 10px inside the box that holds its centre;
 *   - two nodes keep >= 12px between their bodies-with-labels, and a node
 *     label is 24px tall (42px with a `sub` line) plus a 6px gap;
 *   - an arrow needs >= 24px of line between the rims it joins (70px when
 *     `blocked`, for the mark), and no node or chip may sit on its line;
 *   - labels never shrink below 13px and never ellipsise: a label wider than
 *     its room (the box width minus 20px for a box label; twice the distance
 *     to the nearer wall of its box minus 20px for a node label) drops to 13px,
 *     and if it is still too wide it wraps onto a second line, centred. Keep a
 *     box label under ~ (box w - 40) / 8 characters and a node label under
 *     ~18 characters and neither ever wraps;
 *   - a figure larger than the stage it is given is scaled down to fit (with a
 *     warning): size `w` x `h` to the stage (634 x 380 beside points, the
 *     layout's figW x figH in a lead slide).
 */

/* ------------------------------------------------------------------ constants */

const EASE = 'cubic-bezier(0.22,1,0.36,1)'
const REVEAL_MS = 360
/** the clearance between an arrow's head (or tail) and the rim it lands on */
const GAP = 3
const HEAD = 9
const MARK = 24
const LABEL_PAD = 10
const NODE_LABEL_GAP = 6
const PACKET_SPEED = 140

const TONE: Record<string, string> = {
  brand: colors.brand,
  good: colors.success,
  bad: colors.danger,
  warn: colors.warning,
  muted: colors.muted,
  accent: colors.accent,
}
/** a glyph's ink on a light tile: the tone a shade darker so it reads at 14px weight */
const INK: Record<string, string> = {
  brand: NET.gateway,
  good: '#137A3A',
  bad: colors.danger,
  warn: '#B45309',
  muted: colors.muted,
  accent: colors.accentDark,
}
const DEFAULT_SIZE = { tile: 52, disc: 46, bare: 44, person: 96 } as const

/* ------------------------------------------------------------------ steps */

type StepObj = { show: string[]; lit: string[]; dim: string[] }
const norm = (s: DiagramSpec['steps']): StepObj[] => (s ?? []).map((x) => (Array.isArray(x) ? { show: x, lit: [], dim: [] } : { show: x.show ?? [], lit: x.lit ?? [], dim: x.dim ?? [] }))
export const arrowId = (a: DiagramArrow) => a.id ?? `${a.from}>${a.to}`

/** how many presses the diagram builds over */
export function diagramSteps(spec: DiagramSpec): number {
  return spec.steps?.length ?? 0
}

/* ------------------------------------------------------------------ geometry */

type P = [number, number]
/** a rounded rectangle by its centre and half sizes (a circle when r = hw = hh) */
type Shape = { cx: number; cy: number; hw: number; hh: number; r: number }
type End = { id: string; body: Shape; label?: Shape }

const len = (a: P, b: P) => Math.hypot(b[0] - a[0], b[1] - a[1])
const unit = (a: P, b: P): P => {
  const l = len(a, b) || 1
  return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]
}

/** a ray from (ox, oy) inside `s` along the unit (dx, dy): how far until it leaves the shape */
function exitT(s: Shape, ox: number, oy: number, dx: number, dy: number): number {
  const rx = ox - s.cx
  const ry = oy - s.cy
  let t = Infinity
  if (dx > 1e-9) t = Math.min(t, (s.hw - rx) / dx)
  else if (dx < -1e-9) t = Math.min(t, (-s.hw - rx) / dx)
  if (dy > 1e-9) t = Math.min(t, (s.hh - ry) / dy)
  else if (dy < -1e-9) t = Math.min(t, (-s.hh - ry) / dy)
  if (!Number.isFinite(t)) return 0
  const px = rx + dx * t
  const py = ry + dy * t
  const r = Math.min(s.r, s.hw, s.hh)
  if (r > 0 && Math.abs(px) > s.hw - r + 1e-6 && Math.abs(py) > s.hh - r + 1e-6) {
    /* in a rounded corner: meet the corner's circle instead */
    const fx0 = rx - Math.sign(px) * (s.hw - r)
    const fy0 = ry - Math.sign(py) * (s.hh - r)
    const b = dx * fx0 + dy * fy0
    const c = fx0 * fx0 + fy0 * fy0 - r * r
    const disc = b * b - c
    if (disc >= 0) t = -b + Math.sqrt(disc)
  }
  return Math.max(0, t)
}

/** a ray against a plain rectangle: [enter, leave] distances, or null when it misses */
function slab(s: Shape, ox: number, oy: number, dx: number, dy: number): [number, number] | null {
  let t0 = -Infinity
  let t1 = Infinity
  for (const [o, d, c, h] of [[ox, dx, s.cx, s.hw], [oy, dy, s.cy, s.hh]] as const) {
    if (Math.abs(d) < 1e-9) {
      if (o < c - h || o > c + h) return null
      continue
    }
    const a = (c - h - o) / d
    const b = (c + h - o) / d
    t0 = Math.max(t0, Math.min(a, b))
    t1 = Math.min(t1, Math.max(a, b))
  }
  return t0 <= t1 && t1 > 0 ? [t0, t1] : null
}

/** how far from (ox, oy) along d the end's outline runs: its body, and its own label when the line would cross it */
function reach(e: End, ox: number, oy: number, dx: number, dy: number): number {
  const tb = exitT(e.body, ox, oy, dx, dy)
  if (!e.label) return tb
  const h = slab(e.label, ox, oy, dx, dy)
  if (h && h[0] <= tb + NODE_LABEL_GAP + 4) return Math.max(tb, h[1])
  return tb
}

const centre = (e: End): P => [e.body.cx, e.body.cy]

type Route = { pts: P[]; markAt?: P }

/** the arrow's line: rim to rim, straight or through its corners */
function route(a: DiagramArrow, S: End, T: End): Route {
  const sc = centre(S)
  const tc = centre(T)
  let mids: P[] = a.via ?? []
  if (!a.via && a.bend) {
    const dx = tc[0] - sc[0]
    const dy = tc[1] - sc[1]
    const okH = Math.abs(dx) > S.body.hw + GAP + 16 && Math.abs(dy) > T.body.hh + GAP + 16
    const okV = Math.abs(dy) > S.body.hh + GAP + 16 && Math.abs(dx) > T.body.hw + GAP + 16
    if (a.bend === 'h' && okH) mids = [[tc[0], sc[1]]]
    if (a.bend === 'v' && okV) mids = [[sc[0], tc[1]]]
  }
  let pts: P[]
  if (mids.length === 0) {
    const u = unit(sc, tc)
    const o = a.offset ?? 0
    const n: P = [-u[1] * o, u[0] * o]
    const so: P = [sc[0] + n[0], sc[1] + n[1]]
    const to: P = [tc[0] + n[0], tc[1] + n[1]]
    const ts = reach(S, so[0], so[1], u[0], u[1]) + GAP
    const tt = reach(T, to[0], to[1], -u[0], -u[1]) + GAP
    pts = [
      [so[0] + u[0] * ts, so[1] + u[1] * ts],
      [to[0] - u[0] * tt, to[1] - u[1] * tt],
    ]
  } else {
    const u1 = unit(sc, mids[0])
    const u2 = unit(mids[mids.length - 1], tc)
    const ts = reach(S, sc[0], sc[1], u1[0], u1[1]) + GAP
    const tt = reach(T, tc[0], tc[1], -u2[0], -u2[1]) + GAP
    pts = [[sc[0] + u1[0] * ts, sc[1] + u1[1] * ts], ...mids, [tc[0] - u2[0] * tt, tc[1] - u2[1] * tt]]
  }
  if (!a.blocked) return { pts }
  /* blocked: the mark sits 8px off the landing point (11px off the rim, so it clears a tile's corner too), the head lands on the mark's rim */
  const n = pts.length
  const u = unit(pts[n - 2], pts[n - 1])
  const end = pts[n - 1]
  const markAt: P = [end[0] - u[0] * (MARK / 2 + 8), end[1] - u[1] * (MARK / 2 + 8)]
  const tip: P = [markAt[0] - u[0] * (MARK / 2 + 3), markAt[1] - u[1] * (MARK / 2 + 3)]
  return { pts: [...pts.slice(0, -1), tip], markAt }
}

/* ------------------------------------------------------------------ text fit (measure-free) */

const plain = (s: string) => s.replace(/`/g, '')
/** DM Sans SemiBold runs about 0.57em a character, Fira Code 0.6em: an estimate on the generous side */
const estW = (s: string, px: number, mono = false) => plain(s).length * px * (mono ? 0.6 : 0.57)
/** a Label chip's width: its text, its 10px sides, and its icon tile when it has one */
const chipW = (s: string, px: number, icon: boolean, mono = false) => estW(s, px, mono) + (icon ? 6 + 12 + px + 8 + 8 : 20)
type Fit = { size: number; wrap: boolean; maxW?: number }
/** 14px; 13px when that is too wide for `avail`; wrapped onto lines (never ellipsised) when even 13px is */
function fit(s: string | undefined, avail: number, icon = false, mono = false): Fit {
  if (!s) return { size: 14, wrap: false }
  if (chipW(s, 14, icon, mono) <= avail) return { size: 14, wrap: false }
  if (chipW(s, 13, icon, mono) <= avail) return { size: 13, wrap: false }
  return { size: 13, wrap: true, maxW: Math.max(60, Math.floor(avail)) }
}
const fitStyle = (f: Fit): CSSProperties => ({
  fontSize: f.size,
  ...(f.wrap ? { whiteSpace: 'normal', maxWidth: f.maxW, textAlign: 'center', justifyContent: 'center', lineHeight: 1.2, borderRadius: 12, paddingTop: 4, paddingBottom: 4 } : {}),
})

/* ------------------------------------------------------------------ image aspect (library renders keep their own) */

const ASPECT = new Map<string, number>()
function srcOf(icon: string): string | null {
  if (icon.startsWith('lib:')) return iconUrl(icon.slice(4)) ?? null
  if (icon.startsWith('img:')) return icon.slice(4)
  return null
}
function useAspects(srcs: string[]): number {
  const [tick, setTick] = useState(0)
  const key = srcs.join('|')
  useEffect(() => {
    let live = true
    for (const s of srcs) {
      if (ASPECT.has(s)) continue
      const im = new Image()
      im.onload = () => {
        if (im.naturalWidth > 0) ASPECT.set(s, im.naturalHeight / im.naturalWidth)
        if (live) setTick((t) => t + 1)
      }
      im.src = s
    }
    return () => {
      live = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return tick
}

/* ------------------------------------------------------------------ layout of the parts */

type NodeGeo = { n: DiagramNode; shape: NonNullable<DiagramNode['shape']>; bw: number; bh: number; br: number; body: Shape; label?: Shape; fit: Fit; pos: NonNullable<DiagramNode['labelPos']> }
type BoxGeo = { b: DiagramBox; r: number; fit: Fit }

const BOX_R: Record<NonNullable<DiagramBox['kind']>, number> = { vpc: 18, region: 20, zone: 14, public: 14, private: 14, plain: 16, danger: 14 }

/** the innermost box holding a point */
function holder(boxes: DiagramBox[], x: number, y: number): DiagramBox | undefined {
  let best: DiagramBox | undefined
  for (const b of boxes) if (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h && (!best || b.w * b.h < best.w * best.h)) best = b
  return best
}

function nodeGeo(n: DiagramNode, spec: DiagramSpec, sizes: Sizes): NodeGeo {
  const shape = n.shape ?? 'tile'
  const size = n.size ?? DEFAULT_SIZE[shape]
  let bw = size
  let bh = size
  const src = shape === 'bare' || shape === 'person' ? srcOf(n.icon) : null
  if (src) {
    const k = ASPECT.get(src) ?? (shape === 'person' ? 1.7 : 1)
    if (shape === 'person') {
      bh = size
      bw = Math.round(size / k)
    } else if (k >= 1) {
      bh = size
      bw = Math.round(size / k)
    } else {
      bw = size
      bh = Math.round(size * k)
    }
  }
  const br = shape === 'disc' ? size / 2 : shape === 'tile' ? Math.round(size * 0.27) : 6
  const body: Shape = { cx: n.x, cy: n.y, hw: bw / 2, hh: bh / 2, r: br }
  const pos = n.labelPos ?? 'below'
  /* the room a label has: up to the nearer wall of the box holding the node (10px in), or of the figure */
  const box = holder(spec.boxes ?? [], n.x, n.y)
  const L = box ? box.x + 10 : 4
  const R = box ? box.x + box.w - 10 : spec.w - 4
  const avail = pos === 'left' ? n.x - bw / 2 - 8 - L : pos === 'right' ? R - n.x - bw / 2 - 8 : 2 * Math.min(n.x - L, R - n.x)
  const f = fit(n.label, Math.min(avail, 260))
  let label: Shape | undefined
  if (n.label) {
    const m = sizes[`n:${n.id}`]
    const lw = m?.[0] ?? (f.wrap ? (f.maxW ?? 120) : chipW(n.label, f.size, false))
    const lh = m?.[1] ?? (f.wrap ? 40 : 24) + (n.sub ? 18 : 0)
    const cx = pos === 'left' ? n.x - bw / 2 - 8 - lw / 2 : pos === 'right' ? n.x + bw / 2 + 8 + lw / 2 : n.x
    const cy = pos === 'below' ? n.y + bh / 2 + NODE_LABEL_GAP + lh / 2 : pos === 'above' ? n.y - bh / 2 - NODE_LABEL_GAP - lh / 2 : n.y
    label = { cx, cy, hw: lw / 2, hh: lh / 2, r: 0 }
  }
  return { n, shape, bw, bh, br, body, label, fit: f, pos }
}

type Sizes = Record<string, [number, number]>

/* ------------------------------------------------------------------ pieces */

/** a part's reveal: fade and a 6px rise, ~360ms; dim fades to 0.3 */
function reveal(shown: boolean, dim: boolean, instant: boolean, delay = 0): CSSProperties {
  return {
    opacity: !shown ? 0 : dim ? 0.3 : 1,
    transform: shown ? 'none' : 'translateY(6px)',
    transition: instant ? 'none' : `opacity ${REVEAL_MS}ms ${EASE} ${shown ? delay : 0}ms, transform ${REVEAL_MS}ms ${EASE} ${shown ? delay : 0}ms, box-shadow 420ms ${EASE}`,
    pointerEvents: shown ? undefined : 'none',
  }
}

/** the label chip's look per box kind (a subnet's is the solid `SubnetBox` pill) */
function boxSkin(kind: NonNullable<DiagramBox['kind']>, lit: boolean): { box: CSSProperties; tone: LabelTone; chip?: CSSProperties } {
  switch (kind) {
    case 'vpc':
      return { box: { border: `1.5px dashed ${NET.boundary}`, background: `${NET.boundary}0A`, boxShadow: litRing(lit) }, tone: 'brand' }
    case 'region':
      return { box: { border: `1.5px dashed ${NET.boundary}70`, background: `${NET.boundary}05`, boxShadow: litRing(lit) }, tone: 'muted' }
    case 'zone':
      return { box: { border: `1px solid ${colors.line}`, background: '#F7FAFFcc', boxShadow: litRing(lit) }, tone: 'plain' }
    case 'plain':
      return { box: { ...TILE_SKIN, boxShadow: litRing(lit, TILE_SKIN.boxShadow as string) }, tone: 'plain' }
    case 'danger':
      return {
        box: { background: `linear-gradient(180deg, ${colors.danger}0D 0%, ${colors.danger}1C 100%)`, boxShadow: litRing(lit, `inset 0 0 0 2px ${colors.danger}`) },
        tone: 'solid',
        chip: { background: colors.danger, boxShadow: `inset 0 0 0 1.5px ${colors.danger}` },
      }
    case 'public':
    case 'private': {
      const t = kind === 'public' ? NET.public : NET.private
      return {
        box: { background: `linear-gradient(180deg, ${t}14 0%, ${t}22 100%)`, boxShadow: litRing(lit, `inset 0 0 0 2px ${t}`) },
        tone: 'solid',
        chip: { background: t, boxShadow: `inset 0 0 0 1.5px ${t}` },
      }
    }
  }
}

function BoxView({ g, shown, lit, dim, instant }: { g: BoxGeo; shown: boolean; lit: boolean; dim: boolean; instant: boolean }) {
  const { b, r, fit: f } = g
  const skin = boxSkin(b.kind ?? 'plain', lit)
  const bottom = b.labelAt === 'bottom'
  return (
    <div className="absolute" data-diagram-box={b.id} style={{ left: b.x, top: b.y, width: b.w, height: b.h, borderRadius: r, ...reveal(shown, dim, instant), ...skin.box }}>
      {b.label && (
        <div className="absolute flex flex-col items-start gap-1" style={{ left: LABEL_PAD, ...(bottom ? { bottom: LABEL_PAD } : { top: LABEL_PAD }), maxWidth: b.w - 2 * LABEL_PAD }}>
          <Label strong tone={skin.tone} icon={b.icon ? <Icon name={b.icon} size={14} /> : undefined} style={{ ...skin.chip, ...fitStyle(f) }}>
            <Rich text={b.label} />
          </Label>
          {b.sub && (
            <span className="whitespace-nowrap font-mono text-[14px] font-medium leading-tight" style={{ color: colors.ink, fontVariantLigatures: 'none' }}>
              {b.sub}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/** one quiet loop per node, phased by its index so two loops never beat together */
function loopOf(loop: DiagramNode['loop'], i: number): { body?: { className: string; style: CSSProperties }; glyph?: { className: string; style: CSSProperties } } {
  const ph = -((i * 0.37) % 2)
  switch (loop) {
    case 'spin':
      return { glyph: fx('spin', ph, 7) }
    case 'lift':
      return { body: fx('lift', ph, 2.8) }
    case 'pulse':
      return { body: { className: 'dg-loop dg-pulse', style: { animationDelay: `${ph}s` } } }
    case 'blink':
      return { glyph: { className: 'dg-loop dg-blink', style: { animationDelay: `${ph}s` } } }
    default:
      return {}
  }
}

function NodeView({ g, i, shown, lit, dim, instant, delay, reg }: { g: NodeGeo; i: number; shown: boolean; lit: boolean; dim: boolean; instant: boolean; delay: number; reg: (k: string) => (el: HTMLElement | null) => void }) {
  const { n, shape, bw, bh, br, fit: f, pos } = g
  const size = n.size ?? DEFAULT_SIZE[shape]
  const tone = n.tone ?? 'brand'
  const ink = INK[tone]
  const lp = loopOf(n.loop, i)
  const isImg = n.icon.startsWith('lib:') || n.icon.startsWith('img:')
  const glyphPx = shape === 'disc' ? Math.round(size * (isImg ? 0.66 : 0.52)) : shape === 'tile' ? Math.round(size * (isImg ? 0.76 : 0.5)) : isImg ? bw : size
  const glyph = (
    <span className={`grid place-items-center ${lp.glyph?.className ?? ''}`} style={{ color: ink, ...lp.glyph?.style }}>
      <Icon name={n.icon} size={glyphPx} style={isImg && (shape === 'bare' || shape === 'person') ? { width: bw, height: bh, objectFit: 'contain' } : undefined} />
    </span>
  )
  let body: ReactNode
  if (shape === 'disc') {
    const ring = tone === 'brand' ? NET.gateway : TONE[tone]
    body = (
      <span className="grid h-full w-full place-items-center rounded-full" style={{ background: `linear-gradient(180deg, #FFFFFF 0%, ${colors.surface2} 100%)`, boxShadow: litRing(lit, `inset 0 0 0 2.5px ${ring}, 0 10px 20px -12px rgba(16,32,58,0.5)`), transition: instant ? 'none' : `box-shadow 420ms ${EASE}` }}>
        {glyph}
      </span>
    )
  } else if (shape === 'tile') {
    body = (
      <span className="grid h-full w-full place-items-center" style={{ borderRadius: br, ...TILE_SKIN, boxShadow: litRing(lit, TILE_SKIN.boxShadow as string), transition: instant ? 'none' : `box-shadow 420ms ${EASE}` }}>
        {glyph}
      </span>
    )
  } else {
    /* bare and person: no plate; lit draws an orange halo plate behind */
    body = (
      <span className="relative grid h-full w-full place-items-center">
        <span aria-hidden className="absolute rounded-[16px]" style={{ inset: -6, background: `${NET.lit}14`, boxShadow: `inset 0 0 0 2.5px ${NET.lit}`, opacity: lit ? 1 : 0, transition: instant ? 'none' : `opacity 420ms ${EASE}` }} />
        {glyph}
      </span>
    )
  }
  const labelBox: CSSProperties =
    pos === 'below'
      ? { left: '50%', top: bh + NODE_LABEL_GAP, transform: 'translateX(-50%)' }
      : pos === 'above'
        ? { left: '50%', bottom: bh + NODE_LABEL_GAP, transform: 'translateX(-50%)' }
        : pos === 'left'
          ? { right: bw + 8, top: '50%', transform: 'translateY(-50%)' }
          : { left: bw + 8, top: '50%', transform: 'translateY(-50%)' }
  return (
    <div className="absolute" data-diagram-node={n.id} style={{ left: n.x - bw / 2, top: n.y - bh / 2, width: bw, height: bh, zIndex: 4, ...reveal(shown, dim, instant, delay) }}>
      {n.loop === 'ripple' && <Ripple x={bw / 2} y={bh / 2} r={Math.max(bw, bh) / 2 + 4} tone={TONE[tone]} n={2} dur={2.4} />}
      <div className={`relative h-full w-full ${lp.body?.className ?? ''}`} style={lp.body?.style}>
        {body}
      </div>
      {n.label && (
        <div ref={reg(`n:${n.id}`)} className={`absolute flex flex-col gap-1 ${pos === 'left' ? 'items-end' : pos === 'right' ? 'items-start' : 'items-center'}`} style={{ ...labelBox, width: 'max-content' }}>
          <Label strong tone={lit ? 'solid' : 'plain'} style={fitStyle(f)}>
            <Rich text={n.label} />
          </Label>
          {n.sub && (
            <span className="whitespace-nowrap font-mono text-[14px] font-medium leading-tight" style={{ color: colors.ink, fontVariantLigatures: 'none' }}>
              {n.sub}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

const CHIP_TONE: Record<NonNullable<DiagramChip['tone']>, LabelTone> = { plain: 'plain', brand: 'brand', good: 'good', bad: 'bad', warn: 'warn', muted: 'muted' }

function ChipView({ c, shown, lit, dim, instant, delay, reg }: { c: DiagramChip; shown: boolean; lit: boolean; dim: boolean; instant: boolean; delay: number; reg: (k: string) => (el: HTMLElement | null) => void }) {
  return (
    /* centred on (x, y) by a zero-size flex anchor, not a translate: a translate leaves the layout box at x, so a
       chip near the stage's right edge counted as overflow (Session 7, 2026-11-06) though it was drawn inside */
    <div className="absolute flex items-center justify-center" data-diagram-chip={c.id} style={{ left: c.x, top: c.y, width: 0, height: 0, zIndex: 5, ...reveal(shown, dim, instant, delay) }}>
      <div ref={reg(`c:${c.id}`)} className="inline-flex shrink-0 rounded-pill" style={{ boxShadow: lit ? `0 0 0 3px ${NET.lit}` : 'none', transition: instant ? 'none' : `box-shadow 420ms ${EASE}` }}>
        <Label strong tone={CHIP_TONE[c.tone ?? 'plain']} mono={c.mono} raised icon={c.icon ? <Icon name={c.icon} size={14} /> : undefined} style={c.mono ? { fontVariantLigatures: 'none' } : undefined}>
          <Rich text={c.text} />
        </Label>
      </div>
    </div>
  )
}

/** a rounded polyline: each inner corner cut by up to 10px with a quadratic curve */
function roundedPath(pts: P[], R = 10): string {
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i]
    const a = unit(pts[i - 1], p)
    const b = unit(p, pts[i + 1])
    const r = Math.min(R, len(pts[i - 1], p) / 2, len(p, pts[i + 1]) / 2)
    d += ` L ${p[0] - a[0] * r} ${p[1] - a[1] * r} Q ${p[0]} ${p[1]} ${p[0] + b[0] * r} ${p[1] + b[1] * r}`
  }
  const e = pts[pts.length - 1]
  return `${d} L ${e[0]} ${e[1]}`
}

const headPath = (t: P, a: number) => {
  const l = [t[0] - Math.cos(a) * HEAD + Math.cos(a + Math.PI / 2) * 5, t[1] - Math.sin(a) * HEAD + Math.sin(a + Math.PI / 2) * 5]
  const r = [t[0] - Math.cos(a) * HEAD - Math.cos(a + Math.PI / 2) * 5, t[1] - Math.sin(a) * HEAD - Math.sin(a + Math.PI / 2) * 5]
  return `M ${t[0]} ${t[1]} L ${l[0]} ${l[1]} L ${r[0]} ${r[1]} Z`
}

/**
 * An arrow through corners, with the scene `Arrow`'s look and G8 timing: the
 * line draws tail to head (860ms), then the head lands; on exit the head goes
 * first and the line retracts. A lighter dash rides a solid line, as on `Arrow`.
 */
function ElbowArrow({ pts, on, tone, dashed, delay, both, width }: { pts: P[]; on: boolean; tone: string; dashed: boolean; delay: number; both: boolean; width: number }) {
  const instant = useInstant()
  const n = pts.length
  const ae = Math.atan2(pts[n - 1][1] - pts[n - 2][1], pts[n - 1][0] - pts[n - 2][0])
  const as = Math.atan2(pts[0][1] - pts[1][1], pts[0][0] - pts[1][0])
  const line: P[] = pts.map((p) => [p[0], p[1]] as P)
  line[n - 1] = [pts[n - 1][0] - Math.cos(ae) * HEAD, pts[n - 1][1] - Math.sin(ae) * HEAD]
  if (both) line[0] = [pts[0][0] - Math.cos(as) * HEAD, pts[0][1] - Math.sin(as) * HEAD]
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  const minX = Math.floor(Math.min(...xs) - 6)
  const minY = Math.floor(Math.min(...ys) - 6)
  const maxX = Math.ceil(Math.max(...xs) + 6)
  const maxY = Math.ceil(Math.max(...ys) + 6)
  const d = roundedPath(line)
  const t = instant ? 'none' : on ? `stroke-dashoffset 860ms cubic-bezier(0.65,0,0.35,1) ${delay}ms, opacity 200ms ${delay}ms` : `stroke-dashoffset 520ms cubic-bezier(0.65,0,0.35,1) 220ms, opacity 200ms 640ms`
  const headT = instant ? 'none' : on ? `opacity 240ms ${delay + (dashed ? 200 : 860)}ms` : 'opacity 180ms 0ms'
  return (
    <svg aria-hidden className="pointer-events-none absolute" style={{ left: minX, top: minY, overflow: 'visible', zIndex: 3 }} width={maxX - minX} height={maxY - minY}>
      <g transform={`translate(${-minX} ${-minY})`}>
        <path d={d} stroke={tone} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" fill="none" pathLength={dashed ? undefined : 1} strokeDasharray={dashed ? undefined : '1'} className={dashed ? 'mo mo-dash' : undefined} style={{ strokeDashoffset: dashed ? undefined : on ? 0 : 1, opacity: on ? 1 : 0, transition: t, ...(dashed ? { strokeDasharray: '7 7' } : {}) }} />
        {!dashed && <path d={d} stroke={colors.white} strokeWidth={Math.max(1, width * 0.45)} strokeLinecap="round" fill="none" strokeDasharray="5 9" className="mo mo-dash" style={{ opacity: on ? 0.75 : 0, transition: instant ? 'none' : on ? `opacity 300ms ${delay + 860}ms` : 'opacity 160ms 0ms', '--mo-delay': `${-((pts[0][0] * 7 + pts[0][1] * 3) % 16) / 10}s` } as CSSProperties} />}
        <path d={headPath(pts[n - 1], ae)} fill={tone} style={{ opacity: on ? 1 : 0, transition: headT }} />
        {both && <path d={headPath(pts[0], as)} fill={tone} style={{ opacity: on ? 1 : 0, transition: headT }} />}
      </g>
    </svg>
  )
}

/** where an arrow's mid label sits: on the longest leg, clear of the line by its own half extent + 9px */
function labelSpot(pts: P[], pos: DiagramArrow['labelPos'], w: number, h: number): P {
  let k = 0
  for (let i = 1; i < pts.length - 1; i++) if (len(pts[i], pts[i + 1]) > len(pts[k], pts[k + 1])) k = i
  const a = pts[k]
  const b = pts[k + 1]
  const m: P = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  if (pos === 'on') return m
  const u = unit(a, b)
  const n1: P = [-u[1], u[0]]
  const n2: P = [u[1], -u[0]]
  const want = pos ?? (Math.abs(u[1]) > 0.85 ? 'right' : 'above')
  const pick = want === 'above' ? (n1[1] < n2[1] ? n1 : n2) : want === 'below' ? (n1[1] > n2[1] ? n1 : n2) : want === 'left' ? (n1[0] < n2[0] ? n1 : n2) : n1[0] > n2[0] ? n1 : n2
  /* 9px clear of the line, so a packet riding it (14px) passes under the label, not over it */
  const ext = Math.abs(pick[0]) * (w / 2) + Math.abs(pick[1]) * (h / 2) + 9
  return [m[0] + pick[0] * ext, m[1] + pick[1] * ext]
}

/** a dot riding a polyline at constant speed, fading in and out WHILE it moves, so the loop restarts with no rest (R8.1) */
function Packet({ pts, tone, dur, delay, icon }: { pts: P[]; tone: string; dur: number; delay: number; icon?: string }) {
  const segs = pts.slice(1).map((p, i) => len(pts[i], p))
  const total = segs.reduce((a, b) => a + b, 0) || 1
  let acc = 0
  const times = [0, ...segs.map((s) => (acc += s) / total)]
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  const size = icon ? 22 : 14
  const F = Math.min(0.12, 40 / total)
  const rep = { duration: dur, ease: 'linear' as const, repeat: Infinity, repeatDelay: 0, delay }
  return (
    <motion.span
      aria-hidden
      data-cc-after=""
      className="pointer-events-none absolute grid place-items-center rounded-full"
      style={{ width: size, height: size, left: -size / 2, top: -size / 2, background: tone, color: colors.white, boxShadow: `0 0 0 3px ${colors.white}cc, 0 4px 10px -4px rgba(16,32,58,0.5)`, zIndex: 6 }}
      initial={{ x: xs[0], y: ys[0], opacity: 0 }}
      animate={{ x: xs, y: ys, opacity: [0, 1, 1, 0] }}
      transition={{ x: { ...rep, times }, y: { ...rep, times }, opacity: { ...rep, times: [0, F, 1 - F, 1] } }}
    >
      {icon && <Icon name={icon} size={13} />}
    </motion.span>
  )
}

/* ------------------------------------------------------------------ dev audit (console warnings) */

/** each warning once per page load (the audit re-runs as labels are measured) */
const SAID = new Set<string>()
const say = (m: string) => {
  if (SAID.has(m)) return
  SAID.add(m)
  console.warn(m)
}
type R4 = { x0: number; y0: number; x1: number; y1: number }
const rectOf = (s: Shape, pad = 0): R4 => ({ x0: s.cx - s.hw - pad, y0: s.cy - s.hh - pad, x1: s.cx + s.hw + pad, y1: s.cy + s.hh + pad })
const union = (a: R4, b?: R4): R4 => (b ? { x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) } : a)
const hit = (a: R4, b: R4) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1
const inside = (a: R4, b: R4) => a.x0 >= b.x0 && a.y0 >= b.y0 && a.x1 <= b.x1 && a.y1 <= b.y1
function segHits(a: P, b: P, r: R4): boolean {
  const s = slab({ cx: (r.x0 + r.x1) / 2, cy: (r.y0 + r.y1) / 2, hw: (r.x1 - r.x0) / 2, hh: (r.y1 - r.y0) / 2, r: 0 }, a[0], a[1], ...unit(a, b))
  return !!s && s[0] < len(a, b) && s[1] > 0
}

function audit(tag: string, spec: DiagramSpec, nodes: NodeGeo[], ends: Map<string, End>, routes: Map<string, Route>, ids: Set<string>, labels: { id: string; r: R4 }[]) {
  const warn = (m: string) => say(`[diagram ${tag}] ${m}`)
  const boxes = spec.boxes ?? []
  const nodeR = new Map(nodes.map((g) => [g.n.id, union(rectOf(g.body), g.label && rectOf(g.label))]))
  /* a box's label corner: the chip (and its sub line) plus 10px round it */
  const labelZone = (b: DiagramBox): R4 => {
    const f = fit(b.label, b.w - 2 * LABEL_PAD, !!b.icon)
    const lines = f.wrap && b.label ? Math.ceil(chipW(b.label, 13, !!b.icon) / ((f.maxW ?? 100) - 24)) : 1
    const h = 24 + (lines - 1) * 16 + 10 + (b.sub ? 18 : 0)
    const w = LABEL_PAD + Math.min(b.w - 2 * LABEL_PAD, Math.max(b.label ? chipW(b.label, f.size, !!b.icon) : 0, b.sub ? estW(b.sub, 14, true) : 0)) + 10
    return b.labelAt === 'bottom' ? { x0: b.x, y0: b.y + b.h - h - 10, x1: b.x + w, y1: b.y + b.h } : { x0: b.x, y0: b.y, x1: b.x + w, y1: b.y + h + 10 }
  }
  const boxR = (b: DiagramBox): R4 => ({ x0: b.x, y0: b.y, x1: b.x + b.w, y1: b.y + b.h })
  for (const b of boxes) {
    const parent = boxes.filter((p) => p !== b && inside(boxR(b), boxR(p))).sort((p, q) => p.w * p.h - q.w * q.h)[0]
    if (parent) {
      const pr = boxR(parent)
      if (!inside(boxR(b), { x0: pr.x0 + 10, y0: pr.y0 + 10, x1: pr.x1 - 10, y1: pr.y1 - 10 })) warn(`box "${b.id}" is less than 10px inside "${parent.id}"`)
      if (parent.label && hit(boxR(b), labelZone(parent))) warn(`box "${b.id}" covers the label of "${parent.id}" (keep its ${parent.labelAt === 'bottom' ? 'bottom' : 'top'} 44px clear)`)
    }
    if (b.x < 0 || b.y < 0 || b.x + b.w > spec.w || b.y + b.h > spec.h) warn(`box "${b.id}" runs outside the ${spec.w} x ${spec.h} figure`)
  }
  for (const g of nodes) {
    const r = nodeR.get(g.n.id)!
    const box = holder(boxes, g.n.x, g.n.y)
    if (box) {
      if (!inside(r, { x0: box.x + 10, y0: box.y + 10, x1: box.x + box.w - 10, y1: box.y + box.h - 10 })) warn(`node "${g.n.id}" (body + label) is less than 10px inside box "${box.id}"`)
      if (box.label && hit(r, labelZone(box))) warn(`node "${g.n.id}" sits on the label of box "${box.id}"`)
    } else if (r.x0 < 0 || r.y0 < 0 || r.x1 > spec.w || r.y1 > spec.h) warn(`node "${g.n.id}" runs outside the figure`)
    for (const h of nodes) if (h !== g && h.n.id > g.n.id && hit(union(r), { ...nodeR.get(h.n.id)!, x0: nodeR.get(h.n.id)!.x0 - 12, x1: nodeR.get(h.n.id)!.x1 + 12, y0: nodeR.get(h.n.id)!.y0 - 12, y1: nodeR.get(h.n.id)!.y1 + 12 })) warn(`nodes "${g.n.id}" and "${h.n.id}" are closer than 12px`)
  }
  for (const l of labels) {
    for (const g of nodes) if (hit(l.r, nodeR.get(g.n.id)!)) warn(`the label of arrow ${l.id} sits on node "${g.n.id}"`)
    for (const b of boxes) if (b.label && hit(l.r, labelZone(b))) warn(`the label of arrow ${l.id} sits on the label of box "${b.id}"`)
  }
  for (const [id, rt] of routes) {
    const [from, to] = id.split('\u0000')
    const pts = rt.pts
    const total = pts.slice(1).reduce((a, p, i) => a + len(pts[i], p), 0)
    if (total < 24) warn(`arrow ${from}>${to} has only ${Math.round(total)}px of line: move its ends apart`)
    for (const [eid, e] of ends) {
      if (eid === from || eid === to || ids.has(`box:${eid}`)) continue
      const r = union(rectOf(e.body, 2), e.label && rectOf(e.label, 2))
      for (let i = 0; i < pts.length - 1; i++) if (segHits(pts[i], pts[i + 1], r)) {
        warn(`arrow ${from}>${to} runs over "${eid}"`)
        break
      }
    }
  }
}

/* ------------------------------------------------------------------ the diagram */

export function Diagram({ spec, step }: { spec: DiagramSpec; step: number }): ReactNode {
  const instant = useInstant()
  const held = STILL || REDUCED || instant
  const outer = useRef<HTMLDivElement>(null)
  const refs = useRef(new Map<string, HTMLElement>())
  const regs = useRef(new Map<string, (el: HTMLElement | null) => void>())
  const reg = (k: string) => {
    let f = regs.current.get(k)
    if (!f) {
      f = (el: HTMLElement | null) => {
        if (el) refs.current.set(k, el)
        else refs.current.delete(k)
      }
      regs.current.set(k, f)
    }
    return f
  }
  const [sizes, setSizes] = useState<Sizes>({})
  const [scale, setScale] = useState(1)
  const aspectTick = useAspects(
    (spec.nodes ?? [])
      .filter((n) => n.shape === 'bare' || n.shape === 'person')
      .map((n) => srcOf(n.icon))
      .filter((s): s is string => !!s),
  )

  /* measure the chips and labels arrows land on (offset sizes are untransformed figure px) */
  useLayoutEffect(() => {
    const measure = () => {
      let changed = false
      const next: Sizes = {}
      refs.current.forEach((el, k) => {
        const v: [number, number] = [el.offsetWidth, el.offsetHeight]
        next[k] = v
        const o = sizes[k]
        if (!o || Math.abs(o[0] - v[0]) > 0.5 || Math.abs(o[1] - v[1]) > 0.5) changed = true
      })
      if (changed) setSizes(next)
      const box = outer.current
      if (box && box.clientWidth > 0 && box.clientHeight > 0) {
        const k = Math.min(1, box.clientWidth / spec.w, box.clientHeight / spec.h)
        if (Math.abs(k - scale) > 0.001) setScale(k)
      }
    }
    measure()
    let live = true
    document.fonts?.ready.then(() => live && measure())
    return () => {
      live = false
    }
  })

  const st = useMemo(() => norm(spec.steps), [spec.steps])
  const g = useMemo(() => {
    const showAt = new Map<string, number>()
    st.forEach((s, i) => s.show.forEach((id) => !showAt.has(id) && showAt.set(id, i + 1)))
    const at = (id: string) => showAt.get(id) ?? 0
    const boxes: BoxGeo[] = (spec.boxes ?? []).map((b) => ({ b, r: BOX_R[b.kind ?? 'plain'], fit: fit(b.label, b.w - 2 * LABEL_PAD, !!b.icon) }))
    const nodes = (spec.nodes ?? []).map((n) => nodeGeo(n, spec, sizes))
    const ends = new Map<string, End>()
    for (const b of spec.boxes ?? []) ends.set(b.id, { id: b.id, body: { cx: b.x + b.w / 2, cy: b.y + b.h / 2, hw: b.w / 2, hh: b.h / 2, r: BOX_R[b.kind ?? 'plain'] } })
    for (const n of nodes) ends.set(n.n.id, { id: n.n.id, body: n.body, label: n.label })
    for (const c of spec.chips ?? []) {
      const m = sizes[`c:${c.id}`]
      const w = m?.[0] ?? chipW(c.text, 14, !!c.icon, c.mono)
      const h = m?.[1] ?? 24
      ends.set(c.id, { id: c.id, body: { cx: c.x, cy: c.y, hw: w / 2, hh: h / 2, r: h / 2 } })
    }
    const arrows = (spec.arrows ?? []).flatMap((a) => {
      const S = ends.get(a.from)
      const T = ends.get(a.to)
      if (!S || !T) return []
      const id = arrowId(a)
      return [{ a, id, rt: route(a, S, T), at: Math.max(at(id), at(a.from), at(a.to)) }]
    })
    /* arrows that come in on one press draw one after another, 180ms apart, after the parts they join */
    const order = new Map<number, number>()
    const arrowDelay = new Map<string, number>()
    for (const r of arrows) {
      const k = order.get(r.at) ?? 0
      order.set(r.at, k + 1)
      const endsNew = at(r.a.from) === r.at || at(r.a.to) === r.at
      arrowDelay.set(r.id, (endsNew && r.at > 0 ? 220 : 0) + k * 180)
    }
    const packets = (spec.packets ?? []).flatMap((p, i) => {
      const legs: P[][] = []
      let ats = at(`packet:${i}`)
      let stop = false
      for (let j = 0; j < p.path.length - 1 && !stop; j++) {
        const f = p.path[j]
        const t = p.path[j + 1]
        ats = Math.max(ats, at(f), at(t))
        const fwd = arrows.find((r) => r.a.from === f && r.a.to === t)
        const rev = arrows.find((r) => r.a.from === t && r.a.to === f && !r.a.blocked)
        let leg: P[]
        if (fwd) {
          ats = Math.max(ats, fwd.at)
          leg = fwd.rt.pts
          if (fwd.a.blocked) stop = true
        } else if (rev) {
          ats = Math.max(ats, rev.at)
          leg = [...rev.rt.pts].reverse()
        } else {
          const S = ends.get(f)
          const T = ends.get(t)
          if (!S || !T) return []
          leg = route({ from: f, to: t }, S, T).pts
        }
        if (legs.length) {
          const mid = ends.get(f)
          if (mid) legs.push([centre(mid)])
        }
        legs.push(leg)
      }
      let pts = legs.flat()
      if (pts.length < 2) return []
      if (p.back) pts = [...pts, ...[...pts].reverse().slice(1)]
      const total = pts.slice(1).reduce((a, q, k) => a + len(pts[k], q), 0)
      const dur = p.dur ?? Math.max(1.6, total / PACKET_SPEED)
      return [{ i, p, pts, at: ats, dur }]
    })
    return { at, boxes, nodes, ends, arrows, arrowDelay, packets }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec, st, sizes, aspectTick])

  /* dev: name every id the steps use that the figure lacks, and every breach of the limits above */
  useEffect(() => {
    if (!import.meta.env.DEV) return
    const tag = (spec.boxes?.[0]?.id ?? spec.nodes?.[0]?.id ?? 'figure') + ` ${spec.w}x${spec.h}`
    const ids = new Set<string>([...(spec.boxes ?? []).map((b) => b.id), ...(spec.nodes ?? []).map((n) => n.id), ...(spec.chips ?? []).map((c) => c.id), ...(spec.arrows ?? []).map(arrowId), ...(spec.packets ?? []).map((_, i) => `packet:${i}`)])
    for (const s of st) for (const id of [...s.show, ...s.lit, ...s.dim]) if (!ids.has(id)) say(`[diagram ${tag}] step names "${id}", which is not in the figure`)
    for (const a of spec.arrows ?? []) if (!g.ends.has(a.from) || !g.ends.has(a.to)) say(`[diagram ${tag}] arrow ${arrowId(a)} joins an unknown id`)
    for (const p of spec.packets ?? []) for (const id of p.path) if (!g.ends.has(id)) say(`[diagram ${tag}] packet path names unknown "${id}"`)
    if (scale < 1) say(`[diagram ${tag}] the figure is larger than its stage and is scaled to ${Math.round(scale * 100)}%`)
    const routes = new Map(g.arrows.map((r) => [`${r.a.from}\u0000${r.a.to}`, r.rt]))
    const labels = g.arrows.flatMap(({ a, id, rt }) => {
      if (!a.label) return []
      const m = sizes[`a:${id}`] ?? [chipW(a.label, 14, false), 24]
      const c = labelSpot(rt.pts, a.labelPos, m[0], m[1])
      return [{ id, r: { x0: c[0] - m[0] / 2, y0: c[1] - m[1] / 2, x1: c[0] + m[0] / 2, y1: c[1] + m[1] / 2 } }]
    })
    audit(tag, spec, g.nodes, g.ends, routes, new Set((spec.boxes ?? []).map((b) => `box:${b.id}`)), labels)
  }, [g, spec, st, scale, sizes])

  const cur = !held && step >= 1 && step <= st.length ? st[step - 1] : undefined
  const isShown = (at: number) => held || step >= at
  const isLit = (id: string) => !!cur?.lit.includes(id)
  const isDim = (id: string) => !!cur?.dim.includes(id)

  return (
    <div ref={outer} className="grid h-full w-full place-items-center" style={{ minHeight: spec.h * scale }}>
      <div className="relative" data-diagram="" style={{ width: spec.w, height: spec.h, transform: scale < 1 ? `scale(${scale})` : undefined, flexShrink: 0 }}>
        {g.boxes.map((b) => (
          <BoxView key={b.b.id} g={b} shown={isShown(g.at(b.b.id))} lit={isLit(b.b.id)} dim={isDim(b.b.id)} instant={instant} />
        ))}
        {g.arrows.map(({ a, id, rt, at }) => {
          const on = isShown(at)
          const lit = isLit(id)
          const tone = a.blocked ? NET.blocked : lit ? NET.lit : TONE[a.tone ?? 'brand']
          const width = a.dashed ? 1.5 : 2.5
          const delay = held ? 0 : (g.arrowDelay.get(id) ?? 0)
          const both = !!a.two && !a.blocked
          const straight = rt.pts.length === 2
          const lm = sizes[`a:${id}`]
          const spot = a.label ? labelSpot(rt.pts, a.labelPos, lm?.[0] ?? chipW(a.label, 14, false), lm?.[1] ?? 24) : null
          return (
            <div key={id} data-diagram-arrow={id} style={{ opacity: isDim(id) ? 0.3 : 1, transition: instant ? 'none' : `opacity ${REVEAL_MS}ms ${EASE}` }}>
              {straight ? (
                <Arrow x1={rt.pts[0][0]} y1={rt.pts[0][1]} x2={rt.pts[1][0]} y2={rt.pts[1][1]} on={on} tone={tone} dashed={!!a.dashed} delay={delay} both={both} width={width} />
              ) : (
                <ElbowArrow pts={rt.pts} on={on} tone={tone} dashed={!!a.dashed} delay={delay} both={both} width={width} />
              )}
              {rt.markAt && (
                <div className="pointer-events-none absolute" style={{ left: rt.markAt[0] - MARK / 2, top: rt.markAt[1] - MARK / 2, zIndex: 5, opacity: on ? 1 : 0, transform: on ? 'scale(1)' : 'scale(0.6)', transition: instant ? 'none' : on ? `opacity 300ms ${EASE} ${delay + 760}ms, transform 420ms cubic-bezier(0.34,1.56,0.64,1) ${delay + 760}ms` : `opacity 180ms ${EASE}, transform 180ms ${EASE}` }}>
                  <NoMark size={MARK} />
                </div>
              )}
              {a.label && spot && (
                <div className="absolute flex items-center justify-center" style={{ left: spot[0], top: spot[1], width: 0, height: 0, zIndex: 5, opacity: on ? 1 : 0, transition: instant ? 'none' : on ? `opacity ${REVEAL_MS}ms ${EASE} ${delay + 600}ms` : `opacity 180ms ${EASE}` }}>
                  <div ref={reg(`a:${id}`)} className="inline-flex shrink-0">
                    <Label strong tone={lit ? 'solid' : 'plain'} raised>
                      <Rich text={a.label} />
                    </Label>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {g.nodes.map((n, i) => {
          const at = g.at(n.n.id)
          return <NodeView key={n.n.id} g={n} i={i} shown={isShown(at)} lit={isLit(n.n.id)} dim={isDim(n.n.id)} instant={instant} delay={0} reg={reg} />
        })}
        {(spec.chips ?? []).map((c) => (
          <ChipView key={c.id} c={c} shown={isShown(g.at(c.id))} lit={isLit(c.id)} dim={isDim(c.id)} instant={instant} delay={0} reg={reg} />
        ))}
        {!held &&
          g.packets.map(({ i, p, pts, at, dur }) =>
            isShown(at) ? (
              <div key={`${i}:${at}`} style={{ opacity: isDim(`packet:${i}`) ? 0.3 : 1, transition: instant ? 'none' : `opacity ${REVEAL_MS}ms ${EASE}` }}>
                <Packet pts={pts} tone={TONE[p.tone ?? 'brand']} dur={dur} delay={(at === 0 ? 1.1 : 1.0) + i * 0.35} icon={p.icon} />
              </div>
            ) : null,
          )}
      </div>
    </div>
  )
}

/** the loops this renderer adds (spin and lift are `fx`'s, ripple is `Ripple`); all held on harness URLs, thumbnails and reduced motion */
export const DIAGRAM_CSS = `
@keyframes dg-pulse { 0%, 100% { transform: scale(1) } 50% { transform: scale(1.06) } }
.dg-pulse { animation: dg-pulse 2.4s cubic-bezier(0.45,0,0.55,1) infinite; }
@keyframes dg-blink { 0%, 100% { opacity: 1 } 50% { opacity: 0.45 } }
.dg-blink { animation: dg-blink 1.8s ease-in-out infinite; }
.cc-still .dg-loop, .deck-thumb .dg-loop { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .dg-loop { animation: none !important; } }
`
