import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * A rule whose source is a security group rather than an address.
 *
 * The argument is about what happens NEXT: replace the build server and one
 * card needs re-pinning while the other does not. So the figure shows a second
 * machine arriving, and only one side reacting.
 */
export function GroupAsSource() {
  const instant = useInstant()
  const t = (d: number) =>
    instant ? { duration: 0 } : { duration: 0.52, delay: d, ease: [0.22, 0.61, 0.36, 1] as const }

  return (
    <div className="mx-auto flex w-[940px] items-stretch justify-center gap-6">
      {/* naming an address */}
      <motion.div
        initial={instant ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t(0)}
        className="flex w-[440px] flex-col gap-2 rounded-card border-2 bg-white p-4"
        style={{ borderColor: colors.line }}
      >
        <span className="text-[15px] font-bold" style={{ color: colors.ink }}>
          Source: an address
        </span>
        <div className="rounded-lg px-3 py-2 font-mono text-[14px]" style={{ background: colors.surface, color: colors.body }}>
          SSH · 22 · 3.108.220.155/32
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-lg border-2 px-2.5 py-1 text-[13px] font-bold" style={{ borderColor: colors.line, color: colors.body }}>
            build server
          </span>
          <span style={{ color: colors.muted }}>→</span>
          <span className="rounded-lg border-2 border-dashed px-2.5 py-1 text-[13px]" style={{ borderColor: colors.danger, color: colors.danger }}>
            a new one
          </span>
        </div>
        <div className="mt-auto pt-2 text-[14px] font-bold" style={{ color: colors.danger }}>
          Its address changed, so the rule has to be edited
        </div>
      </motion.div>

      {/* naming a group */}
      <motion.div
        initial={instant ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t(0.18)}
        className="flex w-[440px] flex-col gap-2 rounded-card border-2 p-4"
        style={{ borderColor: colors.success, background: colors.surface }}
      >
        <span className="text-[15px] font-bold" style={{ color: colors.ink }}>
          Source: a security group
        </span>
        <div className="rounded-lg bg-white px-3 py-2 font-mono text-[14px]" style={{ color: colors.body }}>
          SSH · 22 · jenkins-sg
        </div>
        <div className="mt-2 rounded-lg border-2 border-dashed p-2.5" style={{ borderColor: colors.success }}>
          <div className="mb-1.5 text-[12px] font-bold uppercase tracking-wider" style={{ color: colors.success }}>
            jenkins-sg
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg border-2 bg-white px-2.5 py-1 text-[13px] font-bold" style={{ borderColor: colors.line, color: colors.body }}>
              build server
            </span>
            <motion.span
              initial={instant ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={t(0.6)}
              className="rounded-lg border-2 bg-white px-2.5 py-1 text-[13px] font-bold"
              style={{ borderColor: colors.success, color: colors.ink }}
            >
              a new one
            </motion.span>
          </div>
        </div>
        <div className="mt-auto pt-2 text-[14px] font-bold" style={{ color: colors.success }}>
          It joined the group, so the rule already covers it
        </div>
      </motion.div>
    </div>
  )
}
