import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * The decoder: a timeout and a refusal look similar and mean opposite things.
 *
 * The lesson is in the CLOCKS, so the figure makes them the loudest thing. A
 * timeout waits and nothing comes back, because the packets never arrived. A
 * refusal comes back at once, because they did arrive and nothing was
 * listening. Two rows, one difference, no table.
 */
export function TimeoutVsRefused({ show = 'both' }: { show?: 'timeout' | 'refused' | 'both' }) {
  const instant = useInstant()
  const rows = [
    {
      key: 'timeout' as const,
      word: 'Connection timed out',
      clock: 'after 15 seconds',
      why: 'The packets never reached the server',
      fix: 'The security group. No rule for that port',
      colour: colors.warning,
      reaches: false,
    },
    {
      key: 'refused' as const,
      word: 'Connection refused',
      clock: 'instantly',
      why: 'The packets arrived, and nothing was listening',
      fix: 'The app. Check the container is up',
      colour: colors.danger,
      reaches: true,
    },
  ].filter((r) => show === 'both' || r.key === show)

  return (
    <div className="flex w-full flex-col gap-4">
      {rows.map((r, i) => (
        <motion.div
          key={r.key}
          initial={instant ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={instant ? { duration: 0 } : { duration: 0.52, delay: i * 0.18 }}
          className="flex items-center gap-4 rounded-card border-2 bg-white px-4 py-3"
          style={{ borderColor: r.colour }}
        >
          {/* the journey: a request, a wall, a server */}
          <svg width={290} height={80} aria-hidden className="shrink-0">
            <rect x={2} y={22} width={54} height={26} rx={6} fill={colors.surface} stroke={colors.line} strokeWidth={2} />
            <text x={29} y={39} fontSize={11} fill={colors.body} textAnchor="middle" fontWeight={700}>you</text>
            {/* the wall is the security group */}
            <rect x={140} y={8} width={10} height={54} rx={3} fill={r.reaches ? colors.line : colors.warning} />
            <rect x={206} y={18} width={78} height={34} rx={6} fill={colors.surface} stroke={colors.line} strokeWidth={2} />
            <text x={245} y={39} fontSize={11} fill={colors.body} textAnchor="middle" fontWeight={700}>server</text>
            {r.reaches && (
              <text x={245} y={68} fontSize={10} fill={colors.muted} textAnchor="middle">
                nothing listening
              </text>
            )}
            <motion.line
              x1={58} y1={35} x2={r.reaches ? 204 : 138} y2={35}
              stroke={r.colour} strokeWidth={2.5} strokeLinecap="round"
              initial={instant ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={instant ? { duration: 0 } : { duration: 0.86, delay: 0.2 + i * 0.18 }}
            />
            {!r.reaches && (
              <text x={98} y={20} fontSize={11} fill={colors.warning} textAnchor="middle" fontWeight={700}>dropped</text>
            )}
            {r.reaches && (
              <path d="M204,35 l-10,-5 v10 z" fill={r.colour} />
            )}
          </svg>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[16px] font-bold" style={{ color: r.colour }}>{r.word}</span>
              <span className="text-[14px] font-bold" style={{ color: colors.ink }}>{r.clock}</span>
            </div>
            <div className="text-[14px] leading-[20px]" style={{ color: colors.body }}>{r.why}</div>
            <div className="text-[14px] font-bold leading-[20px]" style={{ color: colors.ink }}>
              Look at: {r.fix}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
