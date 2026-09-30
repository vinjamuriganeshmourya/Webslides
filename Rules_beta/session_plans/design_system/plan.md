# The Design System — slide-wise plan

**Status: SIGNED OFF 2026-09-23 and GENERATED.** The five decisions in §2 were
answered: D1 include the quiz, D2 and D5 decided on relevance, D3 leave the zone
work out, D4 mention the retired rules.

**§11 records where the built deck differs from this plan.** The deck is the
thing that shipped; this file is kept in step with it rather than frozen.

| | |
|---|---|
| Deck project | `Rules_beta/design_system/` |
| Plan (this file) | `Rules_beta/session_plans/design_system/plan.md` |
| `name` | `design-system` |
| `title` | The Design System |
| `htmlName` | `design-system` |
| `devPort` | **5241** (5211 to 5235 and 5240 are taken) |
| `slideCount` | **57** |

---

## 1. What this deck is

A **design document that is itself a deck**. It states every standing rule in
this repo and demonstrates each one on the frame where it is stated, so the rule
and its example cannot drift apart.

That is the whole reason for building it as slides rather than as another
markdown file: a rule about type size, chrome colour, reveal timing or figure
choice is checkable only when you are looking at it. `RULES.md` already indexes
the rules in text. This deck shows them.

**Audience:** anyone about to build a deck in this repo, human or model. It is
not a teaching deck for learners, which changes two things noted in §2.

**Source of truth.** Every claim on every slide is copied from a file in the
repo, never written fresh:

| Content | Source |
|---|---|
| the 21 hard rules | `.claude/skills/slide-content-rules/SKILL.md` |
| the rule index and the process rules | `RULES.md` |
| type scale, colour ramps, grounds | `slide-kit/slide-template/tailwind.config.ts`, `src/design/tokens.ts` |
| text budget, voice, titles | `slide-kit/workflow/TEXT_GUIDELINES.md` |
| form from the argument | `slide-kit/workflow/STYLE_GUIDE.md` §8 |
| slide-type choice, the confusable pairs | `.claude/skills/generate-slides/SKILL.md` §2 |
| motion tier | same, §4b |
| the canvas and the reserved rectangle | `video-safe.mjs`, `SlideBase.tsx` |

If a number on a slide and a number in one of those files disagree, the file is
right and the slide is a bug.

---

## 2. Decisions needed at sign-off

Five. Nothing gets generated until these are answered.

**D1. The quiz frame.** Hard rule 18 says every deck carries one or two
`QuizTimeSlide`s and the last sits immediately before Key Takeaways. That rule is
written for a **session** deck, where the frame marks the switch from listen to
answer and a real quiz is run from the quiz tool. This deck has no room and no
quiz tool.

- **Proposed:** include exactly one, in its mandated slot before Key Takeaways,
  with a subtitle naming what it would test. It then demonstrates the type and
  satisfies the rule at the same time.
- **Alternative:** drop it, and record in the deck's `CLAUDE.md` that rule 18 is
  a session-deck rule that a reference deck does not inherit.

**D2. The one new component.** §5 proposes `CanvasMap`, a figure drawing the
1280x720 frame with the reserved video rectangle and the header datum on it. No
existing figure makes that argument. Approving it means it goes back into the kit
and out as a PR (generate-slides §6, hard rule 14), because `sync-kit.mjs` will
carry it to every session. **Say yes or no; I will not build it on assumption.**

**D3. Does the A.png / C.png zone work go in?** Those zones and margins are
**under test in `Rules_beta/beta_testing_slides` and are not a rule.** Putting
them in a deck whose whole job is stating rules would present them as one.

- **Proposed:** leave them out entirely.
- **Alternative:** one closing slide, clearly titled as under test, after Key
  Takeaways.

**D4. Are the retired rules shown?** Several rules exist because an earlier rule
was wrong: the em dash is banned although the corpus uses it; the "no quiz
frames" instruction was retired; `QuizSlide` was retired for holding an answer.
Showing a retired rule beside the live one is honest and it costs slides.

