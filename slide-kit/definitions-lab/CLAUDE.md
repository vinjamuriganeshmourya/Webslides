<!-- cSpell:ignore colour colours behaviour lucide NxtWave -->
# Definition-card lab

Ten ways of putting a term next to its definition, behind one prop contract, so
the user can pick what is worth keeping and the winner gets promoted into the
kit. Nothing in here is a session. The deck renders variants and nothing else.

Slides 1 to 5 are the original round, all rendered at three terms. Slides 6 to 10
are the count round: the same question asked at ONE definition and at TWO, which
is where the first round turned out to have no answer. See "The count round"
below.

## Why this lab exists

"Here is a word, and here is what it means" is the **second most frequent thing
any deck in this course does**, after stating a set of points, and the kit has
never designed for it. Session 1 defines image, container, volume and port;
session 7 defines pipeline, stage and gate. Every one of those slides is written
one of three ways, and all three are the absence of a decision:

1. **A `BulletList` item** with the term folded into the claim. The set then has
   no scannable left edge, and the term, the one string the learner has to carry
   out of the room, is set at the same weight as the prose around it.
2. **A `Card` with a `title`.** Closest to right, and it treats the term as a
   heading, which is a different thing: a heading names a section, a term is a
   thing being defined. It also has nowhere to put the example, which for an
   operational term IS the definition.
3. **A two-column `DataTable`.** `DataTable` is used on 27 slides across 5
   sessions, and some of those are a glossary that reached for the only
   structured thing available. A table says "these rows are data". A definition
   is prose.

## `term`, `definition` and `example` are three fields on purpose

`PointsFigureProps` next door carries `label` (the claim) with an optional
`term`, because half its sets are plain claims. Here it is the other way round:
the term is mandatory and it is the subject, not a decoration on a claim.

