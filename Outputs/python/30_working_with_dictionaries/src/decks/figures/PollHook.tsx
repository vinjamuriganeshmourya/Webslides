import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import type { CodeLineState } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Focus, Group } from './common'
import { OutPanel, Show, Swap, OUT_FS } from './pieces'
import { Code } from './Code'
import { StepCaption } from './trace'
import { useStepPhase } from './phase'
import { Back, CHAT, LiveClock, Phone } from './Phone'
import { CSE, GroupIcon, Venn, type ChipTone } from './venn'
import { SPEC } from './spec'

/**
 * H2 · HARSHA AT THE CSE STALL. Seven presses; nothing moves by itself (one
 * press, then the movement inside it).
 *
 * Rebuilt on 2026-10-09 from the view fixes change spec. The old card showed
 * a broken loop on purpose (an if and an else that only kept the last vote,
 * so it printed True) and read its votes on a timer. Now the check by hand is
 * written right, and it is long: a flag, a loop that prints who is and is not
 * in CSE-A, and a break as soon as one name is outside.
 *
 *   1  the Fest crew poll on the phone, View votes open: Anu, Ravi, Harsha,
 *      Sneha, in that order; the rule
 *   2  stall_check.py beside it, a name box and an ok box, empty; the room
 *      votes True or False, and whether Sneha is checked
 *   3  Anu: the for and the if part light, her chip greens, the first line
 *      prints, ok stays True
 *   4  Ravi: the same again
 *   5  Harsha: the else part lights, his chip reds, ok flips to False, break
 *      lights and an arrow jumps out of the loop to print(ok); Sneha's chip
 *      greys, tagged not checked
 *   6  print(ok) lights: False
 *   7  the turn, one movement: lines 3 to 10 fold into one line; the votes
 *      become a circle that slides into cse, Harsha left outside; False
 *
 * Both programs are real and every output is theirs. The poll's four votes
 * in their order and the cse group never change. No output fills before its
 * press.
 */
const H2 = SPEC.H2
const [CHECK, SHORT]: { src: string; output: string }[] = H2.code
const VOTES: string[] = H2.data.votes
const OUT_LINES = CHECK.output.split('\n')
/**
 * This card's program is 11 lines with a 72-character line, beside a phone,
 * with a name box, an ok box and a four-line output to its right: at the deck's
 * 15px it left the right column 170px wide. One size down, and a 692px column
 * (the 72-character line needs 690), leaves 208px: the two boxes side by side
 * and the output's longest line whole.
 */
const H2_CODE_FS = 14
/** stall_check.py's lines: the for, the if part, the else part, print(ok). */
const LN = { FOR: 4, IF: 5, IF_PRINT: 6, ELSE: 7, ELSE_PRINT: 8, FLAG: 9, BREAK: 10, PRINT: 11 }
/** The first vote outside cse: the loop stops there. */
const STOP = VOTES.findIndex((n) => !CSE.includes(n))
/** The vote read on a press: presses 3, 4 and 5 read votes 0, 1 and 2. */
const voteAt = (beat: number) => (beat >= 3 && beat <= 5 ? beat - 3 : -1)

