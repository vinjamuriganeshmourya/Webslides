import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * What `chmod 400` actually does, without a permissions table.
 *
 * Three people can reach a file, and `400` cuts two of the three lines. That is
 * the whole idea, and a table of r/w/x bits teaches the notation instead of the
 * idea. The notation is on the slide's lead; this is the picture.
 */
export function Permissions({ mode = 644 }: { mode?: 644 | 400 }) {
  const instant = useInstant()
  const open = mode === 644
  const who = [
    { label: 'You', allowed: true },
    { label: 'Your group', allowed: open },
    { label: 'Everyone else', allowed: open },
  ]

  return (
    <div className="flex items-center justify-center gap-10">
      <div className="flex flex-col gap-4">
        {who.map((w, i) => (
          <motion.div
            key={w.label}
            initial={instant ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={instant ? { duration: 0 } : { duration: 0.52, delay: i * 0.13 }}
            className="flex w-[190px] items-center gap-2.5 rounded-xl border-2 bg-white px-3 py-2"
            style={{ borderColor: w.allowed ? colors.brand : colors.line }}
          >
            <span
              className="grid h-7 w-7 place-items-center rounded-full text-[13px] font-bold text-white"
              style={{ background: w.allowed ? colors.brand : colors.muted }}
            >
              {w.label.charAt(0)}
            </span>
            <span className="text-[15px] font-bold" style={{ color: w.allowed ? colors.ink : colors.muted }}>
              {w.label}
            </span>
          </motion.div>
        ))}
      </div>

      <svg width={180} height={210} aria-hidden>
        {who.map((w, i) => {
          const y = 30 + i * 74
          return (
            <g key={w.label}>
              <motion.line
                x1={0}
                y1={y}
                x2={150}
                y2={105}
                stroke={w.allowed ? colors.brand : colors.line}
                strokeWidth={w.allowed ? 2.5 : 2}
                strokeDasharray={w.allowed ? undefined : '5 5'}
                initial={instant ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={instant ? { duration: 0 } : { duration: 0.86, delay: 0.3 + i * 0.1 }}
              />
              {!w.allowed && (
                <g transform={`translate(${72},${(y + 105) / 2 - 2})`}>
                  <circle r={13} fill={colors.white} stroke={colors.danger} strokeWidth={2} />
                  <path d="M-5,-5 L5,5 M5,-5 L-5,5" stroke={colors.danger} strokeWidth={2.5} strokeLinecap="round" />
                </g>
              )}
            </g>
          )
        })}
      </svg>

      <div
        className="flex flex-col items-center gap-1 rounded-xl border-2 bg-white px-5 py-4"
        style={{ borderColor: colors.accent }}
      >
        <svg width={40} height={48} viewBox="0 0 40 48" aria-hidden>
          <path d="M6,4 h20 l8,8 v32 a2,2 0 0 1 -2,2 h-26 a2,2 0 0 1 -2,-2 v-38 a2,2 0 0 1 2,-2 z"
            fill={colors.surface} stroke={colors.accent} strokeWidth={2} strokeLinejoin="round" />
          <path d="M26,4 v8 h8" fill="none" stroke={colors.accent} strokeWidth={2} strokeLinejoin="round" />
          <circle cx={20} cy={28} r={5} fill="none" stroke={colors.accent} strokeWidth={2} />
          <path d="M20,33 v7" stroke={colors.accent} strokeWidth={2} strokeLinecap="round" />
        </svg>
        <span className="font-mono text-[15px] font-bold" style={{ color: colors.ink }}>
          nxttrendz-key.pem
        </span>
        <span
          className="rounded-pill px-2.5 py-0.5 font-mono text-[14px] font-bold text-white"
          style={{ background: open ? colors.danger : colors.success }}
        >
          {open ? '0644' : '0400'}
        </span>
        <span className="text-[13px]" style={{ color: colors.body }}>
          {open ? 'SSH refuses to use it' : 'SSH will use it'}
        </span>
      </div>
    </div>
  )
}
