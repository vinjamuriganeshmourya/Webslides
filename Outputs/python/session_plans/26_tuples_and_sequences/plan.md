<!-- cSpell:ignore NxtWave devPort Teja Maggi Samosa Vada Naatu Kissik Peelings ybl -->
# Python · Session 26: "Tuples and Sequences"

**STATUS: SIGNED OFF 2026-10-08** (user: *"Create the Session 26 (Tuples and
Sequences) slide deck … Follow the spec exactly … Generate the full deck in
the same format and folder structure as the previous sessions"*). The spec is
the signed-off content; this plan only maps it onto the kit. The deck was
generated from this plan in the same run, as sessions 23 and 24 were.

| | |
|---|---|
| `SESSION_NAME` | `Tuples and Sequences` |
| `COURSE` | `Python` |
| Source | `Reference ppt's/26_tuples_and_sequences_session_spec.json` (every program, output, press, step and round) and `…_spec.html` (the reading page, with 34 thumbnails of the original deck's kept slides). **23 beats, 34 cards, 75 minutes** |
| Project | `Outputs/python/26_tuples_and_sequences/` (scaffold copied from session 24; session 25 was being built by another session at the time and was not touched) |
| Deck file | `src/decks/tuplesDeck.tsx` |
| Slide count | **34**, one per card, in the spec's order |
| `devPort` | `5256` |
| `htmlName` | `python-session-26-tuples-and-sequences` |

## The one idea

A tuple is a row of values that can be read but never changed. The comma makes
it, not the brackets. Commas pack values into one tuple, and one name per value
unpacks it.

## Decisions

Carried from sessions 19 to 24 unless marked new.

1. **One slide per spec card, all 34, in the spec's order.** The spec has four
   divider cards this time (C1, C5, C12, C14), so the deck has four dividers.
   Spine cards use the same slides as 24: `BrandSlide`, `RecapBrand`,
   `WelcomeSlide minimal`, the static `AgendaSlide`, `ClassroomQuiz`,
   `FeedbackEmbedSlide`, `ThankYouSlide`. Every other card is a session figure
   on `Panel`; its presses are build steps; its body carries `data-spec` and
   `data-presses` equal to the spec's `press_count`.
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `figures/spec.ts` from the JSON. Every caption, option, why line, program
   and output on a slide comes from it.
3. **Every program was run** on CPython 3.12.3 (course rule R3): 78 programs,
   rounds, walks, X1's four options and the recap chips. All match the spec
   except T2's notes version, where 3.12 adds `Did you mean: 'round'?` to the
   NameError. The spec's shorter wording is kept (spec rule 6, code is exact;
   the same call as E1's ValueError wording in the spec's defects list).
4. **The keys** (`figures/keys.ts`, from 24): → and ← one press, F full
   screen, A all cards, End the whole card, 1 to 4 a vote.
5. **The agenda is static** (content rule 44): four stops, the spec's words,
   the last one `Packing and unpacking` (spec defect 1).
6. **Exact words, content rule 36**: the full stop at a line's end is dropped,
   a line with two sentences is two lines. Code, outputs and errors keep their
   own punctuation. Every code panel says `Python` (rule 31).
7. **Template colours only** (rule 37). The drawn payment app keeps its own
   screen colours inside the phone: a purple header and the green tick, with
   no product name and no logo anywhere (rule 12). The spec's "PhonePe look"
   is drawn as a generic UPI app.
