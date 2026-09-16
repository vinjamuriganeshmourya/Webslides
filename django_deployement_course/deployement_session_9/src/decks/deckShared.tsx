import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import type { ShotHighlight } from './figures/AnnotatedShot'

/**
 * SHARED CONSTANTS FOR THE SESSION 9 DECK.
 *
 * Anything two or more slides need lives here, so a change lands once. The deck
 * itself is `awsIntroDeck.tsx` and it is content only.
 *
 * Plan: `../../session_plans/deployement_session_9/plan.md`, rev2, signed off
 * 2026-09-15. Figures: `../../session_plans/deployement_session_9/illustrations.md`.
 * Hard rules 29, 30 and 31 were written because session 8 broke them. Read
 * them before touching a string here.
 */

export const SESSION = 'Introduction to AWS'
export const COURSE = 'React + Django Integration · Deployment'

/**
 * THE FOUR CONCEPTS, DECLARED ONCE, EXACTLY AS PLAN §3 NAMES THEM.
 *
 * Hard rule 20: the Key Takeaways slide carries the agenda's items word for
 * word, so both slides read these constants. Each divider and each per-concept
 * recap reads them too, so the concept is named the same way everywhere.
 */
export const C1 = 'Cloud Basics'
export const C2 = 'AWS and EC2'
export const C3 = 'Regions and Networks'
export const C4 = 'Billing'

/** The account block (plan slides 3a to 3e) is an errand, not a concept. */
export const ACCOUNT_KICKER = 'Before We Start'

/** Rule 12: a named technology carries its mark. Beside every console caption. */
export const AWS_MARK = { src: '/assets/tech/aws.png', alt: 'AWS' }

/**
 * THE FREE PLAN CREDIT, IN BOTH CURRENCIES (plan D6).
 *
 * USD as the console shows it. The rupee figure is at 95.9 rupees to the
 * dollar, read on 2026-09-15. Re-read on the day if the deck is regenerated.
 */
export const CREDIT_USD = 'USD 100'
export const CREDIT_INR = '₹9,590'

/**
 * REGIONS OF THE TWO FULL-SCREEN CONSOLE CAPTURES, AS PERCENTAGES OF THE IMAGE.
 *
 * Measured on the 1568x741 captures in `public/shots/`, and shared with
 * `slide-kit/shot-lab`, where the annotation layer was designed on these same
 * files. A percentage survives any render width, which is why the numbers are
 * not pixels.
 */
export const HOME_SEARCH: ShotHighlight = { left: 12.4, top: 1.9, width: 40.8, height: 5.1 }
export const HOME_REGION: ShotHighlight = { left: 75.3, top: 2.4, width: 10.8, height: 4.2 }
export const HOME_ACCOUNT: ShotHighlight = { left: 87.3, top: 0.5, width: 11.6, height: 3.6 }
export const SEARCH_BOX: ShotHighlight = { left: 12.4, top: 1.9, width: 40.8, height: 5.1 }
export const SEARCH_SERVICES_TAB: ShotHighlight = { left: 22.4, top: 19.4, width: 4.9, height: 3.6 }
export const SEARCH_EC2_ROW: ShotHighlight = { left: 38.1, top: 17.5, width: 49.4, height: 11.9 }

/** On the 1568x784 "Complete your account setup" page. */
export const SETUP_COMPLETE_BUTTON: ShotHighlight = { left: 9.4, top: 68.6, width: 22.9, height: 5.7 }
export const SETUP_UPGRADE_BUTTON: ShotHighlight = { left: 9.4, top: 94.6, width: 12, height: 5.2 }

/**
 * A STAND-IN FOR A SCREENSHOT THAT DOES NOT EXIST YET.
 *
 * Hard rule 30 says every process slide carries a real capture. The AWS
 * account this deck is captured from is not yet activated, so the console
 * pages beyond the home screen (Region selector, VPC, Subnets, Billing,
 * Credits, Budgets) cannot be captured today. Until each capture lands, the
 * slide shows this frame, which says exactly what the picture will be and
 * where on screen the learner will be standing.
 *
 * It is deliberately ugly: a dashed box that cannot be mistaken for a finished
 * slide in a screenshot or a review. When the PNG exists, replace the element
 * with an `AnnotatedShot` and delete nothing else. The deck is not done while
 * one of these renders.
 */
export function PendingShot({
  of,
  at,
  shows,
  className = '',
}: {
  /** What the capture is of, in a few words. */
  of: string
  /** The click path the learner is standing at, for example `Console → VPC → Your VPCs`. */
  at: string
  /** The one or two things the capture will show, so the slide still teaches. */
  shows?: ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex h-full min-h-[300px] w-full flex-col justify-center gap-3 rounded-card border-[3px] border-dashed px-8 py-6 ${className}`}
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

export { Scaled } from './figures/Scaled'

/** A company or technology mark with its name beside it (rule 12: the mark supports the label). */
export function MarkRow({ src, alt, children, size = 40 }: { src: string; alt: string; children: ReactNode; size?: number }) {
  return (
    <span className="inline-flex items-center gap-3">
      <img src={src} alt={alt} draggable={false} style={{ height: size, width: 'auto' }} className="select-none" />
      <span>{children}</span>
    </span>
  )
}
