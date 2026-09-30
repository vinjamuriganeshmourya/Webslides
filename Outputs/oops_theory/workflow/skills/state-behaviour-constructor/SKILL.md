---
name: state-behaviour-constructor-deck
description: Build rules and the running feedback log for the OOPs Theory session 2 deck, "State, Behaviour & Constructor", at oops_theory/state_behaviour_constructor. Use when editing, regenerating or reviewing that deck, its plan at oops_theory/session_plans/state_behaviour_constructor/plan.md, or the session-owned figures under its src/ui/trial. Covers the pseudocode-only rule, the figure line ceilings that shaped the slide count, the dry-run output convention, the three figures it contributed to the kit, and the definitions variants still on trial.
---
<!-- cSpell:ignore NxtWave behaviour colour colours devPort unDraw memberId borrowedBooks displayInfo -->

# State, Behaviour & Constructor · build rules

Scoped to ONE deck: `oops_theory/state_behaviour_constructor`. The repo-wide
rules are in `RULES.md`; the deck's own reasoning is in its `CLAUDE.md`, which is
longer than this file and is the place to read before changing a slide. This file
is the short list of things that will bite, plus the feedback log.

---

## The five that bite

**1. No language is ever named.** The source teaches OOP in pseudocode and that
is the point. There is no Python, no Java, no file path, no terminal and no tech
logo anywhere in the deck, so hard rules 3, 11 and 12 have nothing to act on. If
you add a slide that names a language, you have changed what the session is.

**2. `LineAnnotated` holds eight lines. Count before you add one.** Its stage is
400px, the frame costs 96px and a row is 34px, so the ninth line is 306px against
304px of room and the figure refuses to draw, at render time rather than at
typecheck time. This ceiling is why `borrow()`, `returnBook()` and `display()`
have a slide each. A note that fits one line at 82 characters is free; a note that
wraps costs 20px.

**3. `TraceTable` holds two variables, not three.** The trace column is 314px
shared between them, so two leave 157px each and hold an 18-character value;
three leave 104px, which does not hold `"Harry Potter"`. Its pseudocode panel
holds eight lines and its output column about eleven characters, so the printed
text lives on a `CodeOutput` frame instead.

**4. Output is a DRY RUN and the pane says "What it prints".** Nothing in this
deck was executed, because pseudocode has no interpreter. Every printed line
traces to a `PRINT` statement shown earlier in the deck. That is not a licence to
compose: change a `PRINT`, change the printed line.

**5. Key Takeaways is generated from `CONCEPTS`.** The array at the top of the
deck file feeds both the agenda and the takeaways, because hard rule 20 wants
them identical. Edit the array, never either slide.

## What went to the kit, and the one thing still on trial

Three components were built here and are now in the kit, imported from `@/ui`
like everything else. **This session keeps no private copy**, which is the half
of the promotion procedure that usually gets skipped:

| In the kit now | |
|---|---|
| `ObjectState` + `ObjectStateRow` | a named thing and the values it holds right now, with `changed` on the row that moved |
| `StateChange` | the same thing before and after one operation, moved rows computed rather than authored |
| `CodeOutput` | built in the Python session, copied here, and the second copy is what triggered the promotion |

Still on trial: `src/ui/trial/definitions/`, five variants from
`slide-kit/definitions-lab`, which has picked no winner. This deck exercises
`TermGrid`, `TermLede` and `BandSplit` and is evidence for whichever wins.

## The kit defect this deck found, and fixed

`SectionBreakerImageSlide` **could not clear the instructor-video rectangle on
any content.** Its media landed at roughly x=686..1216, y=160..544 and a fixed
`h-80 w-80` blurred disc sat behind it at x=791..1111, y=192..512. The reserved
rectangle is x=913..1280, y=0..220, so every slide of that type intruded, by
303px at worst, and `align-check.mjs` reported the same slides again as DRIFT.
Neither was reachable from props.

It now puts the copy on the header datum and the art in a fixed 460x264 box
centred beneath it, which clears the rectangle for any asset. **The box is
declared rather than inferred, and that is the load-bearing part**: an
illustration renders a `Scene` that collapses without a width, and an `<svg>`
with a viewBox and no `width`/`height` has a ratio but no size. The first cut used
`w-auto` and every divider rendered with no art at all.

## Verification, and the two things that differ from other sessions

```bash
npx vite --port 5240 --strictPort
npx tsc --noEmit -p tsconfig.app.json
export CHROME_PATH=/usr/bin/brave-browser
{ node video-safe.mjs & node qa.mjs & node align-check.mjs & wait; }
```

1. **`CHROME_PATH` is `/usr/bin/brave-browser`.** There is no Chrome at
   `/opt/google/chrome/chrome` on this machine, which every other session's notes
   assume.
2. **`npm run typecheck` and `npm run build:html` cannot pass**, repo-wide and
   pre-existing: `tsc -b` fails on `src/export/slideModule.tsx`, which imports two
   generated files that are gitignored and absent. Use the `-p tsconfig.app.json`
   form above, and build with `npx vite build -c vite.singlefile.config.ts &&
   node scripts/inline-assets.mjs && node scripts/inline-fonts.mjs`.

Baselines: video-safe **CLEAN**, qa **2 slides** (1 and 57, both `NO LOGO`,
both carrying the mark on stage), align-check **0 of 57**.

## Then look at the figures, because the harnesses cannot

Content rule 17. Four defects on this deck passed `tsc` and all three sweeps, and
every one was found by screenshotting a slide and looking at it:

| What rendered | Why no harness saw it |
|---|---|
| three blank icon discs on the `PeerCards` slides | `PeerCards` draws its 34px tile whether or not an icon was given, and an empty tile is a correctly placed rectangle |
| every divider with **no illustration at all** | the plate script had stripped `width`/`height` off the SVGs, and an `<svg>` with a viewBox but no intrinsic size resolved to nothing inside `flex justify-center`. An image occupying no pixels is not an overflow, an intrusion or a misalignment |
| `START HERE` on three unrelated lead rows | it is the points ramp's default word for `tone: 'lead'` and it is a correctly rendered string. Pass `tag` |
| two red `ProblemPanel`s where a figure should be | a refusal is a well-behaved box. `PeerCards` at 700px needed 760; a `LeadAndRest` label was 53 characters against 52 |

`node preview.mjs && node scripts/build-preview-page.mjs` builds the contact
sheet. Read it frame by frame; the three sweeps are necessary and they are not
the check.

---

## Feedback log

Corrections the user gives on THIS deck go here, newest last, each with the date
and the reason. A correction that would hold for a different deck next month goes
to a repo-level file instead, named when it is offered.

*(nothing yet: the deck has not been reviewed)*
