# AWS Account Creation — a standalone module

**This is a MODULE, not the base template.** The kit's own rules still apply and
live at `slide-kit/slide-template/CLAUDE.md`. Anything under `src/design/`,
`src/ui/`, `src/slides/`, `src/motion/` or `src/deck/` is kit-owned and is
overwritten by `sync-kit.mjs`. This module owns `src/decks/awsAccountDeck.tsx`,
`src/decks/activeDeck.ts`, `deck.config.json`, `public/shots/` and `workflow/`.

| | |
|---|---|
| Slides | **43**, kept in step with `deck.config.json` |
| `devPort` | 5221 |
| `htmlName` | `aws-account-creation` |
| Deck file | `src/decks/awsAccountDeck.tsx` |
| Plan | `../session_plans/aws_account_creation/plan.md`, signed off 2026-09-28 |
| Captures | 25 crops of 23 real screens, 2026-09-15 and 2026-09-16, on the user's own account |

## Why this module exists separately

Any course that needs its learners to have an AWS account plays this before its
own first AWS session. Deployment session 9 still carries an eight-slide version
of the same procedure in its opening block; plan D5 says those come out once
this ships, so the two do not drift apart.

## Decisions that shape this deck

- **Every capture is real.** There is no stand-in component in this module,
  deliberately, so there is nothing to reach for when a screen is missing.
- **One screen has no capture at all.** `your-password` (plan D1): the only
  capture of it was taken with `Show password` ticked and shows a live root
  password, so it is destroyed rather than blurred. The slide states the
  absence and says why, which is itself the lesson.
- **Five captures are blurred, never retouched.** PAN number, date of birth,
  two names, two phone numbers, one street address. A blurred field still shows
  the room that a field is there. `workflow/prep-shots.py` is the script that
  did it, kept so the redaction can be re-run and audited rather than trusted.
- **A crop is to the claim, not to the screen.** The PAN step and the UPI
  mandate were first cropped to the whole window, and at the width the content
  well allows neither could be read, which defeats the point of showing them.
  The UPI mandate is now TWO crops of one screen, because the real screen puts
  500px of dead space between the headline and the sentence and closing that gap
  would be a composite rather than a capture.
- **Verdict words are set per row.** The kit's `StatusList` defaults are Works
  and Fails, which are right for a command and wrong for most of this deck, so
  every row states what it actually means. The vocabulary itself is what
  `slide-kit/verdict-lab` is deciding.
- **MFA is shown and skipped** (user, 2026-09-28). The screen is on a slide
  because the room will meet it; the action taught is `Skip for now`. The
  35-day deadline is stated because the screenshot states it.
- **IAM is named and never opened** (hard rule 4). No access key appears
  anywhere in this module, so the leaked-key incidents stay in the instructor
  notes of `left-running` and off every slide.
- **Money is stated before it is spent.** `why-a-card` sits before
  `card-or-upi`, and `up-to-not-now` sits immediately after the UPI mandate
  screen. A beginner surprised by a charge stops following the module.
- **Both credit figures are printed**, with where each comes from: the sign-up
  card says up to $200, the console says USD 100 ten minutes later. Not
  explaining the gap is how a learner concludes the deck is wrong.
- **Every AutoPay fact is quoted from AWS's billing documentation**, read on
  2026-09-28, and the slide that prints one links it. Never restate the
  ₹15,000, the 24-hour pre-debit warning or the cancellation path from memory.
- **No quiz frames**, as for sessions 8 and 9. A per-module exception to hard
  rule 18, not a course rule.

## Known gap

**Concept 4 has no Result capture** (plan D10). STAR closes on something run,
and the budget-created confirmation screen does not exist yet, so the concept
closes on its recap. One screenshot on the account that already has the budget
fixes it, and `zero-spend-budget`'s `notes` says so.

## Commands

```bash
npm install
npx vite --port 5221 --strictPort
npx tsc -b --noEmit
npm run build:html                  # -> dist-single/aws-account-creation.html

export CHROME_PATH=/opt/google/chrome/chrome
node video-safe.mjs & node qa.mjs & node align-check.mjs & wait
node preview.mjs && node scripts/build-preview-page.mjs
```

Expected `qa.mjs` baseline: exactly the Brand and Thank you slides as `NO LOGO`.
Anything else is a regression.
