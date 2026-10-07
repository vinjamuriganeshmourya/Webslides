# Working with Lists (Python, session 20)

A modular, dynamic **web-slide system** built with **React 19 + TypeScript + Vite +
Tailwind CSS + Framer Motion**. It replaces static PPTX decks with data-driven,
animated, keyboard/click-navigable slides — designed for **educational content
delivery**.

> The original PPTX (`pptx_template/…`) was used only as a *structural* reference
> (which slide types exist). The theme, characters, layout, and typography here
> are all original ("NxtWave Evolve").

---

## Quick start

```bash
cd template
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the build
npm run typecheck  # tsc, no emit
```

## Presenting — controls

This table is what `src/deck/useKeyboardNav.ts` actually binds. It used to list
`Space`, `Home`, `End`, `O`, `N`, `F` and click-to-advance, none of which the
player has ever had, so if a key is not below it does nothing.

| Action | Keys / Mouse |
| --- | --- |
| **Forward** | `→` · `PageDown` |
| **Back** | `←` · `PageUp` |
| The other one of the pair | `Ctrl` + `→` / `←` |
| Swap what the plain arrows do (whole slides ⇄ build steps) | `S` |
| Jump to a slide, by name or number | `G` |
| **Play this slide again from the top** | `R` |
| **Open or close the marker** | `M` |
| Fullscreen | the control-bar button, bottom left |

The plain arrows move by whole slides *or* by build steps, whichever the mode
pill in the control bar says, and `S` swaps the pair. `PageUp` / `PageDown`
follow the plain arrows, because that is what a hardware clicker sends and a
clicker cannot send `Ctrl`.

### The marker

`M` opens it. Ink is vector, stored in the slide's own 1280×720 coordinates, so
it stays sharp in a window, in fullscreen, on a projector, and in the built
single-file HTML. The palette is the small tab docked to the right wall; it
expands on hover and on keyboard focus, and it can be dragged up and down the
wall to get it off whatever the slide is showing.

**Three pens, because they are three jobs.** The `pen` writes: it paints well
under its nib width so it reads as handwriting, for putting a value in a blank or
ticking a line of code. The `marker pen` gestures: the same opaque ink at 1.6× the
nib, for a circle round a term that has to carry to the back of the room. The
`highlighter` marks where, not what: much wider, translucent, multiplied over the
words so they stay readable. Every stroke also paints a contrasting halo behind
itself, which is what lets one ink colour work on both the navy stage and the
light content slides.

| Action | Keys |
| --- | --- |
| Pen · marker pen · highlighter | `1` `2` `3` |
| Line · arrow · rectangle · ellipse | `4` `5` `6` `7` |
| Eraser (removes whole strokes it is dragged across) | `E` |
| Erase everything inside a dragged box | `Shift` + `E` |
| Erase this sheet, undoably | `Delete` **twice**, within 3s |
| Hide the ink without erasing it | `H` |
| This slide's ink ⇄ one sheet for the whole deck | `A` |
| Cycle ink colour · nib thickness | `C` · `T` |
| Undo · redo | `Ctrl` + `Z` · `Ctrl` + `Shift` + `Z` |
| Put the pen down, keeping the ink | `Esc` |
| Constrain a shape (45° line, square, circle) | hold `Shift` while dragging |

Verify the marker after any change to the player:

```bash
export CHROME_PATH=/opt/google/chrome/chrome
npm run build:html && node marker-check.mjs      # 48 checks, must print CLEAN
```

It drives a real pointer over the built HTML from `file://`, because that is the
artefact an instructor opens and a marker that works only under Vite is a marker
that does not work.

Ink is kept **per slide** by default and stays in memory for the session, so
leaving a slide and coming back brings the drawing back, and `A` switches to a
single sheet that stays put while the slides move under it. A stroke is stamped
with the build step it was drawn over and is only painted once the build reaches
that step again, which is also what makes `R` honest: replay restages the slide
from the top and the ink returns in the order the class first saw it. Nothing is
written to disk.

**Click-to-reveal:** slide headings appear immediately; body content (bullets,
cards, flow nodes, steps, callouts, quiz options…) is revealed **one press at a
time**, so you control the pace. When every fragment is shown, the next press
advances to the next slide.
Deep-link to any slide with `#/<n>` (e.g. `/#/12`); append `?all` to reveal every
fragment at once (used for the overview thumbnails).

---

## Project structure

