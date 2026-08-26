# Design system rules — slide-template

How to bring a Figma design into this codebase without fighting it. Written for
agents working through the Figma MCP; every path is relative to this directory.

**This directory is the BASE TEMPLATE, not a session.** It owns the kit that every
session runs on. Read `KIT.md` first: it says which files are kit and which a
session owns, and how `sync-kit.mjs` pushes a change out. A kit change made in a
session instead of here is lost the next time that session is synced.

This is a **presentation deck**, not an app. That single fact drives most of the
rules below: there is no responsive layout, no router, no data layer. There is one
fixed 1280×720 canvas, scaled to fit whatever screen it is projected on.

---

## 1. Token definitions

Tokens live in **two files that must be edited together**.

| File | Owns | Consumed by |
|---|---|---|
| `tailwind.config.ts` | The CSS side — every utility class | JSX `className` |
| `src/design/tokens.ts` | The TypeScript mirror | inline SVG fills, Framer Motion configs, canvas math |

`tokens.ts` says so at the top, and it is load-bearing:

```ts
/** Keep this in sync with tailwind.config.ts. */
export const colors = {
  brand: '#2D63FB',   // === nwBlue. The style guide's blue IS the brand ramp.
  brandDark: '#0146C7',
  brandDeep: '#00254B',
  teal: '#12B5A8',    // Evolve. LIGHT slides only — never on the navy stage.
  accent: '#FF8A3D',  // Evolve. Same restriction.
  ink: '#0B1A2B',
  body: '#4A5B6B',
  line: '#D8E3F5',
  nwNavy: '#00254B',
  nwBlue: '#2D63FB',
  nwDeep: '#0146C7',
  // …
} as const
```

**Rule: a colour added to one must be added to the other.** SVG `fill` and
`stroke` cannot read a Tailwind class, so anything that appears inside a drawn
figure (`src/ui/characters/*`, `ContainerJourney`, `LayerStack`) reads from
`tokens.ts`. Anything that appears as a background, border or text colour reads
from Tailwind. Most colours need both.

### Token shapes

- **Colour** — Tailwind ramps (`brand.50`…`brand.900` plus `DEFAULT`) for the
  three brand hues; flat values for semantic (`success`, `warning`, `danger`,
  `info`) and neutrals (`ink`, `body`, `muted`, `line`, `surface`, `night`).
- **Type scale** — fixed **px**, not `rem`, because the canvas is a fixed size:
  ```ts
  fontSize: {
    kicker: ['15px', { lineHeight: '1.2', letterSpacing: '0.14em', fontWeight: '700' }],
    'slide-title': ['34px', { lineHeight: '1.12', fontWeight: '700' }],
    hero: ['64px', { lineHeight: '1.02', fontWeight: '800' }],
    'body-lg': ['22px', { lineHeight: '1.5' }],
  }
  ```
  Use `text-slide-title`, `text-body-lg` etc. **Do not** introduce `text-[27px]`
  one-offs; if a Figma frame needs a size that is not on the scale, either map it
  to the nearest step or add a named step to the scale.
- **Radius** — `rounded-card` (18px), `rounded-xl2` (24px), `rounded-pill`.
- **Shadow** — `shadow-card`, `shadow-card-soft`, `shadow-float`, `shadow-glow`.
  All are blue-tinted (`rgba(45,99,251,…)`), not neutral black.
- **Gradients** — named `backgroundImage` entries. `bg-nw-night` is the deck's
  ONE dark stage and `bg-brand-soft` the light one; `bg-nw-gradient`,
  `bg-brand-gradient`, `bg-accent-gradient` and `bg-teal-gradient` exist but no
  slide type uses them. **Never pass a `bg-*` gradient in a slide's `className`** —
  it collides with the one `SlideBase` sets from `variant`, and Tailwind's output
  order, not your code, decides the winner. Add a variant instead.
- **Easing** — `src/design/tokens.ts` exports the house curves. Use these rather
  than inventing cubic-beziers per component:
  ```ts
  export const easing = {
    soft: [0.22, 1, 0.36, 1],      // the house curve
    swift: [0.4, 0, 0.2, 1],
    springy: [0.34, 1.56, 0.64, 1],
  }
  ```

