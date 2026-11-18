/**
 * SHARED MOTION TOKENS (Session 7, 2026-11-06: "micro-animations ... using shared motion tokens").
 *
 * The numbers the engine's parts already move by, named once so a session's custom figures use the same
 * values instead of their own: the reveal of a diagram part (`Diagram.tsx` REVEAL_MS), the build beat
 * (`scene.tsx` BUILD_MS / BUILD_LEAD), a screenshot ring, and the flow dot that rides an arrow (`Traveller`).
 * Everything that loops must also stop on `?still`, in thumbnails and under prefers-reduced-motion:
 * gate it with `motionHeld()` (or the `mo` classes in `figures/motion.ts`, which do it in CSS).
 */
import { REDUCED, STILL } from '@/decks/figures/scene'

export const MOTION = {
  /** the one ease every reveal uses */
  ease: 'cubic-bezier(0.22,1,0.36,1)',
  /** a part fading and rising in (ms) */
  reveal: 360,
  /** a screenshot ring appearing (ms) */
  ring: 320,
  /** one build press under auto animation (ms), and the beat before the first */
  build: 380,
  buildLead: 360,
  /** the flow dot on an arrow: its size (px) and one ride (s); `slow` for time passing on a timeline */
  flow: { dot: 10, dur: 2.4, slow: 4.8 },
} as const

/** true when nothing may move: harness URLs, reduced motion, or an instant (thumbnail) render */
export const motionHeld = (instant = false) => STILL || REDUCED || instant
