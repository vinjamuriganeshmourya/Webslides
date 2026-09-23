<!-- cSpell:ignore nxttrendz deployement NxtWave colour colours behaviour dockerignore Makefile makefile PHONY venv Vite ravi createsuperuser -->
# Session 6 · revision 2: the flow pass

**Applied 2026-09-08, signed off in conversation before any edit.** `plan.md`
stays as it was signed on 2026-08-26; this file records where the deck now
departs from it and why. Read them together: `plan.md` for the content of a
slide, this file for the order, the cuts and the concept names.

The deck went from **53 slides to 50**.

## Why

The review was that the session was hard to teach. Two structural causes, both
in the order rather than in any individual slide:

1. **Concept 1 stated a problem and then went quiet on it for eight slides.**
   Slides 7 and 8 established that the image lives on one machine and nowhere
   else, and the answer to that — a registry exists, you have been pulling from
   it since session 1, pushing is the new direction, here is an account — did
   not arrive until slides 17 to 19. In between sat eight slides on what is
   *inside* an image. By `PEDAGOGY_GUIDELINES.md` §2, beat 3 (*what do we need*)
   landed at slide 18 when it should land around 10.

2. **"Push Denied" taught a diagnosis the room could not trust yet.** It sat at
   slide 22 and concluded the refusal was about the *name*, but `docker login`
   was slide 30. A learner who pushes while logged out gets the same `denied`
   text for a different reason, which is why slide 49 existed to disambiguate
   two causes.

## What changed

**A · Concept 1 re-ordered, need before anatomy.** New order: Where It Lives →
And Nowhere Else → You Already Pull → Both Directions → the 156MB question →
Inside the Image → What It Saves → Why Not the Code → Deliberately Left Out →
Account → Target Picture. The registry and the two directions now arrive at
slides 9 and 10, and the image-anatomy block follows as the reason a push is
worth making, not as a detour before it.

**Three slides cut.**

