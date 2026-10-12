import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Group } from './common'
import { Swap } from './pieces'
import { StepCaption } from './trace'
import { useStepPhase } from './phase'
import { Back, CHAT, LiveClock, Phone } from './Phone'
import { CRICKET, CSE, GroupIcon, Venn, pair } from './venn'
import { Face } from './people'
import { SPEC } from './spec'

/**
 * H1 · 8 PLUS 7 IS 12. Six presses, no code, and neither "set" nor "union"
 * anywhere on the card (its must_not lines).
 *
 * Teja's phone in a chat app drawn to look like the real one (the green bar,
 * the group icons, the grey Already added rows, the green ticks), with no
 * product name or logo (content rule 12). Beside it the two group info
 * cards, as the app shows them, You first. The last press is the turn: the
 * two cards lift into two circles of name chips that slide together and
 * overlap, Teja, Ravi and Kiran settling in the middle. The circles are drawn
 * beside the phone, never inside the app. Both groups keep all 8 and 7 the
 * whole card.
 */
const H1 = SPEC.H1
const D = H1.data
const ALREADY: string[] = D.already_added
const NEWLY: string[] = D.newly_added

/** A group's members as the app lists them: You first, then A to Z. */
const members = (g: string[]) => ['You', ...g.filter((n) => n !== 'Teja').sort()]

/* ------------------------------------------------------------ the screens */

function Bar({ title, sub, back = false }: { title: string; sub?: string; back?: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3 pb-2.5 pt-1">
      {back && <Back color={colors.white} />}
      <div className="flex min-w-0 flex-col">
        <span className="text-[15px] font-bold leading-tight text-white">{title}</span>
        {sub && <span className="text-[11px] leading-tight text-white/80">{sub}</span>}
      </div>
    </div>
  )
}

function ChatRow({ name, last, unread, group = true, tone }: { name: string; last: string; unread?: number; group?: boolean; tone?: string }) {
  return (
    <div className="flex items-center gap-2 px-2.5 py-[6px]">
      {/* a group keeps its group icon; a person is a character-lab face (user, 2026-10-08, slide 4) */}
      {group ? <GroupIcon tone={tone ?? '#7A8B99'} size={34} /> : <Face name={name} size={34} />}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="whitespace-nowrap text-[13px] font-semibold leading-tight" style={{ color: colors.ink }}>
          {name}
        </span>
        <span className="whitespace-nowrap text-[11px] leading-tight" style={{ color: '#6B7A86' }}>
          {last}
        </span>
      </div>
      <span className="flex w-[20px] shrink-0 justify-end">
        {unread ? (
          <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[10px] font-bold text-white" style={{ background: '#25C063' }}>
            {unread}
          </span>
        ) : null}
      </span>
    </div>
  )
}

function ChatList() {
  return (
    <div className="flex flex-col pt-1">
      <ChatRow name="CSE-A gang" last="Anu: notes pls" unread={12} tone={colors.brandDark} />
      <ChatRow name="Hostel cricket" last="Harsha: nets 6" unread={5} tone={colors.tealDark} />
      <ChatRow name="Amma" last="Call me later" group={false} />
      <ChatRow name="Lab batch 3" last="Ravi: record due" />
      <ChatRow name="Pooja" last="ok" group={false} />
    </div>
  )
}

