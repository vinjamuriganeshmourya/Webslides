<!-- cSpell:ignore NxtWave devPort strictPort -->
# Sequence of Instructions · session notes

Python course. Converted from `Python_PPT_slide/4_Sequence of Instructions [CQ-Upd.].pptx` to a 47-slide deck, from
the plan at `../session_plans/4_sequence_of_instructions/plan.md` (signed off 2026-09-22).
Course-wide rules, including the feedback log, are in
`../workflow/skills/python-course/SKILL.md`. Read that before editing.

## Decisions specific to this deck

1. **No stock illustrations** (course rule R1). Every source slide that carried
   a picture is a plain `ContentSlide` with the source sentence.
2. **Five `VariableTrace` slides replace 27 source slides.** Each program is
   one slide and its lines are the build steps: step 0 is the code alone, each
   click lights a line, updates the boxes and appends the output. Every trace
   value was checked against a real run on CPython 3.12.3.
3. **The IndentationError on the Spacing slide is the Code Playground's text**
   as the source shows it, caret line included; 3.12 prints it without the
   caret. The slide's lead says it is the playground's output.
4. **`BodmasStrip` is session-owned**, in `src/decks/figures/`. `EvalSteps`
   and `VariableTrace` are kit figures promoted from this deck.
5. **Three concepts, not the source's four pills.** Printing and Assignment is
   the sub-line of Variables, as the source layout draws it.

## Running it

`vite.config.ts` is a kit file and hardcodes port 5173, so start the server on
the port the harnesses read from `deck.config.json`:

```bash
npx vite --port 5231 --strictPort
export CHROME_PATH=/opt/google/chrome/chrome
node video-safe.mjs & node qa.mjs & node align-check.mjs & wait
npm run build:html && node preview.mjs && node scripts/build-preview-page.mjs
```

`preview.mjs` renders the **built** `dist-single/python-session-4-sequence-of-instructions.html`, not the dev
server, so rebuild before trusting the contact sheet.

## Verification, 2026-09-22

| Harness | Result |
|---|---|
| `tsc -b --noEmit` | clean |
| `build:html` | self-contained, every asset inlined |
| `video-safe.mjs` | CLEAN |
| `qa.mjs` | 2 slides, the documented baseline (1 and 47, `NO LOGO`) |
| `align-check.mjs` | 0 of 47 |
| `preview.mjs` | 47 slides, 0 broken images, 0 console errors |
| contact sheet read slide by slide | done |
