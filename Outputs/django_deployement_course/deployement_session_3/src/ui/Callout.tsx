import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { Step } from '@/motion/Stepper'
import { iconByName, type IconName } from './icons'

type CalloutKind = 'note' | 'tip' | 'info' | 'warning' | 'success'

const KIND: Record<CalloutKind, { color: string; bg: string; icon: IconName; label: string }> = {
  note: { color: '#0B5FFF', bg: '#EAF1FF', icon: 'info', label: 'Note' },
  tip: { color: '#12B5A8', bg: '#E6FAF7', icon: 'bulb', label: 'Tip' },
  info: { color: '#0EA5E9', bg: '#E0F2FE', icon: 'info', label: 'Good to know' },
  warning: { color: '#B45309', bg: '#FEF3C7', icon: 'warning', label: 'Watch out' },
  success: { color: '#15803D', bg: '#DCFCE7', icon: 'check', label: 'Remember' },
}

/**
 * Technology marks that ship a vendor white variant beside them in
 * `public/assets/tech/`, as `<name>-white.png` / `<name>-white.svg`.
 *
 * WHY THIS LIST EXISTS. The icon holder is a solid square filled with the
 * callout kind's colour, so a full-colour mark dropped into it is a coloured
 * logo on a coloured ground: the Docker whale on the `success` green read as a
 * smudge on the Compose definition slide, which is what was reported. The holder
 * therefore resolves a mark to its white sibling itself, so a deck can pass the
 * ordinary logo path and still get a legible mark.
 *
 * It is a LIST rather than a rule, because `<name>-white` is a file that either
 * exists or does not, and rewriting a src to a file that is not on disk ships a
 * broken image (slide-content rule 12). Add a name here only after adding the
 * asset to `slide-kit/assets/tech/` and copying it into `public/assets/tech/`.
 *
 * Recolouring with a CSS filter was the other option and is deliberately not
 * used: the session's asset rule says a light-on-dark logo is the vendor's own
 * white file, not our filter over their artwork.
 */
const WHITE_MARK_AVAILABLE = new Set(['docker', 'container'])

/** `/assets/tech/docker.png` -> `/assets/tech/docker-white.png`. */
const MARK_SRC = /^(.*\/)([a-z0-9+]+)\.(png|svg)$/

/**
 * Swap a full-colour technology mark for its white variant, because the holder
 * it is about to sit in is a solid block of the kind's colour. Anything that is
 * not a recognised mark (the kind's own stroke glyph, an inline svg, a mark with
 * no white variant on disk) is returned untouched.
 */
function whiteMark(icon: ReactNode): ReactNode {
  if (!isValidElement(icon)) return icon
  const src = (icon.props as { src?: unknown }).src
  if (typeof src !== 'string') return icon
  const m = MARK_SRC.exec(src)
  if (!m || !WHITE_MARK_AVAILABLE.has(m[2])) return icon
  return cloneElement(icon as ReactElement<{ src?: string }>, {
    src: `${m[1]}${m[2]}-white.${m[3]}`,
  })
}

/**
 * Highlighted callout / note-point box. The recurring "Note point" element
 * for content slides.
 */
export function Callout({
  kind = 'note',
  title,
  children,
  className = '',
  asStep = true,
  icon,
}: {
  kind?: CalloutKind
  title?: ReactNode
  children: ReactNode
  className?: string
  /**
   * Replace the kind's default glyph inside the icon holder. Used where the
   * callout defines a named product and its own mark is more informative than a
   * generic info glyph. Pass the WHITE variant of any logo: the holder is filled
   * with the kind's colour.
   */
  icon?: ReactNode
  /**
   * When true (default) the callout is a click-revealed build step. Set false
   * to render it immediately alongside the slide's base content — e.g. a quiz
   * hint, which is a thinking aid meant to be visible before the answer.
   */
  asStep?: boolean
}) {
  const k = KIND[kind]
  const Icon = iconByName[k.icon]
  const inner = (
    <>
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
        style={{ background: k.color }}
      >
        {icon ? whiteMark(icon) : <Icon width={20} height={20} />}
      </span>
      <div>
        <p className="font-heading text-base font-bold" style={{ color: k.color }}>
          {title ?? k.label}
        </p>
        <div className="mt-1 text-body leading-relaxed text-ink-soft">{children}</div>
      </div>
    </>
  )
  /*
    THE BOX HAS TO CLEAR THE FOOTER MARK.

    On a tall content slide the callout is the last block in the column, and when
    the column overruns the frame the callout is what runs past the bottom
    padding and into the NxtWave mark in the bottom-right corner. Two slides in
    session 3 shipped that way, the box overlapping the mark by about ten pixels.

    `SlideBase` gives back eight pixels by tucking the mark tighter into the
    corner; the other eight come from here, as vertical padding the box was
    spending on air. 20px of horizontal padding against 16px vertical still reads
    as a padded box, and the icon holder (40px) plus a single line of title and
    body sets the minimum height anyway, so a short callout is unchanged.

    This buys clearance, it does not create a guarantee: a callout is only ever
    as safe as the height of the content stacked above it. If one ever collides
    again, the slide is over-full and the fix is on the slide.
  */
  const boxClass = `flex items-start gap-4 rounded-card border-l-[5px] px-5 py-4 ${className}`
  const boxStyle = { background: k.bg, borderColor: k.color }

  if (!asStep) {
    return (
      <div className={boxClass} style={boxStyle}>
        {inner}
      </div>
    )
  }
  return (
    <Step dir="up" className={boxClass} style={boxStyle}>
      {inner}
    </Step>
  )
}
