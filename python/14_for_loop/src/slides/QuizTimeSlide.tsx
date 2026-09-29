import { motion } from 'framer-motion'
import { SlideBase } from '@/ui'
import { Nova } from '@/ui/characters/Nova'
import { useInstant } from '@/motion/instant'
import type { QuizTimeSlideProps } from './types'

/**
 * QUIZ TIME — an announcement frame, not a question frame.
 *
 * This slide still carries no question, no options and no answer. The question
 * itself is asked from the quiz tool, so the deck never holds a second copy of
 * it that can drift, and no answer sits on a slide the room has already seen.
 *
 * WHAT IT DOES CARRY, AND WHY THAT CHANGED. Content rule 28 used to say the
 * frame may show the two words "Quiz Time" and nothing more, because a
 * subtitle had previewed the questions. The pedagogy team's own build shows
 * three numbered steps instead, and the user asked for them explicitly and
 * overrode the rule. They are procedure, not content: where to open it, that
 * it is answered alone, and that the answers are gone through together. None
 * of the three names a concept the quiz asks about, which is the line rule 28
 * was really drawing, and the room needs them read out anyway.
 *
 * LAYOUT, from the reference's own card. A dark panel, because the switch from
 * "listen" to "answer" is worth a frame that does not look like the last one:
 * the announcement and the three steps on the left, and on the right a MOCK
 * quiz card - a pill, a progress row, two skeleton lines, four options with one
 * picked, and Submit - so the room recognises the screen before it opens it.
 * The card shows no real question: the bars are bars.
 */

const EASE = [0.16, 1, 0.3, 1] as const

const STEPS = [
  'Open the quiz on your portal',
  'Answer every question on your own',
  'We go through the answers together',
] as const

/** Blanks, not text: the card is a picture of a quiz, not a quiz. */
const OPTIONS = [
  { letter: 'A', width: 150, picked: false },
  { letter: 'B', width: 190, picked: true },
  { letter: 'C', width: 120, picked: false },
  { letter: 'D', width: 170, picked: false },
] as const

function MockQuizCard({ instant }: { instant: boolean }) {
  return (
    <motion.div
      className="w-[380px] rounded-[20px] bg-white p-5 shadow-2xl"
      initial={instant ? false : { opacity: 0, y: 26, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.35, duration: 1, ease: EASE }}
    >
      <div className="flex items-center gap-3">
        <span className="rounded-pill bg-brand px-3 py-1 font-heading text-[13px] font-bold uppercase tracking-wider text-white">
          Quiz
        </span>
        <span className="flex flex-1 items-center gap-1.5">
          {[true, true, false, false, false].map((on, i) => (
            <i
              key={i}
              className="h-2 w-2 rounded-full"
              style={{ background: on ? '#0B5FFF' : '#D8E3F0' }}
            />
          ))}
        </span>
        <span className="font-heading text-[13px] font-bold text-body">Timer</span>
      </div>

      {/* The question, as two grey bars. Drawing words here would be a question
          on the slide, which is the thing this frame exists not to do. */}
      <div className="mt-4 space-y-2">
        <span className="block h-3 w-full rounded-pill bg-line" />
        <span className="block h-3 w-3/5 rounded-pill bg-line" />
      </div>

      <ol className="mt-4 space-y-2">
        {OPTIONS.map((o) => (
          <li
            key={o.letter}
            className="flex items-center gap-3 rounded-card border-2 px-3 py-1.5"
            style={{
              borderColor: o.picked ? '#0B5FFF' : '#E3EBF3',
              background: o.picked ? '#EAF2FF' : '#fff',
            }}
          >
            <span
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-heading text-[13px] font-bold"
              style={{
                background: o.picked ? '#0B5FFF' : '#F1F5FA',
                color: o.picked ? '#fff' : '#6B7B8C',
              }}
            >
              {o.letter}
            </span>
            <span className="h-2.5 rounded-pill bg-line" style={{ width: o.width * 0.7 }} />
          </li>
        ))}
      </ol>

      <div className="mt-4 grid place-items-center rounded-pill bg-brand py-2 font-heading text-body-sm font-bold uppercase tracking-wider text-white">
        Submit
      </div>
    </motion.div>
  )
}

export function QuizTimeSlide({ title = 'Classroom Quiz', lesson }: QuizTimeSlideProps) {
  const instant = useInstant()
  return (
    <SlideBase variant="night" lesson={lesson} decor={false}>
      {/* Two washes, both behind the panel and inside the canvas, so the frame
          overflow sweep stays clean. */}
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-brand/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-2 right-2 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

      <div className="grid h-full grid-cols-[1fr_auto] items-center gap-10">
        <div className="relative z-10">
          <motion.div
            className="inline-flex items-center gap-3 rounded-pill bg-white/10 px-5 py-2 ring-1 ring-white/20"
            initial={instant ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="text-body-sm font-bold uppercase tracking-[0.18em] text-white/80">
              Quiz time
            </span>
          </motion.div>

          <motion.h2
            className="mt-5 font-heading text-[64px] font-extrabold leading-[1.02] text-white"
            initial={instant ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: EASE }}
          >
            {title}
          </motion.h2>

          <motion.p
            className="mt-3 text-body-xl text-white/70"
            initial={instant ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: EASE }}
          >
            Time to check what you have learned so far.
          </motion.p>

          <ol className="mt-7 space-y-3">
            {STEPS.map((text, i) => (
              <motion.li
                key={text}
                className="flex items-center gap-4"
                initial={instant ? false : { opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.16, duration: 0.8, ease: EASE }}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent font-heading text-body font-bold text-ink">
                  {i + 1}
                </span>
                <span className="font-heading text-body-xl font-semibold text-white">{text}</span>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* PUSHED DOWN AND IN. The instructor's video holds x913..1280, y0..220,
            and the card's top right corner reached into it at full height. */}
        {/* `place-items-end`: the card is right-aligned ON PURPOSE, the same as
            the mascot corner on RecapSlide, so `align-check.mjs` should measure
            it against the right edge and not the header's left datum. */}
        <div className="relative z-10 flex translate-y-[70px] place-items-end items-end justify-self-end gap-1">
          <MockQuizCard instant={instant} />
          {/* The kit's own character, not a second one drawn for this frame. */}
          <Nova pose="point" className="w-[130px]" />
        </div>
      </div>
    </SlideBase>
  )
}
