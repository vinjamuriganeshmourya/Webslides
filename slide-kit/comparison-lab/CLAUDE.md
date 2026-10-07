# Comparison figure lab

**DECIDED 2026-09-03: `SwapRows` won.** Chosen off slide 5 of this gallery. It
now lives in the kit as `slide-kit/slide-template/src/ui/SwapRows.tsx`, with the
shared contract as `compareFigure.ts`, and session 5 renders it on
`c1-speed-dial-map` and `c3-interface-map`.

The three runners-up stay here on purpose. They are the record of what was
considered and rejected, and the table below says what each was worse at, which
is the part a future reader needs when they want to change the winner.

**Not a session.** A lab inside the kit whose only job was to choose a
replacement for `AnalogyMap`.

```bash
npx vite --port 5228 --strictPort
npx tsc -b --noEmit
npm run build:html            # -> dist-single/comparison-lab.html
export CHROME_PATH=/opt/google/chrome/chrome
node qa.mjs && node video-safe.mjs && node align-check.mjs
```

`node_modules` is a symlink to `../slide-template/node_modules`.

## What was wrong with `AnalogyMap`

`src/ui/AnalogyMap.tsx` draws two bordered boxes per row with a 20px arrow glyph
between them. Session 5's `c3-interface-map` needed four things it cannot do, and
the review's verdict on the rendered slide was *"Change the UI of this Slide ...
Build a New Lab for Comparison."*

1. **Every row is the same weight**, so nothing says which pairing is the point.
   There is always one, and on that slide it was the last row, indistinguishable
   from the first three.
2. **The relation is carried by the weakest element on the figure** — a 20px
   arrow between two blocks of 22px text.
3. **No notion of code.** `make "up"` and `make_coffee()` are things you type,
   and set as prose they read as the names of ideas.
4. **Flat surfaces**, against `STYLE_GUIDE.md` section 9.

A fifth, found while building the lab: it right-aligns the left column, so a
short cell and a long cell go ragged either side of the arrow.

## The four candidates

All take the identical `CompareFigureProps` from `src/ui/compareFigure.ts`, so
swapping one for another is a rename. That is `flow-lab`'s pattern and it is what
made choosing cheap: the gallery renders one fixture four times and the only
variable is the drawing.

| Candidate | The bet | Worst at |
|---|---|---|
| **`SwapRows`** ✅ | The fault is the GRAMMAR, not the emphasis: two boxes and a glyph are three objects, and the eye counts three before being told they are one. So a pairing is ONE object, divided internally, familiar side recessed into it and new side raised out of it | More than four pairings, because each row is a drawn object rather than a line of text. And any comparison where the two sides are PEERS, because raised-over-recessed asserts a direction a peer comparison does not have |
| `LedgerCompare` | The shape is right and the four faults are just faults: fix them and keep the ledger. A continuous spine replaces four arrows, the key row gets lit, code gets monospace | A pairing longer than about six words. Both columns are `1fr` and share a baseline, so one side wraps and its partner does not, and the row stops reading as a pair of equals |
| `MirrorCards` | Each system should keep its own panel and its own reading order, with a numbered badge doing the pairing (`SyntaxBreakdown`'s device, which survives a projector and greyscale) | Two pairings, where position already pairs them and the badges become furniture. Also the weakest of the four at emphasis, because a lit row inside a panel competes with the panel's own heading |
| `CallerView` | Refuse "what maps to what" and draw the interface itself: one exposed line above a hard rule, the implementation dimmed below it | Anything without a direction. Its contract is the narrowest of the four — it reads the FIRST pair as the exposed line and the rest as what sits beneath — so fed four arbitrary pairings it draws an ordinary fact as though it were hidden implementation, which is a figure that lies |

### Why `SwapRows` won

It is the only candidate whose pairing survives being read at a glance from the
back of a room. The other three all need the viewer to scan horizontally and hold
the left cell in memory while reading the right one. It is also the most compact:
four pairings fit in the well under a lead with the caption still visible, where
`MirrorCards` and `CallerView` both need the full height of two panels.

`CallerView` was the close second and is the better figure for one specific
slide — where the argument genuinely is exposed-versus-hidden rather than
this-maps-to-that. It stays here rather than in the kit because its contract is
narrow enough to be misused, and a figure that misrepresents its content is worse
than one that merely under-sells it. If a future session needs it, promote it
then, with its ordering contract in the registry row.

## Two things found while building the lab

**An opaque label has to be opaque.** `CallerView`'s "the interface" pill started
at an 8% tint and the 2px boundary rule ran straight through the words, so it
read as struck through — the opposite of what the figure claims. A label that
sits ON a rule must mask it.

**`AnalogyMap`'s props are the tell.** It takes `rows: { from, to }[]` with no
room for a key row and no room for code, so two of its four faults are visible in
its type before anything renders. The gallery's incumbent slide has to map the
fixture down to fit, and that mapping is the clearest statement of what was
wrong.

## `AnalogyMap` is not deleted

It still ships in the kit and sessions 1 to 3 render it. It is fine for what its
own header describes — a real-world analogy where every row carries equal weight
and none of them is code. `SwapRows` is the one to reach for when one side stands
in for the other and one pairing is the point.
