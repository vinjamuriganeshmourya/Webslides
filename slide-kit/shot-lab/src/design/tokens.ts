/**
 * NxtWave Evolve — design tokens (TypeScript mirror).
 *
 * Tailwind owns the CSS side (see tailwind.config.ts). This file exposes
 * the same semantic values to TypeScript for places CSS can't reach:
 * inline SVG fills, Framer Motion configs, canvas math, etc.
 *
 * Keep this in sync with tailwind.config.ts.
 */

export const SLIDE_WIDTH = 1280
export const SLIDE_HEIGHT = 720
export const SLIDE_ASPECT = SLIDE_WIDTH / SLIDE_HEIGHT // 16:9

export const colors = {
  /* The style guide's blue. Mirrors `brand.500/600/900` in tailwind.config.ts,
     and is the same colour as nwBlue / nwDeep / nwNavy below: SVG paint and
     Tailwind classes have to land on one hue or figures drift off-palette. */
  brand: '#2D63FB',
  brandDark: '#0146C7',
  brandDeep: '#00254B',
  teal: '#12B5A8',
  tealDark: '#0E9285',
  accent: '#FF8A3D',
  accentDark: '#E5732A',
  success: '#16A34A',
  warning: '#F59E0B',
  /* Mirrors of `warning.100` and `warning.600` in tailwind.config.ts, for the
     capture-annotation layer in Shot, whose labels are inline-styled. */
  warningSoft: '#FEF3C7',
  warningDeep: '#B45309',
  danger: '#EF4444',
  info: '#0EA5E9',
  ink: '#0B1A2B',
  body: '#4A5B6B',
  muted: '#8A99A8',
  line: '#D8E3F5',
  surface: '#F5F8FF',
  surface2: '#E8F0FF',
  white: '#FFFFFF',
  night: '#081026',
  night2: '#0C1A3A',
  night3: '#122554',
  /* NxtWave PPT style guide, page 01. See tailwind.config.ts. */
  nwNavy: '#00254B',
  nwBlue: '#2D63FB',
  nwDeep: '#0146C7',
  nwBlack: '#1C1C1C',
} as const

export type ColorToken = keyof typeof colors

/**
 * A token colour at reduced opacity, as an rgba() string, so a glow or a dim
 * can be derived from a token instead of carrying a second hex literal.
 */
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

/**
 * Accent color used by the slide-type category system.
 *
 * `nw` and `nwDeep` are the style guide's blues, and they are what every DARK
 * chrome slide uses. The chrome frames used to reach for `accent` (orange) and
 * `teal`, which is the whole reason the welcome frame and the section dividers
 * looked like they came from two different decks: orange and teal are Evolve
 * hues and there is no orange or teal anywhere in the NxtWave style guide.
 *
 * The Evolve tones below are still live on the LIGHT content slides. Do not
 * reach for them on a navy ground.
 */
export const accentByTone = {
  brand: colors.brand,
  teal: colors.teal,
  accent: colors.accent,
  success: colors.success,
  info: colors.info,
  /* style guide, page 01 */
  nw: colors.nwBlue,
  nwDeep: colors.nwDeep,
} as const

export type Tone = keyof typeof accentByTone

export const fonts = {
  heading: "'Sora', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
} as const

/** Standard easing curves shared across all slide/element transitions. */
export const easing = {
  soft: [0.22, 1, 0.36, 1] as const, // easeOutExpo-ish, the house curve
  swift: [0.4, 0, 0.2, 1] as const,
  springy: [0.34, 1.56, 0.64, 1] as const, // slight overshoot
}
