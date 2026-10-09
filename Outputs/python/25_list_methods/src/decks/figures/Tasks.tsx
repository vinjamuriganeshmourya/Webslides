import { colors } from '@/design/tokens'
import { Countdown, useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Group, Lines } from './common'
import { Appear, OutPanel, Show, TaskPill, sentences } from './pieces'
import { CodePane, StepCaption } from './trace'
import { CellRow, cellsOf } from './cells'
import { CODE_FS, OUT_FS } from './Methods'
import { SPEC } from './spec'

/**
 * THE TWO TASKS. T1 (the party queue, 7:00) and T2 (the Fibonacci series,
 * 8:00). No result shows until the timer has ended and the instructor
 * presses on; one step's result per press (their must lines). Step 2 of
 * each is framed as the instructor's own notes. Code and outputs are the
 * spec's, run on CPython 3.12.3.
 *
 * Code and output text are the deck's one size (CODE_FS, OUT_FS): session
 * 24's task results were set at 13px, below the rest of the deck.
 */

type Prog = { file: string; src: string; output: string; input?: string }

export function TaskStep({ n, text, lit }: { n: number; text: string; lit: boolean }) {
  const tween = useTween(420)
  return (
    <li
      className="flex items-start gap-3 rounded-xl px-3 py-1.5"
      style={{
        background: lit ? colors.white : 'transparent',
        boxShadow: lit ? `inset 0 0 0 1.5px ${colors.line}, 0 6px 14px -10px rgba(16,32,58,0.2)` : 'none',
        opacity: lit ? 1 : 0.4,
        transition: tween,
      }}
    >
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[13px] font-bold" style={{ background: lit ? colors.brandDark : colors.surface2, color: lit ? colors.white : colors.muted, transition: tween }}>
        {n}
      </span>
      {/* the spec's sentences in their own order: a short action (Predict, Run) is a chip, a longer one is text, all on one wrapping line */}
      <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
        {sentences(text).map((t, i) =>
          t.split(' ').length <= 2 ? (
            <span key={i} className="inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-[14px] font-bold leading-[20px]" style={{ background: colors.surface2, color: colors.brandDark }}>
              {t}
            </span>
          ) : (
            <span key={i} className="text-[16.5px] font-semibold leading-snug" style={{ color: colors.ink }}>
              {t}
            </span>
          ),
        )}
      </span>
    </li>
  )
}

/* ================================================================== T1 */

/** Python's own print of the step 2 list, with the one item that is a whole list drawn as a box holding two songs. */
function NestedLine({ text }: { text: string }) {
  const at = text.indexOf("['Oo Antava'")
  if (at < 0) return <>{text}</>
  const inner = text.slice(at, text.lastIndexOf(']'))
  return (
    <>
      {text.slice(0, at)}
      <span className="rounded-md px-1 py-0.5" style={{ background: '#FFF4EC', boxShadow: `inset 0 0 0 2px ${colors.accent}` }}>
        {inner}
      </span>
      {text.slice(at + inner.length)}
    </>
  )
}

