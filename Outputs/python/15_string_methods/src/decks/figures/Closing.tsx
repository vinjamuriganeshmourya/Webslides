import { useEffect, useRef, useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, Countdown, PanelButton, TraceCaption, useBeats, useTween, type CodeLineState } from '@/ui'
import { StepControls } from './controls'
import { useInstant } from '@/motion/instant'
import { Boxes } from './common'
import { Confetti, Press } from './motion'

/**
 * THE CLOSE: the exit question, and the two takeaway frames. PF 15 slides 27
 * to 29.
 */

/* ------------------------------------------------------------------ exit */

const EXIT = 'pin = input()\npin = pin.strip("-0")\nif pin.isdigit():\n    if len(pin) == 4:\n        print("Valid")'

/* What each input really does (CPython 3.12.3): 0-4748-0, 00474800 and -47480-
   all strip to 4748 and print Valid; -4-748- strips to 4-748, which is not all
   digits, so nothing prints. B is the only silent one. */
const INPUTS = ['0-4748-0', '-4-748-', '00474800', '-47480-']
const RIGHT = 1

export function ExitQuestion() {
  const instant = useInstant()
  const [pick, setPick] = useState(-1)
  /* 0 waiting; 1, 2, 3 the program running line by line on the right input; 4 the verdict */
  const [step, setStep] = useState(0)
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])
  const tween = useTween(420)
  const shown = step >= 4
  const started = step > 0

  /* Reveal runs the program the way the machine would on the right input,
     one line per beat, and only then names the answer: the same in, run, out
     pass as the slice machine, at the same pace. */
  const reveal = () => {
    if (started) return
    const T = instant ? 0 : 520
    ;[1, 2, 3, 4].forEach((k) => timers.current.push(window.setTimeout(() => setStep(k), T * (k - 1))))
  }
  const lines: Record<number, CodeLineState> = {}
  if (started) {
    for (let l = 1; l < Math.min(step, 4); l++) lines[l] = 'ran'
    if (step <= 3) lines[step] = 'now'
    else {
      lines[3] = 'now'
      lines[4] = 'dead'
      lines[5] = 'dead'
    }
  }

  return (
    <div className="flex flex-col gap-5 [&_b]:font-bold [&_b]:text-ink">
      <div className="flex items-start gap-10">
        <div className="w-[540px] shrink-0">
          <CodeBlock code={EXIT} filename="Python" chip={false} fontSize={20} lines={lines} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {/* The room's vote can be clicked in before the reveal (the notes say hands
              up for A to D first). Not a gate: Reveal works with nothing picked. */}
          {INPUTS.map((t, i) => {
            const picked = i === pick
            const right = shown && i === RIGHT
            const wrongPick = shown && picked && i !== RIGHT
            return (
              <button
                key={t}
                type="button"
                disabled={started}
                aria-pressed={picked}
                onKeyDown={(e) => e.key !== 'Enter' && e.key !== ' ' && e.currentTarget.blur()}
                onClick={() => !started && setPick(i)}
                className="sm-tap relative flex items-center gap-4 rounded-xl px-4 py-2 text-left text-[21px]"
                style={{
                  transition: instant
                    ? 'none'
                    : 'background-color 360ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 360ms cubic-bezier(0.22, 1, 0.36, 1), opacity 360ms cubic-bezier(0.22, 1, 0.36, 1), transform 160ms cubic-bezier(0.22, 1, 0.36, 1)',
                  color: colors.body,
                  background: right ? '#E9F8EF' : wrongPick ? '#FDECEC' : picked ? colors.surface2 : 'transparent',
                  boxShadow: right
                    ? `inset 0 0 0 2px ${colors.success}`
                    : wrongPick
                      ? `inset 0 0 0 2px ${colors.danger}`
                      : picked
                        ? `inset 0 0 0 2px ${colors.brand}`
                        : 'inset 0 0 0 0 transparent',
                  opacity: shown && !right ? 0.5 : 1,
                }}
              >
                <span className="w-5 font-mono font-bold" style={{ color: right ? colors.success : picked ? colors.brand : colors.muted }}>
                  {'ABCD'[i]}
                </span>
                <span>
                  The user types <b className="font-mono">{t}</b>
                </span>
                {right && pick === RIGHT && <Confetti seed={27} />}
              </button>
            )
          })}
          <div className="mt-2 flex items-center gap-4">
            <Countdown seconds={150} />
            <Press>
              <PanelButton onClick={reveal} disabled={started}>Reveal answer</PanelButton>
            </Press>
          </div>
        </div>
      </div>
      <div style={{ opacity: shown ? 1 : 0, transition: tween }}>
        <TraceCaption>
          <b>Option B.</b> Both ends come off down to '4-748'. The dash in the middle was never reached, so isdigit is False and line 4 is never even asked. Nothing is printed.
        </TraceCaption>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ helpers */

/**
 * A card that is on screen from the first beat as a dashed placeholder, and
 * fills on its own. `accent` is a coloured bar down the left edge, drawn INSIDE
 * the card and clipped by its rounded corners. It used to be an inset shadow on
 * the card's child, a square strip inside a rounded card, so its ends stuck out
 * past the curve (review, 2026-10-01, slide 28).
 */
function Slot({ on, accent, className = '', children }: { on: boolean; accent?: string; className?: string; children: ReactNode }) {
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
      {accent && <span aria-hidden className="absolute inset-y-0 left-0 w-[5px]" style={{ background: accent, opacity: on ? 1 : 0, transition: tween }} />}
      <div style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(8px)', transition: tween }}>{children}</div>
    </div>
  )
}

