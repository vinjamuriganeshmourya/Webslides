import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Memory, usePhase, type MNode, type MTag } from './memory'
import { StepCaption } from './trace'
import { SPEC } from './spec'

/**
 * HOOK H1: SHARE IT OR COPY IT? Five presses, no code, no topic name.
 *
 * Your phone with the Road Trip songs on Spotify; Kiran wants them. Two ways,
 * drawn as the app's own menu items: Way A invites Kiran as a collaborator
 * (one playlist, two people), Way B makes Kiran a copy (two playlists). On
 * both of Kiran's phones song 3 gets a swipe and a Remove tap; your phones do
 * not change yet. The room votes, Way A then Way B. Then the result: in Way A
 * the row slides out of YOUR phone too (a collaborator who removes a song
 * removes it for everyone, which is real Spotify behaviour); in Way B your
 * phone keeps all four. The last press is one movement: the phones fade back
 * and leave what they stand for, two name tags with arrows into ONE row (Way
 * A) and two tags into TWO rows (Way B), the picture the session uses.
 *
 * THE PHONES ARE DRAWN AS THE REAL THING (course rules R5, R5b): status bar,
 * cover art, the title, the owners, the count, the green play button, the
 * rows with their artwork, the swipe and the Remove action, collaborator
 * avatars on Way A. Spotify's dark shell and green are the drawn app's own
 * colours and stay inside the phones (content rule 37); the mark is the
 * library's `companies/spotify.png` (rules 12, 13). Nothing on the frame says
 * `list` (spec rule 4), and nothing moves until a press (its must_not); the
 * swipe, the tap and the removal are movement inside one press.
 */

/* Spotify's own colours, inside the drawn phones only (content rule 37). */
const SHELL = '#121212'
const SHEET = '#282828'
const GREEN = '#1DB954'
const DIM = '#B3B3B3'
const BEZEL = '#15191F'
const REMOVE = '#E22134'
/* the glow the cover art casts down the screen */
const GLOW = '#5A3A2A'

const H1 = SPEC.H1
const SONGS: string[] = H1.data.songs
const ALBUM: Record<string, string> = { Chuttamalle: 'Devara', Hukum: 'Jailer', Illuminati: 'Aavesham', 'Naatu Naatu': 'RRR' }
const GONE = H1.data.removed_number - 1

const PW = 132
const PH = 264
const EASE = [0.22, 1, 0.36, 1] as const

type RowState = 'idle' | 'swiped' | 'tapped' | 'out' | 'gone'

function Avatar({ letter, tone }: { letter: string; tone: string }) {
  return (
    <span className="grid h-[13px] w-[13px] place-items-center rounded-full text-[7px] font-bold" style={{ background: tone, color: SHELL, boxShadow: `0 0 0 1.5px ${SHELL}` }}>
      {letter}
    </span>
  )
}

