# deck-engine — every new session deck is built here

One React engine, built from the cloud course's latest player (Session 5, 2026-11-04). A session is NOT a React
project any more: it is a folder of data that this engine turns into the single self-contained HTML file.

```
Outputs/<course>/<session>/          the session folder (no package.json, no node_modules, no src/)
  deck.json                          the slides, as data (format: src/engine/types.ts)
  images/                            screenshots, photos the slides use
  custom/index.tsx                   ONLY if a slide needs a one-off figure (analogy scenes, special drawings)
  slide-edits.ts                     the presenter's text edits (written by the dev server)
  dist-single/<htmlName>.html        the deliverable (committed)
Outputs/<course>/session_plans/<session>/plan.md   the signed-off plan, as before
```

## The commands (run from `deck-engine/`)

```bash
node deck.mjs new      ../Outputs/<course>/<session> "<Session Title>" "<Course>"   # standard frames scaffold
node deck.mjs validate ../Outputs/<course>/<session>        # format, ids, images, icon names, R9 title slide
node deck.mjs dev      ../Outputs/<course>/<session> 5290   # live preview while writing (#/N, ?still)
node deck.mjs build    ../Outputs/<course>/<session>        # ~15 s → <session>/dist-single/<htmlName>.html
node deck.mjs check    ../Outputs/<course>/<session>        # the rule checks on the built HTML (check-deck.mjs)
```

## The procedure (same as before for the user: they give the input paths)

1. Read the inputs the user points to (TR doc, spec, review file). Plan at `session_plans/<session>/plan.md`,
   sign-off gate unchanged (`.claude/skills/generate-slides/SKILL.md` §0).
2. `new`, then write `deck.json`: one entry per slide. Pick the layout (below), write the strings as they must
   appear (R8 capitals), pick icons by name, describe figures as data. Most figures are `diagram` specs.
3. Only a slide whose picture cannot be a diagram (an analogy scene, a bespoke drawing) gets a `custom` figure in
   `custom/index.tsx`. Budget the effort there.
4. `build`, then `check`. Look at the slides (screenshots of `?still#/N` from the built file). Fix the data, rebuild.
5. Review feedback becomes, in this order: a data edit (one slide), or an engine fix (a part or layout, so every
   deck gets it), or a new check in `check-deck.mjs`; then a row in `RULES-REGISTER.md`. Never a per-deck patch of
   engine code.

## Layouts (`layout` in a slide)

| layout | for | key fields |
|---|---|---|
| `brand`, `title`, `recap`, `agenda` | the opening (R9: brand then title, always) | from `meta` |
| `breaker` | a section divider (`lab: true` for the practical divider) | `index` |
| `points` | points left, figure right (the main slide) | `points[{text, icon, at}]`, `figure`, `lead` |
| `lead` | a description above a centred figure | `lead`, `figure` |
| `table` | a table (VisualTable: icons, row build, `highlight` only for meaning) | `table` |
| `screenshot` | one enlarged capture with orange rings (R7.9) | `image`, `rings`, `step`, `note` |
| `analogy` | two pictures, no explaining text (R3) | `everyday`, `concept` figures |
| `steps` | ticked lab steps, optional figure and note | `steps`, `figure`, `note` |
| `quiz`, `takeaways`, `next`, `thanks` | the closing frames | |
| `custom` | the escape hatch: a whole slide from `custom/index.tsx` | `component` |

Figures: `diagram` (boxes / nodes / chips / arrows / packets / steps, drawn by `src/engine/Diagram.tsx`),
`image`, `table`, `kit` (a course drawing the engine has: `BigVpc`, `VpcScene`), `custom`.
Icons: lucide names (`Shield`), `lib:<name>` for 3D library renders in `src/decks/figures/net/icons/`,
`img:images/x.png` for the session's own.

## Motion
Each content slide has ONE build track: the figure's `steps` and the lit point (`at`) follow it, so with auto
animation off one press is one step, and on, it plays itself. Loops never pause (R8.1). All held still on `?still`.

