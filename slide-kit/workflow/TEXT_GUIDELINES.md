# Text guidelines for NIAT / NxtWave session decks

What to write on a slide, and in what voice. Derived by full-corpus analysis of
the 23 decks in `pptx_template/sample_ppts` (1,274 slides, 14,131 body lines,
128 speaker-note blocks). Every number is measured; every quoted example is
verbatim from the corpus.

Companion documents: `PEDAGOGY_GUIDELINES.md` (how a deck is sequenced),
`STYLE_GUIDE.md` (the earlier, shorter cut of this), `SLIDE_WORKFLOW.md`
(the pipeline), `DESIGN_GUIDE.md` (visual).

> **Precedence.** `.claude/skills/slide-content-rules/SKILL.md` holds the hard
> rules recorded from explicit user corrections and **overrides this document
> wherever they disagree**. The three that bite most often:
> **no em dash or en dash in any rendered string** (the corpus uses them, our
> decks do not: 487 corpus lines contain one), **never the word "stranger"**,
> and **commands render in a VS Code `Terminal` component**, never as a
> screenshot of a terminal and never invented.

---

## 1. The budget

| Measure | Median | Soft ceiling (corpus p90) |
|---|---|---|
| Title | **2 words** | 5 words |
| Body words per slide | **40** | 119 |
| Body lines per slide | **10** | 24 |
| Words per line | **3** | 10 |

A slide is **about forty words**. A bullet is a **three-to-six word fragment**,
not a sentence: 79% of all corpus body lines are six words or fewer. If a draft
slide breaks 120 words, it is carrying two ideas and must be split.

Slides that legitimately run long are code slides (the code is not prose) and
comparison tables, where each cell is still a fragment.

## 2. The unit of writing is the fragment

- **Default: a noun phrase or a verb phrase, no trailing period.**
  `Add the is_prime field` · `Click Send button` · `Store Data` ·
  `Beginner friendly` · `Needs prior experience`.
- **No trailing full stop on titles, bullets, table cells, or captions.** A
  period appears only inside a genuine multi-sentence paragraph.
- **Full sentences are rationed**, roughly one line in five, and are spent on
  exactly three jobs:
  1. **Stakes:** "Without it, a website is just a static poster: no login, no
     data, no logic"
  2. **Cause and effect:** "The access token is used everywhere, so it could
     get stolen. Making it expire in minutes means a stolen one is useless
     almost immediately."
  3. **A rule or definition:** "A Framework is ready-made code with built-in
     rules and structure that handles common tasks, so you can focus on
     building your application's main features."
- **Definitions get their own slide and their own sentence.** One sentence, one
  clause of "what it is" plus one clause of "what it buys you". See
  `What is a Serializer?`: "A serializer is a DRF class that converts model
  objects into Python dictionaries to send out, and validates incoming data to
  save into the database."

## 3. Voice

- **Second person and first-person plural, always.** you/your at 7.6 per 1,000
  words, we/our at 9.9. "We built our ProductList", "you can't ship what you
  don't have", "Let's set up a proper CSS file".
- **Imperatives drive every doing-slide:** Open · Run · Create · Add · Click ·
  Refresh · Notice · Remember · Try. "Run these terminal commands step by step"
  appears 21 times verbatim as the setup-slide line.
- **State the observable result of every action.** An instruction that does not
  say what the learner will see is incomplete:
  `Refresh /admin/. A new "CART" section now appears in the sidebar.`
- **Anti-magic.** When a framework does work for you, show the real code that
  does it: "self.list() is not magic. Here is the real code that lives inside
  ListModelMixin." Never leave a mechanism as "it just handles it".
- **Name the trap by name.** "Skipping that one line is the #1 beginner trap.
  An unregistered app is invisible."
- **Analogy openers are a fixed small set:** Picture / Imagine / Think of /
  like a (about 85 uses across the corpus). "Picture a real supermarket. You're
  pushing a trolley and you grab a second identical tin of beans. What happens?"
  Analogies are introduced, cashed out into the technical mapping on the same or
  next slide, and then dropped. Never leave an analogy unmapped.

### 3a. Register: professional, not casual

Asked for on 2026-09-02, during Deployment session 3's wording pass.

**This does not repeal the second person above.** "You" and "we" are the corpus
voice and stay. Register is a different axis: a sentence can be warm, direct and
addressed to the reader while still being written rather than chatted.

What to cut:

- **Chummy first-person plural.** `here is everything one command is about to do
  for us` is not the same as "we built our ProductList". The first performs
  camaraderie, the second describes work. Keep the second.
