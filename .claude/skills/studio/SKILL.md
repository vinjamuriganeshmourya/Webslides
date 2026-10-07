---
name: studio
description: Run one step of the deck pipeline for the Deck Studio UI (studio/). Use when the user types /studio plan|generate|review <course>/<session>, or asks to act on a request from the studio. Reads the TR doc, plan and review file the UI wrote, does the work through this repo's existing skills, and writes results back to the same files so the UI picks them up.
---

# /studio <step> <course>/<session>

`$ARGUMENTS` is `<step> <course>/<session>`; `<step>` is `plan`, `generate` or
`review`. The studio sends this command as a prompt; a person can type it in a
terminal too. Everything below uses the paths CLAUDE.md fixes, and every
`<course>` path sits under `Outputs/` (so `<course>/session_plans/…` is
`Outputs/<course>/session_plans/…` on disk):

| | |
|---|---|
| TR doc | `<course>/session_plans/<session>/tr.md` |
| Plan | `<course>/session_plans/<session>/plan.md` |
| Notes from the UI | `<course>/session_plans/<session>/studio.json`, key `notes` (may be absent or null) |
| Deck | `<course>/<session>/` |
| Review | `<course>/workflow/reviews/<session>.review.md` |

The UI owns both sign-offs. **Never write `SIGNED OFF` into the STATUS line
yourself**; the buttons in the studio do that, and `generate-slides` section 0
reads the result as its gate.

## plan

1. Read the TR doc. If `studio.json` has `notes`, they are revision requests
   against the existing plan: apply them, do not start over.
2. Follow `slide-kit/workflow/SLIDE_WORKFLOW.md` stages 1 to 3 and the
   `slide-content-rules` skill. When the TR leaves a decision open, ask with
   `AskUserQuestion` rather than guessing; the person answers in the studio.
3. Write the plan to the plan path. The first bold line under the title is
   `**STATUS: AWAITING SIGN-OFF**`.
4. Set `notes` to `null` in `studio.json` when the revision is in.

## generate

1. Follow the `generate-slides` skill in full. If its gate finds the plan not
   signed off, hold there and say so; the studio has a sign-off button.
2. If `<course>/<session>/` does not exist, scaffold it first: CLAUDE.md,
   "Starting a new course", steps 2 to 4, with a `devPort` no other session uses.
3. End with `npm run build:html` and the verification pass, so
   `dist-single/<htmlName>.html` exists for the review stage. Append
   ` · GENERATED <date>` to the STATUS line, as the existing plans do.

## review

1. Read the review file. Every `- [ ]` comment is open; a slide whose verdict is
   `changes requested` needs a look even with no comment under it.
2. Fix each one in the deck source, following `slide-content-rules`. Mark it
   `- [x]` when done, or `- [~]` with a one-line reason indented under it when it
   should not be done. Leave the `<!--c:id-->` markers exactly as they are.
3. Rebuild with `npm run build:html`, then `node video-safe.mjs` and `node qa.mjs`.
   If the slide count changed, update `slideCount` in `deck.config.json`.
