# A vs B comparison lab

Four ways of putting one thing next to another, behind one prop contract, so
the user can pick what is worth keeping and the winner gets promoted into the
kit. Nothing in here is a session. The deck renders variants and nothing else.

Slides 1 and 2 are the first round: both trade on reading DIRECTION, row-wise
against column-wise, on identical content. Slides 3 and 4 are the second round,
and they disagree with the first two about something else entirely, which is
what the frame's width is FOR. See "The second round" below.

First of six comparison labs. The other five (`beforeafter`, `proscons`,
`simdiff`, `matrix`, `causality`) borrow this one's finding, so read this file
before starting any of them.

## Why this lab exists

"Here are two things, and here is how they differ" is everywhere in this course:
`docker run` against `docker compose up`, a bind mount against a volume, `let`
against `const`, a list against a tuple. The kit has never designed for it, so
today every one of them is written one of two ways, and both are the absence of
a decision:

1. **A two-column `DataTable`.** The closer of the two and still wrong: a table
   says "these rows are data", and a comparison is an argument.
2. **Two `Card`s side by side.** Worse, for the reason below, and the commoner
   choice because it looks better in review.

## The finding: two independent columns cannot be compared row-wise

This is what the lab turns on, and none of the dozen reference sources surveyed
says it.

Every comparison template in the wild draws option A's points in the left box
and option B's in the right and calls the result a comparison. **Nothing in that
arrangement guarantees that A's third point and B's third point are about the
same thing**, and the moment the two texts differ in length they stop sharing a
line. The reader ends up holding one column in memory while scanning the other,
which is the work the figure was supposed to do for them.

So the unit here is the **attribute**, not the option. A row is one question
asked of both subjects, and the contract cannot express a dangling point that
belongs to only one side. That is a real constraint and it is the point: a claim
true of only one of the two is not a comparison, it is a fact about that one, and
it belongs in prose or in `simdiff-lab`'s three-region figure.

## What the stock advice gets wrong for a lecture

Three rules recur across SlideModel, Deckary, SlideBazaar and the rest, and all
three are written for a sales deck:

- **"Highlight the recommended option."** Deckary: *"bold the column for the
  recommended option"*, *"use a 60/40 split to emphasize the recommended
  option"*. A lecture comparing two commands is recommending neither. There is no
  `recommended` flag on this contract. Emphasis is `tone: 'lead'` on one side, it
  is off by default, and the resolver refuses both sides carrying it.
- **Green and red for the two sides.** Right for a pros-and-cons figure, where
  the columns genuinely are valenced. Wrong here: `docker run` is not the bad
  one, and painting it red teaches that it is. The ramp is `neutral` / `contrast`
  / `lead` and has no `good` and no `risk`.
- **"Balance the two sides."** Advice for an author suspected of bias. It does
  not bind here, because the contract is rows and the two sides are balanced by
  construction.

## The variants

| Variant | The argument | Worst at |
|---|---|---|
| `AttributeSpine` | the attribute sits in a 200px centre gutter and the two answers hang off it, so the ROW is the unit: every row is one question asked of both, the eye crosses the seam because something in the middle names what it is crossing, and a two-line cell pushes its own row taller instead of drifting out of alignment with its partner. The only arrangement here where a row-wise reading is guaranteed rather than hoped for. Holds 3 to 6 rows | it asserts that both subjects HAVE the attribute, so a claim true of one side only cannot be written and the resolver refuses it; and at two rows the gutter is a third of the figure spent on two labels that appear once each |
| `HeadToHead` | two whole panels either side of a hairline seam, each read top to bottom as one thing, for the comparison where the subjects are not parallel and the honest answer is "here is what this one is, here is what that one is". A spine cannot say that: its structure insists every claim be a matched pair | nothing aligns across the seam, so panels with unequal cell heights drift as they descend and by the fourth row the reader is holding one column in memory again. Caps at 3 rows against the contract's 6. Two equal panels also claim the two sides are equally good, which is a statement the content often contradicts |
| `LabelBand` | the attribute on a quiet full-width band with the two answers in equal columns under it, which buys MEASURE: the label costs a line of height instead of a column of width, so both cells go from 476px to 552px. It is also the most symmetric arrangement here, since nothing sits between the two answers and neither is nearer the centre, nearer the label or first | it holds the fewest rows of anything in the lab, about 30px more per row than a spine; and the two answers end up 552px apart edge to edge, so on short cells it has spread two words across the whole frame and spent a line of height announcing it |
| `PairGrid` | each attribute becomes a card holding both answers, and the cards lay across the frame instead of down it, which buys COUNT: six attributes become two rows instead of six. The only variant here that gets BETTER as the attribute count goes up | the answers are capped at 45 characters, because a 370px card has 338px inside it; and a grid implies no order, so a comparison that builds an argument across its rows loses it, since the reader picks the path and there are six of them |

