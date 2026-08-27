<!-- cSpell:ignore NxtWave devPort prnt PayScale Highcharts strictPort -->
# Programming with Python · session notes

Python Programming, session 1. Converted from
`Python_PPT_slide/1_Programming with Python.pptx` (42 source slides) to a
48-slide deck, from the plan at
`../session_plans/programming_with_python/plan.md` (signed off 2026-08-26).

This file holds the decisions specific to THIS deck. The repo-wide rules are in
`../../RULES.md`; the kit rules are in `KIT.md`, which arrived with the scaffold
and still describes the base template, not this session.

---

## Decisions made while generating, and why

### 1. Every output was produced by running the snippet

CPython 3.12, before the deck file was written. That includes the four
tracebacks in concept 3 verbatim, `Did you mean: 'print'?` included, which is a
3.11-and-later suffix. **If you change a snippet, run it again and paste what
came out.** Thirteen slides in this deck are nothing but program output, so
composing one is the easiest way to ship a lie here.

```bash
python3 -c 'print(6 / 3)'      # 2.0, and the slide says 2.0
```

### 2. No `Content*ImageSlide` in this deck, on purpose

Those four types render `media` **and** `children`. Every figure here (the two
logo walls, `CodeOutput`, `InstructionFlow`, the two captures) is the media, so
passing both put two figures on one slide. The first pass did exactly that and
padded the `media` prop with illustration names that do not exist in
`IllustrationName`. Every one of those slides is now a `ContentSlide`, which
places `points` and `children` side by side at `1.4fr / 1fr` when both are
given, and centres a lone child.

### 3. Asset paths are literal strings, never built

`scripts/inline-assets.mjs` finds assets by scanning the bundle for the path
text. A path assembled at runtime is not in the bundle, so it cannot be found.

The first pass used two one-line helpers:

```tsx
const TECH = (name: string) => `/assets/tech/${name}.png`   // DO NOT
```

`npm run build:html` reported **`Inlined 10/10 assets`** and the deliverable
would have opened with all twenty-nine logos broken. With literal paths it
reports **`Inlined 35/35`**. That count is the check: if it drops, a path got
interpolated again.

### 4. The dev port in `deck.config.json` is not the port vite uses

`devPort` is `5221` and every harness reads it. `vite.config.ts` is a KIT file
and hardcodes `server.port: 5173`, so `npm run dev` does **not** land on 5221
and the sweeps then measure nothing. Start the server explicitly:

```bash
npx vite --port 5221 --strictPort
```

This is a kit inconsistency, not a session one: session 4 has the same split
(`devPort` 5215, vite on 5173). Worth fixing in the kit by reading
`deck.config.json` in `vite.config.ts`, which is a kit PR and was left alone
here.

### 5. `print` needed no kit change

The plan expected `CodeBlock`'s keyword set to need `print` added. It does not:
the tokenizer already colours any identifier followed by `(` as a call, so
`print` lands in the function colour on its own. Checked before editing.

### 6. Two slides carry a known gap

| Slide | Gap |
|---|---|
| `salaries` | No figures. The source's PayScale numbers live inside chart images that cannot be read back, and a plausible-looking salary is composed content. The lead credits PayScale and states the claim qualitatively. Numbers go here when someone supplies them |
| `code-playground` | The capture's own snippet is `print("Become the programmer you're meant to be!")`, not this session's program. The caption says so. Recapturing it against the real playground running `print("Hello World!")` is the honest fix |

### 7. Three things the screenshots caught that no harness did

Content rule 17 earned its place three times on this deck. All three were
invisible to `qa`, `video-safe` and `align-check`, because all three measure DOM
rectangles and none of them can see inside a figure.

| What was wrong | How it looked | Why no harness saw it |
|---|---|---|
| `RadialSpread`'s arc was too wide | "Backend Development" cut in half at the bottom of the frame | Every label is a DOM rect inside the frame; it is the LAST one that is not, and the figure box itself was in bounds |
| `RadialSpread`'s arrowheads vanished | five arrowheads stacked at the origin, invisible behind the hub | framer-motion writes an inline `transform` each frame, which overrode the `<path>`'s own `transform` attribute. Positioning now lives on a static `<g>`. `KIT.md` §6 warns about the identical failure with `-translate-x-1/2` |
| the agenda's first item | 42px inside the instructor-video rectangle | `video-safe` DID catch this one. It is here because the fix was in `AgendaSlide`'s geometry, not in the deck. See decision 8 |

