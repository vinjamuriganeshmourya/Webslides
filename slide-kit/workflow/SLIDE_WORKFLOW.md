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

## Stage 2 — Slide-wise content plan (`workflow/plans/<session>.md`)

Fixed frame, in order:

1. **Brand slide** — NxtWave branding only (logo hero + course). No footer logo (would duplicate).
2. **Welcome** — kicker `WELCOME TO TODAY'S SESSION` + the session name. Nothing else in the body — no logo (the footer already carries it once).
3. **Today's Agenda** — the ≤4 concepts (never titled "Concepts in focus").
4. **Per concept** — divider (with a *topic-specific* illustration) → 2–4 content slides. One idea per slide; a quiz checkpoint mid/late deck.
5. **Key Takeaways** — the *same* agenda concepts restated as outcomes, in a *different UI* than the agenda.
6. **Practice** → **Feedback** → **Thank You** (next-up teaser).

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

## Stage 6 — Verification

- Build passes (`npm run build`).
- Per-slide QA in the running deck: alignment (measured, not eyeballed), no overflow of the 1280×720 frame (code blocks capped by `maxHeight`), animation smoothness/readability, step counts correct, quiz reveals answer only after all options.
- ~~Footer shows `SESSION_NAME` on every slide.~~ **SUPERSEDED:** the footer
  carries the NxtWave mark only. The session name collided with the deck's
  bottom-right slide counter and duplicated each slide's kicker. See
  `.claude/skills/slide-content-rules/SKILL.md` rule 7.

## Stage 7 — Versioning

Snapshot the template to `<course>/versions/<session>.zip` (source only).
