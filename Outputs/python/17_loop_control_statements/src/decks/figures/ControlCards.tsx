import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Pill, Slot } from './pieces'

/**
 * CONTROL STATEMENTS CHANGE THE ORDER YOUR LINES RUN IN. PF 17 slide 7, four
 * beats, one card per press into its dashed slot: plain code, if-elif-else,
 * while and for, and today's break and continue. Each card draws the flow
 * beside its lines in the legend's three colours (next line brand, back to
 * the top accent, break jumps out success) and lists the order the lines ran
 * in, so the room reads the SHAPE before any of today's words is defined.
 *
 * Every order is a real run (CPython 3.12.3): the plan's output table.
 */
interface Card {
  title: string
  sub: string
  code: string[]
  dim?: number[]
  order: number[]
  flow: 'down' | 'down3' | 'back' | 'break'
  today?: boolean
}

const CARDS: Card[] = [
  { title: 'plain', sub: 'one line after another', code: ['print("A")', 'print("B")', 'print("C")'], order: [1, 2, 3], flow: 'down' },
  { title: 'if-elif-else', sub: 'picks one block, skips the rest', code: ['marks = 72', 'if marks >= 35:', '    print("pass")', 'else:', '    print("fail")'], dim: [4, 5], order: [1, 2, 3], flow: 'down3' },
  { title: 'while, for', sub: 'goes back up and runs again', code: ['for i in range(2):', '    print(i)', 'print("done")'], order: [1, 2, 1, 2, 1, 3], flow: 'back' },
  { title: 'break, continue', sub: 'changes the loop from inside', code: ['for i in range(5):', '    if i == 1:', '        break', '    print(i)', 'print("End")'], order: [1, 2, 4, 1, 2, 3, 5], flow: 'break', today: true },
]

const ROW = 30
const KEYWORDS = new Set(['for', 'in', 'if', 'else', 'while', 'break', 'continue', 'elif', 'pass'])

