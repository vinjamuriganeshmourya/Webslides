/**
 * Motion-graphic design tokens — transcribed verbatim from the TR doc
 *   `Integration project/deployment/session-1.md`
 *   › Appendix "Asset Production Spec".
 *
 * This spec is binding for **every** motion graphic in the deployment module,
 * not just session 1. The appendix's own justification for that is worth
 * keeping in view while editing this file:
 *
 *   "Objects recur across graphics (the image slab in mg-5 is the same slab in
 *    mg-7); if they are styled differently, the student reads them as different
 *    things and the teaching breaks."
 *
 * So: nothing here is decorative, and nothing here should be tuned per-asset.
 * If a graphic needs a colour that isn't in `mgColors`, that is a signal the
 * graphic is saying something the palette has no meaning for.
 *
 * SEPARATE FROM THE SLIDE THEME. These are *not* the nw2027 slide tokens (see
 * ./nw2027.ts). Motion graphics render inside a dark inset panel on the light
 * nw2027 content slides — see `@/motion/mg/MgStage`.
 */

import type { CSSProperties } from 'react'

/** Native motion-graphic canvas — appendix "Canvas and Delivery". */
export const MG_WIDTH = 1920
export const MG_HEIGHT = 1080
/** No text or key shape may sit outside this margin. */
export const MG_SAFE = 80

/**
 * Colour carries meaning here — the appendix is explicit that these hues must
 * never be used decoratively. The comment on each token is the *only* sanctioned
 * use.
 */
export const mgColors = {
  /** Background (dark canvas). */
  bg: '#0F172A',
  /** Panels, zones, trays. */
  surface: '#1E293B',
  /** Primary text. */
  ink: '#F1F5F9',
  /** Secondary labels, dimmed/inactive elements. */
  inkMuted: '#94A3B8',
  /** Docker-owned things only: Docker Engine, Docker Hub, containers. */
  dockerBlue: '#2496ED',
  /** Images — always flat, unlit grey. An image must never glow. */
  imageGrey: '#64748B',
  /** Working state, ✓, cache hit, exit code 0. */
  success: '#22C55E',
  /** Failure, blocked action, mismatch, dropped request. */
  error: '#EF4444',
  /** "Look here", in-progress, not-found-yet. */
  attention: '#F59E0B',
  /** The student's backend blocks. */
  djangoGreen: '#0C4B33',
  /** The student's frontend blocks. */
  reactCyan: '#61DAFB',
} as const

export type MgColorToken = keyof typeof mgColors

/** Terminal panel fill — appendix "Shape and Object Language". */
export const MG_TERMINAL_BG = '#0B1120'
/** Commands are typed at this rate. Appendix, same table. */
export const MG_TYPE_CPS = 25

/**
 * Typography — appendix "Typography". Sizes are px on the 1920 grid.
 * Note the appendix names Inter for prose and JetBrains Mono for code, which
 * differs from the nw2027 slide theme (Sora / DM Sans) on purpose: these assets
 * are exported independently of the deck.
 */
export const mgFonts = {
  sans: "'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
} as const

export const mgText = {
  /** Inter SemiBold 56 — asset titles. */
  title: { family: 'sans', size: 56, weight: 600, color: 'ink' },
  /** Inter Medium 36 — the lower-third caption. */
  caption: { family: 'sans', size: 36, weight: 500, color: 'ink' },
  /** Inter Medium 28 — object labels; uppercase for IMAGE / CONTAINER. */
  label: { family: 'sans', size: 28, weight: 500, color: 'ink' },
  /** Inter Regular 24 — annotations. */
  annotation: { family: 'sans', size: 24, weight: 400, color: 'inkMuted' },
  /** JetBrains Mono 26 — code and terminal. */
  code: { family: 'mono', size: 26, weight: 400, color: 'ink' },
} as const satisfies Record<
  string,
  { family: keyof typeof mgFonts; size: number; weight: number; color: MgColorToken }
>

export type MgTextToken = keyof typeof mgText

/** Turn a text token into inline styles, so assets never hand-roll px values. */
export function mgType(token: MgTextToken, color?: MgColorToken): CSSProperties {
  const t = mgText[token]
  return {
    fontFamily: mgFonts[t.family],
    fontSize: t.size,
    fontWeight: t.weight,
    color: mgColors[color ?? t.color],
    lineHeight: 1.3,
  }
}

/**
 * Caption rules — appendix "Caption Rules". Encoded rather than documented,
 * because "one caption on screen at a time" is the kind of rule that quietly
 * rots once six assets exist.
 */
export const mgCaption = {
  /** Fixed y in every asset, so captions never jump between graphics. */
  y: 936,
  /** Minimum on-screen time, seconds. */
  minSeconds: 2.5,
  /** Per-word minimum, seconds — the longer of the two wins. */
  perWordSeconds: 0.3,
  /** Captions break to two lines rather than shrinking. */
  maxChars: 60,
} as const

/** How long a caption must stay up, per the two rules above. */
export function captionHold(text: string): number {
  return Math.max(mgCaption.minSeconds, text.trim().split(/\s+/).length * mgCaption.perWordSeconds)
}

/**
 * Motion language — appendix "Motion Language". Durations in seconds, to match
 * the timeline clock in `@/motion/mg/clock`.
 */
export const mgMotion = {
  enter: { dur: 0.4, ease: 'cubic-bezier(0, 0, 0.2, 1)' },
  exit: { dur: 0.3, ease: 'cubic-bezier(0.4, 0, 1, 1)' },
  travel: { min: 0.6, max: 1.2, ease: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  camera: { dur: 0.8, ease: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  /** 3-cycle shake at 60ms per cycle, plus an error flash. */
  shake: { cycles: 3, cycleDur: 0.06, dur: 0.25 },
  /** scale 1.0 → 1.06 → 1.0, max 2 repeats. */
  pulse: { dur: 0.5, peak: 1.06, maxRepeats: 2 },
  /** Minimum held beat after a key reveal, before the next change. */
  beat: 0.8,
} as const

/**
 * Object geometry — appendix "Shape and Object Language". Shared so that an
 * IMAGE slab is byte-identical in mg-5 and mg-7, which is the entire point.
 */
export const mgObject = {
  image: {
    radius: 4,
    border: `2px dashed ${mgColors.imageGrey}`,
    fill: 'rgba(100,116,139,0.18)',
    /** Flat — the appendix forbids a shadow on an image. */
    shadow: 'none',
  },
  container: {
    radius: 12,
    border: `2px solid ${mgColors.dockerBlue}`,
    fill: 'rgba(36,150,237,0.10)',
    glow: '0 0 40px -6px rgba(36,150,237,0.55)',
    /** Stopped containers: grey, ring off, 60% opacity. */
    stoppedOpacity: 0.6,
  },
  machine: {
    stroke: mgColors.inkMuted,
    strokeWidth: 2,
  },
  path: {
    strokeWidth: 2,
    /** Request/data dot diameter. */
    dot: 8,
  },
} as const
