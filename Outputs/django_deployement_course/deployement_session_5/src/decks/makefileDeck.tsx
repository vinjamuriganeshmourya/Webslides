import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  CommandSyntaxSlide,
  ContentNoteSlide,
  ContentSlide,
  KeyTakeawaysSlide,
  QuestionSlide,
  SectionBreakerSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import { CodeBlock, DataTable, FileTree, Shot, SwapRows, Terminal } from '@/ui'
/* Session-owned figures, imported from their own files rather than through
   `@/ui`. `src/ui/index.ts` is kit-owned, so `sync-kit.mjs` overwrites it and
   the two re-export lines that used to live at its tail vanished on the sync
   that moved `lead` into `SlideLead` — the deck stopped compiling with
   "Module '@/ui' has no exported member 'AutomationLadder'". Importing the
   files directly keeps them out of the kit's way permanently. */
import { SpeedDial } from '@/ui/SpeedDial'
import { TargetAnatomy } from '@/ui/TargetAnatomy'
import { colors } from '@/design/tokens'

/**
 * Deployment · Session 5 "Automating Deployment with Makefile"
 *
 * Generated from the signed-off plan at
 * `django_deployement_course/session_plans/deployement_session_5/plan.md`.
 * The plan is the contract: slide ids here match the `id` column there, so a
 * reviewer can read the two side by side.
 *
 * BUILD RULES for this deck. Each exists because of something in the TR, the
 * guidelines, or a previous session that would otherwise be rendered wrong.
 *
 *   R1  TITLES ARE TOPIC-BARE AND TWO TO FOUR WORDS. The corpus median is two
 *       (`TEXT_GUIDELINES.md` §1). The first draft of the plan had seven-word
 *       editorial headlines on five slides and commas carrying second clauses on
 *       six; §9.1 of the plan records the rewrite. The section name is the
 *       kicker on every content slide, so a title never restates it.
 *
 *   R2  THE SAME ARTIFACT KEEPS THE SAME TITLE. `c2-first-target` and
 *       `c2-tab-rule` are the same two lines of the same file, and `c3-the-file`
 *       and `c3-final-makefile` are the same complete file. All are titled
 *       `Makefile`, because `TEXT_GUIDELINES.md` §4 says a build sequence repeats
 *       its title verbatim and never says "continued".
 *
 *       REFERENCES IN THIS FILE ARE SLIDE IDS, NOT NUMBERS. They were numbers
 *       until the 2026-09-03 review moved eleven slides, at which point every
 *       one of them pointed at the wrong frame, silently, in notes an instructor
 *       reads live. Session 4 learned this the same way.
 *
 *   R3  EVERY MAKEFILE CODE BLOCK PASSES `language="makefile"`. `CodeBlock`'s
 *       `language` prop DEFAULTS TO `'python'` and the same prop is the chip
 *       label, so eight slides would otherwise ship with a `python` chip on a
 *       Makefile. `c4-the-instruction` is the exception that takes no filename at all: it is
 *       pseudocode for an automation server, not a file in the project, and
 *       labelling it as one would be a small lie.
 *
 *   R4  THE TAB IS A REAL TAB. Every indented command in every code string below
 *       uses `\t`, not spaces, because the entire point of `c2-anatomy` through
 *       `c2-missing-separator` is
 *       that Make accepts exactly one indentation character. A deck that teaches
 *       the tab rule with spaces in its own panels is teaching the bug.
 *
 *   R5  WIDE OR TALL CHILDREN GET A `lead`. Carried from session 4's S5, where
 *       10 of 78 slides failed `video-safe.mjs` on the first sweep and every one
 *       was a lead-less slide with a full-width child reaching into the
 *       instructor-video rectangle (x 913..1280, y 0..220). Any slide here with a
 *       `CodeBlock`, `Terminal`, `DataTable`, `FileTree`, `SwapRows` or a
 *       figure carries a lead.
 *
 *   R6  THE `.PHONY` SURPRISE IS ASKED BEFORE IT IS ANSWERED. `c3-phony-question`
 *       asks what `make "build"` does when a folder named `build` exists and
 *       resolves nothing; `c3-phony-surprise` is the answer and `c3-phony-why` is
 *       the mechanism. Content rule 16: the question slide carries the question
 *       and nothing else, and the answer is the next slide.
 *
 *   R7  THE SECTION ON CI/CD IS GONE, AND NOTHING MAY REINTRODUCE IT. It ran
 *       as concept 4, "Makefile in CI/CD", fourteen slides teaching what CI and
 *       CD are and where a Makefile sits between them. It was cut whole on
 *       2026-09-03: *"Remove Makefile in CI/CD Section in whole from the Session
 *       5"*. Three slides were then kept back on the follow-up *"you can include
 *       the interface"*, and they live at the end of concept 3.
 *
 *       So this deck names no automation server, no pipeline and no CI/CD. That
 *       is content rule 4 holding at the level of a whole section: the problem
 *       exists, the room has not felt it yet, and a later session is where it
 *       gets opened. `src/ui/AutomationLadder.tsx` is now unreferenced and left
 *       in place, because it is the kit-promotion candidate this session's
 *       CLAUDE.md records.
 *
 *   R8  EVERY TRANSCRIPT IS QUOTED FROM THE TR, NOT CAPTURED. Docker Desktop
 *       cannot run on the capture machine, the same blocker that left sessions 1
 *       to 4 quoted. The ONE exception is `c3-test-it`, whose outputs the
 *       TR never produces because it never runs the finished file; its three
 *       lines are composed from outputs the TR shows elsewhere. That is the
 *       weakest panel in the deck and the plan's §5.4 says so out loud.
 */

export const makefileMeta: DeckMeta = {
  title: 'Automating Deployment with Makefile',
  course: 'React + Django Integration · Deployment',
  lesson: 'Automating Deployment with Makefile',
  presenter: 'NxtWave Instructor',
}

/** Footer text on every slide: the session name, never "Session 5". */
const SESSION = 'Automating Deployment with Makefile'

/*
  Section names. These are the kickers, and the agenda, and the dividers, and the
  takeaways, all from one place, so the four cannot drift apart.

  THEY NAME THE CONCEPT, NOT THE MOOD OF THE SECTION.

  They were "The Cost of Typing", "Writing Targets", "The Complete Makefile" and
  "Why This Matters for CI/CD", and the review replaced all four: *"Update Agenda
  with meaningful concept names."* The old set had two problems. "The Cost of
  Typing" names a feeling rather than a topic, so a learner scanning the agenda
  cannot tell that section 1 is about Makefiles at all; and "Why This Matters for
  CI/CD" is a sentence fragment about the section rather than the name of what is
  in it.

  THERE ARE THREE OF THEM NOW. `C4`, "Makefile in CI/CD", was cut with its whole
  section on 2026-09-03, so the agenda, the dividers and the takeaways all carry
  three items. Content rule 20 keeps the agenda and the takeaways
  verbatim-identical, and they read from these constants, so dropping one
  constant was the whole change.

  These are the user's own wording, verbatim. Note that they are longer than
  `TEXT_GUIDELINES.md` §4a's article-free form, and that §4a yields here: an
  explicit instruction outranks a guideline, and a question as a concept name is
  legitimate when the concept genuinely is a question the section answers.
*/
const C1 = 'Why Use a Makefile?'
const C2 = 'Defining Makefile Targets'
const C3 = 'Building a Complete Makefile'

/**
 * WHERE EVERY COMMAND IN THIS SESSION RUNS.
 *
 * `C:\nxttrendz` is the project root, and it is teaching content rather than
 * decoration: `c3-wrong-folder`'s whole diagnosis is that the prompt says `C:\Users\you`
 * instead. Content rule 15 applies to the difference between these two forms.
 * Doubled inside a JS string literal, single inside a JSX attribute.
 */
const AT_ROOT = 'C:\\nxttrendz'
const AT_HOME = 'C:\\Users\\you'

function Code({ children }: { children: ReactNode }) {
  return (
    <span
      className="whitespace-nowrap rounded-md px-1.5 py-0.5 font-mono"
      style={{ fontSize: '0.9em', background: 'rgba(45,99,251,0.10)', color: colors.brandDark }}
    >
      {children}
    </span>
  )
}

/**
 * A technology logo, always a PNG (content rule 12), at the size a row wants.
 *
 * THE PATHS ARE A STATIC MAP, AND THEY HAVE TO BE. The obvious version of this
 * helper is `src={`/assets/tech/${name}.png`}`, and it works in `npm run dev`
 * and in `npm run build`. It breaks in the only build that ships:
 * `scripts/inline-assets.mjs` finds assets by scanning the built HTML for
 * literal `/assets/...` paths, and a template literal is not one. The bundle
 * keeps `assets/tech/${i}.png` verbatim, nothing is inlined, and under `file://`
 * every icon is a broken image in the deck the instructor opens. Session 3
 * shipped with exactly that bug; session 4's S8 records it.
 *
 * Kept trimmed to what this deck renders: every entry is inlined whether a slide
 * uses it or not, and session 4 measured ten unused logos at 290 KB.
 */
