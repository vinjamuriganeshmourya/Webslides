# Slide plan — `deployement_session_1_v3`

**STATUS: SIGNED OFF 2026-08-27.** Approved as proposed: the user answered
"continue" to the four decisions below with the recommended option taken on each.

| Decision | Approved as |
|---|---|
| V1 | Nine concepts of 2 to 4 slides, deck goes from 37 to 44 |
| V2 | Five quiz checkpoints, at the end of C1, C2, C4, C6 and C9 |
| V3 | Four slides re-homed onto figures promoted from the labs today |
| V4 | `ImageFanout` promoted to the kit as a neutral `figures/FanOut`; the two illustration-less dividers stay typographic |

If any one of those four was not what you meant, say which: V1 and V2 are cheap to
reverse before the checkpoints are written, V3 and V4 are cheap at any point.

| Input | Value |
|---|---|
| `PROJECT` | `deployement_session_1_v3`, to be copied from `slide-kit/slide-template` |
| `SESSION_NAME` | `Introduction to Docker` (unchanged) |
| `COURSE` | React + Django Integration, Deployment |
| `SOURCE OF CONTENT` | `deployement_session_1_v2/src/decks/deploymentSession1Deck.tsx`, 37 slides as shipped |
| `htmlName` | `deployment-session-1-v3` |
| `devPort` | 5212 (v2 holds 5211) |

## What this revamp is, and what it is not

**The content is closed.** Every claim, command, screenshot and definition in v3
comes from v2. This is the same kind of delta v2 was to v1: v2 re-authored v1 on a
new rendering layer without reopening the teaching, and v3 re-cuts v2's structure
and re-homes its figures without reopening it either. If a slide's words change it
is because a title got shorter, never because the point changed.

**It is not a theme change.** v2 already carries the current palette
(`brand: #2D63FB`), so there is nothing to migrate. The v2 plan's talk of the
Evolve theme and the nw2027 drop is history.

**What it is:** three defects in v2 as shipped, all structural.

### Defect 1: two sections carry nine and eight slides

The standing preference is one divider per concept and 2 to 4 slides under it.
v2 ships:

| Section | Slides | Verdict |
|---|---|---|
| Opening | 3 | fine |
| Where Your App Lives | 5 | one over |
| Containerization | **9** | more than double |
| Docker | **8** | double |
| Docker Installation | 7 | nearly double |
| Closing | 5 | fine |

Nine slides under one divider is not a concept, it is a chapter, and the room gets
no checkpoint for twenty minutes.

### Defect 2: the Containerization divider is in the middle of its own section

v2's slide order is `c3-conversation`, `c3-what-goes-wrong`, `c3-code-alone`,
`c3-every-machine`, `c3-whole-unit`, **then** `c3-divider`, then three more. Five
slides are filed under a divider they appear before. A divider that arrives after
the concept it opens is worse than no divider: it reads as a mistake in the deck.

### Defect 3: the slide ids no longer mean anything

The deck runs `c1-*`, then `c3-*` with no `c2-*`, then `c4-*`, `c5-*` and `c6-*`
interleaved inside one section called Docker, then `c8-*` with no `c7-*`. The
numbers are v1's concept numbers, carried through two revamps of the structure.
Anybody patching this deck has to read the whole file to find out which concept a
slide is in, and the section string and the id disagree on every slide from 9
onward.

---

## Four decisions needed at sign-off

### V1 — Re-cut into nine concepts, which takes the deck from 37 to 44

**Proposal (recommended).** Every section becomes 2 to 4 content slides behind its
own divider, in the order they are taught. The full slide list is below. The cost
is seven slides: five new dividers and, under V2, four quiz checkpoints. No
content slide is added, cut or split.

**The alternative** is six concepts of 4 to 5 slides, which keeps the deck at 40
and breaks the 2-to-4 preference on two sections. Say which.

### V2 — A quiz checkpoint per concept, or four in the deck

