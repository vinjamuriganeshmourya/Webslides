# Isolation figure lab

**DECISION: OPEN.** Four candidates are built and rendered. Nothing here is
approved and nothing has been promoted to the kit. A human picks off slides 3 to
6 of this gallery. Slides 7 to 9 are layout stress tests, not candidates.

**Not a session.** A lab inside the kit whose only job is to choose a figure for
an argument the kit cannot currently draw.

```bash
npx vite --port 5230 --strictPort
npx tsc -b --noEmit
npm run build:html            # -> dist-single/isolation-lab.html
export CHROME_PATH=/opt/google/chrome/chrome
node video-safe.mjs && node align-check.mjs && node qa.mjs
node centre-check.mjs         # figure vs its column, in numbers
node iso-shot.mjs             # every slide to a PNG, 2600ms settle
```

`node_modules` is a symlink to `../slide-template/node_modules`.

## The design question

**Session 6 slide 8, `c1-and-nowhere-else`.** The argument is that the image
exists on exactly ONE machine and three other machines cannot get it. What
shipped is four full-width bullets with an empty right half, and a reviewer asked
for a content-related element on the right. Slide 2 of this gallery is that
slide, unchanged, so every candidate is judged against what it replaces.

Two faults on it, and they are the brief:

1. **The right half of the canvas is empty**, and nothing on the slide draws the
   boundary the whole concept turns on. The word "local" is carried entirely by
   the lead.
2. **The fourth bullet is a two-line paragraph beside three short ones.** It is
   not a fourth peer of them, it is the conclusion drawn from them, and set as a
   bullet it reads as one that does not match its siblings.

## The fixture, and why that fixture

Session 6 slide 8, verbatim: the title, the lead, and the three short points.
A fixture invented for the lab would be judged on how well it suits the lab.

The figure's `ref` is `nxttrendz-backend:latest`, which is not invented either:
it is the exact repository and tag the PREVIOUS slide's `docker images` output
prints, so the figure names the thing the room has just been shown.

**The three points stay in the column on every candidate slide, and three of the
four candidates therefore REPEAT them.** That is left in rather than tuned away,
because the honest form of the choice includes what the figure costs the column.
The two ways out are both real edits — drop the figure's verb phrases and let the
column carry them, or cut the column to the conclusion alone and let the figure
carry the three — and which is right depends on which candidate wins, so it is
not the lab's call.

## Why the kit's own figures were disqualified

- **`FanOut`** argues the OPPOSITE: one source, many live copies. Drawn here it
  asserts that the three other machines DO have the image, which is the claim the
  slide exists to deny. Content rule 8 disqualifies it on MEANING, not on looks.
  Its `live?: boolean` per-copy flag is "running versus stopped", so dimming the
  copies does not rescue it: a stopped container is still a container that
  exists.
- **`MachineBoundary`** takes only `className`. It is hardcoded to session 1's
  browser and two dev servers and cannot carry any other slide's content. (It
  also still contains a literal `#F4F8FF`, a token violation predating this lab.)
- **`BoundaryBridge`** needs a hub between two machines and draws what
  successfully CROSSES. Here nothing crosses, and there is no hub yet: the
  registry is the next concept, and drawing it on this slide opens problem 2
  before problem 1 is closed.

## One contract, four figures

`src/ui/isolation/isolationFigure.ts` holds `IsolationFigureProps`. All four take
exactly it, so picking a winner is renaming one component at the call site. That
is `flow-lab`'s pattern by way of `comparison-lab`, and it is what makes choosing
cheap: the gallery renders one fixture four times and the only variable is the
drawing.

It describes **meaning** and never geometry: the thing being held
(`artefact`), the machine holding it (`holder`), and the machines that do not have
it (`recipients`, each with the `cannot` verb phrase). `src/ui/isolation/
isolationChrome.tsx` owns the light source, so the four differ in geometry and
never in tempo or lighting.

Two rules the contract enforces on every candidate:

- **`opacity` alone is banned.** It is the one device that reads as "present but
  unimportant", which is exactly the misreading the family exists to prevent. An
  absent machine is drawn as a `ghost()`: full-strength border and text, no fill.
  A labelled hole, not a faded object.
- **The figure owns the word "cannot".** `cannot` is the verb phrase without its
  negation, so a candidate can print the negation once as a heading instead of
  once per row.

## The four candidates

