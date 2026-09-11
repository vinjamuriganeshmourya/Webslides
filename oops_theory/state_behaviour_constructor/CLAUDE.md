<!-- cSpell:ignore NxtWave behaviour colour colours devPort unDraw Havells memberId borrowedBooks displayInfo borrowBook lucide -->
# State, Behaviour & Constructor · session notes

OOPs Theory, session 2. Converted from `Reference ppt's/2. State, Behaviour &
Constructor.pdf` and its identical `session2.pptx` (59 source slides) to a
**57-slide** deck, from the plan at
`../session_plans/state_behaviour_constructor/plan.md` (signed off 2026-09-11 on
decisions A and B of its §9).

This file holds the decisions specific to THIS deck. The repo-wide rules are in
`../../RULES.md`; `KIT.md` arrived with the scaffold and still describes the base
template, not this session.

---

## The one thing that makes this deck different from every other one here

**No programming language is named anywhere in it.** The source teaches OOP in
pseudocode, and that is the point rather than an omission: `NEW Book(...)` is not
Python, Java or JavaScript. The knock-on is that four hard rules have nothing to
bite on, and none of them is satisfied by accident:

| Rule | Why it does not apply |
|---|---|
| 3, one panel per terminal with its path | no command is ever run, so there is no `Terminal` in the deck |
| 11, screenshots cropped and highlighted | nothing was run, so there is nothing to capture, and `public/shots/` is empty |
| 12, a named technology carries its logo | no technology is named. `public/assets/tech/` is unused |
| the "run it and paste what came out" rule | there is no interpreter for pseudocode. See §3 |

If a future session in this course moves to a real language, all four come back
at once.

---

## Decisions made while generating, and why

### 1. Five labs are used, one is not, and the one that is not is a finding

The deck's figures come from the `slide-kit` labs, chosen per content type.
Plan §5 has the full table with the reasoning; the short version:

| Lab | Variant | Slides |
|---|---|---|
| `definitions-lab` | `TermGrid` | 3 |
| | `TermLede` | 8, 14 |
| | `BandSplit`, both `tone: 'contrast'` | 31 |
| `points-lab` | `RuleStack` | 20, 22, 44 |
| | `PeerCards` | 15, 47 |
| | `LeadAndRest` | 35, 46 |
| `pseudocode-lab` | `LineAnnotated` | 10, 16, 24, 26, 29, 36, 38, 39, 48, 49, 50 |
| | `TraceTable` | 33, 34, 41 |
| `features-lab` | `EditorialList` | 13 |
| | `LayerAnatomy` | 43 |
| `flowchart-lab` | `GateFlow` | 37 |

**`projectcode-lab` is deliberately unused.** `TourStops`, `CallFlow` and
`LayerMap` answer "where does this live, and what calls what" across many real
files. This session has no project on disk: every exhibit is one class in
pseudocode. `LayerMap` here would invent an architecture the content does not
have, which `STYLE_GUIDE.md` §8 names as the worse lie. That is a result about
the lab, not a gap in the deck.

### 2. Eight pseudocode lines is a hard ceiling, and it reshaped the deck

`LineAnnotated`'s stage is 400px. The frame costs 96px (28 padding, 22 header,
12 gap, 8 caption gap, 26 caption) and a row is 34px, so **nine lines is 306px
against 304px of room and the figure refuses to draw**. A note that fits one
line at 82 characters costs nothing extra; a note that wraps costs 20px.

The source's listings run to twelve and fourteen lines. They are therefore split
one method per slide, which is why this deck has `borrow()`, `returnBook()` and
`display()` on three separate frames where the source had two. That is hard rule
5 arriving by a different door, and it reads better than the source does.

**If you add a line to any `LineAnnotated` on this deck, count the lines first.**
The failure mode is a red `ProblemPanel` where the figure was, which is loud, but
it is loud at render time and not at typecheck time.

`TraceTable` has its own two, both tighter than they look: **eight pseudocode
lines** and, with two variables, about **18 characters per value**. Three
variables drops that to 11, which does not hold `"Harry Potter"`. Slides 33, 34
and 41 all carry exactly two variables for that reason.

### 3. The output is a dry run, and the slides say so

