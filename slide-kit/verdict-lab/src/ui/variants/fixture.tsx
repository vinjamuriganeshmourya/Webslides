import type { VerdictFigureProps } from './contract'

/**
 * ONE FIXTURE, RENDERED BY EVERY VARIANT.
 *
 * Real content, from the AWS account creation module, because a fixture of
 * "Lorem one / Lorem two" proves only that a component renders. This set is
 * the one that made the lab necessary: four rows, mixed verdicts, and claims
 * and reasons at the lengths a real slide actually produces.
 *
 * THE LENGTHS ARE THE TEST. The longest claim here is 48 characters and the
 * longest reason is 78. A variant that wraps either of them onto a third line
 * has failed the fixture, and the numbers are in each variant's `notes` so the
 * failure is stated rather than discovered on a projector.
 */
export const mandateFixture: VerdictFigureProps = {
  items: [
    {
      verdict: 'success',
      claim: 'Nothing is charged while there is no bill',
      reason: 'On the Free plan, credits cover the usage and no bill is raised',
    },
    {
      verdict: 'info',
      claim: 'Your bank warns you 24 hours before any debit',
      reason: 'A pre-debit reminder arrives by SMS or email, from the bank and not from AWS',
    },
    {
      verdict: 'warning',
      claim: 'A bill above ₹15,000 is never taken automatically',
      reason: 'AWS asks you to pay that one by hand instead',
    },
    {
      verdict: 'error',
      claim: 'A budget does not stop anything running',
      reason: 'It sends an email, and whatever is running keeps running until you stop it',
    },
  ],
}

/**
 * THE SECOND FIXTURE: a do and don't pair, two rows only.
 *
 * `SplitVerdict` is the only variant that needs it, and it exists because a
 * paired comparison is a different job from a list of four judgements. Every
 * other variant renders it too, which is how the lab shows that a two-row set
 * in a four-row layout wastes half the slide.
 */
export const twoButtonFixture: VerdictFigureProps = {
  items: [
    {
      verdict: 'success',
      claim: 'Complete your AWS registration',
      reason: 'Takes you back to whatever the sign-up still needs',
      label: 'Click this',
    },
    {
      verdict: 'error',
      claim: 'Upgrade plan',
      reason: 'Moves the account off the Free plan and onto one that can bill you',
      label: 'Never this',
    },
  ],
}
