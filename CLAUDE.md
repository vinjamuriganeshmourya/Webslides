<!-- cSpell:ignore deployement colour NxtWave webslides pptx devPort Streamlit -->
# Web Slides

Presentation decks for NxtWave sessions. A deck is a React + Vite app that
builds to **one self-contained HTML file** an instructor opens by double-click:
no server, no network, fonts and images inlined.

This file is the map. It is loaded automatically at the start of every Claude
Code session in this repo; everything else is read on demand.

---

## Layout

```
RULES.md                    index of every standing rule ← start here

slide-kit/                  course-independent. Shared by every deck.
  assets/                   THE asset library. Fetch here first, then copy.
  slide-types/              registry of approved slide types and transitions
  slide-template/           THE KIT: rendering layer + a content-free base deck
    KIT.md                  what is kit vs. what a session owns  ← read first
    CLAUDE.md               working rules for the kit itself
    sync-kit.mjs            push kit changes out to a session
  workflow/                 how to build a deck, and what it must read like
    SLIDE_WORKFLOW.md       plan → sign-off → generate → verify pipeline
    STYLE_GUIDE.md          visual system: colour, type, slide-type choice
    TEXT_GUIDELINES.md      wording, titles, kickers
    PEDAGOGY_GUIDELINES.md  how a concept is taught across slides
    CLOUD_ARCHITECTURE.md   the studio tooling this repo grew out of
    icon-picker.html        browse the icon set
  template/ template (2)/ template-code/ template-html-page/
                            older template snapshots, kept for reference
  WebSlides_/ pptx_template/
                            reference material (both ignored by git, ~540 MB)

Outputs/                    EVERY COURSE lives here. A course is one folder.
  django_deployement_course/  ONE COURSE. Add a sibling folder for another.
    session_plans/            EVERY slide-wise plan. One folder per session.
      deployement_session_3/    plan.md ← the signed-off plan
    deployement_session_1_v1/   a session = one standalone Vite app
    deployement_session_2/
    deployement_session_3/
    workflow/
      reviews/                sign-off state
      skills/                 skills scoped to this course
      captures/               real screenshots used on slides
    versions/                 source-only zip snapshots (ignored by git)
  python/                     the Python course, sessions numbered 1_, 2_, … 14_
  oops_theory/                the OOPs course

Rules_beta/                 rule and layout sandboxes (zones, header, typography)

review-app/                 the deck review app. One server for the whole repo,
                            slide-wise and component-wise. Its README is the
                            manual; the section below is the command.

studio/                     Deck Studio: the whole pipeline in a browser, with
                            headless Claude Code behind it shown as a conversation.
                            Python server, React UI. Its README is the manual.

testing/
  review_app/               a Streamlit plan-review UI. NOT IN USE. See below.

.agents/skills/              VENDORED third-party skills. Never edit in place.
                             Installed with `npx skills add`, pinned by
                             skills-lock.json. Animation and design-craft
                             skills (animate, review-animations, baseline-ui,
                             emil-design-eng, improve-ui, …).
skills-lock.json             the pin file for the above

.claude/
  skills/slide-content-rules/SKILL.md    hard content rules — see next section
  skills/generate-slides/SKILL.md        the whole slide-generation procedure
  skills/tr-to-spec/                     TR doc -> session spec JSON, the hand-off
                                         a PDA builds the deck from. SKILL.md is
                                         the procedure, PDA_GUIDE.md the reader's
                                         side, scripts/ extract and check
  skills/prog-lesson-plan/               VENDORED, verbatim. The pedagogy team's
                                         own lesson-plan system: 10 references,
                                         9 scripts, and the reference
                                         implementations of the panels. Never
                                         edit in place — see below
  skills/<vendored>                      SYMLINKS into .agents/skills, so Claude
                                         Code loads them by description
  settings.json                          shared plugin list (committed)
```

