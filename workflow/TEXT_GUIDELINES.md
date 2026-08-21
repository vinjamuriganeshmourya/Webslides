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
