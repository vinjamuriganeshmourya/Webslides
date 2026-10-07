import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { colors } from '@/design/tokens'
import { T, perSegment } from '@/ui/figureTiming'
import { Rise, FadeG, FadeIn, drawAnim, useFigureAnim, at, ease, type FigureAnim } from './figureMotion'

/**
 * Meter — the electricity meter on the wall at home, drawn once, seen five
 * times across the deck.
 *
 * WHAT IT ARGUES
 *   "Pay for use" is a sentence until the room watches a readout tick while a
 *   bulb is lit. Four states, one geometry:
 *
 *     running     lamp and bulb lit, the last digit ticks every 900ms
 *     stopped     lamp and bulb off, digits still: nothing to pay
 *     idleBilled  lamp and bulb OFF and the digits still tick, in danger red.
 *                 The disk of a stopped instance, the unattached address.
 *     alert       running, plus a bell above the lamp and a threshold line
 *                 along the top of the readout. The bell tilts once as the first digit
 *                 passes it.
 *
 * HOW IT MOVES
 *   Box `T.enter`, lamp +1 beat, cable traces, bulb fades as it lands, label
 *   last. Then the tick: the ONE looping motion in the deck, slow, one digit,
 *   quiet enough to talk over. Each digit is a cell with the outgoing numeral
 *   sliding up and the incoming one sliding in from below (transform only).
 *   It never runs under `useInstant()` and stops when the figure unmounts.
 *
 * SIZES
 *   `lg` 420x330 for a column, `md` 320x240 for an aside, `sm` 200x120 inside a
 *   card. `md` is `lg` scaled. `sm` is its own compact drawing: the box, the
 *   lamp and four full-size digits, no cable, bulb, unit or label, because the
 *   card it sits in carries the words and 13px digits cannot be read from the
 *   back of a room.
 */

export type MeterState = 'running' | 'stopped' | 'idleBilled' | 'alert'

const LG = { w: 420, h: 330 }
const BOX = { x: 80, y: 44, w: 260, h: 150 }
const CELL = { w: 36, h: 56, gap: 5 }
const READ = { x: BOX.x + 30, y: BOX.y + 20, w: 200, h: CELL.h }
const LAMP = { cx: BOX.x + BOX.w / 2, cy: BOX.y, r: 11 }
const BELL = { cx: LAMP.cx, y: 2, size: 26 }
const CABLE = { x: LAMP.cx, y1: BOX.y + BOX.h, y2: BOX.y + BOX.h + 60 }
const BULB = { cx: LAMP.cx, top: CABLE.y2, h: 44 }
const LABEL_Y = BULB.top + BULB.h + 8
const TICK_MS = 900

const SIZE = { lg: 1, md: 320 / 420, sm: 1 } as const
const SM = { w: 200, h: 120, box: { x: 0, y: 22, w: 200, h: 96 }, cell: { w: 38, gap: 6 }, lampR: 9 }

