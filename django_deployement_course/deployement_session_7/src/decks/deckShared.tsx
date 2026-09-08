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
export function Tech({ name, children }: { name: TechName; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="grid h-5 w-5 shrink-0 place-items-center rounded-md"
        style={{ background: colors.white, boxShadow: `0 1px 2px 0 ${colors.brandDeep}2e` }}
      >
        <img src={TECH_SRC[name]} alt="" draggable={false} className="h-3.5 w-3.5 object-contain" />
      </span>
      {children}
    </span>
  )
}

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
    { id: 'fetch', kind: 'start', label: '1 FETCH', caption: 'get the code', icon: 'download' },
    { id: 'test', kind: 'step', label: '2 TEST', caption: 'run the tests', icon: 'check' },
    { id: 'build', kind: 'step', label: '3 BUILD', caption: 'build the image', icon: 'bolt' },
    { id: 'pushimg', kind: 'step', label: '4 PUSH', caption: 'image to Hub', icon: 'globe' },
    { id: 'deploy', kind: 'end', label: '5 DEPLOY', caption: 'run on server', icon: 'server' },
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
    { id: 'test', kind: 'step', label: 'make test', caption: 'did I break anything?', icon: 'check' },
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
    { id: 'dev', kind: 'start', label: 'Developer', caption: 'your machine', icon: 'devices' },
    { id: 'github', kind: 'step', label: 'GitHub', caption: 'the code', logo: 'github' },
    { id: 'jenkins', kind: 'step', label: 'Jenkins', caption: 'runs the pipeline', logo: 'jenkins' },
    { id: 'hub', kind: 'step', label: 'Docker Hub', caption: 'the image', logo: 'docker' },
    { id: 'ec2', kind: 'end', label: 'AWS EC2', caption: 'coming soon', icon: 'server' },
  ],
  edges: [
    { from: 'dev', to: 'github', label: 'git push', kind: 'main' },
    { from: 'github', to: 'jenkins', label: 'webhook', kind: 'main' },
    { from: 'jenkins', to: 'hub', label: 'docker push', kind: 'main' },
    { from: 'hub', to: 'ec2', label: 'docker pull', kind: 'main' },
  ],
}
