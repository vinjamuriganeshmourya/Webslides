import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Speaker } from './Characters'

/**
 * UNICODE RANGES. PF 18 slide 10: where the digits, the capitals and the small
 * letters live, and that everything else has a number too. One band per press,
 * each band every character of its range with its value underneath, so the
 * room can see the ranges are solid runs and not a lucky few.
 */
const run = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => String.fromCharCode(a + i))

const BANDS = [
  { head: '48 to 57', sub: 'digits', chars: run(48, 57), tone: colors.brandDark },
  { head: '65 to 90', sub: 'capital letters', chars: run(65, 90), tone: colors.brandDark },
  { head: '97 to 122', sub: 'small letters', chars: run(97, 122), tone: colors.brandDark },
  /* `&`, not `and`: the longer line wrapped to two in the 196px column and the
     block stood taller than its 60px band (user, 2026-10-05). One line now. */
  { head: 'Everything else', sub: 'signs & other languages', chars: ['@', '₹', 'అ', 'அ'], tone: colors.accentDark, wide: true },
]

const ANU: Record<number, ReactNode> = {
  1: <>Where do the digits live?</>,
  4: <>Even <b>₹</b>, and Telugu and Tamil letters?</>,
}
const PC: Record<number, ReactNode> = {
  1: <>At <b>48 to 57</b><br />Even 0 is not stored as 0</>,
  2: <>Capitals sit at <b>65 to 90</b></>,
  3: <>Small letters sit at <b>97 to 122</b></>,
  4: <>Yes. Every character, in every language</>,
}

export function Ranges() {
  const beat = useBeats(4)
  const tween = useTween(480)
  return (
    <>
      <div className="flex flex-col gap-2">
        {BANDS.map((b, k) => {
          const on = beat >= k + 1
          return (
            <div
              key={b.head}
              className="flex h-[60px] items-center gap-5 rounded-2xl px-5"
              style={{
                background: on ? (b.wide ? '#FFF4EC' : colors.white) : 'rgba(255,255,255,0.5)',
                border: `2px ${on ? 'solid' : 'dashed'} ${on ? (b.wide ? colors.accent : colors.line) : colors.line}`,
                boxShadow: on && !b.wide ? '0 6px 24px -10px rgba(0,37,75,0.16)' : 'none',
                transition: tween,
              }}
            >
              <div className="w-[196px] shrink-0 leading-tight" style={{ opacity: on ? 1 : 0, transition: tween }}>
                <p className="font-heading text-[19px] font-bold" style={{ color: b.tone }}>{b.head}</p>
                <p className="text-[16px] font-semibold" style={{ color: colors.body }}>{b.sub}</p>
              </div>
              <div className="flex flex-1 items-center" style={{ gap: b.wide ? 18 : 6, opacity: on ? 1 : 0, transition: tween }}>
                {b.chars.map((c) =>
                  b.wide ? (
                    <span key={c} className="flex h-[40px] items-center gap-3 rounded-lg bg-white px-4 font-mono font-bold" style={{ border: `1.5px solid ${colors.line}` }}>
                      <span className="text-[22px]" style={{ color: colors.ink }}>{c}</span>
                      <span className="text-[18px]" style={{ color: colors.brandDark }}>{c.charCodeAt(0)}</span>
                    </span>
                  ) : (
                    <span key={c} className="flex flex-col items-center font-mono font-bold" style={{ width: b.chars.length > 10 ? 29 : 32 }}>
                      <span className="grid h-[26px] w-[26px] place-items-center rounded-md bg-white text-[16px]" style={{ color: colors.ink, border: `1.5px solid ${colors.line}` }}>
                        {c}
                      </span>
                      <span className="mt-0.5 text-[12px]" style={{ color: colors.brandDark }}>{c.charCodeAt(0)}</span>
                    </span>
                  ),
                )}
              </div>
            </div>
          )
        })}
        <div className="flex items-start justify-between">
          <Speaker who="anu" say={ANU[beat]} beatKey={beat} height={104} bubbleWidth={270} size={16} />
          <Speaker who="computer" look="3d" say={PC[beat]} beatKey={beat} height={94} bubbleWidth={260} size={16} />
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
