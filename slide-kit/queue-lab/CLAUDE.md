# queue-lab — how a job reaches an executor

Four candidates were briefed, three were built, and the user picked one. This
file is the record of what each was worse at, which is the only reason a lab is
kept after its winner ships.

| | |
|---|---|
| Contract | `src/ui/queueFigure.ts`, with `QUEUE_FIXTURE` |
| `devPort` | **5234** |
| Winner | **`TillRow`**, promoted to the kit |
| Runners-up | `QueueBelt`, `DashboardPanels`, both kept here |
| Asked for | 2026-09-09: *"I want a clear illustration of arriving of job into the build queue, build, executor, all these must be represented, consider actual flow"* |

Scaffolded from `slide-kit/slide-template`, **never from another lab**. A previous
lab was copied from `comparison-lab` and inherited its frozen 92-line `Terminal`
with no `err` or `powershell` support, and three labs then carried the same stale
kit.

## The brief

Four words from session 7's concept 4 have to be legible in one figure: **job**,
**build**, **build queue**, **executor**. Nothing in the kit drew them, and the
reason is in the contract's header: `SpineFlow` and `FlowChart` are sequences, so
they draw a queue and an executor as two steps in a row, which is true and hides
the only fact that matters, that there are TWO executors and the queue exists
because there are not more. `FanOut` draws job to builds correctly and cannot
draw waiting at all. `ThreeLanes` asserts containment, and nothing here contains
anything.

## The research, per content rule 27

Queue-and-servers is the conventional form and has been for a century of
queueing diagrams: one waiting line, N servers, items leaving the line as a
server frees. Jenkins' own documentation models capacity as **executor slots**
where "a machine either has a free slot or it doesn't"
(`jenkins.io/doc/book/using/executor-starvation`), calls agents "the workers that
perform operations" (`jenkins.io/doc/book/managing/nodes`), and the clearest
published gloss of the pair is that a build queue and a build executor are "as
different as a todo list is from the person actually doing the tasks".

**Jenkins also draws it itself**, on the dashboard, as two panels titled
`Build Queue` and `Build Executor Status` with a `0/2` count. That fact set the
first scoring criterion, from rule 27: a picture the learner meets again
elsewhere beats a better picture they never see twice.

## Why `TillRow` won

It is the only candidate that **draws the mechanism rather than the parts**. A
connector leaves the front of the line, runs along a rail under both desks, and
rises into each desk's bottom edge, so "either desk can take the next ticket" is
geometry. The other two state it in words or leave it to be inferred, and it is
the one thing a learner cannot work out from a list of four definitions.

It also keeps Jenkins' own panel titles, so it still satisfies the first
criterion, and it marks the front of the line explicitly, which is the fact every
queue drawing lives or dies on.

## What the runners-up were worse at

**`QueueBelt`** — one left-to-right belt, and the cleanest single reading
direction of the three. It lost on one detail that would have shipped a defect to
first-time learners: the tickets are laid out **right to left inside the queue
well**, so `queue[0]`, the front of the line, sits nearest the executors. That is
correct as a model of a queue feeding a server and wrong as something to read,
because a reader scanning left to right meets `#4` before `#3` and has to be told
by a caption that the front is on the right. Its own header names its second
weakness honestly: the belt is a spatial axis that a reader also reads as a
clock.

**`DashboardPanels`** — the strongest candidate on the "met again elsewhere"
test, because it *is* Jenkins' two panels, and the session already ships a real
capture of them on `c4-dashboard-tour`. It lost because the two panels sit side
by side with **no connector between them**: it draws where runs wait and where
runs execute, and not the flow from one to the other, which is exactly what was
asked for. Worth reaching for if a future slide needs the panels without the
flow.

A fourth option was offered and not taken: combining `TillRow`'s fan with
`DashboardPanels`' verbatim panels. If the figure is ever revisited, that is the
open idea.

## If you change the figure, change it here

Hard rule 17, and the reason: two SVG figures shipped in session 4 with their
`<text>` labels overlapping while all three harnesses reported clean, because an
`<svg>` is one DOM rectangle to a harness. Every candidate here is built from
real elements in a real layout, with one `aria-hidden` SVG carrying connector
lines only. Render the picture and look at it before believing a green harness.

```bash
npm install
npx vite --port 5234 --strictPort
```

The three candidates are the first four slides of `src/decks/sampleDeck.tsx`
(`cand-queue-belt`, `cand-dashboard-panels-job`, `cand-dashboard-panels`,
`cand-till-row`).