export function Meter({
  state,
  unit = 'per hour',
  label,
  reading = '00000',
  size = 'lg',
  tick,
  className = '',
}: {
  state: MeterState
  unit?: string
  label?: string
  reading?: string
  size?: keyof typeof SIZE
  tick?: boolean
  className?: string
}) {
  const a = useFigureAnim()
  const k = SIZE[size]
  const lit = state === 'running' || state === 'alert'
  const ticking = (tick ?? (state === 'running' || state === 'idleBilled' || state === 'alert')) && !a.instant
  const glow = lit ? colors.brand : colors.muted
  const digitTone = state === 'idleBilled' ? colors.danger : colors.ink
  const full = size !== 'sm'
  const h = full ? LG.h : BOX.y + BOX.h + 8

  /* The story's clock. */
  const tBox = at(0)
  const tLamp = at(1)
  const tCable = at(2)
  const tBulb = tCable + T.draw * 0.7
  const tLabel = tBulb + T.stagger
  const tTick = (full ? tLabel : tLamp) + T.enter

  const count = useTicker(ticking, tTick, TICK_MS, parseInt(reading, 10) || 0)
  const digits = String(count % 100000).padStart(5, '0').split('')

  if (!full) {
    return (
      <div className={`relative mx-auto ${className}`} style={{ width: SM.w, height: SM.h }}>
        <Rise a={a} x={SM.box.x} y={SM.box.y} w={SM.box.w} delay={tBox}>
          <div className="relative rounded-card bg-white shadow-card" style={{ height: SM.box.h, border: `2px solid ${colors.ink}` }}>
            <FadeIn a={a} delay={tLamp} className="absolute rounded-full bg-white" style={{ left: SM.box.w / 2 - SM.lampR - 2, top: -SM.lampR - 4, width: SM.lampR * 2 + 4, height: SM.lampR * 2 + 4, padding: 2, border: `2px solid ${colors.ink}` }}>
              <div className="size-full rounded-full" style={{ background: glow, boxShadow: lit ? `0 0 0 4px ${colors.brand}22` : 'none' }} />
            </FadeIn>
            <div className="absolute flex" style={{ left: (SM.box.w - (4 * SM.cell.w + 3 * SM.cell.gap)) / 2 - 2, top: (SM.box.h - CELL.h) / 2 - 2, gap: SM.cell.gap }}>
              {digits.slice(1).map((d, i) => (
                <Cell key={i} digit={d} tone={digitTone} danger={state === 'idleBilled'} a={a} w={SM.cell.w} />
              ))}
            </div>
          </div>
        </Rise>
      </div>
    )
  }

  return (
    <div className={`relative mx-auto ${className}`} style={{ width: LG.w * k, height: h * k }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: LG.w, height: h, transform: `scale(${k})` }}>
        <svg className="absolute inset-0" width={LG.w} height={h} viewBox={`0 0 ${LG.w} ${h}`} aria-hidden>
          {full && (
            <>
              <motion.line x1={CABLE.x} y1={CABLE.y1} x2={CABLE.x} y2={CABLE.y2} stroke={colors.ink} strokeWidth={2.5} strokeLinecap="round" {...drawAnim(a, tCable)} />
              <FadeG a={a} delay={tBulb}>
                <Bulb cx={BULB.cx} top={BULB.top} lit={lit} />
              </FadeG>
            </>
          )}
        </svg>

        {/* the box */}
        <Rise a={a} x={BOX.x} y={BOX.y} w={BOX.w} delay={tBox}>
          <div className="relative rounded-card bg-white shadow-card" style={{ height: BOX.h, border: `2px solid ${colors.ink}` }}>
            {/* the lamp, straddling the top edge */}
            <FadeIn a={a} delay={tLamp} className="absolute rounded-full bg-white" style={{ left: BOX.w / 2 - LAMP.r - 2, top: -LAMP.r - 4, width: LAMP.r * 2 + 4, height: LAMP.r * 2 + 4, padding: 2, border: `2px solid ${colors.ink}` }}>
              <div className="size-full rounded-full" style={{ background: glow, boxShadow: lit ? `0 0 0 4px ${colors.brand}22` : 'none' }} />
            </FadeIn>

            {/* the readout */}
            <div className="absolute flex" style={{ left: READ.x - BOX.x - 2, top: READ.y - BOX.y - 2, gap: CELL.gap }}>
              {digits.map((d, i) => (
                <Cell key={i} digit={d} tone={digitTone} danger={state === 'idleBilled'} a={a} />
              ))}
            </div>

            {state === 'alert' && (
              <FadeIn a={a} delay={tLamp} className="absolute" style={{ left: READ.x - BOX.x - 12, top: READ.y - BOX.y - 9, width: BOX.w - (READ.x - BOX.x) + 10, height: 2, background: colors.danger }}>
                <span className="absolute whitespace-nowrap rounded px-1.5 text-[11px] font-bold leading-4 text-white" style={{ left: '100%', marginLeft: 6, top: -7, background: colors.danger }}>alert at 0</span>
              </FadeIn>
            )}

            <div className="absolute inset-x-0 text-center text-[17px] font-semibold leading-6" style={{ top: READ.y - BOX.y + READ.h + 14, color: colors.body }}>
              {unit}
            </div>
          </div>
        </Rise>

        {state === 'alert' && (
          <Rise a={a} x={BELL.cx - BELL.size / 2} y={BELL.y} w={BELL.size} delay={tLamp} dy={-6}>
            <Bell size={BELL.size} tiltAt={tTick + T.label} a={a} />
          </Rise>
        )}

        {full && label && (
          <Rise a={a} x={20} y={LABEL_Y} w={LG.w - 40} delay={tLabel} className="text-center">
            <span className="text-[18px] font-semibold leading-6 text-ink">{label}</span>
          </Rise>
        )}
      </div>
    </div>
  )
}

