import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { MOTION, motionHeld } from '@/motion/tokens'
import { TILE_SKIN } from '@/decks/figures/card'
import { litRing } from '@/decks/figures/net/frames'
import { Ico3D, type Ico3DName, type Loop } from './icons3d'

/*
 * FIGURE KIT for technical visuals (generate-slides standing correction 17, cloud course R14, FIG-38; user 2026-11-16:
 * Session 13's improved card style "for this session and further sessions"). Promoted from Session 13's correction
 * round (iam_fundamentals/custom/c2.tsx), so a session's custom figures START from it instead of re-deriving it:
 *
 *   Frame        a fixed-size stage centred in the figure box (all coordinates below are inside it)
 *   Show         an ease-up entrance (520 ms, the deck's ease), instant on jumps
 *   Plinth       a white plinth tile holding any icon (white to pale blue, 1.5 px inset rim, soft drop shadow)
 *   MarkTile     an official mark on the same white tile, a soft halo breathing behind (the mark never moves)
 *   Panel        a white card that rings orange while it is the part being explained
 *   Wire         an ORTHOGONAL connector through points: soft-cornered elbows, draws itself, the arrow tip exactly on
 *                the last point (put that point on the target's edge, computed from the same constants as the box)
 *   Junction     a dot where wires merge
 *   Pair         a 3D icon with a second one on its lower-right corner
 *   useHot       the lit item: the current press while building, then a walk first -> last -> first, -1 held
 *   keyframes()  per-file flow-dot keyframes: `const K = keyframes('t16a')`, `K.ride(name, pts, t0, t1, period)`
 *                returns a class for `Token`; add `K.css()` to the file's exported css
 *   Token        a dot riding a `ride` class
 *   loopCls/loopVars  quiet loops on a span (halo, glow, ripple, press, breathe)
 *   tag/heading/body  type helpers (DOM text, the deck font)
 *
 * Padding rule: at least 20 design px, equal on all four sides, inside every stage and card (PAD).
 * Loops are CSS animations of transform / opacity on HTML elements or root <svg>s only (low-end PCs); every one is
 * held on ?still, thumbnails and reduced motion. Include `figkitCss` (once) in the session's exported css.
 */

export type Pt = [number, number]
export const EASE = MOTION.ease
export const FONT = "'DM Sans', system-ui, sans-serif"
export const ORANGE = colors.accent
export const PAD = 20
export const TILE_BG = 'linear-gradient(180deg, #FFFFFF 0%, #EEF3FF 100%)'
export const TILE_RIM = 'inset 0 0 0 1.5px #D3DEF6, 0 10px 20px -12px rgba(31,64,140,0.5)'
export const TILE_BG_WARM = 'linear-gradient(180deg, #FFFFFF 0%, #FFF1E6 100%)'
export const TILE_RIM_WARM = 'inset 0 0 0 1.5px #FFD2B0, 0 10px 20px -12px rgba(31,64,140,0.5)'

export const useHeld = () => motionHeld(useInstant())

/* ------------------------------------------------------------------ loop vocabulary */

export type FkLoop = 'halo' | 'glow' | 'ripple' | 'press' | 'breathe' | 'shake' | 'blink'
export const loopCls = (kind: FkLoop) => `fk fk-${kind}`
export const loopVars = (d = 0, t?: number): CSSProperties =>
  ({ ['--fk-d' as string]: `${-d}s`, ...(t ? { ['--fk-t' as string]: `${t}s` } : {}) }) as CSSProperties

export function useCycle(n: number, done: boolean, periodMs = 1500) {
  const held = useHeld()
  const [i, setI] = useState(0)
  useEffect(() => {
    setI(0)
    if (!done || held || n < 1) return
    const id = window.setInterval(() => setI((v) => (v + 1) % n), periodMs)
    return () => window.clearInterval(id)
  }, [n, done, held, periodMs])
  return done && !held ? i : -1
}

/** the lit item: the current press while building, then the walking cycle; -1 on held frames (nothing lit) */
export function useHot(n: number, step: number, periodMs?: number) {
  const held = useHeld()
  const cyc = useCycle(n, step >= n, periodMs)
  if (held) return -1
  return cyc >= 0 ? cyc : step - 1
}