v2 has **one** quiz, at slide 32, twenty-eight slides after the first concept
starts. The session-4 review made the quiz frame a rule for that deck, and the
same argument applies here: a checkpoint is where the room finds out whether the
last three slides landed.

**Proposal (recommended).** Four checkpoints, at the end of concepts 1, 2, 4 and
6, plus v2's existing one at the end of the install concept. Five in a 44-slide
deck. Every question is answerable from the slides immediately before it, and each
one is drawn from the material already on those slides:

| After | Question, from v2's own content |
|---|---|
| C1 | Your teammate opens `localhost:8000` on their laptop. Whose server answers? |
| C2 | Three things are listed; which one travels with `git push`? |
| C4 | The code is identical on both machines and one of them breaks. Which layer? |
| C6 | You start three containers from one image. How many copies of the image? |
| C9 | v2's existing `docker rm` question, unchanged |

### V3 — Which figure answers which question

v2 renders 17 of its 37 slides through `ContentSlide` with bullets plus a
`Callout`, which is the default rather than a choice. Four families were promoted
into the kit today, and three of those slides have an exact home in them. This is
the whole reason to revamp now rather than later.

| v2 slide | v2 figure | v3 figure | Why |
|---|---|---|---|
| `c1-two-problems` | two `Card`s in a row | `points/PeerCards` | Two peers, stated as peers, with the second carrying `tone: 'risk'` and the word "comes later" instead of being dimmed into looking lesser |
| `c3-where-we-are` | `ContentSlide` bullets | `points/RuleStack` | A numbered set of claims, each with the one line that earns it, which is exactly RuleStack's argument |
| `c6-class-object` | two `Card`s | `features/SplitCompare` | Inert against alive is a comparison of two things, not a list of two things |
| `c8-what-installed` | bullets plus two `Callout`s | `points/PeerCards` | v2's own plan recorded this as a set and not a sequence, and worked around a `FlowChart` that could not say so. The set figure now exists |
| `c6-fanout` | deck-local `ImageFanout` | promote to `slide-kit` | One image to many containers is a fan-out. No promoted family draws one, it is used once here and will be used again the moment a session mentions scaling, and a deck-local component is invisible to the next session. **See V4** |

Everything else keeps its v2 figure, and that is deliberate: `LayerStack` on six
slides, `Terminal`, `Shot` on the four install screenshots, `MachineBoundary`,
`ScenarioSlide` and `ContainerJourney` are all the right answer already. A revamp
that re-homed them would be churn.

### V4 — `ImageFanout` promotion, and the one asset gap

`ImageFanout` lives in `deployement_session_1_v2/src/ui/`. Promoting it means a
contract of its own (`one source, N copies, a label per copy`) so it is not
Docker-specific, since the same figure draws one build to many environments.
**Proposal: promote it as `src/ui/figures/FanOut.tsx` with a neutral contract.**

Separately, two dividers in v2 carry no illustration, which v2's plan logged as
outstanding asset work and never closed. **Proposal: leave them typographic in
v3** and log the asset need once, rather than reaching for an illustration from the
Client-Server session, which the style guide forbids and which v2 correctly
refused to do.

---

## The slide list, if V1 and V2 are accepted

44 slides. `[v2 N]` is the v2 slide this is, unchanged in content. **NEW** is a
divider or a checkpoint, never new teaching.

### Opening

| # | id | Slide type | Note |
|---|---|---|---|
| 1 | `brand` | `BrandSlide` | [v2 1] |
| 2 | `welcome` | `WelcomeSlide` | [v2 2] |
| 3 | `agenda` | `AgendaSlide` | [v2 3], re-worded to the nine concepts |

### C1 — Where Your App Lives

