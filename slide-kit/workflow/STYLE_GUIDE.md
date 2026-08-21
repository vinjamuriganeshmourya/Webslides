# NIAT slide writing style, derived from sample_ppts

> **Superseded in part.** `TEXT_GUIDELINES.md` is the fuller cut of this
> corpus analysis and `PEDAGOGY_GUIDELINES.md` covers sequencing. Keep this file
> as the quick reference; prefer those two where they go deeper.

> ## ⚠️ Read `.claude/skills/slide-content-rules/SKILL.md` first
>
> That file holds the **hard content rules** recorded from explicit user
> corrections, and **it overrides this document wherever they disagree**.
> The overrides that bite most often:
>
> | This guide says | The rule says |
> |---|---|
> | "Em-dash for the reveal beat (~1 per 3 slides)" (§5) | **Never use a spaced em dash** in any rendered string. Use a comma, colon, full stop or parentheses. |
> | "2–4 content slides per concept" (`SLIDE_WORKFLOW.md`) | A numbered series the learner weighs individually gets **one item per slide**, even past 4. |
> | — | Never say **stranger**; say *others*. |
> | — | Commands render in a **VS Code `Terminal`** with the prompt path, one panel per terminal. |
> | — | A later problem is **named, never opened**: no tools, no stages, and not greyed out. |


Derived by corpus analysis of **all 23 decks in `Web Slides/slide-kit/sample_ppts`**
(1,274 slides, 12,960 body lines). Every number below is measured, every
example is verbatim from the corpus. Use this with `SLIDE_WORKFLOW.md` and
`DESIGN_GUIDE.md` when writing any session deck.

## 1. The text budget (per slide)

| Measure | Median | p90 (soft ceiling) |
|---|---|---|
| Title length | **2 words** (mean 2.5) | 5 words |
| Body words per slide | **37** (mean 50) | 117 |
| Bullets/lines per slide | **10** | 24 |
| Words per bullet | **3** (mean 4.4) | 10 |

Rule of thumb: **a slide is ~40 words of body**; a bullet is a **3–6 word
fragment**, not a sentence. 79% of all body lines are ≤6 words.

## 2. Sentence usage — fragments carry the deck, sentences carry the "why"

- **Default unit = the fragment**: `Add the is_prime field` · `Click Send button` · `Add to cart`. No trailing period on fragments.
- **Full sentences are rationed** (~1 in 5 lines) and reserved for *stakes,
  cause→effect, or a rule*:
  - "The access token is used everywhere, so it could get stolen. Making it expire in minutes means a stolen one is useless almost immediately."
  - "Overselling is a real business problem — you can't ship what you don't have."
  - "We need rules about who is allowed to do what and how."
- **Imperatives drive doing-slides**: Open / Run / Create / Add / Click /
  Refresh / Notice / Remember. Steps read as commands, often with the arrow
  pattern: `Add "Kindle" twice → two separate lines instead of one.`
- **Questions are a beat, not a habit**: only 2% of titles are questions, but
  short body questions create the think-pause: "But who fills it in?" ·
  "When is create_user() called?" · "Remember calling APIs in React using fetch()?"

## 3. Tone — a teacher talking, not a document

- **Second person + first plural**: you/your (7.6/1000 words) and we/our
  (9.9/1000) everywhere. "We built our ProductList…", "you can't ship what
  you don't have."
- **Concrete, everyday analogies**, introduced with *Picture / Imagine /
  Think of / like a*: "Picture a real supermarket. You're pushing a trolley
  and you grab a second identical tin of beans. What happens?" ·
  "django-filter is like a power tool you bolt onto DRF. Plug it in once,
  use it anywhere."
- **Anti-magic explanations**: "self.list() is not magic. Here is the real
  code that lives inside ListModelMixin." Show the mechanism, never hand-wave.
- **Name the trap**: "Skipping that one line is the #1 beginner trap. An
  unregistered app is invisible."
- **Observed results are narrated**: "Refresh /admin/ — a new 'CART' section
  now appears in the sidebar." Every action states what the learner will see.

## 4. Titles

- **2–3 words, topic-bare**: `Testing` · `Update` · `Virtual Environment` ·
  `Django App` · `Seller Logic`. Long descriptive titles are rare (p90 = 5 words).
- Fixtures recur verbatim across decks: **`Quiz Time!`** (31×), `Test it` (14×).
- A slide *sequence* keeps the **same title across consecutive slides**
  ("Manual HTML Form" appears 31×) — continuation is signaled by the repeated
  title, not "part 2".
- Questions (2%) and exclamations (4%, essentially only "Quiz Time!" /
  "Let's …!") are accents, not defaults. Colon titles are almost absent (0.5%).

## 5. Punctuation habits

- **Arrow `→`** for cause/effect and click-paths: `Open Postman → click New Request`.
- ~~**Em-dash** for the reveal beat (~1 per 3 slides)~~ **SUPERSEDED: em dashes are banned.** The corpus uses them, our decks do not. Write the reveal beat with a full stop or a colon: "Refresh /admin/. A new section appears."
- **Exclamation marks are rare** (0.1/slide) — reserved for the fixtures.
- Inline code voice: file paths, commands, and identifiers appear as-is
  (`products/serializers.py`, `create_user()`), never paraphrased.

## 6. Per-slide-type text patterns

| Slide type | Text pattern |
|---|---|
| Divider | bare 1–3 word section name (occasionally a short question) |
| Concept slide | 3–6 fragment bullets + at most one full "why" sentence |
| Analogy slide | 1–2 sentence scene ("Picture a real supermarket…") then the mapping |
| Step/doing slide | numbered imperatives, each with the observable result (`Run … → boots clean`) |
| Code slide | the code + one narration line of what it does; "Test it" follow-up slide |
| Quiz | title `Quiz Time!`, one short question, short options |
| Recap | section names / takeaways as 4–8 word pills |

## 7. Do / Don't (from the corpus)

| Do | Don't |
|---|---|
| `Add the Filtering Tool` | "In this step we are going to add the filtering tool" |
| "But who fills it in?" (pause beat) | question-titles on every slide |
| "Overselling is a real business problem — you can't ship what you don't have." | abstract claims with no stakes |
| Same title repeated across a build sequence | "Part 1 / Part 2 / continued…" |
| `Refresh /admin/ — a new "CART" section now appears` | steps that don't say what you'll see |
| ~40 body words/slide | paragraph slides (>117 words = corpus p90 breach) |