/** The group info screen: the icon, the name, `Group · n members`, Add participants. */
function GroupInfo({ count, tap }: { count: number; tap: boolean }) {
  return (
    <div className="flex flex-col items-center pt-2">
      <GroupIcon tone={colors.accentDark} size={56} />
      <span className="mt-2 text-[16px] font-bold" style={{ color: colors.ink }}>
        Fest crew
      </span>
      <Swap k={count}>
        <span className="text-[12px]" style={{ color: '#6B7A86' }}>
          Group · {count} members
        </span>
      </Swap>
      <div className="mt-2 w-full border-t" style={{ borderColor: '#E3E8EC' }}>
        <div className="flex items-center gap-2.5 px-3 py-2" style={{ background: tap ? '#E7F5EE' : 'transparent', transition: 'background-color 420ms' }}>
          <span className="grid h-[30px] w-[30px] place-items-center rounded-full text-[18px] font-bold text-white" style={{ background: '#25C063' }}>
            +
          </span>
          <span className="text-[13px] font-semibold" style={{ color: colors.ink }}>
            Add participants
          </span>
        </div>
        {['You', 'Anu', 'Divya'].map((n) => (
          <div key={n} className="flex items-center gap-2.5 px-3 py-[5px]">
            <Face name={n} size={26} />
            <span className="text-[12.5px]" style={{ color: colors.ink }}>
              {n}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Add participants, Hostel cricket's people: two grey and already in, four ticked. */
function AddParticipants() {
  const rows = [...CRICKET.filter((n) => n !== 'Teja')].sort()
  return (
    <div className="flex flex-col pt-1">
      {rows.map((n) => {
        const already = ALREADY.includes(n)
        return (
          <div key={n} className="flex items-center gap-2 px-2.5 py-[4px]" style={{ opacity: already ? 0.55 : 1 }}>
            <Face name={n} size={30} />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-[13px] font-semibold leading-tight" style={{ color: colors.ink }}>
                {n}
              </span>
              {already && (
                <span className="whitespace-nowrap text-[10px] leading-tight" style={{ color: '#6B7A86' }}>
                  Already added to the group
                </span>
              )}
            </div>
            {!already && (
              <span className="grid h-[16px] w-[16px] shrink-0 place-items-center rounded-full text-[9px] font-bold text-white" style={{ background: '#25C063' }}>
                ✓
              </span>
            )}
          </div>
        )
      })}
      <div className="mt-1 flex items-center justify-between px-3">
        <span className="text-[11px]" style={{ color: '#6B7A86' }}>
          {NEWLY.length} selected
        </span>
        <span className="grid h-[34px] w-[34px] place-items-center rounded-full text-[16px] font-bold text-white" style={{ background: '#25C063', boxShadow: '0 6px 14px -6px rgba(0,0,0,0.4)' }}>
          ✓
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ the cards */

/** A group info card beside the phone: its name, `n members`, the list, You first. */
function InfoCard({ name, tone, list }: { name: string; tone: string; list: string[] }) {
  return (
    <div className="flex w-[232px] flex-col rounded-2xl bg-white" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}, 0 10px 24px -16px rgba(16,32,58,0.35)` }}>
      <div className="flex items-center gap-2.5 border-b px-3.5 py-2.5" style={{ borderColor: colors.line }}>
        <GroupIcon tone={tone} size={30} />
        <div className="flex flex-col">
          <span className="text-[15px] font-bold leading-tight" style={{ color: colors.ink }}>
            {name}
          </span>
          <span className="text-[12.5px] font-semibold leading-tight" style={{ color: colors.body }}>
            {list.length} members
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 px-3.5 py-2.5">
        {list.map((n) => (
          <span key={n} className="whitespace-nowrap text-[14px] font-semibold leading-snug" style={{ color: n === 'You' ? colors.brandDark : colors.ink }}>
            {n}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ the card */

const VW = 560
const VH = 312

export function GroupHook() {
  const beat = useBeats(6)
  /* the turn: the circles mount apart, as the two cards stood, then slide together */
  const phase = useStepPhase(beat, [650])
  const together = beat === 6 && phase >= 1
  const apart = pair(VW, VH, 128, 290, 14)
  const near = pair(VW, VH, 128, 150, 14)
  const g = together ? near : apart
  let screen: ReactNode
  let head: ReactNode
  if (beat <= 2) {
    screen = <ChatList />
    head = <Bar title="Chats" />
  } else if (beat === 4) {
    screen = <AddParticipants />
    head = <Bar title="Add participants" sub="Hostel cricket" back />
  } else {
    screen = <GroupInfo count={beat >= 5 ? D.fest_members : CSE.length} tap={beat === 3} />
    head = <Bar title="Group info" back />
  }
  const key = beat <= 2 ? 'list' : beat === 4 ? 'add' : 'info'
  return (
    <>
      <div className="flex items-start gap-6">
        <Phone width={196} height={404} time={<LiveClock />} island={null} top={{ bg: CHAT.bar, light: true, header: <Swap k={key}>{head}</Swap> }}>
          <div className="relative h-full overflow-hidden">
            <Swap k={key} from="right" overlay>
              {screen}
            </Swap>
          </div>
        </Phone>
        <Group className="flex min-w-0 flex-1 flex-col gap-3" pad={12} active={beat >= 2} style={{ height: 404 }}>
          <StepCaption text={H1.show[beat - 1]} size={19} minH={52} />
          <div className="relative grid min-h-0 flex-1 place-items-center">
            {beat < 6 ? (
              <Swap k={beat >= 2 ? 'cards' : 'none'}>
                {beat >= 2 ? (
                  <div className="flex items-start gap-6">
                    <InfoCard name="CSE-A gang" tone={colors.brandDark} list={members(CSE)} />
                    <InfoCard name="Hostel cricket" tone={colors.tealDark} list={members(CRICKET)} />
                  </div>
                ) : (
                  <span />
                )}
              </Swap>
            ) : (
              <Venn W={VW} H={VH} L={g.L} R={g.R} left={{ label: 'CSE-A gang', items: CSE }} right={{ label: 'Hostel cricket', items: CRICKET }} fs={15} tones={together ? { Teja: 'lit', Ravi: 'lit', Kiran: 'lit' } : {}} />
            )}
          </div>
        </Group>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}