There is **no token transformation pipeline** — no Style Dictionary, no
generated CSS variables. The two files above are hand-maintained. When importing
Figma variables, translate them into these two files by hand and keep the
existing names; do not add a third source of truth.

---

## 2. Component library

Three layers, and the distinction matters when placing new Figma work:

```
src/ui/       primitives and figures   — no slide layout, reusable anywhere
src/slides/   slide TYPES              — one component per layout archetype
src/decks/    deck CONTENT             — the actual session, data only
```

**`src/ui/`** — `SlideBase`, `SlideHeader`, `Callout`, `DataTable`, `CodeBlock`,
`Terminal`, `Shot`, `LayerStack`, `MachineBoundary`, `ContainerJourney`,
`SyntaxBreakdown`, `StatusList`, `ChatThread`, `primitives.tsx` (Kicker, Chip,
NumberBadge), `content.tsx` (BulletList, Card, CardGrid, StatTile), `flow.tsx`
(StepList, FlowChart). All re-exported from `src/ui/index.ts` — import from
`@/ui`, not from the file.

**A figure made mostly of labels is built from DOM elements, never as an
`<svg>`.** Session 4 shipped two SVG figures whose `<text>` labels overlapped and
all three harnesses passed them, because an `<svg>` is one rectangle to a
harness. `TargetAnatomy` (session 5) and `SyntaxBreakdown` are the corrected
pattern: every label a real element in a real grid, so the browser keeps them
apart and `align-check.mjs` can see them. Content rule 17.

**`src/slides/`** — one component per layout: `ContentSlide`, `ContentNoteSlide`,
the four `Content*ImageSlide`s, `SectionBreakerSlide`, `AgendaSlide`,
`CodeBuildSlide`, `CodeSyntaxSlide`, `CommandSyntaxSlide`, `StatusPointsSlide`,
`FlowChartSlide`, `ProceduralStepsSlide`, `ScenarioSlide`, `ConversationSlide`,
`ChatSlide`, `ChatCharacterSlide`, `QuestionSlide`, `QuestionPointsSlide`,
`QuizTimeSlide`, `KeyTakeawaysSlide`, `RecapSlide`, `PracticeSlide`,
`FeedbackSlide`, `BrandSlide`, `WelcomeSlide`, `ThankYouSlide`. Props for every
one are declared in a single file, `src/slides/types.ts`.

`QuizSlide` is **retired**, not merely absent: a quiz is delivered by an external
component, so a deck's only quiz frame is the announcement one. `sync-kit.mjs`
deletes it from any session that still has it.

**`sampleDeck.tsx` must render every one of these.** Three of them
(`BrandSlide`, `CodeBuildSlide`, `QuizTimeSlide`) were exported and missing from
the gallery for several sessions, so decks were written as though they did not
exist. `slide-kit/slide-types/README.md` has the one-line check.

**`src/decks/`** — arrays of `SlideDef`. Content only; no layout decisions. This
template ships two, and `src/decks/activeDeck.ts` selects which one is live:

- `baseDeck.tsx` — one instance of each chrome slide, placeholder copy. The deck
  to open when the **theme** looks wrong.
- `sampleDeck.tsx` — the exhaustive component gallery. The deck to open when a
  **layout** looks wrong.

```tsx
export const baseDeck: SlideDef[] = [
  {
    id: 'base-content',           // stable — also the URL hash
    section: 'A concept',
    label: 'Content',             // shown in the overview grid
    element: <ContentSlide … />,
    notes: 'Speaker notes, shown in the presenter overlay (press N).',
  },
]
```

**When a Figma frame arrives:** decide first whether it is a *new layout* or new
*content in an existing layout*. Reuse a slide type wherever the structure
matches; only add to `src/slides/` when the arrangement is genuinely new, and
then add its props to `types.ts` and export it from `src/slides/index.ts`.

There is no Storybook. The deck itself is the component gallery — run `npm run
dev` and press `?all` (see §7).

---

## 3. Frameworks & libraries

