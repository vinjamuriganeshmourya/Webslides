import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * The gap the pipeline does not cross, and then the stage that crosses it.
 *
 * The pipeline is drawn as a belt that simply stops. What matters is that the
 * stop is VISIBLE: a room that has been told "one manual step snuck back in"
 * does not feel it, and a room that sees the belt end at a drop does.
 */
export function LastMile({ bridged = false }: { bridged?: boolean }) {
  const instant = useInstant()
  const stages = ['Checkout', 'Build', 'Push']

  return (
    <div className="mx-auto flex flex-col items-center gap-3" style={{ width: 960 }}>
      <div className="flex w-full items-center gap-2">
        {stages.map((s, i) => (
          <motion.div
            key={s}
            initial={instant ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={instant ? { duration: 0 } : { duration: 0.45, delay: i * 0.12 }}
            className="flex-1 rounded-xl border-2 bg-white px-3 py-2 text-center"
            style={{ borderColor: colors.success }}
          >
            <span className="text-[15px] font-bold" style={{ color: colors.ink }}>{s}</span>
          </motion.div>
        ))}

        {/* the gap */}
        <div className="relative flex w-[150px] shrink-0 items-center justify-center">
          {bridged ? (
            <motion.div
              initial={instant ? false : { opacity: 0, scaleX: 0.4 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={instant ? { duration: 0 } : { duration: 0.52, delay: 0.5 }}
              className="w-full rounded-xl border-2 px-2 py-2 text-center"
              style={{ borderColor: colors.brand, background: colors.surface }}
            >
              <span className="text-[15px] font-bold" style={{ color: colors.brand }}>Deploy</span>
            </motion.div>
          ) : (
            <svg width={150} height={72} aria-hidden>
              {/* the belt runs in, stops, and starts again on the far side */}
              <path d="M0,36 h30" stroke={colors.line} strokeWidth={3} strokeLinecap="round" />
              <path d="M120,36 h30" stroke={colors.line} strokeWidth={3} strokeLinecap="round" />
              {/* the break itself */}
              <path d="M34,22 v28 M116,22 v28" stroke={colors.warning} strokeWidth={2} strokeLinecap="round" opacity={0.55} />
              <text x={75} y={20} fontSize={13} fontWeight={700} fill={colors.warning} textAnchor="middle">by hand</text>
              <text x={75} y={41} fontSize={12} fill={colors.body} textAnchor="middle">ssh in,</text>
              <text x={75} y={57} fontSize={12} fill={colors.body} textAnchor="middle">edit, up -d</text>
            </svg>
          )}
        </div>

        <motion.div
          initial={instant ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={instant ? { duration: 0 } : { duration: 0.45, delay: 0.42 }}
          className="flex-1 rounded-xl border-2 px-3 py-2 text-center"
          style={{ borderColor: bridged ? colors.brand : colors.line, background: colors.white }}
        >
          <span className="text-[15px] font-bold" style={{ color: bridged ? colors.ink : colors.muted }}>
            the server
          </span>
        </motion.div>
      </div>

      <div className="text-[15px] font-bold" style={{ color: bridged ? colors.success : colors.warning }}>
        {bridged
          ? 'Four stages, and the release reaches users with nobody logging in'
          : 'Three stages end at Docker Hub. A person carries it the rest of the way'}
      </div>
    </div>
  )
}