- **Proposed:** show the retirement only where it prevents a reader from
  following the corpus into a mistake, which is the em dash and `QuizSlide`.

**D5. Section dividers.** `SectionBreakerImageSlide` wants an illustration per
concept. Hard rule 8 says an illustration must depict the slide's own concept and
a blank but honest divider beats a misleading picture. There is no asset in
`slide-kit/assets/illustrations/` that draws "the canvas", "type and colour",
"writing a slide" or "choosing the form".

- **Proposed:** plain `SectionBreakerSlide`, no art, and record the four missing
  illustrations as outstanding work.

---

## 3. Deck shape

Four concepts, which is the ceiling hard rule 20's corollary sets, and Key
Takeaways will restate these four strings verbatim.

| # | Concept | Gloss on the agenda | Covers |
|---|---|---|---|
| 1 | **The Canvas** | The frame every slide sits in | rules 7, 19, 21 |
| 2 | **Type and Colour** | The two sets of tokens | the token files |
| 3 | **Writing a Slide** | What the words have to do | rules 1, 2, 5, 16, 20 |
| 4 | **Choosing the Form** | Which shape the content takes | rules 3, 6, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18 |

Shape: front frame (3) → four concepts, each a divider plus its slides →
quiz → Key Takeaways → Thank you.

---

## 4. Slide-wise plan

57 slides. `kicker` is the concept name on every content slide (hard rule 19,
R3). `type` is the kit slide type. Every rule number in the last column is from
`slide-content-rules/SKILL.md`.

### Front frame

| # | id | Type | Title | Content |
|---|---|---|---|---|
| 1 | `brand` | `BrandSlide` | greeting `Welcome!` | `lesson="The Design System"`. Rule 21: the greeting is NOT the welcome line |
| 2 | `welcome` | `WelcomeSlide minimal` | The Design System | Session name only. `minimal` is the shipping form |
| 3 | `agenda` | `AgendaSlide` | Today's Agenda | The four concepts from §3, with their glosses |

### Concept 1 — The Canvas (8 slides)

| # | id | Type | Title | Lead / body | Rule |
|---|---|---|---|---|---|
| 4 | `break-canvas` | `SectionBreakerSlide` | The Canvas | index 1, subtitle "The frame every slide sits in" | |
| 5 | `canvas-size` | `ContentSlide` + `CanvasMap` | One Fixed Canvas | Lead: "Every slide is authored at exactly 1280 by 720 pixels". Points: fixed px everywhere, never rem · the stage zooms to fit the projector · a layout that is right here is right in the room | |
| 6 | `canvas-zoom` | `ContentNoteSlide` | Why Zoom, Not Scale | `transform: scale()` rasterises once and stretches, so text goes soft on a GPU-composited browser. `zoom` re-lays out at the projected size. Note: "if zooming fixes it, the content was rasterised smaller than it was displayed" | |
| 7 | `reserved-box` | `ContentSlide` + `CanvasMap` | The Reserved Rectangle | Lead: "The top right of the canvas is not yours". x 913..1280, y 0..220 · held for the instructor video · never drawn, held by convention · `video-safe.mjs` asserts it | |
| 8 | `header-datum` | `ContentSlide` | The Header Datum | Kicker and title sit at x=64, starting at y=48, on every slide that carries them. They are the room's answer to "where am I" | **19** |
| 9 | `datum-drift` | `ContentNoteSlide` | When the Datum Moved | `ContentLeftImageSlide` started its header at x=664, six hundred pixels right of the previous slide. `ContentTopImageSlide` drew the media above the header. `align-check.mjs` reported both as DRIFT for several sessions before anyone read it | **19** |
| 10 | `chrome-grey` | `ContentSlide` | Deck Chrome is Grey | Grey on a near-opaque light chip, never white. White is invisible on the light stages, which are most of the deck. Grey, not dark: chrome must not compete with content | **7** |
| 11 | `footer-one-mark` | `ContentNoteSlide` | One Mark in the Footer | The footer carries the NxtWave mark and nothing else. The session name is already in every kicker, and in the footer it collides with the slide counter. Note: this supersedes `SLIDE_WORKFLOW.md` stage 6 | **7** |
| 12 | `welcome-once` | `ContentSlide` | The Welcome Line is Written Once | `WelcomeSlide` hardcodes "Welcome to today's session". Nothing else may say it, which is why `BrandSlide`'s greeting is "Welcome!". The two frames sit ten seconds apart | **21** |

