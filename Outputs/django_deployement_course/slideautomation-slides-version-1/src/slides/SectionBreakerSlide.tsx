import { motion } from 'framer-motion'
import { SlideBase } from '@/ui/SlideBase'
import { Kicker } from '@/ui/primitives'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import { useInstant } from '@/motion/instant'
import { accentByTone, easing } from '@/design/tokens'
import type { SectionBreakerProps } from './types'

/**
 * SECTION BREAKER — a left-aligned title block on the deck's dark stage.
 *
 * WHAT CHANGED, AND WHY THE GIANT NUMERAL HAD TO GO
 *
 * This used to centre everything on the slide over a 200px translucent section
 * index. Three problems, and they are the same problem three times: the numeral
 * was the largest thing on the frame and it carried the least meaning.
 *
 *   1. **It was decoration wearing content's clothes.** "02" at 200px says
 *      nothing a room needs; the concept's NAME is the whole message of a
 *      divider. The number survives here as a small eyebrow, which is where a
 *      position marker belongs.
 *   2. **It fought whatever sat on top of it.** The component already carried a
 *      76px nudge to seat the numeral behind the title rather than behind the
 *      mark, which is a workaround for two elements competing for one centre.
 *   3. **Centred text broke the deck's own datum.** Every content slide starts
 *      its kicker and title at x=64 (hard rule 19). A divider that centres its
 *      title moves the room's "where am I" answer to the middle of the frame and
 *      then moves it back one slide later.
 *
 * So the block is left-aligned on the same x=64 datum as every content slide,
 * with the accent rail `SlideHeader` draws in the left gutter, and the title is
 * the largest thing on the frame because it is the only thing that matters.
 *
 * THE MARK IS STATIC NOW
 *
 * It used to sail in 110px from the left, bob 10px, and have a halo swell behind
 * it over 2.4s. On a frame the presenter talks over, that is motion asking to be
 * watched: a floating logo. It fades up in place instead, once, with the rest of
 * the block.
 */
export function SectionBreakerSlide({
  index,
  kicker,
  title,
  subtitle,
  /**
   * Optional brand mark shown above the eyebrow, for a section named after a
   * tool. This stage is dark, so pass the WHITE variant of any logo. Docker's
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

  /* Ctrl+left/right jumps mount every slide at its final state. `Reveal` and
     `RevealGroup` honour that; the raw `motion` elements below need the guard. */
  const instant = useInstant()
  const accent = accentByTone[tone]

  /* The eyebrow: the concept's position, or the caller's own kicker, or both. */
  const eyebrow =
    kicker && indexLabel ? `${kicker} · ${indexLabel}` : (kicker ?? (indexLabel ? `Concept ${indexLabel}` : undefined))

  return (
    <SlideBase variant="night" lesson={lesson} footer>
      <div className="flex h-full flex-col justify-center">
        <RevealGroup className="relative max-w-[760px]" stagger={0.14}>
          {/* The accent rail, in the left gutter at the slide's own edge, exactly
              where `SlideHeader` puts it on every content slide. */}
          <span
            aria-hidden
            className="absolute -left-16 top-1 h-full w-[6px] rounded-pill"
            style={{ background: `linear-gradient(${accent}, ${accent}00)` }}
          />

          {mark && (
            <Reveal dir="up" className="mb-7 block">
              <motion.img
                /* Not scaled below 24px and never recoloured or cropped, per the
                   logo owner's usage guidelines. */
                src={mark}
                alt={markAlt}
                draggable={false}
                className="h-16 w-auto select-none"
                initial={instant ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: instant ? 0 : 0.62, ease: easing.soft }}
              />
            </Reveal>
          )}

          {eyebrow && (
            <Reveal dir="up" className="mb-4 block">
              <Kicker tone={tone} onDark>
                {eyebrow}
              </Kicker>
            </Reveal>
          )}

          <Reveal dir="up">
            <h2 className="font-heading text-[56px] font-extrabold leading-[1.06] text-white">
              {title}
            </h2>
          </Reveal>

          {subtitle && (
            <Reveal dir="up">
              <p className="mt-5 max-w-[620px] text-body-xl text-white/70">{subtitle}</p>
            </Reveal>
          )}
        </RevealGroup>
      </div>
    </SlideBase>
  )
}
