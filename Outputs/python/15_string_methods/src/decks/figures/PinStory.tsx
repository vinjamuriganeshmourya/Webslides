import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, TraceCaption, useBeats } from '@/ui'
import { StepControls } from './controls'
import { Back, Phone, PHONE_LIFT } from './Phone'
import { Ask, BeatFade, Definition } from './common'

/**
 * WHY A STRING METHOD AT ALL? PF 15 slide 14, the second concept's opening.
 *
 * The cost before the mechanism (content rule 23): the phone refuses a PIN,
 * the room says "check each one", and the next press shows what that costs,
 * nine lines and forty comparisons. Only then does `pin.isdigit()` arrive, and
 * only then is it given its name, "a string method".
 *
 * The phone is the reference's own: a Security screen, four PIN boxes, the
 * keypad. On every beat after the first it holds 47a8 with the `a` marked and
 * the app's refusal under it, so the room never loses sight of the problem.
 *
 * The nine-line program is real, and it really prints False (CPython 3.12.3).
 */
const LOOP = [
  'pin = "47a8"',
  'all_digits = True',
  'for ch in pin:',
  '    if (ch != "0" and ch != "1" and ch != "2" and',
  '        ch != "3" and ch != "4" and ch != "5" and',
  '        ch != "6" and ch != "7" and ch != "8" and',
  '        ch != "9"):',
  '        all_digits = False',
  'print(all_digits)',
].join('\n')

const SHORT = 'pin = "47a8"\nprint(pin.isdigit())'

