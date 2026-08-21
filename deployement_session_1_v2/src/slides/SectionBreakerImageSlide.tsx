import { motion } from 'framer-motion'
import { SlideBase, Kicker, NumberBadge, Illustration } from '@/ui'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import { Media } from './Media'
import type { SectionBreakerImageProps } from './types'

/**
 * SECTION BREAKER (with image) — night stage, headline copy on the left and a
 * glowing hero visual on the right. Marks the start of a new part of the deck.
 */
export function SectionBreakerImageSlide({
  index,
  kicker,
  title,
  subtitle,
  tone = 'brand',
  media,
  lesson,
}: SectionBreakerImageProps) {
  return (
    <SlideBase variant="night" lesson={lesson} footer>
      <div className="grid h-full grid-cols-[1.1fr_1fr] items-center gap-10">
        {/* left — copy */}
        <RevealGroup className="max-w-xl" stagger={0.12}>
          {(index != null || kicker) && (
            <Reveal dir="right">
              <div className="mb-6 flex items-center gap-4">
                {index != null && <NumberBadge n={index} tone={tone} />}
                {kicker && <Kicker tone={tone} onDark>{kicker}</Kicker>}
              </div>
            </Reveal>
          )}
          <Reveal dir="up">
            <h1 className="font-heading text-slide-title-lg font-extrabold leading-[1.05] text-white">
              {title}
            </h1>
          </Reveal>
          {subtitle && (
            <Reveal dir="up" delay={0.05}>
              <p className="mt-5 max-w-lg text-body-xl leading-relaxed text-white/75">
                {subtitle}
              </p>
            </Reveal>
          )}
        </RevealGroup>

        {/* right — hero visual */}
        <motion.div
          className="relative grid h-full place-items-center"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="absolute h-80 w-80 rounded-full bg-nw-blue/30 blur-2xl" />
          {media ? (
            // width-constrained so wide viewBox illustrations never clip at the
            // slide edge; height follows the aspect ratio up to the cap
            <Media media={media} className="relative max-h-[24rem] w-full" />
          ) : (
            <Illustration name="concept-api" className="relative max-h-[24rem] w-full" />
          )}
        </motion.div>
      </div>
    </SlideBase>
  )
}
