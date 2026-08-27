# Features lab

**AWAITING A DECISION.** Candidate designs for a features slide, the commonest
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

## Rules inherited from `flowchart-lab`

All of these were paid for there, and are not up for rediscovery:

- **Every label is a DOM element, never an SVG `<text>`.** An `<svg>` is one
  rectangle to all four harnesses, so they will pass a figure whose labels
  overlap. Content rule 17.
- **Padding is a floor, not a declaration.** A box shows `(box height - content
  height) / 2`, so a declared 12px silently becomes 0 or negative once content
  outgrows the box. Four cards shipped at 0px and one at -7px in the sibling lab.
  Size every box against the fixture's longest label.
- **Every part is a click-gated build step.** `Ctrl+arrow` steps the build; plain
  arrows change slide. Beat 0 is free, so a slide never opens on an empty stage,
  and there are no dead clicks.
- **No variant writes a literal duration.** Everything comes from
  `src/ui/figureTiming.ts`. The one exception is the hover popover, which is the
  UI tier rather than the explanatory one and says so at its call site.
- **The hover popover is never in the DOM unless open**, because the harnesses
  measure static rectangles.

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

All three harnesses, four slides: video-safe CLEAN, qa ALL CLEAN, align-check
0 of 4.
