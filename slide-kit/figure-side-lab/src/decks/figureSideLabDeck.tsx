import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, ContentSlide, ThankYouSlide } from '@/slides'
import { Terminal } from '@/ui'
import { SplitWell } from '@/ui/SplitWell'
import { FigureLede } from '@/ui/FigureLede'
import { FigureBleed } from '@/ui/FigureBleed'
import { CaptionRail, CaptionRailDatum } from '@/ui/CaptionRail'
import type { FigureSideProps } from '@/ui/figureSide'

/**
 * FIGURE-BESIDE-CONTENT LAB
 *
 * Four candidate LAYOUTS for the gap described at the top of
 * `src/ui/figureSide.ts`: the kit has no slide type that places a live figure
 * (`Terminal`, `DataTable`, `BoundaryBridge`, `LayerStack`, `CodeBlock`) beside
 * content. All four take the identical `FigureSideProps`, so swapping one for
 * another in a deck is a rename, and every gallery slide renders the SAME
 * fixture, so the only variable between slides is the arrangement.
 *
 * THE FIXTURE IS SESSION 6 SLIDE 19, `c2-login`, VERBATIM — its title, its lead,
 * its two points and its four terminal lines, copied out of
 * `django_deployement_course/deployement_session_6/src/decks/partC2C3.tsx`. That
 * is one of the 23 slides that hand-rolls its figure placement with
 * `<div className="mx-auto w-full max-w-[980px]">`, and it is the slide the
 * defect was measured on. A fixture invented for the lab would be judged on how
 * well it suits the lab.
 *
 * Reproduced here rather than imported, so the lab is self-contained and cannot
 * break when that session changes. The strings are the session's own.
 *
 * THE WIDE FIXTURE, slides 7 and 8, is session 6 slide 21 `c2-push-denied`: a
 * four-line `docker push` refusal whose longest line is 96 monospace characters.
 * A candidate that only works for a small figure is a finding worth showing, so
 * it is shown rather than asserted — once through the candidate that survives it
 * and once through the one that does not.
 */

export const figureSideLabMeta: DeckMeta = {
  title: 'Figure Beside Content Variants',
  course: 'Kit lab',
  lesson: 'Figure Beside Content Variants',
  presenter: 'NxtWave',
}

const FOOTER = 'Figure Beside Content Variants'

/* Session 6's own constants, from `src/decks/deckShared.tsx`. */
const AT_ROOT = 'C:\\nxttrendz'
const DOCKER_ID = 'ravi123'
const IMAGE = 'nxttrendz-backend'
const S4 = 'Running the Real App with Docker'
const C2 = 'Login and Image Names'
const pushDenied = (name: string) =>
  `push access denied for ${name}, repository does not exist or may require authorization`

/*
  `Code` IS SESSION 6'S OWN INLINE-CODE HELPER, from `src/decks/deckShared.tsx`,
  copied so the fixture's two points render the way that deck renders them. One
  class differs, and deliberately:

  `text-nw-deep`, NOT `text-brand-deep`, WHICH IS WHAT SESSION 6 WRITES.

  There is no `deep` key in the `brand` ramp: it is `brand.600`, and `deep` only
  exists in the `nw` group. So `text-brand-deep` generates no rule and session
  6's inline code renders in inherited colour. Same hex either way (#0146C7);
  this is the class that actually paints it. Not fixed there — that deck belongs
  to another writer — but worth knowing before this fixture is called verbatim.
*/
const Code = ({ children }: { children: string }) => (
  <code className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[0.94em] text-nw-deep">
    {children}
  </code>
)

const LOGIN: Omit<FigureSideProps, 'lesson'> = {
  kicker: C2,
  title: 'docker login',
  lead: 'Once per machine, not once per push',
  points: [
    {
      text: (
        <>
          {'Password is invisible while typing, the same behaviour as '}
          <Code>createsuperuser</Code>
          {` in ${S4}`}
        </>
      ),
    },
    { text: 'Nothing is echoed, so the prompt looks frozen when it is working' },
  ],
  figure: (
    <Terminal
      path={AT_ROOT}
      fontSize={14}
      lines={[
        { text: 'docker login', kind: 'cmd' },
        { text: `Username: ${DOCKER_ID}`, kind: 'out' },
        { text: 'Password:', kind: 'out' },
        { text: 'Login Succeeded', kind: 'ok' },
      ]}
    />
  ),
}