/* ------------------------------------------------------------------ flow dots, as CSS keyframes */

const pct = (v: number) => `${Math.max(0, Math.min(100, v)).toFixed(2)}%`

/** one file's flow-dot keyframes. Call `ride` at module level, then put `css()` in the file's exported css. */
export function keyframes(prefix: string) {
  const KF: string[] = []
  /** a token riding the polyline `pts` during [t0, t1] of a `period`-second loop (timed by segment length) */
  function ride(name: string, pts: Pt[], t0: number, t1: number, period: number, endScale = 0.7) {
    const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]))
    const total = lens.reduce((a, b) => a + b, 0) || 1
    const at = (k: number) => ((t0 + ((t1 - t0) * lens.slice(0, k).reduce((a, b) => a + b, 0)) / total) / period) * 100
    const tr = (p: Pt) => `translate(${p[0]}px, ${p[1]}px)`
    const lines = [`0%, ${pct((t0 / period) * 100)} { transform: ${tr(pts[0])} scale(0.6); opacity: 0 }`]
    lines.push(`${pct((t0 / period) * 100 + 2)} { opacity: 1 }`)
    pts.forEach((p, k) => k > 0 && lines.push(`${pct(at(k))} { transform: ${tr(p)} scale(1)${k === pts.length - 1 ? '; opacity: 1' : ''} }`))
    lines.push(`${pct((t1 / period) * 100 + 3)} { transform: ${tr(pts[pts.length - 1])} scale(${endScale}); opacity: 0 }`)
    lines.push(`100% { transform: ${tr(pts[pts.length - 1])} scale(${endScale}); opacity: 0 }`)
    const cls = `${prefix}-${name}`
    KF.push(`@keyframes ${cls} { ${lines.join(' ')} }\n.${cls} { animation: ${cls} ${period}s ease-in-out infinite; }`)
    return cls
  }
  return { ride, css: () => KF.join('\n') }
}

/** a dot carried by a `ride` class (placed from the frame's 0,0); nothing on held frames */
export function Token({ cls, tone = colors.brand, size = 10, on = true, square = false }: { cls: string; tone?: string; size?: number; on?: boolean; square?: boolean }) {
  const held = useHeld()
  if (held || !on) return null
  return (
    <span aria-hidden style={{ position: 'absolute', left: -size / 2, top: -size / 2, width: size, height: size, zIndex: 5, pointerEvents: 'none' }}>
      <span className={cls} style={{ display: 'block', width: size, height: size, borderRadius: square ? Math.round(size * 0.28) : 99, background: tone, boxShadow: `0 0 0 4px ${tone}2e, 0 4px 10px -4px ${tone}`, opacity: 0 }} />
    </span>
  )
}

/* ------------------------------------------------------------------ type and pieces */

export const heading = (size: number, color: string = colors.ink): CSSProperties => ({ fontFamily: FONT, fontWeight: 700, fontSize: size, lineHeight: 1.2, color })
export const body = (size: number, color: string = colors.ink): CSSProperties => ({ fontFamily: FONT, fontWeight: 500, fontSize: size, lineHeight: 1.36, color })
export const tag = (size = 14, color: string = colors.brandDeep): CSSProperties => ({ fontFamily: FONT, fontWeight: 600, fontSize: size, lineHeight: 1.15, color, whiteSpace: 'nowrap', textAlign: 'center' })

