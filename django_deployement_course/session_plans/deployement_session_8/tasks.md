<!-- cSpell:ignore nxttrendz deployement NxtWave devPort Jenkinsfile ngrok emandate NPCI UPI OTP dockerignore -->
# Session 8 — task-level plan

Execution breakdown for `plan.md` (the slide-wise plan). Derived from
`.claude/skills/generate-slides/SKILL.md`, the repo `CLAUDE.md`, and session 7's
`CLAUDE.md`, which is the closest precedent and the deck this one inherits from.

**Nothing below phase 0 may start.** `plan.md` is `STATUS: DRAFT, NOT SIGNED OFF`
with five open decisions, and the generate-slides skill opens on a hard gate:
no deck generation before the plan is signed off.

| | |
|---|---|
| Project (to create) | `django_deployement_course/deployement_session_8/` |
| Deck file | `src/decks/jenkinsDockerDeck.tsx` |
| `devPort` | 5219 |
| `htmlName` | `deployment-session-8` |
| Slides | 56 proposed, **see T1.4 — the count is wrong in the plan** |
| Scaffold from | `slide-kit/slide-template` |

---

## Phase 0 — The gate. Blocked on you, nothing else can start

| # | Task | Owner |
|---|---|---|
| T0.1 | Answer **D1**, the webhook: A tunnel / **B configure and watch it fail** / C skip | You |
| T0.2 | Answer **D2**, AWS block placement: **closing block only** / concept | You |
| T0.3 | Answer **D3**, AWS captures: **prose plus two captures** / full captures / prose only | You |
| T0.4 | Answer **D4**, socket risk: **one callout on slide 16** / two slides | You |
| T0.5 | Answer **D5**, session 9 re-cut: **decide when session 9 is planned** / now | You |
| T0.6 | Flip `plan.md` to `STATUS: SIGNED OFF <date>`, recording each answer | Me |

**D1 is the only one that changes the slide list.** B keeps slides 32 to 35 as
planned. A replaces 34 and 35 with the ngrok beat and a delivery that succeeds,
and adds a tool to the room. C deletes 32 to 34 and shrinks concept 3 to 7.

**D3 has a privacy consequence, not just a style one.** A real AWS sign-up shows
a real name, address and payment instrument. Captures must stop at screens with
nothing personal on them, whoever's account is used.

---

## Phase 1 — Branch and scaffold

Can start the moment phase 0 closes. Roughly half a day.

| # | Task | Notes |
|---|---|---|
| T1.1 | Follow `.claude/skills/branch-from-main/SKILL.md`: pull main, branch from it | Required **before the first edit**. The current branch `kit/lit-surfaces` carries other people's uncommitted work in sessions 3, 5, 6 and 7 |
| T1.2 | Copy `slide-kit/slide-template` to `deployement_session_8`, minus `node_modules`, `dist`, `dist-single`, `workflow/preview` | Repo `CLAUDE.md`, "Starting a new course", step 2 |
| T1.3 | `deck.config.json`: `name`, `title`, `htmlName: deployment-session-8`, `devPort: 5219` | Confirm 5219 is still free before committing to it |
| T1.4 | **Resolve the slide count.** `plan.md` §5 says 56 but its own last line admits the thank-you frame makes 57 | Every harness reads `slideCount`; a stale count makes the sweep stop early and report success on slides it never looked at |
| T1.5 | Copy `src/decks/baseDeck.tsx` to `src/decks/jenkinsDockerDeck.tsx`, point `activeDeck.ts` at it | |
| T1.6 | Write the session `CLAUDE.md` | The scaffold ships the kit's own, which wrongly tells you to edit the kit here. Session 7's `CLAUDE.md` is the model |
| T1.7 | `public/assets/` as a byte-identical copy of `slide-kit/assets/` | |
| T1.8 | Create `deckShared.tsx`: `SESSION`, `COURSE`, the four concept strings, `ROOT` | Session 7's pattern |

**Exit:** `npx vite --port 5219 --strictPort` serves the base deck, `npx tsc -b --noEmit` clean.

> `npm run dev` does not honour `devPort`; it falls through to Vite's 5173 while
> every harness hardcodes the configured port. Start the server explicitly. This
> is a kit-wide problem session 7 already documented.

---

## Phase 2 — The `SocketBridge` figure. Runs parallel to phase 1, blocks slide 9

The one genuinely new thing this session needs. `plan.md` §6 establishes that
nothing in the registry draws one process talking to another across a boundary it
does not own.

| # | Task | Notes |
|---|---|---|
| T2.1 | Research the representation before drawing it | Content rule 27 |
| T2.2 | Build `slide-kit/socket-lab`, `devPort` 5235, with candidate figures | Content rule 14: a new figure is a lab with candidates, not a first guess |
| T2.3 | Screenshot each candidate and **look at the image** | Content rule 17. The lab for session 7's four figures found five faults every harness passes |
| T2.4 | Pick one, name it, build it in `slide-kit/slide-template` | Not in the session. `sync-kit.mjs --apply` would overwrite a session copy |
| T2.5 | Add it to the gallery `sampleDeck.tsx` and the slide-type registry | Skill §6 |
| T2.6 | **Open a PR** for the kit change | Repo `CLAUDE.md`: anything under `slide-kit/slide-template/` is a PR, never a direct merge, because `sync-kit.mjs --apply` pushes it into every session including signed-off ones |

**Exit:** the figure exists in the kit, you have seen the picture, PR open.

---

## Phase 3 — Captures. Runs parallel to phases 1 and 2, blocks ~12 slides

Hard rule 11 governs all of these: crop to the region of interest, keep the
context that carries meaning, one highlight box at most, and **never retouch the
pixels**. A wrong capture is re-run, not edited.

### 3a. Jenkins and Docker, from a running container

