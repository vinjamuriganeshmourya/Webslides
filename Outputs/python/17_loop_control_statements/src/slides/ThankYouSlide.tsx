import { motionSpeed } from '@/design/tokens'
import { motion } from 'framer-motion'
import { SlideBase, Logo } from '@/ui'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import type { ThankYouSlideProps } from './types'

/**
 * THANK YOU — the closing stage. Night gradient, the NxtWave mark, an
 * oversized farewell and an optional parting message.
 *
 * THE MARK, NOT THE MASCOT. Nova cheered here until this slide was put next to
 * the welcome frame: the deck opened on the brand and closed on a character,
 * which reads as two different decks. The last frame a room looks at is the one
 * that should be signed, so the closing stage now carries the same mark the
 * opening does. Nova still carries the quiz, practice-adjacent and recap frames,
 * where a face is doing actual work.
 */
export function ThankYouSlide({ title = 'Thank you!', message, lesson }: ThankYouSlideProps) {
  return (
    /*
      `footerLogo={false}`: the mark is on stage here, so the footer must not
      print a second one. Same reason `BrandSlide` suppresses it. The footer bar
      itself stays.
    */
    <SlideBase variant="night" lesson={lesson} footer footerLogo={false}>
      <div className="grid h-full place-items-center text-center">
        <RevealGroup className="flex flex-col items-center" stagger={0.12}>
          <motion.div
            className="relative mb-16 grid place-items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 * motionSpeed, duration: 0.7 * motionSpeed, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* A pale halo rather than a blue one: a blue glow behind the navy
                ground adds no separation at all. Kept from the character version
                because the mark needs the same lift off the gradient. */}
            <div className="absolute h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <Logo className="relative h-24" onDark />
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

          {/*
            NO "Next up:" CHIP.

            The Next session slide sits immediately before this one and already
            names what is coming. Repeating it here gave the deck two endings, and
            the room started packing up on the wrong slide.
          */}
        </RevealGroup>
      </div>
    </SlideBase>
  )
}
