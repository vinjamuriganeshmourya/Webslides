import { Fragment, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { Countdown, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Band, Calc, Eyebrow, Fade, Head, Insight, Val, Worksheet } from './ci'

/* ============================================================ year table */

/**
 * HOW COMPOUND INTEREST WORKS. The reference's year table, one row a press.
 *
 * Each year's amount becomes the next year's principal, and the reference
 * draws that as a dashed arrow from the amount to the next principal. Each
 * arrow is its own SVG, drawn in the gap between two rows and nowhere else,
 * so it starts on the amount's bottom edge and its tip lands on the next
 * principal's top edge (content rule 42); a 9px head (rule 45), and a
 * straight last stretch into the tip (rule 46).
 */
const COL = { year: 96, p: 190, i: 280, a: 250, gap: 24 }
const ROW_H = 46
const GAP_Y = 34
const X_P = COL.year + COL.gap + COL.p / 2
const X_A = COL.year + COL.gap + COL.p + COL.gap + COL.i + COL.gap + COL.a / 2

const YEARS = [
  { p: '₹1,000', i: '10% of 1,000 = ₹100', a: '₹1,100' },
  { p: '₹1,100', i: '10% of 1,100 = ₹110', a: '₹1,210' },
  { p: '₹1,210', i: '10% of 1,210 = ₹121', a: '₹1,331' },
]

function CarryArrow({ on }: { on: boolean }) {
  const tween = useTween(520)
  const w = X_A - X_P
  /* down from the amount, across, then straight down into the tip */
  const d = `M ${w + 6} 2 L ${w + 6} 7 C ${w + 6} 18, 6 6, 6 18 L 6 ${GAP_Y - 9}`
  return (
    <svg
      aria-hidden
      className="absolute"
      width={w + 12}
      height={GAP_Y}
      viewBox={`0 0 ${w + 12} ${GAP_Y}`}
      style={{ left: X_P - 6, top: 0, opacity: on ? 1 : 0, transition: tween }}
    >
      <path d={d} fill="none" stroke={colors.accentDark} strokeWidth="2.5" strokeDasharray="6 5" strokeLinecap="round" />
      <path d={`M 1.5 ${GAP_Y - 10} L 10.5 ${GAP_Y - 10} L 6 ${GAP_Y - 1} Z`} fill={colors.accentDark} />
    </svg>
  )
}

export function YearTable() {
  const beat = useBeats(4)
  const grid = `${COL.year}px ${COL.p}px ${COL.i}px ${COL.a}px`
  return (
    <>
      <div className="flex flex-col gap-3">
        <p className="font-heading text-[21px] font-semibold" style={{ color: colors.brandDark }}>
          ₹1,000 deposited at 10% compound interest per annum
        </p>
        <div>
          <div className="grid items-end pb-2" style={{ gridTemplateColumns: grid, columnGap: COL.gap }}>
            <Head>Year</Head>
            <Head>Principal for the year</Head>
            <Head>Interest for the year</Head>
            <Head>Amount at the end of the year</Head>
          </div>
          {YEARS.map((y, k) => {
            const on = beat >= k + 1
            return (
              <Fragment key={k}>
                {k > 0 && (
                  <div className="relative" style={{ height: GAP_Y }}>
                    <CarryArrow on={on} />
                  </div>
                )}
                <div className="grid items-center" style={{ gridTemplateColumns: grid, columnGap: COL.gap, height: ROW_H }}>
                  <span className="font-heading text-[20px] font-bold" style={{ color: colors.ink }}>Year {k + 1}</span>
                  <Val on={on} tone="p" width={COL.p} height={ROW_H}>{y.p}</Val>
                  <Val on={on} tone="i" width={COL.i} height={ROW_H} size={19}>{y.i}</Val>
                  <Val on={on} tone="a" width={COL.a} height={ROW_H}>{y.a}</Val>
                </div>
              </Fragment>
            )
          })}
        </div>
        <Insight
          on={beat >= 4}
          className="w-[900px]"
          lines={['Each year, the interest is 10% of the amount at the start of that year, so it grows: 100, 110, 121', 'In simple interest, the interest would be ₹100 every year']}
        />
      </div>
      <StepControls at={beat} total={4} nextLabel="Reveal next" />
    </>
  )
}

/* =========================================================== basic terms */

/**
 * PRINCIPAL, RATE, TIME, COMPOUND INTEREST AND AMOUNT. One bar: the principal
 * in green and the three years' interest in amber after it. A term is named
 * on each press, over the part of the bar it names, then the two brackets
 * (CI under the interest, A under the whole), then the three summary cards.
 */
const P_W = 300
const I_W = 128
const SEG_GAP = 6
const BAR_W = P_W + 3 * (I_W + SEG_GAP)

function Bracket({ on, left, width, color, children }: { on: boolean; left: number; width: number; color: string; children: ReactNode }) {
  return (
    <Fade on={on} style={{ marginLeft: left, width }}>
      <div style={{ height: 10, borderLeft: `2px solid ${color}`, borderRight: `2px solid ${color}`, borderBottom: `2px solid ${color}`, borderRadius: '0 0 4px 4px' }} />
      <p className="mt-1 whitespace-nowrap text-[18px] font-bold" style={{ color }}>{children}</p>
    </Fade>
  )
}

function TermCard({ name, value, note, color }: { name: string; value: string; note: string; color: string }) {
  return (
    <div className="flex w-[232px] flex-col items-start gap-0.5 rounded-xl bg-white px-4 py-2.5" style={{ boxShadow: `inset 0 0 0 2px ${color}` }}>
      <span className="text-[16px] font-bold" style={{ color }}>{name}</span>
      <span className="font-heading text-[26px] font-bold leading-tight" style={{ color }}>{value}</span>
      <span className="text-[16px]" style={{ color: colors.body }}>{note}</span>
    </div>
  )
}

export function BasicTerms() {
  const beat = useBeats(6)
  return (
    <>
      <div className="flex flex-col gap-3">
        <p className="text-[19px] font-semibold" style={{ color: colors.body }}>
          The same deposit: ₹1,000 at 10% per annum for 3 years, compounded annually
        </p>
        <div className="flex items-end gap-8">
          <div style={{ width: BAR_W }}>
            {/* the names, each over the part of the bar it names */}
            <div className="flex items-end" style={{ height: 58 }}>
              <p className="font-heading text-[21px] font-semibold" style={{ width: P_W + SEG_GAP, color: colors.success }}>P = Principal</p>
              <Fade on={beat >= 2}>
                <p className="font-heading text-[21px] font-semibold leading-tight" style={{ color: colors.accentDark }}>R = 10% per annum</p>
                <p className="text-[16px]" style={{ color: colors.body }}>per annum means per year</p>
              </Fade>
            </div>
            <div className="mt-2 flex" style={{ gap: SEG_GAP }}>
              <Val tone="p" width={P_W} height={58} size={26}>₹1,000</Val>
              {['₹100', '₹110', '₹121'].map((v, k) => (
                <Val key={v} tone="i" width={I_W} height={58} size={22}>
                  <span className="flex flex-col items-center gap-1">
                    <span className="text-[16px] font-semibold leading-none" style={{ opacity: beat >= 3 ? 1 : 0, transition: 'opacity 480ms' }}>year {k + 1}</span>
                    {v}
                  </span>
                </Val>
              ))}
            </div>
            <p className="mt-1.5 text-[16px]" style={{ width: P_W, color: colors.body }}>the money deposited or borrowed</p>
          </div>
          <Fade on={beat >= 3} className="pb-[30px]">
            <p className="font-heading text-[21px] font-semibold leading-tight" style={{ color: colors.accentDark }}>T = 3 years</p>
            <p className="text-[16px] leading-snug" style={{ color: colors.body }}>
              <Lines lines={['compounded annually:', 'the interest is added once a year']} />
            </p>
          </Fade>
        </div>
        <div className="flex flex-col gap-2" style={{ width: BAR_W }}>
          <Bracket on={beat >= 4} left={P_W + SEG_GAP} width={BAR_W - P_W - SEG_GAP} color={colors.accentDark}>
            CI = Compound interest = 100 + 110 + 121 = ₹331
          </Bracket>
          <Bracket on={beat >= 5} left={0} width={BAR_W} color={colors.brandDark}>
            A = Amount = P + CI = 1,000 + 331 = ₹1,331
          </Bracket>
        </div>
        <Fade on={beat >= 6} className="flex gap-4">
          <TermCard name="Principal" value="₹1,000" note="the money deposited" color={colors.success} />
          <TermCard name="Compound interest" value="₹331" note="the extra money earned" color={colors.accentDark} />
          <TermCard name="Amount" value="₹1,331" note="the total at the end: P + CI" color={colors.brandDark} />
        </Fade>
      </div>
      <StepControls at={beat} total={6} nextLabel="Reveal next" />
    </>
  )
}

/* ========================================================== growth graph */

/**
 * COMPOUND INTEREST GROWS FASTER EVERY YEAR. The interest earned, SI and CI,
 * plotted year by year: three presses put the points down, the fourth draws
 * the two lines (straight, and bending upward), the fifth asks for year 4,
 * the sixth answers it on the graph. The table beside it fills in step.
 */
const GW = 470
const GH = 330
const PAD = { l: 60, r: 40, t: 24, b: 50 }
const PX = (yr: number) => PAD.l + (yr / 5) * (GW - PAD.l - PAD.r)
const PY = (v: number) => GH - PAD.b - (v / 600) * (GH - PAD.t - PAD.b)
const CI = [0, 100, 210, 331, 464.1, 610.51]

function Graph({ beat }: { beat: number }) {
  const tween = useTween(600)
  const lines = beat >= 4
  const ciSolid = CI.slice(0, 4).map((v, i) => `${i ? 'L' : 'M'} ${PX(i)} ${PY(v)}`).join(' ')
  const ciDash = CI.slice(3).map((v, i) => `${i ? 'L' : 'M'} ${PX(i + 3)} ${PY(v)}`).join(' ')
  const show = (on: boolean) => ({ opacity: on ? 1 : 0, transition: tween })
  return (
    <svg width={GW} height={GH} viewBox={`0 0 ${GW} ${GH}`} className="shrink-0" role="img" aria-label="Interest earned in years 1 to 5, simple and compound">
      {[0, 100, 200, 300, 400, 500, 600].map((v) => (
        <g key={v}>
          <line x1={PAD.l} x2={GW - PAD.r} y1={PY(v)} y2={PY(v)} stroke={colors.line} strokeWidth="1" />
          <text x={PAD.l - 10} y={PY(v) + 5} textAnchor="end" fontSize="16" fill={colors.body}>{v}</text>
        </g>
      ))}
      {[0, 1, 2, 3, 4, 5].map((t) => (
        <text key={t} x={PX(t)} y={GH - PAD.b + 22} textAnchor="middle" fontSize="16" fill={colors.body}>{t}</text>
      ))}
      <line x1={PAD.l} x2={PAD.l} y1={PAD.t - 6} y2={GH - PAD.b} stroke={colors.ink} strokeWidth="2" />
      <line x1={PAD.l} x2={GW - PAD.r} y1={GH - PAD.b} y2={GH - PAD.b} stroke={colors.ink} strokeWidth="2" />
      <text x={(PAD.l + GW - PAD.r) / 2} y={GH - 6} textAnchor="middle" fontSize="16" fontWeight="700" fill={colors.ink}>Time (years)</text>
      <text transform={`translate(16 ${(PAD.t + GH - PAD.b) / 2}) rotate(-90)`} textAnchor="middle" fontSize="16" fontWeight="700" fill={colors.ink}>Interest earned (₹)</text>
      {/* the two lines */}
      <path d={`M ${PX(0)} ${PY(0)} L ${PX(5)} ${PY(500)}`} stroke={colors.success} strokeWidth="2.5" style={show(lines)} />
      <path d={ciSolid} fill="none" stroke={colors.brandDark} strokeWidth="2.5" style={show(lines)} />
      <path d={ciDash} fill="none" stroke={colors.brandDark} strokeWidth="2.5" strokeDasharray="7 6" style={show(beat >= 6)} />
      <text x={PX(5) + 8} y={PY(500) + 5} fontSize="16" fontWeight="700" fill={colors.success} style={show(lines)}>SI</text>
      <text x={PX(5) + 8} y={PY(600) + 2} fontSize="16" fontWeight="700" fill={colors.brandDark} style={show(lines)}>CI</text>
      {/* the points, one year a press; year 1 is the same point for both */}
      {[1, 2, 3].map((yr) => (
        <g key={yr} style={show(beat >= yr)}>
          <circle cx={PX(yr)} cy={PY(yr * 100)} r="6" fill={colors.success} />
          <circle cx={PX(yr)} cy={PY(CI[yr])} r="6" fill={colors.brandDark} />
        </g>
      ))}
      <text x={PX(4)} y={PY(470)} textAnchor="middle" fontSize="24" fontWeight="700" fill={colors.accentDark} style={show(beat === 5)}>?</text>
      <g style={show(beat >= 6)}>
        <circle cx={PX(4)} cy={PY(464.1)} r="7" fill={colors.brandDark} />
        <text x={PX(4) - 12} y={PY(464.1) - 12} textAnchor="end" fontSize="16" fontWeight="700" fill={colors.brandDark}>₹464.10</text>
      </g>
    </svg>
  )
}

export function GrowthGraph() {
  const beat = useBeats(6)
  return (
    <>
      <div className="flex items-start gap-8">
        <Graph beat={beat} />
        <div className="flex w-[560px] flex-col gap-2.5">
          <Worksheet task={2} />
          <div className="flex flex-col gap-1.5 rounded-xl bg-white px-5 py-2.5 shadow-card-soft ring-1 ring-line">
            <p className="text-[18px] font-bold" style={{ color: colors.accentDark }}>Interest on ₹1,000 at 10%</p>
            {[
              ['Year 1:', 'SI ₹100  ·  CI ₹100'],
              ['Year 2:', 'SI ₹200  ·  CI ₹210'],
              ['Year 3:', 'SI ₹300  ·  CI ₹331'],
            ].map(([y, v], k) => (
              <Fade key={y} on={beat >= k + 1}>
                <p className="whitespace-pre text-[18px] font-bold" style={{ color: colors.ink }}>
                  {y}  {v}
                </p>
              </Fade>
            ))}
            <Fade on={beat >= 4} className="flex flex-col gap-1.5">
              <p className="text-[17px] font-semibold leading-snug" style={{ color: colors.success }}>
                <Lines lines={['SI adds the same ₹100 every year:', 'a straight line']} />
              </p>
              <p className="text-[17px] font-semibold leading-snug" style={{ color: colors.brandDark }}>
                <Lines lines={['CI adds more every year:', 'the line bends upward']} />
              </p>
            </Fade>
            <div className="relative" style={{ height: 40 }}>
              <Insight on={beat === 5} className="absolute inset-x-0 top-0" size={17} lines={['Predict: the interest after 4 years?']} />
              <Fade on={beat >= 6} className="absolute inset-x-0 top-0">
                <p className="text-[18px] font-bold" style={{ color: colors.brandDark }}>CI = 331 + 10% of 1,331 = ₹464.10</p>
              </Fade>
            </div>
            <Band on={beat >= 6} size={17}>
              <Lines lines={['For 1 year, compounded annually, CI = SI', 'After that, CI grows faster']} />
            </Band>
          </div>
        </div>
      </div>
      <StepControls at={beat} total={6} nextLabel="Reveal next" />
    </>
  )
}

/* ========================================================= formula build */

/**
 * BUILDING THE FORMULA. In words on the left, the ₹1,000 example on the
 * right, one row a press, until the general formula stands in its band, and
 * the last row turns the amount into the interest.
 */
const STEPS: { words: ReactNode; ex: ReactNode }[] = [
  { words: 'R% per annum: each year, multiply by (1 + R/100)', ex: '10%: ×1.1, so ₹100 becomes ₹110' },
  { words: 'After 1 year: A = P × (1 + R/100)', ex: '1,000 × 1.1 = ₹1,100' },
  { words: 'After 2 years: A = P × (1 + R/100) × (1 + R/100)', ex: '1,000 × 1.1 × 1.1 = ₹1,210' },
]
const FW = { words: 560, ex: 430 }

function FRow({ on, words, ex, tone = colors.brandDark }: { on: boolean; words: ReactNode; ex: ReactNode; tone?: string }) {
  const tween = useTween(520)
  return (
    <div
      className="flex items-center rounded-xl"
      style={{ height: 50, background: on ? `${tone}0F` : 'transparent', boxShadow: `inset 0 0 0 2px ${on ? tone : colors.line}`, opacity: on ? 1 : 0.35, transition: tween }}
    >
      <span className="px-4 text-[18px] font-bold" style={{ width: FW.words, color: tone, opacity: on ? 1 : 0, transition: tween }}>{words}</span>
      <span className="h-7 w-px" style={{ background: colors.line }} />
      <span className="px-4 text-[18px] font-semibold" style={{ color: colors.ink, opacity: on ? 1 : 0, transition: tween }}>{ex}</span>
    </div>
  )
}

export function FormulaBuild() {
  const beat = useBeats(5)
  return (
    <>
      <div className="flex flex-col gap-2.5" style={{ width: FW.words + FW.ex + 1 }}>
        <div className="flex">
          <Head style={{ width: FW.words, paddingLeft: 16 }}>In words</Head>
          <Head style={{ paddingLeft: 16 }}>Our example: ₹1,000 at 10% per annum</Head>
        </div>
        {STEPS.map((s, k) => (
          <FRow key={k} on={beat >= k + 1} words={s.words} ex={s.ex} />
        ))}
        <Fade on={beat >= 4}>
          <div className="flex items-center rounded-xl text-white" style={{ height: 76, background: colors.brandDark }}>
            <span className="px-6 font-heading text-[32px] font-bold" style={{ width: FW.words }}>
              A = P × (1 + R/100)<sup className="text-[20px]">T</sup>
            </span>
            <span className="grid grid-cols-2 gap-x-6 gap-y-0.5 px-4 text-[16px] font-semibold">
              <span>P: the principal</span>
              <span>T: the number of years</span>
              <span>R: the rate per annum</span>
              <span>1 + R/100: the multiplier</span>
            </span>
          </div>
        </Fade>
        <FRow on={beat >= 5} tone={colors.success} words="Compound interest: CI = A − P" ex={<>3 years: 1,000 × 1.1<sup>3</sup> = 1,331, CI = ₹331</>} />
      </div>
      <StepControls at={beat} total={5} nextLabel="Reveal next" />
    </>
  )
}

/* ============================================================= frequency */

/**
 * HALF-YEARLY AND QUARTERLY COMPOUNDING. One year drawn as a bar, split into
 * the number of times the interest is added, each part carrying its
 * multiplier. One way per press, then the rule.
 */
const WAYS = [
  { label: 'Once a year', parts: ['×1.20'], amount: '₹3,600' },
  { label: 'Twice a year', parts: ['×1.10', '×1.10'], amount: '₹3,630', note: 'half the rate, applied twice' },
  { label: 'Four times a year', parts: ['×1.05', '×1.05', '×1.05', '×1.05'], amount: '₹3,646.52' },
]

export function Frequency() {
  const beat = useBeats(4)
  const tween = useTween(520)
  return (
    <>
      <div className="flex flex-col gap-3">
        <p className="text-[19px] font-semibold" style={{ color: colors.body }}>₹3,000 at 20% a year, for 1 year</p>
        <div className="flex flex-col gap-4">
          {WAYS.map((w, k) => {
            const on = beat >= k + 1
            return (
              <div key={w.label} className="flex flex-col gap-1">
                <div className="flex items-center gap-6">
                  <span className="w-[220px] font-heading text-[22px] font-semibold" style={{ color: on ? colors.brandDark : colors.muted, opacity: on ? 1 : 0.5, transition: tween }}>
                    {w.label}
                  </span>
                  <div className="flex overflow-hidden rounded-xl" style={{ width: 480, height: 50, boxShadow: `inset 0 0 0 2px ${on ? colors.brandDark : colors.line}`, transition: tween }}>
                    {w.parts.map((p, i) => (
                      <span
                        key={i}
                        className="grid flex-1 place-items-center font-mono text-[18px] font-bold"
                        style={{
                          color: colors.brandDark,
                          background: on ? colors.surface2 : 'transparent',
                          borderLeft: i ? `2px ${on ? 'solid' : 'dashed'} ${on ? colors.brandDark : colors.line}` : undefined,
                          transition: tween,
                        }}
                      >
                        <span style={{ opacity: on ? 1 : 0, transition: tween }}>{p}</span>
                      </span>
                    ))}
                  </div>
                  <span className="font-heading text-[24px] font-bold" style={{ color: colors.success, opacity: on ? 1 : 0, transition: tween }}>{w.amount}</span>
                </div>
                {w.note && (
                  <span className="text-[16px]" style={{ color: colors.body, opacity: on ? 1 : 0, transition: tween }}>{w.note}</span>
                )}
              </div>
            )
          })}
        </div>
        <Insight on={beat >= 4} className="w-[920px]" size={19} lines={['When interest is compounded more often, more interest is earned', 'Quarterly > half-yearly > yearly']} />
      </div>
      <StepControls at={beat} total={4} nextLabel="Reveal next" />
    </>
  )
}

/* ============================================================ split rate */

/**
 * HALF-YEARLY AND QUARTERLY COMPOUNDING, WORKSHEET TASK 4. The rule as a
 * table, one row a press, the worked example, then the room's turn on the
 * timer.
 */
const SPLIT = [
  { how: 'annually', when: 'once a year', rate: 'R%', n: 'T' },
  { how: 'half-yearly', when: 'every 6 months', rate: 'R/2 %', n: '2 × T' },
  { how: 'quarterly', when: 'every 3 months', rate: 'R/4 %', n: '4 × T' },
]

function Problem({ eyebrow, tone, on, lines, rate, answer, showRate, showAnswer }: {
  eyebrow: string
  tone: string
  on: boolean
  lines: string[]
  rate: string
  answer: string
  showRate: boolean
  showAnswer: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl px-5 py-3" style={{ minHeight: 140, background: tone === colors.brandDark ? colors.white : `${colors.warning}14`, boxShadow: `inset 0 0 0 2px ${tone}` }}>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <Fade on={on}>
        <p className="text-[17px] leading-snug" style={{ color: colors.ink }}>
          <Lines lines={lines} />
        </p>
      </Fade>
      <Calc on={showRate} tone="a" size={18}>{rate}</Calc>
      <Calc on={showAnswer} tone="p" size={19}>{answer}</Calc>
    </div>
  )
}

export function SplitRate() {
  const beat = useBeats(8)
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-6">
          <div className="flex w-[520px] shrink-0 flex-col gap-2">
            <Band size={18}>Interest added more often: split the rate</Band>
            <div className="grid grid-cols-[170px_200px_1fr] px-3">
              <Head>Compounded</Head>
              <Head>Rate for each period</Head>
              <Head>Periods</Head>
            </div>
            {SPLIT.map((r, k) => (
              <Fade key={r.how} on={beat >= k + 1}>
                <div className="grid grid-cols-[170px_200px_1fr] items-center rounded-xl bg-white px-3 py-1.5 ring-1 ring-line">
                  <span className="leading-tight">
                    <b className="block text-[18px]" style={{ color: colors.ink }}>{r.how}</b>
                    <span className="text-[16px]" style={{ color: colors.body }}>{r.when}</span>
                  </span>
                  <Val tone="soft" width={150} height={34} size={18}>{r.rate}</Val>
                  <Val tone="soft" width={110} height={34} size={18}>{r.n}</Val>
                </div>
              </Fade>
            ))}
            <Insight on={beat >= 4} size={17} lines={['20% per annum, half-yearly, for 2 years:', 'use 10% for 4 periods']} />
            <Fade on={beat >= 4}>
              <p className="text-[16px] font-semibold" style={{ color: colors.body }}>Semiannually means half-yearly</p>
            </Fade>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex items-center gap-6">
              <Worksheet task={4} />
              <Countdown seconds={60} />
            </div>
            <Problem
              eyebrow="Example"
              tone={colors.brandDark}
              on={beat >= 5}
              lines={['₹8,000 at 10% per annum, compounded half-yearly, for 1 year', 'Find the amount']}
              rate="Rate = 10 ÷ 2 = 5%, periods = 2 × 1 = 2"
              answer="A = 8,000 × 1.05 × 1.05 = ₹8,820"
              showRate={beat >= 5}
              showAnswer={beat >= 6}
            />
            <Problem
              eyebrow="Your turn · Worksheet task 4"
              tone={colors.accentDark}
              on={beat >= 7}
              lines={['₹4,000 at 20% per annum, compounded half-yearly, for 1 year', 'Find the amount']}
              rate="Rate = 20 ÷ 2 = 10%, periods = 2"
              answer="A = 4,000 × 1.1 × 1.1 = ₹4,840"
              showRate={beat >= 8}
              showAnswer={beat >= 8}
            />
          </div>
        </div>
      </div>
      <StepControls at={beat} total={8} nextLabel="Reveal next" />
    </>
  )
}
