import { useEffect, useState } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Confetti } from './motion'
import { Ask, Option, OutPanel, Show, sentences, type OutLine } from './pieces'

/**
 * WHO TOOK THE MAGGI? Spec card G1, the detective game.
 *
 * A hostel notice board with four suspect cards; each clue is a short program
 * over the suspects' details, and what it prints rules suspects out. Fourteen
 * presses: per round the clue and its question (nothing runs yet), one run
 * line per press, then the verdict with a line for every wrong option and
 * the ruled-out suspect crossed off. Round 4 crashes and rules nobody out.
 * The last press unmasks the one suspect no clue ruled out.
 *
 * A, B and C are clickable so the room's pick is locked in before the run
 * (plan decision 11); the press never waits for a pick. Every printed value is
 * a real run (plan, outputs table).
 */
const CASE = sentences('The last packet of Maggi vanished from the Room 204 shelf last night. Four suspects. Who took it?')

const SUSPECTS = [
  { name: 'Arjun', room: '201', says: 'I was asleep by 10.' },
  { name: 'Bhavya', room: '204', says: 'I was at the mess till late.' },
  { name: 'Charan', room: '204', says: 'I was in my room all night.' },
  { name: 'Divya', room: '207', says: 'I was in the library.' },
]
const CULPRIT = 'Charan'

interface Round {
  clue: string
  program: string
  options: string[]
  answer: string
  why: Record<string, string>
  because: string
  rulesOut: string | null
  steps: { caption: string; printed: string }[]
}

const ROUNDS: Round[] = [
  {
    clue: 'The gate book: the name at position 1 left the hostel at 9 pm and came back next morning.',
    program: 'gate_book = ["Divya", "Arjun", "Bhavya"]\nprint(gate_book[1])',
    options: ['Divya', 'Arjun', 'Bhavya'],
    answer: 'Arjun',
    why: { Divya: 'Divya is at position 0. Positions start at 0, not 1.', Bhavya: 'Bhavya is at position 2. Count from 0: Divya 0, Arjun 1.' },
    because: 'It prints Arjun, so Arjun is out.',
    rulesOut: 'Arjun',
    steps: [{ caption: 'It prints Arjun.', printed: 'Arjun' }],
  },
  {
    clue: 'The library sign-in sheet: everyone the loop prints was in the library till midnight.',
    program: 'library = ["Divya", "Arjun"]\nfor name in library:\n    print(name)',
    options: ['Divya then Arjun', "['Divya', 'Arjun']", 'Divya'],
    answer: 'Divya then Arjun',
    why: { "['Divya', 'Arjun']": 'The loop prints each item on its own line, not the list.', Divya: 'The loop goes through every item, not only the first.' },
    because: 'It prints Divya, then Arjun, so Divya is out.',
    rulesOut: 'Divya',
    steps: [
      { caption: 'It prints Divya.', printed: 'Divya' },
      { caption: 'It prints Arjun.', printed: 'Divya\nArjun' },
    ],
  },
  {
    clue: 'The mess register: the last name on it was eating at 11 pm.',
    program: 'mess = ["Arjun", "Divya", "Charan", "Bhavya"]\nprint(mess[len(mess) - 1])',
    options: ['Bhavya', 'Charan', 'IndexError'],
    answer: 'Bhavya',
    why: { Charan: 'len(mess) - 1 is 3, and position 3 is Bhavya. Charan is position 2.', IndexError: 'mess[len(mess)] would crash. With - 1 it is the last position, 3.' },
    because: 'It prints Bhavya, so Bhavya is out.',
    rulesOut: 'Bhavya',
    steps: [{ caption: 'It prints Bhavya.', printed: 'Bhavya' }],
  },
  {
    clue: 'The CCTV list: whoever is at position 3 walked past the shelf.',
    program: 'cctv = ["Bhavya", "Divya", "Arjun"]\nprint(cctv[3])',
    options: ['Arjun', 'Nothing', 'IndexError'],
    answer: 'IndexError',
    why: { Arjun: 'Arjun is at position 2, the last one. Three names means positions 0, 1, 2.', Nothing: 'Python does not stay quiet. A position that is not there stops the program with an error.' },
    because: 'There is no position 3, so the clue crashes and rules nobody out.',
    rulesOut: null,
    steps: [{ caption: 'Python stops with IndexError: list index out of range. Nothing prints.', printed: 'IndexError: list index out of range' }],
  },
]

