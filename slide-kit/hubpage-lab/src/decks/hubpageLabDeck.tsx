import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, ContentSlide, ThankYouSlide } from '@/slides'
import { CodeBlock } from '@/ui'
import { RepoPage } from '@/ui/RepoPage'
import { TagLedger } from '@/ui/TagLedger'
import { PullCard } from '@/ui/PullCard'
import { SplitProof } from '@/ui/SplitProof'
import type { RegistryPageProps } from '@/ui/registryPage'

/**
 * REGISTRY PAGE LAB
 *
 * Four candidates for one figure: what a pushed image looks like once it is
 * public on Docker Hub. Deployment session 6 slide 33, `c3-on-the-hub`, is the
 * payoff moment of the whole session and it currently ships as a single browser
 * URL bar on an otherwise empty frame. A URL bar is not a representation of
 * "your image now has a public page that anyone can pull from".
 *
 * WHY THIS IS A DRAWING PROBLEM AND NOT A SCREENSHOT PROBLEM. Session 6 build
 * rule R6: nothing in this session can be captured. Docker Desktop will not run
 * on the capture machine, and this slide additionally needs a real Docker Hub
 * account and a real push, so the capture is impossible rather than merely
 * inconvenient. Everything in that deck is QUOTED or DRAWN.
 *
 * Every candidate takes the identical `RegistryPageProps`, so choosing between
 * them is a rename at the call site. That is `comparison-lab`'s pattern and it
 * is what made choosing there cheap: one fixture, rendered four times, with the
 * drawing as the only variable.
 */

export const hubpageLabMeta: DeckMeta = {
  title: 'Registry Page Variants',
  course: 'Kit lab',
  lesson: 'Registry Page Variants',
  presenter: 'NxtWave',
}

const FOOTER = 'Registry Page Variants'

/*
  THE FIXTURE, WRITTEN ONCE, AND EVERY VALUE TAKEN FROM SESSION 6.

  `ravi123` and `nxttrendz-backend` are `DOCKER_ID` and `IMAGE` from that deck's
  `deckShared.tsx`, so the repository is `ravi123/nxttrendz-backend`. The tag,
  the size, the image ID and the push time are the `docker images` output the
  deck already quotes on `c2-tag-check`:

    ravi123/nxttrendz-backend    v1       3f2a8b91c04d   2 hours ago   156MB

  NOTHING HERE IS INVENTED, AND NOTHING HERE IS OPTIONAL DECORATION. The plan's
  section 6.1 authorises exactly four things for this slide: the repository name,
  a Tags listing giving `v1` with its size and push time, and the `docker pull`
  command Hub displays for copying. `visibility` is the fifth, and it is the word
  the slide is actually about. There is no star count, no pull count and no
  description in the fixture because the plan does not authorise one, and a
  candidate that needs one to look convincing is a finding against that
  candidate.
*/
const FIXTURE: RegistryPageProps = {
  repo: 'ravi123/nxttrendz-backend',
  visibility: 'public',
  url: 'hub.docker.com/r/ravi123/nxttrendz-backend',
  tags: [
    {
      tag: 'v1',
      size: '156MB',
      pushed: '2 hours ago',
      imageId: '3f2a8b91c04d',
      key: true,
    },
  ],
  pullCommand: 'docker pull ravi123/nxttrendz-backend:v1',
  /* `SplitProof` alone reads this: the row from `docker images` on the learner's
     own machine, quoted from the same output. The asymmetry is a finding, and
     the CLAUDE.md records it as that candidate's widest-contract problem. */
  local: {
    repository: 'nxttrendz-backend',
    tag: 'latest',
    imageId: '3f2a8b91c04d',
    created: '2 hours ago',
    size: '156MB',
  },
}

const CAPTION = 'Drawn from the documentation, because this session cannot capture a real Docker Hub account'

/* The points column for the half-width slide. Content rules apply here as they
   do to any deck: no em dashes, no trailing full stops. */
const HALF_POINTS = [
  'The repository is public, so anyone can pull it',
  'One tag on it so far, the v1 you just pushed',
  'The pull command is on the page, ready to copy',
]

