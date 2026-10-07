import type { ReactNode } from 'react'
import { LayoutGroup, motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { BeatCaption } from './common'
import { Ask, Show } from './pieces'

/**
 * SEVEN SONGS, ONE NAME. Spec card H1, the hook.
 *
 * A Spotify desktop screen with the Road Trip songs, and beside it what a
 * program would have to do: one variable per song. The app adds a song and
 * just knows it has seven; our seven boxes do not know they belong together.
 * The turn, on press 6, slides the boxes into one row under one name, in the
 * same order. Nothing on this frame says `list` (spec rule 4): the title card
 * names it two slides later.
 *
 * THE SCREEN IS DRAWN AS THE REAL THING (course rules R5, R5b): cover art, the
 * title, the count line, the green play button, the table with `#`, `Title`,
 * `Album` and the clock, a player bar. Its dark shell and its green are the
 * object's own colours and stay inside the object (content rule 37); the mark
 * is the library's `companies/spotify.png` (rules 12, 13), never drawn by hand.
 * No `Playlist` label anywhere on it.
 *
 * Seven presses, the spec's own. The boxes move by shared layout (`layoutId`):
 * on press 6 each box unmounts from the grid and mounts in the row, and
 * framer-motion carries it across in one movement.
 */
const SONGS = [
  { no: 1, title: 'Chuttamalle', film: 'Devara', time: '3:37' },
  { no: 2, title: 'Hukum', film: 'Jailer', time: '3:25' },
  { no: 3, title: 'Illuminati', film: 'Aavesham', time: '2:40' },
  { no: 4, title: 'Naatu Naatu', film: 'RRR', time: '3:35' },
  { no: 5, title: 'Kaavaalaa', film: 'Jailer', time: '3:10' },
  { no: 6, title: 'Kesariya', film: 'Brahmastra', time: '4:28' },
]
const NEW_SONG = { no: 7, title: 'Kissik', film: 'Pushpa 2', time: '2:55' }
export const ROAD_TRIP = [...SONGS.map((s) => s.title), NEW_SONG.title]

/* Spotify's own colours, inside the drawn screen only (content rule 37). */
const SHELL = '#121212'
const SHELL_2 = '#1C1C1C'
const GREEN = '#1DB954'
const DIM = '#B3B3B3'
const CHROME = '#15191F'

const MOVE = { type: 'tween', duration: 0.72, ease: [0.22, 1, 0.36, 1] } as const

/* ---------------------------------------------------------------- monitor */

/** A desktop monitor: the screen in its bezel, a neck and a foot. No maker's mark. */
export function Monitor({ width = 420, children }: { width?: number; children: ReactNode }) {
  const h = Math.round(width * 0.6)
  return (
    <div className="flex shrink-0 flex-col items-center" style={{ width }}>
      <div className="relative w-full rounded-xl p-[8px]" style={{ background: CHROME, height: h }}>
        <div className="h-full w-full overflow-hidden rounded-md" style={{ background: SHELL }}>
          {children}
        </div>
      </div>
      <div aria-hidden style={{ width: 64, height: 20, background: `linear-gradient(${colors.line}, ${colors.muted}77)`, clipPath: 'polygon(18% 0, 82% 0, 100% 100%, 0 100%)' }} />
      <div aria-hidden className="rounded-full" style={{ width: 190, height: 8, background: `${colors.muted}66` }} />
    </div>
  )
}

/* ----------------------------------------------------------------- screen */

function Clock() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={DIM} strokeWidth="2.5" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  )
}