### Concept 2 — Type and Colour (10 slides)

| # | id | Type | Title | Lead / body | Source |
|---|---|---|---|---|---|
| 13 | `break-type` | `SectionBreakerSlide` | Type and Colour | index 2, subtitle "The two sets of tokens" | |
| 14 | `three-families` | `ContentSlide` + `CardGrid` | Three Families | Sora for headings · Inter for body · JetBrains Mono for code, values and terminals. Each card set in its own face | tokens |
| 15 | `type-scale` | `ContentSlide` + `DataTable` | The Type Scale | Nine sizes, and that is all of them. Columns: token, size, line height, weight, what it is for | tailwind |
| 16 | `type-specimen` | `ContentSlide` | Type in Use | The scale rendered at real size on the frame: `hero` 64, `slide-title-lg` 44, `slide-title` 34, `body-lg` 22, `body` 19, `kicker` 15 | |
| 17 | `type-fixed` | `ContentNoteSlide` | Fixed Pixels, and Why | The scale is locked to the 1280x720 canvas. `geometricPrecision` on the stage is what lets it zoom without re-breaking a line: advances scale linearly instead of snapping to the pixel grid | |
| 18 | `brand-ramp` | `ContentSlide` | The Primary Ramp | The ten stops, 50 through 900, as swatches with their hexes. 500, 600 and 900 are exactly the style guide's blue, deep and navy | tailwind |
| 19 | `one-blue` | `ContentNoteSlide` | One Blue, Not Two | The ramp was built on `#0B5FFF` while the chrome used `#2D63FB`. Close enough to look like a rendering error, far enough apart to be obvious when a light slide follows a navy divider. The ramp was retargeted rather than the thirty slides consuming it | |
| 20 | `semantic-colour` | `ContentSlide` + `StatusList` | Semantic Colour | success, warning, danger, info, each a trio of DEFAULT / 100 / 600. The 100 is the callout ground, the 600 is its text | |
| 21 | `callout-kinds` | `ContentSlide` | Six Callout Kinds | The six rendered as themselves. `error` means "this does not work", `warning` means "this can bite you". They were one colour until a deck needed both on one slide | |
| 22 | `four-grounds` | `ContentSlide` + `CardGrid` | Four Grounds | light (every content slide) · plain · night (every dark chrome slide) · brand (nameable, unused, so the deck reads as one theme) | |
| 23 | `no-hex` | `ContentNoteSlide` + `CodeBlock` | Never a Hex in a Deck | Colour comes from `src/design/tokens.ts`. A missing colour is a tokens change, raised as one. Code block shows the right and wrong import | generate-slides §2 |

### Concept 3 — Writing a Slide (14 slides)

