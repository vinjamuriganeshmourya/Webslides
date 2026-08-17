# Slide plan — `deployement_session_1_v2`

**STATUS: SIGNED OFF 2026-08-11 · REVISED rev2 2026-08-11 (content review)**

### rev2 — changes from the content review

Requested directly on the built deck. All are now hard rules in
[`.claude/skills/slide-content-rules/SKILL.md`](../../.claude/skills/slide-content-rules/SKILL.md),
which `STYLE_GUIDE.md` now defers to.

| # | Change | Where |
|---|---|---|
| 1 | **Two terminals, not one.** New `src/ui/Terminal.tsx` renders the VS Code terminal panel (tab strip `PROBLEMS · OUTPUT · TERMINAL`) with a `PS <path>>` prompt on every command. Slide 5 is now two side-by-side panels at `C:\ecommerce\backend` and `C:\ecommerce\frontend`. `CodeBlock` is kept for *files* only. | S5, S41 |
| 2 | **No spaced em dash** in any rendered string, deck-wide and in every component. Overrides `STYLE_GUIDE.md` §5. | all |
| 3 | **"stranger" removed.** "Can a stranger's browser reach it?" is now "Can others open it?" | S7 |
| 4 | **No tools named for Problem 2.** The Tools cell reads "Comes later in this course". | S7, S11 |
| 5 | **Problem 2 no longer faded on the two-problems slide.** Equal weight; it is later, not lesser. Only `JourneyRoadmap` still marks it unopened. | S7, S10 |
| 6 | **New slide: "Problem 1 First".** States the order, then "so let us solve Problem 1 first". | S8 (new) |
| 7 | **Problem 2 never decomposed.** The "Automate" stage and all Problem 2 stage names are gone until the hosting sessions. The journey table is Problem 1's three stages; `JourneyRoadmap` is 3 stages plus one closed "Reachable" block. Agenda sub, divider subtitle and takeaways reworded off "five stages". | S11, S12, S3, S9, S44 |
| 8 | **Six Breakages → two.** Only *Path separators* and *Commands and shells* remain, retitled "Below Your Code". | S17 |
| 9 | **One attempt per slide.** The 2 attempt slides became 5, each with kicker `Attempt N of 5`, the claim as the lead, 2 bullets, and one "Why it fails" callout. Concept 4 now runs 7 content slides, a deliberate exception to 2–4. | S21–S25 |

**Knock-on fixes** (rule 7 of the skill): the case-sensitivity quiz tested a card
that rule 8 removed, so **S19 is now a path-separator quiz** (`media\uploads\a.png`
works on Windows, fails on Linux). The `Three Machines` figure cited Pillow wheels
and case sensitivity, both removed, so it now fails on version drift and paths.

**Deck total: 48 slides** (rev1: 44).

### rev3 — presentation review

| # | Change | Where |
|---|---|---|
| 10 | **Deck chrome is grey, not white.** The slide counter, nav arrows and dot rail were `text-white/*`, invisible on the light content stages, which are most of the deck. Now grey (`muted`) on a `bg-white/85` chip with a faint ring, so the same grey reads on both the light and the night/brand families. Verified by cropping the chrome strip over one of each, not assumed. | `DeckControls`, `ProgressBar` |
| 11 | **Session name removed from the footer.** It sat bottom-right directly under the control cluster and overlapped the slide counter, and it duplicated each slide's kicker. The footer is now the NxtWave mark only. `SlideBase` still accepts `lesson` for API compatibility but no longer renders it. Supersedes `SLIDE_WORKFLOW.md` Stage 6. | `SlideBase` |
| 12 | **Text and supporting visual now reveal in parallel.** `BulletList` wrapped each item in a click-gated `Step` and `ContentSlide` wrapped `children` in a further `Step`, so the visual could not appear until every bullet had been clicked: the pair read as two sequential halves. Added `BulletList immediate` (entry stagger via `Reveal`), switched `ContentSlide`'s children to `RevealGroup`/`Reveal`, made `MachineBoundary` and `Terminal` entry-revealed, set `stepped={false}` on the paired `LayerStack`s, and `asStep={false}` on the four supporting `Callout`s. `Step` is kept only where the pause is the teaching: the five "Why it fails" callouts and the quiz answer. | `content.tsx`, `ContentSlide`, `MachineBoundary`, `Terminal`, deck |

