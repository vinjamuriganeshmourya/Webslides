import type { Transition } from 'framer-motion'
import { easing } from '@/design/tokens'

/**
 * TIMINGS FOR THE LAYER DRAWN OVER A SCREENSHOT.
 *
 * A copy of the `annotation` preset from `slide-kit/shot-lab/src/motion/presets.ts`,
 * held in the session because `src/motion/presets.ts` is kit-owned and
 * `sync-kit.mjs` overwrites it. They run at the explanatory tier, roughly
 * double a UI tier, because the room has to notice the dim happen and then
 * follow the boxes in order. Delete this file when the preset reaches the kit.
 */
export const annotation = {
  /** The spotlight dim, starting once the capture itself has landed. */
  dim: { duration: 0.52, delay: 0.4, ease: easing.soft } as Transition,
  /** When the first box appears, with and without a dim to wait for. */
  boxesAfterDim: 0.6,
  boxesPlain: 0.3,
  /** Gap between successive boxes. */
  stagger: 0.13,
  /** The magnifier inset and its connector, after the last box. */
  inset: { duration: 0.52, ease: easing.soft } as Transition,
  insetGap: 0.1,
}
