<!-- cSpell:ignore NxtWave undraw -->
# Tags

The table this folder's `README.md` has been waiting for. **302 PNGs were
exported, every one of them was looked at, and 21 were promoted** into
`slide-kit/assets/`. This file records what the other 281 are and why they
stayed here.

Tagged on 2026-09-22 by rendering all 302 into indexed contact sheets and
reading them, which is what the README asks for: *"a tag for visual appearance
has to be made by seeing the artwork, not by reading a layer name."* That
instruction earns its place. **129 of the 302 files carry a machine name** and
say nothing at all about themselves: 52 called `unnamed - 2026-03-13T161432.317
1.png`, 48 called `ChatGPT Image Sep 15, 2026, 01_05_06 PM 13.png`, the rest
`Group-4`, `Vector-2`, `Layer_7`. Of the ones that do have a name, several are
named for the SLIDE somebody used them on rather than for the artwork:
`Files.png` is a folder with a magnifying glass over it, and `Coding.png` is a
dark editor window with no person in it at all.

---

## The licence is not established, and that is the blocking issue

`slide-kit/assets/README.md` requires a licence per asset, and
`illustrations/README.md` records one for every unDraw file it holds. **Nothing
in this drop has one.**

48 of the files are literally named `ChatGPT Image <date>.png`, so at least part
of the set is generated art rather than licensed stock. The rest has no
provenance recorded anywhere beyond the Figma page it came from.

**The 21 promoted files are cleared for internal decks and for `asset-lab`.
Nothing here should go into a deck that leaves NxtWave until somebody has settled
where the artwork came from.** That is written down rather than assumed, because
the cost of finding out later is every deck that used it.

---

## Three style families, and mixing them is the mistake this set invites

The 302 are not one set. They are three, and a slide carrying two of them is the
most visible thing that can go wrong with this material.

| Family | Roughly | What it looks like | Verdict |
|---|---|---|---|
| **3D glossy** | ~180 | Modelled objects, high gloss, soft drop shadow, brand blue with amber and one red. Cutouts on transparency | **Use.** It matches the deck: `#2D63FB` against `bg-brand-soft` with no adjustment |
| **3D cast** | ~60 | The same render applied to people. Bust, seated or full-body cutouts | **Use.** Same family, so a spot icon and a figure sit on one slide without clashing |
| **Flat vector** | ~40 | Thin, muted, a different palette, no shadow at all | **Do not use with the above.** On their own they are fine; beside a glossy 3D icon they read as a placeholder somebody forgot to replace |

Counts are read off the contact sheets and are approximate. The boundary between
the first two is exact (people or not); the boundary with the third is obvious
on sight.

Plus two categories that are not assets:

- **Third-party brand logos**, about 20. Eight are named (`OpenAI`, `Gemini`,
  `Gmail`, `Instagram`, `LinkedIn`, `Telegram`, `X`, `YouTube`) and roughly a
  dozen more sit unnamed in the `unnamed - 2026-03-16…` block, including
  Facebook and Google Sheets. **These are hard content rule 12's business and
  none of them should be promoted from here.** A logo has to be the vendor's own
  official file, and `slide-kit/assets/companies/` already holds fifteen fetched
  that way. A re-drawn or re-exported mark is the wrong mark.
- **Figma artboard furniture**, about 12. Swatch labels that render as the words
  `Primary Fill Colors`, `Human Illustration Skin Colors` and `Only for focal
  points`; two contact sheets of other icons; single arrowheads; a 1px rule; and
  three files whose visible content is one 8px dot.

**Three files have a baked opaque background** rather than transparency and will
draw a white rectangle on the slide ground: `Loading/Loading Spinner.png`,
`Teamwork/Ideation.png` and `idea bulb.png`. Everything else tested clean at all
four corners.

---

## Promoted: `slide-kit/assets/spot`

Modelled objects. `means` is the list of concepts the asset may honestly stand
for under hard content rule 8; anything not on the list is a use somebody has to
argue for.