| Cut | Was | Why |
|---|---|---|
| `c1-the-proof` | 12 | The most abstract slide in the deck (local packages compiled for your OS versus the image's own Linux) and the one furthest from the session's question. Cut outright rather than merged. |
| `c1-defining-property` | 14 | Its thesis sentence is now the first of the two closing lines on `c1-why-not-the-code`, where it answers something. |
| `c1-both-travel` | 16 | It reassured the room that git is not made redundant. **This cohort has never used git** — session 7 introduces it — so the slide answered a question they cannot have. |

**B · `docker login` and `Use a Token` moved to the head of concept 2**, before
"Push Denied", and their ids became `c2-login` and `c2-access-token`. The
refusal is now unambiguously about the name.

**C · "Denied Again" moved out of the Makefile block into concept 3**, as
`c3-push-denied-again`, immediately after the first successful push. It used to
sit at slide 49, after the release target was built, so concept 4 landed and
then re-opened on a failure. Its command changed from `make push` to
`docker push ravi123/nxttrendz-backend:v1`, because the `push` target does not
exist yet at that point in the session. **Both causes are kept**, against the
proposal, which said it would shrink to authentication only: a wrong name is
still the likelier of the two, and a slide naming only authentication would send
a learner with a typo down the wrong path.

**D · Two concepts renamed**, since they drive the agenda pills, the dividers,
the kicker on every content slide inside them and the Key Takeaways list:

| | Was | Now |
|---|---|---|
| C1 | Trapped on One Machine | **Image on One Machine** |
| C2 | Image Naming and Tagging | **Login and Image Names** |
| C3 | Login, Push, Pull | **Push and Pull** |
| C4 | Versioning, and a push Target | **Versioning and a Push Target** |

C1 and C4 changed for wording, not flow: "trapped" is figurative, and the same
review asked for plain statements throughout. The agenda subs and the divider
subtitles moved with them ("Log in first, then why the name has three parts",
"Two commands, and the image leaves the laptop").

## Also in this pass, and not about flow

- **Figurative wording removed** across all three parts: "Layers, Not a Blob" →
  "Layers, Not One File", "A Two-Way Street" → "Both Directions", "The latest
  Trap" → "Why latest Is Risky", "A History That Holds" → "Every Version Kept",
  "whale steady in the tray" → "its icon showing in the tray", "the registry
  that frees it" → "that moves it", and "the room has already written" → "you
  have already written".
- **Versions corrected to the ones this course actually ships**: `python:3.14`
  and `node:22`, at six sites that still said 3.13 and Node 20. Sessions 2, 3
  and 4 are the reference.
- **No AWS.** `c1-and-nowhere-else` said "the AWS server this course ends on";
  AWS has not been introduced, so it reads "a remote server" instead. The same
  applies to the speaker note on `c1-target-picture`.
- **Git removed from `c1-why-not-the-code`.** Its comparison column was headed
  with the git mark and "Ship the source repository"; it is now "Ship the code
  files", for the same reason `c1-both-travel` was cut.

## Verified

`npx tsc -b --noEmit` clean · `video-safe.mjs` CLEAN · `qa.mjs` at the two-slide
baseline (frame 1 and Thank you) · `align-check.mjs` 0 of 50 ·
`dist-single/deployment-session-6.html` rebuilt · `deck.config.json`
`slideCount` 53 → 50.

Two defects this pass introduced and fixed, both caught by `align-check`: the
merged thesis as a callout put its sentence at y=616 under the deck's own
control bar (it is two text lines now), and the moved refusal panel broke the
pushed image name across two lines at `fontSize` 14 (it is 12).

## Still open

The first sight of the Docker Hub website is `c3-on-the-hub`, *after* the push.
A beginner would be better served seeing the empty repository page before
pushing to it, but plan rule R6 says nothing in this deck is captured, and a
real capture needs a logged-in Docker Hub account. Session 7 has the same gap on
GitHub's "New repository" form. Not fixed, and not mocked.

---

# Revision 2b: named sessions, and the figure pass

Same day, after the flow changes above.

## Sessions are named, never numbered

`deckShared.tsx` now exports `S1` to `S5` — *Introduction to Docker*, *Docker
File Creation*, *Docker Compose for Multi-Container Apps*, *Running the Real App
with Docker*, *Automating Deployment with Makefile* — and every rendered
reference reads the name: "every `FROM` line since **Introduction to Docker**",
"the layers from **Docker File Creation**", "as **Running the Real App with
Docker** set up". The speaker notes were changed with them, so the instructor
says the name out loud rather than a numeral. Code comments still count.

**Why.** A numeral only works for someone who sat all six in order. The name is
what a learner recognises, and it is what the deck's own footer already carries.

`c4-full-picture` was rebuilt on the same rule: it was four rows with a numeral
column that had to squash "3, 4" into one cell, and it is now **one row per
session, named**, with what it added and the tool it added it with. Six rows, so
`compact`. "Compose, in anger" went with it — figurative, and this pass is the
one removing that.

## The figure pass

**`src/ui/litSurface.ts` is new, and it is the STYLE_GUIDE §9 recipe as one
function.** `lit(accent, kind)` returns `background` and `boxShadow` for the four
parts that always compose: the top-left white radial, the 135° ramp that has to
travel, the drop shadow **tinted with the surface's own colour**, and the two
hairlines. Four amplitudes: `solid` (white text on a saturated fill), `tint`
(dark text on a pale wash of the same hue, gentler so it reads as lit rather
than stained), `quiet` (every part, no drop shadow — §9's *flatter means less
light, never no light*), `recessed` (hairlines inverted, cut into the slide).

It exists because the recipe was written out four times across this session's
figures, twice with a part missing, which is exactly how `LayerStack`'s first
pass shipped looking flat. **It is session-owned for now** and deliberately
carries nothing session-specific, so it can be promoted to the kit as a PR
without edits.

| Figure | Was | Now |
|---|---|---|
| `TagPointers` | Zero gradients and zero tinted shadows in the whole file. Every row `bg-surface-card shadow-card-soft`: three rows meaning three different things drawn as one object in three inks | Lit per row in the row's own hue — `tint` for the pointer row and the row it points at, `quiet` for an ordinary row. The tag chip keeps its shadow whatever the row does, because it is the object on the row |
| `ImageNameAnatomy` | The panel had depth; the three name chips were flat 12% washes, so they read as coloured regions inside a panel rather than as three separable blocks of a name. Nothing but colour joined a chip to the caption that explains it | Chips lit at `tint`. **A tick joins each caption to its part**: a 16px rule in that part's hue with a dot at the card's top edge, drawn as real elements so `align-check` can measure them. Colour alone failed the two cases the figure exists for — a projector that shifts hues, and the slide where the Docker ID is *absent* and the eye has to be told which gap the caption belongs to |
| `c2-docker-tag` | A `Terminal` plus two hand-rolled `div`s with a border and a flat fill, labelling the command's halves | The kit's **`SyntaxBreakdown`** in `command` mode, which is the component for exactly this and which session 4 already uses on `docker compose exec`. Numbered token-to-card pairing that survives greyscale, and `fill: 'placeholder'` on the third token, so "which part do I replace?" is answered in the figure |

`LayerStack` was checked and left alone: the §9 treatment is already in the kit
copy, and session 6 renders every layer in the `ships` state on purpose, because
in this session the whole image travels.

## Also

`python:3.14-slim` and `node:22-alpine` at every site, including
`c2-youve-read-it`'s figure prop, which passes the tag separately and was still
`3.13-slim` after the first sweep.

## Verified again

`tsc` clean · `video-safe` CLEAN · `qa` two-slide baseline · `align-check` 0 of
50 · `preview.mjs` 50 slides captured over `file://` with the network aborted, 0
broken images, no console errors · `dist-single` rebuilt at 3.02 MB.
