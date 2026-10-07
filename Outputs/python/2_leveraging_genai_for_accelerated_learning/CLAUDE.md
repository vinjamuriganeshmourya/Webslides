<!-- cSpell:ignore NxtWave devPort strictPort -->
# Leveraging Gen AI for Accelerated Learning · session notes

Python course. Converted from `Python_PPT_slide/2_Leveraging GenAI for Accelerated Learning.pptx` to a 38-slide deck, from
the plan at `../session_plans/2_leveraging_genai_for_accelerated_learning/plan.md` (signed off 2026-09-22).
Course-wide rules, including the feedback log, are in
`../workflow/skills/python-course/SKILL.md`. Read that before editing.

## Decisions specific to this deck

1. **No stock illustrations** (course rule R1). Every source slide that carried
   a picture is a plain `ContentSlide` with the source sentence.
2. **Six prompts, verbatim**, through the kit figure `PromptCard`. The long
   coding-problem prompt runs at `fontSize={13}`, the lever for length.
3. **One Quiz Time frame added** before Key Takeaways (hard rule 18). The
   source had none; the plan's sign-off default was to add it.
4. **Four dividers, not the source's five.** Generating Code, Quiz Generation
   and Coding Problem Generation are slide titles under the Generation divider.
5. **Tool marks.** `claude.png` and `gemini.png` are 512px renders of the
   simple-icons marks; `chatgpt.png` and `meta-ai.png` are crops from the PPTX
   and should be replaced when a source is found.

## Running it

`vite.config.ts` is a kit file and hardcodes port 5173, so start the server on
the port the harnesses read from `deck.config.json`:

```bash
npx vite --port 5229 --strictPort
export CHROME_PATH=/opt/google/chrome/chrome
node video-safe.mjs & node qa.mjs & node align-check.mjs & wait
npm run build:html && node preview.mjs && node scripts/build-preview-page.mjs
```

`preview.mjs` renders the **built** `dist-single/python-session-2-leveraging-genai-for-accelerated-learning.html`, not the dev
server, so rebuild before trusting the contact sheet.

## Verification, 2026-09-22

| Harness | Result |
|---|---|
| `tsc -b --noEmit` | clean |
| `build:html` | self-contained, every asset inlined |
| `video-safe.mjs` | CLEAN |
| `qa.mjs` | 2 slides, the documented baseline (1 and 38, `NO LOGO`) |
| `align-check.mjs` | 0 of 38 |
| `preview.mjs` | 38 slides, 0 broken images, 0 console errors |
| contact sheet read slide by slide | done |
