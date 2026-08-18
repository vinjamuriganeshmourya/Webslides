import { motion } from 'framer-motion'
import { SlideBase, Nova } from '@/ui'
import { QuestionMark } from '@/ui/characters/props'
import type { QuizTimeSlideProps } from './types'

/**
 * QUIZ TIME — an announcement frame, not a question frame.
 *
 * This slide carries no question, no options and no answer. It exists to mark
 * the switch from "listen" to "answer", so the room looks up before anything is
 * asked. The question itself is asked from the quiz tool, which means the deck
 * never holds a second copy of it that can drift out of sync, and no answer is
 * ever sitting on a slide the room has already seen.
 *
 * LAYOUT
 * Two halves on one shared centre line: the announcement on the left, the
 * character on the right, each vertically centred in its own half. Nothing is
 * placed by eye. The character sits on a soft disc that anchors it to the
 * composition, rather than floating free in the corner.
 *
 * The character is given an EXPLICIT width. `Illustration name="quiz"` renders
 * an absolutely-positioned scene (question mark right, character left), so a
 * `w-auto` box collapses to zero width and the two pieces pile onto the same
 * spot, which is what made the art read as randomly scattered. The box below
 * fixes both width and height, so the scene composes the way it was drawn.
 */

const EASE = [0.16, 1, 0.3, 1] as const

/** The stage the character stands on: sized once, reused by the disc behind it. */
const STAGE_W = 540
const STAGE_H = 400

export function QuizTimeSlide({ title = 'Quiz Time!', subtitle, lesson }: QuizTimeSlideProps) {
  return (
    /*
      LIGHT, not the brand blue used by the dividers: the character is drawn in
      brand blue, so on a blue field it sank into the background and read as a
      silhouette.
    */
    <SlideBase variant="light" lesson={lesson} decor={false}>
      {/* A single wash, bottom left, clear of both halves of the content. It is
          kept inside the canvas so the frame overflow sweep stays clean. */}
      <div className="pointer-events-none absolute bottom-8 left-0 h-80 w-80 rounded-full bg-brand/[0.07] blur-3xl" />

      <div className="grid h-full grid-cols-2 items-center">
        {/* left — the announcement, centred against the character */}
        <div className="relative z-10">
          <motion.div
            className="inline-flex items-center gap-3 rounded-pill bg-brand-soft px-5 py-2 ring-1 ring-brand/15"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="text-body-sm font-bold uppercase tracking-[0.18em] text-brand-700">
              Your turn
            </span>
          </motion.div>

          <motion.h2
            className="mt-6 font-heading text-[88px] font-extrabold leading-[0.98] text-ink"
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.25, duration: 1.2, ease: EASE }}
          >
            {title}
          </motion.h2>

          {/* the rule draws itself, so the title lands on a beat */}
          <motion.div
            className="mt-6 h-1.5 rounded-full bg-gradient-to-r from-brand via-accent to-accent/30"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.1, ease: EASE }}
          />

          {subtitle && (
            <motion.p
              className="mt-7 max-w-md text-body-xl text-body"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.9, ease: EASE }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/*
          right — the character on its stage.

          The stage is sized to fill the right half of the canvas. The top
          padding is what keeps it legal: the scene is tall enough that, centred,
          its question mark would reach into the rectangle reserved in the top
          right for the instructor video, so the whole half is pushed down until
          the tallest element starts below y=220.
        */}
        <motion.div
          className="relative z-10 flex h-full items-center justify-center pt-[160px]"
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 1.2, ease: EASE }}
        >
          <div className="relative" style={{ width: STAGE_W, height: STAGE_H }}>
            {/* the disc: grounds the character instead of leaving it mid-air */}
            {/* The centring offset is animated, not a utility class: framer-motion
                writes its own inline `transform`, which silently replaces
                Tailwind's `-translate-x-1/2 -translate-y-1/2` and left the disc
                sitting a half-width down and to the right of where it belonged. */}
            <motion.span
              aria-hidden
              className="absolute left-1/2 top-1/2 rounded-full bg-brand/[0.06]"
              style={{ width: STAGE_H, height: STAGE_H }}
              initial={{ opacity: 0, scale: 0.7, x: '-50%', y: '-50%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              transition={{ delay: 0.55, duration: 1.3, ease: EASE }}
            />
            {/*
              The character and the question mark are composed HERE rather than
              taken from the shared `quiz` scene, which spaces them at opposite
              ends of its box and leaves them reading as two unrelated objects.

              Placed as one unit instead: the character faces RIGHT so its
              pointing arm reaches toward the mark, and the mark overlaps the end
              of that reach. The gesture is what ties them together, so the pair
              has to be posed and positioned together to work.
            */}
            <Nova pose="point" facing="right" className="absolute bottom-0 left-0 h-[88%]" />
            <QuestionMark className="absolute bottom-[20%] left-[43%] h-[54%]" />
          </div>
        </motion.div>
      </div>
    </SlideBase>
  )
}