function SongRow({ n, title, state }: { n: number; title: string; state: RowState }) {
  const instant = useInstant()
  const shift = state === 'swiped' || state === 'tapped' ? -40 : state === 'out' || state === 'gone' ? -PW : 0
  const gone = state === 'gone'
  return (
    <motion.div
      className="relative overflow-hidden"
      initial={false}
      animate={{ height: gone ? 0 : 27, opacity: gone ? 0 : 1 }}
      transition={{ duration: instant ? 0 : 0.5, ease: EASE }}
    >
      {/* the Remove action under the row */}
      <span className="absolute inset-y-[3px] right-0 grid w-[40px] place-items-center rounded-l-md text-[7.5px] font-bold text-white" style={{ background: REMOVE }}>
        <motion.span
          className="absolute inset-0 rounded-l-md"
          initial={false}
          animate={{ opacity: state === 'tapped' ? 1 : 0, scale: state === 'tapped' ? 1 : 0.6 }}
          transition={{ duration: instant ? 0 : 0.35 }}
          style={{ background: 'rgba(255,255,255,0.35)' }}
        />
        Remove
      </span>
      <motion.div
        className="relative flex h-[27px] items-center gap-[5px] px-[7px]"
        style={{ background: SHELL }}
        initial={false}
        animate={{ x: shift }}
        transition={{ duration: instant ? 0 : 0.5, ease: EASE }}
      >
        <span className="w-[7px] text-right text-[8px] font-semibold" style={{ color: DIM }}>
          {n}
        </span>
        <span className="h-[18px] w-[18px] shrink-0 rounded-[3px]" style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.brand})`, opacity: 0.55 + n * 0.1 }} />
        <span className="flex min-w-0 flex-1 flex-col leading-none">
          <span className="truncate text-[9.5px] font-semibold text-white">{title}</span>
          <span className="mt-[2px] truncate text-[7.5px]" style={{ color: DIM }}>
            {ALBUM[title]}
          </span>
        </span>
        <span className="text-[10px] font-bold tracking-tighter" style={{ color: DIM }}>
          ⋯
        </span>
      </motion.div>
    </motion.div>
  )
}

function SpotifyPhone({ owner, rows, collab }: { owner: string; rows: RowState[]; collab: boolean }) {
  const count = rows.filter((r) => r !== 'gone').length
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[14px] font-bold" style={{ color: colors.body }}>
        {owner}
      </span>
      <div className="relative shrink-0 rounded-[24px] p-[5px] shadow-float" style={{ width: PW, height: PH, background: BEZEL }}>
        <div className="relative flex h-full flex-col overflow-hidden rounded-[19px]" style={{ background: `linear-gradient(180deg, ${GLOW} 0%, ${SHELL} 46%)` }}>
          {/* status bar and island */}
          <div className="flex h-[16px] items-center justify-between px-[11px] text-[7.5px] font-semibold text-white">
            <span>9:41</span>
            <span className="flex items-center gap-[2px]">
              <span className="h-[5px] w-[9px] rounded-[1.5px] border border-white/80" />
            </span>
          </div>
          <span aria-hidden className="absolute left-1/2 top-[4px] h-[9px] w-[34px] -translate-x-1/2 rounded-full" style={{ background: BEZEL }} />
          {/* header */}
          <div className="flex items-center justify-between px-[8px] pt-[2px]">
            <span className="text-[10px] text-white">‹</span>
            <img src="/assets/companies/spotify.png" alt="" className="h-[11px] w-[11px] rounded-full" />
          </div>
          <div className="mx-auto mt-[3px] grid h-[58px] w-[58px] place-items-center rounded-[4px] shadow-lg" style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.danger} 60%, ${colors.brandDark})` }}>
            <span className="text-center font-heading text-[10px] font-extrabold leading-tight text-white">
              Road
              <br />
              Trip
            </span>
          </div>
          <div className="flex items-end justify-between px-[8px] pt-[5px]">
            <div className="flex min-w-0 flex-col">
              <span className="font-heading text-[12px] font-bold leading-tight text-white">Road Trip</span>
              <span className="mt-[2px] flex items-center gap-[3px]">
                <span className="flex -space-x-[3px]">
                  <Avatar letter="Y" tone={colors.teal} />
                  {collab && <Avatar letter="K" tone={colors.warning} />}
                </span>
                <span className="text-[7.5px] font-semibold text-white">{collab ? 'You and Kiran' : owner === 'Kiran' ? 'Kiran' : 'You'}</span>
              </span>
              <span className="mt-[2px] text-[7.5px]" style={{ color: DIM }}>
                {count} songs
              </span>
            </div>
            <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full" style={{ background: GREEN }}>
              <svg width="8" height="9" viewBox="0 0 8 9" aria-hidden>
                <path d="M1 0.8 L7.2 4.5 L1 8.2 Z" fill={SHELL} />
              </svg>
            </span>
          </div>
          <div className="mt-[6px] flex flex-col">
            {SONGS.map((t, i) => (
              <SongRow key={t} n={i + 1} title={t} state={rows[i]} />
            ))}
          </div>
          <span aria-hidden className="absolute bottom-[4px] left-1/2 h-[3px] w-[44px] -translate-x-1/2 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  )
}

function MenuItem({ icon, title, sub, on }: { icon: ReactNode; title: string; sub: string; on: boolean }) {
  const instant = useInstant()
  return (
    <motion.div
      className="flex h-[46px] w-[255px] items-center gap-2.5 rounded-xl px-2.5"
      style={{ background: SHEET }}
      initial={false}
      animate={{ opacity: on ? 1 : 0, y: on ? 0 : 8 }}
      transition={{ duration: instant ? 0 : 0.52, ease: EASE }}
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center text-white">{icon}</span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="whitespace-nowrap text-[14.5px] font-bold text-white">{title}</span>
        <span className="whitespace-nowrap text-[11px]" style={{ color: DIM }}>
          {sub}
        </span>
      </span>
    </motion.div>
  )
}

