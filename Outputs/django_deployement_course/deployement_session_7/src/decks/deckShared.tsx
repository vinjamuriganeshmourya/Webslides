import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import type { FlowchartFigureProps } from '@/ui/flowchart/flowchartFigure'

/**
 * SHARED CONSTANTS FOR THE SESSION 7 DECK.
 *
 * Anything two or more slides need lives here, so a change lands once. The deck
 * itself is `jenkinsCicdDeck.tsx` and it is content only.
 *
 * Build rules for this deck are in
 * `django_deployement_course/workflow/skills/session-7-deck/SKILL.md`, and R1 to
 * R13 are session 6's carried forward. The two that shape almost every string in
 * this file are R15 (every point readable by an absolute beginner) and hard rule
 * 1 (no spaced em dash in any rendered string).
 */

export const SESSION = 'Introduction to Jenkins'
export const COURSE = 'React + Django Integration · Deployment'

/**
 * THE FOUR CONCEPTS, DECLARED ONCE.
 *
 * Hard rule 20: the Key Takeaways slide carries the agenda's items word for word.
 * The only way to guarantee that is for both slides to read the same constants,
 * so neither slide is allowed to type these strings itself. Session 5 shipped
 * reworded takeaways and they had to be replaced.
 */
export const C1 = 'Publishing the Code'
export const C2 = 'What CI/CD Is'
export const C3 = 'Jenkins, the Automation Server'
export const C4 = 'Inside the Jenkins Dashboard'

/** The project root every command in this session runs from. A JS string, so the
 *  backslash is escaped here and single in a JSX attribute. Hard rule 15. */
export const ROOT = 'C:\\nxttrendz'

/*
  TECHNOLOGY MARKS.

  Literal paths, never a template literal: `scripts/inline-assets.mjs` scans the
  built HTML for literal `/assets/...` strings, and a template literal ships a
  broken image in the single-file deck. Session 3 shipped that bug and session 6
  recorded it as R11.
*/
const TECH_SRC = {
  docker: '/assets/tech/docker.png',
  git: '/assets/tech/git.png',
  github: '/assets/tech/github.png',
  jenkins: '/assets/tech/jenkins.png',
  makefile: '/assets/tech/makefile.png',
  vscode: '/assets/tech/vscode.png',
} as const

export type TechName = keyof typeof TECH_SRC

/**
 * A technology name with its mark, for use inside a table cell or a bullet.
 *
 * Hard rule 12: a technology named on a slide carries its logo, because a learner
 * scanning a diagram finds the mark before they finish reading the label. The
 * white tile is the same treatment `NodeShell` and the deck's stack figures use:
 * GitHub's mark is near black and Jenkins's is dark red on cream, so on a tinted
 * cell they read as smudges without one. The vendor files stay unrecoloured.
 */
/*
  `Tech` LIVED HERE AND NOW COMES FROM THE KIT.

  This deck's own version wrapped the mark and its label in an `inline-flex`
  span, which aligns its BOTTOM edge to the surrounding text baseline, so both
  the logo and the word rode below the sentence around them. Session 6's review
  caught it; `slide-kit/slide-template/src/ui/Tech.tsx` is the fix and its header
  names sessions 3, 4, 6 and 7 as the decks that shipped the bug.

  Import it from `@/ui`. Its API is `label` rather than children.
*/

/** A company mark for the "who works this way" slide. Real products the room
 *  already uses, per `PEDAGOGY_GUIDELINES.md` §9. */
const CO_SRC = {
  amazon: '/assets/companies/amazon.png',
  netflix: '/assets/companies/netflix.png',
  google: '/assets/companies/google.png',
  meta: '/assets/companies/meta.png',
} as const

export function Co({ name }: { name: keyof typeof CO_SRC }) {
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg" style={{ background: colors.white }}>
      <img src={CO_SRC[name]} alt="" draggable={false} className="h-7 w-7 object-contain" />
    </span>
  )
}

