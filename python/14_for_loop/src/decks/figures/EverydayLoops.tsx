import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useClaimedSteps } from '@/motion/Stepper'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'

/**
 * EVERYDAY LOOPS — the "where else does this happen?" beat drawn as three real
 * interfaces that are each mid-loop, not three cards with a sentence in them.
 *
 * WHY THIS EXISTS. The first cut of this slide was a `CardGrid` of three
 * `Card`s: an icon, a bold title, one line of copy. It was rejected, and course
 * rule R5c item 5 is the rule it was rejected against: *"A flow beat is three
 * real interfaces, not three text cards. Three Cards with a sentence each is the
 * thing this rule exists to stop: it is the same content with the argument
 * removed."* The argument here is that the room has ALREADY watched three loops
 * run today. A sentence reporting that fact is not the same as a register whose
 * tick is moving down the names while the instructor talks.
 *
 * So the register ticks, the story bars fill, and the items cross the scanner.
 * The copy underneath is unchanged; what changed is that the copy is now a
 * caption on something happening rather than the whole card.
 *
 * WHAT MUST NOT HAPPEN HERE
 *
 * 1. **The idle loops never advance the build.** Course rule R5c item 4 says
 *    nothing moves until the presenter presses, and allows exactly one
 *    exception: "a figure may hold a continuous idle loop (an equaliser, a story
 *    bar), but it never advances its own state on a timer." That is this figure,
 *    twice over — a story bar is the rule's own example. The loops are ambient.
 *    They change nothing the frame SAYS: the one press on this slide reveals the
 *    three titles and captions, and the loops look identical before and after.
 *
 * 2. **The three never beat in unison.** Each card runs its own period —
 *    2600ms, 3000ms and 3400ms for one full pass — because three loops in
 *    lockstep read as one animation with three parts, which is the opposite of
 *    the claim ("this same shape, in three unrelated places"). The numbers are
 *    from the reference's own build notes and they are mutually prime enough
 *    that the phase drifts for the whole time the slide is up.
 *
 * 3. **Nothing states a count.** Same reason as the phone in `PhonePlaylist`
 *    (deck note 10): the next beat's punchline is *"nowhere does it say six"*.
 *    No card here shows "5 names" or "4 items", and the captions say "until the
 *    names run out", not how many there are.
 *
 * DOM, NOT SVG (content rule 17). Every name, every caption, the `beep` readout
 * and the "Send message" placeholder are real elements, so `align-check.mjs` can
 * measure each one. The only SVG is the tick glyph, which carries no text.
 *
 * TYPE FLOOR. Names 17px, captions 16px (`body-sm`, the floor itself), and the
 * one micro-label is 15px uppercase at 0.14em — the exempt kicker signature
 * `qa.mjs` allows by shape, not by class name.
 *
 * SESSION-LOCAL, AND TEMPORARILY. Same as its five siblings: when
 * `slide-kit/sequence-lab/` lands, this moves into `slide-kit/slide-template/`
 * and the deck re-points at `@/ui`.
 */

/*
  OBJECT COLOURS, NOT PALETTE.

  The same category as `PiggyBank`'s pink and `PhonePlaylist`'s dark shell: these
  describe a real thing the room has to recognise in a second, from the back of a
  room, so they do not belong in `tokens.ts` and no future deck should reach for
  them as a style.

  - The story gradient is the orange-to-purple every phone in the room has seen
    behind a story. In the deck's brand blue it is a blue rectangle.
  - The cartons on the belt are groceries. Four identical grey boxes do not read
    as a basket; four differently coloured ones do, and their exact hues carry no
    meaning at all, which is why they are muted rather than the palette's own.
  - The scanner readout is the green a till prints. A `success` green chip reads
    as a tick; this reads as an LED.
*/
const STORY_GRADIENT = 'linear-gradient(150deg, #F9A03C 0%, #E1306C 48%, #7B3FE4 100%)'
const CARTONS = ['#4A90C4', '#6FA96B', '#D4685F', '#8E6FC0']
const SCANNER_GREEN = '#6EE7A8'

export type LoopScene =
  | { kind: 'register'; names: string[] }
  /** How many stories are in the ring. The phone never prints the number. */
  | { kind: 'stories'; stories: number }
  | { kind: 'counter'; items: number; beep: string }

export interface LoopCard {
  /** The card's name. A `ReactNode` so the deck can hang a product mark on it. */
  title: ReactNode
  /** The source's sentence, verbatim. */
  caption: string
  scene: LoopScene
  /**
   * One full pass of this card's idle loop, in ms. Defaults to 2600 / 3000 /
   * 3400 by position, which is what keeps the three out of phase. Override only
   * with another set that is just as uneven.
   */
  period?: number
}