/** Counts up once every `every` ms, starting `start` seconds after mount, while `on`. */
function useTicker(on: boolean, start: number, every: number, from: number) {
  const [n, setN] = useState(from)
  useEffect(() => {
    if (!on) return
    let id: ReturnType<typeof setInterval> | undefined
    const t = setTimeout(() => {
      setN((v) => v + 1)
      id = setInterval(() => setN((v) => v + 1), every)
    }, start * 1000)
    return () => {
      clearTimeout(t)
      if (id) clearInterval(id)
    }
  }, [on, start, every])
  return n
}

/** One readout cell. The digit that changes slides up and out; the new one slides in from below. */
function Cell({ digit, tone, danger, a, w = CELL.w }: { digit: string; tone: string; danger: boolean; a: FigureAnim; w?: number }) {
  return (
    <div
      className="relative overflow-hidden rounded-md"
      style={{ width: w, height: CELL.h, background: colors.surface2, border: `2px solid ${danger ? colors.danger : colors.line}` }}
    >
      <AnimatePresence initial={false}>
        <motion.span
          key={digit}
          className="absolute inset-0 grid place-items-center font-mono text-[28px] font-bold tabular-nums leading-none"
          style={{ color: tone }}
          initial={a.reduce ? { opacity: 0 } : { transform: 'translateY(100%)' }}
          animate={{ transform: 'translateY(0%)', opacity: 1 }}
          exit={a.reduce ? { opacity: 0 } : { transform: 'translateY(-100%)' }}
          transition={{ duration: T.label, ease }}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

/** A light bulb: glass, a screw base, and rays only while it is lit. */
export function Bulb({ cx, top, lit }: { cx: number; top: number; lit: boolean }) {
  const r = 14
  const cy = top + r + 4
  const tone = lit ? colors.brand : colors.muted
  return (
    <g>
      {lit &&
        [-50, -20, 20, 50].map((deg) => {
          const rad = (deg * Math.PI) / 180
          return <line key={deg} x1={cx + Math.sin(rad) * (r + 5)} y1={cy - Math.cos(rad) * (r + 5)} x2={cx + Math.sin(rad) * (r + 11)} y2={cy - Math.cos(rad) * (r + 11)} stroke={colors.brand} strokeWidth={2.5} strokeLinecap="round" />
        })}
      <circle cx={cx} cy={cy} r={r} fill={lit ? colors.brand : colors.white} stroke={tone} strokeWidth={2.5} />
      {lit && <circle cx={cx - 5} cy={cy - 5} r={3} fill={colors.white} opacity={0.8} />}
      <rect x={cx - 7} y={cy + r - 2} width={14} height={10} rx={2} fill={colors.white} stroke={tone} strokeWidth={2.5} />
      <line x1={cx - 4} y1={cy + r + 12} x2={cx + 4} y2={cy + r + 12} stroke={tone} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  )
}

/** A bell that tilts once, from its crown, when the meter first ticks past the line. */
function Bell({ size, tiltAt, a }: { size: number; tiltAt: number; a: FigureAnim }) {
  const swing = a.instant || a.reduce ? undefined : { transform: ['rotate(0deg)', 'rotate(15deg)', 'rotate(-9deg)', 'rotate(4deg)', 'rotate(0deg)'] }
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={colors.danger}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transformOrigin: '50% 8%', display: 'block' }}
      animate={swing}
      transition={{ duration: T.accent, delay: tiltAt, ease: perSegment(5) }}
      aria-hidden
    >
      <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
      <path d="M12 3v2" />
    </motion.svg>
  )
}
