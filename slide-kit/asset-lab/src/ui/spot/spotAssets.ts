/**
 * THE REGISTRY: every raster asset this deck may draw, and what it actually is.
 *
 * WHY A REGISTRY RATHER THAN A PATH IN THE JSX
 *
 * `<img src="/assets/spot/bug-magnifier.png" width={92} />` works, and it is how
 * this went wrong the first time round. Three things are missing from it, and all
 * three are the reasons the staging folder's README asks for a tag table before
 * anything is used:
 *
 *   1. **What is drawn, as opposed to what it was named.** Half the exports came
 *      out of Figma called `unnamed - 2026-03-13T161432.317 1.png`, and a third
 *      of the rest are named for the SLIDE somebody used them on rather than for
 *      the artwork. `Files.png` is a folder with a magnifier over it;
 *      `Coding.png` is a dark code editor window with no person in it. A name is
 *      not a description, so `drawn` is, and it was written while looking at the
 *      render.
 *   2. **What it may honestly depict.** Hard content rule 8: an illustration
 *      depicts the slide's own concept, not the topic. A magnifier over a bug may
 *      stand for finding a fault; it may not stand for "software", and the
 *      `means` list is what a reviewer checks a slide against.
 *   3. **How big it may be drawn.** These are PNGs. Past their intrinsic width
 *      they go soft, and nothing in the build says so: the deck renders, the
 *      screenshot looks fine at 1280px, and it is mush on a projector. `w` is
 *      here so `SpotIcon` can clamp.
 *
 * WHERE THESE CAME FROM, AND WHAT IS NOT KNOWN ABOUT THEM
 *
 * `assets/` at the repo root, the Figma export drop folder, from the icons and
 * illustrations page `figma.com/design/r9rC1cjmyfA3wmoibDWJkl`. 302 files were
 * exported and looked at; 21 were promoted into `slide-kit/assets/` and are the
 * ones below.
 *
 * **The licence is not established.** A large share of the source files are named
 * `ChatGPT Image <date>.png`, so at least part of the set is generated art rather
 * than licensed stock, and the rest has no licence recorded anywhere. That is
 * written down here rather than assumed, because `slide-kit/assets/README.md`
 * requires a licence per asset and `illustrations/README.md` records one for
 * every unDraw file it holds. **These are cleared for internal decks and for this
 * lab. Nothing here should go into a deck that leaves NxtWave until somebody has
 * settled where the artwork came from.**
 *
 * THE THREE STYLE FAMILIES IN THE DROP FOLDER, AND WHY ONLY ONE IS HERE
 *
 * The 302 exports are not one set. They are three, and mixing them on a slide is
 * the most visible mistake available with this material:
 *
 *   **3D glossy** (used here). Soft-shadowed, high-gloss, brand blue with amber
 *   and one red. Roughly 180 files, and it is the family that matches the deck:
 *   `#2D63FB` blue against the pale `bg-brand-soft` ground with no adjustment.
 *
 *   **3D cast** (used here). The same render, applied to people. Bust, seated or
 *   full-body cutouts on transparency. Same family, so a `spot` icon and a `cast`
 *   figure sit on one slide without clashing.
 *
 *   **Flat vector** (NOT used here). Around 40 files, thin, muted, a different
 *   palette and no shadow at all. On their own they are fine. Beside a glossy 3D
 *   icon they read as a placeholder somebody forgot to replace.
 *
 * Plus two categories that are not assets at all and were left in staging:
 * **third-party brand logos** (about 20, which are hard rule 12's business and
 * belong in `assets/companies/` with their vendor files), and **Figma artboard
 * furniture**: swatch labels reading "Primary Fill Colors", contact sheets of
 * other icons, single arrowheads, and a 1px rule.
 */

export interface SpotAsset {
  /** Path under the deck's own `public/`. */
  src: string
  /** Intrinsic pixel size of the export. See `maxRender` below. */
  w: number
  h: number
  /**
   * WHAT IS LITERALLY DRAWN, written while looking at the render.
   *
   * Not what it means, and not what the file was called. This is the field a
   * reviewer reads when they suspect a slide is using an icon for something it
   * does not show.
   */
  drawn: string
  /**
   * The concepts it may honestly stand for, per hard content rule 8.
   *
   * A short list on purpose. Anything not on it is a use somebody has to argue
   * for, and the argument goes here rather than into the slide.
   */
  means: string[]
  /**
   * The hues in the artwork, because paint is a claim.
   *
   * `danger` is the one that matters: a red icon beside a claim that is merely
   * ordinary tells the room something is wrong when nothing is.
   */
  palette: 'brand' | 'amber' | 'danger' | 'mixed'
}

export interface CastAsset extends SpotAsset {
  /**
   * How much of the figure is drawn, which is what decides how it is sized and
   * where its baseline goes.
   *
   *   `bust`    head and shoulders, cropped at the chest. Sits high, so it is
   *             vertically centred against a text column.
   *   `seated`  cross-legged or at a desk. Has its own visual floor already.
   *   `full`    standing, feet drawn. Needs the most height of the three and
   *             looks wrong cropped.
   */
  crop: 'bust' | 'seated' | 'full'
  /** What the figure is doing, which is the only thing that makes it honest. */
  mood: string
}

