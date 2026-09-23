import { motion } from 'framer-motion'
import { SlideBase } from '@/ui/SlideBase'
import { Logo } from '@/ui/Logo'
import { colors } from '@/design/tokens'
import type { BrandSlideProps } from './types'

const EASE = [0.22, 1, 0.36, 1] as const

/** Small four-point sparkle that twinkles on a loop. */
function Sparkle({
  className,
  size = 22,
  delay = 0,
  color = '#FFFFFF',
}: {
  className?: string
  size?: number
  delay?: number
  color?: string
}) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`absolute ${className ?? ''}`}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.15, 0.7], rotate: [0, 18, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay }}
      aria-hidden
    >
      <path d="M12 0 L14.6 9.4 L24 12 L14.6 14.6 L12 24 L9.4 14.6 L0 12 L9.4 9.4 Z" fill={color} />
    </motion.svg>
  )
}

/** Fixed, deterministic star field — tiny dots twinkling at low opacity. */
const STARS: Array<[number, number, number, number]> = [
  [8, 18, 3, 0.2], [16, 66, 2, 1.4], [23, 30, 2, 2.6], [31, 82, 3, 0.9],
  [42, 12, 2, 1.9], [55, 20, 3, 0.5], [64, 74, 2, 2.2], [72, 16, 2, 1.1],
  [80, 58, 3, 0.7], [88, 30, 2, 1.7], [92, 76, 2, 2.9], [48, 88, 2, 0.3],
]

/**
 * Soft filled wave layers at the base — a calm, professional nod to the brand
 * name. Each layer sways gently side-to-side; no hard strokes, no seams.
 */
function WaveLayers() {
  const layers = [
    { d: 'M0 64 C 240 24, 480 88, 760 56 C 1000 30, 1200 66, 1440 48 L1440 160 L0 160 Z', opacity: 0.14, dur: 11, drift: 46 },
    { d: 'M0 88 C 280 56, 520 112, 820 80 C 1080 54, 1260 96, 1440 76 L1440 160 L0 160 Z', opacity: 0.09, dur: 15, drift: -38 },
  ]
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 overflow-hidden" aria-hidden>
      {layers.map((l, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          className="absolute bottom-0 h-full w-[120%] -left-[10%]"
          style={{ opacity: l.opacity }}
          animate={{ x: [0, l.drift, 0] }}
          transition={{ duration: l.dur, repeat: Infinity, ease: 'easeInOut' }}
        >
          <defs>
            <linearGradient id={`brand-wave-${i}`} x1="0" y1="0" x2="1" y2="0">
              {/* style guide blues; the old teal/blue pair belonged to the
                  Evolve theme and clashed with the new ground */}
              <stop offset="0%" stopColor="#2D63FB" />
              <stop offset="60%" stopColor="#0146C7" />
              <stop offset="100%" stopColor="#2D63FB" />
            </linearGradient>
          </defs>
          <path d={l.d} fill={`url(#brand-wave-${i})`} />
        </motion.svg>
      ))}
    </div>
  )
}

/**
 * BRAND — the deck opener: the NxtWave mark and a welcome, nothing else.
 *
 * Overlapping flat discs in the style guide's blues give the frame its
 * structure, a halo pulses around the mark, sparkles twinkle in a star field,
 * the welcome lands letter by letter, and wave layers rest at the base.
 *
 * The mark sits in a white card in its ORIGINAL colours — the only place in the
 * deck that does. Everywhere else it is reversed to white with no container.
 */
export function BrandSlide({ greeting = 'Welcome!', lesson }: BrandSlideProps) {
  const letters = greeting.split('')
  return (
    <SlideBase variant="night" footer={Boolean(lesson)} footerLogo={false} lesson={lesson}>
      {/*
        FLAT DISCS, NOT BLURRED GLOWS.
        These were three `blur-3xl` fields, which read as vague haze rather than
        as shapes: at that radius the blur spreads the colour so thin that the
        composition looks empty and the slide reads as an unstyled dark
        rectangle. Crisp overlapping circles give the frame an actual graphic
        structure, which is what the reference export shows.

        They still drift, but slowly and by a few pixels: the point is depth,
        not movement. Kept at low alpha so the white type over them never loses
        contrast. Colours are the style guide's own blues, so the discs read as
        depth in one hue rather than as a second palette.
      */}
      <motion.div
        className="pointer-events-none absolute left-[52%] top-[34%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: colors.nwBlue, opacity: 0.16 }}
        animate={{ x: [-14, 14, -14] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute left-[27%] top-[78%] h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: colors.nwDeep, opacity: 0.3 }}
        animate={{ y: [-10, 12, -10] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute left-[88%] top-[38%] h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: colors.nwNavy, opacity: 0.45 }}
        animate={{ y: [10, -12, 10] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* star field */}
      {STARS.map(([l, t, s, d], i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute rounded-full bg-white"
          style={{ left: `${l}%`, top: `${t}%`, width: s, height: s }}
          animate={{ opacity: [0.08, 0.55, 0.08] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: d }}
        />
      ))}

      {/* vignette focus */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 72% 66% at 50% 44%, transparent 58%, rgba(0,37,75,0.42) 100%)' }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <div className="relative -mt-6">
          {/* pulsing halo rings */}
          <motion.span
            className="pointer-events-none absolute left-1/2 top-1/2 h-[21rem] w-[21rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/15"
            animate={{ scale: [1, 1.16], opacity: [0.55, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut' }}
          />
          <span className="pointer-events-none absolute left-1/2 top-1/2 h-[17rem] w-[17rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

          {/* sparkles around the mark */}
          <Sparkle className="-left-24 -top-10" delay={0.4} />
          <Sparkle className="-right-28 top-4" size={16} color="#9DB8FF" delay={1.3} />
          <Sparkle className="-bottom-14 -left-10" size={14} color="#9DB8FF" delay={2.1} />
          <Sparkle className="-right-16 -bottom-8" size={18} delay={0.9} />

          {/*
            The mark rides a white card, in its ORIGINAL colours. This is the one
            place in the deck that does so: the welcome frame is where the brand
            signs the deck, and the full-colour lockup on white is how the brand
            is actually drawn. Everywhere else the mark is reversed to white and
            sits straight on the ground, with no container.
          */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            transition={{
              opacity: { duration: 0.8, ease: EASE },
              scale: { duration: 0.8, ease: EASE },
              y: { delay: 0.9, duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="relative rounded-[2rem] bg-white px-14 py-9 shadow-float"
          >
            <Logo className="h-24" />
          </motion.div>
        </div>

        {/* the welcome — lower, larger, letter by letter */}
        <h1
          className="mt-20 font-heading text-[6.75rem] font-extrabold leading-none tracking-tight text-white"
          aria-label={greeting}
        >
          {letters.map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 34, rotate: -6 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 0.55 + i * 0.055, duration: 0.55, ease: EASE }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </h1>
        <motion.span
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.6 + letters.length * 0.055, duration: 0.6, ease: EASE }}
          className="mt-7 h-1.5 w-52 origin-center rounded-pill bg-gradient-to-r from-white/90 via-white/60 to-white/20"
        />
      </div>

      {/* soft brand waves at the base */}
      <WaveLayers />
    </SlideBase>
  )
}