**Several people work in this repo.** Before the first edit of anything, read
[`.claude/skills/branch-from-main/SKILL.md`](.claude/skills/branch-from-main/SKILL.md):
pull main, branch from it, work there. A branch cut from a stale main looks fine
for hours and then produces a merge nobody can review. Anything under
`slide-kit/slide-template/` is a PR, never a direct merge, because
`sync-kit.mjs --apply` pushes it into every session including signed-off ones.

### `.claude/skills/prog-lesson-plan` is VENDORED, and it is the reference

The pedagogy team's own system, copied in **verbatim** from the Programming
Foundations lesson-plan workspace, because its component building is what this
course is being held to. **Never edit a file inside it.** Corrections go in this
repo's own skills, naming what they override.

It builds three self-contained HTML files from Python; this repo builds a React
deck. What transfers is not its pipeline but its *contracts*:

| Read it for | File |
|---|---|
| the predict-then-run panel: Run locked until a vote, answers derived by a checker | `assets/predict-machine-reference.py` |
| the one-operation-per-press walker | `assets/execution-walker-reference.txt` |
| the hook's SVG craft | `assets/hook-svg-reference.txt` |
| panel chrome | `assets/panel-chrome-reference.txt` |
| the fixed spine and the four recap formats | `assets/standard_slides.py` |
| the theme the lesson-plan HTML was skinned with | `assets/ndt_theme.py` |
| browser assertions we have no equivalent for | `scripts/verify_plan.py` |
| the 23 activities, and the research behind them | `references/activity-library.md`, `references/evidence-base.md` |

Where it and this repo disagree, the vendored file is the evidence and ours is
the adaptation.

**Every standing rule in this repo is indexed in [`RULES.md`](RULES.md)**, one
line each, pointing at the file that holds the full text. Read it when you are
unsure whether something is a rule. Add to it only with the user's
confirmation, following the procedure at the bottom of that file.

**A course is just a directory.** Nothing in `slide-kit/` names a course, so a
second one is a new sibling folder, not a fork.

---

## Read these before touching slide content

In this order. They are short, and they exist because a deck shipped wrong.

0. **`.claude/skills/generate-slides/SKILL.md`** — read this **first** whenever
   the user asks for slides in any wording. It is the mandatory procedure and
   it supplies everything the user would otherwise have to restate: the plan
   gate, reusing kit components rather than writing markup, illustrations,
   icons, transitions, when a new component is justified, verification, and
   how to handle feedback. Never make the user specify these again.
1. **`.claude/skills/slide-content-rules/SKILL.md`** — hard rules, not
   preferences: banned punctuation and words, how terminals render, problem
   sequencing, one idea per slide, deck chrome colour, illustration honesty.
   Claude Code loads it by description when you write or review slide copy;
   read it explicitly if you are unsure whether something is allowed.
2. **`slide-kit/workflow/SLIDE_WORKFLOW.md`** — the pipeline. The rule that
   matters most: **no deck generation before the slide-wise plan is signed
   off.** Plans live at the path fixed in the next section.
3. **`slide-kit/workflow/TEXT_GUIDELINES.md`** and **`STYLE_GUIDE.md`** —
   wording and visual system.
4. **`slide-kit/slide-template/KIT.md`** — before changing anything under
   `src/`, so you know whether you are editing kit or session.
5. **`.agents/skills/`** — the vendored craft skills, for motion and visual
   polish. Section 4b of the generate-slides skill says which one to reach for
   and, more importantly, **the two places they disagree with this repo**:
   durations here run at the explanatory tier (roughly double their UI numbers),
   and everything they say about hover, drag and touch does not apply to a deck.
   Never edit a file under `.agents/skills/`; the next `skills add` overwrites
   it.

---

## Where a slide-wise plan goes — mandatory

Every slide-wise plan lives under its own course, one folder per session.
Every `<course>` path in this file is under `Outputs/`:

```
Outputs/<course>/session_plans/<session_name>/plan.md
```

For example:

