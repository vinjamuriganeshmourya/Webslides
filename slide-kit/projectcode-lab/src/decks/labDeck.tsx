import type { DeckMeta, SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'
import { apiSliceFixture } from '@/ui/variants/fixture'
import { TourStops } from '@/ui/variants/TourStops'
import { CallFlow } from '@/ui/variants/CallFlow'
import { LayerMap } from '@/ui/variants/LayerMap'

/**
 * PROJECT CODE EXPLANATION DESIGNS — a lab, not a session.
 *
 * WHY THIS IS SEPARATE FROM THE PSEUDOCODE LAB
 *
 * They look like one problem and are two. Pseudocode explanation is about ONE
 * algorithm: what does this logic do, and what happens when it runs. Project-code
 * explanation is about MANY FILES: where does this live, what calls it, and what
 * has to be true elsewhere for this line to make sense. A trace table answers the
 * first and is useless for the second; a file map answers the second and is
 * useless for the first.
 *
 * WHAT THE KIT CANNOT DO TODAY
 *
 * `CodeBlock` shows one file, `CodeBuildSlide` shows one file growing, `FileTree`
 * shows the shape of a directory, and nothing connects them. A walkthrough of four
 * files is four slides with no thread, and the room is asked to remember where
 * `serializers.py` sat while looking at `views.py`.
 *
 * The literature calls the target form WALKTHROUGH DOCUMENTATION: a guided tour
 * using snippets as points of interest on a map, filling the gap between low-level
 * and high-level documentation. Its named needs are annotation, consistent colour
 * per layer, and movement between levels of abstraction. So the unit of the
 * contract is a STOP ON A TOUR, not a file.
 *
 * Every variant renders the identical fixture and takes the identical
 * `ProjectFigureProps`.
 */

export const labDeck: SlideDef[] = [
  {
    id: 'v1-tour',
    label: '1 · TourStops',
    section: 'Variants',
    notes:
      'THE GUIDED TOUR, and the closest to what the literature actually describes. A persistent map of the four files down the left, tinted by layer and pipped with the stops each holds, beside the current stop\'s snippet. The room never loses track of where a snippet LIVES, which is the one thing four separate code slides cannot do. The current stop is derived from the revealed beats rather than held in state, so it cannot fall out of sync with the deck. Worst at: the handover. `via` is drawn nowhere, so a room can finish able to name all four files and still not say what calls what.',
    element: (
      <ContentSlide
        kicker="Explaining a codebase"
        title="TourStops"
        lead="A map that stays put, and one snippet at a time beside it."
      >
        <TourStops {...apiSliceFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v2-callflow',
    label: '2 · CallFlow',
    section: 'Variants',
    notes:
      'THE HANDOVER IS THE SUBJECT. Five cards joined by connectors carrying `via`: GET, calls, lazy queryset, reads Product, defines. For a request path, WHAT HANDS TO WHAT is the lesson, and a file map states adjacency without stating causation. Note how it handles the two consecutive stops in the SAME file: a dashed plate behind both, a headless connector (an arrowhead would claim a file boundary that does not exist), and a chip reading "same file, further down". Worst at: the code. A 106px column wraps the DecimalField line to three visual lines, so anyone who needs to READ the queryset needs TourStops instead.',
    element: (
      <ContentSlide
        kicker="Explaining a codebase"
        title="CallFlow"
        lead="Five stops, and the mechanism of every handover named on the line."
      >
        <CallFlow {...apiSliceFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v3-layermap',
    label: '3 · LayerMap',
    section: 'Variants',
    notes:
      'SOME QUESTIONS ARE "WHERE DOES THIS LIVE", NOT "WHAT HAPPENS NEXT", and a chain cannot answer them. Four bands in layer order, the five stops plotted at the height of their layer and joined, so the request reads as a descent from the URL to the table. Colour per layer is held identical across all three variants, which the literature names as the single most useful aid to identifying a module without re-reading its name. Worst at: it teaches no code at all, there is no snippet on the figure, and it collapses when every layer holds exactly one file and one stop, because then the band and the chip say the same thing twice.',
    element: (
      <ContentSlide
        kicker="Explaining a codebase"
        title="LayerMap"
        lead="The same request, drawn as a descent through the layers it passes."
      >
        <LayerMap {...apiSliceFixture} />
      </ContentSlide>
    ),
  },
]

export const labDeckMeta: DeckMeta = {
  title: 'Project Code Explanation Designs',
  course: 'Slide kit · figure lab',
  lesson: 'Project code explanation designs',
}
