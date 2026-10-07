import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useTween } from '@/ui'

/**
 * THE TILES OF PF 18: a character on top, its number underneath.
 *
 * The reference draws every string the same way on every frame that compares
 * one: a row of tiles, one character per tile, the Unicode value under the
 * character once the Computer has "looked" at it. These are that tile, the
 * dashed slot a value lands in, the `ord( )` / `chr( )` box, and the blue
 * banner that closes a frame with its rule.
 *
 * States:
 *   plain    the letter alone, no number yet
 *   num      a number the computer stores (brand tint), or a looked-at pair
 *   same     this pair matched, move on (success tint)
 *   decides  the first pair that differs (accent ring)
 *   never    Python never looked here (grey, faded)
 *   nothing  the word ran out: a dashed tile reading "nothing"
 *   bad      a letter that differs (danger tint, the password hook)
 *   good     a letter that matches (success tint, the password hook)
 *   empty    a dashed placeholder waiting for a value
 */
export type TileState = 'plain' | 'num' | 'same' | 'decides' | 'never' | 'nothing' | 'nothing-grey' | 'bad' | 'good' | 'empty'

const SIZE = {
  lg: { w: 88, h: 104, font: 44, code: 20, gap: 12 },
  md: { w: 72, h: 86, font: 36, code: 17, gap: 10 },
  sm: { w: 56, h: 70, font: 28, code: 15, gap: 8 },
  xs: { w: 46, h: 48, font: 21, code: 14, gap: 6 },
} as const
export type TileSize = keyof typeof SIZE
export const TILE = SIZE

export function Tile({
  ch,
  code,
  state = 'plain',
  size = 'md',
  showCode = true,
}: {
  ch?: ReactNode
  code?: ReactNode
  state?: TileState
  size?: TileSize
  /** Draw the code slot even when `code` is empty, so the tile keeps one height all frame. */
  showCode?: boolean
}) {
  const s = SIZE[size]
  const tween = useTween(420)
  const look: { bg: string; ring: string; ink: string; codeInk: string; dash?: boolean; fade?: number; thick?: boolean } =
    state === 'num'
      ? { bg: colors.surface2, ring: colors.brand, ink: colors.brandDark, codeInk: colors.brandDark }
      : state === 'same' || state === 'good'
        ? { bg: '#E9F8EF', ring: colors.success, ink: colors.ink, codeInk: '#137A3A' }
        : state === 'decides'
          ? { bg: '#FFF4EC', ring: colors.accent, ink: colors.ink, codeInk: colors.accentDark, thick: true }
          : state === 'bad'
            ? { bg: '#FDECEC', ring: colors.danger, ink: colors.danger, codeInk: colors.danger }
            : state === 'never'
              ? { bg: colors.surface, ring: colors.line, ink: colors.muted, codeInk: colors.muted, fade: 0.6 }
              : state === 'nothing'
                ? { bg: '#FFF4EC', ring: colors.accent, ink: colors.accentDark, codeInk: colors.accentDark, dash: true }
                : state === 'nothing-grey'
                  ? { bg: colors.surface, ring: colors.line, ink: colors.muted, codeInk: colors.muted, dash: true, fade: 0.6 }
                : state === 'empty'
                  ? { bg: 'transparent', ring: colors.line, ink: 'transparent', codeInk: 'transparent', dash: true }
                  : { bg: colors.white, ring: colors.line, ink: colors.ink, codeInk: colors.brandDark }
  const hasCode = code !== undefined && code !== null && code !== ''
  return (
    <span
      className="flex shrink-0 flex-col items-center justify-center rounded-xl font-mono font-bold"
      style={{
        width: s.w,
        height: s.h,
        background: look.bg,
        color: look.ink,
        border: `${look.thick ? 3 : 2}px ${look.dash ? 'dashed' : 'solid'} ${look.ring}`,
        opacity: look.fade ?? 1,
        transition: tween,
      }}
    >
      {state === 'nothing' || state === 'nothing-grey' ? (
        <span className="font-body text-[16px] font-bold">nothing</span>
      ) : (
        <>
          <span style={{ fontSize: s.font, lineHeight: 1 }}>{ch}</span>
          {(showCode || hasCode) && (
            <span className="mt-1.5 leading-none" style={{ fontSize: s.code, color: look.codeInk, minHeight: s.code, opacity: hasCode ? 1 : 0, transition: tween }}>
              {hasCode ? code : '0'}
            </span>
          )}
        </>
      )}
    </span>
  )
}