const PersonPlus = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <circle cx="9" cy="8" r="4" />
    <path d="M2 21c0-4 3-6 7-6s7 2 7 6M19 8v6M16 11h6" />
  </svg>
)
const PlusBox = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </svg>
)

/* ------------------------------------------------------------- the turn */

const LEFT3 = SONGS.filter((_, i) => i !== GONE)
const songRow = (id: string, y: number, items: string[]): MNode => ({ id, kind: 'row', x: 96, y, items, size: 'xs', boxW: 100 })
const TURN_A = {
  nodes: [songRow('one', 66, LEFT3)],
  tags: [
    { name: 'you', x: 0, y: 30, to: 'one' },
    { name: 'kiran', x: 0, y: 112, to: 'one' },
  ] as MTag[],
}
const TURN_B = {
  nodes: [songRow('yours', 30, SONGS), songRow('his', 112, LEFT3)],
  tags: [
    { name: 'you', x: 0, y: 33, to: 'yours' },
    { name: 'kiran', x: 0, y: 115, to: 'his' },
  ] as MTag[],
}

function Way({ menu, phones, turn, showTurn }: { menu: ReactNode; phones: ReactNode; turn: { nodes: MNode[]; tags: MTag[] }; showTurn: boolean }) {
  const instant = useInstant()
  /* The menu item sits beside the pair, so the phones and the caption under
     them stay clear of the Next / Replay pair at the foot of the slide. */
  return (
    <div className="relative h-[292px] w-[555px] shrink-0">
      <motion.div
        className="flex items-start gap-4"
        initial={false}
        animate={{ opacity: showTurn ? 0.08 : 1, scale: showTurn ? 0.94 : 1 }}
        transition={{ duration: instant ? 0 : 0.9, ease: EASE }}
        style={{ transformOrigin: '30% 50%' }}
      >
        {phones}
      </motion.div>
      <div className="absolute right-0 top-[22px]">{menu}</div>
      {showTurn && (
        <div className="absolute left-0 top-[96px]">
          <Memory width={520} height={150} nodes={turn.nodes} tags={turn.tags} size="xs" />
        </div>
      )}
    </div>
  )
}

export function ShareHook() {
  const beat = useBeats(5)
  const ph = usePhase(beat, 3, 850)
  const two = beat >= 2
  /* Kiran's song 3: swipe, tap Remove, gone (press 3); gone after */
  const kiranGone: RowState = beat < 3 ? 'idle' : beat > 3 ? 'gone' : (['swiped', 'tapped', 'gone'] as const)[ph]
  /* your phone, Way A: the row slides out too (press 4) */
  const yoursA: RowState = beat < 4 ? 'idle' : beat > 4 ? 'gone' : ph === 0 ? 'out' : 'gone'
  const rowsWith = (s: RowState) => SONGS.map((_, i) => (i === GONE ? s : 'idle'))
  const captions = [
    'Kiran wants your Road Trip songs.',
    'Both look the same right now. Same songs, same order.',
    'Kiran removes song 3. Does it vanish from your phone too?',
    'Way A: one set of songs. Way B: two.',
    'Two names. One set of songs, or two?',
  ]
  return (
    <>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-start gap-10">
          <Way
            menu={<MenuItem on={two} icon={PersonPlus} title="Way A: Invite Kiran" sub="Invite collaborators" />}
            phones={
              <>
                <SpotifyPhone owner="You" rows={rowsWith(yoursA)} collab={two} />
                {two && <SpotifyPhone owner="Kiran" rows={rowsWith(kiranGone)} collab />}
              </>
            }
            turn={TURN_A}
            showTurn={beat >= 5}
          />
          <Way
            menu={<MenuItem on={two} icon={PlusBox} title="Way B: Make Kiran a copy" sub="Add to other playlist · New playlist" />}
            phones={
              two ? (
                <>
                  <SpotifyPhone owner="You" rows={rowsWith('idle')} collab={false} />
                  <SpotifyPhone owner="Kiran" rows={rowsWith(kiranGone)} collab={false} />
                </>
              ) : null
            }
            turn={TURN_B}
            showTurn={beat >= 5}
          />
        </div>
        <StepCaption text={captions[beat - 1]} tone={beat === 5 ? 'rule' : 'step'} minH={50} size={19} />
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}
