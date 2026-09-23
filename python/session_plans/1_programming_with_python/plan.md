<!-- cSpell:ignore NxtWave devPort prnt PayScale -->
# Python · Session 1: "Programming with Python"

**STATUS: SIGNED OFF 2026-09-22** (approved on the defaults in the sign-off section)

No slide is generated until this plan is approved. Section 7 is the gate.

| | |
|---|---|
| `SESSION_NAME` | `Programming with Python` (kicker on every content slide) |
| `COURSE` | `Python` (course folder `python/`) |
| Source | `Python_PPT_slide/1_Programming with Python.pptx`, 42 slides, read in full |
| Project | `python/1_programming_with_python/` (scaffolded from `slide-kit/slide-template`) |
| Deck file | `src/decks/programmingWithPythonDeck.tsx` |
| Slide count | **45** |
| `devPort` | `5228` |
| `htmlName` | `python-session-1-programming-with-python` |
| `NEXT_UP` | `Coding Practice Walkthrough Part 1` (the source's own Next Session slide, 40) |

## 0. The conversion approach

> **Revised at first render, 2026-09-22.** The illustration-first item 1 below is
> retired: *"no need to use existing illustration, build new and our own only if
> required for the content."* Slides 4 to 8, 10, 13, 19, 27 and 38 to 40 shipped
> as plain typographic slides or with house icons, and the dividers carry no
> image. Items 2 to 5 stand. The rule is `python/workflow/skills/python-course/`
> R1.

This plan follows the **illustration-first** approach agreed for the whole
course:

1. **The source's own illustrations are the primary visual** on every slide
   that had one. They were extracted from the PPTX and live in
   `slide-kit/assets/illustrations/python/1_programming_with_python/` (rule
   13), copied into the session's `public/assets/illustrations/`. They render
   through `ContentRightImageSlide` and friends as `media={{ src }}`.
2. **The source sentences are preserved.** Leads and bullets below are the
   PPTX's own lines, with only two kinds of edits: a spaced em dash becomes a
   comma or full stop (rule 1), and a phrase split across two text boxes is
   joined. Nothing is reworded into a "cleverer" title (rule 29).
3. **Quiz Time frames stay where the source put them**: after Why Python?
   (source 18) and before Key Takeaways (source 37).
4. **Labels are added wherever the source relied on an arrow or on position**:
   `Code` / `Output` on every program pair, a name under every logo, a label on
   every specimen slot, a caption under every capture.
5. **Every program output was produced by running the snippet** on CPython
   3.12.3 today. Nothing is composed. The four tracebacks are verbatim.

## 1. What changes from the source, and why

| Source | Becomes | Why |
|---|---|---|
| Agenda (3) lists **7** items: Introduction, Programming Language, Using Python as a Calculator, Basic Terminology, Why Python?, Arithmetic Operators, Introduction to Programming | **4** items, all source phrases: the four section names the source itself uses as dividers | Rule 20: at most four, and Key Takeaways restates them verbatim. The source's list double-counts itself |
| Key Takeaways (38): Introduction to Programming / Programming, Code, Syntax / Displaying a Message / Hello World! / Calculations with Python / Arithmetic Operators | the four agenda strings as the points, and the source's other lines kept as each point's `sub` | Rule 20 fixes the point strings; the `sub` line keeps every source word on the slide |
| Possible Mistakes (22): four broken programs in one table | four slides, one mistake each, then the source table as a consolidation | Rule 5. Each mistake prints a different error, and the difference is invisible in one table |
| Versatile Language (11): a 730x280 image with the five field names baked in at about 10px | the same five names as real labels on a hub-and-spokes figure; the image is kept as the reference | Baked-in text does not survive projection, and the user asked for labels wherever possible |
| Plenty of Opportunities (13): a roles wheel with six names baked in | the wheel stays as the illustration, and the six roles are also set as a plain typographic list beside it | Same reason; the list is the readable copy of the wheel |
| Huge Salaries (14): PayScale bars inside an image | the sentence and the logos, **no numbers** | The figures are unreadable in the source; a plausible salary is composed content. Give the numbers at sign-off and they go on |
| Two Quiz Time frames and the Structured Learning trio | unchanged positions | Asked for |

**Every other source slide maps one to one**, including all ten Code / Output
pairs of the calculator concept.

## 2. Concept map

Four concepts, one divider each. Every source slide sits under one.

| # | Concept (agenda wording, verbatim in the takeaways) | Source slides | Ends on |
|---|---|---|---|
| 1 | Introduction to Programming | 4 to 9 | Around ~700 programming languages. Why this one? |
| 2 | Why Python? | 10 to 17, quiz 18 | Java needs six lines, Python one |
| 3 | Your First Program | 19 to 22 | Four ways to break one line |
| 4 | Using Python as a Calculator | 23 to 33 | `6 / 3` prints `2.0` |

Structured Learning (34 to 36) is how the course runs, so it sits in the
closing frame and is not an agenda item.

## 3. Vocabulary, and where each word is first defined

| Term | Slide | Source line |
|---|---|---|
| Software | 5 | Software is a set of instructions to the hardware |
| Programming, Code | 6 | Programming means writing the instructions. These instructions are called as Code |
| Programming Language | 7 | These languages are called Programming Languages |
| Syntax | 8 | These rules are called its Syntax |
| `print` | 20 | Writing a program to display "Hello World!" |
| Operator | 28 | Addition Operator |

## 4. Slide-by-slide plan

`R` = `ContentRightImageSlide`, `C` = `ContentSlide`, `Div` =
`SectionBreakerImageSlide`. Illustration paths are relative to
`public/assets/illustrations/`. Every content slide carries `kicker` = the
concept name and the session name in `lesson`.

### Front frame

| # | Type | Content | Visual |
|---|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` | the mark |
| 2 | `WelcomeSlide` `minimal` | Programming with Python | none |
| 3 | `AgendaSlide` | Introduction to Programming · Why Python? · Your First Program · Using Python as a Calculator | none |

### Concept 1: Introduction to Programming (source 4 to 9)

| # | Type | Title · lead / points | Visual |
|---|---|---|---|
| 4 | `Div` | Introduction to Programming | `programmer-at-desk.png` |
| 5 | `R` | **Software** · Software is a set of instructions to the hardware | `software-apps.png` |
| 6 | `R` | **Programming** · Programming means writing the instructions · These instructions are called as Code | `writing-code.png` |
| 7 | `R` | **Programming Language** · We should give instructions in a language that the computer understands · These languages are called Programming Languages | `developer-laptop.png` |
| 8 | `R` | **Syntax** · Similar to Grammar rules in English, Hindi, etc. each programming language has a unique set of rules · These rules are called its Syntax | `syntax-document.png` |
| 9 | `C` | **Popular Programming Languages** · Around ~ 700 Programming Languages | `LogoWall` (new, §5): Python, Java, JavaScript, C, C++, C#, Go, Ruby, Swift, Kotlin, Dart, Scala, R from `assets/tech/`, **each with its name under it**. The source's JetBrains mark is a tool, not a language, and is dropped |

### Concept 2: Why Python? (source 10 to 18)

| # | Type | Title · lead / points | Visual |
|---|---|---|---|
| 10 | `Div` | Why Python? | `python-wordmark.png` |
| 11 | `C` | **Versatile Language** · Has applications in almost every field. | `RadialSpread` (new, §5): Python at the hub, five labelled spokes: AI/Machine Learning · Big Data · Smart Device/IOT · Game Development · Backend Development. House icons on each |
| 12 | `C` | **Popular at Top Tech Companies** · Major Tech Companies use Python extensively | `LogoWall`: Meta, Google, Instagram, Uber, Netflix, Spotify, Amazon, Microsoft, Quora, Reddit, Dropbox, PayPal, Mozilla from `assets/companies/`, named. Current Meta and Uber marks replace the source's retired ones |
| 13 | `R` | **Plenty of Opportunities** · points: Python Developer · Data Scientist · ML Engineer · Data Analyst · DevOps Engineer · Software Developer (not numbered: six roles have no order) | `opportunities-roles-source.png`, the source wheel |
| 14 | `C` | **Huge Salaries** · Tech companies like Oracle, Amazon, Google, Microsoft offer competitive salaries in both India and the US · caption `Source: PayScale` | `LogoWall`: Oracle, Amazon, Google, Microsoft, Netflix, Flipkart, Instagram (the marks the source shows). **No figures**, see §1 |
| 15 | `R` | **Demand for Python** · `Shot` of the source's Hacker News hiring-trends chart, cropped to the chart (rule 11) | original at `python/workflow/captures/1_programming_with_python/hiring-trends-original.png`; caption `May 2024 Hacker News Hiring Trends` |
| 16 | `C` | **Easy to Learn** · Simple Syntax · Minimal Code | none, two points at hero weight |
| 17 | `C` | **Easy to Learn** · Java beside Python | two `CodeBlock`s side by side, labelled `HelloWorld.java` and `main.py` (rule 31), Java and Python logos above (rule 12). Java's six lines verbatim, Python's `print("Hello World!")` |
| 18 | `QuizTimeSlide` | subtitle: `Programming, code, syntax, and why Python out of around 700 languages` | the frame's own decoration |

### Concept 3: Your First Program (source 19 to 22)

| # | Type | Title · lead / points | Visual |
|---|---|---|---|
| 19 | `Div` | Your First Program | `python-wordmark.png` |
| 20 | `C` | **Displaying a Message** · Writing a program to display "Hello World!" | `CodeOutput` (new, §5): `print("Hello World!")` → `Hello World!`, panels labelled **Code** and **Output**, code panel located `Code Playground · main.py` |
| 21 | `R` | **Code Playground** · lead: where you write and run every program in this course | `Shot` of the source capture, cropped to editor and Run button. Original at `workflow/captures/1_programming_with_python/code-playground-original.png`. **Its snippet is not `print("Hello World!")`**; caption says what is on screen unless you recapture |
| 22 | `C` | kicker **Possible Mistakes** · **Spelling Mistake in print** | `CodeOutput`: `prnt("Hello World!")` → `NameError: name 'prnt' is not defined. Did you mean: 'print'?` |
| 23 | `C` | **Possible Mistakes** · **Uppercase 'P' in Print** | `Print("Hello World!")` → `NameError: name 'Print' is not defined. Did you mean: 'print'?` |
| 24 | `C` | **Possible Mistakes** · **Missing quotes** | `print(Hello World!)` → `SyntaxError: invalid syntax. Perhaps you forgot a comma?` |
| 25 | `C` | **Possible Mistakes** · **Missing parentheses** | `print("Hello World!"` → `SyntaxError: '(' was never closed` |
| 26 | `StatusPointsSlide` | **Possible Mistakes** · the source table, one row per mistake, verdict `fails` on each: `prnt("Hello World!")` Spelling Mistake in print · `Print("Hello World!")` Uppercase 'P' in Print · `print(Hello World!)` Missing quotes · `print("Hello World!"` Missing parentheses | `StatusList` |

### Concept 4: Using Python as a Calculator (source 23 to 33)

Every row is one source slide. `CodeOutput` panels carry `Code` / `Output`
labels; `compare` mode puts two pairs side by side with a label over each.

| # | Type | Title · lead | Visual |
|---|---|---|---|
| 27 | `Div` | Using Python as a Calculator | `calculator-person.png` |
| 28 | `CodeSyntaxSlide` | **Addition** · `2 + 5` | `SyntaxBreakdown`: `2` (a number) · `+` (Addition Operator) · `5` (a number) |
| 29 | `C` | **Printing the Result** | `CodeOutput` compare: `print(2 + 5)` → `7` beside `print("2 + 5")` → `2 + 5` |
| 30 | `C` | **Printing a Number** | compare, labelled **No Quotes** / **Quotes**: `print(2 + 5)` → `7` beside `print("Hello World!")` → `Hello World!` |
| 31 | `C` | **Addition** | compare: `print(2 + 5)` → `7` beside `print(1 + 1.5)` → `2.5` |
| 32 | `C` | **Addition Operator** · `2 + 5` | `CodeOutput`: `print(2 + 5)` → `7` |
| 33 | `C` | **Subtraction Operator** · `5 - 2` | `print(5 - 2)` → `3` |
| 34 | `C` | **Multiplication Operator** · `2 * 5` | `print(2 * 5)` → `10` |
| 35 | `C` | **Multiplication** | compare: `print(5 * 4)` → `20` beside `print(5 * 0.5)` → `2.5` |
| 36 | `C` | **Division Operator** · `6 / 3` | `print(6 / 3)` → `2.0` |
| 37 | `C` | **Division** | compare: `print(5 / 2)` → `2.5` beside `print(4 / 2)` → `2.0` |

### Closing frame (source 34 to 42)

| # | Type | Content | Visual |
|---|---|---|---|
| 38 | `C` | kicker **Structured Learning** · **Wide Range of Sessions** · Conceptual: Get in-depth conceptual knowledge · Code Walkthrough: Writing actual implementation of code from scratch | `icon-conceptual.png`, `icon-code-walkthrough.png` beside each point |
| 39 | `C` | **Wide Range of Sessions** · Problem Solving: Various Approaches to solve a problem · Debugging: Learn Different Debugging Techniques | `icon-problem-solving.png`, `icon-debugging.png` |
| 40 | `C` | **Extensive Practice** · Programming Assignments · Mini Projects | `icon-assignments.png`, `icon-mini-projects.png` |
| 41 | `QuizTimeSlide` | subtitle: `One line of Python, four ways to break it, and the operator that never gives a whole number` | |
| 42 | `KeyTakeawaysSlide` | Introduction to Programming (sub: Programming, Code, Syntax) · Why Python? · Your First Program (sub: Displaying a Message, Hello World!) · Using Python as a Calculator (sub: Calculations with Python, Arithmetic Operators) | |
| 43 | `PracticeSlide` | title `Practice` · prompt: Open the Code Playground and run every program from today's session | |
| 44 | `SectionBreakerSlide` | kicker `Next Session` · Coding Practice Walkthrough Part 1 | |
| 45 | `ThankYouSlide` | `Thank you!` · message `All the best` (the source's two closing slides, on one frame) | |

## 5. What has to be built

| Component | Slides | Draws | Where it lives |
|---|---|---|---|
| `CodeOutput` | 20, 22 to 25, 29 to 37 | a code panel with its location label, a run arrow, and an output panel labelled `Output`. `compare` puts two pairs side by side with a label over each. DOM, never SVG (rule 17) | **kit**, `src/ui/`. All four Python sessions use it |
| `LogoWall` | 9, 12, 14 | a grid of marks, each with its name under it | **kit**. Sessions 1 and 2 |
| `RadialSpread` | 11 | one hub, n labelled spokes, drawn one spoke after another on entry | **kit**. Named in `STYLE_GUIDE.md` §8 as the form for "reach", and not currently in the kit |

All three read colour from `tokens.ts`, animate at the explanatory tier
(520ms entrances, 130ms staggers, 860ms draws) and mount at their final state
under `useInstant()`. They go to the kit through a PR on a `kit/` branch, into
`sampleDeck.tsx` and `slide-kit/slide-types/README.md`, per rule 14.

**Assets**, all staged already: 17 illustrations in
`public/assets/illustrations/`, all 13 language marks and 15 company marks
copied from the library, plus `companies/flipkart.png`. **Flipkart is a 65px
crop out of the PPTX** and will look soft on the salaries wall; a proper mark
should be fetched into the library before generation.

`slide-kit/assets/README.md` needs an `illustrations/` row. That edit is part
of generation.

**One repo fix needed before the deliverable can be committed**: `.gitignore`
only un-ignores `dist-single/deployment-session-*.html`. A `python-session-*.html`
would be silently ignored. Add `!**/dist-single/python-session-*.html`.

## 6. Where this compresses, if you want it shorter

- Slides 31 to 37 keep the source's one-slide-per-example pacing. The three
  `compare` slides (31, 35, 37) could fold into the operator slide before each.
  **45 → 42.**
- Slides 38 to 40 could be one slide with six icons. That reads as a grid and
  loses the source's pairing. I would keep three.

## 7. Sign-off

Say **approved** and generation starts. Decisions needed, with the default I
will take if you say nothing beside each:

1. **Possible Mistakes as four slides plus the table** (rule 5), or the source's
   single table. *Default: four plus the table.*
2. **PayScale salary figures** for slide 14, or it stays qualitative. *Default:
   qualitative.*
3. **Code Playground capture**: recapture running `print("Hello World!")`, or
   keep the source capture with an honest caption. *Default: keep and caption.*
4. **The three new figures go to the kit** on a PR, or stay in this session.
   *Default: kit.*
5. **A proper Flipkart mark** fetched into `slide-kit/assets/companies/`.
   *Default: fetch it.*