/** The poll as the chat app draws one, View votes open: each voter's row greens, reds, or greys as the loop reaches it. */
function PollScreen({ read, stopped }: { read: number; stopped: boolean }) {
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
        {VOTES.map((n, i) => {
          const done = i < read
          const good = done && CSE.includes(n)
          const bad = done && !CSE.includes(n)
          const skipped = stopped && i > STOP
          const ring = bad ? colors.danger : good ? colors.success : 'transparent'
          return (
            <div
              key={n}
              className="mt-0.5 flex items-center gap-2 rounded-lg px-1.5 py-[2px]"
              style={{
                background: bad ? '#FDECEC' : good ? '#E9F8EF' : 'transparent',
                boxShadow: bad ? `0 0 0 2px ${ring}, 0 0 14px ${ring}66` : good ? `0 0 0 2px ${ring}` : '0 0 0 0 transparent',
                opacity: skipped ? 0.45 : 1,
                transition: tween,
              }}
            >
              <span className="h-[20px] w-[20px] rounded-full" style={{ background: '#D9DEE6' }} />
              <span className="text-[13px] font-semibold" style={{ color: bad ? colors.danger : good ? '#137A3A' : colors.ink, transition: tween }}>
                {n}
              </span>
              {skipped && (
                <span className="ml-auto whitespace-nowrap rounded px-1 text-[9.5px] font-bold uppercase tracking-wide" style={{ background: colors.surface2, color: colors.muted }}>
                  not checked
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** The name box and the ok box: what `name` and `ok` hold right now. */
function Boxes({ name, ok }: { name: string | null; ok: boolean | null }) {
  const tween = useTween(360)
  const label = 'text-[12px] font-bold uppercase tracking-wider'
  return (
    <div className="flex items-start justify-center gap-3">
      <div className="flex flex-col items-center gap-1">
        <span className={label} style={{ color: colors.muted }}>
          name
        </span>
        <span className="grid h-[40px] min-w-[104px] place-items-center rounded-lg bg-white px-2 font-mono text-[16px] font-bold" style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
          <Swap k={name ?? '-'}>{name ? `'${name}'` : ''}</Swap>
        </span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className={label} style={{ color: colors.muted }}>
          ok
        </span>
        <span
          className="grid h-[40px] w-[92px] place-items-center rounded-lg font-mono text-[18px] font-bold"
          style={{
            background: ok === null ? colors.white : ok ? '#E9F8EF' : '#FDECEC',
            color: ok ? '#137A3A' : colors.danger,
            boxShadow: `inset 0 0 0 ${ok === null ? 1.5 : 3}px ${ok === null ? colors.line : ok ? colors.success : colors.danger}`,
            transition: tween,
          }}
        >
          <Swap k={String(ok)}>{ok === null ? '' : ok ? 'True' : 'False'}</Swap>
        </span>
      </div>
    </div>
  )
}

/* the code panel's rows: the header, then 16px of padding, then one row per line */
const HEAD = 42
const PAD = 16
const ROW = Math.round(H2_CODE_FS * 1.55)
const rowMid = (line: number) => HEAD + PAD + (line - 1) * ROW + ROW / 2

/** The jump out of the loop: an arrow from the end of `break` down to print(ok), drawn as a pen would, in the accent tone. */
function BreakArrow({ on }: { on: boolean }) {
  const instant = useInstant()
  const y0 = rowMid(LN.BREAK)
  const y1 = rowMid(LN.PRINT)
  /* `        break` ends 13 characters in; the arrow starts past it and hooks back onto print(ok) */
  const x0 = 54 + 13 * H2_CODE_FS * 0.6 + 14
  const x1 = 54 + 9 * H2_CODE_FS * 0.6 + 16
  const d = `M${x0} ${y0} C${x0 + 70} ${y0}, ${x0 + 70} ${y1}, ${x1 + 12} ${y1}`
  const t = instant ? 'none' : 'stroke-dashoffset 760ms cubic-bezier(0.65,0,0.35,1)'
  return (
    <svg aria-hidden className="pointer-events-none absolute left-0 top-0 overflow-visible" width={1} height={1} style={{ opacity: on ? 1 : 0, transition: instant ? 'none' : 'opacity 200ms' }}>
      <path d={d} fill="none" stroke={colors.accent} strokeWidth="3.5" strokeLinecap="round" pathLength={1} strokeDasharray="1" style={{ strokeDashoffset: on ? 0 : 1, transition: t }} />
      <path d={`M${x1 + 24} ${y1 - 8} L${x1 + 10} ${y1} L${x1 + 24} ${y1 + 8} Z`} fill={colors.accent} style={{ opacity: on ? 1 : 0, transition: instant ? 'none' : `opacity 240ms cubic-bezier(0.22,1,0.36,1) ${on ? 640 : 0}ms` }} />
    </svg>
  )
}

/** stall_check.py with the lines that ran for the vote on screen lit; from press 7, the one line. */
function Program({ beat }: { beat: number }) {
  const v = voteAt(beat)
  const lines: Record<number, CodeLineState> = {}
  if (v >= 0 && v < STOP) {
    lines[LN.FOR] = 'ran'
    lines[LN.IF] = 'ran'
    lines[LN.IF_PRINT] = 'now'
  }
  if (v === STOP) {
    lines[LN.FOR] = 'ran'
    lines[LN.ELSE] = 'ran'
    lines[LN.ELSE_PRINT] = 'ran'
    lines[LN.FLAG] = 'ran'
    lines[LN.BREAK] = 'now'
  }
  if (beat === 6) lines[LN.PRINT] = 'now'
  const folded = beat >= 7
  return (
    <div className="relative">
      <Code code={folded ? SHORT.src : CHECK.src} fontSize={H2_CODE_FS} rows={folded ? 3 : CHECK.src.split('\n').length} lines={lines} />
      {!folded && <BreakArrow on={beat === 5 || beat === 6} />}
    </div>
  )
}

export function PollHook() {
  const beat = useBeats(7)
  /* press 7: the fold is one movement; the votes circle slides into cse after the code has folded */
  const phase = useStepPhase(beat, [700])
  const v = voteAt(beat)
  /* how many votes the loop has read; after break (press 5) it reads no more */
  const read = beat >= 6 ? STOP + 1 : v + 1
  const stopped = beat >= 5
  const name = v >= 0 ? VOTES[v] : beat === 6 ? VOTES[STOP] : null
  const ok: boolean | null = beat < 3 ? null : v >= 0 && v < STOP ? true : false
  const out = beat >= 7 ? [{ text: SHORT.output }] : beat >= 3 ? OUT_LINES.slice(0, Math.min(beat - 2, OUT_LINES.length)).map((text) => ({ text })) : []
  const slid = beat === 7 && phase >= 1
  const tones: Record<string, ChipTone> = beat === 7 ? { Harsha: 'bad' } : {}
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
          <PollScreen read={read} stopped={stopped} />
        </Phone>
        {/* one fixed size on every press (user, 2026-10-08, slide 17): the panel is the phone's height and ends clear of Next and Autoplay */}
        <Group pad={6} className="flex min-w-0 flex-1 flex-col gap-1.5" active={beat >= 2} style={{ height: 404 }}>
          <StepCaption text={H2.show[beat - 1]} size={17} minH={36} />
          <Show on={beat >= 2}>
            <div className="flex items-start gap-4">
              <div className="w-[692px] shrink-0">
                <Focus on={beat === 2}>
                  <Program beat={beat} />
                </Focus>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                {beat <= 6 && <Boxes name={name} ok={ok} />}
                <OutPanel lines={out} minRows={beat >= 7 ? 1 : 4} fontSize={OUT_FS} className="w-full" />
              </div>
            </div>
          </Show>
          {beat === 7 && (
            <div className="flex justify-center">
              {/* labels at the sides, so the picture is 168px tall and the folded card still fits the 404px panel; chips one size down, so cse's five outer names and the three shared ones all find a row */}
              <Venn
                W={560}
                H={168}
                L={{ cx: 150, cy: 84, r: 78 }}
                R={slid ? { cx: 230, cy: 84, r: 76 } : { cx: 400, cy: 84, r: 76 }}
                left={{ code: 'cse', items: CSE, at: 'left' }}
                right={{ code: 'votes', items: VOTES, at: 'right' }}
                fs={11}
                tones={tones}
              />
            </div>
          )}
        </Group>
      </div>
      <StepControls at={beat} total={7} />
    </>
  )
}
