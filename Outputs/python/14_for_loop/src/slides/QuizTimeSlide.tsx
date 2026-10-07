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
      /* TILTED, AND THAT IS THE POINT. Square-on it reads as a real quiz the
         room might try to answer from here; a few degrees off axis reads as a
         picture OF the quiz, which is what it is. The shadow does the rest. */
      className="w-[372px] -rotate-[3deg] rounded-[24px] bg-white p-4 shadow-[0_28px_60px_-12px_rgba(3,16,60,0.55)]"
      initial={instant ? false : { opacity: 0, y: 30, rotate: -9, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, rotate: -3, scale: 1 }}
      transition={{ delay: 0.3, duration: 1.1, ease: EASE }}
    >
      <div className="flex items-center gap-3">
        <span className="rounded-pill bg-brand-soft px-3 py-1.5 font-heading text-[13px] font-bold uppercase tracking-wider text-brand-700">
          Quiz
        </span>
        {/* Two of five answered: dashes, not dots, so progress reads as distance
            covered rather than as a carousel. */}
        <span className="flex flex-1 items-center gap-1.5">
          {[true, true, false, false, false].map((on, i) => (
            <i
              key={i}
              className="h-[5px] rounded-pill"
              style={{ width: on ? 22 : 18, background: on ? '#3730E0' : '#DFE6F2' }}
            />
          ))}
        </span>
        {/* THE TIMER IS THE ONE LIVE THING ON THE CARD, and it is meant to be
            noticed: an amber pill that breathes, so the room reads "this is
            timed" from the back without anyone saying it. A sweeping hand on a
            16px clock was invisible at projection size.

            CSS KEYFRAMES, NOT FRAMER. Every framer attempt here wrote its first
            keyframe and then never ticked -- `transform: none` and `opacity: 1`
            sat on the elements while the card's own one-shot entrance played
            normally. The keyframes are declared in this component so the rule
            travels with it and does not depend on a utility surviving a Tailwind
            purge.

            The clock shows no numbers. A counting-down time would be inventing
            state the room cannot act on: this is a picture OF a quiz. */}
        <style>{`
          @keyframes qtBreathe { 0%,100% { transform: scale(1) } 50% { transform: scale(1.08) } }
          @keyframes qtBlink   { 0%,100% { opacity: 1 } 50% { opacity: .2 } }
          @keyframes qtSweep   { to { transform: rotate(360deg) } }
        `}</style>
        <div
          className="flex items-center gap-2 rounded-pill px-3 py-[5px] font-heading text-[14px] font-bold"
          style={{
            background: '#FFEFD6',
            color: '#B45309',
            animation: instant ? undefined : 'qtBreathe 1.5s ease-in-out infinite',
          }}
        >
          <span
            className="h-[9px] w-[9px] shrink-0 rounded-full"
            style={{ background: '#F59E0B', animation: instant ? undefined : 'qtBlink 1.5s ease-in-out infinite' }}
          />
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4">
            <circle cx="12" cy="13" r="8" />
            <path d="M9 2h6" strokeLinecap="round" />
            {/* The hand goes round. `transform-box: view-box` is what makes the
                origin read in the svg's own units instead of the group's bbox,
                which would put the pivot at the middle of the hand. */}
            <g
              style={{
                transformOrigin: '12px 13px',
                transformBox: 'view-box',
                animation: instant ? undefined : 'qtSweep 3s linear infinite',
              }}
            >
              <path d="M12 13V7.5" strokeLinecap="round" />
            </g>
            <circle cx="12" cy="13" r="1.3" fill="currentColor" stroke="none" />
          </svg>
          Timer
        </div>
      </div>

      {/* The question, as three grey bars. Drawing words here would put a
          question on the slide, which is the thing this frame exists not to do. */}
      <div className="mt-4 space-y-2">
        <span className="block h-3 w-full rounded-pill bg-line" />
        <span className="block h-3 w-3/5 rounded-pill bg-line" />
      </div>

      <ol className="mt-4 space-y-2">
        {OPTIONS.map((o) => (
          <li
            key={o.letter}
            className="flex items-center gap-3 rounded-[14px] border-2 px-3 py-1.5"
            style={{
              borderColor: o.picked ? '#3730E0' : '#EDF1F7',
              background: o.picked ? '#F2F1FF' : '#FAFBFD',
            }}
          >
            <span
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg font-heading text-body-sm font-bold"
              style={{
                background: o.picked ? '#3730E0' : '#FFFFFF',
                color: o.picked ? '#fff' : '#8494A8',
              }}
            >
              {o.letter}
            </span>
            <span className="h-2.5 flex-1 rounded-pill" style={{ background: o.picked ? '#C9C6F5' : '#E7ECF3' }} />
            {o.picked && (
              <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0">
                <circle cx="12" cy="12" r="11" fill="#17A34A" />
                <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            )}
          </li>
        ))}
      </ol>

      <div
        className="mt-4 grid place-items-center rounded-pill py-2 font-heading text-body font-bold text-white"
        style={{ background: '#3730E0' }}
      >
        Submit
      </div>
    </motion.div>
  )
}

