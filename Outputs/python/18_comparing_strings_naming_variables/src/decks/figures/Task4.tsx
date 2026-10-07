import { colors } from '@/design/tokens'
import { CodeBlock, Countdown, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Glow } from './motion'
import { Lines } from './common'

/**
 * WORKSHEET TASK 4: FIX THE NAMES. PF 18 slide 24.
 *
 * A four-line program with three bad names. Beat 1 the brief and a 4:00
 * timer; beat 2 what Python says (the first bad line only, a real run); beat 3
 * the three lines marked; beat 4 the fixed program, and what it prints.
 */
const BAD = '1st_price = 40\nsecond price = 60\ntotal-bill = 1st_price + second price\nprint(total-bill)'
const GOOD = 'first_price = 40\nsecond_price = 60\ntotal_bill = first_price + second_price\nprint(total_bill)'

const BRIEF = [
  <>Type the <b>line numbers</b> that have a bad name</>,
  <>Type what Python says when you run it. Guess first</>,
  <>Fix every name in <b>snake_case</b>. Run it until it prints</>,
]

function Answer({ label, value, on, mono = true }: { label: string; value: string; on: boolean; mono?: boolean }) {
  const tween = useTween(420)
  return (
    <Glow on={on}>
      <div className="flex h-[70px] flex-col justify-center rounded-xl px-4" style={{ background: on ? '#E9F8EF' : 'rgba(255,255,255,0.5)', border: `2px ${on ? 'solid' : 'dashed'} ${on ? colors.success : colors.line}`, transition: tween }}>
        <span className="text-[16px] font-bold" style={{ color: colors.body }}>{label}</span>
        <span className={`${mono ? 'font-mono' : ''} whitespace-nowrap text-[17px] font-bold leading-tight`} style={{ color: '#137A3A', opacity: on ? 1 : 0, transition: tween }}>
          {value}
        </span>
      </div>
    </Glow>
  )
}

export function Task4() {
  const beat = useBeats(4)
  const tween = useTween(420)
  const fixed = beat >= 4
  return (
    <>
      <div className="flex items-start gap-10 [&_b]:font-bold [&_b]:text-ink">
        <div className="w-[600px] shrink-0 pt-6">
          <CodeBlock code={fixed ? GOOD : BAD} filename="Python" chip={false} fontSize={19} rows={4} lines={beat === 3 ? { 1: 'warn', 2: 'warn', 3: 'warn' } : undefined} />
        </div>
        <div className="relative min-w-0 flex-1">
          {/* beat 1: the brief and the timer */}
          <div className="flex flex-col gap-4" style={{ opacity: beat === 1 ? 1 : 0, transition: tween, pointerEvents: beat === 1 ? 'auto' : 'none' }}>
            <span className="self-start rounded-md px-3 py-1 text-[16px] font-bold uppercase tracking-wider" style={{ background: '#FFF4EC', color: colors.accentDark }}>
              Worksheet · Task 4
            </span>
            <ol className="flex flex-col gap-2">
              {BRIEF.map((t, i) => (
                <li key={i} className="flex gap-3 text-[18px] leading-snug" style={{ color: colors.body }}>
                  <b className="w-5 shrink-0">{i + 1}.</b>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
            <Countdown seconds={240} />
          </div>
          {/* beats 2 to 4: the answers */}
          <div className="absolute inset-x-0 top-0 flex flex-col gap-2.5" style={{ opacity: beat >= 2 ? 1 : 0, transition: tween, pointerEvents: beat >= 2 ? 'auto' : 'none' }}>
            <Answer label="Python says" value="line 1: SyntaxError: invalid decimal literal" on={beat >= 2} />
            <Answer label="Lines with a bad name" value="1, 2, 3" on={beat >= 3} />
            <Answer label="After the fix, it prints" value="100" on={beat >= 4} />
            <p className="rounded-xl px-4 py-2.5 text-[16px] font-semibold leading-snug" style={{ background: colors.surface2, color: colors.ink, boxShadow: `inset 4px 0 0 ${colors.brandDark}` }}>
              <Lines lines={['Python stops at the first bad line it finds', 'Fix it, run again, and it shows you the next one']} />
            </p>
          </div>
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