function SpotifyScreen({ seventh, countGlow, rowOneGlow }: { seventh: boolean; countGlow: boolean; rowOneGlow: boolean }) {
  const tween = useTween(480)
  const rows = seventh ? [...SONGS, NEW_SONG] : SONGS
  const count = seventh ? '7 songs, about 24 min' : '6 songs, about 21 min'
  return (
    <div className="flex h-full w-full flex-col px-3 pt-2 text-white" style={{ fontFamily: 'inherit' }}>
      {/* top bar: the app's mark (the library's file), home and search */}
      <div className="flex items-center gap-3">
        <img src="/assets/companies/spotify.png" alt="" className="h-[14px] w-[14px] rounded-full" />
        <span className="text-[9px] font-semibold" style={{ color: DIM }}>Home</span>
        <span className="text-[9px] font-semibold" style={{ color: DIM }}>Search</span>
      </div>
      {/* header: cover art, title, the count line, play */}
      <div className="mt-2 flex items-end gap-3">
        <div className="h-[54px] w-[54px] shrink-0 rounded-[3px]" style={{ background: `linear-gradient(135deg, ${colors.brand}, ${colors.teal} 60%, ${colors.accent})`, boxShadow: '0 6px 14px rgba(0,0,0,0.5)' }}>
          <svg width="54" height="54" viewBox="0 0 54 54" aria-hidden>
            <path d="M8 46 C 18 30, 30 30, 46 10" stroke="rgba(255,255,255,0.85)" strokeWidth="3" strokeDasharray="6 5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-[18px] font-extrabold leading-none">Road Trip</p>
          <p
            className="mt-1 inline-block rounded px-1 text-[10px] font-semibold leading-[16px]"
            style={{ color: countGlow ? '#FFFFFF' : DIM, background: countGlow ? `${GREEN}55` : 'transparent', boxShadow: countGlow ? `0 0 0 2px ${GREEN}` : 'none', marginLeft: -4, transition: tween }}
          >
            {count}
          </p>
        </div>
        <span className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full" style={{ background: GREEN }}>
          <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden>
            <path d="M7 4 L20 12 L7 20 Z" fill="#000" />
          </svg>
        </span>
      </div>
      {/* the table */}
      <div className="mt-1.5 grid grid-cols-[16px_1fr_86px_30px] items-center gap-x-2 border-b px-1 pb-0.5 text-[8.5px] font-semibold uppercase tracking-wider" style={{ color: DIM, borderColor: '#2A2A2A' }}>
        <span>#</span>
        <span>Title</span>
        <span>Album</span>
        <span className="justify-self-end"><Clock /></span>
      </div>
      <div className="flex flex-col">
        {rows.map((s) => {
          const lit = rowOneGlow && s.no === 1
          return (
            <div
              key={s.no}
              className="grid h-[15px] grid-cols-[16px_1fr_86px_30px] items-center gap-x-2 rounded-[3px] px-1 text-[10px]"
              style={{ background: lit ? `${GREEN}33` : s.no === NEW_SONG.no && seventh ? SHELL_2 : 'transparent', boxShadow: lit ? `inset 0 0 0 1px ${GREEN}` : 'none', transition: tween }}
            >
              <span className="font-mono" style={{ color: lit ? GREEN : DIM, fontWeight: lit ? 700 : 500 }}>{s.no}</span>
              <span className="truncate font-semibold">{s.title}</span>
              <span className="truncate" style={{ color: DIM }}>{s.film}</span>
              <span className="justify-self-end font-mono" style={{ color: DIM }}>{s.time}</span>
            </div>
          )
        })}
      </div>
      {/* the player bar */}
      <div className="mt-auto flex items-center gap-3 border-t py-1.5" style={{ borderColor: '#2A2A2A' }}>
        <div className="h-[18px] w-[18px] rounded-[2px]" style={{ background: `linear-gradient(135deg, ${colors.brand}, ${colors.teal})` }} />
        <div className="w-[80px]">
          <p className="truncate text-[9px] font-semibold leading-none">{SONGS[0].title}</p>
          <p className="truncate text-[8px] leading-none" style={{ color: DIM }}>{SONGS[0].film}</p>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1">
          <svg width="52" height="10" viewBox="0 0 52 10" fill="#fff" aria-hidden>
            <path d="M8 1 L8 9 L1 5 Z M9 1 L9 9 L16 5 Z" transform="translate(0 0)" fill={DIM} />
            <circle cx="26" cy="5" r="5" fill="#fff" />
            <path d="M24.5 2.5 L28.5 5 L24.5 7.5 Z" fill="#000" />
            <path d="M36 1 L36 9 L43 5 Z M44 1 L44 9 L51 5 Z" fill={DIM} />
          </svg>
          <div className="relative h-[3px] w-full rounded-full" style={{ background: '#3A3A3A' }}>
            <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: '38%', background: GREEN }} />
          </div>
        </div>
        <span className="font-mono text-[8px]" style={{ color: DIM }}>1:22</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ boxes */

const VARS = ROAD_TRIP.map((t, i) => `song${i + 1} = "${t}"`)

