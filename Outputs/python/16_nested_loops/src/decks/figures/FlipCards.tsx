import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useCount } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'

/**
 * SAY YOUR ANSWER FIRST, THEN TURN THE CARD OVER. PF 16 slide 3.
 *
 * Three questions face up on three cards. `Turn it over` flips the NEXT card,
 * one per press, three presses, and then disables; `Replay` turns them all
 * back. Measured on the reference, which does exactly this.
 *
 * The flips are the deck's BUILD STEPS (`useCount`, opening at 0 of 3), so the
 * arrow key and the on-slide button press the same step and `?all` opens every
 * card for the harnesses. The first cut kept the flips as local state, and the
 * arrow keys walked past the slide without turning a card (review,
 * 2026-10-01).
 *
 * The flip is a turn on the card's own vertical axis, transform only, at the
 * explanatory tier. During an instant jump it lands flipped with no motion.
 */
export interface FlipCard {
  question: ReactNode
  answer: ReactNode
  why: ReactNode
}

const HOUSE = 'cubic-bezier(0.22, 1, 0.36, 1)'

export function FlipCards({ cards }: { cards: FlipCard[] }) {
  const instant = useInstant()
  const n = useCount(cards.length)
  return (
    <>
      <div className="grid grid-cols-3 gap-5" style={{ perspective: 1400 }}>
        {cards.map((c, i) => {
          const over = i < n
          return (
            <div key={i} className="relative h-[250px]" style={{ transformStyle: 'preserve-3d', transform: over ? 'rotateY(180deg)' : 'none', transition: instant ? 'none' : `transform 680ms ${HOUSE}` }}>
              {/* the question face */}
              <div className="absolute inset-0 flex flex-col rounded-card bg-white px-6 py-5 shadow-card-soft ring-1 ring-line" style={{ backfaceVisibility: 'hidden' }}>
                <span className="grid h-8 w-8 place-items-center rounded-full font-mono text-[16px] font-bold text-white" style={{ background: colors.brand }}>
                  {i + 1}
                </span>
                <p className="mt-5 text-[21px] leading-snug [&_code]:font-mono [&_code]:text-[19px]" style={{ color: colors.ink }}>
                  {c.question}
                </p>
              </div>
              {/* the answer face, pre-turned so it reads the right way round once the card is over */}
              <div className="absolute inset-0 flex flex-col rounded-card px-6 py-5 shadow-card-soft" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: '#E9F8EF', boxShadow: `inset 0 0 0 2px ${colors.success}` }}>
                <span className="grid h-8 w-8 place-items-center rounded-full font-mono text-[16px] font-bold text-white" style={{ background: colors.success }}>
                  {i + 1}
                </span>
                <p className="mt-5 font-mono text-[30px] font-bold leading-none" style={{ color: '#137A3A' }}>
                  {c.answer}
                </p>
                <p className="mt-4 text-[18px] leading-snug" style={{ color: colors.body }}>
                  {c.why}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <StepControls at={n} first={0} total={cards.length} nextLabel="Turn it over" />
    </>
  )
}
