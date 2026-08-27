<!-- cSpell:ignore NxtWave colour colours behaviour prnt PayScale devPort Highcharts cairosvg devicon simpleicons -->
# Python Programming · Session 1: "Programming with Python"

**STATUS: SIGNED OFF 2026-08-26 · GENERATION IN PROGRESS** (approved on the four defaults in §7)

No slide is generated until this plan is approved. Section 7 is the gate.

| | |
|---|---|
| `SESSION_NAME` | `Programming with Python` (kicker on every content slide, never "Session 1") |
| `COURSE` | `Python Programming` (new course, scaffolded at `python_programming/`) |
| Source | `Python_PPT_slide/1_Programming with Python.pptx`, 42 slides, extracted in full |
| Project | `python_programming/programming_with_python/` (scaffolded from `slide-kit/slide-template`) |
| Deck file | `src/decks/programmingWithPythonDeck.tsx` |
| Slide count | **48** |
| `devPort` | `5221` (5211, 5215, 5216, 5217, 5220 are taken) |
| `htmlName` | `programming-with-python` |
| `NEXT_UP` | not yet named. **Needed at sign-off** for the closing frame |
| Build rules | to be created at `python_programming/workflow/skills/programming-with-python-deck/SKILL.md` on sign-off |

---

## 1. What the PPTX actually contains, and what changes

All 42 source slides were read. The mapping is not one to one, and the four
places it diverges are the decisions worth your attention.

| Source | Becomes | Why |
|---|---|---|
| Agenda (slide 3) lists **7** overlapping items: Introduction, Programming Language, Using Python as a Calculator, Basic Terminology, Why Python?, Arithmetic Operators, Introduction to Programming | **4** agenda items | Hard rule 20: at most four, and the takeaways must restate them word for word. The source's own list double-counts ("Introduction" and "Introduction to Programming"; "Using Python as a Calculator" and "Arithmetic Operators") |
| "Possible Mistakes" (slide 22): four wrong programs on **one** slide | **four slides, one mistake each**, plus one consolidation | Hard rule 5. Each mistake is a thing the room must weigh on its own, and each produces a *different* error |
| "Structured Learning" (slides 34 to 36) | closing frame, **not** an agenda item | Rule 20's corollary: course chrome is not a concept. It is how the course works, told after the content |
| Every "Code / Output" pair (slides 20, 25, 26, 27, 28, 29, 30, 31, 32, 33) was a hand-drawn pair of boxes | one new kit figure, `CodeOutput` | Ten slides in one deck is not a one-off. See §5.1 |

**Nothing in the source is dropped except duplicated agenda wording.** Two
source slides are folded (slide 24 "2 + 5" and slide 28 "Addition Operator"
teach the same beat; the syntax half becomes a `CodeSyntaxSlide`).

## 2. Concept map

Four concepts. One divider each, and nothing else gets one.

| # | Concept (agenda wording, verbatim in the takeaways) | Source slides | Ends on the question that opens the next |
|---|---|---|---|
| 1 | Introduction to Programming | 4 to 9 | There are around 700 languages. Why does this course start with Python? |
| 2 | Why Python | 10 to 17 | Python needs one line where Java needs six. So what does that one line actually look like? |
| 3 | Your First Program | 19 to 22 | `print` can display a message. Can it also do arithmetic? |
| 4 | Python as a Calculator | 23 to 33 | (closes the session) |

## 3. The narrative spine

1. Nobody in the room has written code yet, so the session starts one step
   before Python: **software is instructions, and programming is writing them.**
2. Instructions have to be in a language the machine understands, and every such
   language has its own rules. That word is **syntax**, and it is the first piece
   of vocabulary the course will use every day.
3. There are roughly 700 of these languages. The room now has a real question:
   why this one?
4. Five answers, each evidenced rather than asserted: Python is in almost every
   field, the companies they have heard of run on it, the roles exist, the pay is
   competitive, and the demand is measurable (a real hiring-trends chart).
