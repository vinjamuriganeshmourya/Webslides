import type { ReactNode } from 'react'

/**
 * SHARED CONSTANTS FOR THE SESSION 8 DECK.
 *
 * Anything two or more slides need lives here, so a change lands once. The deck
 * itself is `jenkinsDockerDeck.tsx` and it is content only.
 *
 * Plan: `../../session_plans/deployement_session_8/plan.md`, signed off
 * 2026-09-10. Session 7's build rules R1 to R20 carry forward; the two that
 * shape almost every string in this file are R15 (every point readable by an
 * absolute beginner) and hard rule 1 (no spaced em dash in any rendered string).
 */

export const SESSION = 'Setting Up Jenkins for Docker Builds'
export const COURSE = 'React + Django Integration · Deployment'

/**
 * THE FOUR CONCEPTS, DECLARED ONCE.
 *
 * Hard rule 20: the Key Takeaways slide carries the agenda's items word for
 * word. The only way to guarantee that is for both slides to read the same
 * constants, so neither slide is allowed to type these strings itself. Session
 * 5 shipped reworded takeaways and they had to be replaced.
 */
export const C1 = 'Giving Jenkins Docker'
export const C2 = 'Secrets, Stored Safely'
export const C3 = 'Connecting to Your Code'
export const C4 = 'The First Build'

/**
 * The AWS block is deliberately NOT a concept. Plan §4.4: it is a prerequisite
 * errand with a deadline, not something the session teaches, so it gets no
 * divider and no agenda row and sits in the closing block under its own kicker.
 */
export const CLOSING_KICKER = 'Before We Meet Again'

/** The project root every command in this session runs from. A JS string, so
 *  the backslash is escaped here and single in a JSX attribute. Hard rule 15. */
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
  vscode: '/assets/tech/vscode.png',
} as const

export type TechName = keyof typeof TECH_SRC

/**
 * A technology name with its mark. Hard rule 12: a technology named on a slide
 * carries its logo.
 */
export function Tech({ name, label }: { name: TechName; label?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 align-baseline">
      <img src={TECH_SRC[name]} alt="" className="inline-block h-[1em] w-auto translate-y-[0.1em]" />
      <span>{label ?? name}</span>
    </span>
  )
}
