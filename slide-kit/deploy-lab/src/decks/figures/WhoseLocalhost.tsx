import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * Why `VITE_API_BASE_URL: http://localhost:8000` is wrong once the app leaves
 * the laptop, and this is the hardest idea in the session.
 *
 * The frontend does not run on the server. It is DOWNLOADED from the server and
 * then runs in the visitor's own browser, so `localhost` means the visitor's
 * machine. The figure makes the request loop back into the same laptop it came
 * from, which is the whole lesson in one line.
 */
export function WhoseLocalhost({ fixed = false }: { fixed?: boolean }) {
  const instant = useInstant()
  const line = (delay: number) =>
    instant ? { duration: 0 } : { duration: 0.86, delay, ease: [0.22, 0.61, 0.36, 1] as const }

  return (
    <div className="relative mx-auto" style={{ width: 980, height: 360 }}>
      <svg width={980} height={360}>
        <defs>
          <marker id="wl-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={colors.danger} />
          </marker>
          <marker id="wl-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={colors.success} />
          </marker>
        </defs>

        {/* the visitor's laptop */}
        <rect x={40} y={70} width={330} height={212} rx={14} fill={colors.white} stroke={colors.line} strokeWidth={2} />
        <text x={205} y={98} fontSize={16} fontWeight={700} fill={colors.ink} textAnchor="middle">A visitor's laptop</text>
        <rect x={64} y={118} width={282} height={62} rx={10} fill={colors.surface} stroke={colors.brand} strokeWidth={2} />
        <text x={205} y={143} fontSize={14} fontWeight={700} fill={colors.ink} textAnchor="middle">the browser</text>
        <text x={205} y={163} fontSize={13} fill={colors.body} textAnchor="middle">running your React frontend</text>
        <rect x={64} y={218} width={282} height={44} rx={10} fill={colors.white} stroke={colors.line} strokeWidth={2} strokeDasharray="6 5" />
        <text x={205} y={245} fontSize={13} fill={colors.muted} textAnchor="middle">nothing is listening on port 8000 here</text>

        {/* the server */}
        <rect x={610} y={70} width={330} height={212} rx={14} fill={colors.white} stroke={colors.line} strokeWidth={2} />
        <text x={775} y={98} fontSize={16} fontWeight={700} fill={colors.ink} textAnchor="middle">Your EC2 server</text>
        <rect x={634} y={118} width={282} height={44} rx={10} fill={colors.surface} stroke={colors.line} strokeWidth={2} />
        <text x={775} y={145} fontSize={13} fill={colors.body} textAnchor="middle">frontend container, port 3000</text>
        <rect x={634} y={176} width={282} height={44} rx={10} fill={colors.surface} stroke={colors.teal} strokeWidth={2} />
        <text x={775} y={203} fontSize={13} fontWeight={700} fill={colors.ink} textAnchor="middle">backend container, port 8000</text>

        {/* the page itself is downloaded, and that part is always fine */}
        <motion.path
          d="M610,140 L372,140"
          fill="none" stroke={colors.muted} strokeWidth={2} strokeDasharray="6 5"
          initial={instant ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={line(0.1)}
        />
        <text x={491} y={132} fontSize={13} fill={colors.muted} textAnchor="middle">the page loads from here</text>

        {!fixed && (
          <>
            {/* the API call loops straight back into the same laptop */}
            <motion.path
              d="M175,262 C95,300 95,336 205,336 C315,336 315,300 238,266"
              fill="none" stroke={colors.danger} strokeWidth={2.5} markerEnd="url(#wl-bad)"
              initial={instant ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={line(0.5)}
            />
            <text x={205} y={312} fontSize={14} fontWeight={700} fill={colors.danger} textAnchor="middle">
              localhost:8000
            </text>
            <text x={205} y={356} fontSize={13} fill={colors.body} textAnchor="middle">
              means THIS machine, so the call never leaves it
            </text>
          </>
        )}

        {fixed && (
          <>
            <motion.path
              d="M372,240 L632,205"
              fill="none" stroke={colors.success} strokeWidth={2.5} markerEnd="url(#wl-good)"
              initial={instant ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={line(0.5)}
            />
            <text x={500} y={306} fontSize={14} fontWeight={700} fill={colors.success} textAnchor="middle">
              the server's own address, port 8000
            </text>
            <text x={500} y={330} fontSize={13} fill={colors.body} textAnchor="middle">
              now the call reaches the machine the API is on
            </text>
          </>
        )}
      </svg>
    </div>
  )
}
