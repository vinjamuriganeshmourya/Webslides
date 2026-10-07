import { useId, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Avatar, Back, CHAT, Phone, PHONE_LIFT } from './Phone'
import { Boxes, BOX, YouGet, boxX } from './common'

/**
 * THE MESSAGE THE SEARCH CANNOT FIND. PF 15 slide 4, the hook.
 *
 * Six beats, the reference's own:
 *
 *   1  today's chat: "I DID. Check Tuesday"     One of them has to be wrong.
 *   2  search "sorry": no results                The phone agrees with Anjali.
 *   3  Tuesday: there it is, spaced out          So who is lying?
 *   4  the nine boxes of what he typed           Neither.
 *   5  five boxes side by side: S O R            the spaces came too
 *   6  same first box, two at a time: SORRY      there it is
 *
 * The word `slice` is not on this frame (course rule R5): the room has to want
 * "every second box" before it is told that has a name. The boxes and their
 * numbers are the only abstraction, and they arrive on beat 4, after the story.
 */

const TYPED = 'S O R R Y'

function Bubble({ text, time, mine, hit }: { text: ReactNode; time: string; mine?: boolean; hit?: boolean }) {
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className="max-w-[184px] rounded-xl px-2.5 pb-1 pt-1.5 text-[12.5px] leading-snug shadow-sm"
        style={{ background: mine ? CHAT.mine : CHAT.theirs, color: colors.ink }}
      >
        <span
          className={hit ? 'rounded px-1.5 py-0.5 font-mono text-[14px] font-bold tracking-[0.16em]' : ''}
          style={hit ? { background: CHAT.hit } : undefined}
        >
          {text}
        </span>
        <span className="ml-2 inline-flex items-center gap-1 align-bottom text-[10px]" style={{ color: colors.muted }}>
          {time}
          {mine && <span style={{ color: CHAT.tick }}>✓✓</span>}
        </span>
      </div>
    </div>
  )
}

function DateChip({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center">
      <span className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide" style={{ color: colors.body }}>
        {children}
      </span>
    </div>
  )
}

function ChatHeader({ search }: { search: boolean }) {
  return (
    <div className="flex h-[46px] items-center gap-2 px-2.5">
      <Back color={colors.white} />
      {search ? (
        <div className="flex h-[30px] flex-1 items-center gap-2 rounded-full bg-white px-3 font-mono text-[13px]" style={{ color: colors.ink }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={colors.body} strokeWidth="2.6" aria-hidden>
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m20 20-4.8-4.8" strokeLinecap="round" />
          </svg>
          sorry<span className="ml-px inline-block h-[15px] w-[2px] animate-pulse" style={{ background: CHAT.bar }} />
        </div>
      ) : (
        <>
          <Avatar />
          <div className="min-w-0 flex-1 leading-tight text-white">
            <p className="text-[13.5px] font-semibold">Sanjay</p>
            <p className="text-[10px] opacity-85">online</p>
          </div>
          <svg width="17" height="12" viewBox="0 0 24 16" fill="none" stroke="#FFFFFF" strokeWidth="2" aria-hidden>
            <rect x="1" y="2" width="15" height="12" rx="2.5" />
            <path d="m16 7 6-4v10l-6-4" strokeLinejoin="round" />
          </svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden className="ml-1.5">
            <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" />
          </svg>
          <span className="ml-1.5 flex flex-col gap-[2.5px]" aria-hidden>
            {[0, 1, 2].map((i) => (
              <i key={i} className="block h-[3.5px] w-[3.5px] rounded-full bg-white" />
            ))}
          </span>
        </>
      )}
    </div>
  )
}

function ChatScreen({ screen }: { screen: 'today' | 'search' | 'tuesday' }) {
  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{
        background: CHAT.wall,
        backgroundImage: `radial-gradient(${CHAT.wallMark} 1.6px, transparent 1.7px)`,
        backgroundSize: '22px 22px',
      }}
    >
      {screen === 'search' ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
          <span className="grid h-[50px] w-[50px] place-items-center rounded-full bg-white/90">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={colors.muted} strokeWidth="2.4" aria-hidden>
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m20 20-4.8-4.8" strokeLinecap="round" />
            </svg>
          </span>
          <p className="text-[13.5px] font-bold" style={{ color: colors.danger }}>No results found</p>
          <p className="text-[11px]" style={{ color: colors.body }}>No messages match this search</p>
        </div>
      ) : (
        <div className={`flex flex-1 flex-col gap-2 px-2.5 pt-3 ${screen === 'today' ? 'justify-end pb-3' : ''}`}>
          {screen === 'today' ? (
            <>
              <DateChip>Today</DateChip>
              <Bubble mine text="You forgot our 2 weeks" time="9:36" />
              <Bubble mine text="and you never apologised" time="9:37" />
              <Bubble text="I DID. Check Tuesday" time="9:38" />
            </>
          ) : (
            <>
              <DateChip>Tuesday</DateChip>
              <Bubble text="ok listen na" time="7:11" />
              <Bubble hit text={TYPED} time="7:12" />
              <Bubble text="I mean it ya" time="7:12" />
            </>
          )}
        </div>
      )}
      {/* the message bar */}
      <div className="flex items-center gap-2 px-2 pb-4 pt-2">
        <div className="flex h-[34px] flex-1 items-center rounded-full bg-white px-3 text-[12px]" style={{ color: colors.muted }}>
          Message
        </div>
        <span className="grid h-[34px] w-[34px] place-items-center rounded-full" style={{ background: CHAT.bar }}>
          <svg width="12" height="16" viewBox="0 0 14 20" fill="#FFFFFF" aria-hidden>
            <rect x="3.5" y="0.5" width="7" height="12" rx="3.5" />
            <path d="M1 9a6 6 0 0 0 12 0" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
            <rect x="6.1" y="14.5" width="1.8" height="4.5" rx="0.9" />
          </svg>
        </span>
      </div>
    </div>
  )
}

