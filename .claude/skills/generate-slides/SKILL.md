---
name: generate-slides
description: The complete, mandatory procedure for generating or regenerating slides in a NxtWave session deck. Use whenever the user says generate slides, build the deck, make the slides, create the deck, turn the plan into slides, add slides, or regenerate a deck, and whenever slides are produced from a slide-wise plan. Covers the plan gate and its required path, reusing the base template instead of writing new markup, choosing slide types, illustrations and figures, icons, transitions and reveal steps, when a new component is justified, the full render-based verification sweep, and the rule that durable user feedback is offered to a named skill file before it is applied. The user should never have to restate any of this.
---
<!-- cSpell:ignore colour colours neighbouring lucide deployement NxtWave devPort -->

# Generating slides

This is the whole procedure. The user asks for slides; **you** supply
everything below without being told. Never ask them to re-specify what is
written here.

---

## 0. Gate: is there a signed-off plan?

Slides are generated **from a plan**, never from a conversation.

The plan is at, and only at:

```
<course>/session_plans/<session_name>/plan.md
```

- **No plan there?** Stop. Do not generate a single slide. Write the plan
  first, following `slide-kit/workflow/SLIDE_WORKFLOW.md` stages 1 and 2, put
  it at that exact path, and hand it to the user for sign-off.
- **Plan exists but is not signed off?** Stop and ask for sign-off. Say plainly
  that you are holding at the gate.
- **User says "just generate, skip the plan"?** Say once that reordering after
  slides exist means rebuilding screenshots, animations and step counts, then
  do as they ask. Their call, not yours.

**Three things to check in the plan before generating**, all hard rules that are
cheapest to catch here (`PEDAGOGY_GUIDELINES.md` sections 2, 2b and 3):

1. **Two opening slides per concept, and a named framework.** The plan says
   which of STAR, 4MAT, SCQA or Merrill each concept runs, and the pick matches
   the kind of concept. One opening slide means the cost beat is missing and the
   mechanism will arrive cold. This is the single most common defect. **Never
   name a new framework at this stage** — the set grows at plan time, with the
   user's confirmation, or not at all.
2. **A term ledger, and no term used above its own introduction.**
3. **No artefact shown assembled on its first appearance.**

If the plan fails one of these, say which and fix the plan before generating —
re-cutting a generated deck costs screenshots, animations and step counts.

Re-read the plan in full at the start of every generation run, even one you
wrote yourself earlier in the session. Generate what the plan says, not what
you remember of it.

---

## 1. Load the rules before writing copy

Read these, in this order, and treat them as binding:

| File | Governs |
|---|---|
| `.claude/skills/slide-content-rules/SKILL.md` | **hard rules.** Banned punctuation and words, terminals, the STAR shape of a concept, prerequisite order, one element per slide, problem sequencing, one idea per slide, parallel reveal, chrome colour, illustration honesty |
| `slide-kit/workflow/TEXT_GUIDELINES.md` | titles, kickers, how a line should read |
| `slide-kit/workflow/PEDAGOGY_GUIDELINES.md` | **narrative flow.** Sections 2, 2b and 3 are hard rules: one named framework per concept opening on a need and closing on proof, nothing used before it is introduced, nothing shown assembled |
| `slide-kit/workflow/STYLE_GUIDE.md` | colour, type, which slide type suits which content |
| the session's own `CLAUDE.md`, and any skill in `<course>/workflow/skills/` | decisions already made for this specific deck |

The hard rules win over everything, including the user's phrasing in a
one-line request. If a rule blocks what was asked, say so and propose the
compliant version.

---

## 2. Reuse the template. Do not write new markup.

The kit already renders every slide shape this deck needs. **Compose existing
components; do not hand-roll layout, spacing or colour.**

Start from `slide-kit/slide-template/src/decks/sampleDeck.tsx` — the exhaustive
gallery of every slide type and figure. Whatever you are about to build is
probably in there already.

**Slide types** (`src/slides/`), one per shape of content:

`BrandSlide` · `WelcomeSlide` · `AgendaSlide` · `SectionBreakerSlide` ·
`SectionBreakerImageSlide` · `ContentSlide` · `ContentNoteSlide` ·
`ContentLeftImageSlide` · `ContentRightImageSlide` · `ContentTopImageSlide` ·
`ContentBottomImageSlide` · `OnlyImageSlide` · `CodeBuildSlide` ·
`CodeSyntaxSlide` · `CommandSyntaxSlide` · `ProceduralStepsSlide` ·
`FlowChartSlide` · `StatusPointsSlide` · `ScenarioSlide` · `ConversationSlide` ·
`ChatSlide` · `ChatCharacterSlide` · `QuestionSlide` · `QuestionPointsSlide` ·
`QuizTimeSlide` · `PracticeSlide` · `RecapSlide` · `KeyTakeawaysSlide` ·
`NextSessionSlide` · `FeedbackSlide` · `ThankYouSlide` (also the All the Best send-off)

The Python course's shared figures (the step controls, the code pane with
blanks, the memory tiles, the phone, the classroom quiz, `Group` / `Focus`)
are in the kit too since 2026-10-14, under `src/ui/foundations/`, imported by
path: `@/ui/foundations/common`, the way the sessions imported
`./figures/common`. A new deck starts from the template, never from the
previous session's folder.

**Four pairs are easy to confuse, and picking the wrong one is the commonest way
this content ships wrong.** The registry has the full text; the short version:

| If the content is | Use | Not |
|---|---|---|
| the SHAPE of a construct or command | `CodeSyntaxSlide` / `CommandSyntaxSlide` | `CodeBuildSlide`, `Terminal` |
| a real file built up, or a real command run | `CodeBuildSlide`, `ContentSlide` + `Terminal` | the syntax types |
| a list where rows carry verdicts | `StatusPointsSlide` | four stacked `Callout`s |
| an exchange, up to four short turns | `ChatSlide` | `ConversationSlide` |
| an exchange, five or more turns | `ConversationSlide` | `ChatSlide` |
| a question whose answer is the next slide | `QuestionSlide` | `QuestionPointsSlide` |
| a question answered by 2 to 3 points on the same frame | `QuestionPointsSlide` | `ContentSlide` |

