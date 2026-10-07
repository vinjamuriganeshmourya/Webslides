import type { CSSProperties, ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useTween } from '@/ui'
import { Lines } from './common'
import { Show } from './pieces'

/**
 * The pieces every Simple Interest frame is drawn with.
 *
 * The reference (`16_simple_interest_student_view_new_design 7.html`) draws
 * the same five things on almost every panel: the question in a box with a
 * `?` badge, the four worked-step boxes (given data, formula, substitution,
 * final answer) joined by arrows, a tinted note under the working, a solid
 * value chip, and a dashed slot a value lands in. These are those five, in
 * template colours only (content rule 37):
 *
 *   principal  success   the money put in
 *   interest   accent    the extra money
 *   amount     brand     the total
 *
 * Every text block takes its lines as an array, one sentence per line with
 * no trailing full stop (content rule 36). Not a word of the reference is
 * changed.
 */

export type SiTone = 'brand' | 'success' | 'accent' | 'muted'

export const TONE: Record<SiTone, { solid: string; ink: string; tint: string; ring: string }> = {
  brand: { solid: colors.brandDark, ink: colors.brandDark, tint: `${colors.brand}12`, ring: `${colors.brand}66` },
  success: { solid: colors.success, ink: colors.success, tint: `${colors.success}12`, ring: `${colors.success}66` },
  accent: { solid: colors.accent, ink: colors.accentDark, tint: `${colors.accent}14`, ring: `${colors.accent}80` },
  muted: { solid: colors.muted, ink: colors.body, tint: colors.surface, ring: colors.line },
}

/** A number or a term the question hangs on, in the brand's dark blue. */
export function B({ children }: { children: ReactNode }) {
  return <b className="font-bold" style={{ color: colors.brandDark }}>{children}</b>
}

/**
 * THE QUESTION, as the slide's lead (the first block in Space-1, which may
 * rise into Space-3; capped at x 880 by `ZonedFrame`). The reference's `?`
 * badge and box. Phrasing content only, because the kit renders a lead
 * inside a `<p>`.
 */
export function QLead({ children, size = 21 }: { children: ReactNode; size?: number }) {
  return (
    <span className="flex items-start gap-4 rounded-2xl bg-white px-5 py-3 ring-1 ring-line" style={{ boxShadow: '0 6px 20px -12px rgba(0,37,75,0.18)' }}>
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg font-heading text-[22px] font-bold text-white" style={{ background: colors.brandDark }}>
        ?
      </span>
      <span className="block leading-snug" style={{ fontSize: size, color: colors.ink }}>
        {children}
      </span>
    </span>
  )
}

/** A tinted note under the working: the rule, the shortcut, the warning. */
export function Tip({
  lines,
  tone = 'accent',
  on = true,
  size = 18,
  bold = true,
  className = '',
  style,
}: {
  lines: ReactNode[]
  tone?: SiTone
  on?: boolean
  size?: number
  bold?: boolean
  className?: string
  style?: CSSProperties
}) {
  const t = TONE[tone]
  return (
    <Show on={on} className={className} style={style}>
      <div
        className={`rounded-xl px-5 py-2.5 leading-snug ${bold ? 'font-semibold' : ''}`}
        style={{ fontSize: size, background: t.tint, color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${t.ring}, inset 5px 0 0 ${t.solid}` }}
      >
        <Lines lines={lines} />
      </div>
    </Show>
  )
}

/** A solid band: the result line the working arrives at. */
export function Band({ children, tone = 'brand', on = true, size = 20, className = '' }: { children: ReactNode; tone?: SiTone; on?: boolean; size?: number; className?: string }) {
  return (
    <Show on={on} className={className}>
      <div className="rounded-xl px-5 py-2.5 font-heading font-bold leading-snug text-white" style={{ fontSize: size, background: TONE[tone].solid }}>
        {children}
      </div>
    </Show>
  )
}

/** A solid value chip: ₹5,000 in green, + ₹500 in orange, ₹5,500 in blue. */
export function Chip({ children, tone, w, h = 40, size = 19, className = '' }: { children: ReactNode; tone: SiTone; w?: number; h?: number; size?: number; className?: string }) {
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-lg px-3 font-heading font-bold text-white ${className}`}
      style={{ background: TONE[tone].solid, width: w, height: h, fontSize: size }}
    >
      {children}
    </span>
  )
}

/**
 * A slot a value lands in. Dashed and empty before its press, so the frame
 * keeps its shape and nothing moves when the value arrives.
 */
export function Slot({ on, children, w, h, className = '', style }: { on: boolean; children: ReactNode; w?: number | string; h?: number; className?: string; style?: CSSProperties }) {
  const tween = useTween(480)
  return (
    <div
      className={`relative grid place-items-center rounded-lg ${className}`}
      style={{ width: w, height: h, border: `2px dashed ${on ? 'transparent' : colors.line}`, transition: tween, ...style }}
    >
      <div style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)', transition: tween }}>{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------ worked steps */

export interface WorkStep {
  lines: ReactNode[]
}

const STEP_TITLES = ['1 · Given data', '2 · Formula', '3 · Substitution', '4 · Final answer']

/**
 * The four worked-step boxes, joined by arrows. The headers are there from
 * the first state; box k fills on press k (the reference's `data-s` 2 to 5).
 * The last box is the answer, headed in the success tone.
 */
export function WorkedSteps({ beat, steps, height = 168, size = 18 }: { beat: number; steps: WorkStep[]; height?: number; size?: number }) {
  return (
    <div className="flex w-[1100px] items-stretch">
      {steps.map((s, i) => {
        const last = i === steps.length - 1
        const head = last ? colors.success : colors.brandDark
        return (
          <div key={i} className="flex items-center">
            <div className="flex w-[254px] flex-col overflow-hidden rounded-xl bg-white" style={{ height, boxShadow: `inset 0 0 0 2px ${colors.line}` }}>
              <p className="py-1.5 text-center font-heading text-[17px] font-bold text-white" style={{ background: head }}>
                {STEP_TITLES[i]}
              </p>
              <Show on={beat >= i + 2} className="grid flex-1 place-items-center px-3 text-center">
                <div className="font-semibold leading-[1.45]" style={{ fontSize: size, color: last ? colors.success : colors.ink }}>
                  <Lines lines={s.lines} />
                </div>
              </Show>
            </div>
            {!last && (
              <svg width="28" height="20" viewBox="0 0 28 20" aria-hidden className="shrink-0">
                <path d="M4 10 H18" stroke={colors.muted} strokeWidth="2.5" strokeLinecap="round" />
                <path d="M16 5 L23 10 L16 15 Z" fill={colors.muted} />
              </svg>
            )}
          </div>
        )
      })}
    </div>
  )
}
