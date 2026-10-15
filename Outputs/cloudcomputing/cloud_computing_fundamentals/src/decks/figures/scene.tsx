import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors, easing } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { Panel, Group } from '@/ui/foundations/common'
import { StepControls } from '@/ui/foundations/controls'
import { Press } from '@/ui/foundations/motion'

/**
 * THE PIECES EVERY FIGURE SLIDE OF THIS DECK IS BUILT FROM.
 *
 * `Card` is the frame: the kit's zoned header, the reference's lead as the
 * body's first block (content rule 32), one body BOX 1110px wide on the left
 * edge (content rule 38: the lead and the box share the left edge, and the box
 * is narrower than the zone so `mixed-align-check` reads it as one left block),
 * and the kit's Next and Autoplay under it when the slide has steps.
 *
 * Inside the box a scene is laid out with absolute positions on a fixed
 * stage, so a step never moves what is already there.
 */

export const BOX_W = 1110

/** Harness URLs hold every live loop still (Python 29's lesson: a moving svg stalls the screenshot). */
export const STILL = typeof window !== 'undefined' && /[?&](all|noauto|still)(=|&|$)/.test(window.location.search)

export function Card({
  id,
  kicker,
  title,
  lead,
  lesson,
  beat,
  total,
  children,
}: {
  id: string
  kicker: string
  title: string
  lead?: ReactNode
  lesson: string
  /** the beat on screen (from `useBeats`) and the slide's beat count; no controls when absent */
  beat?: number
  total?: number
  children: ReactNode
}) {
  return (
    <Panel kicker={kicker} title={title} lead={lead} lesson={lesson} mode="top" wide spec={id} presses={total ? total - 1 : 0}>
      <div style={{ width: BOX_W }}>{children}</div>
      {beat !== undefined && total !== undefined && total > 1 && <StepControls at={beat} total={total} />}
    </Panel>
  )
}

/** A lead that holds two sentences: one line each (content rule 36). */
export function LeadLines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((l, i) => (
        <span key={i} className="block">
          {l}
        </span>
      ))}
    </>
  )
}

/* ------------------------------------------------------------------ the rail */

export type RailItem = { text: ReactNode; at: number }

/**
 * The reference's bullets, each arriving on the beat that draws it (content
 * rule 6: the line and its picture arrive together). The bullet whose beat is
 * on screen is lit; the earlier ones stay, quieter.
 */
