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
  /**
   * Optional brand mark shown above the title, for a section named after a tool.
   * This stage is brand blue, so pass the WHITE variant of any logo. Docker's
   * guidelines allow the white mark and forbid recolouring, so use their asset
   * rather than tinting the blue one.
   */
  mark,
  markAlt = '',
  tone = 'nw',
  lesson,
}: SectionBreakerProps) {
  const indexLabel =
    typeof index === 'number' ? String(index).padStart(2, '0') : index

  return (
    <SlideBase variant="night" lesson={lesson} footer>
      <div className="relative grid h-full place-items-center text-center">
        {indexLabel != null && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute select-none font-heading text-[200px] font-extrabold leading-none text-white/15"
            /*
              The numeral is centred on the slide, and so is the text group, which
              is exactly where a mark would land on top of it. Nudging the numeral
              down by roughly half the mark's block height seats it behind the
              TITLE instead, which is how a markless divider already reads.
            */
            style={{ marginTop: mark ? 76 : 0 }}
            initial={{ opacity: 0, scale: 1.14 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {indexLabel}
          </motion.span>
        )}

        <RevealGroup className="relative z-10 flex flex-col items-center" stagger={0.18}>
          {mark && (
            /*
              MARK ENTRANCE
              The mark sails in from the left and settles, echoing the thing it
              stands for: a loaded ship arriving rather than a logo appearing. A
              halo swells behind it once, on the same beat it lands, to seat it
              against the flat brand field.

              The motion runs ONCE and stops. A divider is on screen while the
              presenter is talking, and a looping mark would keep pulling the
              room's eye back to it.
            */
            <motion.div className="relative mb-6 grid place-items-center">
              <motion.span
                aria-hidden
                className="pointer-events-none absolute h-40 w-40 rounded-full bg-white/10 blur-2xl"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.img
                /* Not scaled below 24px and never recolored or cropped, per the
                   logo owner's usage guidelines. */
                src={mark}
                alt={markAlt}
                draggable={false}
                className="relative h-20 w-auto select-none"
                initial={{ opacity: 0, x: -70, y: 0, scale: 0.86 }}
                animate={{ opacity: 1, x: 0, y: [0, -6, 0], scale: 1 }}
                transition={{
                  delay: 0.1,
                  opacity: { duration: 0.9, ease: 'easeOut' },
                  x: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
                  scale: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
                  /* the bob rides out the tail of the glide, so the mark keeps
                     drifting for a moment after it has arrived */
                  y: { duration: 1.8, times: [0, 0.6, 1], ease: 'easeInOut' },
                }}
              />
            </motion.div>
          )}
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
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
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