And one thing a screenshot made me call wrong: the `^^^^` line of a traceback
looked clipped at 1x. Measured at 3x with `scrollHeight === clientHeight`, it
renders whole. A caret is a few pixels tall at 15px, and that is all it was.
Check before fixing.

### 8. `AgendaSlide`'s `Y_TOP` was a kit bug, fixed here

Its own comment claimed "the first item starts below y=230 so that nothing lands
in the rectangle". It did not: the item text is positioned `top: y` with
`y: '-50%'`, so it is CENTRED on `Y_TOP`, and with the `sub` every real deck
passes, the block's top edge landed at y=204. `video-safe` reported a 42px
intrusion on this deck's agenda, and would on any agenda whose first item is wide
enough to reach x=913.

`Y_TOP` is now 268. **This is a kit file**, so the fix belongs in
`slide-kit/slide-template` and a PR, and it affects every session's agenda by
about 24px. Not yet propagated.

Also: `AgendaSlide` destructures only `kicker`, `title`, `items` and `lesson`, so
the `lead` on `AgendaSlideProps` is **silently dropped**. Do not reach for it as
the video-rectangle lever on this slide type.

### 9. No next-session frame

`NEXT_UP` was not named at sign-off, so the deck ends `quiz → takeaways → thank
you`. Add the next-session slide before `thank-you` once the following session
has a confirmed name (see rule: `ThankYouSlide` deliberately has no `nextUp`
prop, so the signpost is its own slide).

---

## The six figures this deck added

All three live in `src/ui/` and are exported from the barrel.

| Component | What it is for | Status |
|---|---|---|
| `CodeOutput` | A snippet and what running it printed. One pane side by side, two as columns, `layout="stack"` for wide output. `kind: 'error'` renders a failure | **Kit candidate.** Thirteen slides here, and every language course wants it. The kit had `CodeBlock` (a file) and `Terminal` (a console) and no way to say "and this came out" |
| `RadialSpread` | One thing reaching into many places. A hub, spokes that draw outward, arrowheads that land, labels that follow | **Kit candidate.** Any "it is used everywhere" claim |
| `EditorialList` | A set whose NAMES are the content, set as type with no boxes. `numbered` is OFF by default | **Kit candidate** |
| `SyntaxSpecimens` | The same job written in several languages, one real line each, with a chip naming the rule that is local to that language | **Kit candidate** |
| `LogoWall` | A grid of marks, each with its name. The recognition argument on "700 languages" and "top companies" | **Kit candidate** |
| `InstructionFlow` | Instructions handed to the hardware, with the `Code` label added on the second slide | Stays here. It draws a definition no other session gives |

`FeatureTiles` existed briefly and was deleted. It was a better card grid, and the
answer was that the slide did not want a card grid at all. `STYLE_GUIDE.md` §8
records that.

Per rule 14 the five kit candidates are promoted only once the user approves
them, and that means: into `slide-kit/slide-template/src/ui/`, exported from the barrel,
added to `sampleDeck.tsx` with a `notes` string, a row in
`slide-kit/slide-types/README.md`, and out as a PR on a `kit/` branch, because
`sync-kit.mjs --apply` pushes them into every signed-off session.

Every one of them puts its LABELS in DOM elements, per content rule 17. Where
there is an `<svg>` (`RadialSpread`'s lines and arrowheads) it carries no text at
all: the harnesses measure element rectangles, so labels inside an `<svg>` overlap
and still pass every sweep.

---

## Working on this deck

```bash
npm install                          # node_modules came with the scaffold
npx vite --port 5221 --strictPort    # NOT `npm run dev` — see decision 4
npx tsc -b --noEmit
npm run build:html                   # must say Inlined 35/35

export CHROME_PATH=/opt/google/chrome/chrome
node video-safe.mjs   # must print CLEAN
node qa.mjs           # baseline is TWO flagged slides: brand, and thank you
node align-check.mjs
node preview.mjs && node scripts/build-preview-page.mjs
```

`slideCount` in `deck.config.json` is **48**. Keep it current or every sweep
silently stops early.
