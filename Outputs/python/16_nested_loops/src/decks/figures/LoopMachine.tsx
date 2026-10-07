import { useEffect, useRef, useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { Confetti } from './motion'

/**
 * THE LOOP MACHINE: VOTE, THEN RUN. PF 16 slides 9 and 19.
 *
 * Move 6 of `pedagogy-to-components`, strictly two beats per level: the vote
 * beat shows the program, the question and the four options and nothing else;
 * the run beat draws one row per pass of the outer loop and fills it with one
 * mark per inner print at reading pace, then the total, then the options turn
 * right and wrong with the reasons under the wrong ones.
 *
 * ON THE REFERENCE THE OPTIONS ARE STATIC TEXT and the room votes by hand;
 * `Next` runs with or without a pick (measured, 2026-10-01). Here they are
 * clickable so the vote can be locked in and the confetti has something to
 * fire on, and `Next` is still not gated: hands up, press, run (plan decision
 * 5). The pick is local state; the beats are the deck's build steps, so the
 * parent calls `useMachineBeats` and passes `at` down, and can derive the
 * slide title from it (slide 19 changes its title per program).
 *
 * Every row below is Python's real behaviour (CPython 3.12.3), stated in the
 * plan's output table.
 */
export type Mark = 'dot' | 'row' | 'done' | 'nothing'

export interface Level {
  tag: string
  title?: string
  code: string
  rows: number
  question: string
  options: string[]
  right: number
  passes: { label: string; marks: Mark[] }[]
  total: string
  legend?: [string, string]
  reasons: { opt: string; text: string }[]
}

export function useMachineBeats(levels: Level[]) {
  return useBeats(levels.length * 2)
}

export const levelOf = (at: number) => Math.ceil(at / 2) - 1

const HOUSE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const LETTERS = ['A', 'B', 'C', 'D']

function MarkDot({ m, shown }: { m: Mark; shown: boolean }) {
  const base = 'inline-grid place-items-center rounded-full font-mono font-bold transition-[opacity,transform] duration-300'
  const style = { opacity: shown ? 1 : 0, transform: shown ? 'none' : 'scale(0.6)', transitionTimingFunction: HOUSE }
  if (m === 'dot') return <span className={`${base} h-[18px] w-[18px]`} style={{ ...style, background: colors.brand }} />
  if (m === 'row') return <span className={`${base} h-[24px] rounded-md px-2 text-[16px] text-white`} style={{ ...style, background: colors.accent }}>row</span>
  if (m === 'done') return <span className={`${base} h-[24px] rounded-md px-2 text-[16px] text-white`} style={{ ...style, background: colors.success }}>done</span>
  return <span className="text-[16px] font-semibold" style={{ ...style, color: colors.danger }}>nothing</span>
}

export function LoopMachine({ levels, at }: { levels: Level[]; at: number }) {
  const instant = useInstant()
  const li = Math.min(levelOf(at), levels.length - 1)
  const L = levels[li]
  const running = at % 2 === 0
  const [pick, setPick] = useState(-1)
  const [shown, setShown] = useState(0)
  const [done, setDone] = useState(false)
  const timers = useRef<number[]>([])
  const total = L.passes.reduce((n, p) => n + p.marks.length, 0)

  /* a new level: forget the pick and the marks */
  useEffect(() => {
    setPick(-1)
  }, [li])

  /* the run: one mark per beat of the reading pace, then the verdict */
  useEffect(() => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
    if (!running) {
      setShown(0)
      setDone(false)
      return
    }
    if (instant) {
      setShown(total)
      setDone(true)
      return
    }
    /* the whole run of marks takes one second whatever the count (review,
       2026-10-01: the dots were too slow), then the verdict */
    const RUN = 1000
    const T = RUN / total
    for (let n = 1; n <= total; n++) timers.current.push(window.setTimeout(() => setShown(n), T * n))
    timers.current.push(window.setTimeout(() => setDone(true), RUN + 420))
    return () => timers.current.forEach((t) => window.clearTimeout(t))
  }, [running, li, instant, total])

  let count = 0
  const celebrate = done && pick === L.right

  return (
    <div className="flex items-start gap-8">
      <div className="flex w-[560px] shrink-0 flex-col gap-2">
        <span className="text-[16px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>{L.tag}</span>
        <CodeBlock code={L.code} filename="Python" chip={false} fontSize={16} rows={L.rows} />
        <p className="text-[20px]" style={{ color: colors.body }}>{L.question}</p>
        <div className="grid grid-cols-2 gap-2">
          {L.options.map((o, k) => {
            const isRight = done && k === L.right
            const isWrong = done && k !== L.right
            const picked = k === pick
            return (
              <button
                key={`${li}-${k}`}
                type="button"
                disabled={running}
                aria-pressed={picked}
                onKeyDown={(e) => e.key !== 'Enter' && e.key !== ' ' && e.currentTarget.blur()}
                onClick={() => !running && setPick(k)}
                className="sm-tap relative flex h-[42px] items-center gap-3 rounded-xl bg-white px-4 text-left"
                style={{
                  boxShadow: `inset 0 0 0 ${picked || isRight ? 3 : 2}px ${isRight ? colors.success : isWrong && picked ? colors.danger : picked ? colors.brand : colors.line}`,
                  background: isRight ? '#E9F8EF' : isWrong && picked ? '#FDECEC' : picked ? colors.surface2 : colors.white,
                  opacity: isWrong && !picked ? 0.55 : 1,
                  transition: instant ? 'none' : `box-shadow 360ms ${HOUSE}, background-color 360ms ${HOUSE}, opacity 360ms ${HOUSE}, transform 160ms ${HOUSE}`,
                }}
              >
                <span
                  className="grid h-7 w-7 place-items-center rounded-md font-mono text-[16px] font-bold"
                  style={{ background: picked ? colors.brand : colors.surface2, color: picked ? colors.white : colors.body, transform: picked ? 'scale(1.1)' : 'none', transition: instant ? 'none' : `all 240ms ${HOUSE}` }}
                >
                  {LETTERS[k]}
                </span>
                <span className="font-mono text-[22px] font-semibold" style={{ color: colors.ink }}>{o}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5 pt-7">
        {/* the pass labels are on screen from the vote beat, as the reference draws them; the marks arrive on the run */}
        {L.passes.map((p, r) => (
          <div key={`${li}-${r}`} className="flex min-h-[24px] items-center gap-3">
            <span className="w-[56px] font-mono text-[16px]" style={{ color: colors.body }}>{p.label}</span>
            <span className="flex items-center gap-1.5">
              {p.marks.map((m, i) => {
                count += 1
                return <MarkDot key={i} m={m} shown={running && count <= shown} />
              })}
            </span>
          </div>
        ))}
        {running && (
          <div style={{ opacity: done ? 1 : 0, transform: done ? 'none' : 'translateY(6px)', transition: instant ? 'none' : `all 420ms ${HOUSE}` }}>
            <p className="font-heading text-[26px] font-bold" style={{ color: '#137A3A' }}>
              {L.total}
            </p>
            {L.legend && (
              <p className="mt-1 flex items-center gap-4 text-[16px] font-semibold" style={{ color: colors.muted }}>
                <span className="flex items-center gap-1.5">
                  <MarkDot m={L.legend[0] === 'row' ? 'row' : 'done'} shown /> {L.legend[0]}
                </span>
                <span className="flex items-center gap-1.5">
                  <MarkDot m="dot" shown /> {L.legend[1]}
                </span>
              </p>
            )}
            <ul className="mt-2 flex flex-col gap-1">
              {L.reasons.map((r) => (
                <li key={r.opt} className="flex gap-2 text-[16px] leading-snug" style={{ color: colors.body }}>
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: colors.muted }} />
                  <span>
                    <b className="font-mono font-bold text-ink">{r.opt}:</b> {r.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {celebrate && <Confetti seed={li + 11} />}
      </div>
    </div>
  )
}

/** The reasons as the reference writes them: "7: 7 adds 3 and 4" keeps the option in the sentence. */
export const reason = (opt: string, text: string): Level['reasons'][number] => ({ opt, text })

export type { ReactNode }