Verified at **step 0 without `?all`**: on every paired slide both columns are
fully present before any click, and the counter shows no leftover steps. `qa.mjs`
now asserts the footer *mark* rather than the removed footer text; slide 1 is the
one expected "NO LOGO", since `BrandSlide` hides it deliberately.

### Decisions recorded at sign-off

| # | Question | Decision |
|---|----------|----------|
| — | What v2 is | **Clean scaffold from `template-code.zip`, deck re-authored on the template's own Evolve layouts.** nw2027 dropped entirely — v2 is single-theme |
| V1 | 10 MG slides have no stage in Evolve | **Reveal-built diagrams.** Map each MG to the nearest template component; build 3 new SVG components that build under `Stepper`. Timed motion is given up deliberately |
| V2 | Evolve has no table component, 8 slides are tabular | **Build `src/ui/DataTable.tsx`** on `tokens.ts`. Column alignment is the teaching on these slides |
| V3 | v1 prose is 3–5× over the corpus style budget | **Compress to budget.** Titles to 2–3 words, body to fragments + `Callout`s; cut reasoning moves into `notes`, not away |
| V4 | Per-slide progress chrome | **Dropped.** Deck-level `ProgressBar` + `SlideDef.section` carry it |

This is a **delta plan**. The *content* of this session was signed off on
2026-08-11 in [`deployement_session_1_v1.md`](./deployement_session_1_v1.md) and is
**not reopened here**. What changes in v2 is the **rendering layer**: the deck is
re-authored on the layouts that ship in `template-code.zip` (the Evolve theme —
`src/slides/*`, `src/ui/*`, `src/design/tokens.ts`), and the custom "New Theme
2027" layer is dropped entirely.

| Input | Value |
|---|---|
| `PROJECT` | `deployement_session_1_v2` — fresh copy of `template-code.zip` at `Web Slides/deployement_session_1_v2/` |
| `SESSION_NAME` | `From Localhost to Anywhere` — footer text on **every** slide |
| `COURSE` | `React + Django Integration — Deployment` |
| `TR_DOC` | `Integration project/deployment/session-1.md` |
| `THEME` | **Evolve** — `template-code.zip` › `src/design/tokens.ts` + `src/slides/` + `src/ui/`. 1280×720 canvas. |
| `NEXT_UP` | "Writing your first Dockerfile — packaging *your* Django project" |
| `SOURCE OF CONTENT` | `deployement_session_1_v1/src/decks/deploymentSession1Deck.tsx` (48 slides) |

**Dropped from v2** (confirmed at request time): `src/design/nw2027.ts`,
`src/design/mg.ts`, `src/slides/nw2027/`, `src/ui/nw2027/`, `src/motion/mg/`,
`src/decks/nw2027Deck.tsx`. v2 is single-theme.

---

## What carries over unchanged

**R1 — Spoiler discipline.** *Docker*, Docker blue, the whale, and the words
*image* / *container* do not appear before Concept 5. The two masked `?` table
cells (S: `c1-two-problems`, `c2-journey`) stay masked and are paid off on the
Concept-5 divider.

**R2 — Scope discipline.** Problem 1 (*runs anywhere*) only. No server, globe,
public URL, or inbound traffic on any slide — except the roadmap visual, which
shows Problem 2 deliberately dimmed and unbuilt.

**R3 — Windows-first.** Every command is PowerShell; macOS/Linux forms appear
alongside, never instead.

**Structure.** 8 concepts, one divider each, 2–4 content slides each (quiz
checkpoints excluded from that count) — per the standing preference recorded at
the Session 1 Rev 7 sign-off. Concept 3 keeps its sanctioned 5-slide exception.

**R4 is retired.** The dark motion-graphic palette existed to serve
`src/motion/mg/`, which v2 drops. See decision **V1**.

---

## ⚠️ Four decisions needed at sign-off

### V1 — The 10 motion-graphic slides have no home in the Evolve theme

v1 built ten timed animations (`mg-1` … `mg-7`, 8–36s each) on a bespoke
`MgStage` with a dark inset panel. The Evolve theme has no MG stage, and
`src/motion/mg/` is being dropped. Its visual vocabulary instead is
**reveal-staggered diagrams**: `FlowChart`, `StepList`, `AnalogyMap`,
`CardGrid`, `Illustration`, plus `RevealGroup`/`Stepper` for build-on-click.

