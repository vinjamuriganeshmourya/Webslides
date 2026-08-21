---
name: slide-content-rules
description: Hard content, wording, animation and chrome rules for NxtWave/NIAT session slide decks. Use whenever writing, editing, or reviewing slide copy, deck source under a session project (src/decks/*.tsx), slide plans in <course>/session_plans/<session>/plan.md, slide components in src/ui or src/slides, or terminal/command/table/illustration content on a slide. Covers banned punctuation, banned words, terminal rendering, problem sequencing, one-idea-per-slide, parallel text-and-visual reveal, deck chrome colour, illustration honesty, technology logos, the central asset library, and registering approved slide types.
---

# Slide content rules

These are **hard rules**, not preferences. Each exists because a deck shipped
breaking it and had to be fixed. Apply them while writing, and check them before
declaring a deck done.

Read alongside `workflow/STYLE_GUIDE.md` (voice, text budget) and
`workflow/SLIDE_WORKFLOW.md` (the plan → sign-off → generate pipeline). Where
this file and the style guide disagree, **this file wins**: it records explicit
user corrections.

---

## 1. Punctuation: never use a spaced em dash

**Banned in every rendered string:** `—` used as a connector (` — `).

Applies to slide titles, leads, bullets, bullet subs, table cells, card bodies,
callouts, captions, chips, component labels and any string a component renders.
JSX comments are fine.

Use instead: a comma, a colon, a full stop, or parentheses.

| Don't | Do |
|---|---|
| `Heavy — RAM/CPU reserved up front` | `Heavy. RAM and CPU reserved up front.` |
| `Be lightweight — megabytes and seconds` | `Be lightweight: megabytes and seconds` |
| `WSL 2 — every container shares it` | `WSL 2. Every container shares it.` |
| `all dependencies — runtime, libraries — into one unit` | `all dependencies (runtime, libraries) into one unit` |

`·` as a separator is fine (`Install · start · verify`). En dashes in numeric
ranges are fine (`items 1–4`). It is the **spaced em dash connector** that is out.

**Check:** `grep -n "—" src/decks/*.tsx src/ui/*.tsx` and confirm every hit is
inside a `{/* comment */}`.

## 2. Words: never call the user's audience a stranger

**Banned:** *stranger* (and *a stranger's browser*). It reads as suspicious or
threatening, which is not the meaning.

Use: **others**, *anyone else*, *someone else*, *another person*.

| Don't | Do |
|---|---|
| `Can a stranger's browser reach it?` | `Can others open it?` |
| `Send it to a stranger` | `Send it to someone else` |

## 3. Terminals: one panel per terminal, with the folder path

When a slide shows commands the learner types:

- **Render VS Code's terminal, not a file view.** Use the `Terminal` component
  (panel tab strip `PROBLEMS · OUTPUT · TERMINAL`), not `CodeBlock`. `CodeBlock`
  is for *files* (traffic lights, filename, line numbers).
- **Every command carries its prompt path**: `PS C:\ecommerce\backend> python manage.py runserver`.
  The folder is teaching content: "wrong folder" is the first error learners hit.
- **Two terminals means two panels, side by side.** Never stack two different
  terminals' prompts inside one panel, and never merge them into one command
  list. If the app needs a backend terminal and a frontend terminal, that is two
  `Terminal` components with two different paths and two captions.
- Label each one for what it runs (`Terminal 1 · the API`).
- **Captures come from VS Code's integrated terminal too**, never from a
  standalone PowerShell or Windows Terminal window. This holds for every command
  in the session, including installer and Docker commands, so the deck and the
  learner's screen never diverge. When a command needs elevation
  (`wsl --install`), launch **VS Code itself as administrator** and use its
  integrated terminal: the panel inherits VS Code's privileges. Do not open a
  separate elevated shell.

## 4. Problem sequencing: name a later problem, never open it

When a session solves problem 1 of N:

- **Do not name tools for the later problems.** A tool name means nothing to
  someone who has not felt the problem it solves. Say `Comes later in this
  course`, not `AWS EC2, Nginx, ports, domains, CI/CD`.
- **Do not break a later problem into stages**, and in particular do not name
  its individual stages. Show it as one unopened block. It gets decomposed in
  the session that teaches it.
- **Do not grey out or fade the later problem** on the slide that introduces
  both. It is a real problem of equal weight, just not today's. Fading reads as
  "less important". *Exception:* a "you are here" roadmap may mark it visually
  unopened, because that figure's whole job is showing position.