**Building blocks** (`src/ui/`, all via the `@/ui` barrel):

`SlideBase` · `SlideHeader` · `Kicker` · `Chip` · `NumberBadge` · `BulletList` ·
`Card` · `CardGrid` · `StatTile` · `Callout` · `ChatThread` · `CodeBlock` ·
`Terminal` · `Shot` · `DataTable` · `FileTree` · `StepList` · `FlowChart` ·
`StatusList` · `SyntaxBreakdown` · `AnalogyMap` · `JourneyRoadmap` ·
`LayerStack` · `StackUp` · `ScenarioCard` · `Illustration` · `Nova` · `Reveal` ·
`RevealGroup` · `Decor` (`DotGrid`, `Blob`, `Orb`, `WaveArc`)

`Callout` takes five kinds plus `error`. `error` means "this does not work";
`warning` means "this can bite you". They were one colour until a deck needed to
say both on one slide.

Colour comes from `src/design/tokens.ts`. **Never write a hex literal in a
deck file.** If a colour you need is missing, that is a tokens change, raised
as such.

Anything under `src/design/`, `src/ui/`, `src/slides/`, `src/motion/` or
`src/deck/` is **kit-owned and gets overwritten by `sync-kit.mjs`**. Your deck
is `src/decks/<session>Deck.tsx` and nothing else. See
`slide-kit/slide-template/KIT.md`.

**Three things every deck carries, whatever the plan says** (user, 2026-10-05
and 2026-10-06, for every deck from then on; none is a choice the plan makes):

- **The agenda mark reads `Agenda`, large, over the session's name, small.**
  `<AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA} />`,
  and nothing else as the title. The name fits itself inside the mark; never
  shorten it. The points lay themselves out too: on the arc, the group centred
  on the mark's centre line with equal gaps, clear of the speaker box. Pass the
  items and nothing about position. Content rule 39 has the full text and the
  check; the kit's `AgendaSlide` carries it since 2026-10-14.
- **Navigation three ways: keyboard, two-finger trackpad swipe, touch swipe.**
  One gesture, one slide, never over an on-slide control. The kit's
  `src/deck/useGestureNav.ts` does it (in the kit since 2026-10-14); a deck
  adds nothing. Section 7 says how it is checked on the built file.
- **The standard feedback slide** (content rule 41): the kit's
  `<FeedbackSlide lesson={SESSION} />` with id `feedback`, nothing copied. It
  has the QR code, the form link and the Google Form in a frame. The close is
  fixed: Next Session, then feedback, then Thank You, then All the Best
  (`ThankYouSlide title="All the Best"`). Never redrawn: the source of truth
  is the kit's built gallery, and `feedback-check.mjs` (in the kit) must
  report an exact copy on the built deck.

**On every built card, the step controls and autoplay pacing are fixed too**
(user, 2026-10-07, on Python session 23, "global rules … including slides
created in future"):

- **Next and an icon-only Autoplay button, small, low, overlapping nothing.**
  Autoplay is a round Play button (▶) with no label: a click toggles it, and
  the icon shows the state, Play (▶) while off and Pause (⏸) while running.
  It carries `aria-label` and a tooltip, `Autoplay`. Both buttons are smaller
  than the old pill pair and sit lower on the frame, and neither may touch the
  slide's content, the player's control bar or the logo. When a card's content
  reaches the buttons, move the content up, never the buttons. The source is
  Python 23's `src/decks/figures/controls.tsx` (`StepControls`); copy it
  unchanged.
- **Autoplay paces at 2.5 seconds per step on average.** With Autoplay on, a
  step stays on screen 2.5s from the moment it starts, longer only when the
  step's own motion is still running (then it waits for the motion to settle
  and holds a short beat). The source is Python 23's
  `src/decks/figures/autoplay.ts` (`STEP_MS`). Which slides open with
  Autoplay on is the plan's call, per deck.

Why: Python 22 and 23 shipped a labelled `Autoplay Off` pill and a full-size
Next that sat close to the cards' content, and an autoplay paced by reading
time that held some steps up to nine seconds. The user found the labelled pill
too big and the pacing uneven.

---

## 2b. The carry-forward standard: apply it to every deck

User, 2026-10-08, after Python sessions 24 and 25: *"save the improvements and
use them in further slides, all the changes and improvements, use them
accordingly."* Every new deck (and every fix pass on an older one) gets all of
the following without being asked. The working copies are in
`Outputs/python/25_list_methods/src/decks/figures/`, which carries session 24's
versions merged with session 25's. Copy them with the scaffold; they live
under `src/decks/`, so `sync-kit.mjs` never touches them. Say in the plan which
items each card uses.