**Proposal (recommended) — reveal-built diagrams, 3 new components.**
Map each MG to the nearest template component, and build only the three that
have no analogue at all. Each new component is a static SVG that *builds* under
`Stepper`, so the teaching beats survive; what is lost is continuous timed
motion.

| MG | v1 subject | v2 treatment |
|---|---|---|
| `mg-1` | localhost vs. the Internet | **new** `MachineBoundary` — one box labelled *your machine*, browser + two servers inside, a stranger's browser outside with a severed request |
| `mg-2` | the deployment roadmap, "you are here" | **new** `JourneyRoadmap` — 5 stages, movable pin, Problem 2 dimmed. Parameterised by pin index, so sessions 2–5 reuse it |
| `mg-3` | same code, different ground | **new** `LayerStack` — 4 layers, only the top one crosses the gap |
| `mg-3b` | three machines, one codebase | `LayerStack` ×3 in a row, each failing at a different layer |
| `mg-3c` | five attempts, five failures | `DataTable` (see V2) with a coverage column — the elimination reads better as a table than as bars |
| `mg-4` | loose cargo → standard container | `Illustration` slot + `AnalogyMap` — folded into `c5-mapping`, which is already that mapping |
| `mg-5` | one image, many containers | `FlowChart` — grey slab → 3 container nodes |
| `mg-6` | duplicated OS vs shared kernel | `LayerStack` side-by-side variant |
| `mg-6b` | the WSL 2 kernel slab | `Callout` on the `mg-6` slide — it is one paragraph of clarification, not a graphic |
| `mg-7` | what Docker Desktop installed | `FlowChart` — the same three pieces as the `c8-what-installing` table, so that table is dropped as duplicative |

Net: **3 new components**, and the deck loses 2 slides (`mg-4`, `mg-6b` fold in;
`c8-what-installing` folds into `mg-7`) → see the count below.

*Alternative A:* port `src/motion/mg/` into v2 as an exception, keeping all ten
animations and re-skinning the stage to Evolve tokens. Highest fidelity to v1,
but re-admits the layer you asked to drop.
*Alternative B:* cut the MG slides. Cheapest; guts the session's best teaching.

### V2 — The Evolve theme has no table component, and 8 slides are tables

v1 leaned on `TableSlide2027`. Evolve has `BulletList`, `Card`/`CardGrid`,
`StatTile`, `StepList`, `FlowChart`, `AnalogyMap` — no table. Eight slides here
are genuinely tabular (2–4 columns of parallel comparison), and forcing them
into cards loses the column alignment that *is* the teaching.

**Proposal (recommended):** build `src/ui/DataTable.tsx` — header row, zebra
body, per-column weights, `Reveal`-staggered rows, `tone` accent, built on
`tokens.ts` and the existing `rounded-card` / `border-line` / `shadow-card-soft`
vocabulary so it reads as native Evolve. Exported from `src/ui/index.ts`.
One slide type (`c5-mapping`) moves to `AnalogyMap` instead — it is a pure
two-column mapping and that component already exists for exactly this.

*Alternative:* re-cut all 8 as `CardGrid`. No new component; comparison rows
stop lining up.

### V3 — v1's text is 3–5× over the corpus style budget

`STYLE_GUIDE.md` measures the house voice at **~40 body words per slide**
(p90 = 117), titles at **2–3 words** (p90 = 5), bullets at **3–6 word
fragments**. v1's card slides run 90–190 words each and its titles run 4–6
words. v1 was signed off on *content*, and the theme swap is the natural moment
to bring the prose to budget.

**Proposal (recommended) — compress to budget, teaching intact.**
Body prose moves to fragments and `Callout`s; the "why it fails" reasoning that
must stay in full sentences stays, but one sentence instead of three. Titles cut
to 2–3 words (`Two Terminals`, `Image and Container`, `Comparison`). No teaching
beat is removed — the reasoning that gets cut from the slide moves into
`notes`, which is where a presenter script belongs. Estimated: every slide lands
under the p90 of 117 words, most near the median.

*Alternative:* carry v1's text verbatim. Zero content risk; the deck stays
visibly off-voice against the other 23 decks in the corpus.

### V4 — Per-slide progress chrome (minor, stated for the record)

v1's slides each took `progress={{total, current}}` and `index={n}`. Evolve
slides take neither: `Deck` renders a deck-level `ProgressBar` plus a step
counter, and `SlideDef.section` groups slides. **Proposal:** drop the per-slide
props, keep `section` set to the concept name on every slide. No visual loss —
the same information, rendered by the deck chrome instead of by each slide.

