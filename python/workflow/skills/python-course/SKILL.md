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

## R5b. Match the reference's fidelity, not just its subject

**Feedback, 2026-09-29, second time:** *"still the provided reference are having
better and realistic components."* R5 got the subject right (a real player, a
real piggy bank) and the fidelity wrong. Three things separate the pedagogy
team's version from the first rebuild, and all three are pedagogy, not polish:

1. **Every beat stays visible.** The source lists all six beat labels beside the
   figure, dims each one as it is consumed and bolds the current one, so the room
   always sees the whole flow and where it is in it. The rebuild showed **one
   caption at a time**, which turns a flow into a slideshow and throws away the
   structural half of the understanding (`pedagogy-to-components` Part I, 6b).
   Use `BeatList`, never a single caption, on any figure with named beats.

2. **A character who states the constraint says it in a speech bubble.** Riya
   drawn beside a bubble reading *"I can't add all that by hand!"* is a person
   with a problem. The same sentence in a `YOUR TURN` callout is narration, and
   the room hears it as the deck talking rather than as somebody stuck. This is
   the one case where a drawn human is content and not decoration, and R1 does
   not cut it.

3. **Product chrome is drawn to the detail that makes it recognisable.** The
   source's phone has a battery, a wifi glyph, album art, a "Play all" label, a
   progress line, a now-playing bar and the playlist's owner. Each is cheap and
   together they are the recognition the hook depends on. A phone missing them
   reads as a wireframe of a phone, which is a diagram, and a diagram does not
   buy the motivation a world picture exists to buy.

**Why:** the room has to recognise the object before it will accept the
abstraction. Fidelity is what makes it recognisable, and the beat list is what
makes the sequence legible. Neither is decoration.

## R5c. Follow the reference deck's placement, highlighting and chrome

**Feedback, 2026-09-29, third time, slide by slide on session 14.** R5 got the
subject, R5b got the fidelity, and this is about *layout and control*. The
review, and what each item means beyond the slide it was raised on:

1. **A container that is numbered keeps its number, and the number arrives with
   the container.** Not a legend, not a key at the side.

2. **On-slide controls are centred under the figure, and never overlap the
   footer or the NxtWave mark.** The player's own cluster owns the bottom left
   and the mark owns the bottom right; a figure's controls belong between them.

3. **A control is named from the analogy, not from the mechanism.** The recap
   that joins three pairs says **Join them**, not Next. The name is part of the
   teaching: it tells the room what the press is about to do.

4. **Nothing moves until the presenter presses.** A figure may hold a continuous
   idle loop (an equaliser, a story bar), but it never advances its own state on
   a timer. A press is the only thing that changes what the frame says.

5. **A flow beat is three real interfaces, not three text cards.** The source
   draws the attendance register with real names and a tick moving down,
   Instagram stories with the progress bars filling, and a billing counter with
   items crossing a scanner and a `beep`. Three `Card`s with a sentence each is
   the thing this rule exists to stop: it is the same content with the argument
   removed.

6. **A code panel labels its parts in place.** Initialization, termination
   condition and updation are drawn **on the lines they name**, highlighted
   where they sit. Listing them beside the panel splits the room's attention
   between two places and neither is the code.

7. **A construct is drawn with its block, its arrow and its indentation.**
   `for … in …:` over an indented body is a shape, and the shape is the lesson.

8. **The deck's own slides are part of the flow.** The Daily Challenge frames
   (`Identify the Mistake` and the rest) are not optional context to be referred
   to; the room sees them, so the plan carries them.

**Why:** the reference is a deck that has been taught from. Every one of these
was a deliberate choice by somebody who watched a room read the slide, and a
rebuild that changes them is not a redesign, it is a regression that has not
been measured.

## R5d. The Quiz Time frame uses the shipped design

The reference deck's Quiz Time slide is the one to use, in the kit's base
template as well as in this course, so every deck gets it. Decks already
delivered are not reopened for it (see `RULES.md`, "A new rule never re-opens a
delivered deck").

The distinction R1 and R5 draw together: **a picture that decorates goes; a
picture that IS the analogy stays, and gets rebuilt properly.**

## Feedback log

| Date | Feedback | Applied as |
|---|---|---|
| 2026-09-22 | No PPT stock illustrations; own figures only where needed; check alignment | R1, R4; session 1 regenerated |
| 2026-09-29 | Carry the source's built components across; a song analogy gets a real player, a savings analogy gets a real piggy bank, not text | R5; session 14's `PhonePlaylist` and `PiggyBank` |
| 2026-09-29 | The reference components are still better and more realistic (2nd time) | R5b; `BeatList`, Riya speaking, full phone chrome |
| 2026-09-29 | Slide-by-slide review: numbering, centred controls, analogy-named buttons, no self-advancing motion, real interfaces, in-place code labels, the Daily Challenge frames | R5c |
| 2026-09-29 | Use the reference's Quiz Time design, in the base template too | R5d |
