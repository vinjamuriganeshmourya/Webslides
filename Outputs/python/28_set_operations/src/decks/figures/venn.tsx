import { useLayoutEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { flyFrom } from './rows'

/**
 * THE ONE PICTURE OF PF 28 "SET OPERATIONS" (spec note 5).
 *
 * Every group is a circle of name chips with no numbers and no order. Two
 * groups that share people overlap, and the shared chips sit in the middle.
 * A region of the picture can light (brand blue, "kept") or grey ("dropped"),
 * and it stays that way. An operation builds a NEW circle (`Pool`): copies
 * fly out of the source chips, and the two circles it reads never lose one.
 *
 * `Venn` draws two circles from explicit geometry, so one component covers
 * the hook's two cards sliding together, the overlap of C1 to C6, the nested
 * circles of C7 and C8 (with Harsha poking out), and C9's circles that stop
 * apart or overlap. Chips are placed by region (only the first, both, only
 * the second), centre-out, and move on the house curve when the geometry
 * changes. Colours are tokens (content rule 37).
 */

export const HOUSE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const EASE = [0.22, 1, 0.36, 1] as const

/* ------------------------------------------------------------------ chips */

export type ChipTone = 'plain' | 'lit' | 'grey' | 'bad' | 'ok' | 'hide' | 'gone'

/** A chip's width: the name decides, so a row is packed by what it holds. */
export function chipW(name: string, fs: number) {
  return Math.round(name.length * fs * 0.6 + fs * 1.25)
}
export const chipH = (fs: number) => Math.round(fs * 1.9)

function chipLook(t: ChipTone): { bg: string; ring: string; ink: string; op: number; w: number } {
  switch (t) {
    case 'lit':
      return { bg: '#EAF1FF', ring: colors.brand, ink: colors.brandDark, op: 1, w: 2 }
    case 'grey':
      return { bg: colors.surface, ring: colors.line, ink: colors.muted, op: 0.55, w: 1.5 }
    case 'bad':
      return { bg: '#FDECEC', ring: colors.danger, ink: colors.danger, op: 1, w: 2 }
    case 'ok':
      return { bg: '#E9F8EF', ring: colors.success, ink: '#137A3A', op: 1, w: 2 }
    case 'hide':
    case 'gone':
      return { bg: colors.white, ring: colors.line, ink: colors.ink, op: 0, w: 1.5 }
    default:
      return { bg: colors.white, ring: colors.line, ink: colors.ink, op: 1, w: 1.5 }
  }
}

/** One name chip. Placed by its centre. */
export function Chip({ name, fs = 13, tone = 'plain', refEl, style, className = '' }: { name: string; fs?: number; tone?: ChipTone; refEl?: (el: HTMLSpanElement | null) => void; style?: React.CSSProperties; className?: string }) {
  const instant = useInstant()
  const L = chipLook(tone)
  return (
    <span
      ref={refEl}
      className={`grid place-items-center whitespace-nowrap rounded-full font-semibold leading-none ${className}`}
      style={{
        width: chipW(name, fs),
        height: chipH(fs),
        fontSize: fs,
        background: L.bg,
        color: L.ink,
        opacity: L.op,
        boxShadow: `inset 0 0 0 ${L.w}px ${L.ring}, 0 3px 8px -6px rgba(16,32,58,0.45)`,
        transition: instant ? 'none' : `background-color 420ms ${HOUSE}, box-shadow 420ms ${HOUSE}, opacity 420ms ${HOUSE}, color 420ms ${HOUSE}`,
        ...style,
      }}
    >
      {name}
    </span>
  )
}

/* -------------------------------------------------------------- geometry */

export interface Circ {
  cx: number
  cy: number
  r: number
}
type Pt = { x: number; y: number }

const inside = (p: Pt, c: Circ, m: number) => Math.hypot(p.x - c.cx, p.y - c.cy) <= c.r - m
const outside = (p: Pt, c: Circ, m: number) => Math.hypot(p.x - c.cx, p.y - c.cy) >= c.r + m

/**
 * Centre-out row packing inside any region (`ok` says whether a point is in
 * it). Each row's run of valid x is found by scanning; chips fill a row while
 * they fit, centred in its run. Rows alternate below and above the middle so
 * the group stays balanced. Deterministic: the same names give the same
 * picture on every render.
 */
export function pack(names: string[], ok: (p: Pt) => boolean, box: { x0: number; x1: number; y0: number; y1: number; cy: number }, fs: number, gap = 6, widthOf: (n: string) => number = (n) => chipW(n, fs)): Record<string, Pt> {
  const h = chipH(fs)
  const step = h + 4
  const out: Record<string, Pt> = {}
  const rows: number[] = [box.cy]
  for (let k = 1; k < 20; k++) rows.push(box.cy + k * step, box.cy - k * step)
  let left = [...names]
  for (const y of rows) {
    if (!left.length) break
    if (y - h / 2 < box.y0 || y + h / 2 > box.y1) continue
    /* the longest run of x where a vertical slice of the chip lies in the region */
    let best: [number, number] | null = null
    let start: number | null = null
    for (let x = box.x0; x <= box.x1 + 2; x += 2) {
      const good = x <= box.x1 && ok({ x, y: y - h / 2 }) && ok({ x, y: y + h / 2 }) && ok({ x, y })
      if (good && start === null) start = x
      if (!good && start !== null) {
        if (!best || x - 2 - start > best[1] - best[0]) best = [start, x - 2]
        start = null
      }
    }
    if (!best) continue
    const run = best[1] - best[0]
    /* first fit, widest first: a narrow name never takes the only row a wide one fits in */
    const take: string[] = []
    let used = 0
    for (const n of [...left].sort((a, b) => widthOf(b) - widthOf(a))) {
      const w = widthOf(n)
      const need = used + (take.length ? gap : 0) + w
      if (need > run) continue
      take.push(n)
      used = need
    }
    if (!take.length) continue
    left = left.filter((n) => !take.includes(n))
    /* the row keeps the names' own order, left to right */
    take.sort((a, b) => names.indexOf(a) - names.indexOf(b))
    let x = (best[0] + best[1]) / 2 - used / 2
    for (const n of take) {
      const w = widthOf(n)
      out[n] = { x: x + w / 2, y }
      x += w + gap
    }
  }
  /* anything that did not fit (should not happen at the sizes used) waits at the centre */
  for (const n of left) out[n] = { x: (box.x0 + box.x1) / 2, y: box.cy }
  return out
}

/* ------------------------------------------------------------------ shades */

export type Shade = 'none' | 'lit' | 'grey'
const LIT = 'rgba(45,99,251,0.34)'
const GREY = 'rgba(138,153,168,0.30)'
const BASE_L = 'rgba(45,99,251,0.06)'
const BASE_R = 'rgba(18,181,168,0.08)'
const fillOf = (s: Shade | undefined, base: string) => (s === 'lit' ? LIT : s === 'grey' ? GREY : base)

export interface Side {
  /** the name in the code: `cse` */
  code?: string
  /** the group's own name: `CSE-A gang` */
  label?: string
  items: string[]
  /** where the label sits */
  at?: 'top' | 'bottom' | 'left' | 'right' | 'none'
}

/** The group icon a chat app gives a group: a round tile with two heads. */
export function GroupIcon({ tone = colors.brandDark, size = 22 }: { tone?: string; size?: number }) {
  return (
    <span className="grid shrink-0 place-items-center rounded-full" style={{ width: size, height: size, background: tone }}>
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden>
        <circle cx="9" cy="8" r="3.4" />
        <path d="M2.6 19c.6-3.6 3.3-5.6 6.4-5.6s5.8 2 6.4 5.6z" />
        <circle cx="16.6" cy="9" r="2.7" opacity="0.8" />
        <path d="M14.8 13.9c.6-.2 1.2-.3 1.8-.3 2.5 0 4.6 1.6 5.1 4.7h-5.3c-.3-1.8-.8-3.2-1.6-4.4z" opacity="0.8" />
      </svg>
    </span>
  )
}

function Label({ side, tone, c, W, anchor }: { side: Side; tone: string; c: Circ; W: number; anchor: 'end' | 'start' | 'mid' }) {
  const instant = useInstant()
  const at = side.at ?? 'top'
  if (at === 'none' || (!side.code && !side.label)) return null
  /* two labels over two circles never meet: the left one ends near the middle, the right one starts there */
  const y = at === 'top' ? c.cy - c.r - 28 : at === 'bottom' ? c.cy + c.r + 6 : c.cy - 12
  const mid = W / 2
  const x = at === 'left' ? c.cx - c.r - 8 : at === 'right' ? c.cx + c.r + 8 : anchor === 'end' ? Math.min(c.cx + c.r * 0.35, mid - 8) : anchor === 'start' ? Math.max(c.cx - c.r * 0.35, mid + 8) : c.cx
  const tx = at === 'left' || (at !== 'right' && anchor === 'end') ? '-100%' : at === 'right' || anchor === 'start' ? '0%' : '-50%'
  return (
    <motion.div
      className="absolute flex items-center gap-1.5 whitespace-nowrap"
      initial={false}
      animate={{ left: x, top: y }}
      transition={{ duration: instant ? 0 : 0.86, ease: EASE }}
      style={{ transform: `translateX(${tx})` }}
    >
      <GroupIcon tone={tone} size={20} />
      {side.code && (
        <span className="font-mono text-[16px] font-bold leading-none" style={{ color: tone }}>
          {side.code}
        </span>
      )}
      {side.label && (
        <span className="text-[14px] font-semibold leading-none" style={{ color: colors.body }}>
          {side.label}
        </span>
      )}
    </motion.div>
  )
}

/**
 * Two groups as circles of name chips. `L` and `R` are each circle's geometry
 * inside a `W` x `H` box. `shade` paints the three regions. `tones` colours a
 * chip by name. `refs` receives each chip element by name (the left copy of a
 * shared name), for copies to fly from.
 */
export function Venn({
  W,
  H,
  L,
  R,
  left,
  right,
  shade = {},
  tones = {},
  toneR,
  fs = 13,
  refs,
  refsR,
  outline = {},
  children,
}: {
  W: number
  H: number
  L: Circ
  R: Circ | null
  left: Side
  right?: Side
  shade?: { l?: Shade; both?: Shade; r?: Shade }
  tones?: Record<string, ChipTone>
  /** the right circle's chips coloured on their own (G2: a found twin), instead of by `tones` */
  toneR?: Record<string, ChipTone>
  fs?: number
  refs?: MutableRefObject<Record<string, HTMLElement | null>>
  /** the right circle's own chips by name, shared names included (G2's twin a checked chip travels to) */
  refsR?: MutableRefObject<Record<string, HTMLElement | null>>
  /** a circle drawn lit (its rim in the brand tone, thicker) */
  outline?: { l?: boolean; r?: boolean }
  children?: ReactNode
}) {
  const instant = useInstant()
  const dur = instant ? 0 : 0.86
  const rightItems = right?.items ?? []
  const shared = left.items.filter((n) => rightItems.includes(n))
  const onlyL = left.items.filter((n) => !shared.includes(n))
  const onlyR = rightItems.filter((n) => !shared.includes(n))
  const m = 5
  /* overlapping circles draw a shared name once: the right circle's copy fades out where it lands on the left's */
  const overlap = !!R && Math.hypot(L.cx - R.cx, L.cy - R.cy) < L.r + R.r - 4
  const pos = useMemo(() => {
    const box = (c: Circ) => ({ x0: c.cx - c.r, x1: c.cx + c.r, y0: c.cy - c.r, y1: c.cy + c.r, cy: c.cy })
    const meet = R ? Math.hypot(L.cx - R.cx, L.cy - R.cy) < L.r + R.r - 4 : false
    const placeL: Record<string, Pt> = {}
    const placeR: Record<string, Pt> = {}
    if (R && meet) {
      Object.assign(placeL, pack(onlyL, (p) => inside(p, L, m) && outside(p, R, m), box(L), fs))
      Object.assign(placeR, pack(onlyR, (p) => inside(p, R, m) && outside(p, L, m), box(R), fs))
      /* the middle: both circles' copies of a shared name sit on one spot */
      const lens = { x0: Math.max(L.cx - L.r, R.cx - R.r), x1: Math.min(L.cx + L.r, R.cx + R.r), y0: Math.max(L.cy - L.r, R.cy - R.r), y1: Math.min(L.cy + L.r, R.cy + R.r), cy: R.r < L.r ? R.cy : (L.cy + R.cy) / 2 }
      const mid = pack(shared, (p) => inside(p, L, m) && inside(p, R, m), lens, fs)
      Object.assign(placeL, mid)
      Object.assign(placeR, mid)
    } else {
      Object.assign(placeL, pack(left.items, (p) => inside(p, L, m), box(L), fs))
      if (R) Object.assign(placeR, pack(rightItems, (p) => inside(p, R, m), box(R), fs))
    }
    return { placeL, placeR }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [L.cx, L.cy, L.r, R?.cx, R?.cy, R?.r, left.items.join(), rightItems.join(), fs])
  const lensId = useRef(`lens-${Math.random().toString(36).slice(2)}`).current
  const tr = { duration: dur, ease: EASE }
  const chip = (name: string, p: Pt, side: 'L' | 'R') => {
    const top = side === 'R' && shared.includes(name)
    return (
      <motion.div
        key={`${side}:${name}`}
        className="absolute"
        initial={false}
        animate={{ x: p.x - chipW(name, fs) / 2, y: p.y - chipH(fs) / 2, opacity: top && overlap ? 0 : 1 }}
        transition={{ ...tr, opacity: { duration: instant ? 0 : 0.3, delay: instant ? 0 : dur * 0.8 } }}
        style={{ left: 0, top: 0, zIndex: top ? 2 : 1 }}
      >
        <Chip
          name={name}
          fs={fs}
          tone={side === 'R' && toneR ? (toneR[name] ?? 'plain') : (tones[name] ?? 'plain')}
          refEl={(el) => {
            if (refs && (side === 'L' || !left.items.includes(name))) refs.current[name] = el
            if (refsR && side === 'R') refsR.current[name] = el
          }}
        />
      </motion.div>
    )
  }
  return (
    <div className="relative shrink-0" style={{ width: W, height: H }}>
      <svg width={W} height={H} className="absolute inset-0 overflow-visible" aria-hidden>
        <defs>
          <clipPath id={lensId}>
            <motion.circle initial={false} animate={{ cx: L.cx, cy: L.cy, r: L.r }} transition={tr} />
          </clipPath>
        </defs>
        <motion.circle initial={false} animate={{ cx: L.cx, cy: L.cy, r: L.r, fill: fillOf(shade.l, BASE_L) }} transition={tr} />
        {R && (
          <>
            <motion.circle initial={false} animate={{ cx: R.cx, cy: R.cy, r: R.r, fill: fillOf(shade.r, BASE_R) }} transition={tr} />
            <motion.circle clipPath={`url(#${lensId})`} initial={false} animate={{ cx: R.cx, cy: R.cy, r: R.r, fill: fillOf(shade.both, '#F1F5FE') }} transition={tr} />
            <motion.circle fill="none" initial={false} animate={{ cx: R.cx, cy: R.cy, r: R.r, stroke: outline.r ? colors.brand : colors.tealDark, strokeWidth: outline.r ? 3.5 : 2 }} transition={tr} />
          </>
        )}
        <motion.circle fill="none" initial={false} animate={{ cx: L.cx, cy: L.cy, r: L.r, stroke: outline.l ? colors.brand : colors.brandDark, strokeWidth: outline.l ? 3.5 : 2 }} transition={tr} />
      </svg>
      <Label side={left} tone={colors.brandDark} c={L} W={W} anchor={R && overlap && (left.at ?? 'top') === 'top' && (right?.at ?? 'top') === 'top' && R.cx > L.cx ? 'end' : 'mid'} />
      {R && right && <Label side={right} tone={colors.tealDark} c={R} W={W} anchor={overlap && (left.at ?? 'top') === 'top' && (right.at ?? 'top') === 'top' && R.cx > L.cx ? 'start' : 'mid'} />}
      {left.items.map((n) => chip(n, pos.placeL[n], 'L'))}
      {R && rightItems.map((n) => chip(n, pos.placeR[n], 'R'))}
      {children}
    </div>
  )
}

/** Two equal circles that overlap by a fixed share, centred in `W` x `H`. */
export function pair(W: number, H: number, r: number, d: number, dy = 0): { L: Circ; R: Circ } {
  return { L: { cx: W / 2 - d / 2, cy: H / 2 + dy, r }, R: { cx: W / 2 + d / 2, cy: H / 2 + dy, r } }
}

/* ------------------------------------------------------------------ pool */

export interface PoolItem {
  name: string
  /** a grey slot: this person was asked and not kept (E1) */
  slot?: boolean
  /** where its copy flies from when it arrives */
  from?: HTMLElement | null
}

/**
 * A NEW group: a circle (or an ellipse, when `ry` is given) that copies fly
 * into. An item flies from `from` when it first mounts going forward; a grey
 * slot fades in where a person was not kept, and stays grey.
 */
export function Pool({
  items,
  rx,
  ry = rx,
  fs = 13,
  code,
  label,
  lit = false,
  stagger = 110,
  tone = colors.accentDark,
  children,
}: {
  items: PoolItem[]
  rx: number
  ry?: number
  fs?: number
  code?: string
  label?: string
  lit?: boolean
  stagger?: number
  tone?: string
  children?: ReactNode
}) {
  const instant = useInstant()
  const W = rx * 2
  const H = ry * 2
  const names = items.map((it) => it.name)
  const slots = new Set(items.filter((it) => it.slot).map((it) => it.name))
  const pos = useMemo(
    () => pack(names, (p) => ((p.x - rx) / (rx - 6)) ** 2 + ((p.y - ry) / (ry - 6)) ** 2 <= 1, { x0: 0, x1: W, y0: 0, y1: H, cy: ry }, fs, 6, (n) => (slots.has(n) ? SLOT_W : chipW(n, fs))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [names.join(), [...slots].join(), rx, ry, fs],
  )
  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5">
      {(code || label) && (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <GroupIcon tone={tone} size={20} />
          {code && (
            <span className="font-mono text-[16px] font-bold leading-none" style={{ color: tone }}>
              {code}
            </span>
          )}
          {label && (
            <span className="text-[14px] font-semibold leading-none" style={{ color: colors.body }}>
              {label}
            </span>
          )}
        </div>
      )}
      <div className="relative" style={{ width: W, height: H }}>
        <div
          aria-hidden
          className="absolute inset-0 rounded-[50%]"
          style={{
            background: lit ? 'rgba(255,138,61,0.14)' : 'rgba(255,138,61,0.06)',
            boxShadow: `inset 0 0 0 ${lit ? 3 : 2}px ${lit ? colors.accent : colors.accent}`,
            transition: instant ? 'none' : `background-color 480ms ${HOUSE}, box-shadow 480ms ${HOUSE}`,
          }}
        />
        {items.map((it, k) => (
          <PoolChip key={it.name} it={it} p={pos[it.name]} fs={fs} delay={k * stagger} />
        ))}
        {children}
      </div>
    </div>
  )
}

/** A grey slot is a short pill: it says someone was asked and not kept, not who. */
const SLOT_W = 26

function PoolChip({ it, p, fs, delay }: { it: PoolItem; p: Pt; fs: number; delay: number }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const instant = useInstant()
  useLayoutEffect(() => {
    if (instant || !ref.current) return
    if (it.from && !it.slot) flyFrom(ref.current, it.from, 900, delay)
    else ref.current.animate([{ opacity: 0, transform: 'scale(0.9)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay, easing: HOUSE, fill: 'backwards' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const w = it.slot ? SLOT_W : chipW(it.name, fs)
  return (
    <div className="absolute" style={{ left: p.x - w / 2, top: p.y - chipH(fs) / 2, transition: instant ? 'none' : `left 520ms ${HOUSE}, top 520ms ${HOUSE}` }}>
      {it.slot ? (
        <span
          ref={ref}
          className="grid place-items-center rounded-full font-semibold leading-none"
          aria-hidden
          style={{ width: w, height: chipH(fs), background: '#D5DCE6', boxShadow: `inset 0 0 0 1.5px ${colors.muted}55` }}
        />
      ) : (
        <Chip name={it.name} fs={fs} refEl={(el) => (ref.current = el)} />
      )}
    </div>
  )
}

/* ----------------------------------------------------------------- arrow */

/** An arrow that draws itself along its path, then its filled head (generate-slides 2b, item 10). */
export function DrawArrow({ on, w = 70, h = 24, color = colors.accentDark, delay = 0 }: { on: boolean; w?: number; h?: number; color?: string; delay?: number }) {
  const instant = useInstant()
  const t = instant ? 'none' : `stroke-dashoffset 860ms cubic-bezier(0.65,0,0.35,1) ${delay}ms`
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="shrink-0 overflow-visible">
      <path d={`M2 ${h / 2} H${w - 14}`} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" pathLength={1} strokeDasharray="1" style={{ strokeDashoffset: on ? 0 : 1, transition: t }} />
      <path d={`M${w - 16} ${h / 2 - 8} L${w - 2} ${h / 2} L${w - 16} ${h / 2 + 8} Z`} fill={color} style={{ opacity: on ? 1 : 0, transition: instant ? 'none' : `opacity 240ms ${HOUSE} ${delay + 700}ms` }} />
    </svg>
  )
}

/* ------------------------------------------------------------- op icon */

/**
 * The original deck's operation icon (deck slide 14): two small overlapping
 * circles with the operation's regions filled. Also K1's per-example mark.
 */
export function OpIcon({ op, size = 54, on = true }: { op: '|' | '&' | '-' | '^' | 'sub' | 'none'; size?: number; on?: boolean }) {
  const id = useRef(`op-${Math.random().toString(36).slice(2)}`).current
  const instant = useInstant()
  const r = size * 0.3
  const h = size * 0.7
  const a = { cx: size * 0.36, cy: h / 2 }
  const b = { cx: size * 0.64, cy: h / 2 }
  const fill = on ? colors.brand : colors.muted
  const L = op === '|' || op === '-' || op === '^'
  const Rr = op === '|' || op === '^'
  const M = op === '|' || op === '&'
  const t = instant ? 'none' : `fill-opacity 420ms ${HOUSE}`
  if (op === 'sub')
    return (
      <svg width={size} height={h} aria-hidden>
        <circle cx={size / 2} cy={h / 2} r={r * 1.12} fill={fill} fillOpacity={0.25} stroke={colors.brandDark} strokeWidth="1.8" />
        <circle cx={size / 2 + r * 0.25} cy={h / 2 + r * 0.25} r={r * 0.5} fill={fill} fillOpacity={0.85} stroke={colors.brandDark} strokeWidth="1.8" />
      </svg>
    )
  return (
    <svg width={size} height={h} aria-hidden>
      <defs>
        <clipPath id={id}>
          <circle cx={a.cx} cy={a.cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={a.cx} cy={a.cy} r={r} fill={fill} fillOpacity={L ? 0.85 : 0} style={{ transition: t }} />
      <circle cx={b.cx} cy={b.cy} r={r} fill={fill} fillOpacity={Rr ? 0.85 : 0} style={{ transition: t }} />
      <circle cx={b.cx} cy={b.cy} r={r} clipPath={`url(#${id})`} fill={M ? fill : colors.white} fillOpacity={M ? 0.85 : 1} style={{ transition: t }} />
      <circle cx={a.cx} cy={a.cy} r={r} fill="none" stroke={colors.brandDark} strokeWidth="1.8" />
      <circle cx={b.cx} cy={b.cy} r={r} fill="none" stroke={colors.brandDark} strokeWidth="1.8" />
    </svg>
  )
}

/* -------------------------------------------------------------- the data */

/** Teja's groups, the same on every card (spec note 3: 8, 7, 3 in both, 12 in Fest crew). */
export const CSE = ['Teja', 'Ravi', 'Kiran', 'Anu', 'Sneha', 'Pooja', 'Divya', 'Vamsi']
export const CRICKET = ['Teja', 'Ravi', 'Kiran', 'Arjun', 'Harsha', 'Manoj', 'Rahul']
export const DANCE = ['Anu', 'Sneha', 'Arjun', 'Meena', 'Lakshmi']
export const BUS = ['Meena', 'Lakshmi', 'Pooja', 'Divya']
export const VOLUNTEERS = ['Anu', 'Ravi', 'Divya', 'Sneha']