function Chip({ bg, className = '', children }: { bg: string; className?: string; children: ReactNode }) {
  return (
    <span className={`shrink-0 rounded-lg px-3 py-1 text-[16px] font-bold text-white ${className}`} style={{ background: bg }}>
      {children}
    </span>
  )
}

/* The takeaway chips' own colours, one per kind of slice and one per method, so
   a student looking for `strip` finds it by colour first. */
const KIND = { run: colors.brandDark, jump: '#C77700', nothing: '#8E44AD' }
const METHOD = { isdigit: '#C8404C', strip: '#1E9D57', replace: '#C77700', startswith: '#8E44AD', upper: '#0F5CAD' }

/* ------------------------------------------------------------------ slicing */

const ROWS: { kind: keyof typeof KIND; label: string; expr: string; out: string; why: string }[] = [
  { kind: 'run', label: 'a run', expr: 'code[0:4]', out: 'a1b2', why: 'A run. It stops before 4, so box 4 never comes out.' },
  { kind: 'jump', label: 'a jump', expr: 'code[0:8:2]', out: 'abcd', why: 'A jump of 2 from the start. It lands on 0, 2, 4, 6.' },
  { kind: 'jump', label: 'a jump', expr: 'code[1:6:3]', out: '1c', why: 'Lands on 1, then 4. The next would be 7, past the stop.' },
  { kind: 'nothing', label: 'nothing', expr: 'code[6:2:2]', out: '', why: 'The start is already past the stop, so nothing comes out.' },
]