| # | id | Slide type | Note |
|---|---|---|---|
| 4 | `c1-divider` | `SectionBreakerSlide` | [v2 4] |
| 5 | `c1-two-terminals` | `ContentSlide` + `Terminal` x2 | [v2 5] |
| 6 | `c1-it-works` | `ContentSlide` + `Shot` x2 | [v2 6] |
| 7 | `c1-localhost` | `ContentSlide` + `MachineBoundary` | [v2 8] |
| 8 | `c1-two-questions` | `ContentSlide` + `points/PeerCards` | [v2 7], V3 |
| 9 | `c1-quiz` | `QuizTimeSlide` | **NEW**, V2 |

### C2 — It Works On My Machine

| # | id | Slide type | Note |
|---|---|---|---|
| 10 | `c2-divider` | `SectionBreakerSlide` | **NEW** |
| 11 | `c2-conversation` | `ScenarioSlide` | [v2 9] |
| 12 | `c2-what-goes-wrong` | `ContentSlide` | [v2 10] |
| 13 | `c2-code-alone` | `ContentSlide` + `LayerStack` | [v2 11] |
| 14 | `c2-quiz` | `QuizTimeSlide` | **NEW**, V2 |

### C3 — Ship the Whole Unit

| # | id | Slide type | Note |
|---|---|---|---|
| 15 | `c3-divider` | `SectionBreakerSlide` | **NEW** |
| 16 | `c3-every-machine` | `ContentSlide` | [v2 12] |
| 17 | `c3-whole-unit` | `ContentSlide` + `ContainerJourney` | [v2 13] |
| 18 | `c3-containerization` | `ContentSlide` + `ContainerJourney` | [v2 15], and this is where v2's mid-section divider was |

### C4 — Different Ground

| # | id | Slide type | Note |
|---|---|---|---|
| 19 | `c4-divider` | `SectionBreakerSlide` | [v2 14], moved to open its own concept |
| 20 | `c4-layers` | `ContentSlide` + `LayerStack` x2 | [v2 16] |
| 21 | `c4-where-we-are` | `ContentSlide` + `points/RuleStack` | [v2 17], V3 |
| 22 | `c4-quiz` | `QuizTimeSlide` | **NEW**, V2 |

### C5 — Meet Docker

| # | id | Slide type | Note |
|---|---|---|---|
| 23 | `c5-divider` | `SectionBreakerSlide` | [v2 18] |
| 24 | `c5-idea-and-tool` | `ContentSlide` | [v2 19] |
| 25 | `c5-docker-words` | `ContentSlide` + `ContainerJourney` | [v2 20] |
| 26 | `c5-definition` | `ContentNoteSlide` | [v2 21] |

### C6 — Images and Containers

| # | id | Slide type | Note |
|---|---|---|---|
| 27 | `c6-divider` | `SectionBreakerSlide` | **NEW** |
| 28 | `c6-image-container` | `ContentSlide` + `features/SplitCompare` | [v2 24], V3 |
| 29 | `c6-fanout` | `OnlyImageSlide` + `figures/FanOut` | [v2 25], V4 |
| 30 | `c6-quiz` | `QuizTimeSlide` | **NEW**, V2 |

### C7 — What Lands On Linux

| # | id | Slide type | Note |
|---|---|---|---|
| 31 | `c7-divider` | `SectionBreakerSlide` | **NEW** |
| 32 | `c7-os` | `ContentSlide` + `LayerStack` | [v2 22] |
| 33 | `c7-three-hosts` | `OnlyImageSlide` + `LayerStack` x3 | [v2 23] |

### C8 — Installing Docker

| # | id | Slide type | Note |
|---|---|---|---|
| 34 | `c8-divider` | `SectionBreakerSlide` | [v2 26] |
| 35 | `c8-install-link` | `ContentSlide` | [v2 27] |
| 36 | `c8-installer` | `ContentSlide` + `Shot` | [v2 28] |
| 37 | `c8-engine-running` | `ContentSlide` + `Shot` | [v2 29] |

### C9 — Proving It Works

