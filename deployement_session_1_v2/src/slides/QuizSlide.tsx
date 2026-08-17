import { motion } from 'framer-motion'
import { SlideBase, Kicker, Callout, Illustration } from '@/ui'
import { Check } from '@/ui/icons'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import { useReveal } from '@/motion/Stepper'
import type { QuizSlideProps } from './types'

/**
 * QUIZ / QUESTION — a big prompt on the left with lettered answer options
 * beside the quiz mascot.
 *
 * Build flow (a single click), deliberately NOT the generic option-by-option
 * <Step> reveal used elsewhere:
 *   entry → question + ALL options appear together in a neutral state, so the
 *           class sees every choice at once.
 *   click → the correct option is highlighted (green + check) and the others
 *           dim back. The answer is never given away before all options show.
 */
export function QuizSlide({ kicker, question, options, hint, lesson }: QuizSlideProps) {
  // One build step for the whole slide: "reveal the answer". Because this only
  // restyles options that are already on screen, no option is hidden and the
  // correct one cannot surface early.
  const answerShown = useReveal()

  return (
    <SlideBase variant="light" lesson={lesson}>
      <div className="grid h-full grid-cols-[1.4fr_1fr] items-center gap-10">
        {/* left — question (immediate) + all options (answer highlighted on click) */}
        <div className="flex flex-col">
          <RevealGroup stagger={0.09}>
            <Reveal dir="up">
              <Kicker tone="accent">{kicker ?? 'Quiz Time'}</Kicker>
            </Reveal>
            <Reveal dir="up">
              <h2 className="mt-4 font-heading text-slide-title font-bold leading-[1.14] text-ink">
                {question}
              </h2>
            </Reveal>
          </RevealGroup>

          {options && options.length > 0 && (
            <RevealGroup
              as="ol"
              stagger={0.08}
              delayChildren={0.18}
              className="mt-7 flex flex-col gap-3"
            >
              {options.map((opt, i) => {
                const isAnswer = answerShown && opt.correct
                const dimmed = answerShown && !opt.correct
                return (
                  <Reveal as="li" dir="up" key={i}>
                    <div
                      className={`flex items-center gap-4 rounded-card border-2 px-4 py-3 transition-all duration-300 ${
                        isAnswer
                          ? 'border-success bg-success/8'
                          : 'border-line bg-surface-card'
                      } ${dimmed ? 'opacity-55' : 'opacity-100'}`}
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl font-heading text-body-sm font-bold transition-colors duration-300 ${
                          isAnswer ? 'bg-success text-white' : 'bg-brand-soft text-brand-700'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1 text-body-lg text-ink">{opt.label}</span>
                      {isAnswer && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 24 }}
                        >
                          <Check className="h-5 w-5 shrink-0 text-success" />
                        </motion.span>
                      )}
                    </div>
                  </Reveal>
                )
              })}
            </RevealGroup>
          )}

          {hint && (
            <Callout kind="tip" asStep={false} className="mt-6 !p-4 text-body-sm">
              {hint}
            </Callout>
          )}
        </div>

        {/* right — mascot */}
        <div className="grid h-full place-items-end justify-items-center pb-10">
          <Illustration name="quiz" className="h-[62%] w-auto" />
        </div>
      </div>
    </SlideBase>
  )
}
