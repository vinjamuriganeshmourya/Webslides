import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useCount, useTween } from '@/ui'
import { StepControls } from './controls'
import { BeatCaption, Lines } from './common'
import { Phone, Back } from './Phone'
import { Fade, Insight } from './ci'

/* ================================================================== recap */

/**
 * RECAP OF SIMPLE INTEREST: ONE LINE IS WRONG. The reference's "bug" recap.
 *
 * Four numbered lines of a solution, and two empty answer slots. Opens with
 * nothing marked, so the room finds the line first. `Show me` three times:
 * the student's answer lands, then line 3 is marked with the reason, then the
 * correct answer lands. The reference's own order (its `.rcp.at-1..3`).
 */
const LINES = ['A sum of ₹6,000 is lent at 8% a year', 'The money is paid back after 9 months', 'SI = 6000 × 9 × 8 ÷ 100', 'SI = ₹4,320']
const CULPRIT = 2

function AnswerSlot({ label, value, on, tone }: { label: string; value: string; on: boolean; tone: string }) {
  const tween = useTween(480)
  return (
    <div
      className="flex h-[92px] flex-col justify-center gap-1 rounded-xl px-5"
      style={{
        background: on ? colors.white : 'transparent',
        boxShadow: `inset 0 0 0 2px ${on ? tone : colors.line}`,
        transition: tween,
      }}
    >
      <span className="text-[17px] font-semibold" style={{ color: colors.body }}>{label}</span>
      <span className="font-heading text-[30px] font-bold leading-none" style={{ color: tone, opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)', transition: tween }}>
        {value}
      </span>
    </div>
  )
}

export function RecapBug() {
  const at = useCount(3)
  const tween = useTween(480)
  const marked = at >= 2
  return (
    <>
      <div className="flex flex-col gap-4">
        <p className="text-[20px] leading-snug" style={{ color: colors.body }}>
          <Lines lines={['One line of this solution is incorrect', 'Write its line number in your notebook']} />
        </p>
        <div className="flex items-start gap-6">
          <div className="w-[640px] shrink-0 rounded-xl bg-white px-5 py-3 shadow-card-soft ring-1 ring-line">
            {LINES.map((l, i) => {
              const bad = marked && i === CULPRIT
              return (
                <div
                  key={l}
                  className="flex items-center gap-4 rounded-lg px-3 py-2.5"
                  style={{
                    background: bad ? `${colors.danger}14` : 'transparent',
                    boxShadow: bad ? `inset 0 0 0 2px ${colors.danger}` : `inset 0 -1px 0 ${i < LINES.length - 1 ? colors.line : 'transparent'}`,
                    transition: tween,
                  }}
                >
                  <span className="w-5 shrink-0 font-mono text-[17px]" style={{ color: bad ? colors.danger : colors.muted }}>{i + 1}</span>
                  <span className="text-[24px] font-semibold leading-tight" style={{ color: colors.ink }}>{l}</span>
                </div>
              )
            })}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <AnswerSlot label="The student’s answer" value="₹4,320" on={at >= 1} tone={colors.danger} />
            <AnswerSlot label="The correct answer" value="₹360" on={at >= 3} tone={colors.success} />
          </div>
        </div>
        <Fade on={marked}>
          <p className="text-[19px] font-semibold leading-snug" style={{ color: colors.ink }}>
            <Lines lines={['Line 3 uses 9 months as 9 years', 'Time must be in years: 9 months = 9/12 = 0.75 years, so SI = ₹360']} />
          </p>
        </Fade>
      </div>
      <StepControls at={at} first={0} total={3} nextLabel="Show me" />
    </>
  )
}

/* =================================================================== hook */

/**
 * TWO FRIENDS, THE SAME MONEY, THE SAME RATE. The reference's hook.
 *
 * Meera's savings plan, drawn as the app she would open (course rule R5b: the
 * room recognises the object before it is asked for the idea), its statement
 * filling in one year per press, beside the story told in numbered beats.
 * The last press asks the question and puts the two rules side by side.
 *
 * The reference's header read `PhonePe · Savings`. The app here says
 * `Savings`: course rule R5 and content rule 12 keep a hand-drawn product
 * name and mark out of a drawn screen, and the asset library has no PhonePe
 * mark. The lead sentence still names PhonePe, as the reference's does.
 * The phone's frame is the object's own colour (content rule 37); the app's
 * header, chips and button are tokens.
 */
const YEARS = [
  { label: 'Year 1 · interest credited', add: '+ ₹100' },
  { label: 'Year 2 · interest credited', add: '+ ₹110' },
  { label: 'Year 3 · interest credited', add: '+ ₹121' },
]

const BEATS: { lead: string; rest: string[] }[] = [
  { lead: 'Both deposit the money', rest: ['₹1,000 each, at 10% a year'] },
  { lead: 'End of year one', rest: ['Meera earns ₹100 and Arjun earns ₹100', 'The interest is the same so far'] },
  { lead: 'End of year two', rest: ['Meera earns 10% of ₹1,100 = ₹110', 'Arjun earns ₹100 again'] },
  { lead: 'End of year three', rest: ['Meera earns ₹121, so her balance is ₹1,331', 'Arjun earns ₹100, so his balance is ₹1,300'] },
  { lead: 'Same deposit, same rate', rest: ['Why does Meera earn more each year?'] },
]

function Row({ label, value, on, strong = false }: { label: ReactNode; value: ReactNode; on: boolean; strong?: boolean }) {
  const tween = useTween(480)
  return (
    <div
      className="flex items-center justify-between px-3 py-[5px]"
      style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)', transition: tween, borderTop: strong ? `1px solid ${colors.line}` : undefined }}
    >
      <span className={strong ? 'text-[12px] font-bold' : 'text-[11.5px]'} style={{ color: strong ? colors.ink : colors.body }}>{label}</span>
      <span className={strong ? 'text-[19px] font-bold' : 'text-[12px] font-bold'} style={{ color: strong ? colors.brandDark : value === '₹1,000' ? colors.ink : colors.success }}>
        {value}
      </span>
    </div>
  )
}