export interface EverydayLoopsProps {
  cards: LoopCard[]
  /** The micro-label on a card before it is revealed. The room fills it in. */
  placeholder?: string
  className?: string
}

const PERIODS = [2600, 3000, 3400]

/**
 * ONE POSITION, ADVANCED ON THIS CARD'S OWN CLOCK.
 *
 * Returns the index the card is currently on. Under `useInstant()` it returns a
 * settled 0 and starts no interval at all, so an instant jump, the single-file
 * export and every harness mount a still frame rather than three running
 * animations.
 */
function useCycle(count: number, period: number): number {
  const instant = useInstant()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (instant || count < 1) return
    const id = setInterval(() => setI((n) => (n + 1) % count), Math.round(period / count))
    return () => clearInterval(id)
  }, [instant, count, period])
  return instant ? 0 : i
}

const ROW_H = 30
const ROW_GAP = 6
const ROW_PITCH = ROW_H + ROW_GAP

/** The attendance register: a tick that walks the names, one at a time. */
function RegisterScene({ names, period }: { names: string[]; period: number }) {
  const instant = useInstant()
  const at = useCycle(names.length, period)
  const height = names.length * ROW_PITCH - ROW_GAP
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col" style={{ gap: ROW_GAP }}>
        {names.map((name, i) => (
          <div
            key={name}
            className="flex w-[206px] items-center rounded-lg border-2 px-3 text-[17px] leading-none"
            style={{
              height: ROW_H,
              borderColor: i === at ? colors.brand : colors.line,
              background: i === at ? `${colors.brand}14` : colors.white,
              color: colors.ink,
            }}
          >
            {name}
          </div>
        ))}
      </div>
      {/* The tick travels down the column rather than blinking on and off: the
          claim is that ONE hand is moving, not that five ticks exist. */}
      <div className="relative w-[32px] shrink-0" style={{ height }}>
        <motion.span
          className="absolute left-0 grid place-items-center rounded-full"
          style={{ top: 1, height: 32, width: 32, background: `${colors.success}1F` }}
          animate={{ y: at * ROW_PITCH }}
          transition={instant ? { duration: 0 } : { duration: 0.34, ease: c4(E.inOut) }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden fill="none">
            <path
              d="M5 12.5 L10 17.5 L19 6.5"
              stroke={colors.success}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </div>
    </div>
  )
}

/** Stories: the bars along the top fill one after another, then wrap. */
function StoriesScene({ stories, period }: { stories: number; period: number }) {
  const instant = useInstant()
  const at = useCycle(stories, period)
  const each = period / stories / 1000
  return (
    <div
      className="flex h-[194px] w-[162px] flex-col justify-between overflow-hidden rounded-[20px] border-[5px] p-2.5"
      style={{ borderColor: colors.nwBlack, backgroundImage: STORY_GRADIENT }}
    >
      <div>
        <div className="flex gap-[3px]">
          {Array.from({ length: stories }, (_, i) => (
            <span
              key={i}
              className="h-[3px] flex-1 overflow-hidden rounded-full"
              style={{ background: '#FFFFFF59' }}
            >
              {/* The bar that is filling restarts from zero on every pass, which
                  is what the changing `key` forces. The bars behind it stay
                  full, the ones ahead stay empty, and none of them animates. */}
              <motion.span
                key={i === at ? `run-${at}` : `hold-${i}`}
                className="block h-full rounded-full"
                style={{ background: colors.white }}
                initial={i === at && !instant ? { width: '0%' } : false}
                animate={{ width: i <= at ? '100%' : '0%' }}
                transition={
                  i === at && !instant ? { duration: each, ease: 'linear' } : { duration: 0 }
                }
              />
            </span>
          ))}
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <span className="h-[22px] w-[22px] rounded-full" style={{ background: '#FFFFFFE6' }} />
          <span className="h-[7px] w-[74px] rounded-full" style={{ background: '#FFFFFFB3' }} />
        </div>
      </div>
      <div
        className="rounded-pill border px-3 py-1 text-center text-[16px] leading-tight"
        style={{ borderColor: '#FFFFFF8C', color: colors.white }}
      >
        Send message
      </div>
    </div>
  )
}

const ITEM = 54
const ITEM_GAP = 14
const ITEM_PITCH = ITEM + ITEM_GAP
const BELT_W = 276
const SCANNER_X = 150

