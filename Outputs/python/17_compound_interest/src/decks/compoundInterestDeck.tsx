import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, QuizTimeSlide, ThankYouSlide, WelcomeSlide } from '@/slides'
import { AgendaSlide } from './figures/Agenda'
import { Lines, Panel } from './figures/common'
import { RecapBrand } from './figures/RecapBrand'
import { RecapBug, SavingsHook } from './figures/Hook'
import { BasicTerms, FormulaBuild, Frequency, GrowthGraph, SplitRate, YearTable } from './figures/Concepts'
import { PascalRace, PrincipalOrAmount, Takeaways } from './figures/Activities'
import { FORMULA, Installments, Timeline, TwoMethods, WorkedSteps } from './figures/Worked'
import { B } from './figures/ci'
import { FeedbackEmbedSlide } from './figures/FeedbackForm'
import { installGestures } from './figures/gestures'

/**
 * PYTHON COURSE · "Compound Interest" (Programming Foundations aptitude, session 17)
 *
 * Built from `Outputs/python/session_plans/17_compound_interest/plan.md`. The
 * short form:
 *
 * ONE SLIDE PER REFERENCE CARD. The source is the pedagogy team's presenter
 * deck, `Reference ppt's/17_compound_interest_student_view_new_design 4.html`:
 * 27 cards and 118 press states. All 27 are here, in its order. Nothing added,
 * nothing dropped.
 *
 * THE COPY IS THE REFERENCE'S, captured from the rendered page at every press,
 * with content rule 36 on every line (no trailing full stop, one sentence per
 * line). The places a hard rule changed the source are listed in the plan,
 * under "Flagged".
 *
 * EVERY NUMBER IS A REAL CALCULATION (course rule R3); the plan's table lists
 * them. ONLY TEMPLATE COLOURS (content rule 37): principal `success`, interest
 * `warning`, amount `brandDark`.
 *
 * EVERY PRESS IS A BUILD STEP, with session 18's `Next` / `Replay` carrying the
 * reference's own button words (`Reveal next`, `Show me`, `Reveal answer`).
 * Votes are clickable and never gate the press; timers are the kit's
 * `Countdown`, started by the instructor. Nothing self-advances.
 *
 * NAVIGATION (user, 2026-10-05, every deck): keyboard, two-finger trackpad
 * swipe and touch swipe, from session 17's `figures/gestures.ts`.
 */

installGestures()

