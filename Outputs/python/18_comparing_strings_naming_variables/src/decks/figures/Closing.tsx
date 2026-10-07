import { useState } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, Countdown, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { useInstant } from '@/motion/instant'
import { Confetti } from './motion'
import { Lines } from './common'

/**
 * THE CLOSE: the exit question and the six takeaway cards. PF 18 slides 25 and 26.
 */

/* ------------------------------------------------------------------- exit */

const EXIT = 'name = input()\nif name >= "A" and name < "N":\n    print("Hall 1")\nelif name >= "N" and name <= "Z":\n    print("Hall 2")'

/* Real runs (CPython 3.12.3): Arun → Hall 1, N → Hall 2, Nandu → Hall 2, Zoya → nothing. */
const OPTIONS = [
  { v: 'name = "Arun"', why: 'A is 65 and N is 78. "Arun" is less than "N", so it prints Hall 1' },
  { v: 'name = "N"', why: '"N" >= "N" is True, so it prints Hall 2. Equal counts for >=' },
  { v: 'name = "Nandu"', why: '"Nandu" starts with N, then has more letters, so it is bigger than "N" and smaller than "Z". Hall 2' },
  { v: 'name = "Zoya"', why: 'Z = Z, then "Z" runs out. The shorter one is smaller, so "Zoya" > "Z". Both conditions are False. Nothing prints' },
]
const RIGHT = 3
const HOUSE = 'cubic-bezier(0.22, 1, 0.36, 1)'

/**
 * Two beats: vote, answer. The options are clickable so the room's vote is
 * locked in before the press (the reference's are static text; plan decision
 * 6), and the press is not gated on a pick.
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
        <div className="flex w-[540px] shrink-0 flex-col gap-3">
          <p className="text-[19px] leading-snug" style={{ color: colors.body }}>
            <Lines lines={['The exam cell sends each student to a hall by name', 'One student gets no hall at all']} />
          </p>
          <CodeBlock code={EXIT} filename="Python" chip={false} fontSize={17} rows={5} />
          <div className="flex items-center justify-between">
            <p className="text-[21px]" style={{ color: colors.body }}>
              Which name prints <b className="text-ink">nothing at all</b>?
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
                className="sm-tap relative flex flex-col items-start rounded-xl bg-white px-4 py-1.5 text-left"
                style={{
                  transition: instant ? 'none' : `background-color 360ms ${HOUSE}, box-shadow 360ms ${HOUSE}, opacity 360ms ${HOUSE}, transform 160ms ${HOUSE}`,
                  background: right ? '#E9F8EF' : wrongPick ? '#FDECEC' : picked ? colors.surface2 : colors.white,
                  boxShadow: `inset 0 0 0 ${right || picked ? 3 : 2}px ${right ? colors.success : wrongPick ? colors.danger : picked ? colors.brand : colors.line}`,
                  opacity: shown && !right ? 0.55 : 1,
                }}
              >
                <span className="flex items-center gap-3">
                  <span className="w-5 font-mono text-[16px] font-bold" style={{ color: right ? colors.success : picked ? colors.brand : colors.muted }}>{'ABCD'[i]}</span>
                  <span className="font-mono text-[19px] font-semibold" style={{ color: colors.brandDark }}>{o.v}</span>
                </span>
                <span className="ml-8 block text-[16px] leading-snug" style={{ color: colors.body, maxHeight: shown ? 80 : 0, opacity: shown ? 1 : 0, overflow: 'hidden', transition: tween }}>
                  {o.why}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      {shown && pick === RIGHT && <Confetti seed={25} />}
      <StepControls at={beat} total={2} />
    </>
  )
}

/* -------------------------------------------------------------- takeaways */

function Slot({ on, n, children }: { on: boolean; n: number; children: React.ReactNode }) {
  const tween = useTween(480)
  return (
    <div
      className="relative h-[190px] overflow-hidden rounded-2xl"
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

/* Headers in the kit's own tones only (plan decision 4), never the reference's purple and red. */
const CARDS = [
  { title: 'A letter is a number', color: colors.brandDark, code: 'print(ord("A"))', result: '65', text: ['ord() gives the number', 'Capitals run 65 to 90'] },
  { title: 'A number is a letter', color: colors.brand, code: 'print(chr(97))', result: 'a', text: ['chr() goes the other way', 'Small letters run 97 to 122'] },
  { title: 'Small beats capital', color: colors.accentDark, code: 'print("a" > "A")', result: 'True', text: ['97 is more than 65', 'It is not the alphabet'] },
  { title: 'First different letter', color: colors.tealDark, code: 'print("BAT" > "BALL")', result: 'True', text: ['B = B, A = A, then T (84) beats L (76)', 'Length does not count'] },
  { title: 'One runs out', color: colors.danger, code: 'print("98" < "984")', result: 'True', text: ['9 = 9, 8 = 8, then "98" has nothing left', 'Shorter is smaller'] },
  { title: 'A good name', color: colors.success, code: 'total_bill = 90', result: 'Python accepts it', text: ['Letters, digits and _ only', 'No digit first. No keyword. snake_case'] },
]

export function Takeaways() {
  const beat = useBeats(CARDS.length)
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {CARDS.map((c, i) => (
          <Slot key={c.title} on={beat > i} n={i + 1}>
            <div className="flex h-full flex-col">
              <p className="px-4 py-2 font-heading text-[17px] font-bold text-white" style={{ background: c.color }}>{c.title}</p>
              <div className="flex flex-1 flex-col px-4 pb-3 pt-2.5">
                <p className="rounded-lg px-3 py-1.5 font-mono text-[16px]" style={{ background: colors.surface, color: colors.ink, border: `1px solid ${colors.line}` }}>{c.code}</p>
                <p className="mt-2 font-mono text-[20px] font-bold leading-none" style={{ color: '#137A3A' }}>{c.result}</p>
                <p className="mt-auto text-[16px] leading-snug" style={{ color: colors.body }}>
                  <Lines lines={c.text} />
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
