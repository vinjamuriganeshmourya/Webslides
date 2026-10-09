<!-- cSpell:ignore NxtWave devPort Teja Kiran Chuttamalle Naatu Kissik Samajavaragamana Antava -->
# Python · Session 25: "List Methods"

**STATUS: SIGNED OFF 2026-10-08** (user: *"Create the Session 25 (List Methods)
slide deck … Follow the spec exactly … Use the Session 23 and Session 24 decks
you created as the implementation baseline"*). The request is a build order
from the spec, as sessions 19 to 24 were; the plan was written and the deck
generated in the same run. Nothing below blocks.

| | |
|---|---|
| `SESSION_NAME` | `List Methods` |
| `COURSE` | `Python` |
| Source | `Reference ppt's/25_list_methods_session_spec.json` (every program, output, press, step and round) and `25_list_methods_session_spec.html` (the same spec as a reading page, with 17 thumbnails of the original deck's kept slides 15 to 32). **21 beats, 27 cards** |
| Project | `Outputs/python/25_list_methods/` (scaffold copied from session 24) |
| Deck file | `src/decks/listMethodsDeck.tsx` |
| Slide count | **27**, one per card, in the spec's order |
| `devPort` | `5255` |
| `htmlName` | `python-session-25-list-methods` |

## The one idea

A list has its own tools, called with a dot on the list. append, extend,
insert, pop, remove, clear and sort change that same list. index and count
give back a number and leave the list alone.

## Decisions

Carried over from sessions 19 to 24 unless marked new.

1. **One slide per spec card, all 27, in the spec's order.** No dividers (the
   spec has none). Spine cards use the kit types and session 24's figures:
   `BrandSlide`, `RecapBrand`, `WelcomeSlide minimal`, static `AgendaSlide`,
   `ClassroomQuiz`, `FeedbackEmbedSlide`, `ThankYouSlide`. Every other card is
   a figure on `Panel` with `data-spec` and `data-presses` = `press_count`.
2. **The spec is read, never retyped**: `scripts/build-spec-data.mjs` writes
   `figures/spec.ts` from the JSON.
3. **Keys** (`figures/keys.ts`): arrows one press, F full screen, A all
   cards, End whole card, 1 to 4 a vote.
4. **Agenda static** (rule 44), five stops in the spec's words.
5. **Feedback slide is the standard one** (rule 41).
6. **Exact words, content rule 36**: final full stop dropped, two sentences
   split onto two lines; code, outputs and errors keep their punctuation.
7. **Every code panel says `Python`** (rule 31).
8. **One picture for lists (spec note 4), new**: `figures/cells.tsx`. A row of
   cells with its index under each; a cell is one element keyed by identity,
   so it slides when its place changes and its number changes with it; a
   removed item fades where it stands and the rest close the gap. No ghost,
   no strikethrough.
9. **One world (spec note 2), new**: Teja's music app party queue,
   `figures/Music.tsx`: dark screen, red accent, Up next tab, three-dot menu
   sheet with Play next and Add to queue. No product name or mark (rule 12).
10. **One layout for every concept card, new** (`figures/Methods.tsx`): the
    program over its output on the left (582px), the question, vote, cells
    and the method's shape on the right (540px). Code is 16px and output
    16px on every content card; the shape arrives last, after the run.
11. **No movable content.** Drag-to-move was built on 2026-10-08 and removed
    the same day on the user's word (archived at
    `Outputs/python/workflow/archive/movable-content/`).
12. **Autoplay**: the spec says none (rule 1). Following session 24's
    pattern, the switch opens ON only on the story cards: slides 4 (H1), 7
    (C1), 17 (H2) and 25 (K1). Everything with a vote, a task or a game opens
    off.
13. **The quiz** is session 21's `ClassroomQuiz`.

## Slides, controls and presses

