import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors, easing } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Ask, sentences } from './pieces'
import { StepCaption } from './trace'
import { CallCode } from './call'
import { Phone, CHAT } from './Phone'
import { AnimatePresence } from 'framer-motion'
import { Bubble, Cake, CakeBox } from './People'
import { AMMA, BAKER, Idling, Posed, RAHUL, RIYA, TEJA } from './Cast'
import { PartyTV } from './Game'
import { TokenRing } from './call'
import { useRef } from 'react'
import { SPEC } from './spec'

/**
 * THE THREE WORLD CARDS OF PF 22, all at Teja's party (spec note 2):
 *
 *   SongHook    H1, the song three times in one night; the last press folds
 *               the three copies into ONE named card with the lines indented
 *               under its name, and three tags pointing at it. No code, no
 *               session name, no code word (its must_not lines).
 *   OneSongHook H2, the same program at Rahul's party sings dear Teja; one
 *               function per friend; the counters; one song with a slot.
 *   Bakery      C10, shout it or hand it over: print and return, no code.
 *
 * Nothing moves by itself: every change waits for a press.
 */

/* ================================================================== H1 */

const H1 = SPEC.H1
const SONG: string[] = H1.data.song
const TIMELINE: { time: string; event: string }[] = H1.data.timeline

function Note({ size = 16, color = colors.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M9 18V5l11-2v13" fill="none" stroke={color} strokeWidth={2.4} strokeLinejoin="round" />
      <circle cx="6.5" cy="18" r="3" fill={color} />
      <circle cx="17.5" cy="16" r="3" fill={color} />
    </svg>
  )
}

/** The four lines, small, under a timeline moment or over the cake. */
function SongLines({ on, light = false, size = 15, delay = 0 }: { on: boolean; light?: boolean; size?: number; delay?: number }) {
  const instant = useInstant()
  return (
    <div className="flex flex-col">
      {SONG.map((l, i) => (
        <motion.span
          key={i}
          className="block whitespace-nowrap font-semibold italic"
          style={{ fontSize: size, lineHeight: `${size * 1.32}px`, color: light ? '#FFF1C2' : colors.body }}
          initial={false}
          animate={{ opacity: on ? 1 : 0, y: on ? 0 : 6 }}
          transition={{ duration: instant ? 0 : 0.52, delay: instant || !on ? 0 : delay + i * 0.13, ease: easing.soft }}
        >
          {l}
        </motion.span>
      ))}
    </div>
  )
}

