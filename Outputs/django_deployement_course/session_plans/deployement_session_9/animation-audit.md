# Animation audit, session 9

Read-only audit of whether each figure's parts arrive in step with the words that
explain them. No fixes applied.

**Method.** Dev server on port 5220 (already running; not started or stopped by
this audit). For every figure slide, a filmstrip at ~0.25 s, 0.7 s, 1.3 s, 2.0 s
and 3.0 s after the slide mounts, without `?all`, then the same slide with `?all`
for the final state. Every frame was looked at (hard rule 17). The clock starts at
the hash change, not at page load: a direct `goto` resolves `networkidle` long
after React has mounted, so a first-pass filmstrip showed every slide already
assembled at 250 ms, which was a harness artefact and not the deck. Timings in the
table are read off the render and cross-checked against the delay constants in
`src/ui/figureTiming.ts` (`lead` 0.12, `stagger` 0.13, `enter` 0.52, `draw` 0.86,
`drawStep` 0.6, `label` 0.34, `accent` 0.6, `travel` 0.78).

**Deck version.** 76 slides, `awsIntroDeck.tsx` as of 2026-09-16 11:20. The deck
changed under the audit twice (73 → 74 → 76 slides); every finding below was
re-captured against the 76-slide version, and slide numbers are that version's.

**Figure slides checked: 35** — 8, 14, 16, 17, 19, 21, 23, 24, 25, 28, 30, 31, 32,
33, 34, 35, 36, 37, 40, 41, 42, 45, 47, 49, 50, 52, 53, 55, 62, 66, 67, 69, 70,
71, 74.

---

## Findings