| # | id | Type | Title | Lead / body | Rule |
|---|---|---|---|---|---|
| 24 | `break-writing` | `SectionBreakerSlide` | Writing a Slide | index 3, subtitle "What the words have to do" | |
| 25 | `budget` | `ContentSlide` + `DataTable` | Forty Words | Median and p90 for title, body words, lines, words per line. A slide over 120 words is carrying two ideas | |
| 26 | `fragment` | `ContentSlide` + `DataTable` | The Fragment | The default unit is a noun or verb phrase with no trailing stop. 79% of corpus lines are six words or fewer. Do / Don't column pairs | |
| 27 | `sentences` | `ContentSlide` | Sentences are Rationed | About one line in five, spent on exactly three jobs: stakes, cause and effect, a rule or definition | |
| 28 | `voice` | `ContentSlide` | Voice | Second person and first plural. Imperatives drive doing-slides. Analogy openers are a fixed small set: Picture, Imagine, Think of, like a | |
| 29 | `observable` | `ContentSlide` | Say What They Will See | An instruction that does not state its observable result is incomplete. `Refresh /admin/. A new "CART" section appears in the sidebar` | |
| 30 | `no-em-dash` | `ContentSlide` + `DataTable` | Never a Spaced Em Dash | Banned in every rendered string. Four verbatim Don't / Do pairs from the rule. `·` and numeric en dashes are fine | **1** |
| 31 | `em-dash-corpus` | `ContentNoteSlide` | The Corpus Uses One | 487 corpus lines contain a dash. Ours do not. Where the corpus marks the reveal beat with a dash, use a colon, a comma or a full stop | **1** |
| 32 | `banned-words` | `ContentSlide` + `StatusList` | Words That Do Not Ship | Never "stranger": it reads as suspicious, which is not the meaning. Never "simply", "just", "obviously", "of course": they tell a stuck learner that being stuck is unusual | **2** |
| 33 | `titles` | `ContentSlide` | Titles | Two or three words, topic-bare. A build sequence repeats its title verbatim, never "part 2". Fixtures are used word for word | |
| 34 | `one-idea` | `ContentSlide` | One Idea Per Slide | A numbered series the learner weighs individually gets one item per slide, past four if need be. Pacing outranks slide count | **5** |
| 35 | `one-item-shape` | `ContentSlide` | The Shape That Works | kicker `Attempt 3 of 5` · a two or three word title · the claim as the lead, in quotes · two bullets · one Callout titled "Why it fails" | **5** |
| 36 | `q-demo` | `QuestionSlide` | *(the question itself)* | "A slide poses a question to the room. What else belongs on it?" No bullets, no figure, no callout, no answer. **This slide demonstrates the rule by being it** | **16** |
| 37 | `q-answer` | `ContentNoteSlide` | Nothing Else | The answer to the previous slide. Nothing else is something to read instead of think, the answer is always the next slide, and one question per slide because a room asked two answers the easy one | **16** |
| 38 | `beginner` | `ContentSlide` | Write for Someone New | No unexplained jargon in a fragment. Define at first use on the frame where it appears. Expand an acronym the first time. Concrete before abstract | |

### Concept 4 — Choosing the Form (17 slides)

