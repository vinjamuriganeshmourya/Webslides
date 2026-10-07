import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Show, TaskPill } from './pieces'
import { Phone } from './Phone'
import { Band, Chip, Slot, TONE, Tip } from './si'

/**
 * Simple Interest, the opening panels: the discount recap, the bank hook,
 * year by year, the five terms, the straight-line chart and the formula
 * build. One component per reference card. Each reveal is one build step, in
 * the reference's order (its `data-s` markers): state 1 is the slide's entry,
 * every later state is one press of the deck's own Next.
 */

/* ============================================================ recap · 3 */

const RECAP = [
  {
    q: ['A shirt is marked ₹1,200', 'The shop gives a 25% discount', 'What is the selling price?'],
    a: '₹900',
    why: ['After 25% off, 75% of the price remains: 1,200 × 0.75 = 900'],
  },
  {
    q: ['A shop gives 20% off, then another 10% off the reduced price', 'Is that the same as 30% off?'],
    a: 'No',
    a2: 'It is 28% off',
    why: ['The second discount is calculated on the reduced price'],
  },
  {
    q: ['An item marked ₹800 is sold for ₹680', 'What is the discount percent?'],
    a: '15%',
    why: ['The discount is ₹120, and 120 ÷ 800 × 100 = 15%'],
  },
]

/** Three question cards; `Show answer` opens one answer per press. */
export function RecapDiscount() {
  const beat = useBeats(RECAP.length + 1)
  return (
    <>
      <div className="grid w-[1100px] grid-cols-3 gap-5">
        {RECAP.map((r, i) => {
          const on = beat >= i + 2
          return (
            <div key={i} className="flex h-[330px] flex-col rounded-2xl bg-white px-6 py-5 ring-1 ring-line" style={{ boxShadow: '0 6px 22px -12px rgba(0,37,75,0.18)' }}>
              <span className="grid h-9 w-9 place-items-center rounded-full font-heading text-[18px] font-bold text-white" style={{ background: colors.brand }}>
                {i + 1}
              </span>
              <p className="mt-3 text-[21px] leading-snug" style={{ color: colors.ink }}>
                <Lines lines={r.q} />
              </p>
              <div className="mt-auto">
                <Show on={!on} className={on ? 'hidden' : ''}>
                  <div className="border-t-2 border-dashed pt-2 text-[16px] font-semibold uppercase tracking-wider" style={{ borderColor: colors.line, color: colors.muted }}>
                    Your answer
                  </div>
                </Show>
                <Show on={on} className={on ? '' : 'hidden'}>
                  <div className="rounded-xl px-4 py-2.5" style={{ background: TONE.success.tint, boxShadow: `inset 0 0 0 1.5px ${TONE.success.ring}` }}>
                    <p className="font-heading text-[22px] font-bold leading-tight" style={{ color: colors.success }}>
                      <Lines lines={r.a2 ? [r.a, r.a2] : [r.a]} />
                    </p>
                    <p className="mt-1 text-[16px] leading-snug" style={{ color: colors.body }}>
                      <Lines lines={r.why} />
                    </p>
                  </div>
                </Show>
              </div>
            </div>
          )
        })}
      </div>
      <StepControls at={beat} total={RECAP.length + 1} nextLabel="Show answer" />
    </>
  )
}

/* ============================================================ hook · 4 */

