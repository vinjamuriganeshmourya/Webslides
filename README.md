<!-- cSpell:ignore deployement colour NxtWave webslides pptx devPort Streamlit -->
# Web Slides — user guide

You have this repo because you are building session decks: your own course, or
a one-off deck. The work is meant to be done **through Claude Code**, in this
directory. This guide is for you; [`CLAUDE.md`](CLAUDE.md) is the map Claude
reads automatically.

A deck here is a small React app that builds to **one HTML file**. That file is
the deliverable: an instructor double-clicks it and presents. No server, no
network, fonts and screenshots baked in.

---

## Before you start

| You need | Why |
|---|---|
| Node 18+ and npm | every deck is a Vite app |
| Google Chrome | the QA and preview scripts drive a real browser |
| Claude Code, opened at the repo root | so it loads `CLAUDE.md` and the skills |

Open Claude Code **at the repo root**, not inside a session folder. From the
root it can see the kit, the guides and your course at once; from inside one
session it cannot.

```bash
cd "Web Slides"
claude
```

Nothing else is set up globally. Each session installs its own dependencies the
first time you run it.

---

## Your first ten minutes

Run an existing deck, so you know what "working" looks like before you change
anything.

```bash
cd django_deployement_course/deployement_session_3
npm install          # a few minutes, once per session folder
npm run dev
```

Open the printed URL. Arrow keys move through slides. Then build the real
artefact:

```bash
npm run build:html
```

That writes `dist-single/deployment-session-3.html`. Open it directly from your
file manager. If that file looks right, your setup is correct.

---

## How the repo is arranged

```
slide-kit/                   shared by everyone. Not tied to any course.
django_deployement_course/   one course. Yours goes next to it, not inside it.
testing/                     parked, unused tooling
```

**Your course is a new folder at the root.** Do not add sessions inside
`django_deployement_course/` unless you are actually working on that course.

The rules and guides all live in `slide-kit/workflow/`, and the shared
rendering layer in `slide-kit/slide-template/`. You will rarely edit either.
What you edit is your own session's `src/decks/<yourDeck>.tsx`.

---

## Starting your own course

Ask Claude Code, at the repo root:

> Create a new course folder called `<name>` with its first session
> `<session-name>`, copied from the base template. Follow the steps in
> CLAUDE.md and give it a devPort nothing else uses.

It will copy `slide-kit/slide-template`, set `deck.config.json`, wire up
`activeDeck.ts` and create the `workflow/plans` folder. Doing it by hand is
five steps, written out in [`CLAUDE.md`](CLAUDE.md#starting-a-new-course).

---

## The one rule that shapes everything

**The slide-wise plan is written and signed off before any deck is generated.**

Not a formality. The plan is where the teaching order gets argued about, while
changing it is free. Once slides exist, restructuring means rebuilding
screenshots, animations and step counts.

So the flow is:

1. Give Claude the source material (a TR doc, a spec, your notes).
2. It extracts **at most four key concepts** and maps everything under them.
3. It writes a slide-wise plan to `<your-course>/workflow/plans/<session>.md`.
4. **You read the plan and say yes.** Push back here, freely.
5. Only then does it generate slides.
6. Verification: typecheck, build, and the browser sweeps.

`slide-kit/workflow/SLIDE_WORKFLOW.md` is the long version.

---

## Asking Claude Code for things

Useful shapes, roughly in the order you will need them:

> Read `<path to my TR doc>` and draft a slide-wise plan for a session called
> `<name>`. Stop at the plan; do not generate slides yet.

> The plan is approved. Generate the deck.

> Slide 12 is doing two things at once. Split it and renumber.

> Build the deck and run the verification sweep. Show me anything that fails.

> This deck is behind the kit. Check it and apply if it is.

Two habits make a large difference:

- **Point at files, not descriptions.** "Read `workflow/plans/session-2.md`"
  beats "you know the session 2 plan".
- **Say when to stop.** "Stop at the plan" prevents a helpful sprint past the
  sign-off gate.

---

## The content rules are enforced, and they are strict

`.claude/skills/slide-content-rules/SKILL.md` holds hard rules about wording,
punctuation, how terminals are drawn, how problems are sequenced, one idea per
slide, and what an illustration is allowed to imply. Claude loads it on its own
whenever it touches slide copy.

They read as fussy until you learn each one exists because a deck shipped with
that exact mistake. If a rule blocks something you want, say so and decide
deliberately, rather than working around it quietly.

---

## Verifying before you hand a deck over

From inside your session folder:

```bash
npm run typecheck
npm run build:html

export CHROME_PATH=/opt/google/chrome/chrome   # your Chrome path
node video-safe.mjs      # must print CLEAN
node qa.mjs              # only slide 1 should be flagged
node preview.mjs && node scripts/build-preview-page.mjs
```

`video-safe.mjs` catches anything that breaks under screen recording.
`qa.mjs` screenshots every slide and flags layout problems. `preview.mjs`
builds a contact sheet you can scroll to review the whole deck at once.

**Keep `slideCount` in `deck.config.json` accurate.** Every one of those
scripts reads it, and a stale number means the sweep quietly stops early and
reports success on slides it never looked at.

---

## Things that will trip you up

**Two sessions on the same dev port.** `devPort` in `deck.config.json` must be
unique per session, or `npm run dev` serves you a different deck than the one
you are editing.

**Editing kit files by mistake.** Anything under `src/design/`, `src/ui/`,
`src/slides/`, `src/motion/` or `src/deck/` is kit-owned and gets **overwritten**
the next time someone syncs. Your deck lives in `src/decks/`. The full table is
in `slide-kit/slide-template/KIT.md`.

**Expecting kit fixes to arrive automatically.** They do not, on purpose: a
signed-off deck must keep building unchanged. Pull them in per session:

```bash
cd slide-kit/slide-template
node sync-kit.mjs --check ../../<your-course>/<your-session>   # exits 1 if behind
node sync-kit.mjs --apply ../../<your-course>/<your-session>
```

Run `--apply` on a clean git tree. It keeps no backup, because git is the
backup.

**Committing the wrong things.** `node_modules/`, `dist/`, zips and preview
renders are all ignored already. The built `dist-single/*.html` decks **are**
committed on purpose, since they are what gets handed over. If you add ignore
rules, keep them `**/`-prefixed so they work at any depth.

---

## Where to look next

| Question | File |
|---|---|
| How is a deck built, start to finish? | `slide-kit/workflow/SLIDE_WORKFLOW.md` |
| What may I write on a slide? | `.claude/skills/slide-content-rules/SKILL.md` |
| How should the words read? | `slide-kit/workflow/TEXT_GUIDELINES.md` |
| Which slide type, which colour? | `slide-kit/workflow/STYLE_GUIDE.md` |
| How is a concept taught across slides? | `slide-kit/workflow/PEDAGOGY_GUIDELINES.md` |
| Kit or session — who owns this file? | `slide-kit/slide-template/KIT.md` |
| What has this specific deck decided? | that session's own `CLAUDE.md` |
