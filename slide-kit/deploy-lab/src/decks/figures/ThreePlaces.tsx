import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * Why a moving address costs something: it is written down in three places,
 * and one of the three is sealed inside a Docker image.
 *
 * The argument only works if the middle card LOOKS different from the other
 * two, so it carries a lock and the price of changing it. A row of three
 * identical cards would say "three places" and miss the point entirely.
 */
export function ThreePlaces({ upto = 3 }: { upto?: 1 | 2 | 3 }) {
  const instant = useInstant()

  const cards = [
    {
      where: 'docker-compose.yml',
      on: 'on the server',
      cost: 'Edit the file, up -d',
      price: 'seconds',
      sealed: false,
    },
    {
      where: 'settings.py',
      on: 'inside the Docker image',
      cost: 'Commit, build, push, redeploy',
      price: 'a full release',
      sealed: true,
    },
    {
      where: 'Jenkinsfile',
      on: 'the host the Deploy stage connects to',
      cost: 'Commit, and the next build uses it',
      price: 'one build',
      sealed: false,
    },
  ].slice(0, upto)

  return (
    <div className="flex items-stretch justify-center gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.where}
          initial={instant ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={instant ? { duration: 0 } : { duration: 0.52, delay: i * 0.16 }}
          className="relative flex w-[290px] flex-col gap-1 rounded-card border-2 bg-white px-4 pb-3 pt-4"
          style={{ borderColor: c.sealed ? colors.danger : colors.line }}
        >
          {c.sealed && (
            <span
              className="absolute -top-3 left-4 flex items-center gap-1 rounded-pill px-2 py-0.5 text-[12px] font-bold text-white"
              style={{ background: colors.danger }}
            >
              <svg width={11} height={11} viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor" />
                <path d="M8,11 V7 a4,4 0 0 1 8,0 V11" stroke="currentColor" strokeWidth="2.5" />
              </svg>
              sealed
            </span>
          )}
          <span className="font-mono text-[15px] font-bold" style={{ color: colors.ink }}>
            {c.where}
          </span>
          <span className="text-[13px] leading-[18px]" style={{ color: colors.body }}>
            {c.on}
          </span>
          <div className="mt-auto pt-3">
            <div className="text-[13px] leading-[18px]" style={{ color: colors.body }}>
              To change it: {c.cost}
            </div>
            <div
              className="mt-1 inline-block rounded-pill px-2.5 py-0.5 text-[13px] font-bold"
              style={{
                background: c.sealed ? colors.danger : colors.surface2,
                color: c.sealed ? colors.white : colors.brandDark,
              }}
            >
              {c.price}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
