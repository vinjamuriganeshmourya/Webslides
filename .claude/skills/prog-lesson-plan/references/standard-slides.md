# The fixed spine

Read this before designing a session, in every subject. Nothing on this page is
a judgement call and none of it is re-decided per plan. It exists because the
same six cards were being redrawn slightly differently in every plan, and a
room that sees a different welcome slide every week reads the course as three
courses.

Programming Foundations, DSA and Aptitude all carry the same spine. The subject
decides what goes **between** the spine cards, never the spine itself.

> **Programming Foundations, since 2026-09-29: the spine is drawn in the new
> design.** `New Design Template.html` replaced the Fixed Slides pictures for
> this skill. `assets/ndt_theme.py` `spine(session)` draws welcome, the Recap
> card, the title card, the classroom quiz, feedback and thank you in that
> look, and `agenda_stage(items)` draws the agenda; `build-template.py`'s
> `spine_cards()` and `agenda_card()` already use them. The order, the rules
> for what each card carries and the four recap formats below are unchanged.
> Section 2 describes the pictures the other two skills still use; where it
> says "picture", read "drawn card" for this skill. The drawn cards keep the
> `data-spine` and `spine-<kind>` markers, so `spine_html_check` reads them
> the same way.

---

## 1. The order, and it does not move

```
1  Welcome                 the fixed picture, one minute
2  Recap                   the fixed picture, the word Recap, one press
3  Recap activity          one of the four formats below, 3 to 4 minutes
4  Hook                    the session's one animated turn
5  Session title           the fixed slide with this session's name on it
6  Agenda                  stepped, one stop per press
   ...                     teaching blocks
n  Classroom quiz          the fixed picture, in the middle of the session
   ...                     teaching blocks
   Key takeaways           the concept map
   Feedback                the fixed picture
   Thank you               the fixed picture
```

Two things about this order carry weight:

- **The title card comes after the hook.** The hook states the problem from the
  students' own world, and the room guesses what the topic is called before the
  card names it. So **nothing before card 5 prints the session's name**: not the
  hook, not a card eyebrow, not a worksheet heading. Eyebrows before it read
  `Module N · Session M`, or the subject, and nothing else.
- **The recap is retrieval, not a summary.** The recap card is the word `Recap`
  and nothing else; the retrieval is the card after it. A slide that lists what
  last session covered is not a recap, because the room can read that off the
  timetable, and reading is not remembering.

Omit cards 2 and 3 entirely for the first session of a module or course. Never
substitute an invented recap of a session that did not happen.

## 2. The six fixed slides

**They are the slides, not drawings of the slides.** The user keeps the masters
in `Fixed Slides/`; `assets/make-spine-artwork.py` crops the capture's black
edges, clears the name off the title slide and writes the six webp files the
spine draws with. Nothing here is recoloured, cropped, re-laid-out or rebuilt in
SVG, and nothing is laid over any of them.

| Card | File | On the card |
|---|---|---|
| Welcome | `standard-slides/welcome.webp` | nothing |
| Recap | `standard-slides/recap.webp` | nothing. The word Recap |
| Classroom quiz | `standard-slides/quiz.webp` | nothing. No timer, no questions, no reveal |
| Feedback | `standard-slides/feedback.webp` | nothing |
| Thank you | `standard-slides/thankyou.webp` | nothing |
| Session title | `standard-slides/title-blank.webp` + `Spine.title_card(name)` | the session name, and only that |

The title card is the one card that changes between sessions, and **only its
name changes**. `title-blank.webp` is the shipped slide with the name cleared
out of the white pill; `title_card()` writes the session's own name back into
the same place, in Arial Bold, at 58px on the 1600x900 viewBox, `#212121`,
centred on x=1031 where the shipped slide centres its own. A name too long for
that column steps down in size, and one too long to step down breaks onto a
second line on the same middle. Do not move it, recolour it or set it in
another face: `var(--sans)` resolves to Segoe UI on these machines, and the
same name in Segoe next to the shipped slide reads as a different deck.

Two earlier versions of this page said the recap card and the title card were
drawn in SVG from `ccbp-logo.webp` and `nxtwave-logo.webp`. They are not any
more, and those two files are no longer used by the spine. A redrawing is
always a near miss, and a near miss on the wall is what the user rejects.

**When the user replaces a slide** in `Fixed Slides/`, re-run the prep and
nothing else changes:

```bash
python3 assets/make-spine-artwork.py "C:/Lesson Plans New/Fixed Slides" assets/standard-slides
```