| Capture | Slides |
|---|---|
| Docker plugin install screen | 14 |
| `docker version` in a job console | 15 |
| Console printing a password in the clear (the wrong way) | 18 |
| The credentials store | 20 |
| Add Docker Hub credential | 21 |
| Add `SECRET_KEY` credential | 22 |
| Console showing `****` masking | 23 |
| Job pointed at the repository | 28, 29 |
| Build Now, and the console top to bottom | 38, 39 |

### 3b. GitHub

| Capture | Slides | Note |
|---|---|---|
| Add the webhook, Payload URL filled | 33 | |
| **GitHub's own failed delivery, with its error** | 34 | The teaching moment D1 option B is chosen for. If D1 is A, this becomes a successful delivery instead |

### 3c. AWS, gated by D3

Two captures maximum, at screens with nothing personal on them: the support-plan
chooser (slide 53) and one sign-up screen (slide 52). Everything else is prose.

### Blockers on this phase

- **The Claude browser extension is not connected.** It failed this session with
  "Browser extension is not connected". GitHub and AWS captures need an
  authenticated browser session, so they cannot be taken headlessly.
- **Someone must own the AWS sign-up** whose screens get captured. Per `plan.md`
  §4.4 no student card details are collected by anyone, and that constraint
  applies to the capture too.

---

## Phase 4 — Generate the deck, concept by concept

Only after phases 1 to 3. The rules to load first are skill §1: the hard content
rules, `TEXT_GUIDELINES.md`, `STYLE_GUIDE.md`, `PEDAGOGY_GUIDELINES.md`, and
session 7's build rules R1 to R20, which carry forward.

| # | Block | Slides | Depends on |
|---|---|---|---|
| T4.1 | Front frame | 1 to 5 | — |
| T4.2 | Concept 1, Giving Jenkins the Docker Command | 6 to 16 | **T2** for slide 9, captures for 14, 15 |
| T4.3 | Concept 2, Secrets Jenkins Can Use Safely | 17 to 25 | captures for 18, 20, 21, 22, 23 |
| T4.4 | Concept 3, Pointing Jenkins at Your Code | 26 to 35 | **D1**, captures for 28, 29, 33, 34 |
| T4.5 | Concept 4, The First Build from Jenkins | 36 to 46 | captures for 38, 39 |
| T4.6 | Closing block, including the AWS errand | 47 to 57 | **D2**, **D3** |

Standing constraints while writing: compose kit components, never new markup
(§2); icons from the house set (§4); motion from presets at the explanatory tier,
roughly double the vendored skills' UI numbers (§4b, §5).

---

## Phase 5 — Verify by rendering, never by reading

Hard rule 10, and the step the skill says is most often skipped.

| # | Task |
|---|---|
| T5.1 | **Update `slideCount` first.** A stale count makes every sweep stop early and report success on slides it never looked at |
| T5.2 | `npm run typecheck`, then `npm run build:html` |
| T5.3 | Run `video-safe.mjs`, `qa.mjs`, `align-check.mjs` **in parallel** against one dev server |
| T5.4 | `node preview.mjs && node scripts/build-preview-page.mjs` |
| T5.5 | **Look at every slide carrying a custom figure.** The harnesses measure DOM rectangles, so an `<svg>` is one box and a figure whose labels collide passes all three |

Expected clean state, from session 7's baseline:

- `video-safe` prints **CLEAN**
- `align-check` **0 of \<slideCount\>**
- `qa` flags **exactly two** slides, Welcome and Thank you, both `NO LOGO`, both carrying the mark on stage rather than in the footer. Anything else is a regression

Sequential runs take three times as long for nothing: each harness settles 2600ms
per slide, which on a 57-slide deck is about 2.5 minutes of deliberate waiting.
Do not lower the settle time; a signed-off preview once shipped with every agenda
captured two items in.

Re-run `video-safe` and `qa` **as a pair** after any layout change. They pull in
opposite directions and satisfying one alone breaks the other.

---

## Phase 6 — Ship and chase the dependents

| # | Task |
|---|---|
| T6.1 | `npm run build:html` to `dist-single/deployment-session-8.html`, committed on purpose |
| T6.2 | Update `plan.md`: mark it built, record any deviation from the signed-off slide list |
| T6.3 | Land the `SocketBridge` PR, then `sync-kit.mjs --check` the other sessions |
| T6.4 | **D5**: re-cut session 9. If session 8 entered the Payload URL, TR 9's opening beat is gone and its new one is the Jenkinsfile |
| T6.5 | Note for session 10: it can stop explaining AWS at sign-up depth, because the account will already exist |
| T6.6 | Offer any durable feedback to a named skill file before applying it (skill §8) |

---

## Critical path and risks

Phases 1, 2 and 3 are parallel. The path that decides the date is
**phase 0 → phase 2 → T4.2 → phase 5**, because the figure lab gates slide 9 and
the kit PR gates the sync.

| Risk | Impact | Handling |
|---|---|---|
| **Plan not signed off** | Nothing starts | Five answers in phase 0 |
| **Browser extension down** | Phases 3b and 3c cannot happen | Reconnect before phase 3, or the webhook and AWS slides ship without captures |
| **D1 changes the slide list** | Concept 3 is 10, 10 or 7 slides | Answer before T4.4, not during |
| **Slide count 56 vs 57** | Harnesses silently skip the tail | T1.4, before the first sweep |
| **AWS activation is 24 to 72 hours** | It is the reason this block is in session 8 at all | Nothing to do; it is the point |
| **Free Tier clock starts at sign-up** | Two of the twelve months are spent before session 10 launches an instance | Costs nothing, worth stating on the slide |
| **`SocketBridge` is a kit change** | Reaches every session including signed-off ones | PR, never a direct merge |
