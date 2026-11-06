import { motion } from 'framer-motion'
import { SlideBase } from '@/ui'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import { TPL, glassPill, heroSlab } from '@/design/ground'
import { fonts } from '@/design/tokens'
import type { ThankYouSlideProps } from './types'

/**
 * THANK YOU — the closing stage.
 *
 * THE UPDATED TEMPLATE'S CLOSE (user, 2026-10-12; the base template since
 * 2026-10-14). The frame is the template's
 * thank-you slide (`updated_template/src/slides/ThankYouSlide.tsx`): the
 * closing gradient with its two rings, the mark reversed to white and centred
 * with its top at y=205 (307 on the 1920 frame), and the words in a glass
 * pill centred on y=445 (667 there), set in Sora SemiBold.
 *
 * WHAT STAYS: the mark's entrance with its pale halo, and the words' reveal.
 * The mark is on stage, so the footer prints no second one.
 *
 * `title="All the Best"` is the deck's send-off, the last frame after Thank
 * you: the template draws it on this same frame with different words.
 */
export function ThankYouSlide({ title = 'Thank you!', message, lesson }: ThankYouSlideProps) {
  /* the closing font's text box is ~1.23 em tall, so the 1.2 em slab left it 3px outside (check-deck overflow,
     Session 6, 2026-11-06): this frame's slab is 1.26 em */
  const slab = { ...heroSlab(TPL.heroClosing), height: Math.round(TPL.heroClosing * 1.26) }
  return (
    <SlideBase variant="night" lesson={lesson} footer footerLogo={false} padded={false}>
      <div className="absolute inset-x-2 flex justify-center" style={{ top: TPL.closingLogoTop }}>
        <motion.div
          className="relative grid place-items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="absolute h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <img
            src="/assets/logo-nxtwave.png"
            alt="NxtWave"
            draggable={false}
            className="relative block select-none"
            style={{ width: TPL.heroLogoWidth, height: 'auto', filter: 'brightness(0) invert(1)' }}
          />
        </motion.div>
      </div>

      <RevealGroup
        className="absolute inset-x-2 flex flex-col items-center"
        style={{ top: TPL.closingSlabCenter - Number(slab.height) / 2 }}
        stagger={0.12}
      >
        <Reveal dir="up">
          <div style={{ ...glassPill, ...slab }}>
            <h1
              className="whitespace-nowrap text-white"
              style={{ fontFamily: fonts.tplTitle, fontWeight: 600, fontSize: TPL.heroClosing, lineHeight: 1.2 }}
            >
              {title}
            </h1>
          </div>
        </Reveal>

        {message && (
          <Reveal dir="up" delay={0.05}>
            <p className="mx-auto mt-5 max-w-2xl text-center text-body-xl text-white/75">{message}</p>
          </Reveal>
        )}
      </RevealGroup>
    </SlideBase>
  )
}
