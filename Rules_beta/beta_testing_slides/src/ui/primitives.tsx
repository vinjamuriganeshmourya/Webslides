import type { ReactNode } from 'react'
import { accentByTone, type Tone } from '@/design/tokens'

/**
 * Small uppercase eyebrow label.
 *
 * BETA DIVERGENCE, 2026-09-22: THE LEADING ACCENT TICK IS REMOVED IN THIS COPY
 * ONLY.
 *
 * Every other deck in this repo draws a 3px x 24px solid pill in the tone before
 * the label:
 *
 *     <span className="inline-block h-[3px] w-6 rounded-pill"
 *           style={{ background: color }} />
 *
 * It is gone here so the frame can be looked at without it. **This is an
 * experiment on one deck and it is not a rule.** Nothing in `RULES.md`, the
 * skills or `slide-kit/` has been changed, and the kit still draws the tick.
 *
 * `gap-2` went with it: there is nothing left to put a gap between.
 *
 * THIS FILE IS KIT-OWNED, SO THE CHANGE IS ONE COMMAND FROM BEING ERASED.
 * `node sync-kit.mjs --apply <this directory>` overwrites `src/ui/primitives.tsx`
 * from the template and puts the tick back without saying so. Do not sync this
 * deck while the experiment is running. `CLAUDE.md` in this folder repeats that.
 *
 * To put it back: restore the span above and the `gap-2`, or sync.
 */
export function Kicker({
  children,
  tone = 'brand',
  onDark = false,
  className = '',
}: {
  children: ReactNode
  tone?: Tone
  onDark?: boolean
  className?: string
}) {
  const color = accentByTone[tone]
  return (
    <span
      className={`inline-flex items-center text-kicker uppercase ${className}`}
      style={{ color: onDark ? '#FFFFFF' : color }}
    >
      {children}
    </span>
  )
}

/** Pill badge / chip. */
export function Chip({
  children,
  tone = 'brand',
  solid = false,
  className = '',
}: {
  children: ReactNode
  tone?: Tone
  solid?: boolean
  className?: string
}) {
  const color = accentByTone[tone]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-body-sm font-semibold ${className}`}
      style={
        solid
          ? { background: color, color: '#fff' }
          : { background: `${color}18`, color }
      }
    >
      {children}
    </span>
  )
}

/** Numbered index chip (used by agenda / steps). */
export function NumberBadge({
  n,
  tone = 'brand',
  className = '',
}: {
  n: number | string
  tone?: Tone
  className?: string
}) {
  const color = accentByTone[tone]
  return (
    <span
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl font-heading text-xl font-bold text-white shadow-card-soft ${className}`}
      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
    >
      {n}
    </span>
  )
}
