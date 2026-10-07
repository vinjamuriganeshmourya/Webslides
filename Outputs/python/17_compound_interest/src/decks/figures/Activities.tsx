import { useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { Countdown, useBeats } from '@/ui'
import { StepControls } from './controls'
import { BeatFade, Lines } from './common'
import { Confetti } from './motion'
import { Option } from './pieces'
import { B, Band, Eyebrow, Fade, Insight, Worksheet } from './ci'

/* ============================================== principal, interest, amount */

/**
 * PRINCIPAL, INTEREST OR AMOUNT? Worksheet task 1: four questions, hands up,
 * then the answer. Each question is two presses: the question with the vote
 * and its 0:20 timer, then the answer. The reference's `Reveal answer` click
 * is a build step here (plan decision 3), so one forward key walks it all.
 * The options are clickable so the room's pick is locked in; the press never
 * waits for one, and the confetti fires only when the pick was right.
 */
const KINDS = ['Principal', 'Interest', 'Amount'] as const
const QUESTIONS: { q: ReactNode; ask: string[]; right: number; answer: string[] }[] = [
  {
    q: <>A sum of ₹5,000 becomes <B>₹6,050</B> in 2 years at 10% compound interest</>,
    ask: ['What is ₹6,050?', 'Type one word in row 1 of task 1'],
    right: 2,
    answer: ['It is the principal plus the compound interest', 'The interest is 6,050 − 5,000 = ₹1,050'],
  },
  {
    q: <>The compound interest on ₹8,000 for 2 years at 5% p.a. is <B>₹820</B></>,
    ask: ['What is ₹820?', 'Type one word in row 2 of task 1'],
    right: 1,
    answer: ['It is the money earned: 8,000 × 1.05 × 1.05 = 8,820, and 8,820 − 8,000 = ₹820'],
  },
  {
    q: <>Find the <B>sum</B> that amounts to ₹4,840 in 2 years at 10% compound interest</>,
    ask: ['What does “the sum” mean here?', 'Type one word in row 3 of task 1'],
    right: 0,
    answer: ['“The sum” means the money put in or borrowed', 'Here it is 4,840 ÷ 1.21 = ₹4,000'],
  },
  {
    q: <>Ravi pays back <B>₹7,260</B> for a loan of ₹6,000 that he took 2 years ago at 10% compound interest</>,
    ask: ['What is ₹7,260?', 'Type one word in row 4 of task 1'],
    right: 2,
    answer: ['The money paid back is the principal plus the interest: 6,000 × 1.21 = ₹7,260', 'The interest is ₹1,260'],
  },
]

function AmountBar() {
  return (
    <div className="w-[500px]">
      <p className="text-center text-[17px] font-bold" style={{ color: colors.ink }}>amount = principal + interest</p>
      <div className="mt-1" style={{ height: 10, borderLeft: `2px solid ${colors.accentDark}`, borderRight: `2px solid ${colors.accentDark}`, borderTop: `2px solid ${colors.accentDark}`, borderRadius: '4px 4px 0 0' }} />
      <div className="mt-1.5 flex gap-1.5">
        <span className="grid h-[48px] w-[270px] place-items-center rounded-xl text-[19px] font-bold" style={{ background: `${colors.success}14`, color: colors.success, boxShadow: `inset 0 0 0 2px ${colors.success}` }}>principal</span>
        <span className="grid h-[48px] flex-1 place-items-center rounded-xl text-[19px] font-bold" style={{ background: colors.warning, color: colors.ink }}>interest</span>
      </div>
      <div className="mt-1.5 flex gap-1.5 text-[16px]" style={{ color: colors.body }}>
        <span className="w-[270px] text-center">the money put in or borrowed</span>
        <span className="flex-1 text-center">the money earned or paid</span>
      </div>
    </div>
  )
}

function PiaQuestion({ k, shown }: { k: number; shown: boolean }) {
  const q = QUESTIONS[k]
  const [pick, setPick] = useState(-1)
  return (
    <div className="flex items-start gap-8">
      <div className="flex w-[520px] shrink-0 flex-col gap-3">
        <p className="text-[24px] font-semibold leading-snug" style={{ color: colors.ink }}>{q.q}</p>
        <p className="text-[18px] leading-snug" style={{ color: colors.body }}>
          <Lines lines={q.ask} />
        </p>
        <div className="mt-3">
          <AmountBar />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <Eyebrow>Vote</Eyebrow>
        {KINDS.map((name, i) => (
          <Option key={name} letter={'ABC'[i]} picked={pick === i} right={i === q.right} shown={shown} onPick={() => setPick(i)} mono={false} size={20}>
            {name}
          </Option>
        ))}
        <div className="relative" style={{ minHeight: 84 }}>
          {/* unmounted, not faded: a hidden button with no pointer events lets a swipe that starts on it change slide */}
          {!shown && (
            <div className="absolute left-0 top-1">
              <Countdown seconds={20} />
            </div>
          )}
          <Fade on={shown} className="absolute inset-x-0 top-0">
            <p className="text-[17px] leading-snug" style={{ color: colors.ink }}>
              <b className="text-[19px]" style={{ color: colors.success }}>{KINDS[q.right]}</b>
              <Lines lines={q.answer} />
            </p>
          </Fade>
        </div>
      </div>
      {shown && pick === q.right && <Confetti seed={11 + k} />}
    </div>
  )
}

export function PrincipalOrAmount() {
  const beat = useBeats(8)
  const k = Math.floor((beat - 1) / 2)
  const shown = beat % 2 === 0
  return (
    <>
      <div className="flex flex-col gap-3">
        <Worksheet task={1} />
        <BeatFade beatKey={k}>
          <PiaQuestion key={k} k={k} shown={shown} />
        </BeatFade>
      </div>
      <StepControls at={beat} total={8} nextLabel={shown ? 'Next' : 'Reveal answer'} />
    </>
  )
}

/* ================================================================= race */

/**
 * MULTIPLIER METHOD VS. PASCAL'S TRIANGLE METHOD. Worksheet task 3, the race.
 * Eight presses through the reference's six stages: the rule, the worked
 * example, round 1 (the question, the vote, the answer), round 2 (the same).
 * Each answer stage's `Reveal answer` is its own press (plan decision 3).
 */
const TRIANGLE = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]]

