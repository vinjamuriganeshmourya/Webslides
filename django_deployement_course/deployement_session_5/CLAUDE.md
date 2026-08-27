<!-- cSpell:ignore nxttrendz deployement Makefile makefile PHONY colour behaviour -->
# Deployment · Session 5 — "Automating Deployment with Makefile"

This session's own notes. **The kit's rules live one level up**; this file only
holds what is true of this deck.

| | |
|---|---|
| Plan (the contract) | `../session_plans/deployement_session_5/plan.md` |
| Build rules and feedback log | `../workflow/skills/session-5-deck/SKILL.md` |
| Deck source | `src/decks/makefileDeck.tsx` (rules R1 to R8 in its header) |
| Session-owned figures | `src/ui/TargetAnatomy.tsx`, `src/ui/AutomationLadder.tsx` |
| Slides | 51 · devPort **5216** · `dist-single/deployment-session-5.html` |

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

## Current state, verified 2026-08-25

| Check | Result |
|---|---|
| `tsc -b --noEmit` | clean |
| `build:html` | 2.91 MB, self-contained, 9/9 assets inlined |
| `video-safe.mjs` | **CLEAN** |
| `qa.mjs` | 2 slides, the expected baseline (1 Welcome `NO LOGO` + blobs, 51 Thank you `NO LOGO`) |
| `align-check.mjs` | **0 of 51** |
| `preview.mjs` | 51 slides, 0 broken images, 0 console errors |
| Both figures | screenshotted and inspected, per content rule 17 |

## Two things that will bite an editor

**`CodeBlock`'s `language` prop defaults to `'python'`, and it is also the chip
label.** Every Makefile panel here passes `language="makefile"` on purpose. Omit
it and the slide ships with a `python` chip on a Makefile, with no type error.

**Every indented line in every code string uses `\t`, not spaces.** Slides 22 to
24 teach that Make accepts exactly one indentation character. Reformatting these
strings with spaces would make the deck contradict itself.

## The two figures are session-owned

`TargetAnatomy` and `AutomationLadder` sit in this session's `src/ui/` and are
exported from its barrel. `sync-kit.mjs` will not touch them, because it only
overwrites the files it lists.

`AutomationLadder` is the one recommended for promotion to the kit: sessions 6 to
11 are the rest of the same ladder and each will want it with the pin moved, the
way `JourneyRoadmap` is parameterised. That is the user's call under content rule
14 and it has not been made.

Both are built from real DOM elements rather than SVG text, deliberately. See S5
in the skill file for why.
