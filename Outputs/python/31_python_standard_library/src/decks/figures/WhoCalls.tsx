import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Group, Lines } from './common'
import { OutPanel, sentences, CODE_FS, OUT_FS, type OutLine } from './pieces'
import { CodePane, StepCaption } from './trace'
import { lines, type Prog } from './cards'
import { SPEC } from './spec'

/**
 * EXPLAINER E1: WHO CALLS is_rated_4? Fifteen presses, format "walk".
 *
 * rating.py with its line numbers; beside it the six ratings in a row and an
 * empty kept list. One event per press, in the order of data.walk: on a
 * call, an arrow jumps from line 5 up into def is_rated_4 carrying the
 * rating, and line 1 lights; on a return, line 2 lights and the arrow comes
 * back down to line 5 carrying True or False, the rating gets a tick (and a
 * copy drops into kept) or a cross; the print step prints both lines. Ticks
 * and crosses stay to the end (its must line); the ratings row never
 * changes; nothing moves by itself.
 *
 * THE ARROW LIVES IN A LANE OF ITS OWN, left of the code panel (rule 42): it
 * path-draws from the row of line 5 up and into the row of line 1, a 2.5px
 * line with a straight run into a 9px head on its own axis (rules 45, 46),
 * and the return arrow the same way down. Session 11's Follow the Dot is
 * the bar: one thing moves at a time, and what is done stays marked.
 */
const EASE = [0.22, 1, 0.36, 1] as const
const E1 = SPEC.E1
const PROG: Prog = E1.code[0]
type Walk = { kind: 'call' | 'return' | 'print'; line: number; rating?: number; result?: boolean; kept: number[]; printed?: string; caption: string }
const WALK: Walk[] = E1.data.walk
const RATINGS = [4.3, 4.1, 3.8, 3.6, 4.6, 3.9]
const TOTAL = 2 + WALK.length /* 15 */
/* the code panel's rows: header 46, padding 16, rows of 23 at CODE_FS 15 */
const ROW_Y = (line: number) => 46 + 16 + (line - 1) * 23 + 11.5
const LANE_W = 60

/** The arrow in the lane: up into line 1 on a call, down to line 5 on a return. */
function LaneArrow({ kind, value, k }: { kind: 'call' | 'return'; value: string; k: string }) {
  const instant = useInstant()
  const up = kind === 'call'
  const y0 = up ? ROW_Y(5) : ROW_Y(2)
  const y1 = up ? ROW_Y(1) : ROW_Y(5)
  const X_END = LANE_W - 2
  const base = X_END - 9
  const d = `M${X_END} ${y0} C 8 ${y0}, 8 ${y1}, ${base - 10} ${y1} L ${base} ${y1}`
  const ink = up ? colors.brandDark : value === 'True' ? colors.success : colors.danger
  const midY = (y0 + y1) / 2
  return (
    <div className="absolute left-0 top-0" style={{ width: LANE_W, height: 220 }}>
      <svg width={LANE_W} height={220} viewBox={`0 0 ${LANE_W} 220`} aria-hidden className="absolute inset-0">
        <motion.path key={`p-${k}`} d={d} fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="butt" initial={instant ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: instant ? 0 : 0.86, ease: 'easeInOut' }} />
        <motion.path key={`h-${k}`} d={`M${base} ${y1 - 4.5} L${base} ${y1 + 4.5} L${X_END} ${y1} Z`} fill={ink} initial={instant ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: instant ? 0 : 0.2, delay: instant ? 0 : 0.8 }} />
      </svg>
      <motion.span
        key={`c-${k}`}
        className="absolute whitespace-nowrap rounded-md px-1.5 font-mono text-[12px] font-bold leading-[20px]"
        style={{ left: 2, top: midY - 10, background: ink, color: colors.white }}
        initial={instant ? false : { opacity: 0, y: up ? 24 : -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: instant ? 0 : 0.7, ease: EASE }}
      >
        {value}
      </motion.span>
    </div>
  )
}

