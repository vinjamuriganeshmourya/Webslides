import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import './motion'
import { useCount, useTween } from '@/ui'
import { StepControls } from './controls'
import { useInstant } from '@/motion/instant'

/**
 * SAY WHERE IT GOES, THEN DROP IT.
 *
 * PF 15 slide 3, the recap of `range(2, 6)`. Five numbers wait in a row above
 * two bins. The room calls where each one belongs BEFORE the press; each press
 * of `Drop it` moves the next number into its bin with the one sentence that
 * says why. Opens with nothing dropped, the reference's `0 / 5`.
 *
 * The side each number goes to is the real behaviour of `range(2, 6)`, which
 * gives 2, 3, 4, 5: 2, 5 and 4 are in it, 1 and 6 are not.
 */
export interface DropItem {
  value: string
  side: 'in' | 'out'
  why: ReactNode
}

export function SortDrop({ items, bins }: { items: DropItem[]; bins: { in: string; out: string } }) {
  const n = useCount(items.length)
  const tween = useTween(480)
  const instant = useInstant()
  const dropped = items.slice(0, n)
  const bin = (side: 'in' | 'out') => (
    <div
      className="flex min-h-[292px] flex-1 flex-col gap-3 rounded-card bg-white/80 p-5"
      style={{ border: `2px dashed ${side === 'in' ? colors.brand : colors.line}` }}
    >
      <p className="font-heading text-[24px] font-bold" style={{ color: colors.ink }}>{bins[side]}</p>
      {dropped.map((it, i) =>
        it.side === side ? (
          <div
            key={i}
            /* the number that just left the row settles into its bin, from above, where it came from */
            className={`flex items-center gap-4 rounded-xl px-3 py-2 ${instant ? '' : 'sm-rise'}`}
            style={{ background: side === 'in' ? colors.surface2 : colors.surface }}
          >
            <span
              className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-xl bg-white font-mono text-[28px] font-bold"
              style={{
                color: side === 'in' ? colors.brandDark : colors.muted,
                boxShadow: `inset 0 0 0 2px ${side === 'in' ? colors.brand : colors.line}`,
              }}
            >
              {it.value}
            </span>
            <span className="text-[19px] leading-snug" style={{ color: colors.body }}>{it.why}</span>
          </div>
        ) : null,
      )}
    </div>
  )
  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex h-[60px] items-center gap-3">
          {items.map((it, i) => (
            <span
              key={i}
              className="grid h-[60px] w-[60px] place-items-center rounded-2xl bg-white font-mono text-[30px] font-semibold shadow-card-soft"
              style={{
                color: colors.ink,
                boxShadow: `inset 0 0 0 2px ${colors.line}`,
                transition: tween,
                opacity: i < n ? 0 : 1,
                transform: i < n ? 'translateY(24px) scale(0.8)' : 'none',
              }}
            >
              {it.value}
            </span>
          ))}
        </div>
        <div className="flex gap-5">
          {bin('in')}
          {bin('out')}
        </div>
      </div>
      <StepControls at={n} first={0} total={items.length} nextLabel="Drop it" />
    </>
  )
}