export function SlicingTakeaways({ lastLine }: { lastLine: ReactNode }) {
  const beat = useBeats(5)
  return (
    <>
      <div className="flex flex-col gap-2">
        {/* The string, centred over the rows that slice it. */}
        <div className="mb-1 flex items-end justify-center gap-4">
          <span className="pb-6 text-[20px] font-semibold" style={{ color: colors.muted }}>code</span>
          <Boxes chars={[...'a1b2c3d4']} size="sm" />
        </div>
        {/* Four rows, four fixed columns: kind, slice, result, why. Every
            column starts at the same x on every row, so the eye reads down a
            column instead of hunting along each row. */}
        {ROWS.map((r, i) => (
          <Slot key={r.expr} on={beat > i}>
            <div className="flex h-[46px] items-center gap-4 px-5">
              <Chip bg={KIND[r.kind]} className="w-[92px] text-center">{r.label}</Chip>
              <span className="w-[176px] shrink-0 font-mono text-[24px] font-semibold" style={{ color: colors.brandDark }}>{r.expr}</span>
              <span style={{ color: colors.muted }}>→</span>
              <span className="w-[136px] shrink-0">
                <span
                  className="rounded-lg px-3 py-0.5 font-mono text-[22px] font-semibold"
                  style={r.out ? { background: '#E9F8EF', color: '#137A3A' } : { background: colors.surface, color: colors.muted, fontFamily: 'inherit', fontSize: 17 }}
                >
                  {r.out || 'nothing at all'}
                </span>
              </span>
              <span className="text-[18px]" style={{ color: colors.body }}>{r.why}</span>
            </div>
          </Slot>
        ))}
        <div className="mt-2 grid grid-cols-2 gap-3">
          <Slot on={beat >= 5} accent={colors.warning}>
            <div className="py-2.5 pl-6 pr-5">
              <p className="text-[19px] font-bold leading-snug" style={{ color: colors.ink }}>the stop number is never reached</p>
              <p className="text-[17px] leading-snug" style={{ color: colors.body }}>{lastLine}</p>
            </div>
          </Slot>
          <Slot on={beat >= 5} accent={colors.brand}>
            <div className="py-2.5 pl-6 pr-5">
              <p className="text-[19px] font-bold leading-snug" style={{ color: colors.ink }}>your own string never changes</p>
              <p className="text-[17px] leading-snug" style={{ color: colors.body }}>'a1b2c3d4' still holds all 8 characters after every line above.</p>
            </div>
          </Slot>
        </div>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}

/* ------------------------------------------------------------------ methods */

const METHODS: { name: keyof typeof METHOD; on: string; call: string; out: string; kind: string }[] = [
  { name: 'isdigit', on: '"4748"', call: '.isdigit()', out: 'True', kind: 'answers a question' },
  { name: 'strip', on: '" 9876543210 "', call: '.strip()', out: '9876543210', kind: 'hands back a string' },
  { name: 'replace', on: '"teh cat"', call: '.replace("teh", "the")', out: 'the cat', kind: 'hands back a string' },
  { name: 'startswith', on: '"https://nxtwave.in"', call: '.startswith("https://")', out: 'True', kind: 'answers a question' },
  { name: 'upper', on: '"Ravi"', call: '.upper()', out: 'RAVI', kind: 'hands back a string' },
]

export function MethodTakeaways() {
  const beat = useBeats(6)
  return (
    <>
      {/* Inside each card, three groups by spacing: the method's name, then the
          call and what it hands back (one tight block), then the kind of answer,
          pinned to the card's foot so it lines up across all five. */}
      <div className="grid grid-cols-3 gap-4">
        {METHODS.map((m, i) => (
          <Slot key={m.name} on={beat > i} className="h-[184px]">
            <div className="flex h-[180px] flex-col px-5 py-3.5">
              <span className="self-start">
                <Chip bg={METHOD[m.name]}>{m.name}</Chip>
              </span>
              <div className="mt-2.5 flex flex-col gap-0.5">
                <p className="font-mono text-[18px] font-semibold leading-tight" style={{ color: colors.success }}>{m.on}</p>
                <p className="font-mono text-[18px] font-semibold leading-tight" style={{ color: colors.brandDark }}>{m.call}</p>
                <p className="mt-1 flex items-center gap-2">
                  <span style={{ color: colors.muted }}>→</span>
                  <span className="rounded-lg px-2.5 py-0.5 font-mono text-[20px] font-semibold" style={{ background: '#E9F8EF', color: '#137A3A' }}>{m.out}</span>
                </p>
              </div>
              <p className="mt-auto text-[16px] font-semibold uppercase tracking-wide" style={{ color: colors.muted }}>{m.kind}</p>
            </div>
          </Slot>
        ))}
        <Slot on={beat >= 6} className="h-[184px]">
          <div className="flex h-[180px] flex-col justify-center rounded-card px-5 [&_b]:font-bold" style={{ background: '#EAF3FF' }}>
            <div className="flex flex-col gap-1.5">
              <p className="text-[17px] leading-snug" style={{ color: colors.body }}>
                <b className="text-[22px] text-ink">2</b> of them answer a question, so you get <b style={{ color: '#137A3A' }}>True</b> or <b style={{ color: '#137A3A' }}>False</b>.
              </p>
              <p className="text-[17px] leading-snug" style={{ color: colors.body }}>
                <b className="text-[22px] text-ink">3</b> of them hand back a new string.
              </p>
            </div>
            <p className="mt-3 text-[18px] font-bold leading-snug" style={{ color: colors.brandDark }}>Not one of them changes the string you started with.</p>
          </div>
        </Slot>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}
