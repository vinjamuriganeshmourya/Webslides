import type { DeckMeta, SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'
import { largestFixture } from '@/ui/variants/fixture'
import { TraceTable } from '@/ui/variants/TraceTable'
import { LineAnnotated } from '@/ui/variants/LineAnnotated'
import { PseudoToReal } from '@/ui/variants/PseudoToReal'

/**
 * PSEUDOCODE EXPLANATION DESIGNS — a lab, not a session.
 *
 * WHY THIS LAB EXISTS
 *
 * Pseudocode currently goes through `CodeBlock`, which is a FILE view, and two of
 * its features actively mislead: a filename says "create this file" when
 * pseudocode is what you write BEFORE there is a file, and a language chip names a
 * language when the whole point is that it is none of them. Worse, `CodeBlock` has
 * nowhere to say what a line MEANS and nowhere to show what happens when the
 * algorithm runs.
 *
 * The established device for the second of those is the TRACE TABLE, also called a
 * dry run: one column per variable, one row per executed step, filled in as the
 * algorithm proceeds. It is standard in school and college computing because it
 * turns "what does this do" into something a room can watch happen. That is why
 * `trace` is a first-class field on the contract rather than something a variant
 * invents.
 *
 * NOTHING BUT VARIANTS IS IN HERE, following the sibling labs.
 *
 * Every variant renders the identical fixture and takes the identical
 * `PseudoFigureProps`, so picking a winner is a rename at the call site.
 */

export const labDeck: SlideDef[] = [
  {
    id: 'v1-trace',
    label: '1 · TraceTable',
    section: 'Variants',
    notes:
      'THE CANONICAL DRY RUN, and the reason this lab exists. Pseudocode on one side, a trace table on the other, filling ONE ROW PER CLICK with the matching pseudocode line lighting at the same instant. The contrast is the teaching: rows where a value MOVED are tinted with the new value in a pill, rows where the branch DECLINED are white and muted. The fixture exercises exactly that with three passes over line 4, true only once. Worst at: it runs out of columns and says so rather than shrinking, and at eight clicks it is the slowest figure here to present.',
    element: (
      <ContentSlide
        kicker="Explaining an algorithm"
        title="TraceTable"
        lead="The pseudocode, and what the variables actually did, one step per click."
      >
        <TraceTable {...largestFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v2-annotated',
    label: '2 · LineAnnotated',
    section: 'Variants',
    notes:
      'THE PER-LINE NOTE IS THE THING `CodeBlock` STRUCTURALLY CANNOT HOLD. Each note sits beside its line and lands on the same click, so the room reads the algorithm as prose with code rather than code followed by explanation. END IF and END FOR still take their beat and leave their note cell empty, which is honest: they are structure, not steps. Worst at: it cannot show a VALUE, so the fixture\'s most interesting fact, that line 4 is true only once in three, is a claim in prose rather than something the room watches happen.',
    element: (
      <ContentSlide
        kicker="Explaining an algorithm"
        title="LineAnnotated"
        lead="Every line says why it is there, beside the line rather than after it."
      >
        <LineAnnotated {...largestFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v3-bridge',
    label: '3 · PseudoToReal',
    section: 'Variants',
    notes:
      'THE BRIDGE. Each real line is positioned at the y of the pseudocode line it implements, so the pairing is GEOMETRIC rather than described, and hovering either side lights the other. THE TEACHING POINT IS AN ABSENCE: pseudocode lines 6 and 7, END IF and END FOR, have no Python counterpart because Python closes blocks with indentation. They are computed as orphans rather than hardcoded, and get a dashed stub that leaves the panel and arrives nowhere. A variant that paired by index would silently teach that `print` implements END IF. Worst at: it draws a one-to-one map only, and the right column is mostly air whenever the real code is shorter.',
    element: (
      <ContentSlide
        kicker="Explaining an algorithm"
        title="PseudoToReal"
        lead="The same algorithm twice, joined line by line, including where it does not join."
      >
        <PseudoToReal {...largestFixture} />
      </ContentSlide>
    ),
  },
]

export const labDeckMeta: DeckMeta = {
  title: 'Pseudocode Explanation Designs',
  course: 'Slide kit · figure lab',
  lesson: 'Pseudocode explanation designs',
}
