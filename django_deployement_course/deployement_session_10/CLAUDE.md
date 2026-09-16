# Deployment Session 10 — "Deploying Your App on AWS"

**This is a SESSION, not the base template.** The kit's own rules still apply
and live at `slide-kit/slide-template/CLAUDE.md`.

| | |
|---|---|
| Status | **Built. 138 slides**, generated from plan revision 3. Verification results recorded below |
| `devPort` | 5221 |
| `htmlName` | `deployment-session-10` |
| Deck file | `src/decks/awsDeployDeck.tsx`, plus `src/decks/deckShared.tsx` and `src/decks/shotBoxes.ts` |
| Plan | `../session_plans/deployement_session_10/plan.md`, **revision 3** |
| Reading material | `../session_plans/deployement_session_10/reading-material.md` |
| Illustrations | `../session_plans/deployement_session_10/illustrations.md` |
| Figure lab | `slide-kit/deploy-lab/`, devPort 5238 |
| Captures | `public/shots/` (47 files) and `public/diagrams/`, sources in `../workflow/captures/session-10/` |

## Decisions that shape this deck

- **The hands-on was run before the deck was written.** Every capture is real,
  every number measured. `../workflow/captures/session-10/MANIFEST.md` maps each
  file to the plan beat it serves. **If a slide and a capture disagree, the
  capture wins.**
- **The app is the authority, not the TR.** The technical reference describes a
  Django plus PostgreSQL stack this course never built. Plan §3 lists all six
  places they differ. The TR's `ALLOWED_HOSTS` material is dropped because this
  app hardcodes `["*"]`.
- **Architecture first, every time.** No slide creates an AWS resource before
  the room has seen the requirement and the architecture state for it. Plan §1
  fixes the order: requirement, architecture, console, proof.
- **Seven concepts**, listed in `deckShared.tsx` as `C1` to `C7`. Key Takeaways
  restates exactly those names, hard rule 20.
- **No quiz frames**, on instruction, as in sessions 8 and 9. A per-deck
  exception to hard rule 18, proposed three times now as a course rule.
- **Every number on a slide or a figure is measured.** The `MemoryBar` figure in
  particular prints real values from the build server. Plan §8 holds them.
- **Two servers**, and the best idea in the session is the rule on the app
  server whose **source is a security group** rather than an address.
- **Full-screen console captures are never cropped.** They go through
  `AnnotatedShot` with a spotlight and numbered boxes in click order.

## What is in here

- **Seven concepts**, `C1` to `C7` in `deckShared.tsx`, with the agenda framed as
  **three outcomes** rather than seven concepts because the session is long.
- **Twelve session figures** in `src/decks/figures/`. `aws/CloudArchitecture`
  grows through seven states and is drawn with the **official AWS Architecture
  Icons**, release 07312026, installed in `slide-kit/assets/aws/` with AWS's own
  conventions written up beside them.
- **Thirty-nine captures** in `public/shots/`, every one from a real run. Ten
  more sit in the captures folder unused on purpose, and `MANIFEST.md` says
  which and why.
- **The presenter marker.** The annotation layer lives in `src/deck/annotate/`.
  It reached this branch by cherry-picking a kit commit that exists on local
  `main` but was never pushed to origin, which is why it was missing from the
  base template here.

## Rules this deck had to learn

Recorded as rule 12b in `.claude/skills/slide-content-rules/SKILL.md`, from
three corrections given while it was being built:

- **No casual asides.** A slide carries the fact, the instructor carries the
  delivery.
- **Plain words.** Professional does not mean long. Replacing "annoying" with
  "acquires a cost" trades a casual word for a harder one, which is worse.
- **No session numbers in rendered copy.** They date a deck, break when a
  session moves, and mean nothing to somebody watching a recording.

And two shapes specific to this deck:

- **`RecapSlide` is not used.** It draws a mascot, and the user asked for a
  plain slide at the end of a concept. Every recap is a `ContentSlide`.
- **Highlight boxes are measured, never estimated.** The grid in
  `slide-kit/shot-lab` on port 5237 reads them off, and `verify-box.sh` beside
  the captures crops the box back out to check it. A box three per cent out
  looks right in the source and sits beside the button on the slide.

## Commands

```bash
npx vite --port 5221 --strictPort
npx tsc -b --noEmit
npm run build:html                  # -> dist-single/deployment-session-10.html
export CHROME_PATH=/opt/google/chrome/chrome
node video-safe.mjs & node qa.mjs & node align-check.mjs & wait
```

Expected clean state: `video-safe` CLEAN, `align-check` 0, `qa` flagging
exactly the Welcome and Thank you slides as `NO LOGO`.

**Keep `slideCount` in `deck.config.json` current.** Every harness reads it.