/* beat → what is on screen */
type Phase = { round: number; step: number; verdict: boolean } | { final: true }
const MAP: Phase[] = []
ROUNDS.forEach((r, ri) => {
  MAP.push({ round: ri, step: 0, verdict: false })
  r.steps.forEach((_, si) => MAP.push({ round: ri, step: si + 1, verdict: false }))
  MAP.push({ round: ri, step: r.steps.length, verdict: true })
})
MAP.push({ final: true })
export const CASE_BEATS = MAP.length /* 14 */

function Suspect({ s, out, culprit, final }: { s: (typeof SUSPECTS)[number]; out: boolean; culprit: boolean; final: boolean }) {
  const tween = useTween(480)
  const lit = final && culprit
  return (
    <div
      className="relative flex items-start gap-3 rounded-xl bg-white px-3.5 py-2"
      style={{
        boxShadow: `inset 0 0 0 ${lit ? 3 : 2}px ${lit ? colors.danger : out ? colors.line : colors.brand}`,
        opacity: out ? 0.45 : 1,
        transform: lit ? 'scale(1.03)' : 'none',
        transition: tween,
      }}
    >
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full font-heading text-[17px] font-bold" style={{ background: lit ? colors.danger : colors.surface2, color: lit ? colors.white : colors.brandDark }}>
        {s.name[0]}
      </span>
      <span className="min-w-0">
        <span className="flex items-baseline gap-2">
          <span className="font-heading text-[18px] font-bold leading-tight" style={{ color: colors.ink, textDecoration: out ? 'line-through' : 'none' }}>
            {s.name}
          </span>
          <span className="text-[16px] font-semibold" style={{ color: colors.muted }}>
            Room {s.room}
          </span>
        </span>
        <span className="block text-[16px] italic leading-snug" style={{ color: colors.body }}>
          “{s.says}”
        </span>
      </span>
      {out && (
        <span className="absolute right-3 top-2 rounded px-1.5 text-[13px] font-bold uppercase tracking-wider" style={{ background: '#FDECEC', color: colors.danger }}>
          out
        </span>
      )}
    </div>
  )
}

