import type { ReactNode } from 'react'
import { accentByTone, type Tone } from '@/design/tokens'

/** Small uppercase eyebrow label with a leading accent tick. */
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
      className={`inline-flex items-center gap-2 text-kicker uppercase ${className}`}
      style={{ color: onDark ? '#FFFFFF' : color }}
    >
      <span className="inline-block h-[3px] w-6 rounded-pill" style={{ background: color }} />
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
