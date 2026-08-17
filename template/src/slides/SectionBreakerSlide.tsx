import { motion } from 'framer-motion'
import { SlideBase } from '@/ui/SlideBase'
import { Kicker } from '@/ui/primitives'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import type { SectionBreakerProps } from './types'

/**
 * SECTION BREAKER — a vertically centered divider between deck chapters.
 * A huge translucent section index sits behind the kicker + title, giving the
 * transition a confident, editorial feel. No media.
 */
export function SectionBreakerSlide({
  index,
  kicker,
  title,
  subtitle,
  tone = 'accent',
  lesson,
}: SectionBreakerProps) {
  const indexLabel =
    typeof index === 'number' ? String(index).padStart(2, '0') : index

  return (
    <SlideBase variant="brand" lesson={lesson} footer>
      <div className="relative grid h-full place-items-center text-center">
        {indexLabel != null && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute select-none font-heading text-[200px] font-extrabold leading-none text-white/15"
            initial={{ opacity: 0, scale: 1.18 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {indexLabel}
          </motion.span>
        )}

        <RevealGroup className="relative z-10 flex flex-col items-center" stagger={0.12}>
          {kicker && (
            <Reveal dir="up" className="mb-4 inline-block">
              <Kicker tone={tone} onDark>
                {kicker}
              </Kicker>
            </Reveal>
          )}
          <Reveal dir="up">
            <motion.h2
              className="font-heading text-slide-title-lg font-extrabold leading-[1.04] text-white"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            >
              {title}
            </motion.h2>
          </Reveal>
          {subtitle && (
            <Reveal dir="up" delay={0.08}>
              <p className="mx-auto mt-5 max-w-3xl text-body-xl text-white/75">{subtitle}</p>
            </Reveal>
          )}
        </RevealGroup>
      </div>
    </SlideBase>
  )
}