/**
 * NO DISC, NO PLATE, NO SHADOW ELLIPSE BEHIND A CAST FIGURE.
 *
 * Every one of these is a cutout that carries its own soft shadow, and the kit
 * has already been here: `QuizTimeSlide` used to draw a pale blue circle behind
 * its character and its own note records why it went, which is that the circle
 * read as a plate the illustration had been dropped onto rather than as part of
 * the composition. Same artwork family, same answer.
 *
 * CAST FIGURES GO ON LIGHT GROUNDS ONLY.
 *
 * Also from `QuizTimeSlide`, which is on `light` rather than the deck's navy for
 * a stated reason: the character is drawn in brand blue, so on a blue field it
 * sinks and reads as a silhouette. Every figure below is drawn in the same blue
 * and yellow. On `variant="night"` the blue clothing disappears and the yellow
 * turns into the only thing on the slide.
 */
export const CAST = {
  'hoodie-thinking': {
    src: '/assets/cast/hoodie-thinking.png',
    w: 265,
    h: 284,
    drawn: 'A person in a yellow hoodie, hand on chin, three grey question marks above them',
    means: ['not knowing what went wrong', 'a question the room cannot answer yet', 'being stuck'],
    palette: 'amber',
    crop: 'bust',
    mood: 'puzzled, not distressed',
  },
  'student-cheering': {
    src: '/assets/cast/student-cheering.png',
    w: 384,
    h: 339,
    drawn: 'A student with a backpack, eyes shut, both fists raised, amber motion marks',
    means: ['something finally worked', 'a milestone reached', 'the end of a session'],
    palette: 'amber',
    crop: 'bust',
    mood: 'delighted',
  },
  'desk-thinking': {
    src: '/assets/cast/desk-thinking.png',
    w: 421,
    h: 389,
    drawn: 'A person at a desk with a laptop and a stack of books, chin on hand, looking away',
    means: ['working through something', 'reading before writing', 'a pause to think'],
    palette: 'amber',
    crop: 'seated',
    mood: 'absorbed',
  },
  'laptop-many-questions': {
    src: '/assets/cast/laptop-many-questions.png',
    w: 332,
    h: 332,
    drawn: 'A person cross-legged with a laptop, six blue and amber question marks overhead',
    means: ['too many unknowns at once', 'not knowing where to start'],
    palette: 'mixed',
    crop: 'seated',
    mood: 'overwhelmed',
  },
  'teacher-books': {
    src: '/assets/cast/teacher-books.png',
    w: 303,
    h: 389,
    drawn: 'A person in a yellow cardigan holding a stack of blue and white books, smiling',
    means: ['the material for a session', 'a topic being introduced'],
    palette: 'amber',
    crop: 'bust',
    mood: 'welcoming',
  },
  'shrug-unsure': {
    src: '/assets/cast/shrug-unsure.png',
    w: 169,
    h: 289,
    drawn: 'A standing figure with one palm up, head scratched, a red and a blue question mark',
    means: ['no idea', 'a question with no obvious answer'],
    palette: 'mixed',
    crop: 'full',
    mood: 'uncertain',
  },
  'books-daydreaming': {
    src: '/assets/cast/books-daydreaming.png',
    w: 253,
    h: 309,
    drawn: 'A person leaning on a stack of four books, chin on hand, looking off to one side',
    means: ['waiting', 'reading that has stalled'],
    palette: 'mixed',
    crop: 'bust',
    mood: 'idle',
  },
  'laptop-cheering': {
    src: '/assets/cast/laptop-cheering.png',
    w: 320,
    h: 388,
    drawn: 'A person cross-legged with a laptop, one fist in the air, amber motion marks',
    means: ['code that finally ran', 'a task finished'],
    palette: 'amber',
    crop: 'seated',
    mood: 'triumphant',
  },
} as const satisfies Record<string, CastAsset>

