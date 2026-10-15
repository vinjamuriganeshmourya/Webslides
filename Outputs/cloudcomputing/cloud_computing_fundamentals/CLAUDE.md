# Cloud Computing · "Cloud Computing Fundamentals"

The session deck for the first cloud computing session. Read this before
editing it. The kit rules are in `KIT.md` and `../../../slide-kit/slide-template/CLAUDE.md`.

- **Plan:** `../session_plans/cloud_computing_fundamentals/plan.md` (signed off on
  the user's word, 2026-10-14).
- **Source:** `Reference ppt's/cloud-computing-fundamentals 1.html`, content only.
  Every on-slide string is the reference's; its TR speaker notes are the notes.
- **Deck file:** `src/decks/cloudDeck.tsx`, 53 slides. Port 5270
  (`npx vite --port 5270 --strictPort`; the kit's vite.config says 5173).
- **Figures:** `src/decks/figures/`. `scene.tsx` (Card, Stage, Rail, Label,
  Arrow, Control, Slider), `art.tsx` (every drawn object), `people.tsx` (the
  cast), `analogy.tsx` (the eleven analogy scenes), one file per section
  (`basics`, `history`, `traits1`, `traits2`, `benefits`), `closing.tsx`
  (takeaways). `cast/` is the character lab's rig, vendored unchanged from
  Python 31, with `Cast.tsx` (Idling, Posed, crops).

## Decisions

1. Eight "continued" pairs from the reference are one stepped slide each.
2. Every figure body is one 1110px box on the left edge (content rule 38).
   Scenes inside it are absolutely placed on fixed stages, so a step never
   moves what is already there.
3. Labels, notes, controls and badges never render under 14px (`scene.tsx`
   floors them). qa still warns about the 16px floor on figure labels; the
   rail bullets and every heading are 16px or more.
4. Arrow svgs are sized to the line and its heads only, because
   `overlap-check.mjs` reads an arrow by its svg box.
5. The autoplay list is the eleven analogy slides, set by id at the bottom of
   `cloudDeck.tsx` (the kit's `AUTOPLAY_ON_BY_DEFAULT` ships with Python 31's
   numbers; the deck replaces the Set's contents).
6. Key Takeaways is `figures/closing.tsx`, not the kit's slide: the kit's ran
   the fifth item under the player bar.
7. Live loops (`useTicker`, CSS spins) hold still on `?all`, `?noauto` and
   `?still`, or harness screenshots stall.
8. No drag-to-move content. Live controls are buttons and sliders only.

## Checks, and the numbers this deck passes them with

```bash
export CHROME_PATH=/usr/bin/brave-browser
U="http://127.0.0.1:5270/?all"
node qa.mjs "$U" 53; node video-safe.mjs "$U" 53; node align-check.mjs "$U" 53; node mixed-align-check.mjs "$U" 53
node box-overflow-check.mjs http://127.0.0.1:5270 53; node controls-clear-check.mjs http://127.0.0.1:5270 53
node workflow/export/build-reveal-steps.mjs "http://127.0.0.1:5270/?nav=slide&x=" 53
AGENDA_SLIDE=3 node agenda-check.mjs; node feedback-check.mjs; node ligature-check.mjs; node overlap-check.mjs
CONTENT_SLIDE=5 node gesture-check.mjs; CONTENT_SLIDE=5 node phone-nav-check.mjs
CONTENT_SLIDE=5 PLAIN_SLIDE=2 BUTTONS_SLIDE=27 node autohide-check.mjs
node nav-stress-check.mjs $PWD/dist-single/cloud-computing-fundamentals.html chromium
AUTOPLAY_ON=8,15,17,19,26,29,33,36,40,43,45 AUTOPLAY_TOTAL=50 RESTART_SLIDE=15 SWITCH_SLIDE=24 MENU_SLIDE=8 AUTOPLAY_SAMPLE=8,9,15,16,26,28,33 node autoplay-check.mjs
```
