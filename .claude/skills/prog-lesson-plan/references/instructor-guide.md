# The instructor guide

The guide is where the session actually lives. The slides carry what the room sees; the guide
carries everything the instructor does. **There are no notes under the slides** — one source of
truth, or they drift within a week.

**The shape changed on 2026-09-22, and the old one is gone.** The guide used to be one entry per
slide with a photograph of that slide: thirty-one cards, forty-three kilobytes of prose, a
sentence for every press. Instructors do not read that, and the ones who do lose their own
judgement inside it. The approved format is a **short written document, in phase blocks, with a
sidebar** — about six printed pages for a seventy-five minute session.

The reference build is
`Plans/Programming Foundations/11 - Nested Conditional Statements/11_nested_conditional_statements_instructor_guide.html`,
and `Approved Instructor Guide Format.pdf` in the plans repo is the user-approved original it
came from.

---

## Why it is shaped this way

Two instructors deliver this plan: the one who improvises well, and the one who does not. The
old guide made the second one safe by taking the first one's session away.

So the guide now says **how to attempt each beat**, not what sentence to say. It quotes only the
handful of lines where the exact wording is the teaching — the hook question, the safe point
checks, the debrief line. Everything else is intent, in the instructor's own words.

> "If you have a better example than the one here, use yours."

That sentence belongs near the top of every guide, and it has to be true of what follows it.

---

## The shape

One HTML file, screen and print. A fixed left sidebar, then numbered sections down the page.

| Part | Carries |
|---|---|
| Title | `Instructor Guide - <session name>`, and under it one line: **Duration** 75 minutes |
| Sidebar | one row per section: number, short label, minute band. Checkpoint bands sit between the rows, in the same places the student view puts them |
| **1. How to run this session** | the one idea of the session, then a box of five or six standing habits, then the digital-worksheet line and the safe point line |
| Phase sections | one per beat or group of beats, numbered, each with its minute band in the heading |
| **Safe points** | four of them, spread through the session |
| **If you are running late** | the cut order, then the two or three things that are never cut |

There is **no learning objectives section** (the user cut it), **no per-slide entry**, **no
thumbnails** and **no four-tab layout**.

A phase section is two to five short paragraphs. It opens from what the room already has, says
what to reach and what to ask, and names the wrong answers to expect. Tables are for answer keys
and for grouped problems, not for prose.

---

## The callouts

Four, and each one means something:

| Class | For |
|---|---|
| `.say` | a line worth saying close to as written. One or two per section at most |
| `.safe` | a safe point: a short check, what answer you want, and what to do when it fails |
| `.act` | what to do while they work: the nudges, the counts, the marking walk |
| `.box` | the standing habits, and the closing "if they ask" list |

`.tag` marks the worksheet task a section belongs to (*Worksheet task 2*). `.cpnote` puts the
checkpoint in the body as well as the sidebar, so it survives printing. `.hookline` carries
*Laptops shut. Nobody types here.*

---

## Safe points

Four per session, and they are the thing that replaced the old per-slide *Watch for*. Each one
is: a question to ask the room, the answer you want, and what to do when you do not get it.

> **Safe point 2, hand signal check.** "Thumbs up if you can tell me why Block 3 printed even
> when condition_b was False." Address every thumbs down before moving on. Block 3 sits at one
> indent, so it belongs to the outer if.

Put them where a failure would sink the next beat, not at tidy intervals.

---

## The standing habits box

Everything that used to be repeated on thirty entries goes here once. The Programming
Foundations set:

- **Ask before you tell.** Ask the question first, take two or three answers, then say the thing.
- **Read the room out loud.** Go option by option and say roughly what you see. Silence is not agreement.
- **Keep asking.** A question every two minutes, even small ones.
- **Nudge while they work.** *"Are you done? One minute to go. Let us see who finishes first."*
- **Offer doubts often.** *"Any doubts here?"* costs four seconds.

The recap is described the way the user dictated it: the timer on the slide starts by itself,
students are ready with an answer before it ends, then option by option hands up, **no counting,
a rough idea only**, then reveal.

---

## The worksheet is digital

Say it once, in section 1: they type into it on their own laptops, it saves as they go, it is
submitted at the end. Nothing is printed, handed out or collected. Rough arithmetic on their own
sheets is fine to mention; a paper worksheet is not, and the checker fails the build for it.

---

## How it is built

The guide is **generated**, not hand-written, so the numbering, the anchors and the sidebar
cannot drift from each other.

| File | Is |
|---|---|
| `assets/ig_template.html` | the approved shell: tokens, CSS, print rules, scroll-spy. Placeholders `{{TITLE}}` `{{DURATION}}` `{{SUBTITLE}}` `{{NAV}}` `{{SECTIONS}}` |
| `scripts/ig_build.py` | fills it from one content file per session |
| `<session>.py` | the content: a `META` dict and an `ITEMS` list |

```python
META = {"title": "Loops", "duration": "75 minutes",
        "subtitle": "Session 12 &middot; Loops &middot; 75 min",
        "out": r"...\12_loops_instructor_guide.html"}

ITEMS = [
  {"kind": "concept", "title": "How to run this session", "html": """<p>…</p>"""},
  {"kind": "hook", "title": "Hook, forty copies at the xerox shop",
   "nav": "Hook, forty copies", "band": "5 to 11", "html": """<p>…</p>"""},
  {"cp": "Checkpoint 1 &middot; 11 min"},
  {"cp": "Hard floor &middot; 66 min", "floor": 1},
]
```

`kind` is `concept | hook | activity | hands | quiz | exit` and only colours the sidebar rule.
`nav` is the short label; leave it out and the title is used. `band` prints as *11 to 23 min* in
the heading and *11 to 23* in the sidebar.

    python scripts/ig_build.py <session>.py

It writes the file and prints a word count, then fails on: an em dash, paper-worksheet wording, a
missing *Safe point 1*, *How to run this session* or *If you are running late* section, a sidebar
that disagrees with the sections, a title that does not say Instructor Guide, and anything over
about 4,000 words. `verify_plan.py` calls the same `problems()` function, so the build and the
checker cannot disagree about what the format is.

---

## Length

Six printed pages for seventy-five minutes, give or take one. Check it rather than guessing:

```
chrome --headless=new --no-pdf-header-footer --print-to-pdf=out.pdf file:///…guide.html
```

If it runs past seven pages, cut sentences, not sections. A section that is only a heading and a
band is a section that should have been merged into its neighbour.

---

## Where the old guide's content went

| Old part | Now |
|---|---|
| `How it goes` steps, one card at a time | two to four sentences per phase, in the instructor's own words |
| `Do` bullets (press play, which button) | inside the phase prose, or the `.act` callout |
| `Watch for` | the safe points, and one `.small` line per section for the signal to read |
| Checkpoint headings | sidebar bands plus `.cpnote` in the body |
| Common guidelines | the standing habits box, said once |
| Cut order | the last section, *If you are running late* |
| If they ask | a `.box` at the end of that section |
| Every answer in one place | the answers sit in the phase that uses them, in a small table |
| Card photographs | gone. `render_thumbs.py` still runs for the build's own screenshot review, not for the guide |
