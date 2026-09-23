import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * Why the server runs `image:` and never `build:`.
 *
 * Two routes from the same Dockerfile. The upper one goes through the pipeline
 * and its gates; the lower one skips them and ends at a wall. The lesson is
 * that the lower route produces something NOTHING has checked, so the wall is
 * labelled with that rather than with the word "wrong".
 */
export function BuildVsImage() {
  const instant = useInstant()
  const t = (d: number) =>
    instant ? { duration: 0 } : { duration: 0.52, delay: d, ease: [0.22, 0.61, 0.36, 1] as const }

  const Step = ({ label, tone = 'ok' as 'ok' | 'bad' }: { label: string; tone?: 'ok' | 'bad' }) => (
    <div
      className="rounded-lg border-2 bg-white px-3 py-1.5 text-[14px] font-bold"
      style={{ borderColor: tone === 'ok' ? colors.line : colors.danger, color: colors.ink }}
    >
      {label}
    </div>
  )

  return (
    <div className="mx-auto flex w-[940px] flex-col gap-5">
      {/* the route the course built */}
      <motion.div
        initial={instant ? false : { opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={t(0)}
        className="flex items-center gap-2 rounded-card border-2 px-4 py-3"
        style={{ borderColor: colors.success, background: colors.surface }}
      >
        <span className="w-[86px] shrink-0 font-mono text-[15px] font-bold" style={{ color: colors.success }}>
          image:
        </span>
        <Step label="Dockerfile" />
        <span style={{ color: colors.muted }}>→</span>
        <Step label="the pipeline builds it" />
        <span style={{ color: colors.muted }}>→</span>
        <Step label="a tagged image" />
        <span style={{ color: colors.muted }}>→</span>
        <Step label="the server runs it" />
      </motion.div>

      {/* the route that looks equivalent and is not */}
      <motion.div
        initial={instant ? false : { opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={t(0.2)}
        className="flex items-center gap-2 rounded-card border-2 px-4 py-3"
        style={{ borderColor: colors.danger, background: colors.white }}
      >
        <span className="w-[86px] shrink-0 font-mono text-[15px] font-bold" style={{ color: colors.danger }}>
          build:
        </span>
        <Step label="Dockerfile" />
        <span style={{ color: colors.muted }}>→</span>
        <Step label="the server builds its own" tone="bad" />
        <div className="ml-1 flex items-center gap-2">
          <svg width={26} height={40} aria-hidden>
            <path d="M4,2 v36 M12,2 v36 M20,2 v36" stroke={colors.danger} strokeWidth={3} strokeLinecap="round" opacity={0.55} />
          </svg>
          <span className="text-[14px] font-bold leading-[19px]" style={{ color: colors.danger }}>
            nothing has ever
            <br />
            tested this copy
          </span>
        </div>
      </motion.div>
    </div>
  )
}
