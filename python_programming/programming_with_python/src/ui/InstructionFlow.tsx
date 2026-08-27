import { Reveal, RevealGroup } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import { T } from './figureTiming'
import { iconByName } from './icons'

/**
 * Instructions, handed to the machine that follows them.
 *
 * Session 1 opens one step before Python: software is a set of instructions, and
 * programming is writing them. Both slides are that one picture, so it is drawn
 * once and the second slide adds the word `Code` to the stack it already saw.
 *
 * Deliberately laid out in DOM, not SVG. Hard rule 17 exists because SVG text
 * has no layout engine and labels drift into each other at a different font
 * metric; every label here is in a flex box that cannot overlap its neighbour.
 *
 * A one-off for this deck: it depicts a definition, not a mechanism, and no other
 * session defines "software" from scratch.
 */

const Devices = iconByName.devices

const LINES = ['Turn the display on', 'Show a message on it', 'Wait for a key press']

export function InstructionFlow({
  /** Slide 6 names the stack: the instructions are called Code. */
  showCodeLabel = false,
  className = '',
}: {
  showCodeLabel?: boolean
  className?: string
}) {
  return (
    <RevealGroup
      stagger={T.stagger}
      delayChildren={T.lead}
      className={`flex w-full flex-col items-center gap-4 ${className}`}
    >
      <Reveal dir="up" className="w-full">
        <div className="overflow-hidden rounded-card border border-line bg-white shadow-card-soft">
          <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-2">
            <span className="font-heading text-body-sm font-bold uppercase tracking-wider text-body">
              Instructions
            </span>
            {showCodeLabel && (
              <span
                className="rounded-full px-3 py-1 font-heading text-[12px] font-bold uppercase tracking-wider text-white"
                style={{ background: colors.brand }}
              >
                Code
              </span>
            )}
          </div>
          <ul className="m-0 list-none p-0">
            {LINES.map((line, i) => (
              <li
                key={line}
                className="flex items-center gap-3 px-4 py-2.5"
                style={{ borderTop: i === 0 ? undefined : `1px solid ${colors.line}` }}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[12px] font-bold"
                  style={{ background: colors.surface2, color: colors.brand }}
                >
                  {i + 1}
                </span>
                <span className="font-mono text-[15px] text-ink">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal dir="fade" className="flex items-center justify-center">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full text-white"
          style={{ background: colors.brand }}
          aria-hidden
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v13M6 13l6 6 6-6" />
          </svg>
        </span>
      </Reveal>

      <Reveal dir="up" className="w-full">
        <div className="flex items-center gap-4 rounded-card border border-line bg-surface px-5 py-4">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-card text-white"
            style={{ background: colors.brandDeep }}
            aria-hidden
          >
            <Devices />
          </span>
          <span className="font-heading text-body-lg font-bold text-ink">The hardware</span>
        </div>
      </Reveal>
    </RevealGroup>
  )
}