export function MaggiCase() {
  const beat = useBeats(CASE_BEATS)
  const phase = MAP[Math.min(beat, CASE_BEATS) - 1]
  const final = 'final' in phase
  const ri = final ? ROUNDS.length - 1 : phase.round
  const R = ROUNDS[ri]
  const step = final ? R.steps.length : phase.step
  const verdict = final ? true : phase.verdict
  /* who is crossed off: every round whose verdict has been shown */
  const outNames = new Set(
    ROUNDS.filter((r, i) => r.rulesOut && (i < ri || (i === ri && verdict))).map((r) => r.rulesOut as string),
  )
  const [pick, setPick] = useState<string | null>(null)
  useEffect(() => setPick(null), [ri])
  const printed: OutLine[] = step > 0 ? R.steps[step - 1].printed.split('\n').map((t) => ({ text: t, tone: t.startsWith('IndexError') ? 'error' : 'plain' })) : []
  const caption = step > 0 ? sentences(R.steps[step - 1].caption) : null
  const celebrate = verdict && !final && pick === R.answer
  const wrong = R.options.filter((o) => o !== R.answer)
  return (
    <>
      <div className="flex items-start gap-6">
        {/* the notice board */}
        <div className="flex w-[350px] shrink-0 flex-col gap-2 rounded-2xl px-3.5 pb-3.5 pt-3" style={{ background: 'rgba(255,255,255,0.55)', border: `2px solid ${colors.line}` }}>
          <p className="text-[16px] font-semibold leading-snug" style={{ color: colors.ink }}>
            <Lines lines={CASE} />
          </p>
          {SUSPECTS.map((s) => (
            <Suspect key={s.name} s={s} out={outNames.has(s.name)} culprit={s.name === CULPRIT} final={final} />
          ))}
        </div>
        {/* the clue */}
        {final ? (
          <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-3 self-stretch rounded-2xl bg-white px-6 py-8" style={{ boxShadow: `inset 0 0 0 3px ${colors.danger}` }}>
            <span className="text-[16px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
              The one suspect no clue ruled out
            </span>
            <span className="font-heading text-[64px] font-extrabold leading-none" style={{ color: colors.danger }}>
              {CULPRIT}
            </span>
            <span className="text-[18px] font-semibold" style={{ color: colors.body }}>
              Room 204
            </span>
          </div>
        ) : (
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-start gap-3 rounded-xl px-4 py-2" style={{ background: '#FFF9EC', boxShadow: `inset 0 0 0 1.5px ${colors.warning}66` }}>
              <span className="mt-0.5 shrink-0 rounded-md px-2 py-0.5 font-mono text-[15px] font-bold" style={{ background: colors.warning, color: colors.white }}>
                Clue {ri + 1} of 4
              </span>
              <p className="text-[16px] font-semibold leading-snug" style={{ color: colors.ink }}>
                <Lines lines={sentences(R.clue)} />
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-[430px] shrink-0">
                <CodeBlock code={R.program} filename="Python" chip={false} fontSize={13} rows={R.program.split('\n').length} lines={step > 0 ? { [R.program.split('\n').length]: R.answer === 'IndexError' ? 'error' : 'now' } : {}} />
              </div>
              <div className="min-w-0 flex-1">
                <OutPanel title="Terminal" lines={printed} minRows={2} fontSize={13} empty={step === 0 ? 'nothing has run yet' : undefined} />
              </div>
            </div>
            <Show on={Boolean(caption)} lift={4} style={{ minHeight: 22 }}>
              <p className="text-[16px] font-semibold leading-snug" style={{ color: colors.body }}>
                {(caption ?? ['']).join(' · ')}
              </p>
            </Show>
            <Ask size={18}>What does this clue print?</Ask>
            <div className="flex items-start gap-4">
              <div className="flex w-[280px] shrink-0 flex-col gap-1.5">
                {R.options.map((o, i) => (
                  <Option key={`${ri}-${o}`} letter={'ABC'[i]} picked={pick === o} right={o === R.answer} shown={verdict} onPick={() => setPick(o)} size={16} dense>
                    {o === 'Divya then Arjun' ? 'Divya\nArjun' : o}
                  </Option>
                ))}
              </div>
              <Show on={verdict} className="flex min-w-0 flex-1 flex-col gap-1 rounded-xl px-3.5 py-2" style={{ background: colors.surface2, boxShadow: `inset 4px 0 0 ${colors.brandDark}` }}>
                <p className="text-[16px] font-bold leading-snug" style={{ color: colors.ink }}>
                  {R.because.replace(/\.$/, '')}
                </p>
                {wrong.map((o) => (
                  <div key={o} className="flex items-start gap-3 text-[16px] leading-snug" style={{ color: colors.body }}>
                    <span className="w-[104px] shrink-0 truncate font-mono font-bold" style={{ color: colors.brandDark }}>
                      {o}
                    </span>
                    <span>
                      <Lines lines={sentences(R.why[o])} />
                    </span>
                  </div>
                ))}
              </Show>
            </div>
          </div>
        )}
      </div>
      {celebrate && <Confetti seed={40 + ri} />}
      <StepControls at={beat} total={CASE_BEATS} />
    </>
  )
}
