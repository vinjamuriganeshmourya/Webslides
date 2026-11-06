/**
 * THE DECK FORMAT (deck-engine v1, 2026-11-04).
 *
 * A session is a folder with `deck.json` (this shape), an `images/` folder and,
 * only when a slide needs a one-off figure, `custom/index.tsx`. The engine turns
 * it into the single HTML file: `node build-deck.mjs <session folder>`.
 *
 * Strings: every on-slide string is written as it should appear (R8 capitals are
 * checked by `check-deck.mjs`). Inline code in a string is wrapped in backticks:
 * "A /24 holds `256` addresses" renders `256` in mono.
 *
 * Icons (`IconRef`): a lucide name in PascalCase ("Shield", "Globe", "Server"),
 * or `lib:<file>` for a 3D library render in `src/engine/icons/` (`lib:server-stack`),
 * or `img:images/<file>.png` for an image in the session's own folder.
 */

export type IconRef = string

/** A point on the left of a slide. `at`: the figure step at which this point is lit (default: its own index + 1). */
export type Point = { text: string; icon?: IconRef; at?: number; kind?: 'ring' | 'tick' | 'arrow' | 'diamond' }

/* ─────────────────────────── figures ─────────────────────────── */

/**
 * THE GENERIC DIAGRAM: boxes (zones that contain things), nodes (an icon with a
 * label), chips (a label alone), arrows between any two of them, packets that
 * ride a path, and `steps` (what appears or lights at each press). Coordinates
 * are in the figure's own pixels (the stage is `w` x `h`). Arrows are routed from
 * the rim of their source to the rim of their target, so heads always land.
 */
export type DiagramBox = {
  id: string
  label?: string
  x: number
  y: number
  w: number
  h: number
  /** 'vpc' dashed outer rim; 'public' green; 'private' teal; 'zone' tinted hairline; 'plain' white card; 'region' faint dashed; 'danger' red */
  kind?: 'vpc' | 'public' | 'private' | 'zone' | 'plain' | 'region' | 'danger'
  icon?: IconRef
  /** a mono line under the label chip (a CIDR, a zone name): `10.0.1.0/24` */
  sub?: string
  /** where the label chip sits inside the box: 'top' left corner (default) or 'bottom' left corner (keeps the top clear for lines) */
  labelAt?: 'top' | 'bottom'
}
export type DiagramNode = {
  id: string
  /** centre point */
  x: number
  y: number
  icon: IconRef
  label?: string
  /**
   * the body's size in px: a tile's or disc's outer size (default tile 52, disc 46), a bare icon's longer
   * side (default 44), a person's height (default 96); a library render keeps its own aspect
   */
  size?: number
  /** 'disc' a round gateway disc, 'tile' a rounded square tile (default), 'bare' the icon alone, 'person' a library person image */
  shape?: 'disc' | 'tile' | 'bare' | 'person'
  labelPos?: 'below' | 'above' | 'left' | 'right'
  tone?: 'brand' | 'good' | 'bad' | 'warn' | 'muted' | 'accent'
  /** a quiet continuous loop on the icon */
  loop?: 'spin' | 'pulse' | 'lift' | 'ripple' | 'blink'
  /** a mono line under the label (an address, an id): `10.0.1.15` */
  sub?: string
}
export type DiagramChip = { id: string; x: number; y: number; text: string; icon?: IconRef; tone?: 'plain' | 'brand' | 'good' | 'bad' | 'warn' | 'muted'; mono?: boolean }
export type DiagramArrow = {
  id?: string
  from: string
  to: string
  /** two-way: heads at both ends */
  two?: boolean
  dashed?: boolean
  /** red, ends in a stop mark before the target */
  blocked?: boolean
  label?: string
  tone?: 'brand' | 'good' | 'bad' | 'warn' | 'muted' | 'accent'
  /** bend: 'h' goes horizontal first, 'v' vertical first; default straight */
  bend?: 'h' | 'v'
  /** waypoints (figure px) the line runs through, in order, with rounded corners; overrides `bend` */
  via?: [number, number][]
  /** shift a straight arrow sideways by this many px (two parallel arrows between the same pair: +14 and -14) */
  offset?: number
  /** where the mid label sits: beside the line ('above' / 'below' / 'left' / 'right'; default above a level line, right of an upright one) or 'on' it */
  labelPos?: 'on' | 'above' | 'below' | 'left' | 'right'
}
/** `dur` is one full cycle in seconds (default: the path's length at 140 px/s); `icon` rides inside the dot (a padlock on an encrypted packet) */
export type DiagramPacket = { path: string[]; tone?: 'brand' | 'good' | 'bad' | 'accent'; back?: boolean; dur?: number; icon?: IconRef }
export type DiagramSpec = {
  type: 'diagram'
  w: number
  h: number
  boxes?: DiagramBox[]
  nodes?: DiagramNode[]
  chips?: DiagramChip[]
  arrows?: DiagramArrow[]
  packets?: DiagramPacket[]
  /**
   * What each press reveals, in order: ids of boxes / nodes / chips / arrows (an
   * arrow's id defaults to `from>to`) / `packet:<n>`. Anything not listed in any
   * step is shown from the start. `lit` steps light (ring) instead of reveal:
   * `{ "show": [...], "lit": [...] }`. `lit` and `dim` hold for that press only
   * (the next press moves the focus on). After the last press everything is
   * shown; a harness frame (`?still`) shows everything with nothing lit or dimmed.
   * An arrow or a packet never shows before the parts it joins.
   */
  steps?: (string[] | { show?: string[]; lit?: string[]; dim?: string[] })[]
}

