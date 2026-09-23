<!-- cSpell:ignore NxtWave devPort strictPort -->
# Variables and Data Types · session notes

Python course. Converted from `Python_PPT_slide/3_Variables and Data Types.pptx` to a 39-slide deck, from
the plan at `../session_plans/3_variables_and_data_types/plan.md` (signed off 2026-09-22).
Course-wide rules, including the feedback log, are in
`../workflow/skills/python-course/SKILL.md`. Read that before editing.

## Decisions specific to this deck

1. **No stock illustrations** (course rule R1). Every source slide that carried
   a picture is a plain `ContentSlide` with the source sentence.
2. **`ApplicationForm` is session-owned**, in `src/decks/figures/`. It is the
   source's analogy drawn once and returned to on nine slides with different
   tags. A second deck would want a different form, so it is not in the kit.
3. **`ValueTypeMap` and `MonoBadge` are kit figures**, promoted from this
   deck. `MonoBadge` exists because `align-check.mjs` read a padded `Chip`
   with 24px type as a wrapped token on five slides.
4. **Three dividers** for the source's single one, matching the three agenda
   items.

## Running it

`vite.config.ts` is a kit file and hardcodes port 5173, so start the server on
the port the harnesses read from `deck.config.json`:

```bash
npx vite --port 5230 --strictPort
export CHROME_PATH=/opt/google/chrome/chrome
node video-safe.mjs & node qa.mjs & node align-check.mjs & wait
npm run build:html && node preview.mjs && node scripts/build-preview-page.mjs
```

`preview.mjs` renders the **built** `dist-single/python-session-3-variables-and-data-types.html`, not the dev
server, so rebuild before trusting the contact sheet.

## Verification, 2026-09-22

| Harness | Result |
|---|---|
| `tsc -b --noEmit` | clean |
| `build:html` | self-contained, every asset inlined |
| `video-safe.mjs` | CLEAN |
| `qa.mjs` | 2 slides, the documented baseline (1 and 39, `NO LOGO`) |
| `align-check.mjs` | 0 of 39 |
| `preview.mjs` | 39 slides, 0 broken images, 0 console errors |
| contact sheet read slide by slide | done |
