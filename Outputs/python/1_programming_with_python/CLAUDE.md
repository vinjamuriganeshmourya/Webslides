<!-- cSpell:ignore NxtWave devPort prnt PayScale strictPort -->
# Programming with Python · session notes

Python course, session 1. Converted from
`Python_PPT_slide/1_Programming with Python.pptx` (42 source slides) to a
45-slide deck, from the plan at
`../session_plans/1_programming_with_python/plan.md` (signed off 2026-09-22).
Course-wide rules, including the feedback log, are in
`../workflow/skills/python-course/SKILL.md`. Read that before editing.

## Decisions specific to this deck

1. **No stock illustrations.** The plan was written illustration-first and the
   first render was rejected: *"build new and our own only if required for the
   content."* Every slide that had a PPT picture is now a plain `ContentSlide`
   with the source sentence, and the dividers are `SectionBreakerSlide` with no
   image. The extracted pictures stay in `public/assets/illustrations/` as
   reference only; nothing renders them.
2. **Every output is a real run.** CPython 3.12.3. The four tracebacks in the
   Possible Mistakes run are verbatim, with the file path shortened to
   `main.py` (the playground's name for the file). Change a snippet, run it.
3. **`CodeOutput`, `LogoWall`, `RadialSpread` are kit figures**, promoted from
   this deck on 2026-09-22 into `slide-kit/slide-template/src/ui/`, exported,
   in the gallery and the registry. Do not edit the copies here.
4. **`AgendaSlide.Y_TOP` moved from 236 to 268 in the kit.** The first item sat
   42px inside the instructor-video rectangle on every deck that passed a `sub`.
   Kit change, synced into all four Python sessions.
5. **Two honest gaps.** Huge Salaries carries no figures (the source's PayScale
   numbers are inside an unreadable image). The Code Playground capture runs a
   different message than `print("Hello World!")`, and its caption says so.
6. **Three soft marks.** `companies/flipkart.png`, `tech/chatgpt.png` and
   `tech/meta-ai.png` are small crops out of the PPTX. Replace them in the
   library when a proper source is found.

## Running it

`vite.config.ts` is a kit file and hardcodes port 5173, so start the server on
the port the harnesses read from `deck.config.json`:

```bash
npx vite --port 5228 --strictPort
export CHROME_PATH=/opt/google/chrome/chrome
node video-safe.mjs & node qa.mjs & node align-check.mjs & wait
npm run build:html && node preview.mjs && node scripts/build-preview-page.mjs
```

`preview.mjs` renders the **built** `dist-single` file, not the dev server, so
rebuild before trusting the contact sheet.

## Verification, 2026-09-22

| Harness | Result |
|---|---|
| `tsc -b --noEmit` | clean |
| `build:html` | `Inlined 38/38 assets`, 5.41 MB |
| `video-safe.mjs` | CLEAN |
| `qa.mjs` | 2 slides, the documented baseline (1 and 45, `NO LOGO`) |
| `align-check.mjs` | 0 of 45 |
| `preview.mjs` | 45 slides, 0 broken images, 0 console errors |
| contact sheet read slide by slide | done; slides 11 and 21 re-shot at 4.2s settle |