/** The fixed-deposit screen. The app's header blue is the drawn object's own; here it is the brand token. */
function DepositScreen({ credited }: { credited: boolean }) {
  const tween = useTween(520)
  return (
    <Phone
      width={212}
      height={437}
      top={{
        bg: colors.brandDark,
        light: true,
        header: (
          <div className="flex items-center gap-2 px-3 pb-2 pt-1 text-[13px] font-bold text-white">
            <span className="text-[16px] leading-none">‹</span>
            <span className="flex-1">YONO · Deposits</span>
            <span className="text-[14px] leading-none">☰</span>
          </div>
        ),
      }}
    >
      <div className="flex h-full flex-col px-3 pt-3 text-[12px]" style={{ color: colors.ink }}>
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg" style={{ background: colors.surface2, color: colors.brandDark }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <circle cx="12" cy="12" r="4" />
              <path d="M12 8v1M12 15v1M8 12h1M15 12h1" strokeLinecap="round" />
            </svg>
          </span>
          <p className="whitespace-nowrap font-bold leading-tight">Fixed Deposit · 1 year</p>
        </div>
        <p className="mt-1.5 whitespace-nowrap text-[11px] leading-tight" style={{ color: colors.muted }}>
          Interest type: <b style={{ color: colors.brandDark }}>Simple</b> · 10% p.a.
        </p>
        <span className="mt-1.5 self-start rounded-md px-1.5 py-0.5 text-[10px] font-bold" style={{ background: TONE.success.tint, color: colors.success }}>
          ACTIVE
        </span>
        <div className="mt-2.5 flex justify-between border-t pt-2" style={{ borderColor: colors.line }}>
          <span>Deposited</span>
          <b>₹5,000</b>
        </div>
        <div className="mt-2 flex flex-col border-t pt-2" style={{ borderColor: colors.line }}>
          <span className="whitespace-nowrap" style={{ color: credited ? colors.ink : colors.muted }}>{credited ? 'Year 1 · interest credited' : 'Year 1 · interest'}</span>
          <b className="self-end" style={{ color: credited ? colors.success : colors.muted }}>{credited ? '+ ₹500' : '?'}</b>
        </div>
        <div
          className="mt-2 flex flex-col rounded-lg px-2 py-1.5"
          style={{ background: colors.surface, opacity: credited ? 1 : 0, transform: credited ? 'none' : 'translateY(6px)', transition: tween }}
        >
          <span className="whitespace-nowrap font-semibold">Balance after 1 year</span>
          <b className="self-end font-heading text-[18px] leading-tight" style={{ color: colors.brandDark }}>₹5,500</b>
        </div>
        <span className="mb-6 mt-auto rounded-lg py-2 text-center text-[13px] font-bold text-white" style={{ background: colors.accent }}>
          View statement
        </span>
      </div>
    </Phone>
  )
}

function Beat({ on, label, lines }: { on: boolean; label?: string; lines: ReactNode[] }) {
  return (
    <Show on={on}>
      <p className="text-[19px] leading-snug" style={{ color: colors.body }}>
        {lines.map((l, i) => (
          <span key={i} className="block">
            {i === 0 && label && <b style={{ color: colors.brandDark }}>{label} </b>}
            {l}
          </span>
        ))}
      </p>
    </Show>
  )
}