| # | id | Slide type | Note |
|---|---|---|---|
| 38 | `c9-divider` | `SectionBreakerSlide` | **NEW** |
| 39 | `c9-start-and-verify` | `ContentSlide` + `Terminal` | [v2 30] |
| 40 | `c9-what-installed` | `ContentSlide` + `points/PeerCards` | [v2 31], V3 |
| 41 | `c9-quiz` | `QuizTimeSlide` | [v2 32], unchanged |

### Closing

| # | id | Slide type | Note |
|---|---|---|---|
| 42 | `takeaways` | `KeyTakeawaysSlide` | [v2 33], re-cut to the nine concepts |
| 43 | `practice` | `PracticeSlide` | [v2 34] |
| 44 | `next-session` | `ContentNoteSlide` | [v2 36] |
| 45 | `feedback` | `FeedbackSlide` | [v2 35] |
| 46 | `thank-you` | `ThankYouSlide` | [v2 37] |

**46 slides, not 44.** The count in the first draft of this plan folded the three
closing slides into one row and then trusted its own total. The arithmetic is
37 + 5 dividers + 4 checkpoints = 46, and `deck.config.json` carries 46.

Concept slide counts, excluding dividers and checkpoints: 4 / 3 / 3 / 2 / 3 / 2 /
2 / 3 / 2. Every one inside 2 to 4, with no exception needed.

---

## Deviations from this plan, made during generation

Recorded rather than re-gated, as v2's plan did.

**V3 was attempted, rejected on measurement, and then made to work by changing the
figures.** That is the whole story of this build and it is worth reading in order.

### First pass: all five re-homes failed

Every figure promoted from the labs assumed it owned the stage, because each was
sized against a four-item lab fixture on a 1100px frame:

| Slide | What happened when the promoted figure was dropped in |
|---|---|
| `c1-two-questions`, 2 points | `PeerCards` laid its cards from x=0, so two filled the left half and stranded 540px. `align-check.mjs` calls that DRIFT |
| `c4-where-we-are`, 2 points | `RuleStack`'s stage was a fixed 386px, so two rows left about 200px of empty stage under them |
| `c9-what-installed`, 3 points | Three cards stranded 260px, and the slide's two callouts had nowhere to go |
| `c6-fanout`, paired with 4 points | `FanOut` is 900px wide, so it squeezed the points column to about 150px: every point wrapped to four or five lines, the first printed over the title, and the last ran off the bottom of the frame under the control bar |

None of that was visible in the source. All of it was visible in a screenshot.

### Second pass: four kit changes, and then the re-homes work

| # | Change | Where | Why |
|---|---|---|---|
| K1 | `PeerCards` centres its row and takes a `width` | `src/ui/points/PeerCards.tsx` | `align-check` allows exactly two verdicts, ALIGNED on the header datum or CENTRED on the content area, so a centred row of any length is legal while a left-pinned short row is a reported defect |
| K2 | `RuleStack`'s height is derived from its row count, and takes a `width` | `src/ui/points/RuleStack.tsx` | Two rows come to 208px, three to 298, four to 388, instead of 386 whatever the content. The padding INSIDE a row is untouched at 15.1px real: that was measured against the longest claim and has nothing to do with row count |
| K3 | `FanOut` gains a named `half` size, 460px against `full`'s 900 | `src/ui/figures/FanOut.tsx` | Two named sizes rather than an arbitrary width, so the arithmetic in the file stays two columns of numbers that were each checked against a render |
| K4 | `StatedPoint` gains `tag`, the tone's word in the author's language | `src/ui/points/pointsFigure.ts`, `pointsChrome.tsx` | The ramp's defaults were written against the lab fixture: `risk` says "the usual trap". This deck uses `risk` for a problem that is LATER rather than dangerous, and the figure called it a trap on the slide. A tone is a claim, and the words of the claim belong to the author |

### Third pass: the containers size themselves to their content

