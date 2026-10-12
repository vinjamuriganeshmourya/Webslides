# new-template-slide-generation · the Working with Lists deck in the new template

**What this is (2026-10-12).** A copy of `Outputs/python/20_working_with_lists`
(Programming Foundations session 20, 28 slides; 30 here, see slides 27 and 30 below) re-dressed in the new
template, `updated_template/`. Made on the user's word to see how an existing
deck looks in the new design. **The rules below apply to this project only**:
nothing here goes back to the kit, to the Python decks or to any rule file.

**What changed, and nothing else:**

- **The ground.** `src/decks/template/ground.tsx` draws the template's three
  grounds (`grounds.ts` is the template's fitted gradient file, verbatim) on a
  1920×1080 box scaled by 2/3 onto the kit's 1280×720 canvas: the paper wash
  with its two rings under every light slide, the closing gradient with its
  rings under every dark slide, the welcome mesh under the opener. `SlideBase`
  paints it under the content and no longer renders the kit's wash, hairline
  arcs, orbs and dot grid (the blocks are kept in the file, switched off).
  The footer bar is the template's flat brand blue.
- **The header.** `SlideHeader` lost the two edge bars and gained the style
  guide's gradient divider BETWEEN the kicker and the title: 3px, 400px long,
  29px under the header's top, so the kicker and the title keep the boxes they
  had. The kicker is DM Sans, the title Sora SemiBold (`font-tpl-body`,
  `font-tpl-title` in `tailwind.config.ts`; `fonts.tplTitle` / `fonts.tplBody`
  in `tokens.ts`; both faces added to `index.html`, the kit's three stay).
- **The chrome slides**, re-dressed to the template's frames with the kit's
  motion kept: `BrandSlide` (welcome: white mark, glass pill, mesh; the
  discs, stars, waves and rule went with the old ground; then, on the user's
  word the same day, the mark's entrance and float, the two halo rings and
  the four sparkles were DELETED too, so the mark sits static and only the
  word still animates, letter by letter), `WelcomeSlide
  minimal` (the session name: section-breaker type), `SectionBreakerSlide`
  (template faces), `ThankYouSlide` (white mark, glass pill, gradient). The
  agenda (`figures/Agenda.tsx`) lost only its blue blur; the quiz and
  feedback frames are untouched and take the ground from `SlideBase`.
- **Config.** `deck.config.json` name and `htmlName`
  `new-template-working-with-lists`, `devPort` 5261; `spec-check.mjs` points
  at the new file and at `../Reference ppt's/…` from this folder.

- **The fonts and text colours (the user's sheet, later the same day; this
  project only).** Four faces, nothing else loaded: **Sora SemiBold** for the
  session title (slide 5), the section title (slide 8), the welcome and
  thank-you hero words, and the two big single words "Agenda" and "Quiz
  Time!"; **DM Sans SemiBold** for every slide title and every heading inside
  a figure (question lines, task names, agenda point titles, chip, button and
  vote labels, badge numbers); **DM Sans Medium** for every kicker and all
  body text (bullets, sub lines, captions, worksheet steps, speech bubbles,
  the phone mock, the feedback copy, the index numbers under the memory
  boxes, the timer digits); **Fira Code** for code panes, output panels, the
  ids, names and values in the memory pictures, and the player's own counter,
  mode label and picker; **Ubuntu Mono** for the title bar of every code and
  terminal window ("Python", OUTPUT, the terminal tabs). The oversized "01"
  behind the section title follows the heading face. Weights are Medium and
  SemiBold only (`fontWeight` remap in `tailwind.config.ts`,
  `font-synthesis-weight: none` in `index.css`). Text colour is the sheet's
  navy #002A4B for headings AND body on light slides (`ink`, `body` in both
  token files); white stays on the dark slides; highlights stay #2D63FB.
  Poppins, Inter and JetBrains Mono are gone from `index.html`.
- **One size per slide type (user, later the same day).** The section
  breaker's title (slide 8, "Objects") was on the kit's `text-slide-title-lg`
  token (44px) while the session-name slide (slide 5) had the template's
  measured section-title size (101px on 1920 = 67px here). Both are the
  template's Section Breaker, so `SectionBreakerSlide` now sets 67px too
  (`text-[67px]`, leading 1.05, the same as `WelcomeSlide minimal`). Rule for
  this project: every size comes from `updated_template`'s `type` tokens
  (÷1.5), applied to EVERY slide of that type; never a kit token beside a
  template number inside one type.

**Kept exactly:** every figure, press, step, vote, timer, key, gesture,
transition, the player, the harnesses and the spec contract. Checked on the
built file: `spec-check` (21 cards, the spec's press counts, keys, steps
mode), `video-safe` 27 CLEAN, one screenshot per slide in `workflow/qa-shots/`.
`qa.mjs` wants a server URL; `.shots.mjs` screenshots the built file instead.

**Slide → template layout:** 1 welcome → Welcome; 5 session name and 8 section
divider → Section Breaker; 6 agenda → the orbit agenda (template slide 7) on
the agenda ground; 2–4, 7, 9–18, 20–26 → the content header (template slide
8) over the slide's own figure; 19 quiz and 28 feedback → no template frame,
the ground only; **27 → Next Session** (added on the user's word, 2026-10-12,
after the takeaways: `src/slides/NextSessionSlide.tsx`, the template's
signpost from `slidestraining/nextsession/` with every number ÷ 1.5: mesh
ground and rings, glass chip "Next Session »" 79px tall, label DM Sans
Medium 51px, the name "Lists and Strings" in Sora SemiBold 84px on a 109px
pitch centred in a 920px measure, corner mark; chip and name reveal the kit's
way. The reference puts the chip's top at y=205 and the name at y=298; on
the user's word the two are instead ONE BLOCK CENTRED BOTH WAYS in the
slide with the reference's 14px between them: measured chip y 259..338,
name line box y 352..461, block centre (640, 360)); 29 → Thank You; **30 → All The Best** (added the same
day as the deck's final slide: the template's send-off is the thank-you frame
with different words, so it is `ThankYouSlide title="All The Best"`).
`slideCount` 30, two more 0s in `revealSteps.ts`, `spec-check` walks 30. The
harness count stays 27 (the feedback frame, now slide 28, never goes
network-idle), which covers the next-session slide; 28 to 30 are checked by
eye and measured: both hero words 100px Sora SemiBold, pill centred on y=445,
mark top y=205; the next-session name 84px, one line, no overflow.

```bash
npm run dev            # http://localhost:5261
npm run build:html     # -> dist-single/new-template-working-with-lists.html
CHROME_PATH=/usr/bin/brave-browser node spec-check.mjs
CHROME_PATH=/usr/bin/brave-browser node video-safe.mjs "file://$PWD/dist-single/new-template-working-with-lists.html" 27
```

---

The session's own notes follow, as copied. Read `devPort` 5249 as 5261 and
the deck's name as above.

<!-- cSpell:ignore NxtWave devPort Chuttamalle Hukum Kaavaalaa Kesariya Naatu Illuminati Kiran -->
# Working with Lists · session notes

Python course, Programming Foundations session 20. Built 2026-10-06 from the
pedagogy team's session spec, `Reference ppt's/20_working_with_lists_session_spec.json`
(the data) and `…_spec.html` (the reading page, with thumbnails of the original
deck's slides 7 to 75), under the plan at
`../session_plans/20_working_with_lists/plan.md`, the same way session 19 was
built. Course rules and the feedback log: `../workflow/skills/python-course/SKILL.md`.

28 slides, one per spec card. `devPort` 5249. Deck file `src/decks/workingListsDeck.tsx`.

## Decisions specific to this deck

1. **One slide per spec card, all 28, in the spec's order.** Every card with
   presses carries `data-spec` and `data-presses` equal to the spec's
   `press_count` (`spec-check.mjs` asserts it on the built file).
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `src/decks/figures/spec.ts` from the JSON; every program, output, trace
   step, caption, option, why line and takeaway sentence on a slide comes from
   it. Re-run the script if the spec changes. All 25 programs and the exit's
   four variants were run on CPython 3.12.3 and match.
3. **One picture, one engine** (`figures/memory.tsx`): tags with arrows,
   rows of boxes, value objects with id labels, cubes, slot arrows, grey
   objects; placed by coordinates, moved by tweening them, so a re-pointed
   tag's arrow lifts and lands. `pictureOf()` turns a spec step (`points`,
   `lists`) into the picture; `usePhase()` plays movement inside one press
   (E1's line 3, the hook's swipe) only when the press went forward by one.
   Layouts keep the arrow that must not move on a fixed path (list_b on C10,
   E1; kiran on T3).
4. **The spec's keys work without touching the player** (`figures/keys.ts`):
   first open adds `?nav=steps` to the address (never to storage, which
   `file://` shares across decks) so → / ← are one press; F clicks the
   player's full-screen button, A its slide picker; End lives in
   `StepControls` (`figures/controls.tsx`), which knows the card's remaining
   presses; `useVoteKeys` gives every vote keys 1 to n. All stand down while
   the marker is open.
5. **The agenda is static**, the plain `AgendaSlide` exactly as session 19's
   (content rule 44): no step-through, no selected point, no Next / Replay.
   The spec's per-press agenda was built, then removed on the user's word.
6. **The standard feedback slide** (content rule 41): `figures/FeedbackForm.tsx`
   from session 17 (session 18's file with the standard header) and
   `public/assets/feedback-qr.png`. Its Google Form frame never lets a page go
   network-idle, so the dev-server harnesses (`video-safe`, `qa`,
   `align-check`, `mixed-align-check`, `build-reveal-steps`) are run with a
   count of 27; slide 28 is the kit's Thank you slide, checked by eye, and its
   0 steps were appended to `src/export/revealSteps.ts` by hand.
7. **Votes are clickable, Next is never gated** (session 16's decision 5);
   confetti when the marked pick was right. Timers: 3:00 (T1), 4:00 (T2,
   T3), 2:30 (X1), started by the instructor.
8. **Ids are the original deck's own example numbers**, always labelled as
   examples. No card uses two equal string literals (spec defect 4).
9. **The quiz frame is `QuizTimeSlide lesson` only** (content rule 28);
   session 19 passed a subtitle, which is not carried.
10. **Session-local figures** in `src/decks/figures/`: `memory`, `trace`
    (`CodePane`, `StepCaption`, `Vote`, `TraceCard`), `RecapBug`, `ShareHook`,
    `Task1`, `ObjectCast`, `Objects`, `ListObjects`, `Task2`, `FreezeFrame`,
    `Moves`, `PlusWalk`, `Task3`, `ExitKeep`, `Takeaways`, `keys`, over pieces carried from sessions 18 and 19 (`common`,
    `controls`, `motion`, `pieces`, `Characters`, `Phone`, `RecapBrand`,
    `Agenda`, `gestures`, `FeedbackForm`, and unused `BeatList`, `IoPanels`,
    `Laptop`, `tiles`). None is in the kit; `memory.tsx` is the strongest
    candidate for a kit PR (any session about names and objects needs it).
11. **The player files** are session 19's (session 18's copies of
    `kit/mobile-nav`, `kit/code-ligatures`); `sync-kit --apply` waits for
    those merges.
    **Player fix, 2026-10-06 (user: "slide" mode showed black screens and
    overlapping slides):** `src/motion/presets.ts` gives the cut a real exit
    (the empty `none` exit never finished, so departed slides were never
    unmounted) and each exit its own timing via `custom={ dir, cut }`;
    `src/deck/Deck.tsx` wraps each slide's inside in `PresenceContext` `null`,
    so a shared-layout element inside a slide can no longer hold the slide's
    exit open (one stuck exit kept EVERY later slide mounted). Kit-owned files,
    so `sync-kit --apply` would undo this until the same fix lands in the kit
    (every deck and the template carry the bug). `nav-stress-check.mjs`
    drives the built file in Chromium, Firefox and WebKit at phone, laptop,
    1080p and 4K sizes.
12. **Git is not touched**: the shared checkout carries another session's
    staged work; this folder and its plan folder stay untracked until the
    user says.
