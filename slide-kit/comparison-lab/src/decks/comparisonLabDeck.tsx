import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, ContentSlide, ThankYouSlide } from '@/slides'
import { AnalogyMap } from '@/ui'
import { LedgerCompare } from '@/ui/LedgerCompare'
import { MirrorCards } from '@/ui/MirrorCards'
import { SwapRows } from '@/ui/SwapRows'
import { CallerView } from '@/ui/CallerView'
import type { CompareFigureProps } from '@/ui/compareFigure'

/**
 * COMPARISON FIGURE LAB
 *
 * Four candidates to replace `AnalogyMap`, each rendering the SAME content, so
 * the only variable between slides is the drawing. `flow-lab` established the
 * pattern and it is what made choosing there cheap.
 *
 * The content is session 5's `c3-interface-map`, verbatim, because that is the
 * slide the review rejected: *"Change the UI of this Slide ... Build a New Lab
 * for Comparison."* A fixture invented for the lab would be judged on how well
 * it suits the lab.
 */

export const comparisonLabMeta: DeckMeta = {
  title: 'Comparison Figure Variants',
  course: 'Kit lab',
  lesson: 'Comparison Figure Variants',
  presenter: 'NxtWave',
}

const FOOTER = 'Comparison Figure Variants'

/*
  THE FIXTURE, WRITTEN ONCE.

  Ordered deliberately for `CallerView`, which reads the FIRST pair as the
  exposed line and the rest as what sits under it. The other three treat the
  order as nothing more than reading order, so one array serves all four -- but
  that asymmetry is itself a finding, and the CLAUDE.md records it as the reason
  `CallerView` has the narrowest contract of the four.
*/
const FIXTURE: Pick<CompareFigureProps, 'leftLabel' | 'rightLabel' | 'pairs'> = {
  leftLabel: 'A Python function',
  rightLabel: 'A Makefile',
  pairs: [
    { from: 'make_coffee()', to: 'make "up"', code: true },
    { from: 'boil_water()', to: 'docker compose up -d --build', code: true },
    { from: 'add_coffee()', to: 'the flags, in the right order', code: true },
    { from: 'add_milk()', to: 'the service name, spelled right', code: true, key: true },
  ],
}

/*
  THE SAME FOUR PAIRINGS AS PROSE.

  `LedgerCompare`, `MirrorCards` and `SwapRows` are comparisons of IDEAS, not of
  code, and the session 5 slide was written that way. `CallerView` needs the code
  form above. Both are rendered, because a candidate that only works on one of
  them is a candidate with a narrower contract, and that is what the lab is for.
*/
const PROSE: Pick<CompareFigureProps, 'leftLabel' | 'rightLabel' | 'pairs'> = {
  leftLabel: 'A Python function',
  rightLabel: 'A Makefile',
  pairs: [
    { from: 'make_coffee()', to: 'make "up"', code: true },
    { from: 'Body of the function', to: 'docker compose command under the target' },
    { from: 'Caller writes one line', to: 'Anyone running the project types one short word' },
    { from: 'Caller never reads the body', to: 'Nobody needs to know the Docker flags', key: true },
  ],
}

const CAPTION = 'A Makefile does for your commands exactly what a function does for your code'

