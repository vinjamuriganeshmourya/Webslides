<!-- cSpell:ignore NxtWave devPort Teja Maggi Sneha Vamsi Pooja Kiran -->
# Python · Session 27: "Sets"

**STATUS: SIGNED OFF 2026-10-08** (user: *"Generate the slides as you did for
the session 26 and 25 and 24 … for this file 27_sets_session_spec.html and
27_sets_session_spec.json"*). The spec is the signed-off content; this plan only
maps it onto the kit. The deck was generated from this plan in the same run, as
sessions 23, 24 and 26 were.

| | |
|---|---|
| `SESSION_NAME` | `Sets` |
| `COURSE` | `Python` |
| Source | `Reference ppt's/27_sets_session_spec.json` (every program, output, press, walk and round) and `…_spec.html` (the reading page, with 17 thumbnails of the original deck's kept slides 15 to 31). **23 beats, 29 cards, 75 minutes** |
| Project | `Outputs/python/27_sets/` (scaffold copied from session 26, which carries the 2b standard; `Cast.tsx` and `cast/` from session 25) |
| Deck file | `src/decks/setsDeck.tsx` |
| Slide count | **31**, one per card, in the spec's order (29, plus DS2 and DS3 from the change spec of 2026-10-09) |
| `devPort` | `5257` |
| `htmlName` | `python-session-27-sets` |

## The one idea

A set keeps each value once and in no order, so you ask it whether a value is
there and how many there are, never where. add and update put values in once;
discard and remove take them out.

## Decisions

Carried from sessions 19 to 26 unless marked new.

1. **One slide per spec card, all 29, in the spec's order.** This spec has no
   divider cards. Spine cards use the same slides as 26: `BrandSlide`,
   `RecapBrand`, `WelcomeSlide minimal`, the static `AgendaSlide`,
   `ClassroomQuiz`, `FeedbackEmbedSlide`, `ThankYouSlide`. Every other card is
   a session figure on `Panel`; its presses are build steps; its body carries
   `data-spec` and `data-presses` equal to the spec's `press_count`.
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `figures/spec.ts` (`SPEC`, and `NOTES` from each press's say line) from the
   JSON.
3. **Every program was run** on CPython 3.12.3 (course rule R3): 55 programs
   and G2's five rounds. All match except C3's third run, whose order depends
   on the hash seed (3.12.3 with seed 2 prints `{'Sneha', 'Anu', 'Ravi',
   'Kiran'}`; the spec, run on a newer Python, has `{'Sneha', 'Kiran', 'Ravi',
   'Anu'}`). The spec's text is kept (spec rule 6); the card's point is that
   the order changes, and spec note 6 says an order is never marked.
4. **Keys** (`figures/keys.ts`): → and ← one press, F full screen, A all
   cards, End the whole card, 1 to 4 a vote.
5. **The agenda is static** (content rule 44): three stops, the spec's words.
6. **Exact words, content rule 36**: a line's closing full stop is dropped; a
   line with two sentences is two lines. Code and outputs keep their own
   punctuation. Every code panel says `Python` (rule 31).
7. **Template colours only** (rule 37). The drawn Instagram-style app keeps its
   own screen colours inside the phone (the gradient story ring, the dark
   story screen, the white viewer sheet, the green Close Friends star) with no
   product name and no logo anywhere (content rule 12).
8. **One picture for the whole session (spec note 5, new `figures/bag.tsx`).**
   A set is a round bag of chips: no numbers under the chips, no first, no
   last. A chip's place in the bag is fixed for the card (it never shifts when
   another chip joins or leaves), except on C1's press 3 where the chips drift
   to new places on purpose. A list or a tuple stays session 26's row of cells
   with 0, 1, 2 under them (`rows.tsx`, a list with handles, a tuple with a
   lock). The four movements a chip makes are one component each: **join**
   (walks in from the door), **bounce** (walks up, bounces off, waits outside
   greyed with `already in`; the twin inside pulses), **leave** (walks out and
   fades), **check** (a finger visits each chip and finds it, or does not).
9. **People are lab characters** (2b item 12): the chips and the app's rows
   wear faces cut from the character lab (`Cast.tsx`, `FACE` crop): Teja,
   Ravi, Anu, Kiran, Sneha, Pooja, Vamsi. Letters (`A`, `n`) are plain letter
   chips; that they look odd among the faces is the point (C9's play line).
10. **Votes are clickable, keys 1 to 4 mark them, `Next` is never gated.**
    Confetti when the marked pick is right. Timers are the kit's `Countdown`:
    6:00 (T1, T2), 2:30 (X1).
11. **Controls and autoplay follow generate-slides section 2** (session 23's
    `controls.tsx` and `autoplay.ts`). Autoplay opens ON only on cards with
    no vote and no timer: 3 (S-RECAP), 4 (H1), 8 (C1), 10 (C2), 11 (C3),
    20 (H2), 23 (C10), 26 (C12). DS2 and DS3 open off (the room answers).
12. **Movement inside one press plays only when the press is reached going
    forward** (`usePhase` / `useStepPhase`); going back or jumping lands it done.
13. **No question asks for an order** (spec note 6): only a count, True or
    False, or an error. Printed sets show the spec's one fixed run.

## The carry-forward standard (generate-slides 2b), per card

| Item | Where |
|---|---|
| 1-2 `Group`, `active` | every content card: program + output is one group, the bag/picture another; the vote group lights on an ask press, the bag group on a walk press; tasks light the brief while the timer runs and the results after |
| 3 `Focus` | the program being asked, until its output shows (C2 to C11, H2, C12) |
| 4 `Code.tsx` blanks | C2's bracket slots, T2's line 6, X1's `___` |
| 5 `StepCaption` | E1, G1, G2 walk captions |
| 6 `Option`/`Vote` | C4, C5, C6, E1, C7, C8, C9, C11, G1, G2, X1; `nowrap` |
| 7 `CODE_FS` 15 / `OUT_FS` 16 | every card; `CODE_REF_FS` 13 for a program shown for reference |
| 8 task chips | T1, T2 briefs (`Predict`, `Run` inline) |
| 9 `Fresh`/`Appear`/`Swap` | every swapped program, option set, app screen |
| 10 drawn arrows, `DrawBox` | S-RECAP's join lines path-draw; C4's R and r ringed; C11's red line |
| 11 `usePhase` | every in-press walk (joins, bounces, finger checks, counting) |
| 12 lab characters | chip faces, the story phone's avatars |
| 13 phones 1 : 2.06 + `LiveClock` | H1 and H2's phones, 196 x 404 |
| 14 no overflow | `box-overflow-check` at every step |
| 15 no drag | none |

## Change, 2026-10-09: what a data structure is

Source: `Reference ppt's/27_sets_change_spec_data_structures 1.html` (the
user: *"update the session 27 according to this doc"*, nothing deleted). Its
JSON is kept beside this plan as `change_ds.json`, and
`scripts/build-spec-data.mjs` merges it into `figures/spec.ts`.

- **DS2** (slide 7, after the agenda) and **DS3** (slide 9, after C1), built
  in `figures/DataStructures.tsx`. The grid is one component (`DataGrid`)
  driven by the card's data: a later data structure session passes one more
  column and today's name. Every proof program was run on CPython 3.12.3 and
  matches, except the set-order run, which depends on the hash seed (the
  spec's text is kept).
- **C1**: only press 1's say line changes (now *"The Seen by sheet from the
  hook. A set is this bag."*); it is in the speaker notes, not on the slide.
- **Minutes**: the view shows no beat minutes, so nothing changed on screen.
  T1's 6:00 task timer is the task's own work time and is left as the spec
  has it (the change spec does not list it).
- Slides after 6 move down by one or two; the autoplay set, the reveal-step
  map, `slideCount` and the two per-deck harnesses (`spec-check`,
  `autoplay-check`) follow.

## Slides

`P` is the spec's `press_count`; a card's build steps are `P - 1`.

| # | Card | P | Slide | What the presses do |
|---|---|---|---|---|
| 1 | S-WELCOME | 0 | `BrandSlide` | Welcome |
| 2 | S-RECAP-CARD | 0 | `RecapBrand` | three points from session 26: a tuple needs the comma, a tuple cannot change, unpacking puts one value in one name |
| 3 | S-RECAP | 4 | `RecapMatch.tsx` | three program tiles (A, B, C) and three result tiles (1, 2, 3) all on screen; each press draws the join line A-3, B-2, C-1 and shows the line under the pair, B's full TypeError |
| 4 | H1 | 6 | `StoryHook.tsx` | Teja's phone posts the Maggi story, the ring lights; the log card fills 7 rows; thumb on Seen by; the sheet slides up, 3 names, Ravi's four log rows light; Ravi opens again, log row 8, the sheet does not move; the three names lift into a round bag, the log becomes a row of 8 cells with 0 to 7 |
| 5 | S-TITLE | 0 | `WelcomeSlide minimal` | Sets |
| 6 | S-AGENDA | 3 | `AgendaSlide` (static) | Sets · Changing a set · Operations on sets |
| 7 | DS2 | 5 | `DataStructures.tsx` `DataFamily` | **new, 2026-10-09.** `A data structure holds many values under one name` over four face-down tiles; one tile turns per press: a playlist / list (✓ learnt), a date of birth on an ID card / tuple (✓ learnt), Seen by / set (lit, Today), Contacts / dictionary (dim, Later) |
| 8 | C1 | 4 | `SetCards.tsx` `WhatSet` | the bag (Ravi, Anu, Kiran) and `Unordered collection of items`; point 1, Ravi pulses; point 2, the chips drift; point 3, a lock by each chip |
| 9 | DS3 | 6 | `DataStructures.tsx` `WhatItIs` (`DataGrid`) | **new, 2026-10-09.** the grid, list and tuple filled, the set column shaded with five dashed cells, the next one ringed; one cell fills per press, its proof (code and exact output) beside it |
| 10 | C2 | 3 | `CreateSet` | a list line and a tuple line, create.py with two dashed bracket slots; `{` `}` fill, the names drop into a bag, the line is the biggest text; the output and the rule |
| 11 | C3 | 6 | `NoOrder` | order.py, three runs stacking with the same four names lit, deck line; likes.py on three post tiles, `{40, 120, 15}` |
| 12 | C4 | 4 | `NoRepeats` | repeats.py, vote 5/3/Error; 3, the printed set, the five typed names settle as three; case.py; 2, R and r ringed |
| 13 | C5 | 4 | `Immutable` | tuple_in.py, the locked tuple chip; it slides in, 2; list_in.py with a handled list chip, vote; it bounces, TypeError, the two lines |
| 14 | C6 | 2 | `EmptySet` | empty.py with lines 1 and 2 lit, two empty bags labelled a and b, vote a/b/Both; three outputs, a's bag relabels `dict`, the two lines |
| 15 | E1 | 15 | `Converter.tsx` | the views row (7 cells), the empty bag, a three-position switch, vote; seven walks; 7 / 3 and `Every open is still in views`; switch to string, Anna's four cells, vote 1-4; four walks, 3; switch to tuple, 2 |
| 16 | C7 | 4 | `NoPosition` | first.py, vote; the [0] pointer finds no number and shakes, TypeError; slice.py, the pointer shakes again; in_check.py, the finger checks for Kiran then Pooja, True / False |
| 17 | T1 | 6 | `Tasks.tsx` `Task1` | story line, story_stats.py, input, three steps, 6:00; then 7 / 3, the rewatch line and 4, the new log's 4 / 3 / 1 with Sneha and sneha lit |
| 18 | G1 | 22 | `Classify.tsx` | three bins, seven case chips waiting; per round: the ask, one step (the chip taps into its bin, the type or error shown), the verdict with every why line |
| 19 | S-QUIZ | 0 | `ClassroomQuiz` | |
| 20 | H2 | 5 | `SeenByHook.tsx` | the live story, 7 opens pop up; viewers_plain.py; the list fills, Ravi lands 4 times, 7 beside Instagram's 3; the check line lights, 3; the fold into `set()` and `add`, still 3 |
| 21 | C8 | 4 | `AddItem` | Close Friends (Ravi, Anu, Sneha, green stars) as a bag, add.py; Kiran joins, 4 and the deck lines; add_again.py, vote; Ravi bounces, 3 |
| 22 | C9 | 5 | `UpdateMany` | update.py with three chips at the door; Vamsi joins, Ravi bounces, Pooja joins, 5; update_name.py, vote; P, o, o, j, a walk in, the second o bounces, 7 and the printed set; add_name.py, 4 |
| 23 | C10 | 4 | `Discard` | discard.py and the deck lines; Anu walks out, 2; discard_missing.py; the finger finds no Pooja, nothing moves, 3 |
| 24 | C11 | 3 | `RemoveComplains` | discard_missing.py and remove_missing.py side by side, vote; line 2 red, KeyError, line 3 grey; remove.py, Anu walks out, 2 |
| 25 | G2 | 27 | `WhoGetsIn.tsx` | five rounds: the program and the starting bag, the vote; one press per item at the door (joins, bounces, leaves, not there, KeyError, everyone leaves, prints); the verdict |
| 26 | C12 | 5 | `SetOps` | the four operations with green arrows beside the Close Friends bag; len counts the chips, 3; the finger finds no Kiran, False; each chip lights once, three Star lines; clear, every chip leaves, set() |
| 27 | T2 | 7 | `Tasks.tsx` `Task2` | the question and the input; not_close.py with line 6 dashed, steps, 6:00; my notes' step; the Kiran step; line 6 and 2; my notes' 3, Kiran's two opens lit; `close.add("Kiran")` and 1 |
| 28 | X1 | 2 | `Exit.tsx` | trending.py with line 2's blank, four options, 2:30; every option's count, what it prints and why |
| 29 | K1 | 6 | `Takeaways.tsx` | six empty slots, the hook's bag beside; one example per press, the result once the room has said it |
| 30 | S-FEEDBACK | 0 | `FeedbackEmbedSlide` | |
| 31 | S-THANKYOU | 0 | `ThankYouSlide` | |

## K1's results

As 26: a press fills the slot's heading and code; a click on the result fills
it once the room has said it, and the next press fills it too. The sixth
result needs the click. Autoplay stays off on K1.

## Avoiding earlier decks' mistakes

| Seen before | In 27 |
|---|---|
| Captions and outputs behind Next and Play (24) | `controls-clear-check` at every step |
| Long error lines clipped or wrapped (23, 24) | 26's auto-fitting `OutPanel` |
| A copied `revealSteps.ts` from the old deck (23) | re-measured before any screenshot |
| `spec-check.mjs` hard-coded to the old deck | rewritten from the 27 JSON |
| Duplicate React keys between siblings left a stale element (26) | keys prefixed per component |
| A chip that flew from the page's corner because its source had unmounted (26) | a bag keeps its sources mounted until the flight lands |