function PinScreen({ typed }: { typed: boolean }) {
  const digits = typed ? ['4', '7', 'a', '8'] : ['', '', '', '']
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '◀']
  /* Sized for the 1 : 2.06 phone: the PIN card and the message on top, the
     keypad at the foot of the screen where a real keypad sits. */
  return (
    <div className="absolute inset-0 flex flex-col px-2.5 pb-7 pt-2.5" style={{ background: colors.surface }}>
      <div className="rounded-2xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-line">
        <p className="text-[12.5px] font-bold" style={{ color: colors.ink }}>Set a 4 digit PIN</p>
        <div className="mt-2 flex justify-between">
          {digits.map((d, i) => {
            const bad = d === 'a'
            return (
              <span
                key={i}
                className="grid h-[40px] w-[38px] place-items-center rounded-lg font-mono text-[20px] font-semibold"
                style={{
                  background: bad ? '#FDECEC' : colors.surface,
                  color: bad ? colors.danger : colors.ink,
                  border: `2px solid ${bad ? colors.danger : colors.line}`,
                }}
              >
                {d}
              </span>
            )
          })}
        </div>
      </div>
      <div className="mt-2 h-[30px]">
        {typed ? (
          <p className="flex h-full items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold" style={{ background: '#FDECEC', color: colors.danger, boxShadow: `inset 0 0 0 1.5px ${colors.danger}` }}>
            <span className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full text-[9px] font-bold text-white" style={{ background: colors.danger }}>!</span>
            Digits only. Try again.
          </p>
        ) : (
          <p className="flex h-full items-center justify-center text-center text-[10.5px] font-semibold leading-tight" style={{ color: colors.body }}>
            A PIN like 4748 is fine. What about this one?
          </p>
        )}
      </div>
      <div className="mt-auto grid grid-cols-3 gap-x-4 gap-y-2 px-2">
        {keys.map((k, i) => (
          <span
            key={i}
            className="grid h-[38px] w-[38px] place-items-center justify-self-center rounded-full text-[15px] font-semibold"
            style={k ? { background: colors.white, color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${colors.line}` } : undefined}
          >
            {k}
          </span>
        ))}
      </div>
    </div>
  )
}

function Check({ ok, title, text }: { ok: boolean; title: ReactNode; text: ReactNode }) {
  return (
    <div
      className="flex items-start gap-4 rounded-card px-5 py-3"
      style={{ background: ok ? '#EEF9F2' : '#FFF8EC', boxShadow: `inset 0 0 0 1.5px ${ok ? '#BFE6CC' : '#F6D9A6'}` }}
    >
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full font-bold text-white" style={{ background: ok ? colors.success : colors.warning }}>
        {ok ? '✓' : '?'}
      </span>
      <div>
        <p className="text-[19px] font-bold leading-snug" style={{ color: colors.ink }}>{title}</p>
        <p className="text-[16px] leading-snug" style={{ color: colors.body }}>{text}</p>
      </div>
    </div>
  )
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-xl px-5 py-3" style={{ background: colors.surface2 }}>
      <p className="font-mono text-[30px] font-bold leading-none" style={{ color: colors.ink }}>{n}</p>
      <p className="mt-1.5 text-[16px] font-semibold" style={{ color: colors.brandDark }}>{label}</p>
    </div>
  )
}

const P = ({ children }: { children: ReactNode }) => (
  <p className="text-[19px] leading-snug [&_b]:font-bold [&_b]:text-ink" style={{ color: colors.body }}>{children}</p>
)

/**
 * Spacing carries the grouping (review, 2026-10-01): lines that belong
 * together sit 8 to 12px apart inside a `G`, and the groups sit 24px apart, so
 * the room reads the column as three or four blocks rather than a list of
 * equally spaced lines.
 */
const G = ({ gap = 3, children }: { gap?: 2 | 3; children: ReactNode }) => (
  <div className={`flex flex-col ${gap === 2 ? 'gap-2' : 'gap-3'}`}>{children}</div>
)

export function PinStory() {
  const beat = useBeats(5)
  let right: ReactNode
  if (beat === 1)
    right = (
      <>
        <P>
          You set a PIN on your phone. Before the app saves it, it has to be sure of <b>two</b> things.
        </P>
        <G gap={2}>
          <Check ok title="Four characters long" text="len(pin) == 4. One line, and you already know it." />
          <Check ok={false} title="Every one of them a digit" text="No character in it may be a letter or a space." />
        </G>
        <Ask size={22}>The length is easy. How would you check the second one?</Ask>
      </>
    )
  else if (beat === 2)
    right = (
      <>
        <G>
          <P>
            Somebody types <b>47a8</b>. There is a letter in the middle of it, so the app refuses it.
          </P>
          <Ask size={22}>It said no in under a second. What did it actually do to find out?</Ask>
        </G>
        <TraceCaption>
          Take two answers. Somebody will say <i>check each one</i>. That is the right answer, and the next press is what it costs.
        </TraceCaption>
      </>
    )
  else if (beat === 3)
    right = (
      <>
        <G>
          <P>
            Go through the characters one at a time. For each one, ask whether it is a digit, and a character is a digit only if it is one of ten things.
          </P>
          <CodeBlock code={LOOP} filename="Python" chip={false} fontSize={14} lines={{ 4: 'warn', 5: 'warn', 6: 'warn', 7: 'warn' }} maxHeight={600} />
        </G>
        <TraceCaption>
          It prints <b>False</b>, which is the right answer. Read line 4 out loud and stop halfway.
        </TraceCaption>
      </>
    )
  else if (beat === 4)
    right = (
      <>
        <G>
          <P>
            Ten comparisons for one character. Four characters, so <b>40</b> comparisons, and <b>9 lines</b> of program.
          </P>
          <div className="flex gap-3">
            <Stat n="4" label="characters" />
            <Stat n="10" label="checks each" />
            <Stat n="40" label="comparisons" />
            <Stat n="9" label="lines" />
          </div>
        </G>
        <Ask size={22}>Every app on your phone checks a PIN. Do you think they all wrote this?</Ask>
      </>
    )
  else
    right = (
      <>
        <G>
          <P>Python already knows this job. Somebody wrote it once, and it comes with the language.</P>
          <CodeBlock code={SHORT} filename="Python" chip={false} fontSize={18} lines={{ 2: 'mark' }} />
          <P>
            Same answer, <b>2 lines</b> instead of <b>9</b>.
          </P>
        </G>
        {/* #CCE2FF: the band's hue (214) at saturation 20% instead of 8%, so it
            stands off the slide's ground. Body text on it is 5.3:1, the
            signature 5.9:1 (user, 2026-10-01, slide 14 only). */}
        <Definition sig="a string method" bg="#CCE2FF">
          A job Python already knows how to do on a string. You write the string, a dot, and the name of the job. There are five of them today.
        </Definition>
      </>
    )

  return (
    <>
      <div className="flex items-start gap-12">
        <div style={{ marginTop: -PHONE_LIFT }}>
          <Phone
            top={{
              bg: colors.white,
              light: false,
              header: (
                <div className="relative flex h-[40px] items-center justify-center border-b border-line px-3">
                  <span className="absolute left-3">
                    <Back color={colors.ink} />
                  </span>
                  <span className="text-[13.5px] font-bold" style={{ color: colors.ink }}>Security</span>
                </div>
              ),
            }}
          >
            <PinScreen typed={beat > 1} />
          </Phone>
        </div>
        {/* Beat 3 carries the nine-line program, so its groups sit closer to keep
            the caption clear of the Next and Replay buttons. */}
        <BeatFade beatKey={beat} className={`flex min-w-0 flex-1 flex-col ${beat === 3 ? 'gap-4' : 'gap-6'}`}>
          {right}
        </BeatFade>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}
