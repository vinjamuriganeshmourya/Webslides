import { Step } from '@/motion/Stepper'
import { Reveal, RevealGroup } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import { iconByName } from '@/ui/icons'
import { VERDICT, type VerdictFigureProps } from './contract'

/**
 * VARIANT 1 — RAIL ROWS. The kit's current `StatusList`, reproduced here as the
 * baseline the other four are arguing against.
 *
 * Its claim: a verdict is a property OF a row, so it is carried by the row's own
 * surface. A coloured rail, a tinted fill, a glyph and a word, all saying the
 * same thing four times.
 *
 * BEST AT: three or four rows of mixed verdicts, read at distance. The tint
 * blocks are large enough to be sorted by colour from the back of a room before
 * a single word is read, which is the fastest any of these variants conveys the
 * SHAPE of the set.
 *
 * WORST AT: everything being equally loud. Four tinted blocks is four coloured
 * rectangles stacked, and a set that is mostly one verdict reads as a solid
 * field of colour with no figure in it. It is also the most expensive per row in
 * vertical space, at roughly 84px, so six rows do not fit the content well.
 */
export function RailRows({ items, immediate = false, className = '' }: VerdictFigureProps) {
  const Row = immediate ? Reveal : Step
  const Wrapper = immediate ? RevealGroup : 'div'
  return (
    <Wrapper
      {...(immediate ? ({ stagger: 0.08 } as const) : {})}
      className={`space-y-3.5 ${className}`}
    >
      {items.map((item, i) => {
        const v = VERDICT[item.verdict]
        const Icon = iconByName[v.icon]
        return (
          <Row
            key={i}
            dir="up"
            className={`flex items-start gap-4 rounded-card border-l-[5px] px-5 py-4 ${v.border} ${v.tint}`}
          >
            <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/70 ${v.ink}`}>
              <Icon width={20} height={20} />
            </span>
            <span className="min-w-0 flex-1 pt-0.5">
              <span className="block text-body-lg font-medium text-ink">{item.claim}</span>
              {item.reason && (
                <span className="mt-0.5 block text-body-sm" style={{ color: colors.body }}>
                  {item.reason}
                </span>
              )}
            </span>
            <span
              className={`mt-1 shrink-0 rounded-pill bg-white/70 px-2.5 py-0.5 text-[13px] font-bold uppercase tracking-wide ${v.ink}`}
            >
              {item.label ?? v.word}
            </span>
          </Row>
        )
      })}
    </Wrapper>
  )
}