export function Rail({ items, beat, width = 372, size = 17, gap = 10 }: { items: RailItem[]; beat: number; width?: number; size?: number; gap?: number }) {
  const instant = useInstant()
  const ease = instant ? 'none' : `all 480ms cubic-bezier(0.22,1,0.36,1)`
  return (
    <div className="flex shrink-0 flex-col" style={{ width, gap }}>
      {items.map((it, i) => {
        const shown = beat >= it.at
        const now = beat === it.at
        return (
          <div
            key={i}
            className="flex items-start gap-3 rounded-2xl px-3.5 py-2.5"
            style={{
              background: now ? 'rgba(232,240,255,0.95)' : 'rgba(255,255,255,0.7)',
              boxShadow: now ? `inset 0 0 0 2px ${colors.brand}` : `inset 0 0 0 1px ${colors.line}`,
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : 'translateY(8px)',
              transition: ease,
            }}
          >
            <span className="mt-[7px] grid h-[14px] w-[14px] shrink-0 place-items-center rounded-full" style={{ background: now ? colors.brand : colors.surface2, boxShadow: `inset 0 0 0 1.5px ${colors.brand}`, transition: ease }}>
              <span className="block h-[5px] w-[5px] rounded-full" style={{ background: now ? colors.white : colors.brand }} />
            </span>
            <span className="min-w-0 leading-snug" style={{ fontSize: size, color: colors.ink }}>
              {it.text}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ the stage */

/**
 * A fixed-size stage for a scene: one `Group` (generate-slides 2b item 1),
 * lit while it is the cluster the room works on. Everything inside is placed
 * with `At`, so nothing moves the stage's own size.
 */
export function Stage({ w, h, active, children, className = '', pad = 0, style }: { w: number | string; h: number; active?: boolean; children: ReactNode; className?: string; pad?: number; style?: CSSProperties }) {
  return (
    <Group pad={pad} active={active} className={`relative shrink-0 overflow-hidden ${className}`} style={{ width: w, height: h, ...style }}>
      {children}
    </Group>
  )
}

/** Absolute placement inside a stage. `cx` centres the child on x. */
export function At({ x, y, cx = false, cy = false, w, children, style, className = '' }: { x: number; y: number; cx?: boolean; cy?: boolean; w?: number; children: ReactNode; style?: CSSProperties; className?: string }) {
  const t = `${cx ? 'translateX(-50%)' : ''} ${cy ? 'translateY(-50%)' : ''}`.trim()
  return (
    <div className={`absolute ${className}`} style={{ left: x, top: y, width: w, transform: t || undefined, ...style }}>
      {children}
    </div>
  )
}

/** Shown or not, fading and rising, keeping its place. */
export function Fade({ on, children, lift = 10, delay = 0, style, className = '' }: { on: boolean; children: ReactNode; lift?: number; delay?: number; style?: CSSProperties; className?: string }) {
  const instant = useInstant()
  return (
    <div
      className={className}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? 'none' : `translateY(${lift}px)`,
        transition: instant ? 'none' : `opacity 520ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 520ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        pointerEvents: on ? undefined : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ labels */

export type LabelTone = 'plain' | 'brand' | 'good' | 'bad' | 'warn' | 'muted' | 'dark'

const LABEL: Record<LabelTone, { bg: string; ink: string; ring: string }> = {
  plain: { bg: colors.white, ink: colors.ink, ring: colors.line },
  brand: { bg: colors.surface2, ink: colors.brandDark, ring: colors.brand },
  good: { bg: '#E9F8EF', ink: '#137A3A', ring: colors.success },
  bad: { bg: '#FDECEC', ink: colors.danger, ring: colors.danger },
  warn: { bg: '#FFF4E0', ink: '#9A5B00', ring: colors.warning },
  muted: { bg: colors.surface, ink: colors.muted, ring: colors.line },
  dark: { bg: colors.brandDeep, ink: colors.white, ring: colors.brandDeep },
}

/** A label: a DOM chip beside the object it names (content rule 17), never text inside the svg. */
export function Label({ children, tone = 'plain', size = 14, strong = false, mono = false, className = '', style }: { children: ReactNode; tone?: LabelTone; size?: number; strong?: boolean; mono?: boolean; className?: string; style?: CSSProperties }) {
  const ease = useInstant() ? 'none' : 'all 420ms cubic-bezier(0.22,1,0.36,1)'
  const t = LABEL[tone]
  /* a label is read from the back of a room: never under 14px, whatever a scene asks for */
  const px = Math.max(14, size)
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-pill px-2.5 py-[3px] leading-tight ${strong ? 'font-heading font-semibold' : 'font-medium'} ${mono ? 'font-mono' : ''} ${className}`}
      style={{ fontSize: px, background: t.bg, color: t.ink, boxShadow: `inset 0 0 0 1.5px ${t.ring}`, transition: ease, ...style }}
    >
      {children}
    </span>
  )
}

/** A plain line of text in a scene, the quietest layer. */
export function Note({ children, size = 14, tone = colors.ink, className = '', style }: { children: ReactNode; size?: number; tone?: string; className?: string; style?: CSSProperties }) {
  return (
    <span className={`block leading-snug ${className}`} style={{ fontSize: Math.max(14, size), color: tone, ...style }}>
      {children}
    </span>
  )
}

/**
 * The scene's caption: centred, and a new caption eases in after the old one
 * eases out (generate-slides 2b item 5). Absolute, at the foot of a stage.
 */
export function Caption({ text, k, w, x = 0, y, size = 16 }: { text: ReactNode; k: string | number; w: number; x?: number; y: number; size?: number }) {
  const instant = useInstant()
  return (
    <div className="absolute" style={{ left: x, top: y, width: w }}>
      <motion.div
        key={k}
        initial={instant ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: instant ? 0 : 0.52, ease: easing.soft }}
        className="text-center font-semibold leading-snug"
        style={{ fontSize: size, color: colors.ink }}
      >
        {text}
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ arrows */

/**
 * An arrow from (x1, y1) to (x2, y2) on the stage, drawn along its path in
 * reading order when `on` turns true (generate-slides 2b item 10). The head is
 * 9px on a 2.5px line, sized in user space (content rule 45), and the last
 * stretch of the line runs straight into it (rule 46).
 */
export function Arrow({ x1, y1, x2, y2, on = true, tone = colors.brand, dashed = false, delay = 0, both = false, width = 2.5 }: { x1: number; y1: number; x2: number; y2: number; on?: boolean; tone?: string; dashed?: boolean; delay?: number; both?: boolean; width?: number }) {
  const instant = useInstant()
  const ang = Math.atan2(y2 - y1, x2 - x1)
  const H = 9
  const ex = x2 - Math.cos(ang) * H
  const ey = y2 - Math.sin(ang) * H
  const sx = both ? x1 + Math.cos(ang) * H : x1
  const sy = both ? y1 + Math.sin(ang) * H : y1
  const head = (tx: number, ty: number, a: number) => {
    const l = { x: tx - Math.cos(a) * H + Math.cos(a + Math.PI / 2) * 5, y: ty - Math.sin(a) * H + Math.sin(a + Math.PI / 2) * 5 }
    const r = { x: tx - Math.cos(a) * H - Math.cos(a + Math.PI / 2) * 5, y: ty - Math.sin(a) * H - Math.sin(a + Math.PI / 2) * 5 }
    return `M ${tx} ${ty} L ${l.x} ${l.y} L ${r.x} ${r.y} Z`
  }
  /* the box is the line and its heads, nothing more: overlap-check reads an arrow by its svg's own box */
  const px = Math.cos(ang + Math.PI / 2) * 5
  const py = Math.sin(ang + Math.PI / 2) * 5
  const xs = [x1, x2, ex + px, ex - px, ...(both ? [sx + px, sx - px] : [])]
  const ys = [y1, y2, ey + py, ey - py, ...(both ? [sy + py, sy - py] : [])]
  const minX = Math.floor(Math.min(...xs) - width / 2)
  const minY = Math.floor(Math.min(...ys) - width / 2)
  const maxX = Math.ceil(Math.max(...xs) + width / 2)
  const maxY = Math.ceil(Math.max(...ys) + width / 2)
  const t = instant ? 'none' : `stroke-dashoffset 860ms cubic-bezier(0.65,0,0.35,1) ${delay}ms, opacity 200ms ${delay}ms`
  return (
    <svg aria-hidden className="pointer-events-none absolute" style={{ left: minX, top: minY, overflow: 'visible' }} width={maxX - minX} height={maxY - minY}>
      <g transform={`translate(${-minX} ${-minY})`}>
        <path d={`M ${sx} ${sy} L ${ex} ${ey}`} stroke={tone} strokeWidth={width} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={dashed ? undefined : '1'} style={{ strokeDashoffset: dashed ? undefined : on ? 0 : 1, opacity: on ? 1 : 0, transition: t, ...(dashed ? { strokeDasharray: '6 6' } : {}) }} />
        <path d={head(x2, y2, ang)} fill={tone} style={{ opacity: on ? 1 : 0, transition: instant ? 'none' : `opacity 300ms ${delay + (dashed ? 200 : 700)}ms` }} />
        {both && <path d={head(x1, y1, ang + Math.PI)} fill={tone} style={{ opacity: on ? 1 : 0, transition: instant ? 'none' : `opacity 300ms ${delay + 700}ms` }} />}
      </g>
    </svg>
  )
}

/** A dot that travels a list of stage points while `run` is true, then rests on the last one. */
export function Traveller({ path, run, k, tone = colors.accent, size = 16, dur = 2.4 }: { path: [number, number][]; run: boolean; k: string | number; tone?: string; size?: number; dur?: number }) {
  const instant = useInstant()
  const end = path[path.length - 1]
  if (!run) return null
  return (
    <motion.span
      key={k}
      aria-hidden
      className="pointer-events-none absolute rounded-full"
      style={{ width: size, height: size, background: tone, boxShadow: `0 0 0 4px ${tone}40`, left: -size / 2, top: -size / 2 }}
      initial={instant ? { x: end[0], y: end[1] } : { x: path[0][0], y: path[0][1] }}
      animate={{ x: path.map((p) => p[0]), y: path.map((p) => p[1]) }}
      transition={{ duration: instant ? 0 : dur, ease: 'easeInOut' }}
    />
  )
}

/* ------------------------------------------------------------------ live controls */

/**
 * A control the room uses inside a scene (plan decision 5): a pill button.
 * It never changes slide (the kit's gesture hook skips a swipe that starts on
 * a button), and it gives the arrow keys back by blurring after a press.
 */
export function Control({ children, onClick, on, disabled = false, size = 14 }: { children: ReactNode; onClick: () => void; on?: boolean; disabled?: boolean; size?: number }) {
  const ease = useInstant() ? 'none' : 'all 300ms cubic-bezier(0.22,1,0.36,1)'
  const look = disabled
    ? { background: colors.surface, color: colors.muted, boxShadow: `inset 0 0 0 1px ${colors.line}` }
    : on
      ? { background: colors.brand, color: colors.white, boxShadow: `0 6px 16px -8px ${colors.brand}` }
      : { background: colors.white, color: colors.brandDark, boxShadow: `inset 0 0 0 1.5px ${colors.brand}` }
  return (
    <Press>
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          onClick()
          e.currentTarget.blur()
        }}
        onKeyDown={(e) => e.key !== 'Enter' && e.key !== ' ' && e.currentTarget.blur()}
        className="inline-flex h-[30px] items-center gap-1.5 whitespace-nowrap rounded-pill px-3.5 font-heading font-semibold leading-none"
        style={{ fontSize: Math.max(14, size), transition: ease, ...look }}
      >
        {children}
      </button>
    </Press>
  )
}

/** A slider the room drags (demand, load). Gives the arrow keys back to the deck when released. */
export function Slider({ value, onChange, label, width = 220 }: { value: number; onChange: (v: number) => void; label: ReactNode; width?: number }) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <label className="flex items-center gap-3" style={{ width }}>
      <span className="shrink-0 font-heading text-[14px] font-semibold" style={{ color: colors.ink }}>
        {label}
      </span>
      <input
        ref={ref}
        type="range"
        min={0}
        max={100}
        value={Math.round(value * 100)}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        onPointerUp={() => ref.current?.blur()}
        onKeyDown={(e) => e.stopPropagation()}
        className="cc-range min-w-0 flex-1"
        aria-label={typeof label === 'string' ? label : 'level'}
      />
    </label>
  )
}

/** A counter that grows by one every `ms` while `on`, held at `still` on harness URLs. */
export function useTicker(on: boolean, ms = 600, still = 0): number {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!on || STILL) return
    const t = window.setInterval(() => setN((v) => v + 1), ms)
    return () => window.clearInterval(t)
  }, [on, ms])
  return STILL ? still : n
}

