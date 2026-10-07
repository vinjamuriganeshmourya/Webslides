<!-- cSpell:ignore NxtWave devPort Anu Nandu Zoya Arun Ravi snake_case isidentifier -->
# Python · Session 18: "Comparing Strings & Naming Variables"

**STATUS: AWAITING SIGN-OFF.** Written 2026-10-05 from the pedagogy team's
reference deck. The deck was generated from this plan in the same run, at the
user's instruction to deliver the converted deck; decisions 1 to 10 below are
what it was built to. A re-cut after sign-off costs step counts and the
figures that carry them, as `generate-slides` section 0 says.

| | |
|---|---|
| `SESSION_NAME` | `Comparing Strings & Naming Variables` |
| `COURSE` | `Python` |
| Source | `Reference ppt's/18_comparing_strings_naming_variables_student_view_new_design.html`: 27 `.pcard` frames plus one `.slide` divider the presenter walks as frame 18, so **28 presenter frames, 121 presenter states** |
| Project | `Outputs/python/18_comparing_strings_naming_variables/` |
| Deck file | `src/decks/comparingStringsDeck.tsx` |
| Slide count | **28**, one per reference frame, in the reference's order |
| `devPort` | `5247` (5246 is session 17, being built in parallel) |
| `htmlName` | `python-session-18-comparing-strings-naming-variables` |

## Decisions to confirm

1. **Every reference frame is a slide, nothing dropped, nothing added**, as
   sessions 15 and 16. That includes the one divider the reference carries
   (`02 · Naming Variables`, a `.slide` between the Instagram hook and the
   four rules), drawn as the kit's `SectionBreakerSlide`.
2. **Every code panel says `Python`** (content rule 31). The reference's
   invented file names (`recap.py`, `unicode.py`, `char1.py`, `char2.py`,
   `letters.py`, `task1_1.py` to `task1_3.py`, `compare.py`, `level1.py` to
   `level6.py`, `names.py`, `playground`, `bill.py`, `halls.py`) are not
   carried.
3. **Content rule 36 on every rendered line**: no line of slide copy ends in
   a full stop; a caption that held two sentences is two lines in one box.
   Not a word changes. Code, output, error text and the drawn product screens
   (the login screen, the sign-up form) are quoted, so they keep their own
   punctuation.
4. **Only template colours.** Every figure, tile, bubble, card header and
   gradient bar takes its colour from `src/design/tokens.ts`. The reference's
   palette (its `#006DAF` blue, `#3FB5E5` cyan, `#F0A04B` amber, the purple
   and red takeaway headers) is not copied. The recap header takes the brand
   tone through the session-local `RecapBrand` (session 16's override), so no
   green bars sit beside the kicker. **The two exceptions, to confirm:** Anu's
   skin and hair, and the laptop and phone chrome (near-black bezels, a
   blue login wallpaper), which are the drawn object's own colours the way
   session 15's chat palette was.
5. **The reference's controls stay, press for press.** Plain `Next` beats are
   the kit's build steps; slide 14's button is the same step labelled
   `One step`. **Slide 14's slider** (pick the second word: BAT, CAT, BAC, BA,
   bad) is a real range input, local state, and moving it restarts the walk
   at beat 1, as the reference does. **Timers** on slides 12, 23 and 24
   (5:00, 4:00, 2:30) are `Countdown`: nothing starts until the instructor
   presses play.
