import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Appear, Show } from './pieces'
import { CodePane, StepCaption } from './trace'
import { Back, CHAT, Phone } from './Phone'
import { usePhase } from './tiles21'
import { SPEC } from './spec'

/**
 * HOOK 2: THE LATEST MESSAGE. Spec card H2, five presses.
 *
 * A phone with the group chat `Lunch gang`, the four messages of the spec's
 * data in order, newest at the bottom, a small grey position beside each.
 * Press 2: a new message joins at the bottom (only ever there, its must
 * line) and its position shows 4. Press 3: the long way, run for real:
 * latest_long.py prints Canteen, then, with the new message added,
 * latest_long_new.py prints Coming in 5 mins (one movement inside the press).
 * Press 4: new grey numbers from the bottom up, -1 beside the newest. Press 5:
 * the short way, the same two outputs. "Negative index" is not said before
 * the last press (its must_not); it is said aloud, in the notes.
 *
 * The chat app is drawn in its own screen colours (`CHAT`), with no mark
 * (plan, flags). Sender names and times are the drawing's; the messages are
 * the spec's.
 */
const H2 = SPEC.H2
const MSGS: string[] = H2.data.chat
const NEW: string = H2.data.new
const LONG = H2.code[0]
const LONG_NEW = H2.code[1]
const SHORT = H2.code[2]
const SHORT_NEW = H2.code[3]

/* who sent each message, and when: the drawing's own detail */
const WHO = [
  { from: 'Anu', at: '12:41', mine: false },
  { from: 'Ravi', at: '12:42', mine: false },
  { from: 'Anu', at: '12:42', mine: false },
  { from: 'You', at: '12:43', mine: true },
  { from: 'Kiran', at: '12:55', mine: false },
]
const NAME_INK: Record<string, string> = { Anu: '#C2185B', Ravi: '#1F7A8C', Kiran: '#7B5BB6' }

function Ticks() {
  return (
    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke={CHAT.tick} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 5.5 3.8 8.2 9 2" />
      <path d="M6.5 7.6 7.2 8.2 12.4 2" />
    </svg>
  )
}

function Bubble({ text, i, posOn, neg, total, lit }: { text: string; i: number; posOn: boolean; neg: boolean; total: number; lit: boolean }) {
  const w = WHO[i]
  const tween = useTween(420)
  const instant = useInstant()
  return (
    <div className="flex items-center gap-1">
      <span className="w-[14px] shrink-0 text-right font-mono text-[11px] font-semibold" style={{ color: colors.muted, opacity: posOn ? 1 : 0, transition: tween }}>
        {i}
      </span>
      <div className={`flex min-w-0 flex-1 ${w.mine ? 'justify-end' : 'justify-start'}`}>
        <div
          className="max-w-[150px] rounded-lg px-2 pb-1 pt-1 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]"
          style={{ background: w.mine ? CHAT.mine : CHAT.theirs, boxShadow: lit ? `0 0 0 2.5px ${colors.brand}` : undefined, transition: tween }}
        >
          {!w.mine && (
            <span className="block text-[10.5px] font-bold leading-tight" style={{ color: NAME_INK[w.from] }}>
              {w.from}
            </span>
          )}
          <span className="text-[12.5px] leading-snug" style={{ color: '#111B21' }}>
            {text}
          </span>
          <span className="ml-1.5 inline-flex translate-y-[2px] items-center gap-0.5 text-[9.5px]" style={{ color: '#667781' }}>
            {w.at}
            {w.mine && <Ticks />}
          </span>
        </div>
      </div>
      <span
        className="w-[20px] shrink-0 font-mono text-[11px] font-semibold"
        style={{
          color: lit ? colors.brandDark : colors.muted,
          opacity: neg ? 1 : 0,
          transform: neg ? 'none' : 'translateY(4px)',
          transition: instant ? 'none' : `opacity 420ms cubic-bezier(0.22,1,0.36,1) ${(total - 1 - i) * 220}ms, transform 420ms cubic-bezier(0.22,1,0.36,1) ${(total - 1 - i) * 220}ms`,
        }}
      >
        {i - total}
      </span>
    </div>
  )
}