| Concern | Choice |
|---|---|
| UI | **React 19** (`react-jsx` transform, no `import React`) |
| Animation | **framer-motion 11** |
| Styling | **Tailwind CSS 3.4** + a small `src/index.css` |
| Icons | hand-rolled SVG + **lucide-react** (pinned `1.24.0`) |
| Build | **Vite 6** + `@vitejs/plugin-react` |
| Language | **TypeScript 5.7**, `strict`, **`noUnusedLocals`**, `noUnusedParameters` |
| Screenshot QA | **Playwright** (dev dependency, used by the harnesses) |

`noUnusedLocals` is on, so **deleting a slide but leaving its import breaks the
build**. `npm run build` runs `tsc -b` first for exactly this reason.

Path alias `@/` → `src/`, declared in *both* `vite.config.ts` and
`tsconfig.app.json`.

Fonts load from Google Fonts in `index.html`: **Sora** (headings), **Inter**
(body), **JetBrains Mono** (code). Match those when reading a Figma text style —
if the design specifies a different family, raise it rather than silently
substituting.

---

## 4. Asset management

Everything served statically from `public/`, referenced by absolute path:

```
public/assets/logo-nxtwave.png     the ONE brand mark
public/assets/tech/*.svg           third-party logos (docker, django, react, …)
public/shots/*.png                 real screenshots used on slides
```

```tsx
<img src="/assets/tech/docker.svg" alt="" draggable={false} />
```

No import-based asset pipeline, no CDN, no image optimisation step, no
`srcset` — the canvas is a fixed size, so one resolution is enough. Vite copies
`public/` verbatim.

**Rules for adding assets:**
- Third-party logos go in `public/assets/tech/` and must be the vendor's own
  official file. Do not recolour them; where a light-on-dark version is needed,
  ship the vendor's white variant as a separate file (see `docker-white.svg`).
- Screenshots go in `public/shots/` and must be **real** captures, never mocked
  or reconstructed. Render them through `src/ui/Shot.tsx`, which supplies the
  frame and an optional percentage-based highlight box.
- The NxtWave mark is only ever `src/ui/Logo.tsx`. It reverses to white on dark
  grounds via a filter rather than a second asset:
  ```tsx
  style={onDark ? { filter: 'brightness(0) invert(1)' } : undefined}
  ```

---

## 5. Icon system

Two sources, one registry — `src/ui/icons.tsx`:

1. **Hand-drawn**, on a 24-grid, `stroke="currentColor"`, `strokeWidth={2}`:
   ```tsx
   const base = (p: P) => ({
     width: 24, height: 24, viewBox: '0 0 24 24',
     fill: 'none', stroke: 'currentColor', strokeWidth: 2,
     strokeLinecap: 'round', strokeLinejoin: 'round', ...p,
   })
   export const Check = (p: P) => <svg {...base(p)}><path d="M20 6 9 17l-5-5" /></svg>
   ```
2. **lucide-react** picks, re-exported through the same registry.

Both land in one lookup so slide data can name an icon as a string:

```tsx
export const iconByName = { check: Check, bulb: Bulb, terminal: TerminalSquare, … }
export type IconName = keyof typeof iconByName
```

**Naming:** lowercase kebab-case (`shield-check`, `json`, `devices`) — the *role*
on a slide, not the Figma layer name. Colour comes from `currentColor`; never
hardcode a fill on an icon.

Characters and scene illustrations are **not** icons. They live in
`src/ui/characters/` (`Nova.tsx`, `props.tsx`, `concepts.tsx`, `session1.tsx`)
behind one component, `Illustration`, selected by an `IllustrationName` union.

---

## 6. Styling approach

**Tailwind utilities in `className`.** No CSS Modules, no styled-components, no
`.css` file per component. `src/index.css` holds only: the three `@tailwind`
directives, `html/body/#root` reset, the `.slide-canvas` and `.slide-footer-bar`
component classes, and a `prefers-reduced-motion` block.

Inline `style` is legitimate in exactly three cases:
1. values Tailwind cannot express (`gridTemplateColumns` from a prop, a computed
   gradient),
2. SVG paint,
3. anything driven by a token variable at runtime.

**No responsive design.** There are no breakpoints anywhere. The 1280×720 stage
is scaled with a transform to fit the viewport; write fixed px and trust it.

**One hard colour rule.** The deck has a dark family and a light family, and
they do not share accents:

| Family | Ground | Accents |
|---|---|---|
| Dark chrome (welcome, session name, dividers, practice, feedback, thank you) | `variant="night"` → `bg-nw-night` | white, or `tone="nw"` / `"nwDeep"` |
| Light content (everything else) | `variant="light"` → `bg-brand-soft` | `tone="brand"` (now the same blue), `success`/`warning`/`danger` for semantics |

`tone="accent"` (orange) and `tone="teal"` are Evolve hues with no counterpart in
the NxtWave style guide. They are legible on a light slide and off-brand on the
navy one. Reaching for them on a dark ground is what made the welcome frame and
the section dividers look like two different decks.

**Two hard layout rules that every new slide must satisfy:**

1. **Video reservation.** The top-right `x 913..1280, y 0..220` is kept clear for
   an instructor video composited in later. It is never drawn — slides simply do
   not place content there. `pointer-events-none` decorative background is the
   one exception the checker allows.
2. **Header floor.** `SlideHeader` carries `min-h-[168px]` so body content never
   starts above y≈216.

**Motion** goes through `src/motion/`:
- `Reveal.tsx` — `<RevealGroup stagger={0.1}>` + `<Reveal dir="up">` for entrance
  choreography. `RevealGroup` is a `motion` component, so **a plain wrapper
  `<div>` between it and its `<Reveal>` children breaks variant propagation** and
  silently kills the stagger. Use auto-margins, not wrappers, to position groups.
- `Stepper.tsx` — click-driven builds (`useReveal`, `<Step>`), and the `?all`
  query flag that forces every step visible for QA.
- `instant.ts` — `useInstant()`, true during Ctrl+←/→ jumps. Any component with
  its own entrance must read it and mount at the final state when set, or it will
  be the only thing moving on an otherwise still slide.

Beware: **framer-motion writes an inline `transform` every frame, which replaces
Tailwind's `-translate-x-1/2` utilities.** Centre animated elements with animated
`x: '-50%'` values, not classes. This has caused three separate bugs in this repo.

---

## 7. Project structure

```
slide-template/
├── KIT.md                   ← kit vs session, and how to sync
├── sync-kit.mjs             ← push kit changes to a session
├── deck.config.json         ← name, title, slide count (session-owned)
├── index.html               font links + #root
├── tailwind.config.ts       ← token source (CSS)
├── vite.config.ts           @/ alias, dev server
├── qa.mjs                   frame-overflow + footer-mark sweep
├── video-safe.mjs           asserts the video rectangle stays clear
├── public/                  assets, shots
├── workflow/                plans, capture logs, sign-off pages
└── src/
    ├── index.css            the only stylesheet
    ├── design/tokens.ts     ← token source (TS mirror)
    ├── motion/              Reveal, Stepper, instant, presets
    ├── deck/                the player: Deck, SlideStage, controls, nav hooks
    ├── ui/                  primitives + figures  (barrel: index.ts)
    │   └── characters/      Nova + illustration scenes
    ├── slides/              slide types           (barrel: index.ts)
    │   └── types.ts         ALL slide props, one file
    └── decks/               deck content
        ├── activeDeck.ts    ← the one session-owned seam
        ├── baseDeck.tsx     the chrome, placeholder copy
        └── sampleDeck.tsx   the full component gallery
```

**Organised by kind, not by feature.** A new slide type touches SIX files, in
this order: `slides/types.ts` (props) → `slides/NewSlide.tsx` →
`slides/index.ts` (export) → `decks/sampleDeck.tsx` (the gallery, with a `notes`
string saying what it is for) → `../slide-types/README.md` (the registry) → the
session deck that wanted it.

Then it is **committed to the kit and raised as a PR**, because
`sync-kit.mjs --apply` will push it to every other session including signed-off
ones. Section 6 of `.claude/skills/generate-slides/SKILL.md` has the procedure.

### Commands

```bash
npm run dev                 # the live deck
npm run build               # tsc -b && vite build
npm run build:html          # ONE self-contained .html — see below
npx tsc -b --noEmit         # fastest correctness check

export CHROME_PATH=/opt/google/chrome/chrome
node qa.mjs                 # overflow + logo per slide
node video-safe.mjs         # must print CLEAN
node workflow/export/build-reveal-steps.mjs http://localhost:<port> <count>

node sync-kit.mjs --check ../../django_deployement_course/deployement_session_1_v2   # is that session behind?
node sync-kit.mjs --apply ../../django_deployement_course/deployement_session_1_v2   # bring it up to date
```

