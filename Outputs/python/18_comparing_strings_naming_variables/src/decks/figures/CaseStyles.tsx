import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Speaker } from './Characters'

/**
 * CASE STYLES: PYTHON USES SNAKE CASE. PF 18 slide 22.
 *
 * `Total Bill` is refused for its space; the three ways to write it without
 * one land one per press, and the last, snake case, is the one Python uses.
 * The capital that starts each new word is the brand's dark blue, and camel
 * case carries the reference's small hump over its one capital.
 */
interface Part {
  t: string
  cap?: boolean
  hump?: boolean
}

const ROWS: { name: string; parts: Part[]; note: string }[] = [
  { name: 'Camel case', parts: [{ t: 'total' }, { t: 'B', cap: true, hump: true }, { t: 'ill' }], note: 'a capital for each new word, like a hump' },
  { name: 'Pascal case', parts: [{ t: 'T', cap: true }, { t: 'otal' }, { t: 'B', cap: true }, { t: 'ill' }], note: 'every word begins with a capital' },
  { name: 'Snake case', parts: [{ t: 'total' }, { t: '_', cap: true }, { t: 'bill' }], note: 'small letters, joined by _' },
]

const ANU: Record<number, ReactNode> = { 1: <>My box holds the total bill<br />How do I write it?</> }
const PC: Record<number, ReactNode> = {
  1: <>Not with a space<br />I refuse <b>Total Bill</b></>,
  2: <>Camel case: small first, then a capital hump</>,
  3: <>Pascal case: every word gets a capital</>,
  4: <>In Python, we use snake case: <b>total_bill</b></>,
}

export function CaseStyles() {
  const beat = useBeats(4)
  const tween = useTween(420)
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="mx-auto flex h-[52px] items-center gap-3 rounded-xl px-5" style={{ background: '#FFF4EC', border: `1.5px solid ${colors.accent}` }}>
          <span className="text-[18px] font-semibold" style={{ color: colors.body }}>Variable:</span>
          <span className="font-mono text-[24px] font-bold" style={{ color: colors.ink }}>Total Bill</span>
          <span className="ml-4 grid h-7 w-7 place-items-center rounded-full" style={{ background: colors.danger }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" aria-hidden>
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </span>
        </div>
        {ROWS.map((r, k) => {
          const on = beat >= k + 2
          const best = k === 2 && on
          return (
            <div
              key={r.name}
              className="grid h-[64px] grid-cols-[200px_1fr_320px] items-center rounded-2xl px-6"
              style={{
                background: on ? (best ? '#E9F8EF' : colors.white) : 'rgba(255,255,255,0.5)',
                border: `2px ${on ? 'solid' : 'dashed'} ${best ? colors.success : colors.line}`,
                boxShadow: on && !best ? '0 6px 24px -10px rgba(0,37,75,0.16)' : 'none',
                transition: tween,
              }}
            >
              <p className="font-heading text-[19px] font-bold" style={{ color: colors.ink, opacity: on ? 1 : 0, transition: tween }}>{r.name}</p>
              <p className="text-center font-mono text-[30px] font-bold leading-none" style={{ color: colors.ink, opacity: on ? 1 : 0, transition: tween }}>
                {r.parts.map((p, i) => (
                  <span key={i} className="relative inline-block" style={{ color: p.cap ? colors.brandDark : colors.ink }}>
                    {p.hump && (
                      <svg aria-hidden width="30" height="14" viewBox="0 0 30 14" className="absolute left-1/2 -top-[14px] -translate-x-1/2">
                        <path d="M2 12 Q15 -4 28 12" fill="none" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    )}
                    {p.t}
                  </span>
                ))}
              </p>
              <p className="text-right text-[16px] font-semibold" style={{ color: colors.body, opacity: on ? 1 : 0, transition: tween }}>{r.note}</p>
            </div>
          )
        })}
        <div className="mt-1 flex items-start justify-between">
          <Speaker who="anu" say={ANU[beat]} beatKey={beat} height={116} bubbleWidth={260} size={17} />
          <Speaker who="computer" look="3d" say={PC[beat]} mood={beat === 1 ? 'no' : 'smile'} beatKey={beat} height={108} bubbleWidth={270} size={17} />
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
