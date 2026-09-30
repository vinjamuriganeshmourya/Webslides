---
name: programming-with-python-deck
description: Build rules, decisions and the running feedback log for Python Programming session 1, "Programming with Python" (project python_programming/programming_with_python). Use whenever writing, editing, reviewing or QA-ing that session's plan (python_programming/session_plans/programming_with_python/plan.md), its deck source (programming_with_python/src/decks/programmingWithPythonDeck.tsx), its three figures CodeOutput, LogoWall and InstructionFlow, or any slide, snippet, program output or logo wall in it. Also use when the user gives feedback on this session's slides, so the feedback is recorded here before it is applied.
---
<!-- cSpell:ignore NxtWave devPort prnt PayScale strictPort Highcharts cairosvg devicon simpleicons -->

# Programming with Python · deck rules

| | |
|---|---|
| Plan | `python_programming/session_plans/programming_with_python/plan.md` (signed off 2026-08-26) |
| Deck | `programming_with_python/src/decks/programmingWithPythonDeck.tsx` |
| Source | `Python_PPT_slide/1_Programming with Python.pptx`, 42 slides |
| Slides | 48 · devPort 5221 · `dist-single/programming-with-python.html` |
| Session notes | `programming_with_python/CLAUDE.md` holds the generation decisions |

This is the first session of a **new course**, so several of the rules below are
about what a first session may assume, which is nothing.

---

## R1. Every output on every slide came from running the snippet

Thirteen slides carry program output and not one of it is composed. CPython
3.12, run before the deck was written, including all four tracebacks down to the
`Did you mean: 'print'?` suffix.

**Change a snippet, run it again.** The temptation here is unusually strong
because Python's output is short and predictable, and being right four times
teaches you to stop checking on the fifth.

```bash
python3 -c 'print(6 / 3)'                                  # 2.0
printf 'prnt("Hello World!")\n' > /tmp/t.py && python3 /tmp/t.py 2>&1
```

Tracebacks are version-dependent. `Did you mean:` is 3.11+, and
`SyntaxError: '(' was never closed` is 3.10+. If the playground the learners use
runs an older Python than the slides claim, the slides are wrong, not the
playground. The capture in `public/shots/code-playground.png` says **Python
3.10**, which is older than the 3.12 the tracebacks came from. Nothing on a slide
currently contradicts anything, but this is the seam to check first if a learner
reports different output.

## R2. Nobody in the room knows anything yet

This is session 1 of the course. The room has not written a line of code, has not
seen a terminal, and does not know the word "syntax".

- **No forward references to tools.** Not the IDE, not pip, not a virtual
  environment, not a data type. Problem sequencing (hard rule 4) is at its
  strictest in a first session, because every later problem is unopened.
- **Vocabulary is introduced before it is used**, and the plan's §4 table records
  where each word is first defined. `operator` is defined on the calculation
  syntax slide and used from there on, never before.
- `2.0` on the division slide is deliberately left as a surprise with no
  explanation of types. It is the seed of a later session. **Do not answer it
  here**, even though it is tempting to add one clarifying bullet.

## R3. Four agenda items, and the takeaways repeat them from the same constant

`AGENDA` in the deck file is the single source. The agenda frame and the
takeaways frame both index it, so rule 20 holds structurally rather than by
anyone remembering.

The source PPTX listed **seven** agenda items and double-counted itself twice
("Introduction" plus "Introduction to Programming"; "Using Python as a
Calculator" plus "Arithmetic Operators"). If someone asks to restore the
source's agenda, that is the reason it was not kept.

"Structured Learning" is course chrome, not a concept, so it sits in the closing
frame and is **not** an agenda item.

## R4. One mistake per slide

The four broken programs get four slides, then one `StatusPointsSlide`
consolidating them. The source had all four on one slide.

Hard rule 5, and the split earns its keep here specifically: the four mistakes
produce **two different error types**, and that split is invisible when all four
sit in one list. The consolidation slide is where the room sees it, and it only
lands because they met the four one at a time first.

## R5. No `Content*ImageSlide` in this deck

They render `media` **and** `children`, and every figure here is the media. See
`CLAUDE.md` decision 2. Reach for `ContentSlide`: `points` plus `children` gives
a `1.4fr / 1fr` split, `children` alone centres.

## R6. Asset paths are literal strings

`/assets/tech/java.png`, written out. Never built from a variable, never
interpolated. `scripts/inline-assets.mjs` scans the bundle for the path text, so
an assembled path silently produces a deliverable with every logo broken.

**The check is the build line**: `Inlined 35/35 assets`. If that number drops,
a path got interpolated.

## R7. Logo walls carry current marks, and each mark carries its name

The source PPTX shows the pre-2021 Facebook mark and Uber's retired square. The
deck uses `meta.png` and the current `uber.png` from
`slide-kit/assets/companies/`, which was created for this session.

Hard rule 12's second half is load-bearing on a logo wall: **a mark with no name
beside it is a guessing game**, and on a slide whose whole argument is
familiarity that is backwards. `LogoWall` requires `name` for this reason.

A company is not a technology. Company marks go in `slide-kit/assets/companies/`
and language marks in `slide-kit/assets/tech/`.

## R8. The two honest gaps stay honest

| Slide | Gap | The wrong fix |
|---|---|---|
| `salaries` | The source's PayScale figures are inside unreadable chart images | Composing plausible salary numbers |
| `code-playground` | The capture's snippet is not this session's program, and the caption says so | Editing the pixels to say `print("Hello World!")` |

Content rule 11's last clause: never retouch output text. Re-capture, or caption
it. Both of these are captioned, and both are recorded in `CLAUDE.md`.

---

## The three figures

`CodeOutput` and `LogoWall` are **kit candidates awaiting the user's approval**.
`InstructionFlow` stays in this session. Rule 14's procedure, in short: the kit
copy is the real one, it goes in the gallery and the registry, and it reaches the
kit through a PR on a `kit/` branch because `sync-kit.mjs --apply` pushes it into
signed-off sessions.

All three are DOM, never `<svg>`, per content rule 17.

`CodeOutput`'s timings come from `figureTiming.ts` (`T.enter` 520ms, `T.stagger`
130ms), the explanatory tier. Do not retune them to the `animate` skill's UI
numbers; §4b of the generate-slides skill records why this repo runs roughly
double, and that session 6's figures were rejected once for being too fast.

---

## Feedback log

Nothing yet. Every durable correction on this deck gets written here **before**
it is applied, with the reason, per §8 of the generate-slides skill. A rule
without its reason gets argued away by the next person.