| Candidate | The bet | Worst at |
|---|---|---|
| `SealedBoundary` | The claim is CONTAINMENT, so draw a container: the image inside a dashed machine boundary, the three outside it, and the single route out cut once at the boundary's own edge | Repeating the negation, once per row, on a slide whose column already says it three times. Tallest of the four at ~341px, so four recipients (~407px) leaves nothing for the conclusion line. Says nothing about which machine the boundary belongs to beyond its label |
| `ReachTable` | It is a fact about a SET, so list the set and mark one row. One occupied slot, three empty, negation printed once as a column heading, and the count derived from the fixture | It draws no CAUSE: nothing says why the slots are empty, so it is evidence for a sentence rather than an argument of its own. It also looks like `DataTable` and is not one — three of its four rows are the same fact. And its whole claim rests on a 24px mark, the first thing a projector loses |
| `LoneHost` | Absence is only legible against a place where the thing WOULD be: four identical frames, same slot in the same position, one of them filled. No connectors at all | Three equal frames claim the three machines are peers, and a teammate's laptop, an automation server and a production host are three different kinds of thing at three different stakes. Worst fit for the 16px type floor: a 177px frame takes two lines for a machine name and three for a verb phrase, and four recipients would not fit at all |
| `BlockedFan` | Deliberately the closest thing to `FanOut`: keep the fan, break every curve. In the lab to be TESTED, not to win | Its own shape. See the finding below |

### What each is best at, in one line

- `SealedBoundary` — the only one that draws the CAUSE. A wall is a thing a room
  can point at while the instructor says the word "local".
- `ReachTable` — the shortest (~274px), the most legible, the only one that
  prints the negation once, and the only one that scales past four recipients.
- `LoneHost` — the strictest reading of content rule 8. There is nothing on it
  that could be read as "has it, faintly".
- `BlockedFan` — it answers a question that would otherwise be asked again on the
  next deck.

## The verdict from the renders, and it is a reading, not a decision

Judged off `/home/nxtwave/.claude/jobs/170bacfd/tmp/isolation/*.png`, at
1280x720, 2600ms settle.

**Three of the four read honestly. `BlockedFan` does not.**

- **`SealedBoundary` reads honestly.** The image is visibly inside something, the
  cut sits at the exit rather than at any machine, and the rows below hang off a
  dashed line that arrives nowhere. There is no reading of it in which the three
  machines hold anything.
- **`ReachTable` reads honestly**, and most precisely of the four: the empty
  slots are unambiguous and "1 of 4 machines has the image" states the
  arithmetic. It is the weakest at asserting anything, which is a different
  complaint from being misread.
- **`LoneHost` reads honestly and is the hardest of the four to misread.** The
  empty frames are holes at the same size and offset as the filled one, so the
  comparison is made by shape and needs no colour, no line and no glyph.
- **`BlockedFan` DOES NOT read honestly, and that is the lab's most useful
  finding.** Inverting the connectors does not invert the composition. Three
  curves leaving one box still reads as distribution; the cut marks read as
  badges ON the wires rather than as an absence of delivery, and because the
  ghost frames sit at the receiving end of curves, a fast reader gets "the image
  went to these three, with problems" — which is precisely the claim the slide
  denies. **The shape argues with the drawing and the shape wins.** So the answer
  to "can we add a `blocked` mode to `FanOut` and reuse it here" is no, and the
  next author does not have to find that out on a live deck.

**Legibility.** Every candidate is legible at 1280x720 after the type floor was
imposed: no text inside any figure is below 16px. `LoneHost` is at the boundary
of the constraint rather than comfortable inside it — three of its five text
blocks wrap — and `BlockedFan` wraps the image tag across two lines inside a
176px card. Both of those are recorded as faults of those candidates, not as
things to fix by shrinking type.

## Centring, in numbers rather than by eye

Centring is not something an eye judges at a 4px skew, so `centre-check.mjs`
measures it: horizontally, the figure against its column and the whole row
against the stage; vertically, the block against the well; and the datum, the
figure's top against the first bullet's. Every figure-bearing slide, at 1280x720
after a 2600ms settle:

