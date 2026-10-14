import { motion } from 'framer-motion'
import { SlideBase } from '@/ui/SlideBase'
import { useInstant } from '@/motion/instant'

/**
 * THE QUIZ SLIDE OF THIS DECK (user, 2026-10-13): the reference deck's quiz
 * slide, `new-template-slide-generation/dist-single/new-template-working-with-lists.html`
 * slide 19, carried here with its layout, structure and styling (its
 * `src/slides/QuizTimeSlide.tsx`, the announcement variant without steps).
 * It replaces the `ClassroomQuiz` frame sessions 21 to 30 used.
 *
 * An announcement frame, not a question frame: it carries no question, no
 * options and no answer (content rule 28). The question is asked from the
 * quiz tool.
 *
 * LAYOUT, as the reference: two halves on one shared centre line, the
 * announcement on the left (the `Your Turn` pill with its accent dot, the
 * 88px title, the gradient rule that draws itself to 220px), the character
 * on the right: the four keyed layers of one illustration (brain, bulb,
 * bubble, question mark) stacked on one 540 x 400 canvas so they recompose
 * exactly, with a CSS glow breathing behind the bulb. The stage is pushed
 * down 160px so the tallest layer starts below the speaker box (y 220).
 *
 * WHAT STAYS THE DECK'S (the user's constraint: fonts, colours and spacing
 * consistent with the rest of the deck): the heading face is Poppins where
 * the reference set Sora, the ink is this deck's ink, and the stage is the
 * kit's light stage with its own wash rather than the other template's
 * ground. Brand, accent and the soft field are the same values in both.
 */
const EASE = [0.16, 1, 0.3, 1] as const
const STAGE_W = 540
const STAGE_H = 400
const LAYERS = [
  { key: 'brain', src: '/assets/quiz/brain.png', z: 1 },
  { key: 'bulb', src: '/assets/quiz/bulb.png', z: 2 },
  { key: 'bubble', src: '/assets/quiz/bubble.png', z: 3 },
  { key: 'mark', src: '/assets/quiz/mark.png', z: 4 },
] as const
/** Where the bulb's glass sits on the shared canvas, for the glow behind it. */
const BULB_GLOW = { left: '75%', top: '23%' }

export function QuizRef({ lesson, title = 'Quiz Time!', kicker = 'Your Turn' }: { lesson: string; title?: string; kicker?: string }) {
  const instant = useInstant()
  return (
    <SlideBase variant="light" lesson={lesson}>
      {/* A single wash, bottom left, clear of both halves of the content, inside the canvas. */}
      <div className="pointer-events-none absolute bottom-8 left-0 h-80 w-80 rounded-full bg-brand/[0.07] blur-3xl" />

      <div className="grid h-full grid-cols-2 items-center">
        {/* left: the announcement, centred against the character */}
        <div className="relative z-10">
          <motion.div
            className="inline-flex items-center gap-3 rounded-pill bg-brand-soft px-5 py-2 ring-1 ring-brand/15"
            initial={instant ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: instant ? 0 : 0.9, ease: EASE }}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="text-body-sm font-bold uppercase tracking-[0.18em] text-brand-700">{kicker}</span>
          </motion.div>

          <motion.h2
            className="mt-6 font-heading text-[88px] font-semibold leading-[0.98] text-ink"
            initial={instant ? false : { opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: instant ? 0 : 0.25, duration: instant ? 0 : 1.2, ease: EASE }}
          >
            {title}
          </motion.h2>

          {/* the rule draws itself, so the title lands on a beat */}
          <motion.div
            className="mt-6 h-1.5 rounded-full bg-gradient-to-r from-brand via-accent to-accent/30"
            initial={instant ? false : { width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            transition={{ delay: instant ? 0 : 0.8, duration: instant ? 0 : 1.1, ease: EASE }}
          />
        </div>

        {/* right: the character on its stage, pushed down so its tallest layer starts below the speaker box */}
        <motion.div
          className="relative z-10 flex h-full items-center justify-center pt-[160px]"
          initial={instant ? false : { opacity: 0, x: 36, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={instant ? { duration: 0 } : { delay: 0.4, duration: 1.2, ease: EASE }}
        >
          <div className="relative" style={{ width: STAGE_W, height: STAGE_H }}>
            {/* the bulb's glow, a CSS radial tied to the bulb's place on the canvas, breathing once it lands */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute z-[2] rounded-full"
              style={{
                left: BULB_GLOW.left,
                top: BULB_GLOW.top,
                width: 210,
                height: 210,
                background: 'radial-gradient(closest-side, rgba(255,196,60,0.42), rgba(255,196,60,0.12) 55%, rgba(255,196,60,0))',
              }}
              initial={instant ? false : { opacity: 0, scale: 0.5, x: '-50%', y: '-50%' }}
              animate={instant ? { opacity: 1, scale: 1, x: '-50%', y: '-50%' } : { opacity: [0, 1, 0.72, 1], scale: [0.5, 1.12, 1, 1.06], x: '-50%', y: '-50%' }}
              transition={instant ? { duration: 0 } : { delay: 1.5, duration: 2.6, times: [0, 0.22, 0.55, 1], ease: EASE, repeat: Infinity, repeatType: 'reverse' }}
            />
            {/* the four layers, stacked on one canvas to recompose the artwork; the stage above is what animates */}
            {LAYERS.map((layer) => (
              <img key={layer.key} src={layer.src} alt="" draggable={false} className="absolute inset-0 h-full w-full object-contain" style={{ zIndex: layer.z }} />
            ))}
          </div>
        </motion.div>
      </div>
    </SlideBase>
  )
}