- **Telegraphic fragments used as whole lines.** `The payoff` · `Why` ·
  `The path matters, not the code`. A headline-style fragment reads as a caption
  on something else, and §3c has already shown that is usually what it is. A
  bullet is legitimately a fragment; a lead, a callout title and a table cell
  carry a stated fact.
- **Verdict words standing in for the fact.** `a disaster` · `a mess` ·
  `trivial to prevent` · `fine`. These rate the fact instead of giving it, which
  is §3c's fourth test arriving in casual clothes.
- **Punchy two-beat constructions.** `One image, many machines` ·
  `Two halves, separated by a colon`. They scan well and say less than the plain
  sentence that fits the same budget.

What to keep: imperatives, the observable-result rule, the named trap, and the
fixed set of analogy openers. Those are direct, not casual.

**Professional does NOT mean elevated.** Reaffirmed 2026-09-02: *"all sentences
and points must use simple and professional English."* These pull against each
other if you let them, and the plain word wins every time. The failure this
prevents is over-correcting a casual line into a formal one:

| Casual (wrong) | Formal (also wrong) | Simple and professional (right) |
|---|---|---|
| `The symptom is maddening` | `The manifestation is problematic` | `The server runs, the browser is refused` |
| `A genuinely confusing hour` | `A protracted diagnostic effort` | `Without this line, the log panel stays empty` |
| `gone` | `no longer requisite` | `No longer needed` |

Prefer the short Anglo-Saxon word to the long Latinate one: **use** not *utilise*,
**start** not *initiate*, **needs** not *requires*, **about** not *regarding*,
**before** not *prior to*, **so** not *consequently*. A sentence is professional
because it states a fact plainly and carries no filler, not because it sounds
formal. The register to aim at is good technical documentation, which is written
in short plain sentences and is nobody's idea of casual.

The test: would this line survive in written course material with no instructor
beside it. A deck is read from the back of a room and again, alone, from the
recording.

## 3b. Write for someone who has never met the word

**Every point on a slide must be readable by an absolute beginner.** Asked for on
2026-08-31 while planning Deployment session 7, and it holds for every deck.

The corpus voice already assumes this and the guidance above encodes half of it.
The half that gets dropped under time pressure is the half written here.

- **Use the word the learner would use.** A term can be perfectly clear and still
  be wrong, because nobody says it. `keystrokes` is the case that prompted this:
  it is precise, everyone understands it, and no developer has ever described
  their own day in keystrokes. Session 5 used it on four slides and the review
  asked for plain words instead, on the grounds that it is *"not relevant to
  regular usage of phrase"*. `make up` is **two words**, not seven keystrokes.
  Others in the same family: prefer `typing` to `input`, `folder` to `directory`
  when the learner's editor says folder, and `command` to `invocation`.
- **No unexplained jargon in a bullet, ever.** A term the room has not been given
  cannot appear in a fragment, because a fragment has no room to define it. If it
  has to appear, it gets its own slide first. `webhook`, `executor`, `gate` and
  `automation server` are all one-line definitions before they are ever used in
  passing.
- **Define at first use, on the frame where it first appears.** Not in the
  speaker notes, not two slides later, not "we will come back to this". The plan's
  vocabulary table exists to make this checkable: every term in it names the slide
  that defines it, and that slide is at or before every slide that uses it.
- **A definition names three things**: what it is, why it exists at this point in
  the session, and where the room has already met it if they have. A bare gloss is
  not a definition.
- **Concrete before abstract.** The everyday case, then the technical one. An
  assembly line before a pipeline; a teammate who never ran the tests before
  "continuous integration".
- **Expand an acronym the first time, always.** CI/CD is Continuous Integration
  and Continuous Delivery on the slide that introduces it, and only then a
  two-letter pair.
- **Never say "simply", "just", "obviously" or "of course".** They tell a learner
  who is stuck that being stuck is unusual. The corpus does not use them and no
  deck should add them.
- **A step says what the learner will SEE.** Already rule in §3, and it is the
  single most beginner-facing line in this document: an instruction with no
  observable result gives a beginner no way to tell whether it worked.

The test: read the slide as somebody who joined this course last week. If a
fragment sends them to a search engine, it is not finished.

## 3c. State the fact. Do not allude to it

**A line must contain the thing it is about.** Asked for on 2026-09-02, after
Deployment session 3's review, and it holds for every deck.

