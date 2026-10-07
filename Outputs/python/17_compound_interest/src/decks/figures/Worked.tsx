import { Fragment, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Band, Calc, Fade, GapArrow, Insight, StepCard, Val } from './ci'

/** `A = P × (1 + R/100)ᵀ`, with the T set as the reference sets it. */
export const FORMULA = (
  <>
    A = P × (1 + R/100)<sup>T</sup>
  </>
)

/* ========================================================== worked steps */

/**
 * THE FOUR-STEP SOLUTION: given data, formula, substitution, final answer.
 * Slides 12, 16, 17 and 18 all solve on this one frame, which is the
 * reference's own: four cards in a row with an arrow between each, empty on
 * entry, one card filled per press, then the note.
 */
export function WorkedSteps({ given, formula, subst, answer, note }: { given: ReactNode[]; formula: ReactNode[]; subst: ReactNode[]; answer: ReactNode[]; note: ReactNode[] }) {
  const beat = useBeats(6)
  const cards: { title: string; lines: ReactNode[]; tone?: 'p' }[] = [
    { title: '1 · Given data', lines: given },
    { title: '2 · Formula', lines: formula },
    { title: '3 · Substitution', lines: subst },
    { title: '4 · Final answer', lines: answer, tone: 'p' },
  ]
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-stretch">
          {cards.map((c, k) => (
            <Fragment key={c.title}>
              {k > 0 && <GapArrow width={30} color={colors.muted} />}
              <StepCard title={c.title} tone={c.tone === 'p' ? 'p' : 'a'} width={258} minHeight={150}>
                {c.lines.map((l, i) => (
                  <Calc key={i} on={beat >= k + 2} tone={c.tone} size={c.tone ? 22 : 18}>
                    {l}
                  </Calc>
                ))}
              </StepCard>
            </Fragment>
          ))}
        </div>
        <Insight on={beat >= 6} className="w-[1122px]" size={18} lines={note} />
      </div>
      <StepControls at={beat} total={6} nextLabel="Reveal next" />
    </>
  )
}

/* ============================================================== timeline */

/**
 * A TIME LINE OF ONE DEPOSIT (slides 20 and 21). The years as coloured
 * segments over an axis, the value at each tick in a chip, and each step's
 * calculation under the stretch of time it covers. Everything is placed by
 * its x on the axis, so a chip, its tick and its calculation share one line.
 */
export interface TlSeg { from: number; to: number; label: ReactNode; tone: 'a' | 'i' }
export interface TlTick { x: number; label: string }
export interface TlChip { x: number; value: string; tone: 'p' | 'a'; at: number; ringAt?: number }
export interface TlCalc { x: number; lines: { text: ReactNode; at: number; tone: 'a' | 'i' }[] }

const TL_W = 1040

export function Timeline({
  segs,
  ticks,
  chips,
  calcs,
  band,
  insight,
  total,
}: {
  segs: TlSeg[]
  ticks: TlTick[]
  chips: TlChip[]
  calcs: TlCalc[]
  band: { at: number; text: ReactNode }
  insight: { at: number; lines: ReactNode[] }
  total: number
}) {
  const beat = useBeats(total)
  const tween = useTween(520)
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="relative" style={{ width: TL_W, height: 196 }}>
          {segs.map((s, i) => {
            const c = s.tone === 'a' ? colors.brandDark : colors.accentDark
            return (
              <span
                key={i}
                className="absolute grid place-items-center rounded-lg text-[17px] font-bold"
                style={{ left: s.from, width: s.to - s.from, top: 0, height: 34, color: c, background: s.tone === 'a' ? colors.surface2 : `${colors.warning}1F`, boxShadow: `inset 0 0 0 2px ${c}` }}
              >
                {s.label}
              </span>
            )
          })}
          {/* the axis, and a tick at every named moment */}
          <span className="absolute h-[2px]" style={{ left: ticks[0].x - 20, width: ticks[ticks.length - 1].x - ticks[0].x + 40, top: 46, background: colors.ink }} />
          {ticks.map((t) => (
            <Fragment key={t.label}>
              <span className="absolute w-[2px]" style={{ left: t.x - 1, top: 40, height: 14, background: colors.ink }} />
              <span className="absolute -translate-x-1/2 whitespace-nowrap text-[16px]" style={{ left: t.x, top: 56, color: colors.body }}>{t.label}</span>
            </Fragment>
          ))}
          {chips.map((c) => {
            const on = beat >= c.at
            const ring = c.ringAt !== undefined && beat >= c.ringAt
            return (
              <span key={c.value} className="absolute -translate-x-1/2" style={{ left: c.x, top: 82, opacity: on ? 1 : 0, transition: tween }}>
                <Val tone={c.tone} height={36} size={18} style={{ boxShadow: ring ? `0 0 0 3px ${colors.white}, 0 0 0 6px ${colors.warning}` : undefined }}>
                  {c.value}
                </Val>
              </span>
            )
          })}
          {calcs.map((c, i) => (
            <span key={i} className="absolute -translate-x-1/2 whitespace-nowrap text-center text-[17px] font-bold leading-snug" style={{ left: c.x, top: 128 }}>
              {c.lines.map((l, k) => (
                <span key={k} className="block" style={{ color: l.tone === 'a' ? colors.brandDark : colors.accentDark, opacity: beat >= l.at ? 1 : 0, transition: tween }}>
                  {l.text}
                </span>
              ))}
            </span>
          ))}
        </div>
        <Band on={beat >= band.at} size={18} className="w-[1040px]">{band.text}</Band>
        <Insight on={beat >= insight.at} className="w-[1120px]" size={16} lines={insight.lines} />
      </div>
      <StepControls at={beat} total={total} nextLabel="Reveal next" />
    </>
  )
}

