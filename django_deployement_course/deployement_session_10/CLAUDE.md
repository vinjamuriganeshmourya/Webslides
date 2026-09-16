# Deployment Session 10 — "Deploying Your App on AWS"

**This is a SESSION, not the base template.** The kit's own rules still apply
and live at `slide-kit/slide-template/CLAUDE.md`.

| | |
|---|---|
| Status | **Scaffold.** Project created from the base template, constants written, slides not yet generated |
| `devPort` | 5221 |
| `htmlName` | `deployment-session-10` |
| Deck file | `src/decks/awsDeployDeck.tsx` (to be written), plus `src/decks/deckShared.tsx` |
| Plan | `../session_plans/deployement_session_10/plan.md`, **revision 2** |
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
