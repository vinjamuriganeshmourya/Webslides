import type { DeckMeta, SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'
import { Cast, SpotCards, SpotIcon, SpotPoints, SpotSteps } from '@/ui/spot'

/**
 * SPOT ICONS AND CAST — five slides, not a session.
 *
 * WHAT THIS DECK IS FOR
 *
 * `assets/` at the repo root took a 302-file Figma drop of icons and
 * illustrations, and its README says plainly that nothing there is tagged and
 * nothing there should be referenced by a deck. These five slides are the first
 * use of the 21 files that survived being looked at and were promoted into
 * `slide-kit/assets/spot` and `slide-kit/assets/cast`.
 *
 * It is a usage sample rather than a variant lab. The siblings in this folder
 * render one fixture through several designs to pick a winner; this one renders
 * one piece of teaching content at the FIVE SCALES the artwork is used at, which
 * is the thing that actually has to be judged about a raster asset set.
 *
 *   slide 1   a cast figure at 260px, beside a text column
 *   slide 2   spot icons at 92px, as the mark on a card
 *   slide 3   one spot icon at 300px, carrying the frame on its own
 *   slide 4   spot icons at 78px, as the nodes of a sequence
 *   slide 5   spot icons at 56px, as bullet markers, with a cast figure beside them
 *
 * THE CONTENT IS REAL, WHICH IS NOT A DETAIL
 *
 * "Reading an error message" is a thing the Python course teaches, and every
 * claim on these slides is one that would be defended. Placeholder copy was the
 * obvious shortcut and it is the wrong one here: hard content rule 8 says an
 * illustration depicts the SLIDE'S OWN concept rather than the topic, and that
 * rule cannot be tested against lorem ipsum. With real claims it can, and the
 * test is the point of the sample.
 *
 * Every icon below is checked against its `means` list in `spotAssets.ts`. The
 * registry is the argument; this deck is the evidence.
 *
 * ONE ICON MEANS ONE THING, SO REUSE IS CORRECT AND VARIETY IS NOT A GOAL
 *
 * `code-window` is the mark for "the line of code" on slide 2 and the whole
 * figure on slide 3, and it is the same file both times on purpose. A deck that
 * reaches for a different picture of code each time it mentions code has taught
 * the room that the pictures mean nothing. The temptation is strongest in a
 * sample like this one, where showing range looks like the job.
 */

export const labDeck: SlideDef[] = [
  {
    id: 's1-cast-hero',
    label: '1 · Cast beside a column',
    section: 'Five scales',
    notes:
      'A CAST FIGURE AT 260px, WHICH IS THE LARGEST THING ON THE FRAME AND IS NOT THE POINT OF IT. `ContentSlide` gives a slide with both points and children a 1.4fr / 1fr split, so the claims get 648px and the figure gets 463, and the figure is drawn at 260 inside that: it has air around it because a cutout pressed against its own column edge reads as a sticker. NOTHING IS DRAWN BEHIND IT. The kit has been here already: `QuizTimeSlide` used to carry a pale blue disc behind its character and its own note records why it went, which is that the disc read as a plate the art had been dropped onto. Same artwork family, same answer. The figure is also on a LIGHT ground, from the same component\'s other finding: these are drawn in the deck\'s own brand blue, so on the navy stage the clothing sinks and the figure reads as a silhouette with a yellow hood. `hoodie-thinking` is honest for this slide by its `means` row: not knowing what went wrong. It would be dishonest on a slide about the error\'s structure, which is why slide 2 has no person on it.',
    element: (
      <ContentSlide
        kicker="Reading an error"
        title="The screen went red"
        lead="Python prints the whole route it took to the failure, and one line of it is about your mistake."
        points={[
          'Thirty lines of output, and twenty-eight of them are inside Python itself',
          'The room reads from the top, because that is what reading means everywhere else',
        ]}
      >
        <Cast name="hoodie-thinking" size={260} />
      </ContentSlide>
    ),
  },
  {
    id: 's2-spot-cards',
    label: '2 · Icons as card marks',
    section: 'Five scales',
    notes:
      'SPOT ICONS AT 92px, WHICH IS THE SIZE THE SET IS ACTUALLY FOR. Four cards across the 1152px well on a 20px gap is 273 each, and `p-6` leaves 225 inside, so a 92px icon takes 41% of the card\'s width and still leaves a readable measure under it. Five cards is 214 each and the icon is over half the inner width, which is why `SpotCards` caps at four and says so. THE ICON SITS ABOVE THE TITLE, WHICH IS THE OPPOSITE OF THE KIT\'S `Card`. A line icon in a 48px well beside a heading is the same visual weight as the heading and the two read as one line; a 92px modelled object beside a heading is three times its weight and turns the heading into its caption. EVERY ONE OF THE FOUR IS CHECKED AGAINST ITS `means` ROW: a red triangle for the error type is the set\'s only `danger` asset and this is the one slide where red is earned, because the thing it labels genuinely is the failure; blue document sheets for the file; the editor window for the line; the magnifier over a beetle for the trail you follow to find the cause. None of the four is a cog, which is the usual outcome when a fourth honest icon cannot be found.',
    element: (
      <ContentSlide
        kicker="Reading an error"
        title="Four things the traceback names"
        lead="They arrive in the same order every time, which is what makes a long traceback readable rather than long."
      >
        <SpotCards
          items={[
            {
              icon: 'alert-triangle-red',
              title: 'The type',
              body: 'ZeroDivisionError, IndexError, NameError. A real Python name, and one you can search for',
            },
            {
              icon: 'file-stack',
              title: 'The file',
              body: 'Which file each step came from, so you can tell your own code from a library you installed',
            },
            {
              icon: 'code-window',
              title: 'The line',
              body: 'A line number, and the line itself printed underneath so you do not have to go and look',
            },
            {
              icon: 'bug-magnifier',
              title: 'The trail',
              body: 'Every call that led there, oldest at the top, so the last one is the one that broke',
            },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 's3-spot-hero',
    label: '3 · One icon carrying a frame',
    section: 'Five scales',
    notes:
      'ONE SPOT ICON AT 300px, AND IT IS THE CEILING TEST FOR THE WHOLE SET. `code-window` exports at 380px wide, so 300 is inside its intrinsic size and stays sharp; `SpotIcon` would have clamped anything past 380 and logged it. THAT CEILING IS THE MOST USEFUL FINDING ABOUT THIS ASSET SET: the largest file promoted is `tools-wrench-driver` at 386px, which is a third of the content well, so THERE IS NO ASSET HERE BIG ENOUGH TO BE A FULL-FRAME FIGURE. If a deck wants one it gets re-exported from Figma larger, and no amount of CSS fixes it. `ground="glow"` is on here and nowhere else at this scale: a soft radial wash, no edge, 1.5x the icon\'s width, so a dark object on a pale blue ground sits in something rather than on it. It is not a `GlyphWell` and must not become one. A tinted square behind a modelled object that already has its own edge and its own shadow is a box inside a box, which is the first thing that goes wrong when line-icon habits are carried over to raster art. SAME FILE AS SLIDE 2\'s third card, on purpose: one icon means one thing across a deck.',
    element: (
      <ContentSlide
        kicker="Reading an error"
        title="Read it from the bottom"
        points={[
          'The last line is the error itself, and it is the only line you have to understand',
          'Walk upward until you reach a file with your own name on it',
          'Everything above that is Python calling Python, and your mistake is not in there',
        ]}
      >
        <SpotIcon name="code-window" size={300} ground="glow" />
      </ContentSlide>
    ),
  },
  {
    id: 's4-spot-steps',
    label: '4 · Icons as sequence nodes',
    section: 'Five scales',
    notes:
      'SPOT ICONS AT 78px, AND THE DIFFERENCE FROM SLIDE 2 IS NOT THE SIZE, IT IS THE CONNECTOR. Four cards are a SET and their order is the author\'s; four nodes joined by a line are a SEQUENCE and their order is the content. Nothing else available to a slide states that as cheaply, and it is the reason this arrangement exists rather than being four narrower cards. NO BOX AROUND EACH NODE. A card round each one turns the sequence back into a set with a line drawn between them, and the eye reads four boxes rather than one path. The icon is the node. The connector DRAWS ITSELF one segment at a time, interleaved with the nodes, so the figure assembles along the path instead of appearing and then being joined up; `scaleX` from the left rather than an animated width, because width is a layout property and would re-lay-out the row every frame. IT IS A PLAIN RULE AND NOT AN ARROWHEAD: at this scale an arrowhead is four or five pixels of ink that reads as a smudge on a projector, and the direction is already carried by the order the segments draw in. All four icons are honest at their `means` rows, and the fourth is the one worth defending: hands on a keyboard for "run it again" says the learner does it themselves, which a spinner would not.',
    element: (
      <ContentSlide
        kicker="Reading an error"
        title="The loop you will run a hundred times"
        lead="Read, locate, change one thing, run it again. The fourth step is the one people skip."
      >
        <SpotSteps
          steps={[
            {
              icon: 'bug-magnifier',
              label: 'Read',
              note: 'Start at the last line and name the error out loud',
            },
            {
              icon: 'folder-search',
              label: 'Locate',
              note: 'Find your own file in the trail above it',
            },
            {
              icon: 'tools-wrench-driver',
              label: 'Change',
              note: 'Edit one thing, not three',
            },
            {
              icon: 'keyboard-hands',
              label: 'Run',
              note: 'Run it again before you touch anything else',
            },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 's5-spot-points',
    label: '5 · Icons as bullet markers',
    section: 'Five scales',
    notes:
      'SPOT ICONS AT 56px, THE SMALLEST USE AND THE ONE WITH THE STRICTEST RULE ON IT. At this size the icon is read as a MARKER rather than as a picture: the room takes it in without looking at it, which means an icon that does not depict its own claim is never caught, by them or in review. Hard content rule 8 is hardest to keep here and easiest to break, and the three below are chosen against their `means` rows one at a time. The gutter is fixed at 56 plus a 20px gap, so every claim starts at the same x and the prose is a column the eye can run down; the icons are TOP-ALIGNED to the first line rather than centred on the row, because a two-line claim with a centred icon puts the icon halfway down its own sentence. THE CAST FIGURE TAKES A THIRD AND THE CLAIMS TAKE TWO, which is the right way round: the takeaways are the content and the figure is the company. `student-cheering` is honest here by its own row, something finally worked, and it would be dishonest on any of the four slides before it, where nothing has worked yet. A figure that celebrates on the slide where the room is still stuck is the commonest way this kind of artwork lies.',
    element: (
      <ContentSlide kicker="Reading an error" title="Key takeaways">
        <SpotPoints
          items={[
            {
              icon: 'alert-triangle-red',
              body: 'The last line is the error. Everything above it is the route Python took to get there',
            },
            {
              icon: 'folder-open',
              body: 'Find your own file in the trail. That is where your mistake is, not in the library',
            },
            {
              icon: 'target-arrow',
              body: 'Change one thing, then run it. Two changes and you cannot tell which one worked',
            },
          ]}
          aside={<Cast name="student-cheering" size={250} />}
        />
      </ContentSlide>
    ),
  },
]

export const labDeckMeta: DeckMeta = {
  title: 'Spot Icons and Cast',
  course: 'Slide kit · asset sample',
  lesson: 'Reading an error message',
}
