import { colors } from '@/design/tokens'
import { CodeBlock, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'

/**
 * ONE PROGRAM, THREE WORDS. PF 18 slide 3, the recap that is played.
 *
 * Line 3 of the program is a blank that becomes `break`, `continue` and
 * `pass`, one word per two presses: the first press writes the word and opens
 * the card with its question, the second shows what it printed and why. The
 * room says the output between the two presses. Seven beats, the reference's
 * own; every output is a real run (plan, outputs table).
 */
const WORDS = [
  { word: 'break', out: ['0', '1'], why: ['break leaves the loop at 2', 'Nothing after it prints'] },
  { word: 'continue', out: ['0', '1', '3', '4'], why: ['continue skips print(i) only for 2', 'The loop goes on'] },
  { word: 'pass', out: ['0', '1', '2', '3', '4'], why: ['pass does nothing, so 2 prints like every other number'] },
] as const

const program = (line3: string) => `for i in range(5):\n    if i == 2:\n        ${line3}\n    print(i)`

export function RecapCards() {
  const beat = useBeats(7)
  const tween = useTween(480)
  /* the word on line 3 right now: none, then one per pair of beats */
  const wi = beat >= 2 ? Math.min(2, Math.floor((beat - 2) / 2)) : -1
  return (
    <>
      <div className="flex items-start gap-10">
        <div className="flex w-[480px] shrink-0 flex-col gap-4">
          <CodeBlock code={program(wi < 0 ? '____' : WORDS[wi].word)} filename="Python" chip={false} fontSize={19} rows={4} lines={{ 3: 'mark' }} />
          <p className="text-[20px] leading-snug" style={{ color: colors.body }}>
            <Lines lines={['Line 3 changes three times', 'Each time, say the output before the next press']} />
          </p>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-4">
          {WORDS.map((w, k) => {
            const open = beat >= 2 + 2 * k
            const told = beat >= 3 + 2 * k
            return (
              <div
                key={w.word}
                className="relative flex h-[340px] flex-col rounded-2xl px-4 py-3"
                style={{
                  background: open ? '#E9F8EF' : 'rgba(255,255,255,0.5)',
                  border: `2px ${open ? 'solid' : 'dashed'} ${open ? colors.success : colors.line}`,
                  transition: tween,
                }}
              >
                {!open && (
                  <span className="absolute inset-0 grid place-items-center font-heading text-[56px] font-extrabold" style={{ color: colors.line }}>
                    {k + 1}
                  </span>
                )}
                <div style={{ opacity: open ? 1 : 0, transition: tween }} className="flex h-full flex-col">
                  <p className="text-[18px] font-bold" style={{ color: colors.ink }}>
                    line 3 is <span className="font-mono" style={{ color: colors.danger }}>{w.word}</span>
                  </p>
                  <p className="mt-0.5 text-[16px] font-semibold" style={{ color: colors.body, opacity: told ? 0 : 1, transition: tween }}>
                    What does it print?
                  </p>
                  <div className="flex flex-1 flex-col justify-center gap-0.5" style={{ opacity: told ? 1 : 0, transform: told ? 'none' : 'translateY(8px)', transition: tween }}>
                    {w.out.map((o) => (
                      <span key={o} className="font-mono text-[26px] font-bold leading-tight" style={{ color: '#137A3A' }}>
                        {o}
                      </span>
                    ))}
                  </div>
                  <p className="text-[16px] font-semibold leading-snug" style={{ color: colors.ink, opacity: told ? 1 : 0, transition: tween }}>
                    <Lines lines={[...w.why]} />
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <StepControls at={beat} total={7} />
    </>
  )
}
