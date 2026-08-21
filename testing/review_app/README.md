# NIAT Slide Workflow — review app

A Streamlit front-end for the slide pipeline in `workflow/SLIDE_WORKFLOW.md`,
with **Claude Code connected** (headless `claude -p`) to respond to feedback.

## Run

```bash
cd "Web Slides/testing/review_app"
streamlit run app.py
```

Requirements: `pip install streamlit`, plus the `claude` CLI on PATH and
logged in (the sidebar shows the connection status).

## The flow

1. **Prepare content** — point at a TR doc; Claude Code drafts a slide-wise
   plan JSON (schema `slide-plan/v1`) into `workflow/plans/`, status
   `AWAITING_SIGN_OFF`.
2. **Review slides** — walk the plan slide by slide (prev/next or jump).
   Each slide shows its content, visual (+ why it fits), transition, and
   source-doc reference. Set **approved / needs-changes**, write feedback,
   save. Reviews persist per plan in `workflow/reviews/<plan>.reviews.json`.
3. **Claude responds** — "Ask Claude to respond" sends the slide spec, the
   feedback, and a TR-doc excerpt to Claude Code with the workflow guardrails
   (doc-faithful, topical visuals, no emojis, professional tone). Claude
   returns a rationale + revised slide JSON; one click **applies it to the
   plan** (a timestamped backup of the plan is written first).
4. **Summary & export** — a status table across all slides, a sign-off
   readiness check (all approved?), and a feedback JSON export.
5. **Deliver as HTML** — once **every** slide is approved, the Summary tab
   unlocks *Build deck & prepare HTML download*: it runs the deck build
   (`npm run build`) and hands you a zip of the HTML bundle
   (index.html + assets + README). Unzip and serve with
   `python3 -m http.server 8080`.

## Files

| Path | What |
|---|---|
| `workflow/plans/*.plan.json` | slide-wise plans (the sign-off artifact) |
| `workflow/reviews/*.reviews.json` | per-slide status, feedback, Claude responses |
| `workflow/plans/*.bak-*.json` | automatic backups written before applying a revision |

## Claude access levels (sidebar)

| Level | What Claude can do | How |
|---|---|---|
| **Respond only** (default) | Answer from the prompt — fast, side-effect-free | plain `claude -p` |
| **Read the repo** | Consult the full TR doc, deck code, workflow files | `--allowedTools Read Grep Glob`, cwd = repo root |
| **Full agent** | Everything: read/edit files, run **terminal** commands & **scripts**, use **skills**; can apply feedback end-to-end and verify with a build | `--dangerously-skip-permissions`, cwd = repo root |

Full agent bypasses permission prompts entirely — use it deliberately. Its
prompts require Claude to end with a report of files touched and commands run.

**Session continuity**: tick "Continue previous Claude session" to `--resume`
the last run for this plan, so successive feedback rounds share context
(session IDs are stored in the reviews JSON).

## Notes

- In *Respond only* mode Claude is instructed not to use tools, so responses
  stay fast and deterministic.
- Applying a revision from the app only changes the one slide (matched by
  `id`) and stamps the plan's `planNote`; generation still goes through the
  sign-off gate. In *Full agent* mode Claude may instead edit the files
  directly — its reply lists exactly what changed.