function SavingsApp({ year }: { year: number }) {
  return (
    <Phone
      width={224}
      height={462}
      top={{
        bg: colors.brandDark,
        light: true,
        header: (
          <div className="flex items-center gap-2 px-3 pb-2 pt-1 text-white">
            <Back color={colors.white} />
            <span className="flex-1 text-[13px] font-bold">Savings</span>
            <span className="text-[13px]" aria-hidden>☰</span>
          </div>
        ),
      }}
    >
      <div className="flex h-full flex-col pb-4">
        <div className="mx-2.5 mt-2.5 flex items-start gap-2 rounded-lg px-2 py-2" style={{ background: colors.surface, boxShadow: `inset 0 0 0 1px ${colors.line}` }}>
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-[14px] font-bold text-white" style={{ background: colors.brandDark }}>₹</span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block text-[12px] font-bold" style={{ color: colors.ink }}>Meera’s savings plan</span>
            <span className="block text-[10.5px]" style={{ color: colors.body }}>
              Interest paid on: <b style={{ color: colors.brandDark }}>the balance</b> · 10% a year
            </span>
          </span>
          <span className="rounded px-1 py-0.5 text-[9px] font-bold" style={{ background: `${colors.success}1F`, color: colors.success }}>ACTIVE</span>
        </div>
        <div className="mt-2">
          <Row label="Deposited" value="₹1,000" on />
          {YEARS.map((y, i) => (
            <Row key={y.label} label={y.label} value={y.add} on={year >= i + 1} />
          ))}
        </div>
        <div className="mt-auto">
          <Row label="Balance today" value="₹1,331" on={year >= 3} strong />
          <div className="mx-2.5 mt-1.5 rounded-md py-1.5 text-center text-[12px] font-bold text-white" style={{ background: colors.accent }}>
            View statement
          </div>
        </div>
      </div>
    </Phone>
  )
}

export function SavingsHook() {
  const beat = useBeats(5)
  const year = Math.min(3, beat - 1)
  const b = BEATS[beat - 1]
  return (
    <>
      <div className="flex items-start gap-8">
        {/* the phone alone rises into Space-3 (x 64..880, y 162..240) */}
        <div style={{ marginTop: -48 }}>
          <SavingsApp year={year} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3.5">
          <p className="text-[19px] leading-snug" style={{ color: colors.body }}>
            <Lines
              lines={[
                'Meera and Arjun each deposit ₹1,000 in a PhonePe savings plan at 10% a year for 3 years',
                'Meera earns 10% on her current balance',
                'Arjun earns 10% on the ₹1,000 he deposited',
              ]}
            />
          </p>
          <p className="font-heading text-[20px] font-semibold leading-snug" style={{ color: colors.ink }}>
            After 3 years, does Meera have more money than Arjun, the same amount, or less?
          </p>
          <BeatCaption n={beat} lines={[<b key="l" style={{ color: colors.brandDark }}>{b.lead}</b>, ...b.rest]} size={18} />
          <Fade on={beat >= 5} className="flex flex-col gap-2.5">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[18px] leading-snug">
              <span style={{ color: colors.body }}>Arjun earns 10% of</span>
              <b style={{ color: colors.danger }}>the ₹1,000 he deposited</b>
              <span style={{ color: colors.body }}>Meera earns 10% of</span>
              <b style={{ color: colors.brandDark }}>her balance that year</b>
            </div>
            <Insight size={17} lines={['After 3 years, the difference is only ₹31', 'After 10 years, Arjun has ₹2,000 and Meera has ₹2,594']} />
          </Fade>
        </div>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}
