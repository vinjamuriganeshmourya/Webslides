import { Step } from '@/motion/Stepper'
import { Reveal, RevealGroup } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import { iconByName } from '@/ui/icons'
import { VERDICT, type VerdictFigureProps } from './contract'

/**
 * VARIANT 3 — MARGIN VERDICT. No container at all.
 *
 * The verdict is a word set in its own colour in a left margin, with the glyph
 * above it, and a hairline rule separating one row from the next. Nothing is
 * filled, nothing is boxed.
 *
 * WHY REMOVING THE BOX IS AN ARGUMENT. A tint says "this row is a thing you
 * should notice". Four tints say it four times and the emphasis cancels out.
 * This variant spends its contrast on TYPE instead: the claim is the largest
 * thing on the slide, the verdict word is the boldest, and the reason is quiet
 * grey. A learner reads the claims first and the verdicts second, which is the
 * right order whenever the claims are the teaching and the verdicts are the
 * sorting.
 *
 * BEST AT: six or more rows, and dense content. At roughly 62px a row it is the
 * cheapest variant here by a wide margin, and it is the only one that can put
 * seven judgements in the content well without shrinking the type.
 *
 * WORST AT: being seen. With no fill there is nothing to sort by colour from the
 * back of a room, so the set has to be READ rather than scanned, and a room that
 * is skimming will skim past the one red row. Never reach for it when a single
 * row is the point of the slide.
 */
export function MarginVerdict({ items, immediate = false, className = '' }: VerdictFigureProps) {
  const Row = immediate ? Reveal : Step
  const Wrapper = immediate ? RevealGroup : 'div'
  return (
    <Wrapper
      {...(immediate ? ({ stagger: 0.08 } as const) : {})}
      className={`${className}`}
    >
      {items.map((item, i) => {
        const v = VERDICT[item.verdict]
        const Icon = iconByName[v.icon]
        return (
          <Row
            key={i}
            dir="up"
            className={`flex items-start gap-6 py-4 ${i > 0 ? 'border-t border-line' : ''}`}
          >
            <span className={`flex w-[92px] shrink-0 flex-col items-center gap-1 pt-0.5 ${v.ink}`}>
              <Icon width={24} height={24} />
              <span className="text-[12px] font-bold uppercase tracking-wide">
                {item.label ?? v.word}
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-body-lg font-semibold text-ink">{item.claim}</span>
              {item.reason && (
                <span className="mt-0.5 block text-body-sm" style={{ color: colors.body }}>
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