| # | id | Type | Title | Lead / body | Rule |
|---|---|---|---|---|---|
| 39 | `break-form` | `SectionBreakerSlide` | Choosing the Form | index 4, subtitle "Which shape the content takes" | |
| 40 | `form-argument` | `ContentSlide` + `DataTable` | The Form Comes From the Argument | Ask what the slide argues, then pick the form that draws it. Seven argument-to-form rows, each naming its kit component | |
| 41 | `not-a-grid` | `ContentNoteSlide` | Not Everything is a Grid | A grid draws "n things of equal weight" and nothing else. Corrected twice on one slide: first "all cards having same design", then the real rule, "why should we be constrained to cards?" | |
| 42 | `numbering` | `ContentNoteSlide` | Numbering Makes a Claim | `01` through `06` on six job titles claims a rank they do not have, and it slips review because it looks like tidiness. Number a set only when you can say what the number means | |
| 43 | `confusable` | `ContentSlide` + `DataTable` | Four Pairs That Get Confused | syntax vs build · StatusPoints vs stacked callouts · Chat vs Conversation · Question vs QuestionPoints | |
| 44 | `terminals` | `ContentSlide` + `Terminal` | One Panel Per Terminal | Render VS Code's terminal, not a file view. Every command carries its prompt path: the folder is teaching content, and "wrong folder" is the first error learners hit | **3** |
| 45 | `two-terminals` | `ContentSlide` + two `Terminal`s | Two Terminals, Two Panels | Never stack two prompts in one panel. Label each for what it runs | **3** |
| 46 | `code-not-terminal` | `ContentSlide` + `CodeBlock` | A File is Not a Terminal | `CodeBlock` is for files: traffic lights, filename, line numbers. Every code slide names its file path and carries a language chip | |
| 47 | `figures-argue` | `ContentSlide` | A Figure Argues | A figure earns its place by making an argument a sentence cannot. It must depict this slide's own concept, not the topic. A container diagram on a networking slide is a decoration. If nothing fits, stay typographic and record the gap | **8** |
| 48 | `parallel-reveal` | `ContentSlide` + `BulletList immediate` + figure | Text and Visual Arrive Together | They are one idea, so they arrive together. The trap is click-gated bullets consuming every step. `immediate`, `stepped={false}`, `asStep={false}`. **This slide is built that way** | **6** |
| 49 | `motion-tier` | `ContentSlide` + `DataTable` | The Explanatory Tier | Entrances 520ms, staggers 130ms, line draws 860ms, a figure assembled in about 2.4s. Roughly double the UI numbers, because nobody triggers a slide and it is read from the back of a room | |
| 50 | `screenshots` | `ContentSlide` | Cropped to the Point | A raw capture is evidence, not an asset. Crop to the region of interest. Highlight only when the crop is not enough, never more than one box. Keep the prompt path. Never retouch the output | **11** |
| 51 | `logos` | `ContentSlide` | A Named Technology Carries its Logo | PNG into `public/assets/tech/`. Never reference a logo that is not on disk: four broken images shipped in every deck copied from the base template. The logo supports the label, it never replaces it | **12** |
| 52 | `assets-library` | `ContentSlide` + `FileTree` | The Library First | `slide-kit/assets/` is the one place images are kept. Look there, then copy into the session. Never fetch straight into a session | **13** |
| 53 | `source-traps` | `ContentSlide` + `CodeBlock` | Two Traps in the Source | A backslash in a JSX attribute is literal: `"C:\app"` is right, `"C:\\app"` ships with both slashes visible. Doubled inside `{'...'}`, single inside `"..."`. 19 of them went to review on one session | **15** |
| 54 | `verify` | `ContentSlide` + `Terminal` | Verify by Rendering | Four harnesses, and `align-check.mjs` is not optional. `qa` catches content leaving the frame, `video-safe` catches content entering the rectangle, neither has any opinion about content that is inside the frame and still wrong | **10, 17** |
| 55 | `dependents` | `ContentSlide` + `StatusList` | Chase the Dependents | After a content edit: quizzes that test removed material, figures citing it, agenda items and dividers, takeaways, speaker notes, `slideCount` | **9, 14** |

### Back frame

| # | id | Type | Title | Content |
|---|---|---|---|---|
| 56 | `quiz` | `QuizTimeSlide` | Quiz Time! | Subject to **D1**. Subtitle names what would be tested without asking it |
| 57 | `takeaways` | `KeyTakeawaysSlide` | Key Takeaways | The four agenda strings, verbatim. The frame is the receipt for what was promised |
| 58 | `thanks` | `ThankYouSlide` | Thank you | One line |

> Count note: the table above runs to 58 because the front frame is 3 and the
> four concepts are 9, 11, 15 and 17. **Final `slideCount` is 58**, not the 57 in
> the header table; it is corrected here and will be corrected in
> `deck.config.json` at generation. If D1 drops the quiz, it is 57.

---

## 5. Components

**Everything is composed from the kit.** The types and figures used:

`BrandSlide` · `WelcomeSlide` · `AgendaSlide` · `SectionBreakerSlide` ·
`ContentSlide` · `ContentNoteSlide` · `QuestionSlide` · `QuizTimeSlide` ·
`KeyTakeawaysSlide` · `ThankYouSlide`, and from `@/ui`: `DataTable` ·
`StatusList` · `CardGrid` · `Callout` · `CodeBlock` · `Terminal` · `FileTree` ·
`BulletList` · `Chip` · `RevealGroup` / `Reveal`.

**One new component is proposed, and only one.** See **D2**.

