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

**From 2026-11-13 a NEW session folder is not under `Outputs/` (user, 2026-11-13).** The whole deck project goes in
`/home/nxtwave/Desktop/webslides/Outputdecks/<course>/<session>/`, outside this repo; the plan stays at
`Outputs/<course>/session_plans/<session>/plan.md`. Give every command below that absolute folder in place of
`../Outputs/<course>/<session>`. The engine takes any path (built from outside the repo on 2026-11-13, same bytes).
Full text: root `CLAUDE.md`, "Where a NEW deck project goes".

## The commands (run from `deck-engine/`)

```bash
node deck.mjs new      ../Outputs/<course>/<session> "<Session Title>" "<Course>"   # standard frames scaffold
node deck.mjs validate ../Outputs/<course>/<session>        # format, ids, images, icon names, R9 title slide
node deck.mjs dev      ../Outputs/<course>/<session> 5290   # live preview while writing (#/N, ?still)
node deck.mjs build    ../Outputs/<course>/<session>        # ~15 s → <session>/dist-single/<htmlName>.html
node deck.mjs check    ../Outputs/<course>/<session>        # the rule checks on the built HTML (check-deck.mjs)
node deck.mjs perf     ../Outputs/<course>/<session>        # slow PCs and Firefox (perf-check, pristine-check, firefox-check)
```

## The procedure (same as before for the user: they give the input paths)

1. Read the inputs the user points to (TR doc, spec, review file). Plan at `session_plans/<session>/plan.md`,
   sign-off gate unchanged (`.claude/skills/generate-slides/SKILL.md` §0).
2. `new`, then write `deck.json`: one entry per slide. Pick the layout (below), write the strings as they must
   appear (R8 capitals), pick icons by name, describe figures as data. Most figures are `diagram` specs.
3. Only a slide whose picture cannot be a diagram (an analogy scene, a bespoke drawing) gets a `custom` figure in
   `custom/index.tsx`. Budget the effort there.
4. `build`, then `check`, then `perf`. Look at the slides (screenshots of `?still#/N` from the built file). Fix the
   data, rebuild. A deck is not done with a `perf` FAIL standing (see "Low-end PCs" below).
5. Review feedback becomes, in this order: a data edit (one slide), or an engine fix (a part or layout, so every
   deck gets it), or a new check in `check-deck.mjs`; then a row in `RULES-REGISTER.md`. Never a per-deck patch of
   engine code.

## Layouts (`layout` in a slide)

| layout | for | key fields |
|---|---|---|
| `brand`, `title`, `recap`, `agenda` | the opening (R9: brand then title, always) | from `meta` |
| `breaker` | a section divider (`lab: true` for the practical divider) | `index` |
| `points` | points left, figure right (the main slide) | `points[{text, icon, at}]`, `figure`, `lead`, `note` (a TR "Note" line under both); points sharing one `at` light together (a TR point split at a clause boundary) |
| `lead` | a description above a centred figure | `lead`, `figure` |
| `table` | a table (VisualTable: icons, row build, `highlight` only for meaning) | `table` (`ringCol` rings a column the TR asks to circle; `logo: true` draws `img:` brand icons in a larger white tile; a cell may be `{text, icons, tone}`: official marks before the words, and an owner tint `customer` / `provider` / `shared`, Session 12), `note` |
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
Shared motion tokens (2026-11-06): `src/motion/tokens.ts` (`MOTION.ease / reveal / ring / build / flow`,
`motionHeld(instant)`); a session's custom figures take their timings from it, and a flow dot on an arrow is the
scene kit's `Traveller` gated by `motionHeld`. Decorative idle motion stays off (`figures/motion.ts` policy).

