<!-- cSpell:ignore NxtWave deployement nodejs vitejs vscode -->
# The central asset library

**Every image any deck uses lives here first.** Fetch once, reuse everywhere.

Before this existed, each session kept its own `public/assets/`, and they
drifted: the kit held SVGs while its own components asked for PNGs that were
never there, session 3 had ten PNGs, session 2 had none. Four figures in the
base template rendered as broken images for anyone starting a new deck.

---

<!-- 2026-10-23, Deployment & Service Models: `companies/aws.png` (the square aws mark, 512px), `companies/azure.png` (800x232) and `companies/google-cloud.png` (800x124), the vendors' own marks as embedded in the session's reference deck, for content rule 12 on the multi-cloud and provider slides. -->

## What is here

```
tech/           technology logos — PNG, with the older SVGs kept alongside
companies/      company brand marks — PNG, single-colour brand glyphs
quiz/           quiz-slide decorations (brain, bulb, bubble, mark)
brand/          logo-nxtwave.png · feedback-qr.png (the feedback form's QR code,
                as supplied; content rule 41 puts it on every deck's feedback slide)
illustrations/  third-party scene illustrations for section dividers — SVG
illustrations/<course>/<n>_<session>/
                stock illustrations lifted out of a course's source PPTX, named by
                what they draw; `common/` for the ones every deck of that course shares
spot/           3D modelled object icons — PNG cutouts
cast/           3D people, cut out — PNG cutouts
```

Current `tech/` set, tooling and frameworks: `container-white` · `django` ·
`docker` · `docker-white` · `git` · `github` · `jenkins` · `linux` · `macos` ·
`makefile` · `nodejs` · `npm` · `react` · `sqlite` · `vitejs` · `vscode` ·
`windows`.

`github` and `jenkins` were added for Deployment session 7, from devicon at
512px. `git` and `github` are different marks and both are needed: session 7
names the tool and the service on the same slide.

Current `tech/` set, languages: `c` · `cplusplus` · `csharp` · `dart` · `go` ·
`java` · `javascript` · `kotlin` · `python` · `r` · `ruby` · `scala` · `swift`.
The twelve besides `python` were added for the Python course's "around 700
languages" logo wall, fetched from devicon and rendered to PNG at 512px.

PNG for all of them; `.svg` also present for the nine that predate the PNG
convention.

`chatgpt`, `claude`, `gemini` and `meta-ai` were added for Python session 2's AI
tools slide. `claude` and `gemini` are 512px renders of the simple-icons marks;
`chatgpt` and `meta-ai` are crops out of the source PPTX at 91 and 122px and
should be replaced with proper renders when a source is found.

`companies/`: `amazon` · `dropbox` · `google` · `instagram` · `meta` ·
`microsoft` · `mozilla` · `netflix` · `nvidia` · `oracle` · `paypal` · `quora` ·
`reddit` · `spotify` · `uber` · `flipkart` (a 65px crop from the Python source
PPTX, to be replaced with a proper mark).

A company is not a technology, so its mark does not belong in `tech/`. These are
single-colour brand glyphs, which is deliberate: a wall of fifteen marks reads as
one system only if they share a treatment, and the mixed wordmarks-and-glyphs
wall the Python source deck used looked assembled from screenshots.

**Two of these replace marks that are retired.** The source PPTX still showed
the pre-2021 Facebook mark and Uber's retired "bit" square. `meta.png` and
`uber.png` are the current ones. When a company rebrands, replace the file under
its existing name rather than adding a suffix, so every deck picks the new mark
up on its next copy.

`illustrations/` holds **unDraw** scenes (unDraw open licence: free for any use,
no attribution required), added for the OOPs Theory course's section dividers.
Each one is kept twice, `undraw-<slug>.svg` as fetched and `divider-<slug>.svg`
as the deck uses it, because the deck's dividers stand on the night stage and
unDraw draws dark line art assuming a light ground. `illustrations/README.md`
records the licence, both changes made to every file, which divider each one
serves, and the six candidates that were fetched, looked at and rejected.

