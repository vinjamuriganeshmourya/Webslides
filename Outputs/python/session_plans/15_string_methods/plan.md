<!-- cSpell:ignore NxtWave devPort isdigit startswith endswith onthegomodel Sanjay Anjali apologised -->
# Python · Session 15: "String Methods"

**STATUS: GENERATED WITHOUT SIGN-OFF 2026-09-30.** 31 slides, all harnesses at
baseline (video-safe CLEAN, qa flags slides 1 and 31 only, align-check 0 of 31). The user chose to skip the
plan review and generate straight away ("Skip review, generate now"). This file
is the record of what the deck is, so the plan and the deck stay findable from
each other.

| | |
|---|---|
| `SESSION_NAME` | `String Methods` |
| `COURSE` | `Python` |
| Source | `prog_foundations_LP/15 - String Methods/15_string_methods_student_view_new_design.html` (31 frames in presenter view) and `15_string_methods_student_handout.html` (the worksheet) |
| Project | `Outputs/python/15_string_methods/` |
| Deck file | `src/decks/stringMethodsDeck.tsx` |
| Slide count | **31**, one per reference frame, in the reference's order |
| `devPort` | `5244` |
| `htmlName` | `python-session-15-string-methods` |

## Decisions confirmed with the user (2026-09-30)

1. **Every reference frame is a slide, nothing is dropped.** That includes the
   six portal frames the reference redraws inside its cards (portal slides 13,
   15, 30, 35, 36, 38). Session 14 left those on the portal; this deck does not.
2. **Every code panel says `Python`** (content rule 31, playground course). The
   reference's invented file names (`check_pin.py`, `slices.py`, `contact.py`,
   `notes.py`, `link.py`, `email.py`, `name.py`, `mobile.py`, `strip.py`) are
   not carried. `notes.txt` on the replace scenario IS kept: it is a document,
   not code, and the file is what the scenario is about.
3. **The reference's on-slide controls stay.** Its plain `Next` beats are the
   kit's build steps (the arrow key and the on-slide Next press the same step).
   Its interactive panels keep their own buttons as local state: the slice
   machine (pick A to D, `Run it` locked until a pick, `Next level`), the strip
   walker (`strip()` / `strip("-")` / `strip("-i")` / `strip("-iR")`, `Play`,
   `One step`, `Reset`), and the exit question's `Reveal answer`. The recap's
   `Drop it` is the build step, labelled `Drop it`.
4. **Git is not touched.**

## Copy

The reference's own sentences are the copy (course rule R2), captured from the
rendered page at every press, not retyped. Instructor prompts that the
reference prints on the frame (`Take two answers, then press.`) stay on the
frame, in the same place, because the reference shows them to the room.

## Outputs

Every snippet was run on CPython 3.12.3 before the deck was written. All of the
reference's stated outputs agree: `message[3:7]` is `Ravi`, `"-R-a-v-i-"[1:8:2]`
is `Ravi`, `code[0:8:2]` `abcd`, `[1:8:2]` `1234`, `[1:6:3]` `1c`, `[2:8:3]`
`b3`, `[6:2:2]` and `[1:8:-2]` empty, the ten-comparison loop prints `False`,
`"  0912  "` traces to `92`, the exit question's only silent input is
`-4-748-` (strips to `4-748`).

## Slide by slide

`C` = `ContentSlide`, `P` = a panel on `SlideBase` + `ZonedFrame`.

