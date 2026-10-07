import { useEffect, useState, type ReactNode } from 'react'
import { colors, motionSpeed } from '@/design/tokens'
import { CodeBlock, useBeats, useTween, type CodeLineState } from '@/ui'
import { OutputPanel } from '@/ui/CodeOutput'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Glow } from './motion'
import { PinPhone, type Screen } from './PinPhone'

/**
 * THE PIN STORY, TOLD FROM THE CODE. The frame slides 4 and 10 share
 * (feedback of 2026-10-06, changes 1 and 3): the program that runs the
 * payment app on the LEFT with its output pane under it, the phone on the
 * RIGHT with the three try cards under it. The room traces each click to a
 * line instead of being told the cause.
 *
 * ONE CLICK, A FEW FRAMES. A click lights the lines that run, one after
 * another 600ms apart (the explanatory tier, generate-slides 4b), and the
 * phone, the output pane and the cards change with the line that changes
 * them: "line 3, then line 7" is two frames of one click. A press starts it
 * and nothing else does (course rule R5c item 4); an instant jump lands every
 * frame at once. Only the lines of the click on screen are lit, because line
 * 3 runs on every try and a `ran` tint would carry nothing.
 *
 * Every output is a real run (CPython 3.12.3, plan revision 1): the bug
 * prints `Incorrect PIN`, `Payment successful`, `Payment successful` for
 * 1111, 4821, 4821; with `break` the third line never comes.
 *
 * GEOMETRY (content rule 32). Left column x 64..540, which never reaches the
 * Next and Replay buttons (x 551..727, y 636..680), so it may run to the
 * foot of Space-1. Right column x 740..1150: right of the buttons, short of
 * the footer mark (x 1172+), so the cards can sit at the foot too. Nothing on
 * the right may rise above y 221 (the speaker box), so the phone cannot take
 * `PHONE_LIFT` here and is drawn at 0.84 instead (plan revision 1, decision A).
 */

export type TileState = 'wait' | 'wrong' | 'right' | 'again' | 'twice' | 'never'

export interface Frame {
  /** The line that lights on this frame. A frame without one only changes the cards. */
  line?: number
  screen?: Screen
  /** What the program prints on this frame. */
  out?: string
  tiles?: Partial<Record<1 | 2 | 3, TileState>>
  /** Rupees the app has taken after this frame. */
  paid?: number
  /** The jump-out arrow draws on this frame and stays. */
  arrow?: boolean
}

const FONT = 16
const ROW_H = Math.round(FONT * 1.55)
const BAR = 45
const PAD = 16
/** Where a code line's text starts inside the panel: `px-5`, a one-digit gutter, `gap-4`. */
const TEXT_X = 46
const CH = FONT * 0.6
const LEFT = 476
const RIGHT = 410
const GAP = 200
const SCALE = 0.84
const FRAME_MS = Math.round(600 * motionSpeed)

/* --------------------------------------------------------------- stages */

/**
 * How many frames of this click have landed: none right after the press,
 * then one more every 600ms. Kept with the beat it belongs to, so the render
 * between a press and the first frame never shows the new beat with the old
 * count. An instant jump lands them all.
 */