/**
 * Inline code, for the many `git push` and `localhost:8080` mentions.
 *
 * The background is a token with an alpha suffix, not a hex literal: hard rule 5
 * says no hex may appear in a deck file.
 *
 * `whitespace-nowrap` because an inline code token that breaks across two lines
 * stops being one token to the eye. `align-check.mjs` reported exactly that for
 * `docker compose logs` inside the narrow callout on slide 54.
 */
export function Code({ children }: { children: ReactNode }) {
  return (
    <span
      className="whitespace-nowrap rounded-md px-1.5 py-0.5 font-mono"
      style={{ fontSize: '0.9em', background: `${colors.brand}1a`, color: colors.brandDark }}
    >
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Figures, settled in slide-kit/cicd-lab before this deck was written  */
/* ------------------------------------------------------------------ */

/**
 * SLIDE 30, the pipeline. FIVE nodes, and five is the geometry rather than a
 * preference: `SpineFlow` is a fixed 1100px stage with five slots of 180px on
 * 230px centres. The lab's first pass added `git push` as a sixth and `5 DEPLOY`
 * rendered as a sliver off the right edge of the frame, which all three
 * harnesses passed. See R16.
 *
 * No failure branch here, for two reasons that agree. The honest one: a branch
 * drawn out of TEST cannot carry a label claiming to be about every stage. The
 * mechanical one: `SpineFlow` positions an `alt` branch at the index of the
 * `decision` node, and with no decision in the graph that index is -1 and the
 * branch is drawn off-canvas. The failure gets slide 32, which has a real gate.
 */
export const PIPELINE: Pick<FlowchartFigureProps, 'nodes' | 'edges'> = {
  nodes: [
    /* `detail` IS THE HOVER LAYER, ASKED FOR ON REVIEW 2026-09-10.

       `FcNode.detail` renders as a popover when the presenter hovers a node, and
       its own contract is strict about what may go in it: "the slide has to work
       with nobody hovering anything, because the room is watching a projector
       and cannot hover at all". So `label` and `caption` still carry the
       teaching and every line below is the ASIDE an instructor reaches for when
       somebody asks a question. Nothing here is required to follow the slide. */
    {
      id: 'fetch',
      kind: 'start',
      label: '1 FETCH',
      caption: 'get the code',
      icon: 'download',
      detail: 'Jenkins clones your repository into a fresh folder every run, so a build never inherits leftovers from the last one',
    },
    {
      id: 'test',
      kind: 'step',
      label: '2 TEST',
      caption: 'run the tests',
      icon: 'check',
      detail: 'Runs on a machine that is not yours, which is what catches the thing that only worked on your laptop',
    },
    {
      id: 'build',
      kind: 'step',
      label: '3 BUILD',
      caption: 'build the image',
      icon: 'bolt',
      detail: 'The same make build you already own. Jenkins types it for you, from the Dockerfile in the repository',
    },
    {
      id: 'pushimg',
      kind: 'step',
      label: '4 PUSH',
      caption: 'image to Hub',
      icon: 'globe',
      detail: 'Needs the Docker Hub login stored inside Jenkins, which is the credentials work in the next session',
    },
    {
      id: 'deploy',
      kind: 'end',
      label: '5 DEPLOY',
      caption: 'run on server',
      icon: 'server',
      detail: 'The only stage no machine of yours can do yet, because there is no server on the internet until the AWS sessions',
    },
  ],
  edges: [
    { from: 'fetch', to: 'test', kind: 'main' },
    { from: 'test', to: 'build', kind: 'main' },
    { from: 'build', to: 'pushimg', kind: 'main' },
    { from: 'pushimg', to: 'deploy', kind: 'main' },
  ],
}

/**
 * SLIDE 32, the gate. Every node label is SHORT with the detail in `caption`,
 * because `GateFlow` parks its PASS and FAIL pills in the space a one-line card
 * leaves. The kit fix moved the pills clear of the cards; short labels keep them
 * clear when the figure is read at the back of a room.
 */
export const GATE: Pick<FlowchartFigureProps, 'nodes' | 'edges'> = {
  nodes: [
    { id: 'test', kind: 'start', label: '2 TEST', caption: 'on a neutral machine', icon: 'check' },
    { id: 'gate', kind: 'decision', label: 'Every test passed?', icon: 'target' },
    { id: 'build', kind: 'step', label: '3 BUILD', caption: 'then 4 and 5', icon: 'bolt' },
    { id: 'stopped', kind: 'end', label: 'Stop', caption: 'no image, no push', icon: 'cross' },
  ],
  edges: [
    { from: 'test', to: 'gate', kind: 'main' },
    { from: 'gate', to: 'build', label: 'Pass', kind: 'main' },
    { from: 'gate', to: 'stopped', label: 'Fail', kind: 'alt' },
  ],
}

/**
 * THE PROJECT'S `.gitignore`, for `c1-gitignore-patterns`.
 *
 * Every line is one the room has a reason for, and five of the seven are lines
 * they already wrote into `.dockerignore` in session 4: `env/`, `__pycache__/`,
 * `*.pyc`, `db.sqlite3` and `.env`. The two that are new here are
 * `node_modules/` and `build/`, which session 4 put in the FRONTEND's
 * `.dockerignore` rather than in Git's.
 *
 * ORDER IS TEACHING ORDER, not alphabetical: the secret first, because it is the
 * one that cannot be undone, then the data, then the things that are merely
 * large. A learner reading down it should meet the reasons in descending order
 * of regret.
 *
 * NO `!` NEGATION LINE. It is real syntax and this project does not need one,
 * and a pattern nobody uses on a slide is a pattern that has to be explained
 * (content rule 4).
 */
export const GITIGNORE =
  `.env\n` +
  `db.sqlite3\n` +
  `env/\n` +
  `__pycache__/\n` +
  `*.pyc\n` +
  `node_modules/\n` +
  `build/\n`

/**
 * SLIDE 18, shipping a change by hand.
 *
 * `StepLedger` rather than `StepList`: six `StepList` rows are so tall that row 1
 * prints over the slide title and rows 5 and 6 leave the frame. The lab has the
 * picture.
 *
 * No caption repeats the word "ritual". The first pass put it in four consecutive
 * rows and the split was carried by repetition, which reads as a stutter and
 * gives the eye nothing to land on. Each caption now says what its own step is
 * for, and the split is stated once underneath.
 */
export const RITUAL: Pick<FlowchartFigureProps, 'nodes' | 'edges'> = {
  nodes: [
    { id: 'edit', kind: 'start', label: 'Edit code', caption: 'the work you were hired to do', icon: 'pencil' },
    { id: 'push', kind: 'step', label: 'git push', caption: 'share the code', icon: 'rocket' },
    /* NOT `make test`. THE DECK ALREADY KNEW THIS AND ONLY HALF-FIXED IT.

       `c2-our-pipeline`'s own comment records the finding: session 5's Makefile
       is build, up, down, logs, migrate, superuser and shell, and session 6 adds
       push. **No session ever wrote a `test` target.** That caption was
       corrected and this one, on the slide that introduces the ritual FIRST, was
       left claiming a command the room does not have.

       No command is named here now. Asked for on review: tests go no further in
       this session than "we can add tests to check before deploying", so a step
       that says what happens rather than what to type is the honest label and
       also the one that does not need a Makefile target to exist.

       AND IT IS THE ONE STEP IN THE ROW THAT IS NOT MANDATORY, which the caption
       now says outright. Asked for on 2026-09-09 against slide 21. Every other
       step here either has to happen or the change does not ship, and the room's
       project has no test target at all, so a caption reading `did I break
       anything?` sat in a row of six obligations and read as a seventh. It is
       optional, it is worth doing, and the question it answers is the thing the
       instructor says out loud: that line moved into the slide's notes. */
    { id: 'test', kind: 'step', label: 'Run the tests', caption: 'optional but recommended', icon: 'check' },
    { id: 'build', kind: 'step', label: 'make build', caption: 'build the image', icon: 'bolt' },
    { id: 'pushimg', kind: 'step', label: 'make push VERSION=v7', caption: 'share the image', icon: 'globe' },
    { id: 'deploy', kind: 'end', label: 'Deploy it somewhere', caption: 'coming in the AWS sessions', icon: 'server' },
  ],
  edges: [
    { from: 'edit', to: 'push', kind: 'main' },
    { from: 'push', to: 'test', kind: 'main' },
    { from: 'test', to: 'build', kind: 'main' },
    { from: 'build', to: 'pushimg', kind: 'main' },
    { from: 'pushimg', to: 'deploy', kind: 'main' },
  ],
}

/**
 * SLIDE 38, where Jenkins sits.
 *
 * `SpineFlow`, not `BoundaryBridge`. The bridge groups every `source` station
 * inside one dashed machine boundary, so Developer and GitHub landed in a box
 * captioned ONE COMPUTER, which contradicts the ten slides of concept 1 that
 * exist to say GitHub is not on your computer. Rejected on what it claims, and
 * kept as slide 6 of `slide-kit/cicd-lab` so nobody retries it. See R18.
 *
 * The marks come through `FcNode.logo`, which the kit gained for this slide.
 */
export const CHAIN: Pick<FlowchartFigureProps, 'nodes' | 'edges'> = {
  nodes: [
    /* Hover asides, same rule as `PIPELINE` above: the chain reads without any of
       them, and each one is the answer to a question the room actually asks when
       they see five boxes and recognise four. */
    {
      id: 'dev',
      kind: 'start',
      label: 'Developer',
      caption: 'your machine',
      icon: 'devices',
      detail: 'The only box in this row that is a person. Everything to the right of it is a machine doing what you used to do by hand',
    },
    {
      id: 'github',
      kind: 'step',
      label: 'GitHub',
      caption: 'the code',
      logo: 'github',
      detail: 'Holds the source and nothing built from it. No images live here, which is why the next box exists',
    },
    {
      id: 'jenkins',
      kind: 'step',
      label: 'Jenkins',
      caption: 'runs the pipeline',
      logo: 'jenkins',
      detail: 'Today it runs on your laptop, so it can reach your Docker engine but nothing on the internet can reach it',
    },
    {
      id: 'hub',
      kind: 'step',
      label: 'Docker Hub',
      caption: 'the image',
      logo: 'docker',
      detail: 'The handover between the machine that builds and the machine that runs. Session 6 put your two images here',
    },
    {
      id: 'ec2',
      kind: 'end',
      label: 'AWS EC2',
      caption: 'coming soon',
      icon: 'server',
      detail: 'A computer you rent by the hour, with an address the whole internet can reach. That address is what finally makes a webhook possible',
    },
  ],
  edges: [
    { from: 'dev', to: 'github', label: 'git push', kind: 'main' },
    /* NOT `webhook`. THE ROOM DOES NOT OWN THAT WORD YET.

       Asked for on 2026-09-09 against slide 37. Every other label on this chain
       is a command the room has typed: `git push`, `docker push`, `docker pull`.
       `webhook` was the one label that was a MECHANISM instead, met once six
       slides earlier as a row in the trigger table and not set up until session
       9, so on this figure it was a term arriving as an arrow label, which is
       the one place a term cannot be explained. Plain words say the same thing
       and cost the slide nothing: the word itself is still taught where it is
       taught, and it is still what gets configured in session 9. */
    { from: 'github', to: 'jenkins', label: 'tells Jenkins', kind: 'main' },
    { from: 'jenkins', to: 'hub', label: 'docker push', kind: 'main' },
    { from: 'hub', to: 'ec2', label: 'docker pull', kind: 'main' },
  ],
}
