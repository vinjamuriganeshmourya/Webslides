import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useTween } from '@/ui'
import { Lines } from './common'

/**
 * The small parts PF 17 "Loop Control Statements" draws more than once.
 *
 *   StoryBeats  the hooks' numbered beat list (slides 4 and 14)
 *   PlanBox     the plan in indented plain English, with its one arrow
 *   ResultBox   a dashed "it prints" panel that fills on a press (3, 10, 12, 16)
 *   Brief       a worksheet brief: the task pill and its numbered lines (11, 12, 16)
 *   Slot        a dashed slot a card arrives into (7, 18), session 16's
 *   Pill        a small solid label (today, pass, continue, break)
 */

const HOUSE = 'cubic-bezier(0.22, 1, 0.36, 1)'

/* ------------------------------------------------------------- StoryBeats */

/**
 * The reference's numbered beats: the one on now in brand, bold, with every
 * line it has; the ones already spent in grey; the ones still to come as
 * dashed empty rows, because both hooks end on a question and the answer
 * must not be readable before the press. A spent beat keeps its FIRST line
 * only (the kit's `BeatStory` contract: the line before shrinks to its
 * headline), which is what lets five beats of two or three lines each share
 * a column with the tiles and the log under them.
 */
export function StoryBeats({ beats, at, size = 17 }: { beats: ReactNode[][]; at: number; size?: number }) {
  const tween = useTween(420)
  const widths = [64, 78, 72, 84, 68]
  return (
    <ol className="flex flex-col gap-[3px]">
      {beats.map((lines, i) => {
        const n = i + 1
        const state = n < at ? 'spent' : n === at ? 'now' : 'ahead'
        return (
          <li key={i} className="flex items-start gap-3" style={{ minHeight: 24 }}>
            <span
              className="mt-[2px] grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full font-mono text-[12px] font-bold"
              style={{
                background: state === 'now' ? colors.brand : colors.surface2,
                color: state === 'now' ? colors.white : state === 'spent' ? colors.body : colors.muted,
                transition: tween,
              }}
            >
              {n}
            </span>
            {state === 'ahead' ? (
              <span
                aria-hidden
                className="mt-[4px] block h-[18px] rounded-md"
                style={{ width: `${widths[i % widths.length]}%`, border: `1.5px dashed ${colors.line}`, background: 'rgba(255,255,255,0.5)' }}
              />
            ) : (
              <span
                className="min-w-0 leading-[1.3]"
                style={{ fontSize: size, color: state === 'now' ? colors.brandDark : colors.body, fontWeight: state === 'now' ? 700 : 500, transition: tween }}
              >
                {state === 'now' ? <Lines lines={lines} /> : lines[0]}
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}

/* ---------------------------------------------------------------- PlanBox */

export interface PlanLine {
  text: ReactNode
  indent: 0 | 1 | 2
  /** `head`: the loop line. `test`: the if line. `chip`: a job. `go`: the job the arrow leaves from. */
  kind: 'head' | 'test' | 'chip' | 'go'
}

const ROW = 30
const INDENT = 26

/**
 * The plan in indented plain English, the reference's closing beat on both
 * hooks: the loop line, its block, and ONE arrow drawn from the job that
 * changes the flow. `leave` runs from the `go` chip out of the block and
 * down into the first line after it (break). `back` runs from the `go` chip
 * up to the loop line (continue). The arrow's colours are slide 7's legend:
 * jump out is success, back to the top is accent.
 *
 * Positions are measured, not assumed: a chip's right edge depends on its
 * words, so the arrow is laid out after the rows have.
 */
export function PlanBox({ lines, arrow, width = 470 }: { lines: PlanLine[]; arrow: { kind: 'leave' | 'back'; label: string }; width?: number }) {
  const rows = useRef<(HTMLSpanElement | null)[]>([])
  const box = useRef<HTMLDivElement>(null)
  const [geo, setGeo] = useState<{ fromX: number; fromY: number; toX: number; toY: number } | null>(null)
  const from = lines.findIndex((l) => l.kind === 'go')
  const to = arrow.kind === 'back' ? lines.findIndex((l) => l.kind === 'head') : lines.findIndex((l, i) => i > from && l.indent === 0)

  useLayoutEffect(() => {
    const measure = () => {
      const b = box.current
      const f = rows.current[from]
      const t = rows.current[to]
      if (!b || !f || !t) return
      const br = b.getBoundingClientRect()
      const fr = f.getBoundingClientRect()
      const tr = t.getBoundingClientRect()
      /* the stage is zoomed, so rects are in screen pixels: divide by the zoom */
      const k = br.width / b.offsetWidth || 1
      setGeo({
        fromX: (fr.right - br.left) / k,
        fromY: (fr.top + fr.height / 2 - br.top) / k,
        toX: (tr.right - br.left) / k,
        toY: (tr.top + tr.height / 2 - br.top) / k,
      })
    }
    measure()
    const t = window.setTimeout(measure, 350)
    document.fonts?.ready.then(measure)
    return () => window.clearTimeout(t)
  }, [from, to, lines])

  const tone = arrow.kind === 'leave' ? colors.success : colors.accentDark
  const railX = Math.max(geo?.fromX ?? 0, geo?.toX ?? 0) + 34
  const bodyRows = lines.map((l, i) => (l.indent > 0 ? i : -1)).filter((i) => i >= 0)
  const bodyTop = bodyRows.length ? Math.min(...bodyRows) : 1
  const bodyBottom = bodyRows.length ? Math.max(...bodyRows) : 1

  return (
    <div ref={box} className="relative" style={{ width }}>
      {/* the block's rail: which lines belong to the loop */}
      <span
        aria-hidden
        className="absolute rounded-full"
        style={{ left: 12, top: bodyTop * ROW + 4, height: (bodyBottom - bodyTop + 1) * ROW - 8, width: 3, background: colors.line }}
      />
      {lines.map((l, i) => {
        const chip = l.kind === 'chip' || l.kind === 'go'
        const go = l.kind === 'go'
        return (
          <div key={i} className="flex items-center" style={{ height: ROW, paddingLeft: l.indent * INDENT }}>
            <span
              ref={(el) => {
                rows.current[i] = el
              }}
              className={`font-mono leading-none ${chip ? 'rounded-md px-2.5 py-1 text-[14px]' : 'text-[17px] font-semibold'}`}
              style={
                chip
                  ? { background: go ? `${tone}22` : colors.surface2, color: go ? tone : colors.brandDark, boxShadow: `inset 0 0 0 1px ${go ? `${tone}66` : 'transparent'}` }
                  : { color: colors.ink }
              }
            >
              {l.text}
            </span>
          </div>
        )
      })}
      {geo && (
        <svg aria-hidden className="pointer-events-none absolute inset-0 overflow-visible" width={width} height={lines.length * ROW}>
          <path
            d={`M ${geo.fromX + 4} ${geo.fromY} H ${railX} V ${geo.toY} H ${geo.toX + 14}`}
            fill="none"
            stroke={tone}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="sm-dash"
          />
          <path d={`M ${geo.toX + 22} ${geo.toY - 6} L ${geo.toX + 10} ${geo.toY} L ${geo.toX + 22} ${geo.toY + 6} Z`} fill={tone} />
          <text x={railX + 8} y={(geo.fromY + geo.toY) / 2 + 4} fontSize={13} fontWeight={700} fill={tone} fontFamily="Inter, system-ui, sans-serif">
            {arrow.label}
          </text>
        </svg>
      )}
    </div>
  )
}

/* -------------------------------------------------------------- ResultBox */

/**
 * "It prints": a dashed, empty panel until its press, then the result in
 * mono. `bad` is the danger tone (a wrong run, an error), `good` the success
 * tone (the run the room wanted), `plain` the brand tone.
 */
export function ResultBox({
  label,
  value,
  on,
  tone = 'plain',
  size = 22,
  height,
  className = '',
}: {
  label: ReactNode
  value: ReactNode
  on: boolean
  tone?: 'bad' | 'good' | 'plain'
  size?: number
  height?: number
  className?: string
}) {
  const tween = useTween(420)
  const paint = tone === 'bad' ? colors.danger : tone === 'good' ? colors.success : colors.brand
  return (
    <div
      className={`flex flex-col justify-center rounded-card px-4 py-2.5 ${className}`}
      style={{
        height,
        minHeight: height ? undefined : 58,
        border: `2px ${on ? 'solid' : 'dashed'} ${on ? `${paint}99` : colors.line}`,
        background: on ? `${paint}14` : 'rgba(255,255,255,0.55)',
        transition: tween,
      }}
    >
      <span className="text-[16px] font-semibold leading-none" style={{ color: colors.muted }}>{label}</span>
      <span
        className="mt-1.5 whitespace-pre-wrap font-mono font-bold leading-[1.3]"
        style={{ fontSize: size, color: tone === 'bad' ? colors.danger : tone === 'good' ? colors.success : colors.brandDark, opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(4px)', transition: tween, minHeight: on ? undefined : 0 }}
      >
        {on ? value : '​'}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ Brief */

/** The worksheet pill. The warm tone is the kit's warning token on a light tint. */
export function TaskPill({ children }: { children: ReactNode }) {
  return (
    <span className="self-start rounded-md px-2.5 py-1 text-[15px] font-bold uppercase tracking-wider" style={{ background: `${colors.warning}2E`, color: colors.accentDark }}>
      {children}
    </span>
  )
}

/** A worksheet brief: the pill, then its numbered lines. `[&_b]` and `[&_code]` are styled for the lines. */
export function Brief({ tag, lines, size = 17, aside, children }: { tag: string; lines: ReactNode[]; size?: number; aside?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2.5 [&_b]:font-bold [&_b]:text-ink [&_code]:rounded [&_code]:px-1 [&_code]:font-mono [&_code]:font-semibold [&_code]:text-brand-900">
      <div className="flex items-center justify-between gap-4">
        <TaskPill>{tag}</TaskPill>
        {aside}
      </div>
      <ol className="flex flex-col gap-1">
        {lines.map((l, i) => (
          <li key={i} className="flex gap-2.5 leading-snug" style={{ fontSize: size, color: colors.body }}>
            <b className="w-5 shrink-0">{i + 1}.</b>
            <span className="min-w-0">{l}</span>
          </li>
        ))}
      </ol>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------- Slot */

/** A dashed slot that becomes a white card when its beat lands. Session 16's. */
export function Slot({ on, className = '', style, children }: { on: boolean; className?: string; style?: React.CSSProperties; children: ReactNode }) {
  const tween = useTween(480)
  return (
    <div
      className={`relative overflow-hidden rounded-card ${className}`}
      style={{
        ...style,
        transition: tween,
        background: on ? colors.white : 'rgba(255,255,255,0.45)',
        boxShadow: on ? `0 6px 24px -10px rgba(0,37,75,0.16), inset 0 0 0 1px ${colors.line}` : 'none',
        border: on ? '2px solid transparent' : `2px dashed ${colors.line}`,
      }}
    >
      <div className="h-full" style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(8px)', transition: tween }}>{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------- Pill */

export function Pill({ children, bg, color = colors.white, className = '' }: { children: ReactNode; bg: string; color?: string; className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-lg px-3 py-1 font-heading text-[15px] font-bold leading-none ${className}`} style={{ background: bg, color }}>
      {children}
    </span>
  )
}

/** A control word inside a plan line: `every try`, `if`. */
export function Kw({ children }: { children: ReactNode }) {
  return (
    <b className="font-bold" style={{ color: colors.brandDark }}>
      {children}
    </b>
  )
}

export { HOUSE }