---

## Slide-by-slide mapping

Component names are Evolve components from `src/slides/index.ts` unless marked
**new**. `lesson={SESSION}` on every slide (R3 / Stage 6 check). Titles shown
are the **v2 compressed** titles per V3.

### Opening

| # | id | v2 component | Title / content | Notes |
|---|---|---|---|---|
| 1 | `brand` | `BrandSlide` | greeting `Welcome`, `lesson` only | `footerLogo={false}` — hero carries the mark |
| 2 | `welcome` | `WelcomeSlide` `minimal` | `From Localhost to Anywhere` | kicker + session name, nothing else |
| 3 | `agenda` | `AgendaSlide` | 8 items, `sub` one fragment each | items 1–4 name no tool (R1) |

### Concept 1 — Where Your App Lives Today

| # | id | v2 component | Title / content |
|---|---|---|---|
| 4 | `c1-divider` | `SectionBreakerImageSlide` | `index={1}`, illustration `two-apps` |
| 5 | `c1-two-terminals` | `ContentSlide` + `CodeBlock` | `Two Terminals` · PowerShell block · `Callout kind="info"` for the macOS/Linux fork |
| 6 | `c1-localhost` | `ContentRightImageSlide` + **new** `MachineBoundary` | `"localhost"` · 3 fragments + the deployment definition as a `Callout` |
| 7 | `c1-two-problems` | **new** `DataTable` | `Two Problems` · 3 cols × 4 rows · masked `?` in Tools (R1), Problem-2 col dimmed |

### Concept 2 — The Shape of the Journey

| # | id | v2 component | Title / content |
|---|---|---|---|
| 8 | `c2-divider` | `SectionBreakerSlide` | `index={2}` |
| 9 | `c2-truths` | `ContentSlide` + `CardGrid cols={3}` | `Three Truths` · card 3 dimmed as Problem 2 |
| 10 | `c2-journey` | **new** `DataTable` | `The Journey` · 4 cols × 5 rows · Tool col masked, Problem-2 rows dimmed |
| 11 | `c2-roadmap` | `OnlyImageSlide` + **new** `JourneyRoadmap` | `You Are Here` · pin at stage 1 |

### Concept 3 — Why "It Works on My Machine" *(5 content slides — sanctioned exception)*

| # | id | v2 component | Title / content |
|---|---|---|---|
| 12 | `c3-divider` | `SectionBreakerSlide` | `index={3}` |
| 13 | `c3-conversation` | `ScenarioSlide` | `It Works on My Machine` · the two-message exchange as `beats`, closing question as `situation` |
| 14 | `c3-git-table` | **new** `DataTable` | `Code, Not Environment` · 3 cols × 7 rows · last row bolded |
| 15 | `c3-mg3` | `ContentRightImageSlide` + **new** `LayerStack` | `Different Ground` · 3 fragments, ends on the open question |
| 16 | `c3-six-things` | `ContentSlide` + `CardGrid cols={3}` | `Six Breakages` · each card = one fragment + the error string in mono |
| 17 | `c3-mg3b` | `OnlyImageSlide` + `LayerStack` ×3 | `Three Machines` |
| 18 | `c3-quiz` | `QuizSlide` | `Quiz Time!` · case-sensitivity question · `because` → `hint` |

### Concept 4 — What Would Actually Fix It

| # | id | v2 component | Title / content |
|---|---|---|---|
| 19 | `c4-divider` | `SectionBreakerSlide` | `index={4}` · subtitle is the governing question, read in full |
| 20 | `c4-attempts-12` | `ContentSlide` + `CardGrid cols={2}` | `Attempts 1 and 2` · claim + one "why it fails" sentence each |
| 21 | `c4-attempts-345` | `ContentSlide` + `CardGrid cols={3}` | `Attempts 3, 4, 5` |
| 22 | `c4-mg3c` | **new** `DataTable` | `Five Failures` · attempt × what it covers × what it misses |
| 23 | `c4-requirements` | **new** `DataTable` | `Five Requirements` · # / requirement / proved by |

### Concept 5 — Meet Docker *(R1 ends at slide 24)*