`CodeOutput` (§4) renders "this code, and what it printed". Its own header, from
the Python session, says every string passed to `output` was produced by running
the snippet on CPython 3.12. **Nothing here was executed, because pseudocode has
no interpreter.**

So `output` here is the dry run of the pseudocode on the same slide, read line by
line, and both panes are labelled **"What it prints"** rather than "Output" so
the frame does not claim a run that did not happen. Every printed line traces to
a `PRINT` statement shown earlier in the deck, and the five Member lines on slide
51 match the source deck's own stated output.

That is the honest form of rule 10 for content that cannot be run. It is not a
licence to compose plausible output: if a `PRINT` changes, the printed line
changes with it.

### 4. Three components were built here and are now in the kit

They were built under `src/ui/trial/`, approved on review, and promoted through
section 6 of the generate-slides skill: into `slide-kit/slide-template/src/ui/`,
onto the `@/ui` barrel, into `sampleDeck.tsx` with a `notes` string, into
`slide-kit/slide-types/README.md`, and out as a PR. **This session keeps no
private copy of any of them**, which is the part of that procedure that gets
skipped and the reason two copies drift.

| Now in the kit | What it is |
|---|---|
| `ObjectState` + `ObjectStateRow` | a named thing and the values it holds right now, with a `changed` mark on the row that moved. Eleven slides here |
| `StateChange` | two `ObjectState` cards and the one operation that ran between them. Which rows moved is computed, never authored |
| `CodeOutput` | built in `python_programming`, copied here, and that second copy is what triggered the promotion |

What remains on trial is `src/ui/trial/definitions/`: five variants from
`slide-kit/definitions-lab`, which has picked no winner. This deck exercises
`TermGrid`, `TermLede` and `BandSplit` and is evidence for whichever wins.

`ImageBreaker.tsx` is **gone**. It existed only because the kit's image divider
could not clear the instructor-video rectangle, and that is now fixed in the kit
itself. See §5.

### 5. `SectionBreakerImageSlide` could not clear the video rectangle, and this deck is why it now can

The kit type puts its hero visual in the right column of a
`grid-cols-[1.1fr_1fr]` row, centred and capped at `max-h-[24rem]`, with an
`h-80 w-80` blurred disc behind it. On the 1280x720 stage that is the image at
x=686..1216, y=160..544 and the disc at x=791..1111, y=192..512. The
instructor-video rectangle is x=913..1280, y=0..220, so both intrude, by **303px
at worst**, on **every slide of that type**:

```
slide  5  <State>  2 hit(s), worst 303px in
      img @686,160 530x384   "Toggle switches, each showing its current po"
      surface @791,192 320x320
```

`align-check.mjs` then reported the same five slides again as DRIFT, because a
column starting at x=686 is neither on the header datum nor centred.

**Neither was reachable from a slide's props.** A very wide asset does lower the
image, but the disc was a fixed 320x320 in the component. No combination of props
passed, which made it a kit defect rather than a content mistake.

**Fixed in the kit**, not worked around here: `SectionBreakerImageSlide` now puts
the copy on the header datum and the art in a fixed 460x264 box centred beneath
it, which clears the rectangle for any asset and satisfies the alignment datum at
the same time. This deck uses the kit type. Only the gallery and the superseded
`deployement_session_1_v1` rendered the old layout, so the visual change reaches
almost nothing; the PR names them.

One trap found while fixing it, and it is the same one that hid the missing
divider art in this session (§6): the first cut used `w-auto`, and **both** things
that can go in that box lack an intrinsic size. An illustration renders a `Scene`,
a relative div positioning its parts absolutely, which collapses without a width;
and an `<svg>` with a viewBox and no `width`/`height` has a ratio but no size. The
box is declared for that reason, and the two branches take different classes.

### 6. Three label-measurement defects, all found by rendering rather than by reading

Content rule 17, and all three passed `tsc` and looked fine in source:

1. **`PeerCards` always draws its 34px icon tile**, filled or not, so the first
   pass rendered three blank discs on slides 15 and 47. Every card now carries an
   icon. `book` and `devices` are honest; `lock` for a bank account is loose, and
   it is there because three blank tiles is worse than one loose glyph. The right
   fix is a `wallet` glyph in `src/ui/icons.tsx`, which is a kit change.
