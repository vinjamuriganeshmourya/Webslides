import { useLayoutEffect, useRef } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Group } from './common'
import { Show } from './pieces'
import { DeckLine } from './DictCards'
import { flyFrom } from './rows'
import { SPEC } from './spec'

/**
 * C9 · WHEN TO USE THEM: SORT FIVE JOBS. Seven presses.
 *
 * Three bins and five job cards, all on screen from press 1. One card per
 * press flies to its bin (the room has voted by hands first) and shows its
 * def line only when it lands. The last press is the deck's note: use
 * variable length arguments only when you cannot say how many.
 */
const C9 = SPEC.C9
type Item = { job: string; def: string; bin: string }
const ITEMS: Item[] = C9.data.items
const BINS: string[] = (C9.show as string[]).slice(0, 3)
const NOTE: string = C9.show[8]

/** A card that has just landed: it flies in from its place in the stack, its def line under the job. */
function Landed({ item, from, fly }: { item: Item; from: HTMLElement | null; fly: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const instant = useInstant()
  useLayoutEffect(() => {
    if (fly && !instant) flyFrom(ref.current, from, 820)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div ref={ref} className="flex flex-col gap-1 rounded-lg bg-white px-2.5 py-1.5" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}, 0 4px 10px -8px rgba(16,32,58,0.35)` }}>
      <span className="text-[13px] font-semibold leading-snug" style={{ color: colors.ink }}>
        {item.job}
      </span>
      <span className="whitespace-nowrap font-mono text-[12.5px] font-bold" style={{ color: colors.brandDark }}>
        {item.def}
      </span>
    </div>
  )
}

export function Bins() {
  const beat = useBeats(7)
  const landed = Math.min(Math.max(beat - 1, 0), ITEMS.length)
  const cur = landed >= 1 ? ITEMS[landed - 1] : null
  const stack = useRef<(HTMLDivElement | null)[]>([])
  const tween = useTween(420)
  return (
    <>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-stretch gap-3">
          <Group pad={10} className="flex w-[400px] shrink-0 flex-col gap-2" active={beat === 1}>
            {ITEMS.map((it, i) => {
              const gone = i < landed
              return (
                <div
                  key={it.job}
                  ref={(el) => {
                    stack.current[i] = el
                  }}
                  className="flex min-h-[52px] items-center rounded-lg px-3 py-1.5 text-[15px] font-semibold leading-snug"
                  style={{
                    background: gone ? 'transparent' : colors.white,
                    color: gone ? 'transparent' : colors.ink,
                    boxShadow: gone ? 'none' : `inset 0 0 0 1.5px ${colors.line}, 0 4px 10px -8px rgba(16,32,58,0.35)`,
                    outline: gone ? `1.5px dashed ${colors.line}` : 'none',
                    outlineOffset: -1.5,
                    transition: tween,
                  }}
                >
                  {it.job}
                </div>
              )
            })}
          </Group>
          <Group pad={10} className="grid min-w-0 flex-1 grid-cols-3 gap-3" active={landed >= 1}>
            {BINS.map((bin) => {
              const lit = cur?.bin === bin
              return (
                <div key={bin} className="flex min-h-[300px] flex-col gap-2 rounded-card px-2.5 pb-2.5 pt-2" style={{ background: colors.surface2, boxShadow: `inset 0 0 0 ${lit ? 3 : 2}px ${lit ? colors.brand : colors.line}`, transition: tween }}>
                  <span className="font-heading text-[14px] font-bold leading-snug" style={{ color: colors.brandDark }}>
                    {bin}
                  </span>
                  {ITEMS.slice(0, landed).map((it, i) => (it.bin === bin ? <Landed key={it.job} item={it} from={stack.current[i]} fly={i === landed - 1} /> : null))}
                </div>
              )
            })}
          </Group>
        </div>
        <Show on={beat >= 7}>
          <DeckLine>{NOTE}</DeckLine>
        </Show>
      </div>
      <StepControls at={beat} total={7} />
    </>
  )
}