5. The fifth answer is the one they can check themselves in ten seconds: **Java
   needs six lines to print a greeting, Python needs one.** That comparison is
   the hinge into writing code.
6. So write that one line. `print("Hello World!")`. Then the shape of it, slot by
   slot, because every slot is a mistake waiting to happen.
7. Four mistakes, one per slide, each with **the error Python actually prints**.
   This is where the room learns that an error message is information, not
   failure.
8. Then the same `print` gets a number instead of a message, and the quotes turn
   out to be the whole story: `print(2 + 5)` is 7, `print("2 + 5")` is `2 + 5`.
9. Four operators. Three behave as school arithmetic predicted. **Division does
   not**: `6 / 3` is `2.0`, not `2`. That surprise is the last idea of the
   session and the seed of the next one about types.
10. Finally, how the course itself works, then the quiz, then the receipt.

## 4. New vocabulary, and where it is defined

| Term | First defined on | In one line |
|---|---|---|
| software | 5 | A set of instructions given to the hardware |
| programming | 6 | Writing those instructions |
| code | 6 | What the written instructions are called |
| programming language | 8 | A language the computer understands |
| syntax | 9 | The rules of one particular programming language |
| `print` | 22 | The instruction that displays something |
| operator | 34 | The symbol that says which calculation to do |
| `NameError` | 25 | Python does not recognise that name |
| `SyntaxError` | 27 | The line breaks the language's own rules |

## 5. Slide-by-slide plan

### Front frame (1 to 3)

