import { colors } from '@/design/tokens'
import { CodeBlock, Countdown, TraceCaption, useBeats, useTween, type CodeLineState } from '@/ui'
import { StepControls } from './controls'
import { BeatFade, Lines } from './common'
import { Glow } from './motion'
import { Brief, ResultBox, TaskPill } from './pieces'

/**
 * THE TWO WORKSHEET TASKS THE ROOM TYPES. PF 17 slides 12 and 16.
 *
 * Both carry the reference's timer (`Countdown`: nothing starts until the
 * instructor presses play) and its instruction to predict before running.
 * Every result is a real run (CPython 3.12.3). Every code panel says `Python`
 * (content rule 31).
 */

/* ------------------------------------------------------------ slide 12 */

const FIRST_WORD = 'sentence = input()\nfirst_word = ""\nfor char in sentence:\n    if char == " ":\n        break\n    first_word = first_word + char\nprint(first_word.upper())'

const STEPS: [string, string][] = [
  ['Step 1, as it is', 'PYTHON'],
  ['Step 2, no if and no break', 'PYTHON IS FUN'],
  ['Step 3, input Hello', 'HELLO'],
]

export function FirstWordTask() {
  const beat = useBeats(4)
  /* step 2 deletes lines 4 and 5, so while that run is on screen the two lines are drawn dead */
  const lines: Record<number, CodeLineState> = beat === 3 ? { 4: 'dead', 5: 'dead' } : { 5: 'warn' }
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="w-[620px] shrink-0">
          <CodeBlock code={FIRST_WORD} filename="Python" chip={false} fontSize={17} rows={7} lines={lines} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {beat === 1 ? (
            <Brief
              tag="Worksheet · Task 2"
              lines={[
                <Lines
                  key="1"
                  lines={[
                    'Type it',
                    <>
                      Input: <code>Python is fun</code>
                    </>,
                  ]}
                />,
                <Lines key="2" lines={['Delete lines 4 and 5, the if and the break', 'Predict, then run']} />,
                <Lines
                  key="3"
                  lines={[
                    'Put them back',
                    <>
                      Input: <code>Hello</code>
                    </>,
                    'Predict, then run',
                  ]}
                />,
              ]}
            >
              <div className="rounded-card bg-white px-4 py-3 shadow-card-soft ring-1 ring-line">
                <p className="text-[17px] leading-snug" style={{ color: colors.body }}>
                  Print the <b>first word</b> of a sentence in capitals
                </p>
                <p className="mt-2 flex items-center gap-3 font-mono text-[16px] font-semibold">
                  <span className="rounded-md px-2 py-0.5" style={{ background: colors.surface2, color: colors.brandDark }}>Python is fun</span>
                  <span style={{ color: colors.muted }}>→</span>
                  <span className="rounded-md px-2 py-0.5" style={{ background: colors.surface2, color: colors.brandDark }}>PYTHON</span>
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-[17px] font-bold leading-snug">
                  <span style={{ color: colors.ink }}>Type your answer first</span>
                  <span className="block" style={{ color: colors.accentDark }}>Then run</span>
                </p>
                <Countdown seconds={360} />
              </div>
            </Brief>
          ) : (
            <BeatFade beatKey="results" className="flex flex-col gap-3">
              {STEPS.map(([label, out], i) => (
                <Glow key={label} on={beat >= i + 2} color={colors.success}>
                  <ResultBox label={label} value={out} on={beat >= i + 2} tone="good" size={21} height={74} />
                </Glow>
              ))}
              {beat >= 3 && (
                <BeatFade beatKey="why">
                  <TraceCaption>Without the break, the loop does not stop at the space, so every letter joins first_word</TraceCaption>
                </BeatFade>
              )}
            </BeatFade>
          )}
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ------------------------------------------------------------ slide 16 */

const WORDS = ['pass', 'continue', 'break'] as const
const RUNS: Record<(typeof WORDS)[number], string> = { pass: '0 1 2 3 4', continue: '0 1 2 4', break: '0 1 2' }

export function ThreeWordsTask() {
  const beat = useBeats(4)
  const tween = useTween(420)
  const word = WORDS[Math.max(0, beat - 2)]
  const code = `n = int(input())\nfor i in range(n):\n    if i == 3:\n        ${word}\n    print(i)`
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="w-[620px] shrink-0">
          <CodeBlock code={code} filename="Python" chip={false} fontSize={17} rows={5} lines={{ 4: 'warn' }} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <TaskPill>Worksheet · Task 3</TaskPill>
            <Countdown seconds={300} />
          </div>
          <ol className="flex flex-col gap-1 [&_b]:font-bold [&_b]:text-ink [&_code]:rounded [&_code]:px-1 [&_code]:font-mono [&_code]:font-semibold">
            {[
              <Lines key="1" lines={['Type it', <>The input is <b>5</b></>]} />,
              <Lines key="2" lines={[<>Line 4 is <code style={{ color: colors.brandDark }}>pass</code></>, 'Predict, then run']} />,
              <Lines key="3" lines={[<>Change it to <code style={{ color: colors.brandDark }}>continue</code></>, 'Predict, then run']} />,
              <Lines key="4" lines={[<>Change it to <code style={{ color: colors.brandDark }}>break</code></>, 'Predict, then run']} />,
            ].map((l, i) => (
              <li key={i} className="flex gap-2.5 text-[16px] leading-[1.3]" style={{ color: colors.body }}>
                <b className="w-5 shrink-0">{i + 1}.</b>
                <span className="min-w-0">{l}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-col gap-2">
            {WORDS.map((w, i) => {
              const on = beat >= i + 2
              return (
                <Glow key={w} on={on} color={colors.success}>
                  <div
                    className="flex items-center gap-6 rounded-card px-4"
                    style={{ height: 42, border: `2px ${on ? 'solid' : 'dashed'} ${on ? `${colors.success}99` : colors.line}`, background: on ? `${colors.success}14` : 'rgba(255,255,255,0.55)', transition: tween }}
                  >
                    <span className="w-[92px] font-mono text-[16px] font-bold" style={{ color: colors.brandDark }}>{w}</span>
                    <span className="font-mono text-[18px] font-semibold" style={{ color: colors.ink, opacity: on ? 1 : 0, transition: tween }}>{RUNS[w]}</span>
                  </div>
                </Glow>
              )
            })}
          </div>
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
