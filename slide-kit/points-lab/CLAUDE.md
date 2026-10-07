# Point-stating lab

**APPROVED 2026-09-02.** The user approved every lab in the kit. All three
variants are kept and promoted, imported by path from
`@/ui/points/`, and listed in `slide-kit/slide-types/README.md`.


Three ways of stating a short set of points, behind one prop contract, so the
user can pick what is worth keeping and the winner gets promoted into the kit.
Nothing in here is a session. The deck renders variants and nothing else.

## Why this lab exists, and why it may be the most useful one in the kit

Stating a small set of points is the **most frequent thing any deck in this repo
does**. Every session has slides that say "three things are true here", and every
one of them currently reaches for a bullet list inside `ContentSlide`, or for
whichever bespoke component the session that first needed it happened to write.

The survey that led here counted the alternatives: `StatusPointsSlide` is in the
approved slide-type registry and is used **zero** times in any content deck,
while `DataTable` is used on 27 slides across 5 sessions. Some of those tables
are a points set that reached for the only structured thing available.

## What is wrong with a bullet list

1. **Equal weight for unequal points.** Four bullets claim the four are peers.
   Most sets have a lead, and the list flattens it.
2. **No claim, no reason.** A stated point is a CLAIM plus the one line that
   earns it. A bullet holds one string, so the author either states the claim and
   loses the reason, or writes a sentence too long to read from the back.
3. **Nothing to reveal.** A list arrives whole or fades in, and neither is the
   same as an instructor arriving at a point.
4. **It invites two ideas per bullet**, which is the hard rule this repo breaks
   most often. A fixed label width makes the second idea not fit, and that is the
   only enforcement that has ever worked.

## `term` is on the contract on purpose

About half the point sets in this course are "a word, and what it means": image,
container, volume, port. The other half are plain claims. A contract carrying
only a label pushes every author to fold the term into the claim, and the set
then has no scannable left edge. Carried separately, a variant can align the
terms, and a variant with no room for them can ignore the field.

## The variants

| Variant | The argument | Worst at |
|---|---|---|
| `RuleStack` | full-width ordered rows: a claim gets its own line, and 802px of text column keeps the fixture's longest claim and longest reason each to one line | states a sequence whether or not one exists. Row height, the marker column and the stage are all derived from the content now, so a two-row set is 208px rather than 386px; the ceiling is five rows, which is what a slide's content well holds |
| `PeerCards` | boxes of one size are the honest claim when the points are things of one kind, and it is the only variant that puts every claim at one eye height | flattens the lead, so a set with one is saying something the geometry contradicts. Card width now divides the slot (clamped 240 to 420) and the height is derived from the longest label and body, so the old failure, a 65-character claim driving the declared 18px of padding to 0, is gone |
| `LeadAndRest` | most sets have a lead, so the lead gets 440px and 26px type while the rest share a 640px column; the hero is read off `tone: 'lead'`, falling back to index 0 | promotes one point whether or not the author meant it, and a support row cannot hold a reason past about 86 characters |

## The tone ramp lives in `pointsChrome.tsx`, and `risk` is not red

`danger` on a slide reads as an error in the deck: the room looks for what broke.
A risk in a points set is a trap the learner is about to walk into, so it takes
amber-orange. Red stays available for the day a figure has to say "this is
wrong". `lead` is the deepest brand blue rather than a fifth hue, because the
lead is not a different KIND of point.

A non-neutral tone also gets a WORD, not only a hue. Colour carries on a good
projector and nothing on a bad one, and a room that cannot tell the amber point
from the blue ones has lost the only part of the set that was a warning.

## Rules inherited from the sibling labs

- **Padding is a floor, not a declaration.** A box shows
  `(box height - content height) / 2`. Every height here is derived from the
  fixture's longest string and the arithmetic is stated in the doc comment.
  `flowchart-lab` shipped four cards at 0px and one at -7px, all declaring 12px.
- **Every piece of text is real DOM.** An `<svg>` is one rectangle to all three
  harnesses, so `<text>` labels can overlap and pass every sweep. Content rule 17.
- **Every `FcNodeIn` is passed `absolute` or `relative`.** `.fc-node-slot`'s
  `z-index` is ignored on a static element, and `pseudocode-lab` shipped without
  it: every hover aside that opened downward was painted over by the text below it
  and read as transparent.
- **The hover aside is never in the DOM unless open.** The harnesses measure
  static rectangles, so a panel parked at `opacity: 0` is reported as an overflow
  on every run. It is also never the teaching: the room cannot hover a projector.
- **Click-gated beats, count derived from props and never from state.** Beat 0 is
  free and carries the first point or the hero, so the slide never opens empty and
  no click does nothing.
- One 0.18s literal, in `pointsChrome.tsx`, for the popover: the documented
  UI-tier exception. Everything else times from `figureTiming.ts`.

## Verification

```bash
npx tsc --noEmit -p tsconfig.app.json
npx vite --port 5226 --strictPort       # the harnesses need it already running
export CHROME_PATH=/opt/google/chrome/chrome
node qa.mjs            # ALL 44 CLEAN
node align-check.mjs   # 0 of 3 slides need attention
node video-safe.mjs    # CLEAN
```

`align-check.mjs` infers a wrapped token from height against line-height, so a
padded pill needs its text in its own `leading-none` span. All four `TermChip`
terms were reported as "one token over 2 lines" until that was done.
