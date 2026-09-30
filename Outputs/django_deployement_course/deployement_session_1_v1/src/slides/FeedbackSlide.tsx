import { motion } from 'framer-motion'
import { SlideBase, Kicker, Illustration } from '@/ui'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import type { FeedbackSlideProps } from './types'

/**
 * FEEDBACK — night stage. Left: kicker + ask + link pill. Right: Nova with a
 * feedback prop, glowing. Content animates in with a stagger.
 */
export function FeedbackSlide({
  title = 'We’d love your feedback',
  prompt,
  link,
  lesson,
}: FeedbackSlideProps) {
  return (
    <SlideBase variant="night" lesson={lesson} footer>
      <div className="grid h-full grid-cols-[1fr_1fr] items-center gap-10">
        {/* left — the ask */}
        <RevealGroup className="max-w-xl" stagger={0.1}>
          <Reveal dir="up">
            <Kicker onDark>Feedback</Kicker>
          </Reveal>
          <Reveal dir="up">
            <h1 className="mt-3 font-heading text-slide-title-lg font-extrabold leading-[1.05] text-white">
              {title}
            </h1>
          </Reveal>
          {prompt && (
            <Reveal dir="up" delay={0.05}>
              <p className="mt-5 text-body-xl leading-relaxed text-white/80">{prompt}</p>
            </Reveal>
          )}
          {link && (
            <Reveal dir="up" delay={0.12}>
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-pill bg-accent-500 px-5 py-2.5 font-semibold text-white shadow-float transition-transform hover:scale-[1.03]"
              >
                {link}
                <span aria-hidden className="text-lg leading-none">→</span>
              </a>
            </Reveal>
          )}
        </RevealGroup>

        {/* right — mascot with glow */}
        <motion.div
          className="relative grid h-full place-items-center"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="absolute h-72 w-72 rounded-full bg-accent-500/25 blur-3xl" />
          <Illustration name="feedback" className="relative h-[80%] w-auto" />
        </motion.div>
      </div>
    </SlideBase>
  )
}
