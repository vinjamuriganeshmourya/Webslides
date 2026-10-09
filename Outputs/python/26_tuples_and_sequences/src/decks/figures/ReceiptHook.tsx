import { useEffect, useRef, useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Lines, Group } from './common'
import { OutPanel, Swap, sentences, CODE_FS, OUT_FS } from './pieces'
import { CodePane } from './trace'
import { useStepPhase } from './phase'
import { NameBox, Row } from './rows'
import { Payee, UPI, UpiPhone } from './Upi'
import { SPEC } from './spec'

/**
 * HOOK 2: READING THE RECEIPT, THE LONG WAY. Spec card H2, four presses. The
 * word unpacking is not on this card (its must_not): C14 names it.
 *
 *   1  the payment app's receipt for the right payment, ₹50, and
 *      receipt_long.py with lines 2 to 4 hidden
 *   2  lines 2 to 4 appear one at a time, each pulling one cell of the
 *      payment row into its name; the output fills
 *   3  the real receipt's six details light one by one
 *   4  lines 2 to 4 fold into one line, receipt_short.py's line 2, in one
 *      movement; the output and the payment row do not change
 *
 * Both programs are the spec's and print the same line on CPython 3.12.3.
 */
const H2 = SPEC.H2
type Prog = { file: string; src: string; output: string }
const [LONG, SHORT]: Prog[] = H2.code
const DETAILS: string[] = H2.data.receipt
const PAY = H2.data.payment as [string, number, string]
const NAMES = ['shop', 'amount', 'time']
/* what the receipt shows beside each detail; the first, second and fourth are the spec's payment */
const VALUES = [PAY[0], `₹${PAY[1]}`, 'Today', PAY[2], 'srisaicanteen@ybl', '428519376621']

function Receipt({ lit }: { lit: number }) {
  const tween = useTween(420)
  return (
    <UpiPhone title="Transaction details">
      <div className="flex h-full flex-col gap-1.5 px-2 pt-2" style={{ background: UPI.topSoft }}>
        <div className="flex items-center gap-2 rounded-xl bg-white px-2.5 py-2">
          <Payee size={26} />
          <span className="text-[12px] font-bold" style={{ color: UPI.ok }}>
            Paid successfully
          </span>
        </div>
        {DETAILS.map((d, i) => (
          <div
            key={d}
            className="flex flex-col rounded-lg bg-white px-2.5 py-[3px]"
            style={{ boxShadow: i < lit ? `inset 0 0 0 2px ${UPI.top}` : `inset 0 0 0 1px ${UPI.line}`, background: i < lit ? UPI.topSoft : '#FFFFFF', transition: tween }}
          >
            <span className="text-[10px] font-semibold uppercase leading-[13px] tracking-wide" style={{ color: UPI.soft }}>
              {d}
            </span>
            <span className="whitespace-nowrap text-[12px] font-bold leading-[16px]" style={{ color: UPI.ink }}>
              {VALUES[i]}
            </span>
          </div>
        ))}
      </div>
    </UpiPhone>
  )
}

export function ReceiptHook() {
  const beat = useBeats(4)
  const instant = useInstant()
  const tween = useTween(900)
  /* press 2: one line per beat; press 3: one detail per beat */
  const phase = useStepPhase(beat, beat === 3 ? [300, 450, 450, 450, 450, 450] : [400, 1000, 1000, 900])
  const lines = beat === 1 ? 0 : beat === 2 ? Math.min(phase, 3) : 3
  const filled = beat >= 3 || (beat === 2 && phase >= 4)
  const lit = beat === 3 ? phase : 0
  const longLines = LONG.src.split('\n')
  const partial = longLines.map((l, i) => (i >= 1 && i <= 3 && i > lines ? '' : l)).join('\n')
  const cells = useRef<(HTMLSpanElement | null)[]>([])
  const folded = beat === 4
  /* the long program leaves the page once the fold has finished, so nothing sits hidden inside the shrunk panel */
  const [longOn, setLongOn] = useState(!folded)
  useEffect(() => {
    if (!folded) return setLongOn(true)
    if (instant) return setLongOn(false)
    const t = window.setTimeout(() => setLongOn(false), 950)
    return () => window.clearTimeout(t)
  }, [folded, instant])
  return (
    <>
      <div className="flex items-start gap-8">
        <Receipt lit={lit} />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="min-h-[64px]">
            <Swap k={beat}>
              <p className="font-heading text-[23px] font-bold leading-snug" style={{ color: colors.brandDark }}>
                <Lines lines={sentences(H2.show[beat - 1])} />
              </p>
            </Swap>
          </div>
          <div className="flex items-stretch gap-6">
            <Group className="flex w-[520px] shrink-0 flex-col gap-3">
              {/* the fold: the long program gives way to the short one in one movement, the panel shrinking with it */}
              <div className="relative overflow-hidden rounded-card" style={{ height: folded ? 148 : 194, transition: instant ? 'none' : tween }}>
                {longOn && (
                <div className="absolute inset-x-0 top-0" style={{ opacity: folded ? 0 : 1, visibility: folded ? 'hidden' : 'visible', transition: instant ? 'none' : `opacity 900ms cubic-bezier(0.22,1,0.36,1), visibility 0s linear ${folded ? 900 : 0}ms` }}>
                  <CodePane code={partial} fontSize={CODE_FS} rows={5} gaps={beat === 1 ? [2, 3, 4] : undefined} mark={beat === 2 && lines > 0 ? [lines + 1] : undefined} />
                </div>
                )}
                <div className="absolute inset-x-0 top-0" style={{ opacity: folded ? 1 : 0, visibility: folded ? 'visible' : 'hidden', transition: instant ? 'none' : `opacity 900ms cubic-bezier(0.22,1,0.36,1), visibility 0s linear ${folded ? 0 : 900}ms` }}>
                  <CodePane code={SHORT.src} fontSize={CODE_FS} rows={3} mark={[2]} />
                </div>
              </div>
              <OutPanel lines={filled ? [{ text: (folded ? SHORT : LONG).output }] : []} fontSize={OUT_FS} />
            </Group>
            <Group className="flex min-w-0 flex-1 flex-col gap-4 pt-1" active={beat === 2}>
              <span className="font-mono text-[15px] font-bold" style={{ color: colors.muted }}>
                payment
              </span>
              <Row items={[`'${PAY[0]}'`, String(PAY[1]), `'${PAY[2]}'`]} kind="tuple" size="sm" fit cellRefs={cells} states={beat === 2 && lines >= 1 && lines <= 3 && phase <= 3 ? { [lines - 1]: 'lit' } : {}} />
              <div className="flex gap-2">
                {NAMES.map((n, i) => (
                  <NameBox key={n} name={n} size="sm" width={i === 0 ? 196 : i === 1 ? 72 : 112} value={lines > i ? (i === 1 ? String(PAY[1]) : `'${PAY[i]}'`) : null} from={cells.current[i]} />
                ))}
              </div>
            </Group>
          </div>
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