export function Show({ on, children, style, delay = 0, lift = 6 }: { on: boolean; children: ReactNode; style?: CSSProperties; delay?: number; lift?: number }) {
  const instant = useInstant()
  return (
    <div
      style={{
        opacity: on ? 1 : 0,
        transform: on ? 'none' : `translateY(${lift}px)`,
        transition: instant ? 'none' : `opacity 520ms ${EASE} ${on ? delay : 0}ms, transform 520ms ${EASE} ${on ? delay : 0}ms`,
        pointerEvents: on ? undefined : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** a w x h stage centred in the figure box; every child is placed in its coordinates */
export const Frame = ({ w, h, children }: { w: number; h: number; children: ReactNode }) => (
  <div style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%' }}>
    <div style={{ position: 'relative', width: w, height: h }}>{children}</div>
  </div>
)

/** a plinth tile holding any icon node */
export const Plinth = ({ size = 56, children, warm = false, lit = false }: { size?: number; children: ReactNode; warm?: boolean; lit?: boolean }) => {
  const instant = useInstant()
  return (
    <span
      data-fk="tile"
      style={{
        display: 'grid', placeItems: 'center', width: size, height: size, borderRadius: Math.round(size * 0.28), flexShrink: 0,
        background: warm ? TILE_BG_WARM : TILE_BG,
        boxShadow: lit ? `inset 0 0 0 2.5px ${ORANGE}, 0 10px 22px -12px rgba(255,138,61,0.7)` : warm ? TILE_RIM_WARM : TILE_RIM,
        transition: instant ? 'none' : `box-shadow 420ms ${EASE}`,
      }}
    >
      {children}
    </span>
  )
}

/** a 3D icon on its plinth, the commonest piece */
export const IconTile = ({ name, size = 56, k = 0.74, loop = 'bob', d = 0, t, lit = false, warm = false, badge }: { name: Ico3DName; size?: number; k?: number; loop?: Loop; d?: number; t?: number; lit?: boolean; warm?: boolean; badge?: Parameters<typeof Ico3D>[0]['badge'] }) => (
  <Plinth size={size} lit={lit} warm={warm}>
    <Ico3D name={name} size={Math.round(size * k)} loop={loop} d={d} t={t} badge={badge} />
  </Plinth>
)

/** an official mark on its white tile (rule 54); the mark never moves, a soft halo breathes behind it */
export function MarkTile({ src, size = 56, scale = 0.68, lit = false }: { src: string; size?: number; scale?: number; lit?: boolean }) {
  const r = Math.round(size * 0.28)
  const instant = useInstant()
  return (
    <span style={{ position: 'relative', display: 'grid', placeItems: 'center', width: size, height: size, flexShrink: 0 }}>
      <span aria-hidden className={loopCls('halo')} style={{ position: 'absolute', inset: -5, borderRadius: r + 5, background: `radial-gradient(closest-side, ${colors.brand}30, ${colors.brand}00)`, ...loopVars(0, 3.6) }} />
      <span style={{ position: 'absolute', inset: 0, borderRadius: r, background: TILE_BG, boxShadow: lit ? `inset 0 0 0 2.5px ${ORANGE}, 0 10px 22px -12px rgba(255,138,61,0.7)` : TILE_RIM, display: 'grid', placeItems: 'center', transition: instant ? 'none' : `box-shadow 420ms ${EASE}` }}>
        <img src={src} alt="" aria-hidden draggable={false} style={{ width: Math.round(size * scale), height: Math.round(size * scale), objectFit: 'contain', display: 'block' }} />
      </span>
    </span>
  )
}

/** a white card that rings while it is the part being explained */
export function Panel({ x, y, w, h, lit = false, on = true, radius = 18, children, delay = 0, tint, edge, style }: { x: number; y: number; w: number; h: number; lit?: boolean; on?: boolean; radius?: number; children?: ReactNode; delay?: number; tint?: string; edge?: string; style?: CSSProperties }) {
  const instant = useInstant()
  const base = edge ? `inset 0 0 0 2px ${edge}, 0 12px 24px -16px rgba(31,64,140,0.34)` : (TILE_SKIN.boxShadow as string)
  return (
    <Show on={on} delay={delay} style={{ position: 'absolute', left: x, top: y, width: w, height: h, zIndex: 2 }}>
      <div data-fk="card" style={{ position: 'absolute', inset: 0, borderRadius: radius, ...TILE_SKIN, ...(tint ? { background: tint } : {}), boxShadow: litRing(lit, base), transition: instant ? 'none' : `box-shadow 420ms ${EASE}` }} />
      <div style={{ position: 'absolute', inset: 0, ...style }}>{children}</div>
    </Show>
  )
}

/** a rounded-corner orthogonal path through `pts` (every segment horizontal or vertical) */
export function elbowD(pts: Pt[], r = 10) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i]
    if (i < pts.length - 1) {
      const [px, py] = pts[i - 1]
      const [nx, ny] = pts[i + 1]
      const l1 = Math.hypot(x - px, y - py)
      const l2 = Math.hypot(nx - x, ny - y)
      const k = Math.min(r, l1 / 2, l2 / 2)
      d += ` L ${x - ((x - px) / l1) * k} ${y - ((y - py) / l1) * k} Q ${x} ${y} ${x + ((nx - x) / l2) * k} ${y + ((ny - y) / l2) * k}`
    } else d += ` L ${x} ${y}`
  }
  return d
}
export const plen = (pts: Pt[]) => pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0)

