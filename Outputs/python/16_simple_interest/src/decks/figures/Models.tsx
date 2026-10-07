import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Show, TaskPill } from './pieces'
import { Band, Chip, Slot, TONE, Tip } from './si'

/**
 * Simple Interest, the eight placement question models and the six
 * takeaways. The question is the slide's lead (`QLead`, in the deck file);
 * each figure is the reference's own drawing, in template colours, with its
 * reveals in the reference's order and count.
 */

/* ------------------------------------------------------------ a timeline */

function Axis({ width, labels, x }: { width: number; labels: string[]; x: (i: number) => number }) {
  return (
    <div className="relative" style={{ width, height: 40 }}>
      <div className="absolute inset-x-0 top-[8px] h-[3px] rounded-full" style={{ background: colors.ink }} />
      {labels.map((l, i) => (
        <div key={i} className="absolute flex -translate-x-1/2 flex-col items-center" style={{ left: x(i), top: 0 }}>
          <span className="h-[18px] w-[3px] rounded-full" style={{ background: colors.ink }} />
          <span className="mt-0.5 whitespace-nowrap text-[16px] font-semibold" style={{ color: colors.body }}>{l}</span>
        </div>
      ))}
    </div>
  )
}

/** A bracket under a stretch of the axis, with its working under it. */
function Brace({ on, left, width, tone, children }: { on: boolean; left: number; width: number; tone: 'success' | 'accent' | 'brand'; children: ReactNode }) {
  return (
    <Show on={on} className="absolute" style={{ left, width }}>
      <div className="h-3 rounded-b-md border-x-[2.5px] border-b-[2.5px]" style={{ borderColor: TONE[tone].solid }} />
      <div className="mt-1 text-center text-[18px] font-bold leading-snug" style={{ color: TONE[tone].ink }}>{children}</div>
    </Show>
  )
}

/* ============================================================ two amounts · 17 */

