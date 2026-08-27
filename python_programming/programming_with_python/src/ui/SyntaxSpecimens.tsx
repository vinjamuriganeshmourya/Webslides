import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import { T, E, c4 } from './figureTiming'

/**
 * The same job, written in several languages, so "syntax" stops being a word.
 *
 * WHY THIS EXISTS
 *
 * The syntax slide used to be a lead, two bullets and an `AnalogyMap` whose rows
 * read "Grammar rules -> Syntax" and "A typo -> An error message". Every one of
 * those is a label for the idea rather than the idea, and the note on it was
 * exactly right: *"why just a container with text? To make it interactive we must
 * bring the element which each point is referring to."*
 *
 * So the figure brings the elements. Three real one-line programs that all do the
 * identical thing, and a chip on each naming the rule that is only true in that
 * language. The room does not have to be told the languages differ; it can see
 * three different shapes doing one job. That is what syntax IS.
 *
 * WHAT IT MUST NOT TURN INTO
 *
 *   - A LENGTH comparison. That is a different claim and it has its own slide
 *     ("Six Lines, or One", Java's whole program against Python's one line).
 *     Every specimen here is deliberately ONE line, so the only visible
 *     difference is shape.
 *   - A lesson in the other languages. The chips name a rule; they do not teach
 *     Java. Nobody is expected to remember `System.out`.
 *   - An error. Nothing here is broken code. The slide is about rules existing,
 *     not about breaking them, and the deck breaks its first rule much later, on
 *     a program the room has actually written.
 *
 * HONESTY
 *
 * Every specimen must be a real line out of a program that really runs and really
 * prints that text. All three on the syntax slide were run before they were put
 * on it: `python3`, `node`, and `javac` plus `java` on the full class.
 *
 * A line that CANNOT stand on its own must say so in its own chip. Java's
 * `System.out.println(...);` is a real line from a program that compiles, but it
 * is not a program, and its chip is "needs a class around it" for exactly that
 * reason. Letting it sit there implying otherwise would make the slide lie about
 * the one thing it is teaching.
 *
 * MOTION
 *
 * One row after another, not all three at once: the logo lands, the code fades up
 * beside it, then the rule chip slides in from the right. Sequential, because the
 * point is made by comparing row 2 with row 1, and a viewer who receives all
 * three simultaneously compares nothing. Durations from `figureTiming.ts`.
 */

export interface Specimen {
  /** `/assets/tech/python.png`. Rule 12: a named technology carries its mark. */
  logo: string
  language: string
  /** One real line, out of a program that was actually run. */
  code: string
  /** The rule that is true here and not next door. A phrase, not a sentence. */
  rule: string
  /** Draw this row as the one the course is about. */
  primary?: boolean
}

/** Gap between one row starting and the next. */
const CADENCE = T.enter * 0.72

export function SyntaxSpecimens({
  specimens,
  className = '',
}: {
  specimens: Specimen[]
  className?: string
}) {
  const instant = useInstant()

  return (
    <div className={`flex w-full flex-col gap-3 ${className}`}>
      {specimens.map((s, i) => {
        const at = T.lead + i * CADENCE
        const rowT = { duration: T.enter, ease: c4(E.out), delay: at }
        const codeT = { duration: T.enter, ease: c4(E.out), delay: at + T.stagger }
        const chipT = { duration: T.label, ease: c4(E.pop), delay: at + T.stagger * 2.4 }

        return (
          <motion.div
            key={s.language}
            className="flex items-center gap-4 rounded-card px-4 py-3"
            style={{
              background: s.primary ? colors.surface2 : colors.white,
              border: `1px solid ${s.primary ? colors.brand : colors.line}`,
            }}
            initial={instant ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={rowT}
          >
            <motion.span
              className="flex size-9 shrink-0 items-center justify-center"
              initial={instant ? false : { scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={rowT}
            >
              <img
                src={s.logo}
                alt={s.language}
                draggable={false}
                className="max-h-full max-w-full select-none object-contain"
              />
            </motion.span>

            <span
              className="w-[92px] shrink-0 font-heading text-[15px] font-bold"
              style={{ color: colors.body }}
            >
              {s.language}
            </span>

            <motion.code
              className="min-w-0 flex-1 truncate font-mono text-[16px]"
              style={{ color: colors.ink }}
              initial={instant ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={codeT}
            >
              {s.code}
            </motion.code>

            <motion.span
              className="shrink-0 rounded-pill px-3 py-1 font-heading text-[12px] font-bold uppercase tracking-wider"
              style={{
                background: s.primary ? colors.brand : colors.surface,
                color: s.primary ? colors.white : colors.body,
                border: s.primary ? 'none' : `1px solid ${colors.line}`,
              }}
              initial={instant ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={chipT}
            >
              {s.rule}
            </motion.span>
          </motion.div>
        )
      })}
    </div>
  )
}
