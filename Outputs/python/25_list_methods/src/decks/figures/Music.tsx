import { useEffect, useState, type ReactNode } from 'react'
import { useInstant } from '@/motion/instant'
import { Phone } from './Phone'
import './cells' /* the shared keyframes */

/**
 * TEJA'S MUSIC APP (spec note 2: one world for the session, a music app's
 * party queue). Its look, as the spec asks: a dark screen, a red accent, the
 * Up next tab, the three-dot menu sheet with Play next and Add to queue. No
 * product mark and no product name (content rule 12): the app is a music app.
 *
 * These are the screen's own colours, not brand tokens (as the drawn phones
 * of sessions 22 to 24). Rows are absolutely placed by their place in the
 * queue and keyed by song, so a song that changes place SLIDES there: one
 * song moves, nothing is copied (H1's keeps line).
 */
export const YT = {
  bg: '#0F0F0F',
  card: '#212121',
  sheet: '#282828',
  ink: '#FFFFFF',
  sub: '#AAAAAA',
  line: '#3A3A3A',
  red: '#FF0033',
  lit: '#3D3D3D',
} as const

/** Cover art: a two-colour square per song, so each song is recognisable as it moves. */
const COVERS: Record<string, [string, string]> = {
  'Naatu Naatu': ['#F2994A', '#B53A1D'],
  'Butta Bomma': ['#F7C6D9', '#C2457A'],
  Samajavaragamana: ['#9AD1F5', '#2C5E9E'],
  Chuttamalle: ['#F7E08C', '#C9811B'],
  Kissik: ['#C7A2F2', '#6A3FB5'],
  Peelings: ['#A6E3B8', '#2E8B57'],
  'Oo Antava': ['#F5A3A3', '#A5262B'],
}

export const ARTIST: Record<string, string> = {
  'Naatu Naatu': 'RRR',
  'Butta Bomma': 'Ala Vaikunthapurramuloo',
  Samajavaragamana: 'Ala Vaikunthapurramuloo',
  Chuttamalle: 'Devara',
  Kissik: 'Pushpa 2',
  Peelings: 'Pushpa 2',
  'Oo Antava': 'Pushpa',
}

/**
 * Cover art with a sound wave (user, 2026-10-08, slide 4): five bars that rise
 * and fall on their own staggered, eased loops, so a cover reads as music
 * playing. `wave="live"` is the song playing now, full height and quick;
 * `wave="calm"` a queued song, low and slow; no `wave` keeps the still disc.
 */
export function Cover({ song, size = 34, wave }: { song: string; size?: number; wave?: 'live' | 'calm' }) {
  const [a, b] = COVERS[song] ?? ['#777777', '#333333']
  const instant = useInstant()
  const bars = [0.55, 0.95, 0.7, 1, 0.6]
  return (
    <span className="relative shrink-0 overflow-hidden rounded-[6px]" style={{ width: size, height: size, background: `linear-gradient(135deg, ${a}, ${b})` }}>
      {wave ? (
        <span className="absolute inset-0 flex items-end justify-center gap-[2px] pb-[22%]">
          {bars.map((h, i) => (
            <span
              key={i}
              className="block rounded-full"
              style={{
                width: Math.max(2, Math.round(size / 11)),
                height: `${Math.round(h * 56)}%`,
                background: 'rgba(255,255,255,0.88)',
                transformOrigin: '50% 100%',
                animation: instant ? 'none' : `${wave === 'live' ? 'pf25-wave' : 'pf25-wave-calm'} ${wave === 'live' ? 0.9 + i * 0.13 : 1.8 + i * 0.21}s cubic-bezier(0.45,0,0.55,1) ${-i * 0.17}s infinite alternate`,
                opacity: wave === 'calm' ? 0.8 : 1,
              }}
            />
          ))}
        </span>
      ) : (
        <svg width={size} height={size} viewBox="0 0 34 34" className="absolute inset-0" aria-hidden>
          <circle cx="17" cy="17" r="7" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
          <circle cx="17" cy="17" r="2" fill="rgba(255,255,255,0.75)" />
        </svg>
      )}
    </span>
  )
}