/** Local state that resets to `init` whenever the beat changes (a press shows the beat's own picture). */
export function useBeatState<T>(beat: number, init: (b: number) => T): [T, (v: T) => void] {
  const [st, setSt] = useState<{ beat: number; v: T }>(() => ({ beat, v: init(beat) }))
  const v = st.beat === beat ? st.v : init(beat)
  return [v, (nv: T) => setSt({ beat, v: nv })]
}

/** A small round number badge, for a numbered step in a scene. */
export function Num({ n, on = true, size = 24 }: { n: number | string; on?: boolean; size?: number }) {
  const ease = useInstant() ? 'none' : 'all 420ms cubic-bezier(0.22,1,0.36,1)'
  return (
    <span className="grid shrink-0 place-items-center rounded-full font-heading font-semibold leading-none" style={{ width: size, height: size, fontSize: Math.max(14, size * 0.55), background: on ? colors.brand : colors.surface2, color: on ? colors.white : colors.brandDark, transition: ease }}>
      {n}
    </span>
  )
}

/** The CSS a live control needs (the range thumb), mounted once by the deck. */
export const SCENE_CSS = `
.cc-range { -webkit-appearance: none; appearance: none; height: 8px; border-radius: 999px; background: ${colors.surface2}; box-shadow: inset 0 0 0 1px ${colors.line}; cursor: pointer; }
.cc-range::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 999px; background: ${colors.brand}; box-shadow: 0 0 0 4px ${colors.white}, 0 4px 10px -2px ${colors.brand}; }
.cc-range::-moz-range-thumb { width: 22px; height: 22px; border: 0; border-radius: 999px; background: ${colors.brand}; box-shadow: 0 0 0 4px ${colors.white}, 0 4px 10px -2px ${colors.brand}; }
.cc-still svg *, .cc-still svg { animation: none !important; }
`