8. **One picture for the whole session (spec note 5, new `figures/rows.tsx`).**
   A row of cells with its index under each cell, from 0. A list's row has
   round handles on top of each cell; a tuple's row has a small lock and no
   handles. Used on H1, C6 to C11, C13, C15, C16, K1. Name boxes (`NameBox`)
   are one component for C15, E1, G2, C16 and C17 (C15's play line: "keep
   them the same as E1's").
9. **Votes are clickable, keys 1 to 4 mark them, `Next` is never gated.**
   Confetti when the marked pick is right. Timers are the kit's `Countdown`:
   6:00 (T1), 7:00 (T2), 2:30 (X1).
10. **Controls and autoplay follow generate-slides section 2**: session 23's
    `controls.tsx` and `autoplay.ts` unchanged except the ON list. Spec rule 1
    says "No autoplay"; the switch stays on every card so the decks match, and
    it opens ON only on cards with no vote and no timer, as in 24: slides 3
    (S-RECAP), 4 (H1), 12 (C6) and 23 (H2).
11. **Movement inside one press plays only when the press is reached going
    forward**; going back or jumping lands it done (`usePhase`, from 21).

## Avoiding sessions 23 and 24's mistakes (checked before and after the build)

Each item names what went wrong in 23 or 24 and what this deck does instead.
The audit of 23 and 24 is summarised in the session's `CLAUDE.md`.

| Mistake seen in 23 / 24 | In 26 |
|---|---|
| Step captions and outputs ran behind Next and Play (24's E1 and H2) | every card is checked with `controls-clear-check.mjs` at every step; content stops above y 650 |
| Longer values pushed the vote into the controls (24 after the re-sync) | vote stacks sized for the longest option; each card checked at step 0 and fully revealed |
| Multi-line output in one element tripped align-check WRAPPED | one element per output line everywhere (`OutPanel`, K1's results) |
| A three-column grid read as centred (rule 38) | unequal outer columns on K1 and on every three-up row |
| The copied `revealSteps.ts` was the old deck's map: presses jumped slides | re-measured before any screenshot |
| `spec-check.mjs` hard-coded the old deck's slides | rewritten for 26 from the JSON |
| Output panels of different heights side by side (24's C4) | panels in a row share `minRows` |
| An empty caption box that appears on press 2 shifts the column (14) | captions keep their height when empty |
| A label sat on a code box (22's rule 47) | 23's `overlap-check.mjs` (with the label test) is the one copied |

## Slides

`P` is the spec's `press_count`; a card's build steps are `P - 1`.

| # | Card | P | Slide | What the presses do |
|---|---|---|---|---|
| 1 | S-WELCOME | 0 | `BrandSlide` | Welcome |
| 2 | S-RECAP-CARD | 0 | `RecapBrand` | three points from session 25: some methods change the list, some give back an answer, sort gives back None |
| 3 | S-RECAP | 7 | `Recap.tsx` `RecapSort` | the party queue row, two bins, six chips in a tray; each press files one chip into its bin, the queue row shows `queue_after` and the why line, then resets for the next chip |
| 4 | H1 | 6 | `PaymentHook.tsx` | the canteen and the pay pad (₹500 vs the ₹50 bill); success; details with only Share and Help; the owner's phone; the ₹450 refund row on top; the paid row lifts out into three locked cells beside the queue row |
| 5 | S-TITLE | 0 | `WelcomeSlide minimal` | Tuples and Sequences |
| 6 | S-AGENDA | 4 | `AgendaSlide` (static) | None · Tuples · Membership check · Packing and unpacking |
| 7 | C1 | 1 | `NoneDivider` | the recap's sort chip and its None slide in; the None grows into `NoneType Object` |
| 8 | C2 | 3 | `NoneCards.tsx` `NoneValue` | token.py, empty output, sort_gives_back.py small in the corner; both lines print, the token slot shows None; the two deck lines |
| 9 | C3 | 6 | `NoReturn` | increment_1 with input 5, vote 6/5/None; None and the empty parcel; line 3 becomes `return`; None; `return None`; None and the rule |
| 10 | C4 | 2 | `PrintNone` | vote Hi / Hi, None / None; the output fills Hi, then None |
| 11 | C5 | 1 | `SectionBreakerSlide` | Tuples |
| 12 | C6 | 3 | `TupleCards.tsx` `WhatTuple` | the payment row with 0, 1, 2; the queue list row with handles beside it, the lock; `immutable` |
| 13 | C7 | 3 | `CreateTuple` | create.py; both lines print, amount's cell shows 50; the rule |
| 14 | C8 | 4 | `OneItem` | types.py, vote tuple/int; three outputs, line 2 lit; one_item.py with a dashed line 1; `amount = (50,)` biggest, the comma ringed, 50 snaps into a one-cell locked row |
| 15 | C9 | 6 | `ReadNever` | the price board; index 1 → 15; change.py; cell 2 shakes, TypeError only; tools.py into the bins, append bounces; new_tuple.py, the name moves, the old row fades |
| 16 | C10 | 5 | `TupleOps` | four operations with arrows (deck slide 28); each lights, its line shows, the output fills, slice cells light |
| 17 | C11 | 4 | `ToTuple` | tuple(sequence) band; letters fly from "Tea"; the range; the cart |
| 18 | C12 | 1 | `SectionBreakerSlide` | Membership Check |
| 19 | C13 | 5 | `Membership.tsx` | the finger checks cell by cell on the menu tuple, then not in, the cart list, the UPI string (y, b, l light together) |
| 20 | T1 | 6 | `Tasks.tsx` `Task1` | payment.py, three steps, 6:00; then step 1's terminal, step 2's line 5, step 3's tip |
| 21 | G1 | 19 | `Impostor.tsx` | three rounds of four tokens; each press runs one token; the verdict flips the impostor |
| 22 | S-QUIZ | 0 | `ClassroomQuiz` | |
| 23 | H2 | 4 | `ReceiptHook.tsx` | receipt + receipt_long.py with lines 2 to 4 hidden; lines appear pulling cells into names; six receipt details; the fold into one line |
| 24 | C14 | 1 | `SectionBreakerSlide` | Packing & Unpacking |
| 25 | C15 | 4 | `Unpack.tsx` `Unpacking` | the order row and three name boxes; values fly in; the two deck lines; the list and string versions |
| 26 | E1 | 12 | `Unpack.tsx` `CountFirst` | slider 2 / 4 / 3; the counter, then the error or the fills, one step per press |
| 27 | G2 | 18 | `FillBoxes.tsx` | three rounds: vote, count, fill or stop, verdict |
| 28 | C16 | 4 | `Pack.tsx` `Packing` | pack.py, vote; the values pack into a locked row; pack_unpack.py; pack then unpack as two movements |
| 29 | C17 | 4 | `Pack.tsx` `ReturnTwo` | split_bill, vote 16/(16, 2)/error; the row travels from the return line to the call line; line 6 becomes `each, left = …`; the row splits into two boxes |
| 30 | T2 | 6 | `Tasks.tsx` `Task2` | the week as five history rows; week.py with lines 8 and 11 dashed, 7:00; my notes' step; the two lines; both weeks' output; my notes' error |
| 31 | X1 | 2 | `Exit.tsx` | order.py with line 1 blank, four options, 2:30; every option's result and why line |
| 32 | K1 | 6 | `Takeaways.tsx` | six empty slots; one example per press, code then result |
| 33 | S-FEEDBACK | 0 | `FeedbackEmbedSlide` | |
| 34 | S-THANKYOU | 0 | `ThankYouSlide` | |


result once the room has said it, inside the same press as the spec's screen
line says). Each slot shows its code on its press with the result filling
after a short beat, so the room says it while the code lands.

## K1's results (decided at build)

K1 has six presses, one per example, and its result "waits for the room". A
press fills the slot's heading and code; a click on the result slot fills the
result and its sentence once the room has said it, and the next press fills it
too. The sixth result needs the click. Autoplay stays off on K1.