/**
 * AN ORTHOGONAL WIRE through `pts`: draws itself when shown; with `head`, a filled arrowhead whose tip is exactly the
 * last point (the line stops at the head's base). The last segment's direction orients the head. `dash` draws a thin
 * dashed line (a link that is not a flow, such as the TR's dashed "blocked" users), sparingly (R7.4).
 */
export function Wire({ pts, on = true, color = colors.brand, lit = false, width = 2.6, head = 10, delay = 0, dash, opacity = 1 }: { pts: Pt[]; on?: boolean; color?: string; lit?: boolean; width?: number; head?: number; delay?: number; dash?: string; opacity?: number }) {
  const instant = useInstant()
  const c = lit ? ORANGE : color
  const n = pts.length
  const [tx, ty] = pts[n - 1]
  const [sx, sy] = pts[n - 2]
  const L = Math.hypot(tx - sx, ty - sy) || 1
  const ux = (tx - sx) / L
  const uy = (ty - sy) / L
  const line: Pt[] = head ? [...pts.slice(0, -1), [tx - ux * head * 0.9, ty - uy * head * 0.9]] : pts
  const len = plen(line) + 2
  const tip = `${tx},${ty} ${tx - ux * head - uy * head * 0.58},${ty - uy * head + ux * head * 0.58} ${tx - ux * head + uy * head * 0.58},${ty - uy * head - ux * head * 0.58}`
  return (
    <svg aria-hidden style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 1, opacity }} width={1} height={1}>
      {dash ? (
        <path d={elbowD(line)} fill="none" stroke={c} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash} style={{ opacity: on ? 1 : 0, transition: instant ? 'none' : `opacity 520ms ${EASE} ${on ? delay : 0}ms, stroke 420ms ${EASE}` }} />
      ) : (
        <path d={elbowD(line)} fill="none" stroke={c} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={on ? 0 : len} style={{ transition: instant ? 'none' : `stroke-dashoffset 820ms ${EASE} ${on ? delay : 0}ms, stroke 420ms ${EASE}` }} />
      )}
      {head > 0 && <polygon points={tip} fill={c} style={{ opacity: on ? 1 : 0, transition: instant ? 'none' : `opacity 300ms ${EASE} ${on ? delay + 640 : 0}ms, fill 420ms ${EASE}` }} />}
    </svg>
  )
}

/** a junction dot where wires merge */
export function Junction({ x, y, on = true, lit = false }: { x: number; y: number; on?: boolean; lit?: boolean }) {
  const instant = useInstant()
  return <span aria-hidden style={{ position: 'absolute', left: x - 5, top: y - 5, width: 10, height: 10, borderRadius: 99, background: lit ? ORANGE : colors.brand, boxShadow: '0 0 0 3px #FFFFFF', opacity: on ? 1 : 0, transition: instant ? 'none' : `opacity 420ms ${EASE} 500ms, background 420ms ${EASE}`, zIndex: 2 }} />
}

