import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, QuizTimeSlide, ThankYouSlide, WelcomeSlide } from '@/slides'
import { AgendaSlide } from './figures/Agenda'
import { Panel } from './figures/common'
import { RecapBrand } from './figures/RecapBrand'
import { BankHook, BuildFormula, FiveTerms, InterestTime, RecapDiscount, YearByYear } from './figures/Basics'
import { TimeInYears, WorkedQuestion } from './figures/Direct'
import { ChangingRates, Changes, Difference, DoublesTriples, PayingBack, Ratios, Splitting, Takeaways, TwoAmounts } from './figures/Models'
import { B, QLead } from './figures/si'
import { Lines } from './figures/common'
import { FeedbackEmbedSlide } from './figures/FeedbackForm'
import { installGestures } from './figures/gestures'

/**
 * "Simple Interest" (Programming Foundations · aptitude, session 16)
 *
 * A FORMAT CONVERSION of `Reference ppt's/16_simple_interest_student_view_new_design 7.html`
 * under the plan at `Outputs/python/session_plans/16_simple_interest/plan.md`.
 *
 * ONE SLIDE PER REFERENCE CARD: the presenter's own list (`.slide, .pcard`)
 * holds 27 cards and its counter reads `n / 27`. All 27 are here, in order.
 *
 * EVERY REVEAL IS CARRIED. The reference walks 121 states with its forward
 * key; each card's first state is the slide's entry here and every later
 * state is one build step (`useBeats`), in the reference's order (its `data-s`
 * markers). Its "Reveal next / Reset" pair is session 18 and 19's
 * `Next / Replay` (`figures/controls.tsx`); the recap of discount keeps its
 * own `Show answer`. Nothing self-advances.
 *
 * THE WORDS ARE THE REFERENCE'S. Content rule 36 is applied as layout only:
 * no line ends in a full stop, and a line holding two sentences is set as two
 * lines. No word is added, removed or reordered.
 *
 * TEMPLATE COLOURS ONLY (content rule 37): principal `success`, interest
 * `accent`, amount `brand`, on every slide (`figures/si.tsx`).
 *
 * NAVIGATION (every deck): keyboard, two-finger trackpad swipe and touch
 * swipe, from session 17's `figures/gestures.ts`.
 */

installGestures()