**Grouping and focus** (session 24's review, its rule G3)
1. **One cluster, one container.** Things that belong to one concept, one
   exercise or one worksheet sit in one `Group` (`common.tsx`): a near-white
   wash, a 1px rim, a soft shadow, one padding. A program with its output is a
   cluster; a question with its vote and picture is a cluster.
2. **`Group active`** lights the cluster the room is working on: the vote on an
   ask press, the desk or picture on a step press, the brief while the timer
   runs, the result once it shows. A group that never lights has no transition.
3. **`Focus`** (`common.tsx`) rings the one program the room is asked about,
   until the answer shows.

**Code, captions, options** (session 24's rules G1, G2, G4)
4. **`Code.tsx`** draws code (a session-local override of the kit's
   `CodeBlock`): three or more underscores are a fill-in blank, a dashed amber
   slot with a pencil; a line whose text changes fades up into place; line
   tints ease over 420ms.
5. **`StepCaption`** (`trace.tsx`) centres its text, and a new caption fades the
   old one out before it rises in.
6. **`Option` / `Vote`**: the letter and the text share one centre line with
   equal padding above and below; `nowrap` keeps an option on one line,
   `template` gives unequal columns.
7. One size per role: `CODE_FS` 15 and `OUT_FS` 16 on every content card, chosen
   so the longest spec line fits its column. Never a per-call font size.
8. Task briefs: short actions (`Predict`, `Run`) are chips inline on the text
   line, in the spec's order.

**Motion** (session 25's G1 to G3)
9. Nothing pops. A swapped program or option set eases in (`Fresh`,
   `pieces.tsx`); a swapped layout eases in (`Appear`); a cursor, an empty
   placeholder or a marker fades in; anything that leaves fades out.
10. Every motion has a job: guide the eye, show a process, reveal an answer.
    Arrows have clean filled heads and draw themselves along their path in
    reading order (`SumArrow`, `Tasks.tsx`); a mark on a token is a rectangle
    that path-draws (`DotMark`, `Hooks.tsx`).
11. Autoplay and step-wise give the same result: movement inside a press runs
    through `usePhase`, and autoplay waits for it to settle.

**Pictures** (session 25's G4 and slide fixes)
12. Every person is a character-lab character (`cast/` and `Cast.tsx`, copied
    from session 22): `Idling` for a living, subtle idle; a head-local prop
    (headphones) via `head`. A beard is round or oval, or none.
13. Phones at real proportions, 1 : 2.06 (for example 209 x 430), with
    `LiveClock` in the status bar; no `truncate` in a row, every name whole.

**Never**
14. No text outside its box, at any step (section 7, `box-overflow-check.mjs`).
15. No drag-to-move content unless the user asks for it (archived in
    `Outputs/python/workflow/archive/movable-content/`).

**The gate**, before a deck is reported done: typecheck, `qa`, `video-safe`,
`align-check`, `mixed-align-check`, `overlap-check`, `controls-clear-check`,
`box-overflow-check`, `spec-check`, `feedback-check`, `gesture-check`,
`agenda-check`, `ligature-check`, `autoplay-check`, then the screenshots read
by eye at step 0, mid-run and fully revealed. Adding groups makes cards taller:
when a card then reaches the controls, restack it (side by side, a row of
options, a shape that mounts when it arrives), never shrink the buttons.

Why: session 24's review produced these as its rules G1 to G4, and session 25
needed three fix passes to reach the same standard (characters, ease-ins,
phones, arrows, overflow, groups), because none of it was written where the
next deck would read it.

## 2d. Changes made in the deck are kept in the file that is shared (user, 2026-10-27; every deck)

User, 2026-10-27, on Cloud Computing session 3 (`setting_up_your_aws_account`):
*"once i change any [text] or skip or delete, that html need to be like that even after i shared"*,
and *"it need to be applied to every deck from now on."* Every new deck, and every fix pass on an
older one, carries the presenter player with these, without being asked:

1. **Edit, Skip, Delete and Download** in the presenter view (`src/deck/presenter.ts`,
   `EditLayer.tsx`, `SlidePicker.tsx`, `DeckControls.tsx`, `pristine.ts`).
2. **Edits made under `npm run dev` go to source:** `src/decks/slideEdits.ts`, written by the
   `/__deck/edits` endpoint in `vite.config.ts`, baked in by `npm run build:html`.
3. **The built HTML saves into itself in Chrome and Edge** (`src/deck/fileSave.ts`,
   `FileSaveBadge.tsx`): the first change asks once for the file, then every edit, skip and delete
   is written into the open file, so the file that is shared opens as it was left, with every
   control still there. Firefox, Safari and Brave (flag off) have no API for it: there a change
   stays in that browser, and the user was told so. Never claim it works in every browser.
4. **Edits are keyed by the element's original words**, not its position, and re-applied after any
   re-render (a position key put edits on the wrong text, and a figure's clock put the old words
   back: the "edits revert" report of the same day).
5. **Ctrl+Z, Ctrl+Y / Ctrl+Shift+Z** undo and redo text edits, and the saved file follows.

The working copy is `Outputs/cloudcomputing/setting_up_your_aws_account/`: copy `src/deck/` and
`vite.config.ts` from it with the scaffold, and create an empty `src/decks/slideEdits.ts`. The kit
template does NOT have the presenter player yet; putting it there is a kit PR (section 6). Before
reporting a deck done, build it and check a save: edit a word in the built file, reopen it in a
fresh browser profile, and see the word: `node file-save-check.mjs` (copy it from that session) must
print FILE SAVE OK.

Why: the edits lived in `localStorage` only, one browser's memory, so the deck the user shared
showed none of them, and the user believed the feature was broken.

**Check it first, on every deck you touch** (user, 2026-10-28: *"the 2nd point need to be applied
for all the decks from now on"*). Before the first edit of a fix pass, a review pass or a new build:
`ls src/deck/fileSave.ts`. If it is missing, port it before anything else (the files listed above,
`src/decks/slideEdits.ts`, `file-save-check.mjs`), and report the port. Why: Cloud Computing
session 2 (`deployment_and_service_models`) had a full TR-comparison fix pass on 2026-10-27, the day
this rule was written, without the port; the user shared its HTML the next day and every skip and
delete was gone. Until the kit template carries the player (a kit PR, section 6), a deck copied
from the kit does not have it, so this check is the only thing that catches it.

## 2c. Fixed slide types and chrome: the quiz slide, Key Takeaways, the progress bar, arrows to labels

Four things the user fixed on 2026-10-22 as permanent rules for every
session. They are not choices a plan makes; a deck that departs from them is
wrong.

### The quiz slide

Every quiz slide is a replica of **slide 25 of
`Reference ppt's/virtualization-and-hypervisors 2.html`** ("Quiz Time!"): its
layout, structure and styling, nothing else (user, 2026-10-22, a permanent
rule). The reference implementation is the Cloud Computing Fundamentals
session's `src/ui/foundations/ClassroomQuiz.tsx`; copy it, do not redraw it.

What that slide is, so a copy can be checked against it on the 1280 x 720
canvas: the light `brand-soft` ground with a soft brand blob at the bottom
left; a two-column grid centred on the page; on the left, at x 64, the pill
(`Your turn`, 16px bold uppercase, 0.18em tracking, brand-700 ink, a 1px
brand ring at 15%), the title `Quiz Time!` (88px, weight 800, line height
0.98, 24px below the pill) and a 220 x 6 bar from brand through accent to
accent at 30%; on the right a 540 x 400 stack of the reference's own four
pictures (`public/assets/quiz/brain.png`, `bulb.png`, `bubble.png`,
`mark.png`, layered in that order) with a 210px radial amber glow behind the
bulb. No kicker, no divider, no title header: this slide type keeps the
reference's own frame.

**The timer stands where the reference's yellow dot stood** (user, same
day): the pill opens with a 14px clock glyph whose hand sweeps once a minute,
then `mm:ss` counting up from the moment the slide opens, in the dot's accent
colour. The reference deck itself carries no timer (every slide of it was
searched); the timer is built to the user's description and this is now the
standard. It holds at `00:00` on harness URLs and in picker thumbnails.

The quiz slide's words are the pill and the title. Instructions for the
room ("open the quiz on your portal, answer alone, we go through the answers
together") go in the slide's speaker notes, not on the slide: the reference's
structure has no place for a list.

### The quiz slide (addendum, user 2026-10-23)

The pill shows the clock glyph and `Your turn` only, on EVERY quiz slide: no
`mm:ss`, nothing counting (user, 2026-10-23: "remove the time going, only
the clock icon and Your turn", then "follow slide 64's quiz design for
all"). `ClassroomQuiz` keeps a `timer` prop, default `false`; a deck that
wants the count asks for it per slide, and with `timer` false the count is
never mounted, so no interval runs.

### The Key Takeaways slide

Every Key Takeaways slide is built to the reference in
**`slidestraining/Untitled`** (user, 2026-10-22, a permanent rule). That
folder is reference only: never modify, move or delete anything in it; copy
the assets a deck needs into its own `public/assets/takeaways/` (`check.png`
is the folder's `Frame.png`, `student.png` a 700px copy of `Cheerful Student
with Books and Checklist.png`). The reference implementation is the Cloud
Computing Fundamentals session's `src/decks/figures/closing.tsx`.

What the reference shows (`Slide 16_9 - 104.png`): the kit header with the
session as the kicker and `Key Takeaways` as the title; one column of items
at x 64, each the reference's 37px blue check disc beside one line whose head
is bold and whose rest is regular (24px there; 20px when the lines run to two
lines, as a TR's agenda lines do); the cheerful student with her books
standing at the lower right, her feet past the bottom edge. Content rule 20
still holds: the strings are the agenda's, word for word; the head and the
rest are joined by the TR's own colon, not the reference's dash (rule 1). The
student must stay clear of the reserved video area (top right) and of the
player bar (bottom left).

### The Key Takeaways slide (addendum, user 2026-10-23)

The list is the agenda slide's items and nothing more: the five section
titles, one line each, 24px bold beside the check disc, rows 72px apart. The
sub lines a deck's agenda data may carry are not rendered (user, 2026-10-23:
"whatever is present in the agenda slide, do not add extra points").

The student is anchored to the slide's foot, not to the list. In the
reference her picture runs down into the blue strip (her shins are under it),
her head top at about 42% of the frame height and her right edge clear of
the mark at the bottom right. So: her picture's foot sits on the slide's
bottom edge (y 720), the foot band crossing her shins; 270 wide, 405 tall
(the file's own aspect); right edge at x 1160; the body box is given the full
height under the header (`BODY_H`) so the centring rule has no slack to move
it and her `top` is one fixed number (user, 2026-10-23: "check the placement
of the illustration, it attaches to the gradient strip in the reference,
reposition it"). Reference implementation: the Cloud Computing Fundamentals
session's `src/decks/figures/closing.tsx`.

### The section bar (user, 2026-10-22, reworked 2026-10-23; every session)

The blue band at the foot of every light slide is **one segment per agenda
point, all the same width**, and every segment is a button. It is not a
progress bar: nothing in it fills, because the counter already says how far
the deck is and the user asked for the sections alone (2026-10-23: "no
progress bar below, just the sections with equal width, a hover effect that
shows the section breaker preview in small, the bar height reduced, click to
navigate to that section breaker"). The shipped reference implementation is
`Outputs/cloudcomputing/cloud_computing_fundamentals/src/ui/SectionBar.tsx`
with the `segments` and `jump` fields `Deck.tsx` puts on the deck context;
copy those pieces into a session (or sync them from the kit once the kit
carries them) rather than writing a bar of your own.

- **Boundaries come from the section breaker slides**, nothing else. `Deck`
  recognises a breaker by its element type (`SectionBreakerSlide`, with the
  label "Section divider" as the fallback) over the ACTIVE list, so a deck
  built from the kit gets the bar with no configuration, and a skipped
  breaker simply drops its segment. The slides before the first breaker
  (brand, welcome, agenda) are an opening segment that jumps to slide 1; the
  closing slides belong to the last section.
- **Equal widths, a 3px gap, 4px tall**, the template's brand blue, in its
  old place. The section on screen reads a touch stronger, by opacity only;
  nothing changes size, nothing scales, no fill.
- **Hover shows the breaker.** While a segment is hovered or focused (and
  for a moment after a tap on touch), a 240 x 135 card above it renders that
  section's breaker slide live, the slide's own element at 1280 x 720 scaled
  down under `InstantContext` in a `.deck-thumb` wrapper (so the motion layer
  holds still), `inert`, with the section name on a pill over the card. The
  card is lifted clear of the player's control bar.
- **Pressing a segment goes to that section's breaker**, landing fully
  revealed like a picker jump; next, previous, touch and the keyboard carry
  on from there. Enter and Space work on a focused segment. The pointer
  target is a 28 screen-pixel strip above the band, sized against the
  slide's zoom so a thumb hits it on a phone, portrait or landscape.
- **The preview is never in the DOM at rest**, and never under `?all`,
  `?noauto` or `?still`: the harnesses measure every slide, and a card that
  happened to be open would be reported as content at the foot of the slide.
  It is mounted only while shown, so the entrance layer never animates it,
  and every drawn piece of the band is under 16px tall, so the band itself is
  never taken for a unit.
- Dark slides (brand, dividers, thank-you) carry no bar, as before.

### An arrow that points at a label is built from the label's numbers

An arrow between a picture and a label (slide 11 of Cloud Computing
Fundamentals: the laptop and the `1 Client Infrastructure` pill) is never
placed by eye. The label gets a FIXED width, the picture is placed with its
centre on the label's centre line, and the arrow's two ends are computed from
those same constants (picture right edge plus a gap, label left edge minus a
gap, one `y`). The reference is `ArchitectureWalk` in that session's
`src/decks/figures/basics.tsx` (`PILL_W`, `LINE_Y`). Why: the user found the
arrow misaligned on 2026-10-22 and asked that it never reappear on
regeneration or on any other slide with the same pattern; an arrow whose
ends are typed numbers drifts the first time either end is nudged.

## 3. Illustrations and figures

A figure earns its place by making an argument a sentence cannot. Decorative
graphics are worse than none.

**Look for an existing figure first.** The kit already has domain figures, all
on the `@/ui` barrel: `ContainerJourney` · `TwoRuntimes` · `OneProcessRule` ·
`MachineBoundary` · `ComposeNetwork` · `VolumeSurvival` · `YamlNesting` ·
`Orchestra` · `HandRitual` · `AnalogyMap` · `LayerStack` · `JourneyRoadmap` ·
`StackUp` · `FileTree` · `FlowChart` · `Nova` (the character, with poses).

`TwoApps` and `RequestFlow` exist in `src/ui/` but are **not** on the barrel;
import them by path (`@/ui/TwoApps`) if you need them.

**The figure must depict this slide's own concept**, not the topic in general
(hard rule 8). A container diagram on a slide about networking is a decoration.

**Screenshots** go through `Shot`, from `public/shots/`, cropped to the point
being made with the relevant output highlighted (hard rule 11). Never a
full-window screenshot where a crop would do.

**Terminals** go through `Terminal`: one panel per terminal, with the folder
path shown (hard rule 3).

**Never invent output.** A terminal transcript, a file tree or a screenshot
must match what the command actually prints. If you have not run it, say so
rather than composing plausible output.

---

## 4. Icons

`src/ui/icons.tsx` is the house set: line icons on a 24-grid, `currentColor`,
`strokeWidth: 2`, dependency-free. **Use it.** `iconByName` on the `@/ui`
barrel resolves one by its `IconName`, which is how a plan or a data structure
names an icon without importing it. `lucide-react` is installed and available
for a genuine gap.

Icons inherit colour from context, so never colour one directly. An icon that
does not clarify what the label already says should be dropped, not chosen more
carefully.

---

## 4b. The vendored craft skills in `.agents/skills`

`.agents/skills/` holds third-party skills installed with `npx skills add`, and
`.claude/skills/` symlinks the ones relevant to a deck so Claude Code loads them
by description. `skills-lock.json` pins every one. **Do not edit a file under
`.agents/skills/`** — it is upstream content and the next `skills add` overwrites
it. Add a repo-specific rule to this file instead.

Reach for them by job:

| The job in front of you | Skill |
|---|---|
| authoring a reveal, a transition or a figure's entrance | `animate` |
| deciding whether something should animate at all | `animate`, `find-animation-opportunities` |
| reviewing motion you or another agent just wrote | `review-animations`, `12-principles-of-animation` |
| auditing a whole deck's motion and planning fixes | `improve-animations` |
| a figure that reads as flat, generic or off | `emil-design-eng`, `baseline-ui` |
| spacing, hierarchy and type on a slide that looks "almost right" | `baseline-ui` |
| auditing a deck's visual system against itself | `improve-ui` |
| motion that stutters on the projector or in the exported HTML | `fixing-motion-performance` |
| naming an effect so the user and you mean the same thing | `animation-vocabulary` |
| trying several designs for one figure before choosing | `prototype` |
| gesture, depth, materials, optical type | `apple-design`, `interaction-design` |
| an abstract divider or section illustration | `signal-geometry` |

**Two of these skills disagree with this repo, and the repo wins.**

1. **Durations.** `animate` caps UI animation at ~300ms with 30 to 80ms
   staggers, and it is right, for a control a person triggers dozens of times a
   day where the animation sits between them and what they came for. **A slide
   figure is that skill's own explanatory tier**: nobody triggers it, and it is
   read once from the back of a room while an instructor talks over it. This deck
   runs roughly double the UI numbers. Entrances 520ms, staggers 130ms, line
   draws 860ms, a whole figure assembled in about 2.4s. Session 6's figures were
   first built at UI speed and the user rejected them as too fast.

   Dividers stay a crossfade: a frame the room sees five times in one deck does
   belong in the "near-imperceptible or nothing" tier.

2. **Web-app assumptions.** These skills are written for interactive product UI.
   A deck has no hover, no drag, no routing and one viewport. Ignore everything
   about `:active` states, pointer capture, momentum, `prefers-reduced-motion`
   media queries (`src/index.css` already has one) and touch targets. Keep what
   is about perception: easing direction, never animating from `scale(0)`,
   transform-and-opacity only, stagger, and reviewing with fresh eyes.

`animate-expo`, `write-swift` and `ask-sonner` are installed but irrelevant here:
React Native, Swift and a toast library. There are no toasts in a deck.

Anything that hand-animates must still read `useInstant()` and mount at its final
state when true, or it will be the only thing moving during a Ctrl+arrow jump.

---

## 5. Transitions and reveal steps

Motion lives in `src/motion/`: `Reveal`, `Stepper`, `presets.ts`,
`continuity.ts`, `instant.ts`. Use the presets; do not write bespoke timings.

Two rules that cost real rework when missed:

- **Text and its supporting visual reveal together** (hard rule 6). A bullet
  arriving before the part of the figure it describes forces the room to read
  ahead and look back.
- **`continuity.ts` exists so an element shared by consecutive slides does not
  jump.** Check it before animating something that also appears on the
  neighbouring slide.

After the slide count is final, regenerate the step map:

```bash
node workflow/export/build-reveal-steps.mjs http://localhost:<devPort> <slideCount>
```

`src/export/revealSteps.ts` is generated. Never hand-edit it.

---

## 6. A new component goes back into the kit, and reaches it through a PR

Prefer composing. Build a new component **only** when the plan calls for an
argument no existing figure makes, and it will be reused or is too complex to
inline.

### It does not stay in the session

**And a fix to a kit-owned file never stays in the session either.** From
2026-10-05 to 2026-10-14 every kit-level fix (the agenda, the recap tone, the
feedback slide, the gestures, the player) was parked as a "session-local
override" under `src/decks/figures/` with a note that a kit PR would follow,
and the PR never did. Sixteen decks carried the fixes and the template carried
none, so the next deck built from the template lost all of them. A change to
anything `KIT.md` lists as kit-owned goes to `slide-kit/slide-template` on a
`kit/` branch and is merged before the deck that needed it is delivered. The
session may carry a copy while the PR is open, with the branch named in its
header; it may not be the only place the fix lives.

**Anything built while generating a session that a second deck would want is
copied back into `slide-kit/slide-template`.** Not left in the session, not
copied later, not "noted for next time".

This is not a tidiness rule. It is the rule this repo most often broke, and the
cost is measurable in the corpus:

- The syntax-anatomy figure was hand-rolled **three times**: `PortPublish` and
  `ExecAnatomy` in session 4, then `TargetAnatomy` in session 5. Session 5 had to
  rediscover, by shipping the bug, that session 4's SVG version put its labels on
  top of each other invisibly to every harness. It is now `SyntaxBreakdown` in the
  kit.
- A question posed to the room was written as a `ContentSlide` with an empty body
  in three sessions before `QuestionSlide` existed.
- `BrandSlide`, `CodeBuildSlide` and `QuizTimeSlide` sat in the kit, exported and
  working, **missing from the gallery** for several sessions. Decks were written
  as though they did not exist, because as far as the gallery was concerned they
  did not.

The test is the workflow's usual one: *would a different deck, next month, want
this?* A one-off arrangement for a single slide stays inline in the deck file.

### The procedure

`slide-kit/slide-types/README.md` holds the full text. The eight steps in short:

1. **Get approval.** The user says so; "it looked fine" is not approval.
2. **Move it into the kit** — `src/slides/`, `src/ui/` or `src/motion/` — and
   export it from the barrel. The session then imports it from the kit like
   everything else and keeps **no private copy**, or the two drift.
3. **Add it to `src/decks/sampleDeck.tsx`**, with a `notes` string saying what it
   is FOR, what it must not carry, and which type it is confusable with. The
   gallery is the only discovery mechanism there is.
4. **Add a row to the registry**, saying when to reach for it.
5. **Colours from `src/design/tokens.ts`, motion from the presets.**
6. **Verify by rendering**, through the full check list of section 7, at 1280x720. A new type
   has been tested at one content length on one slide, which is not tested.
7. **Commit it to the kit and raise a PR.** On a branch, never on `main`:

   ```bash
   git checkout -b kit/<the-type-name>
   git add slide-kit/slide-template slide-kit/slide-types/README.md
   git commit -m "feat(kit): <TypeName>, <what it is for>"
   gh pr create --fill
   ```

   The PR exists because `sync-kit.mjs --apply` will push this to **every other
   session**, including signed-off ones. That is a change worth a review before
   it can reach a recorded deck. Name in the PR body which sessions are expected
   to sync.
8. **Say that you changed the kit**, and name the sessions needing
   `sync-kit.mjs --apply`.

### Assets and content, the same way

Hard rule 13 already says every asset lands in `slide-kit/assets/` first and is
then copied into the session. The same holds for anything else a session needs
that is not session-specific: an icon, a tech logo, a figure, a slide type. The
central copy is the real one.

## 6b. Render the reference before you write a line of the deck

**If the session has a pedagogy-team lesson plan, it is a working deck, not a
spec.** `prog_foundations_LP/<session>/*_student_view_new_design.html` opens in
a browser and holds one finished frame per card its presenter walks. Screenshot
every one of them, at every state, and keep them beside you.

**Enumerate the presenter's own card list, never one card class.** The
presenter walks `document.querySelectorAll('.slide, .pcard')`: `.pcard` is an
activity panel, `.slide` is one of the original deck's own frames (a divider,
a syntax frame, a worked example) carried into the lesson plan between the
panels. **Check your count against the reference's own counter** (`n / 32` in
its control bar) before writing a line of the plan; if they differ, the
enumeration is wrong, not the reference. Python session 17 was built from the
`.pcard`s alone and shipped 20 of 32 cards; the user found the 12 missing
frames (user, 2026-10-05: *"don't miss any content or slide from the
reference"*). The cards are only visible in presenter mode: activate one by
clicking its `.p-cell` in the grid, then step its stage.

```bash
# ~40 seconds, once, at the start
node - <<'JS'
import { chromium } from 'playwright-core'
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 900 } })
await p.goto('file:///abs/path/to/..._student_view_new_design.html', { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)
const cards = await p.$$('.slide, .pcard')          // the presenter's own list, both kinds
for (const [i, c] of cards.entries()) {
  await p.evaluate((k) => document.querySelectorAll('.p-cell')[k].click(), i)   // presenter mode shows one card
  await p.waitForTimeout(500)
  await c.screenshot({ path: `/tmp/ref-${String(i + 1).padStart(2, '0')}.png` })
}
await b.close()
JS
```

**Why this is a numbered step and not a tip.** Session 14 was built by reading
that file's HTML and CSS as text -- extracting its SVG paths, its chip hexes,
its `data-anim-labels` -- and rebuilding each slide from the markup, without
ever rendering it. The result cost the user six to seven hours of sending
screenshots back: the tilted quiz card, the takeaways map, the three-column
trace, the day strip, the IO panel sizes. Every one of those was already
rendered in a file the model had open.

Reading a reference's markup tells you its DOM. It does not tell you what it
looks like, and what it looks like is the brief.

---

## 6c. Iterate on one slide. Sweep the deck once.

The three harnesses in section 7 settle **2600ms on every slide**. On a
44-slide deck that is two to four minutes per run, and it reports the same known
baseline nearly every time. Running it after each edit is the single largest
waste of wall clock in this repo.

- **While working on a frame:** screenshot that frame alone and look at it.
  Navigate by hash (`http://localhost:<devPort>/#/31`), not a query parameter.
- **Before committing a block of work:** run the full sweep once.

Look at every build at **step 0, mid-run and fully revealed.** Most of session
14's layout defects existed at exactly one of the three: variable boxes that
appeared mid-run and pushed the controls under the player bar, a caption row
that was empty until the first press and shifted the column into the lead, a
week strip whose running totals vanished on the last step.

**And know what the harnesses cannot see.** They catch collisions with the
instructor-video rectangle and the player bar. They do not catch a recap that
renders empty, an OUTPUT panel tinted the danger colour, a frozen animation, or
a figure that is simply ugly. On session 14 the user caught all four. Looking at
the PNG is the review; the harnesses are the gate.

---

## 6d. Fix the class, not the instance

A correction on one slide is almost always a correction on every slide of that
shape. Before replying, grep for the construct and fix all of it, then say which
slides were swept so the user does not have to check.

| What was asked | What it actually was |
|---|---|
| "slide 16 centre the code box" | every code-plus-panel frame: 16, 35, 38, 40 |
| "slides 35 and 38 are too small" | one component, two call sites |
| an OUTPUT header reading as an error | `IoPanels` `TONE.out = colors.danger`, every IO frame in the deck |

Three separate user rounds were spent on the first row alone.

---

## 6e. One deck, one worker

**Do not split a single deck across parallel agents by slide range.** Slides
look independent and are not: they share figures, the kit, the step engine and
the visual system, so two agents given "18 to 30" and "31 to 44" both edit
`VariableTrace`, `DayStrip` and `dailyChallenge.tsx`.

Session 14 was split three ways. One agent's entire slide-31 rebuild was
superseded and never merged, because the same slide had been rebuilt
independently an hour later; another's `DayStrip` change conflicted and had to
be hand-merged, and contradicted an explicit user instruction. The coordination
cost lands on the merge, which is the most expensive place for it to land.

Agents are for genuinely separate artefacts: another session, a lab, a research
pass, a skill write-up. If the user asks for parallel progress on one deck, say
plainly why the ranges are not separable and offer the alternative.

---

## 7. Verify by rendering. Never by reading.

Hard rule 10, and the one most often skipped. Reading your own JSX is not
verification.

```bash
npm run typecheck
npm run build:html

export CHROME_PATH=/opt/google/chrome/chrome
# The three sweeps are independent processes against the same dev server.
# Run them in PARALLEL: sequentially they take three times as long for nothing.
node video-safe.mjs  > /tmp/vs.txt 2>&1 &   # must print CLEAN
node qa.mjs          > /tmp/qa.txt 2>&1 &   # baseline is TWO flagged slides
node align-check.mjs > /tmp/al.txt 2>&1 &   # misplaced-but-inside-the-frame
wait

node preview.mjs && node scripts/build-preview-page.mjs
```

Each harness settles 2600ms per slide before measuring, because `AgendaSlide`
cues its items off a curve that takes ~2.38s to draw. On a 79-slide deck that
is 3.4 minutes of deliberate waiting per harness, so the parallel run matters.
Do not lower the settle time to speed it up: `KIT.md` records a signed-off
preview that shipped with every agenda captured two items in.

**Then look at the figures.** The three harnesses measure DOM rectangles, so an
`<svg>` is one box to them and a figure whose internal labels collide passes
every sweep. Screenshot each slide carrying a custom figure and inspect the
image, or read the contact sheet `build-preview-page.mjs` writes. Content rule
17 has the detail and the two collisions that prompted it.

**Then check that no slide mixes alignments** (content rule 38):

```bash
node mixed-align-check.mjs    # 0 of N slides mix left and centred blocks
```

It walks every slide's body box and names any slide that holds a block on the
left edge AND a block centred in the box, which the three harnesses above all
accept. Python session 17 shipped nine such slides past them: a session figure
centred itself under the kit's left lead. Fix the component, not the slide.

**Then check every arrow and every highlight, at every step** (content rules
42 and 43):

```bash
node overlap-check.mjs        # no arrow over a box, every highlight on its own bounds, no label on a box (rule 47)
```

It drives the built file through every build step of every slide and names
any arrow, cursor or connector that overlaps a box, and any glow wrapper wider
or taller than the element it highlights. None of the harnesses above can see
either: both sit inside the frame and inside their zone. Python session 19
shipped a cursor inside its boxes on slide 12 and a column-wide glow on six
slides past all four of them. Copy the script from Python 19's root.

**Then check that nothing touches the step controls, at any step** (user,
2026-10-07, on Python session 24, "make sure this overlap issue does not occur
again on other slides"):

```bash
node controls-clear-check.mjs http://localhost:<devPort> <count>   # must print CLEAR
```

It drives the dev server through every build step of every card with
Autoplay off and names any text or box within 6px of the Next button, the
Autoplay button or the player's control bar. Fix a hit by moving or resizing
the content, never the buttons (section 2). Copy the script from Python 24's
root. Why: on Python session 24, E1's step captions and H2's output ran
behind Next and Play, and overlap-check, qa, video-safe and align-check all
passed, because none of them looks at the buttons.

**Then check that no text runs out of its box, at any step** (user,
2026-10-08, on Python session 25, "make sure no overflow happens, it is a
global rule … follow this in the future decks"):

```bash
node box-overflow-check.mjs http://localhost:<devPort> <count>   # must print NO OVERFLOW
```

It drives every build step of every card and measures each piece of text
(as drawn, line by line) against the nearest box around it: a card, a
panel, an option, a pill, a phone row, anything with a background, border,
ring or shadow, and every clipping ancestor. It also names any element that
cuts its own text (`truncate`, an ellipsis, a fixed height). Fix a hit by
giving the text room: a shorter line, a smaller block beside it, a taller
box, or removing a decoration that takes the space. Never by clipping,
`truncate` or an ellipsis, which hide text instead of fitting it. Copy the
script from Python 25's root. Why: Python 25's takeaway cards let their
sentences run below the card, the card headings clipped their descenders,
and the phone rows cut song names to `Samajavaragam…`; qa, align-check,
overlap-check and controls-clear all passed, because none of them measures
text against its own box.

**Then check every heading is on one line.** On the screenshots, look at each
slide title and each card, step or panel title. Any heading that wraps gets
its words shortened, per content rule 35. Do not shrink the font or widen the
box.

**All four, every time. `align-check.mjs` is not optional.** `qa.mjs` only
catches content that leaves the 1280x720 frame and `video-safe.mjs` only
catches content that enters the instructor-video rectangle. Neither has any
opinion about content that is comfortably inside the frame and still wrong: a
narrow figure stranded in a full-width block, two blocks overlapping, a column
hard against an edge. Session 4 was reported clean by the first two and the
user still opened it to find overlapping slides, because this harness was
skipped.

`qa.mjs`'s expected baseline is **three** slides, all `NO LOGO` only and all
benign: the Welcome frame, Thank You and All the Best, which carry the mark on
stage instead of in the footer. Anything else is a regression.

**Re-run `video-safe.mjs` and `qa.mjs` as a pair after any layout change.**
They pull in opposite directions: video-safe wants content pushed down out of
the top-right rectangle, qa wants it to fit above the bottom of the frame, and
every pixel a fix adds at the top is a pixel lost at the bottom. Satisfying one
alone will break the other, which happened twice while building session 4.

Three levers fix a slide that trips either one, and picking the wrong one
wastes a sweep:

| Symptom | Lever |
|---|---|
| Content sits too high, into the video rectangle | move it into Space-1, centred on y=434, per content rule 32. **Not** a `lead` in the header: under rule 32 the header holds the kicker and title only, and the lead is the first block in Space-1 |
| A panel is genuinely too long | `fontSize` on `CodeBlock` or `Terminal`. **Not `maxHeight`**: that only adds an inner scroll, and the harnesses measure the un-clipped rect, so the number does not move |
| Content is narrow by nature but drawn full width | cap the width and centre it inside Space-1 (x 64..1159), per content rule 32. The video rectangle is above y=220, so content in Space-1 never meets it |

Before running any of it, **update `slideCount` in `deck.config.json`** if the
count changed. Every harness reads it, and a stale count makes the sweep stop
early and report success on slides it never looked at.

Then look at the output. `qa.mjs` flagging something is not noise to wave past.
If a captured slide looks mid-animation, the settle time is the suspect —
`KIT.md` explains why the harnesses wait 2600ms.

**Then check the three ways the deck moves, on the BUILT file.** Every deck
navigates by keyboard, by a two-finger horizontal swipe on a trackpad, and by
a touch swipe (user, 2026-10-05, for every deck from now on; the kit's
`src/deck/useGestureNav.ts`). Drive `dist-single/<htmlName>.html` from
`file://` with playwright and confirm: an arrow key moves one slide; a
trackpad burst with an inertia tail moves exactly one slide, in both
directions; a vertical wheel moves nothing; a touch swipe left is next and
right is previous; a tap and a vertical scroll move nothing; a swipe that
starts on a button, a slider or an option does not change slide.
`gesture-check.mjs`, in the kit, does all of this against the built file.
Run `agenda-check.mjs` beside it (content rule 39: the mark says `Agenda`
over the session name, fitted; `AGENDA_SLIDE` names the slide).

Report honestly: what passed, what failed, what you did not run.

---

## 8. Feedback: ask whether to record it, then record it before applying

When the user gives feedback on slides, **the fix is the smaller half.** The
same correction arriving a third time means it was never written down.

So, on feedback that is **durable and general**, ask:

> Should I add this to `<the specific file>` so it holds for future decks?

Ask **before** applying it, then apply it. Do not silently record it: the user
decides what becomes a rule.

### Which feedback to ask about

Not every remark is a rule, and asking after each one is its own kind of noise.

| Ask about it | Do not ask |
|---|---|
| a correction that would apply to the next deck too | a typo, a wrong number, a factual fix |
| a stated preference — wording, colour, density, pacing | a one-off "move this box left" |
| "never do X" / "always do Y" | a change the plan already called for |
| the second time the same correction is given | anything already written in a skill |

The test: **would this have changed what I did, on a different deck, next
month?** If yes, ask. If it only makes sense for this slide, just fix it.

When the same correction lands twice, do not ask any more — say that it has now
come up twice and propose the exact wording to record.

### Where it goes

| Scope | File |
|---|---|
| this one session only | `<course>/workflow/skills/<session>/SKILL.md` |
| how slides get generated, anywhere | this file |
| a hard content or wording rule | `.claude/skills/slide-content-rules/SKILL.md` |
| wording and tone | `slide-kit/workflow/TEXT_GUIDELINES.md` |
| teaching structure | `slide-kit/workflow/PEDAGOGY_GUIDELINES.md` |
| colour, type, slide-type choice | `slide-kit/workflow/STYLE_GUIDE.md` |

Name the file when you ask, not just "the skill" — the user should know what
they are agreeing to change.

**Write the reason, not just the rule.** Every rule in
`slide-content-rules/SKILL.md` says which shipped deck it exists because of.
A rule without its reason gets argued away by the next person.

---

## 9. Chase the dependents

Hard rule 9. Changing content changes more than one file. After edits, check:

- `deck.config.json` — `slideCount`
- `src/export/revealSteps.ts` — regenerated, not edited
- the agenda and section dividers — one divider per concept
- recap and takeaways slides — they restate content that may have moved
- the plan at `<course>/session_plans/<session_name>/plan.md` — update it so
  the plan and the deck do not drift apart
- screenshots in `public/shots/` — a changed command means a changed capture

---

## The short version

Plan at `<course>/session_plans/<session_name>/plan.md`, signed off → read the
hard rules and the guidelines → apply the carry-forward standard (section 2b) → compose kit components, never new markup →
figures that argue, icons from the house set, motion from presets at the
explanatory tier → build → render and run the full check list → anything new and
reusable goes back into the kit, into the gallery, into the registry, and out as
a PR → offer durable feedback to a named skill file → update the dependents and
the plan.
