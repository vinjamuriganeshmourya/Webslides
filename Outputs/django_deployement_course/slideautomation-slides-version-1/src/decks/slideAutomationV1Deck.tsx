import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  ContentNoteSlide,
  ContentSlide,
  FeedbackSlide,
  KeyTakeawaysSlide,
  PracticeSlide,
  QuizTimeSlide,
  SectionBreakerSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import {
  BulletList,
  Callout,
  Card,
  Chip,
  CodeBlock,
  LayerGap,
  LayerStack,
  ContainerJourney,
  MachineBoundary,
  Shot,
  Terminal,
} from '@/ui'
import { FanOut, iconByName } from '@/ui'
import { Reveal, RevealGroup } from '@/motion/Reveal'
/* The point-stating family is import-by-path on purpose: a family offers a CHOICE
   between designs for one contract, so choosing should be visible at the import
   line. See `slide-kit/slide-types/README.md`. */
import { PeerCards } from '@/ui/points/PeerCards'
import { RuleStack } from '@/ui/points/RuleStack'
import { colors } from '@/design/tokens'

/**
 * Deployment, Session 1 "Introduction to Docker", **v3**
 *
 * The CONTENT is v2's, slide for slide, and it is not reopened here. What v3
 * changes is the structure, and the plan at
 *   `Web Slides/django_deployement_course/session_plans/deployement_session_1_v3/plan.md`
 * records the four decisions and every deviation made while building it.
 *
 * WHAT V3 FIXED, AND WHY IT NEEDED FIXING
 *
 *   1. **Nine concepts of two to four slides.** v2 shipped four sections, two of
 *      which carried nine and eight slides. Nine slides under one divider is a
 *      chapter, and the room went twenty minutes without a checkpoint.
 *   2. **The Containerization divider was in the middle of its own section.** Five
 *      v2 slides were filed under a divider they appeared BEFORE, which reads as a
 *      mistake in the deck rather than as a section break.
 *   3. **The ids now mean something.** v2 ran `c1`, then `c3` with no `c2`, then
 *      `c4`, `c5` and `c6` interleaved inside one section called Docker, then `c8`
 *      with no `c7`. They were v1's concept numbers, carried through two revamps
 *      of the structure, and the id and the section disagreed on every slide from
 *      nine onward.
 *   4. **Five checkpoints instead of one.** v2's single quiz sat at slide 32.
 *      Every new checkpoint asks something answerable from the three slides before
 *      it, and every question is drawn from material already on those slides.
 *
 * SIX RULES GOVERN THIS FILE, all six inherited from v2 and all six easy to break
 * by accident while editing, so they are restated where they bite:
 *
 *   R1 SCOPE DISCIPLINE. This session is Problem 1 (runs anywhere) only. No
 *      slide shows a server, a globe, a public URL, or inbound traffic.
 *
 *   R2 WINDOWS-FIRST. Every command is PowerShell. macOS and Linux forms appear
 *      alongside, never instead.
 *
 *   R3 PROBLEM 2 IS NAMED, NEVER OPENED. No tool names for it, and no breakdown
 *      into stages, until the hosting sessions. It is also not greyed out on the
 *      two-questions slide: it is a real problem of equal weight, just not today's.
 *
 *   R4 NO SPACED EM DASH in any rendered string, in this file or in any component
 *      it renders. Use a comma, a colon, a full stop, or parentheses.
 *
 *   R5 NO TRAILING FULL STOP on a rendered slide string. Mid-string stops are
 *      fine where a body genuinely runs to two sentences. Speaker notes and
 *      captured terminal output keep their punctuation.
 *
 *   R6 VIDEO BOX RESERVATION. The top-right 367x220 of the 1280x720 canvas is
 *      kept clear for the instructor video. Assert with `node video-safe.mjs`.
 */

export const slideAutomationV1Meta: DeckMeta = {
  title: 'Introduction to Docker',
  course: 'React + Django Integration · Deployment',
  lesson: 'Introduction to Docker',
  presenter: 'NxtWave Instructor',
}

/** Footer text on every slide: the session name, never "Session 1". */
const SESSION = 'Introduction to Docker'

/* ------------------------------------------------------------------ */
/* Shared slide furniture                                              */
/* ------------------------------------------------------------------ */

/**
 * A RUNTIME LAYER, WITH ITS OWN MARK.
 *
 * `Node` and `Python` are the two names this deck repeats most, across the two
 * stack figures and `ContainerJourney`, and as bare words they read as
 * interchangeable boxes. The marks make each one recognisable at a glance from the
 * back of a room, which is the whole job of these figures: the room is meant to
 * see that the SAME two things do or do not travel, not to read four labels.
 *
 * Vendor files, unrecoloured, per the asset rules: the mark stays full colour even
 * inside a red `breaks` box, because that box is about the version being wrong,
 * not about the runtime being a different product.
 */
function RuntimeLabel({ logo, children }: { logo: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      {/*
        THE MARK SITS ON ITS OWN WHITE TILE.

        On slide 18 all three layers are `ships`, so both marks landed on solid
        brand blue: Python's navy-and-yellow and Node's dark green have almost no
        separation from that ground and the logos read as smudges. A white tile
        gives every mark the same light ground it was drawn for, on the blue layers
        and on the grey and red ones alike, so the pair looks identical wherever the
        figure puts them.

        The tile is the fix that keeps the asset rule intact: the marks stay vendor
        files at full colour, unrecoloured. Tinting them white to match the layer
        would have been the other way to solve it, and it is the forbidden one.
      */}
      <span
        className="grid h-5 w-5 shrink-0 place-items-center rounded-md"
        style={{ background: colors.white, boxShadow: `0 1px 2px 0 ${colors.brandDeep}2e` }}
      >
        <img src={logo} alt="" draggable={false} className="h-3.5 w-3.5 object-contain" />
      </span>
      {children}
    </span>
  )
}

const PY_LOGO = '/assets/tech/python.svg'
const NODE_LOGO = '/assets/tech/nodejs.svg'

/**
 * Inline code, for the many `localhost:3000` and `runserver` mentions.
 *
 * The background is a token with an alpha suffix and not the `rgba(11,95,255,0.10)`
 * v2 carried. That literal was the OLD brand blue, so after the palette moved it
 * was a colour from no theme at all, sitting inside a deck file where hard rule 5
 * says no hex may appear.
 */
function Code({ children }: { children: ReactNode }) {
  return (
    <span
      className="rounded-md px-1.5 py-0.5 font-mono"
      style={{ fontSize: '0.9em', background: `${colors.brand}1a`, color: colors.brandDark }}
    >
      {children}
    </span>
  )
}

/**
 * A BOUNDED PANEL FOR A DOMAIN FIGURE.
 *
 * `MachineBoundary`, `ContainerJourney` and the `LayerStack` pairs are all
 * width-filling: `ContainerJourney`'s own root is `justify-between`, so given the
 * full 1060px well it pushes its two machines to the extremes and leaves 560px of
 * nothing between them. On the paired slides the figure ran hard against the right
 * content edge with no defined boundary of its own, so the boxes read as loose
 * pieces dropped on the stage rather than as a figure that belongs to the slide.
 *
 * This gives every one of them the same treatment the lab-derived figures on slides
 * 8, 21, 29 and 40 have by construction: a stated width, centred, on an opaque
 * ground with one border and one soft shadow. Constraining the width is what pulls
 * a `justify-between` figure back together, so the frame is doing real work and not
 * only drawing a box.
 *
 * LOCAL TO THIS DECK ON PURPOSE. It is not a figure, it is a container for other
 * figures, and it carries no argument of its own: the kit's rule is that a figure
 * earns promotion by making an argument a sentence cannot. If a second deck wants
 * the same treatment, the honest promotion is to teach the figures themselves to
 * accept a width, which is what `PeerCards` and `RuleStack` got today.
 */
function FigureFrame({
  width,
  label,
  padTop,
  padBottom,
  children,
}: {
  width?: number
  label?: string
  /**
   * Extra head room, for a figure that paints ABOVE its own box.
   *
   * `ContainerJourney`'s travelling packet is `top-0 -translate-y-1/2` on the lane
   * with its "image" caption at `-top-6`, so the caption renders roughly 114px above
   * the point the lane says is the top. The frame's normal 20px of top padding is no
   * match for that: the caption came out 8px under the frame's own border and level
   * with the frame's label. The three journey slides pass a real number here.
   */
  padTop?: number
  /**
   * Extra foot room, for a figure whose own labels sit ABOVE its boxes.
   *
   * `ContainerJourney` puts a machine's name and its Docker tag in two rows over
   * each panel and nothing at all underneath, so with equal padding the panels
   * came out 142px below the frame's top border and 21px above its bottom one.
   * The figure read as having slipped down inside its own box. Passing the
   * height of those label rows here puts the same air under the panels as the
   * labels take above them.
   */
  padBottom?: number
  children: ReactNode
}) {
  return (
    <div
      /*
        NOT `items-center`, AND THIS COST A RENDER TO FIND.

        Every figure in here is width-filling: `MachineBoundary` sizes its friend's
        browser card at `w-[62%]` and `ContainerJourney` is `justify-between`. As a
        flex child of an `items-center` column each one shrank to its max-content
        width first, so those percentages then resolved against the shrunken box:
        "A friend's browser" wrapped onto two lines inside a frame with 130px of
        space in it and its port label was clipped by the frame's edge.

        So the children stretch, and a figure that must stay tight around itself
        brings its own centring wrapper. Slide 18's dashed unit is the one that does.
      */
      className="mx-auto flex flex-col rounded-card border px-6 py-5 shadow-card-soft"
      style={{
        width,
        paddingTop: padTop,
        paddingBottom: padBottom,
        borderColor: colors.line,
        background: colors.white,
      }}
    >
      {label && (
        <span
          className="mb-4 block text-center text-xs font-bold uppercase tracking-[0.14em]"
          style={{ color: colors.muted }}
        >
          {label}
        </span>
      )}
      <div className="w-full">{children}</div>
    </div>
  )
}

/**
 * TWO VOICES — a conversation drawn as a conversation.
 *
 * WHY THIS EXISTS, AND WHY IT IS NOT `ScenarioCard`
 *
 * Slide 10 is the one slide in this deck whose whole content is two people
 * saying incompatible things and both being right. `ScenarioCard` drew it as a
 * solid brand-blue banner over three equal bordered boxes in a row, and three
 * boxes in a row is the layout for three peer facts. The room could read the
 * words and not see the argument: nothing about the frame said that box one and
 * box two were addressed to each other, or that box three was the consequence.
 *
 * `ChatThread` is the kit's own answer for an exchange, and it is the right one
 * where the exchange is a learner being answered by a mentor: it stacks bubbles
 * with a filled side, which says "this side is the answer". Here neither side is
 * the answer. Both speakers are telling the truth, which is the entire point, so
 * they are drawn as two peers facing each other and the resolution sits under
 * both of them rather than in either one's bubble.
 *
 * THE PEOPLE ARE SILHOUETTES, DELIBERATELY
 *
 * No faces, no hair, no expression. A room of forty people is being asked to
 * recognise ITSELF in one of these two, and a drawn face is a specific person
 * who is not them. Two identical silhouettes in two token hues, each labelled,
 * carry "two people" and nothing else.
 *
 * SESSION-LOCAL, FOR NOW. It is a promotion candidate rather than a promotion:
 * hard rule 14 wants the user's approval before a layout moves into the kit, and
 * the honest kit form of this is the character variant `ChatThread`'s own doc
 * comment already anticipates ("A round initials chip. The character variant
 * swaps this for a figure").
 */
