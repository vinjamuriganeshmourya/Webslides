import type { DeckMeta, SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'
import {
  csTermsFixture,
  glossaryFixture,
  pairTermsFixture,
  soloTermFixture,
} from '@/ui/variants/fixture'
import { TermLede } from '@/ui/variants/TermLede'
import { GlyphAnchor } from '@/ui/variants/GlyphAnchor'
import { BandSplit } from '@/ui/variants/BandSplit'
import { WorkedExample } from '@/ui/variants/WorkedExample'
import { TermGrid } from '@/ui/variants/TermGrid'
import { GlyphAnchorSolo } from '@/ui/variants/GlyphAnchorSolo'
import { GlyphAnchorPair } from '@/ui/variants/GlyphAnchorPair'
import { MedallionPlate } from '@/ui/variants/MedallionPlate'
import { SidePanel } from '@/ui/variants/SidePanel'
import { TabFrame } from '@/ui/variants/TabFrame'

/**
 * DEFINITION CARD DESIGNS — a lab, not a session.
 *
 * WHY THIS LAB EXISTS
 *
 * "Here is a word, and here is what it means" is the second most frequent thing
 * a deck in this course does, after stating a set of points, and the kit has
 * never designed for it. Today a definition is written as a `BulletList` item
 * with the term folded into the claim, as a `Card` with a `title`, or as a
 * two-column `DataTable`. All three are the absence of a decision, and the third
 * is the one that shows: a table says "these rows are data", and a definition is
 * prose. `definitionFigure.ts` has the full argument.
 *
 * WHAT THE FIVE VARIANTS ARE ARGUING ABOUT
 *
 * Two things, and they are not the same thing:
 *
 *   **How the term and the definition are separated.** `TermLede` says by type
 *   size alone; `BandSplit` says by putting them on different grounds;
 *   `GlyphAnchor` says by giving the term a picture the definition does not have;
 *   `TermGrid` says by putting the term in a gutter the definition never enters.
 *
 *   **What the definition IS.** `WorkedExample` is the only one that answers
 *   "the example, and the prose is its caption", which is true of a whole class
 *   of operational terms and false of the rest.
 *
 * All five are right about some content and wrong about the rest, which is why
 * the answer will be two or three registered types rather than one default. Every
 * variant takes the identical `DefinitionFigureProps` and renders the identical
 * fixture, so picking a winner is a rename at the call site.
 *
 * NO HOVER, ANYWHERE IN THIS LAB, which is the one deliberate departure from the
 * four sibling labs. See the note in `definitionChrome.tsx`: a deck is projected
 * into a room where nobody has a pointer, so a card carries everything it has to
 * say on its face.
 *
 * NOTHING BUT VARIANTS IS IN HERE, following the sibling labs.
 */

export const labDeck: SlideDef[] = [
  {
    id: 'v1-termlede',
    label: '1 · TermLede',
    section: 'Variants',
    notes:
      'THE ONLY VARIANT WITH NO CARD, AND THAT IS THE ARGUMENT. A box around prose adds four borders, a shadow and 48px of padding per column, which on a three-term row is 144px of the slide spent on containers instead of words. Spend it on the words instead and the definition gets the widest measure in the lab while the term gets to be set at display size rather than heading size: a term the room has to carry out of the door should be the largest thing on the frame, and a card cannot do that, because a card that is mostly one large word looks empty. Worst at: it has nowhere to put an example and nowhere to anchor a glyph, so it renders neither, and three columns of prose cannot be stretched to equal height the way cards can, so the row has a ragged bottom edge. The terms are top-aligned so that at least the thing the room is reading lines up.',
    element: (
      <ContentSlide
        kicker="Defining a term"
        title="TermLede"
        lead="No card. The term at display size, the definition as prose, a hairline between."
      >
        <TermLede {...csTermsFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v2-glyphanchor',
    label: '2 · GlyphAnchor',
    section: 'Variants',
    notes:
      'THE ONLY VARIANT THAT ANSWERS THE THREE-SECOND QUESTION. A room looking up from a laptop sees shapes before it reads anything, and three cards of pure type give it nothing to see: it has to start reading to find out what the slide is about. A bolt, a shield and a database are recognised before the eye focuses, so the room arrives already knowing there are three different KINDS of thing here, and an instructor can say "the one with the bolt" and be understood, which "the second one" never is. The tone lives in the glyph well rather than on an accent edge, because two coloured marks on one small card is one too many. Worst at: the 56px header costs the definition a line against BandSplit\'s 44px band, so the example only renders at two terms or fewer; and it flatters concrete terms while punishing abstract ones, since a set with no honest glyphs falls back to three lettered boxes and TermLede then says the same thing with more room.',
    element: (
      <ContentSlide
        kicker="Defining a term"
        title="GlyphAnchor"
        lead="A glyph the room recognises before it reads the word beside it."
      >
        <GlyphAnchor {...csTermsFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v3-bandsplit',
    label: '3 · BandSplit',
    section: 'Variants',
    notes:
      'TWO GROUNDS, NOT TWO TYPE SIZES, and that separation says what type size cannot: the term is a LABEL and the definition is content. Two things follow. A row of bands scans like an index, because the three terms sit at one height and one baseline with nothing pulling the eye down into the prose, which no other variant here allows. And the term cannot be crowded: the band is its own zone, so a three-line definition grows the white zone downward and the term keeps exactly the space it had. The band is a solid fill and not a gradient: 44px is too short a run for a gradient to read as anything but an uneven fill. Worst at: three saturated bands are three shouts, so the tone ramp\'s job of saying which term the frame is actually about is drowned by the fact that all three are painted; and a term that wraps makes one band taller than the others and the row of labels stops being a row.',
    element: (
      <ContentSlide
        kicker="Defining a term"
        title="BandSplit"
        lead="The term on a band, the definition on white. Two zones, on purpose."
      >
        <BandSplit {...csTermsFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v4-workedexample',
    label: '4 · WorkedExample',
    section: 'Variants',
    notes:
      'FOR THE TERMS WHERE THE EXAMPLE IS THE DEFINITION AND THE PROSE IS ITS CAPTION. "Idempotent" is three sentences of philosophy or it is PUT /users/7 twice with the same response, and the room understands the second first. It is the ROW variant rather than a card variant for a measured reason: an ExampleBlock is mono at 13.5px and does not wrap, the fixture\'s longest example line needs about 405px, and a third of the content well is 384, so in a three-card row the example scrolls sideways inside its own box. A full-width row hands it 518px and it fits with 100 spare. The split is 55/45 with the prose taking the larger half, because an even split left the example padded with 100px of nothing. Worst at: it is the tallest variant here and does not scale past three (four rows is 520px against a 440px well); it demands an example for every term, and a row with an empty right half is worse than a short card; and three stacked full-width rows are read one at a time, so it cannot be scanned, which is what BandSplit is for.',
    element: (
      <ContentSlide
        kicker="Defining a term"
        title="WorkedExample"
        lead="The words on the left, the thing itself on the right."
      >
        <WorkedExample {...csTermsFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v5-termgrid',
    label: '5 · TermGrid',
    section: 'Variants',
    notes:
      'IT REFUSES THE SHARED FIXTURE, AND THAT IS THE RESULT. Handed the three-term set every other variant renders, this one returns a ProblemPanel: two of those definitions are 229 and 196 characters against a grid row\'s ceiling of 120, which is two lines at 420px of measure. So it is not a denser alternative to the card variants, it is a different job. THE ONLY VARIANT THAT SURVIVES A SIX-TERM RECAP. The other four answer that slide with six cards, which is either six at 190px each or two rows of three at 100px tall: the first is unreadable and the second is a grid of cards pretending not to be a grid. So the card goes and only the two things a dense set needs stay, a scannable left edge for the terms and one hairline per row. The 150px gutter gives every term in a column a shared left AND right edge, which is what lets the eye run down reading only the words; the definition starts at the same x in every row, so the prose is a column too. Reading order is down the left then down the right, stated with grid-flow-col rather than left to the browser. THIS SLIDE RENDERS THE THREE-TERM SET AND THEN THE SIX-TERM ONE, because testing a dense variant on a sparse set is the same mistake as sizing a card for the short definition. Worst at: it is a handout, and the deck\'s rule is one idea per slide. Six definitions is six ideas and this variant makes that look tidy, which is what makes it dangerous. It is right for a RECAP of words already met one at a time and wrong for introducing anything. No room for a glyph, a gloss or an example, and its own definition ceiling is 120 characters against the shared resolver\'s 340.',
    element: (
      <ContentSlide
        kicker="Defining a term"
        title="TermGrid"
        lead="Six words on one frame, for the recap that has to carry them all."
      >
        {/*
          THE ONE SLIDE IN THE LAB THAT DOES NOT RENDER THE SHARED FIXTURE, AND
          THE REASON IS THE MOST USEFUL RESULT IN THE LAB.

          It cannot. Handed the three-term set, this variant returns a
          `ProblemPanel`: the race condition's definition is 229 characters and
          memoization's is 196, against a grid row's own ceiling of 120, which is
          two lines at 420px of measure. Four lines makes one row twice the height
          of the row beside it and the rows stop scanning, which is the only thing
          this variant has.

          That refusal IS the comparison. It says `TermGrid` is not a denser
          alternative to the card variants, it is a different job: a recap of
          words the room has already met, in the short form they were reduced to.
          Rendering the refusal on the slide would have spent half the frame on a
          red panel, so it lives in the notes and in the lab's own CLAUDE.md, and
          the slide shows the six-term set the variant exists for.
        */}
        <TermGrid {...glossaryFixture} />
      </ContentSlide>
    ),
  },

  /*
    SLIDES 6 TO 10: THE COUNT-SPECIFIC ROUND.

    THE PROBLEM THIS ROUND EXISTS TO FIX

    Every variant above lays its terms out as `repeat(n, 1fr)`. That is one
    arrangement stretched to whatever count it is handed, and it is genuinely
    designed for exactly one of them, three, which is the count the shared
    fixture carries. At one term the same code draws a single card 1152px wide:
    a 150-character measure and a 56px glyph floating in it. At two it draws
    three-column proportions with one column missing.

    Nothing in the resolver catches it, because nothing is wrong with the
    CONTENT. The figure renders, it is tidy, and it is unreadable at the back of
    a room, which is the failure mode this lab keeps writing checks for.

    So slides 6 and 7 are slide 2's design re-composed for one definition and for
    two, and slides 8 to 10 are three new box treatments, each taking slide 2's
    hierarchy and sizes and each doing something structurally different with the
    box: a badge on the boundary, a box cut into two grounds, and a box whose
    label sits outside it.

    WHY THE NEW THREE ARE SHOWN AT ONE TERM

    Same reason slide 5 is shown at six. A layout has to be judged at the count
    it is being proposed for, and one definition is the count the lab had no
    answer for at all. All three handle two as well, by a different arrangement
    rather than by shrinking, and each states its own count ceiling in its
    refusal string.
  */
  {
    id: 'v6-glyphanchor-solo',
    label: '6 \u00b7 GlyphAnchorSolo',
    section: 'Counts',
    notes:
      'SLIDE 2 AT ONE DEFINITION, TURNED NINETY DEGREES. GlyphAnchor stacks a 56px header over a full-width definition, which is right at a third of the well and wrong at all of it: one card 1152px wide sets the definition at about 150 characters a line, double the point at which prose stops being readable, and drops the glyph to 1.5% of the card, which is decoration on the one variant whose argument is that it is not. Neither is fixable by scaling the same arrangement, because a stacked layout has only one axis to give and at one term the spare axis is width. So the header becomes a 440px column, a hairline runs the full height between, and the definition takes the remaining 535px at 20px, about 62 characters a line. The glyph doubles to 112px because it is carrying recognition alone with no second glyph to be told apart from, the term finally gets display size at 40px, and the example always renders, because the 420px gate GlyphAnchor needs at three terms never fires at 535. The beats change too: one card is not a sequence, so beat 0 is the word and what it means and beat 1 is the example, which is the split the instructor makes with their voice anyway. Worst at: it is one term only, by design. Two of these stacked is 660px against a 440px well, so the two-term answer is slide 7 and it is a different arrangement rather than this one halved.',
    element: (
      <ContentSlide
        kicker="Defining a term"
        title="GlyphAnchorSolo"
        lead="Slide 2 at one definition. The header becomes a column, and the width becomes a second one."
      >
        <GlyphAnchorSolo {...soloTermFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v7-glyphanchor-pair',
    label: '7 \u00b7 GlyphAnchorPair',
    section: 'Counts',
    notes:
      'SLIDE 2 AT TWO DEFINITIONS, AND THE GLYPH BECOMES A RAIL. GlyphAnchor spends 56px of card HEIGHT on its glyph because at 336px of inner card there is no width to spend instead. At two terms the card is 564px and that constraint is gone, so keeping the stack costs 70px of height for an arrangement with no reason left, and leaves a 56px mark with 400px of white beside it, which reads as a hole in the card. Turned into a 72px rail the glyph costs no height at all, and the 70px goes to the example, which is the thing a two-term frame has finally got room for. The term goes up to 28px, the definition stays at 16.5 rather than following slide 6 to 20, because at 20px in a 424px column the long definition becomes five lines and one card is visibly taller in its text than the other. The example always renders here too: 424px clears the 50-character line the fixture needs, where three terms gives 336 and the block would scroll sideways. THE EQUAL-HEIGHT ROW IS THE TEST AT THIS COUNT: 236 characters beside 71 is the widest spread the lab holds, and items-stretch plus h-full plus mt-auto is what lands both examples on one line across the frame. Worst at: two cards is the most symmetrical thing there is, and symmetry claims the two terms are equal, which for a pair is usually the opposite of the point. A slide whose point is this one and not that one wants SidePanel.',
    element: (
      <ContentSlide
        kicker="Defining a term"
        title="GlyphAnchorPair"
        lead="Slide 2 at two definitions. The glyph moves out of the header and down the side."
      >
        <GlyphAnchorPair {...pairTermsFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v8-medallion-plate',
    label: '8 \u00b7 MedallionPlate',
    section: 'New boxes',
    notes:
      'THE MARK GOES ON THE BOUNDARY, NOT INSIDE IT. Every card in the lab so far is a closed rectangle, and from the back of a room GlyphAnchor, BandSplit and TermLede are the same shape. A disc straddling the top edge, half of it outside the box, is recognisable before any of its content is, so a deck that uses this for definitions has told the room which slides are definitions without saying so. It also earns the plate the right to be narrower than the well: a closed card that does not fill its container looks like it failed to stretch, and an object with a badge on it is allowed to sit in space, which is what lets one definition have a 760px plate and therefore a readable 560px measure. The medallion is a solid disc rather than GlyphWell\u2019s 8% tinted square, because on the boundary it has the slide\u2019s own tinted ground behind its top half and a 14% tint would be invisible there. One centred axis carries the medallion, the term and the gloss, and the tone rule under them ends it: the definition is set left inside a centred block, because centred prose past two lines makes the eye hunt for the start of every line. Worst at: no example zone, which is a decision and not an omission, since a left-aligned mono well re-opens the alignment question the rule just closed and is the widest fixed thing in the lab. The knock-on is that two plates cannot end level: with nothing to floor with mt-auto, the short definition just leaves about 75px more white under it.',
    element: (
      <ContentSlide
        kicker="Defining a term"
        title="MedallionPlate"
        lead="A plate with its mark on the boundary, and one centred axis until the prose starts."
      >
        <MedallionPlate {...soloTermFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v9-side-panel',
    label: '9 \u00b7 SidePanel',
    section: 'New boxes',
    notes:
      'BANDSPLIT\u2019S TWO GROUNDS, TURNED NINETY DEGREES, WHICH FIXES BOTH OF ITS FAULTS. A 44px band is sized by the term\u2019s line height, so it holds a word and nothing else, which is why BandSplit renders no glyph at all; and three strips in a row are three shouts of equal loudness, which drowns the tone ramp. A panel is sized by the CARD\u2019s height instead, so the whole header becomes one painted object with the glyph above the term and the gloss under it, and at one or two terms a painted third is a statement about that term rather than a stripe every card happens to have. THE COUNT CHANGES THE OBJECT HERE MORE THAN ANYWHERE ELSE IN THE LAB. At one term the panel is 440px of a 1152px card and holds the glyph, the term at 28px and the gloss, with 600px of measure on white beside it. At two the same third would be 188px, and 116px of inner width wraps Race Condition onto two lines, which makes one panel taller than the other and the pair stop reading as a pair. So the panel stops trying to hold the term: it becomes an 88px rail carrying the glyph alone, the term moves onto the white in ink, and the two-ground cut survives while the prose gets its 424px. That is the honest answer to a narrower card rather than a smaller version of the wide one. Worst at: it is the loudest layout in the lab, and loud is a claim. A third of the card in saturated brand blue says this term IS the frame, which is true for one new word and false for two ordinary ones side by side.',
    element: (
      <ContentSlide
        kicker="Defining a term"
        title="SidePanel"
        lead="One box cut vertically. The term reversed out of paint, the definition on white."
      >
        <SidePanel {...soloTermFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v10-tab-frame',
    label: '10 \u00b7 TabFrame',
    section: 'New boxes',
    notes:
      'THE TERM LEAVES THE BOX. It sits on a solid tab straddling the frame\u2019s top border, the way a legend sits on a fieldset, so it is the container\u2019s LABEL rather than its first line. Every other card here holds the term and the definition together and then spends paint, type size or a second ground on saying which is which; this one does not have to, because there is only one kind of thing inside the frame. Two features follow. The body can be two columns: one definition on a 1152px frame puts the prose in 539px and the example in 460px beside it, which comes to 255px of height against GlyphAnchorSolo\u2019s 329 for the same content stacked. And the frame reads as open: a 2px tone border with no shadow and no accent edge is a boundary rather than a surface, so next to a GlyphAnchor card it is visibly a different kind of object rather than the same card repainted. The glyph loses its well, because on the tab it is already on paint and a tile on a tab is a box inside a box, and the term reverses to white through the shared Term\u2019s invert stop. At two terms the body goes back to one column, since 508px is not two columns and the example needs 405 of it. Worst at: a tab is a corner, so two frames side by side read as step one and step two of something, a relationship the layout asserts for free. It also wants an example: with the term outside and no glyph well inside, a frame holding only prose is a rectangle with a paragraph in it, and TermLede says that with no rectangle.',
    element: (
      <ContentSlide
        kicker="Defining a term"
        title="TabFrame"
        lead="An open frame whose label sits on its own border, and a body with nothing to disambiguate."
      >
        <TabFrame {...soloTermFixture} />
      </ContentSlide>
    ),
  },
]

export const labDeckMeta: DeckMeta = {
  title: 'Definition Card Designs',
  course: 'Slide kit · figure lab',
  lesson: 'Definition card designs',
}
