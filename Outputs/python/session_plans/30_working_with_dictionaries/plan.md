<!-- cSpell:ignore NxtWave devPort Teja Ravi Kiran Divya Sai Ooty dhaba kwargs -->
# Python · Session 30: "Working with Dictionaries"

**STATUS: SIGNED OFF 2026-10-12** (user: *"generate slides for the session 30
as you generated for the session 26, 27, 28 and don't repeat the mistakes that
are resolved"*). The spec is the signed-off content; this plan only maps it
onto the kit, as the plans for sessions 24 to 28 did, and the deck is generated
from it in the same run.

| | |
|---|---|
| `SESSION_NAME` | `Working with Dictionaries` |
| `COURSE` | `Python` |
| Source | `Reference ppt's/30_working_with_dictionaries_session_spec.json` (every program, output, press, walk step and round) and `…_spec.html` (the reading page, with 18 thumbnails of the original deck's kept slides). **24 beats, 27 cards, 75 minutes** |
| Project | `Outputs/python/30_working_with_dictionaries/` (scaffold copied from session 28, which carries the carry-forward standard and the 2026-10-09 view fixes) |
| Deck file | `src/decks/dictsDeck.tsx` |
| Slide count | **27**, one per card, in the spec's order |
| `devPort` | `5260` (5259 left free for session 29) |
| `htmlName` | `python-session-30-working-with-dictionaries` |

## The one idea

`b = a` gives one dictionary a second name, so a change through either name
is seen by both; `copy()` makes a second dictionary. A function with `*args`
or `**kwargs` takes any number of arguments: values with no name pack into a
tuple, `name=value` arguments pack into a dictionary.

## Decisions

Carried from sessions 24 to 28 unless marked new.

1. **One slide per spec card, all 27, in the spec's order.** One divider card
   (D1, `Arbitrary Function Arguments`). Spine cards as 28: `BrandSlide`,
   `RecapBrand`, `WelcomeSlide minimal`, the static `AgendaSlide`,
   `ClassroomQuiz`, `FeedbackEmbedSlide`, `ThankYouSlide`. Every other card
   is a figure on `Panel`; its presses are build steps; its body carries
   `data-spec` and `data-presses`.
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `figures/spec.ts` (and `NOTES`, the say lines, for speaker notes).
3. **Every program was run** on CPython 3.12.3: 45 programs, rounds, X1's
   four calls and the six recap examples. All match. `ids.py` prints a
   different id on every laptop, which the spec says itself; the slide shows
   the spec's own two equal numbers (`data.id_example`) under the small
   print "Your numbers will be different. Both will match."
4. **Keys** (`figures/keys.ts`): arrows one press, F full screen, A all cards,
   End the whole card, 1 to 4 a vote.
5. **The agenda is static** (content rule 44): the spec's four stops.
6. **Exact words, content rule 36**: a line's closing full stop dropped, two
   sentences become two lines. Code keeps its own punctuation.
7. **Template colours only** (rule 37). The drawn Google Sheet keeps its own
   green header and grid inside the screen, the drawn chat app keeps session
   28's generic `CHAT` palette; no product name, no logo (rule 12).
8. **One picture for the first half (spec note 5, new `figures/sheet.tsx`).**
   A dictionary is Divya's Google Sheet from the hook: one row per key, the
   name on the left, the amount on the right, in the order the rows were
   added. A variable is a name tag with an arrow to a sheet. Two tags can
   point at one sheet. A line that gives an existing sheet a second name adds
   an arrow only; a second sheet is drawn only for `copy()`. Arrows path-draw
   with 9px heads on their own axis (rules 45, 46; session 20's engine).
9. **One picture for the second half (spec note 6, new `figures/boxes.tsx`).**
   A function's parameters are boxes: a plain box per named parameter, a
   tuple box `()` for `*name`, a dictionary box `{}` for `**name`. Each
   argument of a call flies from the call line into its box; the dictionary
   box grows into a small copy of Divya's sheet.
10. **Votes are clickable, keys 1 to 4 mark them, Next is never gated.**
    Confetti when the marked pick is right. Timers: 5:00 (T1, T2), 2:30 (X1).
11. **Controls and autoplay** (generate-slides section 2): session 23's
    `controls.tsx` and `autoplay.ts`. **Autoplay opens off on every slide**
    (the 2026-10-09 view fixes, kept): every step and every output waits for
    a press. The switch stays for the instructor.
12. **No output on a timer, anywhere** (the view fixes, kept): what a press
    reveals is on screen from the press; chips flying and the dot moving are
    movement inside the press, through `useStepPhase`.
13. **K1 is seven presses, not the spec's six** (the view fixes, kept from
    28): the seventh fills example 6's result and its sentence, so nothing is
    left at `?` once Next goes grey. `spec-check` expects 7 for K1.
14. **Movement inside one press** runs through `useStepPhase` and plays only
    when the press is reached going forward.
15. **Kickers**: `Dictionary Methods` on C1 to G1 and `Variable Length
    Arguments` on C4 to T2, the original deck's own kickers (both come after
    the title card, so spec rule 4 holds). The hooks and the recap say neither.
16. **People** (2b, item 12): every person is a character-lab face
    (`people.tsx`, `Face`); Sai is new, added beside Divya, Ravi and Kiran.
17. **Git is not touched.** The shared checkout carries other sessions' work.

## Carry-forward standard (generate-slides 2b), per card

| Item | Where |
|---|---|
| `Group` one cluster, one container; `active` on the part being worked | every content card: program + output, the picture, the vote |
| `Focus` on the asked program until its answer | C1 to C8 vote presses, G1 and G2 ask presses, X1 |
| `Code.tsx` blanks (`___`+) | X1 line 6 |
| `StepCaption` cross-fade | S-RECAP, H1, C1 to C9, E1, G1, G2, H2 |
| `Option`/`Vote` one centre line, `nowrap` | every vote |
| `CODE_FS` 15, `OUT_FS` 16 | every card |
| `Fresh` / `Appear` / `Swap`: nothing pops | program swaps (C2, C5, C8, E1, T1, T2), rounds (G1, G2), sheets and phones (H1) |
| Arrows path-draw, filled 9px heads on their own axis | every tag arrow (`sheet.tsx`) |
| Phones 1 : 2.06 with `LiveClock`; the laptop from session 20 | H1 |
| Characters from the lab | H1's chat rows, H2's table, C9's picture |
| No box overflow, no drag | gate: `box-overflow-check` |

## Slides

`P` is the spec's `press_count`; a card's build steps are `P - 1`.

| # | Card | P | Slide | What the presses do |
|---|---|---|---|---|
| 1 | S-WELCOME | 0 | `BrandSlide` | Welcome |
| 2 | S-RECAP-CARD | 0 | `RecapBrand` | three points from the dictionaries session: a key and its value, one row each; a key is found by its exact name; `menu[key] = value` changes a row or adds one |
| 3 | S-RECAP | 3 | `RecapBug.tsx` | Anna's canteen board, samosa.py, `It prints: 15` beside `We wanted: 20`, the line vote; line 3 lights and the board grows a third row `Samosa 20`; the fix, the row goes, `20` |
| 4 | H1 | 7 | `SheetHook.tsx` | the class chat with Divya's link, the sheet on Divya's laptop and on Ravi's phone; Ravi types 800; Divya's cell follows; Kiran makes a copy and types 2000; Divya's unchanged; Divya deletes everything; Ravi empty, Kiran full, and three tags over two sheets |
| 5 | S-TITLE | 0 | `WelcomeSlide minimal` | Working with Dictionaries |
| 6 | S-AGENDA | 4 | `AgendaSlide` (static) | the four stops |
| 7 | C1 | 4 | `DictCards.tsx` `SameSheet` | today's two methods and the trip sheet with its tag; link.py, vote A/B; a second tag `ravi` to the same sheet, Ravi's cell 1000, the output; `True`, ids.py beside it, "Same id. Same sheet." |
| 8 | C2 | 4 | `MakeACopy` | make_a_copy.py, `dict.copy()`; a second sheet drawn row by row, `kiran` points at it, 2000 on the copy; the three output lines; bus.py, a list has copy() too |
| 9 | C3 | 4 | `CheckIt` | check.py with len(), clear(), Membership Check; `3`, 800 walks the name column, `False`, `True`; lines 5 to 7, vote A/B/C; the rows wiped, the empty sheet and its tag stay, `{}` and `0` |
| 10 | E1 | 22 | `Loop.tsx` | remove_unpaid.py and the four-row sheet; six walk presses, the dot on the row, Kiran's row vanishes, RuntimeError; the deck's line; the fixed program with backup beside trip; thirteen walk presses on the copy, `{'Teja': 1500, 'Ravi': 800}` |
| 11 | T1 | 6 | `Tasks.tsx` `Task1` | backup.py, three steps, 5:00; each step's result after the timer; step 3's KeyError beside it |
| 12 | G1 | 21 | `ChangeOrMove.tsx` | the intro; four rounds: vote, one press per line with the tags and sheets redrawn, the verdict; round 4's `trip = {}` moves only trip's tag |
| 13 | S-QUIZ | 0 | `ClassroomQuiz` | |
| 14 | H2 | 5 | `DhabaHook.tsx` | the dhaba at night, the bill 1200; split3.py and its output; Sai sits down, TypeError; split4? split5? split10?; the three boxes fold into `*friends`, the three prints into one loop, split_any.py |
| 15 | D1 | 1 | `SectionBreakerSlide` | Arbitrary Function Arguments |
| 16 | C4 | 4 | `ArgCards.tsx` `PacksTuple` | the deck's line and max.py; show.py, the box `friends` as `()`, vote A/B/C; three names fly into the tuple box; `('Sai',)` and `()` |
| 17 | C5 | 4 | `OpensList` | table.py with the list `table`; the list bursts into three names that fly into the box; table_no_star.py, vote A/B/C; the whole list lands as one item, `1200` |
| 18 | C6 | 3 | `PacksDict` | mark_paid.py, the box `paid` as `{}`, vote A/B/C; `Teja=1500` and `Ravi=800` become rows; `{}` for line 5 |
| 19 | C7 | 4 | `RealDict` | paid_loop.py, "What prints?"; one row per press lifts and prints; `True` |
| 20 | C8 | 4 | `OpensDict` | room_card.py, the room card and the boxes `name`, `block`; the pairs fly to their boxes, `Teja C`; the wrong key, vote A/B; `student` finds no box, TypeError |
| 21 | G2 | 23 | `Lands.tsx` | four rounds: vote, one argument per press flies to its box or stops, the body's press, the verdict |
| 22 | C9 | 7 | `Bins.tsx` | three bins and five job cards; one card per press flies to its bin and shows its def line; the deck's note |
| 23 | T2 | 6 | `Tasks.tsx` `Task2` | trip_total.py, three steps, 5:00; `2300 1`; the `**sheet` call, `2300 2`, the TypeError without it; `0 0` |
| 24 | X1 | 2 | `Exit.tsx` | show_paid.py with the call blank, four options, 2:30; every option's result and why |
| 25 | K1 | 6 (+1) | `Takeaways.tsx` | six empty rows; one example per press, its result on the press after |
| 26 | S-FEEDBACK | 0 | `FeedbackEmbedSlide` | |
| 27 | S-THANKYOU | 0 | `ThankYouSlide` | |

## Mistakes resolved in sessions 24 to 28, carried here on purpose

- Outputs never on a timer; autoplay off everywhere; the agenda static.
- K1's last result never stuck at `?` (a seventh press).
- A tall phone or laptop carries no label under it (controls-clear); the
  cards' groups end at least 20px above Next.
- Arrows: 9px heads in absolute units, the line's butt end at the head's base
  centre, a straight tail into the tip.
- Phones at 1 : 2.06 with the live clock; no `truncate`; every name whole.
- No `transform: scale` on a drawn device (CSS `zoom` instead); nothing
  translated off a clipped screen stays mounted.
- Prefixed React keys between sibling lists; refs measured in `useEffect`.
- Long error lines auto-fit in the output panel.
- The harnesses stop before the feedback slide (its frame never goes
  network-idle); the last two slides have no steps and are appended by hand.

## Verification, 2026-10-12 (built file `dist-single/python-session-30-working-with-dictionaries.html`, 3.17 MB)

- typecheck clean; reveal-step map measured: every card = spec `press_count - 1` (K1 6, its seventh press).
- `video-safe` CLEAN; `qa` flags only slide 1 (the Welcome baseline, NO LOGO).
- `align-check` 0 of 25; `mixed-align-check` 0 of 25.
- `controls-clear-check` CLEAR at every step of all 25 content slides; every group ends at least 20px above Next (`.gap.mjs`).
- `box-overflow-check`: none on content cards; slide 15 is the kit's section breaker clipping its decorative "02" (the same baseline as sessions 26 to 28).
- `overlap-check`: only slide 1's decorative sparkle (baseline).
- `spec-check`, `feedback-check` (exact copy of session 18's), `gesture-check`, `agenda-check`, `ligature-check`, `autoplay-check` (off on every slide): all pass.
- Every card was screenshotted at every press, and looked at.
- Not run: `nav-stress-check`, WebKit. The harnesses stop at slide 25 because the feedback frame never goes network-idle.

## Change, 2026-10-12: fixed box heights and autoplay

User's task: box height must not follow the content on slides 4, 9, 10, 12,
18 and 21; autoplay on slides 4, 7, 8, 9, 10, 14, 19 and 22. Applied as the
deck's `CLAUDE.md` items 15 and 16: explicit heights chosen for each card's
tallest press (4: 417, 9: 348, 10: 401, 12: bottom 202, 18: 371, 21: top 213
and bottom 194), the caption boxes at their tallest line count, and
`AUTOPLAY_ON_BY_DEFAULT` set to the eight slides with a restart on every
entry. Decision 11 (off on every slide) is superseded for those eight.
