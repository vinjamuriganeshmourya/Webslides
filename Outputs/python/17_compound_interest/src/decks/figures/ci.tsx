import type { CSSProperties, ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useTween } from '@/ui'
import { Lines } from './common'

/**
 * THE PIECES OF PF 17 "COMPOUND INTEREST".
 *
 * The reference draws money the same way on every card: the principal in a
 * green chip, the interest in an amber chip, the amount in a blue chip, an
 * empty dashed slot where a value is still to come, a dark band for the line
 * that answers the question, and an amber note for the rule said once. These
 * are those pieces, in the template's tokens (content rule 37): `success`,
 * `warning` and `brandDark` stand in for the reference's own green, amber and
 * blue.
 *
 * Every block here is LEFT-aligned (content rule 38): the kit's lead sits on
 * the left edge, so a centred band or note under it would be the defect
 * `mixed-align-check.mjs` reports.
 */

/** Principal, interest, amount: the three things every card colours. */
export type Money = 'p' | 'i' | 'a' | 'soft'

const FILL: Record<Money, { bg: string; ink: string; ring: string }> = {
  p: { bg: colors.success, ink: colors.white, ring: colors.success },
  i: { bg: colors.warning, ink: colors.ink, ring: colors.warning },
  a: { bg: colors.brandDark, ink: colors.white, ring: colors.brandDark },
  soft: { bg: colors.surface2, ink: colors.brandDark, ring: colors.line },
}

/** A value the reference prints in bold blue inside a sentence: ₹5,000, 8% per annum. */
export function B({ children }: { children: ReactNode }) {
  return <b className="font-bold" style={{ color: colors.brandDark }}>{children}</b>
}

/**
 * One value chip. `on={false}` is the reference's empty dashed slot: it keeps
 * its size, so nothing moves when the value lands.
 */
export function Val({
  on = true,
  tone = 'soft',
  width,
  height = 42,
  size = 20,
  mono = false,
  className = '',
  style,
  children,
}: {
  on?: boolean
  tone?: Money
  width?: number | string
  height?: number
  size?: number
  mono?: boolean
  className?: string
  style?: CSSProperties
  children?: ReactNode
}) {
  const tween = useTween(480)
  const f = FILL[tone]
  return (
    <span
      className={`relative grid shrink-0 place-items-center rounded-xl px-3 font-bold leading-none ${mono ? 'font-mono' : ''} ${className}`}
      style={{
        width,
        height,
        fontSize: size,
        background: on ? f.bg : 'transparent',
        color: f.ink,
        boxShadow: on ? `inset 0 0 0 2px ${f.ring}` : `inset 0 0 0 2px ${colors.line}`,
        outline: on ? 'none' : `2px dashed ${colors.line}`,
        outlineOffset: -2,
        transition: tween,
        ...style,
      }}
    >
      <span style={{ opacity: on ? 1 : 0, transition: tween, whiteSpace: 'nowrap' }}>{children}</span>
    </span>
  )
}