function PascalRule() {
  return (
    <div className="flex flex-col gap-3">
      <Eyebrow>How to use Pascal’s triangle</Eyebrow>
      <div className="flex items-start gap-10">
        <div className="flex w-[300px] shrink-0 flex-col items-start gap-2">
          {TRIANGLE.map((row, r) => (
            <div key={r} className="flex gap-6" style={{ paddingLeft: (3 - r) * 22 }}>
              {row.map((n, i) => (
                <span key={i} className="grid h-[34px] w-[20px] place-items-center font-mono text-[22px] font-bold" style={{ color: r >= 2 ? colors.brandDark : colors.muted }}>
                  {n}
                </span>
              ))}
            </div>
          ))}
          <p className="text-[16px]" style={{ color: colors.body }}>row 2 is for 2 years, row 3 is for 3 years</p>
        </div>
        <ol className="flex flex-col gap-4 pt-1">
          {[['Write down the principal'], ['Next to it, write R% of the principal', 'Then write R% of that value, and continue'], ['Multiply each value by the matching number in the row, then add the results']].map((lines, i) => (
            <li key={i} className="flex items-start gap-3.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[16px] font-bold text-white" style={{ background: colors.brandDark }}>{i + 1}</span>
              <span className="pt-0.5 text-[20px] leading-snug" style={{ color: colors.ink }}>
                <Lines lines={lines} />
              </span>
            </li>
          ))}
        </ol>
      </div>
      <p className="text-[18px]" style={{ color: colors.body }}>This gives the same amount as the multiplier method, without multiplying decimals</p>
    </div>
  )
}

function PascalExample() {
  const cols = [
    { n: 1, v: '1,000', note: 'the principal' },
    { n: 2, v: '100', note: '10% of 1,000' },
    { n: 1, v: '10', note: '10% of 100' },
  ]
  return (
    <div className="flex flex-col gap-3">
      <Eyebrow>Example: Meera’s ₹1,000</Eyebrow>
      <p className="font-heading text-[21px] font-semibold" style={{ color: colors.brandDark }}>₹1,000 at 10% for 2 years, so the row is 1 2 1</p>
      <div className="flex items-end gap-4">
        {cols.map((c, i) => (
          <div key={i} className="flex w-[130px] flex-col items-center gap-1.5">
            <span className="grid h-9 w-9 place-items-center rounded-full text-[17px] font-bold text-white" style={{ background: colors.brandDark }}>{c.n}</span>
            <span className="grid h-[46px] w-full place-items-center rounded-xl font-mono text-[22px] font-bold" style={{ background: colors.surface2, color: colors.brandDark }}>{c.v}</span>
            <span className="text-[16px]" style={{ color: colors.body }}>{c.note}</span>
          </div>
        ))}
        <span className="pb-9 text-[24px] font-bold" style={{ color: colors.muted }}>→</span>
        <div className="flex flex-col items-start gap-1.5">
          <span className="grid h-[46px] place-items-center rounded-xl px-4 text-[21px] font-bold text-white" style={{ background: colors.success }}>1,000 + 200 + 10 = ₹1,210</span>
          <span className="text-[16px]" style={{ color: colors.body }}>the same as 1,000 × 1.21 = ₹1,210</span>
        </div>
      </div>
      <Insight className="w-[900px]" size={17} lines={['Each value is 10% of the value before it', '2 years needs 3 values, and 3 years needs 4 values']} />
      <p className="text-[18px]" style={{ color: colors.body }}>
        <Lines lines={['For 2 years, use the row 1 2 1', 'Both methods give ₹1,210']} />
      </p>
    </div>
  )
}

