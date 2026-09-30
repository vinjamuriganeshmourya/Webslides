import type { DeckMeta, SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'
import {
  authFixture,
  brokenFixture,
  dockerFixture,
  leadFixture,
  pyFixture,
} from '@/ui/variants/fixture'
import { AttributeSpine } from '@/ui/variants/AttributeSpine'
import { HeadToHead } from '@/ui/variants/HeadToHead'
import { LabelBand } from '@/ui/variants/LabelBand'
import { PairGrid } from '@/ui/variants/PairGrid'

/**
 * A VS B COMPARISON DESIGNS — a lab, not a session.
 *
 * WHY THIS LAB EXISTS
 *
 * "Here are two things, and here is how they differ" is everywhere in this
 * course: `docker run` against `docker compose up`, a bind mount against a
 * volume, `let` against `const`, a list against a tuple. Today every one of them
 * is written as a two-column `DataTable` or as two `Card`s side by side, and both
 * are the absence of a decision. `comparisonFigure.ts` has the full argument.
 *
 * WHAT THE FOUR VARIANTS ARE ARGUING ABOUT
 *
 * **Where the attribute goes**, and every one of the four answers it
 * differently, which turns out to settle everything else about the layout:
 *
 *   `AttributeSpine` puts it in a centre gutter, which makes the ROW the unit.
 *   Every row is one question asked of both sides, and the eye crosses the seam
 *   because something in the middle tells it what it is crossing.
 *
 *   `HeadToHead` repeats it inside each panel, which makes the COLUMN the unit.
 *   Each side is read whole, in its own terms, before being set against the
 *   other.
 *
 *   `LabelBand` puts it on a band above the pair, which buys MEASURE: the label
 *   costs a line of height instead of a column of width, so both cells go from
 *   476px to 552px.
 *
 *   `PairGrid` puts it at the top of a card and lays the cards across the frame,
 *   which buys COUNT: six attributes become two rows instead of six.
 *
 * So the four span two axes rather than one. The first two disagree about
 * reading DIRECTION, row-wise against column-wise. The second two disagree with
 * all of it about what the frame's width is FOR: measure, or attribute count.
 *
 * Which is right is decided by the content and not by taste, and the resolvers
 * say so out loud: `AttributeSpine` refuses `authFixture` and names `LabelBand`,
 * `PairGrid` refuses anything over 45 characters and names it too. All four take
 * the identical `ComparisonFigureProps`, so picking a winner is a rename at the
 * call site.
 *
 * WHICH FIXTURE EACH SLIDE RENDERS, AND WHY THEY ARE NOT ALL THE SAME ONE
 *
 * The sibling labs render one fixture everywhere, because there the variants
 * differ in geometry alone and identical content is the only honest comparison.
 * Two of these four differ in what content they are FOR, and a variant built for
 * long cells cannot be judged on short ones. So slides 1 and 5 share
 * `dockerFixture`, slides 2 and 5 share `leadFixture` across variants, and
 * slides 3 and 4 carry the sets their variants exist for. The overlap is what
 * keeps it a comparison.
 *
 * NO HOVER, AND NO ARROW BETWEEN THE TWO SIDES. The first for the standing
 * reason: a deck is projected into a room where nobody has a pointer. The second
 * is the line between this lab and `beforeafter-lab`, where the arrow is the
 * whole point: an arrow between two options claims one turns into the other.
 *
 * NOTHING BUT VARIANTS IS IN HERE, following the sibling labs.
 */

export const labDeck: SlideDef[] = [
  {
    id: 'v1-attribute-spine',
    label: '1 · AttributeSpine',
    section: 'Variants',
    notes:
      'THE ATTRIBUTE GOES IN THE MIDDLE, AND THAT IS THE FINDING THE LAB TURNS ON. Every comparison template in the wild draws option A\'s points in the left box and option B\'s in the right and calls it a comparison. Nothing in that arrangement guarantees A\'s third point and B\'s third point are about the same thing, and the moment the two texts differ in length they stop sharing a line, so the reader holds one column in memory while scanning the other, which is the work the figure was supposed to do for them. Putting the attribute in a centre gutter fixes it structurally rather than by discipline: the row becomes the unit, the eye crosses the seam because something in the middle names what it is crossing, and a two-line cell pushes its own row taller instead of drifting out of alignment with its partner. The gutter is 200px and fixed, not proportional: the attribute is capped at 32 characters, which sets to about 180px at 12px uppercase, and a gutter that grew with the figure would put 280px of white between the two answers, past which the eye stops comparing and reads two columns. The attribute is also the QUIETEST text on the frame, which looks wrong and is not: it is scaffolding, and at cell weight the row read as three equal columns, which is a table. Worst at: it asserts that both subjects HAVE the attribute, so a claim true of only one side cannot be expressed and the resolver refuses it outright; and at two rows the 200px gutter is a third of the figure spent on two short labels, where HeadToHead says the same thing with the room going to the words.',
    element: (
      <ContentSlide
        kicker="Comparing two things"
        title="AttributeSpine"
        lead="The question in the middle, the two answers either side of it."
      >
        <AttributeSpine {...dockerFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v2-head-to-head',
    label: '2 · HeadToHead',
    section: 'Variants',
    notes:
      'TWO PANELS READ WHOLE, FOR THE COMPARISON WHERE THE SUBJECTS ARE NOT PARALLEL. This variant has to justify itself against AttributeSpine rather than against a blank slide, and it does, on one case: a spine writes every row as one question asked of both, which is right when the two things are alternatives for the same job and forced when they are not. Sometimes the honest answer is "here is what this one is, and here is what that one is", with the reader taking each in as a whole before setting them against each other, and a spine cannot say that because its structure insists every claim be a matched pair. THE ATTRIBUTE REPEATS ON BOTH SIDES, WHICH LOOKS LIKE DUPLICATION AND IS NOT: the first pass put it on the left panel only and let the right panel line up against it, which is a spine with extra steps and worse than the spine, because the label then sat inside one of the two things being compared and quietly belonged to it. Repeating it is what lets each panel be read alone. The panels are equal width always: Deckary recommends 60/40 to emphasise the recommended option, and this kit has no recommended option, so emphasis is tone lead on one side and the geometry stays symmetric. Worst at: nothing aligns across the seam, so panels with unequal cell heights drift as they descend and by the fourth row the reader is holding one column in memory again, which is why this variant caps at three rows against the shared contract\'s six; and two equal panels claim the two sides are equally good, which is a statement the content often contradicts.',
    element: (
      <ContentSlide
        kicker="Comparing two things"
        title="HeadToHead"
        lead="Each side read whole, in its own terms, before they are set against each other."
      >
        <HeadToHead {...leadFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v3-label-band',
    label: '3 · LabelBand',
    section: 'Variants',
    notes:
      'IT BUYS MEASURE WITH HEIGHT, AND THAT IS THE WHOLE TRADE AGAINST SLIDE 1. AttributeSpine spends a 200px COLUMN on the attribute and both answers pay for it on every row, so each cell gets 476px, about 58 characters a line. This variant spends a LINE OF HEIGHT on the same label and then gets it out of the way, so both cells get 552px, about 67 characters a line. That sounds small and is not: a 125-character cell is three lines at 476 and two at 552, and a three-line cell makes its row half again as tall as the row under it, which is exactly where a comparison stops scanning. So the two are not alternatives on taste. Short cells belong on the spine, which reads faster and fits more rows; cells that need a clause belong here, and AttributeSpine refuses this very fixture by name rather than wrapping it. It is also the most symmetric arrangement in the lab: nothing sits between the two answers, so neither is nearer the centre, nearer the label or first, which is what HeadToHead structurally cannot say because a left panel and a right panel are read in that order. The band is a filled tint rather than a rule because its job is to BIND the two cells under it into one row, and a filled ground does that where a line does not. Worst at: it holds the fewest rows of anything here, since a band plus its gap costs about 30px more per row than a spine row; and the two answers end up 552px apart edge to edge against the spine\'s 200px, so on a set of short cells it has spread two words across the whole frame and spent a line of height announcing it.',
    element: (
      <ContentSlide
        kicker="Comparing two things"
        title="LabelBand"
        lead="The question on a band above the pair, so both answers get the full measure."
      >
        <LabelBand {...authFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v4-pair-grid',
    label: '4 · PairGrid',
    section: 'Variants',
    notes:
      'IT TURNS THE SET NINETY DEGREES, AND IT IS THE ONLY VARIANT HERE THAT GETS BETTER AS THE ATTRIBUTE COUNT GOES UP. The other three are all vertical lists, and a vertical list spends HEIGHT on the number of attributes and WIDTH on the length of the answers, which is right when the answers are sentences and wrong when they are not. Six attributes whose answers are a word, a literal or a short phrase is a common and specific shape: list against tuple, GET against POST, let against const. On a spine that set is six rows tall, roughly 390px of figure carrying about twelve words, with 476px columns holding the word "Yes": the height is spent on the count and the width is spent on nothing. Three cards across and two down uses the width the set was being denied and the figure is two rows tall instead of six. THE TWO ANSWERS STACK INSIDE THE CARD, WHICH BREAKS THE ONE THING THE OTHER THREE GIVE FOR FREE, that the left column is always A, and the price is that every answer carries its own side label in its own tone at 11px. That is a repetition six times over and it is the same justification HeadToHead gives for repeating the attribute: it is what makes each card readable alone, and on a grid a reader entering at the fifth card is a thing that happens. Worst at: the answers are 41 characters, because a 370px card has 338px inside it, so anything needing a clause belongs on LabelBand and the resolver says so by name; and a grid implies no order, so a comparison that builds an argument across its rows loses it here, since the reader picks the path and there are six of them.',
    element: (
      <ContentSlide
        kicker="Comparing two things"
        title="PairGrid"
        lead="Six short answers laid across the frame instead of down it."
      >
        <PairGrid {...pyFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v5-spine-at-two',
    label: '5 · AttributeSpine at two rows',
    section: 'Counts',
    notes:
      'THE SAME TWO-ROW SET THE PREVIOUS SLIDE RENDERS, DRAWN BY THE OTHER VARIANT, WHICH IS THE ONLY WAY TO SEE WHAT THE COUNT COSTS. At five rows the spine is plainly the better figure. At two it is spending a 200px gutter, a third of a 760px figure and a sixth of a full-well one, on two short labels that appear once each, and the two answers are pushed 200px apart for no structural gain because there are not enough rows for the spine to be the thing they hang off. It renders rather than refuses, because two rows is legible and a refusal here would be the resolver having an opinion about taste. That is the boundary this slide exists to mark: the resolver refuses what cannot be READ, and the lab documents what should not be CHOSEN. This slide also carries the one side in the lab marked tone lead, which is the contract\'s opt-in emphasis and is deliberately not the default: a lecture comparing two commands is usually recommending neither, and a kit-wide default of highlighting the winner would have every comparison figure quietly arguing for something the author never decided.',
    element: (
      <ContentSlide
        kicker="Comparing two things"
        title="AttributeSpine at two rows"
        lead="The same pair as slide 2. The gutter costs a third of the figure and earns nothing."
      >
        <AttributeSpine {...leadFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v6-refusal',
    label: '6 · The refusal',
    section: 'Counts',
    notes:
      'THE RESOLVER REFUSING, RENDERED RATHER THAN DESCRIBED, BECAUSE A REFUSAL NOBODY HAS SEEN IS A REFUSAL NOBODY TRUSTS. Three authoring mistakes, each of which renders as something PLAUSIBLE and none of which any of the four harnesses would catch, since all three produce a figure that sits comfortably inside the frame. One: a row empty on one side, which draws a tidy row with a blank cell that reads as an oversight, when what it means is "only the first one has this", and that is a three-region figure rather than a comparison. Two: a cell at 158 characters against the 110 ceiling, which wraps to three lines at a 476px half-column and makes one row twice the height of the rest, at which point the rows stop scanning and the arrangement has lost the only thing it has. Three: an attribute written as a question with a question mark, which is a sentence, and a sentence in a 200px gutter turns the spine into a third column of prose. The ceilings are measured rather than chosen: 110 characters is two lines of 16.5px Inter at 476px, which is the half-column a 200px gutter leaves on a 1152px well, and 32 characters is about four words, which is what 200px holds at 12px uppercase on two lines.',
    element: (
      <ContentSlide
        kicker="Comparing two things"
        title="What it refuses"
        lead="Three mistakes that render as something plausible, which is the only kind worth checking."
      >
        <AttributeSpine {...brokenFixture} />
      </ContentSlide>
    ),
  },
]

export const labDeckMeta: DeckMeta = {
  title: 'A vs B Comparison Designs',
  course: 'Slide kit · figure lab',
  lesson: 'A vs B comparison designs',
}
