import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * The security group drawn as what it is: a wall with numbered doors.
 *
 * Three states carry three different ideas, so the room tracks ONE picture
 * instead of learning three:
 *
 *   'closed'   default deny. Every door shut, and the point is that this is
 *              the starting state rather than a mistake.
 *   'outbound' why `docker pull` worked with no rule. Traffic leaving has no
 *              door to pass, which is the asymmetry the concept turns on.
 *   'open'     the three doors that are open, and 5432 bricked over rather
 *              than locked, because there is nothing behind it to reach.
 */
export function DoorList({ state = 'closed' }: { state?: 'closed' | 'outbound' | 'open' }) {
  const instant = useInstant()
  const open = state === 'open'

  const doors = [
    { port: '22', who: 'you only', isOpen: open },
    { port: '3000', who: 'everyone', isOpen: open },
    { port: '8000', who: 'everyone', isOpen: open },
    { port: '5432', who: 'nothing behind it', isOpen: false, bricked: true },
  ]

  const t = (d: number) =>
    instant ? { duration: 0 } : { duration: 0.52, delay: d, ease: [0.22, 0.61, 0.36, 1] as const }

  return (
    <div className="mx-auto flex items-center justify-center gap-8" style={{ width: 940 }}>
      {/* who is knocking */}
      <div className="flex w-[150px] flex-col gap-3">
        <div className="rounded-xl border-2 bg-white px-3 py-2 text-center" style={{ borderColor: colors.line }}>
          <div className="text-[14px] font-bold" style={{ color: colors.ink }}>the internet</div>
          <div className="text-[12px]" style={{ color: colors.body }}>anyone, any port</div>
        </div>
        <div className="text-center text-[13px]" style={{ color: colors.muted }}>
          {state === 'outbound' ? 'and traffic going the other way' : 'knocking'}
        </div>
      </div>

      {/* the wall */}
      <div className="relative flex flex-col gap-2 rounded-xl border-2 px-3 py-3"
        style={{ borderColor: colors.accent, background: colors.surface }}>
        <div className="text-center text-[12px] font-bold uppercase tracking-wider" style={{ color: colors.accent }}>
          security group
        </div>
        {doors.map((d, i) => (
          <motion.div
            key={d.port}
            initial={instant ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={t(i * 0.1)}
            className="flex w-[210px] items-center gap-2 rounded-lg border-2 bg-white px-2.5 py-1.5"
            style={{ borderColor: d.bricked ? colors.line : d.isOpen ? colors.success : colors.danger }}
          >
            <span className="font-mono text-[15px] font-bold" style={{ color: colors.ink }}>{d.port}</span>
            <span className="ml-auto text-[12px]" style={{ color: colors.body }}>
              {d.bricked ? 'no rule' : d.isOpen ? d.who : 'shut'}
            </span>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
              {d.bricked ? (
                <path d="M3,7 h18 M3,12 h18 M3,17 h18 M8,7 v5 M16,12 v5" stroke={colors.muted} strokeWidth={2} />
              ) : d.isOpen ? (
                <path d="M5,12 l5,5 L19,7" stroke={colors.success} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <>
                  <rect x="5" y="11" width="14" height="9" rx="2" fill={colors.danger} />
                  <path d="M8,11 V8 a4,4 0 0 1 8,0 V11" stroke={colors.danger} strokeWidth="2.5" />
                </>
              )}
            </svg>
          </motion.div>
        ))}
      </div>

      {/* the instance */}
      <div className="flex w-[230px] flex-col gap-2 rounded-xl border-2 bg-white px-3 py-3" style={{ borderColor: colors.line }}>
        <div className="text-[14px] font-bold" style={{ color: colors.ink }}>your instance</div>
        <div className="rounded-lg px-2 py-1 text-[12px]" style={{ background: colors.surface, color: colors.body }}>
          backend, port 8000
        </div>
        <div className="rounded-lg px-2 py-1 text-[12px]" style={{ background: colors.surface, color: colors.body }}>
          frontend, port 3000
        </div>
        {state === 'outbound' && (
          <motion.div
            initial={instant ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={t(0.5)}
            className="mt-1 rounded-lg border-2 px-2 py-1.5 text-[12px] font-bold"
            style={{ borderColor: colors.success, color: colors.success }}
          >
            docker pull leaves freely, with no rule at all
          </motion.div>
        )}
      </div>
    </div>
  )
}