export const compoundInterestMeta: DeckMeta = {
  title: 'Compound Interest',
  course: 'Python',
  lesson: 'Compound Interest',
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

const SESSION = 'Compound Interest'

/** The five agenda points, word for word from the reference. */
const AGENDA = [
  { title: 'Understanding how compound interest works' },
  { title: 'Deriving the compound interest formula' },
  { title: 'Calculating the amount and the interest' },
  { title: 'Finding the principal, rate or time' },
  { title: 'Solving placement question models' },
]

const S = AGENDA.map((a) => a.title)

export const compoundInterestDeck: SlideDef[] = [
  /* ── 1 ───────────────────────────────────────────────────────────── */
  { id: 'welcome', label: 'Welcome', transition: 'fade', element: <BrandSlide greeting="Welcome" lesson={SESSION} /> },

  /* ── 2, 3 · Recap ────────────────────────────────────────────────── */
  {
    id: 'recap',
    section: 'Recap',
    label: 'Where We Left Off',
    notes: 'Three presses, one point each, as the reference reveals them.',
    element: (
      <RecapBrand
        lesson={SESSION}
        title="Where We Left Off"
        points={[
          { text: 'Simple interest = P × R × T ÷ 100', sub: 'It is always calculated on the original principal' },
          { text: 'Time must be in years', sub: '9 months is 9/12, or 0.75, of a year' },
          { text: 'Amount and interest are different', sub: 'Amount = principal + interest' },
        ]}
      />
    ),
  },
  {
    id: 'recap-bug',
    section: 'Recap',
    label: 'Recap of simple interest',
    notes: 'The room writes the line number first. Then Show me three times: the student’s answer, the wrong line and why, the correct answer.',
    element: (
      <Panel kicker="Recap" title="Recap of simple interest" lesson={SESSION}>
        <RecapBug />
      </Panel>
    ),
  },

  /* ── 4 · Hook ────────────────────────────────────────────────────── */
  {
    id: 'hook',
    section: 'Hook',
    label: 'Two friends, the same money, the same rate',
    notes: 'Five presses. Take the room’s answer to the question before press 2. Press 5 is the question to the room: why does Meera earn more each year?',
    element: (
      <Panel kicker="Think before you learn" title="Two friends, the same money, the same rate" lesson={SESSION}>
        <SavingsHook />
      </Panel>
    ),
  },

  /* ── 5, 6 · Today ────────────────────────────────────────────────── */
  { id: 'todays-session', section: 'Today', label: SESSION, transition: 'zoom', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  { id: 'agenda', section: 'Today', label: 'Agenda', element: <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA} /> },

  /* ── 7 to 10 · How compound interest works ───────────────────────── */
  {
    id: 'how-it-works',
    section: S[0],
    label: 'The interest is added to the principal every year',
    notes: 'One year a press. Point at the arrow each time: this year’s amount is next year’s principal.',
    element: (
      <Panel kicker="How compound interest works" title="The interest is added to the principal every year" centered lesson={SESSION}>
        <YearTable />
      </Panel>
    ),
  },
  {
    id: 'basic-terms',
    section: S[0],
    label: 'Principal, rate, time, compound interest and amount',
    notes: 'Six presses: R, T, the CI bracket, the A bracket, then the three cards.',
    element: (
      <Panel kicker="Basic terms" title="Principal, rate, time, interest and amount" centered lesson={SESSION}>
        <BasicTerms />
      </Panel>
    ),
  },
  {
    id: 'principal-interest-amount',
    section: S[0],
    label: 'Principal, interest or amount?',
    notes: 'Worksheet task 1. Two presses per question: hands up for A, B or C, then Reveal answer. The 0:20 timer starts when you press play.',
    element: (
      <Panel kicker="Four questions · hands up, then the answer" title="Principal, interest or amount?" lesson={SESSION}>
        <PrincipalOrAmount />
      </Panel>
    ),
  },
  {
    id: 'interest-and-time',
    section: S[0],
    label: 'Compound interest grows faster every year',
    notes: 'Worksheet task 2. Press 5 is the prediction: take year 4 from the room before press 6.',
    element: (
      <Panel kicker="Interest and time" title="Compound interest grows faster every year" centered lesson={SESSION}>
        <GrowthGraph />
      </Panel>
    ),
  },

  /* ── 11 · Deriving the formula ───────────────────────────────────── */
  {
    id: 'formula',
    section: S[1],
    label: 'Building the formula',
    element: (
      <Panel kicker="Deriving the formula" title={<>Building the formula {FORMULA}</>} centered lesson={SESSION}>
        <FormulaBuild />
      </Panel>
    ),
  },

  /* ── 12 to 15 · Calculating the amount and the interest ──────────── */
  {
    id: 'direct-questions',
    section: S[2],
    label: 'Calculating compound interest and the amount',
    element: (
      <Panel
        kicker="Direct questions"
        title="Calculating compound interest and the amount"
        lead={<>Find the compound interest and the amount on <B>₹5,000</B> at <B>8% per annum</B> for <B>2 years</B>, compounded annually</>}
        lesson={SESSION}
      >
        <WorkedSteps
          given={['P = ₹5,000', 'R = 8% per annum', 'T = 2 years']}
          formula={[FORMULA, 'CI = A − P']}
          subst={['A = 5,000 × 1.08²', '= 5,000 × 1.1664', 'CI = 5,832 − 5,000']}
          answer={['A = ₹5,832', 'CI = ₹832']}
          note={['“Find the compound interest” → ₹832', '“Find the amount” → ₹5,832', 'Do not use P × R × T ÷ 100 here', 'That gives ₹800, the simple interest']}
        />
      </Panel>
    ),
  },
  {
    id: 'the-race',
    section: S[2],
    label: 'Pascal’s triangle · the race',
    notes: 'Worksheet task 3. Split the room: left half multiplier, right half Pascal. Start the timer, take hands, then Reveal answer.',
    element: (
      <Panel kicker="The race" title="Multiplier method vs. Pascal’s triangle method" lesson={SESSION}>
        <PascalRace />
      </Panel>
    ),
  },
  {
    id: 'more-than-once',
    section: S[2],
    label: 'Half-yearly and quarterly compounding',
    element: (
      <Panel kicker="Compounding more than once a year" title="Half-yearly and quarterly compounding" centered lesson={SESSION}>
        <Frequency />
      </Panel>
    ),
  },
  {
    id: 'split-the-rate',
    section: S[2],
    label: 'Half-yearly and quarterly compounding · task 4',
    notes: 'Worksheet task 4. One minute on the timer for the room’s turn, before the last press.',
    element: (
      <Panel kicker="More than once a year" title="Half-yearly and quarterly compounding" lesson={SESSION}>
        <SplitRate />
      </Panel>
    ),
  },

  /* ── 16 to 18 · Finding the principal, rate or time ──────────────── */
  {
    id: 'find-principal',
    section: S[3],
    label: 'Rearrange the formula to find P',
    element: (
      <Panel
        kicker="Finding the principal"
        drop={28}
        title="Rearrange the formula to find P"
        lead={<>What sum of money amounts to (becomes) <B>₹4,840</B> in <B>2 years</B> at <B>10% per annum</B>, compounded annually?</>}
        lesson={SESSION}
      >
        <WorkedSteps
          given={['A = ₹4,840', 'R = 10% per annum', 'T = 2 years', 'P = ?']}
          formula={[FORMULA, <>P = A ÷ (1 + R/100)<sup>T</sup></>]}
          subst={['P = 4,840 ÷ 1.1²', '= 4,840 ÷ 1.21']}
          answer={['P = ₹4,000']}
          note={['If the compound interest (₹840) is given and not the amount: CI = A − P = 1.21 × P − P', 'So 0.21 × P = 840, and P = 840 ÷ 0.21 = ₹4,000']}
        />
      </Panel>
    ),
  },
  {
    id: 'find-rate',
    section: S[3],
    label: 'Rearrange the formula to find R',
    element: (
      <Panel
        kicker="Finding the rate"
        drop={28}
        title="Rearrange the formula to find R"
        lead={<Lines lines={[<><B>₹6,250</B> amounts to (becomes) <B>₹7,290</B> in <B>2 years</B>, compounded annually</>, 'Find the rate of interest per annum']} />}
        lesson={SESSION}
      >
        <WorkedSteps
          given={['P = ₹6,250', 'A = ₹7,290', 'T = 2 years', 'R = ?']}
          formula={[FORMULA, '(1 + R/100)² = A ÷ P']}
          subst={['7,290 ÷ 6,250 = 1.1664', '= 1.08 × 1.08', '1 + R/100 = 1.08']}
          answer={['R = 8% per annum']}
          note={['Quick check: 1.1664 is in the multiplier table on your worksheet, in the 8% row for 2 years', 'If the amount after 1 year is given, that amount ÷ the principal is the multiplier for every year']}
        />
      </Panel>
    ),
  },
  {
    id: 'find-time',
    section: S[3],
    label: 'Find T from the multiplier',
    element: (
      <Panel
        kicker="Finding the time"
        drop={28}
        title="Find T from the multiplier"
        lead={<>In how many years will <B>₹5,000</B> amount to <B>₹6,655</B> at <B>10% per annum</B>, compounded annually?</>}
        lesson={SESSION}
      >
        <WorkedSteps
          given={['P = ₹5,000', 'A = ₹6,655', 'R = 10% per annum', 'T = ?']}
          formula={[FORMULA, <>1.1<sup>T</sup> = A ÷ P</>]}
          subst={['6,655 ÷ 5,000 = 1.331', '= 1.1 × 1.1 × 1.1']}
          answer={['T = 3 years']}
          note={['Another way: multiply by 1.1 one year at a time until you reach the amount', '5,000 → 5,500 → 6,050 → 6,655', 'That is 3 years']}
        />
      </Panel>
    ),
  },

  /* ── 19 · Quiz ───────────────────────────────────────────────────── */
  /* The Simple Interest deck's quiz slide (Outputs/python/16_simple_interest,
     slide 16), carried as it is on the user's word (2026-10-07). It overrides
     content rule 28 (the frame carries `lesson` only) for this deck. */
  {
    id: 'classroom-quiz',
    section: 'Quiz',
    label: 'Classroom Quiz',
    transition: 'zoom',
    notes: 'The quiz runs on the portal. No question on the slide.',
    element: (
      <QuizTimeSlide
        lesson={SESSION}
        kicker="Quiz time"
        title="Classroom Quiz"
        subtitle="Time to check what you have learned so far"
        steps={['Open the quiz on your portal', 'Work it out on paper, on your own', 'We go through the answers together']}
      />
    ),
  },

  /* ── 20 to 24 · Placement question models ────────────────────────── */
  {
    id: 'changing-rates',
    section: S[4],
    label: 'A different rate for each year',
    element: (
      <Panel
        kicker="Placement model · changing rates"
        title="A different rate for each year"
        lead={<Lines lines={[<>Find the amount on <B>₹10,000</B> after <B>2 years</B> if the rate of compound interest is <B>10%</B> for the first year and <B>20%</B> for the second year</>, 'Also find the compound interest']} />}
        lesson={SESSION}
      >
        <Timeline
          total={6}
          segs={[
            { from: 90, to: 520, label: '10% in year 1', tone: 'a' },
            { from: 520, to: 950, label: '20% in year 2', tone: 'i' },
          ]}
          ticks={[
            { x: 90, label: 'start' },
            { x: 520, label: 'end of year 1' },
            { x: 950, label: 'end of year 2' },
          ]}
          chips={[
            { x: 90, value: '₹10,000', tone: 'p', at: 1 },
            { x: 520, value: '₹11,000', tone: 'a', at: 2, ringAt: 3 },
            { x: 950, value: '₹13,200', tone: 'a', at: 4 },
          ]}
          calcs={[
            { x: 305, lines: [{ text: '10,000 × 1.10 = ₹11,000', at: 2, tone: 'a' }] },
            {
              x: 735,
              lines: [
                { text: '₹11,000 is the principal for year 2', at: 3, tone: 'i' },
                { text: '11,000 × 1.20 = ₹13,200', at: 4, tone: 'a' },
              ],
            },
          ]}
          band={{ at: 5, text: 'A = 10,000 × 1.10 × 1.20 = ₹13,200   ·   CI = 13,200 − 10,000 = ₹3,200' }}
          insight={{ at: 6, lines: ['In simple interest, year 2 would still use ₹10,000', 'In compound interest, year 2 uses ₹11,000, the amount at the start of that year'] }}
        />
      </Panel>
    ),
  },
  {
    id: 'years-and-months',
    section: S[4],
    label: 'When the time is not a whole number of years',
    element: (
      <Panel
        kicker="Placement model · years and months"
        title="When the time is not a whole number of years"
        lead={<>Find the compound interest on <B>₹10,000</B> at <B>10% per annum</B> for <B>2 years 6 months</B>, compounded annually</>}
        lesson={SESSION}
      >
        <Timeline
          total={5}
          segs={[
            { from: 90, to: 690, label: 'compound interest: × 1.1 each year', tone: 'a' },
            { from: 690, to: 840, label: '6 months', tone: 'i' },
          ]}
          ticks={[
            { x: 90, label: 'start' },
            { x: 390, label: '1 year' },
            { x: 690, label: '2 years' },
            { x: 840, label: '2 years 6 months' },
          ]}
          chips={[
            { x: 90, value: '₹10,000', tone: 'p', at: 1 },
            { x: 390, value: '₹11,000', tone: 'a', at: 2 },
            { x: 690, value: '₹12,100', tone: 'a', at: 2 },
          ]}
          calcs={[
            { x: 300, lines: [{ text: '10,000 × 1.1 × 1.1 = ₹12,100', at: 2, tone: 'a' }] },
            {
              x: 820,
              lines: [
                { text: 'Simple interest on ₹12,100 for 1/2 year:', at: 3, tone: 'i' },
                { text: '12,100 × 10 × 1/2 ÷ 100 = ₹605', at: 3, tone: 'i' },
              ],
            },
          ]}
          band={{ at: 4, text: 'Amount = 12,100 + 605 = ₹12,705   ·   CI = 12,705 − 10,000 = ₹2,705' }}
          insight={{
            at: 5,
            lines: [
              '“Compounded annually” or “reckoned yearly”: interest is added once a year, so the 6 months earn simple interest on ₹12,100',
              'If the question says “compounded half-yearly”, use 5% for 5 half years instead',
              'Read the question first',
            ],
          }}
        />
      </Panel>
    ),
  },
  {
    id: 'ci-and-si',
    section: S[4],
    label: 'The difference between compound and simple interest',
    element: (
      <Panel
        kicker="Placement model · CI and SI"
        drop={28}
        title="The difference between CI and SI"
        lead={<>Find the difference between the compound interest and the simple interest on <B>₹10,000</B> at <B>10% per annum</B> for <B>2 years</B></>}
        lesson={SESSION}
      >
        <TwoMethods
          left={{
            title: 'Standard method',
            lines: [
              { text: 'CI = 10,000 × 1.21 − 10,000 = ₹2,100', at: 2 },
              { text: 'SI = 10,000 × 10 × 2 ÷ 100 = ₹2,000', at: 3 },
              { text: 'Difference = 2,100 − 2,000 = ₹100', at: 4, tone: 'a' },
            ],
          }}
          right={{
            title: 'Shorter method (2 years only)',
            lines: [
              { text: 'Difference = P × (R/100)²', at: 5 },
              { text: '= 10,000 × (10/100)²', at: 5 },
              { text: '= 10,000 × 0.01 = ₹100', at: 5, tone: 'p' },
            ],
          }}
          insight={{
            at: 6,
            lines: [
              'Why it works: in year 2, compound interest also earns 10% on year 1’s interest of ₹1,000',
              '10% of ₹1,000 = ₹100',
              'Simple interest never earns interest on interest',
              'If the difference is given, work backwards: P = difference ÷ (R/100)²',
            ],
          }}
        />
      </Panel>
    ),
  },
  {
    id: 'sum-first',
    section: S[4],
    label: 'Find the sum from the CI, then use it',
    element: (
      <Panel
        kicker="Placement model · find the sum first"
        drop={28}
        title="Find the sum from the CI, then use it"
        lead={<Lines lines={[<>The compound interest on a sum for <B>2 years</B> at <B>5% per annum</B> is <B>₹410</B></>, <>Find the simple interest on the same sum for <B>3 years</B> at <B>4% per annum</B></>]} />}
        lesson={SESSION}
      >
        <TwoMethods
          left={{
            title: 'Step 1 · find the sum from the CI',
            lines: [
              { text: 'CI = P × 1.05² − P = 0.1025 × P', at: 2 },
              { text: '0.1025 × P = 410', at: 2 },
              { text: 'P = 410 ÷ 0.1025 = ₹4,000', at: 3, tone: 'a' },
            ],
          }}
          right={{
            title: 'Step 2 · the simple interest',
            lines: [
              { text: 'P = ₹4,000, R = 4%, T = 3 years', at: 4 },
              { text: 'SI = 4,000 × 4 × 3 ÷ 100', at: 4 },
              { text: '= ₹480', at: 5, tone: 'p' },
            ],
          }}
          arrow={{ label: 'P', at: 3 }}
          band={{ at: 5, text: 'The simple interest on the same sum for 3 years at 4% is ₹480' }}
          insight={{ at: 6, lines: ['Read which interest each sentence asks for: compound interest in the first, simple interest in the second'] }}
        />
      </Panel>
    ),
  },
  {
    id: 'installments',
    section: S[4],
    label: 'Paying back a loan in equal installments',
    element: (
      <Panel
        kicker="Placement model · installments"
        drop={28}
        title="Paying back a loan in equal installments"
        lead={<Lines lines={[<>A loan of <B>₹2,100</B> is taken at <B>10%</B> compound interest per annum</>, <>It is paid back in <B>2 equal yearly installments</B></>, 'Find the value of each installment']} />}
        lesson={SESSION}
      >
        <Installments />
      </Panel>
    ),
  },

  /* ── 25 · Key takeaways ──────────────────────────────────────────── */
  {
    id: 'takeaways',
    section: 'Key takeaways',
    label: 'Six key takeaways: compound interest',
    element: (
      <Panel kicker="Key takeaways" title="Six key takeaways: compound interest" lesson={SESSION}>
        <Takeaways />
      </Panel>
    ),
  },

  /* ── 26 · Feedback (content rule 41) ─────────────────────────────── */
  {
    id: 'feedback',
    section: 'Close',
    label: 'Feedback',
    notes: 'The Google Form itself, in a frame beside the QR code; it scrolls inside the frame. Needs the network. The QR and the link open the same form.',
    element: <FeedbackEmbedSlide lesson={SESSION} />,
  },

  /* ── 27 · Thank you ──────────────────────────────────────────────── */
  { id: 'thank-you', section: 'Close', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" /> },
]
