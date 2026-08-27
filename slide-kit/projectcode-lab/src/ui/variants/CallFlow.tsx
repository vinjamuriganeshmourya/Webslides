import { useId, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { E, c4 } from '@/ui/figureTiming'
import { FcArrowDefs, FcEdgeDraw, FcEdgeLabel, FcNodeIn, useBeats } from './motion'
import { resolveProject, type ProjectFigureProps } from './projectFigure'

/**
 * CALL FLOW — the handover is the subject, and the snippets are the evidence.
 *
 * THE ARGUMENT
 *
 * For a request path, WHAT HANDS TO WHAT is the lesson. A file map states
 * adjacency and calls it a day: it can say `urls.py` and `views.py` both exist
 * and are next to each other, and adjacency is not causation. This variant spends
 * the whole stage on the thing a map leaves out. Five compact cards in a chain,
 * each carrying its file, its `title` and its real snippet, and between every
 * consecutive pair a drawn connector with `via` riding it: "GET /api/products/",
 * "calls", "lazy queryset", "reads Product", "defines".
 *
 * The connector hops OVER the top of the cards rather than running between them,
 * for a measured reason: the gaps are 25px and "GET /api/products/" is about
 * 110px wide, so a label centred in a gap either overlaps the cards or gets
 * shrunk to illegibility. In the band above the cards it has 225px of clear room
 * per hop, and the label is the whole point of the variant, so the label wins the
 * geometry argument and the connector routes around it.
 *
 * TWO STOPS IN ONE FILE, WHICH THE FIXTURE HAS AND WHICH BROKE THE FIRST LAYOUT
 *
 * Stops 2 and 3 are both in `products/views.py`, one on the function and one on
 * the queryset line. Five equal cards in a row implies five files, and the room
 * would leave believing the project has five, which is a false statement about
 * the codebase. Three things say otherwise, and they are derived from the data
 * (`stops[i].file === stops[i + 1].file`), never hardcoded to index 1:
 *
 *   1. A tinted PLATE is drawn behind the pair, extending 8px past both cards, so
 *      the two read as one region. It costs no height because it sits behind.
 *   2. That plate is labelled "one file", left-aligned at x = the plate's left
 *      edge so it clears both connector legs, which stand at the card centres
 *      337 and 562.
 *   3. The connector across the pair is DASHED and carries no arrowhead. An
 *      arrowhead between two cards means control left one file and entered
 *      another, and here it did not: it moved two lines down the same function.
 *
 * WHAT IT IS WORST AT
 *
 * THE CODE. Every card is 200px wide, so the code column is 106px and
 * `    price = models.DecimalField(max_digits=8, decimal_places=2)` wraps to
 * three visual lines. Wrapped Python with a broken indent is genuinely harder to
 * read than the same lines in `TourStops`' 776px panel, and the worst card shows
 * ten visual lines for five real ones. Nothing is hidden, which is why wrapping
 * beat clipping, but this figure is for the room that needs the chain; anybody
 * who needs to READ the queryset line needs the other variant.
 *
 * Second, it answers "what happens next" and not "where does this live". There is
 * no persistent map here at all: the layer colour is the only clue to a file's
 * place in the project, and a chain cannot show that `serializers.py` sits beside
 * `models.py` rather than after it.
 *
 * DID IT USE THE KIT'S `CodeBlock`? NO. Two reasons, both fatal here. Its gutter
 * is hardcoded `{i + 1}`, and four of five stops do not start at line 1, so it
 * would tell the room the view body is at the top of its file. And it carries a
 * traffic-light title bar plus a language chip, which is about 40px of chrome per
 * card, five times over, on a figure whose entire budget is 400px. The local
 * renderer below is a `[gutter, code]` CSS grid, so a number cannot drift off its
 * own line.
 *
 * GEOMETRY, AND THE PADDING ARITHMETIC
 *
 * A fixed 1100x384 stage. Labels ride a band at y=6. The connector's horizontal
 * run is at y=36. Cards are 200 wide on a 225 pitch (0, 225, 450, 675, 900, last
 * right edge exactly 1100), top 60, height 280, bottom 340. The plate reaches 348
 * and the caption sits at 358.
 *
 * PADDING IS A FLOOR, so CARD_H is derived from the fixture's worst card and not
 * declared. Content width is 200 - 28 (px-14) = 172. Inside the code panel:
 * 172 - 16 (its own pad) - 14 (gutter) - 8 (gap) = 134px of text at 10px mono
 * (0.6em = 6px), so 22 characters per visual line.
 *
 *   file chip                        19px   (10px text on 1.3, plus 3px x 2)
 *   gap                               6px
 *   title, 3 lines allowed           48px   ("And the model is where it all
 *                                            resolves" is 37 chars at 12.5px
 *                                            semibold, about 259px, so 2 lines
 *                                            in 172; the third is headroom)
 *   gap                               8px
 *   code panel                      171px   (worst is stop 5: lines of 28, 43,
 *                                            62 and 47 chars wrap to 2 + 2 + 3 +
 *                                            3 = 10 visual lines at 22 chars
 *                                            each, 15.5px per line = 155, plus
 *                                            16px of its own padding)
 *   ------------------------------------
 *   content                         252px
 *   CARD_H = 252 + 2 x 14           280px  -> real vertical padding exactly 14
 *
 * The code panel is `flex-1`, so the cards whose snippets are shorter fill the
 * slack with panel rather than with a hole under the text, and their declared
 * 14px stays real too.
 */

const W = 1100
/* Grown from 384: the same-file badge sits below the plate and the caption was
   landing on top of it. Both are derived below rather than pinned. */
const H = 300
const CARD_W = 200
const PITCH = 225
const CARDS_TOP = 60
const CARD_H = 176
const LINE_Y = 36
const LABEL_Y = 6
const LABEL_SLOT = 190
const PLATE_PAD = 8
/*
  BELOW THE SAME-FILE BADGE, NOT ON IT.

  `358` was set before the badge existed. The badge hangs off the bottom of the
  plate at `CARDS_TOP + CARD_H + PLATE_PAD - 2` and is about 18px tall, so the
  caption was printed straight through it. Derived from the same expression now,
  so it cannot go stale if the cards or the plate move.
*/
const CAPTION_Y = CARDS_TOP + CARD_H + PLATE_PAD + 26

const left = (i: number) => i * PITCH
const cx = (i: number) => i * PITCH + CARD_W / 2

/** Same ramp, same order, in all three variants. See the note in `TourStops`. */
const RAMP = [colors.brand, colors.info, colors.teal, colors.accentDark, colors.success, colors.warning]

/** The hover aside, in idea from `NodeShell` in the sibling lab. */
function HoverAside({
  label,
  detail,
  paint,
  className = '',
  children,
}: {
  label: string
  detail?: ReactNode
  paint: string
  className?: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const id = useId()
  const has = Boolean(detail)
  return (
    <span
      className={`relative ${className}`}
      onPointerEnter={() => has && setOpen(true)}
      onPointerLeave={() => setOpen(false)}
    >
      <span
        className={`fc-node block h-full w-full ${has ? 'fc-node--hoverable' : ''}`}
        aria-describedby={open ? id : undefined}
      >
        {children}
      </span>
      {/*
        NEVER IN THE DOM UNLESS OPEN, because all three harnesses measure static
        rectangles. It opens downward and can reach past the figure's own bottom
        edge, which is safe precisely because it is never measured: the figure is
        centred on a 720px slide, so there is room below it on screen.

        0.18s is the documented UI-tier exception to the no-literals rule.
      */}
      <AnimatePresence>
        {open && detail && (
          <motion.span
            id={id}
            role="tooltip"
            className="pointer-events-none absolute left-1/2 z-30 block w-[268px] rounded-card border border-line bg-white px-3.5 py-3 text-left text-[12.5px] leading-snug shadow-float"
            style={{ color: colors.body, top: 'calc(100% + 10px)', transformOrigin: 'top center' }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateX(-50%) scale(0.96)' }}
            animate={{ opacity: 1, transform: 'translateX(-50%) scale(1)' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateX(-50%) scale(0.98)' }}
            transition={{ duration: 0.18, ease: c4(E.out) }}
          >
            <span
              className="mb-1 block font-heading text-[11px] font-bold uppercase tracking-wide"
              style={{ color: paint }}
            >
              {label}
            </span>
            {detail}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

export function CallFlow({ files, stops, caption, className = '' }: ProjectFigureProps) {
  const p = resolveProject({ files, stops })

  /*
    BEATS. Beat 0 is free and carries the first card, so the slide never opens on
    an empty stage. After that the chain builds along its own path: the edge out
    of card i, then card i + 1, which is the choreography rule from the sibling
    lab. Count is derived from `stops.length` and never from state.
  */
  const CARD = (i: number) => i * 2
  const EDGE = (i: number) => i * 2 + 1
  const CAPTION = Math.max(0, (p.stops.length - 1) * 2 + 1)
  const shown = useBeats(CAPTION + 1)

  if (p.problems.length > 0) {
    return (
      <figure
        className={`mx-auto flex flex-col justify-center gap-2 rounded-card border-2 px-8 ${className}`}
        style={{ width: W, height: H, borderColor: colors.danger, background: colors.surface }}
      >
        <span className="font-heading text-[16px] font-bold" style={{ color: colors.danger }}>
          This chain cannot be drawn as authored.
        </span>
        {p.problems.map((m) => (
          <span key={m} className="text-body-sm" style={{ color: colors.body }}>
            {m}
          </span>
        ))}
      </figure>
    )
  }

  const paintOf = (path: string) => {
    const f = p.byPath[path]
    const i = p.layers.indexOf(f?.layer ?? 'unassigned')
    return RAMP[i % RAMP.length]
  }

  /* One marker per stop colour. Index keys, because a layer name like "request
     handling" contains a space and would break the `url(#...)` reference. */
  const markers: Record<string, string> = {}
  p.stops.forEach((s, i) => {
    markers[`s${i}`] = paintOf(s.file)
  })

  /** Consecutive stops in the SAME file. Derived, never an index literal. */
  const sameFile = (i: number) => p.stops[i] && p.stops[i + 1] && p.stops[i].file === p.stops[i + 1].file

  return (
    <figure className={`relative mx-auto ${className}`} style={{ width: W, height: H }}>
      {/* THE PLATE BEHIND A SAME-FILE PAIR. First in the DOM, so it is behind the
          cards, and it costs the layout no height at all. */}
      {p.stops.map((_s, i) =>
        sameFile(i) ? (
          <FcNodeIn
            key={`plate${i}`}
            at={EDGE(i)}
            shown={shown[EDGE(i)]}
            className="absolute"
            style={{
              left: left(i) - PLATE_PAD,
              top: CARDS_TOP - PLATE_PAD,
              width: CARD_W + PITCH + PLATE_PAD * 2,
              height: CARD_H + PLATE_PAD * 2,
              zIndex: 0,
            }}
          >
            <span
              className="block h-full w-full rounded-xl2 border-2 border-dashed"
              style={{
                borderColor: `${paintOf(p.stops[i].file)}66`,
                background: `linear-gradient(${paintOf(p.stops[i].file)}0d, ${paintOf(p.stops[i].file)}0d), ${colors.white}`,
              }}
            />
          </FcNodeIn>
        ) : null,
      )}

      {/* CONNECTORS. One aria-hidden SVG layer: the lines are geometry, and every
          label on this figure is a real DOM element, per content rule 17. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0"
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
      >
        <FcArrowDefs id="callflow" colors={markers} />
        {p.stops.slice(0, -1).map((_s, i) => {
          const tie = sameFile(i)
          return (
            <FcEdgeDraw
              key={`e${i}`}
              /* Up out of the card, across the label band, down into the next.
                 The label rides the horizontal run at LINE_Y, where it has a
                 whole pitch of clear room. */
              d={`M ${cx(i)} ${CARDS_TOP} V ${LINE_Y} H ${cx(i + 1)} V ${CARDS_TOP - (tie ? 0 : 6)}`}
              at={EDGE(i)}
              shown={shown[EDGE(i)]}
              stroke={paintOf(p.stops[i + 1].file)}
              /* Dashed and headless across a same-file pair: an arrowhead here
                 would claim control crossed a file boundary that does not exist. */
              dashed={tie}
              markerEnd={tie ? undefined : `url(#callflow-s${i + 1})`}
            />
          )
        })}
      </svg>

      {/* VIA LABELS. The mechanism of each handover, which is the argument of the
          whole variant, so it is set in the clearest room on the stage. */}
      {p.stops.slice(0, -1).map((s, i) =>
        s.via ? (
          <FcEdgeLabel
            key={`v${i}`}
            at={EDGE(i)}
            shown={shown[EDGE(i)]}
            className="absolute text-center"
            style={{ left: (cx(i) + cx(i + 1)) / 2 - LABEL_SLOT / 2, width: LABEL_SLOT, top: LABEL_Y }}
          >
            <span
              className="inline-flex items-center rounded-pill px-2.5 py-1 font-mono text-[11px] font-semibold"
              style={{
                background: `linear-gradient(${paintOf(p.stops[i + 1].file)}1a, ${paintOf(p.stops[i + 1].file)}1a), ${colors.white}`,
                color: paintOf(p.stops[i + 1].file),
                border: `1px solid ${paintOf(p.stops[i + 1].file)}3d`,
              }}
            >
              {/* Its own tight-leading span: the pill is 27px tall from its own
                  padding against a 16.5px line, and `align-check.mjs` infers a
                  wrap by comparing the two. Measured, not guessed. Same false
                  positive the flow-chart lab hit on its token chips. */}
              <span className="leading-none">{s.via}</span>
            </span>
          </FcEdgeLabel>
        ) : null,
      )}

      {/* "one file", left-aligned at the plate's own left edge so it clears both
          connector legs, which stand at the card centres. */}
      {p.stops.map((_s, i) =>
        sameFile(i) ? (
          <FcEdgeLabel
            key={`tie${i}`}
            at={EDGE(i)}
            shown={shown[EDGE(i)]}
            className="absolute"
            style={{ left: left(i) - PLATE_PAD, top: CARDS_TOP + CARD_H + PLATE_PAD - 2 }}
          >
            <span
              className="inline-block rounded-pill px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{ background: paintOf(p.stops[i].file), color: colors.white }}
            >
              one file, two stops
            </span>
          </FcEdgeLabel>
        ) : null,
      )}

      {/* THE STOPS */}
      {p.stops.map((s, i) => {
        const paint = paintOf(s.file)
        const snip = p.snippet(s)
        const continues = i > 0 && p.stops[i - 1].file === s.file
        return (
          <FcNodeIn
            key={s.id}
            at={CARD(i)}
            shown={shown[CARD(i)]}
            className="absolute"
            style={{ left: left(i), top: CARDS_TOP, width: CARD_W, height: CARD_H }}
          >
            <HoverAside label={`Stop ${i + 1}`} detail={s.detail} paint={paint} className="block h-full w-full">
              <div
                className="flex h-full w-full flex-col rounded-card border bg-white px-3.5 py-3.5 shadow-card-soft"
                style={{ borderColor: colors.line, borderTopColor: paint, borderTopWidth: 3 }}
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full font-mono text-[10px] font-bold"
                    style={{ background: paint, color: colors.white }}
                  >
                    {i + 1}
                  </span>
                  {/* The second stop in a file says so instead of repeating the
                      path, which is the third thing keeping the pair honest. */}
                  <span
                    className="min-w-0 truncate rounded-pill px-1.5 py-[3px] font-mono text-[10px] font-semibold"
                    style={{ background: `${paint}1a`, color: paint }}
                  >
                    {continues ? 'same file, further down' : s.file}
                  </span>
                </span>

                <span
                  className="mt-1.5 block font-heading text-[12.5px] font-semibold leading-[1.28]"
                  style={{ color: colors.ink }}
                >
                  {s.title}
                </span>

                {/*
                  THE CODE CAME OUT, AND THAT IS THE FIX RATHER THAN A RETREAT.

                  A 106px code column at 10px wrapped nearly every line of this
                  fixture two to four times: `align-check.mjs` reported 28
                  wrapped tokens on this one slide, and
                  `price = models.DecimalField(max_digits=8, decimal_places=2)`
                  came out over four visual lines. Wrapping was the right call
                  against clipping, because a clipped line silently claims the
                  code ends where the card does. But the honest conclusion from
                  the measurement is that five snippets do not fit side by side
                  on a 1280px stage at any legible size, and a figure that shows
                  code the room cannot read is not showing code.

                  So this variant does what its own argument says it is for: the
                  HANDOVER. File, claim, and the mechanism on the line between.
                  The line range is still named, so the room knows where to look,
                  and `TourStops` is the variant that shows the lines themselves.
                  Two figures, two jobs, rather than one figure doing both badly.
                */}
                <span className="mt-1.5 block text-[11.5px] leading-[1.35]" style={{ color: colors.body }}>
                  {s.body}
                </span>

                <span
                  className="mt-auto block font-mono text-[10px]"
                  style={{ color: colors.muted }}
                >
                  lines {snip.from} to {snip.from + snip.lines.length - 1}
                </span>
              </div>
            </HoverAside>
          </FcNodeIn>
        )
      })}

      {caption && (
        <FcEdgeLabel
          at={CAPTION}
          shown={shown[CAPTION]}
          className="absolute text-center text-body-sm"
          style={{ left: 0, width: W, top: CAPTION_Y, color: colors.body }}
        >
          {caption}
        </FcEdgeLabel>
      )}
    </figure>
  )
}
