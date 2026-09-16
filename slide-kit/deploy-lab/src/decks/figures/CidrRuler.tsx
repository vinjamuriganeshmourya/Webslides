import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * CIDR, at the only two values this course needs.
 *
 * One bar is every address on the internet. `/0` is the whole bar and `/32` is
 * a hairline at one end. No binary, no subnet masks: the room has to READ two
 * values today, not calculate one.
 */
export function CidrRuler() {
  const instant = useInstant()
  const grow = (d: number) =>
    instant ? { duration: 0 } : { duration: 0.86, delay: d, ease: [0.22, 0.61, 0.36, 1] as const }

  return (
    <div className="mx-auto flex w-[900px] flex-col gap-7">
      <div>
        <div className="mb-2 flex items-baseline gap-3">
          <span className="font-mono text-[18px] font-bold" style={{ color: colors.accent }}>
            0.0.0.0/0
          </span>
          <span className="text-[15px]" style={{ color: colors.body }}>
            every address on the internet
          </span>
        </div>
        <div className="h-9 w-full overflow-hidden rounded-lg border-2" style={{ borderColor: colors.line }}>
          <motion.div
            initial={instant ? false : { width: 0 }}
            animate={{ width: '100%' }}
            transition={grow(0.1)}
            className="h-full"
            style={{ background: colors.accent }}
          />
        </div>
        <div className="mt-1 text-[13px]" style={{ color: colors.body }}>
          Use it for the app itself, because users are the point
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-baseline gap-3">
          <span className="font-mono text-[18px] font-bold" style={{ color: colors.brand }}>
            &lt;your address&gt;/32
          </span>
          <span className="text-[15px]" style={{ color: colors.body }}>
            exactly one address, and yours is not the same as anyone else's
          </span>
        </div>
        <div className="relative h-9 w-full rounded-lg border-2" style={{ borderColor: colors.line }}>
          <motion.div
            initial={instant ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={grow(0.45)}
            className="absolute inset-y-0 left-0 rounded-l-md"
            style={{ width: 4, background: colors.brand }}
          />
          <motion.div
            initial={instant ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={grow(0.6)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-bold"
            style={{ color: colors.brand }}
          >
            your own sliver, and nothing else
          </motion.div>
        </div>
        <div className="mt-1 text-[13px]" style={{ color: colors.body }}>
          Use it for SSH, so only you can administer the server
        </div>
      </div>
    </div>
  )
}
