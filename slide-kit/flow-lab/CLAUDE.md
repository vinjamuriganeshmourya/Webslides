# Flow figure lab

**DECIDED 2026-08-26: `BoundaryBridge` won.** The user finalised it off slide 6
of this gallery. It now lives in the kit as `slide-kit/slide-template/src/ui/
BoundaryBridge.tsx`, with the shared contract as `flowFigure.ts` and the timing
scale as `figureTiming.ts`, and session 6 renders it on slides 20 and 38.

The three runners-up stay here on purpose. They are the record of what was
considered and rejected, and the table below says what each was worse at, which
is the part a future reader needs when they want to change the winner.

**Not a session.** A lab inside the kit whose only job is to choose a replacement
for `FlowChart`. The file that was here before was the kit template's own
`CLAUDE.md`, copied in by the scaffold.

```bash
npx vite --port 5220 --strictPort
npx tsc -b --noEmit
npm run build:html            # -> dist-single/flow-lab.html
export CHROME_PATH=/opt/google/chrome/chrome
node qa.mjs && node video-safe.mjs
```

`node_modules` is a symlink to `../slide-template/node_modules`.

## What is wrong with `FlowChart`

`src/ui/flow.tsx` draws bordered boxes with one arrow glyph between each pair.
Session 6 slide 20 needed three things it cannot do:

1. **Label an edge.** The command that travels has nowhere to go, so the session
   rendered `docker push` as a NODE. That is the figure admitting it has no
   edges.
2. **Distinguish two directions.** A push and a pull are opposite movements and
   it draws both as the same left-to-right arrow.
3. **Rank a station.** The registry is the point of the picture and gets exactly
   the same weight as the laptop beside it.

## The deck is variants only

No brand frame, no welcome, no agenda, no thank you. A gallery whose first
slides are chrome makes the reader page past the deck's furniture to reach the
thing being judged.

Each variant contributes the same two slides, so the comparison is like for like:
`v<n>-target-picture` is session 6 slide 20, `v<n>-cycle` is slide 38.

| Variant | Argument | Worst at |
|---|---|---|
| `RailFlow` | One drawn rail, stations are stops on it, hub raised, pull on a lower track | Caps at three stations; long labels wrap |
| `HubOrbit` | The registry is the centre of gravity, sources in from the left, targets out to the right | Chains. Slide 38 has no centre, so it renders 3 stations, not 4 |
| `BoundaryBridge` | Two machines in dashed boundaries, the registry bridges them, crossing is the event | Hard-wired three-zone world; spends ~300px on the gaps |
| `CargoTrack` | Draws the cargo, not the places: one image tile moving through the stops | Slowest to read, about 2.2s before the tile parks; cannot name its own cargo, so the tile's label is inferred from the hub's caption |

## One contract, four figures

`src/ui/variants/types.ts` holds `FlowFigureProps`. All four take exactly it, so
picking a winner is renaming one component at the call site. It describes
**meaning** (`source` / `hub` / `target`, `forward` / `reverse`) and never
geometry, because turning meaning into geometry is the only thing the variants
disagree about.

### `direction` is gone, and `issuedBy` replaced it

The field was documented as "`forward` runs source to target, `reverse` comes
back the other way". Two agents reported that it cannot mean that, and the user
put it plainly: the direction of push and pull was not technically representing
what happens.

The physics: on a push the image data moves laptop to Docker Hub; on a pull it
moves Docker Hub to machine. **The data travels along the chain both times.** A
pull is not a push drawn backwards. Only the command's author changes.

So the field is now `issuedBy?: 'left' | 'right'`, which names WHO TYPED THE
COMMAND and can never be misread as geometry. Three of the four first-pass
variants drew the pull with its head aimed back at the hub, which told the room
the image travels machine into Hub. All four now draw every payload arrow along
the chain, and show the author as something subordinate: a dashed hairline, a
small caption, never a second full-weight arrow.

One copy detail that followed from it: the hairline's word depends on the side.
`asks` is only true of a pull. On a push the sending station is handing the
image over, not asking anyone for anything, so it reads `sends`.

### The timing scale, and why it is not the `animate` skill's numbers

`src/ui/variants/timing.ts` owns every duration. The first pass used 240 to
280ms entrances and a 70ms stagger, taken from that skill's UI table, and the
user's verdict on screen was "animation is too fast".

The skill is right and it is about a different thing: its cap is for a control
a person triggers dozens of times a day. A slide figure is the same skill's
EXPLANATORY tier, where it says durations can be longer, and it is read once
from the back of a room while someone talks over it. The numbers are now roughly
double, all four variants assemble in about 2.2 to 2.6 seconds, and no variant
carries a literal duration of its own.

## Open findings

- **`src/deck/Deck.tsx` hard-wires `InstantContext.Provider value={false}`**, so
  `useInstant()` is never true from the player. Every kit figure implements an
  instant path that cannot be reached, and a Ctrl+arrow jump animates anyway.
  This is a kit bug, found here, not caused here.
- `FlowLeg.sub` is load-bearing on geometry the caller cannot see: the wedge
  between a source and the hub is about 104px, so a sentence passed as `sub`
  collides. If a variant is promoted, `types.ts` needs a length note.
- `FlowStation` has no way to say "one of many". `HubOrbit` infers a plural
  target from position rather than from the contract.
- `MachineBoundary` in the kit contains a literal `#F4F8FF`, which is a token
  violation predating this lab.
- **`AnimatePresence initial={false}` in `src/deck/Deck.tsx` means the slide
  rendered first on page load plays no entrance at all.** Any harness that opens
  the deck at a slide and screenshots it sees a still frame, so "the animation
  looks fine in the shots" has never been evidence. With the `InstantContext`
  bug above, the kit currently has two independent reasons a figure's motion is
  not what the author wrote.
- `ContainerJourney` animates `left`, against the kit's own rule that motion is
  transform and opacity only, and carries five hardcoded hexes (`#FEE2E2`,
  `#C9D4E2`, `#EEF2F7`, `#F5F8FF`, `#fff`).
- `ContainerJourney` already owns "one object travels" for this course, with a
  different visual for the same noun: a dashed stack of labelled layer chips
  against `CargoTrack`'s solid tile. Shipping both puts two dialects for the
  word "image" in one session. If `CargoTrack` is picked, its tile must become
  literally that object, which means lifting the chip rendering into a shared
  primitive first.

## Three framer-motion traps, found the hard way

Any figure in this repo can hit these:

1. **A multi-keyframe track silently reads a cubic-bezier as per-segment
   easings.** `ease: easing.swift` on a five-keyframe animation is four numbers,
   so framer takes it as four separate easings and the motion runs to the end
   and back. Pass one easing per segment:
   `ease: xs.slice(1).map(() => easing.swift)`.
2. **Keyframe `times` must end at exactly 1.** Slack after the last keyframe
   makes framer flash keyframe zero on the final frame.
3. `x` / `y` / `scale` shorthands are not hardware accelerated. Use the full
   `transform` string, which the kit's own CLAUDE.md also says.
