# Deployment Session 9 — "Introduction to AWS"

**This is a SESSION, not the base template.** The kit's own `CLAUDE.md` rules
still apply and live at `slide-kit/slide-template/CLAUDE.md`.

| | |
|---|---|
| Slides | **63**, kept in step with `deck.config.json` (plan's 53, plus the five account slides 3a to 3e, a three-slide data-centre block after What the Cloud Gives You (user, 2026-09-16; concept 1 is now 13 slides, past the plan's cap of 10), a Not Finished Yet frame for the account-setup page, and the Subnets console capture on its own frame) |
| `devPort` | 5220 |
| `htmlName` | `deployment-session-9` |
| Deck file | `src/decks/awsIntroDeck.tsx`, plus `src/decks/deckShared.tsx` |
| Plan | `../session_plans/deployement_session_9/plan.md`, **rev2, signed off 2026-09-15** |
| Illustration plan | `../session_plans/deployement_session_9/illustrations.md` |
| Figure lab | `slide-kit/cloud-lab/`, devPort 5236 |
| TR | `/home/nxtwave/docker_jenkins_aws/10_deploying_docker_on_aws_ec2.md` §1 to §2, `11_aws_ec2_security_and_networking.md` §4 |

## Decisions that shape this deck

- **Nothing is launched.** Learners only find things in their console. The one
  thing created is a zero-spend budget.
- **No quiz frames**, on instruction, for this session (as for session 8). A
  per-deck exception to hard rule 18, not a course rule.
- **No length cap.** "Elaborate wherever it helps the room." One new word per
  slide, every acronym expanded once, question then answer, a recap per concept,
  every idea anchored to something the room owns (plan §2, five beginner rules).
- **Illustration first.** One growing picture, `CloudPicture`, across the deck;
  `RegionMap`, `ShareBar` and the figures in `illustrations.md`. All prototyped
  in `slide-kit/cloud-lab` and looked at before a slide is written (hard rule 17).
- **Captures** come from the user's own AWS console through the Chrome
  extension, page zoomed 1.5x to 2x, account ID and email cropped out.
- **The Agenda slide carries the session name as its kicker** (`kicker={SESSION}`,
  `title="Agenda"`), as sessions 2 and 3 did. User, 2026-09-16, on seeing the
  agenda without it. Proposed as a course rule; not yet recorded in
  TEXT_GUIDELINES.
- **No "Everyone ..." or "All must ..." phrasing on a slide** (user, 2026-09-16).
  The instructor says it aloud; the slide states the fact: "The console shows
  USD 100 of credit. Check it before the session goes on", not "Everyone
  confirms USD 100". Instructor `notes` may keep the address to the room.
- **Wording is plain and professional** (user, 2026-09-16): "a data centre", never
  "someone else's building". Applies to leads and to labels inside figures.
- Money in USD as the console shows it, with the rupee figure printed beside
  the Free plan credit.
- **Session-owned figures live in `src/decks/figures/`**: the cloud-lab
  prototypes (`CloudPicture`, `RegionMap` with `regionMapGeo.ts`, `ShareBar`,
  `Meter`, `PlaceLadder`, `ServiceField`, `SizeChart`, `LockAndKey`,
  `OwnVsRented`, `TwoDoors`, `MachineCard`, `figureMotion`), the shot-lab
  `AnnotatedShot` with its inlined `tokenHelpers.ts` and `annotationPreset.ts`,
  and four built for this deck: `DataCentreView` (the data-centre block), `AnalogyPairs` (Pay for Use), `IllustratedRecap`
  with `recapFigures.tsx` (the four concept recaps), `Scaled`. None of it is in
  the kit yet; promotion is a separate approval. Delete the two inlined helper
  files when the shot-lab work lands in `src/design` and `src/motion`.
- **Full-screen console captures are never cropped.** They go through
  `AnnotatedShot` at 760 to 840 px with a spotlight, numbered boxes in click
  order and `inset="auto"`. 840 only fits under a one-line lead.
- **Pending captures** render `PendingShot` from `deckShared.tsx` and are listed
  as CAPTURE in that slide's `notes`. The account was not activated when the deck
  was generated.
- `align-check` reports WRAPPED tokens on every slide with a ticking `Meter`:
  that is the digit roll (two spans exist mid-tick), not a layout fault.

## Commands

```bash
npm install
npx vite --port 5220 --strictPort
npx tsc -b --noEmit
npm run build:html                  # -> dist-single/deployment-session-9.html
export CHROME_PATH=/opt/google/chrome/chrome
node video-safe.mjs & node qa.mjs & node align-check.mjs & wait
```

Expected clean state: `video-safe` CLEAN except known kit defects, `align-check`
0, `qa` flagging exactly the Brand and Thank you slides as `NO LOGO`.