The first two passes made the figures FIT. They still looked wrong, and the user
said so: cards centred with dead space either side, and a 132px marker column with
a 28px badge in it. Two more kit changes, and these are the ones that changed how
the deck looks:

| # | Change | Effect on this deck |
|---|---|---|
| K5 | `PeerCards` divides the slot by the card count, clamped 240 to 420, and derives the card height from the estimated line counts of the longest label and body at the real content width | Slide 8's two cards went from 260x254 to 415x150, slide 40's three from 260x254 to 353x180. No stranded width, no empty card under the text |
| K6 | `RuleStack` derives its row height the same way and collapses the marker column from 132px to 46px on an untermed set | Slide 21's rows are 80px around 52px of content, and the number sits next to the claim instead of 104px away from it |

Estimated rather than measured, deliberately: the height must be known before
layout, and a measure-then-render pass risks the browser and the exported single
file disagreeing. The estimate takes the WORST item, so a card can be too tall by a
rounding and never too short, which is what keeps the declared padding a floor.

### Fourth pass: the cards were flat, and a number claimed an order

| # | Change | Where |
|---|---|---|
| K7 | The card has DEPTH. A diagonal wash falling from 10% at the top left to nothing by 45%, a tone-tinted shadow instead of the house grey one, a soft radial highlight in the top right corner, a hairline inner ring, a top rule that fades to a third by the right edge, and an icon tile with its own gradient and ring | `PeerCards`, and the same treatment at half strength on a `RuleStack` row, which is a wider and quieter surface |
| K8 | `RuleStack` takes `ordered`. An unordered set draws no numbers and puts the ROLE in the marker through each point's `term` | This is the fix for the failure `RuleStack`'s own doc comment named on the day it was built: it states an order whether or not there is one. Slide 21's two rows are a problem and a fix, and "1" and "2" told the room to read them as step one and step two |
| K9 | The role is stated once per row. When a `RuleStack` marker carries a `term`, the tone ramp's default word is suppressed unless the author passes a `tag` | Slide 21's "Problem" row came out with "THE USUAL TRAP" 900px to its right |

Everything in K7 is paint: no animation, no blur, nothing that costs layout, so the
harnesses measure exactly what they measured before.

Slide 21 also got its open question back as a `tip` callout. Folding it into the
figure's caption had made it small grey centred text, and the room read it as a note
about the figure rather than as the question the next section answers.

One redundancy fell out of it: slide 8 was printing "Today" twice, once as the
term chip and once as the tone's word. The term came off; the tag reads as a status
beside the icon.

One bug fell out of using them: **`RuleStack` drew its ordinal twice** when a set
had no `term`, so two untermed claims read "1 (1)" and "2 (2)". The small mono
number was written for the termed case and was never conditional. Fixed in the kit.

### What actually shipped