2. **`align-check.mjs` counts a mono label's lines as `height / lineHeight`**, so
   `ObjectState`'s identity band, being a padded div with the text directly
   inside it and no stated line height, measured as two lines and every object
   card in the deck was reported `WRAPPED  one token over 2 lines: "Book"`. The
   text is now its own span with an explicit line height.
3. **`CodeOutput` rendered its whole output as one `<pre>`**, which is one mono
   leaf four line-heights tall and indistinguishable, to the same check, from one
   token that wrapped four times. It now renders one `<pre>` per line, which is
   what `definitions-lab`'s `ExampleBlock` does and for the same reason. Leading
   spaces survive: each line keeps `whitespace-pre`.

A fourth, same family: **`align-check.mjs` treats a `·`-joined string as one
token**, so a method list that legitimately runs to two lines in a card is
reported as a wrapped label. Card bodies in this deck use commas.

### 7. Where the deck diverges from the source

| Source | Here | Why |
|---|---|---|
| recap over three slides (2, 3, 5) | one, `TermGrid`, six terms | the three say the same six words |
| five agenda items | four, and the library project keeps a divider with no agenda line | hard rule 20 caps the agenda at four and makes Key Takeaways restate it verbatim. Plan §9 decision A |
| fan slides sit before any divider | the fan's values open concept 1, its actions open concept 2 | a slide before the first divider has no concept to put in its kicker, which rule 19 needs |
| "Running It Step by Step" over four slides | a question beat, one `TraceTable`, one output frame | four frames that redraw two unchanged cards three times |
| `this` over six slides, two of them repeats | five | source slides 36 and 37 restate 35 |
| twelve and fourteen line class listings | one method per slide | §2 |

**Corrected silently:** `charegeBattery()` to `chargeBattery()`, `makecall()` to
`makeCall()`, `"clear"` to `"Clear"` on source slide 37. Source slide 3's kicker
reads "EER Modeling Concepts", which belongs to a database course; the recap
drops it.

### 8. Assets: five unDraw illustrations, open licence, no logos

Fetched into `slide-kit/assets/illustrations/` first (hard rule 13) and copied
here byte-identical. That folder's `README.md` records the licence, the two
changes made to each file (a light plate, and the accent recoloured to
`colors.brand`), the divider each one serves, and the six candidates that were
fetched, looked at and rejected.

Nothing else is fetched. Icons are `src/ui/icons.tsx`, drawn in this repo, with
`lucide-react` (ISC) already behind it for the lucide picks.

**Asset paths are literal strings, never built.** `scripts/inline-assets.mjs`
finds an asset by scanning the bundle for its path TEXT, so a path assembled at
runtime is not in the bundle and cannot be inlined. `const ART` at the top of the
deck file holds five literals for that reason.

---

## Running it

```bash
npm install                       # or: ln -s ../../slide-kit/slide-template/node_modules node_modules
npx vite --port 5240 --strictPort
npx tsc --noEmit -p tsconfig.app.json
```

**`npm run typecheck` and `npm run build:html` cannot pass in this repo**, and
that is pre-existing rather than something this session introduced. `tsc -b`
fails on `src/export/slideModule.tsx`, which imports the two generated files
`./deckCss` and `./revealSteps`; both are gitignored, neither is in the repo, and
`deckCss`'s generator is missing outright. `definitions-lab/CLAUDE.md` records
the same thing. So:

```bash
npx tsc --noEmit -p tsconfig.app.json          # the correctness check that works
npx vite build -c vite.singlefile.config.ts \
  && node scripts/inline-assets.mjs && node scripts/inline-fonts.mjs
```

which produces `dist-single/state-behaviour-constructor.html`, the deliverable.

`CHROME_PATH` on this machine is `/usr/bin/brave-browser`. There is no Chrome at
`/opt/google/chrome/chrome`, which is what every other session's notes assume.

```bash
export CHROME_PATH=/usr/bin/brave-browser
node video-safe.mjs & node qa.mjs & node align-check.mjs & wait
node preview.mjs && node scripts/build-preview-page.mjs
```

`qa.mjs`'s expected baseline here is the standard two: slide 1 and slide 57, both
`NO LOGO`, both carrying the mark on stage instead of in the footer.
