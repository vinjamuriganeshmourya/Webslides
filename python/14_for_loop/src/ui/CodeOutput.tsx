import type { ReactNode } from 'react'
import { CodeBlock } from './CodeBlock'
import { Reveal, RevealGroup } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import { T } from './figureTiming'

/**
 * A snippet, and what running it printed.
 *
 * THE GAP THIS FILLS
 *
 * The kit had two panels and neither of them could say "and this came out".
 * `CodeBlock` is a FILE: traffic lights, a filename, line numbers. `Terminal` is
 * VS Code's panel, where the command and its output share one scrollback and the
 * folder path is teaching content (hard rule 3). Neither is what a language
 * lesson needs, which is a two-part claim: *this* text, run, produces *that*
 * text. Thirteen slides of the first Python session needed exactly that, and the
 * source PPTX drew it by hand as a pair of rounded rectangles every single time.
 *
 * WHAT IT MUST NOT BE USED FOR
 *
 *   - A command the learner types at a shell. That is `Terminal`, with its path.
 *   - The SHAPE of a construct. That is `SyntaxBreakdown` / `CodeSyntaxSlide`.
 *   - A file that grows across slides. That is `CodeBuildSlide`.
 *
 * HONESTY
 *
 * `output` is what the program actually printed. Every string passed to it in
 * the Python course was produced by running the snippet on CPython 3.12; a
 * composed output is the one thing this component makes easy and must never
 * carry.
 *
 * WHERE THE CODE LIVES
 *
 * Hard rule 31: every code panel says where the code lives or runs. `location`
 * is the code panel's title bar text, and a deck should always pass it
 * (`Code Playground · main.py`). It is optional only so a two-pane compare can
 * name its panes with `label` instead of repeating the location twice.
 *
 * LAYOUT
 *
 * One pane renders code and output side by side, which is the widest the well
 * gets and keeps both at a readable size. Two panes render as two columns, each
 * stacked code-over-output, because two side-by-side pairs would be four panels
 * in a row and none of them legible from the back of a room.
 *
 * `layout="stack"` gives a SINGLE pane the full width instead, code above output.
 * Reach for it when the output is wide rather than tall: a traceback runs to
 * about 62 characters on its `NameError:` line, which at 14px in a half-width
 * column wraps mid-token. `align-check.mjs` reported exactly that on two slides
 * of the first Python session, and the fix is width, not a smaller font, because
 * the font was already at 14px and the line is real output that may not be cut.
 */

export interface CodeOutputPane {
  /** Names what this pane IS, when there are two to tell apart: "Java", "In quotes". */
  label?: ReactNode
  /** A logo beside the label. `/assets/tech/java.png`. */
  logo?: string
  /** Where the code lives or runs. Rendered in the code panel's title bar (rule 31). */
  location?: string
  code: string
  /** Exactly what the program printed. Never composed. */
  output: string
  /** `error` renders the output as a failure rather than a result. */
  kind?: 'result' | 'error'
  language?: string
  /** Line numbers. Off by default: a one-line program does not need a gutter. */
  showLineNumbers?: boolean
}

const OUT_INK = { result: colors.ink, error: colors.danger } as const