/*
  THE SHARED CENTRING RULE.

  Every candidate is VERTICALLY CENTRED in the content well, by this one wrapper,
  and that is the whole of the rule. It replaces a top-anchored datum this lab
  briefly shipped: the review's direction is "in all labs the content is top
  aligned, i want content to be center aligned".

  WHAT IS SHARED IS THE MECHANISM, NOT THE POSITION. The four candidates are
  different heights, so centred they each start at a different y, and the
  gallery's top edge moves from slide to slide. That is accepted, but it costs
  the lab a little of its premise that the only variable between slides is the
  drawing -- so the mechanism is identical for all four and lives in one place.
  Any difference in top edge is then a consequence of the figure's own height and
  of nothing else. The CLAUDE.md carries the measured spread.

  `minHeight` IS 406px, MEASURED AND NOT GUESSED: `flex-1`'s height in
  `ContentSlide` under a two-line lead, read off the live page at 1280x720. With
  `items-center` it is belt and braces rather than a position -- a figure shorter
  than the well centres inside this block and the block centres inside the well,
  which is the same y either way. It is kept because it makes the wrapper's job
  legible and because it pins the horizontal centring line too.

  THE 6px PAD IS THE INSTRUCTOR-VIDEO CLAMP, and it is not decoration.
  `x 913..1280, y 0..220` is reserved absolutely. Centring frees a tall figure to
  move UP, and under a ONE-LINE lead the well's own top is y=217, three pixels
  above that floor -- so a figure tall enough to fill the well would centre itself
  into the rectangle. The pad is on both edges, so centring stays exact inside the
  padded box while the box itself can never begin above y=223. `node
  video-safe.mjs` is the check, and it is the harness this change was most likely
  to break.
*/
const WELL_H = 406
const VIDEO_CLAMP = 6

function Datum({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex w-full items-center justify-center"
      style={{ minHeight: WELL_H, paddingTop: VIDEO_CLAMP, paddingBottom: VIDEO_CLAMP }}
    >
      {children}
    </div>
  )
}