| # | Slide | Built |
|---|---|---|
| D1 | 8 `c1-two-questions` | `points/PeerCards`, two centred peers, `tag` "today" and "comes later" |
| D2 | 21 `c4-where-we-are` | `points/RuleStack`, two claims at a derived 208px, the open question as the caption |
| D3 | 40 `c9-what-installed` | `points/PeerCards`, three centred peers, `tag` "this is Docker" and "the borrowed part" |
| D4 | 29 `c6-fanout` | `figures/FanOut` at `size="half"`, beside its four points |
| D5 | 28 `c6-image-container` | **v2's `CodeBlock` and two `Card`s kept.** `SplitCompare`'s contract is a `without` against a `with`, and this slide is a MAPPING (class to image, object to container). At 1100x400 it also leaves no room for the Python snippet the slide is built around |
| D6 | 40 and 41 | **The slide split in two.** Three `PeerCards` are 254px tall and v2's two callouts came to about 200px more: the second ran off the bottom of the frame. It is now "What You Installed" and "Read Your Own Output", which also takes that frame from three ideas to one each. **Deck total is 47, not 46** |
| D7 | Agenda | Four items kept, each `sub` naming the concepts inside it. Nine items is a list nobody holds |
| D8 | `Code` helper | Background is `${colors.brand}1a`. v2 carried `rgba(11,95,255,0.10)`, the OLD brand blue, so after the palette moved it was a colour from no theme at all, in a deck file where hard rule 5 forbids a hex |
| D9 | Slides 35, 36 | **Three OS marks were missing.** `windows.png`, `macos.png` and `linux.png` are in v2's `public/` and in `slide-kit/assets/tech/`, but not in the kit template's `public/`, and scaffolding copied only `public/shots/`. Copied from the central library per hard rule 13, not from v2 |
| D10 | Sections | **Concept 7, "What Lands On Linux", was removed after sign-off, on the user's instruction to follow v2.** v2 has no such section: its two OS slides sit inside Docker with no divider. `c7-os` and `c7-three-hosts` were re-homed to the Docker concept in v2's position, right after the definition, and renamed `c5-os` and `c5-three-hosts`. Dividers 8 and 9 renumbered to 7 and 8. The agenda's Docker `sub` now ends "the kernel it borrows" |
| D11 | Quizzes | **Decision V2 was reversed after sign-off, on the user's instruction to match v2.** The four concept checkpoints (`c1-quiz`, `c2-quiz`, `c4-quiz`, `c6-quiz`) were removed. The deck keeps v2's single quiz, `c9-quiz`, immediately before Key Takeaways, which is the slot hard rule 18 requires. The four questions the plan wrote for C1, C2, C4 and C6 are unused |
| D12 | Slides 28, 29 | **Two slides added after sign-off, at the user's request:** `c6-image-to-container` draws the image to container relationship and `c6-three-words` defines containerization, image and container together. 28 reuses `FanOut` with ONE copy so that slide 30 is the same figure with one variable changed. A `SpineFlow` pipeline was built first and rejected on measurement: its stage is a fixed 1100 with a 230 pitch on 180 slots, so the 50px gap clipped the edge label "containerization" under the nodes, and three nodes on a five-node spine left 460px of dead stage |
| D13 | Slide 28 | **`c6-what-is-an-image` added**, defining the image on its own slide before the transition slide, at the user's request. It reuses the sealed-unit figure from `c3-containerization` under the name IMAGE, so the word attaches to a drawing the room has already met |
| D14 | Slide 29 | Its three points were rewritten out of Docker's vocabulary and into plain language, at the user's request. Point 1 was "The image never runs", which is now D13's second point, so this slide starts at the moment something is started |
| D15 | Takeaways | **Hard rule 20 was being broken.** The fourth item said "Docker Installation" where the agenda says "Installing Docker", and all four agenda `sub` lines were missing, so a deck that opens on eleven concepts closed on four bare titles. Every `sub` is now the agenda's line character for character. No component change: `KeyTakeawaysSlide` passes `points` to `BulletList`, which has always taken `{ text, sub }` |

## Verification, before this is called done

```bash
npm run typecheck && npm run build:html
export CHROME_PATH=/opt/google/chrome/chrome
node video-safe.mjs     # must print CLEAN
node qa.mjs             # only slide 1 flagged, the BrandSlide hides the logo
node align-check.mjs    # 0 slides need attention
node preview.mjs && node scripts/build-preview-page.mjs
```

Plus, and this is not optional after today: **read the screenshots**. Two of the
faults found in the labs today, a control printing through a column header and a
19px numeral inside an 11.5px bar, passed every harness in this repo and were only
visible in a rendered image.

## Open question, not blocking

Speaker notes still do not render. v1 and v2 both logged it, and every slide in
both carries `notes` that no presenter can see. The deck now has an overlay
pattern that works, the slide picker, so a notes panel on `N` is a small kit
change. Out of scope for this plan; say the word and it becomes its own task.
