import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { Card, Stage, Num, BOX_W } from './scene'
import { Balance, Laptop, Mainframe, MeterDial, ProviderBuilding, ServerUnit } from './art'
import { WELL } from './basics'

/**
 * KEY TAKEAWAYS (content rule 20): the agenda's five items, word for word,
 * each beside the picture its section was built on. The kit's
 * `KeyTakeawaysSlide` holds four comfortably and ran the fifth item's second
 * line under the player bar, so the five sit here as cards: the strings are
 * the agenda's, only the UI differs.
 */

const PICS: ReactNode[] = [
  <ProviderBuilding w={84} lit={8} />,
  <Mainframe w={84} busy />,
  <div className="flex items-center gap-1"><Laptop w={50} glow /><div className="flex flex-col gap-1"><ServerUnit w={30} /><ServerUnit w={30} /></div></div>,
  <MeterDial w={64} value={0.6} />,
  <Balance w={86} tilt={0} />,
]

export function Takeaways({ lesson, items }: { lesson: string; items: { title: string; sub: string }[] }) {
  const W = (BOX_W - 14) / 2
  const card = (it: { title: string; sub: string }, i: number) => (
    <Stage key={it.title} w={W} h={128} pad={12}>
      <div className="flex h-full gap-3">
        <div className="grid w-[96px] shrink-0 place-items-center rounded-xl" style={WELL}>
          {PICS[i]}
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Num n={i + 1} />
            <span className="font-heading text-[17px] font-semibold leading-tight" style={{ color: colors.ink }}>{it.title}</span>
          </div>
          <span className="text-[14px] leading-snug" style={{ color: colors.ink }}>{it.sub}</span>
        </div>
      </div>
    </Stage>
  )
  return (
    <Card id="takeaways" kicker="Key Takeaways" title={lesson} lesson={lesson}>
      <div className="flex flex-col gap-[14px]">
        <div className="flex gap-[14px]">{items.slice(0, 2).map((it, i) => card(it, i))}</div>
        <div className="flex gap-[14px]">{items.slice(2, 4).map((it, i) => card(it, i + 2))}</div>
        <div className="flex justify-center">{card(items[4], 4)}</div>
      </div>
    </Card>
  )
}