export type ImageFigure = { type: 'image'; src: string; w?: number; h?: number; alt?: string }
/** a figure the engine already has (the course kits), by name, with its props */
export type KitFigure = { type: 'kit'; name: string; props?: Record<string, unknown> }
/** a one-off figure from the session's `custom/index.tsx`, by export name */
export type CustomFigure = { type: 'custom'; name: string; props?: Record<string, unknown> }
export type TableFigure = {
  type: 'table'
  columns: { label: string; icon?: IconRef; weight?: number }[]
  rows: { icon?: IconRef; cells: string[] }[]
  /** rows (0-based) that carry a content meaning (R8.3); never the last row by default */
  highlight?: number[]
  size?: number
}
export type Figure = DiagramSpec | ImageFigure | KitFigure | CustomFigure | TableFigure

/* ─────────────────────────── slides ─────────────────────────── */

type Base = { id: string; section?: string; label?: string; transition?: 'fade' | 'zoom' | 'slide'; notes?: string }

export type Slide = Base &
  (
    | { layout: 'brand'; greeting?: string }
    | { layout: 'title' }
    | { layout: 'recap' }
    | { layout: 'agenda' }
    | { layout: 'breaker'; index: number; lab?: boolean; kicker?: string; title?: string }
    /** points on the left, a figure on the right (the deck's main slide) */
    | { layout: 'points'; kicker: string; title: string; lead?: string; points: Point[]; figure?: Figure; pointsW?: number; figH?: number }
    /** a description above a centred figure */
    | { layout: 'lead'; kicker: string; title: string; lead?: string; figure: Figure; figH?: number; figW?: number }
    /** a table, optionally under a lead */
    | { layout: 'table'; kicker: string; title: string; lead?: string; table: TableFigure }
    /** one enlarged screenshot with orange rings (R7.9) */
    | { layout: 'screenshot'; kicker: string; title: string; lead?: string; step?: { text: string; icon?: IconRef }; image: string; rings?: [number, number, number, number][]; note?: { text: string; tone?: 'info' | 'warn' } }
    /** two pictures, the familiar scene and the concept (R3: no explaining text) */
    | { layout: 'analogy'; kicker: string; title: string; everyday: Figure; concept: Figure; h?: number }
    /** numbered or ticked steps, optionally beside a figure */
    | { layout: 'steps'; kicker: string; title: string; lead?: string; steps: Point[]; figure?: Figure; note?: { text: string; tone?: 'info' | 'warn' } }
    | { layout: 'quiz'; title?: string }
    | { layout: 'takeaways' }
    | { layout: 'next'; title: string }
    | { layout: 'thanks'; title: string }
    /** the escape hatch: a whole slide from `custom/index.tsx` */
    | { layout: 'custom'; component: string; props?: Record<string, unknown> }
  )

export type DeckData = {
  engine: 1
  meta: {
    title: string
    course: string
    htmlName: string
    /** recap frame: the previous session's title and its section titles */
    previous?: { title: string; items: string[] }
    agenda: string[]
    next?: string
    presenter?: string
  }
  slides: Slide[]
}
