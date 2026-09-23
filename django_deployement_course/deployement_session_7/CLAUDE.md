# Deployment Session 7 — "Introduction to Jenkins"

**This is a SESSION, not the base template.** The `CLAUDE.md` that arrived with
the scaffold was `slide-kit/slide-template`'s own, which describes itself as the
base template and tells you to edit the kit here. That is wrong for a session and
it has been replaced by this file. The kit's rules still apply, and they live at
`slide-kit/slide-template/CLAUDE.md`; read them there.

| | |
|---|---|
| Slides | **62** |
| `devPort` | 5218 |
| `htmlName` | `deployment-session-7` |
| Deck file | `src/decks/jenkinsCicdDeck.tsx`, plus `src/decks/deckShared.tsx` |
| Plan | `../session_plans/deployement_session_7/plan.md` |
| Build rules | `../workflow/skills/session-7-deck/SKILL.md` ← **read this first** |
| TR | `/home/nxtwave/docker_jenkins_aws/07_introduction_to_jenkins_and_cicd.md` |

## Before editing a slide

1. `../workflow/skills/session-7-deck/SKILL.md` has this deck's rules. R1 to R13
   are session 6's carried forward and are not restated there; R14 to R20 are new.
2. The header comment in `src/decks/jenkinsCicdDeck.tsx` lists the four things an
   edit here is most likely to break. It is short and it is not decoration.

## What is session-owned here

Everything under `src/` except `src/decks/` is kit, and `sync-kit.mjs --apply`
overwrites it. This session owns:

- `src/decks/jenkinsCicdDeck.tsx` and `src/decks/deckShared.tsx`
- `src/decks/activeDeck.ts`
- `deck.config.json`, this file, `README.md`
- `public/assets/` (a working copy of `slide-kit/assets/`, byte identical)
- `public/shots/` — five REAL captures of Jenkins 2.568.3, taken from a running
  `jenkins/jenkins:lts` container at 2x device scale and cropped to the region
  each slide is about. Every `Shot` highlight box in this deck was measured from
  the target element's own bounding rect, not eyeballed. If a capture is wrong,
  re-run and re-capture; never retouch one (hard rule 11)

**Four kit files were changed while building this deck** and are NOT session
copies to edit here: `src/ui/flowFigure.ts`, `src/ui/BoundaryBridge.tsx`,
`src/ui/flowchart/flowchartFigure.ts`, `src/ui/flowchart/NodeShell.tsx`,
`src/ui/flowchart/SpineFlow.tsx` and `src/ui/flowchart/GateFlow.tsx`. They were
edited in `slide-kit/slide-template` and copied down. R20 in the skill has the
table of what changed and why.

## Figures are prototyped next door

The four process-flow figures were built and screenshotted in
`slide-kit/cicd-lab` (devPort 5227) before a single deck slide was written, and
that lab found five faults every harness passes. If you change what a figure
says, change it there and look at the picture first. Hard rule 17.

## Commands

```bash
npm run dev                 # port 5218
npx tsc -b --noEmit
npm run build:html          # -> dist-single/deployment-session-7.html

export CHROME_PATH=/opt/google/chrome/chrome
node video-safe.mjs & node qa.mjs & node align-check.mjs & wait
node preview.mjs && node scripts/build-preview-page.mjs
```

`npm run dev` does **not** honour `devPort` from `deck.config.json`; it falls
through to Vite's own 5173 and upwards, while every harness hardcodes 5218. Start
the server with `npx vite --port 5218 --strictPort` or the harnesses fail with
`ERR_CONNECTION_REFUSED`. This is a kit-wide problem, not a session one.

Expected clean state: `video-safe` CLEAN, `align-check` 0 of 62, and `qa` flagging
exactly slides 1 and 62, both `NO LOGO`, both carrying the mark on stage instead
of in the footer.
