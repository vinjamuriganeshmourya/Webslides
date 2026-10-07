<!-- cSpell:ignore NxtWave devPort BODMAS -->
# Python · Session 4: "Sequence of Instructions"

**STATUS: SIGNED OFF 2026-09-22** (approved on the defaults in the sign-off section)

No slide is generated until this plan is approved. Section 6 is the gate.

| | |
|---|---|
| `SESSION_NAME` | `Sequence of Instructions` |
| `COURSE` | `Python` |
| Source | `Python_PPT_slide/4_Sequence of Instructions [CQ-Upd.].pptx`, 66 slides, read in full |
| Project | `python/4_sequence_of_instructions/` |
| Deck file | `src/decks/sequenceOfInstructionsDeck.tsx` |
| Slide count | **47** (see §1 for where 66 became 47) |
| `devPort` | `5231` |
| `htmlName` | `python-session-4-sequence-of-instructions` |
| `NEXT_UP` | `Input and Output Basics` (the source's Next Session slide, 64) |

## 0. The conversion approach

> **Revised at first render, 2026-09-22.** Illustration-first is retired for the
> whole course: *"no need to use existing illustration, build new and our own
> only if required for the content."* Every slide this plan gave a PPT picture
> shipped as a plain typographic slide, and the dividers carry no image. The
> source sentences, the analogies, the quiz positions and the labels stand.
> The rule is `python/workflow/skills/python-course/` R1.

As the earlier sessions. This deck has four illustrations and one recurring
visual that the source draws twenty-seven times: **a variable box beside a
program, changing value as the program runs one line at a time**. That trace
is the figure this session builds.

Every output below was produced by running the snippet on CPython 3.12.3
today. The `NameError` is verbatim. The `IndentationError` is shown as the
source shows it (from the Code Playground), see slide 19.

## 1. What changes from the source, and why

| Source | Becomes | Why |
|---|---|---|
| Five traces drawn as **27 consecutive slides** (19 to 23, 25 to 28, 30 to 34, 36 to 40, 42 to 45), one slide per executed line | **five slides**, one per program, each stepping through its lines on click: the current line lights, the variable box updates, the output panel grows. Same title across the run | The click steps are exactly the source's slides, in the same order, with the same words. Nothing is cut; the room still sees one line execute at a time. See §6, decision 1, if you want 27 slides |
| Agenda (8): Variables · Expressions · Printing and Assignment · Order of Evaluation | three concepts: Variables (sub: Printing and Assignment) · Expressions · Order of Evaluation | "Printing and Assignment" is drawn as a sub-line of Variables in the source layout. Three dividers, one per concept |
| No dividers in the source (it runs on kickers) | three `SectionBreakerSlide`s | One per concept |
| Approach 1, 2, 3 for `5 * 2 + 3 * 4` (51 to 53) | unchanged, one slide each | Rule 5, and the source already does it |
| BODMAS strip (55, 56): an image with the six letters and words baked in | the same six letters and words as real labels in a `BodmasStrip` figure; source image kept for reference | Baked text, and the user asked for labels |
| Key Takeaways (61): Variables / Printing, Assigning / Common Mistakes / Spacing in Python / Expressions / BODMAS | the three agenda strings, source lines as `sub`s | Rule 20 |
| Two Quiz Time frames (46, 60) | unchanged positions: after the traces, and before Key Takeaways | Asked for |

## 2. Concept map

| # | Concept | Source slides |
|---|---|---|
| Recap | Variables and Data Types, five slides | 3 to 7 |
| 1 | Variables (Printing and Assignment) | 9 to 45, quiz 46 |
| 2 | Expressions | 47 to 49 |
| 3 | Order of Evaluation | 50 to 59 |

## 3. Slide-by-slide plan

`R` = `ContentRightImageSlide`, `C` = `ContentSlide`, `Div` =
`SectionBreakerImageSlide`. `Trace` = the `VariableTrace` figure (§4).
`CodeOutput` is the kit figure from session 1; every code panel is located
`Code Playground · main.py`.

### Front frame and recap (source 1 to 8)

| # | Type | Content | Visual |
|---|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` | |
| 2 | `WelcomeSlide` `minimal` | Sequence of Instructions | |
| 3 | `R` | kicker **Recap** · **Variable** · Variables are like containers for storing values | `glass-water.png` |
| 4 | `R` | **Recap** · **Value - Data** · Every value is a type of data | `data-types-collage.png` |
| 5 | `C` | **Recap** · **Data Types** · Some commonly used data types · String · Integer · Float · Boolean | |
| 6 | `C` | **Recap** · **Variables and Data types** | `DataTable`, the summary table verbatim from session 3 |
| 7 | `CodeSyntaxSlide` | **Recap** · **Assigning Value to a Variable** · Assigning an integer value 10 to a variable age | `SyntaxBreakdown` on `age = 10`: Variable Name · Assignment Operator · Value |
| 8 | `AgendaSlide` | Variables (sub: Printing and Assignment) · Expressions · Order of Evaluation | |

### Concept 1: Variables (source 9 to 46)

| # | Type | Title · lead | Visual |
|---|---|---|---|
| 9 | `Div` | Variables · subtitle Printing and Assignment | `program-sequence.png` |
| 10 | `R` | kicker **Program** · **Sequence of Instructions** · A program is a sequence of instructions to a computer | `program-sequence.png` |
| 11 | `C` | **Defining a variable** · A variable gets created when you assign a value to it for the first time | `Trace`: code `age = 10` / `print(age)`, line 1 lit, box **age** → `10` |
| 12 | `C` | **Printing Value in a Variable** | `Trace`: line 2 lit, box `age` = `10`, Output `10` |
| 13 | `R` | kicker **Common Mistakes** · **Common Mistakes & Errors** · Let's look into common mistakes and errors we face while programming | `common-mistakes-error.png` |
| 14 | `C` | **Printing Values in Variables** | `CodeOutput` compare: `age = 10` / `print(age)` → `10` beside `age = 10` / `print("age")` → `age` |
| 15 | `C` | **Order of Instructions** · lead ends in a question: `print(age)` then `age = 10`. What happens? | `CodeBlock` `main.py`, two lines. Rule 16's last clause: the code is needed to answer, so this is a content slide with a question lead, not a `QuestionSlide` |
| 16 | `C` | **Order of Instructions** · Python executes the code line-by-line · Variable 'age' is not created by the time we tried to print | `CodeOutput`: the same two lines → `NameError: name 'age' is not defined` (verbatim, 3.12) |
| 17 | `C` | **Spacing in Python** · Having spaces at the beginning of line causes errors | `CodeBlock` `main.py`: `age = 10` / ` print(age)`, the leading space highlighted with a label **space** |
| 18 | `C` | **Spacing in Python** · Error displayed in our code playground | output panel labelled `Output · Code Playground`, the source's text verbatim: `File "main.py", line 2` / `    print(age)` / `    ^` / `IndentationError: unexpected indent`. **Note**: CPython 3.12 prints this without the caret line. The playground's Python printed the caret, and the slide says it is the playground's output, so the source text stands |
| 19 | `C` | kicker **Variables and Data types** · **Variable** · Values in the variables can be changed | `glass-water.png` → arrow → `glass-orange.png` |
| 20 | `C` | **Variable Assignment** | `Trace`, 4 steps: `a = 1` / `print(a)` / `a = 2` / `print(a)`. Box `a`: 1 → 1 → 2 → 2. Output grows `1` then `2`. Source slides 19 to 23 |
| 21 | `C` | **Variable Assignment** · What would be the output of the following code? | `CodeBlock`: `a = 1` / `a = 2` / `print(a)` / `print(a)`. The pause before the trace |
| 22 | `C` | **Variable Assignment** | `Trace`, 4 steps. Box `a`: 1 → 2 → 2 → 2. Output `2`, `2`. Source 25 to 28 |
| 23 | `C` | **Value in Variable** | `Trace`, 5 steps: `a = 1` / `b = 2` / `a = b` / `print(a)` / `print(b)`. Boxes `a`, `b`: (1) → (1, 2) → (2, 2). Output `2`, `2`. Source 29 to 34 |
| 24 | `C` | **Value in Variable** | `Trace`, 5 steps: `a = 1` / `b = 2` / `a = b + 1` / `print(a)` / `print(b)`. Boxes: (1) → (1, 2) → (3, 2). Output `3`, `2`. Source 35 to 40 |
| 25 | `C` | **Value in Variable** | `Trace`, 4 steps: `a = 2` / `print(a)` / `a = a + 1` / `print(a)`. Box `a`: 2 → 2 → 3 → 3. Output `2`, `3`. Source 41 to 45 |
| 26 | `QuizTimeSlide` | subtitle: `Five short programs, one variable box, and the line that ran before its variable existed` | source position |

### Concept 2: Expressions (source 47 to 49)

| # | Type | Title · lead | Visual |
|---|---|---|---|
| 27 | `SectionBreakerSlide` | Expressions | |
| 28 | `C` | **Expressions in Python** · Expression is a valid combination of values, variables and operators | three specimens, each tagged **Expression**: `a * b` · `a + 2` · `5 * 2 + 3 * 4` |
| 29 | `C` | **Expressions** | `CodeBlock` `main.py`: `a = 2 + 3` / `b = 3 * 2` / `c = a + b` / `print(a)` / `print(b)` / `print(c)`, the three right-hand sides tagged **Expressions** |
| 30 | `C` | **Expressions** | `CodeOutput`: the same six lines → `5` / `6` / `11` |

### Concept 3: Order of Evaluation (source 50 to 59)

| # | Type | Title · lead | Visual |
|---|---|---|---|
| 31 | `SectionBreakerSlide` | Order of Evaluation | |
| 32 | `QuestionSlide` | kicker **Order of Operations** · What are the different possible ways to evaluate this expression? · qualifier `5 * 2 + 3 * 4` | nothing else (rule 16) |
| 33 | `C` | **Order of Operations** · **Approach - 1** | `EvalSteps` (§4): `5 * 2 + 3 * 4` → `10 + 12` → `22` |
| 34 | `C` | **Approach - 2** | `EvalSteps`: `5 * 2 + 3 * 4` → `5 * 5 * 4` → `25 * 4` → `100` |
| 35 | `C` | **Approach - 3** | `EvalSteps`: `5 * 2 + 3 * 4` → `5 * 2 + 12` → `5 * 14` → `70` |
| 36 | `QuestionSlide` | Is there any standard order for evaluating this? · qualifier `5 * 2 + 3 * 4` | |
| 37 | `C` | **Ordering Mathematical Operations** | `BodmasStrip` (§4): B Brackets · O Orders · D Division · M Multiplication · A Addition · S Subtraction, each letter over its house icon and word, drawn left to right |
| 38 | `C` | **Order of Operations** | `EvalSteps` `5 * 2 + 3 * 4` → `10 + 12` → `22`, with the `BodmasStrip` small beside it, M lit then A |
| 39 | `ContentNoteSlide` | kicker **Order of Evaluation** · **Best Practice** · `(5 * 2) + (3 * 4)` · note: Use braces for better readability | |
| 40 | `C` | **Order of Operations (BODMAS)** | `CodeOutput`: `print(10 / 2 + 3)` → `8.0`, with `EvalSteps` `10 / 2 + 3` → `5.0 + 3` → `8.0` |
| 41 | `C` | **Order of Operations (BODMAS)** | `CodeOutput`: `print(10 / (2 + 3))` → `2.0`, with `EvalSteps` `10 / (2 + 3)` → `10 / 5` → `2.0` |

### Closing frame (source 60 to 66)

| # | Type | Content |
|---|---|---|
| 42 | `QuizTimeSlide` | subtitle: `Printing and assigning, two common mistakes, expressions, and BODMAS` |
| 43 | `KeyTakeawaysSlide` | Variables (sub: Printing, Assigning · Common Mistakes · Spacing in Python) · Expressions · Order of Evaluation (sub: BODMAS) |
| 44 | `PracticeSlide` | `Practice` · prompt: Trace `a = 5`, `b = a + 2`, `a = b * 2`, `print(a)`, `print(b)` on paper, then run it |
| 45 | `FeedbackSlide` | the source has a Feedback frame here |
| 46 | `SectionBreakerSlide` | kicker `Next Session` · Input and Output Basics |
| 47 | `ThankYouSlide` | `Thank you!` · `All the best` |


## 4. What has to be built

| Component | Slides | Draws | Where it lives |
|---|---|---|---|
| `VariableTrace` | 11, 12, 20, 22 to 25 | a `CodeBlock` with one lit line, one or two **variable boxes** (name on the lid, value inside, the source's container analogy), and an `Output` panel. `steps` is an array of `{ line, boxes, output }`; each click advances one step, and `useInstant()` mounts the last step | **kit**, `src/ui/`. Every programming course traces a program |
| `EvalSteps` | 33 to 35, 38, 40, 41 | an expression rewritten one line per step, the changed part lit, ending at its value | **kit**. Any arithmetic or algebra session wants it |
| `BodmasStrip` | 37, 38 | six letter tiles with icon and word, `lit` prop for the current letter | **session**. Stays in `src/decks/` |
| `CodeOutput` | 14, 16, 30, 40, 41 | from session 1 | kit |

DOM, never SVG (rule 17). Colours from `tokens.ts`. Explanatory-tier motion.

**Assets**: six illustrations staged in `public/assets/illustrations/`, with
`glass-water.png` and `data-types-collage.png` copied from session 3 for the
recap.

## 5. Where this compresses

- Slides 3 to 7 are a five-slide recap. `RecapSlide` could carry all five lines
  on one frame. **47 → 43.** The source spends five slides and the room has
  had a session in between, so I would keep them.

## 6. Sign-off

1. **Five stepped trace slides** (one per program), or the source's **27
   slides**, one per executed line. *Default: five stepped.*
2. **Three concepts** (Printing and Assignment under Variables), or the
   source's four agenda pills with four dividers. *Default: three.*
3. **Slide 18's IndentationError** as the source's playground text (with the
   caret), or as CPython 3.12 prints it (without). *Default: the source text,
   labelled as the playground's output.*
4. **`VariableTrace` and `EvalSteps` to the kit** on a PR. *Default: yes.*