## The second round: slides 3 and 4

`AttributeSpine` and `HeadToHead` both assume the frame's width is for the two
answers and argue only about where the label goes relative to them. Both are
vertical lists, and a vertical list spends HEIGHT on the number of attributes
and WIDTH on the length of the answers.

That is exactly right for one shape of content and exactly wrong for two others,
and neither of the first two variants can tell you so:

- **Cells that need a clause.** At 476px a spine cell holds about 58 characters
  a line, so a 125-character answer is three lines, and a three-line cell makes
  its row half again as tall as the row under it. `LabelBand` moves the label out
  of the middle and onto a band, and the same cell gets 552px and two lines.
- **Six attributes whose answers are a word.** On a spine that is six rows,
  roughly 390px of figure carrying about twelve words, with 476px columns holding
  "Yes". The height is spent on the count and the width on nothing. `PairGrid`
  turns the set ninety degrees: three cards across, two down.

**The resolvers say which is which, out loud.** `AttributeSpine` refuses
`authFixture` and names `LabelBand`; `PairGrid` refuses anything over 45
characters and names it too. Choosing between these four is not a matter of
taste, and the figures are the ones that know.

### The fixtures stop being shared here, deliberately

The sibling labs render one fixture everywhere, because there the variants differ
in geometry alone and identical content is the only honest comparison. Two of
these four differ in what content they are FOR, and a variant built for long
cells cannot be judged on short ones.

So slides 1 and 5 share `dockerFixture`, slides 2 and 5 share `leadFixture`
across two different variants, and slides 3 and 4 carry the sets their variants
exist for. The overlap is what keeps it a comparison rather than four unrelated
demos.

### `authFixture` lost a row to its own variant

It was written with four rows. `LabelBand` refused it: four rows whose cells all
run to two lines is about 424px of rows against a well of roughly 417, and the
refusal said so in those terms. **The row was cut rather than the rule loosened**,
which is the entire point of having the rule.

### One message per fault, not one per ceiling

The shared resolver caps a cell at 140, which is the loosest measure any variant
here offers. Each variant then applies its own: `AttributeSpine` 110 against its
476px half-column, `PairGrid` 45 against its 338px card. Same architecture as
`definitions-lab`, where the shared cap is 340 and `TermGrid` applies 120.

`AttributeSpine`'s check fires only in the 111-to-140 band rather than on
anything over 110. Past 140 the shared resolver has already refused the cell on
behalf of the whole lab, and reporting it twice reads as two faults and sends the
author hunting for a second one that is not there.

### Why the gutter is 200px and fixed

The attribute is capped at 32 characters, about four words, which sets to roughly
180px at 12px uppercase with 0.06em tracking. 200 holds the longest legal
attribute on two lines with air.

Fixed rather than proportional because a gutter that grew with the figure would
put 280px of white between the two answers on a full well, and **past about 200px
apart the eye stops comparing and reads two columns.** On a 1152px well that
leaves 476px a side, and the 110-character cell ceiling is derived from exactly
that number: 110 characters of 16.5px Inter wraps to two lines at 476px.

### Why the attribute is the quietest text on the figure

It looks like it should be the loudest, being the spine. It is scaffolding: it
names what is being compared and gets out of the way, because the things the room
is reading are the two answers. Set at cell weight, the row read as three equal
columns, which is a table.

A known consequence: at the 32-character cap the attribute wraps to two lines in
the gutter and can orphan a word ("WHEN YOU REACH FOR / IT" on slide 1). Shorter
attributes are the fix, and the cap is a ceiling rather than a target.

## The two bugs worth recording

**`h-full` on `FcNodeIn` is where the slack goes.** `FcNodeIn` hard-codes
`h-full` because `AttributeSpine`'s slots sit in a stretching grid and need it.
`HeadToHead` stacks its slots in a flex column instead, and the two panels are
stretched to equal height while their content is not equal, so the first
`h-full` child silently absorbed the leftover space. The left panel had more
leftover, its header card grew, and its rows started **25px below** the right
panel's, on a figure whose entire job is putting two things side by side.

The fix is `style={{ height: 'auto' }}` on those slots, and it has to be an
inline style: `h-auto` in `className` has the same specificity as `h-full`, so
which one wins depends on the order Tailwind happens to emit them in rather than
the order they are written.

**It looked like a rows problem and it was the header.** Fixing the rows alone
changed the symptom without fixing it, and briefly made it worse.