```
Outputs/django_deployement_course/session_plans/deployement_session_3/plan.md
Outputs/another_course/session_plans/intro-to-testing/plan.md
```

**This path is not a suggestion. Follow it exactly.** No plan in a session's
own project folder, none loose at the course root, none in `workflow/`.
`<session_name>` matches the session project directory when one exists, so the
plan and the deck it describes are findable from each other by name alone.

**A session spec** (`spec.json`, made from a TR doc by the `tr-to-spec` skill)
lives in the same folder, `Outputs/<course>/session_plans/session_<n>/`, beside
the `tr.docx` it was made from. It carries no speaker notes, ever.

The folder is per-session so everything about that plan sits together:
`plan.md` is the plan itself, and revisions (`plan.rev3.md`), capture notes
(`captures.md`) and any machine-readable form (`plan.json`) go beside it. Only
`plan.md` is required.

Create the folder when you start planning a session, before writing a line of
it. If a course has no `session_plans/` yet, make it.

---

## Feedback becomes a written rule, with the user's consent

When the user gives feedback that would apply beyond the slide in front of
you, **ask whether to record it in a named file, then record it before
applying it.** Never record silently: what becomes a rule is the user's call.

Ask about a correction that would hold for the next deck, a stated preference,
or a "never do X". Do not ask about typos, wrong numbers, or a one-off nudge.
The test: *would this have changed what I did, on a different deck, next
month?*

Name the destination when you ask — the session's skill under
`<course>/workflow/skills/`, `.claude/skills/generate-slides/SKILL.md`,
`.claude/skills/slide-content-rules/SKILL.md`, or one of the
`slide-kit/workflow/` guidelines. Write the reason alongside the rule; every
hard rule in this repo names the deck that shipped wrong because of it.

Section 8 of the generate-slides skill has the full table.

---

## The kit / session split

`sync-kit.mjs` **overwrites** the kit-owned files in a target session and never
touches the rest. `KIT.md` has the full table; the short version:

| Kit owns (gets overwritten) | The session owns (never touched) |
|---|---|
| `src/design/`, `src/motion/`, `src/deck/`, `src/ui/`, `src/slides/` | `src/decks/<session>Deck.tsx` — the deck itself |
| `src/decks/sampleDeck.tsx` — the slide-type gallery | `src/decks/activeDeck.ts` — which deck is live |
| `src/App.tsx`, `src/index.css` | `deck.config.json`, `public/shots/` |
| `tailwind.config.ts`, `vite*.config.ts`, `index.html` | `package.json`, `CLAUDE.md`, `README.md` |
| `qa.mjs`, `preview.mjs`, `align-check.mjs`, `scripts/`, `workflow/export/` | `workflow/` plans, captures, sign-offs |

Sessions deliberately do **not** import a shared package. A signed-off deck
must keep building unchanged years later, so kit updates are a command you run
per session, not something that propagates on its own.

```bash
cd slide-kit/slide-template
node sync-kit.mjs --check ../../Outputs/django_deployement_course/deployement_session_2   # read-only, exits 1 if behind
node sync-kit.mjs --apply ../../Outputs/django_deployement_course/deployement_session_2
```

Paths are relative to wherever you run it, so a session in any course works.
Run `--apply` on a clean tree: it backs nothing up, because git is the backup.

---

## Working on a session

```bash
cd Outputs/django_deployement_course/deployement_session_3
npm install
npm run dev            # the deck, on the port in deck.config.json
npm run typecheck
npm run build:html     # -> dist-single/<htmlName>.html, the deliverable
```

Then the verification pass:

```bash
export CHROME_PATH=/usr/bin/brave-browser
node video-safe.mjs    # must print CLEAN
node qa.mjs            # only the Welcome, Thank You and All the Best frames are flagged (NO LOGO)
node preview.mjs && node scripts/build-preview-page.mjs
```

That is the short pass. The full one is the check list in
`slide-kit/slide-template/CLAUDE.md` (section 7, "Commands"): the twelve
checks session 31 was held to are in the kit since 2026-10-14, and a deck is
not done until every one prints clean or says it has nothing to check.

