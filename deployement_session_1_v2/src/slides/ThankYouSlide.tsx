import { motion } from 'framer-motion'
import { SlideBase, Illustration, Chip } from '@/ui'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import type { ThankYouSlideProps } from './types'

/**
 * THANK YOU — the closing stage. Night gradient, mascot cheering, an
 * oversized farewell, an optional parting message, and a "Next up" pill.
 */
export function ThankYouSlide({ title = 'Thank you!', message, nextUp, lesson }: ThankYouSlideProps) {
  return (
    <SlideBase variant="brand" className="bg-nw-gradient" lesson={lesson} footer>
      <div className="grid h-full place-items-center text-center">
        <RevealGroup className="flex flex-col items-center" stagger={0.12}>
          <motion.div
            className="relative mb-6 grid place-items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* A pale halo rather than a blue one: a blue glow behind a blue
                character adds no separation at all, which is why the figure
                disappeared into the ground here. */}
            <div className="absolute h-64 w-64 rounded-full bg-white/20 blur-2xl" />
            <Illustration
              name="nova-cheer"
              className="char-lift relative mx-auto h-[16rem] w-auto"
            />
          </motion.div>

          <Reveal dir="up">
            <h1 className="font-heading text-hero font-extrabold leading-[1.02] text-white">
              {title}
            </h1>
          </Reveal>

          {message && (
            <Reveal dir="up" delay={0.05}>
              <p className="mx-auto mt-5 max-w-2xl text-body-xl text-white/75">{message}</p>
            </Reveal>
          )}

          {nextUp && (
            <Reveal dir="up" delay={0.1}>
              <Chip className="mt-8 !bg-white/10 !text-white">Next up: {nextUp}</Chip>
            </Reveal>
          )}
        </RevealGroup>
      </div>
    </SlideBase>
  )
}
