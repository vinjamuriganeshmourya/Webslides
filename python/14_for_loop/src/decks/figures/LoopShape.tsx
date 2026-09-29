import { colors } from '@/design/tokens'
import { LoopGutter } from './loopArrow'

/**
 * THE SHAPE OF A `for` STATEMENT: the header line, the INDENT, the block that
 * repeats, and the arrow that goes back up.
 *
 * WHY, in the reviewer's words on this session: *"the Repeating block of code
 * block and arrow and indentation is not represented."* Course rule R5c item 7
 * makes it general: a construct is drawn with its block, its arrow and its
 * indentation, because the shape IS the lesson. A learner meeting `for` for the
 * first time is not confused about the word `for`; they are confused about how
 * far the loop reaches, and the only honest answer is a picture of the
 * indentation.
 *
 * WHY NOT `SyntaxBreakdown`. That figure is the kit's grammar diagram and it is
 * the right one for "what are the slots in this line" — this deck already uses
 * it for exactly that, and for `range(n)` and `range(start, end)`. It draws ONE
 * LINE and its captions. It has no body, no indent and no back edge, which is
 * the whole of what is being shown here, and widening its contract to carry a
 * block would make every other call site pay for a concept it does not have.
 *
 * So this borrows `SyntaxBreakdown`'s two load-bearing decisions rather than its
 * markup: the parts are chips in the ramp's colours, and **it is DOM, never
 * SVG** (content rule 17, and that file's own header on the two session 4
 * figures that shipped with overlapping labels while every harness reported
 * clean).
 *
 * THE INDENT IS DRAWN AS A GUTTER, not as padding, because padding is invisible.
 * The reference deck gives the four spaces their own tinted block to the left of
 * the body, so "the body is set in from the `for`" is something the room can
 * see rather than something it is told.
 */

/** The header line's slots. `name` is the one the learner chooses. */
export function LoopShape({
  variable,
  sequence,
  blockLabel = 'Repeating block of code',
  className = '',
}: {
  /** The loop variable, `each_item` or `each_number`. */
  variable: string
  /** The sequence expression, `sequence` or `sequence_of_numbers`. */
  sequence: string
  blockLabel?: string
  className?: string
}) {
  return (
    <div
      className={`grid items-center gap-x-2 gap-y-2.5 ${className}`}
      style={{ gridTemplateColumns: '34px 1fr' }}
    >
      {/* ── the header line ─────────────────────────────────────────── */}
      <LoopGutter role="end" className="h-full self-stretch" />
      <div className="flex flex-wrap items-center gap-x-2 font-mono text-[21px] font-bold leading-none">
        <Chip text="for" paint={colors.brand} />
        <Chip text={variable} paint={colors.tealDark} dashed />
        <Chip text="in" paint={colors.brand} />
        <Chip text={sequence} paint={colors.accentDark} dashed />
        <span style={{ color: colors.ink }}>:</span>
      </div>

      {/* ── the indent, then the block that repeats ─────────────────── */}
      <LoopGutter role="start" className="h-full self-stretch" />
      <div className="flex items-stretch">
        {/*
          FOUR SPACES, DRAWN. The width is the mono face's four characters at
          this size, so the block starts exactly where a typed body would.
        */}
        <span
          className="w-[52px] shrink-0 rounded-l-card border border-r-0"
          style={{ background: colors.surface, borderColor: colors.line }}
          aria-hidden
        />
        <span
          className="flex-1 rounded-r-card border px-5 py-6 text-center"
          style={{ background: `${colors.brand}14`, borderColor: `${colors.brand}59` }}
        >
          <span className="font-mono text-[17px] font-semibold leading-none" style={{ color: colors.brandDeep }}>
            {blockLabel}
          </span>
        </span>
      </div>
    </div>
  )
}

/**
 * One token of the header line, on its own chip.
 *
 * The text sits in an inner tight-leading span: `align-check.mjs` infers a
 * wrapped token by comparing an element's height to its line-height, and a
 * padded chip carrying text directly measures as two lines. `SyntaxBreakdown`
 * and `MonoBadge` both record the same false positive and fix it the same way.
 */
function Chip({ text, paint, dashed = false }: { text: string; paint: string; dashed?: boolean }) {
  return (
    <span
      className={`flex items-center rounded-md px-2.5 py-1.5 ${dashed ? 'border-2 border-dashed' : ''}`}
      style={{ background: `${paint}1f`, color: paint, ...(dashed ? { borderColor: paint } : {}) }}
    >
      <span className="leading-none">{text}</span>
    </span>
  )
}
