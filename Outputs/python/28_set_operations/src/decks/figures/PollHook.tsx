import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Focus, Group } from './common'
import { OutPanel, Show, Swap, CODE_FS, OUT_FS } from './pieces'
import { CodePane, StepCaption } from './trace'
import { useStepPhase } from './phase'
import { Back, CHAT, LiveClock, Phone } from './Phone'
import { CSE, GroupIcon, Venn, type ChipTone } from './venn'
import { SPEC } from './spec'

/**
 * H2 · HARSHA AT THE CSE STALL. Five presses; nothing moves by itself (one
 * press, then the movement inside it).
 *
 * The Fest crew poll on the phone, drawn as the chat app draws one (the
 * question, the option, View votes open: Harsha, Anu, Ravi, Sneha, in that
 * order). Press 2: stall_check.py, the loop most of us write; the room votes
 * True or False. Press 3: one vote at a time, the ok box flips False for
 * Harsha, then True, True, True; True prints, and Harsha glows red in the
 * poll. Press 4: ok = True moves above the loop and the else goes; ok stays
 * False from Harsha on. Press 5, the turn: the loop folds into one line, and
 * the votes circle slides into cse with Harsha left outside. The output does
 * not change. The poll's four votes and the cse group never change.
 */
const H2 = SPEC.H2
const P: { src: string; output: string }[] = H2.code
const VOTES: string[] = H2.data.votes

/** What ok holds after each vote, for the program on screen. */
const after = (flag: boolean) => {
  let ok = true
  return VOTES.map((n) => {
    if (flag) {
      if (!CSE.includes(n)) ok = false
    } else ok = CSE.includes(n)
    return ok
  })
}
const TRACE_CHECK = after(false)
const TRACE_FLAG = after(true)

