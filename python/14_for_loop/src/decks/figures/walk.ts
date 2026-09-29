import type { ReactNode } from 'react'
import { useClaimedSteps } from '@/motion/Stepper'

/**
 * THE BEAT ENGINE SHARED BY THE THREE WALK FIGURES.
 *
 * `SequenceWalk`, `PhonePlaylist` and `PiggyBank` are three SKINS of one idea:
 * a sequence walked one item per click, ending on an explicit beat where the
 * next item is asked for and refused. The engine is here so the three cannot
 * drift in how they count, and so the lab that promotes them into the kit has
 * one thing to promote rather than three copies of a loop.
 *
 * Session-local for now. See each figure's header.
 */

export interface Beat {
  /** Where the pointer sits. `-1` is before the walk; past the last item is the ran-out beat. */
  at: number
  /** The beat's own sentence, from the source, verbatim. */
  caption: ReactNode
  /** The short name of the beat, from the source's `data-anim-labels`. */
  label?: string
}

export function useBeat<B extends Beat>(beats: B[]): { beat: B | undefined; reached: number } {
  const shown = useClaimedSteps(beats.length)
  const reached = shown.filter(Boolean).length
  return { beat: reached > 0 ? beats[reached - 1] : undefined, reached }
}