## Rules
`RULES-REGISTER.md` lists every standing review rule and where it is enforced: in a part (by construction), a
layout/template, a check, or the human review checklist at its end. A new rule from a review is added there and
implemented ONCE in the engine.

## Engine changes
The engine is shared by every deck built after 2026-11-04. A change here reaches every deck on its next `build`;
signed-off decks keep their committed HTML. Change it on a branch and say which decks you rebuilt.
`src/decks/figures/` is the cloud course's figure library carried over from sessions 1-5 (parts reused by the
layouts and the diagram renderer); a new course adds its own kit folder beside `net/` and registers its drawings in
`src/engine/figures.tsx` (`KIT`).

## Visual libraries (user, 2026-11-06: use them wherever they improve visual quality, one consistent style)

All installed in the engine. A session's `custom/*.tsx` imports any of them by bare name (`import gsap from 'gsap'`):
`deck-plugin.mjs` resolves every bare import from a session folder against the engine's `node_modules`. Import only
what a slide uses (the single HTML grows with each library pulled in). Everything is bundled, so decks stay offline.

| Need | Library | Notes |
|---|---|---|
| Entrances, layout and gesture motion (the default) | `framer-motion` | already the engine's motion layer |
| Physical motion: inertia, damped settling, weight shift | `@react-spring/web` | e.g. a balance that settles, a swinging sign |
| Complex timelines, SVG path drawing / morphing | `gsap` + `@gsap/react` (`useGSAP`) | free incl. commercial |
| Pre-made JSON animations | `lottie-react` (named export `{ Lottie }`), `@lottiefiles/dotlottie-react` | vendor the file into `custom/`, record its licence |
| Interactive vector animation | `@rive-app/react-canvas` | vendor the `.riv` into `custom/`, record its licence |
| Real 3D scenes | `three` + `@react-three/fiber` + `@react-three/drei` | perspective camera, PBR, shadows (Session 6 S53) |
| 3D physics / polish / avatars | `@react-three/rapier`, `@react-three/postprocessing`, `@pixiv/three-vrm` | |
| Alternative 3D engine | `@babylonjs/core` | never mixed with R3F in one scene |
| Stylised pseudo-3D | `zdog` (imperative, on a canvas) | `react-zdog` needs React 18: NOT usable, removed |
| Node-and-edge diagrams, animated edges | `@xyflow/react` | load balancer → servers flows |
| Text-defined diagrams | `mermaid` | |
| Custom data / diagram visuals | `d3` | |
| Standard charts | `recharts` | |
| Hand-drawn shapes | `roughjs` | only where a sketch look is the point |
| Styling, components, primitives | Tailwind (engine), `radix-ui`, shadcn/ui pattern (`class-variance-authority`, `clsx`, `tailwind-merge`) | |
| Measuring / aligning elements | `react-use-measure` | e.g. aligning boxes to the top of screenshots |
| Drag / hover interactions | `@use-gesture/react` | presenter-driven only (movable content stays off unless asked) |

Rules that still bind every library: engine palette and the reference illustration style below; `?still` renders
the final state with nothing moving; loops quiet and continuous (R8.1); motion physical and purposeful (content rule
59); labels stay DOM text in the deck fonts; nothing overlaps or overflows (check-deck). Libraries improve the
visual quality of what the slide teaches; they never add content or decoration for its own sake.

## Reference illustration style (user, 2026-11-06)

Soft glossy 3D "clay" renders: rounded forms, royal/cobalt blue dominant on white, small warm accents
(red / orange / yellow), soft contact shadows, transparent backgrounds, friendly people with big eyes. References:
`assets/icons/Icons/ChatGPT Image Sep 15, 2026, 10_53_19 AM 2.png` (student with books, thumbs up) and
`assets/icons/Icons/ChatGPT Image Sep 1, 2026, 05_31_33 PM 1.png` (woman with laptop beside a browser window).
The rest of `assets/icons/Icons/` and the engine's 3D library (`src/decks/figures/net/icons/`, Character Lab clay
presets) are the same family: draw from them, and keep every icon, person and scene on a slide in this one style.
