import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * Why one of the two bugs cannot be fixed on the server.
 *
 * A compose file sits ON the server and can be edited there. settings.py sits
 * INSIDE the image, and an image is already built. The figure puts a pencil
 * against a sealed surface, because "it is inside the image" is a sentence
 * people nod at without believing.
 */
export function InsideTheImage() {
  const instant = useInstant()
  const rise = (d: number) =>
    instant ? { duration: 0 } : { duration: 0.52, delay: d, ease: [0.22, 0.61, 0.36, 1] as const }

  return (
    <div className="flex items-center justify-center gap-10">
      {/* editable, on the server */}
      <motion.div
        initial={instant ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={rise(0)}
        className="flex w-[300px] flex-col gap-2 rounded-card border-2 bg-white p-4"
        style={{ borderColor: colors.success }}
      >
        <span className="font-mono text-[15px] font-bold" style={{ color: colors.ink }}>
          docker-compose.yml
        </span>
        <span className="text-[13px]" style={{ color: colors.body }}>
          a file sitting on the server
        </span>
        <div className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: colors.surface }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 20h4l10-10-4-4L4 16v4z" stroke={colors.success} strokeWidth={2} strokeLinejoin="round" />
          </svg>
          <span className="text-[14px] font-bold" style={{ color: colors.success }}>
            nano, save, up -d
          </span>
        </div>
      </motion.div>

      {/* sealed, inside the image */}
      <motion.div
        initial={instant ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={rise(0.18)}
        className="relative flex w-[340px] flex-col gap-2 rounded-card border-2 p-4"
        style={{ borderColor: colors.danger, background: colors.surface }}
      >
        <span
          className="absolute -top-3 left-4 rounded-pill px-2.5 py-0.5 text-[12px] font-bold text-white"
          style={{ background: colors.danger }}
        >
          inside the image
        </span>
        <span className="font-mono text-[15px] font-bold" style={{ color: colors.ink }}>
          settings.py
        </span>
        <span className="text-[13px]" style={{ color: colors.body }}>
          baked in when the image was built
        </span>

        <div className="relative mt-2 flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: colors.white }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 20h4l10-10-4-4L4 16v4z" stroke={colors.muted} strokeWidth={2} strokeLinejoin="round" />
          </svg>
          <span className="text-[14px] line-through" style={{ color: colors.muted }}>
            nano, save
          </span>
          <motion.svg
            width={26} height={26} viewBox="0 0 24 24" fill="none" aria-hidden
            className="ml-auto"
            initial={instant ? false : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={rise(0.5)}
          >
            <circle cx="12" cy="12" r="10" fill={colors.white} stroke={colors.danger} strokeWidth={2} />
            <path d="M8,8 L16,16 M16,8 L8,16" stroke={colors.danger} strokeWidth={2.5} strokeLinecap="round" />
          </motion.svg>
        </div>

        <div className="mt-1 rounded-lg px-3 py-2" style={{ background: colors.white }}>
          <div className="text-[13px] font-bold" style={{ color: colors.ink }}>
            The only way in
          </div>
          <div className="text-[13px] leading-[19px]" style={{ color: colors.body }}>
            edit the source, commit, push, let the pipeline build a new image, pull it
          </div>
        </div>
      </motion.div>
    </div>
  )
}