**All three harnesses passed every version.** Every box was inside the frame, out
of the video rectangle and clear of the controls, and the figure was still wrong.
This is content rule 17 exactly: the sweeps measure DOM rectangles, and a figure
whose internal parts disagree passes all of them. The screenshot is the only
reason either bug is known.

## The video rectangle sets where a full-width figure may start

`video-safe.mjs` reserves **x913..1280, y0..220** for the presenter's camera. A
figure that runs the full 1152px well has its right column under that rectangle
by definition, so the only thing it can do is begin below it. `AttributeSpine`
carries `pt-4` on its head row for this reason: without it the right-hand side
head sat at y211 and intruded 101px wide by 9px tall, which is a column header
the room never sees because there is a face over it.

The 16px is paid for by the rows, which run at `py-3` rather than `py-4`. At six
rows, the contract's cap, 16px of row padding put the caption's bottom edge at
exactly y660, the first pixel of the deck's own controls, and `align-check.mjs`
reported the caption as CHROME: in the DOM, measured, and unreadable behind the
slide counter.

## Rules inherited from the sibling labs

- **Every piece of text is real DOM.** An `<svg>` is one rectangle to all three
  harnesses, so `<text>` labels can overlap and pass every sweep. Content rule 17.
- **Every `FcNodeIn` is passed `absolute` or `relative`.** `.fc-node-slot`'s
  `z-index` is ignored on a static element. `pseudocode-lab` shipped without it.
- **Click-gated beats, count derived from props and never from state.** Beat 0 is
  free and carries the two side heads, so the slide never opens empty and no
  click does nothing. The hook is claimed BEFORE the `ProblemPanel` early return:
  a hook behind a return appears and disappears with the props.
- **A row's two halves land together.** Landing column A and then column B would
  show the room every one of A's answers before any of B's, which is the
  contract's own failure reintroduced in time instead of in space. Hard rule 6.
- **Timings come from `figureTiming.ts`** and nowhere else. Explanatory tier:
  520ms entrances on a 130ms stagger.
- **No hover.** A deck is projected into a room where nobody has a pointer.
- **A figure that refuses beats a figure that renders something unreadable.**
  Every check in `resolveComparison` is an authoring mistake that renders as
  something PLAUSIBLE, which is the only kind worth checking. Slide 4 renders the
  refusal rather than describing it, because a refusal nobody has seen is a
  refusal nobody trusts.
- **No arrow between the two sides, ever.** An arrow claims one side turns into
  the other, which is a before/after figure. That is the line between this lab
  and `beforeafter-lab`, where the arrow is the whole point.

## Verification

```bash
npx tsc --noEmit -p tsconfig.app.json
npx vite --port 5243 --strictPort          # the harnesses need it already running
export CHROME_PATH=/usr/bin/brave-browser  # /opt/google/chrome/chrome is not on this machine
node video-safe.mjs    # CLEAN
node qa.mjs            # ALL CLEAN
node align-check.mjs   # 0 of 6 slides need attention
```

Current state: **video-safe CLEAN, qa ALL CLEAN, align-check 0 of 6.**

Three things to know before reading that output:

- **`qa.mjs` prints the literal string `ALL 44 CLEAN`** whatever the deck's slide
  count is. It is a hardcoded string in the kit's own harness, line 96, and every
  lab in `slide-kit` reports it. It means zero issues, not forty-four slides.
- **`tsc --noEmit -p tsconfig.app.json` is NOT clean, and never was.** It reports
  two errors in `src/export/slideModule.tsx`, which imports the generated
  `./deckCss` and `./revealSteps`. Both are gitignored, neither is in the repo,
  and `deckCss`'s generator is missing outright. `definitions-lab` reports the
  identical two errors, so its own CLAUDE.md calling this check "clean" is
  inaccurate. **Two errors is the baseline; anything else is yours.**
- **The single-file build works without the `tsc -b` step**, which is what
  `npm run build:html` fails on:

  ```bash
  npx vite build -c vite.singlefile.config.ts \
    && node scripts/inline-assets.mjs && node scripts/inline-fonts.mjs
  ```

  Then `node preview.mjs && node scripts/build-preview-page.mjs`, which read
  `dist-single/` and so need that build to have run first.

## Nothing here is promoted

Four variants, none of them in the kit. Hard rule 14 wants the user's approval before a
layout moves into `src/ui/`, and a lab is where that decision gets made, not
where it gets assumed. When one or more win, the procedure is section 6 of
`.claude/skills/generate-slides/SKILL.md`: into the kit, exported from the
barrel, added to `sampleDeck.tsx` with a `notes` string saying what it is FOR, a
row in `slide-kit/slide-types/README.md`, and out as a PR on a `kit/` branch,
because `sync-kit.mjs --apply` will push it to every session including signed-off
ones.