- **Immediately after the slide that names both problems, state the order out
  loud in a slide of its own**: they are solved in order, you cannot swap them,
  so we solve problem 1 first. Then keep pointing back at it whenever someone
  asks about the later problem.

## 5. One idea per slide, and one item per slide in a list of items

When content is a numbered series the learner must weigh individually (attempts,
options, approaches, failure modes), give **each one its own slide**. Do not put
two on one slide and three on the next.

Shape that works: kicker `Attempt 3 of 5`, a 2–3 word title, the claim as the
lead in quotes, 2 bullets of what it is, and one `Callout` titled `Why it fails`.

This beats the 2–4 content slides per concept guideline. Pacing and one-idea-per
-slide outrank the slide count.

## 6. Text and its supporting visual reveal in parallel

A slide's text and the visual that supports it are **one idea**, so they arrive
together on slide entry. They must never be sequenced.

The trap: click-gated bullets (`BulletList` default, which wraps each item in a
`Step`) consume every build step, so a visual wrapped in a further `Step` cannot
appear until the last bullet has been clicked. The slide then reads as two
sequential halves.

How to keep them parallel:

- `BulletList` beside a visual: pass **`immediate`** (staggers on entry via
  `Reveal` instead of gating on `Step`).
- The visual: wrap in `RevealGroup` + `Reveal`, never `Step`.
- Components with their own build: pass **`stepped={false}`** (`LayerStack`) or
  use `Reveal` internally (`MachineBoundary`), so they animate on entry.
- Supporting `Callout`s: pass **`asStep={false}`**.
- `DataTable`, `AnalogyMap` and `JourneyRoadmap` already stagger on entry.

Keep `Step` only for a genuine teaching beat, where the pause is the point:
the "Why it fails" callout after a claim, and `QuizSlide`'s answer reveal.

**Check:** load a paired slide **without** `?all`. Both columns must be fully
visible at step 0, and the counter should show no leftover steps.

## 7. Deck chrome is grey, and never doubles the session name

- The slide counter, nav arrows and dot rail must be **grey on a near-opaque
  light chip**, never white. White chrome is invisible on the light content
  stages, which are most of the deck, and mid-grey alone has too little contrast
  on the night/brand stages. The chip gives one constant background so the same
  grey reads on both families. Grey, not dark: it must not compete with content.
- **The footer carries the NxtWave mark only.** Do not repeat the session name
  there: it sits directly under the bottom-right control cluster and collides
  with the slide counter, and every content slide already shows the session name
  in its kicker. This supersedes `SLIDE_WORKFLOW.md` Stage 6, which still asks
  for the session name in the footer.

## 8. Illustrations must depict the slide's own concept

Never place an available-but-unrelated illustration to fill space. Check what
the asset actually draws, not what its name suggests: an asset built for another
session usually encodes that session's *problem*, and will contradict this one.

If nothing fits: leave the slide typographic and record the missing asset as
outstanding work. A blank-but-honest divider beats a misleading picture.

## 9. When content changes, chase the dependents

Cutting or rewording slide content breaks things that pointed at it. After any
content edit, check and update:

- **Quizzes** that test the removed material. A quiz may only test something the
  deck actually taught.
- **Figures** whose labels cite the removed material.
- **Agenda items, divider subtitles, and key takeaways** that describe a
  structure you just changed (a "five stage journey" that is now three stages).
- **Speaker notes** that reference a slide by its old name or number.

## 10. Verify by rendering, never by reading

A deck is not done until every slide has been rendered and looked at.

- Run the QA script: `node qa.mjs "http://localhost:5173/?all" <slideCount>`.
  It walks every element on every slide and compares its rect to the 1280×720
  frame, and asserts the footer mark is present.
- **`?all` is required.** Without it, `Stepper` fragments are invisible and
  every screenshot looks empty while measuring correctly.
- Expect only `pointer-events-none` decorative blobs to be reported as
  "overflowing"; those bleed off-canvas by design.
- Also confirm: build passes, `tsc -b --noEmit` clean, spoiler rules hold
  (grep the pre-reveal region), and no slide's body exceeds the corpus p90 of
  117 words.

## 11. Screenshots are cropped to the point, and the output is highlighted

A raw capture is evidence, not a slide asset. Never drop a full-desktop or
full-window screenshot onto a slide and rely on the learner to hunt for the part
that matters.