function RaceRound({ round, q, mult, row, secs }: { round: string; q: ReactNode; mult: string; row: string; secs: number }) {
  return (
    <div className="flex flex-col gap-3">
      <Eyebrow>{round}</Eyebrow>
      <div className="flex items-center gap-4 rounded-xl bg-white px-5 py-3 ring-1 ring-line">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[22px] font-bold text-white" style={{ background: colors.brandDark }}>?</span>
        <p className="text-[23px] font-semibold" style={{ color: colors.ink }}>{q}</p>
      </div>
      <div className="flex gap-4">
        {[
          { tag: 'Left half of the room', name: 'Multiplier method', line: mult, tone: colors.danger },
          { tag: 'Right half of the room', name: 'Pascal’s triangle method', line: row, tone: colors.success },
        ].map((c) => (
          <div key={c.tag} className="flex w-[480px] flex-col gap-1 rounded-xl px-5 py-3" style={{ background: `${c.tone}0F`, boxShadow: `inset 0 0 0 2px ${c.tone}80` }}>
            <span className="text-[16px] font-bold uppercase tracking-wider" style={{ color: c.tone }}>{c.tag}</span>
            <span className="font-heading text-[22px] font-semibold" style={{ color: colors.ink }}>{c.name}</span>
            <span className="text-[19px] font-semibold" style={{ color: colors.body }}>{c.line}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-8">
        <p className="text-[18px]" style={{ color: colors.body }}>
          <Lines lines={[`Type your answer in task 3, ${round.split(' ·')[0]}`, 'Raise your hand when you have the answer']} />
        </p>
        <Countdown seconds={secs} />
      </div>
    </div>
  )
}

function RaceAnswer({ q, options, right, answer, shown, seed }: { q: string; options: string[]; right: number; answer: string[]; shown: boolean; seed: number }) {
  const [pick, setPick] = useState(-1)
  return (
    <div className="flex items-start gap-8">
      <div className="flex w-[520px] shrink-0 flex-col gap-2.5">
        <p className="text-[21px] font-semibold leading-snug" style={{ color: colors.ink }}>{q}</p>
        {options.map((o, i) => (
          <Option key={o} letter={'ABCD'[i]} picked={pick === i} right={i === right} shown={shown} onPick={() => setPick(i)} mono={false} size={20}>
            {o}
          </Option>
        ))}
      </div>
      <div className="flex min-h-[240px] min-w-0 flex-1 flex-col rounded-xl px-5 py-4" style={{ boxShadow: `inset 0 0 0 2px ${shown ? colors.success : colors.line}` }}>
        {shown ? (
          <BeatFade beatKey="ans">
            <p className="font-heading text-[26px] font-bold" style={{ color: colors.success }}>{answer[0]}</p>
            <p className="mt-1 text-[18px] leading-snug" style={{ color: colors.ink }}>
              <Lines lines={answer.slice(1)} />
            </p>
          </BeatFade>
        ) : (
          <p className="text-[17px]" style={{ color: colors.muted }}>The answer lands here</p>
        )}
      </div>
      {shown && pick === right && <Confetti seed={seed} />}
    </div>
  )
}

export function PascalRace() {
  const beat = useBeats(8)
  const stage = [0, 1, 2, 3, 3, 4, 5, 5][beat - 1]
  const shown = beat === 5 || beat === 8
  return (
    <>
      <div className="flex flex-col gap-3">
        <Worksheet task={3} />
        <BeatFade beatKey={stage}>
          {stage === 0 && <PascalRule />}
          {stage === 1 && <PascalExample />}
          {stage === 2 && <RaceRound round="Round 1 · the room splits into two halves" q={<>What does <B>₹1,000</B> amount to in <B>3 years</B> at <B>10%</B> compound interest?</>} mult="Multiply by 1.1 once for each year" row="Use the row 1 3 3 1 and add" secs={120} />}
          {stage === 3 && (
            <RaceAnswer
              q="What is the amount on ₹1,000 after 3 years at 10% compound interest?"
              options={['₹1,300', '₹1,331', '₹1,310', '₹1,210']}
              right={1}
              shown={shown}
              seed={31}
              answer={['B · ₹1,331', '1,000 + 3(100) + 3(10) + 1 = 1,331', '₹1,300 is the simple interest amount, ₹1,310 uses the row 1 3 1, not 1 3 3 1, and ₹1,210 is the amount for only 2 years']}
            />
          )}
          {stage === 4 && <RaceRound round="Round 2 · the same halves, harder numbers" q={<>What does <B>₹8,000</B> amount to in <B>3 years</B> at <B>5%</B> compound interest?</>} mult="Multiply by 1.05 once for each year" row="Use the row 1 3 3 1 again" secs={90} />}
          {stage === 5 && (
            <RaceAnswer
              q="What is the amount on ₹8,000 after 3 years at 5% compound interest?"
              options={['₹9,200', '₹9,261', '₹9,260', '₹8,820']}
              right={1}
              shown={shown}
              seed={47}
              answer={['B · ₹9,261', '8,000 + 1,200 + 60 + 1 = 9,261', '₹9,200 is the simple interest amount, ₹9,260 leaves out the last value, 1, and ₹8,820 is the amount for only 2 years']}
            />
          )}
        </BeatFade>
      </div>
      <StepControls at={beat} total={8} nextLabel={beat === 4 || beat === 7 ? 'Reveal answer' : 'Next'} />
    </>
  )
}

/* ============================================================ takeaways */

/**
 * SIX KEY TAKEAWAYS. The rule every one rests on, in the band, then one
 * takeaway a press, each with its worked line under it. The first three are
 * the formula and its two uses, the last three the placement models, toned
 * brand and amber as the reference groups them.
 */
const TAKEAWAYS: { lines: ReactNode[]; ex: ReactNode }[] = [
  { lines: [<>A = P × (1 + R/100)<sup>T</sup> and CI = A − P</>], ex: '₹5,000 at 8% for 2 years: A = 5,000 × 1.08 × 1.08 = ₹5,832, so CI = ₹832' },
  { lines: ['For half-yearly compounding, use half the rate, and the periods are 2 × the number of years'], ex: 'For quarterly compounding, use a quarter of the rate, and the periods are 4 × the number of years' },
  { lines: [<>To find P, divide the amount by (1 + R/100)<sup>T</sup></>, 'To find R or T, divide the amount by P'], ex: '7,290 ÷ 6,250 = 1.1664 = 1.08 × 1.08, so R = 8% per annum' },
  { lines: ['When the rate changes each year, use one multiplier for each year'], ex: '10% and then 20% gives A = P × 1.10 × 1.20' },
  { lines: ['For years and months, compounded annually, use compound interest for the full years'], ex: 'Then calculate simple interest on that amount for the remaining months' },
  { lines: ['For 2 years, the difference between CI and SI is P × (R/100)²'], ex: 'It is the interest earned in year 2 on the first year’s interest' },
]

export function Takeaways() {
  const beat = useBeats(7)
  return (
    <>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-4">
          <Worksheet task={5} />
          <Band size={18} className="flex-1">Each year’s interest is calculated on the amount at the start of that year</Band>
        </div>
        <div className="flex flex-col gap-[5px]">
          {TAKEAWAYS.map((t, i) => {
            const tone = i < 3 ? colors.brandDark : colors.accentDark
            return (
              <Fade key={i} on={beat >= i + 2}>
                <div className="flex items-center gap-3.5 rounded-xl px-4 py-1" style={{ background: i < 3 ? colors.surface : `${colors.warning}14`, boxShadow: `inset 0 0 0 2px ${i < 3 ? colors.line : `${colors.warning}99`}` }}>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[16px] font-bold text-white" style={{ background: tone }}>{i + 1}</span>
                  <span className="min-w-0 leading-[1.3]">
                    {t.lines.map((l, k) => (
                      <span key={k} className="block text-[16px] font-bold" style={{ color: colors.ink }}>{l}</span>
                    ))}
                    <span className="block text-[16px]" style={{ color: colors.body }}>{t.ex}</span>
                  </span>
                </div>
              </Fade>
            )
          })}
        </div>
      </div>
      <StepControls at={beat} total={7} nextLabel="Reveal next" />
    </>
  )
}
