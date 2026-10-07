<!-- cSpell:ignore nxttrendz deployement NxtWave devPort Jenkinsfile ngrok emandate NPCI UPI OTP dockerignore -->
# Session 8 — task-level plan

Execution breakdown for `plan.md` (the slide-wise plan). Derived from
`.claude/skills/generate-slides/SKILL.md`, the repo `CLAUDE.md`, and session 7's
`CLAUDE.md`, which is the closest precedent and the deck this one inherits from.

**Phase 0 closed 2026-09-10.** `plan.md` is signed off, all five decisions
recorded. **D1 = A, the ngrok tunnel**, changed from the drafted B because
ngrok Free now keeps a stable dev domain, which was the only thing B was
recommended over.

| | |
|---|---|
| Project (to create) | `django_deployement_course/deployement_session_8/` |
| Deck file | `src/decks/jenkinsDockerDeck.tsx` |
| `devPort` | 5219 |
| `htmlName` | `deployment-session-8` |
| Slides | **58** (option A adds one to concept 3; the thank-you frame is now its own row) |
| Scaffold from | `slide-kit/slide-template` |

---

## Phase 0 — The gate. Blocked on you, nothing else can start

| # | Task | State |
|---|---|---|
| T0.1 | **D1**, the webhook | ✅ **A**, the ngrok tunnel |
| T0.2 | **D2**, AWS block placement | ✅ closing block only |
| T0.3 | **D3**, AWS captures | ✅ prose plus two captures |
| T0.4 | **D4**, socket risk | ✅ one callout, slide 16 |
| T0.5 | **D5**, session 9 re-cut | ✅ deferred |
| T0.6 | `plan.md` flipped to `SIGNED OFF 2026-09-10`, decisions recorded, §3 and §5 corrected for A | ✅ done |

**D1 is the only one that changes the slide list.** B keeps slides 32 to 35 as
planned. A replaces 34 and 35 with the ngrok beat and a delivery that succeeds,
and adds a tool to the room. C deletes 32 to 34 and shrinks concept 3 to 7.

**D3 has a privacy consequence, not just a style one.** A real AWS sign-up shows
a real name, address and payment instrument. Captures must stop at screens with
nothing personal on them, whoever's account is used.

---

## Phase 1 — ✅ DONE. Branch and scaffold

Can start the moment phase 0 closes. Roughly half a day.

| # | Task | Notes |
|---|---|---|
| T1.1 | ✅ **Done.** Worktree at `/home/nxtwave/web-slides-session8`, branch `deck/setting-up-jenkins-for-docker-builds`, cut from `origin/main` | A plain `git switch main` was unsafe: 32 tracked files are both locally modified and differ from main, across sessions 5, 6, 7 and the shared rules file. The worktree leaves all of it untouched |
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

## Phase 2 — ✅ DONE. The figures, chosen in `slide-kit/socket-lab`

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
| Add the webhook, Payload URL filled with the ngrok dev domain | 35 | The URL in the capture must be the real dev domain used |
| **A successful delivery, GitHub's own green tick and response** | 36 | D1 = A, so this is a delivery that worked, not a failure |

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
| T4.1 | Front frame | 1 to 5 | ✅ done |
| T4.2 | Concept 1 | 6 to 16 | ✅ done |
| T4.3 | Concept 2 | 17 to 25 | ✅ done |
| T4.4 | Concept 3 | 26 to 36 | ✅ done, captures pending |
| T4.5 | Concept 4 | 37 to 47 | ✅ done, slide 42 awaits SwapRows |
| T4.6 | Closing block | 48 to 58 | ✅ done, prose by D3 |

Standing constraints while writing: compose kit components, never new markup
(§2); icons from the house set (§4); motion from presets at the explanatory tier,
roughly double the vendored skills' UI numbers (§4b, §5).

---

## Phase 5 — ✅ DONE except the contact sheet. Verify by rendering

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
**phase 2 → T4.2 → phase 5**, because the figure lab gates slide 9 and
the kit PR gates the sync.

| Risk | Impact | Handling |
|---|---|---|

| **Browser extension down** | Phases 3b and 3c cannot happen | Reconnect before phase 3, or the webhook and AWS slides ship without captures |
| **ngrok signup, per student** | Slide 33 is the slowest beat in the session: 30 learners each need an account, an authtoken and their own dev domain | Budget the time; it is the accepted cost of D1 = A |
| **ngrok Free limits** | 20k requests, 1GB transfer, 3 online endpoints per account | Ample for a classroom, since each learner runs their own |
| **AWS activation is 24 to 72 hours** | It is the reason this block is in session 8 at all | Nothing to do; it is the point |
| **Free Tier clock starts at sign-up** | Two of the twelve months are spent before session 10 launches an instance | Costs nothing, worth stating on the slide |
| **`SocketBridge` is a kit change** | Reaches every session including signed-off ones | PR, never a direct merge |

---

## Phase 7 — rev2, 2026-09-11. The whole Jenkins flow, plain English, captures

Instructions received after the 58-slide build merged as PR #5.

| # | Task | State |
|---|---|---|
| T7.1 | Rules 29, 30, 31 recorded in `slide-content-rules`, indexed in `RULES.md` | ✅ done, numbered after the author's uncommitted 22 to 28 |
| T7.2 | `plan.md` rev2: TR 9 pulled in, quiz frames removed, ngrok explained, every title plain, every process a `Shot` | ✅ done, 88 slides |
| T7.3 | Rewrite `jenkinsDockerDeck.tsx` to the rev2 list | ✅ done, 88 slides |
| T7.4 | Console Output slides 7, 24, 46, 70 are located code panels, never a shell | ✅ done |
| T7.5 | Every `CodeBlock` names its file path or UI location | ✅ done |
| T7.6 | **19 captures**, listed at the end of plan §5 | **blocked on the author**: a running Jenkins, an ngrok login, a Docker Hub login, an AWS sign-up on their own device |
| T7.7 | `slideCount` 88. align 0 of 88, qa baseline, video-safe two kit defects (12, 63). `build:html` 3.02 MB | ✅ done |
| T7.8 | Slide 48 `DataTable` → `SwapRows` | still blocked on `kit/lit-surfaces` merging |

**Branch:** `session/8-plain-english-and-captures`, cut from `origin/main` after
PR #5 merged.