function PollScreen({ hot }: { hot: boolean }) {
  const tween = useTween(420)
  return (
    <div className="flex h-full flex-col gap-1.5 px-2.5 pt-2" style={{ background: CHAT.wall }}>
      <div className="self-start rounded-xl rounded-tl-none bg-white px-3 py-1.5 shadow-sm" style={{ width: 172 }}>
        <span className="text-[10.5px] font-semibold" style={{ color: '#1F8A70' }}>
          Teja
        </span>
        <p className="text-[13px] font-bold leading-snug" style={{ color: colors.ink }}>
          Who will run the CSE stall?
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="h-[14px] w-[14px] rounded-full" style={{ boxShadow: '0 0 0 1.5px #25C063 inset', background: '#25C063' }} />
          <span className="text-[12px]" style={{ color: colors.ink }}>
            I will
          </span>
          <span className="ml-auto text-[11px] font-semibold" style={{ color: '#6B7A86' }}>
            4
          </span>
        </div>
        <div className="ml-[22px] mt-1 h-[4px] rounded-full" style={{ background: '#25C063' }} />
        <div className="mt-2 border-t pt-1.5 text-center text-[12px] font-semibold" style={{ borderColor: '#E3E8EC', color: '#1F8A70' }}>
          View votes
        </div>
      </div>
      {/* View votes, open: the voters in the order they voted */}
      <div className="rounded-xl bg-white px-2.5 py-2 shadow-sm">
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#6B7A86' }}>
          I will · 4 votes
        </span>
        {VOTES.map((n) => {
          const red = hot && !CSE.includes(n)
          return (
            <div key={n} className="mt-0.5 flex items-center gap-2 rounded-lg px-1.5 py-[2px]" style={{ background: red ? '#FDECEC' : 'transparent', boxShadow: red ? `0 0 0 2px ${colors.danger}, 0 0 14px ${colors.danger}66` : '0 0 0 0 transparent', transition: tween }}>
              <span className="h-[20px] w-[20px] rounded-full" style={{ background: '#D9DEE6' }} />
              <span className="text-[13px] font-semibold" style={{ color: red ? colors.danger : colors.ink }}>
                {n}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** The ok box: what the name ok holds right now, and the vote being read. */
function OkBox({ name, ok }: { name: string | null; ok: boolean | null }) {
  const tween = useTween(360)
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
        name
      </span>
      <span className="grid h-[34px] min-w-[96px] place-items-center rounded-lg bg-white px-2 font-mono text-[16px] font-bold" style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
        <Swap k={name ?? '-'}>{name ? `'${name}'` : ''}</Swap>
      </span>
      <span className="font-mono text-[18px] font-bold" style={{ color: colors.ink }}>
        ok
      </span>
      <span
        className="grid h-[52px] w-[96px] place-items-center rounded-xl font-mono text-[20px] font-bold"
        style={{
          background: ok === null ? colors.white : ok ? '#E9F8EF' : '#FDECEC',
          color: ok ? '#137A3A' : colors.danger,
          boxShadow: `inset 0 0 0 3px ${ok === null ? colors.line : ok ? colors.success : colors.danger}`,
          transition: tween,
        }}
      >
        <Swap k={String(ok)}>{ok === null ? '' : ok ? 'True' : 'False'}</Swap>
      </span>
    </div>
  )
}

export function PollHook() {
  const beat = useBeats(5)
  /* presses 3 and 4: one vote per beat inside the press, then the print */
  const phase = useStepPhase(beat, beat === 5 ? [700] : [500, 1000, 1000, 1000, 900])
  const running = beat === 3 || beat === 4
  const k = running ? Math.min(phase, 4) : 0 /* votes read so far */
  const trace = beat === 4 ? TRACE_FLAG : TRACE_CHECK
  const ok = running && k > 0 ? trace[k - 1] : running && beat === 4 ? true : null
  const printed = (running && phase >= 5) || beat === 5
  const prog = beat === 5 ? P[2] : beat === 4 ? P[1] : P[0]
  /* the line running now: for checks, line 4 (the if) while votes are read */
  const at = running && k > 0 && phase < 5 ? 4 : null
  const slid = beat === 5 && phase >= 1
  const tones: Record<string, ChipTone> = slid ? { Harsha: 'bad' } : {}
  return (
    <>
      <div className="flex items-start gap-6">
        <Phone width={196} height={404} time={<LiveClock />} island={null} top={{ bg: CHAT.bar, light: true, header: (
          <div className="flex items-center gap-2 px-3 pb-2.5 pt-1">
            <Back color={colors.white} />
            <GroupIcon tone={colors.accentDark} size={26} />
            <div className="flex flex-col">
              <span className="text-[14px] font-bold leading-tight text-white">Fest crew</span>
              <span className="text-[10.5px] leading-tight text-white/80">12 members</span>
            </div>
          </div>
        ) }}>
          <PollScreen hot={(beat === 3 && phase >= 5) || beat >= 4} />
        </Phone>
        {/* one fixed size on every press (user, 2026-10-08, slide 17): the panel is the phone's height and ends clear of Next and Autoplay */}
        <Group pad={6} className="flex min-w-0 flex-1 flex-col gap-1.5" active={beat >= 2} style={{ height: 404 }}>
          <StepCaption text={beat === 1 ? H2.show[0] : beat === 2 ? H2.show[1] : beat === 3 ? (phase >= 5 ? H2.show[2] : null) : beat === 4 ? (phase >= 5 ? H2.show[3] : null) : H2.show[4]} size={17} minH={36} />
          <Show on={beat >= 2}>
            <div className="flex items-start gap-4">
              <div className="w-[730px] shrink-0">
                <Focus on={beat === 2}>
                  <CodePane code={prog.src} fontSize={CODE_FS} rows={beat === 5 ? 3 : 8} at={at} />
                </Focus>
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-center gap-3">
                {beat <= 4 && <OkBox name={running && k > 0 && phase < 5 ? VOTES[k - 1] : null} ok={ok} />}
                <OutPanel lines={printed ? [{ text: prog.output }] : []} minRows={1} fontSize={OUT_FS} className="w-full" />
              </div>
            </div>
          </Show>
          {beat === 5 && (
            <div className="flex justify-center">
              <Venn
                W={440}
                H={198}
                L={{ cx: 90, cy: 112, r: 84 }}
                R={slid ? { cx: 170, cy: 112, r: 74 } : { cx: 360, cy: 112, r: 74 }}
                left={{ code: 'cse', items: CSE }}
                right={{ code: 'votes', items: VOTES }}
                fs={12}
                tones={tones}
              />
            </div>
          )}
        </Group>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}