## 3D scenes and people (user, 2026-11-10, Session 9; generate-slides standing corrections 13-14)
Real-time 3D figures import `@/engine/three-stage`: `ThreeStage` (`setup(kit)` returns `update(t, step)`; a live
scene draws straight into a WebGL context of its own, a held frame at `holdT` on `?still`/thumbnails goes through one
shared renderer; since 2026-11-13, see "Low-end PCs"), `mat`, `mesh`, `lightRig`, and `castSprite` / `castClip` /
`CAST_IDLE` / `CAST_PRESETS` for Character Lab people inside the scene. `castSprite` takes `dress` (role clothing),
`wide` (a reach past the rig's box), `shadow` (the floor shadow's opacity, or `false`) and `adaptive` (frames built
at the size the person is drawn at on this screen, Session 9's rule); `ThreeStage` takes `sizing="screen"` for a
canvas at the screen's real pixels and no more (Session 9), the default being 2x supersampling. USE THEM, never a
copy of the sprite or the stage in `custom/`. Never create a renderer in a figure. Analogy loops restart within 0.3 s and run at 60 fps in headed Chrome (headless without the Vulkan flags is
SwiftShader: low fps there is not a defect). Worked examples: `Outputs/cloudcomputing/elastic_compute_instances/custom/h.tsx` (car, cabinets),
`i.tsx` (exam hall, 13 characters), `i2.tsx` (bakery), `k.tsx` (rental desk, builder), `c.tsx` (3D icons, slider).
This supersedes the clay look below for analogy scenes.

## Low-end PCs (user, 2026-11-13: "runs fine on high-end PCs but lags and has rendering issues on low-end ones")
Every deck built here has to run on a classroom PC, with nothing dropped to get there: same pixels, same animations.
What the engine does about it, so a deck gets it by being built:
- **3D scenes** (`three-stage.tsx`): a live scene presents from its own context instead of being copied onto a 2D
  canvas every frame (that copy parked the main thread on the GPU); a scene is built in the frames AFTER its slide
  appears, one scene a frame, with its shaders compiled off the main thread; Character Lab frames are built by one
  queue, soonest-shown first, a share of each animation frame, cancelled when the slide leaves, each one uploaded and
  its canvas and image released at once. Measured on Cloud Provider Comparison at a 4x CPU slowdown with a GPU: the
  three 3D slides went from 14, 13, 16 to 59, 82, 91 of 150 frames in the 2.5 s after the press (worst frame 550 ms
  to 200 ms), and the slides AFTER one from 12-23 frames to 144-149; one 3D slide held 870 MB in the page, now 525.
- **The file** (`scripts/`, `vite.singlefile.config.ts`, `pristine.ts`): the script is ASCII (one non-Latin-1
  character made the browser keep all 8 MB of it two bytes a character); `prune-icons.mjs` leaves out the library
  icons the script never names (every deck carried all 43, 2.8 MB) by bundling a second time with those imports
  empty, NEVER by editing the built file (its first version matched by content and blanked a session picture that
  was a copy of an icon); an image named more than once is embedded once; the page's own source is no longer
  serialised at every open; the font sheet comes from the engine's own copy (`fonts/google-<hash>.css`, the sheet
  every deck of the course ships) instead of from Google at every build, because one build in twenty got an answer
  the inlining did not recognise and was left needing the network for its body font (`perf` fails such a file). 9.31 MB to 7.08 MB for that deck, first paint 1070 ms to 750 ms at 4x, same pictures.
- **The entrance** (`figures/entrance.ts`): every style read, then every write.

The four decks rebuilt that day, `perf-check` on the old build and on the new, back to back (4x CPU, GPU), as the
figures a new deck should sit near: frames drawn in the 2.5 s after the press, of 150.

| deck | file | first paint | 3D slides, frames | 3D worst frame | other slides, frames | FAIL |
|---|---|---|---|---|---|---|
| 9 Elastic Compute | 12.29 to 10.24 MB | 1268 to 908 ms | 109 to 126 | 1283 to 250 ms | 150 to 151 | 7 to 0 |
| 10 Serverless | 11.67 to 9.64 MB | 1144 to 884 ms | 101 to 123 | 700 to 167 ms | 145 to 151 | 5 to 0 |
| 11 Provider Comparison | 9.31 to 7.08 MB | 992 to 732 ms | 24 to 111 | 417 to 150 ms | 136 to 150 | 7 to 0 |
| 12 Security | 9.40 to 7.22 MB | 1020 to 724 ms | 20 to 103 | 5800 to 167 ms | 139 to 150 | 8 to 0 |

In Firefox with everything on two efficiency cores (no throttle to ask for), a press onto a 3D slide took up to 9 s
in the old builds and at most 0.7 s in the new, and those slides drew 18 to 34 frames in the 2.5 s after, now 36 to 47.