| # | Type | Content |
|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` (rule 21: the welcome line is written once, on slide 2) |
| 2 | `WelcomeSlide` `minimal` | `Programming with Python` |
| 3 | `AgendaSlide` | the four concepts of §2, in order |

### Concept 1: Introduction to Programming (4 to 11)

| # | Type | Title / lead | Figure |
|---|---|---|---|
| 4 | `SectionBreakerSlide` | Introduction to Programming | crossfade, no image |
| 5 | `ContentRightImageSlide` | **Software** · "Software is a set of instructions to the hardware." | `InstructionFlow` (new, §5.1): a stack of instructions, an arrow, the machine |
| 6 | `ContentRightImageSlide` | **Programming** · "Programming means writing those instructions. The instructions are called Code." | the same `InstructionFlow`, with the `Code` label now on the stack. Registered in `continuity.ts` so it does not jump from slide 5 |
| 7 | `QuestionSlide` | "Will a computer follow instructions written in plain English?" | nothing else on the frame (rule 16) |
| 8 | `ContentSlide` | **Programming Language** · "The instructions go in a language the computer understands. Those languages are called programming languages." | two bullets |
| 9 | `ContentRightImageSlide` | **Syntax** · "English has grammar rules. Every programming language has its own set of rules, called its syntax." | `AnalogyMap` (existing): grammar ↔ syntax |
| 10 | `ContentBottomImageSlide` | **Around 700 Languages** · the popular ones | `LogoWall` (new, §5.1), 12 language marks with names |
| 11 | `QuestionSlide` | "Out of roughly 700 languages, why start with Python?" | |

### Concept 2: Why Python (12 to 19)

| # | Type | Title / lead | Figure |
|---|---|---|---|
| 12 | `SectionBreakerSlide` | Why Python | |
| 13 | `ContentSlide` | **Versatile Language** · "Python has applications in almost every field." | `CardGrid`, 5 cards with house icons: AI and Machine Learning, Big Data, Smart Devices and IoT, Game Development, Backend Development (the source's own five) |
| 14 | `ContentBottomImageSlide` | **Popular at Top Tech Companies** · "Major tech companies use Python extensively." | `LogoWall`, 12 company marks |
| 15 | `ContentSlide` | **Plenty of Opportunities** · the roles Python opens | `CardGrid`, 6 cards: Python Developer, Data Scientist, ML Engineer, Data Analyst, DevOps Engineer, Software Developer (the source's own six) |
| 16 | `ContentSlide` | **Competitive Salaries** · "Oracle, Amazon, Google and Microsoft pay competitively for Python roles, in India and in the US." | four company marks, and the source line `Source: PayScale`. **No numbers.** The source put its figures inside chart images and I cannot read them, so per rule 3 of §3 in the generate-slides skill I will not compose plausible ones. If you have the PayScale figures, give them at sign-off and they go on |
| 17 | `ContentRightImageSlide` | **Demand for Python** · "Python leads every other language in hiring posts, and has since 2011." | `Shot` of the real Hacker News hiring-trends capture, cropped to the chart (rule 11). Original kept at `workflow/captures/hiring-trends-original.png`. Caption dates it: `May 2024 · Hacker News hiring trends` |
| 18 | `ContentSlide` | **Easy to Learn** · "Simple syntax, and far less code for the same result." | two bullets |
| 19 | `ContentSlide` | **Six Lines, or One** · Hello World in Java, then in Python | `CodeOutput` in `compare` mode (§5.1): Java's 6 lines beside Python's 1, each with its logo. This is the slide the concept exists for |

### Concept 3: Your First Program (20 to 29)

| # | Type | Title / lead | Figure |
|---|---|---|---|
| 20 | `SectionBreakerSlide` | Your First Program | |
| 21 | `ContentSlide` | **Displaying a Message** · "A program that displays `Hello World!`" | `CodeOutput`: `print("Hello World!")` → `Hello World!` |
| 22 | `CodeSyntaxSlide` | **The Shape of print** · slot by slot | `SyntaxBreakdown`: `print` (the instruction) · `(` `)` (the parentheses, always) · `"…"` (the message, always in quotes) |
| 23 | `ContentRightImageSlide` | **Code Playground** · where the room runs it | `Shot` of the playground capture, cropped to the editor and the Run button. Original at `workflow/captures/code-playground-original.png`. **The capture's snippet is not `print("Hello World!")`**, so either I recapture it against the real playground or the slide's caption says what is on screen. Flag at sign-off which you want |
| 24 | `QuestionSlide` | "What does Python do with `prnt("Hello World!")`?" | opens the mistakes run |
| 25 | `ContentSlide` | **Mistake 1 of 4 · Spelling** | `CodeOutput` with the real traceback: `NameError: name 'prnt' is not defined. Did you mean: 'print'?` |
| 26 | `ContentSlide` | **Mistake 2 of 4 · A Capital P** | `NameError: name 'Print' is not defined. Did you mean: 'print'?` Python is case sensitive |
| 27 | `ContentSlide` | **Mistake 3 of 4 · No Quotes** | `SyntaxError: invalid syntax. Perhaps you forgot a comma?` |
| 28 | `ContentSlide` | **Mistake 4 of 4 · An Unclosed Bracket** | `SyntaxError: '(' was never closed` |
| 29 | `StatusPointsSlide` | **Four Ways to Break One Line** · all four with verdicts | `StatusList`, four rows, each `fails`, each naming its error type. The consolidation, after the four have been met one at a time |

Every error string above was produced by running the broken program on
Python 3.12. Nothing here is composed.

### Concept 4: Python as a Calculator (30 to 41)

| # | Type | Title / lead | Figure |
|---|---|---|---|
| 30 | `SectionBreakerSlide` | Python as a Calculator | |
| 31 | `ContentSlide` | **Addition** · "`print` can take a calculation instead of a message." | `CodeOutput`: `print(2 + 5)` → `7` |
| 32 | `QuestionSlide` | "What does `print("2 + 5")` display?" | the pause the whole concept turns on |
| 33 | `ContentSlide` | **The Quotes Decide** · "In quotes it is text and Python prints it back. Without quotes it is a calculation and Python does it." | `CodeOutput` compare: `print("2 + 5")` → `2 + 5` beside `print(2 + 5)` → `7` |
| 34 | `CodeSyntaxSlide` | **The Shape of a Calculation** | `SyntaxBreakdown`: number · operator · number |
| 35 | `ContentSlide` | **Addition Operator** · `+` | `CodeOutput`: `print(2 + 5)` → `7`, and `print(1 + 1.5)` → `2.5` |
| 36 | `ContentSlide` | **Subtraction Operator** · `-` | `print(5 - 2)` → `3` |
| 37 | `ContentSlide` | **Multiplication Operator** · `*` | `print(5 * 4)` → `20`, and `print(5 * 0.5)` → `2.5` |
| 38 | `QuestionSlide` | "`6 / 3` is 2. What does Python print?" | sets up the one real surprise |
| 39 | `ContentSlide` | **Division Operator** · "`/` always gives a decimal, even when the answer is whole." | `CodeOutput`: `print(6 / 3)` → `2.0` |
| 40 | `ContentSlide` | **Every Division, Every Time** | `print(5 / 2)` → `2.5` beside `print(4 / 2)` → `2.0` |
| 41 | `ContentSlide` | **The Four Operators** | `DataTable`: operator, example, output, one row each, all four verified by running them |

### Closing frame (42 to 48)

| # | Type | Content |
|---|---|---|
| 42 | `RecapSlide` | the four concepts as what was covered |
| 43 | `ContentSlide` | **How Every Session Runs** · `CardGrid`: Conceptual, Code Walkthrough, Problem Solving, Debugging (the source's own four, with its own one-line descriptions) |
| 44 | `ContentSlide` | **Extensive Practice** · programming assignments, and mini projects |
| 45 | `PracticeSlide` | Coding Practice Walkthrough |
| 46 | `QuizTimeSlide` | rule 18: the lone quiz frame sits immediately before the takeaways. `subtitle` names what is tested: "One line of Python, four ways to break it, and the operator that never gives a whole number" |
| 47 | `KeyTakeawaysSlide` | the four agenda strings, **verbatim** (rule 20) |
| 48 | `ThankYouSlide` | plus `FeedbackSlide` if you want one. `NEXT_UP` needed |

## 5.1 What has to be built

### New figures in `src/ui`

| Component | Slides | What it draws | Animation |
|---|---|---|---|
| `CodeOutput` | 19, 21, 25, 26, 27, 28, 31, 33, 35, 36, 37, 39, 40 | A code panel and the panel of what it printed, paired, with the run arrow between. `compare` mode puts two such pairs side by side with a label above each | code panel in, arrow draws (860ms), output panel in. 520ms entrances, 130ms stagger, the explanatory tier |
| `LogoWall` | 10, 14, 16 | A grid of marks, each with its name under it, sized to fit whatever count it is given | marks fade and rise in a 130ms stagger, reading order |
| `InstructionFlow` | 5, 6 | A stack of instruction lines, an arrow, and the machine they are given to. Slide 6 adds the `Code` label to the stack | stack draws line by line, arrow travels once, machine lands |

All three read colour from `src/design/tokens.ts`, wrap in `RevealGroup`/`Reveal`
never `Step` (rule 6), and mount at their final state under `useInstant()`.

**All three are kit candidates, and `CodeOutput` is the strongest one this repo
has seen.** Every language course ever taught shows a snippet next to what it
printed; this repo has had a `CodeBlock` and a `Terminal` for six sessions and
still no way to say "and this is what came out". Per rule 14 they go into the
kit, `sampleDeck.tsx` and `slide-kit/slide-types/README.md`, and out as a PR on
`kit/code-output`, **only if you approve them.** My read: `CodeOutput` and
`LogoWall` are general, `InstructionFlow` is closer to a one-off and can stay in
the deck file.

### New slide type

**None proposed.** Every slide above is an existing type.

### Kit changes

One, small: `CodeBlock`'s keyword set has no Python built-ins, so `print`
renders as plain text on the twelve slides where it is the only word that
matters. Proposal: add `print` to the `func` colour path, the same way the
Dockerfile instructions were added for session 2. Raised as a kit change, not
edited in the session.

### 5.4 Assets

Fetched into `slide-kit/assets/` today, from current upstream sources, as PNG at
512px, per rule 13. **You asked for the latest marks and the old set was
checked**: all fifteen existing `tech/` logos are the current versions and none
needed replacing. Everything below is new.

`tech/` (12 new, language marks, from devicon):
`java` · `go` · `ruby` · `javascript` · `csharp` · `c` · `cplusplus` · `dart` ·
`r` · `kotlin` · `swift` · `scala`. `python` was already there at 512px and is
current, so it was not re-fetched.

`companies/` (new folder, 15 marks): `meta` · `google` · `instagram` · `uber` ·
`netflix` · `spotify` · `amazon` · `microsoft` · `quora` · `reddit` · `dropbox` ·
`paypal` · `mozilla` · `oracle` · `nvidia`.

Two notes on this set:

- **The source PPTX is out of date and this deck will not copy it.** It shows
  the pre-2021 Facebook mark and the retired Uber "bit" square. The library now
  has Meta's current mark and Uber's current wordmark.
- The company marks are single-colour brand glyphs, which read as one system on
  a logo wall; the PPTX mixed full-colour wordmarks with glyphs and the wall
  looked assembled from screenshots. Say if you would rather have the wordmarks.

`slide-kit/assets/README.md` needs its inventory and its `companies/` row added.
That edit is part of generation.

Captures, both already staged at `python_programming/workflow/captures/`:

| File | Slide | Work needed |
|---|---|---|
| `hiring-trends-original.png` | 17 | crop to the chart, drop the browser chrome and the `Compare` row |
| `code-playground-original.png` | 23 | crop to editor plus Run button. **Its snippet is not this session's program**, see slide 23 |

## 6. Where this compresses, if you want it shorter

- Slides 15 and 16 (opportunities, salaries) are the same argument twice, told
  with roles and then with money. Cutting 16 costs nothing structural and also
  removes the one slide that wants numbers I do not have. **48 → 47.**
- The four mistake slides could go back to two. I would push back: rule 5 exists
  because exactly this was tried and rejected.
- Slides 35 to 37 (three operators, one per slide) could be one slide with three
  rows, since slide 41 already tabulates them. That trades pacing for length.
  **48 → 46.**

## 7. Sign-off

Say **approved** and generation starts. Four things I need with it, or I will
proceed on the answer written beside each:

1. **`NEXT_UP`**, the next session's confirmed name. *Default: omit the next-session frame.*
2. **The PayScale salary figures**, or slide 16 stays qualitative. *Default: qualitative.*
3. **The playground capture**: recapture it running this session's program, or keep the source capture with an honest caption. *Default: keep it, caption it.*
4. **The three new figures**, approved for the kit or left in the deck. *Default: `CodeOutput` and `LogoWall` to the kit on a PR, `InstructionFlow` stays inline.*

---

## 8. What generation changed

The deck shipped at **48 slides**, as planned. The structure is the plan's. What
changed is the FORM of five slides, all of it from review feedback, and one kit
bug found on the way.

### 8.1 Three of the plan's figures were replaced after review

The plan put `CardGrid` on slides 13, 15 and 43. It shipped that way, and the
feedback was: *"all cards having same design, it is not visually appealing"*, then
*"instead of cards you can use a different design altogether, why should we be
constrained to cards?"*

The second note is the general rule and it is now written down in
`slide-kit/workflow/STYLE_GUIDE.md` §8: **the form comes from the argument.**

| Slide | Was | Is | Because the argument is |
|---|---|---|---|
| 13 Versatile Language | `CardGrid`, 5 cards | `RadialSpread` | reach: one thing into many fields, which a grid cannot draw |
| 15 Plenty of Opportunities | `CardGrid`, 6 cards | `EditorialList`, 2 columns | six answers whose NAMES are the content |
| 43 How Every Session Runs | `CardGrid`, 4 cards | `EditorialList` | four things that are genuinely just four things |
| 9 Syntax | `AnalogyMap` (grammar to syntax) | `SyntaxSpecimens` | *"why just a container with text? Bring the element each point refers to."* Three real one-liners doing one job |

Slide 9's change is the one worth defending. `AnalogyMap`'s rows said "Grammar
rules to Syntax" and "A typo to An error message", which are labels FOR the idea
rather than the idea. The slide now shows `print("Hello World!")`,
`console.log("Hello World!");` and `System.out.println("Hello World!");` with a
chip on each naming its own rule. All three were run before they went on the
slide, and Java's chip says "needs a class around it" because that line is not a
program on its own.

### 8.2 Numbering was removed, and it was the same rule twice

`EditorialList` numbered its rows in the first version. Feedback: *"the numbers
are present but it shouldn't have numbers as per content."* Correct, and it is
§8's own clause ("do not invent structure the content does not have") broken by my
own component: six job titles have no first and no sixth. `numbered` now defaults
to **off**, and §8 has the numbering case spelled out.

### 8.3 Slide 13's motion, in two rounds

Round one was static lines with the labels stepping in on a click. Two notes on
it: *"it should be very dynamic, we should get the arrow also dynamically"* and
*"instead of all at once make one after another with smooth animation"*.

It now plays on slide entry with no clicks, one spoke after another, five beats
each: a ring leaves the hub, a pulse rides out along the path, the line traces
behind it, the arrowhead lands, the label pops in with its icon last. The gap
between spokes is `T.draw / 2` (430ms), not `T.stagger` (130ms), because a 130ms
gap against an 860ms draw puts every line in flight at once and the sequence is
invisible. The whole figure lands in about 3 seconds.

### 8.4 A kit bug in `AgendaSlide`

`video-safe.mjs` reported the agenda's first item 42px inside the instructor-video
rectangle. The cause is `Y_TOP = 236` with the item text CENTRED on it, so with
the `sub` every real deck passes, the block's top edge sits at y=204. Its own
comment claimed the opposite. `Y_TOP` is now 268.

This is a **kit** file. The fix is in this session's copy and has not been
propagated; it belongs in `slide-kit/slide-template` behind a PR, and it moves
every existing session's agenda items down by about 24px.

Related: `AgendaSlide` never reads the `lead` on its own props type, so a lead
passed to it is silently dropped. Do not use it as a layout lever there.

### 8.5 One thing the plan expected and did not need

`CodeBlock`'s keyword set. `print` already renders in the function colour, because
the tokenizer colours any identifier followed by `(` as a call. No kit change.

### 8.6 Verification, as run

| Harness | Result |
|---|---|
| `npx tsc -b --noEmit` | clean |
| `npm run build:html` | `Inlined 35/35 assets`, 5.37 MB self-contained |
| `video-safe.mjs` | **CLEAN** |
| `qa.mjs` | **2 slides**, the documented baseline (slide 1 brand, slide 48 thank you, both `NO LOGO`) |
| `align-check.mjs` | **0 of 48** |
| screenshots of every custom figure | done, and they found three things no harness could see. §7 of the session `CLAUDE.md` lists them |
| `preview.mjs` over `file://`, network blocked | 48 slides captured, **0 broken images, 0 console errors**. Three slides flagged suspect for low text count: 1 (brand), 12 (a divider), 48 (thank you), all legitimately sparse chrome |
| `scripts/build-preview-page.mjs` | contact sheet at `workflow/preview/index.html`, 48 slides |

### 8.7 Still outstanding

1. The five kit candidates need approval, then promotion into the kit, the
   gallery and the registry, behind a PR.
2. `AgendaSlide`'s `Y_TOP` fix needs the same treatment.
3. The PayScale numbers for slide 16, if they exist.
4. A recapture of the playground shot running this session's own program.
5. `NEXT_UP`, and the next-session frame that goes with it.
