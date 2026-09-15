# Deployment Session 8 — "Setting Up Jenkins for Docker Builds"

**This is a SESSION, not the base template.** The `CLAUDE.md` that arrived with
the scaffold was `slide-kit/slide-template`'s own, which describes itself as the
base template and tells you to edit the kit here. That is wrong for a session and
it has been replaced by this file. The kit's rules still apply, and they live at
`slide-kit/slide-template/CLAUDE.md`; read them there.

| | |
|---|---|
| Slides | **84**, rev2 of 2026-09-11, Test stage removed 2026-09-15 |
| `devPort` | 5219 |
| `htmlName` | `deployment-session-8` |
| Deck file | `src/decks/jenkinsDockerDeck.tsx`, plus `src/decks/deckShared.tsx` |
| Plan | `../session_plans/deployement_session_8/plan.md` — **rev2, 2026-09-11**, on direct instruction |
| Tasks | `../session_plans/deployement_session_8/tasks.md` |
| Build rules | session 7's `../workflow/skills/session-7-deck/SKILL.md`, R1 to R20, carried forward |
| TR | `/home/nxtwave/docker_jenkins_aws/08_setting_up_jenkins_for_docker_builds.md` |
| Also draws on | TR 9 §4 (the webhook) and TR 10 §2 (AWS account creation) |
| Branch | `deck/setting-up-jenkins-for-docker-builds`, worktree at `/home/nxtwave/web-slides-session8` |

## rev2, 2026-09-11: the whole Jenkins flow, and four rules this deck taught

**Scope.** *"On session 8 we must complete whole setup for Jenkins, from next
we would be required to start AWS."* TR 9's pipeline content is in this deck:
Jenkinsfile, the four stages, the failure demo, the complete flow. The sessions
after this one start AWS.

**Rule 18 is overridden here, on instruction.** *"Keep no Quiz Time slides as
this is long, override the rule and remove all Quiz Slides."* No `QuizTimeSlide`
in this deck. This is a per-deck exception, not a repo rule.

**Three hard rules were written because of this deck's first cut** (29, 30, 31
in `slide-content-rules`): no company-presentation voice, a screenshot for every
process, every code panel names its place. The first cut broke all three. Read
them before adding a slide.

**Concept names, article-free:** `Docker Access` · `Storing Secrets` ·
`Connecting to GitHub` · `Full Pipeline`.

## The two decisions that shape this deck

**D1 = A, the ngrok tunnel.** The webhook is configured and it genuinely fires in
the room. The draft plan recommended B (configure it, watch GitHub's delivery
fail, fall back to Poll SCM) on the grounds that a free ngrok URL changes on
every restart. That stopped being true: a free ngrok account now keeps one
**stable dev domain**, so the Payload URL entered here still resolves in sessions
9 and 10. Checked against ngrok's docs on 2026-09-10, recorded in plan §3.

The cost that remains is per-student: every learner needs their own ngrok
account, authtoken and dev domain. **Slide 33 is the slowest beat in the deck.**

**D2 = the AWS block is not a concept.** It gets no divider and no agenda row. It
is a prerequisite errand with a deadline, because an AWS account can take 24 to
72 hours to activate and is first needed in session 10. It sits in the closing
block under its own kicker, `CLOSING_KICKER`.

Two things that must stay on the slide and not drift into notes (plan §4.4):
nobody's card details are collected by anyone, and this account exists to learn
on, not for real time usage. And the deck may never promise zero cost, only that
it costs nothing if you stay inside the Free Tier.

## What is session-owned here

Everything under `src/` except `src/decks/` is kit, and `sync-kit.mjs --apply`
overwrites it. This session owns:

- `src/decks/jenkinsDockerDeck.tsx` and `src/decks/deckShared.tsx`
- `src/decks/activeDeck.ts`
- `deck.config.json`, this file, `README.md`
- `public/assets/` (a working copy of `slide-kit/assets/`, byte identical)
- `public/shots/` — real captures only. Hard rule 11: crop to the point, keep the
  context that carries meaning, never retouch. If a capture is wrong, re-run it

## The one new component

`SocketBridge`, for slide 9: one process talking to another across a boundary it
does not own. Nothing in the registry draws that. Per plan §6 it is prototyped in
`slide-kit/socket-lab` (`devPort` 5235) with candidates, screenshotted and looked
at before slide 9 is written, then built in `slide-kit/slide-template` and
brought here by `sync-kit.mjs`. **It reaches every session, so it ships as a PR.**

Do not build it in this session's `src/ui/`; the next kit sync would delete it.

## Commands

```bash
npm install
npx vite --port 5219 --strictPort   # npm run dev ignores devPort, see below
npx tsc -b --noEmit
npm run build:html                  # -> dist-single/deployment-session-8.html

export CHROME_PATH=/opt/google/chrome/chrome
node video-safe.mjs & node qa.mjs & node align-check.mjs & wait
node preview.mjs && node scripts/build-preview-page.mjs
```

`npm run dev` does **not** honour `devPort` from `deck.config.json`; it falls
through to Vite's own 5173 and upwards, while every harness hardcodes 5219. Start
the server with `npx vite --port 5219 --strictPort` or the harnesses fail with
`ERR_CONNECTION_REFUSED`. This is a kit-wide problem, not a session one.

**Keep `slideCount` at the real count.** Every harness reads it, and a stale
count makes the sweep stop early and report success on slides it never looked at.
