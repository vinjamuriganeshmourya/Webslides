import { Fragment } from 'react'
import { LoopGutter, loopRole } from './loopArrow'

/**
 * A CODE PANEL THAT NAMES ITS OWN LINES, IN PLACE.
 *
 * WHY IT EXISTS. Course rule R5c item 6, given as review feedback on this
 * session: *"in the reference it was highlight line and represented as
 * initialization termination logic and updation, where in yours it was given
 * separately which is not helping in pure focus."* The first cut put the three
 * names in a `CardGrid` under the panel, so the room had to hold a name in its
 * head, look back up, and find the line it belonged to. The reference deck ties
 * each name to its line with a band and an arrow, and the tie is the teaching.
 *
 * WHY IT IS NOT `CodeBlock` + A RAIL. `CodeBlock` owns its own `<pre>`, so a
 * label column beside it can only be aligned by guessing the panel's header
 * height, its padding and its line-height. Three magic numbers that a font
 * change silently invalidates. Here the label sits in the SAME GRID ROW as the
 * line it names, so the alignment is structural: it cannot drift, and there is
 * no arithmetic to get wrong.
 *
 * WHAT IT IS NOT. Not a general replacement for `CodeBlock` (a file) or
 * `CodeOutput` (a run beside what it printed) or `SyntaxBreakdown` (the shape of
 * a construct, with no real values in it). Reach for this only when the claim is
 * *"these particular lines are the ones doing X"*.
 *
 * THE HIGHLIGHTER IS DELIBERATELY SMALL AND LOCAL. `CodeBlock`'s tokenizer is
 * not exported, and `src/ui/` is kit-owned, so adding an export there would be
 * overwritten by the next `sync-kit.mjs --apply`. This covers the Python this
 * deck actually shows: keywords, strings, numbers and call names, with
 * `CodeBlock`'s own palette so the two panels sit on one slide without looking
 * like two products.
 */

const KEYWORDS = new Set(['for', 'while', 'in', 'if', 'else', 'elif', 'not', 'and', 'or', 'True', 'False', 'None'])

/** `CodeBlock`'s palette, so a panel of each kind can share a slide. */
const INK = {
  comment: '#6B87A8',
  string: '#7FE3D8',
  number: '#FFB055',
  keyword: '#7FA6FF',
  func: '#4C80FF',
  plain: 'rgba(255,255,255,0.9)',
}

const TOKEN = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+\b)|([A-Za-z_]\w*)|([^A-Za-z0-9_"']+|.)/g

function paint(line: string) {
  const out: React.ReactNode[] = []
  let m: RegExpExecArray | null
  let key = 0
  TOKEN.lastIndex = 0
  while ((m = TOKEN.exec(line)) !== null) {
    const [full, str, num, ident] = m
    if (str) out.push(<span key={key++} style={{ color: INK.string }}>{str}</span>)
    else if (num) out.push(<span key={key++} style={{ color: INK.number }}>{num}</span>)
    else if (ident && KEYWORDS.has(ident))
      out.push(<span key={key++} style={{ color: INK.keyword, fontWeight: 600 }}>{ident}</span>)
    else if (ident && line[TOKEN.lastIndex] === '(')
      out.push(<span key={key++} style={{ color: INK.func }}>{ident}</span>)
    else out.push(<Fragment key={key++}>{full}</Fragment>)
  }
  return out
}

export interface CodeAnnotation {
  /** 1-based line number. The label is drawn in that line's own row. */
  line: number
  /** What that line IS: "Initialization", "Termination condition", "Updation". */
  label: string
}

/**
 * The label ramp, in the panel's own palette rather than the slide's.
 *
 * The brand ramp is chosen to read as ink on white; on `night-2` the same hues
 * go muddy, and `align-check` cannot see contrast. These three are the colours
 * the code itself is already painted in, so they are known to carry.
 */
const RAMP = [INK.keyword, INK.string, INK.number]

export function AnnotatedCode({
  code,
  filename,
  annotations = [],
  highlight = [],
  loopBack,
  showLineNumbers = true,
  fontSize = 16,
  className = '',
}: {
  code: string
  /** Content rule 31a: the language, never an invented file name. */
  filename: string
  annotations?: CodeAnnotation[]
  /** Extra lines to tint that carry no label of their own. */
  highlight?: number[]
  /** The loop-back run: `to` is the `for`/`while` line, `from` the last body line. */
  loopBack?: { from: number; to: number }
  showLineNumbers?: boolean
  fontSize?: number
  className?: string
}) {
  const lines = code.replace(/\n$/, '').split('\n')
  const labelOf = new Map(annotations.map((a, i) => [a.line, { ...a, paint: RAMP[i % RAMP.length] }]))
  const tinted = new Set([...highlight, ...annotations.map((a) => a.line)])

  /* The column track is built from what this call actually has, so a panel with
     no gutter and no labels is an ordinary two-column code panel and carries no
     empty columns for `align-check` to measure. */
  const cols = [
    showLineNumbers ? 'auto' : null,
    loopBack ? '34px' : null,
    '1fr',
    annotations.length ? 'auto' : null,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`overflow-hidden rounded-card bg-night-2 shadow-card ${className}`}>
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        <span className="ml-2 font-mono text-body-sm text-white/60">{filename}</span>
        <span className="ml-auto rounded-pill bg-white/10 px-2 py-0.5 font-mono text-xs uppercase tracking-wide text-white/50">
          python
        </span>
      </div>

      {/*
        ONE GRID FOR THE WHOLE PANEL, not one per line. A row's cells share a
        baseline because they are in the same grid row, which is the entire
        reason this component exists, and the tint is painted per cell so it
        runs the full width of the row without a wrapper element that
        `align-check` would read as an untextual box around text.
      */}
      <div
        className="grid items-center px-4 py-4 font-mono leading-relaxed"
        style={{ gridTemplateColumns: cols, fontSize, lineHeight: 1.7 }}
      >
        {lines.map((line, i) => {
          const n = i + 1
          const note = labelOf.get(n)
          const tint = tinted.has(n) ? { background: 'rgba(11,95,255,0.22)' } : undefined
          const role = loopRole(n, loopBack)
          return (
            <Fragment key={n}>
              {showLineNumbers && (
                <span className="select-none pr-4 text-right text-white/25" style={tint}>
                  {n}
                </span>
              )}
              {loopBack && <LoopGutter role={role} className="h-full self-stretch" />}
              <span className="whitespace-pre pl-2 pr-4" style={{ ...tint, color: INK.plain }}>
                {line ? paint(line) : ' '}
              </span>
              {annotations.length > 0 && (
                <span className="flex items-center justify-start gap-2 pl-6" style={tint}>
                  {note && (
                    <>
                      <span className="font-body text-[16px] leading-none" style={{ color: note.paint }}>
                        {'\u2192'}
                      </span>
                      {/* The text sits in its own tight-leading span, inside the
                          padded pill. `align-check.mjs` divides a text element's
                          height by its line-height to spot a wrapped token, and a
                          padded box carrying text directly measures as two lines.
                          `SyntaxBreakdown` and `MonoBadge` both record the same
                          false positive and solve it the same way. */}
                      <span
                        className="inline-flex items-center rounded-pill px-3 py-1"
                        style={{ background: `${note.paint}26` }}
                      >
                        <span
                          className="font-heading text-[16px] font-bold leading-none"
                          style={{ color: note.paint }}
                        >
                          {note.label}
                        </span>
                      </span>
                    </>
                  )}
                </span>
              )}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
