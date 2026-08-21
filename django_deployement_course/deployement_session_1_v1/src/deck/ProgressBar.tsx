import { motion } from 'framer-motion'

/** Slim top progress bar + segmented dots reflecting deck position. */
export function ProgressBar({
  index,
  total,
  onDot,
}: {
  index: number
  total: number
  onDot: (i: number) => void
}) {
  const pct = total <= 1 ? 100 : (index / (total - 1)) * 100
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-1 bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-500 via-teal-500 to-accent-500"
          animate={{ width: `${pct}%` }}
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => onDot(i)}
            className="group grid h-4 w-4 place-items-center"
          >
            <span
              className={`block rounded-pill transition-all duration-300 ${
                i === index
                  ? 'h-2 w-6 bg-white'
                  : 'h-1.5 w-1.5 bg-white/40 group-hover:bg-white/70'
              }`}
            />
          </button>
        ))}
      </div>
    </>
  )
}