This is not §3b again. §3b is about *vocabulary*: a word the room has not been
given. This is about *sentences built out of words the room already knows that
still say nothing*, because they comment on the point instead of making it. The
reviewer's phrase for them was **riddles**: the room is handed a clue and left to
reconstruct the lesson themselves. It was raised six separate times on one deck
("make sure that points are clear, not a riddle", "do not give as riddles to
students", "explain more clearly", "make the statement clearly, this is not
clear", "sentences are not at all clear", "do not just provide statements,
explain clearly"), which is why it is now a rule rather than a review note.

The failure has a shape. The writer knows the point, writes a line that *refers*
to the point, and reads it back correctly because they already hold the meaning
the line is missing. The room does not hold it. Every example below shipped:

| Riddle (what shipped) | What it was trying to say |
|---|---|
| `The shift in thinking, and you have made this exact shift once before` | `Compose describes what you want. docker run tells Docker each step` |
| `The boundary of the claim, so nobody over-generalises it` | `Only services in this file share the network` |
| `Two cases, and only one of them is open to you today` | `A container reaches another by service name. Anything outside Docker cannot reach in yet` |
| `Technically yes, and it would be a mess` | `Both programs fit in one container, and one crash then takes down both` |
| `A single musician can start playing on their own. An orchestra cannot` | `One musician starts alone. An orchestra needs a score and a conductor to start together` |

Read the left column: each one is *about* a fact without *being* the fact.

**NO HALF-BAKED SENTENCES.** Reaffirmed 2026-09-02: every line must carry its own
context through to the end. A line that starts an idea and leaves the room to
finish it is not shorter, it is unfinished. Three shapes of half-baked line, all
of which shipped:

- **The dangling opener.** `Which is why detached mode stops being optional` and
  `And both exist only because this is a real server` begin mid-thought, on a
  conjunction, continuing a sentence the previous slide ended. A slide is not a
  paragraph continued; the room may have looked away for the slide change.
- **The withheld half.** `Two Questions, Two Answers` names neither question nor
  either answer. `The Same Rule, Already Solved` names no rule and no solution.
  If a line promises two things, it states both.
- **The context-free deictic.** `From outside Docker`, `Into the Volume`,
  `Move It Out`. Each is a prepositional phrase with no subject and no verb: it
  labels something off-frame that the reader has to find first.

The repair is always the same: name the subject, state what happens to it, and
finish the thought inside the line. This costs a few words and it is the
difference between a slide the room reads and a slide the room decodes.

Four tests, and a line has to pass all four:

- **The standalone test.** Read the line with the slide's figure, title and
  bullets covered. If it no longer says anything, it was leaning on them.
- **Does it name its own subject?** "The shift in thinking" names no shift.
  "The boundary of the claim" names no boundary. A line whose subject is a
  pronoun, a demonstrative ("that line", "this one", "both of these") or a bare
  abstraction ("the shift", "the claim", "the point") is describing the content
  from outside it.
- **Would a reader who missed the previous slide follow it?** Not "would they
  have full context" — they will not. Would they understand *this sentence*.
- **Is it commentary?** Lines that tell the room how to *feel* about a fact
  ("and it would be a mess", "so nobody over-generalises it", "and that is the
  whole point") are the instructor's job, spoken. Put them in `notes`. The slide
  carries the fact.

**Withholding is not the same as pacing.** A `QuestionSlide` legitimately
withholds its answer, because the answer is the next frame and the room is meant
to commit first. A content slide withholding its own content is not pacing, it is
an unfinished line. The difference: on a question slide the room knows it is
being asked something.

**The cure is usually not more words.** These lines are short because they are
allusive, and the fix is to spend the same budget on the fact rather than on a
remark about the fact. `Technically yes, and it would be a mess` and
`Both programs fit, and one crash takes down both` are the same length, and only
one of them teaches. When a line genuinely cannot be stated in the budget, the
slide is carrying two ideas and §1 already says to split it.

## 4. Titles

- **Two or three words, topic-bare:** `Testing` · `Update` · `Serializers` ·
  `Virtual Environment` · `Seller Logic` · `Backend Operations`.
- **A build sequence repeats the same title verbatim** across all of its slides.
  `Manual HTML Form` appears on 31 consecutive-run slides, `products/views.py`
  on 92. Continuation is signalled by the repeated title, never by
  "part 2", "continued", or "(cont.)".
- Every content slide also carries the **section name** as its kicker, so the
  learner always knows which of the four concepts they are inside.
- **Questions as titles are 2%** of the corpus, exclamations 4% and almost
  entirely the fixture `Quiz Time!`. Colon titles are effectively absent (0.5%).
- Recurring fixture titles, use them verbatim: `Quiz Time!` (31x) ·
  `Test it` / `Testing` (39x) · `Initial Setup` (21x) · `Recap` (24x) ·
  `Where we Left Off`.

### 4a. Agenda items carry no articles and no helping words

An agenda item is a **noun phrase in content words only**. Strip every `a`,
`an` and `the`, and every verb that is there for grammar rather than for
meaning: `getting`, `understanding`, `looking at`, `introduction to`.

| Write | Not |
|---|---|
| `Real Project Setup` | `Getting the Real Project Ready` |
| `Dockerfile for Backend and Frontend` | `A Dockerfile for the Backend and the Frontend` |
| `Writing Compose File` | `Writing the Compose File for the Project` |
| `Running Application with Docker Compose` | `Running the Application Through Docker Compose` |
| `Node Container Image` | `A Container Image for Node` |

Keep only the connectors that change the meaning: the `and` joining two things,
the `with` or `for` naming the tool. Drop the rest.

The reason is the reading distance. An agenda is read at a glance from the back
of a room, twice per session — once at the front and once in the recap — and an
article is a word the eye steps over before it reaches the noun it came for.
Four items with three articles each is twelve words of scaffolding on a slide
whose whole job is to be scannable.

**The same words then have to appear on the section divider and in the recap,
verbatim** (content rule 20), so write them as one array in the deck file and
read the dividers and the recap from it. Two hand-typed copies of a phrase drift
inside one session, and a divider that paraphrases its agenda item quietly
renames the section halfway through.

**Why this rule exists.** Session 4's agenda was corrected twice in one review
pass. First for being figurative — *"Moves In? Each Part? Specify what?"* — and
then, after a rewrite into plain sentences, for the scaffolding those sentences
brought with them: *"remove a the helping words from the agenda"*. The second
correction is the one worth writing down, because plain English and terse
English are not the same target and the first rewrite hit the wrong one.

### 4a-bis. Drop the leading article, everywhere on the slide

§4a strips articles from agenda items. The same applies to **every** piece of
copy on a slide: a lead, a bullet, a callout title or body, a caption, a
qualifier, a figure's card label, a table cell. A slide line is a fragment
(§2), and a fragment does not open on `The`.

| Write | Not |
|---|---|
| `Project now documents its own operations` | `The project now documents its own operations` |
| `Same two commands, after today` | `The same two commands, after today` |
| `Interface` | `The Interface` |
| `Cost that is not about keystrokes at all` | `The cost that is not about keystrokes at all` |

Titles were already meant to work this way — §4 calls them "topic-bare" and the
corpus examples carry no article at all. This is that rule finally applied past
the title.

**Only the leading article goes.** `Run it from the folder that holds
requirements.txt` keeps its `the`, because that one is doing work: it points at
one specific folder. The rule is about the word the eye steps over before it
reaches the content, not about every article in the line.

**Never in speaker notes.** Notes are prose an instructor reads aloud, in full
sentences, and stripping their articles makes them harder to read out. Never in
a terminal transcript, a filename or a code panel either — those are quoted.

**Why this rule exists.** Session 5's review, on a lead reading "The project now
documents its own operations": *"Remove The from all sentences... make similar
changes in all."* It came after the same correction on the agenda, which is what
makes it a rule rather than a preference: the same instruction twice, on two
different parts of the same deck.

### 4b. One line is one sentence. Join the clauses with a comma

A lead, a callout body, a bullet `sub`, a caption: **one line, one sentence.**
When a line is two short clauses about the same thing, they are joined with a
comma, not split with a full stop.

| Write | Not |
|---|---|
| `Open backend\requirements.txt, this is what the integration course put there` | `Open backend\requirements.txt. This is what the integration course put there` |
| `Run it in the backend folder, the versions go straight into the file` | `Run it in the backend folder. The versions go straight into the file` |

The reason is what a full stop does to a reader. It is a full stop: the eye
stops, and the line lands as two separate statements the room now has to relate
to each other. On a slide read at a glance while somebody talks over it, that is
a beat spent on punctuation. A comma keeps it as one thought with two halves,
which is what it is.

**Length is not a reason to keep the full stop.** The first attempt at this pass
set a ~100 character ceiling and left dozens of lines split, which was the wrong
test: a line that is too long for a slide is too long whether it is punctuated
with a comma or a full stop. If the joined sentence does not fit, **cut words**.
Do not restore the stop to make the line look shorter.

**Do not join** when the second clause is a different claim, a correction, or a
separate beat:

- an answer that stands alone before its explanation — `No. They get whatever is
  newest that day` keeps its stop, because the `No.` answers the question on the
  previous slide
- a statement followed by a question on the same frame — a `QuestionSlide`
  premise and its question are two different acts
- verbatim terminal output, which is quoted and never edited
- a meta-statement about the slide itself rather than about its subject —
  `Nobody ever types 0.0.0.0 into a browser. These are two different questions`

Three or more clauses strung together with commas is a run-on. Join the two that
belong together and cut the third, or split the line across two fields: the lead
takes the claim and the callout takes the consequence.

**Speaker notes are exempt.** They are prose an instructor reads aloud, several
sentences long by design. This rule is about the words on the slide.

## 5. Punctuation and code voice

- **Arrow `→` is the house connector** for cause and effect and for click
  paths: `Open Postman → click New Request` · `GET → list()` ·
  `Reads pk from URL → fetches object → returns 204`.
- **Em dash and en dash: banned.** Where the corpus reaches for a dash to mark
  the reveal beat, use a colon, a comma, a full stop, or parentheses.
  Corpus: "Overselling is a real business problem — you can't ship what you
  don't have." Ours: "Overselling is a real business problem. You can't ship
  what you don't have."
- **Exclamation marks: 0.1 per slide.** Reserved for the fixtures.
- **Identifiers appear exactly as they are in the code**, never paraphrased:
  `products/serializers.py`, `create_user()`, `INSTALLED_APPS`,
  `serializer.is_valid(raise_exception=True)`. Every code slide names its file
  path as a label (`products/views.py`, `cart/models.py`).
- **Language chip on every code block** (`Python`, `Terminal`, `HTML`), which is
  why `Python` is the single most frequent string in the corpus (304x).

## 6. Text pattern per slide type

| Slide type | Text pattern |
|---|---|
| Brand / Welcome | session name only, nothing else in the body |
| Agenda | the 4 concept names as 2 to 4 word pills, plus a one-line gloss each |
| Section divider | bare 1 to 3 word section name, occasionally a short question |
| Concept slide | 3 to 6 fragment bullets, at most one full "why" sentence |
| Definition slide | title as a question (`What is a Serializer?`), one sentence answer |
| Analogy slide | 1 to 2 sentence scene, then the technical mapping |
| Setup slide | `Initial Setup` + "Run these terminal commands step by step :" + a Terminal panel |
| Step / doing slide | numbered imperatives, each with its observable result |
| Code slide | file path label + code + one narration line; annotations as `token → what it does` |
| Under-the-hood slide | the framework's real source + 3 or 4 numbered `01/02/03` callouts |
| Comparison slide | 2 or 3 columns, identical row labels, fragment cells (`Setup effort`, `What's Included`, `Best for`, `Learning curve`) |
| Test slide | method + URL + body + `→ 200 expected result`, one row per endpoint |
| Quiz | title `Quiz Time!`, one short question, short options |
| Recap | the agenda concepts restated as outcomes, 4 to 8 word pills |
| Thank you | next-session teaser, one line |

## 7. Speaker notes

Notes are sparse and functional (128 blocks across 1,274 slides, so roughly one
slide in ten). They carry a **narrative flow cue**, not a script:
"Now that we understand why websites exist, let's explore the two key components
that make them work." The fixtures are notes-only:
slide 1 "Welcome to the session.", the feedback slide's full paragraph, and the
divider cue "First we will start with the Network Layer".

Never leave the authoring scaffold in the deck. Several corpus slides leak
`**Points with helping words:**`, `**Visual Representation:**` and
`Slide 7 – Why Choose Django?` into the slide body or hidden layers. That is a
defect, not a pattern.

## 8. Do / Don't

| Do | Don't |
|---|---|
| `Add the Filtering Tool` | "In this step we are going to add the filtering tool" |
| "But who fills it in?" as a single pause beat | a question title on every slide |
| "Overselling is a real business problem. You can't ship what you don't have." | abstract claims with no stakes |
| Repeat the title across a build sequence | "Part 1 / Part 2 / continued" |
| `Refresh /admin/. A new "CART" section appears` | a step that never says what you will see |
| ~40 body words per slide | paragraph slides over 120 words |
| `Store Data` | `Store Data.` |
| "Django strikes a strong balance between simplicity and production readiness" | "Django is the best framework" |
| Quote a terminal transcript from the TR doc into a `Terminal` | screenshot a terminal, or invent output |
