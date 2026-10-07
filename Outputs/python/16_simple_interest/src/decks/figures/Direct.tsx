import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { Countdown, useBeats } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Show, TaskPill } from './pieces'
import { Slot, TONE, Tip, WorkedSteps, type WorkStep } from './si'

/**
 * Simple Interest, the direct questions: SI and amount, the three
 * rearrangements (P, R, T) and the time conversion. The question is the
 * slide's lead (`QLead`, passed by the deck file); the four worked-step boxes
 * fill one per press (the reference's `data-s` 2 to 5) and the note under
 * them lands on the last press.
 */

/** Given data, formula, substitution, answer, then the note. Six states. */
export function WorkedQuestion({ steps, tip }: { steps: WorkStep[]; tip: ReactNode[] }) {
  const beat = useBeats(6)
  return (
    <>
      <div className="flex w-[1100px] flex-col gap-4">
        <WorkedSteps beat={beat} steps={steps} />
        <Tip on={beat >= 6} lines={tip} />
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ============================================================ time in years · 12 */

const CONVERT: [string, string, number][] = [
  ['6 months', '6 ÷ 12 = 1/2 year', 2],
  ['9 months', '9 ÷ 12 = 3/4 year', 2],
  ['18 months', '18 ÷ 12 = 1.5 years', 3],
  ['1 year 6 months', '1 + 6/12 = 1.5 years', 3],
  ['73 days', '73 ÷ 365 = 1/5 year', 4],
]

function Box({ tone, title, children }: { tone: 'brand' | 'accent'; title: ReactNode; children: ReactNode }) {
  const t = TONE[tone]
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl px-5 py-3" style={{ background: tone === 'brand' ? colors.white : t.tint, boxShadow: `inset 0 0 0 2px ${t.ring}` }}>
      <p className="text-[16px] font-bold" style={{ color: t.ink }}>{title}</p>
      {children}
    </div>
  )
}

/** The conversion table, the worked example, then the room's turn on a one-minute timer. Eight states. */
export function TimeInYears() {
  const beat = useBeats(8)
  return (
    <>
      <div className="flex w-[1100px] items-start gap-6">
        <div className="flex w-[540px] shrink-0 flex-col gap-2">
          <div className="rounded-xl px-4 py-2 text-center font-heading text-[18px] font-bold text-white" style={{ background: colors.brandDark }}>
            The rate is per year, so T must be in years
          </div>
          <div className="grid grid-cols-2 px-2 text-center text-[16px] font-bold" style={{ color: colors.body }}>
            <span>Time given</span>
            <span>In years</span>
          </div>
          {CONVERT.map(([given, years, k]) => (
            <div key={given} className="grid grid-cols-2 items-center gap-2 rounded-lg bg-white px-2 py-1 ring-1 ring-line">
              <span className="text-center text-[18px] font-semibold" style={{ color: colors.ink }}>{given}</span>
              <Slot on={beat >= k} h={34} className="rounded-md" style={{ background: beat >= k ? TONE.brand.tint : 'transparent' }}>
                <span className="text-[18px] font-semibold" style={{ color: colors.brandDark }}>{years}</span>
              </Slot>
            </div>
          ))}
          <Tip on={beat >= 4} size={17} className="text-center" lines={['For days, divide by 365', 'If the question says 360 days, use 360']} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <TaskPill>Worksheet · Task 2</TaskPill>
            <Countdown seconds={60} />
          </div>
          <Box tone="brand" title="Example">
            <Show on={beat >= 5} className="flex flex-col gap-1.5">
              <p className="text-[17px] leading-snug" style={{ color: colors.ink }}>
                <Lines lines={['₹9,600 at 5% per annum for 1 year and 6 months', 'Find the simple interest']} />
              </p>
              <p className="text-[18px] font-bold" style={{ color: colors.brandDark }}>T = 1 + 6/12 = 18/12 = 1.5 years</p>
            </Show>
            <Show on={beat >= 6} className="text-[18px] font-bold" style={{ color: colors.success }}>
              SI = 9,600 × 5 × 1.5 ÷ 100 = ₹720
            </Show>
          </Box>
          <Box tone="accent" title="Your turn · Worksheet task 2">
            <Show on={beat >= 7} className="text-[17px] leading-snug" style={{ color: colors.ink }}>
              Find the simple interest on ₹4,800 at 5% per annum for 9 months
            </Show>
            <Show on={beat >= 8} className="flex flex-col gap-1">
              <p className="text-[18px] font-bold" style={{ color: colors.brandDark }}>T = 9/12 = 3/4 year</p>
              <p className="text-[18px] font-bold" style={{ color: colors.success }}>SI = 4,800 × 5 × 3/4 ÷ 100 = ₹180</p>
            </Show>
          </Box>
        </div>
      </div>
      <StepControls at={beat} total={8} />
    </>
  )
}
