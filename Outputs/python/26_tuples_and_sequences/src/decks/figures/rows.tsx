import { useEffect, useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react'
import { colors } from '@/design/tokens'
import { useTween } from '@/ui'
import { useInstant } from '@/motion/instant'

/**
 * THE ONE PICTURE OF PF 26 "TUPLES AND SEQUENCES" (spec note 5).
 *
 *   Row       a row of cells with its index under each cell, from 0. A list's
 *             row has a round handle on top of every cell (you can grab it);
 *             a tuple's row has a small lock at its right end and no handles.
 *             A plain row (a string's letters, a range) has neither.
 *   NameBox   a name over a box. Empty, the box is dashed; a value drops in.
 *             One component for C15, E1, G2, C16 and C17 (C15's play line:
 *             "keep them the same as E1's").
 *   CountBar  Python counts first: `3 values` against `2 names`, = or ≠.
 *   flyFrom   a value that moves from one place to another (a cell into a
 *             name box, a letter into a new row) is animated from where it
 *             was, so the room sees it travel. Transform and opacity only.
 *
 * Every colour is a token (content rule 37); every timing is the explanatory
 * tier (generate-slides 4b). Session-local.
 */

const HOUSE = 'cubic-bezier(0.22, 1, 0.36, 1)'

export type CellState = 'plain' | 'lit' | 'hit' | 'check' | 'miss' | 'grey' | 'new' | 'bad'

const SZ = {
  lg: { h: 62, font: 22, idx: 17, pad: 28, minW: 62, gap: 8 },
  md: { h: 52, font: 19, idx: 16, pad: 24, minW: 52, gap: 6 },
  sm: { h: 42, font: 16, idx: 15, pad: 18, minW: 42, gap: 5 },
  xs: { h: 30, font: 13, idx: 12, pad: 12, minW: 30, gap: 4 },
} as const
export type RowSize = keyof typeof SZ

function cellLook(st: CellState): { bg: string; ring: string; ink: string; thick?: boolean; fade?: number } {
  switch (st) {
    case 'lit':
      return { bg: colors.surface2, ring: colors.brand, ink: colors.brandDark, thick: true }
    case 'hit':
      return { bg: '#E9F8EF', ring: colors.success, ink: colors.ink, thick: true }
    case 'check':
      return { bg: '#FFF4EC', ring: colors.accent, ink: colors.ink, thick: true }
    case 'miss':
      return { bg: colors.surface, ring: colors.line, ink: colors.muted, fade: 0.6 }
    case 'grey':
      return { bg: colors.surface, ring: colors.line, ink: colors.muted, fade: 0.45 }
    case 'new':
      return { bg: colors.surface2, ring: colors.brand, ink: colors.brandDark }
    case 'bad':
      return { bg: '#FDECEC', ring: colors.danger, ink: colors.danger, thick: true }
    default:
      return { bg: colors.white, ring: colors.line, ink: colors.ink }
  }
}

/** The tuple's lock: a small padlock in the brand's dark blue. */
export function Lock({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="locked" role="img">
      <path d="M7.5 10.5V7.8a4.5 4.5 0 0 1 9 0v2.7" fill="none" stroke={colors.brandDark} strokeWidth="2.4" strokeLinecap="round" />
      <rect x="4.5" y="10" width="15" height="11" rx="2.6" fill={colors.brandDark} />
      <circle cx="12" cy="15.2" r="1.7" fill={colors.white} />
    </svg>
  )
}

/** Width of each cell: even across the row (the longest item decides), or each its own (`fit`). */
function widths(items: string[], size: RowSize, fit: boolean, fixed?: number) {
  const s = SZ[size]
  const w = (t: string) => Math.max(s.minW, Math.round(t.length * s.font * 0.61 + s.pad))
  if (fixed) return items.map(() => fixed)
  if (fit) return items.map(w)
  const m = Math.max(s.minW, ...items.map(w))
  return items.map(() => m)
}

export function Row({
  items,
  kind = 'tuple',
  size = 'md',
  states = {},
  indices = true,
  name,
  fit = false,
  cellW,
  shake,
  shakeKey,
  faded = false,
  cellRefs,
  hidden = [],
  className = '',
}: {
  /** What each cell shows, already written as it should read (`'Tea'`, `50`). */
  items: string[]
  kind?: 'tuple' | 'list' | 'plain'
  size?: RowSize
  states?: Record<number, CellState>
  indices?: boolean
  /** The name tag at the row's left (`prices`). */
  name?: ReactNode
  /** Each cell as wide as its own item, for a row of very different lengths. */
  fit?: boolean
  cellW?: number
  /** The cell that shakes against the lock, when `shakeKey` changes. */
  shake?: number
  shakeKey?: string | number
  faded?: boolean
  /** Refs to each cell, for a value that flies out of it. */
  cellRefs?: RefObject<(HTMLSpanElement | null)[]>
  /** Cells drawn as empty slots (a row still filling). */
  hidden?: number[]
  className?: string
}) {
  const s = SZ[size]
  const ws = widths(items, size, fit, cellW)
  const tween = useTween(420)
  const instant = useInstant()
  const shakeRef = useRef<HTMLSpanElement | null>(null)
  useEffect(() => {
    if (shake === undefined || shakeKey === undefined || instant) return
    const el = shakeRef.current
    if (!el) return
    el.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-9px)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(4px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 620, easing: 'ease-out', delay: 120 },
    )
  }, [shake, shakeKey, instant])
  const handle = kind === 'list'
  return (
    <div className={`flex items-start ${className}`} style={{ gap: 12, opacity: faded ? 0.38 : 1, transition: instant ? 'none' : `opacity 520ms ${HOUSE}` }}>
      {name !== undefined && (
        <span className="shrink-0 whitespace-nowrap rounded-lg px-3 font-mono font-bold" style={{ marginTop: handle ? 8 : 0, height: s.h, lineHeight: `${s.h}px`, fontSize: s.font - 2, background: colors.brandDark, color: colors.white }}>
          {name}
        </span>
      )}
      <div className="flex items-start" style={{ gap: s.gap, paddingTop: handle ? 8 : 0 }}>
        {items.map((t, i) => {
          const L = cellLook(states[i] ?? 'plain')
          const empty = hidden.includes(i)
          return (
            <div key={i} className="flex flex-col items-center" style={{ width: ws[i] }}>
              <span
                ref={(el) => {
                  if (i === shake) shakeRef.current = el
                  if (cellRefs?.current) cellRefs.current[i] = el
                }}
                className="relative grid place-items-center rounded-xl font-mono font-semibold"
                style={{
                  width: ws[i],
                  height: s.h,
                  fontSize: s.font,
                  background: empty ? 'transparent' : L.bg,
                  color: empty ? 'transparent' : L.ink,
                  border: `${L.thick ? 3 : 2}px ${empty ? 'dashed' : 'solid'} ${empty ? colors.line : L.ring}`,
                  opacity: L.fade ?? 1,
                  transition: instant ? 'none' : tween,
                  whiteSpace: 'pre',
                }}
              >
                {handle && (
                  <span aria-hidden className="sm-bump absolute left-1/2 -translate-x-1/2 rounded-full" style={{ top: -9, width: 14, height: 14, background: colors.white, boxShadow: `inset 0 0 0 3px ${colors.brand}` }} />
                )}
                {t}
              </span>
              {indices && (
                <span className="mt-1.5 font-mono leading-none" style={{ fontSize: s.idx, color: colors.muted }}>
                  {i}
                </span>
              )}
            </div>
          )
        })}
      </div>
      {kind === 'tuple' && (
        <span className="sm-bump shrink-0" style={{ marginTop: Math.round((s.h - Math.round(s.h * 0.46)) / 2) }}>
          <Lock size={Math.round(s.h * 0.46)} />
        </span>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- fly */

/**
 * Animate `target` from where `source` sits now: the value travels. Reads both
 * rectangles in screen pixels and divides by the slide's own scale, so the
 * move is right at any window size. Skipped during an instant jump.
 */
export function flyFrom(target: HTMLElement | null, source: HTMLElement | null, ms = 760, delay = 0) {
  if (!target || !source || !source.isConnected) return
  const t = target.getBoundingClientRect()
  const s = source.getBoundingClientRect()
  /* a source with no box (unmounted, display none) would read as the page's top-left corner */
  if (s.width === 0 && s.height === 0) return
  const scale = target.offsetWidth ? t.width / target.offsetWidth : 1
  const dx = (s.left + s.width / 2 - (t.left + t.width / 2)) / scale
  const dy = (s.top + s.height / 2 - (t.top + t.height / 2)) / scale
  target.animate([{ transform: `translate(${dx}px, ${dy}px)`, opacity: 0.35 }, { transform: 'translate(0, 0)', opacity: 1 }], { duration: ms, delay, easing: HOUSE, fill: 'backwards' })
}

/** A block that, when it mounts, travels in from where `from()` is now (the paid row lifting out of the app). */
export function FlyIn({ from, children, ms = 1100, delay = 120 }: { from: () => HTMLElement | null; children: ReactNode; ms?: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const instant = useInstant()
  useLayoutEffect(() => {
    if (!instant) flyFrom(ref.current, from(), ms, delay)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <div ref={ref}>{children}</div>
}

/* ------------------------------------------------------------- name box */

/**
 * A name over a box. `value` null draws the empty dashed box. When a value
 * arrives and `from` points at a cell, the value flies in from that cell.
 */
export function NameBox({
  name,
  value,
  from,
  width = 150,
  size = 'md',
  tone = 'plain',
}: {
  name: string
  value: string | null
  from?: HTMLElement | null
  width?: number
  size?: RowSize
  /** `stop`: the counts did not match, the box stays empty with a red rim. */
  tone?: 'plain' | 'stop'
}) {
  const s = SZ[size]
  const instant = useInstant()
  const ref = useRef<HTMLSpanElement>(null)
  const had = useRef(value)
  useLayoutEffect(() => {
    const was = had.current
    had.current = value
    if (instant || value === null || was !== null) return
    if (from) flyFrom(ref.current, from)
    else ref.current?.animate([{ opacity: 0, transform: 'translateY(-10px)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: HOUSE })
  }, [value, from, instant])
  const has = value !== null
  return (
    <div className="flex flex-col items-center gap-1.5" style={{ width }}>
      <span className="font-mono font-bold leading-none" style={{ fontSize: s.font - 1, color: colors.brandDark }}>
        {name}
      </span>
      <span
        className="grid w-full place-items-center rounded-xl font-mono font-semibold"
        style={{
          height: s.h,
          fontSize: s.font,
          background: has ? '#E9F8EF' : 'transparent',
          border: `${has ? 3 : 2}px ${has ? 'solid' : 'dashed'} ${has ? colors.success : tone === 'stop' ? colors.danger : colors.line}`,
          transition: instant ? 'none' : `border-color 420ms ${HOUSE}, background-color 420ms ${HOUSE}`,
          whiteSpace: 'pre',
        }}
      >
        <span ref={ref} className="inline-block" style={{ color: colors.ink }}>
          {value ?? ''}
        </span>
      </span>
    </div>
  )
}

/* ----------------------------------------------------------- count bar */

/** `3 values` against `2 names`: = when they match, ≠ in the danger tone when not. */
export function CountBar({ values, names, on = true }: { values: number; names: number; on?: boolean }) {
  const instant = useInstant()
  const match = values === names
  const tone = match ? colors.success : colors.danger
  return (
    <div
      className="inline-flex items-center gap-3 rounded-xl bg-white px-4 py-1.5 font-heading text-[19px] font-bold"
      style={{ boxShadow: `inset 0 0 0 2px ${on ? tone : colors.line}`, opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)', transition: instant ? 'none' : `opacity 420ms ${HOUSE}, transform 420ms ${HOUSE}, box-shadow 420ms ${HOUSE}` }}
    >
      <span style={{ color: colors.ink }}>{values} values</span>
      <span className="font-mono text-[24px] leading-none" style={{ color: tone }}>
        {match ? '=' : '≠'}
      </span>
      <span style={{ color: colors.ink }}>{names} names</span>
    </div>
  )
}

/* -------------------------------------------------------------- quote */

/** A Python value as `print` would show it inside a tuple: strings in single quotes. */
export const py = (v: unknown) => (typeof v === 'string' ? `'${v}'` : String(v))
