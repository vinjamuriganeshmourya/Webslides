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
| Slide count | see `deck.config.json`, and keep it current |

This file holds only what is specific to this deck. Everything general lives up
the tree: `/CLAUDE.md` is the repo map, `/RULES.md` indexes every standing rule,
and `slide-kit/slide-template/KIT.md` says which files here are kit.

---

## The one thing not to break

**The paradox is set up on slide 45 and resolved on slide 67.** The Compose file
says `VITE_API_BASE_URL: http://localhost:8000`, which flatly contradicts
session 3's rule that service names are hostnames, and it is correct. Slides 45
to 66 must not explain why.

That is content rule 4 (name a later problem, never open it), and it is also the
best beat in the TR. An edit that answers it early costs the session its ending.
`BrowserOutsideDocker` on slide 68 is the answer, and it is the only figure in
the deck that draws the machine boundary.

## Figures this deck added

None of the four is in the kit yet. Per content rule 14, promoting one is the
user's call, and my read is in the plan §5.1: `PortPublish` and
`BrowserOutsideDocker` are general to any containerised web app, while
`VolumeShadow` and `ExecAnatomy` are close to one-offs for this TR.

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
