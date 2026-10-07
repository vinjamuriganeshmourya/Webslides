import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * How much room a t3.micro actually leaves for a build, measured.
 *
 * EVERY NUMBER ON THIS FIGURE WAS READ OFF THE REAL BUILD SERVER, at idle,
 * before any build ran. Illustration honesty, hard rule: a bar chart with
 * invented proportions teaches a feeling instead of a fact, and the fact here
 * is better than any feeling. 133 MiB free is alarming precisely because it is
 * true.
 */
export function MemoryBar() {
  const instant = useInstant()
  const TOTAL = 908
  const JENKINS = 436
  const OTHER = 339 /* the operating system and Docker itself: 908 - 436 - 133 */
  const FREE = 133

  const SWAP_TOTAL = 4096
  const SWAP_USED = 486

  const bar = (w: number, colour: string, delay: number, key: string) => (
    <motion.div
      key={key}
      initial={instant ? false : { width: 0 }}
      animate={{ width: `${w}%` }}
      transition={instant ? { duration: 0 } : { duration: 0.86, delay, ease: [0.22, 0.61, 0.36, 1] }}
      style={{ background: colour }}
      className="h-full"
    />
  )

  return (
    <div className="mx-auto flex w-[900px] flex-col gap-5">
      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-[15px] font-bold" style={{ color: colors.ink }}>
            Memory, with Jenkins idle and no build running
          </span>
          <span className="font-mono text-[14px]" style={{ color: colors.body }}>
            {TOTAL} MiB in total
          </span>
        </div>
        <div className="flex h-10 w-full overflow-hidden rounded-lg border-2" style={{ borderColor: colors.line }}>
          {bar((JENKINS / TOTAL) * 100, colors.brand, 0.1, 'j')}
          {bar((OTHER / TOTAL) * 100, colors.muted, 0.25, 'o')}
          {bar((FREE / TOTAL) * 100, colors.danger, 0.4, 'f')}
        </div>
        <div className="mt-1.5 flex gap-5 text-[13px]" style={{ color: colors.body }}>
          <span><b style={{ color: colors.brand }}>{JENKINS} MiB</b> Jenkins</span>
          <span><b style={{ color: colors.muted }}>{OTHER} MiB</b> Ubuntu and Docker</span>
          <span><b style={{ color: colors.danger }}>{FREE} MiB</b> free</span>
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-[15px] font-bold" style={{ color: colors.ink }}>
            Swap, added by hand, already doing work
          </span>
          <span className="font-mono text-[14px]" style={{ color: colors.body }}>
            4 GiB in total
          </span>
        </div>
        <div className="flex h-7 w-full overflow-hidden rounded-lg border-2" style={{ borderColor: colors.line }}>
          {bar((SWAP_USED / SWAP_TOTAL) * 100, colors.warning, 0.55, 's')}
        </div>
        <div className="mt-1.5 text-[13px]" style={{ color: colors.body }}>
          <b style={{ color: colors.warning }}>{SWAP_USED} MiB</b> of swap in use before a single build started
        </div>
      </div>
    </div>
  )
}
