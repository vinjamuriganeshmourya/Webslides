import { colors } from '@/design/tokens'

/**
 * COLOUR HELPERS THE ANNOTATED SHOT NEEDS, HELD IN THE SESSION.
 *
 * These are copies of `alpha`, `mix`, `onColor` and the two warning tints
 * that `slide-kit/shot-lab/src/design/tokens.ts` adds to the kit's tokens.
 * They live here, not in `src/design/tokens.ts`, because that file is
 * kit-owned and `sync-kit.mjs --apply` would overwrite the edit. When the
 * shot-lab work is promoted to the kit, delete this file and import from
 * `@/design/tokens` instead.
 */

/** Mirrors of `warning.100` and `warning.600` in tailwind.config.ts. */
export const warningSoft = '#FEF3C7'
export const warningDeep = '#B45309'

/** A token colour at reduced opacity, as an rgba() string. */
export function alpha(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** A token colour blended toward another, `t` of the way (0 keeps `hex`). */
export function mix(hex: string, toward: string, t: number): string {
  const a = rgb(hex)
  const b = rgb(toward)
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t))
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}

/** Ink or white, whichever reads on `hex`: WCAG relative luminance, threshold 0.35. */
export function onColor(hex: string): string {
  const lin = rgb(hex).map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  const L = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
  return L > 0.35 ? colors.ink : colors.white
}
