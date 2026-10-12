import { useEffect, useRef, useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Focus, Group, Lines } from './common'
import { Swap, sentences, CODE_FS } from './pieces'
import { CodePane } from './trace'
import { SPEC } from './spec'

/**
 * RECAP: MATCH THE PROGRAM TO WHAT IT GIVES. Spec card S-RECAP, four
 * presses, format "match".
 *
 * All six tiles are on screen from press 1 (must line): the three programs
 * from Teja's canteen across the top, A to C, and the three results under
 * them, 1 to 3. Each press after the first joins one pair, in the order A, B,
 * C, with a line that draws itself from the program down to its result, and
 * the pair's sentence under them; B's full TypeError line shows with it. No
 * join before its vote (must_not): the program being voted is ringed.
 */
const R = SPEC['S-RECAP']
const LETTERS = ['A', 'B', 'C'] as const
const PROGS: string[] = LETTERS.map((l) => R.data.programs[l])
const RIGHT: string[] = R.data.right_tiles
const PAIRS: [string, number][] = R.data.pairs
const FULL: Record<string, string> = R.data.full_outputs
/* the sentence under each pair, in the spec's `show` order (A, B, C) */
const WHY: string[] = R.show.slice(5, 8)

type Pt = { x: number; y: number }

export function RecapMatch() {
  const beat = useBeats(4)
  const joined = beat - 1
  const instant = useInstant()
  const tween = useTween(420)
  const box = useRef<HTMLDivElement>(null)
  const tops = useRef<(HTMLDivElement | null)[]>([])
  const bottoms = useRef<(HTMLDivElement | null)[]>([])
  const [pts, setPts] = useState<{ a: Pt; b: Pt }[]>([])
  /* measured after mount (a child's layout effect runs before the parent's ref is set) */
  useEffect(() => {
    const root = box.current
    if (!root) return
    const r = root.getBoundingClientRect()
    const k = root.offsetWidth ? r.width / root.offsetWidth : 1
    const rel = (el: HTMLElement | null, top: boolean): Pt => {
      const q = el!.getBoundingClientRect()
      return { x: (q.left + q.width / 2 - r.left) / k, y: ((top ? q.bottom : q.top) - r.top) / k }
    }
    setPts(PAIRS.map(([l, n]) => ({ a: rel(tops.current[LETTERS.indexOf(l as 'A')], true), b: rel(bottoms.current[n - 1], false) })))
  }, [])
  const cur = joined >= 1 ? PAIRS[joined - 1] : null
  const pairOf = (n: number) => PAIRS.findIndex(([, m]) => m === n)
  return (
    <>
      <div className="flex flex-col gap-3">
        <span className="text-[18px] font-semibold" style={{ color: colors.body }}>
          <Lines lines={sentences(R.show[0])} />
        </span>
        <div ref={box} className="relative flex flex-col" style={{ gap: 74 }}>
          <Group className="grid gap-4" style={{ gridTemplateColumns: '348px 348px 1fr' }} active={beat === 1 ? true : undefined}>
            {PROGS.map((p, i) => {
              const done = joined > i
              return (
                <div key={`prog-${i}`} ref={(el) => { tops.current[i] = el }} className="relative">
                  <span
                    className="absolute -left-2 -top-2 z-10 grid h-8 w-8 place-items-center rounded-full font-heading text-[17px] font-bold"
                    style={{ background: done ? colors.success : colors.brandDark, color: colors.white, transition: tween }}
                  >
                    {LETTERS[i]}
                  </span>
                  <Focus on={!done && i === joined}>
                    <CodePane code={p} fontSize={CODE_FS} />
                  </Focus>
                </div>
              )
            })}
          </Group>
          <div className="grid gap-4" style={{ gridTemplateColumns: '348px 348px 1fr' }}>
            {RIGHT.map((t, i) => {
              const k = pairOf(i + 1)
              const done = k >= 0 && joined > k
              return (
                <div
                  key={`res-${i}`}
                  ref={(el) => { bottoms.current[i] = el }}
                  className="flex h-[56px] items-center gap-3 rounded-card bg-white px-4"
                  style={{ boxShadow: `inset 0 0 0 ${done ? 3 : 2}px ${done ? colors.success : colors.line}, 0 8px 18px -14px rgba(16,32,58,0.4)`, background: done ? '#E9F8EF' : colors.white, transition: tween }}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[15px] font-bold" style={{ background: done ? colors.success : colors.surface2, color: done ? colors.white : colors.brandDark, transition: tween }}>
                    {i + 1}
                  </span>
                  <span className="whitespace-nowrap font-mono text-[19px] font-bold" style={{ color: t === 'TypeError' ? colors.danger : colors.ink }}>
                    {t}
                  </span>
                </div>
              )
            })}
          </div>
          {/* the joins: one path per pair, drawn from the program down to its result */}
          {/*
            The joins (global arrow rules, user 2026-10-08; content rules 45, 46):
            a small head, 9px long and 9px wide on the 2px line; the line ends
            exactly at the centre of the head's base (butt end: no gap, no
            overlap), and its last stretch is straight down the head's axis.
            The line draws itself, then the head appears where it ends.
          */}
          <svg className="pointer-events-none absolute inset-0" width="100%" height="100%" style={{ overflow: 'visible' }} aria-hidden>
            {pts.map(({ a, b }, i) => {
              const on = joined > i
              const HEAD = 9
              const tip = b.y - 4
              const base = tip - HEAD
              const top = a.y + 4
              /* a smooth S-curve, vertical where it leaves the program and where it
                 enters the head. Each pair bends at its own height (A late, C early),
                 so the three lines cross at three separate points instead of
                 running together in one band (user, 2026-10-09) */
              const end = base - 8
              const H = end - top
              const [k1, k2] = [[0.62, 0.22], [0.4, 0.4], [0.22, 0.62]][i]
              return (
                <g key={`join-${i}`}>
                  <path
                    d={a.x === b.x ? `M ${a.x} ${top} L ${b.x} ${base}` : `M ${a.x} ${top} C ${a.x} ${top + k1 * H}, ${b.x} ${end - k2 * H}, ${b.x} ${end} L ${b.x} ${base}`}
                    fill="none"
                    stroke={colors.success}
                    strokeWidth={2}
                    strokeLinecap="butt"
                    strokeLinejoin="round"
                    pathLength={1}
                    strokeDasharray="1"
                    style={{ strokeDashoffset: on ? 0 : 1, opacity: on ? 1 : 0, transition: instant ? 'none' : 'stroke-dashoffset 860ms cubic-bezier(0.65,0,0.35,1), opacity 160ms' }}
                  />
                  <path
                    d={`M ${b.x - HEAD / 2} ${base} L ${b.x + HEAD / 2} ${base} L ${b.x} ${tip} Z`}
                    fill={colors.success}
                    style={{ opacity: on ? 1 : 0, transition: instant ? 'none' : `opacity 200ms ease-out ${on ? 760 : 0}ms` }}
                  />
                </g>
              )
            })}
          </svg>
        </div>
        <div className="min-h-[64px]">
          <Swap k={joined}>
            {cur && (
              <div className="flex flex-col gap-1 rounded-xl px-4 py-2" style={{ background: colors.surface2, boxShadow: `inset 4px 0 0 ${colors.brandDark}` }}>
                {cur[0] === 'B' && (
                  <span className="font-mono text-[16px] font-semibold" style={{ color: colors.danger }}>
                    {FULL.B}
                  </span>
                )}
                <span className="flex items-start gap-3 text-[18px] font-semibold leading-snug" style={{ color: colors.ink }}>
                  <span className="shrink-0 whitespace-nowrap rounded-md px-2 py-0.5 font-mono text-[15px] font-bold" style={{ background: colors.brandDark, color: colors.white }}>
                    {cur[0]} {'\u2192'} {cur[1]}
                  </span>
                  <span>
                    <Lines lines={sentences(WHY[joined - 1])} />
                  </span>
                </span>
              </div>
            )}
          </Swap>
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
