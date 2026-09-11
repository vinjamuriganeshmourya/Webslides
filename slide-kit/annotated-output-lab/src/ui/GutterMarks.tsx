import { colors } from '@/design/tokens'
import { Reveal, RevealGroup } from '@/motion/Reveal'
import { Terminal } from './Terminal'
import {
  flattenOutput,
  lineBox,
  lineHeightPx,
  runCountLabel,
  FIGURE_ROOT,
  FIGURE_VIDEO_GUARD,
  type AnnotatedOutputProps,
  type RunSpan,
} from './annotatedOutput'
import { litBadge, litCard, PAINT, pad2 } from './annotatedSurface'

/**
 * CANDIDATE 1 — GUTTER MARKS
 *
 * The literal reading of `PEDAGOGY_GUIDELINES.md` section 5: *"Use `01/02/03`
 * numbered callouts rather than bullets when the callouts map to lines of code,
 * so the eye can pair them."* 25 occurrences in the corpus and no component, so
 * this is the one candidate that is simply the rule drawn.
 *
 * A numbered badge sits in a lane to the left of the panel, on the same
 * baseline as the line it marks, and the same number reappears in a legend
 * beneath. Numbers, not colour: `SyntaxBreakdown` records why, and it is that a
 * badge survives a projector and greyscale where a hue does not.
 *
 * The panel is the kit's `Terminal`, unmodified, both chromes and all four line
 * kinds. Nothing here reaches inside it: the badges are positioned from the
 * panel's BOTTOM edge, which is the one measurement that is the same in both
 * chromes. See the geometry note in `annotatedOutput.ts`.
 *
 * WORST AT: a run. Every member of the run gets its own number because the
 * gutter is line-oriented, so the fixture's three `Pushed` lines become 01, 02,
 * 03 and the legend has to collapse them back into one entry reading `01-03`.
 * That is the figure undoing its own work. It is at its best where each marked
 * line says something DIFFERENT.
 */

/** One legend entry. Built from the flat lines, so it cannot name a line twice. */
interface Entry {
  /** First and last number in this entry, inclusive. */
  first: number
  last: number
  label: string
  paint: string
  /** Present only on the entry that stands for a whole run. */
  count?: string
}

export function GutterMarks({
  path,
  nodes,
  chrome = 'vscode',
  fontSize = 14,
  caption,
  className = '',
}: AnnotatedOutputProps) {
  const { lines, runs } = flattenOutput(nodes)
  const total = lines.length
  const lh = lineHeightPx(fontSize)
  /* The badge is a hair shorter than one output line, so three consecutive
     badges cannot touch. Its type is `body-sm` (16px), the kit's smallest body
     token: the legend explains the panel, so it can never be harder to read
     than the panel. Nothing in this figure is set smaller than that. */
  const BADGE_H = Math.max(lh - 3, 20)

  /* WHICH LINES GET A NUMBER, derived and never declared: a line is marked if
     it carries its own `note` or if it belongs to a run. There is no list of
     indexes anywhere, which is the whole point of the contract. */
  const marks: { at: number; n: number; paint: string }[] = []
  const entries: Entry[] = []
  lines.forEach((flat, at) => {
    const exception = flat.line.role === 'exception'
    const marked = Boolean(flat.line.note) || Boolean(flat.run)
    if (!marked) return
    const paint = flat.run ? (exception ? PAINT.exception : PAINT.member) : PAINT.single
    const n = marks.length + 1
    marks.push({ at, n, paint })

    /* Extend the previous entry when this line is the SAME run and the SAME
       role as the line before it. `01-03` for three `Pushed` lines, and a
       separate entry for the `Mounted from` line, because the two are not the
       same claim. */
    const prev = entries[entries.length - 1]
    const prevFlat = lines[at - 1]
    const continues =
      prev &&
      prevFlat &&
      flat.run !== undefined &&
      prevFlat.run === flat.run &&
      prevFlat.line.role === flat.line.role &&
      !flat.line.note
    if (continues) {
      prev.last = n
      return
    }
    entries.push({
      first: n,
      last: n,
      paint,
      label: exception
        ? (flat.line.exceptionNote ?? flat.line.note ?? 'Not one of them')
        : (flat.line.note ?? flat.run?.label ?? ''),
      count: !exception && flat.run && !flat.line.note ? runLabelFor(runs, flat.runIndex) : undefined,
    })
  })

  const lines2 = lines.map((f) => ({ text: f.line.text, kind: f.line.kind }))

  return (
    <RevealGroup
      className={`${FIGURE_ROOT} max-w-[1060px] ${className}`}
      style={{ paddingTop: FIGURE_VIDEO_GUARD, paddingBottom: FIGURE_VIDEO_GUARD }}
      stagger={0.1}
    >
      <Reveal dir="up">
        {/* THE GUTTER LANE is reserved by padding on this row, so the badges sit
            BESIDE the panel and never over its text. A gutter drawn inside the
            panel would have to overlap `Terminal`'s own px-4 body padding. */}
        <div className="relative pl-[52px]">
          <Terminal path={path} lines={lines2} fontSize={fontSize} chrome={chrome} />
          {marks.map(({ at, n, paint }) => {
            const box = lineBox(fontSize, total, at)
            return (
              <span
                key={at}
                className="absolute left-0 grid place-items-center rounded-md font-body text-body-sm font-bold leading-none"
                style={{
                  ...litBadge(paint),
                  bottom: box.bottom + (box.height - BADGE_H) / 2,
                  height: BADGE_H,
                  width: 34,
                }}
              >
                {pad2(n)}
              </span>
            )
          })}
        </div>
      </Reveal>

      {/* THE LEGEND, in ONE grid, so no entry can land on top of another however
          wide the font renders. `SyntaxBreakdown`'s rule, and the reason it is
          DOM and not SVG: an <svg> is one rectangle to every harness here. */}
      <Reveal dir="up">
        <div
          className="mt-5 grid gap-3.5"
          style={{ gridTemplateColumns: `repeat(${entries.length}, minmax(0, 1fr))` }}
        >
          {entries.map((e, i) => (
            <div key={i} className="rounded-card px-4 py-3" style={litCard(e.paint)}>
              <p className="flex items-center gap-2">
                <span
                  className="grid shrink-0 place-items-center rounded-md font-body text-body-sm font-bold leading-none"
                  style={{ ...litBadge(e.paint), height: 24, minWidth: e.last > e.first ? 58 : 30 }}
                >
                  {e.last > e.first ? `${pad2(e.first)}-${pad2(e.last)}` : pad2(e.first)}
                </span>
                <span
                  className="font-heading text-body-sm font-bold leading-snug"
                  style={{ color: e.paint === PAINT.exception ? colors.tealDark : e.paint }}
                >
                  {e.label}
                </span>
              </p>
              {e.count && (
                <p className="mt-1 text-body-sm font-semibold" style={{ color: colors.body }}>
                  {e.count}
                </p>
              )}
            </div>
          ))}
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

/** The derived count for the run a marked line belongs to. Never passed in. */
function runLabelFor(runs: RunSpan[], runIndex?: number): string | undefined {
  if (runIndex === undefined) return undefined
  const span = runs[runIndex]
  return span ? runCountLabel(span) : undefined
}