/** Anu's deposit, on the bank app, one beat per press. */
export function BankHook() {
  const beat = useBeats(4)
  return (
    <>
      <div className="flex w-[1100px] items-start gap-10">
        <DepositScreen credited={beat >= 3} />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <p className="text-body-lg leading-snug" style={{ color: colors.body }}>
            <Lines lines={['Anu puts ₹5,000 in a fixed deposit', 'The bank pays 10% simple interest every year']} />
            <b className="block" style={{ color: colors.ink }}>How much extra money will the bank add after one year?</b>
          </p>
          <div className="mt-2 flex flex-col gap-3">
            <Beat on={beat >= 1} label="Day 1." lines={['Anu puts ₹5,000 in a fixed deposit at 10% a year']} />
            <Beat on={beat >= 2} label="Think." lines={['Use what you know about percentages', 'What is 10% of ₹5,000?']} />
            <Beat on={beat >= 3} label="After one year." lines={['10% of 5,000 is ₹500', 'The balance is ₹5,500']} />
            <Show on={beat >= 4}>
              <p className="text-[19px] leading-snug" style={{ color: colors.ink }}>
                This extra ₹500 is called <b style={{ color: colors.brandDark }}>interest</b>
              </p>
              <div className="mt-2 grid grid-cols-[1fr_1fr] gap-x-6 gap-y-1 rounded-xl px-4 py-2 text-[17px] leading-snug" style={{ background: colors.surface, boxShadow: `inset 0 0 0 1px ${colors.line}` }}>
                <span style={{ color: colors.body }}>When you <i>invest</i> money (put it in a bank)</span>
                <b style={{ color: colors.ink }}>the bank pays you interest</b>
                <span style={{ color: colors.body }}>When you <i>borrow</i> money (take a loan)</span>
                <b style={{ color: colors.ink }}>you pay the bank interest</b>
              </div>
            </Show>
          </div>
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ============================================================ year by year · 7 */

const COLS = 'grid-cols-[120px_180px_170px_1fr_160px]'

function MiniBlock({ tone, w, children }: { tone: 'success' | 'accent'; w: number; children: ReactNode }) {
  return (
    <span className="grid h-[34px] shrink-0 place-items-center rounded-md font-heading text-[16px] font-bold text-white" style={{ width: w, background: TONE[tone].solid }}>
      {children}
    </span>
  )
}

/** Three years, one row each; the principal column ringed when the reason lands. */
export function YearByYear() {
  const beat = useBeats(5)
  const tween = useTween(520)
  return (
    <>
      <div className="relative w-[1100px]">
        <div className={`grid ${COLS} gap-3 px-4 pb-2 text-center text-[16px] font-bold`} style={{ color: colors.body }}>
          <span className="text-left">Year</span>
          <span>Original principal</span>
          <span>Interest for the year</span>
          <span>How the money grows</span>
          <span>Total amount</span>
        </div>
        <div className="relative flex flex-col gap-3">
          {[1, 2, 3].map((y) => {
            const on = beat >= y + 1
            return (
              <div key={y} className={`grid ${COLS} items-center gap-3 rounded-xl bg-white px-4 py-2.5 ring-1 ring-line`}>
                <span className="font-heading text-[20px] font-bold" style={{ color: colors.ink }}>Year {y}</span>
                <Slot on={on} h={48}>
                  <Chip tone="success" w={130}>₹5,000</Chip>
                </Slot>
                <Slot on={on} h={62}>
                  <div className="flex flex-col items-center">
                    <Chip tone="accent" w={120} h={34} size={18}>+ ₹500</Chip>
                    <span className="mt-0.5 text-[16px] font-semibold leading-tight" style={{ color: colors.accentDark }}>10% of ₹5,000</span>
                  </div>
                </Slot>
                <Slot on={on} h={48} className="!place-items-center !justify-items-start px-2">
                  <div className="flex items-center gap-1.5">
                    <MiniBlock tone="success" w={130}>₹5,000</MiniBlock>
                    {Array.from({ length: y }, (_, k) => (
                      <MiniBlock key={k} tone="accent" w={52}>500</MiniBlock>
                    ))}
                  </div>
                </Slot>
                <Slot on={on} h={48}>
                  <Chip tone="brand" w={130}>{['₹5,500', '₹6,000', '₹6,500'][y - 1]}</Chip>
                </Slot>
              </div>
            )
          })}
          {/* the principal column, ringed: x = 16 (row padding) + 120 + 12 */}
          <div
            aria-hidden
            className="pointer-events-none absolute rounded-xl"
            style={{ left: 148 - 6, width: 180 + 12, top: 4, bottom: 4, border: `2.5px dashed ${colors.success}`, opacity: beat >= 5 ? 1 : 0, transition: tween }}
          />
        </div>
        <Show on={beat >= 5} className="mt-1 text-[16px] font-bold" style={{ marginLeft: 148, width: 180, textAlign: 'center', color: colors.success }}>
          the same every year
        </Show>
        <Tip on={beat >= 5} className="mt-2" lines={["Each year's interest is 10% of the same ₹5,000, so it stays ₹500"]} />
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}

/* ============================================================ the five terms · 8 */

/** The deposit as one bar: the principal, then a year's interest per block, then the three totals. */
export function FiveTerms() {
  const beat = useBeats(6)
  const P = 330
  const Y = 150
  const G = 10
  const yearsLeft = P + G
  const yearsW = 3 * Y + 2 * G
  return (
    <>
      <div className="w-[1100px]">
        <div className="relative" style={{ width: P + G + yearsW, height: 300 }}>
          {/* labels above */}
          <Show on={beat >= 1} className="absolute text-center" style={{ left: 0, width: P, top: 26 }}>
            <p className="font-heading text-[21px] font-bold" style={{ color: colors.success }}>P = Principal</p>
          </Show>
          <Show on={beat >= 2} className="absolute whitespace-nowrap text-center" style={{ left: yearsLeft - 40, width: Y + 120, top: 0 }}>
            <p className="font-heading text-[20px] font-bold" style={{ color: colors.accentDark }}>R = 10% per annum</p>
            <p className="text-[16px] font-semibold" style={{ color: colors.body }}>per annum means per year</p>
          </Show>
          <Show on={beat >= 3} className="absolute text-center" style={{ left: yearsLeft + 2 * (Y + G), width: Y, top: 26 }}>
            <p className="font-heading text-[20px] font-bold" style={{ color: colors.accentDark }}>T = 3 years</p>
          </Show>
          {/* the bar */}
          <div className="absolute flex items-stretch" style={{ top: 64, left: 0, gap: G }}>
            <span className="grid h-[64px] place-items-center rounded-lg font-heading text-[28px] font-bold text-white" style={{ width: P, background: colors.success }}>
              ₹5,000
            </span>
            {[1, 2, 3].map((y) => (
              <span key={y} className="flex h-[64px] flex-col items-center justify-center rounded-lg font-heading font-bold text-white" style={{ width: Y, background: colors.accent }}>
                <Show on={beat >= 3} className="text-[16px] font-semibold leading-none">year {y}</Show>
                <span className="text-[24px] leading-tight">₹500</span>
              </span>
            ))}
          </div>
          <Show on={beat >= 1} className="absolute text-center text-[16px]" style={{ left: 0, width: P, top: 136, color: colors.body }}>
            the money put in or borrowed
          </Show>
          {/* SI bracket under the three years */}
          <Show on={beat >= 4} className="absolute" style={{ left: yearsLeft, width: yearsW, top: 136 }}>
            <div className="h-3 rounded-b-md border-x-[2.5px] border-b-[2.5px]" style={{ borderColor: colors.accentDark }} />
            <p className="mt-1 text-center font-heading text-[18px] font-bold" style={{ color: colors.accentDark }}>SI = Simple interest = 500 × 3 = ₹1,500</p>
          </Show>
          {/* A bracket under the whole bar */}
          <Show on={beat >= 5} className="absolute" style={{ left: 0, width: P + G + yearsW, top: 196 }}>
            <div className="h-3 rounded-b-md border-x-[2.5px] border-b-[2.5px]" style={{ borderColor: colors.brandDark }} />
            <p className="mt-1 text-center font-heading text-[19px] font-bold" style={{ color: colors.brandDark }}>A = Amount = P + SI = 5,000 + 1,500 = ₹6,500</p>
          </Show>
        </div>
        <Show on={beat >= 6} className="mt-1 grid grid-cols-3 gap-4" style={{ width: P + G + yearsW }}>
          {(
            [
              ['Principal', '₹5,000', 'the money put in', 'success'],
              ['Simple interest', '₹1,500', 'the extra money earned', 'accent'],
              ['Amount', '₹6,500', 'the total at the end: P + SI', 'brand'],
            ] as const
          ).map(([t, v, s, tone]) => (
            <div key={t} className="rounded-xl px-4 py-2 text-center" style={{ background: TONE[tone].tint, boxShadow: `inset 0 0 0 2px ${TONE[tone].ring}` }}>
              <p className="text-[16px] font-bold" style={{ color: TONE[tone].ink }}>{t}</p>
              <p className="font-heading text-[26px] font-bold leading-tight" style={{ color: TONE[tone].ink }}>{v}</p>
              <p className="text-[16px]" style={{ color: colors.body }}>{s}</p>
            </div>
          ))}
        </Show>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ============================================================ interest and time · 9 */

/** Interest against time: one point per year, then the line, then the prediction. */
export function InterestTime() {
  const beat = useBeats(7)
  const tween = useTween(860)
  const W = 560
  const H = 360
  const L = 74
  const B = 300
  const R = 530
  const T = 20
  const x = (t: number) => L + (t / 5) * (R - L)
  const y = (v: number) => B - (v / 2500) * (B - T)
  const point = (t: number, on: boolean, label: string, dy = -14) => (
    <g style={{ opacity: on ? 1 : 0, transition: tween }}>
      <line x1={x(t)} y1={y(t * 500)} x2={x(t)} y2={B} stroke={colors.accent} strokeWidth="2" strokeDasharray="5 4" />
      <line x1={L} y1={y(t * 500)} x2={x(t)} y2={y(t * 500)} stroke={colors.accent} strokeWidth="2" strokeDasharray="5 4" />
      <circle cx={x(t)} cy={y(t * 500)} r="8" fill={colors.accent} stroke={colors.white} strokeWidth="2.5" />
      <text x={x(t) - 10} y={y(t * 500) + dy} textAnchor="end" fontSize="17" fontWeight="700" fill={colors.accentDark}>{label}</text>
    </g>
  )
  const solidLen = Math.hypot(x(3) - x(0), y(1500) - y(0))
  return (
    <>
      <div className="flex w-[1100px] items-start gap-6">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="shrink-0" role="img" aria-label="Interest earned against time">
          {[0, 500, 1000, 1500, 2000, 2500].map((v) => (
            <g key={v}>
              <line x1={L} x2={R} y1={y(v)} y2={y(v)} stroke={colors.line} strokeWidth="1" />
              <text x={L - 10} y={y(v) + 5} textAnchor="end" fontSize="16" fill={colors.body}>{v.toLocaleString('en-IN')}</text>
            </g>
          ))}
          {[0, 1, 2, 3, 4, 5].map((t) => (
            <text key={t} x={x(t)} y={B + 24} textAnchor="middle" fontSize="16" fill={colors.body}>{t}</text>
          ))}
          <line x1={L} y1={T - 6} x2={L} y2={B} stroke={colors.ink} strokeWidth="2" />
          <line x1={L} y1={B} x2={R + 6} y2={B} stroke={colors.ink} strokeWidth="2" />
          <text x={(L + R) / 2} y={B + 50} textAnchor="middle" fontSize="16" fontWeight="700" fill={colors.ink}>Time (years)</text>
          <text transform={`translate(18 ${(T + B) / 2}) rotate(-90)`} textAnchor="middle" fontSize="16" fontWeight="700" fill={colors.ink}>Interest earned (₹)</text>
          {/* the line through the first three points, drawn on press 4 */}
          <line
            x1={x(0)}
            y1={y(0)}
            x2={x(3)}
            y2={y(1500)}
            stroke={colors.brandDark}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={solidLen}
            strokeDashoffset={beat >= 4 ? 0 : solidLen}
            style={{ transition: tween }}
          />
          <line x1={x(3)} y1={y(1500)} x2={x(5)} y2={y(2500)} stroke={colors.brandDark} strokeWidth="3.5" strokeDasharray="9 7" style={{ opacity: beat >= 7 ? 1 : 0, transition: tween }} />
          {/* +500 risers */}
          {[1, 2, 3].map((t) => (
            <text key={t} x={x(t) + 10} y={y(t * 500 - 250) + 5} fontSize="16" fontWeight="700" fill={colors.accentDark} style={{ opacity: beat >= 5 ? 1 : 0, transition: tween }}>
              +500
            </text>
          ))}
          {point(1, beat >= 2, '₹500')}
          {point(2, beat >= 3, '₹1,000')}
          {point(3, beat >= 4, '₹1,500')}
          <g style={{ opacity: beat === 6 ? 1 : 0, transition: tween }}>
            <circle cx={x(5)} cy={y(2500)} r="14" fill={colors.white} stroke={colors.brandDark} strokeWidth="2.5" strokeDasharray="4 3" />
            <text x={x(5)} y={y(2500) + 6} textAnchor="middle" fontSize="18" fontWeight="800" fill={colors.brandDark}>?</text>
          </g>
          <g style={{ opacity: beat >= 7 ? 1 : 0, transition: tween }}>
            <circle cx={x(5)} cy={y(2500)} r="9" fill={colors.brandDark} stroke={colors.white} strokeWidth="2.5" />
            <text x={x(5) - 16} y={y(2500) + 6} textAnchor="end" fontSize="17" fontWeight="700" fill={colors.brandDark}>₹2,500</text>
          </g>
        </svg>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <TaskPill>Worksheet · Task 1</TaskPill>
          <div className="flex flex-col gap-2 rounded-2xl bg-white px-5 py-4 ring-1 ring-line" style={{ minHeight: 316 }}>
            <Show on={beat >= 1}>
              <p className="font-heading text-[21px] font-bold" style={{ color: colors.accentDark }}>One year’s interest = ₹500</p>
              <p className="text-[16px]" style={{ color: colors.body }}>10% of ₹5,000, every year</p>
            </Show>
            {[
              ['1 year: 500 × 1 = ₹500', 2],
              ['2 years: 500 × 2 = ₹1,000', 3],
              ['3 years: 500 × 3 = ₹1,500', 4],
            ].map(([t, k]) => (
              <Show key={t} on={beat >= (k as number)} className="text-[18px] font-semibold" style={{ color: colors.ink }}>
                {t}
              </Show>
            ))}
            <Show on={beat >= 5} className="text-[17px] font-semibold leading-snug" style={{ color: colors.brandDark }}>
              <Lines lines={['Each year adds the same ₹500,', 'so the points lie on a straight line']} />
            </Show>
            <div className="relative">
              <Show on={beat === 6} className="absolute inset-x-0 top-0 text-[18px] font-bold" style={{ color: colors.brandDark }}>
                Predict: 5 years = ?
              </Show>
              <Show on={beat >= 7} className="text-[18px] font-semibold" style={{ color: colors.ink }}>
                5 years: 500 × 5 = ₹2,500
              </Show>
            </div>
            <Band on={beat >= 7} size={18} className="mt-1 text-center">
              <Lines lines={['Interest for T years', '= one year’s interest × T']} />
            </Band>
          </div>
        </div>
      </div>
      <StepControls at={beat} total={7} />
    </>
  )
}

/* ============================================================ the formula · 10 */

const ROWS: { words: ReactNode; example: ReactNode; tone: 'brand' | 'success' }[] = [
  { words: 'Rate R% = ₹R on every ₹100 in one year', example: '10% = ₹10 on every ₹100', tone: 'brand' },
  { words: 'Interest for 1 year = P × R ÷ 100', example: '5,000 × 10 ÷ 100 = ₹500', tone: 'brand' },
  { words: 'Interest for T years = (P × R ÷ 100) × T', example: '500 × 3 = ₹1,500', tone: 'brand' },
]

/** The formula built in five rows: the words on the left, the running example on the right. */
export function BuildFormula() {
  const beat = useBeats(5)
  const row = (k: number, words: ReactNode, example: ReactNode, tone: 'brand' | 'success') => (
    <Show key={k} on={beat >= k}>
      <div className="grid grid-cols-[600px_1fr] items-center rounded-xl px-5 py-3" style={{ background: TONE[tone].tint, boxShadow: `inset 0 0 0 2px ${TONE[tone].ring}` }}>
        <span className="border-r-2 pr-4 font-heading text-[21px] font-bold" style={{ color: TONE[tone].ink, borderColor: TONE[tone].ring }}>{words}</span>
        <span className="pl-5 text-[20px] font-semibold" style={{ color: colors.ink }}>{example}</span>
      </div>
    </Show>
  )
  return (
    <>
      <div className="flex w-[1100px] flex-col gap-3">
        <div className="grid grid-cols-[600px_1fr] px-5 text-[16px] font-bold" style={{ color: colors.body }}>
          <span>In words</span>
          <span className="pl-5">Our example: ₹5,000 at 10% for 3 years</span>
        </div>
        {ROWS.map((r, i) => row(i + 1, r.words, r.example, r.tone))}
        <Show on={beat >= 4}>
          <div className="grid grid-cols-[600px_1fr] items-center rounded-xl px-5 py-4 text-white" style={{ background: colors.brandDark }}>
            <span className="text-center font-heading text-[34px] font-bold">SI = P × R × T ÷ 100</span>
            <span className="grid grid-cols-2 gap-x-4 gap-y-1 pl-5 text-[16px] font-semibold">
              <span>P: the principal</span>
              <span>T: the time in years</span>
              <span>R: the rate per year</span>
              <span>÷ 100: R is a percent</span>
            </span>
          </div>
        </Show>
        {row(5, 'Amount = P + SI', '5,000 + 1,500 = ₹6,500', 'success')}
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}
