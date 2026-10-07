import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
/* REAL ICONS, NOT MY TRACINGS. `lucide-react` is already a dependency at
   1.24.0, and these are the current, maintained glyphs for the things a music
   app actually has. Hand-drawn approximations of a home or a shuffle read as
   dated the moment they sit next to a real product's chrome. `src/ui/icons.tsx`
   stays dependency-free because it is the KIT's shared set; this is a session
   figure imitating one specific app, so it uses the real thing. */
import {
  CirclePlus,
  Download,
  EllipsisVertical,
  House,
  Library,
  Play,
  Plus,
  Search,
  Shuffle,
} from 'lucide-react'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'
import { useBeat, type Beat } from './walk'
import { BeatList } from './BeatList'
import { StepControls } from '@/ui'

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

/*
  ALBUM ART, AS OBJECT COLOUR.

  The same category as `PiggyBank`'s pink and `EverydayLoops`' cartons: six
  covers on a music app, muted the way real sleeve art is, and carrying no
  meaning at all beyond "these are six different records". The palette's own
  hues are wrong here twice over — six saturated brand colours read as a chart,
  and the brand blue on a cover reads as a NxtWave product. These are the
  reference's own six, so the phone the room sees is the phone the pedagogy
  team drew.
*/
export const ALBUM_ART = {
  plum: '#8E5A9E',
  sea: '#2E6FA8',
  clay: '#B4703C',
  moss: '#3C8A72',
  rust: '#A34A55',
  dusk: '#5B62B0',
} as const

/** The green a music app uses for "playing". Not a brand colour: the kit's own. */
const PLAYING = colors.success

/* STATIC, on purpose. It used to loop for ever. Course rule R5c says nothing on
   a frame advances its own state on a timer, and a player whose bars dance while
   the instructor talks over it pulls the room's eye off the instructor. Three
   bars at rest still say "this is the one playing". */
/* THE ONE THING ON THIS FRAME THAT MOVES BY ITSELF, and it is allowed to.
 * Course rule R5c says nothing advances its own STATE on a timer -- the pointer
 * does not walk the list, the beats do not turn over. Four bars bouncing on the
 * playing row change nothing the frame says; they say "this one is playing",
 * which is the one thing a still picture of a music app cannot say. The user
 * asked for it back by name.
 *
 * CSS keyframes, not framer: every framer infinite animation in this deck
 * writes its first keyframe and then stops ticking, which is recorded in
 * `QuizTimeSlide`. */
const BARS = [
  { h: 5, d: '0.62s', delay: '0s' },
  { h: 13, d: '0.48s', delay: '-0.18s' },
  { h: 8, d: '0.55s', delay: '-0.34s' },
  { h: 11, d: '0.5s', delay: '-0.1s' },
]

function Equaliser() {
  const instant = useInstant()
  return (
    <span className="flex h-[15px] shrink-0 items-end gap-[2px]" aria-label="playing">
      <style>{`@keyframes ppBar { 0%,100% { transform: scaleY(0.35) } 50% { transform: scaleY(1) } }`}</style>
      {BARS.map((b, i) => (
        <span
          key={i}
          className="w-[2.5px] rounded-[1px]"
          style={{
            height: b.h,
            background: PLAYING,
            transformOrigin: 'bottom',
            animation: instant ? undefined : `ppBar ${b.d} ease-in-out ${b.delay} infinite`,
          }}
        />
      ))}
    </span>
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
      className="flex shrink-0 items-center gap-2.5 rounded-lg px-2 py-[1px]"
      style={{ background: state === 'playing' ? SHELL_2 : 'transparent' }}
      initial={instant ? false : { opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: T.enter, ease: c4(E.out), delay: instant ? 0 : index * T.stagger }}
    >
      {/* Album ART, not a colour swatch. A flat square reads as a placeholder;
          a note on a gradient reads as a cover, which is the recognition the
          hook depends on (course rule R5b).

          THE COVER DOES NOT DIM WHEN A SONG HAS PLAYED. It used to, at 0.4, and
          six dimmed gradients read as six identical olive tiles: the one thing
          the covers exist to do, be six visibly different records, was lost on
          every beat after the first. The reference dims nothing. "Played" is
          still said, by the title, the artist and the duration going soft, which
          is where a music app says it too. */}
      <span
        className="grid h-[26px] w-[26px] shrink-0 place-items-center overflow-hidden rounded-[3px]"
        style={{
          backgroundImage: `linear-gradient(135deg, ${track.art}, ${track.art}66 55%, #00000055)`,
        }}
      >
        {/* A sleeve has a mark on it, not a music note stamped on all six. Two
            bands at an angle read as artwork at 30px and differ per cover
            because the tint under them differs. */}
        <span className="h-full w-full" style={{
          backgroundImage:
            'repeating-linear-gradient(115deg, rgba(255,255,255,0.22) 0 3px, rgba(255,255,255,0) 3px 9px)',
        }} />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className="block truncate font-heading text-[14px] font-semibold leading-tight"
          style={{
            color: state === 'playing' ? PLAYING : colors.white,
            opacity: state === 'played' ? 0.45 : 1,
          }}
        >
          {track.title}
        </span>
        <span
          className="block truncate text-[13px] leading-[1.15]"
          style={{ color: DIM, opacity: state === 'played' ? 0.5 : 1 }}
        >
          {track.artist}
        </span>
      </span>
      {state === 'playing' && <Equaliser />}
      {/* The kebab, where a real playlist row puts it. It replaced a duration
          column: a playlist screen shows the artist under the title and the
          overflow menu at the end, and the durations were six numbers the room
          had no use for. */}
      <EllipsisVertical
        size={13}
        color={DIM}
        aria-hidden
        className="ml-1 shrink-0"
        style={{ opacity: state === 'played' ? 0.4 : 0.7 }}
      />
    </motion.div>
  )
}

