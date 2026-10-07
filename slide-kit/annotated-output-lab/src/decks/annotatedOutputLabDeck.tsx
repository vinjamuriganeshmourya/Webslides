import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, ContentSlide, ThankYouSlide } from '@/slides'
import { Terminal } from '@/ui'
import { BracedRun } from '@/ui/BracedRun'
import { CountBadge } from '@/ui/CountBadge'
import { TwoEnclosures } from '@/ui/TwoEnclosures'
import { GutterMarks } from '@/ui/GutterMarks'
import { CalloutLines } from '@/ui/CalloutLines'
import { FIGURE_VIDEO_GUARD, type OutputNode } from '@/ui/annotatedOutput'

/**
 * ANNOTATED OUTPUT LAB
 *
 * Five candidates for annotating a terminal panel's output, each rendering the
 * SAME fixture, so the only variable between slides is the drawing.
 * `comparison-lab` and `flow-lab` established that pattern and it is what makes
 * choosing cheap.
 *
 * THE GALLERY IS IN TWO HALVES, AND THE ORDER IS THE ARGUMENT.
 *
 * Slides 3 to 5 annotate IN PLACE, with a box around the lines that belong
 * together. That is the reviewer's direction: *"it better highlight as box
 * included the required content instead of doing from the end."*
 *
 * Slides 6 and 7 annotate FROM THE OUTSIDE — a numbered legend under the panel,
 * and leader lines out to margin captions. They were ruled against on that
 * ground, not on how they look, and they stay in the gallery because a lab that
 * shows only the winner cannot explain the choice.
 *
 * THE FIXTURE IS QUOTED, NOT INVENTED. It is session 6 slide 29 `c3-push`
 * verbatim, and the claim annotating it is session 6 slide 30
 * `c3-layers-travel` verbatim. Slide 30's lead reads *"Read the panel again and
 * count the lines between the first and the last"* and there is NO PANEL ON
 * THAT SLIDE: three bullets sit alone in an otherwise empty frame, and the room
 * is told to read something that is not on screen. That is the defect this lab
 * exists to fix, so the fixture has to be the output that slide is talking
 * about. A fixture invented for the lab would be judged on how well it suits
 * the lab.
 *
 * NOTHING WAS ADDED TO THE OUTPUT. Seven lines, exactly the seven the session
 * ships. Where a candidate wants more output than that to look good, that is a
 * finding against the candidate.
 */

export const annotatedOutputLabMeta: DeckMeta = {
  title: 'Annotated Output Variants',
  course: 'Kit lab',
  lesson: 'Annotated Output Variants',
  presenter: 'NxtWave',
}

const FOOTER = 'Annotated Output Variants'

/** Session 6's own constants, so the transcript reads as the session's. */
const REPO = 'ravi123/nxttrendz-backend'
const AT_ROOT = 'C:\\nxttrendz'

/*
  THE FIXTURE, WRITTEN ONCE, AS ONE TREE.

  There is no `annotations: [{ lineIndex, text }]` array anywhere, on purpose: a
  line index is the drift `SyntaxBreakdown`'s header records, only worse, because
  inserting one line of real output silently moves every annotation below it and
  nothing errors. A note is a field ON its line, and a run OWNS the lines it
  spans.

  THE `Mounted from` LINE IS AN `exception`, NOT A MEMBER. All four middle lines
  are layers and the room counts four, but `Mounted from library/python` means
  that layer was NOT uploaded: Docker found it already on the registry and
  reused it. So a brace around all four labelled "the layers that travelled", or
  a badge reading "4 layers pushed", is a figure that lies. Every derived count
  in this lab comes from the members, so a candidate can only get this wrong by
  ignoring the field.
*/
const FIXTURE: OutputNode[] = [
  { text: `docker push ${REPO}:v1`, kind: 'cmd' },
  { text: `The push refers to repository [docker.io/${REPO}]`, kind: 'out' },
  {
    label: 'Pushed, once per layer',
    unit: 'layers',
    lines: [
      { text: '5f70bf18a086: Pushed' },
      { text: 'a3ed95caeb02: Pushed' },
      { text: '92a4b8a3e10c: Pushed' },
      {
        text: 'b7f7d2967507: Mounted from library/python',
        role: 'exception',
        exceptionNote: 'Not uploaded, already on Hub',
      },
    ],
  },
  {
    text: 'v1: digest: sha256:9b7e3a... size: 1573',
    kind: 'ok',
    note: 'One digest for the whole image',
  },
]