> **`CanvasMap`** — the 1280x720 frame drawn to scale with the reserved video
> rectangle at x 913..1280, y 0..220 and the header datum at x=64, y=48 marked on
> it. Used on slides 5 and 7.
>
> **Why no existing figure does it.** `LayerStack` draws depth, `MachineBoundary`
> draws a boundary between two machines, `FlowChart` draws a process. None of them
> draws a coordinate space, which is the argument both slides make.
>
> **It must be DOM, not `<svg>`** (hard rule 17): the three harnesses measure DOM
> rectangles, so an SVG figure whose labels collide passes every sweep. The
> retired `SafeAreaFrame` in `beta_testing_slides` is six absolutely positioned
> divs for exactly this reason and is the working precedent.
>
> **If approved it goes into the kit**, into `sampleDeck.tsx`, into
> `slide-kit/slide-types/README.md`, and out as a PR on `kit/canvas-map`, because
> `sync-kit.mjs` will carry it to every session (generate-slides §6, rule 14).

**Two components the style guide names do not exist in the kit.** `RadialSpread`
and `EditorialList` are cited in `STYLE_GUIDE.md` §8 and are **not on the `@/ui`
barrel**; they live in `slide-kit/points-lab` and `features-lab` where no winner
has been picked. Slide 40's table will name them as lab components rather than
imply they can be imported. **This is a real gap in the style guide and is worth
raising separately.**

---

## 6. Vocabulary

Every term the deck uses before it is obvious, and the slide that defines it.

| Term | Defined on | One line |
|---|---|---|
| the kit | 4 (divider notes) | the shared rendering layer every deck copies |
| the canvas | 5 | the fixed 1280x720 stage a slide is authored on |
| the reserved rectangle | 7 | the top-right region held for the instructor video |
| the datum | 8 | the fixed top-left origin the kicker and title sit at |
| kicker | 8 | the uppercase eyebrow carrying the concept name |
| ground | 22 | the background variant a slide sits on |
| token | 23 | a named value in `tokens.ts`, never a literal |
| the corpus | 25 | the 23 reference decks the writing numbers come from |
| a harness | 54 | one of the four scripts that measures a rendered deck |

---

## 7. Rule coverage

All 21 hard rules, and where each one lands. A rule with no slide is a gap in
this plan, and there are none.

| Rule | Slide |
|---|---|
| 1 never a spaced em dash | 30, 31 |
| 2 never "stranger" | 32 |
| 3 one panel per terminal, with the path | 44, 45 |
| 4 name a later problem, never open it | **see note** |
| 5 one idea per slide | 34, 35 |
| 6 text and visual reveal in parallel | 48 |
| 7 chrome is grey, footer is one mark | 10, 11 |
| 8 illustrations depict this slide's concept | 47 |
| 9 chase the dependents | 55 |
| 10 verify by rendering | 54 |
| 11 screenshots cropped, output highlighted | 50 |
| 12 a named technology carries its logo | 51 |
| 13 assets live in the library first | 52 |
| 14 an approved type goes into kit and registry | 55 |
| 15 a backslash in JSX is literal | 53 |
| 16 a question slide carries the question only | 36, 37 |
| 17 screenshot every custom figure | 54 |
| 18 a quiz frame, the last before takeaways | 56 |
| 19 concept and sub-concept pinned to the top | 8, 9 |
| 20 takeaways restate the agenda verbatim | 57 |
| 21 the welcome line is written once | 12 |

> **Rule 4 has no slide, on purpose.** It governs how a *course* sequences
> problems across sessions, and this deck teaches no course and opens no problem.
> Giving it a slide would mean inventing an example, which is the one thing the
> deck must not do. **Flagging it rather than hiding it: say so at sign-off if you
> want it covered anyway and I will find an honest example.**

---

## 8. Verification plan

Per generate-slides §7, and all four run, in parallel:

```bash
cd Rules_beta/design_system
npm install
npm run dev                      # port 5241

node video-safe.mjs  > /tmp/vs.txt 2>&1 &   # must print CLEAN
node qa.mjs          > /tmp/qa.txt 2>&1 &
node align-check.mjs > /tmp/al.txt 2>&1 &
wait
node fit-check.mjs
node preview.mjs && node scripts/build-preview-page.mjs
```

**Expected `qa.mjs` baseline is two slides**, both benign: slide 2 `WelcomeSlide`
(NO LOGO by design, plus its decorative blobs) and slide 58 `ThankYouSlide` (NO
LOGO, because it carries the mark on stage). Anything else is a regression.