export const comparisonLabDeck: SlideDef[] = [
  {
    id: 'brand',
    label: 'Brand',
    transition: 'fade',
    element: <BrandSlide greeting="Comparison lab" lesson={FOOTER} />,
    notes:
      'Four candidates to replace AnalogyMap, all on identical content. Slide 2 is the incumbent, so judge every other slide against it rather than against an idea of what good looks like.',
  },
  {
    id: 'incumbent',
    section: 'The incumbent',
    label: '0 · AnalogyMap',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="The incumbent"
        title="AnalogyMap"
        lead="What session 5 shipped, and what the review rejected"
      >
        {/* The incumbent takes `rows`, not `pairs`: it has no notion of a key
            row and no notion of code, which is two of the four faults right
            there in its type. The fixture is mapped down to what it can hold. */}
        <AnalogyMap
          leftLabel={PROSE.leftLabel}
          rightLabel={PROSE.rightLabel}
          rows={PROSE.pairs.map((p) => ({ from: String(p.from), to: String(p.to) }))}
        />
      </ContentSlide>
    ),
    notes:
      'FOUR FAULTS, and they are the brief for everything after this slide. ONE: every row is the same weight, so nothing says which pairing is the point, and it is always the last one. TWO: the relation is carried by a 20px arrow between two blocks of 22px text, so the weakest element on the figure holds the whole meaning. THREE: no notion of code, so `make "up"` is set as prose and reads as the name of an idea rather than as something you type. FOUR: flat surfaces, against STYLE_GUIDE section 9. Note also that it right-aligns the left column, which makes a short cell and a long cell look ragged either side of the arrow.',
  },
  {
    id: 'ledger',
    section: 'Candidates',
    label: '1 · LedgerCompare',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Candidate 1"
        title="LedgerCompare"
        lead="One spine down the middle, and the key row drawn as the key row"
      >
        <LedgerCompare {...PROSE} caption={CAPTION} />
      </ContentSlide>
    ),
    notes:
      'THE CONTROL. Same shape as the incumbent with its four faults fixed rather than its grammar replaced: a continuous spine instead of four arrows, a lit key row, monospace where the content is code, and every surface lit. If none of the bolder candidates earns its complexity, this is what the kit should get. WORST AT: a pairing longer than about six words, because both columns are 1fr and share a baseline, so one side wraps and its partner does not.',
  },
  {
    id: 'mirror',
    section: 'Candidates',
    label: '2 · MirrorCards',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Candidate 2"
        title="MirrorCards"
        lead="Each system keeps its own panel, and a numbered badge does the pairing"
      >
        <MirrorCards {...PROSE} caption={CAPTION} />
      </ContentSlide>
    ),
    notes:
      'THE ONE THAT HANDLES UNEVEN PAIRS. Neither side is distorted by the other’s length, which matters here: "Caller never reads the body" is three words and its partner is six. The badge pairing is SyntaxBreakdown’s device and it survives a projector and greyscale, which colour does not. WORST AT: two pairings, where the badges become furniture because position already pairs them. Also the weakest of the four at emphasis, because a lit row inside a panel competes with the panel’s own heading.',
  },
  {
    id: 'swap',
    section: 'Candidates',
    label: '3 · SwapRows',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Candidate 3"
        title="SwapRows"
        lead="One pairing is one object, recessed on the left and raised on the right"
      >
        <SwapRows {...PROSE} caption={CAPTION} />
      </ContentSlide>
    ),
    notes:
      'THE GRAMMAR FIX. The bet is that the incumbent’s fault is not emphasis or surfaces but that two boxes and a glyph are THREE objects, and the eye counts three things before being told they are one. Here a pairing is a single object divided internally: the familiar side is a well, the new side is a lid, and no arrow is needed because there is no gap to cross. The only candidate whose pairing survives being read at a glance from the back of a room. WORST AT: more than four pairings, and any comparison where the two sides are peers, because raised-over-recessed asserts a direction a peer comparison does not have.',
  },
  {
    id: 'caller',
    section: 'Candidates',
    label: '4 · CallerView',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Candidate 4"
        title="CallerView"
        lead="Not what maps to what, but what is exposed and what is hidden"
      >
        <CallerView {...FIXTURE} caption={CAPTION} />
      </ContentSlide>
    ),
    notes:
      'THE ONLY ONE WHERE THE DRAWING MAKES THE CLAIM. The other three are legible arrangements of a claim made in the lead; this one draws the interface boundary itself, and "there is a line and you are above it" is exactly what PEDAGOGY_GUIDELINES section 3 means by a figure arguing something a sentence cannot. NOTE THE CONTENT IS DIFFERENT: it takes the first pair as the exposed line and the rest as what sits beneath, so it needs the code fixture rather than the prose one. That narrower contract is the finding. WORST AT: any comparison without a direction, where it will draw an ordinary fourth fact as though it were hidden implementation, and more than three hidden rows, where the dimmed block stops reading as detail and becomes a second list.',
  },
  {
    id: 'thankyou',
    label: 'Thank you',
    element: <ThankYouSlide lesson={FOOTER} />,
    notes: 'Closing fixture. The decision goes in this lab’s CLAUDE.md, with what each runner-up was worse at.',
  },
]
