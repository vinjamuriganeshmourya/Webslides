<!-- cSpell:ignore NxtWave devPort strictPort Riya -->
# For Loop · session notes

Python course. Built from the pedagogy team's lesson plan
`prog_foundations_LP/14 - For Loop`, under the plan at
`../session_plans/14_for_loop/plan.md`. Course-wide rules, including the
feedback log, are in `../workflow/skills/python-course/SKILL.md`. Read that and
`.claude/skills/pedagogy-to-components/SKILL.md` before editing.

36 slides. `devPort` 5232.

## Decisions specific to this deck

1. **Every code panel says `Python`** (content rule 31a). The source invented
   twelve file names for a session where the learner types into a playground.
   `CodeBlock` takes `filename="Python"`, `CodeOutput` panes take
   `location="Python"`, and `VariableTrace` is passed `location="Python"`
   because its own default is `Code Playground · main.py`.
2. **Five session-local figures** in `src/decks/figures/`: `PhonePlaylist`,
   `PiggyBank`, `SequenceWalk`, `MatchPairs`, `RangeDial`, over a shared beat
   engine in `walk.ts` and a shared caption in `BeatCaption.tsx`. They are NOT
   in the kit yet, on purpose: `slide-kit/sequence-lab/` is choosing the final
   designs in parallel. When it lands, delete these files and re-point the call
   sites at `@/ui`.
3. **The source's `data-anim-labels` are the build steps**, in order and under
   their own names, so the room sees the beats the pedagogy team wrote.
4. **The classroom quiz stays mid-deck**, straight after worksheet task 2, where
   the source puts it (course rule R2). Content rule 18 would otherwise put the
   last quiz frame immediately before Key Takeaways; R2 and the signed-off plan
   win here, and there is only one quiz frame.
5. **Two slides are `ContentSlide`s that ask a question**, not `QuestionSlide`s,
   although the plan calls them `Q`: `Can We Simplify This?` and
   `Which one prints nothing?` both need code in front of the room to be
   answerable, and `QuestionSlide` carries the question and nothing else
   (content rule 16, which names this exact fallback).
6. **Key Takeaways restates the four agenda items word for word** (content rule
   20), not the plan's six free-written statements. Only `The One Mistake`'s sub
   differs from the agenda's, because "the one everybody makes" states no fact.
7. **Every output is a real run** on CPython 3.12.3 (course rule R3), including
   the trailing space `print("* " * counter)` really emits on each star row.
8. **No stock illustrations** (course rule R1). Slides with nothing to draw are
   plain typographic `ContentSlide`s.
9. **The hook and the story are drawn as the real objects** (course rule R5):
   a phone with a real playlist on it, and a piggy bank that fills with coins.
   The first cut drew both as rows of boxes reading `Song 1` and `Day 1 / ₹1`
   and was rejected. Abstract tiles stay only on the string walk, where the
   items really are characters.
10. **Nowhere on the phone does it say how many songs there are.** The card's
   whole question is *what told it to stop?*, and a `5 songs` label answers it
   before it is asked. The pedagogy team's own build asserts this in a browser
   check: the caption may say five, because that is the instructor's line, but
   the phone may not. The row that showed the count now reads `Playlist`.

11. **The session name does not appear before the hook.** The deck opened with a
   Welcome card and then a second card reading `For Loop`, two frames before the
   hook that exists to make the room want a for loop. Naming the topic first
   answers the hook's question in advance. That card is gone; the name arrives on
   the `Today's topic` divider after the hook, as the source orders it, and it is
   the reason this deck is 36 slides and not 37.

12. **The named products carry their real marks** (content rules 12 and 13).
   `companies/spotify.png` and `companies/instagram.png` were already in
   `slide-kit/assets/` and are copied byte-identical into
   `public/assets/companies/`. Nothing here hand-draws a trademark.

## Running it

`vite.config.ts` is a kit file and hardcodes port 5173, so start the server on
the port the harnesses read from `deck.config.json`:

```bash
npx vite --port 5232 --strictPort
export CHROME_PATH=/opt/google/chrome/chrome
node video-safe.mjs & node qa.mjs & node align-check.mjs & wait
npm run build:html && node preview.mjs && node scripts/build-preview-page.mjs
```

`preview.mjs` renders the **built**
`dist-single/python-session-14-for-loop.html`, not the dev server, so rebuild
before trusting the contact sheet.
