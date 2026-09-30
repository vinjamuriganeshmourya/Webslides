<!-- cSpell:ignore deployement NxtWave colour -->
# Slide plan — `slideautomation-slides-version-1`

**STATUS: IN PROGRESS. Pass 1 of N, design only.**

## What this project is

A copy of `deployement_session_1_v3` ("Introduction to Docker", 45 slides) on
which a **design pass** is being applied, correction by correction, from a list
supplied by the user. It is not a new session and it is not a content revamp.

**The teaching content is closed.** Every claim, command, screenshot,
definition and slide order comes from v3 and is not reopened. The slide-wise
content plan is therefore v3's, unchanged, and lives at
[`../deployement_session_1_v3/plan.md`](../deployement_session_1_v3/plan.md).
This file records only what this project changes on top of it: the visual
system, the figures, and the layouts.

If a rendered string changes here it is because a heading lost decoration or a
label gained a logo, never because a point changed.

| Input | Value |
|---|---|
| `PROJECT` | `slideautomation-slides-version-1`, copied from `deployement_session_1_v3` |
| `SESSION_NAME` | `Introduction to Docker` (unchanged) |
| `COURSE` | React + Django Integration, Deployment |
| `SOURCE OF CONTENT` | `deployement_session_1_v3/src/decks/deploymentSession1V3Deck.tsx`, 45 slides as shipped |
| `htmlName` | `slideautomation-slides-v1` |
| `devPort` | 5230 (v3 holds 5212) |

## The one structural decision this project makes

**It forks the kit locally, on purpose.** Most of the corrections in pass 1 are
not deck corrections at all: they are changes to `AgendaSlide`,
`SectionBreakerSlide`, `Kicker`, `MachineBoundary`, `PeerCards` and
`ContainerJourney`, every one of them kit-owned under `src/slides/` and
`src/ui/`. There is no way to change the colour of the agenda's circle from a
deck file.

So this project's copy of those files is edited in place, and two consequences
follow, both deliberate:

1. **`sync-kit.mjs --apply` must not be run against this project** until the
   changes are promoted. It would overwrite every one of them.
2. **Nothing here reaches another deck until it is promoted through a PR**, per
   hard rule 14 and section 6 of the generate-slides skill. Promotion needs the
   user to approve each change as worth keeping; a design pass in progress is
   not approval. The list of what is worth promoting is kept at the bottom of
   this file as the pass proceeds.

## Pass 1: the corrections, and what each one turned out to be

Numbering is the user's. "Slide N" is the deck's own 1-based index, which is
what `?all#/N` and the harnesses use.

| # | Correction | Where it actually lives | Kind |
|---|---|---|---|
| 2 | Agenda: circle colour, point alignment, font, text colour, remove background lines | `src/slides/AgendaSlide.tsx` | layout + style |
| 3 | Section breaker: change the layout, remove the background number | `src/slides/SectionBreakerSlide.tsx` | layout |
| 4 | Content slides: remove the dash from headings, change the box icons | `src/ui/primitives.tsx` (`Kicker`), deck icon props | style + content |
| 6 | "Connection refused" line must touch both boxes, X on the line | `src/ui/MachineBoundary.tsx` | structural |
| 7 | localhost: machine mark, padding, real logos, no tint, near-black port text | `src/ui/MachineBoundary.tsx` | style + assets |
| 8 | Two questions: negative space, layout, **remove the hover state** | `src/ui/points/PeerCards.tsx`, `pointsChrome.tsx` | structural |
| 10 | The conversation must look like a conversation | new figure + the deck's slide 10 | structural |
| 12 | Code-alone journey: alignment, the line, the code label, blue, static end | `src/ui/ContainerJourney.tsx` | structural |
| 16 | Containerization: move the subtitle down above the points | deck slide 16 | layout |
| 19 | Where we are: left-align the rows, add icons | `src/ui/points/RuleStack.tsx`, deck slide 19 | layout |

**Out of scope for pass 1, and untouched:** every other slide in the deck.
Issues noticed elsewhere are recorded under "Noticed, not fixed" below rather
than fixed, per the user's scope instruction.