/*
  THE WIDE FIXTURE, session 6 slide 21 `c2-push-denied`.

  It carries NO points in the session deck and none are invented here: the slide
  is a lead and a terminal. That is itself informative — `CaptionRail` with no
  rail is a full-width figure, and `SplitWell` with no points draws an empty left
  half, which is the second measured defect from the session 6 sweep reproduced
  exactly.

  THE REFUSAL IS AN `out` LINE, exactly as session 6 renders it, and that is the
  fixture rather than a recommendation. The shipping `Terminal` DOES have an `err`
  kind (`cmd | out | ok | err`, drawn in #F14C4C) — session 6's own deck header
  still says it does not, which was true of an older copy and is not true of the
  166-line component that session now ships. Rendering the refusal red would be a
  better slide and a different fixture, so it stays `out` here. That deck belongs
  to another writer and nothing here changes it.
*/
const PUSH_DENIED: Omit<FigureSideProps, 'lesson'> = {
  kicker: C2,
  title: 'Push Denied',
  lead: 'Try it with the name the image already has',
  figure: (
    <Terminal
      path={AT_ROOT}
      fontSize={14}
      lines={[
        { text: `docker push ${IMAGE}`, kind: 'cmd' },
        { text: 'Using default tag: latest', kind: 'out' },
        { text: `The push refers to repository [docker.io/library/${IMAGE}]`, kind: 'out' },
        { text: pushDenied(IMAGE), kind: 'out' },
      ]}
    />
  ),
  caption: 'Three lines of output, and none of them is a success',
}

/*
  THE STRESS FIXTURES, slides 9 to 11.

  A datum that holds on ONE fixture is a coincidence. These render the same
  figure with the point list at both extremes, so the question "does the figure
  move when the copy changes length" is answered by the render rather than by the
  code: if the terminal's top edge and the first bullet's are at the same y on
  BOTH slides 9 and 10, the shared top edge is real. The block itself moves
  between them, and should — it is centred in the well and a five-point block is
  taller.

  THE EXTRA POINTS ARE NOT INVENTED. They are session 6's own, from slide 49
  `c3-push-denied-again`, which teaches the same refusal. The one-point fixture is
  the login slide's second point on its own.
*/
const STRESS_POINTS = [
  {
    text: 'If the name is not prefixed with your Docker ID, it is the naming problem from earlier',
    icon: 'warning' as const,
  },
  {
    text: 'If the name is correctly prefixed and this still appears, it is authentication',
    icon: 'key' as const,
  },
  { text: 'Fix: docker login, then retry', icon: 'check' as const },
]

const ONE_POINT: Omit<FigureSideProps, 'lesson'> = {
  ...LOGIN,
  points: [LOGIN.points![1]],
}

const FIVE_POINTS: Omit<FigureSideProps, 'lesson'> = {
  ...LOGIN,
  points: [...LOGIN.points!, ...STRESS_POINTS],
}

