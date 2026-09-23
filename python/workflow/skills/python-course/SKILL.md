---
name: python-course
description: Build rules and the running feedback log for every session of the Python course (python/), converted from the PPTs in Python_PPT_slide/. Use whenever writing, editing, reviewing or QA-ing a Python session's plan (python/session_plans/<n>_<session>/plan.md), deck source (python/<n>_<session>/src/decks/*.tsx) or figures, and whenever the user gives feedback on a Python deck, so the feedback is recorded here before it is applied.
---
<!-- cSpell:ignore NxtWave devPort -->

# Python course · deck rules

| | |
|---|---|
| Course | `python/`, four sessions, folders numbered `1_` to `4_` after the source PPTs |
| Plans | `python/session_plans/<n>_<session>/plan.md`, all signed off 2026-09-22 |
| Ports | 5228, 5229, 5230, 5231 |
| Kit figures from this course | `CodeOutput`, `LogoWall`, `RadialSpread` (session 1, promoted 2026-09-22) |

## R1. No stock illustrations from the source PPT

**Feedback, 2026-09-22, on session 1's first render:** *"no need to use existing
illustration, build new and our own only if required for the content, no rule
that we must use all the illustration present."*

The plans were written illustration-first and put the PPT's stock pictures
(a programmer at a desk, a phone with apps, a glass of water) on every slide
that had one in the source. That is retired:

- **A slide gets a figure only when the content needs one**, meaning the figure
  makes an argument a sentence cannot (hard rule 8, and generate-slides §3).
  `print(2 + 5)` beside `7` needs `CodeOutput`; "Software is a set of
  instructions to the hardware" needs nothing but the sentence.
- **When a figure is needed, build our own** from kit components or a new
  figure in `src/ui/`, colours from tokens. Never place a PPT picture.
- **A slide with nothing to draw is a plain typographic slide.** A clean
  `ContentSlide` with the source sentence is the honest form; a divider is a
  `SectionBreakerSlide` with no image.
- The extracted pictures stay in `slide-kit/assets/illustrations/python/` as a
  **reference for what the source showed**, not as slide assets. Real captures
  (the hiring-trends chart, the Code Playground) are not illustrations and stay.

Why: stock pictures decorate; they do not teach, and a deck of them reads as
the PPT it came from.

## R2. Source sentences, analogies and quiz positions are preserved

The other half of the brief still holds: the PPT's own sentences and analogies
are the copy (em dashes fixed, nothing reworded into cleverer titles), and the
Quiz Time frames sit where the source put them. Labels are added wherever the
source relied on an arrow or on position.

## R3. Every output is a real run

CPython 3.12.3, run before the slide was written. Change a snippet, run it again.

## R4. Check alignment by looking, not only by harness

Asked for on the same feedback: *"please check the alignments."* Every deck
runs all four harnesses (`video-safe`, `qa`, `align-check`, `preview`) and then
the contact sheet is opened and read, slide by slide, before the deck is
reported done. Content rule 17: the harnesses cannot see inside a figure.

## Feedback log

| Date | Feedback | Applied as |
|---|---|---|
| 2026-09-22 | No PPT stock illustrations; own figures only where needed; check alignment | R1, R4; session 1 regenerated |