/** A rating with its tick, cross, or nothing yet under it. */
function Rated({ value, verdict, now }: { value: number; verdict: boolean | null; now: boolean }) {
  const tween = useTween(420)
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="grid h-[38px] w-[52px] place-items-center rounded-lg font-mono text-[16px] font-bold" style={{ background: now ? colors.surface2 : colors.white, color: colors.ink, boxShadow: `inset 0 0 0 ${now ? 2.5 : 1.5}px ${now ? colors.brand : colors.line}`, transition: tween }}>
        {value.toFixed(1)}
      </span>
      <span className="h-[20px] text-[18px] font-bold leading-[20px]" style={{ color: verdict ? colors.success : colors.danger, opacity: verdict === null ? 0 : 1, transition: tween }}>
        {verdict === null ? '·' : verdict ? '✓' : '✗'}
      </span>
    </div>
  )
}

export function WhoCalls() {
  const beat = useBeats(TOTAL)
  const step: Walk | null = beat >= 2 && beat <= TOTAL - 1 ? WALK[beat - 2] : null
  const done = beat >= TOTAL ? WALK : WALK.slice(0, Math.max(0, beat - 1))
  const verdicts: Record<number, boolean> = {}
  done.forEach((w) => {
    if (w.kind === 'return' && w.rating !== undefined && w.result !== undefined) verdicts[w.rating] = w.result
  })
  const kept: number[] = done.length ? done[done.length - 1].kept : []
  const printed = done.some((w) => w.kind === 'print')
  const out: OutLine[] = printed ? lines(PROG.output) : []
  const at = step ? step.line : beat >= TOTAL ? 6 : undefined
  const caption = beat === 1 ? E1.show[0] : beat >= TOTAL ? E1.show[1] : step!.caption
  const arrow = step && step.kind !== 'print' ? step : null
  return (
    <>
      <div className="flex items-stretch gap-3">
        <Group pad={10} className="flex w-[620px] shrink-0 flex-col gap-2.5" style={{ height: 400 }} active={beat === 1 || !!arrow}>
          <div className="relative flex items-start" style={{ paddingLeft: LANE_W }}>
            {arrow && <LaneArrow kind={arrow.kind as 'call' | 'return'} value={arrow.kind === 'call' ? String(arrow.rating) : String(arrow.result)} k={`${beat}`} />}
            <div className="min-w-0 flex-1">
              <CodePane code={PROG.src} fontSize={CODE_FS} rows={6} at={at} highlight={beat === 1 ? 5 : undefined} />
            </div>
          </div>
          <div style={{ paddingLeft: LANE_W }}>
            <OutPanel lines={out} minRows={2} fontSize={OUT_FS} />
          </div>
        </Group>
        <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-3" style={{ height: 400 }} active={!!step && step.kind !== 'call'}>
          <StepCaption text={caption} tone={beat >= TOTAL ? 'rule' : 'step'} size={15} minH={64} />
          <div className="flex items-start gap-2">
            <span className="mt-2 w-[52px] shrink-0 font-mono text-[13px] font-semibold" style={{ color: colors.body }}>
              ratings
            </span>
            {RATINGS.map((r) => (
              <Rated key={r} value={r} verdict={r in verdicts ? verdicts[r] : null} now={!!step && step.rating === r} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[52px] shrink-0 font-mono text-[13px] font-semibold" style={{ color: colors.body }}>
              kept
            </span>
            <span className="flex h-[46px] items-center gap-1.5 rounded-xl px-2" style={{ minWidth: 190, boxShadow: `inset 0 0 0 1.5px ${colors.line}`, background: colors.white }}>
              <span className="font-mono text-[16px] font-bold" style={{ color: colors.muted }}>
                [
              </span>
              {kept.map((v, i) => (
                <motion.span key={v} className="grid h-[32px] w-[48px] place-items-center rounded-md font-mono text-[15px] font-bold" style={{ background: '#E9F8EF', color: '#137A3A', boxShadow: `inset 0 0 0 1.5px ${colors.success}` }} initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: i === kept.length - 1 ? 0.3 : 0 }}>
                  {v.toFixed(1)}
                </motion.span>
              ))}
              <span className="font-mono text-[16px] font-bold" style={{ color: colors.muted }}>
                ]
              </span>
            </span>
          </div>
          <p className="mt-auto text-[13px] font-semibold" style={{ color: colors.muted }}>
            <Lines lines={sentences('Line 2 is where is_rated_4 answers. Nobody wrote that call')} />
          </p>
        </Group>
      </div>
      <StepControls at={beat} total={TOTAL} />
    </>
  )
}