/** T1's output: the deck's output panel, with step 2's one-item-that-is-a-list boxed in place. */
function ResultPanel({ step, lines }: { step: number; lines: string[] }) {
  const rowH = Math.round(OUT_FS * 1.6)
  return (
    <div className="w-full overflow-hidden rounded-card border border-line bg-white" style={{ boxShadow: '0 1px 2px rgba(16,32,58,0.07), 0 6px 14px -6px rgba(16,32,58,0.13)' }}>
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-1.5" style={{ background: `${colors.success}14` }}>
        <span className="inline-block h-3 w-3 rounded-full" style={{ background: colors.success }} />
        <span className="font-heading text-[16px] font-bold uppercase tracking-wider" style={{ color: colors.body }}>
          {step >= 1 ? `Output · step ${step}` : 'Output'}
        </span>
      </div>
      <div className="relative px-4 py-2.5" style={{ minHeight: 2 * rowH + 20 }}>
        {lines.length === 0 && (
          <span className="absolute inset-x-4 top-2.5 text-[16px] font-semibold italic" style={{ color: colors.muted }}>
            Runs after the timer
          </span>
        )}
        {lines.map((l, j) => (
          <div key={`${step}-${j}`} className="sm-rise whitespace-pre font-mono font-medium" style={{ fontSize: OUT_FS, lineHeight: `${rowH}px`, color: colors.ink }}>
            <NestedLine text={l} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function Task1() {
  const T1 = SPEC.T1
  const progs: Prog[] = T1.code
  const beat = useBeats(6)
  const showing = beat - 3 /* 1, 2, 3 once results start */
  const prog = showing >= 1 ? progs[showing - 1] : progs[0]
  const changed = showing === 2 ? [5] : showing === 3 ? [5] : undefined
  const lines = showing >= 1 ? prog.output.split('\n') : []
  return (
    <>
      <div className="flex items-start gap-7">
        <Group pad={8} className="flex w-[516px] shrink-0 flex-col gap-2.5">
          <div>
            <CodePane code={prog.src} mark={changed} fontSize={CODE_FS} rows={7} />
          </div>
        </Group>
        <Group pad={12} active={beat <= 3} className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-2">
              <TaskPill>{T1.show[0]}</TaskPill>
              <p className="text-[19px] font-semibold leading-snug" style={{ color: colors.body }}>
                <Lines lines={sentences(T1.show[1])} />
              </p>
            </div>
            <div className="shrink-0">
              <Countdown seconds={T1.timer} />
            </div>
          </div>
          <div>
            <ol className="flex flex-col gap-1.5">
              {[2, 3, 4].map((s, i) => (
                <TaskStep key={s} n={i + 1} text={T1.show[s]} lit={beat >= i + 1} />
              ))}
            </ol>
          </div>
        </Group>
      </div>
      <div className="mt-3 flex items-start gap-4">
        {/* the result and, on step 2, its rule beside it: one cluster (G3) */}
        <Group pad={8} active={showing >= 1} className="flex min-w-0 flex-1 items-stretch gap-3">
          <div className="min-w-0 flex-1">
            <ResultPanel step={showing} lines={lines} />
          </div>
          <Show on={showing === 2} className="flex w-[230px] shrink-0 items-center">
            <StepCaption tone="rule" text={T1.show[5]} size={17} minH={44} />
          </Show>
        </Group>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ================================================================== T2 */

/**
 * The series with its arrows (deck slide 28), redrawn (user, 2026-10-08,
 * slide 23). For every term from index 2: the two terms before it feed a
 * small pill that says the sum (`0+1`), and one curved arrow carries that sum
 * into the new term, landing on a clean filled arrowhead pointed along the
 * curve. Arrows alternate above and below so none crosses another; the feed
 * lines start off the term's centre, so an arrow landing on a term never
 * touches the feed leaving it.
 *
 * Motion: each arrow draws itself from the pill to the term (an eased path
 * draw, so the room sees the direction of flow), then its head settles in.
 * One arrow after another, in reading order, as the card opens; an instant
 * jump shows them all drawn.
 */
const DRAW = 'cubic-bezier(0.65, 0, 0.35, 1)'

function SumArrow({ from, to, mid, up, label, instant, color, at }: { from: [number, number]; to: number; mid: number; up: boolean; label: string; instant: boolean; color: string; /** when this arrow starts drawing, seconds after the card opens */ at: number }) {
  /* geometry in the upper half; the lower half is the mirror about the number row's centre line (y 66) */
  const Y = (y: number) => (up ? y : 132 - y)
  const pillW = 46
  const arc = `M ${mid + pillW / 2} ${Y(20)} C ${to - 6} ${Y(20)} ${to} ${Y(24)} ${to} ${Y(35)}`
  /* the head points along the curve's last tangent: straight down above, straight up below */
  const tip = Y(39)
  const head = up ? `M ${to - 5.5} ${tip - 9} L ${to} ${tip} L ${to + 5.5} ${tip - 9} Z` : `M ${to - 5.5} ${tip + 9} L ${to} ${tip} L ${to + 5.5} ${tip + 9} Z`
  const draw = (delay: number, dur = 0.62) => (instant ? undefined : { animation: `pf25-draw ${dur}s ${DRAW} ${at + delay}s both` })
  return (
    <g style={{ color }}>
      <path d={`M ${from[0] + 14} ${Y(40)} L ${mid - 11} ${Y(30)}`} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" pathLength={1} strokeDasharray="1" style={draw(0, 0.36)} />
      <path d={`M ${from[1] - 14} ${Y(40)} L ${mid + 11} ${Y(30)}`} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" pathLength={1} strokeDasharray="1" style={draw(0, 0.36)} />
      <g style={instant ? undefined : { animation: `pf25-fade 0.42s cubic-bezier(0.22,1,0.36,1) ${at + 0.24}s both` }}>
        <rect x={mid - pillW / 2} y={Y(20) - 10} width={pillW} height={20} rx={10} fill="#FFFFFF" stroke="currentColor" strokeWidth={1.75} />
        <text x={mid} y={Y(20) + 4.6} fontSize="13" fontWeight="700" fill="currentColor" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
          {label}
        </text>
      </g>
      <path d={arc} fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" pathLength={1} strokeDasharray="1" style={draw(0.42)} />
      <path d={head} fill="currentColor" style={instant ? undefined : { transformBox: 'fill-box', transformOrigin: up ? '50% 100%' : '50% 0%', animation: `pf25-head 0.32s cubic-bezier(0.22,1,0.36,1) ${at + 1}s both` }} />
    </g>
  )
}

function Series({ terms }: { terms: number[] }) {
  const instant = useInstant()
  const W = 58
  const G = 22
  const x = (i: number) => i * (W + G) + W / 2
  const width = terms.length * (W + G) - G + 60
  return (
    <div className="relative" style={{ width, height: 140 }}>
      <style>{`@keyframes pf25-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes pf25-head { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: none; } }`}</style>
      <svg width={width} height={140} className="absolute inset-0" aria-hidden>
        {Array.from({ length: terms.length - 2 }, (_, k) => {
          const i = k + 2
          const up = k % 2 === 0
          return (
            <SumArrow
              key={i}
              from={[x(i - 2), x(i - 1)]}
              mid={(x(i - 2) + x(i - 1)) / 2}
              to={x(i)}
              up={up}
              label={`${terms[i - 2]}+${terms[i - 1]}`}
              instant={instant}
              color={up ? colors.accentDark : colors.success}
              at={0.5 + k * 0.7}
            />
          )
        })}
      </svg>
      {terms.map((t, i) => (
        <span key={i} className="absolute grid place-items-center font-mono text-[30px] font-bold" style={{ left: x(i) - W / 2, top: 42, width: W, height: 48, color: colors.brandDark }}>
          {t}
          {i < terms.length - 1 ? ',' : ''}
        </span>
      ))}
      <span className="absolute font-mono text-[30px] font-bold" style={{ left: x(terms.length - 1) + W / 2 + 4, top: 46, color: colors.muted }}>
        ...
      </span>
    </div>
  )
}

function IoPair({ input, output, on }: { input: string; output: string; on: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-1.5" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
      <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.brand }}>
        In
      </span>
      <span className="font-mono text-[20px] font-bold" style={{ color: colors.ink }}>
        {input}
      </span>
      <span className="ml-2 text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.success }}>
        Out
      </span>
      <span className="min-w-[30px] font-mono text-[20px] font-bold" style={{ color: colors.ink, opacity: on ? 1 : 0, transition: 'opacity 420ms' }}>
        {output}
      </span>
    </div>
  )
}

export function Task2() {
  const T2 = SPEC.T2
  const progs: Prog[] = T2.code
  const trace: { i: number; adds: string; value: number; fib: number[] }[] = T2.data.trace
  const beat = useBeats(13)
  const intro = beat <= 2
  const notes = beat === 13
  const pass = beat >= 6 && beat <= 11 ? beat - 6 : beat >= 12 ? 5 : -1
  const lineFour = beat >= 5
  /* PF 24's fill-in blank: a run of underscores is drawn as the dashed amber slot with a pencil (Code.tsx) */
  const BLANK = '    ' + '_'.repeat(36)
  const main = progs[0].src
  const code = notes ? progs[3].src : lineFour ? main : main.split('\n').map((l, i) => (i === 3 ? BLANK : l)).join('\n')
  const fib = notes ? [0, 1, 1, 2, 3] : pass >= 0 ? trace[pass].fib : [0, 1]
  const states = pass >= 0 && !notes && beat <= 11 ? { [fib.length - 1]: 'new' as const } : {}
  const caption = notes ? T2.show[7] : pass >= 0 && beat <= 11 ? `i = ${trace[pass].i}: ${trace[pass].adds}` : beat === 3 || beat === 4 ? T2.show[5] : null
  const runs = progs.slice(0, 3)
  const ex3 = progs.find((p) => p.input === '3')!
  const ex9 = progs.find((p) => p.input === '9')!
  return (
    <>
      {intro ? (
        <Appear key="intro" className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-6">
            <p className="text-[22px] font-bold leading-snug" style={{ color: colors.ink }}>
              {T2.show[1].replace(/\.$/, '')}
            </p>
          </div>
          <Group pad={12} className="flex items-start gap-10">
            <div className="shrink-0">
              <Series terms={[0, 1, 1, 2, 3, 5, 8]} />
            </div>
            <div className="flex flex-col gap-2 pt-3">
              {[T2.show[3], T2.show[4]].map((t) => (
                <span key={t} className="text-[19px] font-semibold leading-snug" style={{ color: colors.body }}>
                  {t.replace(/\.$/, '')}
                </span>
              ))}
            </div>
          </Group>
          <Show on={beat >= 2}>
          <Group pad={12} className="flex items-start gap-8">
            <div className="flex flex-col gap-3">
              <span className="rounded-card px-4 py-2 font-mono text-[19px] font-bold" style={{ background: colors.surface2, color: colors.brandDark, boxShadow: `inset 4px 0 0 ${colors.brandDark}` }}>
                Nth term = (N - 1)th term + (N - 2)th term
              </span>
              <CellRow name="fib" cells={cellsOf([0, 1])} font={16} lane={false} />
            </div>
            <div className="flex flex-col gap-2">
              <IoPair input={ex3.input!} output={ex3.output} on />
              <IoPair input={ex9.input!} output={ex9.output} on />
            </div>
          </Group>
          </Show>
        </Appear>
      ) : (
        <Appear key="task" className="flex items-start gap-7">
          <div className="flex w-[520px] shrink-0 flex-col gap-2.5">
            <Group pad={8} active={beat >= 5} className="flex flex-col gap-2.5">
              <div>
                <CodePane code={code} fontSize={CODE_FS} rows={5} mark={beat === 5 ? [4] : notes ? [3] : undefined} at={notes ? 5 : null} stop={notes} />
              </div>
              <div>
                {beat === 12 ? (
                  <div className="flex flex-wrap gap-2">
                    {runs.map((p) => (
                      <IoPair key={p.input} input={p.input!} output={p.output} on />
                    ))}
                  </div>
                ) : (
                  <OutPanel title="Terminal" lines={notes ? [{ text: progs[3].output, tone: 'error' }] : []} minRows={1} fontSize={OUT_FS} empty={notes ? undefined : 'Runs after the timer'} />
                )}
              </div>
            </Group>
            <div>
              <StepCaption tone={notes ? 'rule' : 'step'} text={caption} size={17} minH={46} />
            </div>
          </div>
          <Group pad={12} active={beat === 3 || beat === 4} className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <TaskPill>{T2.show[0]}</TaskPill>
              <div className="shrink-0">
                <Countdown seconds={T2.timer} />
              </div>
            </div>
            <div>
              <ol className="flex flex-col gap-1.5">
                <TaskStep n={1} text={T2.show[5]} lit />
                <TaskStep n={2} text={T2.show[6]} lit={beat >= 4} />
              </ol>
            </div>
            <div className="self-start">
              <CellRow name="fib" cells={cellsOf(fib, states)} font={16} reserve={8} quote={false} lane={false} />
            </div>
          </Group>
        </Appear>
      )}
      <StepControls at={beat} total={13} />
    </>
  )
}

