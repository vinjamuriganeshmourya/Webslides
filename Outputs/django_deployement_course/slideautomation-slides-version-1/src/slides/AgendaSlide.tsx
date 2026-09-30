import { motion } from 'framer-motion'
import { SlideBase } from '@/ui'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import type { AgendaSlideProps } from './types'

/**
 * AGENDA — a brand disc on the left holding the session name and the word
 * Agenda, and the session's movements as a straight, left-aligned column on the
 * right.
 *
 * WHAT CHANGED FROM THE CURVE VERSION, AND WHY
 *
 * The previous version strung the numbers along a drawn Bézier that swept in
 * from the top left, bulged right and ran off the bottom edge, with a second
 * ring orbiting the disc and a blurred blue field behind both. It was the most
 * decorated frame in the deck and the decoration cost the frame its job:
 *
 *   1. **The points could not line up.** Their x came from sampling the curve,
 *      so every item started at a different left edge (424 to 548 across four
 *      items). A list of four peer concepts drawn with four different indents
 *      reads as four unrelated labels, and there is no way to scan it.
 *   2. **Three background elements, none of them content.** The curve, the
 *      orbit ring and the blur field all drew attention to themselves on the one
 *      slide whose whole purpose is four short phrases the room must remember.
 *   3. **The items were 27px Sora bold in brand blue**, which is heading
 *      treatment. Every other list in this deck sets its items in Inter at
 *      `ink` with the supporting line in `body` grey (see `BulletList`), so the
 *      agenda was the one place the type system was contradicted.
 *
 * So: no curve, no ring, no field. The numbers and their titles share one left
 * edge, the type matches the deck's own list treatment, and the disc carries the
 * brand gradient rather than the divider navy, which is what separates this
 * opening frame from the nine section breakers that follow it.
 *
 * GEOMETRY, AND THE ONE NUMBER THAT IS LOAD-BEARING
 *
 * The column is 420px wide at x=470, so its right edge is x=890. The reserved
 * instructor-video rectangle starts at x=913 (rule R6). That 23px of clearance
 * is what lets the column be vertically CENTRED on the disc instead of being
 * pushed below y=220 the way the curve version had to be: a long `sub` wraps
 * inside the column rather than running toward the reserved corner.
 *
 * Widening the column past 440px puts the longest `sub` back into that corner.
 * `node video-safe.mjs` is the check.
 */

/** The disc, centred. */
const DISC = { cx: 292, cy: 366, size: 268 }

/** The column of items: left edge, width, and the band it centres inside. */
const COL = { left: 470, width: 420, top: 146, height: 440 }

/** Explanatory tier, not UI tier: 520ms entrances on a 130ms stagger. */
const RISE = 0.52
const STAGGER = 0.13

export function AgendaSlide({
  kicker = 'Agenda',
  title = 'Agenda',
  items,
  lesson,
}: AgendaSlideProps) {
  const instant = useInstant()

  return (
    /*
      `decor={false}`: no wash, no orbit arcs. The light family's background
      furniture is right on a slide with a figure in it and wrong here, where the
      frame is four phrases the room has to memorise and the arcs were two more
      lines behind them.
    */
    <SlideBase variant="light" lesson={lesson} padded={false} decor={false}>
      {/* THE DISC. A solid brand field with the style guide's own gradient
          (#2D63FB into #0146C7), which is `bg-nw-gradient` in Tailwind and is
          written out here because this element also needs its size in px. */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: DISC.cx, top: DISC.cy }}
      >
        <motion.div
          className="grid place-items-center rounded-full text-center"
          style={{
            width: DISC.size,
            height: DISC.size,
            background: `linear-gradient(135deg, ${colors.nwBlue} 0%, ${colors.brandDark} 100%)`,
            boxShadow: `0 18px 44px -22px ${colors.brandDeep}80`,
          }}
          initial={instant ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: instant ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="px-10">
            <p className="text-body-sm font-semibold leading-snug text-white/75">{kicker}</p>
            <p className="mt-1 font-heading text-[46px] font-extrabold leading-none text-white">
              {title}
            </p>
          </div>
        </motion.div>
      </div>

      {/*
        THE COLUMN. One left edge for every number and every title, and the
        whole column centred on the disc's own centre line, so the two halves of
        the slide balance without either being nudged by hand.
      */}
      <div
        className="absolute flex flex-col justify-center"
        style={{ left: COL.left, top: COL.top, width: COL.width, height: COL.height, gap: 26 }}
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-4"
            initial={instant ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: instant ? 0 : RISE,
              delay: instant ? 0 : 0.18 + i * STAGGER,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span
              className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full font-heading text-body-sm font-bold"
              style={{ background: `${colors.brand}1a`, color: colors.brandDark }}
            >
              {i + 1}
            </span>
            <span className="min-w-0">
              {/* The deck's own list treatment: Inter, `ink`, with the
                  supporting line in `body` grey underneath it. */}
              <span
                className="block text-[26px] font-semibold leading-tight"
                style={{ color: colors.ink }}
              >
                {item.title}
              </span>
              {item.sub && (
                <span className="mt-1 block text-body-sm" style={{ color: colors.body }}>
                  {item.sub}
                </span>
              )}
            </span>
          </motion.div>
        ))}
      </div>
    </SlideBase>
  )
}