export function Dots({ color = YT.sub }: { color?: string }) {
  return (
    <svg width="4" height="16" viewBox="0 0 4 16" aria-hidden className="shrink-0">
      <circle cx="2" cy="2.5" r="1.7" fill={color} />
      <circle cx="2" cy="8" r="1.7" fill={color} />
      <circle cx="2" cy="13.5" r="1.7" fill={color} />
    </svg>
  )
}

/** One song row: cover, title, artist, the three dots. */
export function SongRow({ song, lit = false, playing = false, dim = false, wave }: { song: string; lit?: boolean; playing?: boolean; dim?: boolean; wave?: 'live' | 'calm' }) {
  return (
    <div className="flex items-center gap-2 rounded-lg px-1.5 py-1.5" style={{ background: lit ? YT.lit : 'transparent', opacity: dim ? 0.45 : 1, transition: 'background-color 360ms, opacity 360ms' }}>
      <Cover song={song} wave={wave} size={30} />
      {/* no truncation: every name is shown whole (box-overflow rule, 2026-10-08) */}
      <div className="min-w-0 flex-1 leading-tight">
        <div className="whitespace-nowrap text-[12.5px] font-semibold" style={{ color: playing ? YT.red : YT.ink }}>
          {song}
        </div>
        <div className="whitespace-nowrap text-[10px] tracking-[-0.01em]" style={{ color: YT.sub }}>
          {ARTIST[song]}
        </div>
      </div>
      <Dots />
    </div>
  )
}

export const ROW_H = 50

/**
 * The queue's rows, placed by position and keyed by song. `out` slides a row
 * out to the left and fades it (Remove from queue); `fresh` drops a row in.
 */
export function QueueRows({ songs, out = [], lit = [], height, wave }: { songs: string[]; out?: string[]; lit?: string[]; height: number; wave?: 'live' | 'calm' }) {
  const instant = useInstant()
  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)'
  return (
    <div className="relative" style={{ height }}>
      {songs.map((s, i) => {
        const gone = out.includes(s)
        return (
          <div
            key={s}
            className="absolute inset-x-0"
            style={{
              top: i * ROW_H,
              opacity: gone ? 0 : 1,
              transform: gone ? 'translateX(-60px)' : 'none',
              transition: instant ? 'none' : `top 560ms ${ease}, opacity 420ms ${ease}, transform 420ms ${ease}`,
              animation: instant ? 'none' : `pf25-cell-in 520ms ${ease} both`,
            }}
          >
            <SongRow song={s} lit={lit.includes(s)} wave={wave} />
          </div>
        )
      })}
    </div>
  )
}

/** The app's header: Now playing over the Up next tab. */
export function MusicPhone({ width = 214, height = 440, children, top, time = '9:41' }: { width?: number; height?: number; children: ReactNode; top?: ReactNode; time?: ReactNode }) {
  return (
    <Phone width={width} height={height} island={null} time={time} top={{ bg: YT.bg, light: true, header: top ?? null }}>
      <div className="h-full" style={{ background: YT.bg }}>
        {children}
      </div>
    </Phone>
  )
}