The harnesses take their URL, slide count and output name from
`deck.config.json`, so the bare command is correct in every session. Pass
arguments only to override. **Update `slideCount` there when slides are added or
removed** — a stale count silently skips the tail of the deck.

`?all` forces every click-gated build step open. It does NOT fast-forward
entrances that play on mount, which is why the harnesses settle for 2600ms; see
the capture-timing note at the end of `KIT.md` before lowering that.

Expected `qa.mjs` baseline — **two** flagged slides, both benign:

- **the first frame** — `NO LOGO` plus overflow on its `pointer-events-none`
  decorative blobs. In the gallery this is `BrandSlide`; in `baseDeck` it is the
  Welcome frame. Both carry the mark on stage rather than in the footer.
- **the Thank you slide (last)** — `NO LOGO` only. The harness looks for the mark
  in `footer svg, footer img`, and this slide carries the mark *on stage*
  instead, so it passes `footerLogo={false}` to stop the footer printing a
  second one. `BrandSlide` does the same.

Anything else is a regression.

### The standalone HTML build

`npm run build:html` emits **`dist-single/<htmlName>.html`** (from
`deck.config.json`) — the whole deck in one file that opens by double-click, with
no server and no network:

1. `vite build -c vite.singlefile.config.ts` inlines all JS and CSS.
2. `scripts/inline-assets.mjs` rewrites every `/assets/…` and `/shots/…` path to
   a base64 data URI, then deletes the now-unreferenced copies Vite made of
   `public/`. **This step is not optional** — §4 references assets by
   *root-absolute* path, which under `file://` resolves to the filesystem root
   and silently breaks every screenshot.
3. `scripts/inline-fonts.mjs` embeds the three Google families as woff2 data
   URIs and drops the `<link>`. It fails soft: no network at build time means a
   deck that still works but falls back to system fonts.

Nothing about the player changes — keyboard nav, `Ctrl+←/→` build steps, the
`#/n` hash, fullscreen and the framer-motion transitions are all client-side and
survive bundling untouched.

```bash
node preview.mjs                         # defaults from deck.config.json
node scripts/build-preview-page.mjs      # → workflow/preview/index.html
```

`preview.mjs` loads the built file over `file://` **with all http/https requests
aborted**, so a deck that still reaches for a CDN fails the run rather than
passing on a cached asset. It captures every slide with `?all` plus mid-flight
transition frames, and reports broken images and console errors. The contact
sheet's headline counts are derived from what was actually captured, never typed
in: it used to hardcode "35 slides" and announced that above a grid of 48.

---

## 8. Rules that outrank visual fidelity

Content rules live in `.claude/skills/slide-content-rules/SKILL.md` (workspace
level) and win over a Figma frame's copy. The ones most often violated when
transcribing a design:

- **No em dashes.** No trailing full stops on titles, bullets, table cells, or
  captions.
- **One idea per slide.** If a Figma frame carries two, split it.
- Text and its supporting visual **reveal together**, never text-then-picture.
- Terminal output is rendered by `src/ui/Terminal.tsx`, never as a screenshot of
  a terminal and never invented.
- A session deck's header comment carries that deck's own rules. Read it before
  editing the deck file.
- These rules apply to `baseDeck.tsx` too, placeholder copy or not. A session
  copied off a base deck that breaks them starts out breaking them.

---

## 9. Figma-specific notes for this account

- The template file `Fw9qM2GY6DjedBCpG2ap4l` (NxtWave PPT Template) is **not
  shared with this account as an editor**. `get_variable_defs`, `get_screenshot`
  and `get_design_context` all return *"you don't have edit access to this
  file"*. Colours have to come from an exported SVG or a shared screenshot
  instead.
- Creating a **new** file and drawing into it does work on the View seat
  (`create_new_file` + `use_figma`).
- There is a per-seat cap on Figma MCP calls. Budget them: inspect once, build in
  a few large-but-valid steps, and prefer `await node.screenshot()` inside a
  `use_figma` call over a separate `get_screenshot` round trip.
