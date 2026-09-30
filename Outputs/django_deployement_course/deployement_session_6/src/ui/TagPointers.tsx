import { motion } from 'framer-motion'
import { colors, easing } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * A repository's tags, with the one arrow that says what `latest` really is.
 *
 * WHAT IT ARGUES. `v1`, `v2` and `latest` sit in a Hub repository looking like
 * three equal things, and that reading is the bug: two of them are builds and
 * the third is a pointer that was moved onto one of them. The claim this figure
 * makes is that `latest` has no content of its own. It makes it the only way the
 * claim can be made, by drawing `latest` reaching out of its own row and landing
 * on another one. When the pointer moves next week, the arrow is what moves, and
 * the row it left is still there and still pullable.
 *
 * WHY NOT A TABLE OR BULLETS. A table of tag against note puts `latest` in a row
 * of its own with a cell saying "points at v2", and a cell of prose is exactly
 * the flattening that causes the mistake: it reads as one more entry with one
 * more property. Bullets are worse, because a bullet list has no geometry at all
 * and the relation is geometric, one row referring to another. The arrow is the
 * idea, so the arrow has to be drawn.
 *
 * WHY THE ROWS ARE DOM AND ONLY THE CONNECTOR IS SVG. Every label here is a real
 * element, per the rule session 5 recorded in `TargetAnatomy`: SVG text is
 * invisible to `align-check.mjs`, which sees an `<svg>` as one rectangle. The
 * `<svg>` holds the connector path and nothing else, and the pointer caption
 * beside it is a positioned element, not `<text>`.
 */

export interface TagEntry {
  tag: string
  note?: string
}

/* Fixed geometry, so the connector can be computed rather than measured. A
   measured layout would need an effect and a resize observer, and the figure
   always sits in the same 980px body well. */
const W = 980
/** Width of the rows column. The rest is the connector gutter. */
const ROWS_W = 690
const ROW_H = 66
const ROW_GAP = 14
/** The repository caption above the rows. */
const HEAD_H = 44
/** Where the connector's vertical leg runs, measured from the figure's left. */
const LEG_X = ROWS_W + 74

export function TagPointers({
  repository,
  tags,
  pointsAt,
  className = '',
}: {
  repository: string
  tags: TagEntry[]
  pointsAt: string
  className?: string
}) {
  /* On an instant jump (Ctrl+arrow) the rest of the slide snaps to its final
     state, so the rows and the connector must too: a lone drawing arrow would be
     the only thing moving on an otherwise still slide. */
  const instant = useInstant()
  const t = instant ? 0 : 1

  const pointerIdx = tags.findIndex((e) => e.tag.toLowerCase() === 'latest')
  const targetIdx = tags.findIndex((e) => e.tag === pointsAt)
  const canDraw = pointerIdx >= 0 && targetIdx >= 0 && pointerIdx !== targetIdx

  const rowsH = tags.length * ROW_H + Math.max(0, tags.length - 1) * ROW_GAP
  const totalH = HEAD_H + rowsH
  const centerOf = (i: number) => HEAD_H + i * (ROW_H + ROW_GAP) + ROW_H / 2

  /** Out of the pointer row, along the gutter, back into the target row. */
  const path = canDraw
    ? `M ${ROWS_W + 6} ${centerOf(pointerIdx)} H ${LEG_X} V ${centerOf(targetIdx)} H ${ROWS_W + 12}`
    : ''

  /** When the last row has landed and the arrow may start. */
  const rowsEnd = 0.12 + (tags.length - 1) * 0.07 + 0.4

  return (
    <div
      className={`relative mx-auto ${className}`}
      style={{ width: W, height: totalH, maxWidth: '100%' }}
    >
      {/* The repository the tags belong to. Named, because the whole point is
          that all three tags live in ONE repository. */}
      <motion.div
        className="flex items-center gap-2"
        style={{ height: HEAD_H }}
        initial={instant ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 * t, ease: easing.soft }}
      >
        <span className="font-heading text-body-sm font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
          repository
        </span>
        <span className="font-mono text-body-lg font-bold" style={{ color: colors.brandDeep }}>
          {repository}
        </span>
      </motion.div>

      {/* The tags, top to bottom, in the order Hub lists them. */}
      <div className="flex flex-col" style={{ width: ROWS_W, rowGap: ROW_GAP }}>
        {tags.map((e, i) => {
          const isPointer = i === pointerIdx
          const isTarget = i === targetIdx
          const paint = isPointer ? colors.accentDark : isTarget ? colors.tealDark : colors.brandDark
          return (
            <motion.div
              key={e.tag}
              className="flex items-center gap-5 rounded-card bg-surface-card px-5 shadow-card-soft"
              style={{
                height: ROW_H,
                border: isPointer ? `2px dashed ${paint}` : `1px solid ${colors.line}`,
              }}
              initial={instant ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (0.12 + i * 0.07) * t, duration: 0.42 * t, ease: easing.soft }}
            >
              {/*
                TWO ELEMENTS, NOT ONE, AND THE REASON IS THE HARNESS.

                `align-check.mjs` reports a mono leaf as WRAPPED when its box is
                two line-heights tall, which is how it catches a command broken
                across lines. A single span carrying both `leading-none` and
                `py-1.5` measures 34px against a 22px line and reports two rows
                while rendering one. The padding lives on the outer span and the
                mono text is a clean leaf, so the measurement matches the render.
              */}
              <span
                className="shrink-0 rounded-md px-3 py-1.5"
                style={{
                  background: isPointer ? 'rgba(229,115,42,0.14)' : isTarget ? 'rgba(18,181,168,0.12)' : 'rgba(45,99,251,0.10)',
                }}
              >
                <span
                  className="whitespace-nowrap font-mono text-body-lg font-bold"
                  style={{ color: paint }}
                >
                  {e.tag}
                </span>
              </span>
              {e.note ? (
                <span className="min-w-0 text-body-sm font-medium" style={{ color: colors.body }}>
                  {e.note}
                </span>
              ) : null}
            </motion.div>
          )
        })}
      </div>

      {canDraw ? (
        <>
          <svg
            className="pointer-events-none absolute left-0 top-0"
            width={W}
            height={totalH}
            style={{ overflow: 'visible' }}
          >
            <defs>
              <marker
                id="tag-pointer-head"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.accentDark} />
              </marker>
            </defs>
            <motion.path
              d={path}
              fill="none"
              stroke={colors.accentDark}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              markerEnd="url(#tag-pointer-head)"
              initial={instant ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: rowsEnd * t, duration: 0.75 * t, ease: 'easeInOut' }}
            />
          </svg>

          {/* The connector's caption, as a real element rather than SVG text, so
              the harnesses can measure it. */}
          <motion.div
            className="absolute rounded-pill px-3 py-1.5 font-mono text-body-sm font-bold"
            style={{
              left: LEG_X + 14,
              top: (centerOf(pointerIdx) + centerOf(targetIdx)) / 2 - 18,
              background: 'rgba(229,115,42,0.14)',
              color: colors.accentDark,
            }}
            initial={instant ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (rowsEnd + 0.55) * t, duration: 0.3 * t, ease: easing.soft }}
          >
            points at {pointsAt}
          </motion.div>
        </>
      ) : null}
    </div>
  )
}
