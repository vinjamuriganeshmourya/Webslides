import type { ReactNode } from 'react'

/**
 * THE CONTRACT EVERY VARIANT IN THIS LAB TAKES.
 *
 * One shape, so choosing a winner is a rename at the call site and nothing else.
 *
 * The unit is a VERDICT, not a bullet: a claim, the one line of consequence that
 * earns it, and the judgement the slide is actually making about it. A bullet
 * list cannot carry the third of those, which is why every deck that needed one
 * reached for four stacked callouts and got four things that must not be missed,
 * which is none of them.
 */

/**
 * `error` is the authored name and `danger` is the palette's name for the same
 * red. Authors write what a row MEANS: a command that does not work is an error,
 * not a danger.
 */
export type Verdict = 'success' | 'warning' | 'error' | 'info'

export interface VerdictItem {
  verdict: Verdict
  /** The claim. One line, and the thing the room should leave remembering. */
  claim: ReactNode
  /** The one line of consequence that earns the claim. What happens, or what to do instead. */
  reason?: ReactNode
  /** Overrides the verdict's default word. Use when the deck's own vocabulary is clearer. */
  label?: ReactNode
}

export interface VerdictFigureProps {
  items: VerdictItem[]
  /**
   * Reveal the rows together on slide entry instead of click-gating each one.
   *
   * Required whenever the figure sits beside a supporting visual: hard rule 6
   * says text and its visual arrive together.
   */
  immediate?: boolean
  className?: string
}

/**
 * THE ONE RULE THIS WHOLE LAB IS BUILT ON.
 *
 * Colour is never the only carrier of the verdict. Every variant below states
 * the same judgement three times over: in colour, in a glyph or a shape, and in
 * a word. A learner who is colour blind, who is looking at a washed-out
 * projector, or who is reading a printed handout in greyscale gets the verdict
 * from the other two.
 *
 * This is not a preference. It is the accessibility floor for instructional
 * material, and it is why no variant here is allowed to drop the word to save a
 * few pixels.
 */
export const VERDICT: Record<
  Verdict,
  {
    /** The word, spelled out. Never removed to save space. */
    word: string
    /** Tailwind colour steps. 100 is the tint, 600 the ink, 700 the solid fill. */
    tint: string
    ink: string
    solid: string
    border: string
    /** The glyph, from the house icon set. */
    icon: 'check' | 'warning' | 'cross' | 'info'
    /**
     * The SHAPE the verdict is drawn in, which is the cue that survives
     * greyscale and every kind of colour blindness. A circle is safe, a cut
     * corner is a hazard, a square is neutral. `StampCards` is the variant that
     * leans on this hardest.
     */
    shape: 'circle' | 'octagon' | 'triangle' | 'square'
  }
> = {
  success: {
    word: 'Correct', tint: 'bg-success-100', ink: 'text-success-600',
    solid: 'bg-success-600', border: 'border-success-600', icon: 'check', shape: 'circle',
  },
  warning: {
    word: 'Careful', tint: 'bg-warning-100', ink: 'text-warning-600',
    solid: 'bg-warning-600', border: 'border-warning-600', icon: 'warning', shape: 'triangle',
  },
  error: {
    word: 'Wrong', tint: 'bg-danger-100', ink: 'text-danger-600',
    solid: 'bg-danger-600', border: 'border-danger-600', icon: 'cross', shape: 'octagon',
  },
  info: {
    word: 'Note', tint: 'bg-info-100', ink: 'text-info-600',
    solid: 'bg-info-600', border: 'border-info-600', icon: 'info', shape: 'square',
  },
}

/** The CSS clip path for each shape, so a glyph holder can be cut to it. */
export const SHAPE_CLIP: Record<string, string | undefined> = {
  circle: undefined, // a border radius does it, and antialiases better than a clip
  square: undefined,
  octagon:
    'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
  triangle: 'polygon(50% 4%, 100% 96%, 0% 96%)',
}
