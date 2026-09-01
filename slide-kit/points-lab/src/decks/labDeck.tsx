import type { DeckMeta, SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'
import { dockerNounsFixture } from '@/ui/variants/fixture'
import { RuleStack } from '@/ui/variants/RuleStack'
import { PeerCards } from '@/ui/variants/PeerCards'
import { LeadAndRest } from '@/ui/variants/LeadAndRest'

/**
 * POINT-STATING DESIGNS — a lab, not a session.
 *
 * WHY THIS LAB EXISTS
 *
 * Stating a short set of points is the single most frequent thing any deck in this
 * repo does, and it is the one thing the kit has never designed. Every points slide
 * currently reaches for a bullet list inside `ContentSlide`, or for whichever
 * bespoke component the session that first needed it happened to write. A bullet
 * list is not a figure; it is the absence of one, and it gets four things wrong
 * every time: it gives unequal points equal weight, it has room for a claim OR a
 * reason but not both, it has no structure to reveal a step at a time, and its one
 * string per bullet is an open invitation to the two-ideas-per-slide failure this
 * repo breaks most often.
 *
 * So the unit of the contract is a POINT: a claim, the one line that earns it, and
 * optionally the word it is about. Not a string. Every variant here takes the
 * identical `PointsFigureProps` and renders the identical fixture, so picking a
 * winner is a rename at the call site.
 *
 * WHAT THE THREE VARIANTS ARE ARGUING ABOUT
 *
 * One thing only: WEIGHT. `RuleStack` says the points are a sequence, `PeerCards`
 * says they are interchangeable, and `LeadAndRest` says one of them carries the
 * set. All three are right about some content and wrong about the rest, which is
 * why the answer is three registered types rather than one default.
 *
 * NOTHING BUT VARIANTS IS IN HERE, following the sibling labs.
 */

export const labDeck: SlideDef[] = [
  {
    id: 'v1-rulestack',
    label: '1 · RuleStack',
    section: 'Variants',
    notes:
      'THE ONLY VARIANT THAT GIVES A CLAIM ITS OWN LINE. 802px of text column, so the fixture\'s longest claim (510px at 20px) and its longest reason (608px at 15px) each stay on ONE line and nothing is read twice. The ordinal in the marker column states the order the stack only implies, and the term chip carries the word the learner will actually type, which is why this variant spends no pixels on an icon. Worst at: it states a sequence whether or not there is one, so a set of genuine peers comes out looking like steps; and at six rows it is 532px of grey that does not fit the 400px budget at all.',
    element: (
      <ContentSlide
        kicker="Stating a set of points"
        title="RuleStack"
        lead="One claim per line, and the line that earns it underneath."
      >
        <RuleStack {...dockerNounsFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v2-peercards',
    label: '2 · PeerCards',
    section: 'Variants',
    notes:
      'EQUAL GEOMETRY IS A CLAIM, and it is the right one whenever the points are four things of the same kind: nothing is first, nothing is bigger, and the four sit at one eye height where they can actually be compared, which is a horizontal act a stack cannot perform. The icon earns its 34px because a card is a small target on a projector. Worst at: it FLATTENS THE LEAD, and the fixture has one, so the image ends up with a chip that has to say "start here" because the geometry cannot; and 224px of content width is brutal, a 60-character claim is three lines and a 65-character one eats the card\'s declared 18px of padding outright.',
    element: (
      <ContentSlide
        kicker="Stating a set of points"
        title="PeerCards"
        lead="Four boxes the same size, because the four points are peers."
      >
        <PeerCards {...dockerNounsFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v3-leadandrest',
    label: '3 · LeadAndRest',
    section: 'Variants',
    notes:
      'THE HERO IS READ OFF THE DATA, never hardcoded: `tone: "lead"` is the author saying which point carries the set, so marking the third point promotes the third point. 440px and 26px type against a 640px support column, and the hero is beat 0, so the slide opens on the one thing the instructor is about to say. Worst at: it makes a claim about weight that will sometimes be wrong, and it cannot be switched off, so a set of true peers gets one of them promoted for no reason. Also measured: a support row gives its reason ONE 584px line, about 86 characters, and the fixture\'s 81 fits with five to spare; the tone WORD does not fit there at all, so a support point\'s warning is the presenter\'s to say out loud.',
    element: (
      <ContentSlide
        kicker="Stating a set of points"
        title="LeadAndRest"
        lead="One point at the weight it deserves, and the others in support."
      >
        <LeadAndRest {...dockerNounsFixture} />
      </ContentSlide>
    ),
  },
]

export const labDeckMeta: DeckMeta = {
  title: 'Point-Stating Designs',
  course: 'Slide kit · figure lab',
  lesson: 'Point-stating designs',
}
