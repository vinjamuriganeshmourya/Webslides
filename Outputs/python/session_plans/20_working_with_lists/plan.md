<!-- cSpell:ignore NxtWave devPort Chuttamalle Hukum Kaavaalaa Kesariya Naatu Illuminati Kiran -->
# Python · Session 20: "Working with Lists"

**STATUS: SIGNED OFF 2026-10-06** (user: *"Session 19 was already generated
from its JSON and HTML content. Generate Session 20 the same way, using the
same approach, template and current rules … and i need all the interactions
it intended make it happen"*). Session 19's plan was signed off on its
defaults and generated in the same run; this plan carries the same defaults,
plus the three changes listed first under Decisions, and the deck was
generated from it in the same run.

| | |
|---|---|
| `SESSION_NAME` | `Working with Lists` |
| `COURSE` | `Python` |
| Source | `Reference ppt's/20_working_with_lists_session_spec.json` (every program, output, press, trace and game round) and `20_working_with_lists_session_spec.html` (the same spec as a reading page, with 58 thumbnails of the original deck's slides 7 to 75). A spec from the pedagogy team, not a finished deck: **20 beats, 28 cards, 75 minutes** |
| Project | `Outputs/python/20_working_with_lists/` |
| Deck file | `src/decks/workingListsDeck.tsx` |
| Slide count | **28**, one per card, in the spec's order |
| `devPort` | `5249` |
| `htmlName` | `python-session-20-working-with-lists` |

## The one idea

A name points at a list. `list_b = list_a` gives the same list a second name,
so a change made through one name shows through both. `=` with a new value
moves only that one name.

## Decisions

**New for this session (the brief's "all the interactions it intended"):**

1. **The spec's keys work** (build contract 3). The deck opens with the
   right arrow (or a clicker's PageDown) as **one press** and the left arrow
   as one press back: the kit's own `steps` arrow mode, chosen by default
   through the URL on first open (`figures/keys.ts`), never written to the
   browser's storage, so no other deck is affected; `S` still swaps it and
   `Ctrl` + arrow still jumps a whole card. **F** is full screen (the
   player's own button), **A** shows all the cards (the player's own slide
   picker), **End** shows the whole card at once (every panel's
   `StepControls`). Nothing under `src/deck/` changes.
2. **The agenda is static**, exactly as session 19's (content rule 44,
   user's word on review): the spec's "one stop lights per press" is not
   carried; no selected point, no Next / Replay. A first build lit one stop
   per press and was removed.
3. **The feedback slide is the standard one** (content rule 41):
   `FeedbackEmbedSlide`, QR code, link and the framed Google Form. It is the
   one thing in the file that needs the network, which build contract 1
   ("makes no network request") does not foresee; rule 41 wins and the QR and
   link reach the form when the frame cannot load.

**Carried from session 19:**

4. **One slide per spec card, all 28, in the spec's order.** Spine cards are
   kit slide types (`BrandSlide`, `RecapBrand`, `WelcomeSlide minimal`,
   `AgendaSlide`, `SectionBreakerSlide`, `QuizTimeSlide`,
   `FeedbackEmbedSlide`, `ThankYouSlide`); every other card is a session
   figure on `Panel` whose presses are the kit's build steps, with session
   18's `Next` / `Replay`. Each content slide's body carries `data-spec` and
   `data-presses` with the spec's press count.
5. **Exact words, with content rule 36**: the spec's words kept, the
   trailing full stop dropped, a two-sentence line split onto two lines. Code,
   outputs and error text keep their own punctuation.
6. **Every code panel says `Python`** (content rule 31); the spec's file names
   (`change.py`, `move.py`, …) are not shown, which also keeps spec rule 4.
7. **Template colours only** (content rule 37). The Spotify phones keep the
   app's own dark shell and green inside the drawn screen, with the comment
   that says so; the mark is the library's `companies/spotify.png`.
8. **One picture for the whole session** (spec note): a name is a tag with an
   arrow, a list is a row of boxes, and two names on one list are two arrows
   into ONE row. One engine draws it on every card from C5 on
   (`figures/memory.tsx`): tags, rows, item objects (cubes and strings with
   their id labels), slot arrows, greyed objects. Every move is derived from
   the spec's `data.steps` (`points`, `lists`), never retyped.
9. **Votes are clickable and keys 1 to 4 mark them; `Next` is never gated**
   (session 16's decision 5, G1's must line). Confetti fires when the
   room's marked pick was right. Timers are the kit's `Countdown`, started by
   the instructor: 3:00 (T1), 4:00 (T2, T3), 2:30 (X1). Nothing
   self-advances; movement inside one press (E1's line 3) is allowed by the
   spec.
10. **Ids are the original deck's example numbers**, always labelled
    `example · your number will be different` (spec note: an id is never
    typed as an answer).
11. **Takeaways are the spec's six examples** (K1, "examples, not a concept
    map"), as session 19 kept them, not the agenda strings content rule 20
    asks for. Flagged below.
12. **The recap card carries three points** from session 19's content (the
    kit's recap slide needs points; the spine card has none).
13. **Every output is a real run** on CPython 3.12.3, table below.
14. **Git is not touched**: the shared checkout carries another session's
    staged work on the current branch; this folder and its plan folder stay
    untracked until the user says.

## Controls, from the spec

| Slide | Card | Control | Presses |
|---|---|---|---|
| 3 | S-RECAP | `Next` / `Replay`, lines 1 to 4 clickable | 3: the bug, the culprit, the fix |
| 4 | H1 | `Next` / `Replay` | 5: your phone, two ways, Kiran removes, the result, the turn |
| 7 | T1 | `Next` / `Replay`, timer 3:00 | 3 |
| 9 | C2 | `Next` / `Replay` | 3 |
| 10 | C3 | `Next` / `Replay` | 3 |
| 11 | C4 | `Next` / `Replay` | 2 |
| 12 | C5 | `Next` / `Replay` | 3 |
| 13 | C6 | `Next` / `Replay`, Same / Different clickable | 5 |
| 14 | C7 | `Next` / `Replay` | 4 |
| 15 | C8 | `Next` / `Replay`, Same / Different clickable | 3 |
| 16 | C9 | `Next` / `Replay` | 3 |
| 17 | T2 | `Next` / `Replay`, timer 4:00 | 11: the task, five lines of A, five of B |
| 18 | G1 | `Next` / `Replay`, A / B / C clickable or keys 1 to 3 | 13: three rounds of question, steps, verdict |
| 20 | C10 | `Next` / `Replay`, A / B | 7 |
| 21 | E1 | `Next` / `Replay`, A / B per run | 13: run 1 asked and walked, run 2 asked and walked, both ends |
| 22 | T3 | `Next` / `Replay`, timer 4:00 | 8: the task, seven lines |
| 23 | C11 | `Next` / `Replay`, A / B | 6 |
| 24 | C12 | `Next` / `Replay`, A / B | 7 |
| 25 | X1 | `Next` / `Replay`, timer 2:30, A to D | 2 |
| 26 | K1 | `Next` / `Replay` | 6, one example per press |

## Frameworks (gate check 1)

One chain, four agenda stops. The hook feels both ways before a line of code;
each stop opens on a question the room answers and closes on a real run.

| Agenda stop | Framework | S / Why | T / What | A | R / close |
|---|---|---|---|---|---|
| 1 Change a list | **STAR** | slide 3 (a recap bug: += added the items one by one) and slide 4 (share or copy: does Kiran's change reach your phone?) | slide 7 press 2 (`list_a[3] = 4` changes one box in place) | slide 7 press 3 (the same move on a string) | slide 7's TypeError, Python's own text |
| 2 Objects and id | **STAR** | slide 9 (what do three values have in common?) and slide 10 (where do you keep it?) | slides 9, 10 (every value is an object with an id) | slides 11, 12 (`id()`, a name points at an object) | slide 13 (two ids differ: + made a new object) |
| 3 Two names, one list | **STAR** | slide 15 (same values, same list?) and slide 16 (I want list_b to be this same list: what do I write?) | slide 14 (a list is an object; the short picture), slide 16 (`list_b = list_a`) | slide 17 (task 2), slide 18 (freeze frame) | slide 17's two runs, slide 18's verdicts, the quiz |
| 4 Change or move? | **STAR** | slide 20 (what does list b print?) and slide 21 (say what list b prints before the press) | slide 20 (= moves one name), slide 21 (+ builds, += grows) | slide 22 (task 3), slides 23, 24 (a list inside a list, a number inside a list) | slide 25 exit, slide 26 the six examples |

## Term ledger (gate check 2)

| Term | Introduced | Plain words given there |
|---|---|---|
| two names, one set of songs | 4, press 5 | two tags with arrows into one row (not yet named) |
| `list_a[i] = value` | 7, press 2 | puts 4 at position 3 |
| `TypeError: 'str' object does not support item assignment` | 7, press 3 | a list can change, a string cannot |
| object | 9 | each stored value is an object |
| id | 10 | its id is its number, it can change on every run |
| `id()` | 11 | id() gives the id |
| a name points at an object | 12 | first the object, then the name points at it |
| no name left, greyed | 13, press 4 | nothing points at the old ones now |
| the short picture: tag, arrow, row | 14, press 4 | we draw it like this |
| `list_b = list_a` | 16, press 2 | no brackets on the right, so no new list |
| `str()` in a print | carried in (sessions 3, 4) | used from slide 17 |
| `+`, `+=` on lists | carried in (session 19) | re-read on 3, 21 |
| a list inside a list | carried in (session 19); slot drawn as an arrow on 23 | holds list_a's own list, not a copy |

Nothing arrives assembled (gate check 3): every program is walked one line
per press, the list object is built from cubes, then slots, then the tag
(slide 14), and E1's line 3 shows the temporary row first.

## Outputs, all real runs (CPython 3.12.3, 2026-10-06)

| Program | Output |
|---|---|
| recap `animals += wild_animals` · `+= [wild_animals]` | `['cat', 'dog', 'Tiger', 'Fox']` · `['cat', 'dog', ['Tiger', 'Fox']]` |
| T1 change · word | `[1, 2, 3, 5]` `[1, 2, 3, 4]` · `Hello` then `TypeError: 'str' object does not support item assignment` |
| C4, C5, C7 `id(...)` | one long number, different each run (seen: 132275315563600) |
| C6 `id(a)` before and after `a = a + " World"` | two different numbers |
| C8 two `[1, 2, 3]` · C9 `list_b = list_a` | two different numbers · the same number twice |
| T2 program A · B | `list a : [1, 2, 3, 5]` `list b : [1, 2, 3, 4]` · `list a : [1, 2, 3, 4]` `list b : [1, 2, 3, 4]` |
| G1 `road_trip.py` | `['Kaavaalaa', 'Hukum', 'Naatu Naatu']` `Chuttamalle` |
| C10 `move.py` | `list a : [6, 7]` `list b : [1, 2]` |
| E1 run 1 · run 2 | `list a : [1, 2, 6, 7]` `list b : [1, 2]` · `list a : [1, 2, 6, 7]` `list b : [1, 2, 6, 7]` |
| T3 `road_trip.py` | `['Chuttamalle', 'Hukum', 'Kesariya', 'Kaavaalaa']` `['Illuminati', 'Hukum', 'Kesariya']` |
| C11 · C12 | `[1, 4]` `[3, [1, 4]]` · `[1, 2]` `[1, 2]` |
| X1 with line 3 = `kiran += []`, `kiran[0] = "Hukum"`, `kiran = kiran + []`, `mine = mine` | `['Hukum', 'Kesariya', 'Naatu Naatu']`, the same, `['Hukum', 'Kesariya']`, `['Hukum', 'Kesariya', 'Naatu Naatu']` |
| K1, six examples | `True`, `[9, 2]`, `[1, 2]`, `[1, 2]`, `[1, 2, 6]`, `[3, [1, 4]]` |

## Slide by slide

`P` = a session figure on `Panel`. Copy is the spec's, rule 36 applied. The
kicker is the agenda stop; the title is the spec's heading.

1. **Welcome** · `BrandSlide` (S-WELCOME)
2. **Recap · Where We Left Off** · `RecapBrand`, three points from lists (S-RECAP-CARD)
3. **Recap · Which line is to blame?** · P `RecapBug`: the story line, the
   program with line numbers, `It prints:` beside `We wanted:` from press 1,
   the question; press 2 lights line 3 and the why line; press 3 slides the
   fix in and the output changes (S-RECAP)
4. **Programming Foundations · Kiran wants your Road Trip songs** · P
   `ShareHook`: your phone with the Spotify Road Trip screen (four songs);
   Way A and Way B as Spotify menu items over two phone pairs; Kiran swipes
   song 3 and taps Remove on both; Way A's row slides out of your phone too;
   the phones fade back into two tags and one row (A) and two tags and two
   rows (B). No code, no topic name (H1)
5. **Today** · `WelcomeSlide minimal`, `Working with Lists` (S-TITLE)
6. **Agenda** · `AgendaSlide`: `Change a list` / `one
   item at a time` · `Objects and id` / `every value has one` · `Two names,
   one list` / `change it, both see it` · `Change or move?` / `=, + and +=`,
   one stop lit per press (S-AGENDA)
7. **Change a list · Change one item** · P `Task1`: steps, 3:00, the program,
   four boxes with positions; position 3 changes 5 to 4 in place; then the
   word program, the H box shakes and stays H, `Hello` then the TypeError (T1)
8. **Objects** · `SectionBreakerSlide` (C1)
9. **Objects and id · Every value is an object** · P `ObjectCast`: Anu and
   the computer, three values, each boxed in memory, the banner (C2)
10. **Objects and id · Each object gets an id** · P `ObjectCast`, ids: the
    question, the id label (example), a second run with a new id (C3)
11. **Objects and id · id() gives the id** · P `IdTwice`: the program, the
    question, two example outputs, one per run (C4)
12. **Objects and id · A name points at an object** · P `NamePoints`: the
    object first, then the tag `a` and its arrow, then line 2's output equal
    to the label (C5)
13. **Objects and id · Same id, or a new one?** · P `NewObject`: the vote,
    `" World"`, `"Hello World"`, a's arrow moves and the two old objects grey
    and stay grey, the second id (C6)
14. **Two names, one list · A list is an object too** · P `ListObject`: three
    cubes, the list object's slots with arrows to them, the tag, the shrink
    to the short form (C7)
15. **Two names, one list · Same values. Same list?** · P `TwoLists`: vote,
    two tags and two rows, two different ids (C8)
16. **Two names, one list · A second name** · P `SecondName`: the question,
    `list_b = list_a` arrives biggest on the card with list_b's arrow into
    the same row, the equal ids (C9)
17. **Two names, one list · Predict, then run** · P `Task2`: A and B side by
    side, line 2 marked in both, steps and 4:00; five lines of A, then five
    of B, each with its own picture and output (T2)
18. **Two names, one list · Freeze frame** · P `FreezeFrame`: the program
    with the pause marker on the round's line, the question and three
    options; one line per press; the asked variable's tag is hidden while
    the question is open; the verdict names the answer and a why line for
    each wrong option; each round carries on from where the last froze (G1)
19. **Quiz Time!** · `QuizTimeSlide` (S-QUIZ)
20. **Change or move? · Change the list, or move the name?** · P `MoveName`:
    vote A / B, five lines, list_b's arrow never moves, the closing line (C10)
21. **Change or move? · Follow the arrows** · P `PlusWalk`: Run 1 with
    line 3 biggest, the vote, five lines (line 3: the temporary row, the new
    joined row, list_a moves, the temporary row greys); Run 2 the same with
    the boxes sliding into the shared row; both end pictures side by side
    (E1)
22. **Change or move? · One list or two?** · P `Task3`: the story, the
    program, steps, 4:00, and a one-list-or-two column for lines 2 to 5;
    then seven lines, the picture, the column filling and both prints (T3)
23. **Change or move? · A list inside a list** · P `NestedRef`: vote, five
    lines; list_b's second slot is an arrow to list_a's own row (C11)
24. **Change or move? · A number inside a list** · P `NumberRef`: vote,
    cube 2 with a's arrow and the list's slot arrow, cube 3 and only a's
    arrow moves, the closing line (C12)
25. **Exit · Keep Kiran's songs** · P `ExitKeep`: the story, the program
    with line 3 as a gap, the question, four options, 2:30; the right one
    marks and every option shows what `print(kiran)` gives and why (X1)
26. **Key takeaways · Today, in six examples** · P `Takeaways`: six slots
    from press 1, one filled per press with heading, code, a small picture,
    result and sentence (K1)
27. **Feedback** · `FeedbackEmbedSlide` (S-FEEDBACK)
28. **Thank you** · `ThankYouSlide` (S-THANKYOU)

## Flags for the reviewer

- Content rule 18 asks for a quiz frame immediately before the takeaways;
  the spec places the classroom quiz at minute 42 only, and the deck follows
  the spec, as session 19 did.
- Content rule 20 (takeaways restate the agenda) is overridden by the spec's
  example board, decision 11.
- Build contract 1 (no network request) is broken by the feedback frame
  only, decision 3.
- Spec defect 4 (equal short strings share an id) is kept off every card:
  no card uses two equal string literals.

## Verification, 2026-10-06 (dev server port 5249, built file from `file://`)

| Check | Result |
|---|---|
| all 25 spec programs and the exit's four variants on CPython 3.12.3 | every output matches the spec |
| `npm run typecheck`, `npm run build:html` | clean; `dist-single/python-session-20-working-with-lists.html`, 3.9 MB, self-contained |
| `video-safe.mjs` (slides 1 to 27) | CLEAN |
| `qa.mjs` (slides 1 to 27) | baseline only: slide 1 (`NO LOGO`). Type-floor warnings are the drawn Spotify phones (4), code panels and the takeaways' mini code (11 to 15px), as session 19 accepted |
| `align-check.mjs`, `mixed-align-check.mjs` (1 to 27) | 0 of 27 |
| slide 28, Thank you | kit `ThankYouSlide`, looked at; the harnesses cannot reach it because the feedback frame on 27 never goes network-idle |
| `gesture-check.mjs`, `agenda-check.mjs`, `ligature-check.mjs` | all passed |
| `spec-check.mjs` | first open is one press per arrow, ← one back, the address restores; End lands on G1's last press; key 2 marks option B; A opens the picker; all 22 cards with presses carry the spec's `data-presses`; only network host `docs.google.com` (the feedback frame); 0 page errors |
| reveal-step map | every card's steps = its press count minus 1 |
| every card | screenshots looked at, at press 1, mid-walk and fully revealed; fixed on the way: C12's arrow through cube 2, T1's clipped TypeError, the hook's caption over Next, E1's big line into the question, X1's wrapped prints, cramped tags on T2 and G1, C6's id label on the caption |

## Review, 2026-10-06 (user)

| Item | Change | Slides |
|---|---|---|
| Agenda highlight box | removed the band behind the lit stop; the badge light stays; text, spacing and arc unchanged | 6 |
| Arrow heads too big | `figures/memory.tsx` marker in absolute units, 9px (was about 19px, stroke-scaled); tip position unchanged | every slide with an arrow: 4, 7, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 26 |
| Line not centred on its head | every connector ends in a straight 12px run along the head's axis (`M · C · L`) | same slides; the visible offset was on 22, and on the other converging pairs (16, 17, 18, 20, 21, 26) |
| Rules | content rules 44, 45, 46, RULES.md rows, python-course feedback log | |

Re-verified: video-safe CLEAN, qa baseline only, align-check and mixed-align-check 0 of 27, agenda, gesture, spec and feedback checks pass. `overlap-check.mjs` (new since the build) reports three 2 to 4px overlaps on slide 4's last press between the tags' arrows and the 8%-opacity phones faded behind them; left unchanged pending the user's word.

## Review 2, 2026-10-06 (user)

Slide 6: the step-through, the lit badge and the Next / Replay are removed;
the slide is the plain `AgendaSlide`, as session 19's. Content rule 44 is
rewritten to say so. Slide 6 was the only agenda in the deck.

## Review 3, 2026-10-06 (user): "slide" mode

*"When I switch to slide mode … sometimes it just shows black screen and
sometimes it overlaps the content"*, for sessions 19 and 20, on any screen and
browser. Cause, in the player: the cut's empty exit never finished and a
shared-layout element inside a slide held its exit open, so departed slides
stayed mounted and stacked. Fixed in both sessions' `src/motion/presets.ts`
and `src/deck/Deck.tsx`. `nav-stress-check.mjs` (slide mode both ways and
hammered, step mode across slides, Ctrl jumps, Replay, the picker, the
mode toggle): clean in Chromium, Firefox and WebKit at 390x844, 1366x768,
1920x1080 and 3840x2160, for both decks; the unfixed 19 build failed it
everywhere. Gesture, phone bar, auto-hide, agenda, feedback, spec,
video-safe and qa all re-run clean.
