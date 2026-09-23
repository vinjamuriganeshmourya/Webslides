# Features lab

**APPROVED 2026-09-02.** The user approved every lab in the kit. All candidate
designs in this lab are kept, and all of them are promoted: the family lives in
`slide-kit/slide-template/src/ui/`, is listed in `slide-kit/slide-types/README.md`
with what each variant is WORST at, and is imported BY PATH rather than from the
`@/ui` barrel. That is deliberate and is the whole point of keeping every variant:
a family offers a CHOICE between designs for one contract, so choosing should be a
visible act at the import line rather than a name plucked off a barrel.

Nothing here was discarded. The losing-variant tables below are still the record
of what each design is bad at, which is the part a future reader needs when they
have to pick one or change it.

Originally: **AWAITING A DECISION.** Candidate designs for a features slide, the commonest
slide there is. The user picks the ones worth keeping and those get promoted into
`slide-kit/slide-template`; the rest stay here as the record of what was
considered and why it lost.

**Not a session.** The third lab inside the kit, after `flow-lab` and
`flowchart-lab`, and built to the same rules.

```bash
npx vite --port 5223 --strictPort
npx tsc -b --noEmit
export CHROME_PATH=/opt/google/chrome/chrome
node qa.mjs && node video-safe.mjs && node align-check.mjs
```

`node_modules` is a symlink to `../slide-template/node_modules`.

---

## Why this lab exists

The kit's answer to "here are the things it can do" is `CardGrid`: n cards of
identical size, identical white, identical tone, each with an icon and two lines.
The user's verdict on exactly that slide in the first Python session was **"All
cards having same design, it is not visually appealing"**, and then the more
useful version: **"Instead of cards you can use a different design altogether.
Why should we be constrained to cards?"** That became section 8 of
`STYLE_GUIDE.md`.

Established practice arrives at the same place from the other end: a modular grid
whose cards are all one size defeats the point of a modular grid, because nothing
leads and the eye is given no anchor to enter on. The other finding worth having
is that the strongest feature sections alternate the WHAT with the WHY, rather
than burying the outcome inside the description.

So the contract carries the two things a flat card grid throws away:

- **`weight: 'hero'`** says which capability leads. At most one, and
  `resolveFeatures` reports it rather than letting a variant pick silently.
- **`outcome`** is what the feature BUYS, kept separate from `body`, which is
  what it IS. A variant can then put them in different places, or admit it has
  nowhere to put one.
- **`without`** is the cost of not having it, added later and for one reason: see
  the finding below.

## The variants

Every one renders the identical fixture from `src/ui/variants/fixture.ts` and
takes the identical `FeaturesFigureProps`, so picking a winner is a rename at the
call site. The fixture is a note app on purpose: everyone already knows what one
does, so no attention goes on understanding the example instead of judging the
layout.

| Variant | The argument | Worst at |
|---|---|---|
| `BentoGrid` | unequal tiles: the hero spans two columns at exactly twice the area, and only it carries its outcome | a set with no real leader, where it asserts a hierarchy the content does not have |
| `Spotlight` | one feature legible at a time, and a click MOVES the light rather than adding a tile | its own final frame. A screenshot or PDF gets one feature and four headings |
| `AlternatingRows` | the what and the why side by side, sides swapping so each pair reads as a pair | comparison, because labels never line up in a column |
| `RadialSpread` | breadth, which is the one claim a grid states but cannot show | mechanism: the body has to move into the hover, which a projector audience cannot reach |
| `EditorialList` | no boxes at all: when the NAMES are the content, a card around each costs the name its size | it draws nothing but a list, so a set whose items relate to each other is misdrawn as unrelated names. Drops `icon` and `logo`, so it cannot satisfy hard rule 12 |
| `SplitCompare` | a list asserts value, a comparison demonstrates it | `body` has nowhere to live, and half the stage states the bad case, which is wasted if the room already recognises it |
| `MetricLed` | the figure leads, because a number is the one thing the eye finds unprompted | needs COMMENSURABLE numbers. See below |
| `LayerAnatomy` | some sets are one thing with parts, and a grid lies about that by drawing them as peers | a set with no real ordering: it invents an architecture, which is a worse lie than drawing them flat |
| `FeatureFocus` | one capability per frame, at the size of the only thing on the slide | it can never show the SET, so breadth and comparison are unanswerable, and the cost lands in the deck as N slides |
| `AnnotatedShot` | show the thing itself, with each claim pinned to the part that proves it | no degraded mode at all. See below |

