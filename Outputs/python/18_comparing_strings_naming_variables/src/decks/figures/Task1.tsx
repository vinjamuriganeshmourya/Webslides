import { colors } from '@/design/tokens'
import { CodeBlock, Countdown, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Glow } from './motion'
import { Lines } from './common'

/**
 * WORKSHEET TASK 1: PREDICT THE LETTERS, THEN RUN. PF 18 slide 12.
 *
 * Three programs, a `prints` slot beside each, the brief and a 5:00 timer on
 * the right. The timer runs while the room writes; the three presses then show
 * what each program really printed (real runs, plan outputs table), and the
 * last one brings the sentence that explains the 32.
 */
const PROGRAMS = [
  { code: 'for code in range(97, 102):\n    print(chr(code))', out: 'a b c d e', rows: 2 },
  { code: 'print(ord("a") - ord("A"))', out: '32', rows: 1 },
  { code: 'print(chr(ord("g") - 32))', out: 'G', rows: 1 },
]

const BRIEF = [
  <>Open <b>Task 1</b> on your worksheet</>,
  <>For each program, type <b>what you think it prints</b></>,
  <>Then type it in the playground and run it</>,
  <>Type what it really printed. Do not change your guess</>,
]

export function Task1() {
  const beat = useBeats(4)
  const tween = useTween(420)
  return (
    <>
      <div className="flex items-start gap-10 [&_b]:font-bold [&_b]:text-ink">
        <div className="flex w-[640px] shrink-0 flex-col gap-3">
          {PROGRAMS.map((p, i) => {
            const on = beat >= i + 2
            return (
              <div key={i} className="flex items-center gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-[16px] font-bold" style={{ background: colors.surface2, color: colors.brandDark }}>
                  {i + 1}
                </span>
                <div className="w-[410px]">
                  <CodeBlock code={p.code} filename="Python" chip={false} fontSize={16} rows={p.rows} />
                </div>
                <Glow on={on} className="flex-1">
                  <div
                    className="flex h-[76px] flex-col justify-center rounded-2xl px-4"
                    style={{ background: on ? '#E9F8EF' : 'rgba(255,255,255,0.5)', border: `2px ${on ? 'solid' : 'dashed'} ${on ? colors.success : colors.line}`, transition: tween }}
                  >
                    <span className="text-[16px] font-bold" style={{ color: colors.muted }}>prints</span>
                    <span className="whitespace-nowrap font-mono text-[20px] font-bold leading-tight" style={{ color: '#137A3A', opacity: on ? 1 : 0, transition: tween }}>
                      {p.out}
                    </span>
                  </div>
                </Glow>
              </div>
            )
          })}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <span className="self-start rounded-md px-3 py-1 text-[16px] font-bold uppercase tracking-wider" style={{ background: '#FFF4EC', color: colors.accentDark }}>
            Worksheet · Task 1
          </span>
          <ol className="flex flex-col gap-1.5">
            {BRIEF.map((t, i) => (
              <li key={i} className="flex gap-3 text-[18px] leading-snug" style={{ color: colors.body }}>
                <b className="w-5 shrink-0">{i + 1}.</b>
                <span>{t}</span>
              </li>
            ))}
          </ol>
          <Countdown seconds={300} />
          <div className="rounded-xl px-4 py-2.5 text-[16px] font-semibold leading-snug" style={{ background: colors.surface2, color: colors.ink, boxShadow: `inset 4px 0 0 ${colors.brandDark}`, opacity: beat >= 4 ? 1 : 0, transform: beat >= 4 ? 'none' : 'translateY(6px)', transition: tween }}>
            <Lines lines={['A small letter is always 32 more than its capital', <>So <code className="font-mono">chr(ord("g") - 32)</code> is G</>]} />
          </div>
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
