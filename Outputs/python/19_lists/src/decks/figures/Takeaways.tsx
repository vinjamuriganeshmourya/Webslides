import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { sentences } from './pieces'

/**
 * LISTS, IN SIX EXAMPLES. Spec card K1, the example board.
 *
 * Six slots, all there from press 1, empty; each press fills one with its
 * heading, code, result and sentence. The six examples run as one program in
 * this order, and each result is what that line prints at that point (real
 * run, plan outputs table). Examples, not a concept map (the spec's must
 * line); headers in the kit's own tones only (content rule 37).
 */
function Slot({ on, n, children }: { on: boolean; n: number; children: ReactNode }) {
  const tween = useTween(480)
  return (
    <div
      className="relative h-[186px] overflow-hidden rounded-2xl"
      style={{
        transition: tween,
        background: on ? colors.white : 'rgba(255,255,255,0.45)',
        boxShadow: on ? `0 6px 24px -10px rgba(0,37,75,0.16), inset 0 0 0 1px ${colors.line}` : 'none',
        border: on ? '2px solid transparent' : `2px dashed ${colors.line}`,
      }}
    >
      {!on && (
        <span className="absolute inset-0 grid place-items-center font-heading text-[56px] font-extrabold" style={{ color: colors.line }}>
          {n}
        </span>
      )}
      <div className="h-full" style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(8px)', transition: tween }}>
        {children}
      </div>
    </div>
  )
}

const CARDS = [
  { title: 'Make one', color: colors.brandDark, code: 'road_trip = ["Hukum", "Kissik"]\nprint(road_trip)', result: "['Hukum', 'Kissik']", text: 'Square brackets, commas between' },
  { title: 'Count it', color: colors.brand, code: 'print(len(road_trip))', result: '2', text: 'len gives how many items' },
  { title: 'Reach one', color: colors.tealDark, code: 'print(road_trip[0])', result: 'Hukum', text: 'Positions start at 0' },
  { title: 'Join two', color: colors.accentDark, code: 'print(road_trip + ["Kesariya"])', result: "['Hukum', 'Kissik', 'Kesariya']", text: '+ makes a new list. road_trip does not change' },
  { title: 'Grow it', color: colors.success, code: 'road_trip += ["Kaavaalaa"]\nprint(road_trip)', result: "['Hukum', 'Kissik', 'Kaavaalaa']", text: '+= [x] adds x at the end. Keep the brackets' },
  { title: 'Take a part', color: colors.danger, code: 'print(road_trip[0:2])', result: "['Hukum', 'Kissik']", text: 'Start at 0. Stop before 2' },
]

export function Takeaways() {
  const beat = useBeats(CARDS.length)
  return (
    <>
      <div className="grid w-[1100px] grid-cols-3 gap-4">
        {CARDS.map((c, i) => (
          <Slot key={c.title} on={beat > i} n={i + 1}>
            <div className="flex h-full flex-col">
              <p className="px-4 py-1.5 font-heading text-[17px] font-bold text-white" style={{ background: c.color }}>
                {c.title}
              </p>
              <div className="flex flex-1 flex-col px-4 pb-3 pt-2">
                <div className="rounded-lg px-3 py-1.5 font-mono text-[14px] leading-snug" style={{ background: colors.surface, color: colors.ink, border: `1px solid ${colors.line}` }}>
                  {c.code.split('\n').map((l) => (
                    <div key={l} className="whitespace-pre">
                      {l}
                    </div>
                  ))}
                </div>
                <p className="mt-2 whitespace-nowrap font-mono text-[16px] font-bold leading-none" style={{ color: '#137A3A' }}>
                  {c.result}
                </p>
                <p className="mt-auto text-[16px] leading-snug" style={{ color: colors.body }}>
                  <Lines lines={sentences(c.text)} />
                </p>
              </div>
            </div>
          </Slot>
        ))}
      </div>
      <StepControls at={beat} total={CARDS.length} />
    </>
  )
}