const STORY = [
  'Two weeks together, and Sanjay forgot.',
  'Anjali says he never even apologised.',
  'Sanjay says he said sorry on Tuesday.',
]

const TURN = [
  'One of them has to be wrong.',
  'The phone agrees with Anjali. No match.',
  'There it is, from Tuesday. So who is lying?',
  'Neither. Look at what he actually typed.',
  'Five boxes side by side. That is all we can ask for.',
  'Same first box. It just jumps two at a time.',
]

/**
 * The jumps drawn under the boxes: one arrowed hop from each box read to the
 * next, the same arrow the Extended Slicing frame draws, and the label centred
 * under the hops. Each hop leaves just right of its box's centre and lands just
 * left of the next, so a head never touches the next hop's tail.
 */
function Jumps({ at, label }: { at: number[]; label: string }) {
  const w = 9 * (BOX.md.w + BOX.md.gap) - BOX.md.gap
  const head = `jump-head-${useId().replace(/:/g, '')}`
  return (
    <div className="relative" style={{ width: w, height: 74 }}>
      <svg width={w} height={44} className="absolute left-0 top-0 overflow-visible" aria-hidden>
        <defs>
          <marker id={head} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.4" markerHeight="4.4" orient="auto">
            <path d="M0 0.8 L9.5 5 L0 9.2 Z" fill={colors.brandDark} />
          </marker>
        </defs>
        {at.slice(1).map((i, k) => {
          const a = boxX(at[k], 'md') + 5
          const b = boxX(i, 'md') - 5
          const depth = Math.min(34, (b - a) * 0.55)
          return (
            <path
              key={i}
              d={`M${a} 4 Q ${(a + b) / 2} ${4 + depth * 2} ${b} 6`}
              fill="none"
              stroke={colors.brandDark}
              strokeWidth="2.5"
              strokeLinecap="round"
              markerEnd={`url(#${head})`}
            />
          )
        })}
      </svg>
      <p
        className="absolute top-[46px] font-heading text-[18px] font-bold leading-none"
        style={{ left: (boxX(at[0], 'md') + boxX(at[at.length - 1], 'md')) / 2, transform: 'translateX(-50%)', color: colors.brandDark, whiteSpace: 'nowrap' }}
      >
        {label}
      </p>
    </div>
  )
}

export function ChatHook() {
  const beat = useBeats(6)
  const tween = useTween(460)
  const screen = beat === 1 ? 'today' : beat === 2 ? 'search' : 'tuesday'
  const strip = beat >= 4
  const got = beat === 5 ? 'S O R' : beat === 6 ? 'SORRY' : ''
  const jumps = beat === 5 ? [0, 1, 2, 3, 4] : beat === 6 ? [0, 2, 4, 6, 8] : null
  const read = new Set(jumps ?? [])

  /* Three layers, three sizes: the story (quiet, regular), the turn (the blue
     line, the loudest text), then the boxes and what you get. */
  return (
    <>
      <div className="flex items-start gap-14">
        <div style={{ marginTop: -PHONE_LIFT }}>
          <Phone top={{ bg: CHAT.bar, light: true, header: <ChatHeader search={screen === 'search'} /> }}>
            <ChatScreen screen={screen} />
          </Phone>
        </div>

        <div className="flex min-w-0 flex-1 flex-col" style={{ paddingTop: strip ? 0 : 72, transition: tween }}>
          <div className="flex flex-col gap-1" style={{ fontSize: strip ? 18 : 22, color: colors.body, transition: tween }}>
            {STORY.map((l) => (
              <p key={l} className="leading-snug">{l}</p>
            ))}
          </div>
          <p className="mt-4 font-heading font-bold leading-snug" style={{ fontSize: strip ? 22 : 26, color: colors.brandDark, transition: tween }}>
            {TURN[beat - 1]}
          </p>

          <div className="mt-6 flex w-fit flex-col" style={{ opacity: strip ? 1 : 0, transition: tween }}>
            <Boxes
              chars={[...TYPED]}
              size="md"
              states={Object.fromEntries([...read].map((i) => [i, 'hit' as const]))}
            />
            <div className="mt-2 h-[74px]">{jumps && <Jumps at={jumps} label={beat === 5 ? 'one box further' : 'two boxes further'} />}</div>
            {/* The result row, centred under the boxes it was read from. */}
            <div className="mt-2 flex justify-center">
              <YouGet value={got} size={28} note={beat === 5 ? 'the spaces came too' : beat === 6 ? 'there it is' : undefined} />
            </div>
          </div>
        </div>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}
