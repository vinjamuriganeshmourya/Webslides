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
  brand: '#0B5FFF',
  brandDark: '#0A44C2',
  brandDeep: '#083296',
  teal: '#12B5A8',
  tealDark: '#0E9285',
  accent: '#FF8A3D',
  accentDark: '#E5732A',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#0EA5E9',
  ink: '#0B1A2B',
  body: '#4A5B6B',
  muted: '#8A99A8',
  line: '#D8E3F5',
  surface: '#F4F8FF',
  surface2: '#E8F0FF',
  white: '#FFFFFF',
  night: '#081026',
  night2: '#0C1A3A',
  night3: '#122554',
} as const

export type ColorToken = keyof typeof colors

/** Accent color used by the slide-type category system. */
export const accentByTone = {
  brand: colors.brand,
  teal: colors.teal,
  accent: colors.accent,
  success: colors.success,
  info: colors.info,
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