function useStages(beat: number, count: number) {
  const instant = useInstant()
  const [st, setSt] = useState({ beat, stage: instant ? count : 0 })
  useEffect(() => {
    if (instant) {
      setSt({ beat, stage: count })
      return
    }
    setSt({ beat, stage: 0 })
    const timers: number[] = []
    for (let k = 1; k <= count; k++) timers.push(window.setTimeout(() => setSt({ beat, stage: k }), 120 + (k - 1) * FRAME_MS))
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [beat, count, instant])
  return st.beat === beat ? st.stage : 0
}

/* ---------------------------------------------------------------- cards */

const TILE: Record<TileState, { text: string; color: string; icon?: string; dashed?: boolean }> = {
  wait: { text: 'not yet', color: colors.muted, dashed: true },
  wrong: { text: 'wrong PIN', color: colors.danger, icon: '✕' },
  right: { text: 'paid', color: colors.success, icon: '✓' },
  again: { text: 'asked again', color: colors.accentDark, icon: '?' },
  twice: { text: 'paid again', color: colors.danger, icon: '✕' },
  never: { text: 'never asked', color: colors.muted, dashed: true },
}

/** One try card: the try's number, and what happened on it. 52px tall, so three fit under the phone. */
export function TryCard({ title, text, color, icon, dashed = false, faded = false }: { title: ReactNode; text: ReactNode; color: string; icon?: string; dashed?: boolean; faded?: boolean }) {
  const tween = useTween(420)
  return (
    <div
      className="flex h-[52px] flex-col justify-between rounded-card px-3 py-1.5"
      style={{
        border: `2px ${dashed ? 'dashed' : 'solid'} ${dashed ? colors.line : `${color}80`}`,
        background: dashed ? 'rgba(255,255,255,0.5)' : `${color}12`,
        opacity: faded ? 0.55 : 1,
        transition: tween,
      }}
    >
      <span className="flex items-center justify-between text-[13px] font-bold leading-none" style={{ color: colors.ink }}>
        {title}
        {icon && (
          <span className="grid h-4 w-4 place-items-center rounded-full text-[9.5px] font-bold text-white" style={{ background: color }}>
            {icon}
          </span>
        )}
      </span>
      <span className="text-[15px] font-bold leading-none" style={{ color, transition: tween }}>{text}</span>
    </div>
  )
}

export function TryCards({ states }: { states: [TileState, TileState, TileState] }) {
  return (
    <div className="grid grid-cols-3 gap-2.5" style={{ width: RIGHT }}>
      {states.map((s, i) => {
        const t = TILE[s]
        return <TryCard key={i} title={`Try ${i + 1}`} text={t.text} color={t.color} icon={t.icon} dashed={t.dashed} />
      })}
    </div>
  )
}

/* ---------------------------------------------------------------- story */

export function PinStory({
  code,
  rows,
  beats,
  newLine,
  outHeight,
  ledger = false,
  arrowFrom,
}: {
  code: string
  rows: number
  /** The frames of each click, click 1 first. */
  beats: Frame[][]
  /** A line that is new on this frame: chipped `new` and tinted on the first click. */
  newLine?: number
  outHeight: number
  /** Show the rupees the app has taken, under the output pane. */
  ledger?: boolean
  /** The line the jump-out arrow leaves from, when a frame asks for it. */
  arrowFrom?: number
}) {
  const beat = useBeats(beats.length)
  const frames = beats[beat - 1] ?? []
  const stage = useStages(beat, frames.length)
  const instant = useInstant()
  const tween = useTween(420)

  /* the new line's tint and chip arrive a moment after the frame does, so the room sees them arrive */
  const [newIn, setNewIn] = useState(instant)
  useEffect(() => {
    if (instant) {
      setNewIn(true)
      return
    }
    setNewIn(false)
    const t = window.setTimeout(() => setNewIn(true), Math.round(350 * motionSpeed))
    return () => window.clearTimeout(t)
  }, [instant])

  const applied = [...beats.slice(0, beat - 1).flat(), ...frames.slice(0, stage)]
  const lit = frames.slice(0, stage).map((f) => f.line).filter((l): l is number => typeof l === 'number')
  const screen: Screen = [...applied].reverse().find((f) => f.screen)?.screen ?? 'pay'
  const outs = applied.map((f) => f.out).filter((o): o is string => typeof o === 'string')
  const tiles: [TileState, TileState, TileState] = ['wait', 'wait', 'wait']
  applied.forEach((f) => {
    if (f.tiles) ([1, 2, 3] as const).forEach((k) => f.tiles?.[k] && (tiles[k - 1] = f.tiles[k] as TileState))
  })
  const paid = [...applied].reverse().find((f) => typeof f.paid === 'number')?.paid ?? 0
  const arrow = Boolean(arrowFrom) && applied.some((f) => f.arrow)
  const showNew = beat === 1 && newLine !== undefined && newIn

  const lines: Record<number, CodeLineState> = {}
  if (showNew && newLine !== undefined) lines[newLine] = 'mark'
  lit.forEach((l) => (lines[l] = 'now'))

  const rowMid = (n: number) => BAR + PAD + (n - 1) * ROW_H + ROW_H / 2
  const codeLines = code.split('\n')
  const arrowStart = arrowFrom ? TEXT_X + codeLines[arrowFrom - 1].length * CH + 18 : 0
  const railX = LEFT - 44
  const arrowEnd = BAR + PAD + rows * ROW_H + 10

  return (
    <>
      <div className="flex items-start" style={{ gap: GAP }}>
        <div className="flex shrink-0 flex-col" style={{ width: LEFT }}>
          <div className="relative">
            <CodeBlock code={code} filename="Python" chip={false} fontSize={FONT} rows={rows} lines={lines} />
            {newLine !== undefined && (
              <span
                className="pointer-events-none absolute right-3 inline-flex h-[22px] items-center rounded-pill px-2.5 font-body text-[13.5px] font-bold text-white"
                style={{
                  top: rowMid(newLine) - 11,
                  background: colors.success,
                  opacity: showNew ? 1 : 0,
                  transform: showNew ? 'translateX(0)' : 'translateX(-18px)',
                  transition: instant ? 'none' : `opacity ${Math.round(520 * motionSpeed)}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${Math.round(520 * motionSpeed)}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                }}
              >
                new
              </span>
            )}
            {arrowFrom !== undefined && (
              <>
                {/* the jump out of the loop: slide 8's legend colour, the plan's own words. The path is SVG, the label is DOM (content rule 17). */}
                <svg aria-hidden className="pointer-events-none absolute left-0 top-0 overflow-visible" width={LEFT} height={arrowEnd + 12} style={{ opacity: arrow ? 1 : 0, transition: tween }}>
                  {arrow && (
                    <>
                      <path
                        d={`M ${arrowStart} ${rowMid(arrowFrom)} H ${railX} V ${arrowEnd}`}
                        fill="none"
                        stroke={colors.success}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={instant ? undefined : 'sm-dash'}
                      />
                      <path d={`M ${railX - 6} ${arrowEnd - 2} L ${railX} ${arrowEnd + 8} L ${railX + 6} ${arrowEnd - 2} Z`} fill={colors.success} />
                    </>
                  )}
                </svg>
                <span
                  className="pointer-events-none absolute text-[13px] font-bold leading-none"
                  style={{ right: LEFT - railX + 10, top: rowMid(rows) - 7, color: colors.success, opacity: arrow ? 1 : 0, transition: tween }}
                >
                  leave now
                </span>
              </>
            )}
          </div>
          <Glow on={outs.length > 0} pulse={outs.length} color={colors.success} className="mt-3">
            <OutputPanel output={outs.join('\n') || ' '} kind="result" fontSize={FONT} lineHeight={1.4} height={outHeight} />
          </Glow>
          {ledger && (
            <p className="mt-2 flex items-baseline gap-3 pl-1 text-[14px] font-semibold" style={{ color: colors.muted }}>
              Paid so far
              <span className="font-mono text-[20px] font-bold" style={{ color: paid >= 80 ? colors.danger : paid > 0 ? colors.success : colors.muted, transition: tween }}>
                ₹{paid}
              </span>
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-center gap-2.5" style={{ width: RIGHT }}>
          <PinPhone screen={screen} scale={SCALE} />
          <TryCards states={tiles} />
        </div>
      </div>
      <StepControls at={beat} total={beats.length} />
    </>
  )
}