/** The billing counter: cartons crossing the scanner, one beep each. */
function CounterScene({ items, beep, period }: { items: number; beep: string; period: number }) {
  const instant = useInstant()
  const at = useCycle(items, period)
  return (
    <div className="flex flex-col items-center">
      {/* The basket runs off both ends. A hard cut at the window edge reads as a
          rendering mistake; a fade reads as "there is more coming", which is the
          caption's own claim. */}
      <div
        className="relative overflow-hidden"
        style={{
          width: BELT_W,
          height: 68,
          maskImage: 'linear-gradient(90deg, transparent 0, #000 22px, #000 calc(100% - 22px), transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(90deg, transparent 0, #000 22px, #000 calc(100% - 22px), transparent 100%)',
        }}
      >
        <motion.div
          className="absolute top-[7px] flex"
          style={{ gap: ITEM_GAP }}
          animate={{ x: SCANNER_X - (at * ITEM_PITCH + ITEM / 2) }}
          transition={instant ? { duration: 0 } : { duration: 0.44, ease: c4(E.inOut) }}
        >
          {Array.from({ length: items }, (_, i) => (
            <span
              key={i}
              className="shrink-0 rounded-lg"
              style={{ width: ITEM, height: ITEM, background: CARTONS[i % CARTONS.length] }}
            />
          ))}
        </motion.div>
        {/* The scanner beam is fixed and the basket moves past it, which is the
            way round a real counter works and the way round that makes "one item
            over the scanner" a thing the room can see happening. */}
        <span
          className="absolute top-0 w-[2px]"
          style={{ left: SCANNER_X - 1, height: 68, background: colors.danger }}
        />
      </div>
      <span
        className="mt-1 block rounded-full"
        style={{ width: BELT_W, height: 8, background: colors.line }}
      />
      {/* One beep per crossing. It re-enters on every tick rather than pulsing
          on a loop of its own, so the sound and the item are the same event. */}
      <motion.span
        key={at}
        className="mt-4 rounded-lg px-4 py-1 font-mono text-[16px] leading-tight"
        style={{ background: colors.ink, color: SCANNER_GREEN }}
        initial={instant ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.22, ease: c4(E.out) }}
      >
        {beep}
      </motion.span>
    </div>
  )
}

function Scene({ scene, period }: { scene: LoopScene; period: number }) {
  if (scene.kind === 'register') return <RegisterScene names={scene.names} period={period} />
  if (scene.kind === 'stories') return <StoriesScene stories={scene.stories} period={period} />
  return <CounterScene items={scene.items} beep={scene.beep} period={period} />
}

export function EverydayLoops({ cards, placeholder = 'Yours', className = '' }: EverydayLoopsProps) {
  const instant = useInstant()
  /*
    ONE PRESS, AND IT IS THE ONLY THING THAT CHANGES WHAT THE FRAME SAYS.

    Before it, the three screens are already running but sit unnamed behind a
    dashed frame: the slide is asking the room for three places, and three blanks
    is what asking looks like. The press names them. This is the reference's own
    two states, and it is why the figure claims one step and not three — the room
    calls out all three, then all three are confirmed at once.
  */
  const [named] = useClaimedSteps(1)

  return (
    <div className={`flex justify-center gap-6 ${className}`}>
      {cards.map((card, i) => (
        <div
          key={i}
          className="flex w-[352px] flex-col rounded-card border-2 p-5"
          style={{
            borderColor: named ? colors.line : colors.muted,
            borderStyle: named ? 'solid' : 'dashed',
            background: colors.white,
            boxShadow: named ? '0 6px 24px -10px rgba(0, 37, 75, 0.16)' : 'none',
          }}
        >
          <div
            className="grid h-[206px] place-items-center rounded-xl2 border"
            style={{
              borderColor: colors.line,
              background: colors.surface,
              /* Unnamed, the screen is still running; it is just not yet the
                 room's answer. Faded rather than hidden, because a blank box
                 asks nothing. */
              opacity: named ? 1 : 0.34,
            }}
          >
            <Scene scene={card.scene} period={card.period ?? PERIODS[i] ?? PERIODS[0]} />
          </div>

          <div className="mt-4 flex min-h-[80px] flex-col items-center justify-center text-center">
            {named ? (
              <motion.div
                initial={instant ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: T.enter,
                  ease: c4(E.out),
                  delay: instant ? 0 : i * T.stagger,
                }}
              >
                <div
                  className="font-heading text-[18px] font-bold leading-tight"
                  style={{ color: colors.ink }}
                >
                  {card.title}
                </div>
                <p className="mt-1 text-body-sm" style={{ color: colors.body }}>
                  {card.caption}
                </p>
              </motion.div>
            ) : (
              <span
                className="font-heading text-[15px] font-bold uppercase tracking-[0.14em]"
                style={{ color: colors.muted }}
              >
                {placeholder}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