/** a 3D icon with a second one laid over its lower-right corner (a composite mark) */
export function Pair({ main, over, size = 52, k = 0.5, loop = 'bob', d = 0, overLoop = 'pulse' }: { main: Ico3DName; over: Ico3DName; size?: number; k?: number; loop?: Loop; d?: number; overLoop?: Loop }) {
  const o = Math.round(size * k)
  return (
    <span style={{ position: 'relative', display: 'inline-grid', placeItems: 'center', width: size, height: size, flexShrink: 0 }}>
      <Ico3D name={main} size={size} loop={loop} d={d} />
      <span style={{ position: 'absolute', right: -Math.round(o * 0.22), bottom: -Math.round(o * 0.18), borderRadius: 99, background: '#FFFFFF', boxShadow: '0 4px 10px -5px rgba(31,64,140,0.6)', display: 'grid', placeItems: 'center', width: o + 4, height: o + 4 }}>
        <Ico3D name={over} size={o} loop={overLoop} d={d + 0.4} t={2.4} />
      </span>
    </span>
  )
}

/** an absolutely placed box whose CENTRE is (x, y) */
export const At = ({ x, y, w, h, children, style }: { x: number; y: number; w: number; h: number; children?: ReactNode; style?: CSSProperties }) => (
  <div style={{ position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, display: 'grid', placeItems: 'center', zIndex: 3, ...style }}>{children}</div>
)

/** an icon tile with its single-word Title Case tag under it (R13), centred on (x, y) of the TILE */
export function Tagged({ x, y, label, children, w = 120, gap = 8, size = 56, tagSize = 14, on = true, delay = 0 }: { x: number; y: number; label: string; children: ReactNode; w?: number; gap?: number; size?: number; tagSize?: number; on?: boolean; delay?: number }) {
  return (
    <Show on={on} delay={delay} style={{ position: 'absolute', left: x - w / 2, top: y - size / 2, width: w, zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap }}>
      <div style={{ width: size, height: size, display: 'grid', placeItems: 'center' }}>{children}</div>
      <span style={tag(tagSize)}>{label}</span>
    </Show>
  )
}

export const figkitCss = `
.fk { animation-delay: var(--fk-d, 0s); }
@keyframes fk-halo { 0%, 100% { opacity: 0.35; transform: scale(0.985) } 50% { opacity: 0.9; transform: scale(1.015) } }
.fk-halo { animation: fk-halo var(--fk-t, 3.6s) cubic-bezier(0.45,0,0.55,1) infinite; }
@keyframes fk-glow { 0%, 100% { opacity: 1 } 50% { opacity: 0.74 } }
.fk-glow { animation: fk-glow var(--fk-t, 2.6s) ease-in-out infinite; }
@keyframes fk-breathe { 0%, 100% { opacity: 0.8 } 50% { opacity: 1 } }
.fk-breathe { animation: fk-breathe var(--fk-t, 3.2s) ease-in-out infinite; }
@keyframes fk-ripple { 0% { transform: scale(0.94); opacity: 0.9 } 100% { transform: scale(1.14); opacity: 0 } }
.fk-ripple { animation: fk-ripple var(--fk-t, 2.8s) ease-out infinite; }
@keyframes fk-press { 0%, 100% { transform: translateX(8px) scale(0.96) } 45%, 60% { transform: translateX(-4px) scale(1.06) } }
.fk-press { animation: fk-press var(--fk-t, 2.6s) cubic-bezier(0.45,0,0.55,1) infinite; }
@keyframes fk-shake { 0%, 100% { transform: translateX(0) } 20% { transform: translateX(-2px) } 40% { transform: translateX(2px) } 60% { transform: translateX(-1.5px) } 80% { transform: translateX(1.5px) } }
.fk-shake { animation: fk-shake var(--fk-t, 0.9s) linear infinite; }
@keyframes fk-blink { 0%, 100% { opacity: 1 } 50% { opacity: 0.35 } }
.fk-blink { animation: fk-blink var(--fk-t, 1.6s) ease-in-out infinite; }
.cc-still .fk, .deck-thumb .fk { animation: none !important; }
.cc-still .fk-halo, .deck-thumb .fk-halo { opacity: 0.5 !important; transform: none !important; }
@media (prefers-reduced-motion: reduce) { .fk { animation: none !important; } }
`