/** Fades in and lifts, and holds its space while hidden so nothing below it moves. */
export function Fade({ on, children, className = '', style }: { on: boolean; children: ReactNode; className?: string; style?: CSSProperties }) {
  const tween = useTween(520)
  return (
    <div className={className} style={{ ...style, opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(8px)', transition: tween, pointerEvents: on ? undefined : 'none' }}>
      {children}
    </div>
  )
}

/** The amber note: the rule, said once, under the figure. One sentence per line (content rule 36). */
export function Insight({ lines, on = true, size = 18, className = '' }: { lines: ReactNode[]; on?: boolean; size?: number; className?: string }) {
  return (
    <Fade on={on} className={className}>
      <div
        className="rounded-xl px-5 py-2.5 font-semibold leading-snug"
        style={{ fontSize: size, color: colors.ink, background: `${colors.warning}1F`, boxShadow: `inset 0 0 0 2px ${colors.warning}` }}
      >
        <Lines lines={lines} />
      </div>
    </Fade>
  )
}

/** The dark band: the line that answers the question. */
export function Band({ children, on = true, size = 19, className = '' }: { children: ReactNode; on?: boolean; size?: number; className?: string }) {
  return (
    <Fade on={on} className={className}>
      <div className="rounded-xl px-5 py-2 font-bold leading-snug" style={{ fontSize: size, background: colors.brandDark, color: colors.white }}>
        {children}
      </div>
    </Fade>
  )
}

/** A small column heading over a table or a row of cards. */
export function Head({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span className={`text-[16px] font-bold leading-tight ${className}`} style={{ color: colors.body, ...style }}>
      {children}
    </span>
  )
}

/**
 * A card with a coloured header strip: the four solution cards, the two
 * methods, the two steps. The header is `font-heading`, so it stays on one
 * line (content rule 35).
 */
export function StepCard({
  title,
  tone = 'a',
  width,
  minHeight = 128,
  className = '',
  children,
}: {
  title: ReactNode
  tone?: 'a' | 'p'
  width?: number | string
  minHeight?: number
  className?: string
  children?: ReactNode
}) {
  const c = tone === 'p' ? colors.success : colors.brandDark
  return (
    <div className={`flex shrink-0 flex-col overflow-hidden rounded-xl bg-white ${className}`} style={{ width, boxShadow: `inset 0 0 0 2px ${c}` }}>
      <div className="whitespace-nowrap px-4 py-1.5 font-heading text-[16px] font-semibold leading-tight text-white" style={{ background: c }}>
        {title}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1.5 px-4 py-3" style={{ minHeight }}>
        {children}
      </div>
    </div>
  )
}

/** One line inside a step card: a calculation, bold, in ink or a tone. */
export function Calc({ on = true, tone, size = 18, children }: { on?: boolean; tone?: 'a' | 'p'; size?: number; children: ReactNode }) {
  const tween = useTween(480)
  const ink = tone === 'p' ? colors.success : tone === 'a' ? colors.brandDark : colors.ink
  return (
    <p className="font-bold leading-snug" style={{ fontSize: size, color: ink, opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)', transition: tween }}>
      {children}
    </p>
  )
}

/** A short horizontal arrow between two cards, drawn in its own gap (content rules 42, 45, 46). */
export function GapArrow({ width = 28, label, color = colors.brand }: { width?: number; label?: ReactNode; color?: string }) {
  return (
    <span className="flex shrink-0 flex-col items-center justify-center gap-0.5" style={{ width }}>
      {label && <span className="text-[16px] font-bold leading-none" style={{ color }}>{label}</span>}
      <svg width={width} height="14" viewBox={`0 0 ${width} 14`} aria-hidden>
        <path d={`M2 7 L${width - 10} 7`} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <path d={`M${width - 11} 2.5 L${width - 2} 7 L${width - 11} 11.5 Z`} fill={color} />
      </svg>
    </span>
  )
}

/** The worksheet pill, first block of the body (content rule 32: the header holds kicker and title only). */
export function Worksheet({ task }: { task: number }) {
  return (
    <span className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-md px-3 py-1 text-[16px] font-bold uppercase tracking-wider" style={{ background: `${colors.accent}1A`, color: colors.accentDark }}>
      <svg width="14" height="16" viewBox="0 0 14 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M2 1.5h7l3 3v10H2z" />
        <path d="M4.5 7.5h5M4.5 10.5h5" strokeLinecap="round" />
      </svg>
      Worksheet · Task {task}
    </span>
  )
}

/** A small uppercase label over a block: `HOW TO USE PASCAL'S TRIANGLE`, `VOTE`. */
export function Eyebrow({ children, tone = colors.brandDark }: { children: ReactNode; tone?: string }) {
  return (
    <p className="text-[16px] font-bold uppercase leading-none tracking-wider" style={{ color: tone }}>
      {children}
    </p>
  )
}