```
slide  3  ok    column gaps L2 R2 (skew 0px)  figure 552 in 556  ·  row vs stage L64 R64
          v-ok  well 217..656 (439)  block 431  gaps T4   B4   (skew 0px)  datum-ok figure@230 bullet@221
slide  4  ok    column gaps L2 R2 (skew 0px)  figure 552 in 556  ·  row vs stage L64 R64
          v-ok  well 217..656 (439)  block 361  gaps T39  B39  (skew 0px)  datum-ok figure@265 bullet@256
slide  5  ok    column gaps L2 R2 (skew 0px)  figure 552 in 556  ·  row vs stage L64 R64
          v-ok  well 217..656 (439)  block 388  gaps T26  B26  (skew 0px)  datum-ok figure@252 bullet@243
slide  6  ok    column gaps L2 R2 (skew 0px)  figure 552 in 556  ·  row vs stage L64 R64
          v-ok  well 217..656 (439)  block 326  gaps T57  B57  (skew 0px)  datum-ok figure@283 bullet@274
slide  7  ok    column gaps L2 R2 (skew 0px)  figure 552 in 556  ·  row vs stage L64 R64
          v-ok  well 217..656 (439)  block 299  gaps T70  B70  (skew 0px)  datum-ok figure@296 bullet@287
slide  8  ok    column gaps L2 R2 (skew 0px)  figure 552 in 556  ·  row vs stage L64 R64
          v-ok  well 217..656 (439)  block 431  gaps T4   B4   (skew 0px)  datum-ok figure@230 bullet@221
slide  9  ok    column gaps L2 R2 (skew 0px)  figure 552 in 556  ·  row vs stage L64 R64
          v-ok  well 217..656 (439)  block 543  gaps T-52 B-52 (skew 0px)  datum-ok figure@220 bullet@211

CENTRED: every figure is centred in its column.
```

### Vertically: the block is centred, with equal gaps

`gaps T/B` is the block's top and bottom gap inside the well. **Skew 0px on
every slide**, from 4/4 on the tallest candidate to 70/70 on the shortest. The
block is the two-column row plus the conclusion line, treated as one unit, and
`ContentSlide`'s well (`flex-1 justify-center`) is what centres it.

**Centring the BLOCK is not `items-center` on the GRID.** The grid stays
`items-start`, which is why `figure@` and `bullet@` differ by exactly 9px on
every slide — that is `PT`, the deliberate optical correction, because
`BulletList`'s first line sits about 9px inside its own 40px marker chip while a
figure's first card starts at its border. Aligning the boxes leaves the type
looking high; aligning the type is what reads as level. Returning the grid to
`items-center` is what produced the 87 to 100px overhang the review caught, and
it has not been reintroduced.

### The datum holds at one, three and five points

Slide 7 is one point and one recipient, slides 3 and 8 are three points and five
points against the same three-recipient figure. `figure@ - bullet@` is **9px on
all seven slides**, so the two columns stay locked whatever either one does. The
block's own position in the well changes with its height, as centring requires;
the columns do not move relative to each other.

### The clamp, and the proof it fires

**The well starts at y=217, which is already three pixels inside the
instructor-video reserve.** A block taller than the well's 439px does not clip,
it overflows both ends equally, so the taller the figure the further its top
rises past y=220. That is precisely how `SealedBoundary` came to sit at y=217 on
the first pass; shrinking the figure fixed that instance and not the class.

So the block is centred UNLESS centring would carry the figure above the floor,
and clamped to the floor when it would. All arithmetic from constants — every
candidate exports its own height (`sealedBoundaryHeight` and friends) — because a
measure-then-render pass risks the dev server and the single-file build
disagreeing, which is the trap `points-lab` records.

**Slide 9 is the proof, and it is the tallest candidate pushed one recipient past
its ceiling.** Four recipients makes the block 497px in a 439px well. Unclamped,
the figure's top would land at y=197, twenty-three pixels inside the reserve. The
clamp adds 46px of top padding — doubled, because padding grows the centred box
and the content inside it therefore moves down by half of what was added — and
the measured result is `block 543 gaps T-52 B-52`, **`figure@220`, exactly on the
floor**, with `video-safe.mjs` CLEAN.

**What the clamp cannot do is make room.** On that slide the conclusion line is
pushed to y≈708 and collides with the footer band. That is the honest report of a
figure past its ceiling, and it is why `SealedBoundary`'s "worst at" says three
recipients.

### Horizontally

Each figure is 552 in a 556 column, 2px either side, skew 0. Against the STAGE a
figure in the right column necessarily has an uneven gap — 662 left, 66 right —
and that is geometry, not an accident: the ROW is 64/64, so the pair of columns
is symmetric about the stage centre and the header, lead, bullets and conclusion
all start on the same x=64 datum. A one-column figure slide in session 6 measures
0/0 against the stage because its region IS the stage; on a two-column slide the
comparable measurement is the row's, and it matches.

### The order the fixes had to run in