export const SPOT = {
  'alert-triangle-red': {
    src: '/assets/spot/alert-triangle-red.png',
    w: 268,
    h: 228,
    drawn: 'A rounded red triangle with a white exclamation mark in it',
    means: ['an error', 'something that has already failed', 'a rule that must not be broken'],
    /* The only `danger` asset in the set, and it is the one to be careful with:
       painted beside an ordinary claim it says the claim is a problem. */
    palette: 'danger',
  },
  'alert-triangle-amber': {
    src: '/assets/spot/alert-triangle-amber.png',
    w: 285,
    h: 231,
    drawn: 'A rounded amber triangle with a navy exclamation mark, dark outline',
    means: ['a warning', 'a trap worth naming before it is hit'],
    palette: 'amber',
  },
  'file-stack': {
    src: '/assets/spot/file-stack.png',
    w: 271,
    h: 193,
    drawn: 'Three overlapping blue document sheets with ruled lines on them',
    means: ['files', 'more than one document', 'a source file named somewhere'],
    palette: 'brand',
  },
  'folder-open': {
    src: '/assets/spot/folder-open.png',
    w: 274,
    h: 185,
    drawn: 'An open amber folder with one white sheet inside it',
    means: ['a folder', 'where a file lives', 'opening something to look inside'],
    palette: 'amber',
  },
  'folder-search': {
    src: '/assets/spot/folder-search.png',
    w: 365,
    h: 326,
    drawn: 'An amber folder spilling a document, a picture and a video tile, with a magnifier',
    means: ['looking for a file', 'searching through what is there'],
    palette: 'mixed',
  },
  'code-window': {
    src: '/assets/spot/code-window.png',
    w: 380,
    h: 352,
    drawn: 'A dark editor window with three traffic lights and a large white angle-bracket mark',
    means: ['source code', 'the editor', 'a line in a file'],
    palette: 'mixed',
  },
  'bug-magnifier': {
    src: '/assets/spot/bug-magnifier.png',
    w: 253,
    h: 232,
    drawn: 'A magnifying glass held over a red and navy beetle',
    means: ['finding a fault', 'debugging', 'looking for the cause'],
    palette: 'mixed',
  },
  'bug-on-screen': {
    src: '/assets/spot/bug-on-screen.png',
    w: 226,
    h: 151,
    drawn: 'A monitor with a tick and a cross on it, a magnifier and a beetle beside it',
    means: ['a fault found in a running program', 'testing'],
    palette: 'mixed',
  },
  'tools-wrench-driver': {
    src: '/assets/spot/tools-wrench-driver.png',
    w: 386,
    h: 353,
    drawn: 'A crossed steel wrench and blue screwdriver',
    means: ['fixing something', 'making a change', 'tooling'],
    palette: 'brand',
  },
  'keyboard-hands': {
    src: '/assets/spot/keyboard-hands.png',
    w: 270,
    h: 185,
    drawn: 'Two hands resting on a blue keyboard, one finger on the space bar',
    means: ['typing a command', 'running something again', 'the learner doing it themselves'],
    palette: 'brand',
  },
  'target-arrow': {
    src: '/assets/spot/target-arrow.png',
    w: 217,
    h: 219,
    drawn: 'A blue and white dartboard on a stand with one arrow in the centre ring',
    means: ['the goal', 'getting it right', 'what to aim for'],
    palette: 'brand',
  },
  'clock': {
    src: '/assets/spot/clock.png',
    w: 235,
    h: 231,
    drawn: 'A navy-rimmed wall clock with an amber second hand',
    means: ['how long something takes', 'a point in time'],
    palette: 'mixed',
  },
  'hourglass': {
    src: '/assets/spot/hourglass.png',
    w: 146,
    h: 236,
    drawn: 'A blue-framed hourglass with amber sand running through it',
    means: ['waiting', 'something that takes time to finish'],
    palette: 'amber',
  },
} as const satisfies Record<string, SpotAsset>

export type SpotName = keyof typeof SPOT
export type CastName = keyof typeof CAST

/**
 * THE SIZE CEILING, AND IT IS A REAL ONE.
 *
 * These are raster files, so past their intrinsic size they interpolate. The
 * ceiling is the intrinsic size rather than half of it, and the reason is the
 * canvas:
 *
 * The deck is authored at 1280x720 and scaled with a transform to fill whatever
 * it is projected on, so on a 1080p projector every CSS pixel is 1.5 device
 * pixels. An icon drawn at its intrinsic size is therefore already being shown at
 * 1.5x, which is the point at which the gloss and the shadow start to soften but
 * the shape does not. Past it, the highlight on a 3D icon is the first thing to
 * go.
 *
 * Half the intrinsic size is the size at which it is exact on a 4K screen and has
 * nothing left to give. Between the two is a judgement and the judgement is the
 * author's; above the intrinsic size is not a judgement, and both components
 * clamp, because a blurry icon is a thing nobody notices in review and everybody
 * notices in the room.
 *
 * TWO CEILINGS, BECAUSE THE TWO COMPONENTS SIZE DIFFERENTLY. See the note on
 * `SpotIcon`: an icon is fitted into a SQUARE BOX so a row of them shares a
 * baseline, and a figure is sized by its WIDTH because it never stands in a row.
 *
 * WHAT THIS RULES OUT. `hourglass` is 236px on its long side, so it cannot be a
 * hero. The largest thing in the set is `tools-wrench-driver` at 386, which is a
 * third of the content well, so **there is no asset here big enough to be a
 * full-frame figure**. That is a fact about the export rather than about the
 * design: if one is wanted, it gets re-exported from Figma larger, and no amount
 * of CSS fixes it.
 */

/**
 * The largest square box an icon may be fitted into before it is upscaled.
 *
 * `object-contain` scales by `min(box/w, box/h)`, which is `box / max(w, h)`, so
 * the art is being enlarged exactly when the box is larger than the long side.
 */
export const maxBox = (a: SpotAsset) => Math.max(a.w, a.h)

/** The largest width a cast figure may be drawn at before it is upscaled. */
export const maxWidth = (a: SpotAsset) => a.w