| # | Reference frame | Type | Beats |
|---|---|---|---|
| 1 | Welcome | `BrandSlide` greeting `Welcome` | |
| 2 | Recap · Where We Left Off | `RecapSlide`, three points with subs | |
| 3 | Recap · What range(2, 6) hands you | P `SortDrop`: 2, 1, 5, 6, 4 into In the sequence / Not in it, each with its reason | 5, `Drop it` |
| 4 | Before we start · Why can it not find it? | P `ChatHook`: the phone (today, search `sorry`, Tuesday) beside the story lines, then the nine boxes of `S O R R Y`, one box further, then two | 6 |
| 5 | Welcome to today's session · String Methods | `WelcomeSlide` minimal | |
| 6 | Agenda · What We Will Cover | `AgendaSlide`, String Slicing / String Methods / Where It Stops | |
| 7 | Obtain part of a string · One number, then two | P `SliceWalk` on `"Hi Ravi"`: the boxes, `message[0]`, `message[3:7]`, box 7 never reached | 5 |
| 8 | String Slicing · Accessing Parts of a String (portal 13) | C, `secret_message` boxes, R a v i marked | |
| 9 | Strings · Extended Slicing (portal 15) | C, `variable[start_index:end_index:step]`, the +2 jumps, three part cards | |
| 10 | Strings · A slice with a step | P `SliceWalk` on `"-R-a-v-i-"[1:8:2]`, one landing per press | 6 |
| 11 | Predict, then run · The slice machine | P `SliceMachine`, five levels, Run locked until a pick | local |
| 12 | Worksheet task 2 · Type it, then change the step | P `TaskCard`: code, the boxes, three steps, a 4:00 timer | |
| 13 | Quiz time · Classroom Quiz | `QuizTimeSlide` with the three steps | |
| 14 | String methods · How does an app know a PIN is all digits? | P `PinStory`: the phone keypad, then the two checks, 47a8, the nine-line loop, the counts, the two-line answer and the definition | 5 |
| 15 | String methods · isdigit | P `MethodCard` | 4 |
| 16 | String Methods · Strip (portal 30) | C, `mobile_1 == mobile_2` prints False | |
| 17 | String methods · strip | P `MethodCard` | 3 |
| 18 | One character at a time · Where does strip stop? | P `StripWalker`, four sets, steps computed from the set | local |
| 19 | String Methods · Strip (portal 35) | C, `M.Ravi.`, the dot that stays and the dot removed | |
| 20 | String Methods · Strip (portal 36) | C, `" ,."` as three characters | |
| 21 | Worksheet task 3 · Trace it before you run it | P `TraceTask`: instructions and 4:00 timer, then one beat per line | 7 |
| 22 | Scenario · String Methods (portal 38) | C, `notes.txt` with `teh` twice, teh to the | |
| 23 | String methods · replace | P `MethodCard` | 3 |
| 24 | String methods · startswith | P `MethodCard` | 3 |
| 25 | Worksheet task 4 · You write this one | P, `startswith` beside a blank for the three lines, 2:00 timer, then the `endswith` answer | 2 |
| 26 | String methods · upper and lower | P `MethodCard` | 4 |
| 27 | Exit question · Which one prints nothing? | P, the program, four inputs, 2:30 timer, `Reveal answer` | local |
| 28 | Key takeaways · Slicing, in four lines | P, the `code` boxes and four rows, then the two rules | 5 |
| 29 | Key takeaways · The five methods, and what each one hands back | P, five method cards, then the count card | 6 |
| 30 | Feedback | `FeedbackSlide` | |
| 31 | Thank you | `ThankYouSlide` | |

## Not added

Session 14 added section dividers and a next-session frame of its own. The user
asked for the reference, every frame and nothing missed, so none are added
here. If they are wanted, they are three `SectionBreakerSlide`s and one
breaker for session 16 (`Nested Loops`), and the agenda strings are already
constants in the deck file.

## Generation record, 2026-09-30

Done as written above, with three changes to the reference's words, each for a
hard rule and each commented in the deck file:

1. Slide 28: "range did this last session. A slice does it today." became
   "range stops before its end number. A slice does too." (content rule 2b).
2. Slide 29: "The five methods, and what each one hands back" became "Five
   methods, and what each hands back", because the original wraps (rule 35).
3. Slide 26, last beat: the output panel shows `RAVI` and `ravi`, because the
   program prints both lines. The reference showed `ravi` alone (course rule R3).
