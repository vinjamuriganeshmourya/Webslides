import { motion } from 'framer-motion'
import { SlideBase } from '@/ui/SlideBase'
import { Logo } from '@/ui/Logo'
import type { BrandSlideProps } from './types'

const EASE = [0.22, 1, 0.36, 1] as const

/** Small four-point sparkle that twinkles on a loop. */
function Sparkle({
  className,
  size = 22,
  delay = 0,
  color = '#7FE3D8',
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
              <stop offset="0%" stopColor="#0B5FFF" />
              <stop offset="60%" stopColor="#12B5A8" />
              <stop offset="100%" stopColor="#0B5FFF" />
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
 * Aurora glows drift behind a floating logo card with a passing light sweep;
 * a halo pulses, sparkles twinkle in a soft star field, the welcome lands
 * letter by letter, and soft wave layers rest at the base.
 */
export function BrandSlide({ greeting = 'Welcome!', lesson }: BrandSlideProps) {
  const letters = greeting.split('')
  return (
    <SlideBase variant="night" footer={Boolean(lesson)} footerLogo={false} lesson={lesson}>
      {/* aurora — three drifting glow fields */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[36%] h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/30 blur-3xl"
        animate={{ x: [-30, 30, -30], scale: [1, 1.15, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute left-[26%] top-[64%] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400/20 blur-3xl"
        animate={{ y: [-20, 24, -20], scale: [1.1, 0.92, 1.1] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute left-[78%] top-[30%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/15 blur-3xl"
        animate={{ y: [18, -22, 18], x: [10, -14, 10] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
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
        style={{ background: 'radial-gradient(ellipse 68% 62% at 50% 44%, transparent 55%, rgba(4,9,24,0.55) 100%)' }}
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
          <Sparkle className="-right-28 top-4" size={16} color="#FFB055" delay={1.3} />
          <Sparkle className="-bottom-14 -left-10" size={14} color="#FF8A3D" delay={2.1} />
          <Sparkle className="-right-16 -bottom-8" size={18} delay={0.9} />

          {/* the mark — floating gently, with a passing light sweep */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            transition={{
              opacity: { duration: 0.8, ease: EASE },
              scale: { duration: 0.8, ease: EASE },
              y: { delay: 0.9, duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="relative overflow-hidden rounded-[2rem] bg-white/95 px-16 py-10 shadow-card ring-1 ring-white/40"
          >
            <Logo className="h-24" />
            <motion.span
              className="pointer-events-none absolute -top-8 bottom-[-2rem] w-16 -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent opacity-60"
              initial={{ left: '-25%' }}
              animate={{ left: '120%' }}
              transition={{ delay: 1.4, duration: 1.1, ease: 'easeInOut', repeat: Infinity, repeatDelay: 3.6 }}
            />
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
          className="mt-7 h-1.5 w-52 origin-center rounded-pill bg-gradient-to-r from-brand-500 via-teal-400 to-accent-500"
        />
      </div>

      {/* soft brand waves at the base */}
      <WaveLayers />
    </SlideBase>
  )
}
