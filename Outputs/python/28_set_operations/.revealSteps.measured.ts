/**
 * Build steps per slide, in deck order.
 *
 * GENERATED — measured by driving the player and counting how many ArrowRight
 * presses a slide absorbs before it advances. Rebuild with:
 *
 *   node workflow/export/build-reveal-steps.mjs http://localhost:5211 25
 *
 * A wrong number here is not cosmetic: the host reads it to decide how many
 * times to advance within a slide, so too low strands content that never
 * reveals and too high leaves the presenter clicking through nothing.
 */
export const PAGE_REVEAL_MAX_STEPS: number[] = [0,0,6,5,0,0,4,2,3,2,3,2,13,5,21,0,4,0,3,2,3,26,5,1,5]