const TECH_SRC = {
  docker: '/assets/tech/docker.png',
  makefile: '/assets/tech/makefile.png',
  windows: '/assets/tech/windows.png',
  macos: '/assets/tech/macos.png',
  linux: '/assets/tech/linux.png',
  git: '/assets/tech/git.png',
  vscode: '/assets/tech/vscode.png',
} as const

/*
  `inline`, NOT `inline-flex`, AND THAT IS THE WHOLE FIX.

  An `inline-flex` box takes its baseline from its FIRST flex item. Here that is
  an `<img>`, which has no text baseline, so the browser uses the image's bottom
  margin edge instead and the label beside it is set on a different baseline from
  the sentence it sits in. On `c1-what-is-make` that put the word "Makefile" visibly
  adrift in the middle of a callout, which is what the review called an alignment
  issue.

  Plain inline flow keeps the label on the paragraph's own baseline, and the
  image is nudged down a fifth of an em so its optical centre lands on the
  x-height rather than on the baseline. `whitespace-nowrap` keeps the mark and
  its word from being split across a line break.
*/
function Tech({ name, label, size = 20 }: { name: keyof typeof TECH_SRC; label?: string; size?: number }) {
  return (
    <span className="whitespace-nowrap">
      <img
        src={TECH_SRC[name]}
        alt=""
        draggable={false}
        style={{ height: size, width: size, verticalAlign: '-0.2em' }}
        className="mr-1.5 inline-block object-contain"
      />
      {label ? <span>{label}</span> : null}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   THE MAKEFILE, AS ONE SOURCE.

   Eight slides render this file at some stage of its growth. Each stage is a
   string here rather than a literal at the call site, because a hand-maintained
   copy per slide drifts, and the room reads the drift as a mistake in the file.
   Session 4's S10 records the same decision for its Compose file.

   Every indented line uses `\t`. See R4.
   ──────────────────────────────────────────────────────────────────────────── */

/** `c2-first-target` and `c2-tab-rule`: the first target, and nothing else. */
const MK_FIRST = `up:\n\tdocker compose up -d --build`

/** `c2-two-commands`: a target that holds two commands, in order. */
const MK_SETUP =
  `setup:\n` +
  `\tdocker compose up -d --build\n` +
  `\tdocker compose exec backend python manage.py migrate`

/** `c3-the-file`: every operation the project supports, one target each. */
const MK_SEVEN =
  `build:\n\tdocker compose build\n` +
  `up:\n\tdocker compose up -d --build\n` +
  `down:\n\tdocker compose down\n` +
  `logs:\n\tdocker compose logs -f backend\n` +
  `migrate:\n\tdocker compose exec backend python manage.py migrate\n` +
  `superuser:\n\tdocker compose exec backend python manage.py createsuperuser\n` +
  `shell:\n\tdocker compose exec backend bash`

/**
 * The variable, on the three targets that all name the same image.
 *
 * THESE THREE, AND NOT TAGGING OR PUSHING. The first version used
 * `build-image` and `run-image` and the slide before it said the name was needed
 * for "building it, tagging it, pushing it". The review cut that: *"We have not
 * discussed about Building it, tagging it, pushing it process."* Correct, and it
 * was rule 4 of the content rules broken in the friction statement itself, since
 * tagging and pushing are next session's material. Building, running and
 * removing are three things the room has already done by hand, so the repetition
 * is one they can feel rather than one they are told about.
 */
const MK_VARS =
  `BACKEND_IMAGE = nxttrendz-backend\n\n` +
  `build-image:\n\tdocker build -t $(BACKEND_IMAGE) ./backend\n\n` +
  `run-image:\n\tdocker run $(BACKEND_IMAGE)\n\n` +
  `remove-image:\n\tdocker rmi $(BACKEND_IMAGE)`

/** `c3-phony-line`: the line that declares the targets are commands, not files. */
const MK_PHONY = `.PHONY: build up down logs migrate superuser shell`

/**
 * The finished file: `.PHONY`, the variables, then the targets.
 *
 * BOTH IMAGES, NOT JUST THE BACKEND. The first version declared
 * `IMAGE_NAME = nxttrendz-backend` and stopped, and the review caught the
 * asymmetry: *"Only for backend we have mentioned image name, mention for
 * frontend."* This project has two services and every other part of the file
 * treats them as a pair, so one image variable read as an oversight rather than
 * as a decision. Naming both also makes the plural in the section's argument
 * true: variables, not a variable.
 */
const MK_FINAL =
  `${MK_PHONY}\n\n` +
  `BACKEND_IMAGE = nxttrendz-backend\n` +
  `FRONTEND_IMAGE = nxttrendz-frontend\n\n` +
  `${MK_SEVEN}`

/**
 * Last session's finished `docker-compose.yml`, copied verbatim from
 * `deployement_session_4/src/decks/runningRealAppDeck.tsx` (its stage 4). The
 * session opens on the file the room wrote, so the two decks have to agree
 * character for character. If session 4's file changes, this changes with it.
 */
const COMPOSE_FINAL = `services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - .env
    volumes:
      - db_data:/app/data
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      VITE_API_BASE_URL: http://localhost:8000
    depends_on:
      - backend
volumes:
  db_data:`

/** The 1-based line numbers in `code` whose text contains any of `needles`.
 *
 * `CodeBuildSlide.highlight` takes line NUMBERS, and hardcoding them is a bug
 * waiting for the file to gain a line: every highlight below the insertion moves
 * onto the wrong row, with no type error and no harness complaint. Session 4's
 * S10 records the day that happened. */
function hl(code: string, ...needles: string[]): number[] {
  return code
    .split('\n')
    .map((line, i) => (needles.some((n) => line.includes(n)) ? i + 1 : 0))
    .filter((n) => n > 0)
}

export const makefileDeck: SlideDef[] = [
  /* ══ FRONT FRAME (1 to 6) ═══════════════════════════════════════════════ */
  {
    id: 'brand',
    section: 'Opening',
    label: 'Brand',
    element: <BrandSlide greeting="Welcome" lesson={SESSION} />,
    notes: 'On screen while the room settles. The mark and the welcome, nothing else.',
  },
  {
    id: 'welcome',
    section: 'Opening',
    label: 'Session name',
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
    notes: 'The session name and only the session name.',
  },
  {
    id: 'recap-compose',
    section: 'Opening',
    label: 'Last session, the file',
    element: (
      <ContentSlide
        kicker="Recap"
        title="Where we Left Off"
        lead="Real project moved into Compose, and this is the file you finished with"
        points={[
          { text: 'Two services, each built from its own Dockerfile' },
          { text: <>{'The doors are open: '}<Code>ports</Code>{' on both'}</> },
          { text: <>{'Secrets sit in the '}<Code>.env</Code>{' file, read automatically'}</> },
          { text: <>{'The database lives in the '}<Code>db_data</Code>{' volume'}</> },
        ]}
        lesson={SESSION}
      >
        <CodeBlock code={COMPOSE_FINAL} filename="docker-compose.yml" language="yaml" fontSize={11} />
      </ContentSlide>
    ),
    notes:
      'Their own file, unchanged. Open on what they wrote rather than on a summary of it. Same file as session 4\u2019s `c3-complete-file`.',
  },
  {
    id: 'agenda',
    section: 'Opening',
    label: 'Agenda',
    element: (
      <AgendaSlide
        title="Today's Agenda"
        items={[
          { title: C1, sub: 'Understanding the problem of repeatedly typing commands' },
          { title: C2, sub: 'How targets organize commands into simple tasks' },
          { title: C3, sub: 'Putting project commands together in one place' },
        ]}
        lesson={SESSION}
      />
    ),
    notes: 'Four concepts, one per section of the doc. The recap at the end restates these same four as outcomes.',
  },

  /* ══ CONCEPT 1 · Long Commands, Typed Daily (7 to 18) ═══════════════════ */
  {
    id: 'c1-divider',
    section: C1,
    label: 'Divider 1',
    element: <SectionBreakerSlide index={1} title={C1} subtitle="And what Make is" lesson={SESSION} />,
    notes: 'Hand over verbally: "so how much typing does a day on this project actually cost you?"',
  },
  {
    id: 'c1-the-daily-five',
    section: C1,
    label: 'The daily five',
    element: (
      <ContentSlide
        kicker={C1}
        title="Daily Five"
        lead="An ordinary development day on this project, in five commands"
        lesson={SESSION}
      >
        <Terminal
          path={AT_ROOT}
          caption="All five run from the project root"
          lines={[
            { text: 'docker compose up -d --build', kind: 'cmd' },
            { text: 'docker compose exec backend python manage.py migrate', kind: 'cmd' },
            { text: 'docker compose exec backend python manage.py createsuperuser', kind: 'cmd' },
            { text: 'docker compose logs backend', kind: 'cmd' },
            { text: 'docker compose down', kind: 'cmd' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Do not explain them. They are all commands the room already knows. The only new information on this slide is how they look stacked on top of one another.',
  },
  {
    id: 'c1-cost-length',
    section: C1,
    label: 'Cost 1, length',
    element: (
      <ContentSlide
        kicker={C1}
        title="Command Length"
        lead="Every one of them is 40 or more characters, and one is 51"
        points={[
          { text: 'Long enough to mistype, and you do' },
          { text: 'A typo costs a re-read, not an error message' },
          { text: 'Nothing about the length teaches anyone anything' },
        ]}
        lesson={SESSION}
      >
        <div className="rounded-card border border-line bg-surface p-6 text-center shadow-card-soft">
          <p className="whitespace-nowrap font-mono text-[11.5px] font-semibold" style={{ color: colors.ink }}>
            docker compose exec backend python manage.py migrate
          </p>
          <p className="mt-4 font-heading text-[56px] font-extrabold leading-none" style={{ color: colors.accentDark }}>
            51
          </p>
          <p className="mt-1 font-heading text-body-sm font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
            characters
          </p>
        </div>
      </ContentSlide>
    ),
    notes: 'The count against the command. A picture of a long string is the string.',
  },
  {
    id: 'c1-cost-recall',
    section: C1,
    label: 'Cost 2, recall',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="Exact Recall"
        /* "the room" is presenter vocabulary that leaked onto the slide, and
           "has genuinely stopped to think about" describes the audience rather
           than the material. The line now names what the slide is about: two
           details that have to be typed exactly. */
        lead="Two details you have to type exactly, every time"
        points={[
          { text: <>{'Which was it: '}<Code>-d --build</Code>{' or '}<Code>--build -d</Code></> },
          { text: <>{'Does migrate take '}<Code>exec backend</Code>{' or '}<Code>run backend</Code></> },
        ]}
        note={{
          kind: 'warning',
          title: 'Cost',
          body: 'Command has to be remembered character for character, every day, by everyone.',
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'Ask both out loud and wait. Someone will get the second one wrong, which is the point: run creates a new container, exec uses the running one.',
  },
  {
    id: 'c1-cost-variation',
    section: C1,
    label: 'Cost 3, variation',
    element: (
      /*
        THE REVIEW'S OWN COPY, PLUS THE MAIN IDEA IT ASKED FOR.

        The bullets were written as observations about other people -- "each
        teammate invents their own variation", "the answer lives in chat, and
        chat scrolls" -- which is a diagnosis the room has to accept on trust. The
        replacements are the same four facts stated plainly, and the callout is
        the "main idea" line the review supplied: the section's whole argument in
        one sentence, which is what makes this beat 3 of the four beats rather
        than a second helping of beat 2.
      */
      <ContentNoteSlide
        kicker={C1}
        title="Team Variations"
        /* "keystrokes" counted something nobody counts. The review asked for
           plain words, and the cost this slide is about was never a typing cost
           in the first place: it is that everyone types something different. */
        lead="This cost has nothing to do with typing"
        points={[
          { text: 'Everyone runs the project differently' },
          { text: 'Flags and options may be missed' },
          { text: 'Same "How do I run this?" question repeats' },
          { text: 'Instructions get lost in chat' },
        ]}
        note={{
          kind: 'success',
          title: 'Main idea',
          body: 'We want a file that gives the whole team one standard way to run commands.',
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'This is the cost that matters most on a real team, and the one a shortcut on your own machine does not fix. Land the main idea slowly: a file, in the project, one standard way. Those three conditions are what rule a shell alias out on the next slide.',
  },
  {
    id: 'c1-question',
    section: C1,
    label: 'The question',
    element: (
      <QuestionSlide
        kicker={C1}
        question="Can we give every long command a short name?"
        qualifier="Saved in the project itself, and shared by the whole team"
        lesson={SESSION}
      />
    ),
    notes: 'Ask the hero line and wait. Read the qualifier only if the room answers too fast, because those two conditions are what rules a shell alias out. Do not answer it here. The answer is the next slide.',
  },
  {
    /*
      THE STORY FIRST, THE MAPPING SECOND.

      This was one `AnalogyMap` carrying both halves at once: four rows of
      "phone thing" beside "Makefile thing", which is the analogy asserted rather
      than told. The review asked for a person: *"give slide of name a character,
      kiran has speed dial of multiple numbers in his phone. 1 means mom, 2 means
      dad and 3 means sister. now he dont remember the number he just hits those
      numbers."*

      So it is two slides now. This one is Kiran, and it mentions neither Make nor
      Docker: an analogy that arrives already labelled with its answer is not an
      analogy, it is a table. The next slide does the mapping, once the room has
      the picture.
    */
    id: 'c1-speed-dial',
    section: C1,
    label: 'Speed dial',
    element: (
      <ContentSlide
        kicker={C1}
        title="Speed Dial"
        lead="Kiran has three numbers on speed dial"
        lesson={SESSION}
      >
        <SpeedDial />
      </ContentSlide>
    ),
    notes:
      'Tell it as a story, not as an analogy. Ask the room how many of their own family numbers they could recite from memory, and wait for the laugh. Do not mention Make on this slide: the next one is where the two halves meet, and it lands much harder if nobody has pre-empted it.',
  },
  {
    id: 'c1-speed-dial-map',
    section: C1,
    label: 'Same idea, our commands',
    element: (
      <ContentSlide
        kicker={C1}
        title="Same Idea, Our Commands"
        lead="We can map the commands we run every day to short words of our own"
        lesson={SESSION}
      >
        {/*
          `SwapRows`, NOT `AnalogyMap`.

          Chosen in `slide-kit/comparison-lab` over three other candidates after
          the review rejected the rendered `AnalogyMap` on `c3-interface-map`.
          Two boxes with an arrow between them are three objects, and the eye
          counts three things before being told they are one; here a pairing is
          one object with the familiar side recessed into it and the new side
          raised out of it.

          It fits this slide for the same reason it fits slide 43: Kiran's phone
          does not COMPETE with our project, it stands in for it, and the
          recessed-to-raised inversion is exactly that claim.
        */}
        <SwapRows
          leftLabel="Kiran's phone"
          rightLabel="Our project"
          pairs={[
            { from: 'Long phone number', to: 'docker compose up -d --build', code: true },
            { from: 'Speed-dial key 1', to: 'Short word of our own, "up"' },
            { from: 'He presses 1', to: 'We type make "up"' },
            { from: 'Saved once, in his phone', to: 'Saved once, in the project' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Read it row by row, left then right. The last row is the one that matters and it lands last: Kiran\u2019s speed dial only helps Kiran, and a file saved in the project helps everyone who clones it. That is the difference between a shortcut on your machine and a Makefile, and it is why the next slide is about a file.',
  },
  {
    id: 'c1-what-is-make',
    section: C1,
    label: 'What is Make?',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="What is Make?"
        lead="One tool, one file, one short name per command"
        noteFirst
        note={{
          kind: 'info',
          title: 'Definition',
          body: (
            <>
              {'Make is a command-line tool from 1976. It reads a file named '}
              <Tech name="makefile" label="Makefile" />
              {' in the current folder, where each '}
              <strong>target</strong>
              {' maps a short name to one or more shell commands.'}
            </>
          ),
        }}
        lesson={SESSION}
      >
        {/*
          LEFT-ALIGNED, NOT CENTRED.

          The review flagged this slide for alignment. There were three different
          left edges on it: the lead started at the slide datum, the callout at
          the well's edge, and this panel floated in the middle on `mx-auto`,
          which is a fourth thing for the eye to find. `mr-auto` puts its left
          edge on the same line as everything above it, and the panel keeps its
          cap so it does not run under the instructor-video rectangle.
        */}
        <div className="mr-auto max-w-[720px]">
          <CodeBlock
            code={'make <target>     # runs the commands saved under <target>'}
            language="bash"
            fontSize={17}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Read the definition off the card, then the usage line. Older than Python, which was 1991. Say "target" slowly: it is the word the next thirty slides use.',
  },
  {
    id: 'c1-make-on-windows',
    section: C1,
    label: 'Installing make',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="Installing Make"
        lead={<><>{'Two of the three machines here already have it, and the proof on any of them is '}</><Code>make --version</Code>{' printing a version line'}</>}
        note={{
          kind: 'warning',
          title: 'Watch out',
          body: 'On Windows, reopen the terminal after installing, or make is not on the PATH yet and the next command still errors.',
        }}
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <DataTable
            columns={[
              { label: '', weight: 0.9 },
              { label: 'Already there?', weight: 1.2 },
              { label: 'If it is not', weight: 1.6 },
            ]}
            rows={[
              [
                <Tech name="linux" label="Linux" />,
                'Yes on most distributions',
                <Code>sudo apt install make</Code>,
              ],
              [
                <Tech name="macos" label="macOS" />,
                'Yes, once the developer tools are installed',
                <Code>xcode-select --install</Code>,
              ],
              [
                <Tech name="windows" label="Windows" />,
                'No, Windows does not ship it',
                <Code>winget install GnuWin32.Make</Code>,
              ],
            ]}
            highlight={[3]}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Ask for a show of hands by operating system first, then run the row that applies. choco install make works too on Windows if they already have Chocolatey, and older Ubuntu images may need build-essential. Wait for the room to confirm the version line before moving on.',
  },

  /* ══ CONCEPT 2 · Writing Targets (19 to 28) ═════════════════════════════ */
  {
    /*
      THE INSTALL COMMAND, EXPLAINED RATHER THAN PRINTED.

      The previous slide's table gives Windows the line
      `winget install GnuWin32.Make` in a cell and moves on, and the review asked
      for the explanation that was missing. It is the one row of that table most
      of the room will actually run, and every part of it is unfamiliar: `winget`
      is a tool they have never used, and `GnuWin32.Make` is a package id with
      capital letters in the middle that looks like a typo.

      `CommandSyntaxSlide` is the right type here and `Terminal` is the wrong
      one. This is the SHAPE of a command being taught, not a transcript of a run:
      there is no output to show, and a terminal panel with a command and no
      output reads as a command that printed nothing.
    */
    id: 'c1-winget-anatomy',
    section: C1,
    label: 'The install command',
    element: (
      <CommandSyntaxSlide
        kicker={C1}
        title="Installing on Windows"
        /* TWO LINES, DELIBERATELY. A one-line lead left the specimen panel's top
           edge at y=212, twelve pixels inside the instructor-video rectangle, and
           `video-safe.mjs` failed the deck on it. A second line of lead is the
           lever the generate-slides skill names for exactly this: it grows the
           header and the panel follows it down. */
        lead="Three parts, and only the first two are words you could guess. The third is an exact id, matched character for character"
        parts={[
          {
            token: 'winget',
            label: 'Tool',
            body: 'Windows\u2019 own package manager, built into Windows 10 and 11, which installs software from the terminal',
          },
          {
            token: 'install',
            label: 'What to do',
            body: 'Downloads the package and puts its programs on your PATH, so a terminal can find them by name',
          },
          {
            token: 'GnuWin32.Make',
            label: 'Package id',
            body: 'This is the id of the GNU Make build for Windows, typed exactly as shown, capitals included',
          },
        ]}
        /*
          NO NOTE, AND THE POINT DID NOT VANISH.

          This carried a warning about opening a new terminal after installing,
          which is true and was in the wrong place twice over. It is off-topic on
          a slide whose job is the grammar of one command, and it was being said
          one slide before the room could act on it.

          It is the lead and the callout of `c1-make-check` now, which is where
          the terminal actually gets opened. Saying it on both would be saying it
          twice in a row, which is how a warning stops being read.

          A `{ / * * / }` container is only legal in JSX CHILDREN position. Among
          attributes on a self-closing tag it is a syntax error, which is what the
          first attempt at this comment produced.
        */
        lesson={SESSION}
      />
    ),
    notes:
      'Run it live if anyone is on Windows without Make. Say the PATH point out loud rather than leaving it on the slide: nearly every learner who reports "it still says make is not recognised" is typing into the same terminal they installed from. The version line is the proof, and nobody moves on without it.',
  },
  {
    /*
      SUCCESS ONLY. THE ERROR GETS ITS OWN FRAME.

      This carried both outcomes side by side and the review split them: *"for
      this scenario 1 slide must only have success case and follow should have if
      you encountered error like below follow."*

      Right, and it is content rule 5 rather than a preference. Two panels showing
      one command's two outcomes is two ideas, and the room reading the failure
      panel is a room that has stopped looking at the one it is aiming for. This
      slide is the target: run it, see a version line, move on. The failure is a
      branch, and a branch is a different slide.

      NO REFERENCE TO SLIDE POSITION. Content rule 22: nothing in rendered copy
      says "the next slide", because slide order changes and a slide that names
      its neighbour is wrong the moment one is inserted. It cost three strings in
      this deck alone to learn that.

      THE VERSION IS 3.81, NOT 4.4.1. GnuWin32's Make is the 2006 build, which is
      what the review's own screenshot shows: `make.exe` dated 25-11-2006. Worth
      confirming on a real Windows machine -- see the speaker notes.
    */
    id: 'c1-make-check',
    section: C1,
    label: 'Check it in a terminal',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="Check make in a Terminal"
        /* A NEW terminal, and the review asked for it by name. This is the
           difference between the room checking their install and half the room
           believing it failed. */
        lead={<>{'Open a '}<strong>{'new'}</strong>{' terminal in VS Code, or reopen VS Code, then run '}<Code>make --version</Code></>}
        note={{
          kind: 'warning',
          /* The reason, because the instruction on its own reads like
             superstition. Moved here from the winget slide, where it was a slide
             too early to act on. */
          title: 'A terminal opened before the install cannot find it',
          body: 'PATH is read once when a terminal starts, so the window you installed from returns the error even though the install worked',
        }}
        lesson={SESSION}
      >
        {/* FULL WIDTH. At 720px the panel ended at x=780 while the callout ran
            to x=1216, so the slide had two different right edges. Sharing the
            well's width puts both blocks on the same left AND right line. */}
        <div>
          <Terminal
            path="C:\nxttrendz"
            caption="What you should see"
            fontSize={14}
            lines={[
              { text: 'make --version', kind: 'cmd' },
              { text: 'GNU Make 3.81', kind: 'ok' },
              { text: 'Copyright (C) 2006  Free Software Foundation, Inc.', kind: 'out' },
            ]}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Have the whole room run it now. Say "in a terminal" out loud: a learner who has just clicked through the winget install has no reason to know that verifying it means opening one. CONFIRM THE VERSION before you teach this: 3.81 is GnuWin32\u2019s 2006 build and matches the make.exe timestamp in the capture two slides on, but if the room reports a different number, that number is the truth and this panel should be corrected. Ask for hands from anyone who did NOT get a version line, and take them through the two slides that follow.',
  },
  {
    /*
      THE BRANCH. Only the people who hit it follow the two slides after this.

      Asked for in exactly this shape: *"follow should have if you encountered
      error like below follow."* So the slide states the condition first and shows
      the error second, which is the order a learner reads it in when they are
      checking whether it applies to them.

      The transcript is quoted from the review's screenshot. The cause is the
      callout because it is the thing that makes the fix make sense: the install
      worked, and PATH is what did not happen.
    */
    id: 'c1-make-error',
    section: C1,
    label: 'If you get an error',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="If You See This Instead"
        lead="No version line, and an error saying the command does not exist"
        note={{
          kind: 'warning',
          title: 'Make installed, and Windows cannot find it',
          body: 'winget put make.exe on the disk and did not add its folder to PATH, so the shell has nowhere to look. Two steps fix it: find where it installed, then add that folder',
        }}
        lesson={SESSION}
      >
        <div>
          <Terminal
            path="C:\nxttrendz"
            caption="Error, quoted from a real machine"
            fontSize={14}
            lines={[
              { text: 'make --version', kind: 'cmd' },
              /* `err`, so these two lines are RED, which is what the console
                 prints and what the review asked for. The kind was added to the
                 kit's `Terminal` for this: a console error rendered in the same
                 grey as ordinary output loses the one cue a learner scans for. */
              { text: "make : The term 'make' is not recognized as the name of", kind: 'err' },
              { text: 'a cmdlet, function, script file, or operable program.', kind: 'err' },
            ]}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Only the hands that went up on the check need this. Read the cause off the callout: the install worked, and nothing told Windows where it put the program. If nobody in the room hit it, say that it will happen on somebody\u2019s machine eventually and move through the two fix slides quickly rather than skipping them.',
  },
  {
    /*
      FIND IT. One panel, one command, one answer.

      Split from the check because it belongs to the fix, and split from the PATH
      dialog because a terminal and a screenshot of a Windows dialog on one frame
      is two artefacts competing for the same attention.

      THE ADMINISTRATOR SHELL IS THE POINT, not a detail. Run this in an ordinary
      terminal and it returns nothing, at which point a learner concludes Make
      never installed and starts over. The prompt path is on the panel for exactly
      that reason (content rule 3).
    */
    id: 'c1-make-find',
    section: C1,
    label: 'Find make.exe',
    element: (
      /*
        NO POINTS BESIDE THE PANEL, AND THAT IS A LAYOUT CONSTRAINT.

        `ContentSlide` puts `points` and `children` side by side in a 1.4fr / 1fr
        grid, which left this terminal about 400px wide. The command is 71
        characters plus its prompt, so it wrapped, and `align-check.mjs` reports a
        wrapped mono token because a command broken over two lines is exactly what
        a learner mistypes. Dropping to 10px did not save it and 7px would not be
        readable.

        So the panel gets the whole width and the two points become the lead and
        the callout. The command sits on one line at 12px with room to spare.
      */
      <ContentNoteSlide
        kicker={C1}
        title="Find Where It Installed"
        lead={<>{'Search the disk for make.exe, then copy the folder from the '}<Code>Directory</Code>{' line'}</>}
        note={{
          kind: 'warning',
          title: 'Administrator PowerShell, not the ordinary terminal',
          body: 'An ordinary one returns nothing, and an empty result looks exactly like Make never installing',
        }}
        lesson={SESSION}
      >
        {/* A STANDALONE WINDOWS SHELL, NOT THE EDITOR'S PANEL. The review caught
            it: this slide tells the room to open an Administrator PowerShell and
            was drawing VS Code's integrated terminal, which is a different
            application. The title bar carries "Administrator" because elevation
            is the whole reason the slide exists -- an unelevated search returns
            nothing. `chrome` was added to the kit's `Terminal` for this. */}
        <Terminal
          path="C:\WINDOWS\system32"
          chrome="powershell"
          title="Administrator: Windows PowerShell"
          caption="One search, and the folder you need"
          fontSize={12}
          lines={[
            { text: 'Get-ChildItem C:\\ -Filter make.exe -Recurse -ErrorAction SilentlyContinue', kind: 'cmd' },
            { text: '', kind: 'out' },
            { text: '    Directory: C:\\Program Files (x86)\\GnuWin32\\bin', kind: 'ok' },
            { text: '', kind: 'out' },
            { text: '-a----   25-11-2006   06:58   175104  make.exe', kind: 'out' },
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Run it live. It takes a few seconds because it walks the whole of C:. The -ErrorAction SilentlyContinue is what stops it filling the screen with permission errors on folders the search cannot read, so leave it in. The Directory line is the only line that matters and the next slide is where it goes.',
  },
  {
    /*
      THE REAL DIALOG, CAPTURED, NOT DESCRIBED.

      This slide was four steps of prose and the review rejected it: *"add Proper
      screenshot or relavant Windows, instead of just sentence and steps"*. Fair.
      "Add it to Path, under System or User environment variables" is a sentence
      about a window, and a learner who has never opened that window cannot act
      on it -- the whole difficulty is finding the right box among the four nested
      dialogs Windows buries it in.

      THE CAPTURE IS REAL (content rule 11). Taken on the Windows 11 VM on this
      machine, driven to `rundll32 sysdm.cpl,EditEnvironmentVariables`, with
      `C:\Program Files (x86)\GnuWin32\bin` typed into a new Path entry and the
      row left in its edit state. Then cancelled, so nothing was written to that
      VM. It is cropped to the one window that matters and the new entry carries
      the highlight box, which is exactly what rule 11 asks for: never a
      full-window screenshot where a crop would do.

      `public/shots/windows-path-edit.png`. This is the FIRST screenshot in this
      session, so `public/shots/` is new here.
    */
    id: 'c1-make-path-fix',
    section: C1,
    label: 'Add it to PATH',
    element: (
      <ContentSlide
        kicker={C1}
        title="Put That Folder on PATH"
        lead="Paste the folder into Path as a new entry, then restart VS Code"
        /* The "copy the folder" step moved to `c1-make-find`, where the
           Directory line it copies from is actually on screen. Three steps here,
           and the last one is the one everybody skips. */
        points={[
          { text: 'Search Windows for "environment variables" and open Path' },
          { text: 'New, then paste the folder, then OK on every dialog' },
          {
            text: 'Restart VS Code, then run make --version again',
            sub: 'PATH is read once when a terminal starts, so every window open before this still cannot find make',
            tone: 'brand',
          },
        ]}
        lesson={SESSION}
      >
        {/*
          CAPPED AT 330px, AND THE CAP IS THE FIX.

          Uncapped it filled its column at 463x437 with its top edge at y=205,
          fifteen pixels inside the instructor-video rectangle
          (x 913..1280, y 0..220), and its caption then landed under the footer
          mark. `video-safe.mjs` and `align-check.mjs` both failed it.

          Capping the WIDTH is the right lever rather than a guard on the column:
          the capture is nearly square, so 330px makes it about 311px tall, which
          fits the well with room to centre. `ContentSlide` applies its own
          `pt-[52px]` visual guard only to a LEAD-LESS slide, and this one has a
          lead.
        */}
        <Shot
          src="/shots/windows-path-edit.png"
          alt="The Windows Edit environment variable dialog, with the GnuWin32 bin folder added as a new Path entry"
          caption="User variables, Path, Edit"
          highlight={{ left: 3, top: 28, width: 76, height: 5.5, label: 'Your new entry' }}
          className="mx-auto max-w-[330px]"
        />
      </ContentSlide>
    ),
    notes:
      'The screenshot is the slide. Point at the highlighted row and say that is what they are aiming for, then let them find their way to that window themselves, because they will have to next time. Step four is the one everybody skips: somebody will paste the path, run make --version in the same window, get the same error and conclude the fix did not work. Say it before they do it, then wait for a version line from every Windows machine in the room.',
  },
  {
    id: 'c2-divider',
    section: C2,
    label: 'Divider 2',
    element: <SectionBreakerSlide index={2} title={C2} subtitle="A name, a colon, and one tab" lesson={SESSION} />,
    notes: 'Hand over: "you know what a Makefile does. You have never written a line of one. What does a line look like?"',
  },
  {
    id: 'c2-where-it-lives',
    section: C2,
    label: 'Where it lives',
    element: (
      <ContentSlide
        kicker={C2}
        title="Where It Lives"
        lead={<><Tech name="makefile" label="Makefile" />{', capital M, no extension, in the project root beside docker-compose.yml'}</>}
        points={[
          { text: <>{'Name the file '}<Code>Makefile</Code>{', with no extension'}</> },
          { text: 'It goes in the project root, because its commands run from there' },
          { text: <>{'Same folder as '}<Code>docker-compose.yml</Code></> },
        ]}
        lesson={SESSION}
      >
        <FileTree
          root={AT_ROOT}
          entries={[
            { name: 'backend', folder: true, state: 'existing' },
            { name: 'frontend', folder: true, state: 'existing' },
            { name: 'docker-compose.yml', state: 'existing', note: 'last session' },
            { name: '.env', state: 'existing' },
            { name: 'Makefile', state: 'new', note: 'today' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'The tree is the answer to "where does this go". Point at the position: beside the Compose file, not inside backend.',
  },
  {
    id: 'c2-first-target',
    section: C2,
    label: 'The first target',
    element: (
      <ContentSlide
        kicker={C2}
        title="Makefile"
        lead="A whole target is only two lines long"
        lesson={SESSION}
      >
        <div className="mx-auto max-w-[760px]">
          <CodeBlock code={MK_FIRST} filename="Makefile" language="makefile" fontSize={18} />
        </div>
      </ContentSlide>
    ),
    notes: 'Two lines. Nothing to build up to, so show it whole and then take it apart on the next slide.',
  },
  {
    id: 'c2-anatomy',
    section: C2,
    label: 'Target anatomy',
    element: (
      <ContentSlide
        kicker={C2}
        title="Target Anatomy"
        lead="Three parts, and the third one has no glyph in your editor"
        lesson={SESSION}
      >
        <TargetAnatomy />
      </ContentSlide>
    ),
    notes:
      'Walk the three boxes left to right. Land on the third and stay there: the arrow is drawn so you can talk about a character nobody can see.',
  },
  {
    id: 'c2-tab-rule',
    section: C2,
    label: 'The tab rule',
    element: (
      <ContentNoteSlide
        kicker={C2}
        title="Makefile"
        lead="That indentation must be a real TAB character, and spaces will not work"
        note={{
          kind: 'warning',
          title: 'Watch out',
          body: (
            <>
              {'Some editors silently convert tabs to spaces as you type. In '}
              <Tech name="vscode" label="VS Code" />
              {', a Makefile is exempt by default, but check the status bar if that error ever happens to you.'}
            </>
          ),
        }}
        lesson={SESSION}
      >
        <div className="mx-auto max-w-[760px]">
          <CodeBlock
            code={MK_FIRST}
            filename="Makefile"
            language="makefile"
            fontSize={18}
            highlight={hl(MK_FIRST, 'docker compose')}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Same file as the previous slide, same title, one line lit. The repeated title is how the deck says "still the same file".',
  },
  {
    id: 'c2-missing-separator',
    section: C2,
    label: 'Missing separator',
    element: (
      <ContentSlide
        kicker={C2}
        title="Missing Separator"
        lead="Use spaces and you get the single most famous error in Make's history"
        points={[
          { text: 'It never mentions tabs, or spaces, or indentation' },
          { text: 'Check the indentation first, before anything else' },
          { text: 'Name it now, so you recognise it later' },
        ]}
        lesson={SESSION}
      >
        <Terminal
          path={AT_ROOT}
          caption="This one error is the whole diagnosis"
          lines={[
            { text: 'make up', kind: 'cmd' },
            { text: 'Makefile:2: *** missing separator.  Stop.', kind: 'out' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Meeting this here is cheaper than meeting it alone at 11pm. Say the trap by name: "missing separator means check your indentation", and say it twice.',
  },
  {
    id: 'c2-first-run',
    section: C2,
    label: 'First run',
    element: (
      <ContentSlide
        kicker={C2}
        title="First Run"
        lead="Get the tab right and two words bring the whole stack up"
        lesson={SESSION}
      >
        <Terminal
          path={AT_ROOT}
          caption="Watch the first line of the output"
          lines={[
            { text: 'make up', kind: 'cmd' },
            { text: 'docker compose up -d --build', kind: 'out' },
            { text: '[+] Running 2/2', kind: 'out' },
            { text: ' Container nxttrendz-backend-1   Started', kind: 'ok' },
            { text: ' Container nxttrendz-frontend-1  Started', kind: 'ok' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Point at the second line before anything else. The room typed "make up" and the terminal printed the long command back at them. That is the next slide.',
  },
  {
    id: 'c2-make-echoes',
    section: C2,
    label: 'Make echoes',
    element: (
      <ContentNoteSlide
        kicker={C2}
        title="Make Echoes"
        lead="Make prints each command before it runs it"
        points={[
          { text: 'You always see what actually executed' },
          { text: 'A shortcut that hides the command teaches you nothing' },
          { text: 'Two words in, one long command out' },
        ]}
        note={{
          kind: 'tip',
          title: 'Why it matters',
          body: 'A Makefile is a shortcut and not a black box, so the command it ran is on screen every time, ready to learn from, debug or copy out.',
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'This is the anti-magic beat for Make itself. Nothing is hidden: the tool types the long command for you and shows you what it typed.',
  },
  {
    id: 'c2-two-commands',
    section: C2,
    label: 'Two commands',
    element: (
      <ContentSlide
        kicker={C2}
        title="Two Commands"
        lead="A target can hold several commands, and it runs them in order, one per line"
        lesson={SESSION}
      >
        <div className="mx-auto max-w-[860px]">
          <CodeBlock code={MK_SETUP} filename="Makefile" language="makefile" fontSize={16} />
        </div>
      </ContentSlide>
    ),
    notes:
      'In order matters. Migrate cannot run before the container is up, and the file encodes that ordering permanently.',
  },
  {
    id: 'c2-one-word-setup',
    section: C2,
    label: 'One word setup',
    element: (
      <ContentNoteSlide
        kicker={C2}
        title="One Word Setup"
        lead={<><Code>make setup</Code>{' now brings the stack up and migrates it'}</>}
        points={[
          { text: 'Covers the whole first day on a new machine' },
          { text: 'Written once, by whoever knew the order' },
          { text: 'Nobody has to be told the order again' },
        ]}
        note={{
          kind: 'success',
          title: 'Remember',
          body: 'This is automation in its simplest honest form, a saved and ordered sequence of steps, and everything later in this course is a bigger version of it.',
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'Pause here. A saved, ordered sequence of steps is what every automation tool later in this course is built out of, and a learner who understands this slide has the idea already.',
  },

  /* ══ CONCEPT 3 · The Complete Makefile (30 to 45) ═══════════════════════ */
  {
    id: 'c3-divider',
    section: C3,
    label: 'Divider 3',
    element: <SectionBreakerSlide index={3} title={C3} subtitle="Every operation, captured once" lesson={SESSION} />,
    notes: 'Hand over: "one target works. What does the whole project\'s file look like?"',
  },
  {
    id: 'c3-the-file',
    section: C3,
    label: 'Seven targets',
    element: (
      <ContentSlide
        kicker={C3}
        title="Makefile"
        lead="Every operation from the last two sessions, captured once, and five of the seven you have typed for a fortnight"
        lesson={SESSION}
      >
        <div className="mx-auto max-w-[900px]">
          <CodeBlock code={MK_SEVEN} filename="Makefile" language="makefile" fontSize={12} />
        </div>
      </ContentSlide>
    ),
    notes:
      'Show it whole, on purpose. There is no unknown to disclose here: build, up, down, logs, migrate and superuser are all theirs already. Only two lines need a word, and they get the next two slides.',
  },
  {
    id: 'c3-build-alone',
    section: C3,
    label: 'build',
    element: (
      /*
        WHAT EACH ONE DOES, SAID OUT LOUD.

        The review asked for it: *"Mention clearly what make build and make run
        does."* The lead used to say `docker compose build` was "the build half of
        `up --build` on its own", which only means something to a reader who
        already knows what the other half is. Two targets differing in one
        respect is a comparison, so the slide draws one: identical row labels down
        both columns, which is the corpus shape, and the difference lands on the
        row that says whether anything is running afterwards.
      */
      <ContentSlide
        kicker={C3}
        title="build"
        lead={<>{'Two targets, and the difference is whether anything is running when they finish'}</>}
        lesson={SESSION}
      >
        <div className="mr-auto w-full max-w-[1000px]">
          <DataTable
            compact
            columns={[
              { label: '', weight: 0.75 },
              { label: 'make "build"', weight: 1.15 },
              { label: 'make "up"', weight: 1.15 },
            ]}
            rows={[
              [
                'Runs',
                <Code>docker compose build</Code>,
                <Code>docker compose up -d --build</Code>,
              ],
              ['Builds the images', 'Yes', 'Yes'],
              ['Starts the containers', 'No', 'Yes'],
              [
                'Afterwards',
                'Nothing is running. The stack is exactly as you left it',
                'Both containers are up and serving',
              ],
              [
                'Reach for it when',
                'You changed a Dockerfile and want to know it still builds',
                'You are starting work, or you changed code',
              ],
            ]}
            highlight={[3]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Read the left column down and let the room fill in the two right-hand cells. The lit row is the whole answer: build leaves nothing running. Say why that is useful: a broken Dockerfile is cheaper to find in ten seconds of building than after a container has half started.',
  },
  {
    id: 'c3-shell-inside',
    section: C3,
    label: 'shell',
    element: (
      <ContentNoteSlide
        kicker={C3}
        title="shell"
        lead={<><Code>exec</Code>{' as in migrate, but running '}<Code>bash</Code>{' instead of a Django command'}</>}
        note={{
          kind: 'tip',
          title: 'Read the prompt',
          body: 'It stops being your folder and becomes the container, which is the confirmation you are inside. Type exit to come back.',
        }}
        lesson={SESSION}
      >
        <Terminal
          path={AT_ROOT}
          caption="Watch the prompt change, that is the whole point"
          lines={[
            { text: 'make shell', kind: 'cmd' },
            { text: 'docker compose exec backend bash', kind: 'out' },
            { text: 'root@3f9c1a2b4d5e:/app#', kind: 'ok' },
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'This is the one for looking around when something is wrong: ls, cat settings.py, check a file really got copied in. The container has its own filesystem and this is the door to it.',
  },
  {
    id: 'c3-command-menu',
    section: C3,
    label: 'Command menu',
    element: (
      <ContentSlide
        kicker={C3}
        title="Command Menu"
        lead="Project now documents its own operations, so a new teammate reads this file and knows everything it supports"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[1050px]">
          <DataTable
            compact
            columns={[
              { label: 'You type', weight: 0.85 },
              { label: 'Runs', weight: 1.3 },
              { label: 'When you use it', weight: 1.35 },
            ]}
            rows={[
              [<Code>make build</Code>, 'Build both images', 'After a Dockerfile or requirements change'],
              [<Code>make up</Code>, 'Rebuild and start the stack', 'Start of every work session'],
              [<Code>make down</Code>, 'Stop and remove the stack', 'End of work'],
              [<Code>make logs</Code>, 'Follow Django logs live', 'Debugging, -f is follow and Ctrl+C exits'],
              [<Code>make migrate</Code>, 'Apply migrations in the container', 'After a model change'],
              [<Code>make superuser</Code>, 'Create an admin user', 'Once per fresh database'],
              [<Code>make shell</Code>, 'Open a shell inside backend', 'Poking around when things break'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Let them photograph this one. Then say the line that matters: this table was not written as documentation. It IS the Makefile, read out loud.',
  },
  {
    id: 'c3-repeated-strings',
    section: C3,
    label: 'Repeated strings',
    element: (
      /*
        THREE THINGS THE ROOM HAS ALREADY DONE, NOT THREE THEY HAVE NOT.

        This said "building it, tagging it, pushing it", and the review cut it:
        *"We have not discussed about Building it, tagging it, pushing it
        process."* Tagging and pushing are next session, so two thirds of the
        friction was borrowed from material the room does not have, which makes
        the repetition an assertion rather than something felt.

        Building, running and removing are all things they have typed by hand.
        The `Problem` callout is the beat, and the solution is deliberately NOT
        here: it is the next slide, which is what makes this beat 2 and that one
        beat 4.
      */
      <ContentNoteSlide
        kicker={C3}
        title="Repeated Strings"
        lead="Same Docker image name is needed in several places"
        points={[
          { text: 'Building the image' },
          { text: 'Running the image' },
          { text: 'Removing the image' },
        ]}
        note={{
          kind: 'warning',
          title: 'Problem',
          body: 'Write the name separately each time and you have several places to update, so you may change one and forget another.',
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'Ask what happens when the image gets renamed. Somebody will say "you change it everywhere", and the follow-up is the real question: how do you know you found everywhere? Do not name the fix; the next slide is the fix. Do not name Docker Hub either, that is next session.',
  },
  {
    id: 'c3-variables',
    section: C3,
    label: 'Variables',
    element: (
      <ContentNoteSlide
        kicker={C3}
        title="Variables"
        /* The solution, stated as one. The previous slide ends on `Problem`, so
           this lead is the answer to it in the same shape of words. */
        lead="Solution: store the image name in one variable and reuse it everywhere"
        /* THE CALLOUT GOES ABOVE THE PANEL. Below it, its last line touched the
           control bar once `remove-image` made this a four-target file, and
           `align-check.mjs` flagged it. Above, the syntax warning also arrives
           before the syntax it is warning about, which is the better order. */
        noteFirst
        note={{
          kind: 'warning',
          title: 'Parentheses, not braces or bare',
          body: (
            <>
              {'Make wants '}
              {/* The variable was renamed to BACKEND_IMAGE when the frontend got
                  one of its own, and this callout still named the old one. */}
              <Code>$(BACKEND_IMAGE)</Code>
              {', unlike the shell\'s '}
              <Code>$VAR</Code>
              {', one character of difference and it is the one people get wrong.'}
            </>
          ),
        }}
        lesson={SESSION}
      >
        <div className="mx-auto max-w-[820px]">
          <CodeBlock
            code={MK_VARS}
            filename="Makefile"
            language="makefile"
            /* 13px, down from 15. `remove-image` made this a four-target panel
               and at 15 its last line sat 26px under the control bar. */
            fontSize={13}
            highlight={hl(MK_VARS, 'IMAGE_NAME')}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Uppercase by convention, at the top of the file by convention. Rename the image someday and exactly one line changes.',
  },
  {
    id: 'c3-phony-question',
    section: C3,
    label: 'The .PHONY question',
    element: (
      <QuestionSlide
        kicker={C3}
        question={<>{'A folder named build exists in the project. What does make "build" do?'}</>}
        qualifier="The target is written exactly as on the Makefile you just saw"
        lesson={SESSION}
      />
    ),
    notes:
      'Take a show of hands before revealing. Most rooms say "it builds the images". The answer surprises them, which is why it is worth asking rather than telling.',
  },
  {
    id: 'c3-phony-surprise',
    section: C3,
    label: 'Nothing runs',
    element: (
      /*
        THE SETUP MOVES TO THE TOP OF THE SLIDE.

        The condition that produces this surprise was in the terminal's caption,
        underneath the output, where a reader finds it only after wondering why
        the output looks like that. The review asked for it at the top: *"Mention
        at top: Create build folder in nxttrendz Folder."*

        Right, and it also makes the slide reproducible. The room can create the
        folder and get this exact output on their own machine, which turns a claim
        into a demonstration.
      */
      <ContentNoteSlide
        kicker={C3}
        title="Nothing Runs"
        lead={<>{'Create a folder named '}<Code>build</Code>{' inside '}<Code>C:\nxttrendz</Code>{', then run the target again'}</>}
        note={{
          kind: 'warning',
          title: 'No error, no output, no images built',
          body: 'Make simply declines, and it does not fail, so nothing tells you anything is wrong',
        }}
        lesson={SESSION}
      >
        <Terminal
          path={AT_ROOT}
          caption="With that folder there, this is what the target does"
          lines={[
            { text: 'make build', kind: 'cmd' },
            { text: "make: 'build' is up to date.", kind: 'out' },
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Have the room create the folder and run it themselves. Let the result sit for a beat before explaining. Confusing is the correct reaction here, and it is much stronger when it happens on their own screen.',
  },
  {
    id: 'c3-phony-why',
    section: C3,
    label: 'Targets are files',
    element: (
      <ContentSlide
        kicker={C3}
        title="Targets Are Files"
        lead="Make's original 1976 job was building files, and it has never stopped assuming that"
        points={[
          { text: 'A target name is assumed to be a file it should create' },
          { text: <>{'It looks for something named '}<Code>build</Code>{' and finds your folder'}</> },
          { text: 'Already there, so already built, so nothing to do' },
          { text: 'Folders named build are common, so this really happens' },
        ]}
        lesson={SESSION}
      />
    ),
    notes:
      'This is the anti-magic slide: the surprise on the last slide is not a bug, it is Make doing its actual job. Open the box once, here, and .PHONY stops being a magic incantation.',
  },
  {
    id: 'c3-phony-line',
    section: C3,
    label: '.PHONY',
    element: (
      <ContentNoteSlide
        kicker={C3}
        title=".PHONY"
        lead="One line at the top declares that these targets are commands, not files"
        note={{
          kind: 'success',
          title: 'Rule of thumb for this course',
          /* The review's own wording. "List every target" was the instruction
             without the reason, and the reason is the part that makes it stick:
             these are commands, and commands are exactly what `.PHONY` is for. */
          body: 'Write every command name in .PHONY. These targets are commands, not files.',
        }}
        lesson={SESSION}
      >
        <div className="mx-auto max-w-[900px]">
          <CodeBlock code={MK_PHONY} filename="Makefile" language="makefile" fontSize={16} />
        </div>
      </ContentNoteSlide>
    ),
    notes: 'Read it as a sentence: these seven are commands, always run them, never go looking for a file.',
  },
  {
    id: 'c3-final-makefile',
    section: C3,
    label: 'The final file',
    element: (
      <ContentSlide
        kicker={C3}
        title="Makefile"
        lead="This is the finished file, and the two lit lines are all this section added"
        lesson={SESSION}
      >
        {/*
          NOT `CodeBuildSlide`, which would be the natural choice for the last
          frame of a build sequence. It hardcodes `language="YAML"` on its inner
          `CodeBlock`, so a Makefile would ship with a YAML chip. Fixing that
          means adding a pass-through prop to `src/slides/`, which is kit-owned:
          content rule 14 makes that the user's call, and `sync-kit.mjs` would
          push it to every other session. Recorded in the plan's section 8.
        */}
        <div className="mx-auto max-w-[880px]">
          <CodeBlock
            code={MK_FINAL}
            filename="Makefile"
            language="makefile"
            fontSize={11}
            highlight={hl(MK_FINAL, '.PHONY:', 'IMAGE_NAME =')}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'The whole artifact, assembled. This is the file they commit. Say the payoff: seven operations, one file, thirty lines, and nobody has to remember any of it.',
  },
  {
    id: 'c3-test-it',
    section: C3,
    label: 'Test it',
    element: (
      <ContentSlide
        kicker={C3}
        title="Test it"
        lead="Run the finished file end to end, and check each expected result"
        points={[
          { text: <><Code>make down</Code>{' removes the stack'}</> },
          { text: <><Code>make up</Code>{' builds and starts both again'}</> },
          { text: <><Code>make migrate</Code>{' reaches the database inside'}</> },
        ]}
        lesson={SESSION}
      >
        <Terminal
          path={AT_ROOT}
          caption="Three words, the whole cycle"
          lines={[
            { text: 'make down', kind: 'cmd' },
            { text: ' Container nxttrendz-backend-1  Removed', kind: 'out' },
            { text: 'make up', kind: 'cmd' },
            { text: '[+] Running 2/2', kind: 'out' },
            { text: 'make migrate', kind: 'cmd' },
            { text: 'No migrations to apply.', kind: 'ok' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Do this live if Docker is up. "No migrations to apply" is the right answer, not a problem: the volume kept the database, so there is nothing left to migrate. That is last session proving itself.',
  },
  {
    id: 'c3-wrong-folder',
    section: C3,
    label: 'Wrong folder',
    element: (
      <ContentSlide
        kicker={C3}
        title="Wrong Folder"
        lead="Most common Make error after the tab, and the prompt gives it away"
        points={[
          { text: 'Make looks in the current folder only' },
          { text: 'No Makefile there, so no rule for anything' },
          { text: <>{'The fix is '}<Code>cd</Code>{' into the project root'}</> },
        ]}
        lesson={SESSION}
      >
        <Terminal
          path={AT_HOME}
          caption="Read the path in the prompt before reading the error"
          lines={[
            { text: 'make up', kind: 'cmd' },
            { text: "make: *** No rule to make target 'up'.  Stop.", kind: 'out' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Cover the error and ask them to diagnose it from the prompt alone. They can. That is the habit worth building.',
  },
  {
    id: 'c3-folder-relative',
    section: C3,
    label: 'Folder relative',
    element: (
      <ContentSlide
        kicker={C3}
        title="Folder Relative"
        lead="Every tool in this course so far behaves the same way"
        points={[
          { text: <><Tech name="docker" label="docker build" />{', from the folder with the Dockerfile'}</> },
          { text: <>{'Run '}<Code>docker compose</Code>{' from the folder with the Compose file'}</> },
          { text: <>{'Run '}<Code>make</Code>{' from the folder with the Makefile'}</> },
          { text: 'Check the path in your prompt before anything else' },
        ]}
        lesson={SESSION}
      />
    ),
    notes:
      'A habit, not a mechanism. When a command that worked yesterday does not work today, look at the prompt before you look at anything else.',
  },
  {
    id: 'c3-commands-as-code',
    section: C3,
    label: 'Commands as code',
    element: (
      /*
        THE SAME IDEA, SHOWN AS THE THREE QUESTIONS IT REPLACES.

        The lead was one 34-word sentence carrying the before and the after at
        once, and the review replaced it with the three questions themselves. That
        is the better slide for the reason `PEDAGOGY_GUIDELINES.md` §9 gives:
        an abstract claim gets a concrete referent within one slide, and here the
        referent is the exact question every one of them has typed into a team
        chat.

        The `Main idea` callout is the review's wording, and it closes the section
        the same way the `Main idea` on `c1-cost-variation` opened it.
      */
      <ContentNoteSlide
        kicker={C3}
        title="Commands as Code"
        lead="Earlier, people had to remember the commands or ask in chat"
        points={[
          { text: '"How do I run the project?"' },
          { text: '"How do I migrate?"' },
          { text: '"How do I check the logs?"' },
          { text: 'Now these commands are stored in the Makefile, inside the project', tone: 'brand' },
        ]}
        note={{
          kind: 'success',
          title: 'Main idea',
          body: 'Makefile keeps project commands in one place.',
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'Read the three questions in a slightly tired voice: everyone in the room has both asked and answered them. The fourth line is the turn. Then the main idea, plainly, and stop. Everything in the second half of this course stands on it.',
  },

  {
    /*
      THE INTERFACE IDEA SURVIVED THE CUT, AND IT SITS IN CONCEPT 3 NOW.

      Concept 4, "Makefile in CI/CD", was removed whole: *"Remove Makefile in
      CI/CD Section in whole from the Session 5"*, followed by *"you can include
      the interface"*. So these three slides came back and the other eleven did
      not.

      They are the close of concept 3 rather than a fourth concept of their own,
      for two reasons. The agenda and the takeaways carry three items now
      (content rule 20 keeps them verbatim-identical), and adding a divider for
      three slides would promise a section the deck does not have. And they
      genuinely are the deeper reading of what concept 3 just built: "commands
      live in a committed file" and "the file is an interface to the project" are
      the same fact at two depths.

      WHAT CHANGED IN THE COPY. The first cut of these slides argued the point
      through CI and CD, because the section around them had just taught both.
      Nothing here may lean on that any more, so every reference to an automation
      server is now "anything that runs the project", which is true of a
      teammate, a script and a server alike, and does not open a tool the deck no
      longer introduces.
    */
    id: 'c3-why-interface',
    section: C3,
    label: 'Why interface',
    element: (
      <ContentNoteSlide
        kicker={C3}
        title="Why Interface"
        lead="You have been doing this since your first function"
        note={{
          kind: 'info',
          title: 'Caller needs one line, not three',
          body: (
            <>
              {'Whoever calls it writes '}
              <Code>make_coffee()</Code>
              {' and gets coffee, and never needs to know that water is boiled first or that the milk goes in last'}
            </>
          ),
        }}
        lesson={SESSION}
      >
        <div className="mr-auto max-w-[820px]">
          <CodeBlock
            code={'def make_coffee():\n    boil_water()\n    add_coffee()\n    add_milk()'}
            language="python"
            fontSize={17}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Ask who has written a function like this. Every hand. Then ask what the caller has to know about the inside of it, and let them say "nothing". That word is the whole slide, and the next one applies it to the Makefile without changing anything else about the idea. The coffee is deliberately not a programming example: nothing about it can be mistaken for a technical claim about the project.',
  },
  {
    id: 'c3-interface-map',
    section: C3,
    label: 'Same move',
    element: (
      <ContentSlide
        kicker={C3}
        title="Same Move"
        lead="A Makefile does for your commands exactly what a function does for your code"
        lesson={SESSION}
      >
        {/*
          THE SLIDE THE LAB WAS BUILT FOR.

          This rendered as an `AnalogyMap` and the review rejected it outright:
          *"Change the UI of this Slide ... Build a New Lab for Comparison."*
          `slide-kit/comparison-lab` put four candidates on this exact fixture
          and `SwapRows` won. Its `CLAUDE.md` records the other three and what
          each was worse at.

          No pairing is emphasised: *"dont highlight any of the part"*. The
          winning candidate carried a flag for that and it was removed from the
          contract rather than left declared and ignored.
        */}
        <SwapRows
          leftLabel="A Python function"
          rightLabel="A Makefile"
          pairs={[
            { from: 'make_coffee()', to: 'make "up"', code: true },
            { from: 'Body of the function', to: 'docker compose command under the target' },
            { from: 'Caller writes one line', to: 'Anyone running the project types one short word' },
            { from: 'Caller never reads the body', to: 'Nobody needs to know the Docker flags' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Read it row by row, left then right. The last row is the one that matters and it lands last. Then drop the analogy: it has done its work and it does not come back.',
  },
  {
    id: 'c3-the-interface',
    section: C3,
    label: 'Interface',
    element: (
      <ContentNoteSlide
        kicker={C3}
        title="Interface"
        lead="Two words worth keeping, because you will meet them again"
        points={[
          { text: <><strong>{'Makefile'}</strong>{' is the interface, the short words anything outside can run'}</> },
          { text: <><strong>{'Docker commands'}</strong>{' are the implementation, the details underneath'}</> },
        ]}
        note={{
          kind: 'success',
          title: 'This is encapsulation',
          body: 'Keep the complicated internal details hidden and expose one simple command to the outside, which is the same idea as a function applied to how a project is run rather than to what it computes.',
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'Name encapsulation out loud, because they will meet the word again and it should not arrive as jargon. They have been doing it all course without a name for it at this level: this is the same move, one level up, applied to operations instead of code.',
  },

  /* ══ CLOSING FRAME ══════════════════════════════════════════════════════ */
  {
    id: 'takeaways',
    section: 'Closing',
    label: 'Key Takeaways',
    element: (
      <KeyTakeawaysSlide
        title="Key Takeaways"
        points={[
          { text: C1, icon: 'bolt' },
          { text: C2, icon: 'file' },
          { text: C3, icon: 'terminal' },
        ]}
        lesson={SESSION}
      />
    ),
    notes: 'The agenda, closed. Read the three concept names back in the order they were promised, and stop there.',
  },
  {
    id: 'next-session',
    section: 'Closing',
    label: 'Next session',
    element: (
      /*
        `kicker`, no `index`. The kicker is what sessions 2 and 3 pass on this
        frame and it is what keeps it in theme: without it the slide is an
        unlabelled navy title, which is exactly what a section divider looks
        like, and the room reads it as a sixth section rather than as the
        handover. There is no index for the same reason: this deck has four
        numbered concepts and this is not a fifth.
      */
      <SectionBreakerSlide kicker="Next session" title="Pushing Image to Docker Hub" lesson={SESSION} />
    ),
    notes:
      'Say the problem, do not put it on the slide: the image you built today exists only on your laptop, and your code has had a central place to push to since day one. Next session gives images one, on Docker Hub. Title only, no subtitle and no index.',
  },
  {
    id: 'thankyou',
    section: 'Closing',
    label: 'Thank you',
    element: <ThankYouSlide lesson={SESSION} />,
    notes: 'Thank the room. The next session is already named on the slide before this one.',
  },
]
