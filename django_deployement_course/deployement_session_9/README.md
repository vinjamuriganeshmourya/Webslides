# NxtWave Evolve — Web Slides Template

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

| Action | Keys / Mouse |
| --- | --- |
| **Next fragment / slide** | `→` · `Space` · `PageDown` · **click anywhere** |
| Previous | `←` · `PageUp` |
| First / last slide | `Home` / `End` |
| Overview grid | `O` |
| Speaker notes | `N` |
| Fullscreen | `F` |
| Close overlay | `Esc` |

**Click-to-reveal:** slide headings appear immediately; body content (bullets,
cards, flow nodes, steps, callouts, quiz options…) is revealed **one click at a
time** — so you control the pace. When all fragments are shown, the next click
advances to the next slide. The counter shows `slide / total · fragment / max`.
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
Fonts: **Sora** (headings) + **Inter** (body) + **JetBrains Mono** (code).
```
