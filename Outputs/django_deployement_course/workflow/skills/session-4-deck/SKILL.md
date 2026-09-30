---
name: session-4-deck
description: Build rules, decisions and the running feedback log for Deployment Session 4, "Running the Real App with Docker" (project deployement_session_4). Use whenever writing, editing, reviewing or QA-ing that session's plan (session_plans/deployement_session_4/plan.md), its deck source (deployement_session_4/src/decks/runningRealAppDeck.tsx), its four figures, or any slide, illustration or terminal transcript in it. Also use when the user gives feedback on session 4 slides, so the feedback is recorded here before it is applied.
---
<!-- cSpell:ignore nxttrendz deployement runserver gunicorn nvmrc PYTHONUNBUFFERED colour behaviour -->

# Session 4 deck rules

| | |
|---|---|
| Plan | `django_deployement_course/session_plans/deployement_session_4/plan.md` |
| Deck | `deployement_session_4/src/decks/runningRealAppDeck.tsx` |
| TR doc | `/home/nxtwave/docker_jenkins_aws/04_running_django_app_with_docker.md` |

Rules **R1 to R8** live in the deck file's header comment, next to the code they
govern. This file holds what does not belong in a source comment: why the deck
is shaped this way, and the feedback log.

---

## S1 The paradox is a three-act structure. Do not collapse it.

Slide 44 writes `VITE_API_BASE_URL: http://localhost:8000`. Slide 45 names it as
a flat contradiction of session 3's rule and **refuses to resolve it**. Slides 67
to 69 resolve it.

This is content rule 4 and it is the best beat in the TR. Any edit that explains
the answer before slide 67 costs the session its ending. If a learner solves it
early, the instructor note says to acknowledge them and move on rather than
teaching it there.

## S2 `0.0.0.0` is a door policy, never an address

Slide 27's two-row table is the defence against the most common confusion in
this material. `localhost:8000` is what you type; `0.0.0.0` is what the server
binds to. Any slide that lets those two blur has to be rewritten, not softened.

## S3 Every terminal panel is quoted from the TR

Docker Desktop does not run on the capture machine, the same blocker that left
sessions 1 to 3 quoted. Versions, timings and container names are the TR's and
are illustrative. Swapping in real captures later needs no layout change.

## S4 Two folders means two terminal panels

Slide 9's argument is that the old ritual happened in two places. One panel with
two prompts erases the argument. Carried from session 3's S4.

## S5 Wide or tall children need a `lead`

Learned the hard way on this deck: **10 of 78 slides failed `video-safe.mjs`**
on the first sweep, all of them lead-less slides carrying a full-width child.

A lead-less header stops short, the body well starts higher, and a tall centred
child's top edge reaches into the instructor-video rectangle
(`x 913..1280, y 0..220`). Session 3 hit the same class of failure and fixed it
the same way, which is why all five of its `CodeBuildSlide` slides carry a lead.

So: **any slide with a `CodeBlock`, `Terminal`, `DataTable`, `FileTree` or a
figure gets a `lead`.** It is also better slide copy, so this costs nothing.

`BrowserOutsideDocker` needed more than a lead. At full width it is 1152x534,
too tall to centre clear of the rectangle, so slide 69 caps it with
`className="mx-auto max-w-[800px]"`. Do not remove that cap.

## S6 The four figures are not in the kit

`PortPublish`, `BrowserOutsideDocker`, `VolumeShadow` and `ExecAnatomy` live in
this session's `src/ui/`. Content rule 14 makes promotion the user's call, and
the plan's §5.1 records the recommendation: the first two are general to any
containerised web app, the last two are close to one-offs for this TR.

Until promoted they are session-owned. `sync-kit.mjs` will not touch them,
because it only overwrites the files it lists.

## S7 The kit's `devPort` is not wired to Vite

`vite.config.ts` hardcodes `server.port: 5173`; the harnesses read `devPort`
from `deck.config.json`. They have never agreed, in any session. Start the
server explicitly before running any harness:

```bash
npx vite --port 5215 --strictPort
```

## S8 Asset paths must be literals, or they break only in the deliverable

`scripts/inline-assets.mjs` finds assets by scanning the built HTML for literal
`/assets/...` paths. A template literal is invisible to it.

The natural helper is:

```tsx
<img src={`/assets/tech/${name}.png`} />   // WRONG
```

It works in `npm run dev`. It works in `npm run build`. It fails in
`npm run build:html`, the only build that ships: the bundle keeps
`assets/tech/${i}.png` verbatim, nothing is inlined, and under `file://` every
icon is a broken image in the deck the instructor opens.

This deck uses a static `TECH_SRC` map instead, so every path is a literal the
inliner can see. Adding a technology means adding a line, which is the point:
it fails at compile time rather than silently in the deliverable.

**Session 3 has the bug.** Its committed
`dist-single/deployment-session-3.html` contains `assets/tech/${i}.png` and its
`Tech()` icons do not render. Not fixed here: that deck is signed off, and
changing it is the user's call. The fix is the same static map.

Keep the map trimmed to what the deck renders. Every entry is inlined whether a
slide uses it or not, and ten unused logos added 290 KB to the file.

## S9 The harnesses cannot see inside your figures

All four figures in this deck are SVG, and `qa.mjs`, `video-safe.mjs` and
`align-check.mjs` measure DOM rectangles. An `<svg>` is one rectangle. Every
label inside it is invisible to all three.

Both figures shipped to review with collisions while all three harnesses
reported clean:

| Figure | What collided | Fix |
|---|---|---|
| `PortPublish` | the two `8000` labels sat above the doors, level with the zone titles, straddling the box borders | moved below the doors and 34 into their own zone |
| `BrowserOutsideDocker` | both `localhost:` labels were centred at x=300, on top of the port doors and the dashed Docker boundary | moved to x=340, the clear span between door and container |

`VolumeShadow` and `ExecAnatomy` were checked at the same time and are fine.

**Screenshot all four after any change to them.** Content rule 17. The
arithmetic looks right in source right up until a font renders wider than the
coordinate assumed, and SVG text has no layout engine to keep it apart from a
neighbour.

## S10 Compose highlights are derived, not counted

`hl(stage, ...needles)` at the top of the deck returns the line numbers whose
text matches. `CodeBuildSlide.highlight` takes numbers, and hardcoding them
broke silently the moment the file was compacted by one line: every highlight
below the removed line moved onto the wrong row, with no type error and no
harness complaint.

The needles have to be specific. `'volumes:'` matches **both** the service-level
key and the top-level block in the final stage, so that call uses
`'    volumes:'` with its indentation.

---

## Feedback log

Per the repo's feedback rule, corrections that would apply to future decks are
recorded here before they are applied. Nothing yet: the deck has not been
reviewed by the user.

| Date | Feedback | Applied as |
|---|---|---|
| 2026-08-21 | `\\` rendering as two backslashes on slides | Content rule 15. 19 JSX attributes fixed |
| 2026-08-21 | A question slide should hold only the question, and compound questions should split | Content rule 16, new `QuestionSlide` in the kit, slide 18 split into two |
| 2026-08-21 | Slides overlapping, and asked for a deterministic constraint | `align-check.mjs` added to the mandatory sweep in generate-slides §7. It already existed and had never been run |
| 2026-08-21 | Slides 42 and 70 had overlapping labels inside figures | Content rule 17, and S9 above |
| 2026-08-21 | Deck had no quiz frame; one is mandatory and a lone one goes before Key Takeaways | Content rule 18. `quiz-time` inserted at 77, deck now 80 |