export function TwoAmounts() {
  const beat = useBeats(6)
  const W = 1040
  const x = (i: number) => 30 + i * ((W - 60) / 5)
  return (
    <>
      <div className="flex w-[1100px] flex-col gap-2">
        <div className="relative" style={{ width: W, height: 44 }}>
          <span className="absolute -translate-x-1/2 rounded-lg px-4 py-1.5 font-heading text-[19px] font-bold" style={{ left: x(0), top: 0, color: colors.accentDark, background: TONE.accent.tint, border: `2px dashed ${colors.accent}` }}>
            P = ?
          </span>
          <span className="absolute -translate-x-1/2 rounded-lg bg-white px-4 py-1.5 font-heading text-[19px] font-bold" style={{ left: x(2), top: 0, color: colors.brandDark, border: `2px solid ${colors.brandDark}` }}>
            ₹6,000
          </span>
          <span className="absolute -translate-x-1/2 rounded-lg bg-white px-4 py-1.5 font-heading text-[19px] font-bold" style={{ left: x(5), top: 0, color: colors.brandDark, border: `2px solid ${colors.brandDark}` }}>
            ₹7,500
          </span>
        </div>
        <Axis width={W} x={x} labels={['start', '1 year', '2 years', '3 years', '4 years', '5 years']} />
        <div className="relative" style={{ width: W, height: 78 }}>
          <Brace on={beat >= 4} left={x(0)} width={x(2) - x(0) - 6} tone="success">
            <Lines lines={['First 2 years: 500 × 2 = ₹1,000', 'P = 6,000 − 1,000 = ₹5,000']} />
          </Brace>
          <Brace on={beat >= 2} left={x(2) + 6} width={x(5) - x(2) - 6} tone="accent">
            3 more years: 7,500 − 6,000 = ₹1,500
            <Show on={beat >= 3}>One year’s interest = 1,500 ÷ 3 = ₹500</Show>
          </Brace>
        </div>
        <Band on={beat >= 5} size={19} className="w-[1040px] text-center">
          Principal = ₹5,000 &nbsp;·&nbsp; Rate = 500 × 100 ÷ 5,000 = 10% per annum
        </Band>
        <Tip on={beat >= 6} size={17} className="w-[1040px]" lines={['₹1,500 is the interest for the 3 extra years only', 'Both amounts already include the first 2 years']} />
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ============================================================ doubles and triples · 18 */

function PBlock({ tone, children, w = 190 }: { tone: 'success' | 'accent'; children: ReactNode; w?: number }) {
  return (
    <span className="grid h-[50px] shrink-0 place-items-center rounded-lg font-heading text-[20px] font-bold text-white" style={{ width: w, background: TONE[tone].solid }}>
      {children}
    </span>
  )
}

export function DoublesTriples() {
  const beat = useBeats(5)
  const tag = (t: ReactNode) => <span className="ml-3 text-[19px] font-bold" style={{ color: colors.accentDark }}>{t}</span>
  return (
    <>
      <div className="flex w-[1100px] flex-col gap-3">
        <div className="flex items-center">
          <span className="w-[200px] shrink-0 text-[20px] font-bold" style={{ color: colors.ink }}>The sum</span>
          <PBlock tone="success">P</PBlock>
        </div>
        <Show on={beat >= 2} className="flex items-center gap-2">
          <span className="w-[192px] shrink-0 text-[20px] font-bold" style={{ color: colors.ink }}>Doubles: 2 × P</span>
          <PBlock tone="success">P</PBlock>
          <PBlock tone="accent">P</PBlock>
          {tag('interest = P, in 8 years')}
        </Show>
        <Show on={beat >= 3} className="flex items-center gap-2">
          <span className="w-[192px] shrink-0 text-[20px] font-bold" style={{ color: colors.ink }}>Triples: 3 × P</span>
          <PBlock tone="success">P</PBlock>
          <PBlock tone="accent">{beat >= 4 ? 'P in 8 years' : 'P'}</PBlock>
          <PBlock tone="accent">{beat >= 4 ? 'P in 8 years' : 'P'}</PBlock>
          {tag('interest = 2P')}
        </Show>
        <Show on={beat >= 4} className="text-[20px] font-bold" style={{ marginLeft: 200, color: colors.brandDark }}>
          Twice the interest takes twice the time: 2 × 8 = 16 years
        </Show>
        <Band on={beat >= 5} size={19} className="mt-1 w-[1040px]">
          <Lines lines={['Amount = n × P means interest = (n − 1) × P', 'The rate here is 100 ÷ 8 = 12.5%']} />
        </Band>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}

/* ============================================================ changes in P, R, T · 19 */

const GRID = 'grid-cols-[230px_150px_110px_130px_170px_1fr]'
const CASES: { name: string; cells: string[]; hot: number; change: string }[] = [
  { name: 'Original', cells: ['₹10,000', '8%', '4 years', '₹3,200'], hot: -1, change: 'no change' },
  { name: 'Principal doubles', cells: ['₹20,000', '8%', '4 years', '₹6,400'], hot: 0, change: '× 2 (doubles)' },
  { name: 'Rate 8% → 10%', cells: ['₹10,000', '10%', '4 years', '₹4,000'], hot: 1, change: '× 10/8 (up 25%)' },
  { name: 'Time cut to half', cells: ['₹10,000', '8%', '2 years', '₹1,600'], hot: 2, change: '× 1/2' },
]

export function Changes() {
  const beat = useBeats(6)
  return (
    <>
      <div className="flex w-[1100px] flex-col gap-2">
        <div className={`grid ${GRID} rounded-xl px-3 py-2 text-center text-[17px] font-bold text-white`} style={{ background: colors.brandDark }}>
          <span>Case</span>
          <span>Principal</span>
          <span>Rate</span>
          <span>Time</span>
          <span>Simple interest</span>
          <span>Change in SI</span>
        </div>
        {CASES.map((c, i) => (
          <div key={c.name} className={`grid ${GRID} items-center rounded-xl bg-white px-3 py-1.5 text-center ring-1 ring-line`}>
            <Show on={beat >= i + 1} className="text-[18px] font-bold" style={{ color: colors.ink }}>{c.name}</Show>
            {c.cells.map((v, k) => (
              <Slot key={k} on={beat >= i + 1} h={38} className="mx-1">
                <span className="text-[18px] font-semibold" style={{ color: k === c.hot ? colors.accentDark : k === 3 ? colors.brandDark : colors.ink, fontWeight: k === c.hot || k === 3 ? 700 : 600 }}>{v}</span>
              </Slot>
            ))}
            <Show on={beat >= i + 1} className="text-[18px] font-bold" style={{ color: colors.brandDark }}>{c.change}</Show>
          </div>
        ))}
        <Tip on={beat >= 5} tone="success" className="mt-1" lines={['When two of P, R and T stay the same, SI changes in the same ratio as the third']} />
        <Tip on={beat >= 6} lines={['8% → 10% is an increase of 2 percentage points (10 − 8 = 2)', 'But it is a 25% increase in the rate (2 ÷ 8 = 25%), so the SI also rises by 25%']} />
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ============================================================ difference · 20 */

function Method({ title, tone, children }: { title: string; tone: 'brand' | 'success'; children: ReactNode }) {
  return (
    <div className="flex h-[158px] flex-col overflow-hidden rounded-xl bg-white" style={{ boxShadow: `inset 0 0 0 2px ${TONE[tone].ring}` }}>
      <p className="py-2 text-center font-heading text-[18px] font-bold text-white" style={{ background: TONE[tone].solid }}>{title}</p>
      <div className="flex flex-1 flex-col justify-center gap-1.5 px-5 text-center">{children}</div>
    </div>
  )
}

export function Difference() {
  const beat = useBeats(6)
  return (
    <>
      <div className="flex w-[1100px] flex-col gap-3">
        <div className="grid grid-cols-2 gap-5">
          <Method title="Standard method" tone="brand">
            <Show on={beat >= 2} className="text-[18px] font-semibold" style={{ color: colors.ink }}>At 10%: 12,000 × 10 × 5 ÷ 100 = ₹6,000</Show>
            <Show on={beat >= 3} className="text-[18px] font-semibold" style={{ color: colors.ink }}>At 8%: 12,000 × 8 × 5 ÷ 100 = ₹4,800</Show>
            <Show on={beat >= 4} className="text-[20px] font-bold" style={{ color: colors.brandDark }}>Difference = 6,000 − 4,800 = ₹1,200</Show>
          </Method>
          <Method title="Shorter method" tone="success">
            <Show on={beat >= 5} className="flex flex-col gap-2">
              <p className="text-[17px]" style={{ color: colors.body }}>Only the extra rate makes the difference:</p>
              <p className="text-[20px] font-bold" style={{ color: colors.ink }}>10% − 8% = 2%</p>
              <p className="text-[20px] font-bold" style={{ color: colors.success }}>12,000 × 2 × 5 ÷ 100 = ₹1,200</p>
            </Show>
          </Method>
        </div>
        <Tip
          on={beat >= 6}
          size={16}
          lines={[
            'Why it works: the principal and the time are the same in both,',
            'so the 8% part is the same in both and cancels',
            'Only the extra 2% for 5 years is left',
            'If the difference is given, use the same idea to find the unknown P, R or T',
          ]}
        />
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ============================================================ splitting a sum · 21 */

export function Splitting() {
  const beat = useBeats(6)
  const tween = useTween(520)
  const W = 900
  return (
    <>
      <div className="flex flex-col gap-1.5 self-center" style={{ width: W }}>
        <div className="flex justify-center">
          <Chip tone="success" w={340} h={34} size={17}>Total invested: ₹20,000</Chip>
        </div>
        <svg width={W} height="16" aria-hidden style={{ opacity: beat >= 2 ? 1 : 0, transition: tween }}>
          <path d={`M${W / 2} 0 L${W / 4} 16 M${W / 2} 0 L${(3 * W) / 4} 16`} stroke={colors.muted} strokeWidth="2.5" fill="none" />
        </svg>
        <div className="grid grid-cols-2 gap-6">
          {[
            { title: 'Scheme A: ₹x at 8%', tone: 'brand' as const, lines: ['Interest = x × 8 × 2 ÷ 100', '= 16x ÷ 100'] },
            { title: 'Scheme B: ₹(20,000 − x) at 12%', tone: 'accent' as const, lines: ['(20,000 − x) × 12 × 2 ÷ 100', '= 24(20,000 − x) ÷ 100'] },
          ].map((s) => (
            <div key={s.title} className="flex flex-col items-center gap-0.5">
              <Show on={beat >= 2}>
                <span className="block rounded-lg px-5 py-1 font-heading text-[17px] font-bold" style={{ background: TONE[s.tone].tint, color: TONE[s.tone].ink, boxShadow: `inset 0 0 0 2px ${TONE[s.tone].ring}` }}>
                  {s.title}
                </span>
              </Show>
              <Show on={beat >= 3} className="text-center text-[16px] font-semibold leading-snug" style={{ color: colors.ink }}>
                <span className="block">{s.lines[0]}</span>
                <span className="block" style={{ color: TONE[s.tone].ink }}>{s.lines[1]}</span>
              </Show>
            </div>
          ))}
        </div>
        <Show on={beat >= 4}>
          <div className="rounded-xl px-4 py-1 text-center text-[17px] font-bold" style={{ background: TONE.brand.tint, color: colors.brandDark, boxShadow: `inset 0 0 0 2px ${TONE.brand.ring}` }}>
            Total interest: 16x ÷ 100 + 24(20,000 − x) ÷ 100 = 4,400
          </div>
        </Show>
        <Show on={beat >= 5} className="text-center text-[17px] font-semibold" style={{ color: colors.ink }}>
          × 100: &nbsp;16x + 4,80,000 − 24x = 4,40,000 &nbsp;→&nbsp; 8x = 40,000 &nbsp;→&nbsp; x = 5,000
        </Show>
        <Band on={beat >= 6} size={17} className="text-center">
          ₹5,000 at 8% and ₹15,000 at 12% &nbsp;·&nbsp; check: 800 + 3,600 = ₹4,400
        </Band>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ============================================================ ratios · 22 */

function Invest({ title, p, sub }: { title: string; p: string; sub: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[17px] font-bold" style={{ color: colors.body }}>{title}</p>
      <div className="flex items-center gap-3">
        <span className="grid h-[40px] w-[170px] place-items-center rounded-lg font-heading text-[20px] font-bold" style={{ color: colors.accentDark, background: TONE.accent.tint, border: `2px dashed ${colors.accent}` }}>
          {p}
        </span>
        <Chip tone="accent" w={130} h={40} size={18}>same SI</Chip>
      </div>
      <p className="text-[16px] font-semibold" style={{ marginLeft: 0, width: 170, textAlign: 'center', color: colors.body }}>{sub}</p>
    </div>
  )
}

export function Ratios() {
  const beat = useBeats(5)
  return (
    <>
      <div className="flex w-[1100px] flex-col gap-3">
        <div className="flex items-stretch gap-8">
          <div className="flex w-[330px] shrink-0 flex-col gap-1.5">
            <Invest title="First investment" p="P1 = ?" sub="5% for 4 years" />
            <Invest title="Second investment" p="P2 = ?" sub="8% for 3 years" />
          </div>
          <span className="w-[2px] shrink-0 rounded-full" style={{ background: colors.line }} />
          <div className="flex flex-1 flex-col justify-center gap-3">
            <Show on={beat >= 2} className="font-heading text-[22px] font-bold" style={{ color: colors.brandDark }}>P1 × 5 × 4 ÷ 100 = P2 × 8 × 3 ÷ 100</Show>
            <Show on={beat >= 3} className="font-heading text-[22px] font-bold" style={{ color: colors.ink }}>Cancel ÷ 100: &nbsp;20 × P1 = 24 × P2</Show>
            <Show on={beat >= 4} className="font-heading text-[28px] font-bold" style={{ color: colors.success }}>P1 : P2 = 24 : 20 = 6 : 5</Show>
            <Show on={beat >= 5} className="text-[17px] font-semibold" style={{ color: colors.body }}>Check: 6,000 × 20% = 1,200 and 5,000 × 24% = 1,200</Show>
          </div>
        </div>
        <Band on={beat >= 5} size={18} className="text-center">
          Equal interest: the principals are in the inverse ratio of R × T (20 and 24 give 24 : 20)
        </Band>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}

/* ============================================================ changing rates · 23 */

export function ChangingRates() {
  const beat = useBeats(5)
  const W = 1000
  const x = (i: number) => 20 + i * ((W - 40) / 5)
  return (
    <>
      <div className="flex w-[1100px] flex-col gap-1.5">
        <p className="text-[18px] font-bold" style={{ color: colors.success }}>The principal is ₹10,000 for all 5 years</p>
        <div className="relative" style={{ width: W, height: 42 }}>
          <span className="absolute grid h-[40px] place-items-center rounded-l-lg font-heading text-[18px] font-bold" style={{ left: x(0), width: x(2) - x(0), color: colors.brandDark, background: TONE.brand.tint, border: `2px solid ${TONE.brand.ring}` }}>
            6% for 2 years
          </span>
          <span className="absolute grid h-[40px] place-items-center rounded-r-lg font-heading text-[18px] font-bold" style={{ left: x(2), width: x(5) - x(2), color: colors.accentDark, background: TONE.accent.tint, border: `2px solid ${TONE.accent.ring}` }}>
            8% for 3 years
          </span>
        </div>
        <Axis width={W} x={x} labels={['start', '1', '2', '3', '4', '5 years']} />
        <div className="relative" style={{ width: W, height: 74 }}>
          <Show on={beat >= 2} className="absolute text-center text-[18px] font-bold leading-snug" style={{ left: x(0), width: x(2) - x(0), color: colors.brandDark }}>
            <Lines lines={['10,000 × 6 × 2 ÷ 100', '= ₹1,200']} />
          </Show>
          <Show on={beat >= 3} className="absolute text-center text-[18px] font-bold leading-snug" style={{ left: x(2), width: x(5) - x(2), color: colors.accentDark }}>
            <Lines lines={['10,000 × 8 × 3 ÷ 100', '= ₹2,400']} />
            <span className="block text-[16px] font-semibold" style={{ color: colors.body }}>still on ₹10,000</span>
          </Show>
        </div>
        <Band on={beat >= 4} size={19} className="text-center" >
          Total SI = 1,200 + 2,400 = ₹3,600 &nbsp;·&nbsp; Amount = 10,000 + 3,600 = ₹13,600
        </Band>
        <Tip on={beat >= 5} size={16} lines={['The ₹1,200 earned is not added to the principal, so years 3 to 5 are still on ₹10,000', 'Adding the interest to the principal is compound interest, the next session']} />
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}

/* ============================================================ paying back · 24 */

const PAY = 'grid-cols-[110px_250px_230px_1fr]'

export function PayingBack() {
  const beat = useBeats(6)
  const cell = (on: boolean, children: ReactNode, h = 48) => (
    <Slot on={on} h={h} className="mx-1">
      <div className="text-center text-[17px] font-semibold leading-tight" style={{ color: colors.ink }}>{children}</div>
    </Slot>
  )
  return (
    <>
      <div className="flex w-[1100px] flex-col gap-2">
        <div className={`grid ${PAY} rounded-xl px-3 py-2 text-center text-[16px] font-bold text-white`} style={{ background: colors.brandDark }}>
          <span>Year</span>
          <span>Principal owed in the year</span>
          <span>Interest for the year</span>
          <span>Paid at the end of the year</span>
        </div>
        <div className={`grid ${PAY} items-center rounded-xl bg-white px-3 py-1 ring-1 ring-line`}>
          <span className="text-center font-heading text-[19px] font-bold" style={{ color: colors.ink }}>Year 1</span>
          {cell(beat >= 2, <b className="font-heading text-[20px]" style={{ color: colors.success }}>₹10,000</b>)}
          {cell(beat >= 2, <Lines lines={['10% of 10,000', <b key="b" style={{ color: colors.accentDark }}>= ₹1,000</b>]} />)}
          {cell(beat >= 3, '₹1,000 interest + ₹4,000 principal')}
        </div>
        <div className={`grid ${PAY} items-center rounded-xl bg-white px-3 py-1 ring-1 ring-line`}>
          <span className="text-center font-heading text-[19px] font-bold" style={{ color: colors.ink }}>Year 2</span>
          {cell(beat >= 4, <Lines lines={[<b key="b" className="font-heading text-[20px]" style={{ color: colors.success }}>₹6,000</b>, <span key="s" className="text-[16px]" style={{ color: colors.body }}>10,000 − 4,000</span>]} />)}
          {cell(beat >= 5, <Lines lines={['10% of 6,000', <b key="b" style={{ color: colors.accentDark }}>= ₹600</b>]} />)}
          {cell(beat >= 5, '₹600 interest + ₹6,000 principal')}
        </div>
        <Band on={beat >= 6} size={19} className="text-center">Total interest paid = 1,000 + 600 = ₹1,600</Band>
        <Tip on={beat >= 6} size={16} lines={['Paying the interest does not change the principal', 'Paying back ₹4,000 of the principal does']} />
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ============================================================ takeaways · 25 */

const TAKE: { head: string; sub: string[] }[] = [
  { head: 'Simple interest is calculated using SI = P × R × T ÷ 100, and A = P + SI', sub: ['Read the question: does it ask for the interest or the amount?'] },
  { head: 'The rate is per year, so convert the time into years first', sub: ['18 months = 1.5 years', 'For days, divide by 365 unless the question says 360'] },
  { head: 'To find P, R or T, rearrange the same formula', sub: ['P = SI × 100 ÷ (R × T)', 'If the amount is given, also use A = P + SI'] },
  { head: 'When two amounts are given, their difference is the interest for the extra years', sub: ['Divide it by those years to get one year’s interest, then find the principal'] },
  { head: 'When a sum becomes n times itself, the interest is (n − 1) × principal', sub: ['A sum that doubles in 8 years triples in 16 years'] },
  { head: 'When the rate changes or money is paid back, find the interest for each period', sub: ['In simple interest, the interest is never added to the principal'] },
]

export function Takeaways() {
  const beat = useBeats(7)
  return (
    <>
      <div className="flex w-[1100px] flex-col gap-3">
        <div className="flex items-center gap-4">
          <Band size={19} className="flex-1 text-center">Always calculate simple interest on the original principal</Band>
          <TaskPill>Worksheet · Task 3</TaskPill>
        </div>
        <div className="grid grid-flow-col grid-cols-2 grid-rows-3 gap-3">
          {TAKE.map((t, i) => {
            const tone = i < 3 ? 'brand' : 'accent'
            return (
              <Show key={i} on={beat >= i + 2}>
                <div className="flex h-[104px] items-start gap-3 rounded-xl px-4 py-2.5" style={{ background: TONE[tone].tint, boxShadow: `inset 0 0 0 2px ${TONE[tone].ring}` }}>
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full font-heading text-[16px] font-bold text-white" style={{ background: TONE[tone].solid }}>
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[17px] font-bold leading-snug" style={{ color: TONE[tone].ink }}>{t.head}</p>
                    <p className="mt-0.5 text-[16px] leading-snug" style={{ color: colors.body }}>
                      <Lines lines={t.sub} />
                    </p>
                  </div>
                </div>
              </Show>
            )
          })}
        </div>
      </div>
      <StepControls at={beat} total={7} />
    </>
  )
}