function OutputPanel({
  className = '',
  output,
  kind = 'result',
  fontSize,
}: {
  className?: string
  output: string
  kind?: 'result' | 'error'
  fontSize?: number
}) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-card border border-line bg-white shadow-card-soft ${className}`}>
      <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-2">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: kind === 'error' ? colors.danger : colors.success }}
        />
        <span className="font-heading text-body-sm font-bold uppercase tracking-wider text-body">
          {kind === 'error' ? 'Error' : 'Output'}
        </span>
      </div>
      {/*
        ONE `<div>` PER LINE, EACH `whitespace-pre`.

        A traceback's leading spaces are load-bearing: the `^^^^` line is only
        meaningful sitting under the token it points at, so nothing here may
        re-wrap and the panel scrolls horizontally instead. The first version
        was one `<pre>`; `align-check.mjs` measures a text element's height
        against its line-height and reported a three-line output as one token
        wrapped over three lines. One element per line is what the check can
        read, and the columns survive because every line is `whitespace-pre`.

        THE PADDING IS ON THE WRAPPER, NOT ON THE `<pre>`.

        With `px-4 py-3` on the pre itself, the pre's box is 24px taller than its
        text, and `align-check.mjs` divides a text block's height by its computed
        line-height to spot a token that has wrapped. A one-line output then
        measured as two lines and nine slides were reported WRAPPED for printing
        the single character `7`. The pre now hugs its own text exactly.
      */}
      <div
        className="overflow-x-auto px-4 py-2 font-mono leading-snug"
        style={{ color: OUT_INK[kind], fontSize: fontSize ?? 17, lineHeight: 1.6 }}
      >
        {/* ONE ELEMENT PER LINE, each `whitespace-pre` so leading spaces and
            carets keep their columns. A single multi-line `<pre>` reads to
            `align-check.mjs` as one token wrapped over n lines. */}
        {output.split('\n').map((line, i) => (
          <div key={i} className="whitespace-pre">
            {line || ' '}
          </div>
        ))}
      </div>
    </div>
  )
}

function PaneLabel({ label, logo }: { label?: ReactNode; logo?: string }) {
  if (!label && !logo) return null
  return (
    <div className="mb-1 flex items-center gap-2">
      {logo && <img src={logo} alt="" aria-hidden className="h-6 w-6 object-contain" />}
      {label && (
        <span className="font-heading text-body-sm font-bold uppercase tracking-wider text-body">
          {label}
        </span>
      )}
    </div>
  )
}

/** The run arrow. A glyph, not SVG text, so nothing can collide inside it. */
function RunArrow({ dir }: { dir: 'right' | 'down' }) {
  return (
    <Reveal dir="fade" className="flex shrink-0 items-center justify-center">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full text-white"
        style={{ background: colors.brand }}
        aria-hidden
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          {dir === 'right' ? <path d="M5 12h13M13 6l6 6-6 6" /> : <path d="M12 5v13M6 13l6 6 6-6" />}
        </svg>
      </span>
    </Reveal>
  )
}

export function CodeOutput({
  panes,
  outputFontSize,
  codeFontSize,
  layout = 'row',
  className = '',
}: {
  /** One pane, or two to compare. Three would be unreadable at 1280x720. */
  panes: CodeOutputPane[]
  /** Smaller code, for a two-pane comparison whose taller half runs six lines. */
  codeFontSize?: number
  outputFontSize?: number
  /** Single-pane only: `stack` puts output UNDER code at full width. */
  layout?: 'row' | 'stack'
  className?: string
}) {
  const two = panes.length > 1

  if (two) {
    /*
      ONE GRID FOR BOTH PANES, not two independent columns.

      Stacked per pane, a three-line program beside a six-line one gave two code
      boxes of different heights, so the run arrows sat at different heights and
      the two output panels began and ended in different places. The whole point
      of this layout is that the room COMPARES the two, and a comparison whose
      halves do not line up makes the reader do the aligning.

      Cells are emitted row by row (both labels, both code panels, both arrows,
      both outputs), so each row sizes to its taller cell and the two columns
      share it. `h-full` lets the shorter panel grow into the row rather than
      sit in the top of it.
    */
    return (
      <RevealGroup
        stagger={T.stagger}
        delayChildren={T.lead}
        className={`grid grid-cols-2 items-stretch gap-x-6 ${className}`}
      >
        {panes.slice(0, 2).map((p, i) => (
          <Reveal key={`label-${i}`} dir="up">
            <PaneLabel label={p.label} logo={p.logo} />
          </Reveal>
        ))}
        {panes.slice(0, 2).map((p, i) => (
          <Reveal key={`code-${i}`} dir="up" className="h-full">
            <CodeBlock
              className="h-full"
              code={p.code}
              filename={p.location}
              language={p.language ?? 'python'}
              showLineNumbers={p.showLineNumbers ?? false}
              fontSize={codeFontSize ?? 16}
            />
          </Reveal>
        ))}
        {panes.slice(0, 2).map((_, i) => (
          <Reveal key={`arrow-${i}`} dir="fade">
            <div className="my-0.5 flex justify-center">
              <RunArrow dir="down" />
            </div>
          </Reveal>
        ))}
        {panes.slice(0, 2).map((p, i) => (
          <Reveal key={`out-${i}`} dir="up" className="h-full">
            <OutputPanel
              className="h-full"
              output={p.output}
              kind={p.kind}
              fontSize={outputFontSize ?? 16}
            />
          </Reveal>
        ))}
      </RevealGroup>
    )
  }

  const p = panes[0]

  if (layout === 'stack') {
    return (
      <RevealGroup
        stagger={T.stagger}
        delayChildren={T.lead}
        className={`flex w-full flex-col ${className}`}
      >
        <Reveal dir="up">
          <PaneLabel label={p.label} logo={p.logo} />
          <CodeBlock
            code={p.code}
            filename={p.location}
            language={p.language ?? 'python'}
            showLineNumbers={p.showLineNumbers ?? false}
          />
        </Reveal>
        <div className="my-0.5 flex justify-center">
          <RunArrow dir="down" />
        </div>
        <Reveal dir="up">
          <OutputPanel output={p.output} kind={p.kind} fontSize={outputFontSize} />
        </Reveal>
      </RevealGroup>
    )
  }

  return (
    <RevealGroup
      stagger={T.stagger}
      delayChildren={T.lead}
      className={`flex items-center gap-5 ${className}`}
    >
      <Reveal dir="up" className="min-w-0 flex-1">
        <PaneLabel label={p.label} logo={p.logo} />
        <CodeBlock
          code={p.code}
          filename={p.location}
          language={p.language ?? 'python'}
          showLineNumbers={p.showLineNumbers ?? false}
        />
      </Reveal>
      <RunArrow dir="right" />
      <Reveal dir="up" className="min-w-0 flex-1">
        <OutputPanel output={p.output} kind={p.kind} fontSize={outputFontSize} />
      </Reveal>
    </RevealGroup>
  )
}
