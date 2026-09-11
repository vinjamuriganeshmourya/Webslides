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
> | "at least five content slides per concept" (`SLIDE_WORKFLOW.md`) | A numbered series the learner weighs individually gets **one item per slide**, even past 4. |
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

## 8. The form comes from the argument, not from a default

A grid of cards is the shape a "several things" slide reaches for by default.
Five or six `Card`s, all the same size, the same white, the same tone, each with
an icon and two lines, and it reads as a table someone drew boxes around: nothing
leads, nothing has rhythm, and the room takes it in as one grey mass.

This was corrected twice on the same slide of the first Python session, and the
second correction is the important one.

1. *"All cards having same design, it is not visually appealing."* The first fix
   varied the tiles: one spanning two columns, three depths of the one accent,
   numbered, revealed as build steps. Better, and still cards.
2. *"Instead of cards you can use a different design altogether. Why should we be
   constrained to cards?"* Correct, and it is the real rule.

**Ask what the slide ARGUES, then pick the form that draws that argument.** A
grid draws "n things of equal weight" and nothing else, so it is right only when
that is the whole claim.

| The argument | The form | In the kit |
|---|---|---|
| One thing reaching into many places (breadth, reach, applications) | a hub with spokes | `RadialSpread` |
| A set of answers whose NAMES are the content (roles, options, outcomes) | set as type: a rule between rows, a number in the gutter, no boxes | `EditorialList` |
| Rows that each carry a verdict | a list with status rails | `StatusList` |
| An ordered procedure | numbered steps | `StepList` |
| A process with branches | a flow | `FlowChart` |
| Things at different depths of one system | stacked layers | `LayerStack` |
| Two or three items compared side by side | a uniform row, where sameness IS the point | `CardGrid` |

Two consecutive slides that both argue "many things" must not use the same
figure. The second one then reads as the first one again with different words.

**And do not invent structure the content does not have.** A four-item list drawn
as a quadrant claims two axes; drawn as a segmented bar it claims proportions;
drawn as a flow it claims an order. If four things are genuinely just four
things, a plain typographic list is the honest form, and reusing that form on a
second such slide is better than inventing a diagram that lies about one of them.

**Numbering is the quietest way to break that rule.** `01 Python Developer`
through `06 Software Developer` claims a rank or a sequence that six job titles
do not have, and it slips through review because it looks like tidiness rather
than a claim. This was caught by the user on the same deck, one slide after the
card grid: *"the numbers are present but it shouldn't have numbers as per
content."*

So: **number a set only when you can say what the number means.** Ordered steps,
a ranked list, or a run the room is being walked through where "three to go" is
useful pacing (content rule 5's `Attempt 3 of 5` kicker is exactly this, and is
right). An agenda is numbered because the session runs in that order. A list of
roles, fields, tools or benefits is not. `EditorialList` and `FeatureTiles`-style
components should therefore default `numbered` to **off**, so the claim has to be
made deliberately.

**Give the set a build.** A grid that arrives complete is a grid the room reads
ahead of the instructor; the same set arriving one item per click is n beats of a
talk. This is the one place a `Step` belongs on a supporting visual, and it does
not conflict with hard rule 6: rule 6 is about a visual that SUPPORTS text
arriving after that text. When the items ARE the content, no text is waiting.

---

## 9. Surfaces are lit. Flat boxes are the default that has to be argued away

A figure is a drawing of objects, and an object has a thickness. A rectangle
with a 2px border and one flat fill is not an object, it is a region, and a
figure built out of regions reads as a diagram of a diagram. The room sees a
wireframe where it should see a thing.

**Every panel, tile, box and boundary in a figure carries a light source, and it
is the same light source across the whole deck: top-left.**

### The recipe

Four parts, always in this order. They compose; dropping one is what makes a
surface look *almost* right.

```tsx
style={{
  background: [
    // 1. the highlight: a soft white radial parked at the top-left corner.
    //    This is what makes it read as LIT rather than as a two-tone fill.
    'radial-gradient(120% 100% at 14% 0%, #FFFFFF99 0%, #FFFFFF00 62%)',
    // 2. the ramp: 135deg, and it must travel far enough to see.
    `linear-gradient(135deg, ${light} 0%, ${mid} 52%, ${dark} 100%)`,
  ].join(', '),
  boxShadow: [
    // 3. the drop shadow, TINTED WITH THE SURFACE'S OWN COLOUR, never black.
    `0 3px 10px -4px ${accent}59`,
    // 4. the two hairlines that give the box a thickness:
    'inset 0 1px 0 0 #FFFFFFb3',      //    white along the top edge
    `inset 0 -1px 0 0 ${accent}2e`,   //    the accent, darker, along the bottom
  ].join(', '),
}}
```

- **The tint, not black.** A neutral shadow under three differently-coloured
  tiles makes all three the same object with different paint. A shadow in each
  tile's own accent is what lets a brand tile and two teal tiles tell each other
  apart at the back of a room.
- **The ramp has to travel.** `brand` to `brandDark` across a 44px-tall box moves
  too few pixels to register from ten metres, and the first pass at `LayerStack`
  shipped exactly that: at 3x zoom it still read as a flat slab. A solid fill
  starts *above* the base colour (`#4C7AFD` is `brand` lifted ~12%) and lands on
  `brandDark`, so the box travels a real distance corner to corner.
- **Amplitude follows the job, structure does not.** A tint carrying dark text
  gets a gentler ramp than a solid carrying white, or it looks stained rather
  than lit. But every state keeps all four parts. Lighting one state and leaving
  its neighbours flat reads as two figures, not as emphasis.
- **Flatter means less light, never no light.** The state that should recede
  keeps its hairlines and drops only the shadow. `LayerStack`'s `host` layer is
  the reference: it is someone else's machine, so it sits flatter than what
  travels.
- **Text on a ramp needs help.** A label that read fine on a flat fill goes muddy
  at the dark end. A lit surface gives its label a `textShadow` and gives a muted
  note its own tint rather than a flat `opacity`.

### Where the accent tints come from

`src/design/tokens.ts`, with an alpha suffix, exactly as above. The one accepted
literal is a tint *above* the base colour, because the palette only ramps darker
(`brand`, `brandDark`, `brandDeep`) and minting a token for one figure's
highlight is the tail wagging the dog. Comment it where you write it.

**Why this rule exists.** The whole treatment was worked out on
`deployement_session_1_v3`, applied to `MachineBoundary`, `LayerStack` and
`ContainerJourney` there, and then **left in that session**. The kit copies stayed
flat, so sessions 2 through 7 all shipped flat figures, and the session 4 review
came back with *"the container depth is missing, all are very flat"* — a whole
deck's worth of rework for a recipe that already existed and had never been
promoted. This is section 6 of the generate-slides skill, and it is the rule this
repo most often breaks.