/** A chat notification sliding down over the top of the screen (no product name). */
export function Notice({ from, text, on }: { from: string; text: string; on: boolean }) {
  const instant = useInstant()
  return (
    <div
      className="absolute inset-x-2 top-1 z-10 flex items-start gap-2 rounded-2xl px-3 py-2"
      style={{
        background: 'rgba(245,245,245,0.97)',
        boxShadow: '0 10px 24px -10px rgba(0,0,0,0.6)',
        opacity: on ? 1 : 0,
        transform: on ? 'none' : 'translateY(-24px)',
        transition: instant ? 'none' : 'opacity 420ms cubic-bezier(0.22,1,0.36,1), transform 520ms cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <span className="mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-md" style={{ background: '#25A244' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden>
          <path d="M4 5h16v11H9l-5 4z" fill="#FFFFFF" />
        </svg>
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block text-[11.5px] font-bold" style={{ color: '#111111' }}>
          {from}
        </span>
        <span className="block text-[12px]" style={{ color: '#333333' }}>
          {text}
        </span>
      </span>
    </div>
  )
}

/** The three-dot menu sheet for one song: Play next and Add to queue lit, a thumb on the one tapped. */
export function MenuSheet({ song, open, tap }: { song: string; open: boolean; tap: 'Play next' | 'Add to queue' | null }) {
  const instant = useInstant()
  /* mounted only while open or sliding away, so a closed sheet is not a box parked under the phone's edge */
  const [mounted, setMounted] = useState(open)
  const [shown, setShown] = useState(open && instant)
  useEffect(() => {
    if (open) {
      setMounted(true)
      const t = window.setTimeout(() => setShown(true), instant ? 0 : 20)
      return () => window.clearTimeout(t)
    }
    setShown(false)
    const t = window.setTimeout(() => setMounted(false), instant ? 0 : 560)
    return () => window.clearTimeout(t)
  }, [open, instant])
  if (!mounted) return null
  const items = ['Play next', 'Add to queue', 'Save to playlist', 'Share']
  return (
    <div
      className="absolute inset-x-0 bottom-0 z-10 rounded-t-2xl px-3 pb-6 pt-2"
      style={{
        background: YT.sheet,
        transform: shown ? 'none' : 'translateY(105%)',
        transition: instant ? 'none' : 'transform 520ms cubic-bezier(0.22,1,0.36,1)',
        boxShadow: '0 -12px 30px -12px rgba(0,0,0,0.7)',
      }}
    >
      <span className="mx-auto mb-2 block h-1 w-9 rounded-full" style={{ background: '#555555' }} />
      <SongRow song={song} />
      <div className="mt-1.5 border-t pt-1.5" style={{ borderColor: YT.line }}>
        {items.map((it, i) => {
          const live = i < 2
          const tapped = tap === it
          return (
            <div key={it} className="relative flex items-center gap-3 rounded-lg px-2 py-[7px]" style={{ background: tapped ? YT.lit : 'transparent', transition: 'background-color 300ms' }}>
              <span className="grid h-5 w-5 place-items-center" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={live ? YT.ink : YT.sub} strokeWidth="2" strokeLinecap="round">
                  {i === 0 ? <path d="M4 6h11M4 11h11M4 16h7M17 13l4 3-4 3z" /> : i === 1 ? <path d="M4 6h11M4 11h11M4 16h7M18 13v6M15 16h6" /> : i === 2 ? <path d="M6 4h12v16l-6-4-6 4z" /> : <path d="M14 5l6 6-6 6M20 11H9a5 5 0 0 0-5 5v2" />}
                </svg>
              </span>
              <span className="text-[13px] font-semibold" style={{ color: live ? YT.ink : YT.sub }}>
                {it}
              </span>
              {tapped && (
                <span className="absolute right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full" style={{ background: 'rgba(255,255,255,0.35)', boxShadow: '0 0 0 6px rgba(255,255,255,0.12)', animation: instant ? 'none' : 'pf25-tick 520ms both' }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** Now playing, the strip under the status bar. */
export function NowPlaying({ song, wave }: { song: string; wave?: 'live' | 'calm' }) {
  return (
    <div className="px-3 pb-2 pt-1">
      <div className="mb-1 text-[10.5px] font-bold uppercase tracking-wider" style={{ color: YT.sub }}>
        Now playing
      </div>
      <div className="flex items-center gap-2.5 rounded-xl p-2" style={{ background: YT.card }}>
        <Cover song={song} size={40} wave={wave} />
        <div className="min-w-0 flex-1 leading-tight">
          <div className="whitespace-nowrap text-[14px] font-bold" style={{ color: YT.ink }}>
            {song}
          </div>
          <div className="whitespace-nowrap text-[11px]" style={{ color: YT.sub }}>
            {ARTIST[song]}
          </div>
          <div className="mt-1.5 h-[3px] rounded-full" style={{ background: YT.line }}>
            <div className="h-full w-[38%] rounded-full" style={{ background: YT.red }} />
          </div>
        </div>
      </div>
    </div>
  )
}

/** The Up next tab, red underline. */
export function UpNextTab({ right = 'Lyrics' }: { right?: string }) {
  return (
    <div className="flex gap-5 border-b px-3 pt-1" style={{ borderColor: YT.line }}>
      <span className="border-b-2 pb-1.5 text-[12px] font-bold uppercase tracking-wider" style={{ color: YT.ink, borderColor: YT.ink }}>
        Up next
      </span>
      <span className="pb-1.5 text-[12px] font-bold uppercase tracking-wider" style={{ color: YT.sub }}>
        {right}
      </span>
    </div>
  )
}