## Rules this pass is held to

The six from v3 (R1 scope is Problem 1 only, R2 Windows-first, R3 Problem 2 is
named and never opened, R4 no spaced em dash, R5 no trailing full stop, R6 the
top-right 367x220 stays clear) all still apply, plus three from the user:

- **No hover state anywhere in the deck.** Correction 8 says it for one figure;
  it is applied as a deck-wide rule.
- **No hex literals, no new colours.** Every colour is a token from
  `src/design/tokens.ts`. "black-800" resolves to `colors.nwBlack` (`#1C1C1C`),
  the style guide's own text black.
- **Solid fills or subtle gradients only.** No lit, skeuomorphic tiles.

And two from the repo that bite here specifically:

- Hard rule 19: the kicker and title stay pinned at the slide's top-left datum
  on every slide, which is why correction 16 moves the **subtitle** down and
  leaves the title where it is.
- Hard rule 12 and 13: a technology named on a slide carries its logo, as a PNG
  taken from `slide-kit/assets/tech/` and copied into `public/assets/tech/`.

## What each correction turned into, pass 1

**Corrections 2, 3 and 4 are component changes**, so they hold for every slide
that uses those components, not only the frame the note was written against.

| # | What was changed | Where |
|---|---|---|
| 2 | The curve, the orbit ring and the blurred field are gone; the four items share one left edge in a column centred on the disc; item titles are Inter at `ink` with the sub in `body` grey, matching `BulletList` everywhere else in the deck; the disc carries the style guide's blue gradient instead of divider navy; `decor={false}` so the light family's arcs do not draw behind the list either | `AgendaSlide.tsx` |
| 3 | Left-aligned on the x=64 datum with the accent rail every content slide has, title at 56px, the section index as a small `CONCEPT 01` eyebrow; the 200px translucent numeral is gone; the mark fades up in place instead of sailing in 110px with a bob and a swelling halo | `SectionBreakerSlide.tsx` |
| 4a | `Kicker` no longer draws its 24x3px leading accent dash, which read as an em dash on every kicker in the deck. The accent is still stated once, by `SlideHeader`'s vertical rail in the left gutter | `primitives.tsx` |
| 4b | Every icon now comes from lucide. Fourteen glyphs were hand-rolled (bulb, rocket, book, chat, code, play, target, star, bolt, info, warning, check, cross, arrow) and twenty-four came from lucide, at the same nominal 24-grid and stroke width and visibly not the same family. `iconByName`'s keys are unchanged, so no deck or plan needed editing. Added: `browser`, `users`, `container`, `package`, `layers`, `laptop` | `icons.tsx` |
| 6 | The severed request is one element spanning the whole gap: the dashed line starts on the machine's bottom edge, ends on the friend's browser's top edge, and the X sits on its midpoint over an opaque disc. It was a 30x34px SVG floating in a 12px gap, touching neither box. `RevealGroup` runs at `gap-0` so the connector owns that space | `MachineBoundary.tsx` |
| 7 | The machine chip carries a laptop mark; the dashed box went from `px-4 pb-4 pt-6` to `p-6`; the three tiles are solid white on one hairline border instead of five layers of lit paint; React and Django carry their PNG marks (hard rule 12) and the browser an `AppWindow` rather than `devices`; the two port lines are `nwBlack` instead of teal and brand blue. The deck also drops the frame's "One machine" label, which said what the chip inside already said | `MachineBoundary.tsx`, deck slide 7 |
| 8 | **Hover is gone deck-wide.** `HoverAside` is a pass-through and `MoreDot` renders nothing, so every points figure loses its popover; `index.css` loses the lift, the affordance fade and the `:has(...:hover)` slot raise. Each point's `detail` is visible copy in the card now. The cards fill the well: `CARD_MAX` 420 to 566, a roomy type tier past 420px of card, and the deck passes `width={1152}` so the left card's edge lands on x=64 | `pointsChrome.tsx`, `PeerCards.tsx`, `index.css`, deck slide 8 |
| 10 | Redrawn as a conversation: two labelled silhouettes leaning toward each other, a dialogue box over each with its tail pointing at the speaker, and the third beat centred under both. The solid brand-blue banner is gone, its words are the slide's lead, and the slide is a `ContentSlide` rather than a `ScenarioSlide` | deck slide 10, new local `TwoVoices` |
| 12 | The lane line touches both machines (`-mx-4` cancels the row's gap) and ends in an arrowhead; the label sits ON the line on an opaque chip, in brand blue instead of danger red; the packet paints over the label rather than under it. The frame is `padTop={40} padBottom={40}`, so the panels no longer sit 142px below the frame's top border and 21px above its bottom | `ContainerJourney.tsx`, deck slide 12 |
| 16 | The definition moved out of the `lead` and sits directly over the three points, nudged up 2px. **The title did NOT move**: hard rule 19 pins the kicker and title to x=64 on every slide, and the user chose the compliant reading when asked | deck slide 16 |
| 19 | All three boxes share one left edge at x=64 and one width (`width={1152}`; the figure was `mx-auto` at 1100 inside a 1152 well, so the rows sat 26px right of the callout). `RuleStack` rows take an optional glyph in the marker column, and their rows are flat white with one accent edge like `PeerCards` | `RuleStack.tsx`, deck slide 19 |

## Noticed, not fixed

Out of scope for pass 1. Recorded rather than changed, per the user's scope
instruction.

1. **Slides 15 and 29 inherit the `ContainerJourney` changes** (the lane, the
   arrowhead, the label on the line), because the fix belongs in the component
   and not in three copies of it. What they did NOT get is slide 12's frame
   padding, which is a per-slide prop: they still pass `padTop={92}` with the
   default foot, so their panels still sit low in their frames. One prop each.
2. **The lane sits at the top of the machine panels**, not at their middle, so
   the arrowhead points at the destination's top-left corner. `mt-14` in
   `ContainerJourney` is the number; moving it would re-lay slides 15 and 29 as
   well, which is why it was left.
3. **The light family's two background arcs** still draw on every content slide.
   The agenda opted out with `decor={false}`; doing the same deck-wide is a
   30-slide change and was not asked for.
4. **`RuleStack`'s right third is empty** on a termed set, because the tone chip
   column is reserved and a termed row suppresses the tone word. Slide 19 shows
   it as 300px of nothing at the end of both rows.
5. **The travelling packet stays in the DOM at `opacity: 0`** after act 0
   finishes, so all three harnesses measure a 180x45 box that nobody can see.
   Benign today, and exactly the kind of thing that reports as an overflow the
   day the figure moves.
6. **v3's `CLAUDE.md` says the deck is 47 slides**; it is 45, and
   `deck.config.json` has always said 45. Fixed in this project's own
   `CLAUDE.md`, left alone in v3's.

## Worth promoting to the kit, if approved

None of this has been promoted. Hard rule 14 wants the user to say so first, and
a design pass in progress is not approval. In rough order of how much a second
deck would want it:

1. **No hover, anywhere** (`pointsChrome.tsx` + `index.css`). This is the one
   change that is a RULE rather than a component: a projected deck has no
   pointer, so a hover-only aside is content the room never sees. Promoting it
   means the same pass-through in the kit and the same three CSS blocks removed,
   and it would also want `NodeShell`, `TraceTable`, `TourStops` and
   `AlternatingRows` given the same treatment. None of those four is used by
   this deck.
2. **`Kicker` without its leading dash.** One line, and it fixes every deck.
3. **The lucide-only `icons.tsx`.** Same keys, one family.
4. **`AgendaSlide` and `SectionBreakerSlide`** as re-laid out here.
5. **`PeerCards`' roomy tier and visible `detail`**, and **`RuleStack`'s
   optional marker glyph**. Both are additive: an existing call site renders as
   it did.
6. **`TwoVoices`**, as the character variant of `ChatThread` that its own doc
   comment already anticipates. It is inline in the deck file today.