## 3. The classroom quiz

The quiz runs **on the learning portal**, on the students' own laptops. The
card on the projector is the picture and nothing else. The instructor announces
it; the guide entry for that card carries what to say, the minutes, and what a
student does when they finish early. None of that goes on the projector, and no
question from the quiz is ever written into the plan.

**Where it goes: the middle.** Put it at the block boundary nearest the halfway
mark of the session, after a concept has been taught and practised, never
immediately after the agenda and never in the closing run. On a 75 minute
session that is a block starting between minute 33 and minute 45. It is a
checkpoint, so it also decides what the second half drops if the room struggled.

Budget five to seven minutes, and the card carries no timer: the portal runs its
own clock, and a second clock on the wall is noise.

## 4. The four recap formats

Rotate them. A module that opens the same way five weeks running has taught the
room to stop looking at minute two. Pick the format that fits what was last
taught, and do not use the same one twice in a row.

| Format | Shape | Fits |
|---|---|---|
| `rapid` | Three question tiles, turned over one per press | facts, definitions, a rule with a short answer |
| `sort` | Chips flown into one of two bins, one per press | two things the room keeps confusing |
| `bug` | A worked thing that prints the wrong answer, and one line is to blame | anything with steps: code, a traced sequence, a sum |
| `match` | Six tiles, three pairs, joined one press at a time | a name and what it does, an operator and its result |

All four are **commit then reveal**. The room writes the answer down, or says
it, before the press that shows it. That is the whole point of the beat: a
recap the room watches teaches nothing. The guide entry says *hands down first,
then press*.

All four are anonymous. Nobody is named, nothing is scored, and a wrong answer
stays in the student's own notebook.

```python
from standard_slides import Spine
S = Spine('standard-slides')

S.recap('rapid', title='Recap of if and else', items=[
    ('A number is 7. Does `if n > 10:` run its block?', 'No',
     '7 is not bigger than 10, so Python goes to else.'),
    ...three of them...
])

S.recap('sort', title='Recap of the two equals signs',
        bins=('Compares two things', 'Puts a value in a box'),
        chips=[('x = 5', 'right', 'One equals sign stores 5 in x.'), ...])

S.recap('bug', title='Recap of indentation',
        lines=['marks = 35', 'if marks >= 35:', '    print("Pass")',
               'print("Fail")'],
        wrong='Pass\nFail', right='Pass', culprit=4,
        why='Line 4 sits at the left edge, so it runs every time.')

S.recap('match', title='Recap of operators', pairs=[
    ('%', 'Gives what is left over', '17 % 5 is 2, the remainder.'), ...])
```

Text is plain school English, and `backticks` mark a variable name or an
operator so it prints as code. Three items in `rapid` and `match`, four to six
chips in `sort`, and one culprit line in `bug`.

## 5. Wiring it into a builder

```python
import sys; sys.path.insert(0, 'assets')          # wherever the module sits
from standard_slides import Spine, SPINE_CSS, SPINE_JS

S = Spine('assets/standard-slides')

cards = [
    pcard('Welcome',  '1 min', S.welcome()),
    pcard('Recap',    '1 min', S.recap_title()),
    pcard('Recap',    '4 min', S.recap('sort', ...), activity=1),
    ...hook...,
    pcard('Today',    '1 min', S.title_card(SESSION_NAME)),
    ...agenda, teaching blocks...,
    pcard('Classroom quiz', '6 min', S.quiz(), activity=15),
    ...teaching blocks, takeaways...,
    pcard('Feedback', '3 min', S.feedback()),
    pcard('Thank you','1 min', S.thankyou()),
]
```

`SPINE_CSS` goes into the template's `{{EXTRA_CSS}}` and `SPINE_JS` into
`{{EXTRA_JS}}`. Both are inert on a plan that uses no recap format, so they are
always safe to include.

The recap panels drive themselves and swallow their own arrow keys, the way
every other self-driving panel in these plans does. Do not wrap one in a
`data-anim` stage.

## 6. What the checkers enforce

- the six opening cards, in order, and the closing three in order;
- the session name appearing nowhere before the title card;
- the five pictures being the shipped bytes, not a lookalike, and the title
  card being the shipped picture with a name on it;
- the quiz card sitting in the middle third of the running order, carrying no
  timer and no question text;
- the recap format being one of the four names.

If a check fails, fix the beat table and rebuild. Do not edit the finished HTML.
