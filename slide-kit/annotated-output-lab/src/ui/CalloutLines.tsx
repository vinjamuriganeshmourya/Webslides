import { colors } from '@/design/tokens'
import { Reveal, RevealGroup } from '@/motion/Reveal'
import { Terminal } from './Terminal'
import {
  flattenOutput,
  lineCentre,
  runCountLabel,
  FIGURE_ROOT,
  FIGURE_VIDEO_GUARD,
  type AnnotatedOutputProps,
} from './annotatedOutput'
import { litCard, PAINT } from './annotatedSurface'

/**
 * CANDIDATE 3 — CALLOUT LINES
 *
 * Leader lines from specific output lines out to captions in the margin. The
 * oldest figure in the book: it is what a printed anatomy diagram does, and it
 * is the only one of the four candidates where the annotation TOUCHES the thing
 * it is about, so no pairing has to be learned before it can be read.
 *
 * TWO THINGS THIS HAD TO SOLVE, and they are why it is the longest of the four.
 *
 * ONE, DOM AND NOT SVG. A leader line is the most natural `<path>` in the
 * world, and content rule 17 forbids it: session 4 shipped two SVG figures with
 * overlapping `<text>` labels and all three harnesses reported clean, because
 * an `<svg>` is one DOM rectangle to them. So each leader is three real
 * elements — a stub out of the panel, a vertical connector, a stub into the
 * card — and every caption is a real box the browser lays out and
 * `align-check.mjs` can see.
 *
 * TWO, COLLISIONS. Output lines are 23px apart at 14px monospace and a caption
 * card is 44px tall, so two captions on adjacent lines overlap. Adjacent
 * annotated lines are not a corner case here: the fixture has one on line 6 and
 * one on line 7. The captions are therefore packed bottom-up with a minimum
 * gap, and the leader KINKS to reach the line it belongs to. A figure that let
 * the cards overlap would be indistinguishable from a layout bug.
 *
 * WORST AT: density. Three callouts is comfortable, four is tight, and past
 * that the kink lengths diverge enough that the leaders start crossing each
 * other's captions and the eye can no longer follow one to its end. It is also
 * worst at a RUN: a run has to be attached to one representative line, so the
 * leader points at the middle `Pushed` line and the other two members are
 * covered only by the caption's words. The brace says "these three" with
 * geometry; this says it with a sentence.
 */

const LANE = 340
/**
 * Card heights are fixed so the packer's arithmetic is deterministic, and they
 * are sized for `body-sm` (16px), the kit's smallest body token. A caption that
 * explains a line of output cannot be smaller than the output, so the cards get
 * taller rather than the type getting smaller. That is what costs this candidate
 * its lane height, and it is a real cost: see the WORST AT note above.
 */
const H_ONE = 44
const H_TWO = 70
const MIN_GAP = 10

interface Target {
  key: string
  /** Flat-line index the leader points at. */
  at: number
  label: string
  body?: string
  paint: string
  h: number
  /** Centre of the line, from the panel's bottom edge. */
  y: number
  /** Centre of the CARD, after packing. */
  cardY: number
}

