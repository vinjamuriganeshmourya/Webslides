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

## R5. An analogy is DRAWN as the thing it is, not as labelled boxes

**Feedback, 2026-09-29, on session 14's first render:** *"why have you not
carried the component from html to slides? those are most required to make the
ppt more engaging and more visually appealing … if we are taking the analogy of
playing songs we had created a Spotify and respective animation, similarly piggy
bank for code analogy. Not just text, we had added real life representation."*

R1 retired the source's **stock pictures**. It never licensed retiring the
source's **built figures**, and session 14 read it that way: the pedagogy team's
lesson plan drew a phone with a playlist on it and a piggy bank that fills with
coins, and the first cut of the deck replaced both with a row of boxes reading
`Song 1` to `Song 5` and `Day 1 / ₹1`.

So, alongside R1:

- **A hook or a story beat is drawn as the real object.** A playlist is a
  playlist: cover art, a song title, an artist, a duration, a play button, and
  the row that is playing marked as playing. A piggy bank is a piggy bank, with
  the coin visibly going in and the total climbing on it.
- **The abstraction is what the slide is postponing.** The hook exists so the
  room recognises something they already did today and is only then told it has
  a name. A box labelled `Song 1` is already the diagram, so it asks the room to
  accept the analogy before they have felt it. `sequence` may not appear on a
  hook frame.
- **Abstract tiles are still right where the items really are abstract**: the
  six characters of `"Python"` are characters, and drawing them as anything else
  would be the same mistake in reverse.
- **The source's own figure is the starting point**, rebuilt from kit tokens in
  DOM (content rule 17), never pasted as an image and never approximated as a
  company's trademark. Session 14's player carries no brand mark or brand name in
  its UI: content rule 12 says every logo is fetched into `slide-kit/assets/`
  first, and a hand-drawn copy of a wordmark is not that. The caption keeps the
  source's sentence, which is where Spotify is named.

The distinction R1 and R5 draw together: **a picture that decorates goes; a
picture that IS the analogy stays, and gets rebuilt properly.**

## Feedback log

| Date | Feedback | Applied as |
|---|---|---|
| 2026-09-22 | No PPT stock illustrations; own figures only where needed; check alignment | R1, R4; session 1 regenerated |
| 2026-09-29 | Carry the source's built components across; a song analogy gets a real player, a savings analogy gets a real piggy bank, not text | R5; session 14's `PhonePlaylist` and `PiggyBank` |
