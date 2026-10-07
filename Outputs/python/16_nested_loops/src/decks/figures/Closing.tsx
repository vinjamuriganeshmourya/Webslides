import { useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, Countdown, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { useInstant } from '@/motion/instant'
import { Confetti } from './motion'

/**
 * THE CLOSE: the exit question and the six takeaway cards. PF 16 slides 20 and 21.
 */

/* ------------------------------------------------------------------- exit */

const EXIT = 'overs = int(input())\nfor over in range(1, overs):\n    for ball in range(1, 7):\n        print(str(over) + "." + str(ball))'

/* Real runs (CPython 3.12.3): overs = 2, 3, 7, 13 print 6, 12, 36, 72 lines. */
const OPTIONS = [
  { v: 'overs = 2', why: 'range(1, 2) gives only 1, so one over: 6 lines' },
  { v: 'overs = 3', why: 'range(1, 3) gives 1 and 2, two overs of 6 balls: 12 lines' },
  { v: 'overs = 7', why: '7 counts balls, not overs. range(1, 7) is six overs: 36 lines' },
  { v: 'overs = 13', why: '13 treats every line as an over. That is 12 overs: 72 lines' },
]
const RIGHT = 1
const HOUSE = 'cubic-bezier(0.22, 1, 0.36, 1)'

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
        <div className="flex w-[560px] shrink-0 flex-col gap-3">
          <CodeBlock code={EXIT} filename="Python" chip={false} fontSize={17} rows={4} />
          <p className="text-[21px]" style={{ color: colors.body }}>
            Which input prints exactly <b className="text-ink">12</b> lines?
          </p>
          <Countdown seconds={150} />
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
                  background: right ? '#E9F8EF' : wrongPick ? '#FDECEC' : picked ? colors.surface2 : colors.white,
                  boxShadow: `inset 0 0 0 ${right || picked ? 3 : 2}px ${right ? colors.success : wrongPick ? colors.danger : picked ? colors.brand : colors.line}`,
                  opacity: shown && !right ? 0.55 : 1,
                }}
              >
                <span className="flex items-center gap-3">
                  <span className="w-5 font-mono text-[16px] font-bold" style={{ color: right ? colors.success : picked ? colors.brand : colors.muted }}>{'ABCD'[i]}</span>
                  <span className="font-mono text-[21px] font-semibold" style={{ color: colors.ink }}>{o.v}</span>
                </span>
                <span className="ml-8 block text-[16px] leading-snug" style={{ color: colors.body, maxHeight: shown ? 52 : 0, opacity: shown ? 1 : 0, overflow: 'hidden', transition: tween }}>
                  {o.why}
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

function Slot({ on, className = '', children }: { on: boolean; className?: string; children: ReactNode }) {
  const tween = useTween(480)
  return (
    <div
      className={`relative overflow-hidden rounded-card ${className}`}
      style={{
        transition: tween,
        background: on ? colors.white : 'rgba(255,255,255,0.45)',
        boxShadow: on ? `0 6px 24px -10px rgba(0,37,75,0.16), inset 0 0 0 1px ${colors.line}` : 'none',
        border: on ? '2px solid transparent' : `2px dashed ${colors.line}`,
      }}
    >
      <div className="h-full" style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(8px)', transition: tween }}>{children}</div>
    </div>
  )
}

const CARDS: { title: string; color: string; code: string[]; result: string[]; text: string[] }[] = [
  /* the first result is two lines on the reference too */
  { title: 'the inner loop restarts', color: colors.brandDark, code: ['for a in range(3):', '    for b in range(7, 9):'], result: ['inner prints 2 lines on each', 'of 3 passes: 6 in all'], text: ['The inner loop runs all the way through on every pass of the outer loop'] },
  { title: 'count it', color: '#8E44AD', code: ['for over in range(20):', '    for ball in range(1, 7):'], result: ['120 balls'], text: ['Lines inside both loops run outer count times inner count'] },
  /* teal, not the amber of the first cut: review, 2026-10-01 */
  { title: 'inner uses outer', color: colors.tealDark, code: ['for i in range(1, 4):', '    for j in range(i):'], result: ['6 lines: 1, then 2, then 3'], text: ['The inner range can use the outer variable, so each pass can be a different length'] },
  { title: 'indentation', color: '#1E9D57', code: ['for i in range(3):', '    for j in range(2): ...', '    print("done")'], result: ['done prints 3 times'], text: ['Indentation decides which loop a line belongs to'] },
  { title: 'while needs a reset', color: '#C2185B', code: ['while i < 3:', '    while j < 2:   # no j = 0 here'], result: ['2 stars, not 6'], text: ['A for loop starts again by itself', 'A while loop starts again only if you reset its counter'] },
  { title: 'the triangle', color: colors.danger, code: ['for row_num in range(1, num + 1):', '    for seq_num in range(1, row_num + 1):'], result: ['1 / 1 2 / 1 2 3'], text: ['One loop for the rows, and a loop inside it to build each row'] },
]

export function Takeaways() {
  const beat = useBeats(CARDS.length)
  return (
    <>
      <div className="grid grid-cols-3 gap-3.5">
        {CARDS.map((c, i) => (
          <Slot key={c.title} on={beat > i} className="h-[200px]">
            <div className="flex h-full flex-col">
              <p className="px-4 py-1.5 text-[16px] font-bold text-white" style={{ background: c.color }}>{c.title}</p>
              <div className="flex flex-1 flex-col px-4 pb-2.5 pt-2">
                <div className="rounded-lg px-3 py-1" style={{ background: colors.surface }}>
                  {c.code.map((l, k) => (
                    <p key={k} className="whitespace-pre font-mono text-[12.5px] leading-[1.45]" style={{ color: colors.ink }}>
                      <span className="mr-2 inline-block w-2 text-right" style={{ color: colors.muted }}>{k + 1}</span>
                      {l}
                    </p>
                  ))}
                </div>
                <p className="mt-1.5 font-mono text-[14px] font-bold leading-snug" style={{ color: '#137A3A' }}>
                  {c.result.map((t, k) => (
                    <span key={k} className="block">{t}</span>
                  ))}
                </p>
                <p className="mt-auto text-[13.5px] leading-snug" style={{ color: colors.body }}>
                  {c.text.map((t, k) => (
                    <span key={k} className="block">{t}</span>
                  ))}
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