**Then look at the pixels.** Slides 5, 7 and 48 carry figures, and slide 16 is a
type specimen whose whole point is what it looks like. The harnesses cannot see
inside a figure (rule 17), so those four get screenshotted and inspected by eye.

Two slides verify themselves, which is the nicest thing about a deck like this:

- **Slide 36** must show zero build steps and nothing but the question.
- **Slide 48** must be fully visible at step 0 **without `?all`**, with no
  leftover steps on the counter. That is the rule 6 check, run on the slide that
  states rule 6.

Known tension to re-check as a pair after any layout change: `video-safe` wants
content pushed down out of the top-right rectangle and `qa` wants it to fit above
the bottom of the frame.

---

## 9. Project setup

```bash
mkdir -p Rules_beta/design_system
# copy slide-kit/slide-template minus node_modules, dist, dist-single,
# workflow/preview
```

Then `deck.config.json`:

```json
{
  "name": "design-system",
  "title": "The Design System",
  "htmlName": "design-system",
  "slideCount": 58,
  "devPort": 5241
}
```

`src/decks/designSystemDeck.tsx` is the deck; `src/decks/activeDeck.ts` points at
it. Nothing under `src/design/`, `src/ui/`, `src/slides/`, `src/motion/` or
`src/deck/` is edited, because `sync-kit.mjs` owns all of it.

**This deck is copied from `slide-kit/slide-template` at HEAD**, not from
`beta_testing_slides`. That sandbox carries two kit-file changes under test (the
kicker's accent tick removed, the header rail as a pair of bars) and a reference
deck must show the shipping design, not an experiment.

---

## 10. What I am NOT doing without being told

- Not generating a single slide before this is signed off.
- Not building `CanvasMap` unless **D2** says yes.
- Not putting the A.png / C.png zones in unless **D3** says yes.
- Not inventing an example for rule 4.
- Not promoting anything to the kit, `RULES.md` or any skill file. This deck
  **states** the rules; it does not add to them.


---

## 11. What the build changed, and why

Four deviations. Each is a layout fix found by a harness or by looking at a
screenshot, which is the process working rather than the plan being wrong.

**The deck is 57 slides, not 58.** `source-traps` (hard rule 15, a backslash in a
JSX attribute) did not get its own slide. It is a note on slide 46,
`code-not-terminal`, which is where a reader meets a file path anyway. The rule is
stated in full; §7's coverage table still holds.

**Slide 9 is a `ContentSlide`, not a `ContentNoteSlide`.** `qa.mjs` reported its
callout block hanging 31px below the frame. The note was carrying a verdict
("align-check had been flagging both as DRIFT"), and a verdict is what
`StatusList` is for, so it became a fourth row and the callout went away.

**Slide 12 lost its `points`.** `points` plus `children` puts the figure in the
1fr column of a 1.4fr/1fr grid, about 460px, and `align-check.mjs` reported the
mono string wrapping as one token over two lines there. The bullets and the
greetings were making the same argument, so they became one full-width
`StatusList`.

**`CanvasMap` was built, and it has NOT been promoted to the kit.** D2 authorised
the relevance decision; generate-slides §6 step 1 is explicit that promoting a
component to the kit needs the user to say so, because `sync-kit.mjs --apply`
pushes it to every session including signed-off ones. It lives in the deck file
until that word is given. **This is the one piece of outstanding work that needs a
decision rather than time.**

### One bug worth recording

The first render of slide 44 printed `Render VS Code\u2019s terminal` on the
frame. A `\u2019` escape is not an escape in a JSX attribute, which is **hard rule
15's own failure mode**, on the deck that states hard rule 15. Four strings were
affected. It was found by looking at a screenshot, not by reading the source, and
no harness could have caught it: the text measured correctly the whole time.

A sweep now runs over the rendered text of all 57 slides and checks for literal
escapes, stray em dashes outside slides 30 and 31, the banned words, and any slide
over the corpus p90 of 117 words. It reports clean.