Splitting them lets a variant align the terms down a gutter, put them on a band,
or set them at display size, and it stops the commonest authoring failure
outright: a definition that opens by repeating its own term ("Polymorphism is
when polymorphism..."), which `resolveDefinitions` reports as a problem.

`example` is a third field rather than part of the definition because for a whole
class of terms it is not an illustration OF the definition, it is the definition
and the prose is the caption. "Idempotent" is three sentences of philosophy or
one line of `PUT /users/7` twice.

## The variants

The first round, slides 1 to 5, all at three terms:

| Variant | The argument | Worst at |
|---|---|---|
| `TermLede` | no card at all: a box around prose spends 144px of a three-term row on containers, and this variant spends it on words instead, so the definition gets the widest measure in the lab and the term gets display size rather than heading size | nowhere to put an example and nowhere to anchor a glyph, so it renders neither; and three columns of prose cannot be stretched to equal height, so the row has a ragged bottom edge |
| `GlyphAnchor` | the only variant that answers the three-second question: a bolt, a shield and a database are recognised before the eye focuses, so the room arrives knowing there are three KINDS of thing here, and "the one with the bolt" is a thing an instructor can say | the 56px header costs the definition a line, so the example only renders at two terms or fewer; and a set with no honest glyphs falls back to three lettered boxes, at which point `TermLede` says the same thing with more room |
| `BandSplit` | two grounds rather than two type sizes, which says what type size cannot: the term is a LABEL and the definition is content. A row of bands scans like an index, and the term cannot be crowded by a long definition | three saturated bands are three shouts, so the tone ramp's job of saying which term the frame is about is drowned; and a term that wraps makes one band taller and the row of labels stops being a row |
| `WorkedExample` | for the terms where the example is the definition. The only variant that gives it real estate, and a row rather than a card because a mono line of 50 characters needs 405px and a third of the well is 384 | the tallest variant here, three rows is the ceiling at 415px against a 440px well; it demands an example for every term; and stacked rows cannot be scanned, which is what `BandSplit` is for |
| `TermGrid` | the only variant that survives a six-term recap. Card gone, and only the two things a dense set needs kept: a scannable left edge for the terms and one hairline per row | it is a handout, and the deck's rule is one idea per slide. Six definitions is six ideas and this makes it look tidy, which is what makes it dangerous. Right for a RECAP, wrong for introducing anything |

## The count round: slides 6 to 10

Every variant in the first round lays its terms out as `repeat(n, 1fr)`. That is
one arrangement stretched to whatever count it is handed, and each is genuinely
designed for exactly one of them: three, the count the shared fixture carries.

Handed ONE term the same code draws a single card 1152px wide. The definition
gets about 150 characters a line, double the point at which prose stops being
readable, and the 56px glyph becomes 1.5% of the card. Handed TWO it draws
three-column proportions with a column missing. Nothing in `resolveDefinitions`
catches either, because nothing is wrong with the content: the figure renders, it
is tidy, and it cannot be read from the back of a room, which is the failure this
lab keeps writing checks for.

So slides 6 and 7 are `GlyphAnchor`'s design re-composed for each count, and
slides 8 to 10 are three new box treatments. All five take slide 2's hierarchy,
sizes and reading order unchanged; what differs is the geometry and, in the last
three, what the box IS.

| Variant | Count | The argument | Worst at |
|---|---|---|---|
| `GlyphAnchorSolo` | 1 | slide 2 turned ninety degrees: a stacked header has only one axis to give and at one term the spare axis is width, so the header becomes a 440px column, the glyph doubles to 112px, the term finally gets display size at 40px, and the definition takes 535px at 20px | one term only. Two of these stacked is 660px against a 440px well |
| `GlyphAnchorPair` | 2 | the glyph leaves the header and becomes a 72px rail, which costs no height at all, and the 70px it was spending goes to the example. 424px of measure is the first width in the lab at which slide 2's design can show the example | two cards is the most symmetrical arrangement there is, and symmetry claims the two terms are equal, which for a pair is usually the opposite of the point |
| `MedallionPlate` | 1, 2 | the mark goes ON the boundary: a disc straddling the top edge is a silhouette, recognisable before any content is, and it earns the plate the right to be narrower than the well, which is the only way a single column gets a readable measure at one term | no example zone, so two plates cannot end level: with nothing to floor, a short definition just leaves about 75px more white under it |
| `SidePanel` | 1, 2 | `BandSplit`'s two grounds turned ninety degrees. A panel is sized by the CARD's height, not the term's, so it holds a glyph and a gloss as well as the word, and a painted third is a statement rather than a stripe every card has | the loudest layout here, and loud is a claim. A third of the card in saturated blue says this term IS the frame, false the moment there are two ordinary ones |
| `TabFrame` | 1, 2 | the term leaves the box and sits on a tab straddling the border, as a legend sits on a fieldset. Nothing inside then has to be told apart from anything else inside, which is what lets one definition put its prose and its example in two columns | a tab is a corner, so two frames read as step one and step two. It also wants an example: with the term outside, a frame holding only prose is a rectangle with a paragraph in it |

**Each of the five refuses the counts it was not composed for**, with a measured
reason rather than a shrug: `GlyphAnchorSolo` at 3 says its left column alone is
440px of 1152, `TabFrame` says a tab carrying a glyph and a term needs about 200
of a 368px frame and a label that wide is a title bar.

### The two things the count round changed in shared chrome

Both additive, both used only by the new five, neither touching an existing call
site:

- **`Term` gained `invert`.** `SidePanel` and `TabFrame` set the term on its own
  paint, where `ink` is illegible and white is the only choice there is.
  `BandSplit` needed the same thing and hand-rolled its own heading, which is a
  second place for the face, the weight and the tracking to drift.
- **`Definition` gained `lg`, at 20px.** 16.5px is sized for a card a third of
  the well wide, where the constraint is how much fits before the card outgrows
  its neighbours. A frame carrying one term has no neighbours, and 16.5px is then
  the smallest thing on a slide with nothing else on it.

### The one bug worth recording

`MedallionPlate` and `TabFrame` both hang part of themselves above their own box,
and both first reserved that overhang as a `marginTop` on the card. **The margin
collapsed straight through the `FcNodeIn` wrapper**, which has no border and no
padding of its own: the wrapper moved down instead of the card moving inside it,
the wrapper's height never grew, and the card hung past the bottom of the figure
and painted over the set caption. The caption was in the DOM, measured, and
invisible, so no harness reported it.

The fix is `paddingTop` on the wrapper, which cannot collapse. Anything in this
lab that draws outside its own box reserves the space as padding on the motion
slot, never as a margin on the thing inside it.

## `TermGrid` refuses the shared fixture, and that is the most useful result here

Every other variant renders `csTermsFixture`. Handed the same three terms,
`TermGrid` returns a `ProblemPanel`: the race condition's definition is 229
characters and memoization's is 196, against this variant's own ceiling of 120,
which is two lines at 420px of measure. Four lines makes one row twice the height
of the row beside it and the rows stop scanning, which is the only thing the
variant has.

So `TermGrid` is **not a denser alternative to the card variants**. It is a
different job: a recap of words the room has already met, in the short form they
were reduced to. Slide 5 renders `glossaryFixture`, six terms, which is the case
it exists for and the exact number `resolveDefinitions` caps at.

## The tone ramp has three stops, not the points lab's four

`neutral`, `new` and `contrast`. No `good` and no `risk`: a point is a CLAIM and a
claim can be good news or a trap, but a term is a word, and a word is neither. Two
stops of paint with nothing behind them is how a deck ends up with five blues that
mean nothing.

`new` is the term the frame exists to introduce, in the deepest brand blue, the
same stop `points-lab` gives its lead. `contrast` is a term that exists to be told
APART from the one beside it, which is a whole genre of slide in this course, and
it takes the style guide's teal so the pair reads as two things rather than as two
weights of one thing.

## No hover, anywhere, and it is the one deliberate departure from the siblings

Every sibling lab ships a `HoverAside`: a card lifts on `:hover` and opens a 300px
popover carrying the point's `detail`. **This lab has none, and no `detail` field
on its contract to put in one.**

A deck is projected into a room where nobody has a pointer. Content reachable only
by hovering is content the people the slide was made for never see, and the one
person who does have a pointer is the presenter, who already knows what the card
says. So a definition card carries everything it has to say on its face, and what
would have hidden behind a hover goes either into the card at `exampleNote` size
or into the slide's speaker notes.

The knock-on is that this lab needs none of the machinery the hover required: no
`.fc-node--hoverable`, no `:has()` slot raise, no "never in the DOM unless open"
rule, and no 0.18s UI-tier exception to the timing scale. Every duration here
comes from `figureTiming.ts`.

## Height is CSS, not arithmetic, and that is the other departure

`points-lab`, `flowchart-lab` and `pseudocode-lab` all compute their stage height
in pixels from the fixture's longest string, and state the arithmetic in the doc
comment. That is right for a figure laid out on an absolute stage, where a box's
height has to be known before its neighbours can be placed.

It is the wrong tool here, and the requirement that says so is this lab's own: **a
definition card has to survive a one-line definition and a three-sentence one
without breaking.** An estimate from `label.length * 9.4` cannot promise that. So
these variants lay out in CSS grid and flex with `items-stretch`, and the
resolver's job is to refuse content that will not fit rather than to guess how tall
it is.

The sibling rule that DOES carry over is the one behind the arithmetic: **padding
is a floor, not a declaration.** Nothing here subtracts from a declared padding,
because nothing is fighting a fixed height for room.

## Rules inherited from the sibling labs

- **Every piece of text is real DOM.** An `<svg>` is one rectangle to all three
  harnesses, so `<text>` labels can overlap and pass every sweep. Content rule 17.
  `ExampleBlock` splits its snippet on the newline and renders one span per line
  for the same reason: one `<pre>` three lines tall is indistinguishable, to
  `align-check.mjs`, from one line that wrapped three times, and both examples
  were reported as WRAPPED until they were split.
- **Every `FcNodeIn` is passed `absolute` or `relative`.** `.fc-node-slot`'s
  `z-index` is ignored on a static element. `pseudocode-lab` shipped without it.
- **Click-gated beats, count derived from props and never from state.** Beat 0 is
  free and carries the first card, so the slide never opens empty and no click
  does nothing. The hook is claimed BEFORE the `ProblemPanel` early return: a hook
  behind a return appears and disappears with the props.
- **Timings come from `figureTiming.ts`** and nowhere else. Explanatory tier:
  520ms entrances on a 130ms stagger.
- **A figure that refuses beats a figure that renders something unreadable.**
  Every check in `resolveDefinitions` is an authoring mistake that renders as
  something PLAUSIBLE, which is the only kind worth checking.

## Verification

```bash
npx tsc --noEmit -p tsconfig.app.json      # clean
npx vite --port 5228 --strictPort          # the harnesses need it already running
export CHROME_PATH=/usr/bin/brave-browser  # /opt/google/chrome/chrome is not on this machine
node video-safe.mjs    # CLEAN
node qa.mjs            # ALL CLEAN
node align-check.mjs   # 0 of 10 slides need attention
```

Two things to know before reading that output:

- **`qa.mjs` prints the literal string `ALL 44 CLEAN`** whatever the deck's slide
  count is. It is a hardcoded string in the kit's own harness, line 96, and every
  lab in `slide-kit` reports it: `points-lab`'s `CLAUDE.md` quotes the same "ALL 44
  CLEAN" against a three-slide deck. It means zero issues, not forty-four slides.
- **`tsc -b` fails repo-wide** on `src/export/slideModule.tsx`, which imports the
  two generated files `./deckCss` and `./revealSteps`. Both are gitignored and
  neither is in the repo, and `deckCss`'s generator is missing outright, so
  `npm run typecheck` and `npm run build:html` cannot pass in any session or lab
  here. `tsc --noEmit -p tsconfig.app.json` is the check that works, and the
  single-file build works without the `tsc -b` step:

  ```bash
  npx vite build -c vite.singlefile.config.ts \
    && node scripts/inline-assets.mjs && node scripts/inline-fonts.mjs
  ```

## Nothing here is promoted

Ten variants, none of them in the kit. Hard rule 14 wants the user's approval
before a layout moves into `src/ui/`, and a lab is where that decision gets made,
not where it gets assumed. When one or more win, the procedure is section 6 of
`.claude/skills/generate-slides/SKILL.md`: into the kit, exported from the barrel,
added to `sampleDeck.tsx` with a `notes` string saying what it is FOR, a row in
`slide-kit/slide-types/README.md`, and out as a PR on a `kit/` branch, because
`sync-kit.mjs --apply` will push it to every session including signed-off ones.