function PersonMark({ color, facing }: { color: string; facing: 'left' | 'right' }) {
  return (
    <svg
      width="104"
      height="124"
      viewBox="0 0 104 124"
      fill="none"
      aria-hidden
      style={{ transform: facing === 'left' ? 'scaleX(-1)' : undefined }}
    >
      {/* the ground shadow, so the figure stands on the slide rather than
          floating over it */}
      <ellipse cx="52" cy="118" rx="30" ry="5" fill={colors.nwNavy} opacity="0.1" />
      <circle cx="52" cy="26" r="21" fill={color} />
      {/* Shoulders, turned slightly toward the person opposite: the leading
          shoulder is 6px further out than the trailing one, which is the whole
          of "facing". */}
      <path d="M14 116V92a38 38 0 0 1 76 0v24Z" fill={color} />
      <path d="M90 116V92a38 38 0 0 0-16-31l8-6a44 44 0 0 1 14 33v28Z" fill={colors.white} opacity="0.22" />
    </svg>
  )
}

function Voice({
  name,
  quote,
  color,
  side,
}: {
  name: string
  quote: string
  color: string
  /** Which side of the slide this speaker stands on. They face the other one. */
  side: 'left' | 'right'
}) {
  return (
    <div className="flex flex-col items-center" style={{ width: 430 }}>
      <div
        className="relative w-full rounded-card border bg-white px-6 py-5"
        style={{ borderColor: colors.line, boxShadow: `0 10px 26px -18px ${colors.nwNavy}59` }}
      >
        <p className="text-center text-body-lg font-medium text-ink">{quote}</p>
        {/*
          THE TAIL POINTS AT THE SPEAKER, which is what makes the box a piece of
          speech rather than a card that happens to be above a drawing. A rotated
          square with two of its four borders showing: the two that are still
          outside the bubble once it is turned 45 degrees.
        */}
        <span
          aria-hidden
          className="absolute h-4 w-4 rotate-45 border-b border-r bg-white"
          style={{ borderColor: colors.line, bottom: -9, left: 'calc(50% - 8px)' }}
        />
      </div>
      {/*
        THE LEAN IS 5 DEGREES, AND IT IS THE WHOLE OF "THEY ARE TALKING TO EACH
        OTHER". Two silhouettes standing square to the room are two portraits
        side by side; leaning each one toward the other turns the pair into an
        exchange, and it costs one static transform and no motion at all.
      */}
      <div
        className="mt-6"
        style={{
          transform: `rotate(${side === 'left' ? 5 : -5}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        <PersonMark color={color} facing={side === 'left' ? 'right' : 'left'} />
      </div>
      <span className="mt-2 text-kicker uppercase" style={{ color }}>
        {name}
      </span>
    </div>
  )
}

function TwoVoices({
  left,
  right,
  resolution,
}: {
  left: { name: string; quote: string }
  right: { name: string; quote: string }
  /** The line that lands under both of them, centred. */
  resolution: string
}) {
  const Bulb = iconByName.bulb
  return (
    <RevealGroup className="flex w-full flex-col items-center" stagger={0.16}>
      <div className="flex w-full items-start justify-center gap-14">
        <Reveal dir="up">
          <Voice name={left.name} quote={left.quote} color={colors.teal} side="left" />
        </Reveal>
        <Reveal dir="up">
          <Voice name={right.name} quote={right.quote} color={colors.brand} side="right" />
        </Reveal>
      </div>
      {/*
        BOTTOM CENTRE, AND UNDER BOTH OF THEM. This line is not a third speaker,
        it is what the room is supposed to conclude from the two above, so it is
        the only centred thing on the slide and it belongs to neither column.
      */}
      <Reveal dir="up" className="mt-7">
        <p
          className="inline-flex items-center gap-2.5 text-body-xl font-semibold"
          style={{ color: colors.ink }}
        >
          <span className="grid h-9 w-9 place-items-center rounded-full" style={{ background: `${colors.accent}24`, color: colors.accentDark }}>
            <Bulb width={19} height={19} />
          </span>
          {resolution}
        </p>
      </Reveal>
    </RevealGroup>
  )
}

/* ------------------------------------------------------------------ */
/* The deck                                                            */
/* ------------------------------------------------------------------ */

export const slideAutomationV1Deck: SlideDef[] = [
  {
    id: 'brand',
    section: 'Opening',
    label: 'Brand',
    element: <BrandSlide greeting="Welcome" lesson={SESSION} />,
    notes: 'Brand only. No session content. The next slide names the session.',
  },
  {
    id: 'welcome',
    section: 'Opening',
    label: 'Welcome',
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
    notes: 'Kicker plus the session name. Nothing else competes with it.',
  },
  {
    id: 'agenda',
    section: 'Opening',
    label: 'Agenda',
    element: (
      <AgendaSlide
        /* The orbit mark carries both lines: the session name small, the word
           Agenda large. There is no separate slide header on this layout. */
        kicker={SESSION}
        title="Agenda"
        lesson={SESSION}
        /*
          FOUR ITEMS, NINE DIVIDERS, AND THAT IS DELIBERATE.

          v2 had four sections and four agenda items, one to one. v3 re-cuts the
          deck into nine concepts of two to four slides, because two of v2's four
          sections carried nine and eight slides and the room got no checkpoint
          for twenty minutes. Nine items on an agenda is a list nobody holds, so
          the agenda stays the four MOVEMENTS and the `sub` names the concepts
          inside each one. The takeaways slide still hands back these same four,
          so the promise made here is the promise kept at the close.
        */
        items={[
          { title: 'Where Your App Lives', sub: 'One application, one machine' },
          { title: 'Containerization', sub: 'It works on my machine · ship the whole unit · different ground' },
          { title: 'Docker', sub: 'The tool · images and containers · the kernel it borrows' },
          { title: 'Installing Docker', sub: 'Install · start · prove it works' },
        ]}
      />
    ),
    notes:
      'Four items, and item two is the answer. Naming containerization up front is fine: item one is what makes you want it.',
  },
  {
    id: 'c1-divider',
    section: 'Where Your App Lives',
    label: '01 Divider',
    element: (
      // No illustration: the kit's scenes all belong to the Client and Server
      // session and none depicts this concept. Placing an unrelated one to fill
      // space is forbidden by the style guide, so this divider stays typographic
      // until a topic-specific illustration is built.
      <SectionBreakerSlide
        index={1}
        title="Where Your App Lives"
        lesson={SESSION}
      />
    ),
  },
  {
    id: 'c1-two-terminals',
    section: 'Where Your App Lives',
    label: 'Two terminals',
    element: (
      <ContentSlide
        kicker="Where Your App Lives"
        title="One App, Two Terminals"
        lead="One application, two processes, one machine"
        lesson={SESSION}
      >
        {/* A real capture of the student's own VS Code, split into two terminals,
            rather than a recreation (SLIDE_WORKFLOW Stage 3). This still satisfies
            R3: it *is* the VS Code terminal, with the panel tab strip and a
            `PS <path>>` prompt on every command, and it is two panels rather than
            two prompts in one. Cropped to the panel per R11, and NOT retouched,
            which is why the prompt shows the real long path. */}
        {/* The capture is the whole slide now: centred, with no callout competing
            with it. The `.\` prefix and execution-policy warnings moved into
            `notes` rather than being dropped, since both still bite on a fresh
            Windows and the presenter needs them to hand. */}
        <Shot
          src="/shots/t1-t2-terminals.png"
          alt="VS Code split into two terminals: Django runserver on the left, Vite dev server on the right"
          caption="One application: the left terminal runs its API, the right runs its pages"
          className="mx-auto w-full"
        />
      </ContentSlide>
    ),
    notes:
      'Two separate terminals, never one. Point at the prompt path on each: the commands only work from the right folder, and "wrong folder" is the first error they will hit. This session is written for Windows; every command runs in the VS Code integrated terminal (R3). This is a working full-stack app and every piece of it is correct. Exactly two things are wrong: it runs on one machine, and nobody else can open it. TWO SETUP TRAPS, moved here off the slide, mention them only if someone is stuck: the .\\ prefix on .\\env\\Scripts\\activate is required, because PowerShell will not run a script from the current folder without it and the error reads like a missing file; and on a fresh Windows the activate script is blocked outright until they run Set-ExecutionPolicy -Scope CurrentUser RemoteSigned once, which fails as UnauthorizedAccess and is not a problem with their project.',
  },
  {
    id: 'c1-it-works',
    section: 'Where Your App Lives',
    label: 'It works',
    element: (
      <ContentSlide
        kicker="Where Your App Lives"
        title="It Works"
        lead="One application answering on two ports"
        lesson={SESSION}
      >
        {/* Real captures, not mockups (SLIDE_WORKFLOW Stage 3). Cropped to the
            address bar plus the result, per R11. Each carries exactly one
            highlight, on the port, because the two captures differ by four
            characters and that difference is the entire point of the slide. */}
        <div className="grid grid-cols-2 gap-6">
          <Shot
            src="/shots/s1-app-products.png"
            alt="The React app at localhost:3000 showing the product list, signed in"
            caption="The pages you see"
            highlight={{ left: 5, top: 0.5, width: 13.7, height: 4.5, label: ':3000' }}
          />
          <Shot
            src="/shots/s2-django-api.png"
            alt="Django REST Framework at localhost:8000/api/products/ returning HTTP 200 OK"
            caption="The data behind them"
            highlight={{ left: 5, top: 0.5, width: 13.7, height: 4.5, label: ':8000' }}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Real captures from a running project, not mockups. The point is not that it looks nice, it is that both halves are correct and both live on this one machine. Read the two highlighted ports out loud: 3000 serves the pages, 8000 serves the data. Then ask what happens if you send either URL to someone else. That question is the next slide.',
  },
  {
    id: 'c1-localhost',
    section: 'Where Your App Lives',
    label: 'The word “localhost”',
    element: (
      /*
        Copy supplied verbatim by the author. Full sentences rather than the usual
        3 to 6 word fragments, because this is the slide that defines a word
        students have typed a hundred times without picturing it, and
        "Deployment" on its own was a label rather than a statement.
      */
      /*
        THE FIGURE IS ON THE LEFT HERE, AND IT IS THE ONLY SLIDE IN THE DECK THAT
        MIRRORS. THE REASON IS ARITHMETIC, NOT TASTE.

        `MachineBoundary` is 474px tall at the 480px width that keeps every card in
        it on one line. In the right-hand column a bounded panel that tall cannot
        fit: the reserved instructor-video rectangle takes everything above y=220 and
        the footer mark takes y=660 and below, which leaves 434px, and centring a
        474px panel in the well puts its top at y=201. `video-safe.mjs` measured
        exactly that, a 303px intrusion into the reserved area, because a framed
        panel draws a surface where the unframed figure drew nothing.

        Shaving the label and the padding gets it to about 428px and clears both
        boundaries by three pixels, which is not a margin, it is a coincidence
        waiting to break on a font metric. On the left the column runs from x=135 to
        x=615, nowhere near the video rectangle, so the height stops mattering at
        all. `MachineBoundary` also happens to be the one figure in this deck that
        IS the subject of its slide, so leading with it reads correctly.

        Its own two columns, like slide 20: `ContentSlide`'s paired grid puts the
        figure second and gives it about 425px, and at that width the friend's
        browser card wraps onto two lines.
      */
      <ContentSlide kicker="Where Your App Lives" title="“localhost”" lesson={SESSION}>
        <div className="grid grid-cols-[auto_1fr] items-center gap-10">
          {/*
            NO FRAME LABEL. It said "One machine" directly above a chip inside
            the figure that says "Your machine", so the same fact was stated
            twice, 30px apart, in two different type styles. Dropping it is also
            what pays for the extra padding the figure now has: the figure grew
            16px inside the dashed box and lost 36px of chrome above it, so the
            panel is shorter than it was and still clears the video rectangle.
          */}
          <FigureFrame width={480}>
            <MachineBoundary />
          </FigureFrame>
          <BulletList
            immediate
            items={[
              {
                text: 'localhost = your own machine',
                sub: 'The name always resolves to the machine that typed it, never to another one',
                /* Matches the mark on the figure's own machine chip. */
                icon: 'laptop',
              },
              {
                text: 'Sharing localhost with someone else won’t work',
                sub: 'Their browser resolves it to their own computer, where nothing is running',
                icon: 'unlink',
              },
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'They have typed this word a hundred times without picturing it. Let the severed request land before you say that localhost is not reachable from outside.',
  },
  {
    id: 'c1-two-questions',
    section: 'Where Your App Lives',
    label: 'Two questions',
    element: (
      /*
        This used to be a four-row comparison table. The table answered both
        problems before the room had felt either one, which is the wrong order:
        a question the audience answers in their head lands harder than a cell
        they read. Each card asks one question and stops. The callout underneath
        is the only claim on the slide, and it is the one that matters here.
      */
      <ContentSlide
        kicker="Where Your App Lives"
        title="Two Questions"
        lesson={SESSION}
      >
        {/*
          TWO PEERS, DRAWN AS PEERS. `PeerCards` centres its row, so two cards sit
          in the middle of the stage rather than pinned to the left, and each one
          lands on its own click: the room answers the first question before the
          second is on screen. The tone words carry what the dimming in v1 tried to
          say and said wrongly, that problem 2 is LATER and not lesser.
        */}
        {/*
          WIDTH 1152, WHICH IS THE WELL. `PeerCards` divides the slot by the card
          count, so two cards now come to 566px each and the row fills the slide:
          the left card's left edge lands on the x=64 header datum and the right
          card ends at x=1216. At the default 1100 the pair was 420px each,
          centred, with 146px of stranded stage on either side under a title and
          over a caption, which is what the negative-space note was about.
        */}
        <PeerCards
          width={1152}
          points={[
            {
              id: 'runs',
              /* No `term`: it read "Today" twice, once as the term chip and once as
                 the tone's word top right. The tag stays, because it sits with the
                 icon and reads as a status rather than as a label. */
              label: 'Will it run on any machine?',
              body: 'It runs on yours, and it was built on yours',
              /* `laptop`, not `devices`. `devices` is a monitor with a phone in
                 front of it, which is the icon for responsive layout. The thing
                 this question is about is one machine. */
              icon: 'laptop',
              tone: 'lead',
              tag: 'today',
              /*
                THE HOVER ASIDE EXPLAINS THE POINT, IT DOES NOT CUE THE PRESENTER.

                This said "Most rooms answer no to this one straight away, and
                cannot say why. That is the whole of the next concept." Both halves
                were stage direction: one described the audience to itself, the other
                pointed at the running order. A student who opens this deck alone
                gets nothing from either. What they need is WHY their own machine
                proves nothing, which is the question the card asks.
              */
              detail:
                'Your machine already carries the operating system, the runtimes and the packages this app needs, gathered over months of other work. Another machine carries its own set, and nothing has checked that the two match.',
            },
            {
              id: 'reach',
              label: 'Will everyone be able to open it?',
              body: 'Right now the only person who can reach it is you',
              /*
                `users`, not `globe`, AND THIS IS R1 RATHER THAN TASTE.

                R1 says no slide in this session shows a server, a globe or
                inbound traffic, because all three are pictures of Problem 2 and
                Problem 2 is named here and opened in the hosting sessions. The
                question is about other PEOPLE, so it is drawn as people.
              */
              icon: 'users',
              tone: 'risk',
              /* NOT the ramp's default word. `risk` says "the usual trap" by
                 default, and problem 2 is later, not dangerous. */
              tag: 'comes later',
              /*
                Was "A real problem of equal weight, and not today's. No tool is
                named for it in this session: the hosting sessions open it." That is
                course admin, not understanding. The replacement says why nobody else
                can reach the app and stops there, which keeps hard rule 4 intact:
                problem 2 is named and described, never opened.
              */
              detail:
                'The app answers on localhost, and that address means this machine to whatever computer types it. Nothing outside your own machine has an address that reaches your app.',
            },
          ]}
          caption="Different causes, different fixes, and solving one does nothing for the other"
        />
      </ContentSlide>
    ),
    notes:
      'Ask both out loud and wait. Most rooms answer no to the first and are not sure about the second. Give both equal weight: problem 2 is not a lesser problem, it is a later one. Do not name any tool yet, they mean nothing until the problem is felt.',
  },
  {
    id: 'c2-divider',
    section: 'It Works On My Machine',
    label: '02 Divider',
    element: (
      // Typographic, like every other divider in this deck. The kit's
      // illustrations all belong to the Client and Server session and none
      // depicts this concept, and the style guide forbids reaching for an
      // unrelated one to fill space.
      <SectionBreakerSlide
        index={2}
        title="It Works On My Machine"
        lesson={SESSION}
      />
    ),
    notes:
      'Two slides ago the app worked. This concept is about the sentence every developer has said and nobody means as an excuse. Read the title as a quotation, not as a claim.',
  },
  {
    id: 'c2-conversation',
    section: 'It Works On My Machine',
    label: 'The conversation',
    element: (
      /*
        WAS A `ScenarioSlide`, AND THE LAYOUT WAS ARGUING WITH THE CONTENT.

        Its `ScenarioCard` draws a solid brand-blue banner carrying the persona
        and the situation, then the beats as equal bordered boxes in a row. Two
        of those three boxes were two people talking to each other and the row
        said nothing about it: the slide read as three disconnected points, and
        the fill on the banner was the loudest thing on a frame whose loudest
        thing should be the contradiction.

        Same words, redrawn: the scene-setting is the lead where scene-setting
        goes, the two quotes are two people facing each other with a dialogue box
        each, and the third beat is centred under both because it is the room's
        conclusion rather than a third remark.
      */
      <ContentSlide
        kicker="It Works On My Machine"
        title="What Is the Problem We Have?"
        lead="You did everything right. A teammate installs your project and runs it"
        lesson={SESSION}
      >
        <TwoVoices
          left={{ name: 'Teammate', quote: '\u201cThe products API crashes the moment I hit it.\u201d' }}
          right={{ name: 'You', quote: '\u201cThat\u2019s strange, it works on my machine.\u201d' }}
          resolution="Nobody is lying. So what is different?"
        />
      </ContentSlide>
    ),
    notes: 'Let the last beat sit. Ask the room before advancing.',
  },
  {
    id: 'c2-what-goes-wrong',
    section: 'It Works On My Machine',
    label: 'What goes wrong',
    element: (
      /*
        The version mismatch used to be a table. Same content, asked instead of
        stated: every point here is something the room can check against its own
        laptop, which is what makes the answer land.
      */
      <ContentNoteSlide
        kicker="It Works On My Machine"
        title="Will It Run on Any Machine?"
        lesson={SESSION}
        points={[
          {
            text: 'Not everyone runs the operating system you do',
            sub: 'Windows, macOS and Linux do not keep files, paths or permissions the same way',
            icon: 'devices',
          },
          {
            text: 'Not every machine has the versions you built with',
            sub: 'Code written for one version can fail to run on another, without you changing a line',
            icon: 'warning',
          },
        ]}
        note={{
          kind: 'warning',
          title: 'Either one is enough',
          body: (
            <>
              A single mismatch and the application <strong>will not start</strong>, and a real
              machine usually differs on both
            </>
          ),
        }}
      />
    ),
    notes:
      'Ask the room what Python version they have. The spread in the answers is the slide. The point is not that any one version is wrong, it is that you cannot know, and cannot control, what the other machine has.',
  },
  {
    id: 'c2-code-alone',
    section: 'It Works On My Machine',
    label: 'Code alone',
    element: (
      /*
        Act 1 of a two slide motion graphic. Plays once and settles, rather than
        looping: a loop pulls the eye back while the presenter is still talking
        and never gives you a frame to point at. See `src/ui/ContainerJourney.tsx`.
      */
      <ContentSlide
        kicker="It Works On My Machine"
        title="Sending Only the Code"
        lead="The receiving machine fills in everything underneath, at its own versions"
        lesson={SESSION}
      >
        {/*
          FRAMED AT FULL WIDTH, AND THE WIDTH IS NOT NEGOTIABLE. MEASURED.

          The gap between the two machines is not empty space, it is the LANE the
          sealed unit travels along, and the unit is an absolutely positioned 180px
          packet that comes to rest at `left: 68%` of that lane. Narrowing the figure
          shortens the lane, so the packet's right edge crosses into the destination
          stack: at a 780px frame it overlapped it by about 180px while fading, and
          at 940 by about 130px. On the Docker slide the packet stays put rather than
          fading, so there the overlap would be the FINAL state.

          So the frame takes no `width`. It bounds the figure, which was the half of
          the complaint that was fixable here, and leaves the lane alone. Narrowing
          it needs the component to clamp the packet so its right edge never passes
          the end of the lane, which is a kit change and not a deck one.

          No label either, on all three journey slides: this figure names its own
          parts, and a centred caption landed beside the travelling packet's "image"
          tag and read as a second, competing label.
        */}
        {/*
          40 OVER 90, NOT 92 OVER 20. The travelling packet is 45px tall and
          centred on the lane, so it reaches 22px above the lane's top edge and
          needs 40px of head room, not 92: the 92 was measured for the DOCKER act,
          where the packet is a 176px sealed box carrying an "image" caption. The
          40 underneath is the same number, because what has to match is the
          EMPTY space at each end, not the total: the two label rows over each
          machine are content, and counting them as padding once put 86px of
          nothing under the panels and made the figure look top-light instead.
        */}
        <FigureFrame padTop={40} padBottom={40}>
          <ContainerJourney act={0} />
        </FigureFrame>
      </ContentSlide>
    ),
    notes:
      'Let it play before you talk over it. One chip crosses. Everything underneath is supplied by the machine it lands on, and those versions are not yours. That is the whole of it works on my machine, in one picture.',
  },
  {
    id: 'c3-divider',
    section: 'Containerization',
    label: '03 Divider',
    element: (
      /*
        The section is announced AFTER the problem has been felt, not before it.
        Everything up to here is the failure and the question it raises; from
        here on the deck is answering. The divider is the hinge, so it carries
        the answer's name and nothing else.
      */
      <SectionBreakerSlide
        index={3}
        title="Containerization"
        mark="/assets/tech/container-white.svg"
        markAlt="A sealed container"
        lesson={SESSION}
      />
    ),
  },
  {
    id: 'c3-every-machine',
    section: 'Containerization',
    label: 'How do we resolve this',
    element: (
      <ContentNoteSlide
        kicker="Containerization"
        title="How Do We Resolve This?"
        lesson={SESSION}
        points={[
          {
            text: 'We cannot control the other machine',
            sub: 'It is someone else\u2019s laptop, or a server you have never seen',
            icon: 'lock',
          },
          {
            text: 'A setup guide does not fix it either',
            sub: 'Instructions still depend on what that machine already has',
            icon: 'warning',
          },
          {
            text: 'So we stop depending on it',
            sub: 'Send the operating system files, the runtime and the packages along with the code',
            icon: 'bulb',
            tone: 'accent',
          },
        ]}
        note={{
          kind: 'tip',
          title: 'That has a name',
          body: (
            <>
              Packaging an application with its <strong>entire environment</strong> so it stops
              depending on the machine underneath is called{' '}
              <strong>containerization</strong>
            </>
          ),
        }}
      />
    ),
    notes:
      'Walk down the three points and let the third one be the answer the room arrives at, not the one you announce. Then say the word. The next slide defines it properly.',
  },
  {
    id: 'c3-whole-unit',
    section: 'Containerization',
    label: 'The whole unit',
    element: (
      /*
        Act 2. Identical machines, identical lane, identical chips. The only
        variable that changed between this slide and the last is how much of the
        stack made the journey, which is exactly the point being taught.
      */
      <ContentSlide
        kicker="Containerization"
        title="Sending the Whole Unit"
        lead="The code and its environment travel together, sealed"
        lesson={SESSION}
      >
        {/* Framed at full width, and the width is not negotiable: see the note on
            the sending-only-the-code slide. The lane is what the packet travels
            along, so it keeps every pixel it was tuned for. */}
        <FigureFrame padTop={92}>
          <ContainerJourney act={1} />
        </FigureFrame>
      </ContentSlide>
    ),
    notes:
      'Same two machines, same OS underneath, same code. The one thing that changed is that Node and Python came along inside the sealed unit, so there is nothing left for the receiving machine to get wrong. Point at the dashed border: that boundary is what the word container names.',
  },
  {
    id: 'c3-containerization',
    section: 'Containerization',
    label: 'What containerization is',
    element: (
      /*
        The definition now carries a figure. Three abstract statements with no
        picture asked the room to hold "one sealed unit" as words; the stack on
        the right is that unit, drawn: the same four layers the previous slides
        argued about, this time all travelling and all inside one boundary. The
        one-sentence summary moved into the lead, so the note is no longer needed
        and the figure has room.
      */
      /*
        THE DEFINITION MOVED DOWN, AND THE TITLE DID NOT.

        The sentence used to be the slide's `lead`, which puts it full width
        under the title with the body content centred in whatever is left. On
        this slide that left a 90px band of nothing between the definition and
        the first bullet, and the definition read as a subtitle for the whole
        frame rather than as the sentence the three bullets unpack.

        So it sits directly over the points now, in the same column, at lead
        size. The kicker and the title stay exactly where they are: hard rule 19
        pins them to the slide's own top-left datum on EVERY slide, because a
        deck whose "where am I" answer moves between frames is not answering.
        That is the one part of the correction that could not be done as asked,
        and it is the part the rule exists for.

        The slide lays out its own two columns for the same reason slides 7 and
        18 do: `ContentSlide`'s paired grid puts `points` in column one and
        `children` in column two, and there is no slot in it for a paragraph
        above the points.
      */
      <ContentSlide
        kicker="Containerization"
        title="What Is Containerization"
        lesson={SESSION}
      >
        <div className="grid grid-cols-[1.4fr_1fr] items-center gap-10">
        <div>
          {/*
            NUDGED UP 2px. The paragraph's own line box sits 2px lower than the
            optical top of its first line, so at `items-center` the block read as
            hanging slightly low against the figure beside it.
          */}
          <p className="mb-6 max-w-[600px] text-body-lg text-body" style={{ marginTop: -2 }}>
            Packaging an application with its entire environment into one unit that runs the same
            way on any machine
          </p>
          <BulletList
            immediate
            items={[
          {
            text: 'One sealed unit',
            sub: 'Nothing inside it is fetched from the machine it lands on, so nothing can be missing',
            icon: 'lock',
          },
          {
            text: 'Built once, then copied',
            sub: 'Nothing is reinstalled on the machine that receives it, so nothing can drift',
            icon: 'target',
          },
          {
            /*
              THIS BULLET USED TO SAY "That unit is called a container", AND THAT
              WAS WRONG BY THE DECK'S OWN LATER DEFINITION.

              The unit described by the two bullets above is built once and copied,
              and the thing that is built once and copied is an IMAGE. A container
              is what you get when that image is run. The definition slide in the
              Docker section states it outright: "The sealed unit you send is an
              image, the running copy on the far machine is a container". Slide 29
              then needs it to be true, because "one image, many containers" only
              means anything if the container is not the thing that was copied.

              So this slide names the PROCESS, which is what its title asks for, and
              introduces `container` with the meaning it keeps for the rest of the
              deck. `image` still arrives later, on the slide where the animation
              earns it, so no vocabulary lands before the room can see it.
            */
            text: 'Packaging it this way is called containerization',
            sub: 'The copy that runs on the far machine is called a container',
            icon: 'bulb',
            tone: 'accent',
          },
        ]}
          />
        </div>
        {/* The dashed box stays exactly as it was: that boundary IS the teaching,
            everything inside it travels. The frame around it is chrome, so the two
            borders say different things, a panel and a container. */}
        {/* No label: the figure's own caption now reads "one sealed unit", and the
            frame is chrome, not a second voice saying the same thing. */}
        <FigureFrame width={400}>
          {/* Its own centring wrapper: the dashed boundary is tight around the
              stack by design, so it must not stretch to the frame's width. */}
          <div className="flex justify-center">
          <div
            className="rounded-card border-2 border-dashed p-4"
            /*
              `surface`, not the '#F5F8FF' this carried: hard rule 5, no hex in a
              deck file. The ramp and the shadow match the sealed packet in
              `ContainerJourney`, because this IS that packet, standing still: the
              two slides are eight apart and the room is meant to recognise it.
            */
            style={{
              borderColor: colors.brand,
              background: `radial-gradient(120% 90% at 12% 0%, ${colors.white} 0%, ${colors.surface} 55%, ${colors.surface2} 100%)`,
              boxShadow: `0 8px 22px -12px ${colors.brandDeep}66`,
            }}
          >
            {/* "one container" here made the same claim the third bullet did, and
                on the very box that slide 25 labels IMAGE while it travels. */}
            <div
              className="mb-3 text-center text-body-sm font-bold uppercase tracking-wide"
              style={{ color: colors.brand }}
            >
              one sealed unit
            </div>
            <LayerStack
              width={210}
              stepped={false}
              /* No OS layer: a container does not carry an operating system,
                 it borrows the kernel of the machine it runs on. That is the
                 whole reason it is MB rather than GB, and it is
                 the point the virtual machine comparison later turns on. The
                 runtimes are the ones this application actually needs. */
              layers={[
                /*
                  YOUR versions, not theirs. This figure is your environment
                  sealed and travelling, so the numbers have to be the ones on
                  the "Your machine" stack two slides on: Node 22, Python 3.14.
                  It said Node 20 here, which is the RECEIVING machine's version,
                  so the picture of the fix was quietly carrying the bug.
                */
                { label: 'Your code', state: 'ships' },
                { label: <RuntimeLabel logo={PY_LOGO}>Python</RuntimeLabel>, note: '3.14', state: 'ships' },
                { label: <RuntimeLabel logo={NODE_LOGO}>Node</RuntimeLabel>, note: '22', state: 'ships' },
              ]}
              caption="All three travel together"
            />
          </div>
          </div>
        </FigureFrame>
        </div>
      </ContentSlide>
    ),
    notes:
      'Point at the dashed boundary and say it plainly: everything inside it travels, so there is nothing left for the receiving machine to get wrong. Compare it with the two stacks from a moment ago, where only the top box crossed. Do not name Docker yet, that is two slides away. Say containerization for the act and container for the copy that runs on the far machine, and do not call the sealed box itself a container: it is the thing that gets copied, and the Docker section names it an image. If someone asks whether this is a virtual machine, say no: a virtual machine carries a whole second operating system, and this carries only the layers the application needs.',
  },
  {
    id: 'c4-divider',
    section: 'Different Ground',
    label: '04 Divider',
    element: (
      // Typographic, like every other divider in this deck. The kit's
      // illustrations all belong to the Client and Server session and none
      // depicts this concept, and the style guide forbids reaching for an
      // unrelated one to fill space.
      <SectionBreakerSlide
        index={4}
        title="Different Ground"
        lesson={SESSION}
      />
    ),
    notes:
      'The unit travels now. This concept is about what it lands on, and it is where the room stops guessing and starts seeing the layers.',
  },
  {
    id: 'c4-layers',
    section: 'Different Ground',
    label: 'Different ground',
    element: (
      /*
        THIS SLIDE LAYS OUT ITS OWN TWO COLUMNS, and it is the only one that does.

        `ContentSlide`'s paired grid is `1.4fr` of text to `1fr` of figure, which on
        the 1060px well gives the figure about 425. Two 190px stacks with a 76px
        `LayerGap` between them need 456 before any frame padding, so in that column
        the pair either overflowed or had to be shrunk. The stacks carry version
        numbers the room is meant to read from the back, so shrinking them was not
        an option and the columns changed instead.

        Same components, same content, same `immediate` reveal as `ContentSlide`
        would have passed: the bullets and the figure still land together, per the
        parallel-reveal rule.
      */
      <ContentSlide
        kicker="Different Ground"
        title="Different Ground"
        lesson={SESSION}
      >
        <div className="grid grid-cols-[1fr_auto] items-center gap-10">
          <BulletList
            immediate
            items={[
              { text: 'Only your code crosses the gap', icon: 'arrow' },
              {
                text: 'The three layers below stay behind',
                sub: 'The receiving machine re-supplies them, at whatever versions it has',
                icon: 'warning',
              },
              {
                text: 'Containerization sends the environment, not just the code',
                icon: 'bulb',
                tone: 'accent',
              },
            ]}
          />
          {/* 660, not the 600 that merely stopped the overflow. Two 190px stacks
              with the 168px gap label between them are 548 wide, so 600 left them
              26px from the frame's edge, which is the padding and nothing more.
              660 puts 56px of real air on each side. The points column takes the
              difference and still holds its longest line in three. */}
          <FigureFrame width={660} label="Two machines">
        <div className="flex items-start justify-center">
          <LayerStack
            width={190}
            stepped={false}
            title="Your machine"
            layers={[
              { label: 'Your code', state: 'ships' },
              { label: <RuntimeLabel logo={NODE_LOGO}>Node</RuntimeLabel>, note: '22', state: 'host' },
              { label: <RuntimeLabel logo={PY_LOGO}>Python</RuntimeLabel>, note: '3.14', state: 'host' },
              { label: 'OS', state: 'host' },
            ]}
            caption="Works"
          />
          <LayerGap label="you share the code" className="mt-24" />
          <LayerStack
            width={190}
            stepped={false}
            title="Their machine"
            layers={[
              { label: 'Your code', state: 'ships' },
              // The two RUNTIMES this project actually needs, not a runtime and a
              // framework: the Django backend runs on Python and the Vite/React
              // frontend runs on Node, which is exactly the pair the room saw in
              // the two terminals earlier in this deck.
              //
              // `ContainerJourney` names the same two things at the same versions,
              // on purpose. The two figures share a visual language one slide
              // apart, so if a version moves here it has to move there too.
              { label: <RuntimeLabel logo={NODE_LOGO}>Node</RuntimeLabel>, note: '20', state: 'breaks' },
              { label: <RuntimeLabel logo={PY_LOGO}>Python</RuntimeLabel>, note: '3.10', state: 'breaks' },
              { label: 'OS', state: 'breaks' },
            ]}
            caption="Same code. Different ground"
          />
        </div>
          </FigureFrame>
        </div>
      </ContentSlide>
    ),
    notes:
      'The figure deliberately ends on the question, not the answer. Let the room try to answer it. The next section is that answer, and the same layers come back there with all four travelling together.',
  },
  {
    id: 'c4-where-we-are',
    section: 'Different Ground',
    label: 'Where we are',
    element: (
      /*
        The handoff into the Docker section. This replaced a benefits table whose
        every row leaned on context the restructure had cut. A recap that ends on
        an open question does the job better: it states only what the previous six
        slides actually established, then hands the next section something to
        answer, which is the role the deleted five-attempts sequence used to play.
      */
      <ContentSlide kicker="Different Ground" title="Where We Are" lesson={SESSION}>
        {/*
          THE RECAP AS NUMBERED CLAIMS, and the open question as the caption.
          `RuleStack` gives a claim its own line with the one line that earns it
          underneath, which is what these two are, and its stage is now as tall as
          its rows: two rows come to 208px rather than the 386px the figure was
          fixed at, so nothing is stranded under them.
        */}
        {/*
          UNORDERED, AND THE ROLE IS THE MARKER.

          These two rows are not step one and step two: one is the problem and the
          other is the fix. Numbering them told the room to read a sequence, which is
          the failure `RuleStack`'s own doc comment names, so this set passes
          `ordered={false}` and puts the role in the marker through `term`. The
          right-hand tags came off with the numbers: they were saying the same two
          words from the other side of the row.
        */}
        {/*
          WIDTH 1152, WHICH IS THE WELL, AND THE THREE BOXES NOW SHARE ONE EDGE.

          At the default 1100 the figure was `mx-auto` inside a 1152px well, so
          the two rows sat at x=90 while the callout under them started at x=64:
          three boxes, two left edges, 26px apart, which is close enough to read
          as a mistake rather than as a margin. All three run 64 to 1216 now,
          which is also the x=64 header datum `align-check.mjs` measures against.
        */}
        <RuleStack
          width={1152}
          ordered={false}
          points={[
            {
              id: 'code-alone',
              term: 'Problem',
              label: 'Sending just the code is not enough',
              body: 'The machine it lands on fills in the rest, at its own versions',
              icon: 'warning',
              tone: 'risk',
            },
            {
              id: 'whole-unit',
              term: 'Fix',
              label: 'The environment has to travel with it',
              body: 'Packaging both into one unit is what containerization means',
              icon: 'target',
              tone: 'lead',
            },
          ]}
        />

        {/*
          THE OPEN QUESTION IS THE SLIDE'S PAYOFF, so it is a callout and not a
          caption. v2 had it as a `tip` with a title, and folding it into the
          figure's caption made it small grey centred text: the room read it as a
          note about the figure rather than as the question the next section answers.
        */}
        <Callout kind="tip" title="Which leaves one question" className="mt-6 max-w-none">
          So how do we actually do it?
        </Callout>
      </ContentSlide>
    ),
    notes:
      'Say both lines as settled facts, not as new information, because the room has just watched both happen. Then stop on the question and let it sit. The next section is the answer, and the answer is a tool: containerization is what you want, Docker is what does it.',
  },
  {
    id: 'c5-divider',
    section: 'Docker',
    label: '05 Divider',
    element: (
      <SectionBreakerSlide
        index={5}
        title="Docker"
        mark="/assets/tech/docker-white.svg"
        markAlt="Docker"
        lesson={SESSION}
      />
    ),
    notes:
      'This is the answer to the question the layers figure ended on: what if all four layers travelled together? Slide 8 already put Containerization in the Tool cell for Problem 1, so point back at it and pay the word off here.',
  },
  {
    id: 'c5-idea-and-tool',
    section: 'Docker',
    label: 'Idea and tool',
    element: (
      /*
        The bridge the restructure left missing. The original deck earned Docker by
        elimination: five attempts failed, five requirements emerged, Docker was
        the only thing meeting all five. Cutting the attempts removed that
        connective tissue, so this slide replaces it by separating the IDEA from
        the TOOL and handing over the three words section 5 goes on to teach.
      */
      <ContentNoteSlide
        kicker="Docker"
        title="Idea and Tool"
        lead="You now know what containerization does, Docker is what actually does it"
        lesson={SESSION}
        points={[
          {
            text: 'Containerization is the idea',
            sub: 'Package an application with its environment, then move the whole unit',
            icon: 'bulb',
          },
          {
            text: 'Docker is the tool',
            sub: 'It builds those units, stores them, and runs them on any machine',
            icon: 'settings',
            tone: 'accent',
          },
        ]}
        note={{
          kind: 'note',
          title: 'Three words from here on',
          body: (
            <>
              The sealed unit you send is an <strong>image</strong>, the running copy on the far
              machine is a <strong>container</strong>, and <strong>Docker</strong> is what builds and
              runs them
            </>
          ),
        }}
      />
    ),
    notes:
      'Separate the idea from the tool out loud. Containerization is what you would want even if Docker had never been written; Docker is the implementation that won. The three words in the note are the vocabulary for the rest of the session, so say each one while pointing at the picture on the next slide.',
  },
  {
    id: 'c5-docker-words',
    section: 'Docker',
    label: 'In Docker words',
    element: (
      /*
        The same figure as the whole-unit slide, annotated with the two new words.
        Attaching image and container to a picture the room watched ten slides ago
        is cheaper than defining them cold, and it is why section 5 can open on the
        class/object analogy rather than on a definition.
      */
      <ContentSlide
        kicker="Docker"
        title="The Same Picture, Named"
        lead="Nothing new is happening here, only the words have arrived"
        lesson={SESSION}
      >
        {/* Same treatment as the whole-unit slide, deliberately: this is that
            figure with two words added, so the frame must not be what changes. */}
        <FigureFrame padTop={92}>
          <ContainerJourney act={1} docker />
        </FigureFrame>
      </ContentSlide>
    ),
    notes:
      'Deliberately the same animation they already understand. Point at the dashed box as it travels and say image, point at what settles on the far machine and say container. One image can produce many containers, which is the next section. Do not define either word formally yet.',
  },
  {
    id: 'c5-definition',
    section: 'Docker',
    label: 'The definition',
    element: (
      <ContentNoteSlide
        kicker="Docker"
        title="The Definition"
        lesson={SESSION}
        noteFirst
        note={{
          kind: 'note',
          // The white mark sits inside the callout's coloured icon holder, which
          // is more informative than the generic info glyph on the one slide that
          // defines the product. White variant because the holder is brand blue,
          // and Docker's guidelines forbid recolouring their mark.
          icon: (
            <img
              src="/assets/tech/docker-white.svg"
              alt=""
              draggable={false}
              className="h-5 w-auto select-none"
            />
          ),
          title: 'Docker',
          body: (
            <>
              A platform that packages an application with all of its dependencies (runtime,
              libraries, OS packages and configuration) into one standardised unit called a{' '}
              <strong>container</strong>, which runs identically on any machine that has Docker
              installed
            </>
          ),
        }}
        points={[
          { text: 'Netflix, Spotify and PayPal run on containers', icon: 'star' },
          {
            text: 'Most used and most admired developer tool',
            sub: 'Stack Overflow Developer Survey 2024, over half of professional developers',
            icon: 'star',
          },
        ]}
      />
    ),
    notes:
      'Read the definition again with their own project in mind: Django code, Python 3.10, DRF, simplejwt, cors-headers and the OS libraries they need, all sealed into one unit. For a backend role, Docker shows up in job descriptions about as often as the framework itself.',
  },
  {
    id: 'c5-os',
    section: 'Docker',
    label: 'What about the OS',
    element: (
      /*
        This closes the loop opened on "Will it run on any machine?", where the
        first thing the room could not know about the receiving machine was its
        operating system. The distinction that makes it work, and the one worth
        being precise about: a container packages the OS FILES it needs and
        borrows the KERNEL from the machine it runs on. That is why the figure on
        the containerization slide has no OS layer, and why a container is
        MB rather than GB.
      */
      <ContentNoteSlide
        kicker="Docker"
        title="What About the Operating System?"
        lesson={SESSION}
        /*
          TWO points, not three.

          The third one ("so the operating system stops being a variable") and the
          old second sub, which listed WSL 2, the macOS VM and the Linux host
          kernel, both had to go: the first restated the definition slide one
          before this, and the second is now the whole of the next slide, drawn
          rather than asserted. What is left is the one thing neither neighbour
          says, which is the split between what a container CARRIES and what it
          BORROWS.
        */
        points={[
          {
            text: 'A container packs the OS files it needs',
            sub: 'A slim Linux userland travels inside it, always the same OS',
            icon: 'database',
          },
          {
            text: 'It borrows the kernel from the machine it runs on',
            sub: 'The one piece it does not carry, hence MB not GB',
            icon: 'server',
            tone: 'accent',
          },
        ]}
        note={{
          kind: 'tip',
          title: 'One of the two unknowns is gone',
          body: (
            <>
              &ldquo;Not everyone runs the operating system you do&rdquo; was half the problem, and
              Docker has just <strong>removed it</strong>
            </>
          ),
        }}
      />
    ),
    notes:
      'Be precise here if asked: the container carries the operating system FILES, not a kernel. It borrows the kernel of the machine it runs on, which is exactly why it is MB and a virtual machine is GB. If they push on the virtual machine question, the next slide answers it: on macOS there IS one small Linux VM, shared by every container rather than one per container.',
  },
  {
    id: 'c5-three-hosts',
    section: 'Docker',
    label: 'Three hosts, one kernel',
    element: (
      /*
        The figure for the second point on the previous slide, which until now was
        a sentence the room had to take on trust.

        Read every column BOTTOM-UP: the host operating system differs, the middle
        row is how Docker gets a Linux kernel on that host, and the top box is
        byte-identical in all three. The kernel row is `shared` in every column on
        purpose: it is the same borrowed Linux kernel each time, only obtained
        differently, which is exactly the claim the slide is making.

        Each column is titled with its OS mark (`public/assets/tech/*.png`) so the
        room can find its own machine at a glance before reading a word.
      */
      <ContentSlide
        kicker="Docker"
        title="Three Hosts, One Linux Kernel"
        lesson={SESSION}
      >
        <div className="flex flex-col items-center gap-7">
          <div className="flex items-start justify-center gap-8">
            <LayerStack
              width={300}
              stepped={false}
              title={<img src="/assets/tech/windows.png" alt="Windows" draggable={false} className="mb-3 h-12 w-auto select-none" />}
              layers={[
                { label: 'Your container', note: 'identical', state: 'ships' },
                { label: 'Linux kernel, via WSL 2', state: 'shared' },
                { label: 'Windows', state: 'host' },
              ]}
              caption="Docker installs WSL 2 for you"
            />
            <LayerStack
              width={300}
              stepped={false}
              title={<img src="/assets/tech/macos.png" alt="macOS" draggable={false} className="mb-3 h-12 w-auto select-none" />}
              layers={[
                { label: 'Your container', note: 'identical', state: 'ships' },
                { label: 'Linux kernel, in a built-in VM', state: 'shared' },
                { label: 'macOS', state: 'host' },
              ]}
              caption="Docker ships that Linux VM with it"
            />
            <LayerStack
              width={300}
              stepped={false}
              title={<img src="/assets/tech/linux.png" alt="Linux" draggable={false} className="mb-3 h-12 w-auto select-none" />}
              layers={[
                { label: 'Your container', note: 'identical', state: 'ships' },
                { label: 'Linux kernel, the host one itself', state: 'shared' },
                { label: 'Linux', state: 'host' },
              ]}
              caption="Nothing extra. It is already Linux"
            />
          </div>
          <Callout kind="tip" title="Your container always lands on Linux" asStep={false}>
            Whichever operating system you use, your container only ever runs on{' '}
            <strong>Linux</strong>. Docker installs whatever that machine needs to supply the Linux
            kernel, so the same container runs on all three
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Point at the three bottom boxes first, then the three middle boxes, then the top row. The bottom row is the only thing that differs between the columns, and the top row is identical in all three: that is the whole slide. Two questions come up here. First, "so is it a virtual machine on macOS?" Yes, one small Linux VM, shared by every container on that machine, not one per container. Second, "why does Windows need WSL 2?" Because containers borrow a Linux kernel and Windows does not have one, so Docker brings it. Linux hosts install the least, because they already are the target. This slide is why every docker command later is identical in PowerShell, macOS zsh and Linux bash.',
  },
  {
    id: 'c6-divider',
    section: 'Images and Containers',
    label: '06 Divider',
    element: (
      // Typographic, like every other divider in this deck. The kit's
      // illustrations all belong to the Client and Server session and none
      // depicts this concept, and the style guide forbids reaching for an
      // unrelated one to fill space.
      <SectionBreakerSlide
        index={6}
        title="Images and Containers"
        lesson={SESSION}
      />
    ),
    notes:
      'Two words the room will use for the rest of the course, and the two they most often swap. Say both out loud before the next slide starts.',
  },
  {
    id: 'c6-image-container',
    section: 'Images and Containers',
    label: 'Image and container',
    element: (
      <ContentSlide
        kicker="Images and Containers"
        title="Image and Container"
        lead="Settle both words with something you already know"
        lesson={SESSION}
      >
        <div className="grid grid-cols-2 items-center gap-10">
          <CodeBlock
            language="python"
            showLineNumbers={false}
            maxHeight={230}
            code={`class Product:      # blueprint, does not run
    ...

p1 = Product()      # a live instance
p2 = Product()      # another, independent`}
          />
          <div className="grid gap-4">
            <Card title="Class → Image" className="!p-5 !text-body-sm">
              A frozen, read-only package of app plus dependencies
            </Card>
            <Card title="Object → Container" className="!p-5 !text-body-sm">
              A live, running instance created from an image
            </Card>
          </div>
        </div>
      </ContentSlide>
    ),
    notes:
      'Almost every Docker error a beginner hits comes from confusing these two words. Anchor it here and keep coming back to it.',
  },
  {
    id: 'c6-what-is-an-image',
    section: 'Images and Containers',
    label: 'What is an image',
    element: (
      /*
        THE IMAGE, DEFINED ON ITS OWN SLIDE, WITH THE PICTURE IT ALREADY HAS.

        The figure is the sealed unit from the containerization concept, unchanged.
        The room met that dashed box as "one sealed unit" ten slides ago; showing the
        same drawing again under the word IMAGE attaches the name to a thing they
        have seen rather than to a definition they are reading cold. That is the same
        move `ContainerJourney` act 1 makes when the Docker words arrive.

        The zip comparison lives here and nowhere else. "It sits on disk and never
        runs" is the sentence a beginner does not believe until it is compared with a
        file they already have, and the next slide can then be about the transition
        rather than about what an image is.
      */
      <ContentSlide
        kicker="Images and Containers"
        title="What Is an Image?"
        lead="A read-only template used to create containers"
        lesson={SESSION}
        points={[
          {
            text: 'Built once, from your app and its environment',
            sub: 'The same packaging step from two concepts ago, now with its proper name',
            icon: 'lock',
          },
          {
            text: 'It sits on disk and never runs by itself',
            sub: 'Like a zip file you have not opened, it is just a file until something starts it',
            icon: 'folder',
          },
          {
            text: 'Every machine that receives it gets the same bytes',
            sub: 'Which is what makes the result the same everywhere it lands',
            icon: 'target',
            tone: 'accent',
          },
        ]}
      >
        <FigureFrame width={400}>
          {/* The sealed unit from the containerization concept, redrawn under its
              Docker name. Its own centring wrapper, as on that slide. */}
          <div className="flex justify-center">
            <div
              className="rounded-card border-2 border-dashed p-4"
              style={{
                borderColor: colors.brand,
                background: `radial-gradient(120% 90% at 12% 0%, ${colors.white} 0%, ${colors.surface} 55%, ${colors.surface2} 100%)`,
                boxShadow: `0 8px 22px -12px ${colors.brandDeep}66`,
              }}
            >
              <div
                className="mb-3 text-center text-body-sm font-bold uppercase tracking-wide"
                style={{ color: colors.brand }}
              >
                one image
              </div>
              <LayerStack
                width={210}
                stepped={false}
                layers={[
                  { label: 'Your code', state: 'ships' },
                  { label: <RuntimeLabel logo={PY_LOGO}>Python</RuntimeLabel>, note: '3.14', state: 'ships' },
                  { label: <RuntimeLabel logo={NODE_LOGO}>Node</RuntimeLabel>, note: '22', state: 'ships' },
                ]}
                caption="Read-only, and identical everywhere"
              />
            </div>
          </div>
        </FigureFrame>
      </ContentSlide>
    ),
    notes:
      'Same picture they saw as the sealed unit, now carrying its Docker name. Say the zip line out loud: an image is a file that sits there. Nothing in it is running. That is the sentence the next slide needs, because the next slide is about what happens when you do start it.',
  },
  {
    id: 'c6-image-to-container',
    section: 'Images and Containers',
    label: 'Image to container',
    element: (
      /*
        THE MECHANISM THE ANALOGY STOOD IN FOR, AND THE SAME FIGURE THE FAN-OUT
        SLIDE USES TWO SLIDES LATER WITH ONE VARIABLE CHANGED.

        The room has just had image and container settled against class and object.
        This draws the actual relationship: one read-only image, one `docker run`,
        one live container. Slide 30 then repeats the identical figure with three
        copies, so the only thing that moves between them is the number, which is
        exactly the idiom `ContainerJourney` act 0 to act 1 uses earlier in the deck.

        A `SpineFlow` pipeline was tried first and does not fit: its stage is a fixed
        1100 with a 230 pitch on 180 slots, so the gap between two nodes is 50px and
        the edge label "containerization" was clipped under the boxes, while three
        nodes on a five-node spine left 460px of dead stage. The figure that already
        draws this relationship is the one to use.

        Containerization is NOT the arrow drawn here: `docker run` is. The act that
        produces the image is named on the next slide, in words, rather than drawn as
        a second arrow this figure has no room for.
      */
      <ContentSlide
        kicker="Images and Containers"
        title="From Image to Container"
        lead="What actually happens when you start one"
        lesson={SESSION}
        /*
          PLAIN LANGUAGE, AND NO LONGER OVERLAPPING THE DEFINITION SLIDE.

          These read as Docker's own vocabulary before: "read-only package", "the
          live process", "untouched". A student who already knows Docker parses that
          fine, which is exactly the wrong test. Each line now says what happens in
          words a beginner already owns.

          The first point used to be "The image never runs", which is now the whole
          second point of the slide before this one. This slide is the TRANSITION, so
          it starts at the moment something is started.
        */
        points={[
          {
            text: 'docker run starts a copy of it',
            sub: 'Docker reads the image, starts what is inside, and that running copy is the container',
            icon: 'bolt',
          },
          {
            text: 'The container is the part that is alive',
            sub: 'It gets its own files and its own processes for as long as it runs',
            icon: 'devices',
          },
          {
            text: 'Closing the container does not touch the image',
            sub: 'The file is still on your disk, so you can start another copy any time, without building anything again',
            icon: 'target',
            tone: 'accent',
          },
        ]}
      >
        <FanOut
          size="half"
          source={{ label: 'Image', caption: 'read-only', icon: 'folder' }}
          copies={[{ id: 'c1', label: 'Container', live: true }]}
        />
      </ContentSlide>
    ),
    notes:
      'The slide before this one said the image sits there. This one is the moment something starts. Point at the box on the left, say docker run out loud, then point at the box on the right and say that this one is alive. The next slide puts all three words together, and the slide after that changes one thing: the number of containers.',
  },
  {
    id: 'c6-three-words',
    section: 'Images and Containers',
    label: 'The three words',
    element: (
      /*
        THE DEFINITION SLIDE, AND THE DEFINITIONS ARE ONE LINE EACH ON PURPOSE.

        This is the slide the room photographs, so the card carries the sentence a
        student would write in a notebook and the hover carries everything that would
        not fit in it. A card that has to be read twice is a card that will be
        photographed and never understood.

        `PeerCards` rather than `Card`: `Card` has no hover, and the second layer is
        the whole point here. `term` is passed on all three because `PeerCards` falls
        back to "Point 1" for the hover's heading when it is missing, which is what
        slide 8 currently shows.

        The order is the pipeline's order, not alphabetical: the concept, the thing
        the concept produces, and the thing that produces.
      */
      <ContentSlide
        kicker="Images and Containers"
        title="The Three Words"
        lead="Swapping these three is the commonest Docker mistake there is"
        lesson={SESSION}
      >
        <PeerCards
          points={[
            {
              id: 'containerization',
              term: 'Concept',
              label: 'Containerization',
              body: 'Packaging an app with its entire environment into one unit',
              icon: 'lock',
              tone: 'lead',
              detail:
                'It is an idea, not a file you can point at. Docker is one implementation of it, and it would still be the thing you wanted if Docker had never been written.',
            },
            {
              id: 'image',
              term: 'Template',
              label: 'Image',
              body: 'A read-only template used to create containers',
              icon: 'folder',
              tone: 'neutral',
              detail:
                'Built once, then copied. It sits on disk and never runs by itself. Every machine that receives it receives the same bytes, which is what makes the result predictable.',
            },
            {
              id: 'container',
              term: 'Instance',
              label: 'Container',
              body: 'A running, isolated instance created from an image',
              icon: 'bolt',
              tone: 'good',
              tag: 'the live one',
              detail:
                'Isolated means it has its own filesystem and processes, so one container cannot see or disturb another. Stop it or delete it and the image it came from is untouched.',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Say all three in this order and let the room write them down. Containerization is the concept, the image is the read-only template it produces, the container is the running instance made from that template. Hover a card if someone wants more than the one line. Almost every Docker error a beginner hits is one of these three standing in for another.',
  },
  {
    id: 'c6-fanout',
    section: 'Images and Containers',
    label: 'One image, many containers',
    element: (
      <ContentSlide
        kicker="Images and Containers"
        title="One Image, Many Containers"
        lesson={SESSION}
        points={[
          {
            text: 'One image → many containers',
            sub: 'Just as one class produces many objects',
            icon: 'arrow',
          },
          {
            text: 'Three containers, three times the traffic',
            sub: 'Each one runs its own separate copy, so one crashing leaves the others up',
            icon: 'bolt',
          },
          {
            text: 'Docker Hub, ready-made images',
            sub: 'python and node, ready to pull',
            icon: 'database',
          },
          {
            text: 'Or build your own, with a Dockerfile',
            sub: 'A text file listing the steps Docker follows to build your image',
            icon: 'code',
          },
        ]}
      >
        {/*
          THE KIT'S `FanOut` AT `half`, which is why it fits here now.

          `full` is a 900px stage and this slide pairs a figure with a four-point
          column: rendered at 900 it squeezed the points to about 150px, wrapped
          every one to four or five lines, printed the first over the title and ran
          the last off the bottom of the frame. `half` is 460, a 150px card either
          side of a 160px fan. `live` is per copy, so a slide about three containers
          with one stopped is sayable without drawing a second figure.
        */}
        <FanOut
          size="half"
          source={{ label: 'Image', caption: 'read-only', icon: 'folder' }}
          copies={[
            { id: 'c1', label: 'Container 1', live: true },
            { id: 'c2', label: 'Container 2', live: true },
            { id: 'c3', label: 'Container 3', live: true },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Students who only see a static diagram keep saying "run the image" and "delete the container\'s image" for weeks. Say it explicitly: the grey slab never changes.',
  },
  {
    id: 'c8-divider',
    section: 'Installing Docker',
    label: '07 Divider',
    element: (
      <SectionBreakerSlide
        index={7}
        title="Installing Docker"
        lesson={SESSION}
      />
    ),
    notes:
      'Deliberately small. Nothing installed here goes near the internet, so this is still Problem 1. Doing it now means the next session starts with Dockerfile on line 1 instead of forty minutes of setup.',
  },
  {
    id: 'c8-install-link',
    section: 'Installing Docker',
    label: 'Get Docker',
    element: (
      /*
        THE LINK COMES FIRST, and it is the OFFICIAL one.

        The steps that follow this slide are Windows-only, which used to leave
        mac and Linux students with nothing to follow and a verbal aside to
        remember. Docker's own install pages are per-OS, maintained, and change
        under us; sending the room there is both kinder and more honest than
        transcribing a version of the steps that will rot.

        All four URLs were checked live before they were put on the slide. If a
        future edit adds one, check it too: a dead link on a projector is worse
        than no link.
      */
      <ContentSlide
        kicker="Installing Docker"
        title="Get Docker"
        lead="Install Docker by following the official instructions for your operating system"
        lesson={SESSION}
      >
        <div className="grid gap-5">
          <div className="grid grid-cols-3 gap-5">
            {[
              {
                os: 'Windows',
                logo: '/assets/tech/windows.png',
                what: 'Docker Desktop',
                href: 'https://docs.docker.com/desktop/setup/install/windows-install/',
              },
              {
                os: 'macOS',
                logo: '/assets/tech/macos.png',
                what: 'Docker Desktop',
                href: 'https://docs.docker.com/desktop/setup/install/mac-install/',
              },
              {
                os: 'Linux',
                logo: '/assets/tech/linux.png',
                what: 'Docker Engine',
                href: 'https://docs.docker.com/desktop/setup/install/linux/',
              },
            ].map((o) => (
              /*
                THE WHOLE CARD IS THE LINK, not just the URL text. On a projected
                1280x720 canvas a line of 12px monospace is a hopeless click
                target, and the presenter is usually clicking it live in front of
                the room. `target="_blank"` matters more than usual here: the deck
                holds its position in the URL hash, so navigating away in the same
                tab loses the presenter's place in the deck.
              */
              <a
                key={o.os}
                href={o.href}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-3 rounded-card bg-white p-5 text-center shadow-card-soft ring-1 ring-line transition-transform hover:scale-[1.02] hover:ring-brand/40"
              >
                <img src={o.logo} alt="" draggable={false} className="h-12 w-auto object-contain" />
                <div>
                  <div className="font-heading text-body-lg font-bold text-ink">{o.os}</div>
                  <div className="text-body-sm text-body">{o.what}</div>
                </div>
                {/*
                  SPLIT AT THE LAST SLASH, NOT WHEREVER THE BOX RUNS OUT.

                  This was one string with `break-all`, so
                  `docs.docker.com/desktop/setup/install/windows-install` broke in
                  the middle of a word across two lines: `align-check.mjs` reported
                  it as one token over two lines on both the Windows and the macOS
                  card. A student reading a URL off a projector to type it needs the
                  break to land on a path boundary. Two deliberate lines, each of
                  which fits: the domain and path is 37 characters at 12px mono,
                  about 266px inside the card's 300px of content width.
                */}
                <code className="font-mono text-[12px] leading-snug text-brand underline decoration-brand/30 underline-offset-2">
                  {(() => {
                    const path = o.href.replace(/^https:\/\//, '').replace(/\/$/, '')
                    const cut = path.lastIndexOf('/')
                    return (
                      <>
                        <span className="block">{path.slice(0, cut + 1)}</span>
                        <span className="block">{path.slice(cut + 1)}</span>
                      </>
                    )
                  })()}
                </code>
              </a>
            ))}
          </div>

          <Callout kind="info" title="Start from one page" asStep={false}>
            <a
              href="https://docs.docker.com/get-started/get-docker/"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-brand underline decoration-brand/30 underline-offset-2"
            >
              docs.docker.com/get-started/get-docker
            </a>{' '}
            picks the right installer for your machine
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Put the link on screen and let the room type it before you say anything else. The three cards are there so nobody has to ask which one applies to them, and the get-docker page is the single URL to fall back on if someone loses the thread. The steps on the next slides are Windows, because that is what most of this room runs; mac and Linux students follow their own page and rejoin at the verify step, which is identical on all three.',
  },
  {
    id: 'c8-installer',
    section: 'Installing Docker',
    label: 'The installer screen',
    element: (
      <ContentSlide
        kicker="Installing Docker"
        title="One Screen To Get Right"
        lead="Keep the default. It already uses WSL 2"
        lesson={SESSION}
      >
        {/* Real capture of Docker Desktop 4.86.0. Older guides describe a
            checkbox called "Use WSL 2 instead of Hyper-V"; it no longer exists,
            and a student hunting for it will stall. Cropped to the dialog only
            (R11), with one highlight on the option that matters.

            The crop is TIGHT to the dialog border: the original capture carried
            a strip of desktop wallpaper down the left and right edges, which
            read as a blue seam once the shot sat inside the `Shot` frame. Bounds
            were found by scanning for the light dialog against the dark desktop,
            not by eye, so the highlight percentages below still line up. */}
        {/*
          MARKED AS WINDOWS. This screen exists only in the Windows installer:
          the macOS installer has no configuration page at all, and Linux has no
          installer. Without the marker a mac student spends the slide looking
          for a dialog that will never appear on their machine.
        */}
        <div className="grid gap-4">
          {/*
            THE VERSION MOVED UP HERE, OUT OF THE SHOT'S CAPTION.

            `align-check.mjs` measured the caption "Docker Desktop 4.86.0" sitting
            under the deck's control bar: a 271 by 6px overlap at 64,648. The bar
            is painted on top of slide content, so the caption was legible only by
            luck. It says the same thing next to the platform marker, where there
            is room, and the shot keeps its `alt` for what it shows.
          */}
          <Chip tone="nw" className="w-fit gap-2">
            <img
              src="/assets/tech/windows.png"
              alt=""
              draggable={false}
              className="h-4 w-4 object-contain"
            />
            Windows only, Docker Desktop 4.86.0
          </Chip>
          <div className="grid grid-cols-[1fr_1.1fr] items-center gap-8">
          <Shot
            src="/shots/s4-installer-config.png"
            alt="Docker Desktop installer Configuration page with Per-user installation selected"
            highlight={{ left: 5.5, top: 24.4, width: 49.6, height: 6.2 }}
          />
          <div className="grid gap-3">
            <Callout kind="success" title="Per-user installation" asStep={false}>
              Needs no administrator password, and its own description says it uses the WSL 2
              backend. This is the one you want
            </Callout>
            <Callout kind="warning" title="Not all-users" asStep={false}>
              That one asks for a password and exists for Windows Containers, which this course
              does not use
            </Callout>
            </div>
          </div>
        </div>
      </ContentSlide>
    ),
    notes:
      'Show this so nobody hunts for a checkbox that was removed. On Windows Home there is no Hyper-V at all, so the per-user WSL 2 route is not merely recommended, it is the only one available. That is the same point as step 1: a container needs a Linux kernel to borrow, and on Windows the way to get one is WSL 2.',
  },
  {
    id: 'c8-engine-running',
    section: 'Installing Docker',
    label: 'Engine running',
    element: (
      /*
        THE CHECK THAT INSTALLING IS NOT THE SAME AS RUNNING.

        Docker Desktop can be installed, present in the Start menu and still have
        a stopped engine, in which case every command in the next session fails
        with a connection error that says nothing about the real cause. The whole
        slide exists for the two words in the bottom-left corner, so that is
        where the highlight goes.

        A REAL capture (R11), not a mock: this is the actual Docker Desktop
        window on a machine where the install worked.
      */
      <ContentSlide
        kicker="Installing Docker"
        title="Engine Running"
        lead="Open Docker Desktop. Check the status in the bottom-left corner"
        lesson={SESSION}
      >
        <div className="grid grid-cols-[1.35fr_1fr] items-center gap-8">
          {/*
            OVERVIEW THEN DETAIL, and both are crops of ONE real capture.

            The raw screenshot is 1919x1020 with roughly 300px of empty white
            between the last card and the status bar. Cutting that band out would
            be a splice, not a crop, and the rule here is that a shot is real. So
            the window is cropped at the end of its own content, and the status
            bar is shown again underneath at its own scale, where the two words
            this whole slide is about are actually readable from the back of a
            room.
          */}
          <div className="grid gap-3">
            <Shot
              src="/shots/s4-engine-running.png"
              alt="Docker Desktop with the Containers screen open and no containers yet"
              caption="Docker Desktop, first launch"
            />
            <Shot
              src="/shots/s4-engine-status.png"
              alt="The Docker Desktop status bar reading Engine running"
              highlight={{ left: 3, top: 42, width: 38, height: 44 }}
            />
          </div>
          <div className="grid gap-3">
            <Callout kind="success" title="Engine running" asStep={false}>
              This is the only confirmation that matters. Until it says this, no docker command
              will work
            </Callout>
            <Callout kind="info" title="An empty Containers list is correct" asStep={false}>
              Nothing has been built or run yet, so there is nothing to show here
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes:
      'Installed and running are two different states, and this is the slide that separates them. Have everyone open Docker Desktop now and look at the bottom-left corner: until it reads Engine running, every docker command fails with a connection error that says nothing about the real cause. The empty Containers list is expected, because nothing has been built yet. On a first launch the engine can take a minute to come up, so tell them to wait for the words rather than assuming it failed.',
  },
  {
    id: 'c9-divider',
    section: 'Proving It Works',
    label: '08 Divider',
    element: (
      // Typographic, like every other divider in this deck. The kit's
      // illustrations all belong to the Client and Server session and none
      // depicts this concept, and the style guide forbids reaching for an
      // unrelated one to fill space.
      <SectionBreakerSlide
        index={8}
        title="Proving It Works"
        lesson={SESSION}
      />
    ),
    notes:
      'Installed is not working. Two slides: run one command, then read what it actually did.',
  },
  {
    id: 'c9-start-and-verify',
    section: 'Proving It Works',
    label: 'Start and verify',
    element: (
      <ContentSlide
        kicker="Proving It Works"
        title="Start and Verify"
        lead="Skip the sign in, then verify from the VS Code terminal"
        lesson={SESSION}
      >
        <div className="grid gap-3">
          <Terminal
            path="C:\nxttrendz"
            fontSize={14}
            lines={[
              // Captured from a real install, 2026-08-12 (T6a). Version strings
              // age fast, so say out loud that theirs will differ.
              { text: 'docker --version', kind: 'cmd' },
              { text: 'Docker version 29.7.2, build a7dcaa6', kind: 'out' },
              { text: '', kind: 'out' },
              // NOT yet captured. Docker Desktop cannot run under VirtualBox
              // (Hyper-V/HCS unsupported in guest), so the hello-world pull is
              // still the canonical output quoted from the TR doc. Recorded as
              // an outstanding capture in workflow/assets-manifest.md.
              { text: 'docker run hello-world', kind: 'cmd' },
              { text: "Unable to find image 'hello-world:latest' locally", kind: 'out' },
              { text: 'latest: Pulling from library/hello-world', kind: 'out' },
              { text: 'Status: Downloaded newer image for hello-world:latest', kind: 'out' },
              { text: 'Hello from Docker!', kind: 'ok' },
            ]}
          />
          {/*
            TWO CALLOUTS SIDE BY SIDE, not stacked.

            Stacked, this slide overflowed its own frame by 300px. The terminal
            is the tallest thing here and it cannot shrink much further without
            the commands becoming unreadable from the back of the room, so the
            two notes go next to each other instead.

            The sign-in note earns its place: Docker Desktop opens on a Sign in
            screen, and on the capture machine that dialog sat in front of the
            engine so `docker --version` answered while `docker info` returned a
            500. The CLI is just a binary on PATH; only the real commands have to
            reach the engine.
          */}
          <div className="grid grid-cols-2 gap-3">
            <Callout kind="info" title="Skip the sign in" asStep={false}>
              Docker Desktop asks you to sign in. Choose skip, nothing here needs an account
            </Callout>
            <Callout kind="success" title="Hello from Docker!" asStep={false}>
              That line is the whole check. Your machine pulled an image and ran a container
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes:
      'Skip the sign-in dialog first: an account is not needed for anything in this course. If you see Hello from Docker!, you are done. Your machine can now run containers. Say out loud that their version number will differ from the one on screen. Worth knowing why this slide matters more than it looks: docker --version answers even when the engine is completely dead, because the CLI is just a binary on PATH, while every real command has to cross a named pipe to the engine. On the capture machine docker --version succeeded while docker info returned a 500, purely because a sign-in dialog was still gating Docker Desktop and the engine had never started. That is the sharper version of "installed and running are not the same thing". OUTSTANDING: the hello-world pull output is still quoted from the TR doc, not captured, because Docker Desktop cannot run under VirtualBox. See workflow/assets-manifest.md.',
  },
  {
    id: 'c9-what-installed',
    section: 'Proving It Works',
    label: 'What you installed',
    element: (
      <ContentSlide
        kicker="Proving It Works"
        title="What You Installed"
        lesson={SESSION}
      >
        {/*
          THREE PEERS, DRAWN AS PEERS. These are not a sequence: nothing is
          installed "after" anything else, and v2's own plan recorded them as a set
          and then had to work around a `FlowChart` that could not say so.
          `PeerCards` centres its row, so three cards sit in the middle of the stage,
          and each lands on its own click.
        */}
        <PeerCards
          points={[
            {
              id: 'engine',
              term: 'Engine',
              label: 'Docker Engine',
              body: 'The background service that builds images and runs containers',
              icon: 'settings',
              tone: 'lead',
              tag: 'this is Docker',
              detail:
                'Docker Engine IS "Docker". Everything else you just installed is packaging around it.',
            },
            {
              id: 'cli',
              term: 'CLI',
              label: 'The docker command',
              body: 'The CLI you type into PowerShell, how you talk to the engine',
              icon: 'terminal',
              tone: 'neutral',
              detail:
                'Every docker command is identical in PowerShell, CMD, macOS zsh and Linux bash. Every shell command they have typed so far forks per OS, and this one does not.',
            },
            {
              id: 'kernel',
              term: 'Kernel',
              label: 'WSL 2 Linux kernel',
              body: 'One small kernel, shared by every container',
              icon: 'server',
              tone: 'good',
              /* NOT "this one is free", the ramp's default: what matters about the
                 kernel here is that it is the piece being borrowed. */
              tag: 'the borrowed part',
              detail:
                'Containers need a Linux kernel to borrow, and Windows does not have one. This is the piece that makes the borrowing possible.',
            },
          ]}
        />

      </ContentSlide>
    ),
    notes:
      'Docker Engine IS "Docker"; everything else is packaging around it. Containers need a Linux kernel to borrow and Windows does not have one. Say the three names out loud and move on: the next slide reads the output they just saw.',
  },
  {
    id: 'c9-read-the-output',
    section: 'Proving It Works',
    label: 'Read your own output',
    element: (
      /*
        SPLIT OUT OF "What You Installed", AND THE REASON IS MEASURED.

        v2 carried the three installed pieces AND these two asides on one frame. As
        three `PeerCards` the pieces are 254px tall, and the two callouts under them
        came to about 200px more: the second one ran off the bottom of the frame and
        under the control bar, which a screenshot showed and no harness would have.

        The room also gets two ideas rather than one on a slide that used to carry
        three: what you installed, then what the command you ran actually did.
      */
      <ContentSlide
        kicker="Proving It Works"
        title="Read Your Own Output"
        lead="One line printed, and it was four steps"
        lesson={SESSION}
      >
        <div className="grid gap-4">
          <Callout kind="info" title="Read your own output" asStep={false}>
            Docker looked for an <strong>image</strong>, did not find it, pulled it from Docker Hub,
            then created a <strong>container</strong> from it. It printed one line and exited
          </Callout>
          <Callout kind="warning" title="The common Windows error" asStep={false}>
            <Code>error during connect</Code> means one thing: Docker Desktop is not running.
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Walk the four steps in the order Docker did them: looked for the image, did not find it, pulled it, made a container. The connect error is the one Windows failure worth naming, and it always means Docker Desktop is not running. On Linux a permission denied instead means sudo, or adding the user to the docker group.',
  },
  {
    id: 'c9-quiz',
    section: 'Proving It Works',
    label: 'Quiz Time',
    element: (
      /*
        The deck announces the quiz and stops there. The question is asked from
        the quiz tool, not from the slide, so there is one copy of it rather than
        two that can drift apart, and no answer is ever sitting on a slide the
        room has already seen.
      */
      <QuizTimeSlide lesson={SESSION} />
    ),
    notes:
      'Ask the question from the quiz tool and hold this slide while the room answers. The question for this beat: you run docker rm on a container, what happens to its image? The answer is nothing, the image is untouched, and you can create a fresh container from it immediately.',
  },
  {
    id: 'takeaways',
    section: 'Closing',
    label: 'Key takeaways',
    element: (
      <KeyTakeawaysSlide
        kicker="Key Takeaways"
        title={SESSION}
        lesson={SESSION}
        /* The agenda's four items, verbatim and in order. Not a paraphrase:
           the room was promised these four words at the start, so these four
           words are what the close should hand back. */
        /*
          THE AGENDA'S OWN LINES, CHARACTER FOR CHARACTER.

          Two things were wrong. The fourth item said "Docker Installation" where the
          agenda says "Installing Docker", which hard rule 20 forbids: the takeaways
          restate the agenda VERBATIM or the room is handed back something it was
          never promised. And the four `sub` lines were dropped, so a deck that opens
          by naming eleven concepts closed on four bare titles.

          `KeyTakeawaysSlide` passes `points` straight to `BulletList`, which has
          taken `{ text, sub }` all along, so this needed no component change.
        */
        points={[
          { text: 'Where Your App Lives', sub: 'One application, one machine' },
          {
            text: 'Containerization',
            sub: 'It works on my machine · ship the whole unit · different ground',
          },
          {
            text: 'Docker',
            sub: 'The tool · images and containers · the kernel it borrows',
          },
          { text: 'Installing Docker', sub: 'Install · start · prove it works' },
        ]}
      />
    ),
    notes:
      'Deliberately a different UI from the agenda, but the same four items in the same order, restated as things they can now do. If a point here does not map to an agenda item, it should not be on this slide.',
  },
  {
    id: 'practice',
    section: 'Closing',
    label: 'Practice',
    element: (
      /* Kept free of session-specific content on purpose: this frame is the same
         in every deck, so it can be lifted between sessions without editing. */
      <PracticeSlide
        kicker="Practice"
        title="Before the Next Session"
        prompt="Spend a little time with what you saw today"
        lesson={SESSION}
        tasks={[
          { text: 'Revisit today’s concepts', sub: 'Say each one back in your own words' },
          { text: 'Try the steps yourself', sub: 'On your own machine, start to finish' },
        ]}
      />
    ),
  },
  {
    id: 'next-session',
    section: 'Closing',
    label: 'Next session',
    element: (
      /*
        A section breaker with NO index: the deck has exactly four numbered
        sections and this is not a fifth. Dropping the numeral is what keeps the
        numbering honest while still using the frame the room already reads as
        "a new chapter starts here".
      */
      <SectionBreakerSlide
        kicker="Next session"
        title="Docker File Creation"
        lesson={SESSION}
      />
    ),
    notes:
      'Land the handover: today was understanding and installing, next time they write the recipe for their own project. Nothing to do between now and then except finish the install.',
  },
  {
    id: 'feedback',
    section: 'Closing',
    label: 'Feedback',
    element: <FeedbackSlide lesson={SESSION} />,
  },
  {
    id: 'thank-you',
    section: 'Closing',
    label: 'Thank you',
    element: <ThankYouSlide lesson={SESSION} />,
  },
]
