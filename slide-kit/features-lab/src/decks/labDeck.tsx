import type { DeckMeta, SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'
import {
  noteAppFeatures,
  FIXTURE_CAPTION,
  pipelineFeatures,
  PIPELINE_CAPTION,
  storefrontFeatures,
  STOREFRONT_CAPTION,
} from '@/ui/variants/fixture'
import { BentoGrid } from '@/ui/variants/BentoGrid'
import { Spotlight } from '@/ui/variants/Spotlight'
import { AlternatingRows } from '@/ui/variants/AlternatingRows'
import { RadialSpread } from '@/ui/variants/RadialSpread'
import { EditorialList } from '@/ui/variants/EditorialList'
import { SplitCompare } from '@/ui/variants/SplitCompare'
import { MetricLed } from '@/ui/variants/MetricLed'
import { LayerAnatomy } from '@/ui/variants/LayerAnatomy'
import { FeatureFocus } from '@/ui/variants/FeatureFocus'
import { AnnotatedShot } from '@/ui/variants/AnnotatedShot'

/**
 * FEATURE SLIDE DESIGNS — a lab, not a session.
 *
 * WHY THIS LAB EXISTS
 *
 * "Here are the things it can do" is one of the commonest slides there is, and
 * the kit's answer to it is `CardGrid`: n cards of identical size, identical
 * white, identical tone, each with an icon and two lines. The user's verdict on
 * exactly that slide in the first Python session was *"All cards having same
 * design, it is not visually appealing"*, and then the more useful version:
 * *"Instead of cards you can use a different design altogether. Why should we be
 * constrained to cards?"* That became section 8 of `STYLE_GUIDE.md`.
 *
 * Established practice arrives at the same place from the other end: a modular
 * grid whose cards are all one size defeats the point of a modular grid, because
 * nothing leads and the eye is given no anchor to enter on.
 *
 * NOTHING BUT VARIANTS IS IN HERE, following `flow-lab` and `flowchart-lab`: a
 * gallery whose first slides are chrome makes the reader page past the deck's own
 * furniture to reach the thing being judged.
 *
 * EVERY VARIANT RENDERS THE IDENTICAL FIXTURE and takes the identical
 * `FeaturesFigureProps`, so picking a winner is a rename at the call site.
 */

const FIG = { ...noteAppFeatures, caption: FIXTURE_CAPTION }

export const labDeck: SlideDef[] = [
  {
    id: 'v1-bento',
    label: '1 · BentoGrid',
    section: 'Variants',
    notes:
      'THE MODULAR GRID, DONE PROPERLY. The hero spans two columns at exactly twice the area of the tile beside it, and only the hero carries its outcome, as a filled pill so it reads as a different KIND of statement rather than a third paragraph. This is the direct answer to "all cards having the same design": unequal tiles give the eye an anchor to enter on. Worst at a set with no real leader, because it will still promote one item to a double tile and assert a hierarchy the content does not have.',
    element: (
      <ContentSlide
        kicker="Variant 1"
        title="BentoGrid"
        lead="Unequal tiles, so something leads and the eye has somewhere to enter."
      >
        <BentoGrid {...FIG} />
      </ContentSlide>
    ),
  },
  {
    id: 'v2-spotlight',
    label: '2 · Spotlight',
    section: 'Variants',
    notes:
      'ONE FEATURE AT A TIME. All five are listed from arrival, exactly one is open and legible, the rest are one dim row each, and a click MOVES the spotlight rather than adding a tile. The slide follows the instructor instead of showing everything and hoping the room looks where the voice is. Worst at its own final frame: when the presenter reaches the last item the four above are collapsed, so a screenshot, a PDF export or anyone reading the deck alone gets one feature and four headings. Every other variant here ends complete.',
    element: (
      <ContentSlide
        kicker="Variant 2"
        title="Spotlight"
        lead="Everything is listed, but only the one being talked about is legible."
      >
        <Spotlight {...FIG} />
      </ContentSlide>
    ),
  },
  {
    id: 'v3-alternating',
    label: '3 · AlternatingRows',
    section: 'Variants',
    notes:
      'THE WHAT AND THE WHY, SIDE BY SIDE. Each feature is a full-width row with the capability on one side and its outcome on the other, an arrow across the centre channel pointing from what it IS to what it BUYS, and the sides swap every row so the eye is forced back across the middle and reads each pair as a pair. Established practice: the strongest feature sections alternate the two rather than burying the outcome inside the description. Worst at comparison, because the labels never line up in a column, and at any item with no outcome, where half the row goes blank.',
    element: (
      <ContentSlide
        kicker="Variant 3"
        title="AlternatingRows"
        lead="Every row pairs what it is with what it buys you."
      >
        <AlternatingRows {...FIG} />
      </ContentSlide>
    ),
  },
  {
    id: 'v4-radial',
    label: '4 · RadialSpread',
    section: 'Variants',
    notes:
      'BREADTH, WHICH IS THE ONE CLAIM A GRID STATES BUT CANNOT SHOW. A hub reaches out along spokes that actually draw, to cards on an ellipse, with the hero spoke visibly the longest. The figure for "one thing, many applications". Worst at mechanism: a card holds a label and one wrapped line and this variant spends that line on the outcome, so the body moves into the hover popover, which the room watching a projector cannot reach. Wrong figure whenever the mechanism is the teaching. It also exposed a contract gap: FeaturesFigureProps names no SUBJECT, so the hub can only state a count.',
    element: (
      <ContentSlide
        kicker="Variant 4"
        title="RadialSpread"
        lead="One thing reaching into many places, which is a claim a grid cannot draw."
      >
        <RadialSpread {...FIG} />
      </ContentSlide>
    ),
  },
  {
    id: 'v5-editorial',
    label: '5 · EditorialList',
    section: 'Variants',
    notes:
      'NO BOXES AT ALL. When the NAMES are the content, a card around each one is decoration that also costs the name its size. Full-width rows, a tick rule in the gutter, hairlines between, and the label set large. It wins outright on long labels: "Plain files on disk" gets 306px of measure instead of a fixed tile. Worst at: it draws nothing but a LIST, so any set whose items relate to each other is silently misdrawn as unrelated names. It also drops icon and logo entirely, which makes it unusable wherever hard rule 12 requires a technology to carry its mark.',
    element: (
      <ContentSlide
        kicker="Variant 5"
        title="EditorialList"
        lead="When the names are the content, the boxes are decoration."
      >
        <EditorialList {...FIG} />
      </ContentSlide>
    ),
  },
  {
    id: 'v6-split',
    label: '6 · SplitCompare',
    section: 'Variants',
    notes:
      'A LIST ASSERTS VALUE, A COMPARISON DEMONSTRATES IT. The left column states life WITHOUT each capability by striking through the item\'s own outcome, so nothing is invented; the right carries it at full weight, and the pair shares one beat so the comparison reveals as a unit. "You stop losing work" only lands next to "you lose work". Worst at: `body` has nowhere to live in a 64px row, so what the feature IS moves into the hover, which a projector audience cannot reach. Half the stage is also spent stating the bad case, wasted if the room does not already recognise it.',
    element: (
      <ContentSlide
        kicker="Variant 6"
        title="SplitCompare"
        lead="The same five capabilities, argued from what you lose without them."
      >
        <SplitCompare {...FIG} />
      </ContentSlide>
    ),
  },
  {
    id: 'v7-metric',
    label: '7 · MetricLed',
    section: 'Variants',
    notes:
      'THE NUMBER LEADS AND THE NAME SUPPORTS IT, because a figure is the one thing on a slide the eye finds without being told where to look. Note the fixture: this is the ONE variant on `pipelineFeatures` rather than the note app, and that is the finding. Setting five numbers at one size in one colour asserts they are readings of the SAME instrument, and "40 ms / 100 per cent / 0 folders / every" is not such a set. No unit text repairs it, because the layout makes the claim before the units are read. A precondition of the design, not a bug in it.',
    element: (
      <ContentSlide
        kicker="Variant 7"
        title="MetricLed"
        lead="The figure leads. Only works where the numbers are the same kind of number."
      >
        <MetricLed {...pipelineFeatures} caption={PIPELINE_CAPTION} />
      </ContentSlide>
    ),
  },
  {
    id: 'v8-layer',
    label: '8 · LayerAnatomy',
    section: 'Variants',
    notes:
      'SOME FEATURE SETS ARE ONE THING WITH PARTS, and a grid actively lies about that by drawing the parts as peers standing side by side. A stack, stepped so the eye reads the side wall of a single solid rather than five bars in a column, tint strengthening with depth so the base looks like it is holding the rest up. Worst at: a set with no real ordering. The geometry insists the top rests on the bottom and the room believes it, so five unrelated capabilities come out as an invented architecture, which is a worse lie than drawing them flat.',
    element: (
      <ContentSlide
        kicker="Variant 8"
        title="LayerAnatomy"
        lead="Not five things side by side. One thing, seen from the side."
      >
        <LayerAnatomy {...FIG} />
      </ContentSlide>
    ),
  },
  {
    id: 'v9-focus-a',
    label: '9 · FeatureFocus (1 of n)',
    section: 'Variants',
    notes:
      'ONE CAPABILITY PER FRAME, at hero scale, with a rail showing where you are in the set. Established practice from app-store screenshot sets and product pages: each frame highlights ONE thing and does not try to show everything, because a viewer given six things looks at none of them. THE COST IS IN THE DECK, NOT THE FIGURE: it is designed to be repeated with `at` incremented, so the author writes N slides rather than one. The next slide is the same component at at=2.',
    element: (
      <ContentSlide
        kicker="Variant 9"
        title="FeatureFocus"
        lead="One capability, at the size of the only thing on the slide."
      >
        <FeatureFocus {...FIG} at={0} />
      </ContentSlide>
    ),
  },
  {
    id: 'v9-focus-b',
    label: '9 · FeatureFocus (3 of n)',
    section: 'Variants',
    notes:
      'THE SAME COMPONENT, `at` INCREMENTED. This is what the repetition costs and what it buys: the rail has moved, the room knows where it is in the set, and the frame is still about exactly one thing. Judge the pair together, because one slide of this variant is not the variant.',
    element: (
      <ContentSlide
        kicker="Variant 9"
        title="FeatureFocus"
        lead="The same component, one slide later."
      >
        <FeatureFocus {...FIG} at={2} />
      </ContentSlide>
    ),
  },
  {
    id: 'v10-shot',
    label: '10 · AnnotatedShot',
    section: 'Variants',
    notes:
      'SHOW THE THING. Callouts pinned to the regions of a real screenshot that prove each claim. For a technical audience, seeing the actual interface beats any icon, and the guidance is to annotate only where the interface cannot explain itself. THIS IS THE ONE VARIANT THAT CANNOT SHARE THE FIXTURE: a note app is a stand-in with no product to photograph, hard rule 11 forbids inventing a capture and hard rule 8 forbids annotating an unrelated one. So it runs on a REAL screenshot from deployment session 1, with three claims that shot genuinely shows. That constraint is its main cost: it is unusable wherever no real capture exists.',
    element: (
      <ContentSlide
        kicker="Variant 10"
        title="AnnotatedShot"
        lead="The product itself, with each claim pinned to the part that proves it."
      >
        <AnnotatedShot
          {...storefrontFeatures}
          caption={STOREFRONT_CAPTION}
          src="/shots/s1-app-products.png"
          alt="A React storefront listing products fetched from a Django API"
        />
      </ContentSlide>
    ),
  },
]

export const labDeckMeta: DeckMeta = {
  title: 'Feature Slide Designs',
  course: 'Slide kit · figure lab',
  lesson: 'Feature slide designs',
}