## Rules inherited from `flowchart-lab`

All of these were paid for there, and are not up for rediscovery:

- **Every label is a DOM element, never an SVG `<text>`.** An `<svg>` is one
  rectangle to all four harnesses, so they will pass a figure whose labels
  overlap. Content rule 17.
- **Padding is a floor, not a declaration.** A box shows `(box height - content
  height) / 2`, so a declared 12px silently becomes 0 or negative once content
  outgrows the box. Four cards shipped at 0px and one at -7px in the sibling lab.
  Size every box against the fixture's longest label.
- **Every part is a click-gated build step.** `Ctrl+arrow` steps the build and
  plain arrows change slide, and `S` swaps that pair for a deck like this one
  where nearly every slide is a build. Beat 0 is free, so a slide never opens on
  an empty stage, and there are no dead clicks.
- **No variant writes a literal duration.** Everything comes from
  `src/ui/figureTiming.ts`. The one exception is the hover popover, which is the
  UI tier rather than the explanatory one and says so at its call site.
- **The hover popover is never in the DOM unless open**, because the harnesses
  measure static rectangles.

## `SplitCompare` could not be judged until the contract grew a field

It argues from loss, and the contract had no field for the loss. So its first
version struck through the item's positive `outcome`, on the sound principle that
nothing should be invented.

On screen both columns then read **the same words**, one of them scored through.
A comparison where both sides say the same thing demonstrates nothing: a struck
"You stop filing things and just find them" is not "You lose an afternoon a week
to filing". The whole argument of the variant is that the gain only lands beside
the loss, and it had no loss to put there.

`without` on the contract is the fix, and it exists for this. It is optional and
no other variant reads it, so adding it changed nothing else. The strikethrough
survives as the fallback where an item has no `without`, and an honest "no gain
stated for this one" as the fallback after that.

**The general lesson, and the reason a lab is worth building:** a variant that
can only be drawn by degrading the content is telling you the contract is short a
field, not that the design is bad. That is not visible until it is on screen with
real words in it.

## Three variants have an ENTRY REQUIREMENT, and finding that out is the point

This is the most useful thing the lab produced. Three of the ten cannot be judged
on the shared fixture, and in each case the reason is a precondition of the design
rather than a fault in it.

**`SplitCompare` needed a field.** It argues from loss and the contract had none,
so it struck through the positive `outcome`. Both columns then read the same words
with one scored through, which demonstrates nothing. `without` exists for it.

**`MetricLed` needs commensurable numbers.** It sets every figure at one size, in
one colour, in one field, which asserts they are readings of the same instrument.
On the note app they are not: 40 is milliseconds, 100 a percentage, 0 a count of
folders, and "every" is not a number. No unit text repairs that, because the
layout makes the claim before the units are read. It runs on
`pipelineFeatures` instead, where every figure is seconds off the same build.

**`AnnotatedShot` needs a real capture.** A note app is a stand-in with no product
to photograph, hard rule 11 forbids inventing a screenshot and hard rule 8 forbids
annotating an unrelated one. It runs on a real capture from deployment session 1.
It also cannot pin an abstract capability like "offline first", and it rots the
first time the product screen is redesigned.

**The general lesson:** a variant that can only be drawn by degrading the content
is telling you either that the contract is short a field or that the design has an
entry requirement. Neither is visible until it is on screen with real words in it,
and both are cheaper to learn here than in a deck.

One more, found by looking rather than by measuring: `AnnotatedShot`'s first pass
put two of its three pins dead centre on the text that proved their claim, so the
price read "Rs [3]0/-". **A pin that occludes its own evidence is worse than no
pin**, because the room is told to look at something and then it is hidden.

## Open findings

- **`FeaturesFigureProps` names no SUBJECT.** `RadialSpread` is a hub reaching
  out to many, and the hub has nothing to call itself, so it can only state the
  count ("5 capabilities"). A `subject` field is the fix. It was deliberately not
  added while the variants were being built, so all of them stayed comparable.
- The two kit bugs `flow-lab` found are still live: `src/deck/Deck.tsx` hard-wires
  `InstantContext.Provider value={false}` so `useInstant()` can never be true, and
  `AnimatePresence initial={false}` means the slide rendered first on page load
  plays no entrance at all. **"It looks right in the screenshots" has never been
  evidence about motion.**

## Verification

All three harnesses, eleven slides: video-safe CLEAN, qa ALL CLEAN, align-check
0 of 11.
