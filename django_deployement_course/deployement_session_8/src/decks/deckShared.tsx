import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'

/**
 * SHARED CONSTANTS FOR THE SESSION 8 DECK.
 *
 * Anything two or more slides need lives here, so a change lands once. The deck
 * itself is `jenkinsDockerDeck.tsx` and it is content only.
 *
 * Plan: `../../session_plans/deployement_session_8/plan.md`, rev2 of 2026-09-11.
 * Hard rules 29, 30 and 31 were written because the first cut of this deck
 * broke them. Read them before touching a string here.
 */

export const SESSION = 'Setting Up Jenkins for Docker Builds'
export const COURSE = 'React + Django Integration · Deployment'

/**
 * THE FOUR CONCEPTS, DECLARED ONCE, ARTICLE-FREE.
 *
 * Hard rule 20: the Key Takeaways slide carries the agenda's items word for
 * word, so both slides read these constants. TEXT_GUIDELINES §4a: agenda items
 * carry no articles and no helping words. Rule 29: the topic, in two or three
 * words. The first cut had `Secrets Jenkins Can Use Safely`; this is the fix.
 */
export const C1 = 'Docker Access'
export const C2 = 'Storing Secrets'
export const C3 = 'Connecting to GitHub'
export const C4 = 'Full Pipeline'

/** The AWS block is an errand with a deadline, not a concept. Plan §4.4. */
export const CLOSING_KICKER = 'Before We Meet Again'

/** The project root every command runs from. Escaped here, single in JSX. */
export const ROOT = 'C:\\nxttrendz'

/** The example Docker ID and dev domain. Slides say to replace both. */
export const DOCKER_ID = 'jeevansravanth'
export const DEV_DOMAIN = 'decaf-reword-clarify.ngrok-free.dev'

/**
 * A STAND-IN FOR A SCREENSHOT THAT DOES NOT EXIST YET.
 *
 * Hard rule 30 says every process slide carries a real capture. Nineteen of
 * this deck's captures need the author's running Jenkins, an ngrok login, a
 * Docker Hub login or an AWS sign-up, none of which exist on the machine that
 * builds the deck. Until each capture lands, the slide shows this frame, which
 * says exactly what the picture will be and where on screen the learner will be.
 *
 * It is deliberately ugly: a dashed box that cannot be mistaken for a finished
 * slide in a screenshot or a review. When the PNG exists, replace the element
 * with a `Shot` and delete nothing else. The deck is not done while one of
 * these renders.
 */
export function PendingShot({
  of,
  at,
  shows,
}: {
  /** What the capture is of, in a few words. */
  of: string
  /** The UI path the learner is standing at, for example `Manage Jenkins → Plugins`. */
  at: string
  /** The one or two things the capture will show, so the slide still teaches. */
  shows?: ReactNode
}) {
  return (
    <div
      className="flex h-full min-h-[300px] w-full flex-col justify-center gap-3 rounded-card border-[3px] border-dashed px-8 py-6"
      style={{ borderColor: colors.warning, background: '#FFFBEB' }}
    >
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: colors.warning }}>
        Screenshot pending
      </span>
      <span className="text-body-lg font-semibold" style={{ color: colors.ink }}>{of}</span>
      <span className="font-mono text-body-sm" style={{ color: colors.body }}>{at}</span>
      {shows && <div className="mt-2 text-body-sm" style={{ color: colors.body }}>{shows}</div>}
    </div>
  )
}