export const simpleInterestMeta: DeckMeta = {
  title: 'Simple Interest',
  course: 'Aptitude',
  lesson: 'Simple Interest',
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

const SESSION = 'Simple Interest'

/** The four agenda points, word for word from the reference. */
const AGENDA = [
  { title: 'Understanding how simple interest works' },
  { title: 'Deriving the simple interest formula' },
  { title: 'Finding the principal, rate or time' },
  { title: 'Solving placement question models' },
]

export const simpleInterestDeck: SlideDef[] = [
  /* ── 1 · Welcome ─────────────────────────────────────────────────── */
  { id: 'welcome', label: 'Welcome', transition: 'fade', element: <BrandSlide greeting="Welcome" lesson={SESSION} /> },

  /* ── 2, 3 · Recap ────────────────────────────────────────────────── */
  {
    id: 'recap',
    section: 'Recap',
    label: 'Where We Left Off',
    notes: 'One point per press.',
    element: (
      <RecapBrand
        lesson={SESSION}
        stepped
        title="Where We Left Off"
        points={[
          { text: 'Discount comes off the marked price', sub: 'Selling price = marked price − discount' },
          { text: 'Successive discounts cannot be directly added', sub: 'A 20% discount followed by a 10% discount results in an overall discount of 28%, not 30%' },
          { text: 'Discount % is calculated on the marked price', sub: 'Discount ÷ marked price × 100' },
        ]}
      />
    ),
  },
  {
    id: 'recap-discount',
    section: 'Recap',
    label: 'Recap of discount',
    notes: 'Everyone writes each answer in their notebook first. Then Show answer, one card per press.',
    element: (
      <Panel kicker="Recap" title="Recap of discount" lead="Write each answer in your notebook before it is shown" lesson={SESSION}>
        <RecapDiscount />
      </Panel>
    ),
  },

  /* ── 4 · Hook ────────────────────────────────────────────────────── */
  {
    id: 'bank-hook',
    section: 'Hook',
    label: 'Money in the bank for one year',
    notes: 'Presses: the deposit, the question, after one year, what interest is. Take answers to 10% of 5,000 before press 3.',
    element: (
      <Panel kicker="Think before you learn" title="Money in the bank for one year" lesson={SESSION}>
        <BankHook />
      </Panel>
    ),
  },

  /* ── 5, 6 · Today ────────────────────────────────────────────────── */
  { id: 'todays-session', section: 'Today', label: SESSION, transition: 'zoom', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  { id: 'agenda', section: 'Today', label: 'Agenda', element: <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA} /> },

  /* ── 7 to 10 · How simple interest works ─────────────────────────── */
  {
    id: 'year-by-year',
    section: AGENDA[0].title,
    label: 'Year by year',
    notes: 'Presses: year 1, year 2, year 3, why it stays the same.',
    element: (
      <Panel kicker="How simple interest works" title="The interest is the same every year" lead="₹5,000 deposited at 10% simple interest per year" lesson={SESSION}>
        <YearByYear />
      </Panel>
    ),
  },
  {
    id: 'five-terms',
    section: AGENDA[0].title,
    label: 'The five terms',
    notes: 'Presses: rate per annum, time, simple interest, amount, three different things.',
    element: (
      <Panel kicker="Basic terms" title="Principal, rate, time, interest and amount" lead="The same deposit: ₹5,000 at 10% per annum for 3 years" lesson={SESSION}>
        <FiveTerms />
      </Panel>
    ),
  },
  {
    id: 'interest-and-time',
    section: AGENDA[0].title,
    label: 'Interest and time',
    notes: 'Worksheet task 1. Presses: year 1, year 2, year 3, why a straight line, predict 5 years, the answer. Take predictions before the last press.',
    element: (
      <Panel kicker="Interest and time" title="Interest grows in a straight line with time" lesson={SESSION}>
        <InterestTime />
      </Panel>
    ),
  },
  {
    id: 'building-the-formula',
    section: AGENDA[1].title,
    label: 'Building the formula',
    notes: 'Presses: one year, T years, the formula, the amount.',
    element: (
      <Panel kicker="Deriving the formula" title="Building the formula SI = P × R × T ÷ 100" lesson={SESSION}>
        <BuildFormula />
      </Panel>
    ),
  },

  /* ── 11 to 15 · Direct questions ─────────────────────────────────── */
  {
    id: 'si-and-amount',
    section: AGENDA[1].title,
    label: 'Calculating SI and amount',
    notes: 'Presses: given data, formula, substitution, final answer, interest or amount?',
    element: (
      <Panel
        kicker="Direct questions"
        title="Finding SI and the amount"
        mode="center"
        lead={<QLead>Find the simple interest and the total amount on <B>₹8,000</B> at <B>7.5% per annum</B> for <B>2 years</B></QLead>}
        lesson={SESSION}
      >
        <WorkedQuestion
          steps={[
            { lines: ['P = ₹8,000', 'R = 7.5% per annum', 'T = 2 years'] },
            { lines: ['SI = P × R × T ÷ 100', 'A = P + SI'] },
            { lines: ['SI = 8,000 × 7.5 × 2', '÷ 100 = ₹1,200', 'A = 8,000 + 1,200'] },
            { lines: ['SI = ₹1,200', 'Amount = ₹9,200'] },
          ]}
          tip={['“Find the simple interest” → ₹1,200', '“Find the amount” or “the total” → ₹9,200', 'Read the last line of the question before you write the answer']}
        />
      </Panel>
    ),
  },
  {
    id: 'time-in-years',
    section: AGENDA[1].title,
    label: 'Time conversion',
    notes: 'Worksheet task 2. Presses: months, more than a year, days, the example, its answer, your turn, its answer. Start the 1:00 timer at "your turn".',
    element: (
      <Panel kicker="Time in years" title="Convert the time into years first" lesson={SESSION}>
        <TimeInYears />
      </Panel>
    ),
  },
  {
    id: 'find-p',
    section: AGENDA[2].title,
    label: 'Finding the principal',
    notes: 'Presses: given data, formula, substitution, final answer, when the amount is given.',
    element: (
      <Panel
        kicker="Finding the principal"
        title="Rearrange the formula to find P"
        lead={<QLead><Lines lines={[<>A sum earns <B>₹1,800</B> as simple interest in <B>3 years</B> at <B>6% per annum</B></>, 'Find the principal']} /></QLead>}
        lesson={SESSION}
      >
        <WorkedQuestion
          steps={[
            { lines: ['SI = ₹1,800', 'R = 6% per annum', 'T = 3 years', 'P = ?'] },
            { lines: ['SI = P × R × T ÷ 100', 'SI × 100 = P × R × T', 'P = SI × 100 ÷ (R × T)'] },
            { lines: ['P = 1,800 × 100', '÷ (6 × 3)', '= 1,80,000 ÷ 18'] },
            { lines: ['P = ₹10,000'] },
          ]}
          tip={['If the question gives the amount (₹11,800 after 3 years) and not the interest, use one more equation: A = P + SI', '11,800 = P + 18% of P = 1.18 × P, so P = 11,800 ÷ 1.18 = ₹10,000']}
        />
      </Panel>
    ),
  },
  {
    id: 'find-r',
    section: AGENDA[2].title,
    label: 'Finding the rate',
    notes: 'Presses: given data, formula, substitution, final answer, the quick method.',
    element: (
      <Panel
        kicker="Finding the rate"
        title="Rearrange the formula to find R"
        mode="center"
        lead={<QLead><Lines lines={[<><B>₹6,000</B> earns <B>₹900</B> as simple interest in <B>3 years</B></>, 'Find the rate of interest per annum']} /></QLead>}
        lesson={SESSION}
      >
        <WorkedQuestion
          steps={[
            { lines: ['P = ₹6,000', 'SI = ₹900', 'T = 3 years', 'R = ?'] },
            { lines: ['SI = P × R × T ÷ 100', 'R = SI × 100 ÷ (P × T)'] },
            { lines: ['R = 900 × 100', '÷ (6,000 × 3)', '= 90,000 ÷ 18,000'] },
            { lines: ['R = 5% per annum', <span key="s" className="text-[16px]">₹5 on every ₹100</span>] },
          ]}
          tip={['Quick method: in 3 years, 900 out of 6,000 is 15%', 'In one year: 15% ÷ 3 = 5%', 'Use it when the interest is an easy percent of the principal']}
        />
      </Panel>
    ),
  },
  {
    id: 'find-t',
    section: AGENDA[2].title,
    label: 'Finding the time',
    notes: 'Presses: given data, formula, substitution, final answer, one year’s interest.',
    element: (
      <Panel
        kicker="Finding the time"
        title="Rearrange the formula to find T"
        mode="center"
        lead={<QLead>In how many years will <B>₹4,000</B> earn <B>₹800</B> as simple interest at <B>5% per annum</B>?</QLead>}
        lesson={SESSION}
      >
        <WorkedQuestion
          steps={[
            { lines: ['P = ₹4,000', 'SI = ₹800', 'R = 5% per annum', 'T = ?'] },
            { lines: ['SI = P × R × T ÷ 100', 'T = SI × 100 ÷ (P × R)'] },
            { lines: ['T = 800 × 100', '÷ (4,000 × 5)', '= 80,000 ÷ 20,000'] },
            { lines: ['T = 4 years'] },
          ]}
          tip={['Another way: one year’s interest = 5% of 4,000 = ₹200', 'Total interest ÷ one year’s interest = 800 ÷ 200 = 4 years']}
        />
      </Panel>
    ),
  },

  /* ── 16 · Quiz ───────────────────────────────────────────────────── */
  {
    id: 'quiz',
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

  /* ── 17 to 24 · Placement question models ────────────────────────── */
  {
    id: 'two-amounts',
    section: AGENDA[3].title,
    label: 'Two amounts at two times',
    notes: 'Presses: the difference, one year, the principal, the rate, why 3 years.',
    element: (
      <Panel
        kicker="Placement model · Two amounts"
        title="Find the principal and rate from two amounts"
        lead={<QLead size={20}><Lines lines={[<>A sum amounts to <B>₹6,000</B> after <B>2 years</B> and to <B>₹7,500</B> after <B>5 years</B> at simple interest</>, 'Find the principal and the rate of interest per annum']} /></QLead>}
        lesson={SESSION}
      >
        <TwoAmounts />
      </Panel>
    ),
  },
  {
    id: 'doubles-triples',
    section: AGENDA[3].title,
    label: 'Doubling and tripling',
    notes: 'Presses: doubles, triples, the answer, the rule.',
    element: (
      <Panel
        kicker="Placement model · N times"
        title="When a sum doubles or triples"
        lead={<QLead><Lines lines={[<>A sum doubles itself in <B>8 years</B> at simple interest</>, <>In how many years will it <B>triple</B> itself at the same rate?</>]} /></QLead>}
        lesson={SESSION}
      >
        <DoublesTriples />
      </Panel>
    ),
  },
  {
    id: 'changes',
    section: AGENDA[3].title,
    label: 'Changes in P, R and T',
    notes: 'Presses: principal doubles, rate 8% to 10%, time cut to half, the rule, points and percent.',
    element: (
      <Panel kicker="Placement model · Changes" title="How SI changes when P, R or T changes" lesson={SESSION}>
        <Changes />
      </Panel>
    ),
  },
  {
    id: 'difference',
    section: AGENDA[3].title,
    label: 'Difference of two SIs',
    notes: 'Presses: at 10%, at 8%, the difference, the short way, why it works.',
    element: (
      <Panel
        kicker="Placement model · Difference"
        title="The difference between two simple interests"
        mode="center"
        lead={<QLead>Find the difference between the simple interest earned on <B>₹12,000</B> for <B>5 years</B> at <B>8%</B> and at <B>10% per annum</B></QLead>}
        lesson={SESSION}
      >
        <Difference />
      </Panel>
    ),
  },
  {
    id: 'splitting',
    section: AGENDA[3].title,
    label: 'Dividing a principal',
    notes: 'Presses: the two parts, interest on each, the equation, solve it, the answer.',
    element: (
      <Panel
        kicker="Placement model · Splitting a sum"
        title="Dividing one principal between two investments"
        mode="center"
        lead={
          <QLead size={18}>
            <Lines
              lines={[
                <><B>₹20,000</B> is invested in two schemes at <B>8%</B> and <B>12%</B> simple interest per annum</>,
                <>The total interest after <B>2 years</B> is <B>₹4,400</B></>,
                'Find the amount in each scheme',
              ]}
            />
          </QLead>
        }
        lesson={SESSION}
      >
        <Splitting />
      </Panel>
    ),
  },
  {
    id: 'ratios',
    section: AGENDA[3].title,
    label: 'Equal interest, ratio',
    notes: 'Presses: equal SI, cancel, the ratio, check and rule.',
    element: (
      <Panel
        kicker="Placement model · Ratios"
        title="Equal interest from two different principals"
        mode="center"
        lead={<QLead size={19}><Lines lines={[<>Two investments earn equal simple interest: the first at <B>5% per annum for 4 years</B>, the second at <B>8% per annum for 3 years</B></>, 'Find the ratio of their principals']} /></QLead>}
        lesson={SESSION}
      >
        <Ratios />
      </Panel>
    ),
  },
  {
    id: 'changing-rates',
    section: AGENDA[3].title,
    label: 'Rate changes partway',
    notes: 'Presses: the first 2 years, the next 3 years, total and amount, why not the new balance.',
    element: (
      <Panel
        kicker="Placement model · Changing rates"
        title="Different rates for different periods"
        lead={<QLead size={19}><Lines lines={[<><B>₹10,000</B> is invested at <B>6%</B> simple interest per annum for the first <B>2 years</B> and at <B>8%</B> per annum for the next <B>3 years</B></>, 'Find the total simple interest and the final amount']} /></QLead>}
        lesson={SESSION}
      >
        <ChangingRates />
      </Panel>
    ),
  },
  {
    id: 'paying-back',
    section: AGENDA[3].title,
    label: 'Paying back part of a loan',
    notes: 'Presses: year 1 interest, year 1 payment, year 2 principal, year 2 interest, total interest.',
    element: (
      <Panel
        kicker="Placement model · Paying back"
        title="Paying back part of the principal"
        lead={
          <QLead size={18}>
            <Lines
              lines={[
                <>A person borrows <B>₹10,000</B> at <B>10%</B> simple interest per annum</>,
                <>After year 1, the person pays that year’s interest and pays back <B>₹4,000</B> of the principal</>,
                'The rest is paid back at the end of year 2',
                'Find the total interest paid',
              ]}
            />
          </QLead>
        }
        lesson={SESSION}
      >
        <PayingBack />
      </Panel>
    ),
  },

  /* ── 25 · Key takeaways ──────────────────────────────────────────── */
  {
    id: 'takeaways',
    section: 'Key takeaways',
    label: 'Key takeaways',
    notes: 'Worksheet task 3. Presses: the formula, time in years, missing values, two amounts, n times, each period.',
    element: (
      <Panel kicker="Key takeaways" title="Six key takeaways: simple interest" lesson={SESSION}>
        <Takeaways />
      </Panel>
    ),
  },

  /* ── 26, 27 · Close ──────────────────────────────────────────────── */
  /* the standard feedback slide, content rule 41: Python session 18's, copied unchanged */
  {
    id: 'feedback',
    section: 'Close',
    label: 'Feedback',
    notes: 'The Google Form itself, in a frame beside the QR code; it scrolls inside the frame. Needs the network. The QR and the link open the same form.',
    element: <FeedbackEmbedSlide lesson={SESSION} />,
  },
  { id: 'thank-you', section: 'Close', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" /> },
]
