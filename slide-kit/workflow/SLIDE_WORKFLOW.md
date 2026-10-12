# Slide-generation workflow — plan first, sign off, then generate

Every session deck goes through this pipeline. **No deck generation happens
before the slide-wise content plan is signed off.**

```
TR doc ──▶ 1. Concept map ──▶ 2. Slide-wise plan ──▶ 3. Asset production
                                              │
                                              ▼
                     5. Generation ◀── 4. ✋ SIGN-OFF GATE (user approves plan)
                                              │
                     6. Verification ──▶ 7. Snapshot/versioning
```

## Inputs (common, set once per session)

| Input | Example |
|---|---|
| `SESSION_NAME` | `Client–Server & CORS` — used in the footer of **every** slide (never "Session N") |
| `COURSE` | `React + Django Integration` |
| `TR_DOC` | `Integration project/docs/session-1.md` |
| `SESSION_CODE` | `Integration project/session-1/{prefilled,final}` |
| `NEXT_UP` | one-line teaser for the next session |

## Stage 1 — Concept map

Read the TR doc. Extract **at most 4 key concepts** and map *every* doc
section under one of them. The agenda shows exactly these concepts; the deck
has exactly one section divider per concept.

## Stage 2 — Slide-wise content plan (`<course>/session_plans/<session>/plan.md`)

Fixed frame, in order:

1. **Brand slide** — NxtWave branding only (logo hero + course). No footer logo (would duplicate).
2. **Welcome** — kicker `WELCOME TO TODAY'S SESSION` + the session name. Nothing else in the body — no logo (the footer already carries it once).
3. **Today's Agenda** — the ≤4 concepts (never titled "Concepts in focus").
4. **Per concept** — divider (with a *topic-specific* illustration) → **one named framework**, four or five content slides minimum. Every concept opens on a felt need (the routine running, then the point it breaks) and closes on something observable. The middle is chosen by kind: **STAR** for a mechanism (the default), **4MAT** for a definition with nothing to run, **SCQA** for a choice, **Merrill** for a skill the learner performs. See `PEDAGOGY_GUIDELINES.md` section 2. **The plan names the framework per concept**, and a plan with one opening slide per concept is rejected at the gate. A framework outside those four is allowed but must be registered first (`PEDAGOGY_GUIDELINES.md` section 2, "The set is open"); naming one at generation time is not. One idea per slide; a quiz checkpoint mid/late deck.
5. **Key Takeaways** — the *same* agenda concepts restated as outcomes, in a *different UI* than the agenda.
6. **Practice** → **Feedback** → **Thank You** (next-up teaser).

**The plan also carries a term ledger** (`PEDAGOGY_GUIDELINES.md` section 2b):
every term, tool and file the deck names, the slide that introduces it, and the
plain-words gloss given there. Terms carried in from an earlier session get a
row naming that session. The gate checks it: any term appearing above its own
introduction is a rejection, and so is a concept whose Situation cannot be
written from terms already in the ledger.

Each planned slide records: purpose · component/layout · exact content ·
**visual + why it fits the content** · animation/transition · assets
(exists / build / capture).

### Visual-selection rules (hard rules)

- A visual must **depict the slide's concept**. If no fitting asset exists, **build one** (in-repo SVG/animated component, using design tokens).
- Reuse is allowed **only for same-type fixtures**: quiz/practice/feedback/recap mascot slides, the section-divider frame, code blocks.
- Never place an available-but-unrelated illustration to fill space.
- External sources (Freepik and other free-license libraries) are allowed **only** with: a free license, attribution recorded in the asset manifest, and explicit user approval per download.
- Screenshots must be **real captures of the running session code**, verified before they enter a slide. No mockups.

## Stage 3 — Asset production (owned by planning, not generation)

- Prepare/verify session code: `prefilled/` (initial) and `final/` (solution).
- Run the apps; capture the planned screenshots; verify each shows what the slide claims.
- Build the planned custom illustrations/animations.
- Maintain `workflow/assets-manifest.md`: every asset → source, license, the slide(s) using it, verified-on date.

## Stage 4 — ✋ Sign-off gate