| # | Card | Title | Presses | Figure |
|---|---|---|---|---|
| 1 | S-WELCOME | Welcome | 0 | `BrandSlide` |
| 2 | S-RECAP-CARD | Where We Left Off | 0 | `RecapBrand`, session 24's three ideas |
| 3 | S-RECAP | Which line is to blame? | 3 | `RecapBug` |
| 4 | H1 | Who controls the music? | 6 | `PartyHook` |
| 5 | S-TITLE | List Methods | 0 | `WelcomeSlide minimal` |
| 6 | S-AGENDA | Agenda | 0 (static) | `AgendaSlide` |
| 7 | C1 | List methods | 2 | `ListTools` |
| 8 | C2 | Adding items to list | 4 | `AppendCard` |
| 9 | C3 | Adding items to list | 3 | `ExtendCard` |
| 10 | C4 | Insert | 5 | `InsertCard` |
| 11 | T1 | The party queue | 6 | `Task1` |
| 12 | G1 | What does the queue look like? | 25 | `DjDesk` |
| 13 | C5 | Pop | 3 | `PopCard` |
| 14 | E1 | Remove | 9 | `RemoveCard` |
| 15 | C6 | Clear | 3 | `ClearCard` |
| 16 | S-QUIZ | Classroom Quiz | 0 | `ClassroomQuiz` |
| 17 | H2 | Teja's listening history | 4 | `HistoryHook` |
| 18 | C7 | Finding index | 3 | `IndexCard` |
| 19 | C8 | Count | 5 | `CountCard` |
| 20 | C9 | Sort | 3 | `SortCard` |
| 21 | C10 | Sort and sorted | 4 | `SortOrSortedCard` |
| 22 | G2 | Does Ram see it? | 21 | `RamSees` |
| 23 | T2 | Nth term in the Fibonacci series | 13 | `Task2` |
| 24 | X1 | Teja fixes the queue | 2 | `ExitQueue` |
| 25 | K1 | Today, in six examples | 6 | `Takeaways` |
| 26 | S-FEEDBACK | Feedback | 0 | `FeedbackEmbedSlide` |
| 27 | S-THANKYOU | Thank you | 0 | `ThankYouSlide` |

The agenda's spec presses (5) are not built: content rule 44 makes every
agenda static (as sessions 20 to 24). K1 has six presses: press n opens
example n and fills example n − 1's result; the last result fills on a tap
of its box or End.

## Frameworks (gate check 1)

| Concept | Framework | Need (opening) | Proof (closing) |
|---|---|---|---|
| Adding items (append, extend, insert) | SCQA | H1: the queue needs "at the end" and "at a place" | T1 and G1 predict, run |
| Taking items out (pop, remove, clear) | Merrill | H1's "take one out", "empty it" | E1's watched remove, G2 rounds 3, 4 |
| Asking the list (index, count) | SCQA | H2: five lines to count one song | C8's missing value, X1 |
| sort vs sorted | 4MAT | S-RECAP's bug from session 24 | C10's None, G2 rounds 1, 2 |

## Term ledger (gate check 2)

| Term | First on screen | Before it |
|---|---|---|
| list, index | known (sessions 19 to 21) | |
| method, dot | C1 (string methods from session 15) | H1 says "menu of jobs", no code word |
| append, extend, insert | C2, C3, C4 | |
| pop, remove, clear | C5, E1, C6 | |
| ValueError | E1 press 9 | |
| index(), count() | C7, C8 | H2 shows count only as the collapse |
| sort(), None | C9, C10 | sorted known from session 24 |

No artefact is shown assembled on first appearance (gate check 3): each
program is the spec's own short one, each list fills cell by cell.

## Outputs, all real runs (CPython 3.12.3, 2026-10-08)

41 programs and game rounds from the spec run and match, including both
ValueErrors, the IndexError and T2's runs for 7, 3, 9 and 5. X1's four
options were worked by hand from `after_line_2` and agree with the data.

## Verification

See the session's `CLAUDE.md`.
