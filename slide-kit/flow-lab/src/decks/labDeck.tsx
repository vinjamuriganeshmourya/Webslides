import type { DeckMeta, SlideDef } from '@/deck/types'
import { variant1 } from './variant1'
import { variant2 } from './variant2'
import { variant3 } from './variant3'
import { variant4 } from './variant4'

/**
 * FLOW FIGURE VARIANTS — a lab, not a session.
 *
 * This deck exists to choose a replacement for the kit's `FlowChart`, which
 * draws a row of bordered boxes with one arrow glyph between each pair. Session
 * 6 slide 20 needed three things it cannot do: label an edge with the command
 * that travels along it, distinguish a push from a pull, and give the registry
 * in the middle more weight than the laptop beside it. The session shipped a
 * workaround where `docker push` was rendered as a NODE, which is the figure
 * admitting it has no edges.
 *
 * NOTHING BUT VARIANTS IS IN HERE. No brand frame, no welcome, no agenda, no
 * thank you. A gallery whose first two slides are chrome makes the reader page
 * past the deck's own furniture to reach the thing being judged, and the
 * comparison is the entire purpose of the file.
 *
 * Each variant contributes exactly two slides, and they are the same two
 * everywhere so the comparison is like for like:
 *
 *   `v<n>-target-picture`  session 6 slide 20: laptop, Docker Hub, any machine,
 *                          with `docker push` and `docker pull` as the two legs
 *   `v<n>-cycle`           session 6 slide 38: build once, push, pull and run
 *                          everywhere
 *
 * All four take the identical `FlowFigureProps` from
 * `src/ui/variants/types.ts`, so picking a winner is renaming one component at
 * the call site. The contract describes MEANING (`source`, `hub`, `target`,
 * `forward`, `reverse`) and never geometry, because turning meaning into
 * geometry is the only thing the four variants disagree about.
 */

export const labDeck: SlideDef[] = [...variant1, ...variant2, ...variant3, ...variant4]

export const labDeckMeta: DeckMeta = {
  title: 'Flow Figure Variants',
  course: 'Slide kit · figure lab',
  lesson: 'Flow figure variants',
}