| # | id | v2 component | Title / content |
|---|---|---|---|
| 24 | `c5-divider` | `SectionBreakerImageSlide` | `index={5}` · pay off both masked `?` cells out loud |
| 25 | `c5-meets-five` | **new** `DataTable` | `All Five` · requirement × how Docker meets it |
| 26 | `c5-mapping` | `AnalogyMap` | `Shipping ↔ Docker` · absorbs `mg-4`'s container story as the spoken setup |
| 27 | `c5-definition` | `ContentNoteSlide` | `The Definition` · definition as the note, industry adoption as 2 fragments |

### Concept 6 — Images and Containers

| # | id | v2 component | Title / content |
|---|---|---|---|
| 28 | `c6-divider` | `SectionBreakerSlide` | `index={6}` |
| 29 | `c6-class-object` | `ContentSlide` + `CodeBlock` + `AnalogyMap` | `Class and Object` · Python snippet, then the 2-row mapping |
| 30 | `c6-image-container` | `ContentSlide` + `CardGrid cols={2}` | `Image and Container` · inert vs alive |
| 31 | `c6-mg5` | `FlowChartSlide` | `One Image, Many Containers` · slab → 3 containers · Docker Hub as a `Callout` |

### Concept 7 — Containers vs Virtual Machines

| # | id | v2 component | Title / content |
|---|---|---|---|
| 32 | `c7-divider` | `SectionBreakerSlide` | `index={7}` |
| 33 | `c7-structural` | `ContentRightImageSlide` + `LayerStack` side-by-side | `Duplicate or Share` · absorbs `mg-6b` as a `Callout` on WSL 2 |
| 34 | `c7-comparison` | **new** `DataTable` | `Comparison` · 3 cols × 5 rows · size/startup rows bolded |

### Concept 8 — Getting Docker Running

| # | id | v2 component | Title / content |
|---|---|---|---|
| 35 | `c8-divider` | `SectionBreakerSlide` | `index={8}` |
| 36 | `c8-steps-12` | `ProceduralStepsSlide` + `CodeBlock` | `Enable and Install` · `wsl --install`, then Docker Desktop |
| 37 | `c8-steps-34` | `ContentSlide` + `CodeBlock` | `Start and Verify` · `docker --version`, `docker run hello-world` |
| 38 | `c8-mg7` | `FlowChartSlide` | `What You Installed` · Engine → CLI → WSL 2 kernel · absorbs `c8-what-installing`; the connect error as a `Callout kind="warning"` |
| 39 | `c8-quiz` | `QuizSlide` | `Quiz Time!` · `docker rm` question |

### Closing

| # | id | v2 component | Title / content |
|---|---|---|---|
| 40 | `takeaways` | `KeyTakeawaysSlide` | 8 outcomes as 6–10 word pills — different UI from the agenda |
| 41 | `gap` | `ContentNoteSlide` | `The Gap` · `hello-world` is someone else's image; next is the Dockerfile |
| 42 | `practice` | `PracticeSlide` | `Before Next Session` · 3 tasks incl. the `pip freeze` command |
| 43 | `feedback` | `FeedbackSlide` | fixture |
| 44 | `thank-you` | `ThankYouSlide` | `nextUp` = the Dockerfile teaser |

**Deck total: 44 slides** (v1: 48). The four absent are `mg-4`, `mg-6b`,
`c8-what-installing` and `practice-tasks` — all folded into a neighbour, none
cut for content. Concept slide counts: 3/3/5/4/3/3/2/4 — all within 2–4 except
Concept 3's sanctioned exception.

---

## New components to build (Stage 3)

| Component | File | Reused by |
|---|---|---|
| `DataTable` | `src/ui/DataTable.tsx` | 7 slides here; every future session with a comparison table |
| `LayerStack` | `src/ui/LayerStack.tsx` | slides 15, 17, 33 · sessions 2–3 (layer/build talk) |
| `MachineBoundary` | `src/ui/MachineBoundary.tsx` | slide 6 · the hosting sessions invert it |
| `JourneyRoadmap` | `src/ui/JourneyRoadmap.tsx` | slide 11 · **opens every session in the module** with the pin moved |

All four use `tokens.ts` values only — no new colours — and export from
`src/ui/index.ts`. Existing assets in `public/` are unchanged and unused by this
deck (they belong to the Client–Server session).

---

## Build order

1. `DataTable` — unblocks 7 slides.
2. Opening + all 8 dividers + closing fixtures — the frame, cheapest to verify.
3. Table slides (7) and card slides (5).
4. `LayerStack`, then slides 15 / 17 / 33.
5. `JourneyRoadmap` → slide 11; `MachineBoundary` → slide 6.
6. Code/terminal slides (5, 29, 36, 37) — `CodeBlock` `maxHeight` checked per slide.
7. Quizzes, then `notes` pass on every slide.

