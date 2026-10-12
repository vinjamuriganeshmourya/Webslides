<!-- cSpell:ignore NxtWave devPort Teja Ravi Kiran Anna Maggi maggi samosa dosa -->
# Python · Session 29: "Dictionaries"

**STATUS: SIGNED OFF 2026-10-12** (user: *"generate slides for the session 29 as
you generated for the session 26, 27, 28 and don't repeat the mistakes that are
resolved in the session … 29_dictionaries_session_spec.html and
29_dictionaries_session_spec.json"*). The spec is the signed-off content; this
plan only maps it onto the kit. The deck is generated from this plan in the
same run, as sessions 26 to 28 were.

| | |
|---|---|
| `SESSION_NAME` | `Dictionaries` |
| `COURSE` | `Python` |
| Source | `Reference ppt's/29_dictionaries_session_spec.json` (every program, output, press, walk, round and why line) and `…_spec.html` (the reading page, with 19 thumbnails of the original deck's kept slides). **23 beats, 36 cards, 75 minutes.** DS2 and DS3 are already in this spec (sessions 27 and 28 took them from a change spec), so no change file is merged |
| Project | `Outputs/python/29_dictionaries/` (scaffold copied from session 27, which carries the 2b standard, the DS cards, the lab faces and the 2026-10-09 view fixes; `Code.tsx` takes session 28's eased panel height) |
| Deck file | `src/decks/dictDeck.tsx` |
| Slide count | **36**, one per card, in the spec's order |
| `devPort` | `5259` |
| `htmlName` | `python-session-29-dictionaries` |

## The one idea

A dictionary finds a value by its name, the key, never by its place.
`d[key] = value` adds the pair if the key is new and replaces the value if it
is there; a missing key is a KeyError with `[ ]` and None with `get()`;
`keys()`, `values()` and `items()` are live windows on it.

## Decisions

Carried from sessions 24 to 28 unless marked new.

1. **One slide per spec card, all 36, in the spec's order.** Three divider
   cards (D1 Accessing Items, D2 Operations on Dictionaries, D3 Dictionary
   Views) are `SectionBreakerSlide` 01, 02, 03, each carrying `data-spec`.
   Spine cards as 28: `BrandSlide`, `RecapBrand`, `WelcomeSlide minimal`, the
   static `AgendaSlide`, `ClassroomQuiz`, `FeedbackEmbedSlide`,
   `ThankYouSlide`. Every other card is a figure on `Panel`; its presses are
   build steps; its body carries `data-spec` and `data-presses`.
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `figures/spec.ts` (`SPEC`, and `NOTES` from each press's say line). It
   merges a `change_ds.json` or `change_fixes.json` beside this plan when one
   exists, the way 27 and 28 did.
3. **Every program was run** on CPython 3.12.3 (course rule R3): 47 programs,
   DS3's 20 proofs, G1's 4 rounds, G2's 3 rounds, X1's 4 options and C14's 6
   examples. All 86 match; the set column's order proof varies by hash seed,
   which the spec's own text shows ("run it again").
4. **Keys** (`figures/keys.ts`): → and ← one press, F full screen, A all
   cards, End the whole card, 1 to 4 a vote.
5. **The agenda is static** (content rule 44): the spec's four stops.
6. **Exact words, content rule 36**: a closing full stop dropped, two
   sentences become two lines. Code and outputs keep their punctuation.
7. **Template colours only** (rule 37). The canteen board's marker blue is
   the brand's dark blue; nothing on a slide is a product mark (rule 12).
8. **One picture for the whole session (spec note 5, new `figures/board.tsx`).**
   The dictionary is Anna's canteen board: a framed board, one row per key,
   the name tag on the left, its price card on the right, joined by an arrow,
   in the order the rows were added. No row ever shows a number. A changed
   value is a new price card that covers the old one in the same row (the
   sticker); the old one is gone, never struck through. A new key is written
   at the bottom. A wiped row leaves and the rows below close up. A lookup
   lights the tag and lifts a copy of its card; a search walks a finger down
   the tags only. The views peel copies off: the tag column, the card column,
   whole rows. The board in the hook (H1) is the same frame with marker
   handwriting, which turns into tags and cards on the last press.
9. **Votes are clickable, keys 1 to 4 mark them, Next is never gated.**
   Confetti when the marked pick is right. Timers: 6:00 (T1), 5:00 (T2),
   2:30 (X1).
10. **Controls and autoplay** (generate-slides section 2): session 23's
    `controls.tsx` and `autoplay.ts`. **Autoplay opens off on every slide**
    (the 2026-10-09 view fixes: every step and every output waits for Next);
    the switch stays for the instructor.
11. **Movement inside one press** runs through `usePhase` / `useStepPhase` and
    plays only when the press is reached going forward. Nothing a press shows
    waits on a timer: outputs and captions are on screen from the press
    itself; what moves is the emphasis (the 27/28 view fixes).
12. **Kickers**: the agenda stop each card belongs to; the hooks say
    `Programming Foundations`; the games say `Game`.
13. **People** are lab characters (2b item 12): Teja (session 26's), Ravi,
    Kiran, Anu as `Face`; Anna at the counter is a new lab config with the
    apron prop (`Cast.tsx`'s `Posed`/`Idling`), and G2's volunteer-Anna
    claps and waves with the lab's own `clap` and `wave` gestures.
14. **Layout** (new): the body box is y 221 to 652 (Next at 661). A board
    card is two columns: the board group on the left (400px) with the step
    caption under it, the program group on the right (730px, so the
    71-character full menu line fits at CODE_FS 15) with the ask, the vote,
    the output and the rule line. The groups keep one height on every press.

## Carry-forward standard (generate-slides 2b), per card

| Item | Where |
|---|---|
| `Group` one cluster, one container; `active` on the part being worked | every content card: the board, the program with its vote and output |
| `Focus` on the asked program until its answer | C3 to C9, C13, C14, G1 ask presses |
| `Code.tsx` blanks (`___`+) | X1 line 2 |
| `StepCaption` cross-fade | every stepped card |
| `Option`/`Vote` one centre line, `nowrap`, `template` for unequal columns | every vote |
| `CODE_FS` 15, `OUT_FS` 16 | every card |
| `Fresh` / `Appear` / `Swap`: nothing pops | program swaps, round swaps, screens |
| Arrows path-draw, filled heads (rules 45, 46) | the tag-to-card arrows, the price flying to the total (E1) |
| Characters from the lab, phones 1 : 2.06 | DS2's four phones, Anna, Teja, Ravi, Kiran |
| No box overflow, no drag | gate: `box-overflow-check` |

## Slides

`P` is the spec's `press_count`; a card's build steps are `P - 1`.

| # | Card | P | Slide | What the presses do |
|---|---|---|---|---|
| 1 | S-WELCOME | 0 | `BrandSlide` | Welcome |
| 2 | S-RECAP-CARD | 0 | `RecapBrand` | three points from session 28: union keeps each person once; minus keeps from the set before it; the operators need two sets |
| 3 | S-RECAP | 4 | `RecapTiles.tsx` | the two set lines, three tiles face down; one turns per press: its output and why line |
| 4 | H1 | 6 | `CanteenHook.tsx` | Anna's whiteboard, Teja at the counter; tea and maggi light; bill.py with the two lists in step, 42; the puff line wiped, remove line, the question; puff leaves names only, maggi slides onto 20, 32; the rows zip into tags and cards |
| 5 | S-TITLE | 0 | `WelcomeSlide minimal` | Dictionaries |
| 6 | S-AGENDA | 4 | `AgendaSlide` (static) | the four stops |
| 7 | DS2 | 5 | `DataStructures.tsx` `DataFamily` | four tiles face down; list, tuple, set turn with a tick; dictionary turns, lit, Today |
| 8 | C1 | 3 | `DictCards.tsx` `WhatDict` | the five-row board and deck slide 16's picture; key and value labels; the tea row boxed as one item |
| 9 | DS3 | 6 | `DataStructures.tsx` `WhatItIs` | the grid, three columns filled; one dictionary cell per press with its proof |
| 10 | C2 | 6 | `CreateDict` | three rows and `menu = { }`; one pair flies in per press with Key, Value, Item labels; menu.py; the output |
| 11 | C3 | 3 | `EmptyDict` | the empty board, empty.py, vote set or dict; dict, and dict(); pair_or_not.py, set |
| 12 | C4 | 3 | `KeysOnce` | tea_twice.py, four options; the 14 covers the 12, the output; same_price.py, the deck line |
| 13 | D1 | 1 | `SectionBreakerSlide` 01 | Accessing Items |
| 14 | C5 | 4 | `Lookup.tsx` `Bracket` | the board and samosa.py; the samosa tag lights, its card lifts, 15; third.py, three options; the finger finds no tag 2, KeyError |
| 15 | C6 | 4 | `GetOrError` | dosa.py; no dosa tag, the alarm, KeyError; dosa_get.py, three options; the quiet None, and tea_get.py 12 |
| 16 | C7 | 5 | `InChecks` | in_menu.py, three lines; each press walks the tag column and fills a line: True, False, False; the deck line |
| 17 | D2 | 1 | `SectionBreakerSlide` 02 | Operations on Dictionaries |
| 18 | C8 | 4 | `Changing.tsx` `AddChange` | add_change.py and a two-row board, three options; bun written at the bottom; 14 covers tea's 12, the output; capital_tea.py, 4 |
| 19 | C9 | 3 | `Delete` | maggi_over.py; the maggi row wiped, the output; maggi_twice.py, KeyError |
| 20 | E1 | 6 | `Bill.tsx` | bill.py, the board, the total box at 0, the order; one word per press: the tag lights, its price flies into the total; 39 and the never-ordered rows grey; the rule |
| 21 | T1 | 6 | `Tasks.tsx` `Task1` | bill.py, the input, three steps, 6:00; step 2's input; step 3's; then 59; KeyError with line 5 red; the if line and 27 |
| 22 | G1 | 22 | `LookItUp.tsx` | the intro; four rounds: the program, the board and the vote; one press per line (sticker, new row, wipe, tag lights and card lifts, None, KeyError); the verdict with a why line per wrong option |
| 23 | S-QUIZ | 0 | `ClassroomQuiz` | |
| 24 | H2 | 4 | `CheapHook.tsx` | Anna's small card; cheap_lists.py, the two lists by position, the output; bun appended to names only, IndexError; the lists zip into one board, cheap_board.py, the output |
| 25 | D3 | 1 | `SectionBreakerSlide` 03 | Dictionary Views |
| 26 | C10 | 5 | `Views.tsx` `ThreeViews` | the board and views.py, the values vote; the tag column peels off; the card column; whole rows as pairs; keys_list.py |
| 27 | C11 | 5 | `LoopRows` | each_row.py; one row per press lifts, splits into name and price, its line prints; the deck line and each_name.py |
| 28 | C12 | 4 | `WindowPhoto` | the window and the photo; Anna writes bun; the window shows bun, the photo does not, the output; the deck line |
| 29 | G2 | 42 | `BeAnna.tsx` | the intro; three rounds: the program, the board, the vote; one press per line, the line lit, the row read lit, Anna claps or waves; the verdict |
| 30 | C13 | 4 | `Convert.tsx` `FromPairs` | Anna's notebook and notebook.py; the pairs snap onto the board, the output; flat.py, three options; ValueError |
| 31 | C14 | 8 | `CanBeKey` | the table, six examples; one row per press, Yes or No with the error; combo.py and combo_list.py |
| 32 | T2 | 6 | `Tasks.tsx` `Task2` | budget.py, 15, three steps, 5:00; 20; 10; then 3; items() and the four names, 4; 0 |
| 33 | X1 | 2 | `Exit.tsx` | sign.py with line 2 blank, four options, 2:30; the right one marks, every option's print and why |
| 34 | K1 | 6 | `Takeaways.tsx` | six empty slots; one example per press, its result once the room has said it (a click or the next press) |
| 35 | S-FEEDBACK | 0 | `FeedbackEmbedSlide` | |
| 36 | S-THANKYOU | 0 | `ThankYouSlide` | |

## K1's results

As 27 and 28: a press fills the slot's heading and code; a click on the
result fills it once the room has said it, and the next press fills it too.
The sixth result needs the click, or Next once more: K1 is six presses in
this spec, so the sixth result fills on a click, and Next goes grey after
press 6 (the spec's count is kept; `data-presses` is 6).

## Avoiding earlier decks' mistakes

| Seen before | In 29 |
|---|---|
| Outputs that filled on a timer inside a press (27, 28 view fixes) | every output is on screen from its press; movement is the emphasis only |
| Autoplay opening on (27, 28 view fixes) | off on every slide; `autoplay-check` tests the switch on E1 |
| Captions and outputs behind Next and Play (24) | fixed group heights; `controls-clear-check` at every step |
| Long error lines clipping (23, 24) | 26's auto-fitting `OutPanel`; C13's 76-character ValueError gets the full width |
| A chip that lands on another because it does not fit (28's Venn) | the board's rows are a grid: a tag and a card never share a place |
| Proof code too small to read (DS3 view fix) | the current row's proof 15px, earlier rows 12px; row heights from today's proofs only, so the four-column grid fits the body box |
| A copied `revealSteps.ts` from the old deck (23) | re-measured before any screenshot |
| `spec-check.mjs` and `autoplay-check.mjs` hard-coded to the old deck | rewritten for the 29 JSON and slide numbers |
| Duplicate React keys between siblings (26) | keys prefixed per component |
| A chip flying from the page's corner because its source unmounted (26) | the board keeps every source mounted until a flight lands |
| Faces cut in half by a tight crop (27) | session 27's 150px head crop |
| A truncated phone row, a label under a phone hitting the controls (27) | no `truncate`; phones at 1 : 2.06 inside their group |

## Verification, 2026-10-12 (built file `dist-single/python-session-29-dictionaries.html`, 3.18 MB)

- typecheck clean; every program, proof, round and option run on CPython 3.12.3 (86 checks, all match).
- Reveal-step map measured on the dev server (`.measure.mjs`): every card = spec `press_count - 1`, 36 slides.
- `spec-check` (keys, End, votes, picker, `data-spec`/`data-presses` on all 29 cards with presses, no network host but the feedback form), `autoplay-check` (off on every slide, the switch tested on E1), `feedback-check` (an exact copy of session 18's), `gesture-check`, `agenda-check`, `ligature-check`: pass.
- `video-safe` CLEAN; `qa` flags only slides 1 and 36 (the Welcome and Thank you baseline, NO LOGO); the 16px type-floor list is informational.
- `align-check` 0 of 36; `mixed-align-check` 0 of 36.
- `controls-clear-check` CLEAR at every step of all 36 slides.
- `box-overflow-check`: only the kit's three section breakers clipping their decorative numbers (the same baseline as 26 to 28).
- `overlap-check` at its 700ms sample: slide 1's decorative sparkle (baseline) and E1's price copy caught in flight, the movement the spec asks for (the same class as 28's chips in flight).
- Every card screenshotted at every press on the dev server (`.shots2.mjs`) and looked at.
