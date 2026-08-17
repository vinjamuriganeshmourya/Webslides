/**
 * NxtWave PPT Template — "New Theme 2027" (V2) design tokens.
 *
 * Transcribed from the Figma source of truth:
 *   NxtWave-PPT-Template › page "Final" (256:760)
 *   › section "V2_Content PPT - New Theme 2027"
 *   › section "Style Guide" (01 - Color, 02 - Typography - Light)
 *
 * This is a SEPARATE theme from "NxtWave Evolve" (see ./tokens.ts). Nothing
 * here overrides Evolve — existing decks keep their current look. New decks
 * opt in by using the `@/slides/nw2027` layouts.
 *
 * CANVAS NOTE
 * The Figma deck is authored at 1920×1080. The deck engine's stage is
 * 1280×720 (see ./tokens.ts). Rather than pre-multiplying every value by
 * 0.667, slides in this theme are authored at native 1920×1080 and the
 * `Slide2027` frame scales the whole canvas down into the stage. That keeps
 * every number in this file identical to the number shown in Figma.
 */

import type { CSSProperties } from 'react'

/** Native authoring canvas — matches the Figma "Slide 16:9" frames. */
export const NW_SLIDE_WIDTH = 1920
export const NW_SLIDE_HEIGHT = 1080

/** Scale factor from the 1920×1080 authoring canvas into the 1280×720 stage. */
export const NW_STAGE_SCALE = 1280 / NW_SLIDE_WIDTH // 0.6667

/**
 * Colours — Style Guide › "01 - Color".
 * `primaryDarkBlue` is the Figma variable `Style Guide/Primary-dark-blue`.
 */
export const nwColors = {
  /** PRIMARY — main brand colours for key elements and highlights. */
  primaryDarkBlue: '#002A4B',
  primaryBlue: '#2D63FB',
  /** SECONDARY — supporting colours for accents and complementary visuals. */
  secondaryBlue: '#0146C7',
  ink: '#1C1C1C',
  /** BACKGROUND */
  white: '#FFFFFF',
  /** Style-guide page surface; also the base tint behind light content slides. */
  surface: '#F7F7FA',
} as const

export type NwColorToken = keyof typeof nwColors

/**
 * Gradients — Style Guide › "01 - Color" (GRADIENT) plus the three published
 * Figma colour styles (Primary Gradient: Tags / Flare-Vertical / Flare-Horizontal).
 */
export const nwGradients = {
  /** The brand gradient: #2D63FB → #0146C7. Used on tags, bars and fills. */
  brand: `linear-gradient(90deg, ${nwColors.primaryBlue} 0%, ${nwColors.secondaryBlue} 100%)`,
  brandDiagonal: `linear-gradient(135deg, ${nwColors.primaryBlue} 0%, ${nwColors.secondaryBlue} 100%)`,
  /**
   * Full-bleed hero/closing backdrop — the mesh-blue field behind "Welcome"
   * and "All The Best". Layered radial flares over a deep blue base.
   */
  heroField: [
    'radial-gradient(120% 90% at 22% 8%, rgba(120,178,255,0.95) 0%, rgba(70,130,246,0.35) 42%, rgba(0,0,0,0) 72%)',
    'radial-gradient(90% 80% at 88% 30%, rgba(45,99,251,0.85) 0%, rgba(1,70,199,0.20) 55%, rgba(0,0,0,0) 80%)',
    'radial-gradient(140% 120% at 50% 120%, rgba(0,26,80,0.95) 0%, rgba(1,45,140,0.55) 45%, rgba(0,0,0,0) 78%)',
    `linear-gradient(150deg, ${nwColors.primaryBlue} 0%, ${nwColors.secondaryBlue} 55%, #012B7A 100%)`,
  ].join(', '),
  /** The soft lavender-white field behind light content slides. */
  lightField: [
    'radial-gradient(75% 60% at 92% 4%, rgba(146,183,255,0.55) 0%, rgba(146,183,255,0) 62%)',
    'radial-gradient(60% 55% at 4% 96%, rgba(180,203,255,0.34) 0%, rgba(180,203,255,0) 60%)',
    'linear-gradient(180deg, #FFFFFF 0%, #EEF2FF 100%)',
  ].join(', '),
  /** The thin rule under a slide kicker: brand blue fading out to the right. */
  kickerRule: `linear-gradient(90deg, ${nwColors.primaryBlue} 0%, rgba(45,99,251,0) 100%)`,
} as const