/**
 * THE STATUS BAR SHOWS THE REAL TIME.
 *
 * A phone on a slide that reads `9:41` is Apple's press-shot convention, and a
 * room reads it as a stock image. The clock ticking over with the actual time is
 * the cheapest thing on the frame that says this is a live screen and not a
 * picture of one. It updates every 20s so it is never visibly wrong.
 *
 * A deck that needs a fixed time for the story it is telling passes `time`:
 * a lunch payment at 12:48, a late-night reel at 23:10.
 */
function useClock(fixed?: string) {
  const [now, setNow] = useState(() => fixed ?? clockString())
  useEffect(() => {
    if (fixed) return
    const id = setInterval(() => setNow(clockString()), 20000)
    return () => clearInterval(id)
  }, [fixed])
  return fixed ?? now
}

function clockString() {
  const d = new Date()
  const h = d.getHours() % 12 || 12
  return `${h}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function PhonePlaylist({
  tracks,
  beats,
  appMark,
  appName,
  time,
  className = '',
}: {
  tracks: Track[]
  beats: PlaylistBeat[]
  /** Fix the status-bar clock when the story needs a particular time. */
  time?: string
  /** The app's real mark, copied out of `slide-kit/assets/companies/`. */
  appMark?: string
  appName?: string
  className?: string
}) {
  const instant = useInstant()
  const clock = useClock(time)
  const { beat, reached } = useBeat(beats)
  const visible = beat?.visible ?? tracks.length
  const list = tracks.slice(0, visible)
  const stopped = beat?.stopped ?? false

  /*
    NOTHING ON THIS FRAME MOVES UNTIL THE PRESENTER PRESSES.

    An earlier cut walked the pointer through the songs between two beats on a
    380ms timer, so that the fourth beat ("right to the end, then it stops")
    did not jump from song 2 to the end. It fixed the jump and broke something
    worse: the frame advanced its own state while the instructor was talking
    over it, and the room watched the slide instead of listening. Course rule
    R5c: a press is the only thing that changes what the frame says.

    The songs in between are still accounted for, by greying: everything the
    pointer has passed is dimmed, so "played" is visible without anything having
    to be watched happening.

    The idle equaliser on the playing row is the one permitted exception. It
    loops, but it never changes what the frame SAYS.
  */
  const at = beat?.at ?? -1
  const arrived = true
  const nowTrack = at >= 0 && at < list.length ? list[at] : undefined

  return (
    /* THE GUARD IS CANCELLED HERE. `ContentSlide` adds 52px of top padding on a
       frame with no lead, to keep the well clear of the instructor-video
       rectangle at x913..1280, y0..220. This figure does not need it: the phone
       sits on the header datum at x64, nowhere near that rectangle, and the beat
       column is padded down past y220 on its own. Those 52px were showing as a
       band of nothing between the title and the phone. */
    <div className={`-mt-[34px] flex flex-col ${className}`}>
    <div className="grid grid-cols-[258px_1fr] items-start gap-9">
      {/* THE PHONE, AT A PHONE'S PROPORTIONS. It was 368x440, a ratio of 0.84,
          which is a squat tablet: no phone is that shape and the room reads the
          shape before it reads anything on it. 258x486 is 0.53, between a
          modern handset's 0.46 and the 9:16 of an older one.

          A fixed frame, so the list grows inside it rather than pushing the
          slide around when the sixth song arrives. */}
      <div
        className="relative flex h-[486px] flex-col overflow-hidden rounded-[32px] border-[6px] px-3.5 pb-2 pt-2 shadow-card"
        style={{ background: SHELL, borderColor: '#2A2A2A' }}
      >
        <div className="flex items-center justify-between">
          <span className="font-heading text-[13px] font-semibold" style={{ color: colors.white }}>
            {clock}
          </span>
          <span className="flex items-center gap-[5px]">
            <span className="flex items-end gap-[2px]">
              {[4, 7, 10].map((h) => (
                <span key={h} className="w-[3px] rounded-sm" style={{ background: colors.white, height: h }} />
              ))}
            </span>
            <svg width="13" height="10" viewBox="0 0 16 12" aria-hidden fill="none" stroke={colors.white} strokeWidth="1.6" strokeLinecap="round">
              <path d="M1 4.2a10 10 0 0 1 14 0M3.6 7a6.4 6.4 0 0 1 8.8 0" />
              <circle cx="8" cy="10" r="0.9" fill={colors.white} stroke="none" />
            </svg>
            <span className="flex items-center">
              <span className="relative h-[9px] w-[17px] rounded-[2px] border" style={{ borderColor: colors.white }}>
                <span className="absolute inset-[1.5px] right-[5px] rounded-[1px]" style={{ background: colors.white }} />
              </span>
              <span className="ml-[1px] h-[4px] w-[1.5px] rounded-r" style={{ background: colors.white }} />
            </span>
          </span>
        </div>

        {/* THE WASH. A playlist screen is not flat black: the cover's colour
            bleeds down behind the header and fades out over the list. It is the
            first thing that makes this read as the real app rather than a dark
            card with rows on it. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[190px]"
          style={{ background: `linear-gradient(180deg, ${PLAYING}59 0%, ${PLAYING}1F 45%, ${SHELL} 100%)` }}
        />

        {/* NO BACK ARROW. It is the one piece of this screen that carries
            nothing, and the six songs running out is what the card is FOR: at
            full header height only four rows fitted, which broke the frame's
            own argument. Everything here is sized so all six show. */}
        {/* THE COVER, big and centred, with the app's own mark on it. The first
            cut showed a 32px green square in a header row, which reads as a
            swatch; a playlist screen leads with its artwork. */}
        <div className="relative mt-1 flex justify-center">
          <span
            className="relative grid h-[72px] w-[72px] place-items-center overflow-hidden rounded-[5px] shadow-[0_9px_20px_rgba(0,0,0,0.55)]"
            style={{ backgroundImage: `linear-gradient(145deg, ${PLAYING}, #0C6B3F 60%, #08351F)` }}
          >
            <span
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(120deg, rgba(255,255,255,0.14) 0 6px, rgba(255,255,255,0) 6px 16px)',
              }}
            />
            {appMark && (
              <img src={appMark} alt="" width={16} height={16} draggable={false} className="absolute left-1.5 top-1.5" />
            )}
          </span>
        </div>

        <div className="relative mt-1.5">
          <span className="block font-heading text-[16px] font-bold leading-none" style={{ color: colors.white }}>
            Today's Mix
          </span>
          <span className="mt-[3px] flex items-center gap-1.5">
            {appMark && <img src={appMark} alt="" width={12} height={12} draggable={false} />}
            <span className="font-heading text-[12px] font-semibold leading-none" style={{ color: DIM }}>
              {appName ? `Made by ${appName}` : 'Nxt Studio'}
            </span>
          </span>
        </div>

        {/* THE ACTION ROW, the shape a playlist screen actually has: add,
            download and overflow on the left, shuffle and the one big green
            play on the right. NOTHING HERE COUNTS THE SONGS -- the card's whole
            question is what told the music to stop, and a "6 songs" label
            answers it before it is asked. */}
        <div className="relative mt-1.5 flex items-center gap-3">
          <Plus size={17} color={DIM} strokeWidth={2} aria-hidden />
          <Download size={17} color={DIM} strokeWidth={2} aria-hidden />
          <EllipsisVertical size={17} color={DIM} aria-hidden />
          <span className="ml-auto flex items-center gap-3">
            <Shuffle size={19} color={PLAYING} strokeWidth={2.2} aria-hidden />
            <span className="grid h-[34px] w-[34px] place-items-center rounded-full" style={{ background: PLAYING }}>
              <Play size={16} fill={SHELL} color={SHELL} aria-hidden />
            </span>
          </span>
        </div>

        {/* `overflow-hidden`: the list is the only thing that may be cut, and it
            is cut at the bottom where a real screen cuts it. Without it the rows
            ran under the now-playing bar. */}
        <div className="relative mt-1 flex min-h-0 flex-1 flex-col gap-0 overflow-hidden">
          {list.map((t, i) => (
            <Row
              key={t.title}
              track={t}
              index={i}
              state={at === i ? 'playing' : at > i ? 'played' : 'ahead'}
            />
          ))}
        </div>

        {/* THE END OF THE LIST IS A DRAWN THING, not the absence of one. "So what
            told it to stop?" is the question the whole session answers. */}
        {stopped && arrived && (
          <motion.div
            className="relative mt-1 shrink-0 rounded-md px-2 py-[3px] text-center font-heading text-[12px] font-bold"
            style={{ background: `${colors.danger}26`, color: '#FF9A9A' }}
            initial={instant ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: T.label, ease: c4(E.out) }}
          >
            No songs left. It stops.
          </motion.div>
        )}

        {/* THE NOW-PLAYING BAR, TINTED FROM THE RECORD THAT IS PLAYING. Every
            music app has one and it takes its colour from the cover, which is
            why it is the strip people recognise at a glance. Its absence was
            the loudest thing missing from the first cut: a player with no
            now-playing strip reads as a list, not as something running. */}
        <div
          className="relative mt-1 flex shrink-0 items-center gap-2 rounded-md px-2 py-[5px]"
          style={{
            background: nowTrack
              ? `linear-gradient(90deg, ${nowTrack.art}E6, ${nowTrack.art}99)`
              : SHELL_2,
          }}
        >
          <span
            className="grid h-[22px] w-[22px] shrink-0 place-items-center overflow-hidden rounded-[2px]"
            style={{
              backgroundImage: nowTrack
                ? `linear-gradient(135deg, ${nowTrack.art}, #00000066)`
                : 'linear-gradient(135deg,#3A3A3A,#2A2A2A)',
            }}
          >
            <span className="h-full w-full" style={{
              backgroundImage:
                'repeating-linear-gradient(115deg, rgba(255,255,255,0.22) 0 2px, rgba(255,255,255,0) 2px 7px)',
            }} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[11.5px] font-semibold leading-[1.2]" style={{ color: colors.white }}>
              {nowTrack ? nowTrack.title : 'Nothing playing'}
            </span>
            <span className="block truncate text-[10px] leading-tight" style={{ color: '#FFFFFFB3' }}>
              {nowTrack ? nowTrack.artist : "Today\u2019s Mix"}
            </span>
          </span>
          {/* The bars run here too. This strip is the one a phone keeps on
              screen, so it is where "something is playing" has to be visible. */}
          {nowTrack && <Equaliser />}
          <CirclePlus size={15} color={colors.white} strokeWidth={1.9} aria-hidden className="shrink-0" />
          <Play size={15} fill={colors.white} color={colors.white} aria-hidden className="shrink-0" />
        </div>

        {/* THE TAB BAR. The last thing that says "this is a phone app and not a
            card with a list on it". */}
        <div className="relative mt-1 flex shrink-0 items-start justify-around border-t pt-1" style={{ borderColor: '#242424' }}>
          {[
            { Icon: House, label: 'Home', on: false },
            { Icon: Search, label: 'Search', on: true },
            { Icon: Library, label: 'Your Library', on: false },
          ].map(({ Icon, label, on }) => (
            <span key={label} className="flex flex-col items-center gap-[3px]">
              <Icon size={15} color={on ? colors.white : '#7A7A7A'} strokeWidth={1.9} aria-hidden />
              <span className="text-[9px] leading-none" style={{ color: on ? colors.white : '#7A7A7A' }}>
                {label}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* The controls live in THIS column, not under the whole figure. Under
          the figure they cost the phone forty pixels of height, and the phone
          is the thing that has to keep its proportions. */}
      {/* CAPPED, NOT PUSHED DOWN. The column starts at x358 and its rows were
          858px wide, so they ran to x1216 and into the instructor's video
          rectangle (x913..1280, y0..220). Capping at 548 stops them at x906 and
          keeps them level with the top of the phone, which padding down would
          have cost. */}
      <div className="flex max-w-[548px] flex-col pt-[8px]">
        <BeatList beats={beats} at={reached - 1} />
        <StepControls className="mt-5 justify-start" showCount={false} />
      </div>
    </div>
    </div>
  )
}
