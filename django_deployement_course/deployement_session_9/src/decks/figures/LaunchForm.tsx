import { colors } from '@/design/tokens'
import { T } from '@/ui/figureTiming'
import { Rise, FadeIn, useFigureAnim, at } from './figureMotion'

/**
 * LaunchForm — the six sections of the EC2 launch form, as one labelled panel.
 *
 * WHAT IT ARGUES
 *   Launching an instance is not six unrelated ideas. It is one form, read top
 *   to bottom, and every concept in concept 3 is a field on it. The panel is
 *   shown once at the end of concept 2 to name what is coming (hard rule 4:
 *   name it, do not open it), and the room meets the rows again one at a time.
 *
 * WHAT IT NEVER DOES
 *   It is not a screenshot and never pretends to be one. No AWS chrome, no
 *   orange button, no field values: a numbered row carries the section name
 *   AWS uses and one plain line saying what it decides. The real screens are
 *   the captures on the slides that follow (hard rule 30).
 *
 * HOW IT MOVES
 *   The panel fades up, then the rows arrive top to bottom one `T.stagger`
 *   apart, in the order the form asks for them. `useInstant()` mounts
 *   everything at rest; reduced motion keeps the fades and drops the travel.
 */

export interface FormSection {
  /** The section name, as the form prints it. */
  name: string
  /** What this section decides, in plain English. */
  decides: string
}

const SECTIONS: FormSection[] = [
  { name: 'Name and tags', decides: 'what it is called' },
  { name: 'Application and OS Images', decides: 'which operating system' },
  { name: 'Instance type', decides: 'how big it is' },
  { name: 'Key pair (login)', decides: 'the file that logs you in' },
  { name: 'Network settings', decides: 'which network and doors' },
  { name: 'Configure storage', decides: 'how big the disk is' },
]

const W = 600
const HEAD = 46
const ROW = { h: 52, gap: 8, x: 14, w: 572 }
const H = HEAD + 14 + SECTIONS.length * (ROW.h + ROW.gap) + 6

export function LaunchForm({
  sections = SECTIONS,
  title = 'Launch an instance',
  className = '',
}: {
  sections?: FormSection[]
  title?: string
  className?: string
}) {
  const a = useFigureAnim()
  const top = (i: number) => HEAD + 14 + i * (ROW.h + ROW.gap)

  return (
    <div className={`relative mx-auto ${className}`} style={{ width: W, height: H }}>
      <FadeIn
        a={a}
        delay={at(0)}
        duration={T.enter}
        className="absolute inset-0 rounded-card bg-white shadow-card-soft"
        style={{ border: `2px solid ${colors.line}` }}
      >
        {null}
      </FadeIn>

      <FadeIn
        a={a}
        delay={at(0) + T.label}
        className="absolute left-0 right-0 top-0 flex items-center rounded-t-card px-5 font-heading text-body font-bold"
        style={{ height: HEAD, background: colors.surface2, color: colors.ink, borderBottom: `2px solid ${colors.line}` }}
      >
        {title}
      </FadeIn>

      {sections.map((s, i) => (
        <Rise key={s.name} a={a} x={ROW.x} y={top(i)} w={ROW.w} delay={at(i + 1)}>
          <div
            className="flex items-center gap-4 rounded-xl px-4"
            style={{ height: ROW.h, background: colors.white, border: `2px solid ${colors.line}` }}
          >
            <span
              className="grid size-8 shrink-0 place-items-center rounded-full font-heading text-body-sm font-bold text-white"
              style={{ background: colors.brand }}
            >
              {i + 1}
            </span>
            <span className="w-[252px] shrink-0 font-heading text-[17px] font-bold leading-5" style={{ color: colors.ink }}>
              {s.name}
            </span>
            <span className="text-[17px] leading-5" style={{ color: colors.body }}>
              {s.decides}
            </span>
          </div>
        </Rise>
      ))}
    </div>
  )
}
