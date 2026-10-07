import { useState } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, Countdown, useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Lines } from './common'
import { Confetti } from './motion'
import { HOUSE, Pill, Slot } from './pieces'

/**
 * THE CLOSE: the exit question and the five takeaway rows. PF 17 slides 17 and 18.
 */

/* ------------------------------------------------------------------- exit */

const EXIT = 'for m in marks:\n    if m < 0:\n        break\n    if m < 35:\n        continue\n    print(m)'

/* Real runs (CPython 3.12.3): A prints 50, B prints 40, C prints nothing, D prints 35. */
const OPTIONS: { v: string; why: string[] }[] = [
  { v: 'marks = [50, -1, 20]', why: ['50 prints first', 'break stops the loop, but it cannot take back what is already printed'] },
  { v: 'marks = [20, 30, 40]', why: ['continue skips 20 and 30 but the loop carries on, so 40 prints'] },
  { v: 'marks = [20, -1, 50]', why: ['20 is skipped by continue, then -1 hits break', '50 is never read', 'Nothing prints'] },
  { v: 'marks = [35, 10, -1]', why: ['35 is not less than 35, so it prints', 'Then 10 is skipped and -1 ends the loop'] },
]
const RIGHT = 2

/**
 * Two beats: vote, answer. The options are clickable so the room's vote is
 * locked in before the press (the reference's are static text; plan decision
 * 5), and the press is not gated on a pick.
 */
export function ExitVote() {
  const beat = useBeats(2)
  const instant = useInstant()
  const tween = useTween(420)
  const [pick, setPick] = useState(-1)
  const shown = beat === 2
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex w-[520px] shrink-0 flex-col gap-3">
          <CodeBlock code={EXIT} filename="Python" chip={false} fontSize={17} rows={6} />
          <div className="flex items-center justify-between gap-4">
            <p className="text-[20px] leading-snug" style={{ color: colors.body }}>
              Which list makes it show <b className="font-bold text-ink">nothing at all</b>?
            </p>
            <Countdown seconds={150} />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {OPTIONS.map((o, i) => {
            const picked = i === pick
            const right = shown && i === RIGHT
            const wrongPick = shown && picked && i !== RIGHT
            return (
              <button
                key={o.v}
                type="button"
                disabled={shown}
                aria-pressed={picked}
                onKeyDown={(e) => e.key !== 'Enter' && e.key !== ' ' && e.currentTarget.blur()}
                onClick={() => !shown && setPick(i)}
                className="sm-tap relative flex flex-col items-start rounded-xl bg-white px-4 py-2 text-left"
                style={{
                  transition: instant ? 'none' : `background-color 360ms ${HOUSE}, box-shadow 360ms ${HOUSE}, opacity 360ms ${HOUSE}, transform 160ms ${HOUSE}`,
                  background: right ? `${colors.success}14` : wrongPick ? `${colors.danger}14` : picked ? colors.surface2 : colors.white,
                  boxShadow: `inset 0 0 0 ${right || picked ? 3 : 2}px ${right ? colors.success : wrongPick ? colors.danger : picked ? colors.brand : colors.line}`,
                  opacity: shown && !right ? 0.55 : 1,
                }}
              >
                <span className="flex items-center gap-3">
                  <span className="w-5 font-mono text-[16px] font-bold" style={{ color: right ? colors.success : picked ? colors.brand : colors.muted }}>{'ABCD'[i]}</span>
                  <span className="font-mono text-[19px] font-semibold" style={{ color: colors.ink }}>{o.v}</span>
                </span>
                <span className="ml-8 block text-[16px] leading-[1.3]" style={{ color: colors.body, maxHeight: shown ? 70 : 0, opacity: shown ? 1 : 0, overflow: 'hidden', transition: tween }}>
                  <Lines lines={o.why} />
                </span>
              </button>
            )
          })}
        </div>
      </div>
      {shown && pick === RIGHT && <Confetti seed={20} />}
      <StepControls at={beat} total={2} />
    </>
  )
}

/* -------------------------------------------------------------- takeaways */

const ROWS: { pill: string; bg: string; code: string[]; result: string[]; text: string[] }[] = [
  { pill: 'pass', bg: colors.muted, code: ['if i == 3:', '    pass'], result: ['0 1 2 3 4'], text: ['pass does nothing', 'It only fills a block that cannot be empty'] },
  { pill: 'continue', bg: colors.warning, code: ['if i == 3:', '    continue'], result: ['0 1 2 4'], text: ['continue skips the rest of this pass', '3 is never printed'] },
  { pill: 'break', bg: colors.danger, code: ['if i == 3:', '    break'], result: ['0 1 2'], text: ['break leaves the loop', '3 and 4 never come'] },
  { pill: 'break inside', bg: colors.brandDark, code: ['for b in range(4):', '    if b == 1: break'], result: ['outer : 0 / inner : 0 /', 'outer : 1 / inner : 0'], text: ['break leaves only the loop it sits in', 'The outer loop carries on'] },
  { pill: 'outside a loop', bg: colors.brand, code: ['for i in range(10):', '    print(i)', 'break'], result: ["SyntaxError: 'break'", 'outside loop'], text: ['break and continue work only inside a loop', 'Nothing runs at all'] },
]

export function Takeaways() {
  const beat = useBeats(ROWS.length)
  return (
    <>
      <div className="flex flex-col gap-2">
        {ROWS.map((r, i) => (
          <Slot key={r.pill} on={beat > i} className="h-[70px]">
            <div className="flex h-full items-center gap-4 px-4">
              <span className="w-[150px] shrink-0">
                <Pill bg={r.bg} className="h-[32px] w-full whitespace-nowrap !text-[16px]">
                  {r.pill}
                </Pill>
              </span>
              <span className="w-[228px] shrink-0 whitespace-pre font-mono text-[15px] font-semibold leading-[1.35]" style={{ color: colors.brandDark }}>
                {r.code.map((l, k) => (
                  <span key={k} className="block">
                    {l}
                  </span>
                ))}
              </span>
              <span className="shrink-0 text-[18px]" style={{ color: colors.muted }}>→</span>
              <span className="w-[262px] shrink-0 rounded-lg px-3 py-1.5 font-mono text-[16px] font-semibold leading-[1.3]" style={{ background: `${colors.success}14`, color: colors.success }}>
                {r.result.map((l, k) => (
                  <span key={k} className="block">
                    {l}
                  </span>
                ))}
              </span>
              <span className="min-w-0 flex-1 text-[17px] leading-[1.3]" style={{ color: colors.body }}>
                <Lines lines={r.text} />
              </span>
            </div>
          </Slot>
        ))}
      </div>
      <StepControls at={beat} total={ROWS.length} />
    </>
  )
}