Before a capture goes on a slide:

- **Crop to the region of interest.** A terminal capture becomes the terminal
  panel, not the whole editor with its file tree, tab bar, side panel, taskbar
  and clock. A browser capture becomes the address bar plus the rendered result,
  not the whole desktop.
- **Highlight only when the crop is not enough.** Cropping is mandatory;
  a highlight box is not. If the cropped capture already puts the point in the
  middle of a short frame, adding a box around the command is noise, and a deck
  where every capture wears a box teaches the learner to ignore boxes.
  Add one only when the eye still needs directing: a long output where a single
  line carries the claim (`WARNING: This is a development server`,
  `Unable to find image 'hello-world:latest' locally`), or an address bar inside
  a busy browser chrome. Then use one box, underline or dimming overlay, never
  more than one per capture, matching the slide's one idea.
- **Keep enough frame to stay honest.** Crop to remove noise, never to remove
  context that changes the meaning. A terminal crop keeps its `PS <path>>`
  prompt, because the folder is teaching content (rule 3).
- **Never retouch the output text itself.** If a transcript is wrong or dirty,
  re-run the command and re-capture. Editing pixels to say what you wanted is
  the mockup this workflow forbids.

Capture files keep the full uncropped original alongside the cropped asset, so a
later reviewer can confirm the crop did not distort what happened.

## 12. A technology named on a slide carries its logo

If a slide names or uses a technology — Django, Docker, React, Postgres, npm,
VS Code, an operating system — its mark goes on the slide. A learner scanning a
diagram finds the logo before they finish reading the label, and a stack
diagram with three named boxes and no marks makes them read all three.

- **PNG is the format.** Fetch it as PNG into `public/assets/tech/<name>.png`
  and reference it as `/assets/tech/<name>.png`.
- **An existing SVG satisfies this rule.** Nine logos predate the PNG
  convention and are still referenced; do not re-fetch a PNG of a logo the deck
  already renders from SVG just to comply.
- **Fetch it into the central library first**, never straight into a session.
  See rule 13.
- **Never reference a logo file that is not on disk.** This is not theoretical:
  `TwoRuntimes` and `OneProcessRule` asked for `django.png`, `nodejs.png`,
  `python.png` and `react.png` while only the `.svg` files were present, so
  every deck copied from the base template rendered four broken images. After
  adding a logo reference, confirm the file resolves.
- Name it after the technology, lowercase, no version number. A light-on-dark
  variant takes the `-white` suffix, like `docker-white.png`.

The logo supports the label; it does not replace it. A mark with no name beside
it is a guessing game for anyone who does not already know the technology.

## 13. Every asset lives in the central library first

`slide-kit/assets/` is the one place images are kept: `tech/` for technology
logos, `quiz/` for quiz decorations, `brand/` for the NxtWave mark.

**Look there before fetching anything.** If the asset exists, copy it into the
session's `public/assets/`. If it does not, fetch it into the library, then
copy it across. Never fetch straight into a session, and never keep a
session-only copy of something another deck will want.

A deck cannot read the library at runtime — Vite serves from the project's own
`public/`, and the single-file build inlines from there — so `public/assets/`
is a working copy of library files, byte-identical to them.

This rule exists because the opposite happened: each session kept its own
assets, they drifted, and the base template ended up shipping references to
files that only existed in one session. `slide-kit/assets/README.md` has the
current inventory and the naming convention.

## 14. An approved slide type or transition goes into the kit and the registry

A layout or motion built for one slide, once the user approves it as worth
keeping, is not finished when it renders. It is finished when the next deck can
find it.

- The component moves into the kit — `src/slides/` for a slide type, `src/ui/`
  for a figure, `src/motion/` for a transition — and is exported from the
  barrel, so `sync-kit.mjs` carries it to every session.
- It is added to `src/decks/sampleDeck.tsx`, the gallery the next person
  browses. A component missing from the gallery is invisible.
- It gets a row in `slide-kit/slide-types/README.md` saying **what it is for**,
  not just its name.

**Approved means the user said so.** A one-off arrangement for a single slide
stays inline in that deck; promoting everything turns the kit into a junk
drawer, and a signed-off deck's output changes when the kit does.

Retiring follows the same path in reverse: into `remove:` in `sync-kit.mjs`
with the reason, and marked retired in the registry, the way `QuizSlide` is.