| File | What is drawn | May mean | Palette | Export |
|---|---|---|---|---|
| `alert-triangle-red` | Rounded red triangle, white exclamation mark | an error · something that has already failed · a rule that must not be broken | **danger** | 268x228 |
| `alert-triangle-amber` | Rounded amber triangle, navy mark, dark outline | a warning · a trap worth naming before it is hit | amber | 285x231 |
| `file-stack` | Three overlapping blue document sheets | files · more than one document · a source file named somewhere | brand | 271x193 |
| `folder-open` | Open amber folder, one white sheet inside | a folder · where a file lives · opening something to look inside | amber | 274x185 |
| `folder-search` | Amber folder spilling a document, a picture and a video tile, with a magnifier | looking for a file · searching through what is there | mixed | 365x326 |
| `code-window` | Dark editor window, three traffic lights, large angle-bracket mark | source code · the editor · a line in a file | mixed | 380x352 |
| `bug-magnifier` | Magnifying glass over a red and navy beetle | finding a fault · debugging · looking for the cause | mixed | 253x232 |
| `bug-on-screen` | Monitor with a tick and a cross, a magnifier and a beetle | a fault found in a running program · testing | mixed | 226x151 |
| `tools-wrench-driver` | Crossed steel wrench and blue screwdriver | fixing something · making a change · tooling | brand | 386x353 |
| `keyboard-hands` | Two hands on a blue keyboard, one finger on the space bar | typing a command · running something again · the learner doing it themselves | brand | 270x185 |
| `target-arrow` | Blue and white dartboard on a stand, one arrow in the centre | the goal · getting it right · what to aim for | brand | 217x219 |
| `clock` | Navy-rimmed wall clock, amber second hand | how long something takes · a point in time | mixed | 235x231 |
| `hourglass` | Blue-framed hourglass, amber sand running | waiting · something that takes time to finish | amber | 146x236 |

**`alert-triangle-red` is the only `danger` asset in the set and it is the one to
watch.** Red beside an ordinary claim tells the room something is wrong when
nothing is. `asset-lab` uses it twice and both times the thing it labels
genuinely is a failure.

## Promoted: `slide-kit/assets/cast`

People, cut out, nothing behind them. `crop` decides how they are sized and where
their weight sits.

| File | What is drawn | Mood | May mean | Crop | Export |
|---|---|---|---|---|---|
| `hoodie-thinking` | Yellow hoodie, hand on chin, three grey question marks | puzzled, not distressed | not knowing what went wrong · a question the room cannot answer yet · being stuck | bust | 265x284 |
| `student-cheering` | Backpack, eyes shut, both fists raised, amber motion marks | delighted | something finally worked · a milestone reached · the end of a session | bust | 384x339 |
| `desk-thinking` | At a desk with a laptop and books, chin on hand, looking away | absorbed | working through something · reading before writing · a pause to think | seated | 421x389 |
| `laptop-many-questions` | Cross-legged with a laptop, six question marks overhead | overwhelmed | too many unknowns at once · not knowing where to start | seated | 332x332 |
| `teacher-books` | Yellow cardigan, holding a stack of blue and white books | welcoming | the material for a session · a topic being introduced | bust | 303x389 |
| `shrug-unsure` | Standing, one palm up, head scratched, two question marks | uncertain | no idea · a question with no obvious answer | full | 169x289 |
| `books-daydreaming` | Leaning on four books, chin on hand, looking off to one side | idle | waiting · reading that has stalled | bust | 253x309 |
| `laptop-cheering` | Cross-legged with a laptop, one fist raised, amber motion marks | triumphant | code that finally ran · a task finished | seated | 320x388 |

**`mood` is load-bearing and it is where this kind of artwork lies most easily.**
A figure that celebrates on the slide where the room is still stuck is the
commonest failure, and it is invisible in review because the slide looks lively.
`asset-lab` puts `hoodie-thinking` on slide 1 and `student-cheering` on slide 5
for exactly that reason, and neither would be honest on the other's slide.

---

## Three rules the render taught, which are not in any style guide

**1. Cast figures go on light grounds only.** They are drawn in the deck's own
brand blue, so on `variant="night"` the clothing sinks into the ground and the
figure reads as a silhouette with a yellow hood. The kit already knew this:
`QuizTimeSlide` is on `light` rather than navy and its own note says why.

**2. Nothing goes behind a cast figure.** No disc, no plate, no shadow ellipse.
Every one is a cutout carrying its own soft shadow, and `QuizTimeSlide` removed
exactly such a disc because it read as a plate the illustration had been dropped
onto.

**3. A mixed-aspect raster set has to be BOXED, not sized.** These assets run
from 146x236 to 386x353. Size four of them to the same WIDTH and they come out at
four different heights, and whatever follows them, a card title or a step label,
lands at four different y positions. `asset-lab`'s slide 4 shipped that way on
the first render, with `Run` sitting 19px above `Read`. `SpotIcon` fits every
icon into a square box instead. Line-icon sets never have this problem because
they all come off one 24px grid, so it is the first thing to go wrong when raster
art replaces one.

---

## Promoting another one

1. Look at it. Not at its name.
2. Check it is 3D glossy or 3D cast, not flat vector, and not a logo.
3. Check all four corners are transparent.
4. Copy it into `slide-kit/assets/spot` or `.../cast` under a **kebab-case name
   for what is DRAWN**, never the Figma layer name.
5. Add a row here and a row in `asset-lab/src/ui/spot/spotAssets.ts`, with its
   `drawn`, its `means` and its export size. The registry is what makes the
   ceiling enforceable and the honesty checkable.
6. Copy it into the session's own `public/assets/` as usual. A deck cannot read
   from the library at runtime.

Nothing in this folder should be referenced by a deck. It is staging.