/* =========================================================== two methods */

/**
 * TWO CARDS SIDE BY SIDE (slides 22 and 23): two methods for one answer, or
 * two steps where the first hands its result to the second, along an arrow
 * labelled with what it hands over.
 */
export interface TwoLine { text: ReactNode; at: number; tone?: 'a' | 'p' }

export function TwoMethods({
  left,
  right,
  arrow,
  band,
  insight,
  total = 6,
}: {
  left: { title: string; lines: TwoLine[] }
  right: { title: string; lines: TwoLine[] }
  arrow?: { label: string; at: number }
  band?: { at: number; text: ReactNode }
  insight: { at: number; lines: ReactNode[] }
  total?: number
}) {
  const beat = useBeats(total)
  const tween = useTween(520)
  const card = (side: typeof left, tone: 'a' | 'p') => (
    <StepCard title={side.title} tone={tone} width={500} minHeight={140}>
      {side.lines.map((l, i) => (
        <Calc key={i} on={beat >= l.at} tone={l.tone} size={19}>
          {l.text}
        </Calc>
      ))}
    </StepCard>
  )
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-stretch">
          {card(left, 'a')}
          {arrow ? (
            <span className="flex" style={{ opacity: beat >= arrow.at ? 1 : 0, transition: tween }}>
              <GapArrow width={60} label={arrow.label} />
            </span>
          ) : (
            <span className="w-[20px] shrink-0" />
          )}
          {card(right, 'p')}
        </div>
        {band && (
          <Band on={beat >= band.at} size={18} className={arrow ? 'w-[1060px]' : 'w-[1020px]'}>
            {band.text}
          </Band>
        )}
        <Insight on={beat >= insight.at} className={arrow ? 'w-[1060px]' : 'w-[1020px]'} size={17} lines={insight.lines} />
      </div>
      <StepControls at={beat} total={total} nextLabel="Reveal next" />
    </>
  )
}

/* ========================================================== installments */

/**
 * PAYING BACK A LOAN IN EQUAL INSTALLMENTS. The loan year by year as a table,
 * with the unknown installment as x, empty slots filling a few at a time;
 * then the one equation the last row gives, solved left to right, and the
 * check.
 */
const IN_COLS = '104px 170px 250px 120px 220px'
const IN_HEAD = ['Year', 'Owed at the start', 'Owed at the end (+10%)', 'Paid', 'Left after paying']

export function Installments() {
  const beat = useBeats(6)
  const rows: { year: string; cells: { v: string; tone: 'p' | 'i' | 'a' | 'soft'; at: number }[] }[] = [
    {
      year: 'Year 1',
      cells: [
        { v: '₹2,100', tone: 'p', at: 2 },
        { v: '2,100 × 1.1 = ₹2,310', tone: 'i', at: 2 },
        { v: 'x', tone: 'soft', at: 3 },
        { v: '2,310 − x', tone: 'soft', at: 3 },
      ],
    },
    {
      year: 'Year 2',
      cells: [
        { v: '2,310 − x', tone: 'p', at: 4 },
        { v: '1.1 × (2,310 − x)', tone: 'i', at: 4 },
        { v: 'x', tone: 'soft', at: 4 },
        { v: '0, all paid', tone: 'soft', at: 4 },
      ],
    },
  ]
  const widths = [170, 250, 120, 220]
  return (
    <>
      <div className="flex flex-col gap-2.5" style={{ width: 960 }}>
        <div className="grid items-center gap-x-3 rounded-xl px-4 py-2 text-[16px] font-bold text-white" style={{ gridTemplateColumns: IN_COLS, background: colors.brandDark }}>
          {IN_HEAD.map((h) => (
            <span key={h} className="whitespace-nowrap">{h}</span>
          ))}
        </div>
        {rows.map((r) => (
          <div key={r.year} className="grid items-center gap-x-3 rounded-xl bg-white px-4 py-2 ring-1 ring-line" style={{ gridTemplateColumns: IN_COLS }}>
            <b className="text-[18px]" style={{ color: colors.ink }}>{r.year}</b>
            {r.cells.map((c, i) => (
              <Val key={i} on={beat >= c.at} tone="soft" width={widths[i]} height={38} size={17} style={c.tone === 'p' ? { color: colors.success } : c.tone === 'i' ? { color: colors.accentDark } : undefined}>
                {c.v}
              </Val>
            ))}
          </div>
        ))}
        <Fade on={beat >= 5}>
          <p className="text-[19px] font-bold" style={{ color: colors.ink }}>
            1.1 × (2,310 − x) = x  →  2,541 − 1.1x = x  →  2.1x = 2,541  →  x = 1,210
          </p>
        </Fade>
        <Band on={beat >= 6} size={18}>
          Each installment = ₹1,210  ·  check: 2,310 − 1,210 = 1,100, and 1,100 × 1.1 = 1,210
        </Band>
        <Insight on={beat >= 6} size={17} lines={['Each installment pays that year’s interest and part of the loan']} />
      </div>
      <StepControls at={beat} total={6} nextLabel="Reveal next" />
    </>
  )
}
