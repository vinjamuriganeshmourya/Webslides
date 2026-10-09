import { useRef } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Swap, sentences } from './pieces'
import { FlyIn, Row } from './rows'
import { Details, History, HistoryRow, PayPad, Success, UPI, UpiPhone } from './Upi'
import { SPEC } from './spec'

/**
 * HOOK: ONE EXTRA ZERO. Spec card H1, six presses. No code and no session
 * word anywhere on the card (its must_not lines).
 *
 *   1  the canteen counter: the bill says ₹50, Teja's phone says 500 on Pay
 *   2  the green tick: ₹500 to Sri Sai Canteen, 7:42 PM
 *   3  the payment's details: only Share and Help, no Edit (the real app has none)
 *   4  the canteen owner's phone slides in: Received ₹500 from Teja, 7:42 PM
 *   5  the ₹450 refund arrives as a new row on top; the ₹500 row stays under it, as it was
 *   6  the ₹500 row lifts out of the app into three locked cells, 0 1 2 under
 *      them, beside last class's queue row with its handles
 *
 * Every amount, time and name is the spec's data.
 */
const H1 = SPEC.H1
const [SHOP, PAID, AT] = H1.data.record as [string, number, string]
const [, BACK, BACK_AT] = H1.data.refund as [string, number, string]
const QUEUE: string[] = H1.data.queue

/** The canteen's bill, on the counter. */
function Bill() {
  return (
    <div className="flex w-[170px] flex-col gap-1 rounded-md bg-white px-4 py-3 font-mono" style={{ boxShadow: '0 10px 22px -14px rgba(16,32,58,0.45), inset 0 0 0 1px #E6E1D8', background: '#FFFDF6' }}>
      <span className="text-center text-[13px] font-bold" style={{ color: '#3B3226' }}>
        {SHOP}
      </span>
      <span className="border-b border-dashed pb-1 text-center text-[11px]" style={{ color: '#7A6E5D', borderColor: '#CFC6B6' }}>
        Bill
      </span>
      <span className="flex justify-between text-[13px]" style={{ color: '#3B3226' }}>
        <span>Total</span>
        <span className="text-[20px] font-bold">₹50</span>
      </span>
    </div>
  )
}

/** The QR stand by the cash box. */
function QrStand() {
  const cells = [1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1]
  return (
    <div className="flex w-[118px] flex-col items-center gap-1.5 rounded-lg px-3 py-2.5" style={{ background: UPI.top }}>
      <span className="text-[11px] font-bold text-white">Scan and pay</span>
      <span className="grid grid-cols-5 gap-[2px] rounded bg-white p-1.5">
        {cells.map((c, i) => (
          <span key={i} className="h-[12px] w-[12px]" style={{ background: c ? '#1F1A2B' : '#FFFFFF' }} />
        ))}
      </span>
      <span className="text-[10px] font-semibold text-white/85">{SHOP}</span>
    </div>
  )
}

export function PaymentHook() {
  const beat = useBeats(6)
  const tween = useTween(560)
  const paidRow = useRef<HTMLDivElement | null>(null)
  const screen =
    beat === 1 ? (
      <PayPad amount={PAID} />
    ) : beat === 2 ? (
      <Success amount={PAID} time={AT} />
    ) : beat <= 4 ? (
      <Details amount={PAID} time={AT} />
    ) : (
      <History>
        {beat >= 5 && <HistoryRow key="refund" fresh={beat === 5} label="Received from" who={SHOP} amount={BACK} time={BACK_AT} incoming />}
        <HistoryRow rowRef={(el) => { paidRow.current = el }} label="Paid to" who={SHOP} amount={PAID} time={AT} />
      </History>
    )
  const title = beat === 1 ? 'Paying' : beat === 2 ? undefined : beat <= 4 ? 'Transaction details' : 'History'
  return (
    <>
      <div className="flex items-start gap-8">
        {/* the counter: Teja's phone, and from press 4 the owner's */}
        <div className="flex w-[420px] shrink-0 items-start gap-6">
          <div className="flex flex-col items-center gap-1.5">
            <UpiPhone title={title} light={beat !== 2}>
              {/* the app moves screen to screen the way a phone does: the next screen slides in from the right */}
              <div className="relative h-full overflow-hidden">
                <Swap k={beat <= 4 ? beat : 'history'} from="right" overlay className="h-full">
                  {screen}
                </Swap>
              </div>
            </UpiPhone>
            <span className="text-[14px] font-bold" style={{ color: colors.body }}>
              Teja
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5" style={{ opacity: beat >= 4 ? 1 : 0, transform: beat >= 4 ? 'none' : 'translateX(40px)', transition: tween }}>
            <UpiPhone title="History">
              <History>
                <HistoryRow label="Received from" who="Teja" amount={PAID} time={AT} incoming />
              </History>
            </UpiPhone>
            <span className="text-[14px] font-bold" style={{ color: colors.body }}>
              Canteen owner
            </span>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-5 pt-2">
          <div className="min-h-[72px]">
            <Swap k={beat}>
              <p className="font-heading text-[26px] font-bold leading-snug" style={{ color: colors.brandDark }}>
                <Lines lines={sentences(H1.show[beat - 1])} />
              </p>
            </Swap>
          </div>
          <Swap k={beat < 6 ? 'counter' : 'rows'}>
          {beat < 6 ? (
            <div className="flex items-end gap-6" style={{ opacity: beat <= 3 ? 1 : 0.5, transition: tween }}>
              <Bill />
              <QrStand />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* last class's queue fades in; the paid row lifts out of the app into its locked cells */}
              <div className="sm-bump">
                <Row items={QUEUE} kind="list" size="sm" />
              </div>
              <FlyIn from={() => paidRow.current}>
                <Row items={[SHOP, String(PAID), AT]} kind="tuple" size="md" fit />
              </FlyIn>
            </div>
          )}
          </Swap>
        </div>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}
