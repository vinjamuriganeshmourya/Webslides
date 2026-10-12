<!-- cSpell:ignore NxtWave devPort Teja Ravi Kiran Sneha Pooja Divya Vamsi Arjun Harsha Manoj Meena Lakshmi -->
# Python · Session 28: "Set Operations"

**STATUS: SIGNED OFF 2026-10-08** (user: *"Generate the slides as you did for
the session 26 and 25 and 24 … generate the slide for this file
28_set_operations_session_spec.html and .json"*). The spec is the signed-off
content; this plan only maps it onto the kit. The deck is generated from this
plan in the same run, as sessions 23 to 26 were.

| | |
|---|---|
| `SESSION_NAME` | `Set Operations` |
| `COURSE` | `Python` |
| Source | `Reference ppt's/28_set_operations_session_spec.json` (every program, output, press, step and round) and `…_spec.html` (the reading page, with 18 thumbnails of the original deck's kept slides). **23 beats, 27 cards, 75 minutes** |
| Project | `Outputs/python/28_set_operations/` (scaffold copied from session 26, which carries 24's and 25's standard; session 27 is being built by another session and is not touched) |
| Deck file | `src/decks/setOpsDeck.tsx` |
| Slide count | **28**, one per card, in the spec's order (27, plus DS3 from the change spec of 2026-10-09) |
| `devPort` | `5258` (5257 left free for session 27) |
| `htmlName` | `python-session-28-set-operations` |

## The one idea

Every set operation asks each person two questions, in the first set? in the
second?, and keeps a different part: `|` everyone, `&` the middle, `-` the
first only, `^` everyone but the middle. It builds a new set and never changes
the two it reads. `issubset`, `issuperset` and `isdisjoint` ask whether one
group sits inside, around or apart from the other.

## Decisions

Carried from sessions 24 to 26 unless marked new.

1. **One slide per spec card, all 27, in the spec's order.** One divider card
   (D1, `Set Comparisons`). Spine cards as 26: `BrandSlide`, `RecapBrand`,
   `WelcomeSlide minimal`, the static `AgendaSlide`, `ClassroomQuiz`,
   `FeedbackEmbedSlide`, `ThankYouSlide`. Every other card is a figure on
   `Panel`; its presses are build steps; its body carries `data-spec` and
   `data-presses`.
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `figures/spec.ts` (and `NOTES`, the say lines, for speaker notes).
3. **Every program was run** on CPython 3.12.3: 60 programs, rounds, X1's four
   options and the six recap chips. All match; C4's printed set comes out in
   another order, which the spec's note 6 allows (no question asks for order).
4. **Keys** (`figures/keys.ts`): arrows one press, F full screen, A all cards,
   End the whole card, 1 to 4 a vote.
5. **The agenda is static** (content rule 44): the spec's four stops.
6. **Exact words, content rule 36**: a line's closing full stop dropped, two
   sentences become two lines. Code keeps its own punctuation.
7. **Template colours only** (rule 37). The drawn chat app keeps its own
   screen colours inside the phone (the green bar, grey Already added rows,
   green ticks), with no product name and no logo (rule 12). The spec's
   "WhatsApp look" is drawn as a generic chat app (26's `CHAT` palette).
8. **One picture for the whole session (spec note 5, new `figures/venn.tsx`).**
   A group is a circle of name chips, no numbers, no order. Two groups that
   share people overlap, the shared chips in the middle. A region lights
   (brand blue) or greys and stays so. An operation fills a NEW circle with
   copies that fly out of the source chips; the sources never lose a chip.
   One component draws apart, touching, overlapping and nested circles
   (H1, C1 to C9, E1, G1, G2, H2, T2, K1's icons).
9. **Votes are clickable, keys 1 to 4 mark them, Next is never gated.**
   Confetti when the marked pick is right. Timers: 6:00 (T1, T2), 2:30 (X1).
10. **Controls and autoplay** (generate-slides section 2): session 23's
    `controls.tsx` and `autoplay.ts`. Autoplay opens ON only on cards with no
    vote and no timer: 3 (S-RECAP), 4 (H1), 7 (C1), 13 (E1), 17 (H2).
11. **Movement inside one press** runs through `usePhase` / `useStepPhase` and
    plays only when the press is reached going forward.
12. **Kickers**: `Set Operations` on C1 to E1 and `Set Comparisons` on C7 to
    C9, the original deck's own kickers (both come after the title card, so
    spec rule 4 holds). The hook says neither.

## Carry-forward standard (generate-slides 2b), per card

| Item | Where |
|---|---|
| `Group` one cluster, one container; `active` on the part being worked | every content card: program + output, the picture, the vote |
| `Focus` on the asked program until its answer | C2 to C9 vote presses, H2 press 2 |
| `Code.tsx` blanks (`___`+) | T2 line 3, X1 line 2 |
| `StepCaption` cross-fade | C1 to C9, E1, G1, G2, H2 |
| `Option`/`Vote` one centre line, `nowrap` | every vote |
| `CODE_FS` 15, `OUT_FS` 16, `CODE_REF_FS` 13 | every card; E1's program at 13 (reference beside the walk) |
| `Fresh` / `Appear` / `Swap`: nothing pops | program swaps (C2 to C9), rounds (G1, G2), phone screens (H1, H2) |
| Arrows path-draw, filled heads | C8's reading arrow, the result arrow on C2 to C6 |
| Phones 1 : 2.06 with `LiveClock` | H1, H2 (209 x 430) |
| No box overflow, no drag | gate: `box-overflow-check` |

## Slides

`P` is the spec's `press_count`; a card's build steps are `P - 1`.

| # | Card | P | Slide | What the presses do |
|---|---|---|---|---|
| 1 | S-WELCOME | 0 | `BrandSlide` | Welcome |
| 2 | S-RECAP-CARD | 0 | `RecapBrand` | three points from session 27: each item once, no order; add and update put values in; remove complains, discard does not |
| 3 | S-RECAP | 7 | `RecapSort.tsx` | close friends line, six chips, two bins; each press files one chip, its output and why line |
| 4 | H1 | 6 | `GroupHook.tsx` | chat list; two group info cards; Fest crew 8 members, Add participants; Ravi and Kiran grey; 12 members; the two cards become two overlapping circles |
| 5 | S-TITLE | 0 | `WelcomeSlide minimal` | Set Operations |
| 6 | S-AGENDA | 4 | `AgendaSlide` (static) | the four stops |
| 7 | **DS3** (new) | 6 | `DataStructures.tsx` `WhatItIs` (session 27's grid) | the whole grid, list and tuple filled, the set column dashed; one set cell fills per press, its proof beside it, after the room says it |
| 8 | C1 | 5 | `OpCards.tsx` `ThreePlaces` | big circles with three labels; each press lights an op icon and its regions blue |
| 9 | C2 | 3 | `Union` | union.py, vote 15/12/3; copies fly into fest, 12; union_keep.py, 8 7, both circles light |
| 10 | C3 | 4 | `UnionList` | the list walks in through union(), 9; pipe_list.py vote; the list bounces off `|`, TypeError |
| 11 | C4 | 3 | `Intersection` | both.py vote 12/3/0; the middle lifts out; intersection() with a list |
| 12 | C5 | 4 | `Difference` | only_cse.py; cse's outer part lifts out, 5; swap, vote; cricket's outer part, 4 |
| 13 | C6 | 3 | `SymDiff` | one_group.py vote 12/9/3; both outer parts lift, 9; the method, 9 |
| 14 | E1 | 14 | `Gate.tsx` | four empty result circles; 11 presses, one person through the two lamps each; counts; rules |
| 15 | T1 | 6 | `Tasks.tsx` `Task1` | dance.py, three steps, 6:00; then each step's result |
| 16 | G1 | 22 | `Regions.tsx` | four rounds: vote, three regions light or grey, the print, the verdict; round 4 stops on the TypeError |
| 17 | S-QUIZ | 0 | `ClassroomQuiz` | |
| 18 | H2 | 5 | `PollHook.tsx` | the poll; stall_check.py; the ok box flips per vote, True; the flag fix, False; the fold into issubset, the votes circle slides into cse, Harsha outside |
| 19 | D1 | 1 | `SectionBreakerSlide` | Set Comparisons |
| 20 | C7 | 4 | `Compare.tsx` `Subset` | volunteers inside cse, True; Harsha vote; each chip checked, Harsha pokes out, False; the swap, False |
| 21 | C8 | 3 | `Superset` | the same picture read from the big circle, True; swap vote; False and the two deck lines |
| 22 | C9 | 4 | `Disjoint` | bus and cricket slide together and stop, True; bus and cse overlap on Pooja and Divya, False |
| 23 | G2 | 27 | `Inside.tsx` | five rounds: vote, each person checked moves to the other circle, the verdict |
| 24 | T2 | 6 | `Tasks.tsx` `Task2` | stall.py with line 3 blank, the poll, 6:00; poll 2; my notes; the results |
| 25 | X1 | 2 | `Exit.tsx` | fest_bot.py with line 2 blank, four options, 2:30; every option's result and why |
| 26 | K1 | 6 | `Takeaways.tsx` | six empty slots with a small two-circle icon each; one example per press |
| 27 | S-FEEDBACK | 0 | `FeedbackEmbedSlide` | |
| 28 | S-THANKYOU | 0 | `ThankYouSlide` | |

## Change, 2026-10-09: "28 Set Operations: recall what a set is"

Source: `Reference ppt's/28_set_operations_change_spec_data_structures 1.html`,
its card JSON kept as `change_ds.json` beside this plan and merged by
`scripts/build-spec-data.mjs`. Everything not listed there is unchanged.

- **DS3 added** as slide 7, its own beat "Recall: what a set is" (2 minutes)
  right after the agenda; C1 onwards move up one slide. It is session 27's
  `DataGrid` (`figures/DataStructures.tsx`, copied unchanged, so the room
  knows it on sight): rows and columns from the card's data, the set column
  shaded and dashed, one cell per press with its proof (code and exact
  output from `data.proofs`). Kicker and section `Recap`. Autoplay opens off
  (the room says each cell first).
- **Minutes**: Classroom quiz 6 to 5; Subset and superset 6 to 5. The deck
  shows no minutes, so these live in the change file only; the build script
  checks the beats still add up to 75.
- Shifted with the insert: reveal-step map (DS3 = 5), autoplay defaults
  (3, 4, 8, 14, 18, 26), `slideCount` 28, and the slide numbers inside
  `spec-check` and `autoplay-check`.

## Verification, 2026-10-08 (built file `dist-single/python-session-28-set-operations.html`, 3.05 MB)

- typecheck clean; reveal-step map measured: every card = spec `press_count - 1`.
- `video-safe` CLEAN; `qa` flags only slides 1 and 27 (the Welcome and Thank you baseline, NO LOGO).
- `align-check` 0 of 27; `mixed-align-check` 0 of 27.
- `controls-clear-check` CLEAR at every step of all 25 slides with content.
- `box-overflow-check`: none on content cards; slide 18 is the kit's section breaker clipping its decorative "02" (the same baseline as session 26's dividers).
- `overlap-check` at its own 700ms sample flags chips caught in flight; with a 3200ms settle (`.ov-settled.mjs`) only slide 1's decorative sparkle (baseline).
- `spec-check`, `feedback-check` (exact copy of session 18's), `gesture-check`, `agenda-check`, `ligature-check`, `autoplay-check`: all pass.
- Every card was screenshotted at step 1, mid-run and fully revealed, and looked at.
- Not run: `nav-stress-check`, WebKit.

## Change spec, 2026-10-09: the view fixes

Source: `Reference ppt's/27_28_sets_view_fixes_change_spec.html` (the pedagogy
team's press-by-press check of the built view; its slide numbers are this
deck's). Data: `change_fixes.json` beside this plan, merged into `spec.ts` by
the build script. The deck's `CLAUDE.md`, item 15, has the per-card detail.

- Autoplay opens off on every slide; every step and output waits for a press.
- No output fills on a timer inside a press. Press counts grew where one did:
  C4 4, C6 4, C7 5, C8 4; K1 7 (example 6's result on its own press); H2 7
  (the spec's new card: the check written right, with a break, one vote per
  press, then the fold).
- G1: round 2's left circle is dance; no field-name badges; round 4's list
  drawn as a list. Operators in sentences are code chips.
- C7: captions "Harsha swaps out. Divya takes his place." and "Harsha wants
  back in."; the choices from press 2; False on press 3.
- G2: the circles drawn as the code says (inside, around, overlapping).
- DS3: the current row's proof large, earlier rows small.
- Agenda: left static (content rule 44); all four stops are on the slide.