/* Rule 36: a caption that held two or three sentences is two or three lines. */
const CAPTIONS: ReactNode[][] = [
  ['Your Road Trip songs on Spotify'],
  ['So far, one variable holds one value', 'How would a program keep these six songs?'],
  ['Six songs, six separate variables'],
  ['One more song. The app just adds it', 'We need a new variable'],
  ['The app knows it has 7 songs', 'Which line of our program knows that?'],
  ['One name', 'Seven songs, in order'],
  ['Spotify calls this song 1', 'What number should Python give it?'],
]

const ROW_W = 134
const ROW_H = 44

export function PlaylistHook() {
  const beat = useBeats(7)
  const instant = useInstant()
  const tween = useTween(480)
  const move = instant ? { duration: 0 } : MOVE
  const seventh = beat >= 4
  const joined = beat >= 6
  const shownVars = beat >= 3 ? (seventh ? 7 : 6) : 0
  return (
    <LayoutGroup>
      <div className="flex items-start gap-9" style={{ height: 300 }}>
        <Monitor width={420}>
          <SpotifyScreen seventh={seventh} countGlow={beat === 5} rowOneGlow={beat === 7} />
        </Monitor>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div style={{ minHeight: 60 }}>
            <BeatCaption n={beat} lines={CAPTIONS[beat - 1] ?? CAPTIONS[0]} size={18} />
          </div>
          <Show on={beat >= 2} style={{ minHeight: 30 }}>
            <Ask size={20}>So far, one variable holds one value. How would a program keep these six songs?</Ask>
          </Show>
          {/* their answer, drawn: one variable per song, apart from each other */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2" style={{ minHeight: 168 }}>
            {!joined &&
              VARS.slice(0, shownVars).map((v, i) => (
                <motion.div
                  key={i}
                  layoutId={`song-${i}`}
                  layout
                  transition={move}
                  initial={instant ? false : { opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex h-[36px] items-center rounded-lg bg-white px-3 font-mono text-[15px] font-semibold"
                  style={{ color: colors.ink, boxShadow: `inset 0 0 0 2px ${i === 6 ? colors.accent : colors.line}`, whiteSpace: 'nowrap' }}
                >
                  {v}
                </motion.div>
              ))}
          </div>
        </div>
      </div>
      {/* the turn: one row of joined boxes under one name, in the same order */}
      <div className="mt-4 flex items-start gap-4" style={{ height: 84 }}>
        <Show on={joined} lift={0} style={{ height: ROW_H }}>
          <span className="grid h-[44px] place-items-center rounded-lg px-3 font-mono text-[17px] font-bold text-white" style={{ background: colors.brandDark }}>
            road_trip
          </span>
        </Show>
        <div className="flex flex-col">
          <div className="flex">
            {joined &&
              ROAD_TRIP.map((t, i) => (
                <motion.div
                  key={i}
                  layoutId={`song-${i}`}
                  layout
                  transition={move}
                  className="grid place-items-center bg-white font-mono text-[15px] font-semibold"
                  style={{
                    width: ROW_W,
                    height: ROW_H,
                    marginLeft: i === 0 ? 0 : -2,
                    color: colors.ink,
                    border: `2px solid ${colors.brand}`,
                    borderRadius: i === 0 ? '10px 0 0 10px' : i === ROAD_TRIP.length - 1 ? '0 10px 10px 0' : 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t}
                </motion.div>
              ))}
          </div>
          {/* the position slots, empty on this card; the first one asks */}
          <div className="mt-1.5 flex" style={{ opacity: joined ? 1 : 0, transition: tween }}>
            {ROAD_TRIP.map((_, i) => {
              const ask = beat >= 7 && i === 0
              return (
                <div key={i} className="grid place-items-center" style={{ width: ROW_W - 2 }}>
                  <span
                    className="grid h-[24px] w-[30px] place-items-center rounded-md font-mono text-[16px] font-bold"
                    style={{
                      border: `2px dashed ${ask ? colors.accent : colors.line}`,
                      background: ask ? '#FFF4EC' : 'transparent',
                      color: colors.accentDark,
                      boxShadow: ask ? `0 0 0 5px ${colors.accent}33` : 'none',
                      transition: tween,
                    }}
                  >
                    {ask ? '?' : ''}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        <Show on={joined} lift={0} style={{ height: ROW_H }}>
          <span className="grid h-[44px] place-items-center whitespace-nowrap text-[17px] font-semibold" style={{ color: colors.body }}>
            7 songs
          </span>
        </Show>
      </div>
      <StepControls at={beat} total={7} />
    </LayoutGroup>
  )
}