export function CalloutLines({
  path,
  nodes,
  chrome = 'vscode',
  fontSize = 14,
  caption,
  className = '',
}: AnnotatedOutputProps) {
  const { lines, runs } = flattenOutput(nodes)
  const total = lines.length
  const terminalLines = lines.map((f) => ({ text: f.line.text, kind: f.line.kind }))

  /* THE TARGETS, derived from the nodes and nothing else. A run contributes ONE
     target attached to its middle member, plus one per exception; a standalone
     annotated line contributes one. */
  const targets: Target[] = []
  for (const span of runs) {
    const mid = span.members[Math.floor((span.members.length - 1) / 2)]
    if (mid !== undefined) {
      targets.push({
        key: `r${span.runIndex}`,
        at: mid,
        label: span.run.label,
        body: runCountLabel(span),
        paint: PAINT.member,
        h: H_TWO,
        y: lineCentre(fontSize, total, mid),
        cardY: 0,
      })
    }
    for (const at of span.exceptions) {
      targets.push({
        key: `x${at}`,
        at,
        label: lines[at].line.exceptionNote ?? lines[at].line.note ?? 'Not one of them',
        paint: PAINT.exception,
        h: H_TWO,
        y: lineCentre(fontSize, total, at),
        cardY: 0,
      })
    }
  }
  lines.forEach((f, at) => {
    if (f.run || !f.line.note) return
    targets.push({
      key: `s${at}`,
      at,
      label: f.line.note,
      paint: PAINT.single,
      h: H_ONE,
      y: lineCentre(fontSize, total, at),
      cardY: 0,
    })
  })

  /* PACK BOTTOM-UP. Sorted by the line they point at, lowest line first, each
     card placed at its ideal height and then pushed UP only as far as the one
     below it demands. Pushing up rather than down keeps the bottom-most card on
     its own line, which is the one nearest the digest and the easiest to lose. */
  targets.sort((a, b) => a.y - b.y)
  let floor = 0
  for (const t of targets) {
    const want = Math.max(t.y, floor + t.h / 2)
    t.cardY = want
    floor = want + t.h / 2 + MIN_GAP
  }

  return (
    <RevealGroup
      className={`${FIGURE_ROOT} max-w-[1160px] ${className}`}
      style={{ paddingTop: FIGURE_VIDEO_GUARD, paddingBottom: FIGURE_VIDEO_GUARD }}
      stagger={0.1}
    >
      <Reveal dir="up">
        <div className="relative">
          <div style={{ marginRight: LANE }}>
            <Terminal path={path} lines={terminalLines} fontSize={fontSize} chrome={chrome} />
          </div>

          {targets.map((t) => {
            const lo = Math.min(t.y, t.cardY)
            const hi = Math.max(t.y, t.cardY)
            return (
              <div
                key={t.key}
                className="absolute bottom-0 top-0"
                style={{ left: `calc(100% - ${LANE}px)`, width: LANE }}
              >
                {/* the stub out of the panel, on the line's own centre */}
                <span
                  className="absolute"
                  style={{ left: 0, width: 16, height: 2, bottom: t.y - 1, background: t.paint }}
                />
                {/* the vertical connector, zero height when nothing was pushed */}
                <span
                  className="absolute"
                  style={{ left: 15, width: 2, bottom: lo, height: Math.max(hi - lo, 2), background: t.paint }}
                />
                {/* the stub into the card, on the CARD's centre */}
                <span
                  className="absolute"
                  style={{ left: 15, width: 15, height: 2, bottom: t.cardY - 1, background: t.paint }}
                />
                <span
                  className="absolute rounded-full"
                  style={{
                    left: 12,
                    width: 8,
                    height: 8,
                    bottom: t.y - 4,
                    background: t.paint,
                    boxShadow: 'inset 0 1px 0 0 #FFFFFFb3',
                  }}
                />
                <div
                  className="absolute flex flex-col justify-center rounded-card px-3.5"
                  style={{
                    ...litCard(t.paint),
                    left: 32,
                    right: 0,
                    bottom: t.cardY - t.h / 2,
                    height: t.h,
                  }}
                >
                  <p
                    className="font-heading text-body-sm font-bold leading-tight"
                    style={{ color: t.paint === PAINT.exception ? colors.tealDark : t.paint }}
                  >
                    {t.label}
                  </p>
                  {t.body && (
                    <p className="mt-0.5 text-body-sm font-semibold leading-tight" style={{ color: colors.body }}>
                      {t.body}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Reveal>

      {caption && (
        <Reveal dir="up">
          <p className="mt-4 text-center text-body-sm font-semibold text-ink">{caption}</p>
        </Reveal>
      )}
    </RevealGroup>
  )
}