/** One code line, lightly coloured: keywords brand, strings success, numbers accent. */
function Code({ text }: { text: string }) {
  const parts = text.split(/(\s+|"[^"]*"|\b\d+\b|\w+|[^\w\s]+)/g).filter(Boolean)
  return (
    <>
      {parts.map((p, i) => {
        let color: string | undefined
        if (KEYWORDS.has(p)) color = colors.brandDark
        else if (/^"/.test(p)) color = colors.success
        else if (/^\d+$/.test(p)) color = colors.accentDark
        return (
          <span key={i} style={color ? { color, fontWeight: KEYWORDS.has(p) ? 700 : 500 } : undefined}>
            {p}
          </span>
        )
      })}
    </>
  )
}

/** The flow beside the lines. Dots mark the lines that run; the arrows are the legend's. */
function Flow({ kind, lines }: { kind: Card['flow']; lines: number }) {
  const y = (n: number) => (n - 0.5) * ROW
  const x = 10
  const head = (px: number, py: number, dir: 'down' | 'left') =>
    dir === 'down' ? `M ${px - 4} ${py - 7} L ${px} ${py} L ${px + 4} ${py - 7}` : `M ${px + 7} ${py - 4} L ${px} ${py} L ${px + 7} ${py + 4}`
  const dots = (ns: number[]) => ns.map((n) => <circle key={n} cx={x} cy={y(n)} r={3.5} fill={colors.white} stroke={colors.brand} strokeWidth={2} />)
  let body: ReactNode
  if (kind === 'down' || kind === 'down3') {
    body = (
      <>
        <path d={`M ${x} ${y(1)} V ${y(3)}`} stroke={colors.brand} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <path d={head(x, y(3) + 2, 'down')} stroke={colors.brand} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {dots([1, 2, 3])}
      </>
    )
  } else if (kind === 'back') {
    body = (
      <>
        <path d={`M ${x} ${y(1)} V ${y(3)}`} stroke={colors.brand} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <path d={head(x, y(3) + 2, 'down')} stroke={colors.brand} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${x + 4} ${y(2)} C ${x + 34} ${y(2)} ${x + 34} ${y(1)} ${x + 8} ${y(1)}`} stroke={colors.accentDark} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <path d={head(x + 6, y(1), 'left')} stroke={colors.accentDark} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {dots([1, 2, 3])}
      </>
    )
  } else {
    body = (
      <>
        <path d={`M ${x} ${y(1)} V ${y(4)}`} stroke={colors.brand} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <path d={`M ${x + 4} ${y(4)} C ${x + 36} ${y(4)} ${x + 36} ${y(1)} ${x + 8} ${y(1)}`} stroke={colors.accentDark} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <path d={head(x + 6, y(1), 'left')} stroke={colors.accentDark} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${x + 4} ${y(3)} C ${x + 26} ${y(3)} ${x + 26} ${y(5)} ${x + 8} ${y(5)}`} stroke={colors.success} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <path d={head(x + 6, y(5), 'left')} stroke={colors.success} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {dots([1, 2, 3, 4, 5])}
      </>
    )
  }
  return (
    <svg aria-hidden width={44} height={lines * ROW} className="shrink-0 overflow-visible">
      {body}
    </svg>
  )
}

export function Legend() {
  const items: [string, string][] = [
    ['next line', colors.brand],
    ['back to the top', colors.accentDark],
    ['break: jump out', colors.success],
  ]
  return (
    <p className="flex items-center gap-6 text-[16px] font-semibold" style={{ color: colors.body }}>
      {items.map(([t, c]) => (
        <span key={t} className="flex items-center gap-2">
          <span className="inline-block h-[3px] w-6 rounded-full" style={{ background: c }} />
          {t}
        </span>
      ))}
    </p>
  )
}

export function ControlCards() {
  const beat = useBeats(CARDS.length)
  return (
    <>
      <div className="flex flex-col gap-3">
        <Legend />
        <div className="grid grid-cols-4 gap-4">
          {CARDS.map((c, i) => {
            const warm = c.today
            return (
              <Slot key={c.title} on={beat > i} className="h-[318px]" style={warm && beat > i ? { boxShadow: `0 6px 24px -10px rgba(0,37,75,0.16), inset 0 0 0 2px ${colors.accent}` } : undefined}>
                <div className="relative flex h-full flex-col px-4 pb-3 pt-2">
                  {/* a fixed strip on every card, so the badge on the fourth never meets its title and the four titles stay level */}
                  <div className="flex h-[22px] justify-end">{warm && <Pill bg={colors.accent} className="!text-[12.5px]">today</Pill>}</div>
                  <p className="text-center font-mono text-[19px] font-bold leading-none" style={{ color: colors.brandDark }}>{c.title}</p>
                  <p className="mt-1.5 text-center text-[13.5px] font-semibold leading-tight" style={{ color: colors.body }}>{c.sub}</p>
                  <div className="mt-3 flex items-start">
                    <div className="min-w-0 flex-1">
                      {c.code.map((l, k) => (
                        <p key={k} className="flex items-center whitespace-pre font-mono text-[13.5px]" style={{ height: ROW, color: colors.ink, opacity: c.dim?.includes(k + 1) ? 0.35 : 1 }}>
                          <span className="mr-2 inline-block w-3 text-right text-[11.5px]" style={{ color: colors.muted }}>{k + 1}</span>
                          <Code text={l} />
                        </p>
                      ))}
                    </div>
                    <Flow kind={c.flow} lines={c.code.length} />
                  </div>
                  <div className="mt-auto flex flex-col items-center gap-1.5">
                    <span className="text-[12px] font-semibold" style={{ color: colors.muted }}>lines run in this order</span>
                    <span className="flex flex-wrap justify-center gap-1">
                      {c.order.map((n, k) => (
                        <span
                          key={k}
                          className="grid h-[24px] w-[24px] place-items-center rounded-md font-mono text-[13px] font-bold"
                          style={warm ? { background: `${colors.accent}2E`, color: colors.accentDark } : { background: colors.surface2, color: colors.brandDark }}
                        >
                          {n}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
              </Slot>
            )
          })}
        </div>
      </div>
      <StepControls at={beat} total={CARDS.length} />
    </>
  )
}