/** One moment of the night, as a phone notification. */
function Moment({ time, event, sung, on, copy, tag }: { time: string; event: string; sung: boolean; on: boolean; copy: boolean; tag: boolean }) {
  const tween = useTween(480)
  return (
    <div style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(8px)', transition: tween }}>
      <div className="flex h-[46px] items-center gap-3 rounded-2xl bg-white px-3.5" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}, 0 6px 14px -8px rgba(16,32,58,0.18)` }}>
        <span className="whitespace-nowrap rounded-md px-2 py-0.5 font-mono text-[14px] font-bold" style={{ background: colors.surface2, color: colors.brandDark }}>
          {time}
        </span>
        <span className="min-w-0 flex-1 text-[16px] font-semibold leading-snug" style={{ color: colors.ink }}>
          {event.replace(/\.$/, '')}
        </span>
        <span style={{ opacity: sung ? 1 : 0, transition: tween }}>
          <Note />
        </span>
      </div>
      <div className="relative ml-4" style={{ height: 80 }}>
        <div className="absolute left-2 top-1.5">
          <SongLines on={copy && !tag} size={14} />
        </div>
        {tag && (
          <span className="sm-bump absolute right-0 top-2 inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill px-3 py-1 text-[15px] font-bold" style={{ background: '#FFF4EC', color: colors.accentDark, boxShadow: `inset 0 0 0 1.5px ${colors.accent}` }}>
            <Note size={14} />
            Happy birthday song!
          </span>
        )}
      </div>
    </div>
  )
}

/** The phone on the table: the lock screen at midnight, then the video call. */
function PartyPhone({ call }: { call: boolean }) {
  return (
    <div style={{ transform: 'scale(0.627)', transformOrigin: 'top right' }}>
      <Phone
        time={call ? '12:20' : '12:00'}
        top={
          call
            ? {
                bg: CHAT.bar,
                light: true,
                header: (
                  <div className="flex flex-col items-center pb-2 pt-1 text-white">
                    <span className="text-[16px] font-bold">Amma</span>
                    <span className="text-[11px] opacity-80">Video call</span>
                  </div>
                ),
              }
            : { bg: colors.night3, light: true, header: null }
        }
      >
        {call ? (
          <div className="relative h-full" style={{ background: '#1D2B26' }}>
            {/* Amma's tile */}
            <div className="absolute inset-x-2.5 top-2.5 bottom-[66px] overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(180deg,#3E5F55,#24413A)' }}>
              <div className="absolute inset-x-0 bottom-0 flex justify-center">
                <Posed cfg={AMMA} expression="happy" gesture="wave" at={0.9} scale={0.46} crop={{ x0: 60, y0: 10, x1: 340, y1: 392 }} />
              </div>
              <span className="absolute left-2 top-2 rounded-md bg-black/35 px-1.5 py-0.5 text-[11px] font-semibold text-white">Amma</span>
            </div>
            {/* the room's own small tile */}
            <div className="absolute right-4 top-4 h-[66px] w-[48px] overflow-hidden rounded-lg ring-2 ring-white/70" style={{ background: colors.night2 }}>
              <div className="absolute inset-0 flex justify-center">
                <Posed cfg={TEJA} expression="grin" scale={0.3} crop={{ x0: 120, y0: 40, x1: 280, y1: 260 }} />
              </div>
            </div>
            {/* call buttons */}
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-4">
              {['#3A4A44', '#3A4A44', colors.danger].map((c, i) => (
                <span key={i} className="grid h-10 w-10 place-items-center rounded-full" style={{ background: c }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round">
                    {i === 0 && <path d="M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3" />}
                    {i === 1 && <path d="M3 7h12v10H3zM15 10l6-3v10l-6-3" />}
                    {i === 2 && <path d="M4 14c4-4 12-4 16 0l-2 3-3-1v-2c-2-.6-4-.6-6 0v2l-3 1z" fill="#fff" stroke="none" />}
                  </svg>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center pt-10" style={{ background: `linear-gradient(180deg, ${colors.night3}, ${colors.night})` }}>
            <span className="font-heading text-[54px] font-bold leading-none text-white">12:00</span>
            <span className="mt-1 text-[15px] font-semibold text-white/70">AM</span>
            <div className="mx-3 mt-8 rounded-2xl bg-white/12 px-3 py-2 text-[12px] font-semibold text-white/85" style={{ background: 'rgba(255,255,255,0.12)' }}>
              Teja's birthday today
            </div>
          </div>
        )}
      </Phone>
    </div>
  )
}

/** The hostel room at night: window, string lights, friends, the cake on a table. */
function Room() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[22px]" style={{ background: `linear-gradient(180deg, ${colors.night2} 0%, ${colors.night3} 100%)` }}>
      <svg className="absolute inset-0" width="100%" height="100%" viewBox="0 0 528 300" preserveAspectRatio="xMidYMax slice" aria-hidden>
        {/* window with the moon */}
        <rect x={24} y={20} width={112} height={84} rx={8} fill="#0A1633" stroke="#2A3E6E" strokeWidth={4} />
        <path d="M80 20 V 104 M24 62 H 136" stroke="#2A3E6E" strokeWidth={3} />
        <circle cx={112} cy={40} r={11} fill="#FFF1C2" />
        <circle cx={107} cy={36} r={10} fill="#0A1633" />
        {[[40, 36], [56, 88], [118, 90], [96, 78]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.6} fill="#FFFFFF" opacity={0.8} />
        ))}
        {/* string lights */}
        <path d="M160 10 Q 340 44 520 12" fill="none" stroke="#3B4C77" strokeWidth={2} />
        {Array.from({ length: 10 }, (_, i) => {
          const t = i / 9
          const x = 160 + t * 360
          const y = 10 * (1 - t) + 12 * t + 4 * 30 * t * (1 - t) * 0.95
          return <circle key={i} cx={x} cy={y + 5} r={4.5} fill={['#FFC46A', '#FF8A3D', '#7FD8CF'][i % 3]} opacity={0.95} />
        })}
        {/* table */}
        <rect x={10} y={250} width={508} height={16} rx={6} fill="#6B4A33" />
        <rect x={10} y={264} width={508} height={40} fill="#4E3524" />
      </svg>
      {/* friends behind the table */}
      {/* friends behind the table, from the Character Lab: Rahul left, Teja and Riya right. Each holds one
          base pose for the whole slide, alive with breathing, a slow sway and a small hand drift (user, 2026-10-07) */}
      <div className="absolute bottom-[50px] left-[4px] flex items-end gap-0">
        <Idling cfg={RAHUL} expression="happy" seed={5} scale={0.41} />
      </div>
      <div className="absolute bottom-[50px] right-[4px] flex items-end gap-1.5">
        <Idling cfg={TEJA} expression="happy" seed={7} scale={0.43} />
        <Idling cfg={RIYA} expression="happy" seed={9} scale={0.41} crop={{ x0: 90, y0: 0, x1: 310, y1: 392 }} />
      </div>
      {/* the cake */}
      <div className="absolute bottom-[50px] left-1/2 -translate-x-1/2">
        <Cake width={160} />
      </div>
    </div>
  )
}

/** The card the three copies fold into: the name, the four lines indented under it. */
function SongCard({ on }: { on: boolean }) {
  const instant = useInstant()
  return (
    <motion.div
      className="rounded-card bg-white px-6 py-5"
      style={{ boxShadow: `inset 0 0 0 2px ${colors.accent}, 0 18px 36px -18px rgba(16,32,58,0.35)`, width: 430 }}
      initial={false}
      animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.94 }}
      transition={{ duration: instant ? 0 : 0.86, ease: easing.soft }}
    >
      <div className="flex items-center gap-2.5">
        <Note size={24} />
        <span className="font-heading text-[26px] font-bold leading-tight" style={{ color: colors.ink }}>
          Happy birthday song
        </span>
      </div>
      <div className="mt-3 flex">
        <span className="mr-4 w-7 shrink-0 rounded-md" style={{ background: colors.surface, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }} />
        <div className="flex flex-col gap-1 py-1">
          {SONG.map((l, i) => (
            <span key={i} className="text-[20px] font-semibold italic" style={{ color: colors.body }}>
              {l}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/**
 * IT IS TEJA'S BIRTHDAY. Spec card H1, six presses.
 *
 *   1  the hostel room at midnight, the phone at 12:00 AM, the cake; the
 *      timeline's first moment; the caption
 *   2  the song over the cake; the moment gets its song mark
 *   3  12:20 AM, Amma video-calls: the phone becomes the call
 *   4  the song again under 12:20, then 12:45 and a third time: twelve lines
 *   5  did anyone write the song down first?
 *   6  the turn: the three copies fold into ONE card, its name on top and the
 *      four lines indented under it; each moment keeps only a tag, with an
 *      arrow to the card
 */
export function SongHook() {
  const beat = useBeats(6)
  const tween = useTween(600)
  const folded = beat >= 6
  const caption = beat >= 6 ? H1.show[7] : beat >= 5 ? H1.show[6] : beat >= 3 ? H1.show[5] : H1.show[0]
  /* the tags' rows, for the arrows: each moment is 46px, its slot 80px, gaps 10px */
  const tagY = [0, 1, 2].map((i) => i * (46 + 80 + 10) + 46 + 8 + 15)
  return (
    <>
      <div className="flex items-start gap-0">
        <div className="relative flex w-[380px] shrink-0 flex-col gap-2.5">
          {TIMELINE.map((m, i) => (
            <Moment
              key={m.time}
              time={m.time}
              event={m.event}
              on={i === 0 || (i === 1 && beat >= 3) || (i === 2 && beat >= 4)}
              sung={(i === 0 && beat >= 2) || (i === 1 && beat >= 4) || (i === 2 && beat >= 4)}
              copy={i > 0 && beat >= 4}
              tag={folded}
            />
          ))}
        </div>
        {/* the arrows from each tag to the card: drawn only when folded, in the gap, never over a box */}
        <svg className="shrink-0 overflow-visible" width={86} height={400} aria-hidden>
          {folded &&
            tagY.map((y, i) => {
              const to = 108 + i * 44
              return (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.52, delay: 0.5 + i * 0.13, ease: easing.soft }}>
                  <path d={`M 2 ${y} H ${18 + i * 22} V ${to} H 72`} fill="none" stroke={colors.accent} strokeWidth={2.5} strokeDasharray="6 5" strokeLinejoin="round" />
                  <path d={`M 81 ${to} L 72 ${to - 5} L 72 ${to + 5} Z`} fill={colors.accent} />
                </motion.g>
              )
            })}
        </svg>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="relative w-full" style={{ height: 300 }}>
          {/* the scene */}
          <div className="absolute inset-0 flex gap-3" style={{ opacity: folded ? 0 : 1, transition: tween }}>
            <div className="relative h-full min-w-0 flex-1">
              <Room />
              <div className="absolute left-1/2 top-[20px] -translate-x-1/2 rounded-xl px-4 py-1.5" style={{ background: beat >= 2 && !folded ? 'rgba(8,16,38,0.55)' : 'transparent', transition: tween }}>
                <SongLines on={beat >= 2 && !folded} light size={16} />
              </div>
            </div>
            <div className="relative w-[146px] shrink-0">
              <div className="absolute right-0 top-0">
                <PartyPhone call={beat >= 3} />
              </div>
            </div>
          </div>
          {/* the card */}
          <div className="absolute left-0 top-[30px]">
            <SongCard on={folded} />
          </div>
        </div>
        <StepCaption key={caption} text={caption} tone={folded ? 'rule' : 'step'} size={20} minH={48} />
        </div>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ================================================================== H2 */

const H2 = SPEC.H2
const [PARTY, PER_FRIEND, ONE_SONG] = H2.code as { src: string; output: string }[]

/** A stat tile: the number large, the words under it. */
function Counter({ big, words, on, tone }: { big: string; words: string; on: boolean; tone: string }) {
  const tween = useTween(480)
  return (
    <div className="flex flex-1 flex-col gap-0.5 rounded-card bg-white px-4 py-2" style={{ boxShadow: `inset 0 0 0 2px ${tone}`, opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(8px)', transition: tween }}>
      <span className="font-heading text-[34px] font-bold leading-none" style={{ color: tone }}>
        {big}
      </span>
      <span className="text-[17px] font-semibold leading-snug" style={{ color: colors.body }}>
        {words}
      </span>
    </div>
  )
}

/**
 * NEXT WEEK: RAHUL'S BIRTHDAY. Spec card H2, five presses: party.py on the
 * party TV; it sings dear Teja, that line red; the long way, one def per
 * friend; the two counters (the real counts: 12 def lines for 3 friends, 180
 * for 60); the short way, `friend` in the brackets, its output the same as
 * the long way's, the slot ringed and named.
 */
export function OneSongHook() {
  const beat = useBeats(5)
  const host = useRef<HTMLDivElement>(null)
  const prog = beat >= 5 ? ONE_SONG : beat >= 3 ? PER_FRIEND : PARTY
  const tvLines = beat >= 3 ? PER_FRIEND.output.split('\n') : beat >= 2 ? PARTY.output.split('\n') : []
  const shownLines = beat >= 5 ? ONE_SONG.output.split('\n') : tvLines
  const red = beat === 2 ? PARTY.output.split('\n').indexOf('Happy birthday dear Teja') : -1
  const caption = beat >= 5 ? H2.show[5] : beat >= 3 ? H2.show[2] : beat >= 2 ? H2.show[1] : H2.show[0]
  const fs = beat >= 3 && beat < 5 ? 13 : beat >= 5 ? 14 : 16
  const d = H2.data
  return (
    <>
      <div className="flex items-start gap-7">
        <div ref={host} className="relative shrink-0" style={{ width: 486, marginTop: beat >= 5 ? 52 : 0 }}>
          <CallCode key={prog.src} code={prog.src} fs={fs} />
          <TokenRing host={host} line={1} token="friend" on={beat >= 5} label={beat >= 5 ? sentences(H2.show[6])[0] : null} side="above" lift={74} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-center gap-3">
          <PartyTV lines={shownLines} w={420} h={beat >= 3 ? 190 : 160} red={red} label="Rahul's party" />
          <StepCaption key={caption} text={caption} size={20} minH={48} tone={beat >= 5 ? 'rule' : 'step'} />
          <div className="flex w-full gap-3" style={{ display: beat >= 4 ? 'flex' : 'none' }}>
            <Counter big={String(d.long_lines)} words={sentences(H2.show[3])[0]} on={beat >= 4} tone={colors.accent} />
            <Counter big={String(d.class_def_lines)} words={sentences(H2.show[4])[0]} on={beat >= 4} tone={colors.danger} />
          </div>
        </div>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}

/* ================================================================== C10 */

const C10 = SPEC.C10

/** The bakery's front: an awning, a counter, the shop sign. */
function Shop({ children, width = 520, height = 226 }: { children: ReactNode; width?: number; height?: number }) {
  /* the counter sits in front of the people, so a half-body figure stands behind it */
  return (
    <div className="relative overflow-hidden rounded-[20px]" style={{ width, height, background: '#FFF8F0', boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
      <svg className="absolute inset-x-0 top-0" width={width} height={34} aria-hidden>
        {Array.from({ length: Math.ceil(width / 40) }, (_, i) => (
          <path key={i} d={`M ${i * 40} 0 H ${i * 40 + 40} V 22 Q ${i * 40 + 20} 36 ${i * 40} 22 Z`} fill={i % 2 ? '#FFFFFF' : colors.accent} />
        ))}
      </svg>
      {children}
      <div className="absolute inset-x-0 bottom-0 z-10 h-[64px]" style={{ background: '#C9935F', boxShadow: 'inset 0 6px 0 #DDAA75' }} />
    </div>
  )
}

/**
 * SHOUT IT, OR HAND IT OVER? Spec card C10, four presses, no code (its
 * must_not). Rahul at the counter; way A, the baker shouts the words and
 * Rahul leaves with empty hands (print); way B, the baker hands over the cake
 * with the words on it (return); both side by side and the question.
 */
export function Bakery() {
  const beat = useBeats(4)
  const instant = useInstant()
  /* One house curve and one duration for every change on this card: the
     scene leaves, the two ways arrive, way B and the question reveal, all at
     520ms on easing.soft, transform and opacity only (generate-slides 4b). */
  const T = { duration: instant ? 0 : 0.52, ease: easing.soft }
  /* The two stages cross-dissolve in place: the counter scene fades out over
     420ms while the two ways fade up over 520ms starting 120ms in, so there
     is never an empty frame between them and nothing jumps. */
  const enter = () => ({
    initial: instant ? false : ({ opacity: 0, y: 12 } as const),
    animate: { opacity: 1, y: 0, transition: { ...T, delay: instant ? 0 : 0.12 } },
    exit: { opacity: 0, y: -6, transition: { duration: instant ? 0 : 0.42, ease: easing.soft } },
  })
  return (
    <>
      <div className="relative" style={{ height: 410 }}>
      <AnimatePresence initial={false}>
        {beat === 1 ? (
          <motion.div key="counter" className="absolute inset-x-0 top-0 flex justify-center" {...enter()}>
            <Shop width={760} height={400}>
              <div className="absolute bottom-[40px] left-[96px]">
                <Posed key="rahul-ask" cfg={RAHUL} expression="happy" gesture="presentRight" amplitude={0.72} at={1.0} say="Write Happy Birthday Teja on the cake" scale={0.66} crop={{ x0: 60, y0: 30, x1: 400, y1: 392 }} />
              </div>
              <div className="absolute bottom-[40px] right-[120px]">
                <Posed key="baker-listen" cfg={BAKER} props expression="listening" scale={0.66} crop={{ x0: 90, y0: 0, x1: 310, y1: 392 }} />
              </div>
              <div className="absolute left-[300px] top-[64px] w-[250px]">
                <Bubble tail="left" size={20}>
                  {C10.show[0].replace(/\.$/, '')}
                </Bubble>
              </div>
            </Shop>
          </motion.div>
        ) : (
          <motion.div key="ways" className="absolute inset-x-0 top-0 flex flex-col gap-3" {...enter()}>
            <div className="flex justify-center gap-6">
              {/* way A: print */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[15px] font-bold uppercase tracking-wider" style={{ color: colors.accentDark }}>
                  Way A
                </span>
                <Shop>
                  <div className="absolute bottom-[40px] right-[30px]">
                    <Posed key="baker-shout" cfg={BAKER} props expression="excited" gesture="handsSpread" at={1.0} say="Happy Birthday Teja" scale={0.45} crop={{ x0: 60, y0: 0, x1: 340, y1: 392 }} />
                  </div>
                  <div className="absolute right-[150px] top-[34px]">
                    <Bubble tone="shout" tail="right" size={19}>
                      {C10.show[1]}
                    </Bubble>
                  </div>
                  <div className="absolute bottom-[40px] left-[22px]">
                    <Posed key="rahul-empty" cfg={RAHUL} expression="sad" gesture="shrug" at={1.0} scale={0.42} crop={{ x0: 40, y0: 30, x1: 360, y1: 392 }} />
                  </div>
                </Shop>
                <StepCaption text={C10.show[2]} size={17} minH={52} />
              </div>
              {/* way B: return */}
              <motion.div
                className="flex flex-col gap-2.5"
                initial={false}
                animate={{ opacity: beat >= 3 ? 1 : 0, y: beat >= 3 ? 0 : 14 }}
                transition={T}
              >
                <span className="text-[15px] font-bold uppercase tracking-wider" style={{ color: colors.success }}>
                  Way B
                </span>
                <Shop>
                  <div className="absolute bottom-[40px] right-[22px]">
                    {beat >= 3 && <Posed key="baker-hand" cfg={BAKER} props expression="happy" gesture="presentLeft" amplitude={0.72} at={1.0} scale={0.45} crop={{ x0: 0, y0: 0, x1: 310, y1: 392 }} />}
                  </div>
                  <div className="absolute bottom-[40px] left-[40px]">
                    {beat >= 3 && (
                      <Posed key="rahul-carry" cfg={RAHUL} expression="happy" gesture="namaste" at={1.0} scale={0.45}>
                        {/* the cake box, held in both hands at the chest */}
                        <div className="absolute" style={{ left: (200 - 76 - 90) * 0.45, top: (226 - 30) * 0.45 }}>
                          <CakeBox width={152 * 0.45} />
                        </div>
                      </Posed>
                    )}
                  </div>
                </Shop>
                <StepCaption text={beat >= 3 ? C10.show[3] : null} size={17} minH={52} />
              </motion.div>
            </div>
            <motion.div className="flex justify-center" initial={false} animate={{ opacity: beat >= 4 ? 1 : 0, y: beat >= 4 ? 0 : 10 }} transition={T}>
              <Ask size={26}>{C10.show[4]}</Ask>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}

export { sentences }
