<!-- cSpell:ignore nxttrendz deployement Makefile makefile PHONY colour behaviour -->
# Deployment · Session 5 — "Automating Deployment with Makefile"

This session's own notes. **The kit's rules live one level up**; this file only
holds what is true of this deck.

| | |
|---|---|
| Plan (the contract) | `../session_plans/deployement_session_5/plan.md` |
| Build rules and feedback log | `../workflow/skills/session-5-deck/SKILL.md` |
| Deck source | `src/decks/makefileDeck.tsx` (rules R1 to R8 in its header) |
| Session-owned figures | `src/ui/TargetAnatomy.tsx`, `src/ui/AutomationLadder.tsx`, `src/ui/SpeedDial.tsx` |
| Slides | 47 · devPort **5216** · `dist-single/deployment-session-5.html` |

Read the plan and the skill file before editing a slide. The plan's §9 is a
guideline audit of the first draft and names five defects worth not repeating.

---

## Running it

`vite.config.ts` hardcodes port 5173 and every harness reads `devPort` from
`deck.config.json`. They have never agreed, in any session, so start the server
explicitly:

```bash
npm install
npx vite --port 5216 --strictPort        # NOT `npm run dev`
```

Then, from another shell:

```bash
npm run typecheck
npm run build:html                       # -> dist-single/deployment-session-5.html

export CHROME_PATH=/opt/google/chrome/chrome
node video-safe.mjs  &                   # must print CLEAN
node qa.mjs          &                   # baseline is TWO slides: 1 and 51
node align-check.mjs &                   # must print 0 of 51
wait
node preview.mjs && node scripts/build-preview-page.mjs
```

`workflow/export/build-reveal-steps.mjs` ignores `CHROME_PATH` and launches
Playwright's own browser, so on a fresh machine it needs
`npx playwright install chromium-headless-shell` once.

## Current state, verified 2026-09-03

51 slides became 58 and then 47, across one review pass with two phases.

The deck grew first: three slides out (`setup`, the `Beyond Shortcuts` aside, and
`c1-the-shortcut` once the commands stopped being teased before the analogy) and
ten in, including six that taught CI and CD rather than gesturing at them.

Then concept 4, **"Makefile in CI/CD", was cut whole** -- fourteen slides,
including those six. Three came straight back on the follow-up *"you can include
the interface"*, and they are the close of concept 3 now rather than a section of
their own. So the deck carries **three concepts**, not four, and the agenda and
the takeaways carry three items each (content rule 20 keeps them identical).

Plan §10 has the full account; R7 in the deck header records why nothing may
reintroduce CI/CD here.

| Check | Result |
|---|---|
| `tsc -b --noEmit` | clean |
| `build:html` | 2.94 MB, self-contained |
| `video-safe.mjs` | **CLEAN** |
| `qa.mjs` | 2 slides, the expected baseline (1 Welcome `NO LOGO` + blobs, 47 Thank you `NO LOGO`) |
| `align-check.mjs` | **0 of 47** |
| All three figures | screenshotted and inspected, per content rule 17 |

**There is no `Quiz Time!` frame and no `Recap`.** Content rule 18 makes a quiz
frame mandatory and this deck does not have one. That is the user's explicit
call, made when the `setup` slide was cut: asked whether to add one, the answer
was "neither, just remove slide 5". Recorded here so the next person does not
read it as an oversight and does not re-add it without asking.

## Two things that will bite an editor

**`CodeBlock`'s `language` prop defaults to `'python'`, and it is also the chip
label.** Every Makefile panel here passes `language="makefile"` on purpose. Omit
it and the slide ships with a `python` chip on a Makefile, with no type error.

**Every indented line in every code string uses `\t`, not spaces.**
`c2-anatomy` through `c2-missing-separator` teach that Make accepts exactly one
indentation character. Reformatting these
strings with spaces would make the deck contradict itself.

## The three figures are session-owned

`TargetAnatomy`, `AutomationLadder` and `SpeedDial` sit in this session's
`src/ui/`. **They are imported BY PATH, not through `@/ui`.** `src/ui/index.ts`
is kit-owned, so the sync that moved `lead` into `SlideLead` deleted the
re-export lines that used to sit at its tail and this deck stopped compiling with
"Module '@/ui' has no exported member 'AutomationLadder'". A path import names a
file no sync touches. `KIT.md` records this as a standing trap; it cost four
decks.

**`AutomationLadder` is no longer rendered.** It was concept 4's figure and the
section is gone. The file stays, unreferenced, because it is the kit-promotion
candidate recorded below, and R7 in the deck header says so too. `tsc` does not
flag an unused FILE, only an unused import, so nothing breaks; if it is ever
promoted or deleted, R7 is the note to update.

`SpeedDial` is an iPhone dial pad with three keys assigned to contacts, built
over three review rounds (story, then iPhone UI, then the real keypad). Its
header comment carries all three asks and why the keypad beats an abstraction of
one. It is a one-off for this analogy and is **not** a promotion candidate.

`AutomationLadder` is the one recommended for promotion to the kit: sessions 6 to
11 are the rest of the same ladder and each will want it with the pin moved, the
way `JourneyRoadmap` is parameterised. That is the user's call under content rule
14 and it has not been made.

All three are built from real DOM elements rather than SVG text, deliberately.
See S5 in the skill file for why.