Type floor first (it moved every candidate's width from 460 to 552), then the
even split, then the horizontal centring, then the vertical clamp, then the
measurement. Measured before the type fix, every number above would have
described a layout that was about to be replaced.

## Four things found while building the lab

**1. The type floor, and a defect it caught.** The first pass set machine names
at 15px, verb phrases at 11.5px, and passed the slide's own conclusion to every
figure as a `caption`, where it rendered at 13px. The review's verdict: the
concept's punchline had become the smallest text on the frame. So:

- Nothing inside a figure in this family is below **16px**, `body-sm`, the
  smallest body step in `tailwind.config.ts`. It is written into
  `isolationFigure.ts` as `MIN_TEXT_PX`.
- **`IsolationFigureProps` deliberately has no `caption`.** A caption is the last
  thing laid out and the first thing squeezed. The conclusion is the SLIDE's, at
  19px, full width under both columns.
- Fitting 16px is what moved the figure width from 460 to **552** and the grid
  from the kit's 1.4fr / 1fr to an even split.

**This is a repo-wide problem this lab did not create.** `FanOut` sets copy notes
at 11.5px, `MachineBoundary` uses `text-xs`, and no harness checks type size. A
`min-font-size` sweep in `qa.mjs` would have caught all of it, and does not
exist.

**2. `ContentSlide` centres its two columns independently.** Handed both `points`
and `children` it uses `grid-cols-[1.4fr_1fr] items-center`, so a figure taller
than its points column overhangs it at BOTH ends: 87 to 100px on the first pass
of these slides. The lab therefore lays out its own row — even split, 40px
gutter, `items-start` — and slides 7 to 9 stress it with a one-point fixture, a
five-point fixture, and a four-recipient figure that fires the video clamp. It holds: the boundary's top and the first bullet stay on
one line at every length. **A kit fix would be an `align` prop on `ContentSlide`,
and it is not made here**, because that file is kit-owned and `sync-kit.mjs
--apply` would push it into every signed-off session.

**3. `ContentSlide`'s content well starts at y=217, three pixels inside the
instructor-video reserve.** Its own header comment says the well "opens at
y=168" and that the reserve's floor is y=220, and with a lead the well in fact
begins at 217. Nothing on a normal slide notices, because the well is centred and
most bodies are shorter than it. Anything that FILLS the well sits in the
reserve, and `video-safe.mjs` only catches it once a slide actually does. That is
a kit geometry note, found here, not caused here; this lab clamps around it
rather than editing kit-owned `ContentSlide`.

**4. A column heading is a claim about everything under it.** `ReachTable`'s
first render put `Machine | cannot` across the top, and the holder's own row then
read across as "This machine · cannot · nxttrendz-backend:latest": the figure
stated the opposite of the one true fact on it. The holder band now comes first
and the heading introduces only the three rows it governs. A figure that arranges
facts in a grid inherits the grid's grammar whether it meant to or not.

## The harness baselines for this lab

- `node video-safe.mjs` — **CLEAN**. It was not, on the first pass:
  `SealedBoundary` put its boundary's top edge at y=217, three pixels inside the
  reserve, because the figure was tall enough to push the centred block up.
- `node qa.mjs` — **2 flagged, both benign**: slide 1 (`BrandSlide`) and slide 10
  (`ThankYouSlide`), `NO LOGO`, both of which carry the mark on stage. This is
  the documented baseline. Slide 9's conclusion line overruns the WELL but stays
  inside the 720px frame, so `qa.mjs` does not see it; `centre-check.mjs`'s
  `T-52 B-52` is where that shows up.
- `node centre-check.mjs` — **CENTRED**, 0px skew horizontally and vertically on
  all seven figure slides, datum 9px throughout. The numbers are in the section
  above.
- `node align-check.mjs` — **1 of 10 flagged, and it is expected**: slide 6,
  `WRAPPED one token over 2 lines: "nxttrendz-backend:latest"`. That is
  `BlockedFan`'s narrow source card, recorded as its fourth fault. It wraps at the
  hyphen and never truncates: the first render cut it to `nxttrendz-backe...`, and
  a truncated identifier is not a smaller label, it is a wrong one.

## If one of these is promoted

1. `src/ui/isolation/` moves to `slide-kit/slide-template/src/ui/isolation/`
   with the contract and `isolationChrome.tsx`, exported from the barrel.
2. It needs a row in `slide-kit/slide-types/README.md`'s Figures table, with the
   "worst at" text from the table above, and a note on the type floor and the
   recipient ceiling.
3. It is a **PR**, never a direct merge: `sync-kit.mjs --apply` pushes kit
   changes into every session including signed-off ones.
4. The runners-up stay here. They are the record of what was considered, and the
   "worst at" column is the part a future reader needs when they want to change
   the winner.