export const figureSideLabDeck: SlideDef[] = [
  {
    id: 'brand',
    label: 'Brand',
    transition: 'fade',
    element: <BrandSlide greeting="Figure side lab" lesson={FOOTER} />,
    notes:
      'Four candidate layouts for a live figure beside content, all on identical content. Slide 2 is the real incumbent: plain ContentSlide with points AND children, which is the grid-cols-[1.4fr_1fr] items-center mode session 6 slide 32 renders today. Judge every other slide against that, not against an idea of what good looks like. Two properties to watch on every candidate: the block is CENTRED in the well, and the figure and the first bullet share a TOP EDGE. Those are separate, and the second is the one ContentSlide gets wrong.',
  },
  {
    id: 'incumbent',
    section: 'The incumbent',
    label: '0 · ContentSlide',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker={LOGIN.kicker}
        title={LOGIN.title}
        lead={LOGIN.lead}
        points={LOGIN.points}
      >
        {/* THE WRAPPER IS THE DEFECT, COPIED VERBATIM. One of 23 in session 6,
            at one of five arbitrary widths. Nothing about the slide says why
            this figure is 980px and the one on slide 36 is 760px. */}
        <div className="mx-auto w-full max-w-[980px]">{LOGIN.figure}</div>
      </ContentSlide>
    ),
    notes:
      'WHAT SHIPPED, AND THE BRIEF FOR EVERYTHING AFTER IT. `ContentSlide` takes both points and children, so it uses its two-column branch and gives the figure 1fr against the prose\'s 1.4fr: the terminal is squeezed into a third of the width while the copy has room to spare, which is backwards for a slide whose subject is the terminal. On the 10 session 6 slides with no points it takes the other branch and stacks the figure under the copy in the leftover height, centred, so the figure\'s position is a by-product of how long the copy above it happens to be. Note also the hand-written 980px: five different widths across one deck, none of them stated anywhere.',
  },
  {
    id: 'split',
    section: 'Candidates',
    label: '1 · SplitWell',
    element: <SplitWell {...LOGIN} lesson={FOOTER} />,
    notes:
      'THE CONSERVATIVE ONE. Half the well is prose, half is the figure, both centred in it. The float cannot happen because the figure centres in a full-height column rather than in a residue. WORST AT: a wide figure, because half the well is 546px and the kit\'s Terminal wraps rather than reflows, breaking mid-token so an image name reads as two half-names; slide 8 shows that. Also a short point list, where both halves centre and two bullets sit in the middle of a 440px column with dead space above and below, which is this lab\'s own defect moved from the figure to the prose.',
  },
  {
    id: 'lede',
    section: 'Candidates',
    label: '2 · FigureLede',
    element: <FigureLede {...LOGIN} lesson={FOOTER} />,
    notes:
      'TWO ASYMMETRIES, DELIBERATELY DIFFERENT ONES. The figure gets 58% because it is what the room is being asked to read; the points get 42% and are TOP-ALIGNED because a list is read top to bottom and has no natural centre, so a short list starts where a long list starts and consecutive slides in a concept do not jump. WORST AT: a tall figure with four or more bullets, where the top-aligned prose and the centred figure stop sharing an axis and the slide reads as two unrelated blocks. The 58/42 split buys emphasis, not width: 636px still wraps a wide Terminal mid-token.',
  },
  {
    id: 'bleed',
    section: 'Candidates',
    label: '3 · FigureBleed',
    element: <FigureBleed {...LOGIN} lesson={FOOTER} />,
    notes:
      'THE ONE THAT SPENDS THE MARGIN. Every other candidate leaves 64px of empty ground down the right edge, because SlideBase pads the content region; here the figure cancels that padding and lands flush with the stage edge, so it is the widest thing in the deck and unmistakably the subject. WORST AT: a figure that cannot give up its right radius. Terminal, CodeBlock and DataTable all carry rounded-card on their own outermost div with no prop to drop it, so the panel bleeds with both right corners still rounded and reads as shoved off the slide rather than as continuing past it. Adopting this means a bleed prop on five kit figures, which is a change to signed-off components. Its caption is also off-axis by 32px, and the drop shadow on the bled edge is clipped away by SlideBase, so the surface loses its lighting exactly where it is largest.',
  },
  {
    id: 'rail',
    section: 'Candidates',
    label: '4 · CaptionRail',
    element: <CaptionRail {...LOGIN} lesson={FOOTER} />,
    notes:
      'THE ONE THAT REFUSES THE SIDE-BY-SIDE PREMISE. Full-width figure with the points as a rail of captions beneath it, the two centred in the well as ONE block. This is the arrangement session 6 was reaching for with all 23 of its mx-auto wrappers; the difference is that the figure is not handed the height left over after the points, so the points do not have to be dropped to stop the figure drifting. The rail carries one hairline and no ground on purpose: three tinted boxes under a Terminal would be three more surfaces competing with the one the slide is about. WORST AT: a point longer than about twelve words. Adopting it changes how a deck author WRITES the slide, not just how it is laid out, which is the largest cost of any candidate here.',
  },
  {
    id: 'wide-rail',
    section: 'The wide fixture',
    label: '5 · Wide · CaptionRail',
    element: <CaptionRail {...PUSH_DENIED} lesson={FOOTER} />,
    notes:
      'THE WIDE FIXTURE, session 6 slide 21. The refusal line is 96 monospace characters and needs about 900px at fontSize 14. This is the only candidate that can give it that, and it does so without a hand-written width: the figure takes the well and the shared 980px cap. The session slide carries no points, so the rail is absent and this is a full-width figure with a caption, which is the honest rendering of that content.',
  },
  {
    id: 'wide-split',
    section: 'The wide fixture',
    label: '6 · Wide · SplitWell',
    element: <SplitWell {...PUSH_DENIED} lesson={FOOTER} />,
    notes:
      'THE SAME CONTENT THROUGH THE COLUMN CANDIDATES, SO THE FAILURE IS VISIBLE RATHER THAN DESCRIBED. Two defects at once. ONE: 546px of column against a line that needs 900. Terminal carries whitespace-pre-wrap and break-words, so it does not shear the line, it BREAKS IT MID-TOKEN: docker.io/library/nxttrendz-backend] renders as nxttrendz- then backend]. A learner reading a broken image name off the projector retypes a broken image name, which is worse than a clip, and the extra line makes the panel 46px taller than the slide budgeted for. align-check reports it as WRAPPED. TWO: this slide has no points, so the left half is empty — the exact defect measured on 4 of the 51 session 6 slides. FigureLede fails the same way with 636px. A candidate that only works for a small figure is a finding, and this is the slide that proves it.',
  },
  {
    id: 'stress-one',
    section: 'The datum under stress',
    label: '7 · One point · SplitWell',
    element: <SplitWell {...ONE_POINT} lesson={FOOTER} />,
    notes:
      'THE SHARED-EDGE TEST, HALF ONE. One point. The terminal\'s top edge and the bullet\'s are the same y here and on slide 10, which is the property being tested: delta 0 at both extremes. The BLOCK is at a different y on the two slides, and that is correct rather than a failure — it is centred in the well and a five-point block is taller. Two separate properties, and only the first is about the columns. WHAT THIS SLIDE COSTS: the block is centred, so a one-point slide has 146px of empty well above it and 139px below, and the content floats away from the lead that introduces it. That is the price of centring on a thin slide, and it is recorded rather than fixed.',
  },
  {
    id: 'stress-five',
    section: 'The datum under stress',
    label: '8 · Five points · SplitWell',
    element: <SplitWell {...FIVE_POINTS} lesson={FOOTER} />,
    notes:
      'THE DATUM TEST, HALF TWO. Five points, so the prose column is now more than twice the height of the figure, and the figure has not moved. That is the whole claim of this lab in one pair of slides. The three extra points are session 6\'s own, from slide 49. WHAT THIS SLIDE COSTS: at five bullets the prose column reaches y=632 and there is no room for a caption under the figure, so the layout is full rather than comfortable.',
  },
  {
    id: 'stress-five-lede',
    section: 'The datum under stress',
    label: '9 · Five points · FigureLede',
    element: <FigureLede {...FIVE_POINTS} lesson={FOOTER} />,
    notes:
      'THE SAME STRESS THROUGH THE ONE CANDIDATE THAT TRADES THE SHARED EDGE AWAY. FigureLede centres the figure in its own cell on purpose, and that cell is as tall as the PROSE, so as the prose grows the figure slides down away from it: delta 15px at two points on slide 4, 142px here. A DOCUMENTED trade rather than an accidental one, and this slide is what a human is agreeing to if they pick it. It is also the clamp\'s proof: this is the tallest block in the gallery at 437px against a 432px allowance, so it pins to y=224 and overflows DOWNWARD only. Under justify-center the same block sat at y=222, three pixels inside the instructor-video reserve. The other three candidates hold the shared edge here.',
  },
  {
    id: 'datum-alt',
    section: 'The alternative',
    label: '10 · CaptionRail on the header datum',
    element: <CaptionRailDatum {...LOGIN} lesson={FOOTER} />,
    notes:
      'THE ANSWER TO THE TWO-LEFT-EDGES PROBLEM, PUT BESIDE THE OTHER ANSWER RATHER THAN ARGUED ABOUT. Compare against slide 6, the same candidate with the width cap on. There the figure is centred in the well at 86px either side, 0px skew, and its left edge is x=150 while the kicker, title and lead all start at x=64: the slide has two left edges. Here the cap is released, so the figure spans the well, its left edge IS the datum, and it is still 0px skew because the well is symmetrical. Better on both of the measures that were asked for. THE COST, and it is the reason this is not the default: 1152px here against 980px on the three column candidates is two figure widths in one deck, which is the defect that produced session 6\'s five hand-written wrappers. Centred-in-the-well and one-width-token cannot both be satisfied by a full-width candidate, and which of the two outranks the other is the decision.',
  },
  {
    id: 'thankyou',
    label: 'Thank you',
    element: <ThankYouSlide lesson={FOOTER} />,
    notes:
      'Closing fixture. THE DECISION IS OPEN: no candidate has been chosen, and this lab\'s CLAUDE.md says what each is worst at so a human can pick.',
  },
]
