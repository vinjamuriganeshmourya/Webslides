import { motion } from 'framer-motion'
import { colors, easing } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { SurfaceDefs, surface, TopHighlight } from '@/ui/svgDepth'

/**
 * LogBuffering visual illustration:
 * Shows WHY logs are empty by default (Python holds back log lines in an internal buffer)
 * and HOW `ENV PYTHONUNBUFFERED=1` turns off buffering so logs stream live to the terminal.
 */
export function LogBuffering({ className = '' }: { className?: string }) {
  const instant = useInstant()

  return (
    <div className={`w-full ${className}`}>
      <svg
        viewBox="0 0 680 270"
        className="w-full h-auto"
        role="img"
        aria-label="Illustration showing Python log buffering vs unbuffered streaming logs"
      >
        <SurfaceDefs />

        {/* ── TOP SECTION: DEFAULT (BUFFERED / EMPTY LOGS) ──────────────── */}
        <g id="buffered-section">
          {/* Section Header */}
          <text x={12} y={22} fontSize={13} fontWeight={800} fill={colors.danger} letterSpacing="0.04em">
            ❌ DEFAULT (Without ENV PYTHONUNBUFFERED=1) — LOGS ARE HELD BACK
          </text>

          {/* Container Box */}
          <rect x={12} y={32} width={430} height={100} rx={10} {...surface('brand')} strokeWidth={1.5} />
          <TopHighlight x={12} y={32} width={430} rx={10} />
          <text x={24} y={52} fontSize={12} fontWeight={700} fill={colors.brandDark}>
            Container (backend)
          </text>

          {/* Django Process */}
          <rect x={24} y={62} width={150} height={58} rx={6} fill={colors.white} stroke={colors.line} strokeWidth={1} />
          <text x={34} y={84} fontSize={13} fontWeight={700} fill={colors.ink}>
            Django App
          </text>
          <text x={34} y={102} fontSize={11} fontWeight={600} fill={colors.body}>
            Writes log lines...
          </text>

          {/* Arrow Django -> Buffer */}
          <path d="M 174 91 L 206 91" stroke={colors.muted} strokeWidth={2} markerEnd="url(#arrow)" />

          {/* Python Buffer Box (Trapping Logs) */}
          <rect x={208} y={62} width={218} height={58} rx={6} fill="#FEF3C7" stroke="#F59E0B" strokeWidth={1.5} />
          <text x={220} y={82} fontSize={12} fontWeight={800} fill="#92400E">
            📦 Python Memory Buffer
          </text>
          <text x={220} y={102} fontSize={11} fontWeight={600} fill="#B45309">
            Holding logs in RAM (Buffered)
          </text>

          {/* Blocked Connection Line Buffer -> Terminal */}
          <motion.line
            x1={442}
            y1={91}
            x2={498}
            y2={91}
            stroke={colors.danger}
            strokeWidth={2.5}
            strokeDasharray="4 4"
            initial={instant ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: instant ? 0 : 0.2 }}
          />

          {/* Barrier / Lock Badge */}
          <g transform="translate(460, 77)">
            <circle cx={10} cy={14} r={12} fill="#FEE2E2" stroke={colors.danger} strokeWidth={1.5} />
            <text x={10} y={18} textAnchor="middle" fontSize={11} fontWeight={900} fill={colors.danger}>
              ✕
            </text>
          </g>

          {/* Terminal Output Box (Empty) */}
          <rect x={500} y={32} width={168} height={100} rx={8} fill={colors.night} stroke={colors.night3} strokeWidth={1.5} />
          <text x={512} y={50} fontSize={10} fontWeight={700} fill={colors.muted} fontFamily="ui-monospace, monospace">
            $ docker logs backend
          </text>
          {/* Empty Output Callout */}
          <rect x={512} y={60} width={144} height={60} rx={4} fill={colors.night2} stroke="#374151" />
          <text x={584} y={95} textAnchor="middle" fontSize={12} fontWeight={700} fill="#9CA3AF" fontStyle="italic">
            (Empty Log Panel)
          </text>
        </g>

        {/* ── BOTTOM SECTION: WITH PYTHONUNBUFFERED=1 (STREAMING / LIVE) ──── */}
        <g id="unbuffered-section">
          {/* Section Header */}
          <text x={12} y={157} fontSize={13} fontWeight={800} fill={colors.success} letterSpacing="0.04em">
            ✅ WITH ENV PYTHONUNBUFFERED=1 — LOGS STREAM IMMEDIATELY
          </text>

          {/* Container Box */}
          <rect x={12} y={167} width={430} height={90} rx={10} {...surface('teal')} strokeWidth={1.5} />
          <TopHighlight x={12} y={167} width={430} rx={10} />
          <text x={24} y={187} fontSize={12} fontWeight={700} fill={colors.tealDark}>
            Container (backend)
          </text>

          {/* Django Process */}
          <rect x={24} y={195} width={150} height={50} rx={6} fill={colors.white} stroke={colors.line} strokeWidth={1} />
          <text x={34} y={216} fontSize={13} fontWeight={700} fill={colors.ink}>
            Django App
          </text>
          <text x={34} y={232} fontSize={11} fontWeight={600} fill={colors.body}>
            Writes log lines...
          </text>

          {/* Buffer Bypassed Badge */}
          <rect x={208} y={195} width={218} height={50} rx={6} fill="#DCFCE7" stroke={colors.success} strokeWidth={1.5} />
          <text x={220} y={215} fontSize={12} fontWeight={800} fill="#14532D">
            ⚡ Buffer Disabled (OFF)
          </text>
          <text x={220} y={233} fontSize={11} fontWeight={600} fill="#15803D">
            Direct streaming to stdout
          </text>

          {/* Streaming Arrow Line Buffer -> Terminal */}
          <motion.line
            x1={442}
            y1={220}
            x2={498}
            y2={220}
            stroke={colors.success}
            strokeWidth={3}
            initial={instant ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: instant ? 0 : 0.3, ease: easing.soft }}
          />

          {/* Stream Pulse Circle */}
          <motion.circle
            r={5}
            fill={colors.success}
            initial={instant ? false : { cx: 442, cy: 220, opacity: 0 }}
            animate={{ cx: [442, 498], cy: 220, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: easing.swift }}
          />

          {/* Terminal Output Box (Live Logs) */}
          <rect x={500} y={167} width={168} height={90} rx={8} fill={colors.night} stroke={colors.night3} strokeWidth={1.5} />
          <text x={512} y={185} fontSize={10} fontWeight={700} fill={colors.muted} fontFamily="ui-monospace, monospace">
            $ docker logs backend
          </text>
          <text x={512} y={205} fontSize={10} fontWeight={600} fill="#4ADE80" fontFamily="ui-monospace, monospace">
            Starting Django...
          </text>
          <text x={512} y={221} fontSize={10} fontWeight={600} fill="#60A5FA" fontFamily="ui-monospace, monospace">
            GET / 200 OK
          </text>
          <text x={512} y={237} fontSize={10} fontWeight={600} fill="#FACC15" fontFamily="ui-monospace, monospace">
            GET /api 200 OK
          </text>
        </g>
      </svg>
    </div>
  )
}
