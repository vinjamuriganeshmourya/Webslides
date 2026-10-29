---
name: cloud-computing-course
description: Build rules and the running feedback log for every session of the Cloud Computing course (Outputs/cloudcomputing/). Use whenever planning, generating, editing, reviewing or QA-ing a cloud computing session's plan (Outputs/cloudcomputing/session_plans/<session>/plan.md), deck source (Outputs/cloudcomputing/<session>/src/decks/*.tsx) or player settings, and whenever the user gives feedback on a cloud computing deck, so the feedback is recorded here before it is applied.
---
<!-- cSpell:ignore NxtWave -->

# Cloud Computing course · deck rules

| | |
|---|---|
| Course | `Outputs/cloudcomputing/`, one folder per session |
| Sessions | `cloud_computing_fundamentals` (session 1, port 5270), `deployment_and_service_models` (session 2, port 5271), `setting_up_your_aws_account` (session 3, port 5272), `virtualization_and_hypervisors` (port 5273), `containers_vs_virtual_machines` (session 4, port 5274) |
| Plans | `Outputs/cloudcomputing/session_plans/<session>/plan.md` |
| Start a new session from | the latest cloud computing session, not the kit: the player options below live in session-local kit files |

## R1. The step/slide switch is hidden in every cloud computing deck

**Feedback, 2026-10-23, on session 1:** *"remove the step wise and slide switch
... just hide it don't remove ... because it is autoanimation going on there is
[no] reason to keep the switch ... for every cloud computing you need to follow
this."*

- Every cloud computing deck sets `hideModeSwitch: true` in its
  `DeckMeta.player` (`src/decks/<session>Deck.tsx`).
- The option is `DeckPlayerOptions.hideModeSwitch` in `src/deck/types.ts`,
  read by `src/deck/Deck.tsx` (mode pinned to `slides`, the toggle a no-op,
  the browser's saved choice ignored), `src/deck/DeckControls.tsx` (the button
  is `null`, so all three bar layouts drop it) and `src/deck/useKeyboardNav.ts`
  (`initialArrowMode(remembered)`). These are session-local changes to kit
  files; the kit template does not have the option yet. A session copied from
  the kit instead of from a cloud computing session must carry these four
  files over.
- **Hide, never remove.** The button, the `S` binding and the `?nav=steps` URL
  flag stay in the code: the harnesses (`nav-stress-check.mjs`,
  `controls-clear-check.mjs`, `box-overflow-check.mjs`, `overlap-check.mjs`)
  drive the deck with `?nav=steps`, and a later deck with real build steps
  turns the switch back on by leaving the option out.

Why: these decks animate themselves. Every slide reports 0 build steps
(`revealEveryStep`, session 1's "No builds" decision) and the entrances run
on their own clock, so "step" and "slide" were two names for the same move,
and a presenter who pressed the switch saw its label change and nothing else
happen.

## R2. A new session starts from the latest session, and the reference is rendered first

**Standing practice, from session 2 (2026-10-23).** The course's sessions
carry session-local kit changes (the player options, the quiz frame, the
takeaways frame, the section bar, the presenter and student views, the
entrance layer). A new session is a copy of the latest session minus `dist`,
`dist-single`, `node_modules/.vite`, `workflow/preview`, `workflow/qa-shots`
and `public/shots`, with `deck.config.json` (`name`, `title`, `htmlName`,
`devPort`, `slideCount`), `src/decks/activeDeck.ts` and a new deck file.
Session 2's `devPort` is 5271; take the next free one.

The reference deck for a session is a built React deck in `Reference ppt's/`.
Render it frame by frame (`?all#/N`) with Playwright and dump each frame's
text, its `notes` (which quote the TR's speaker notes and Visual Guidance)
and a screenshot BEFORE writing the plan; the on-slide strings are the
reference's verbatim, and the Visual Guidance is the spec for every figure.
Session 2's dump scripts are in that day's scratchpad (`ref2/dump.mjs`,
`ref2/notes.mjs`); re-create them from the description above if gone.

## R3. Analogy slides carry no text about the picture

**Feedback, 2026-10-28, on session 4 (Containers vs Virtual Machines):** *"Remove any text that describes or
explains the visual. Keep only the visual and the tags inside it."*

- An analogy slide is the kicker, the title and the two pictures. No analogy sentence as a lead, no caption
  pill under either stage, no `SAME IDEA` words (the arrow between the stages stays).
- `IsoAnalogy` takes `bare` for exactly this, and `h` for a taller stage so the pictures use the freed space.

Why: the sentence and captions described what the pictures already show, and the room read instead of looking.

## R4. Screenshot highlights are orange, and screenshots are served sharp

**Feedback, 2026-10-28, on session 4:** *"Change all red highlights to orange and increase screenshot clarity
(higher resolution, sharper rendering)."*

- The highlight ring on a screenshot is the template orange (`colors.accent`), never red.
- A screenshot is served from a 2x Lanczos upscale with a light unsharp mask (session 4's `figures/cv/shots-hd/`),
  so the browser never blur-scales a small source. Crops stay in source pixels.

Why: red read as an error on a step that had gone right, and the small TR captures looked soft once enlarged.

## R5. Recap, agenda and Key Takeaways show the main points only

**Feedback, 2026-10-28, on session 4:** the recap, the agenda and the takeaways lost their sub-text; *"keep
only the points, consistent with Sessions 1, 2, and the earlier sessions."* This holds even when a request says
"use the text verbatim": the sub lines stay in the source, not on these frames (it confirms lesson 4 below).

Why: session 4 was first built with the TR's full lines on these frames because the request said "do not
shorten", and the user asked for them back to titles only.

## Lessons carried from session 1's reviews (so they are not repeated)

Recorded from `../reviews/cloud_computing_fundamentals.tr-comparison*.md`
and the user's words on session 2 ("make sure you are not repeating the
mistakes from session 1"):

1. **Never paraphrase the TR.** Session 1's leads on three slides carried a
   review's rewording for days. Every string is the reference's; only rule
   36 moves a full stop.
2. **Every analogy clause gets a label.** Session 1 drew "one encyclopedia
   set" and "unaware of its neighbours" but labelled neither. A clause the
   TR wrote is a label on the scene or a line under the claim.
3. **Draw the TR's Visual Guidance, not a nicer picture.** The user's 2026-10-23
   list on the session 2 reference was mostly "the visual is different from
   the visual given in the TR doc". When the reference's notes quote the
   Visual Guidance, the figure draws exactly those elements.
4. **Section breakers carry the title only; agenda and takeaways carry the
   five titles only.**
5. **The lead and the body are one block** (`Card` in `scene.tsx`): a figure
   never floats away from its lead, and a points column sits directly under
   the lead.
6. **The feedback slide stays** (content rule 41); its deletion was for
   session 1 only, on the user's word.
7. **Labels are DOM text**, never svg `<text>`: the harnesses, the text audit
   and the presenter's edit mode all read DOM text.
8. **Check the port before trusting a screenshot.** A stale dev server from a
   scratch copy served session 1 on 5271 for six hours; `ss -ltnp` first.
