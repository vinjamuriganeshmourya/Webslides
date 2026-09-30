# `slideautomation-slides-version-1` — Introduction to Docker, design pass

The session's own decisions. Everything about the kit itself is in
`slide-kit/slide-template/CLAUDE.md`; this file is only what is true of THIS deck.

The plan, and the running record of every correction applied:
[`session_plans/slideautomation-slides-version-1/plan.md`](../session_plans/slideautomation-slides-version-1/plan.md).

## What this is

**A copy of `deployement_session_1_v3`, 45 slides, with a design pass on top.**
The content is v3's, slide for slide, and it is not reopened: same claims, same
commands, same captures, same order. What changes is the visual system, the
figures and a few layouts, correction by correction, from a list the user
supplies.

Read `deployement_session_1_v3/CLAUDE.md` for everything about the content and
why it is shaped the way it is. Nothing in it is superseded here.

## It forks the kit, and that is the point

Most corrections land on kit-owned files (`src/slides/AgendaSlide.tsx`,
`src/slides/SectionBreakerSlide.tsx`, `src/ui/primitives.tsx`,
`src/ui/MachineBoundary.tsx`, `src/ui/points/*`, `src/ui/ContainerJourney.tsx`).
The colour of the agenda's circle cannot be reached from a deck file.

**So do not run `sync-kit.mjs --apply` against this project.** It would
overwrite every edited file with the kit's version and undo the pass. Run
`--check` if you want to know how far this copy has diverged; the answer is
"deliberately".

Nothing here reaches another deck until the user approves it and it goes out as
a PR (hard rule 14). The plan keeps the list of candidates.

## Three rules the user added on top of v3's six

- **No hover state anywhere in this deck.** Not on a card, not on a figure. A
  deck has no pointer in the room it is presented in, so anything only reachable
  by hover is content nobody sees.
- **No new colours.** Every value comes from `src/design/tokens.ts`. Where a
  correction names a colour the tokens do not have ("black-800"), it resolves to
  the nearest token and the plan records which: `colors.nwBlack`.
- **Solid fills or subtle gradients only.** The lit, multi-layer tile treatment
  (a highlight, a ramp, an inset hairline and a tinted shadow on one small box)
  comes off wherever a correction touches it.

v3's six rules (R1 to R6) are restated in the deck file's own header comment and
all six still hold, R6 in particular: the top-right 367x220 stays clear for the
instructor video, and half the corrections in this pass move things upward.

## Running it

```bash
npm run dev              # port 5230
npm run typecheck        # two pre-existing errors, see below
npm run build:html       # fails on the same two, see below

export CHROME_PATH=/usr/bin/brave-browser
node video-safe.mjs      # CLEAN
node qa.mjs              # baseline is two: Welcome and Thank you, both NO LOGO
node align-check.mjs     # 10 slides, all of them expected: see the plan
```

`slideCount` in `deck.config.json` is **45**, and the deck is 45 entries long.
v3's own `CLAUDE.md` says 47, which is stale: it counts two slides that the
final cut folded away. Every harness reads that number, so check it against
`grep -c "^    id: '" src/decks/slideAutomationV1Deck.tsx` after any edit.

## `tsc -b` fails on two files, and it failed in v3 too

```
src/export/slideModule.tsx: Cannot find module './deckCss'
src/export/slideModule.tsx: Cannot find module './revealSteps'
```

Both are the GENERATED halves of the export module, both are in `.gitignore`,
and neither is in the source project: `deployement_session_1_v3` reports the
identical two errors. So `npm run typecheck` and `npm run build:html` (which
starts with `tsc -b`) cannot pass in a fresh copy of any session here.

`revealSteps.ts` has a generator, `workflow/export/build-reveal-steps.mjs`, which
needs the dev server running. **`deckCss.ts` has none**: its generator was
`build-slide-module.mjs`, which is not in the repo (the note at the top of
`build-reveal-steps.mjs` records the same discovery about its own file). That is
the thing to fix if the export module is ever needed again.

Nothing in the deck imports `slideModule.tsx`, so the deliverable builds without
the typecheck step:

```bash
npx vite build -c vite.singlefile.config.ts \
  && node scripts/inline-assets.mjs \
  && node scripts/inline-fonts.mjs
# -> dist-single/slideautomation-slides-v1.html, 4.72 MB, self-contained
```

Everything the deck itself owns typechecks clean:
`npx tsc -b --noEmit 2>&1 | grep -v "deckCss\|revealSteps"` is empty.

## The browser the harnesses run on

`CHROME_PATH=/opt/google/chrome/chrome` is what the repo's docs assume and it
does not exist on this machine. `/usr/bin/brave-browser` is Chromium-based and
drives Playwright fine; every sweep and screenshot in this pass used it.

## Presenter controls

Unchanged from v3: `G` opens the slide index, `S` swaps the arrow keys between
whole slides and build steps, and the control bar hides until the cursor reaches
the bottom of the screen.
