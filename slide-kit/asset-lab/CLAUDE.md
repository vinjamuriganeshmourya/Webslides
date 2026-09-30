<!-- cSpell:ignore NxtWave undraw -->
# Asset lab

Five slides showing how the 3D icon and character set in `slide-kit/assets/spot`
and `slide-kit/assets/cast` is used. **Not a session, and not a variant lab.**

The other labs in this folder render one fixture through several designs to pick
a winner. This one renders one piece of teaching content at the **five scales the
artwork gets used at**, which is the thing that actually has to be judged about a
raster asset set. There is no winner to pick; there is a set of rules to check.

```
1  a cast figure at 260px, beside a text column
2  spot icons at 92px, as the mark on a card
3  one spot icon at a 300px box, carrying the frame on its own
4  spot icons at 78px, as the nodes of a sequence
5  spot icons at 56px, as bullet markers, with a cast figure beside them
```

## Where the assets came from

`assets/` at the repo root, the Figma export drop folder. 302 PNGs arrived, all
302 were looked at, 21 were promoted. `assets/TAGS.md` is the tag table and
records what the other 281 are.

**The licence is not established.** 48 of the source files are named `ChatGPT
Image <date>.png`, so part of the set is generated art rather than licensed
stock, and nothing in it carries a provenance beyond the Figma page. The 21 are
cleared for internal decks and for this lab. Nothing goes into a deck that leaves
NxtWave until somebody has settled where the artwork came from.

## The content is real, and that is not a detail

"Reading an error message" is something the Python course teaches, and every
claim on these five slides is one that would be defended.

Placeholder copy was the obvious shortcut and it is the wrong one here. Hard
content rule 8 says an illustration depicts the **slide's own concept** rather
than the topic, and that rule cannot be tested against lorem ipsum: any icon
"fits" a slide that says nothing. With real claims it can be tested, and the test
is the point of the sample. Every icon on these slides is checked against its
`means` list in `src/ui/spot/spotAssets.ts`.

## The registry is the argument; the deck is the evidence

`src/ui/spot/spotAssets.ts` carries a row per asset: what is **literally drawn**
(written while looking at the render, not read off the filename), the concepts it
**may honestly stand for**, its **palette**, and its **export size**.

A path in the JSX skips all four, which is how this went wrong the first time
round. The names cannot be trusted: `Files.png` is a folder with a magnifier over
it, `Coding.png` is a dark editor window with no person in it, and 129 of the 302
exports carry a machine name like `unnamed - 2026-03-13T161432.317 1.png` that
says nothing at all.

**`SpotIcon` and `Cast` take a NAME, never a path**, so every use goes past that
row.

## The four rules the render taught

Each of these was discovered by building the slide, looking at it, and finding it
wrong. None of them is in a style guide and none is caught by a harness.

**1. A mixed-aspect raster set has to be BOXED, not sized.** This is the big one.
The assets run from 146x236 to 386x353. Size four of them to the same WIDTH and
they come out at four different heights, and whatever follows, a card title or a
step label, lands at four different y positions. Slide 4 shipped that way on the
first render with `Run` sitting 19px above `Read`, and slide 2's four card titles
were doing the same thing more subtly. `SpotIcon` now fits every icon into a
square box with `object-contain`, so the box is what the layout measures. **Line
icon sets never have this problem**, because they all come off one 24px grid,
which is why it is the first thing to go wrong when raster art replaces one.

**2. There is no tinted well behind a 3D icon.** The kit's `GlyphWell` puts a
line icon on an 8% tint, and it is right for a line icon: a 2px stroke with
nothing behind it floats. These do not float. They are modelled objects with
their own highlight and their own soft shadow, and a tinted square behind one is
a box inside a box. `ground="glow"` is the alternative: a soft radial wash, no
edge, 1.4x the box, so a dark object sits in something rather than on it. It must
not become a well.

**3. Nothing goes behind a cast figure, and cast goes on light grounds only.**
Both are the kit's own findings, from `QuizTimeSlide`: it removed a pale blue
disc from behind its character because the disc read as a plate the illustration
had been dropped onto, and it sits on `light` rather than the navy stage because
the character is drawn in brand blue and sinks into a blue field. Same artwork
family, same answers.

**4. There is no asset here big enough to be a full-frame figure.** The largest
promoted file is `tools-wrench-driver` at 386px, a third of the content well.
Past its long side an icon is being enlarged, and the gloss and the shadow are
the first things to go. `SpotIcon` and `Cast` both clamp and log. If a deck wants
a hero-scale figure it gets **re-exported from Figma larger**; no amount of CSS
fixes it.

## One icon means one thing, so reuse is correct and variety is not a goal

`code-window` is the mark on slide 2's third card and the whole figure on slide
3, and it is the same file both times on purpose. A deck that reaches for a
different picture of code each time it mentions code has taught the room that the
pictures mean nothing.

The temptation is strongest in a sample like this one, where showing range looks
like the job. It is not the job.

## `SpotCard` is a duplicate and it should not survive

`SpotCards` repeats `Card`'s surface exactly (`rounded-card border border-line
bg-white p-6 shadow-card-soft`) and nothing else about it, because `Card` in
`@/ui/content` takes `icon?: IconName`, a key into the kit's line-icon registry,
so it cannot hold a raster asset at all.

**If this material is adopted, the fix is to widen `Card`'s `icon` prop to
`IconName | ReactNode` in the kit and delete `SpotCard`**, not to keep a second
card component in a second module. Two cards that look identical and take
different props is how padding starts drifting, which is the lesson every lab in
this folder has already paid for. The change is backward-compatible: every
existing call passes a string, and a string is still a valid `IconName`.

## Nothing is a build step

Every slide arrives complete. `CardGrid` in the kit wraps its children in `Step`,
which gates each card on a press, and that is right for a list of claims the
presenter talks through one at a time. Each of these three figures is ONE idea
with an internal structure, and hard content rule 6 wants a slide's text and its
supporting visual to arrive together. The stagger is reading order, not sequence.

## Verifying a change

```bash
npx vite --port 5232 --strictPort      # the kit's vite.config hardcodes 5173
node qa.mjs          # must print ALL 5 CLEAN
node video-safe.mjs  # must print CLEAN
node align-check.mjs # must print 0 of 5
```

All three are clean as it stands, and this deck has no benign exceptions: it
carries no welcome frame and no thank-you frame, which are the two the kit's
baseline expects to be flagged.

**The harnesses cannot see any of the four rules above.** They measure DOM
rectangles: off the frame, inside the video rectangle, off the datum, missing the
mark. An icon squashed out of its aspect ratio, a figure sunk into a navy ground,
a label row 19px out of alignment and an upscaled PNG are all legal, tidy and
wrong. **Look at the screenshots in `workflow/qa-shots/`.** That is content rule
10, and this deck is the case that proves it: every one of the four was found by
looking, and none of the three harnesses ever complained.

## If this is adopted

1. Move `src/ui/spot/` into `slide-kit/slide-template/src/ui/spot/` and export it
   from `src/ui/index.ts`.
2. Widen `Card`'s `icon` prop as above and delete `SpotCard`.
3. Copy `slide-kit/assets/spot` and `.../cast` into each session's own
   `public/assets/` as needed. A deck cannot read from the library at runtime.
4. Register the figures in `slide-kit/slide-types/README.md`, with what each is
   worst at.
5. Settle the licence before any of it reaches a deck that leaves NxtWave.
6. Raise it as a PR: `sync-kit.mjs --apply` pushes kit changes into signed-off
   sessions.
