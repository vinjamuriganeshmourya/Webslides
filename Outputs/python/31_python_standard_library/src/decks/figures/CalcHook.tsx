import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Group } from './common'
import { Appear, OutPanel, Swap, CODE_FS, OUT_FS, type OutLine } from './pieces'
import { CodePane, StepCaption } from './trace'
import { Idling } from './Cast'
import { RAVI } from './people'
import { CalcPhone, Notebook, TwoCalcs } from './Calculator'
import { lines, type Prog } from './cards'
import { SPEC } from './spec'

/**
 * HOOK H1: WHERE IS THE √ KEY? Seven presses, no topic name (spec rule 4).
 *
 * Press 1: Ravi beside his phone calculator, upright, and the homework page
 * (Q4: find √49, the area of a circle). Press 2: the phone turns on its press
 * and the scientific keys appear on the left; √, π and x! glow. Press 3: the
 * display answers both questions. Press 4: two small calculators, the upright
 * one lit, and homework.py prints 56. Press 5: sqrt(49) with nothing switched
 * on, line 1 red, NameError. Press 6: the sideways calculator lights, import
 * math is line 1, both answers print: 7.0 where the calculator shows 7, both
 * on screen together. Press 7: six sets of tools side by side, math lit.
 *
 * The phone is drawn as the real app (course rule R5b) and turns only on its
 * press (spec rule 1). Ravi is a lab character (2b, item 12). Every program
 * ran on CPython 3.12.3; the NameError line is the spec's.
 */
const H1 = SPEC.H1
const S: string[] = H1.show
const P: Prog[] = H1.code
const MODES: [string, string][] = H1.data.modes
const SCI: string[] = H1.data.sci_keys
const ANSWERS = ['√49 = 7', 'π×7×7 = 153.93804']

function ModeCards({ lit }: { lit: string }) {
  const tween = useTween(480)
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {MODES.map(([name, what], i) => {
        const on = name === lit
        return (
          <Appear key={name} delay={i * 110}>
            <div className="flex h-[66px] flex-col justify-center rounded-xl px-3" style={{ background: on ? colors.surface2 : colors.white, boxShadow: `inset 0 0 0 ${on ? 2.5 : 1.5}px ${on ? colors.brand : colors.line}`, transition: tween }}>
              <span className="font-mono text-[16px] font-bold leading-tight" style={{ color: colors.brandDark }}>
                {name}
              </span>
              <span className="whitespace-nowrap text-[12.5px] font-semibold leading-tight" style={{ color: colors.body }}>
                {what}
              </span>
            </div>
          </Appear>
        )
      })}
    </div>
  )
}

export function CalcHook() {
  const beat = useBeats(7)
  const landscape = beat >= 2
  const answered = beat >= 3
  const display = answered ? ANSWERS : ['0']
  const caption = [S[3], S[4], S[4], S[5], S[6], S[7], S[8]][beat - 1]
  const prog = beat >= 6 ? P[2] : beat >= 5 ? P[1] : P[0]
  const out: OutLine[] = beat >= 4 ? lines(prog.output) : []
  const lit: 'up' | 'side' = beat >= 6 ? 'side' : 'up'
  const big = beat <= 3
  return (
    <>
      <div className="flex items-stretch gap-3">
        {big ? (
          <>
            <Group pad={10} className="flex w-[750px] shrink-0 items-center gap-3" style={{ height: 391 }} active={beat === 2 || beat === 3}>
              <div className="flex h-full items-end pb-2">
                <Idling cfg={RAVI} scale={0.46} seed={11} />
              </div>
              <CalcPhone landscape={landscape} display={display} glow={landscape ? SCI.slice(0, 3) : []} />
              <Notebook lines={[S[0], S[1], ...S[2].split(': ')]} width={232} height={124} />
            </Group>
            <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2.5" style={{ height: 391 }} active={beat === 1}>
              <StepCaption text={caption} size={16} minH={86} />
            </Group>
          </>
        ) : (
          <>
            <Group pad={10} className="flex w-[250px] shrink-0 items-center justify-center" style={{ height: 391 }} active={false}>
              <TwoCalcs lit={lit} display={{ up: ['56'], side: ANSWERS }} />
            </Group>
            <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2.5" style={{ height: 391 }} active={beat >= 4}>
              <StepCaption text={caption} size={16} minH={46} />
              <Swap k={beat >= 7 ? 'modes' : 'code'}>
                {beat >= 7 ? (
                  <ModeCards lit="math" />
                ) : (
                  <div className="flex flex-col gap-2.5">
                    <CodePane code={prog.src} fontSize={CODE_FS} rows={4} at={beat === 5 ? 1 : undefined} stop={beat === 5} highlight={beat >= 6 ? 1 : undefined} marks={beat >= 6 ? { 1: [{ text: 'math', tone: 'a' }], 3: [{ text: 'math', tone: 'a' }], 4: [{ text: 'math', tone: 'a' }] } : beat === 5 ? { 1: [{ text: 'sqrt', tone: 'bad' }] } : undefined} />
                    <OutPanel lines={out} minRows={2} fontSize={OUT_FS} />
                  </div>
                )}
              </Swap>
            </Group>
          </>
        )}
      </div>
      <StepControls at={beat} total={7} />
    </>
  )
}
