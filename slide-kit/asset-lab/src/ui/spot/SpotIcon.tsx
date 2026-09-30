import type { CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'
import { CAST, SPOT, maxBox, maxWidth, type CastName, type SpotName } from './spotAssets'

/**
 * ONE SPOT ICON, DRAWN FROM THE REGISTRY.
 *
 * It takes a NAME and not a path, which is the whole point: the name is a key in
 * `spotAssets.ts`, so every use of an icon goes past the row that says what the
 * artwork actually shows and how big it may be drawn. A path in the JSX skips
 * both.
 *
 * IT IS FITTED INTO A SQUARE BOX, AND THAT IS THE MOST IMPORTANT LINE IN THE FILE.
 *
 * `size` is the side of a square, not a width. The artwork is centred inside it
 * with `object-contain`, so a 268x228 triangle and a 270x185 keyboard both occupy
 * exactly `size` by `size` and whatever follows them starts at the same y.
 *
 * The first pass sized by WIDTH, which is the obvious reading of "make this icon
 * 78px", and the render said no. These assets have wildly different aspect
 * ratios: at 78px wide the magnifier came out 72px tall, the folder 70, the
 * crossed tools 71 and the keyboard 53. On slide 4 that put the four step labels
 * at four different heights, with `Run` sitting 19px above `Read`, and the row of
 * nodes stopped reading as a row. The same thing was happening to the four card
 * titles on slide 2, where it is subtler and therefore worse.
 *
 * A mixed-aspect raster set cannot be aligned by sizing it. It has to be BOXED,
 * and the box is what the layout measures. This is the single thing most likely
 * to go wrong when raster art replaces a line-icon set, because line icons all
 * come off one grid and never have the problem.
 *
 * WHY THERE IS NO TINTED WELL BEHIND IT
 *
 * The kit's `GlyphWell` puts a line icon on an 8% tint, and it is right for a
 * line icon: a 2px stroke with nothing behind it floats. These do not float. They
 * are modelled objects with their own highlight and their own soft shadow, and a
 * tinted square behind one is a box inside a box: the icon already has an edge,
 * and the well adds a second one 8px outside it.
 *
 * `ground="glow"` is the alternative and it is not a well. A soft radial wash,
 * no edge, sized larger than the icon and centred under it, so the icon sits in
 * something rather than on it. It is off by default: at card scale the card
 * already provides the ground.
 *
 * THE CLAMP
 *
 * The box is clamped to the asset's long side, which is the point at which
 * `object-contain` stops shrinking the art and starts enlarging it. See
 * `maxBox`. The clamp is silent in the render and loud in the console, which is
 * the right way round: a deck that has asked for 400px of a 268px icon should
 * still present, and the person editing it should be told.
 */
export function SpotIcon({
  name,
  size,
  ground = 'none',
  className = '',
  style,
}: {
  name: SpotName
  /** Rendered WIDTH in slide pixels. Clamped to the asset's intrinsic width. */
  size: number
  ground?: 'none' | 'glow'
  className?: string
  style?: CSSProperties
}) {
  const a = SPOT[name]
  const cap = maxBox(a)
  const box = Math.min(size, cap)
  if (import.meta.env.DEV && size > cap) {
    console.warn(
      `[spot] "${name}" asked for a ${size}px box and its export is ${cap}px on the long side; ` +
        `clamped. Re-export it larger from Figma if the slide needs it at ${size}.`,
    )
  }

  return (
    <span
      /*
        `grid place-items-center` rather than a bare block: the art is smaller
        than the box on one axis, and it has to sit in the middle of the box on
        that axis. Left in the corner, a wide flat icon like the keyboard hangs
        off the top of its own node and the alignment this box exists to give is
        given back.
      */
      className={`relative grid shrink-0 place-items-center ${className}`}
      style={{ width: box, height: box, ...style }}
    >
      {ground === 'glow' && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: box * 1.4,
            height: box * 1.4,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(closest-side, ${colors.brand}1F, ${colors.brand}08 58%, transparent)`,
          }}
        />
      )}
      <img
        src={a.src}
        /*
          EMPTY ALT, DELIBERATELY, AND IT IS NOT LAZINESS.

          Every icon in this deck sits beside the words it illustrates: a card
          title, a step label, a takeaway. Alt text would repeat that sentence,
          and a screen reader would read the slide twice. The kit does the same
          everywhere, and `drawn` in the registry is where the description lives
          for the people who need it, which is reviewers rather than readers.
        */
        alt=""
        draggable={false}
        /* `object-contain` is what fits the art into the square without
           distorting it, and it is the whole mechanism. Without it the browser
           stretches a 270x185 keyboard into a square and nobody spots it,
           because a squashed icon still looks like an icon. */
        className="relative block h-full w-full object-contain"
      />
    </span>
  )
}

/**
 * A CAST FIGURE: a person, cut out, with nothing behind them.
 *
 * Separate from `SpotIcon` rather than a flag on it, because the two are used
 * differently and the differences are not style. A spot icon is an ornament on a
 * label and is sized by the label; a figure is a presence on the frame and is
 * sized by the frame. A figure also has a `crop`, and the crop decides where its
 * weight sits, which nothing about an icon does.
 *
 * NOTHING GOES BEHIND IT. See the note in `spotAssets.ts`: the kit removed a disc
 * from behind `QuizTimeSlide`'s character because it read as a plate the
 * illustration had been dropped onto, and this is the same artwork family.
 *
 * LIGHT GROUNDS ONLY, for the same component's other stated reason: these figures
 * are drawn in the deck's own brand blue, so on the navy stage they sink.
 *
 * SIZED BY WIDTH, NOT BOXED. The opposite of `SpotIcon` above, and for the
 * reason that makes the box necessary there: icons stand in rows and have to
 * share a baseline, and a figure never stands in a row. Boxing a bust into a
 * square would put air above its head that the layout then has to compensate for.
 *
 * THE ENTRANCE IS SLOWER THAN A CARD'S AND IT HAS A REASON.
 *
 * `T.travel`, 780ms, against `T.enter`'s 520. A figure is the largest single
 * object on any slide it is on, and a large object arriving at a small object's
 * speed reads as a snap. It also rises further, 16px against a card's 10, because
 * the distance has to stay proportional to the thing moving or the motion looks
 * like a twitch.
 */
export function Cast({
  name,
  size,
  className = '',
  style,
}: {
  name: CastName
  /** Rendered WIDTH in slide pixels. Clamped to the asset's intrinsic width. */
  size: number
  className?: string
  style?: CSSProperties
}) {
  const reduce = useReducedMotion()
  const a = CAST[name]
  const cap = maxWidth(a)
  const w = Math.min(size, cap)
  if (import.meta.env.DEV && size > cap) {
    console.warn(
      `[cast] "${name}" asked for ${size}px and its export is ${cap}px wide; clamped. ` +
        `Re-export it larger from Figma if the slide needs it at ${size}.`,
    )
  }
  const h = Math.round((w * a.h) / a.w)

  return (
    <motion.img
      src={a.src}
      alt=""
      draggable={false}
      className={`block object-contain ${className}`}
      style={{ width: w, height: h, ...style }}
      initial={reduce ? false : { opacity: 0, transform: 'translateY(16px) scale(0.97)' }}
      animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
      transition={{ duration: T.travel, delay: T.lead, ease: c4(E.out) }}
    />
  )
}