## Deviations from this plan, made during generation

Mechanical, none touching content. Recorded rather than re-gated.

| # | Planned | Built | Why |
|---|---|---|---|
| D1 | `ContentRightImageSlide` for slides 6, 15, 33 | `ContentSlide` with `points` + `children` | `ContentImageSlideProps.media` only accepts `{src}` or a registered `IllustrationName`, not an arbitrary component. `ContentSlide` already lays `points` and `children` side by side, which is the same result without registering deck-specific scenes in the shared `Illustration` slot. |
| D2 | `SectionBreakerImageSlide` for dividers 1 and 5 | `SectionBreakerSlide` (typographic) | **Every illustration in the kit belongs to the Client–Server session.** `two-apps` draws `apis.ccbp.in` and a *broken* connector — it contradicts this session, where the app works. `toolchain` is VS Code/Python/Node and clipped the frame by 37px. The style guide forbids placing an available-but-unrelated illustration to fill space, so both dividers stay typographic. **Follow-up below.** |
| D3 | `FlowChartSlide` for slide 31 | local `ImageFanout` component | `FlowChart` renders a linear node→arrow→node chain; one-image-to-many-containers is a fan-out, and a chain would have taught the wrong shape. |
| D4 | `FlowChartSlide` for slide 38 | `ContentSlide` with `points` + two `Callout`s | Same reason — the three installed pieces are a set, not a sequence. |
| D5 | — | slide 21 reworded | "Package a full virtual machine **image**" breached R1 (the word *image* before concept 5). v1 shipped this slip too. Now "a whole simulated computer". |

## Stage 6 verification — RESULTS

- [x] `npm run build` passes; `tsc -b --noEmit` clean.
- [x] **No slide overflows 1280×720** — measured with `qa.mjs` (in the project root), which walks every rendered element on all 44 slides and compares its rect to the frame. Run it with the deck served and `?all` set, which reveals every `Stepper` fragment at once:
      `node qa.mjs "http://localhost:5173/?all" 44`
      Remaining reported items are the `pointer-events-none` decorative blobs the `BrandSlide`/`WelcomeSlide` deliberately bleed off-canvas. `CodeBlock maxHeight` capped per slide (250/230/270).
- [x] Footer reads `From Localhost to Anywhere` on all 44 slides — asserted by `qa.mjs`.
- [x] **R1** — grep over everything before the concept-5 divider. Clean apart from the two intended cases: agenda items 5–8 (carried verbatim from v1, which shipped the concept names in the agenda) and the masked `?` cells. D5 fixed the one real breach.
- [x] **R2** — no server, globe, public URL or inbound traffic outside `JourneyRoadmap`'s dimmed Problem 2 columns. `MachineBoundary` shows a *failed* request and no public address.
- [x] Quiz slides reveal the answer only after all options — inherited from `QuizSlide`'s single-step design, which restyles already-visible options.
- [x] Body word count under the corpus p90 — every slide is fragments plus at most one "why" sentence.
- [x] Step counts correct on every `Stepper` slide; all 44 screenshotted fully revealed.

### Known limitations

1. **Speaker notes are not rendered.** V3 moved cut reasoning into `SlideDef.notes`, but the Evolve `Deck` stores notes without displaying them ("No overview, notes, or click-to-advance" — `Deck.tsx`). The reasoning is preserved in the source and readable there, but a presenter cannot see it in the running deck. v1 had the same gap. Adding a notes overlay is a small `Deck` change if wanted.
2. **Two dividers carry no visual** (D2). Eight topic-specific divider illustrations are the outstanding Stage 3 asset work for this deck.

## Stage 7

Snapshotted source-only to `Web Slides/versions/deployement_session_1_v2.zip`
(109 files, `node_modules` / `dist` / `*.tsbuildinfo` excluded).

> ⚠️ **Credential note.** `template-code.zip` contains `template/.env.local` with a
> live `GEMINI_API_KEY`, so scaffolding any project from it copies the key in.
> The copy in `deployement_session_1_v2/` was deleted and stripped from the
> snapshot zip. The key is still present in `template/.env.local` and inside
> `template-code.zip` itself — **it should be rotated**, and `.env.local` removed
> from the template archive so future scaffolds don't inherit it.