/** A row of tiles, with the gap the size asks for. */
export function TileRow({ size = 'md', className = '', children }: { size?: TileSize; className?: string; children: ReactNode }) {
  return (
    <div className={`flex items-start ${className}`} style={{ gap: SIZE[size].gap }}>
      {children}
    </div>
  )
}

/* ----------------------------------------------------------------- pieces */

/** A dashed slot where a value will land. */
export function Slot({ width, height, className = '', children }: { width?: number | string; height?: number; className?: string; children?: ReactNode }) {
  return (
    <div className={`grid place-items-center rounded-2xl ${className}`} style={{ width, height, border: `2px dashed ${colors.line}`, background: 'rgba(255,255,255,0.5)' }}>
      {children}
    </div>
  )
}

/** The function box: `ord( )`, `chr( )`. Filled in the brand's dark blue with a dashed inner rim, the reference's own shape. */
export function FnBox({ name, size = 30 }: { name: string; size?: number }) {
  return (
    <span className="grid place-items-center whitespace-nowrap rounded-xl px-5 font-mono font-bold text-white" style={{ background: colors.brandDark, height: size * 2.6, fontSize: size, boxShadow: `inset 0 0 0 2px ${colors.brandDark}, inset 0 0 0 4px rgba(255,255,255,0.55)` }}>
      {name}( )
    </span>
  )
}

/** A short arrow pointing right, drawn as a plain triangle on a shaft. */
export function ArrowRight({ width = 44, color = colors.brand }: { width?: number; color?: string }) {
  return (
    <svg width={width} height="18" viewBox={`0 0 ${width} 18`} aria-hidden className="shrink-0">
      <path d={`M2 9H${width - 12}`} stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <path d={`M${width - 13} 2 L${width - 1} 9 L${width - 13} 16 Z`} fill={color} />
    </svg>
  )
}

/** The blue banner that closes a frame with its rule: a bold line, and an optional quieter line under it. */
export function Banner({ children, sub, width, size = 22, className = '' }: { children: ReactNode; sub?: ReactNode; width?: number | string; size?: number; className?: string }) {
  return (
    <div className={`rounded-2xl px-6 py-3 text-center text-white ${className}`} style={{ background: colors.brandDark, width }}>
      <p className="font-heading font-bold leading-snug" style={{ fontSize: size }}>{children}</p>
      {sub && <p className="mt-1 text-[17px] leading-snug opacity-90">{sub}</p>}
    </div>
  )
}

/** The banner's slot before it lands, the same size, dashed. */
export function BannerSlot({ on, children, sub, width, size, className = '' }: { on: boolean; children: ReactNode; sub?: ReactNode; width?: number | string; size?: number; className?: string }) {
  const tween = useTween(480)
  return (
    <div className={`relative ${className}`} style={{ width }}>
      <div style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(8px)', transition: tween }}>
        <Banner sub={sub} size={size}>{children}</Banner>
      </div>
      <div className="absolute inset-0 rounded-2xl" style={{ border: `2px dashed ${colors.line}`, background: 'rgba(255,255,255,0.5)', opacity: on ? 0 : 1, transition: tween, pointerEvents: 'none' }} />
    </div>
  )
}

/** The grey-tile legend the reference prints under a comparison with unread letters. */
export function GreyLegend({ on }: { on: boolean }) {
  const tween = useTween(360)
  return (
    <p className="flex items-center gap-2 text-[16px] font-semibold" style={{ color: colors.muted, opacity: on ? 1 : 0, transition: tween }}>
      <span className="inline-block h-3.5 w-3.5 rounded-sm" style={{ background: colors.surface, border: `1.5px solid ${colors.line}` }} />
      grey: Python never looked at these letters
    </p>
  )
}

/** The verdict pill: True in green, False in red. */
export function Verdict({ value, on }: { value: boolean; on: boolean }) {
  const tween = useTween(420)
  return (
    <span
      className="inline-grid h-[48px] min-w-[112px] place-items-center self-start rounded-pill px-5 font-mono text-[24px] font-bold"
      style={{
        background: value ? '#E9F8EF' : '#FDECEC',
        color: value ? '#137A3A' : colors.danger,
        border: `2px solid ${value ? colors.success : colors.danger}`,
        opacity: on ? 1 : 0,
        transform: on ? 'none' : 'translateY(6px)',
        transition: tween,
      }}
    >
      {value ? 'True' : 'False'}
    </span>
  )
}

/** The Unicode value of a character, for the tiles that print it. */
export const code = (c: string) => c.charCodeAt(0)
