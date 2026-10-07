import { Step } from '@/motion/Stepper'
import { Reveal, RevealGroup } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import { iconByName } from '@/ui/icons'
import { VERDICT, type VerdictFigureProps } from './contract'

/**
 * VARIANT 2 — LEDGER ROWS. The verdict is a COLUMN, not a property of the row.
 *
 * Every verdict is drawn in the same 118px gutter on the left, solid-filled
 * rather than tinted, with the glyph and the word stacked inside it. The content
 * sits on plain white to its right.
 *
 * WHY A COLUMN CHANGES THE READING. When the verdict lives on the row's own
 * surface, a learner reads four rows and works out the pattern. When it lives in
 * a column, the pattern is already drawn: the eye runs down the gutter and sorts
 * the set before reading a word of it. That is the difference between a list
 * that happens to be colour coded and a ledger.
 *
 * BEST AT: five or six rows, and any set where the MIX is the point. The solid
 * fill is the strongest greyscale separation of any variant here, because a
 * 600-step fill and white are far apart in a way that two 100-step tints are not.
 *
 * WORST AT: short sets. Two rows leave a 118px column of colour doing almost
 * nothing, and it looks like a table missing its other rows. It also spends the
 * most horizontal space of any variant, leaving 560px for the content column
 * against `RailRows`'s 640px, so a 60-character claim wraps here and does not
 * there.
 */
export function LedgerRows({ items, immediate = false, className = '' }: VerdictFigureProps) {
  const Row = immediate ? Reveal : Step
  const Wrapper = immediate ? RevealGroup : 'div'
  return (
    <Wrapper
      {...(immediate ? ({ stagger: 0.08 } as const) : {})}
      className={`overflow-hidden rounded-card ring-1 ring-line ${className}`}
    >
      {items.map((item, i) => {
        const v = VERDICT[item.verdict]
        const Icon = iconByName[v.icon]
        return (
          <Row
            key={i}
            dir="up"
            className={`flex items-stretch bg-white ${i > 0 ? 'border-t border-line' : ''}`}
          >
            {/* The gutter. Solid, not tinted: this is the column the eye runs down. */}
            <span
              className={`flex w-[118px] shrink-0 flex-col items-center justify-center gap-1 px-2 py-4 text-white ${v.solid}`}
            >
              <Icon width={22} height={22} />
              <span className="text-[12px] font-bold uppercase tracking-wide">
                {item.label ?? v.word}
              </span>
            </span>
            <span className="min-w-0 flex-1 px-5 py-4">
              <span className="block text-body-lg font-medium text-ink">{item.claim}</span>
              {item.reason && (
                <span className="mt-1 block text-body-sm" style={{ color: colors.body }}>
                  {item.reason}
                </span>
              )}
            </span>
          </Row>
        )
      })}
    </Wrapper>
  )
}