/**
 * Typography — Style Guide › "02 - Typography - Light".
 *
 *   Primary typeface   Sora     — used for Section Titles
 *   Secondary typeface DM Sans  — used for body text
 *
 * Sizes are the exact px values of the 15 published Figma text styles, on the
 * 1920×1080 canvas. Figma reports line height as either px or %, so `lh` here
 * is normalised to a unitless ratio; `Auto` becomes the font's natural metric,
 * expressed as 1.0 for display sizes and 1.3 for text sizes.
 */
export const nwFonts = {
  heading: "'Sora', system-ui, sans-serif",
  body: "'DM Sans', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
} as const

export interface NwTextStyle {
  /** Figma style name. */
  name: string
  family: 'heading' | 'body'
  size: number
  /** Unitless line-height ratio. */
  lh: number
  weight: 400 | 500 | 600 | 700
  /** Letter spacing as a ratio of font size (Figma reports %). */
  tracking?: number
}

export const nwText = {
  /** Sora 600 · 210px · 100% · -7% — the "Welcome" / closing wordmark size. */
  heading2xl: { name: 'Heading-2XL', family: 'heading', size: 210, lh: 1.0, weight: 600, tracking: -0.07 },
  /** Sora 600 · 168/180px — hero section titles. */
  headingXl: { name: 'Heading-XL', family: 'heading', size: 168, lh: 180 / 168, weight: 600, tracking: -0.04 },
  headingL: { name: 'Heading-L', family: 'heading', size: 138, lh: 1.0, weight: 600, tracking: -0.03 },
  /** Topic-title slides ("Battery Technology"). */
  headingM: { name: 'Heading-M', family: 'heading', size: 96, lh: 1.05, weight: 600, tracking: -0.03 },
  /** Standard content-slide title ("2. Challenges & Applications"). */
  headingS: { name: 'Heading-S', family: 'heading', size: 72, lh: 62 / 72, weight: 600, tracking: -0.02 },
  subHeadXl: { name: 'Sub-head-XL', family: 'body', size: 64, lh: 1.2, weight: 600 },
  subHeadL: { name: 'Sub-Head-L', family: 'body', size: 48, lh: 1.2, weight: 600 },
  subHeadM: { name: 'Sub-Head-M', family: 'body', size: 36, lh: 1.25, weight: 600 },
  subHeadMBold: { name: 'Sub-Head-M-Bold', family: 'body', size: 36, lh: 1.2, weight: 700 },
  subHeadS: { name: 'Sub-Head-S', family: 'body', size: 32, lh: 46 / 32, weight: 600 },
  subHeadXs: { name: 'Sub-Head-XS', family: 'body', size: 24, lh: 1.3, weight: 600 },
  bodyM: { name: 'Body-M', family: 'body', size: 36, lh: 1.29, weight: 500 },
  bodyS: { name: 'Body-S', family: 'body', size: 24, lh: 1.29, weight: 500 },
  bodySReg: { name: 'Body-S-Reg', family: 'body', size: 24, lh: 1.2, weight: 400 },
  bodyXs: { name: 'Body-XS', family: 'body', size: 16, lh: 1.3, weight: 400 },
} as const satisfies Record<string, NwTextStyle>

export type NwTextToken = keyof typeof nwText

/** Turn a text token into inline styles. Slides use this instead of ad-hoc px. */
export function nwType(token: NwTextToken): CSSProperties {
  const t: NwTextStyle = nwText[token]
  return {
    fontFamily: nwFonts[t.family],
    fontSize: t.size,
    lineHeight: t.lh,
    fontWeight: t.weight,
    ...(t.tracking ? { letterSpacing: `${t.tracking}em` } : null),
  }
}

/**
 * Layout geometry measured off the V2 slide frames.
 * The safe area is where all slide content lives; the progress bar and the
 * footer mark sit outside it.
 */
export const nwLayout = {
  /** Left/right content margin on content slides. */
  marginX: 84,
  /** Top margin to the kicker baseline block. */
  marginTop: 64,
  /** Bottom margin above the progress bar. */
  marginBottom: 72,
  /** Height of the segmented progress bar pinned to the bottom edge. */
  progressHeight: 14,
  /** Instructor video tile, top-right of content slides. */
  instructor: { width: 250, height: 250, radius: 28, top: 42, right: 84 },
  /** Corner radii used across cards, tags and containers. */
  radius: { card: 28, tile: 24, tag: 999, glass: 96, panel: 20 },
} as const

/** Card/panel shadows measured off the white content cards. */
export const nwShadow = {
  card: '0 18px 48px -22px rgba(0, 42, 75, 0.28)',
  cardSoft: '0 10px 30px -16px rgba(0, 42, 75, 0.20)',
  glass: '0 40px 90px -40px rgba(0, 20, 70, 0.55)',
} as const