export const hubpageLabDeck: SlideDef[] = [
  {
    id: 'brand',
    label: 'Brand',
    transition: 'fade',
    element: <BrandSlide greeting="Registry page lab" lesson={FOOTER} />,
    notes:
      'Four candidates for session 6 slide 33, all on identical content. Slide 2 is the incumbent, so judge every other slide against it rather than against an idea of what good looks like. THE DECISION IS OPEN: a human picks.',
  },
  {
    id: 'incumbent',
    section: 'The incumbent',
    label: '0 · URL bar',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="The incumbent"
        title="On Docker Hub"
        lead="What session 6 ships today, on the payoff slide of the whole session"
      >
        {/* The incumbent, verbatim from `partC2C3.tsx`: one `CodeBlock` holding
            the address, and nothing else on the frame. */}
        <div className="mx-auto w-full max-w-[760px]">
          <CodeBlock
            code={`hub.docker.com/r/${FIXTURE.repo}`}
            language="url"
            showLineNumbers={false}
            fontSize={20}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'THE FAULTS, and they are the brief for everything after this slide. ONE: an address is not a page. The claim is that the image now has a public page anyone can pull from, and a string of characters shows none of those three things. TWO: it is the payoff moment of the session and it is the emptiest frame in the deck. THREE: it carries none of what the plan section 6.1 authorises, so the slide under-delivers against its own signed-off plan rather than against taste. FOUR: a `CodeBlock` is a FILE view, so the address is set as though it were something you type into a terminal.',
  },
  {
    id: 'repo-page',
    section: 'Candidates',
    label: '1 · RepoPage',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Candidate 1"
        title="RepoPage"
        lead="The fullest answer: a drawn browser view with the Tags table and the copy row"
      >
        <Datum>
          <RepoPage {...FIXTURE} caption={CAPTION} />
        </Datum>
      </ContentSlide>
    ),
    notes:
      'THE FULLEST ANSWER. Draws the page: the address in a labelled field, the repository name with a PUBLIC badge, one tab, the Tags table, and the pull command in a copy row. Two disciplines cut things out of it. Terminal ships two chromes because a slide that says PowerShell while drawing VS Code tells the room two different things, so nothing is drawn here that the room will not see at that address: no invented tab titles, no back arrow, no avatar. And it must read as a DIAGRAM of a page rather than a photograph of one, so it is in the deck palette with no Docker blue and no whale, and the cells the plan does not authorise are visibly absent rather than filled with plausible furniture. WORST AT: half width, where the table and the copy row both give up characters, so it loses information and not just density. Also the most chrome per fact of the four.',
  },
  {
    id: 'tag-ledger',
    section: 'Candidates',
    label: '2 · TagLedger',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Candidate 2"
        title="TagLedger"
        lead="The same facts with the browser frame thrown away, to see whether the frame earns its space"
      >
        <Datum>
          <TagLedger {...FIXTURE} caption={CAPTION} />
        </Datum>
      </ContentSlide>
    ),
    notes:
      'THE CONTROL. A browser frame is about 90px of vertical chrome carrying one fact, that this is reached through a browser, and the lead sentence carries that fact for free. So this keeps everything section 6.1 authorises and drops the window. It is also the honest baseline: with no window there is nothing to mistake for a screenshot, so if the room reads this as well as it reads RepoPage then the window was decoration and the decoration was the risky part. Note it deliberately does NOT draw the address: a URL pinned to a panel with no window claims a page without showing one. WORST AT: the word page. The claim is that the image now HAS a page, and a ledger shows the contents of a page without showing that it is one. Also the flattest reading of the payoff: the room has read several tables by this point in the session.',
  },
  {
    id: 'pull-card',
    section: 'Candidates',
    label: '3 · PullCard',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Candidate 3"
        title="PullCard"
        lead="The command as the hero, and the repository demoted to its supporting line"
      >
        <Datum>
          <PullCard {...FIXTURE} caption={CAPTION} />
        </Datum>
      </ContentSlide>
    ),
    notes:
      'THE REFUSAL. It asks whether the room needs the page at all. What changed when the push finished is that ONE LINE now works on any machine, so that line is set at hero scale on the deck’s own navy code register and the repository, tag, size and push time drop underneath it. It is the only candidate with no table, so it is the only one that cannot be misread as a screenshot. The PUBLIC badge is load-bearing: docker pull on a private repository fails for everyone but its owner, so the command working and the repository being public are one claim. WORST AT: the word visible. The slide sits under the middle box of the target picture, which the deck has drawn twice as a PLACE things live, and a command is not a place. Also more than one tag, and it is the candidate most likely to duplicate the next slide, c3-pull, which runs this exact command in a terminal.',
  },
  {
    id: 'split-proof',
    section: 'Candidates',
    label: '4 · SplitProof',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Candidate 4"
        title="SplitProof"
        lead="Not a page but a correspondence: the thing on your laptop is now also here"
      >
        <Datum>
          <SplitProof {...FIXTURE} caption={CAPTION} />
        </Datum>
      </ContentSlide>
    ),
    notes:
      'THE ONLY ONE WHERE THE DRAWING MAKES THE CLAIM. The other three arrange facts the lead has already asserted; this one argues that the image on the laptop and the image on Hub are the same image, and the twelve shared characters are the join. NOTE WHERE THE ID SITS: in the spine, not in the Hub panel, because Hub shows a digest and not this short ID, so an IMAGE ID cell under a Docker Hub heading would be a figure claiming a page displays something it does not. In the spine the identity is quoted from the docker images output the room already saw. WORST AT: the word public. Its subject is sameness, and sameness is true of a private repository too, so the badge carries the public claim alone against a drawing arguing something else. It also needs the local field no other candidate reads, the widest contract of the four. And at half width it stacks, so the spine turns from a join into a divider.',
  },
  {
    id: 'compact-page',
    section: 'Half width',
    label: '5 · Narrowed: page pair',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Half width"
        title="Narrowed: the two page views"
        lead="The final slide may pair the figure with points, so every candidate has to survive about 460px"
      >
        {/* TWO PER SLIDE, NOT FOUR. The first pass put all four in a 2x2 and it
            overflowed the well AND reached into the instructor-video rectangle,
            which is the kind of fault a triage slide is supposed to reveal
            rather than commit. `compact` is a real prop and not a media query:
            the canvas is a fixed 1280x720 and there are no breakpoints in this
            repo. */}
        <Datum>
          <div className="grid w-full grid-cols-2 items-start gap-x-6">
            <RepoPage {...FIXTURE} compact />
            <TagLedger {...FIXTURE} compact />
          </div>
        </Datum>
      </ContentSlide>
    ),
    notes:
      'Read this for information LOST, not for prettiness. RepoPage keeps every cell but the address truncates and the table columns tighten until the pushed time is the only thing with room to spare, so it survives narrowing at the cost of the one element that carries its browser claim. TagLedger loses nothing at all, which is expected: it had no chrome to give up.',
  },
  {
    id: 'compact-other',
    section: 'Half width',
    label: '6 · Narrowed: the other two',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Half width"
        title="Narrowed: command and correspondence"
        lead="The same width again, for the two candidates that are not page views"
      >
        <Datum>
          <div className="grid w-full grid-cols-2 items-start gap-x-6">
            <PullCard {...FIXTURE} compact />
            <SplitProof {...FIXTURE} compact />
          </div>
        </Datum>
      </ContentSlide>
    ),
    notes:
      'PullCard narrows better than anything else here, because a single line of monospace only has to get smaller. SplitProof is the one that BREAKS: at this width it stacks, and stacked the spine stops being a join between two things and becomes a divider between two lists, so the figure loses the only argument it was making.',
  },
  {
    id: 'half-width',
    section: 'Half width',
    label: '7 · Beside points',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Half width"
        title="Beside a points column"
        lead="What slide 33 would look like if the figure has to share the frame"
        points={HALF_POINTS}
      >
        <PullCard {...FIXTURE} compact />
      </ContentSlide>
    ),
    notes:
      'The real half-width test: ContentSlide gives the prose 1.4fr and the visual 1fr, so the figure gets about 460px and not a true half. PullCard is shown because it is the candidate that loses nothing at that width. TagLedger also survives here and is worth swapping in before deciding, since swapping is a rename. Note the points column repeats in words what RepoPage would have drawn, which is the argument for the wide figure and against this layout.',
  },
  {
    id: 'thankyou',
    label: 'Thank you',
    element: <ThankYouSlide lesson={FOOTER} />,
    notes:
      'THE DECISION IS OPEN. Nothing here is approved. When a human picks one, the choice and what each runner-up was worse at go in this lab’s CLAUDE.md, and the winner is promoted to the kit with its contract in the slide-type registry.',
  },
]