What a session's `custom/` owes it (the engine cannot do these for you, and `perf` checks them):
- People in a 3D scene come from `castSprite`. Sessions 9-12 each carried a copy (`rigSprite`; Session 9 a copy of
  the whole stage) that rendered every frame back to back at mount and went on after the slide had gone: with the
  copy a deck gets none of the gain above. All four were moved onto the engine's on 2026-11-13, each `rigSprite`
  now one line (`return castSprite({ ...o, px: o.px ?? 320 })`); what they replaced is in
  `Outputs/cloudcomputing/workflow/archive/low-end-pass-2026-11-13/`.
- **LOOPS run on the compositor**: animate `transform` and `opacity` only, on an HTML element or a root `<svg>`.
  A CSS animation on an element INSIDE an svg (a `<g>`, a `<circle>`, a `<path>`), or on any other property
  (`stroke-dashoffset`, `background-position`, `width`), makes the browser redo style, layout and paint on the main
  thread sixty times a second for as long as the slide is up: one LED blinking inside an icon costs 5-9% of a fast
  core, half of a slow one. Put the moving part in its own small `<svg>` or `<span>` laid over the picture and
  animate that element. (The engine's own flow dashes, `mo-dash`, are such a loop: one per arrow, known, kept.)
- A library icon asked for by a name the code ASSEMBLES (`'routing-' + who`) is kept only if the prefix is a literal
  string somewhere in the script; `check` fails on an image with nothing in it (`images load`), which is what
  caught the pruning mistake above. `DECK_KEEP_ICONS=1` keeps them all.
- Proving "it looks the same" after an engine change: `?still` screenshots of every slide, old build against new,
  compared as RGB (an RGBA difference has no alpha, and Pillow's `getbbox` then reports "identical" for anything);
  and for motion, the animations each slide ASKS for (every `element.animate` call, every CSS animation, every
  character frame picture), reached by pressing next. Screenshots of a running animation do not repeat even for one
  build. Always run the same build twice first: a comparison that cannot say "different" proves nothing.
  A held frame is reached TWO ways, and both are compared, at a size the deck zooms at (1920x1080): by a press in a
  deck that is already open, and by opening the page on that slide. A stage measures itself before the deck's zoom
  in the second and after it in the first, and Session 9's `sizing="screen"` stage keeps that first size for a held
  frame: measured one frame late, one picture of a pair was drawn at 705 px and the other at 470 (found only because
  a tool loaded each slide by its own URL). Two walks of one build also differ in the ORDER of same-delay entrance
  calls, which follows whether an icon had loaded when the slide mounted: compare those as sets.

`node deck.mjs perf <folder>` runs three checks, all of them whatever the first says. `perf-check.mjs` opens the
built file as a presenter does, slows the main thread 4x, walks every slide
and prints load, the frames each arrival drew, the worst frame, the share of a core each slide costs by sitting
there, and the loops on it that cannot be composited. FAIL: a frame over 500 ms, under 50 of 150 frames, an idle
slide over 20% of a core (45% with a 3D scene), the deck mounting after 4 s, a sprite copy or a renderer in
`custom/`. WARN at half of each. `--quick` skips the idle pass; `--table` prints every slide; `?gl=own|bitmap|copy`
on the deck's URL forces one 3D present path for a comparison. Without a GPU behind the browser a 3D scene draws at
three or four frames a second whatever is done short of a smaller picture: `perf` reports it and does not judge it.
`pristine-check.mjs` proves the page the Download button writes is the page that was built.

**The other browser** (user, 2026-11-13: the decks "need to work on low end pc and browsers"). Brave, Chrome and
Edge are one engine, and every other check here runs in it. `firefox-check.mjs` opens the same file in the Firefox
installed on the machine (through geckodriver, WebDriver over plain HTTP, no dependency), presses the right arrow
through every slide and FAILS on: a deck that does not mount, a press that does not arrive, an uncaught error or a
`console.error`, an embedded font Firefox did not load, an image it could not show, a 3D canvas with no picture ten
seconds after its slide arrived. It SKIPS, and says so, on a machine with no geckodriver, and when Firefox cannot
read the file (the snap reads only the home folder). `--no-webgl` runs it with WebGL off: what a PC whose graphics
driver the browser refuses gets, which is every 3D box empty and the rest of the deck working. It does not time
anything (Firefox has no CPU throttle to ask for). Safari is not checked anywhere: nothing on a Linux machine runs it.

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
