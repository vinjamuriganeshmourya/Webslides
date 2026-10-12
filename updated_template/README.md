# Updated Template

The six chrome slides of a NxtWave session deck — **All The Best, Agenda,
Section Breaker, Welcome, Next Session, Thank You** — rebuilt from the layered
reference renders in `slidestraining/`, as a standalone deck project of the
same shape as every session under `Outputs/`: a React 19 + Vite app that
builds to **one self-contained HTML file** (fonts, logo and grounds inlined)
an instructor opens by double-click.

The slides are **static**: no animations, no transitions, no build steps.

- References: `slidestraining/<slide>/` — the source of truth for every size,
  position, colour, ring, glass effect and grain.
- Typefaces: the NxtWave PPT style guide's (`slidestraining/NxtWave PPT
  Template/02`): Sora for the big words and titles, DM Sans for the rest.
- `src/design/tokens.ts` holds the measured sizes and colours; `CLAUDE.md`
  holds the decisions and the accepted differences.

## Quick start

```bash
npm install
npm run dev            # http://localhost:5259  (port from deck.config.json)
npm run typecheck
npm run build:html     # -> dist-single/updated-template.html, the deliverable
npm run render-check   # -> workflow/qa-shots/slide-NN.png, one per slide
```

`build:html` needs a network connection once, to fetch Sora and DM Sans from
Google Fonts and fold them into the HTML; after that the file needs nothing.

## Presenting

| Action | Keys |
| --- | --- |
| Forward | `→` · `PageDown` · `Space` |
| Back | `←` · `PageUp` |
| First / last slide | `Home` / `End` |
| Fullscreen | `F`, or the ⛶ button bottom-left |

The URL hash is `#/<n>-<id>`, so `#/3` opens the third slide. The control bar
bottom-left fades while the pointer is still.

## Layout

```
deck.config.json          name, title, htmlName, slideCount, devPort
index.html                the font <link> the single-file build inlines
public/assets/            the brand mark (the deck's only bitmap)
src/
  design/tokens.ts        measured type styles, colours, ring geometry
  design/grounds.ts       the two dark grounds as fitted CSS radial-gradient stacks
  ui/shared.tsx           Stage (ground + grain filter), Arc + the two ring sets, GlassPill, heroSlab, Logo
  slides/                 one component per slide, props-driven
  decks/templateDeck.tsx  the six slides with the references' placeholder copy
  decks/activeDeck.ts     which deck is live
  deck/Deck.tsx           the player: 1920x1080 stage zoomed to fit, hash routing, keys
scripts/                  inline-assets.mjs + inline-fonts.mjs (from the kit); fit-grounds.py (refits grounds.ts)
render-check.mjs          screenshots every slide of the built deck
```

## Using a slide in a session

Each slide is a plain component with string props:

```tsx
<AllTheBestSlide />
<AgendaSlide kicker="Python" title="Agenda" items={[{ title: 'Lists', body: '…' }]} />
<AgendaOrbitSlide kicker="Sets" items={[{ title: 'Sets', sub: '…' }]} />   {/* slide 7, the Python course's agenda on this ground */}
<ContentSlide kicker="Set Operations" title="Set Operations">…</ContentSlide>  {/* slide 8, the content header: kicker, divider, heading */}
<SectionBreakerSlide kicker="Welcome to today’s session" title="Functions" />
<WelcomeSlide greeting="Welcome" />
<NextSessionSlide title="Working with Lists" />
<ThankYouSlide />
```

The canvas is 1920×1080. The kit's slides are 1280×720, so a slide moved into
a kit session needs its own stage or a `zoom: 1280/1920` wrapper.
