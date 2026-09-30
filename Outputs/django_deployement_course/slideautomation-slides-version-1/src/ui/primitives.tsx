import type { ReactNode } from 'react'
import { accentByTone, type Tone } from '@/design/tokens'

/**
 * Small uppercase eyebrow label.
 *
 * NO LEADING TICK. It used to render a 24x3px accent dash before the text, and
 * on a projector that dash reads as an em dash the author forgot to delete:
 * every kicker in the deck looked like "— WHERE YOUR APP LIVES". The accent is
 * not lost, because `SlideHeader` already draws a vertical accent rail in the
 * left margin of the same block, so the colour was being stated twice and only
 * one of the two could be mistaken for punctuation.
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
