# Flow chart lab

**AWAITING A DECISION.** Six candidate designs for a general flow chart. The user
picks the ones worth keeping and those get promoted into
`slide-kit/slide-template`; the rest stay here as the record of what was
considered and why it lost.

**Not a session.** A lab inside the kit, the second one, following
`slide-kit/flow-lab` next door. That lab chose `BoundaryBridge` for two named
session-6 slides. This one is choosing a general flow chart, so nothing about it
is scoped to a session.

```bash
npx vite --port 5222 --strictPort
npx tsc -b --noEmit
npm run build:html            # -> dist-single/flowchart-lab.html
export CHROME_PATH=/opt/google/chrome/chrome
node qa.mjs && node video-safe.mjs && node align-check.mjs
```

`node_modules` is a symlink to `../slide-template/node_modules`.

---

## What is wrong with `FlowChart`

`slide-kit/slide-template/src/ui/flow.tsx` lays its nodes out with a single flex
row or column. That is not a styling limitation, it is the data model: it takes
`nodes` and **no edges**.

1. **It cannot branch.** The registry describes `FlowChartSlide` as "a process
   with branches" and the component cannot draw one.
2. **It cannot label an exit.** Every established flow-chart guide says the same
   thing: label every arrow leaving a decision (Yes/No, Pass/Fail). With no
   edges there is nothing to hang a label on.
3. **It cannot loop back.** A rework path returning to an earlier step is the
   most common shape a real process has, and a flex row runs one way.
4. **`shape: 'diamond'` is a costume.** It rotates a node 45 degrees and then
   continues in a straight line, so the figure looks like it asks a question and
   shows only one answer.

## The deck is variants only

No brand frame, no welcome, no agenda, no thank you, same as `flow-lab`: a
gallery whose first slides are chrome makes the reader page past the deck's own
furniture to reach the thing being judged.

**Every variant renders the identical fixture** from `src/ui/variants/fixture.ts`
and takes the identical `FlowchartFigureProps`, so picking a winner is renaming
one component at the call site. The fixture is deliberately not from any session
in the corpus: a lab that dresses its candidates in one session's content gets
picked on how well it renders that session, and the winner then goes into the kit
for every other one.

It stresses every case `FlowChart` fails: two terminals, a straight run, a
decision written as a question with **both** exits labelled, an exception branch
leaving the spine, a loop back to an earlier step, and six nodes, one more than
the kit's row comfortably fits.

| Variant | The argument | Worst at |
|---|---|---|
| `SpineFlow` | The happy path is an unbroken horizontal line at full weight; the exception drops out of the gate vertically and the loop returns underneath | One decision only. There is a single row of "below" to drop into |
| `LaneFlow` | The vertical axis is WHO, not when, so handoffs are visible as vertical moves. The only variant that reads `lane` | A process where every step has one owner: a spine flow that threw away a third of its height. Needs three lanes to earn its keep |
| `StepLedger` | No boxes at all. A number in the gutter, a rule per row, words at full width. `STYLE_GUIDE` section 8 applied to a flow chart | Shape. A loop back to step two is a line of text saying so, not a line you can point at |
| `CircuitMap` | The control: the textbook notation every learner has already met. If a departure is not clearly better than this, it is not worth a second dialect | The diamond constrains the copy. Only its middle third is usable, so the question must be short, and the copy is the teaching |
| `GateFlow` | The decision has physical extent: a bar standing across the line that the work must pass through, with failure ejected out of its underside | A second decision has no third vertical level to occupy, and a question past about six words reads as a title for the whole figure |
| `TrackSwitch` | A railway, and the only variant where the LOOP is the hero: a straight main rail against a curved peel-off that merges back | Buys one idea with the whole stage. Assumes exactly one loop with room to the right of the gate |

## One contract, six figures

`src/ui/variants/flowchartFigure.ts` holds `FlowchartFigureProps`. It describes
**meaning** and never geometry, because turning meaning into geometry is the only
thing the variants disagree about.

- `FcNode.kind` is `start` / `step` / `decision` / `end`.
- `FcEdge.kind` is `main` / `alt` / `loop`. `main` is the happy path and is drawn
  at full weight; the other two are quieter and land later, so the room reads the
  straight-through story first.
- `FcEdge.label` is **required on every edge leaving a decision**, and
  `resolveGraph` reports a missing one rather than drawing it silently.
- `FcNode.lane` is in the contract rather than inferred. `flow-lab` logged the
  opposite as a finding: `HubOrbit` worked out "one of many" from a station's
  position because the contract had no way to say it, so the meaning lived in the
  geometry and could not be checked.