Current set: `bookshelves` · `my-location` · `setup` · `switches` · `tasks`.

`spot/` and `cast/` are the 3D set, added 2026-09-22 from the Figma drop in
`assets/` at the repo root. `spot/` is modelled objects, `cast/` is people, and
they are the SAME render, which is the only reason they can share a slide.

`spot/`: `alert-triangle-amber` · `alert-triangle-red` · `bug-magnifier` ·
`bug-on-screen` · `clock` · `code-window` · `file-stack` · `folder-open` ·
`folder-search` · `hourglass` · `keyboard-hands` · `target-arrow` ·
`tools-wrench-driver`.

`cast/`: `books-daydreaming` · `desk-thinking` · `hoodie-thinking` ·
`laptop-cheering` · `laptop-many-questions` · `shrug-unsure` ·
`student-cheering` · `teacher-books`.

**Their licence is not established, and that is recorded rather than assumed.**
48 files in the source drop are named `ChatGPT Image <date>.png`, so part of that
set is generated art rather than licensed stock, and nothing in it carries a
provenance beyond the Figma page. **These 21 are cleared for internal decks.
Nothing here goes into a deck that leaves NxtWave until somebody has settled
where the artwork came from.** `assets/TAGS.md` at the repo root has the full
tag table, what the other 281 exports are, and why none of the ~20 brand logos in
that drop was promoted.

Three rules came off the first render and are worth knowing before using either
folder:

- **`cast/` goes on light grounds only.** The figures are drawn in the deck's own
  brand blue, so on the navy stage the clothing sinks and the figure reads as a
  silhouette. `QuizTimeSlide` is on `light` for the same reason and says so.
- **Nothing goes behind a `cast/` figure.** No disc, no plate, no shadow ellipse.
  Each is a cutout carrying its own soft shadow, and `QuizTimeSlide` removed
  exactly such a disc because it read as a plate the art had been dropped onto.
- **A `spot/` icon is fitted into a SQUARE BOX, never sized by width.** These run
  from 146x236 to 386x353, so four sized to one width come out at four different
  heights and their labels land at four different y positions. See `SpotIcon` in
  `slide-kit/asset-lab`, which is the working reference for all three rules.

A scene illustration is not a logo and not a character. `tech/` is marks,
`src/ui/characters/` is Nova and the in-repo vector scenes, and this folder is
third-party art with a licence to record.

---

## How a deck uses it

A deck cannot read from here at runtime. Vite serves from the project's own
`public/`, and the single-file build inlines from there, so the deck needs its
own copy:

```bash
# from inside your session project
cp ../../slide-kit/assets/tech/django.png public/assets/tech/
```

Reference it as `/assets/tech/django.png`.

The library is the **source**; `public/assets/` is a working copy. They are
byte-identical, which is checkable:

```bash
md5sum slide-kit/assets/tech/django.png <session>/public/assets/tech/django.png
```

---

## Adding an asset

1. **Look here first.** If the logo is already in `tech/`, copy it. Do not
   fetch it again, and never fetch a second variant of a logo that is already
   here under a different crop or palette.
2. If it is genuinely new, fetch it **into this library**, not into a session.
   PNG, transparent background, and large enough for a 1280×720 frame.
3. Name it after the technology, lowercase, no version: `postgres.png`, not
   `PostgreSQL-16-logo.png`. A light-on-dark variant takes the `-white` suffix,
   matching `docker-white.png`.
4. Copy it into whichever session needs it.
5. If several decks will want it, that is the normal case and the reason this
   folder exists. Say so when you add it.

---

## Why the library is not synced automatically

`sync-kit.mjs` does not copy `public/assets`, and that is deliberate: a
signed-off deck's rendered output must not change because someone added a logo
to the kit. Copying is a decision you make per session, the same way kit code
updates are.

The cost is that a session can fall behind. If a figure renders as a broken
image, the fix is almost always a file that exists here and was never copied
across.