/** The three steps, as the tinted pills the reference draws them in. */
function Steps({ instant, wide = false }: { instant: boolean; wide?: boolean }) {
  return (
    <ol className={wide ? 'grid grid-cols-3 gap-4' : 'space-y-3'}>
      {STEPS.map((text, i) => (
        <motion.li
          key={text}
          className={`flex items-center gap-4 rounded-[14px] border border-white/10 bg-white/[0.07] px-5 ${
            wide ? 'py-5' : 'py-3'
          }`}
          initial={instant ? false : { opacity: 0, x: wide ? 0 : -18, y: wide ? 16 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.55 + i * 0.16, duration: 0.8, ease: EASE }}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white font-heading text-body font-bold text-ink">
            {i + 1}
          </span>
          <span className="font-heading text-body-xl font-semibold text-white">{text}</span>
        </motion.li>
      ))}
    </ol>
  )
}

export function QuizTimeSlide({ title = 'Classroom Quiz', variant = 'card', lesson }: QuizTimeSlideProps) {
  const instant = useInstant()
  /* TEMPORARY, for choosing between the three. Remove once one is picked. */
  const v =
    (typeof window !== 'undefined' &&
      (new URLSearchParams(window.location.search).get('qv') as typeof variant)) ||
    variant

  const heading = (
    <>
      <motion.div
        className="inline-flex items-center gap-3"
        initial={instant ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <span className="h-[3px] w-8 rounded-pill bg-white" />
        <span className="text-body-sm font-bold uppercase tracking-[0.18em] text-white">Quiz time</span>
      </motion.div>

      <motion.h2
        className="mt-4 font-heading text-[62px] font-extrabold leading-[1.02] text-white"
        initial={instant ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 1, ease: EASE }}
      >
        {title}
      </motion.h2>

      <motion.p
        className="mt-3 text-body-xl text-white/70"
        initial={instant ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36, duration: 0.9, ease: EASE }}
      >
        Time to check what you have learned so far.
      </motion.p>
    </>
  )

  return (
    <SlideBase variant="night" lesson={lesson} decor={false}>
      {/* The brighter corner the reference lights, and a cooler one opposite, so
          the navy is a field rather than a flat fill. Both stay inside the
          canvas: `qa.mjs` sweeps for frame overflow, decorative or not. */}
      <div className="pointer-events-none absolute left-0 top-0 h-[26rem] w-[26rem] rounded-full bg-brand/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-2 right-2 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

      {v === 'card' && (
        <div className="grid h-full grid-cols-[1fr_auto] items-center gap-10">
          <div className="relative z-10 max-w-[620px]">
            {heading}
            <div className="mt-8">
              <Steps instant={instant} />
            </div>
          </div>

          {/* PUSHED DOWN AND IN. The instructor's video holds x913..1280,
              y0..220, and the card's top corner reached into it at full height.

              `place-items-end`: the card is right-aligned ON PURPOSE, the same
              as the mascot corner on RecapSlide, so `align-check.mjs` measures
              it against the right edge and not the header's left datum. */}
          <div className="relative z-10 translate-y-[86px] place-items-end justify-self-end mr-24">
            {/* The reference's dot field, behind the card's shoulder. */}
            <div
              className="pointer-events-none absolute -right-[76px] top-10 h-[128px] w-[100px] opacity-40"
              style={{
                backgroundImage: 'radial-gradient(currentColor 1.6px, transparent 1.6px)',
                backgroundSize: '18px 18px',
                color: 'rgba(255,255,255,0.55)',
              }}
            />
            <MockQuizCard instant={instant} />
            {/* NOVA AT THE REFERENCE'S RATIO, HOLDING THE LAMP. It draws the
                character at about half the card's width, straddling its lower
                right corner; at 116px against a 372px card it read as a sticker
                someone had put in the corner rather than as part of the
                composition. `idea` is the pose with the lamp raised in its
                hand, which is the glowing thing the reference draws.

                The card is moved left with a MARGIN, not padding. Padding left
                the wrapper's own right edge at x1216, so Nova's negative
                `right` offset measured from there and ran off the canvas. */}
            <motion.div
              className="absolute -bottom-4 -right-[90px]"
              initial={instant ? false : { opacity: 0, scale: 0.8, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.9, ease: EASE }}
            >
              <Nova pose="idea" className="w-[190px]" />
            </motion.div>
          </div>
        </div>
      )}

      {v === 'row' && (
        <div className="flex h-full flex-col justify-center">
          <div className="relative z-10 flex flex-col items-center text-center">{heading}</div>
          <div className="relative z-10 mt-10">
            <Steps instant={instant} wide />
          </div>
        </div>
      )}

      {v === 'plain' && (
        <div className="grid h-full place-items-center">
          <div className="relative z-10 flex max-w-[820px] flex-col items-center text-center">
            <div className="flex flex-col items-center">{heading}</div>
            <motion.div
              className="mt-9 flex items-center justify-center gap-3"
              initial={instant ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.9, ease: EASE }}
            >
              {STEPS.map((text, i) => (
                <span key={text} className="flex items-center gap-3">
                  {i > 0 && <span className="text-body-xl text-white/30">/</span>}
                  <span className="font-heading text-body font-semibold text-white/85">{text}</span>
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      )}
    </SlideBase>
  )
}