6. **Votes are clickable, and `Next` is not gated** (session 16's decision 5).
   On the reference the `True` / `False` chips (slide 15), the A to D names
   (slide 22) and the four `name = …` options (slide 24) are static text and
   the room votes by hand. Here they are clickable so the pick is locked in
   and the confetti has something to fire on; the instructor's flow is the
   reference's: hands up, press, run.
7. **Motion is session 15's register and no more**: `Press` on every button,
   `Glow` on a panel when a value lands, slide-wide `Confetti` when the room's
   pick is right (slides 15, 22, 24), `BeatFade` on captions. Nothing
   self-advances (course rule R5c item 4).
8. **The laptop stays a laptop.** The password hook draws a laptop (a screen
   on a hinge with a physical keyboard), not a tablet. The phone mockup is not
   enough for it: the story is `Caps Lock`, a key a phone keyboard does not
   have, and the first caption says *laptop password*. The Instagram hook is
   a phone, drawn with session 16's `Phone`.
9. **Instagram is named in the copy, never drawn as a mark.** The reference's
   sentences name it (*You sign up for Instagram*), and course rule R2 keeps
   them. The phone screen carries no logo and no wordmark (course rule R5:
   never approximate a trademark by hand; content rule 12's library has no
   Instagram asset). Flagged, not hidden.
10. **Key takeaways keep the reference's six example cards** (course rule R2),
    not a restatement of the two agenda items (content rule 20), as sessions
    15 and 16 did. Flagged, not hidden.
11. **Git is not touched** (sessions 15 and 16): the working tree is shared
    with another session; the folder stays untracked until the user says.

## Controls, measured on the reference

| Frame | Control | Behaviour |
|---|---|---|
| 3 | `Next` / `Replay` | 7 beats: the program, then guess and output for break, continue, pass |
| 4 | `Next` / `Replay` | 5 beats, labelled `your password · incorrect · show the password · side by side · the numbers` |
| 7, 8, 9, 10, 11 | `Next` / `Replay` | 5, 5, 4, 4, 5 beats; Anu asks, the Computer answers |
| 12 | `Next` / `Replay`, timer 5:00 | 4 beats: the task, then one program's output per press |
| 13 | `Next` / `Replay` | 3 beats: the question, numbers, one pair at a time |
| 14 | `One step` / `Replay`, **slider** | 4 beats: predict, pair 1, pair 2, pair 3; the slider picks the second word and restarts |
| 15 | `Next` / `Replay`; True / False static | 16 beats: vote, then one pair per press, six levels |
| 17 | `Next` / `Replay` | 5 beats, three phone screens, then two code strips, then the third |
| 18 | `Next` / `Replay` | 8 beats: a rule, then its four names marked, four times |
| 19 | `Next` / `Replay` | 3 beats: the 35 locked words, the ones you know, help("keywords") |
| 20 | `Next` / `Replay` | 9 beats: all eight names, then one lands per press |
| 21 | `Next` / `Replay` | 4 beats: Total Bill refused, camel, Pascal, snake |
| 22 | `Next` / `Replay`; A to D static | 3 beats: vote, all allowed, the best name |
| 23 | `Next` / `Replay`, timer 4:00 | 4 beats: the task, what Python says, the bad lines, fixed |
| 24 | `Next` / `Replay`, timer 2:30 | 2 beats: vote, answer |
| 25 | `Next` / `Replay` | 6 beats, one card each |

## Frameworks (gate check 1)

| Concept (agenda item) | Framework | S / Why | T / What | A | R / close |
|---|---|---|---|---|---|
| 1 Comparing Strings | **STAR** | slide 4 beats 1 to 2 (the password you know by heart is refused) **and** beats 3 to 4 (Caps Lock; side by side, which letters differ) | slide 4 beat 5 and slide 7: every letter is a number, no syntax until slide 8 | slides 8 to 11: ord, chr, the ranges, the loop; slide 13 to 14: compared one pair at a time | slide 12 (task 1, run), slide 15 (six levels run), slide 16 quiz |
| 2 Naming Variables | **SCQA** | slide 17 beats 1 to 3: a name the app refuses, twice, then accepts | slide 17 beats 4 to 5: Python has rules too, and is stricter | slide 20: does Python accept this name? eight verdicts; slide 22: which name is best? | slide 23 (task 4 runs and prints 100), slide 24 exit question with its reason, slide 25 takeaways |

## Term ledger (gate check 2)

| Term | Introduced | Plain words given there |
|---|---|---|
| stored as a number | 4, beat 5 | every letter is stored as a number; S and s are different |
| Unicode value | 7, beat 5 | this number is the character's Unicode value |
| `ord()` | 8, beat 2 | ask me with ord, put the character inside |
| `chr()` | 9, beat 2 | use chr for number to character |
| Unicode ranges (48 to 57, 65 to 90, 97 to 122) | 10 | where the digits, capitals and small letters live |
| compared character by character | 13, beat 3 | I start at the left, one pair at a time |
| the shorter one is smaller | 14 (word `BA`), 15 level 6 | "BA" has no letters left, "BAD" still has D |
| keyword | 18 rule 4, 19 | Python keeps those for itself; the 35 locked words |
| camel case, Pascal case, snake case | 21 | a capital for each new word · every word begins with a capital · small letters joined by _ |
| `range`, `for`, `print`, `input`, `if` / `elif`, `==`, `>=` | carried in (sessions 3, 4, 14, 17) | used from slide 3 |

Nothing arrives assembled (gate check 3): the comparison is built one pair per
press on slides 13 to 15; the rules arrive one at a time on slide 18; the
takeaway cards land one per press.

## Outputs, all real runs (CPython 3.12.3, 2026-10-05)

| Program | Output |
|---|---|
| recap, line 3 `break` / `continue` / `pass` | `0 1` · `0 1 3 4` · `0 1 2 3 4` |
| `ord("A")`, `ord("a")`, `chr(75)`, `chr(100)` | `65`, `97`, `K`, `d` |
| `for unicode_value in range(65, 91): print(chr(unicode_value))` | `A` to `Z`, 26 lines |
| task 1: `range(97, 102)` → chr · `ord("a") - ord("A")` · `chr(ord("g") - 32)` | `a b c d e` · `32` · `G` |
| `"BAD" >= "BAT"`, `"CAT"`, `"BAC"`, `"BA"`, `"bad"` | `False`, `False`, `True`, `True`, `False` |
| levels 1 to 6 | `True`, `True`, `True`, `False`, `False`, `True` |
| `ravi kumar = 18` · `ravi_kumar = 18` · `1ravi = 18` | `SyntaxError: invalid syntax` · accepted · `SyntaxError: invalid decimal literal` |
| bill.py as written · fixed | `line 1: SyntaxError: invalid decimal literal` · `100` |
| halls: `Arun`, `N`, `Nandu`, `Zoya` | `Hall 1`, `Hall 2`, `Hall 2`, nothing |
| takeaways | `65` · `a` · `True` · `True` · `True` · `total_bill = 90` accepted |
| `keyword.kwlist` | 35 words, the reference's list exactly |
| `ord` of `@ ₹ అ அ` | `64 8377 3077 2949` |
| `isidentifier()` and not a keyword | accepts `User_name _player_age While ravi_kumar2`; refuses `in (yes no)? 1_age total.bill` |
| password: `sunny@123` / `SUNNY@123` | `115 117 110 110 121 64 49 50 51` / `83 85 78 78 89 64 49 50 51` |

## Slide by slide

`P` = a panel on `SlideBase` + `ZonedFrame` (session 15's `Panel`). Beats are
build steps unless marked *local*. Copy is the reference's, captured from the
rendered page at every press, with rule 36 applied.

### 1 · Welcome
`BrandSlide`, greeting `Welcome`.

### 2 · Recap · Where We Left Off
`RecapBrand`, three points: `break leaves the loop now` / `The lines after it
in the loop do not run` · `continue skips the rest of this pass` / `The loop
goes on with its next pass` · `pass does nothing` / `It holds the place of a
block you have not written yet`.

### 3 · Recap · What does it print?
P `RecapCards`, 7 beats. Left: the four-line program (`Python`), line 3 a
blank that becomes `break`, `continue`, `pass`; under it `Line 3 changes three
times` / `Each time, say the output before the next press`. Right: three
dashed cards numbered 1 to 3. Beat 2 fills line 3 with `break` (card 1 shows
`line 3 is break` and `What does it print?`), beat 3 shows `0 1` and `break
leaves the loop at 2. Nothing after it prints` (two lines); 4 and 5 the same
for continue (`0 1 3 4`, `continue skips print(i) only for 2` / `The loop goes
on`); 6 and 7 for pass (`0 1 2 3 4`, `pass does nothing, so 2 prints like every
other number`).

### 4 · Programming Foundations · The password that says wrong
P `PasswordHook`, 5 beats. Left: a laptop (decision 8) whose screen shows the
login: avatar, `Sunny`, the password field as dots, the eye and the arrow,
`8:52 AM`, a keyboard with `Tab`, `Caps`, `Shift` rows. Right: the five beat
lines (`BeatList`), then two rows of nine tiles labelled `saved` and `typed`.

| Beat | Caption | Screen | Tiles |
|---|---|---|---|
| 1 | `You type your laptop password` / `You know it by heart` | dots | empty |
| 2 | `Enter. "The password is incorrect." Why?` | the dialog `The password is incorrect. Try again.` / `OK` | |
| 3 | `Tap the eye. Caps Lock was on` | `SUNNY@123` shown, `Caps Lock is on`, the Caps key lit | both rows filled: `s u n n y @ 1 2 3` and `S U N N Y @ 1 2 3` |
| 4 | `Put them side by side. Which letters are different?` | | |
| 5 | `Every letter is stored as a number. S and s are different` | | numbers under each tile, `≠` on the five letters, `=` on the four others; letters tinted danger, the rest success |

### 5 · Today
`WelcomeSlide` minimal, `Comparing Strings & Naming Variables`.

### 6 · Agenda · What We Will Cover
`AgendaSlide`: `Comparing Strings` / `Every letter is a number` · `Naming
Variables` / `The rules, and the style`.

### 7 · Python · Unicode
P `UnicodeIntro`, 5 beats. Anu on the left, the Computer on the right
(`Characters`), four `What you see` tiles over four `What the computer stores`
tiles, a banner slot under them.

| Beat | Anu | Computer | Tiles |
|---|---|---|---|
| 1 | `I press A on my keyboard` | | `A` |
| 2 | | `I keep it as 65` / `I only understand numbers` | arrow, `65` |
| 3 | `And small z?` | `z is 122. A different number from Z` | `z` → `122` |
| 4 | `What about 1 and * ?` | `1 is 49. * is 42` / `A digit is a character too` | `1` → `49`, `*` → `42` |
| 5 | | `Every character has its own number` | banner `This number is the character's Unicode value` / `What you see: A.   What the computer stores: 65.` |

### 8 · Unicode · Finding Unicode Value
P `OrdFrame`, 5 beats: the question (Anu `What number do you keep for A?`, tile
`A`, empty result), ord (code `unicode_value = ord("A")` / `print(unicode_value)`,
Computer `Ask me with ord` / `Put the character inside`, the `ord( )` box),
65 (Output `65`, result `65`, Computer `65. That is my number for A`), guess
ord of a (code becomes `ord("a")`, tile `a`, result `?`, Anu `So what is
ord("a")?` / `Guess first!`), 97 (Output `97`, result `97`, Computer `97.
Small a has its own number`, banner `ord(character) gives its Unicode value`).

### 9 · Unicode · Character at Unicode
P `ChrFrame`, 4 beats: number in (Anu `Now the other way` / `I give you a
number`, tile `75`, `chr( )`, result `?`), 75 is K (code `char = chr(75)` /
`print(char)`, Output `K`, Computer `75 is K. Use chr for number to
character`), guess chr of 100 (second panel `chr(100)`, tile `100`, Anu `And
chr(100)? Guess first!`), 100 is d (Output `d`, Computer `100 is small d`,
banner `ord: character to number.   chr: number to character.`).

### 10 · Unicode · Unicode Ranges
P `Ranges`, 4 beats, one band per beat: `48 to 57` / `digits` (0 to 9 with
48 to 57 under), `65 to 90` / `capital letters` (A to Z), `97 to 122` / `small
letters` (a to z), `Everything else` / `signs, and other languages` (`@ 64`,
`₹ 8377`, `అ 3077`, `அ 2949`). Anu: `Where do the digits live?` (1), `Even ₹,
and Telugu and Tamil letters?` (4). Computer: `At 48 to 57. Even 0 is not
stored as 0` · `Capitals sit at 65 to 90` · `Small letters sit at 97 to 122` ·
`Yes. Every character, in every language`.

### 11 · Finding Char · Printing Characters
P `PrintLoop`, 5 beats. Code `for unicode_value in range(65, 91):` /
`print(chr(unicode_value))`; a `unicode_value` trail; `n → chr( ) → letter`;
an Output panel. Beat 1 the ask (Anu `Can you print A to Z for me?`, Computer
`Easy. I walk from 65 to 90` / `chr turns each into a letter`); 2 `65 is A.
Print it` (trail `65`, output `A`); 3 `66 is B. Print it`; 4 `67 is C. Print
it`; 5 `... all the way to 90: Z` / `range stops before 91` (trail `65 66 67 …
90`, output `A B C … Z`).

### 12 · Worksheet · Task 1 · Predict it, then run it
P `Task1`, 4 beats, timer 5:00. Three numbered programs with a `prints` slot
each; the brief: `Open Task 1 on your worksheet` · `For each program, type
what you think it prints` · `Then type it in the playground and run it` · `Type
what it really printed. Do not change your guess`. Beats 2 to 4 fill `a b c d
e`, `32`, `G`, and the note `A small letter is always 32 more than its capital`
/ `So chr(ord("g") - 32) is G`.

### 13 · Relational Operators · Comparing Strings
P `CompareIntro`, 3 beats. Code `print("BAD" >= "BAT")`; two rows of tiles
`B A D` over `B A T` with `>=` beside them. Anu: `Is BAD bigger than or equal
to BAT?` / `How does it check?`. Beat 2 numbers (`66 65 68` / `66 65 84`,
Computer `I do not see words` / `I see numbers`); beat 3 a dashed frame round
pair 1 with `pair 1` and the arrow, Computer `I start at the left` / `One pair
at a time`, banner `Python compares strings character by character`.

### 14 · Comparing Strings · Follow the pointer: letter by letter
P `Pointer`, 4 beats, `One step`, a slider for the second word. Left: the code
for the chosen word, `Before we press: True or False? Say it out loud`, then
from beat 2 the note `Python starts at the left. It looks at one pair of
letters at a time, and stops at the first pair that is different`, and the
slider card `the second word` with `BAT CAT BAC BA bad`. Right: `"BAD"` over
the second word, one pair lit per press, the explanation and the verdict.

| Word | Steps | Verdict |
|---|---|---|
| BAT | B/B same · A/A same · D/T decides, `Is 68 more than or equal to 84? No` | False |
| CAT | B/C decides, `Is 66 more than or equal to 67? No` | False |
| BAC | same · same · D/C decides, `Is 68 more than or equal to 67? Yes` | True |
| BA | same · same · `"BA" has no letters left. "BAD" still has D. The shorter one is smaller` | True |
| bad | B/b decides, `Is 66 more than or equal to 98? No` | False |

Letters Python never reaches are grey, with the legend `grey: Python never
looked at these letters`.

### 15 · Predict, then run · True or False?
P `CompareMachine`, 16 beats, six levels. Left: `LEVEL n OF 6`, the code,
`True or False? Tap it on your worksheet first`, the True / False chips
(clickable, decision 6), and from the run the `most say` note. Right: the two
words as tiles, one pair per press with its sentence, then the verdict.

| Level | Code | Most say | Pairs | Verdict |
|---|---|---|---|---|
| 1 | `print("a" > "A")` | `Most say False: A comes first in the alphabet, so it must be bigger` | a/A 97 65 decides | True |
| 2 | `print("Zebra" < "apple")` | `Z is the last letter, so most say False` | Z/a 90 97 decides | True |
| 3 | `print("BAT" > "BALL")` | `BALL has more letters, so most say False` | B/B · A/A · T/L 84 76 decides | True |
| 4 | `print("98" <= "123")` | `98 is less than 123, so most say True` | 9/1 57 49 decides | False |
| 5 | `print("ravi" == "Ravi")` | `It is the same name, so most say True` | r/R 114 82, `so the two strings are not equal` | False |
| 6 | `print("98" < "984")` | `Nothing is different, so most say False` | 9/9 · 8/8 · `"98" has no letters left. "984" still has 4. The shorter one is smaller` | True |

### 16 · Quiz time · Classroom Quiz
`QuizTimeSlide`, the reference's frame (course rule R5d, as sessions 15 and
16): `Time to check what you have learned so far.`, three steps.

### 17 · Before the next part · The username Instagram refuses
P `NamesHook`, 5 beats. Left: session 16's `Phone` at `9:41`, a sign-up form
`Create a username` / `Add a username or use our suggestion. You can change
this at any time.` / `Username` field / `Next` / a lowercase keyboard. Right:
`BeatList`, then code strips.

| Beat | Caption | Phone | Strips |
|---|---|---|---|
| 1 | `You sign up for Instagram. You type ravi kumar` | `ravi kumar`, `!`, `Usernames can only use letters, numbers, underscores and periods.` | |
| 2 | `You try ravi@kumar. Still refused. What is allowed?` | `ravi@kumar`, the same error | |
| 3 | `ravi_kumar works. Instagram has rules for names` | `ravi_kumar`, a tick, `Next` live | |
| 4 | `Python has rules for the names you give variables` | dimmed | `ravi kumar = 18` → `SyntaxError: invalid syntax` · `ravi_kumar = 18` → `Python accepts it` |
| 5 | `Instagram takes 1ravi. Python does not. Python is stricter` | | `1ravi = 18` → `SyntaxError: invalid decimal literal` |

### 18 · 02 · Naming Variables
`SectionBreakerSlide`, index `02`, kicker the session name, title `Naming
Variables`.

### 19 · Naming Variables · Rules for Naming Variables
P `Rules`, 8 beats. Four rule cards on the left, four `box name` cards on the
right, Anu and the Computer under them.

| Beat | Card | Names | Anu | Computer |
|---|---|---|---|---|
| 1 | `Use only letters, digits and _` / `A to Z, a to z, 0 to 9, and the underscore _` | `age` `input_1` `high_score` `_counter2` | `I want names for my boxes` / `Can I use these?` | |
| 2 | | all four ticked | | `Yes. Letters, digits and _ are all fine` |
| 3 | `No spaces, commas or special characters` / `like ~ ! @ # $ % ^ . ?` | `left` `start_playing` `read, write & learn` | `What about spaces and commas?` | |
| 4 | | tick, tick, cross | | `No spaces, no commas, no &` / `I refuse the last` |
| 5 | `Begin with a letter or _` / `never with a digit` | `left` `_player1` `Height_in_feet` `1_player` | `Can a name begin with a digit?` | |
| 6 | | tick, tick, tick, cross | | `1_player begins with a digit` / `I refuse it` |
| 7 | `Do not use a keyword` / `like while. Python keeps those for itself` | `move` `_player1` `_if` `while` | `Can I call my box while?` | |
| 8 | | tick, tick, tick, cross | | `while is my own word` / `It is a keyword` |

### 20 · Naming Variables · Keywords
P `Keywords`, 3 beats: the 35 locked words (Computer `These 35 words are mine`
/ `Python keeps them`); the ones you know lit (Anu `I know some! if, for,
while, in, break...`, Computer `So none of them can be a variable name`); the
panel `help("keywords")` (Computer `Type this in the playground to see them`).

### 21 · Worksheet · Task 3 · Does Python accept this name?
P `ValidOrNot`, 9 beats. Eight name chips along the top; two bins `Python
accepts` and `Python refuses`. One chip lands per press, in the reference's
order, with its reason:

| Name | Bin | Reason |
|---|---|---|
| `User_name` | accepts | `Letters and an underscore. It begins with a letter` |
| `in` | refuses | `Rule 4: in is a keyword. Python keeps it for itself` |
| `(yes no)?` | refuses | `Rule 2: a space, brackets and ? are not allowed` |
| `1_age` | refuses | `Rule 3: it begins with a digit` |
| `_player_age` | accepts | `It may begin with an underscore` |
| `total.bill` | refuses | `Rule 2: a dot is a special character. Instagram allows it, Python does not` |
| `While` | accepts | `Capital W. Python keywords are small, so While is not one` |
| `ravi_kumar2` | accepts | `Digits are fine after the first letter` |

### 22 · Naming Conventions · Case Styles
P `CaseStyles`, 4 beats: `Variable: Total Bill` with a cross (Anu `My box
holds the total bill` / `How do I write it?`, Computer `Not with a space` / `I
refuse Total Bill`); `Camel case` `totalBill` `a capital for each new word,
like a hump` (Computer `Camel case: small first, then a capital hump`);
`Pascal case` `TotalBill` `every word begins with a capital`; `Snake case`
`total_bill` `small letters, joined by _` (Computer `In Python, we use snake
case: total_bill`).

### 23 · Naming Variables · Question
P `BestName`, 3 beats. `Anu wants to store the sum of even numbers. Which name
is best?`; options A `sum`, B `sumofevenums`, C `sum_of_even_numbers`, D
`sumofevennumbers` (clickable, decision 6). Beat 2: every option `allowed`
with its note (`Sum of what? It does not say` · `Hard to read. What is
evenums?` · `Clear, and in snake case` · `The words run together`), Computer
`All four follow my rules` / `I accept them all`. Beat 3: C lit with a star,
Computer `But only one tells you what is inside`. Confetti if the pick was C.

### 24 · Worksheet · Task 4 · Fix the names
P `Task4`, 4 beats, timer 4:00. The four-line program; the brief `Type the
line numbers that have a bad name` · `Type what Python says when you run it.
Guess first` · `Fix every name in snake_case. Run it until it prints`. Beat 2:
`Python says` → `line 1: SyntaxError: invalid decimal literal`, two empty
slots, the note `Python stops at the first bad line it finds` / `Fix it, run
again, and it shows you the next one`. Beat 3: lines 1 to 3 marked, `Lines
with a bad name` → `1, 2, 3`. Beat 4: the fixed program, `After the fix, it
prints` → `100`.

### 25 · Exit question · Which name gets no hall?
P `ExitVote`, 2 beats, timer 2:30. Lead `The exam cell sends each student to a
hall by name. One student gets no hall at all`; the five-line program;
`Which name prints nothing at all?`; options A `name = "Arun"`, B `name =
"N"`, C `name = "Nandu"`, D `name = "Zoya"` (clickable). Beat 2 the reasons:
`A is 65 and N is 78. "Arun" is less than "N", so it prints Hall 1` · `"N" >=
"N" is True, so it prints Hall 2. Equal counts for >=` · `"Nandu" starts with
N, then has more letters, so it is bigger than "N" and smaller than "Z". Hall
2` · `Z = Z, then "Z" runs out. The shorter one is smaller, so "Zoya" > "Z".
Both conditions are False. Nothing prints`; D is right.

### 26 · Key takeaways · Comparing strings and naming variables, in six examples
P `Takeaways`, 6 beats, six cards with token-coloured headers (brand,
brandDark, accent, teal, danger, success): `A letter is a number`
`print(ord("A"))` `65` · `A number is a letter` `print(chr(97))` `a` · `Small
beats capital` `print("a" > "A")` `True` · `First different letter`
`print("BAT" > "BALL")` `True` · `One runs out` `print("98" < "984")` `True` ·
`A good name` `total_bill = 90` `Python accepts it`, each with the reference's
sentence.

### 27 · Feedback
Session-local `figures/FeedbackForm.tsx`, night stage. Kicker `Feedback`,
title `We'd love your feedback` on one line, line `Your thoughts help us improve this
course`, then ONE white box, x 64..1216, y 240..640, holding side by side and
centred as a group: the supplied QR code (`public/assets/feedback-qr.png`,
byte for byte; it encodes `https://forms.gle/5d1Ru8geTKdC4Bcr7`) with the
label `Scan to open the feedback form`, the link (new tab) and the line `Scan
the code, click the link, or fill out the form right here`; a hairline
separator; and the Google Form in an iframe (`/viewform?embedded=true`, 640
wide) scrolling inside its frame. The box carries the kit card's hairline border,
a brand accent bar on its left edge and a soft brand halo. On a phone held upright the box stacks: QR
row, separator, frame. A second variation (the same questions as native
fields, UI only) was built on 2026-10-06 and removed the same day on the
user's word.

### 28 · Thank you
`ThankYouSlide`.
`ThankYouSlide`.