```
src/
  design/tokens.ts        Design tokens (mirror of tailwind.config.ts)
  motion/                 Animation system
    presets.ts            Slide-transition + reveal variants
    Reveal.tsx            <RevealGroup>/<Reveal> — immediate staggered entrance
    Stepper.tsx           <Stepper>/<Step> — click-to-reveal fragments
  deck/                   The presentation engine
    Deck.tsx              Controller: nav, transitions, fragments, overview, notes
    SlideStage.tsx        16:9 (1280×720) canvas scaler
    ProgressBar / DeckControls / useKeyboardNav / useFullscreen
  ui/                     Shared building blocks (the "component kit")
    SlideBase.tsx         Slide frame + background variants + footer logo
    SlideHeader.tsx       Kicker + title + lead
    content.tsx           BulletList, Card, CardGrid, StatTile
    flow.tsx              StepList, FlowChart
    Callout.tsx  CodeBlock.tsx  ScenarioCard.tsx  Decor.tsx  icons.tsx
    Logo.tsx              The NxtWave brand mark (on every slide's footer)
    characters/           Nova mascot + scenes + concept illustrations
  slides/                 One component per slide TYPE (the template library)
  decks/sampleDeck.tsx    The sample lesson — demonstrates every slide type
  App.tsx / main.tsx
public/assets/
  logo-nxtwave.png        The only brand logo used
  characters/             (optional) AI-generated character art overrides
```

## Slide types

`WelcomeSlide` · `RecapSlide` · `AgendaSlide` · `SectionBreakerSlide` ·
`SectionBreakerImageSlide` · `ContentSlide` · `ContentLeftImageSlide` ·
`ContentRightImageSlide` · `ContentTopImageSlide` · `ContentBottomImageSlide` ·
`ContentNoteSlide` · `FlowChartSlide` · `OnlyImageSlide` · `ProceduralStepsSlide` ·
`ScenarioSlide` · `KeyTakeawaysSlide` · `PracticeSlide` · `FeedbackSlide` ·
`QuizSlide` · `ThankYouSlide`

Each is a typed React component (see `src/slides/types.ts`).

## Authoring a new deck

Duplicate `src/decks/sampleDeck.tsx` and edit the array. A deck is just data:

```tsx
export const myDeck: SlideDef[] = [
  {
    id: 'welcome',
    label: 'Welcome',
    transition: 'zoom',            // slide | fade | zoom | rise | cover | flip | none
    notes: 'Speaker notes…',       // press N during the talk
    element: (
      <WelcomeSlide
        course="Backend Development"
        title="Introduction to REST APIs"
        subtitle="…"
        lesson="REST APIs · Backend" // shows next to the footer logo
      />
    ),
  },
  // …more slides
]
```

Point `App.tsx` at your deck. Content that should reveal on click goes through the
shared primitives (`BulletList`, `StepList`, `FlowChart`, `CardGrid`, `Callout`,
quiz options) — they emit fragments automatically.

## The Nova mascot & illustrations

`src/ui/characters/` contains the original **Nova** mascot — the NxtWave
"spark of learning" as a friendly character (a plump star-spark with an
expressive face and little arms; not a human, robot, or animal) — plus scene
and concept illustrations. Nova is direction-aware (`facing` prop) so it always
gestures toward the content, and supports poses (`wave·point·idea·cheer·neutral`).
Use it anywhere via:

```tsx
<Illustration name="nova-wave" />   // nova-wave | nova-point | nova-idea |
                                    // nova-cheer | quiz | practice | feedback |
                                    // recap | concept-api | concept-database
```

### Regenerating characters with AI (optional)

Two generator scripts are included (`scripts/`), modeled on the reference
pipeline. They read a Gemini key from `template/.env.local` (`GEMINI_API_KEY=…`,
git-ignored):

```bash
python3 scripts/generate_character_svgs.py   # vector SVGs (works on free tier)
python3 scripts/generate_characters.py        # raster PNGs (needs image-gen billing)
```

Then register the produced files in `src/ui/characters/manifest.ts` and
`<Illustration>` will use them instead of the built-ins — no slide changes needed.

## Theme

Edit `tailwind.config.ts` (and mirror `src/design/tokens.ts`). Palette:
primary `#0B5FFF`, teal `#12B5A8`, accent `#FF8A3D`, success `#16A34A`.
Fonts: **Poppins** (headings) + **Inter** (kicker and body) + **JetBrains Mono** (code).
```