- `FcNode.detail` is the hover aside, and it is a SECOND layer. The room cannot
  hover a projector, so anything they must know goes in `label` or `caption`.

## Motion, and why it is not the `animate` skill's numbers

Every duration comes from `src/ui/figureTiming.ts`. No variant writes a literal.
Entrances 520ms, staggers 130ms, draws 860ms, whole figure assembled in about
2.4s: roughly double that skill's UI table, on its own instruction that
explanatory motion may run longer. A slide figure is nobody's dropdown.

**The choreography rule is the whole point.** A flow chart's content IS its
order, so the figure assembles **along the path**: a node arrives, the edge
leaving it draws, the next node arrives. At the fork the happy path draws first
at full weight, the exception second, the loop last. It never fades in as a
finished picture and it never staggers by source order.

Edges draw with `pathLength`, framer's handle on the `stroke-dasharray` /
`stroke-dashoffset` line-draw, at `linear` rather than the house ease-out: an
eased draw arrives at the arrowhead already slowing down, which reads as the line
running out of energy before it connects.

`src/index.css`'s reduced-motion block clamps CSS durations and does **not** cover
framer, which writes inline styles frame by frame. Every primitive in
`src/ui/variants/motion.tsx` reads `useReducedMotion()` itself.

## Hover is a different tier, and that is deliberate

The figure's entrance is explanatory: watched once, from the back of a room. A
hover is the opposite, triggered by the presenter deliberately and repeatedly
while they wait for the answer, so it takes UI-tier numbers: 160ms lift, 180ms
popover. Reusing 520ms there would feel broken.

- The lift is a **CSS transition** in `index.css`, gated behind
  `@media (hover: hover) and (pointer: fine)`. Transitions retarget from wherever
  they are; keyframes and JS restart from zero, which is what makes a quick
  pointer sweep across a row look broken.
- The popover is **framer**, because it mounts and unmounts and needs an exit.
- The popover is **never in the DOM unless open**. All three harnesses measure
  static rectangles, so a panel parked at `opacity: 0` would be reported as
  overflowing the frame every run.

## Findings from building it

Each of these cost a render to find, and every one of them passed a typecheck.

- **A transformed element creates a stacking context.** `FcNodeIn` animates
  `transform`, so a `z-index` on the hover popover inside it could not escape,
  and the panel came out sliced by the nodes rendered after it. The fix raises
  the SLOT, via `:has()` in `index.css`, not the popover.
- **An opaque sibling with `z-index: 1` erases the connector layer.**
  `LaneFlow`'s lane bands are `FcNodeIn`s, so they inherited `.fc-node-slot`'s
  `z-index: 1` and painted over the SVG. Every line crossing a tinted lane
  vanished and the figure looked like it had stubs where its edges should be.
- **An orthogonal router that stops short is invisible to every harness.**
  `LaneFlow`'s first router ran `H midX V enterY` and ended in open space, a
  column short of its target. Its second turned horizontally first, and with a
  14px column gap the turn landed PAST the entry point, so the final leg ran
  backwards and drew arrowheads pointing out of the nodes they were entering.
  An `<svg>` is one rectangle to `qa.mjs`, `video-safe.mjs` and
  `align-check.mjs`, so all three passed it. This is content rule 17, and it is
  why every label in this lab is a DOM element.
- **Clever column packing is not worth it.** `CircuitMap`'s first version sized
  the columns around a narrower diamond and shifted everything after it. The
  diamond drew straight through the reviewer card, the "Yes" was buried under it,
  and the end terminal hung 100px off the right of the slide. It is a uniform
  pitch now and the arithmetic is `i * PITCH`.
- **A label centred on a short edge does not fit in it.** A 42px gap cannot hold
  the word "Yes", so the label has to clear the whole row rather than hover over
  its own line.

## Still open

- The geometry in every variant is authored for the fixture's shape, which is one
  spine with one exception and one loop. `resolveGraph` says so and reports input
  it cannot lay out, rather than drawing it wrong. **A promoted variant needs
  either a real router or a documented "this is the shape it draws".** That is the
  main piece of work between picking a winner and shipping it.
- The two kit bugs `flow-lab` found are still live and affect this lab too:
  `src/deck/Deck.tsx` hard-wires `InstantContext.Provider value={false}`, so
  `useInstant()` can never be true, and `AnimatePresence initial={false}` means
  the slide rendered first on page load plays no entrance at all. Any harness
  that opens the deck at a slide and screenshots it sees a still frame, so **"it
  looks right in the shots" has never been evidence about motion.**