/*
  THE SAME OUTPUT WITH THE SMALLEST ANNOTATION SET THE CONTRACT ALLOWS: the run
  and nothing else. It exists for the datum slide, and it is the check the
  coordinator asked for -- if the panel moves relative to the lead between this
  and `FIXTURE`, the figure's position is a by-product of how much apparatus
  happens to hang off it, which is the defect these labs exist to fix.
*/
const FIXTURE_SHORT: OutputNode[] = [
  { text: `docker push ${REPO}:v1`, kind: 'cmd' },
  { text: `The push refers to repository [docker.io/${REPO}]`, kind: 'out' },
  {
    label: 'Pushed, once per layer',
    unit: 'layers',
    lines: [
      { text: '5f70bf18a086: Pushed' },
      { text: 'a3ed95caeb02: Pushed' },
      { text: '92a4b8a3e10c: Pushed' },
      { text: 'b7f7d2967507: Mounted from library/python', role: 'exception' },
    ],
  },
  { text: 'v1: digest: sha256:9b7e3a... size: 1573', kind: 'ok' },
]

const CAPTION = 'An image is layers, and each layer travels on its own'

export const annotatedOutputLabDeck: SlideDef[] = [
  {
    id: 'brand',
    label: 'Brand',
    transition: 'fade',
    element: <BrandSlide greeting="Annotated output lab" lesson={FOOTER} />,
    notes:
      'Five candidates for annotating terminal output, all on the same seven real lines. Slide 2 is the incumbent: the panel the kit can draw today, with no way to name anything in it. Judge every candidate against that rather than against an idea of what good looks like.',
  },
  {
    id: 'incumbent',
    section: 'The incumbent',
    label: '0 · Terminal, unannotated',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="The incumbent"
        title="Terminal"
        lead="Everything the kit can say about this output today"
      >
        {/* The incumbent takes `lines: { text, kind }[]`: four colours and no
            way to mark, number, bracket or annotate a line. Two of the three
            things slide 30 claims are about a GROUP of lines, and the type has
            no notion of a group. That is the fault, visible in the props
            before anything renders. */}
        {/* THE SAME PLACEMENT AS EVERY CANDIDATE: content-height, so
            `ContentSlide`'s well centres it, with the same video guard as
            equal padding. A screenshot diff against a candidate then shows only
            the annotation. */}
        <div
          className="mx-auto w-full max-w-[1000px]"
          style={{ paddingTop: FIGURE_VIDEO_GUARD, paddingBottom: FIGURE_VIDEO_GUARD }}
        >
          <Terminal
            path={AT_ROOT}
            fontSize={14}
            lines={[
              { text: `docker push ${REPO}:v1`, kind: 'cmd' },
              { text: `The push refers to repository [docker.io/${REPO}]`, kind: 'out' },
              { text: '5f70bf18a086: Pushed', kind: 'out' },
              { text: 'a3ed95caeb02: Pushed', kind: 'out' },
              { text: '92a4b8a3e10c: Pushed', kind: 'out' },
              { text: 'b7f7d2967507: Mounted from library/python', kind: 'out' },
              { text: 'v1: digest: sha256:9b7e3a... size: 1573', kind: 'ok' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'THE PROBLEM, AND IT IS TWO PROBLEMS. ONE: session 6 slide 30 says "read the panel again and count the lines between the first and the last" and there is no panel on that slide, because there was no way to put an annotated one there. Three bullets sit alone in an empty frame and the room is told to read something that is not on screen. TWO: PEDAGOGY_GUIDELINES section 5 requires 01/02/03 callouts paired to lines and records 25 occurrences of it in the corpus, and there is no component, so every deck that needs it skips it or hand-rolls markup. Note also what this panel cannot say about the fourth middle line: Mounted from means that layer was NOT uploaded, and nothing here separates it from the three above it.',
  },
  {
    id: 'braced',
    section: 'Enclosure candidates',
    label: '1 · BracedRun',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Candidate 1"
        title="BracedRun"
        lead="One box around the lines that belong together"
      >
        <BracedRun path={AT_ROOT} nodes={FIXTURE} caption={CAPTION} />
      </ContentSlide>
    ),
    notes:
      'THE PRIMARY DIRECTION. The claim is about a GROUP -- "count the lines between the first and the last" -- and a box is the only form that states a group with no pairing work: the lines inside it are the ones being talked about, and that reads before a single word does. Note where the box STOPS. It spans the three Pushed lines and not the Mounted from line below, because that layer was not uploaded, and that exclusion is stated in geometry rather than in prose. A legend can only assert it in words and hope the room maps it back to the right line. WORST AT: saying the number. It groups the lines and names the group and then still asks the room to count them. It also says nothing about the line it excludes.',
  },
  {
    id: 'count',
    section: 'Enclosure candidates',
    label: '2 · CountBadge',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Candidate 2"
        title="CountBadge"
        lead="The same box, carrying the one number the lead asks for"
      >
        <CountBadge path={AT_ROOT} nodes={FIXTURE} caption={CAPTION} />
      </ContentSlide>
    ),
    notes:
      'THE ENCLOSURE WITH THE COUNT ON ITS EDGE, and the most direct answer to the slide that fails today. The box says which lines to count, the pill says what the count comes to, and both sit inside the panel. The number is counted from the run members and never passed in, so it cannot go stale when a line of real output is added. Three is true only because Mounted from is outside the box: a box round all four with a pill reading 3 layers would be a figure arguing with itself. WORST AT: saying WHY that fourth line is out. It sits immediately below the box with nothing on it, so a learner who notices the gap has to be told out loud and one who does not reads four layers under a pill that says three.',
  },
  {
    id: 'two',
    section: 'Enclosure candidates',
    label: '3 · TwoEnclosures',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Candidate 3"
        title="TwoEnclosures"
        lead="Two boxes, in two colours, in one panel"
      >
        <TwoEnclosures path={AT_ROOT} nodes={FIXTURE} caption={CAPTION} />
      </ContentSlide>
    ),
    notes:
      'THE ONLY CANDIDATE THAT NAMES BOTH GROUPS. Two boxes means two colours, per the reviewer: "use different colors if multiple highlight in a single." THE COLOURS ARE NON-VERDICT ON PURPOSE and this is the decision worth stating out loud in the room: green means works, amber means careful, red means fails, and Mounted from is none of those. That layer was not uploaded because the registry already held it, which is the layer system paying off, so amber would tell the room to worry about the best thing on the slide. The tones are brand blue and teal. Colour is also not the only difference: the second box is dashed and both boxes carry their own label, so the two groups survive greyscale and a colour-blind viewer. WORST AT: weight. It is two claims on one panel, and content rules say one idea per slide. Session 6 splits these two claims across c3-layers-travel and c3-mounted-from on purpose, so this is the right figure for a recap and the wrong one for that pair.',
  },
  {
    id: 'gutter',
    section: 'Ruled against',
    label: '4 · GutterMarks',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Ruled against"
        title="GutterMarks"
        lead="A numbered gutter beside the lines, and the same numbers in a legend"
      >
        <GutterMarks path={AT_ROOT} nodes={FIXTURE} caption={CAPTION} />
      </ContentSlide>
    ),
    notes:
      'RULED AGAINST ON GROUNDS, NOT ON LOOKS. It annotates from the outside: the eye leaves the output, reads a legend, and carries the label back. It is also the literal reading of PEDAGOGY_GUIDELINES section 5, which asks for 01/02/03 callouts paired to lines and records the corpus doing it 25 times, so this slide is where the lab DEPARTS from a written guideline and the CLAUDE.md flags the departure for a human to settle. WORST AT: a run. The gutter is line-oriented, so the three Pushed lines each take a number and the legend then has to collapse them back into one entry reading 01-03, which is the figure undoing its own work. Its best case is the opposite of this fixture: several lines that each say something DIFFERENT.',
  },
  {
    id: 'callouts',
    section: 'Ruled against',
    label: '5 · CalloutLines',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Ruled against"
        title="CalloutLines"
        lead="Leaders from the lines out to captions in the margin"
      >
        <CalloutLines path={AT_ROOT} nodes={FIXTURE} caption={CAPTION} />
      </ContentSlide>
    ),
    notes:
      'ALSO RULED AGAINST FOR ANNOTATING FROM THE END, and it is the clearest illustration of why. Every leader is three real DOM elements rather than an SVG path, per content rule 17. But look at the leader for the run: captions are packed bottom-up with a minimum gap because output lines are 23px apart and a legible caption is 44px tall, so the leader has to travel most of the panel height before it reaches its line, and the eye stops being able to follow it. WORST AT: density, visible on this very slide at only three callouts. Also worst at a run, which it can only attach to one representative member, so it says "these three" in words where a box says it in geometry.',
  },
  {
    id: 'datum',
    section: 'Checks',
    label: '6 · Short annotation set',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Checks"
        title="GutterMarks"
        lead="A numbered gutter beside the lines, and the same numbers in a legend"
      >
        {/* THE HEIGHT SENSITIVITY CHECK, and it used to be a datum check.
            Same candidate, same lead, same seven lines, and the SMALLEST
            annotation set the contract allows: one run, no exception note, no
            note on the digest line. The legend loses an entry, so the composite
            loses height, and under CENTRING the panel therefore moves DOWN by
            half of what the legend lost. That is the cost of centring and it is
            the number to know: a candidate's panel position is a function of how
            much apparatus hangs off it. The enclosure candidates are immune,
            because their annotation is inside the panel and adds no height. */
        }
        <GutterMarks path={AT_ROOT} nodes={FIXTURE_SHORT} caption={CAPTION} />
      </ContentSlide>
    ),
    notes:
      'NOT A CANDIDATE. Hold this slide and slide 6 side by side: same component, same lead, one annotation instead of three. The composite is shorter here, and because ContentSlide centres its body well the panel moves DOWN by half the height the legend lost. That is the trade the reviewer accepted in asking for centring rather than a fixed top datum: a centred figure sits in the middle of the well, so its panel position depends on its own total height. The enclosure candidates do not have the problem at all, because a box drawn inside the panel adds neither width nor height. Point a screenshot diff at this slide and slide 6 whenever a candidate changes.',
  },
  {
    id: 'chrome',
    section: 'Checks',
    label: '7 · The other chrome',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Checks"
        title="CountBadge"
        lead="The same box, on a standalone PowerShell window"
      >
        {/* THE CHROME CHECK. `Terminal` draws two windows: the VS Code
            integrated panel, and a standalone PowerShell window with a title
            bar. Their HEADERS are different heights, so a box positioned from
            the panel's top would land on the wrong lines here. Every candidate
            measures from the panel's BOTTOM edge instead, which is identical in
            both chromes, and this slide is the proof: the box must still sit on
            the three `Pushed` lines. */}
        <CountBadge path={AT_ROOT} nodes={FIXTURE} chrome="powershell" caption={CAPTION} />
      </ContentSlide>
    ),
    notes:
      'NOT A CANDIDATE. Annotation is an ADDITION to the panel, never a replacement for it, so both of the kit chromes have to keep working: a slide that says "Administrator PowerShell" while drawing VS Code\'s panel is telling the room two different things. The two chromes have different header heights, which is why the geometry in annotatedOutput.ts measures every box from the panel\'s BOTTOM edge. If the box on this slide is not on the three Pushed lines, that assumption has broken.',
  },
  {
    id: 'thankyou',
    label: 'Thank you',
    element: <ThankYouSlide lesson={FOOTER} />,
    notes:
      'Closing fixture. The decision is OPEN: a human picks. Whatever wins, its "worst at" row goes into slide-kit/slide-types/README.md alongside its registry entry, and the runners-up stay in this lab as the record of what was considered.',
  },
]
