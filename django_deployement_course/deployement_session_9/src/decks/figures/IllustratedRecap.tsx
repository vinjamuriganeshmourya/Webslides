import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { SlideBase, SlideHeader, Icons } from '@/ui'
import { T } from '@/ui/figureTiming'
import { ease, useFigureAnim } from './figureMotion'

/**
 * IllustratedRecap — a concept recap where every line has its picture.
 *
 * The kit's `RecapSlide` is a checklist beside the mascot. The user's call for
 * this deck (2026-09-16): a recap line must sit beside a small illustration of
 * the thing it names, so the frame reads as three pictures with a sentence
 * each. `RecapSlide` takes `BulletItem`s and has no slot per line, so this is a
 * session-local slide that keeps its look (light stage, success-toned header
 * and check marks, `SlideHeader` at the top-left datum per rule 19) and takes
 * `lines: { text, figure }`.
 *
 * Layout: a fixed 240 px figure column at the left, then the check and the
 * sentence. Rows are 140 px so three lines fill the well under a lead-less
 * header without reaching the footer. The sentence column is capped at 580 px
 * so nothing crosses x=913 while the first row is still level with the
 * instructor rectangle. Rows arrive top to bottom two staggers apart, at the
 * explanatory tier; the figure inside each row runs its own entrance.
 */

export interface RecapLine {
  text: ReactNode
  figure: ReactNode
}

const FIG_W = 240
const ROW_H = 140

export function IllustratedRecap({
  kicker,
  title,
  lines,
  lesson,
}: {
  kicker: string
  title: ReactNode
  lines: RecapLine[]
  lesson?: string
}) {
  const a = useFigureAnim()
  return (
    <SlideBase variant="light" lesson={lesson}>
      <div className="flex h-full flex-col">
        <SlideHeader kicker={kicker} title={title} tone="success" />
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <ol className="flex flex-col">
            {lines.map((l, i) => (
              <motion.li
                key={i}
                className="grid items-center gap-8"
                style={{ gridTemplateColumns: `${FIG_W}px 1fr`, height: ROW_H }}
                initial={a.instant ? false : { opacity: 0, transform: a.reduce ? 'translateY(0px)' : 'translateY(10px)' }}
                animate={{ opacity: 1, transform: 'translateY(0px)' }}
                transition={{ duration: T.enter, delay: T.lead + i * T.stagger * 2, ease }}
              >
                <div className="grid h-full place-items-center">{l.figure}</div>
                <div className="flex max-w-[580px] items-center gap-4">
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-full"
                    style={{ background: `${colors.success}1F`, color: colors.success }}
                  >
                    <Icons.Check width={20} height={20} />
                  </span>
                  <span className="font-heading text-[22px] font-semibold leading-8" style={{ color: colors.ink }}>{l.text}</span>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </SlideBase>
  )
}