| # | Slide | Title | Figure | What is wrong | Exact fix | Severity |
|---|---|---|---|---|---|---|
| 1 | 19 | Why Not Your Own System | `OwnVsRented` ×2 in `CardGrid` | Body is **empty for the whole slide entrance** (verified at 0.25/0.7/1.3/2.0/3.0 s) because `CardGrid` wraps every child in `Step`. Worse, `OwnVsRented` is mounted the whole time, so its dot-overflow run (dots at 60 ms from 0.25 s, capped at 1.3 s) and the screen-dim at `tGlyph(2)+T.enter*0.5` have **finished before the card is ever clicked**. The beat the notes tell the instructor to point at ("watch the room watch the dots overflow") never plays. | Replace `<CardGrid cols={2}>` on this slide with a plain `grid grid-cols-2` inside `RevealGroup` + one `Reveal` per `Card` (`ui/content.tsx` `CardGrid` always `Step`s its children). | high |
| 2 | 66 | What Costs Money | `Meter` ×4 in `CardGrid` | Same `Step` gate: lead says "Four meters run on AWS" over an empty well for 3 s, four clicks needed. Each `Meter` still animates and **starts ticking at `tTick` ≈ 0.77 s while hidden**, so a card revealed on click 3 arrives with its readout already several digits in and mid-transition. Rule 6 and the "meter starts as I name it" beat both lost. | Same as #1 (un-`Step` the grid), and gate `Meter`'s `useTicker` on the card being visible rather than on mount. | high |
| 3 | 66 | What Costs Money | `Meter` ×4 | **Four looping digit tickers run simultaneously and permanently.** The Meter tick is the deck's one sanctioned loop, but four of them at 900 ms on one slide is competing motion, not emphasis. | Pass `tick={false}` to three of the four `Meter`s and leave the tick only on `A running instance`. | medium |
| 4 | 23 | Pay for Use | `Meter` + `AnalogyPairs` | **Three looping tickers at once**: the large `Meter`, plus `SmallMeter state="running"` inside `AnalogyPairs` row 2 (`the meter at home`) and the same meter again inside `BillReadout` (`your AWS bill`). All three count together from ~1.3 s. The large meter's tick is deliberate and correctly starts after the lead (`tTick` ≈ 1.63 s); the two small ones are not. | `AnalogyPairs.tsx`: pass `tick={false}` to the `Meter` inside `SmallMeter` and inside `BillReadout`. | medium |
| 5 | 17 | Inside a Data Centre | `DataCentreView state="parts"` | The hall and all three rack rows **replay their entrance** (`tHall` = 0.12 s, `tRow(r)` = 0.25/0.38/0.51 s) although slide 16 just drew the identical geometry. Nothing new happens until `tPart(0)` = 0.77 s, and `guards` does not land until ~2.41 s, right on the budget ceiling. | Give `DataCentreView` a `revealFrom`-style flag like `CloudPicture`'s: when `state === 'parts'`, mount `FadeG` for the hall and racks with `initial={false}` so only the four supports animate, and pull `tPart(i)` back to `at(0) + i*T.stagger*2`. | medium |
| 6 | 33 | Over 240 Services | `ServiceField` + `CardGrid` | Two problems. (a) The figure finishes at `tLit(3) + T.label + T.drawStep + T.label` ≈ **2.65 s**, past the 2.4 s ceiling (labels still arriving between the 2.0 s and 3.0 s frames). (b) The figure **names EC2, S3, RDS and VPC before** the four click-gated `Card`s that name them, so every build click reveals text whose figure part is already on screen. | Cut `ServiceField`'s tail: change the leader duration from `T.drawStep` to `T.label` at `ServiceField.tsx` line ~241, bringing the last label to ~2.4 s; and drop the `note`/name labels from `ServiceField` here so the `Card`s carry the names. | medium |
| 7 | 24 | Who Rents Them Out | `CardGrid` of three marks | Body empty for the full 3 s window; three clicks before anything appears beside the lead. No figure entrance is wasted (the cards are static marks), but the slide reads as a title over a blank stage. | Accept as the sanctioned "the cards ARE the content" exception, or un-`Step` as in #1 and let the three marks stagger on entry. | medium |
| 8 | 25 | Cloud in One Line | `MeterRunning` in `IllustratedRecap` | Row 3's meter **ticks continuously through the recap** (00001 at 1.3 s, 00003 at 3.0 s). A recap frame is read, not watched; this is the only moving thing on it and it pulls the eye off the three sentences. | `recapFigures.tsx`, `MeterRunning`: pass `tick={false}` to the `Meter`. | medium |
| 9 | 70 | Billing in One Line | `PaidThings` in `IllustratedRecap` | Same: the `Meter state="running"` inside `PaidThings` ticks through the whole recap. (`MeterAlert` already correctly passes `tick={false}`.) | `recapFigures.tsx`, `PaidThings`: pass `tick={false}` to its `Meter`. | medium |
| 10 | 45 | AMI | `AnalogyMap` | The whole four-row map is assembled by ~0.9 s, roughly UI tier rather than the explanatory tier this deck runs at, and the Docker/Linux mark row under it is visible before the rows it belongs to. Everything else in the deck lands between 1.2 s and 2.4 s, so this one reads as a flinch. | Kit component: raise `AnalogyMap`'s internal stagger to `T.stagger` (0.13) and delay the mark row to `T.lead + 4*T.stagger`. | low |
| 11 | deck-wide | every `Content*`/`StatusPoints` slide | `SlideHeader` | The lead is `<Reveal dir="up" delay={0.05}>`, and an explicit `transition` on a `Reveal` **overrides the `RevealGroup` stagger**, so the lead animates at 0.05 s, ahead of the kicker (0.12 s) and the title (0.20 s). The words arrive lead → kicker → title on every slide in the deck. | `ui/SlideHeader.tsx`: drop `delay={0.05}` from `LeadPart` and let the group stagger order it. (Kit-owned; changing it touches every session.) | low |
| 12 | deck-wide | every figure | `useInstant()` | `Deck.tsx` hard-codes `<InstantContext.Provider value={false}>`, so `useInstant()` **never returns true**. Confirmed by render: a `Ctrl+ArrowRight` arrival replays the full entrance exactly like a hash jump, so test (e) cannot fail — nothing animates alone on a still slide. Every `a.instant` branch in the fifteen figures is unreachable code. | No fix needed for motion; note in `figureMotion.tsx` that the instant branches are currently dead, so a future `Deck.tsx` change does not silently rely on untested paths. | low |

---

## Slides whose figure timing is already correct

Text and figure arrive together, parts land in the order the lead or the bullets
name them, and the figure is fully assembled inside ~2.4 s:

**8, 14, 16, 21, 28, 30, 31, 32, 34, 35, 36, 37, 40, 41, 42, 47, 49, 50, 52, 53,
55, 62, 67, 69, 71, 74** (26 slides).

Worth naming individually:

- **35 Instance** — `MachineCard`'s three leaders land at 0.85/0.98/1.11 s in
  exactly the bullet order (address, power, key), each label after its line.
- **17 / 16 Data Centre pair** — the four supports light in the lead's own order
  (power, cooling, internet, guards), which is the clearest text-figure match in
  the deck; only the rack replay (finding 5) holds it back.
- **67 What Is Free** and **71 Stop Your Instance** — the `idleBilled` meter's
  first tick at ~1.63 s lands after the list has been read, which is the tick
  doing its job.
- **74 What Comes Next** — `revealFrom={6}` correctly holds the whole picture
  still; the slide is a callback, not a build.
- **40 What a Region Is** — the two unlit `PlaceLadder` rungs appear at 0.25 and
  0.38 s, before anything names them, but that is the roadmap exception in hard
  rule 4 and is the figure's whole job.
- **8 / 30 / 31 / 69 AnnotatedShot** — dim 0.4 → 0.92 s, boxes from 0.6 s at
  0.13 s apart, magnifier inset after the last box; all four assemble inside 1.5 s
  and the box order matches the caption's numbering.
