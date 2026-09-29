import type { DeckMeta, SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'
import { mandateFixture, twoButtonFixture } from '@/ui/variants/fixture'
import { RailRows } from '@/ui/variants/RailRows'
import { LedgerRows } from '@/ui/variants/LedgerRows'
import { MarginVerdict } from '@/ui/variants/MarginVerdict'
import { StampCards } from '@/ui/variants/StampCards'
import { SplitVerdict } from '@/ui/variants/SplitVerdict'
import { DrawnStampCards } from '@/ui/variants/DrawnStampCards'

/**
 * VERDICT POINT DESIGNS — a lab, not a session.
 *
 * WHY THIS LAB EXISTS
 *
 * Stating that one thing is right, another is wrong and a third needs care is
 * the second most frequent job any deck in this repo does, after stating a plain
 * set of points. `points-lab` already designed the plain set. This lab designs
 * the judged one, and they are not the same problem: a plain point needs weight,
 * and a judged point needs a verdict that a room can read at distance, in
 * greyscale, and without separating red from green.
 *
 * The kit has exactly one answer today, `StatusList`, and it has never been
 * argued with. It is reproduced here as variant 1 so that it has to win on its
 * merits rather than by being the only thing in the drawer.
 *
 * THE FLOOR EVERY VARIANT CLEARS
 *
 * Colour is never the only carrier of the verdict. Every variant states the
 * judgement in colour, in a glyph or a silhouette, AND in a word. This is the
 * accessibility requirement for instructional material, and `contract.tsx`
 * records it as a rule rather than leaving it to each component's taste.
 *
 * WHAT THE FIVE VARIANTS ARE ARGUING ABOUT
 *
 * Where the verdict LIVES. `RailRows` puts it on the row's own surface,
 * `LedgerRows` puts it in a column of its own, `MarginVerdict` puts it in type
 * and removes the box entirely, `StampCards` puts it in a silhouette, and
 * `SplitVerdict` says that a pair is not a list at all. All five are right about
 * some content, which is why the outcome is a small registered set rather than
 * one replacement default.
 *
 * NOTHING BUT VARIANTS IS IN HERE, following the sibling labs.
 */

export const labMeta: DeckMeta = {
  title: 'Verdict Point Designs',
  course: 'NxtWave · Figure Lab',
  lesson: 'Verdict Point Designs',
  presenter: 'NxtWave',
}

const KICKER = 'Stating a judged point'

export const labDeck: SlideDef[] = [
  {
    id: 'v1-railrows', label: '1 · RailRows', section: 'Variants',
    notes:
      'THE KIT\'S CURRENT ANSWER, reproduced so it has to win on merit. Four cues per row, all saying the same thing: a coloured rail, a tint, a glyph and a word. BEST AT three or four mixed verdicts read at distance, because the tint blocks let a room sort the set by colour before reading a word of it. WORST AT being quiet: four tinted blocks is four coloured rectangles stacked, and a set that is mostly one verdict reads as a field of colour with no figure in it. At about 84px a row it is also the second most expensive here, so six rows do not fit the well.',
    element: (
      <ContentSlide kicker={KICKER} title="RailRows" lead="The verdict sits on the row's own surface">
        <RailRows {...mandateFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v2-ledgerrows', label: '2 · LedgerRows', section: 'Variants',
    notes:
      'THE VERDICT BECOMES A COLUMN, solid-filled rather than tinted, and that changes the reading: the eye runs down the gutter and sorts the set before reading a word, instead of reading four rows and working out the pattern. BEST AT five or six rows, and at any set where the MIX is the point. It also has the strongest greyscale separation of anything here, because a 600-step fill against white is far apart in a way two 100-step tints are not. WORST AT short sets: two rows leave a 118px column of colour doing nothing and looking like a table missing its rows. It spends the most horizontal space of any variant, leaving about 560px of content column against RailRows\'s 640px, so a 60-character claim wraps here and does not there.',
    element: (
      <ContentSlide kicker={KICKER} title="LedgerRows" lead="The verdict is a column, and the column is the pattern">
        <LedgerRows {...mandateFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v3-marginverdict', label: '3 · MarginVerdict', section: 'Variants',
    notes:
      'NO CONTAINER AT ALL, and removing it is the argument. A tint says "notice this row"; four tints say it four times and the emphasis cancels out. This spends its contrast on type instead, so the claims are read first and the verdicts second, which is the right order whenever the claims are the teaching and the verdicts are only the sorting. BEST AT six or more rows: at about 62px a row it is by far the cheapest here and the only variant that fits seven judgements in the well without shrinking the type. WORST AT being seen. With no fill there is nothing to sort by colour from the back of a room, so a room that is skimming will skim past the one red row. Never use it when a single row is the point of the slide.',
    element: (
      <ContentSlide kicker={KICKER} title="MarginVerdict" lead="The verdict is set in type, and the box is removed">
        <MarginVerdict {...mandateFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v4-stampcards', label: '4 · StampCards', section: 'Variants',
    notes:
      'THE VERDICT IS A SILHOUETTE: a circle for correct, a cut-corner octagon for wrong, a triangle for careful. About one man in twelve cannot separate the red row from the green one, and a washed-out projector or a greyscale handout does the same to everyone. Colour, glyph and word are three cues, but two are small and one fails for a large minority of any room; a silhouette is neither. An octagon is a stop sign at fifteen metres, in any colour, to anybody. BEST AT a slide carrying one genuine hazard the room must not miss, and it is the only variant that survives a black and white printout intact. WORST AT subtlety and density: four stamps is four strong silhouettes competing, so a set with no real hazard looks alarmed about nothing. At about 92px a row it is the most expensive here and four rows is its ceiling.',
    element: (
      <ContentSlide kicker={KICKER} title="StampCards" lead="The verdict is a shape, so it survives greyscale">
        <StampCards {...mandateFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v6-drawnstampcards', label: '6 \u00b7 DrawnStampCards', section: 'Variants',
    notes:
      'STAMPCARDS WITH THE MARK DRAWN ON. The tick strokes in the direction a person draws a tick, the cross arrives as two strokes, and the silhouette springs to size underneath. The verdict word lands last, after the mark has finished, so the room sees the judgement and then reads its name. WHY THIS IS NOT DECORATION: a drawn mark holds the eye on the one thing in the row that must not be misread, for the second an instructor spends saying it out loud, and it makes the rows arrive as a sequence of judgements rather than a block of four. NOTHING LOOPS: no pulse, no hover, nothing moves once it has arrived, because a figure that keeps moving is one the room watches instead of listening. Timing is this repo\'s explanatory tier, not the animation skills\' UI tier: 520ms entrance, 130ms stagger, 620ms stroke. useInstant() is read, so a Ctrl+arrow jump lands on a still slide with every mark already finished. BEST AT the four-row set a concept turns on. WORST AT a slide the instructor means to pass over, since it costs about 1.2s to arrive fully.',
    element: (
      <ContentSlide kicker={KICKER} title="DrawnStampCards" lead="The mark draws itself, and then it stops">
        <DrawnStampCards {...mandateFixture} immediate />
      </ContentSlide>
    ),
  },
  {
    id: 'v5-splitverdict', label: '5 · SplitVerdict', section: 'Variants',
    notes:
      'NOT A LIST, AND THAT IS THE ARGUMENT. A do and a don\'t are not two items in a set; they are one decision with two sides, and stacking them vertically makes the room read in sequence what it is supposed to weigh against each other. Equal width and equal height are a deliberate claim: the two options looked equally plausible, which is why the slide is needed. BEST AT two controls that sit next to each other and do opposite things, which is the case that produced it. WORST AT anything that is not a pair: three columns is a comparison table with no header row, and one column is a Callout. It takes the first two items and ignores the rest, so a five-item set fails loudly rather than rendering something misleading.',
    element: (
      <ContentSlide kicker={KICKER} title="SplitVerdict" lead="A pair is one decision with two sides, not two items">
        <SplitVerdict {...twoButtonFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v5b-splitverdict-misuse', label: '5b · SplitVerdict misused', section: 'Variants',
    notes:
      'THE SAME COMPONENT FED THE FOUR-ROW FIXTURE, kept in the lab on purpose. It renders the first two items and drops the other two, which is the failure mode stated rather than discovered in a session. Look at it before reaching for SplitVerdict: if the set is not genuinely a pair, this is what the slide will do to it.',
    element: (
      <ContentSlide kicker={KICKER} title="SplitVerdict Misused" lead="The four-row fixture in a two-column figure loses two rows">
        <SplitVerdict {...mandateFixture} />
      </ContentSlide>
    ),
  },
]
