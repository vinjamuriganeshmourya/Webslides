# Deck Studio

A browser UI for the whole deck pipeline, with Claude Code running headless
behind it and shown as a structured conversation: messages, tool calls, approval
cards, clarifying questions. The UI owns the files and the sign-offs; Claude Code,
on your own login, does the thinking. The server never calls the Anthropic API
itself: it drives your local `claude` binary through the Python Agent SDK.

```
TR doc ▸ Plan ▸ Plan sign-off ▸ Generate ▸ Review ▸ Deck sign-off ▸ Export
─────────────────────────────────────────────────────────────────────────
Claude panel: text · tool rows · Allow/Deny cards · question cards · composer
                 ⇅ WebSocket ⇅  server/agent.py  ⇅  claude (JSON mode, your login)
```

## Run it

```bash
cd studio
uv sync                                  # once: .venv with fastapi + uvicorn
uv run python -m server.main             # http://127.0.0.1:8600

cd ui && npm install && npm run dev      # development UI on :5173, proxies to :8600
npm run build                            # or build once; the server then serves ui/dist
```

The server binds to `127.0.0.1` only. It runs Claude Code with your login and
your permissions, so keep it on your own machine: one person, one login. This is
personal tooling, not a product to put in front of other people.

## How the stages map to files

| Stage | The UI | Claude Code (`/studio …`, typed for you) |
|---|---|---|
| TR doc | `session_plans/<s>/tr.md` | `/studio plan` writes `plan.md`, `STATUS: AWAITING SIGN-OFF` |
| Plan | render, edit, revision notes in `studio.json` | `/studio plan` applies the notes |
| Plan sign-off | rewrites the line to `STATUS: SIGNED OFF <date>` | — (this is the gate `generate-slides` reads) |
| Generate | — | `/studio generate` runs the generate-slides procedure, builds the HTML |
| Review | built deck in an iframe; comments to `workflow/reviews/<s>.review.md` | `/studio review` fixes open comments, ticks them |
| Deck sign-off | appends `· DECK SIGNED OFF <date>` to the STATUS line | — |
| Export | runs `build:html`, `video-safe`, `qa`, `preview`; download | — |

The review file is the same grammar `review-app/` writes, so either app can
pick up where the other left off.

## One Claude Code conversation per session

`session_plans/<s>/studio.json` pins a Claude Code session id to the deck
session: the id Claude Code reports on the first turn is recorded, and every
later start of the server resumes it, so a change request weeks later lands in
the conversation that already knows the deck. "New conversation" moves the id
into the file's `history` and starts fresh.

## Permissions

Read-only tools (`Read`, `Grep`, `Glob`, `Skill`, …) run without asking. Every
write, edit and command comes to the browser as a card: allow once, allow that
tool for the rest of the conversation, or deny with a reason Claude reads. Your
own rules in `.claude/settings.local.json` still apply first. Clarifying
questions (`AskUserQuestion`) arrive as option cards with an "Other" box.

## Layout

```
server/            FastAPI, one module per concern
  repo.py          find courses and sessions; derive pipeline state from files
  plans.py         the STATUS line: sign-offs and the gate
  reviews.py       the review-file grammar (mirrors review-app/lib/reviewFile.mjs)
  gates.py         which buttons are live when — team policy lives here
  jobs.py          build and harness jobs, streamed
  agent.py         headless Claude Code via the Agent SDK, one conversation per session
  api/             routes: sessions, review, jobs, agent (WebSocket)
ui/src/            React
  App.tsx          picker, stepper, stage pane, assistant panel
  stages/          one component per stage
  useAgent.ts      the WebSocket to the assistant; AgentPanel.tsx renders it
```
