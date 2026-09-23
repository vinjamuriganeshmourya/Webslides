import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * Why the build server moves into AWS, in one picture.
 *
 * The webhook's route is the argument. On a laptop it has to go the long way
 * through a borrowed tunnel; on an instance with its own address it is a short
 * straight line. Drawing the detour as a genuine detour, rather than as a
 * labelled box, is what makes the second state feel like a relief.
 */
export function NgrokDetour({ state = 'tunnel' }: { state?: 'tunnel' | 'direct' }) {
  const instant = useInstant()
  const tunnel = state === 'tunnel'
  const draw = (d: number) =>
    instant ? { duration: 0 } : { duration: 0.86, delay: d, ease: [0.22, 0.61, 0.36, 1] as const }

  return (
    <div className="mx-auto" style={{ width: 900, height: 300 }}>
      <svg width={900} height={300}>
        <defs>
          <marker id="nd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={tunnel ? colors.muted : colors.success} />
          </marker>
        </defs>

        {/* GitHub, always on the left */}
        <rect x={20} y={110} width={180} height={80} rx={12} fill={colors.white} stroke={colors.line} strokeWidth={2} />
        <text x={110} y={145} fontSize={17} fontWeight={700} fill={colors.ink} textAnchor="middle">GitHub</text>
        <text x={110} y={168} fontSize={13} fill={colors.body} textAnchor="middle">sends the webhook</text>

        {/* where Jenkins lives */}
        <rect
          x={660} y={100} width={220} height={100} rx={12}
          fill={tunnel ? colors.white : colors.surface}
          stroke={tunnel ? colors.line : colors.success}
          strokeWidth={tunnel ? 2 : 3}
        />
        <text x={770} y={134} fontSize={17} fontWeight={700} fill={colors.ink} textAnchor="middle">
          {tunnel ? 'Your laptop' : 'An EC2 instance'}
        </text>
        <text x={770} y={157} fontSize={13} fill={colors.body} textAnchor="middle">
          {tunnel ? 'Jenkins, with no public address' : 'Jenkins, on its own address'}
        </text>
        <text x={770} y={177} fontSize={13} fill={tunnel ? colors.danger : colors.success} textAnchor="middle" fontWeight={700}>
          {tunnel ? 'GitHub cannot reach it' : 'GitHub reaches it directly'}
        </text>

        {tunnel ? (
          <>
            {/* the borrowed tunnel, drawn as the long way round it is */}
            <rect x={380} y={18} width={160} height={58} rx={10} fill={colors.white} stroke={colors.warning} strokeWidth={2} strokeDasharray="6 5" />
            <text x={460} y={42} fontSize={14} fontWeight={700} fill={colors.warning} textAnchor="middle">ngrok</text>
            <text x={460} y={62} fontSize={12} fill={colors.body} textAnchor="middle">a borrowed public address</text>
            <motion.path
              d="M200,140 C280,140 300,47 380,47"
              fill="none" stroke={colors.muted} strokeWidth={2.5} strokeDasharray="6 5"
              initial={instant ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={draw(0.1)}
            />
            <motion.path
              d="M540,47 C620,47 640,140 658,140"
              fill="none" stroke={colors.muted} strokeWidth={2.5} strokeDasharray="6 5" markerEnd="url(#nd-arrow)"
              initial={instant ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={draw(0.5)}
            />
            <text x={430} y={252} fontSize={14} fill={colors.body} textAnchor="middle">
              The ngrok address changes every time the tunnel restarts
            </text>
          </>
        ) : (
          <>
            <motion.path
              d="M200,150 L656,150"
              fill="none" stroke={colors.success} strokeWidth={3} markerEnd="url(#nd-arrow)"
              initial={instant ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={draw(0.1)}
            />
            <text x={430} y={136} fontSize={14} fontWeight={700} fill={colors.success} textAnchor="middle">
              webhook, port 8080
            </text>
            <text x={430} y={252} fontSize={14} fill={colors.body} textAnchor="middle">
              No ngrok, and an address that does not move
            </text>
          </>
        )}
      </svg>
    </div>
  )
}
