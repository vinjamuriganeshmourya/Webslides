import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'
import { useBeat, type Beat } from './walk'
import { BeatCaption } from './BeatCaption'

/**
 * PHONE PLAYLIST — the hook drawn as the thing it is about: a music app on a
 * phone, playing down a list on its own.
 *
 * WHY THIS AND NOT A ROW OF LABELLED TILES. The first cut of this slide drew the
 * five songs as five boxes reading `Song 1` to `Song 5`, which is the abstraction
 * the hook exists to POSTPONE. The room is supposed to recognise something they
 * did this morning, and then be told it has a name. A box labelled `Song 1` is
 * already the diagram; it asks the room to accept the analogy before they have
 * felt it. The source drew a phone for exactly this reason, and it is right.
 *
 * So the figure is a real playlist: cover art, a song title, an artist, a
 * duration, a green play button, and a moving equaliser on the row that is
 * playing. Nothing on it is labelled with the lesson's vocabulary. The word
 * `sequence` never appears here.
 *
 * THE BRAND MARK IS THE REAL FILE, NOT A HAND-DRAWN COPY. The source drew the
 * Spotify glyph by hand in SVG. Content rule 12 says a named product carries its
 * mark and content rule 13 says the mark comes out of `slide-kit/assets/`, where
 * `companies/spotify.png` already sat. So `appMark` takes the copied file and
 * nothing here approximates a trademark. The caption keeps the source's own
 * sentence, which is where the product is named.
 *
 * DOM, NOT SVG (content rule 17). Every row, title and duration is a real
 * element, so `align-check.mjs` can see each one. The only SVG here is the play
 * triangle, which carries no text.
 *
 * SESSION-LOCAL, AND TEMPORARILY. `slide-kit/sequence-lab/` is choosing the
 * final walk figures; when it lands, this and its two siblings move into
 * `slide-kit/slide-template/src/ui/` and the deck re-points at `@/ui`.
 */

export interface Track {
  title: string
  artist: string
  length: string
  /** The cover-art tint. From `tokens.ts`, never a literal. */
  art: string
}

export interface PlaylistBeat extends Beat {
  /** How many tracks are on the list at this beat. */
  visible: number
  /** True once the playlist has reached its end and stopped. */
  stopped?: boolean
}

const SHELL = '#121212'
const SHELL_2 = '#1E1E1E'
const DIM = '#A7A7A7'

/** The green a music app uses for "playing". Not a brand colour: the kit's own. */
const PLAYING = colors.success

function Equaliser() {
  const instant = useInstant()
  return (
    <div className="flex h-4 w-5 items-end gap-[3px]">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-sm"
          style={{ background: PLAYING, height: 6 }}
          animate={instant ? { height: 12 } : { height: [5, 16, 8, 14, 6] }}
          transition={
            instant
              ? { duration: 0 }
              : { duration: 1.1, repeat: Infinity, repeatType: 'mirror', delay: i * 0.16 }
          }
        />
      ))}
    </div>
  )
}

function Row({
  track,
  state,
  index,
}: {
  track: Track
  state: 'ahead' | 'playing' | 'played'
  index: number
}) {
  const instant = useInstant()
  return (
    <motion.div
      className="flex items-center gap-2.5 rounded-lg px-2 py-[1px]"
      style={{ background: state === 'playing' ? SHELL_2 : 'transparent' }}
      initial={instant ? false : { opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: T.enter, ease: c4(E.out), delay: instant ? 0 : index * T.stagger }}
    >
      <span
        className="h-[30px] w-[30px] shrink-0 rounded"
        style={{ background: track.art, opacity: state === 'ahead' ? 0.55 : 1 }}
      />
      <span className="min-w-0 flex-1">
        <span
          className="block truncate font-heading text-[14px] font-semibold leading-tight"
          style={{ color: state === 'playing' ? PLAYING : colors.white }}
        >
          {track.title}
        </span>
        <span className="block truncate text-[12px] leading-tight" style={{ color: DIM }}>
          {track.artist}
        </span>
      </span>
      {state === 'playing' ? (
        <Equaliser />
      ) : (
        <span className="font-mono text-[12px]" style={{ color: '#6F6F6F' }}>
          {track.length}
        </span>
      )}
    </motion.div>
  )
}

export function PhonePlaylist({
  tracks,
  beats,
  appMark,
  appName,
  className = '',
}: {
  tracks: Track[]
  beats: PlaylistBeat[]
  /** The app's real mark, copied out of `slide-kit/assets/companies/`. */
  appMark?: string
  appName?: string
  className?: string
}) {
  const instant = useInstant()
  const { beat, reached } = useBeat(beats)
  const visible = beat?.visible ?? tracks.length
  const list = tracks.slice(0, visible)
  const stopped = beat?.stopped ?? false

  return (
    <div className={`grid grid-cols-[320px_1fr] items-start gap-10 ${className}`}>
      {/* THE PHONE. A fixed frame, so the list grows inside it rather than
          pushing the slide around when the sixth song arrives. */}
      <div
        className="flex h-[416px] flex-col overflow-hidden rounded-[28px] border-[5px] px-3 pb-2 pt-2 shadow-card"
        style={{ background: SHELL, borderColor: '#2A2A2A' }}
      >
        <div className="flex items-center justify-between">
          <span className="font-heading text-[12px] font-semibold" style={{ color: colors.white }}>
            9:41
          </span>
          <span className="flex items-end gap-[2px]">
            {[4, 7, 10].map((h) => (
              <span key={h} className="w-[3px] rounded-sm" style={{ background: colors.white, height: h }} />
            ))}
          </span>
        </div>

        {appMark && (
          <div className="mt-2 flex items-center gap-2">
            <img src={appMark} alt="" width={18} height={18} draggable={false} />
            <span className="font-heading text-[13px] font-bold" style={{ color: colors.white }}>
              {appName}
            </span>
          </div>
        )}

        <div className="mt-2 flex items-center gap-3">
          <span className="h-[38px] w-[38px] shrink-0 rounded" style={{ background: PLAYING }} />
          <span className="min-w-0">
            <span
              className="block font-heading text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color: DIM }}
            >
              Playlist
            </span>
            <span className="block font-heading text-[17px] font-bold leading-tight" style={{ color: colors.white }}>
              Today's Mix
            </span>
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-[12px]" style={{ color: DIM }}>
            {list.length} songs
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full" style={{ background: PLAYING }}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M3 1.5 L12 7 L3 12.5 Z" fill={SHELL} />
            </svg>
          </span>
        </div>

        <div className="mt-2 flex min-h-0 flex-1 flex-col gap-[2px]">
          {list.map((t, i) => (
            <Row
              key={t.title}
              track={t}
              index={i}
              state={beat && beat.at === i ? 'playing' : beat && beat.at > i ? 'played' : 'ahead'}
            />
          ))}
        </div>

        {/* THE END OF THE LIST IS A DRAWN THING, not the absence of one. "So what
            told it to stop?" is the question the whole session answers. */}
        <div className="mt-1 h-[26px] shrink-0">
          {stopped && (
            <motion.div
              className="rounded-lg px-3 py-[5px] text-center font-heading text-[12px] font-bold"
              style={{ background: `${colors.danger}26`, color: '#FF9A9A' }}
              initial={instant ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: T.label, ease: c4(E.out) }}
            >
              No songs left. It stops.
            </motion.div>
          )}
        </div>
      </div>

      <BeatCaption label={beat?.label} caption={beat?.caption} step={reached} className="mt-[104px]" />
    </div>
  )
}
