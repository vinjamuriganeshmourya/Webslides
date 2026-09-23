<!-- cSpell:ignore nxttrendz deployement NxtWave devPort runserver gunicorn nvmrc PYTHONUNBUFFERED colour -->
# Deployment · Session 4 — "Running the Real App with Docker"

The deck is `src/decks/runningRealAppDeck.tsx`. Read its header comment before
editing it: rules **R1 to R8** live there, next to the code they govern.

| | |
|---|---|
| Plan | `../session_plans/deployement_session_4/plan.md` (signed off 2026-08-21) |
| TR doc | `/home/nxtwave/docker_jenkins_aws/04_running_django_app_with_docker.md` |
| Deck | `src/decks/runningRealAppDeck.tsx` |
| Session figures | `src/ui/PortPublish.tsx` · `BrowserOutsideDocker.tsx` · `VolumeShadow.tsx` · `ExecAnatomy.tsx` |
| Slide count | **78** · see `deck.config.json`, and keep it current |

This file holds only what is specific to this deck. Everything general lives up
the tree: `/CLAUDE.md` is the repo map, `/RULES.md` indexes every standing rule,
and `slide-kit/slide-template/KIT.md` says which files here are kit.

---

## The one thing not to break

**The paradox is set up on `c3-the-paradox` and resolved on `c4-paradox-resolved`.**
The Compose file says `VITE_API_BASE_URL: http://localhost:8000`, which flatly
contradicts session 3's rule that service names are hostnames, and it is correct.
Nothing between those two slides may explain why.

Slide **ids**, not numbers, throughout this file and the deck's own notes. They
were numbers until the 2026-09-03 review moved eleven slides, at which point
every reference pointed at the wrong frame, silently, in the notes an instructor
reads live. An id survives an insertion and it is greppable.

That is content rule 4 (name a later problem, never open it), and it is also the
best beat in the TR. An edit that answers it early costs the session its ending.
`BrowserOutsideDocker` on `c4-who-talks` is the answer, and it is the only figure in
the deck that draws the machine boundary.

## Figures this deck added

Three, not four. **`ExecAnatomy` was deleted on 2026-09-03** — the review said
its design was poor, and the answer was a deletion rather than a redesign: this
course hand-rolled the same syntax anatomy four times and the generalised version
has been in the kit as `SyntaxBreakdown` throughout. `c4-exec-anatomy` composes
the kit component now.

The remaining three are not in the kit. Per content rule 14, promoting one is the
user's call, and my read is in the plan §5.1: `PortPublish` and
`BrowserOutsideDocker` are general to any containerised web app, while
`VolumeShadow` is close to a one-off for this TR. All three were **lit** on
2026-09-03 rather than replaced, using the kit's `svgDepth.tsx`
(`STYLE_GUIDE.md` section 9).

If any of them is promoted, it moves to `slide-kit/slide-template/src/ui/`, gets
a barrel export, an entry in `sampleDeck.tsx`, and a row in
`slide-kit/slide-types/README.md`. It does **not** get copied by hand into the
other sessions; `sync-kit.mjs` does that.

## Transcripts are quoted, not captured

Every `Terminal` panel in this deck comes from the TR doc, like sessions 1 to 3.
Docker Desktop does not run on the capture machine, so versions, timings and
container names are illustrative. Swapping in real captures later needs no
layout change, because `Terminal` takes the same lines either way.

There are no screenshots in `public/shots/` for this session. Slide 65 is written
as steps the room performs rather than as captures, which was a sign-off
decision, not an oversight.

## Ports, and a kit bug worth knowing

`deck.config.json` says `devPort: 5215`, and the harnesses (`qa.mjs`,
`preview.mjs`, `video-safe.mjs`) read it. **Vite does not.** `vite.config.ts` is
kit-owned and hardcodes `server.port: 5173`, so `npm run dev` serves 5173 (or
whatever is free) and the harnesses then look at the wrong place.

Until that is fixed in the kit, start the server explicitly:

```bash
npx vite --port 5215 --strictPort
```

This affects every session in the repo, not just this one, which is why all four
decks carry a `devPort` that nothing enforces.