**Keep `slideCount` in `deck.config.json` current.** Every harness reads it,
and a stale count silently skips the tail of the deck.

Each session has its own `CLAUDE.md` with decisions specific to that deck. Read
it before editing that session.

---

## Reviewing a deck

```bash
node review-app/server.mjs      # port 5199, any session in any course
```

Pick a course, a session and a version, then comment on a slide or on a named
component inside it. Every comment lands in

```
<course>/workflow/reviews/<session>.review.md
```

which is the path you then point Claude Code at. It exists so that feedback on a
deck is a file in the repo rather than a screenshot in a chat: a comment that
names `CodeBlock` at `src/ui/CodeBlock.tsx:84` is actionable months later, and
"the grey box on slide 12 is wrong" is not. `review-app/README.md` covers the
flow, the file format, and what a session needs before it can be reviewed.

---

## The studio

```bash
cd studio && uv sync && (cd ui && npm install && npm run build)   # once
uv run python -m server.main                                     # http://127.0.0.1:8600
```

TR doc → plan → plan sign-off → generate → review → deck sign-off → export, one
pane each, with Claude Code running headless on your own login and shown as
messages, tool calls, approval cards and questions.
The UI owns the files and both sign-offs: the `STATUS` line in `plan.md` (the gate
`generate-slides` reads) and the review file (the review app's grammar). The model
steps are one prompt each, `/studio plan|generate|review <course>/<session>`,
which the studio sends for you. Every session pins a Claude Code
session id in `session_plans/<session>/studio.json` and resumes it, so a change
request lands in the conversation that already knows the deck. `studio/README.md`
is the manual.

---

## Starting a new course

1. `mkdir -p Outputs/<course-name>/{session_plans,workflow/{reviews,captures}}`
   from the repo root.
2. Copy `slide-kit/slide-template` to `Outputs/<course-name>/<session-name>`, minus
   `node_modules`, `dist`, `dist-single` and `workflow/preview`.
3. Edit `deck.config.json`: `name`, `title`, `htmlName`, and a `devPort` no
   other session uses.
4. Copy `src/decks/baseDeck.tsx` to `src/decks/<session>Deck.tsx`, point
   `src/decks/activeDeck.ts` at it, and replace the placeholder copy.
5. Follow `SLIDE_WORKFLOW.md` from stage 1. Plan first, sign off, then
   generate.

`slide-kit/slide-template/src/decks/` also holds `sampleDeck.tsx`, an
exhaustive gallery of every slide type and figure. Point `activeDeck.ts` at it
when a layout looks wrong; point at `baseDeck.tsx` when the theme looks wrong.

---

## What git tracks

One `.gitignore` governs the whole repo, and its patterns are all either
`**/`-prefixed or unanchored, so they keep working at any depth and a new
course inherits them for free. **Do not write path-anchored rules** like
`some_course/dist/` — they break the moment anything moves.

The principle: *whatever generates an artefact is tracked, the artefact is
not.* The exception is `dist-single/*.html` — the built decks are what gets
handed to an instructor, so they are committed on purpose.

Ignored and large: `node_modules/`, `dist/`, `*.zip`, `versions/`,
`WebSlides_/`, `pptx_template/`, `sample_ppts/`, `workflow/preview/`,
`workflow/qa-shots/`, and the generated halves of the export module
(`src/export/deckCss.ts`, `src/export/revealSteps.ts`).

---

## `testing/review_app` is not in use

A Streamlit UI for reviewing slide plans, from when sign-off ran through a web
app instead of through Claude Code. It is parked in `testing/`, not deleted,
because the prompts inside it record how review used to work.

It will not run as-is: it derives `PLANS_DIR` and `REVIEWS_DIR` from its own
location, which stopped being true when the kit was split out of the course. If
you ever revive it, that is the thing to fix first — give it an explicit
`--course` argument instead of guessing from its own path.