Present the plan. The user approves, edits, or rejects. Record the decision in
the plan header (`STATUS: SIGNED OFF <date>` / `AWAITING SIGN-OFF`).
**Generation may not start while the plan is unapproved.**

## Stage 5 — Generation

Implement the deck exactly per the signed-off plan. Deviations go back
through the gate.

Compose kit components; do not write new markup. Start from
`slide-kit/slide-template/src/decks/sampleDeck.tsx`, the gallery of every slide
type and figure, and pick from
[`slide-kit/slide-types/README.md`](../slide-types/README.md). Motion runs at the
**explanatory tier**, roughly double the `animate` skill's UI numbers: entrances
520ms, staggers 130ms, line draws 860ms, a whole figure assembled in about 2.4s.
Nobody triggers a slide figure, and it is read once from the back of a room.

**Every deck's slide menu carries the Auto-play On/Off option** (pedagogy
team, 2026-10-12, on Python session 29, as a standing rule). The menu is the
player's "Jump to a slide" overlay (the grid button on the bar, the `G` key).
On, the slides the deck lists as auto-play play their steps when they open;
Off, every slide waits for Next. A deck first loads with it On; the choice is
kept per deck (localStorage under the deck's own path) across slides and
reloads; switching it takes effect on the slide on screen at once; with the
menu closed no setting shows on a slide (the per-card ▶ switch beside Next
stays as the manual trigger). It is drawn as two cards in the menu's own
style, never a new control on the slide. **Which slides auto-play is decided
per deck**, in its `src/decks/figures/autoplay.ts`; never carry one deck's
list into another. Until the kit PR lands, the session copies are Python 29's
`src/deck/SlidePicker.tsx` and `src/deck/autoplayPref.ts`, and its
`autoplay-check.mjs` checks the option on the built file.

### Stage 5b — Anything reusable goes back into the kit, through a PR

A slide type, figure or transition built for this session that **a different deck
next month would want** does not stay in the session. It is moved into
`slide-kit/slide-template`, exported from the barrel, added to `sampleDeck.tsx`
with a `notes` string, registered in the slide-types README, and **committed on a
branch with a PR raised**.

This is the step this repo skipped most. The syntax-anatomy figure was hand-rolled
three times (`PortPublish` and `ExecAnatomy` in session 4, `TargetAnatomy` in
session 5) before it became `SyntaxBreakdown` in the kit, and session 5 had to
rediscover session 4's invisible-overlapping-labels bug by shipping it.

The PR is not ceremony: `sync-kit.mjs --apply` pushes a kit change to **every
other session**, signed-off ones included. Section 6 of
`.claude/skills/generate-slides/SKILL.md` has the full procedure.

## Stage 6 — Verification

- Build passes (`npm run build`).
- **All four harnesses, every time**, run in parallel against the dev server:
  `video-safe.mjs` (the instructor-video rectangle stays clear), `qa.mjs`
  (nothing leaves the 1280x720 frame), `align-check.mjs` (content that is inside
  the frame and still misplaced), and `preview.mjs` plus
  `scripts/build-preview-page.mjs` for the contact sheet.
  `align-check.mjs` is the one that gets skipped and the one that catches slide
  drift: session 4 was reported clean by the first two and shipped with
  overlapping slides.
- **Then look at the figures.** The harnesses measure DOM rectangles, so an
  `<svg>` is one box to them and a figure whose internal labels collide passes
  all three. Content rule 17. This is also why a figure made mostly of labels is
  built from DOM elements rather than as an `<svg>`.
- Per-slide QA in the running deck: alignment (measured, not eyeballed), no overflow of the 1280×720 frame (code blocks capped by `fontSize`, not `maxHeight`), animation smoothness/readability, step counts correct.
- ~~Footer shows `SESSION_NAME` on every slide.~~ **SUPERSEDED:** the footer
  carries the NxtWave mark only. The session name collided with the deck's
  bottom-right slide counter and duplicated each slide's kicker. See
  `.claude/skills/slide-content-rules/SKILL.md` rule 7.

## Stage 7 — Versioning

Snapshot the template to `<course>/versions/<session>.zip` (source only).