function ChatPhone({ withNew, neg, litLast }: { withNew: boolean; neg: boolean; litLast: boolean }) {
  const all = withNew ? [...MSGS, NEW] : MSGS
  return (
    <Phone
      width={248}
      height={470}
      time="12:56"
      top={{
        bg: CHAT.bar,
        light: true,
        header: (
          <div className="flex items-center gap-2 px-2.5 pb-2 pt-0.5">
            <Back color={colors.white} />
            <span className="grid h-[28px] w-[28px] shrink-0 place-items-center rounded-full" style={{ background: '#DFE5E7' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <circle cx="9" cy="9" r="3.4" fill="#FFFFFF" />
                <circle cx="16" cy="10" r="2.8" fill="#FFFFFF" />
                <path d="M3 19c.8-3.4 3.2-5 6-5s5.2 1.6 6 5M13.5 18.6c.6-2.4 2.2-3.6 4.2-3.6 2 0 3.3 1.2 3.8 3.6" fill="#FFFFFF" />
              </svg>
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="text-[14px] font-semibold text-white">Lunch gang</span>
              <span className="truncate text-[10.5px]" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Anu, Kiran, Ravi, You
              </span>
            </span>
          </div>
        ),
      }}
    >
      <div className="flex h-full flex-col" style={{ background: CHAT.wall }}>
        <div className="flex flex-1 flex-col justify-end gap-1.5 px-1.5 pb-2">
          <span className="mx-auto mb-1 rounded-md px-2 py-0.5 text-[10px] font-semibold" style={{ background: '#FFFFFFCC', color: '#54656F' }}>
            TODAY
          </span>
          {all.map((m, i) =>
            i === MSGS.length ? (
              <Appear key={i}>
                <Bubble text={m} i={i} posOn neg={neg} total={all.length} lit={litLast} />
              </Appear>
            ) : (
              <Bubble key={i} text={m} i={i} posOn neg={neg} total={all.length} lit={litLast && i === all.length - 1} />
            ),
          )}
        </div>
        <div className="flex items-center gap-1.5 px-1.5 pb-5 pt-0.5">
          <span className="flex-1 rounded-full bg-white px-3 py-1.5 text-[12px]" style={{ color: '#8696A0' }}>
            Message
          </span>
          <span className="grid h-[30px] w-[30px] place-items-center rounded-full" style={{ background: CHAT.bar }}>
            <svg width="12" height="16" viewBox="0 0 12 16" aria-hidden>
              <rect x="3.5" y="1" width="5" height="9" rx="2.5" fill="#FFFFFF" />
              <path d="M1.5 7.5a4.5 4.5 0 0 0 9 0M6 12v3" stroke="#FFFFFF" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>
    </Phone>
  )
}

/** One run's output, with the chat it ran on, so two runs never read as one program printing twice. */
function RunOut({ label, text }: { label: string; text: string }) {
  return (
    <Appear className="flex items-center gap-3">
      <span className="w-[80px] shrink-0 whitespace-nowrap text-[13px] font-semibold leading-tight" style={{ color: colors.muted }}>
        {label}
      </span>
      <span className="whitespace-nowrap rounded-md px-2 py-0.5 font-mono text-[15px] font-bold" style={{ background: `${colors.success}14`, color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${colors.success}` }}>
        {text}
      </span>
    </Appear>
  )
}

/** The long way or the short way: the program, run on four messages, then on five. */
function Way({ title, before, after, phase, on }: { title: string; before: { src: string; output: string }; after: { src: string; output: string }; phase: number; on: boolean }) {
  const second = phase >= 1
  return (
    <Show on={on} className="flex items-start gap-4">
      <div className="w-[592px] shrink-0">
        <CodePane code={second ? after.src : before.src} at={second ? 3 : 2} mark={second ? [2] : undefined} fontSize={13} rows={3} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="font-heading text-[16px] font-bold" style={{ color: colors.brandDark }}>
          {title}
        </span>
        {on && <RunOut label="4 messages" text={before.output} />}
        {on && second && <RunOut label="5 messages" text={after.output} />}
      </div>
    </Show>
  )
}

export function ChatHook() {
  const beat = useBeats(5)
  const longPhase = usePhase(beat, 3, [1700])
  const shortPhase = usePhase(beat, 5, [1700])
  const caption = H2.show[Math.min(beat, 5) - 1]
  return (
    <>
      <div className="flex items-start gap-7">
        <div className="shrink-0" style={{ marginTop: -48 }}>
          <ChatPhone withNew={beat >= 2} neg={beat >= 4} litLast={beat >= 5} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <StepCaption text={caption} tone={beat >= 4 ? 'rule' : 'step'} size={20} minH={56} />
          <Way title="The long way" before={LONG} after={LONG_NEW} phase={longPhase} on={beat >= 3} />
          <Way title="The short way" before={SHORT} after={SHORT_NEW} phase={shortPhase} on={beat >= 5} />
        </div>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}

