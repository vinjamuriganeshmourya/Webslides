import type { ReactNode } from 'react'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import { Kicker } from './primitives'
import { accentByTone, type Tone } from '@/design/tokens'

/**
 * The standard content-slide header: an accent rail + kicker + title + lead.
 * Self-animates its parts on slide entry.
 *
 * VIDEO BOX RESERVATION
 * The top-right 367x220 of the 1280x720 canvas is kept clear for an instructor
 * video. Content slides centre their content in whatever height the header
 * leaves, so a tall payload creeps upward into that band. The header therefore
 * claims a minimum height (`min-h-[168px]`, which puts the content well's top
 * edge at y=216 given SlideBase's 48px top padding), so no content can begin
 * inside the reserved rows. Headers taller than that (a two-line title, a long
 * lead) simply grow as before.
 */
const HEADER_MIN_H = 'min-h-[168px]'
export function SlideHeader({
  kicker,
  title,
  lead,
  tone = 'brand',
  onDark = false,
  align = 'left',
  className = '',
}: {
  kicker?: string
  title: ReactNode
  lead?: ReactNode
  tone?: Tone
  onDark?: boolean
  align?: 'left' | 'center'
  className?: string
}) {
  const color = accentByTone[tone]
  const centered = align === 'center'
  return (
    <RevealGroup
      className={`relative shrink-0 ${HEADER_MIN_H} ${centered ? 'text-center' : ''} ${className}`}
      stagger={0.08}
    >
      {!centered && (
        <span
          className="absolute -left-16 top-1 h-full w-[6px] rounded-pill"
          style={{ background: `linear-gradient(${color}, ${color}00)` }}
        />
      )}
      {kicker && (
        <Reveal dir="right" className={centered ? 'mb-3 inline-block' : 'mb-3 block'}>
          <Kicker tone={tone} onDark={onDark}>
            {kicker}
          </Kicker>
        </Reveal>
      )}
      <Reveal dir="up">
        <h2
          className={`font-heading font-extrabold leading-tight ${
            centered ? 'text-slide-title-lg' : 'text-slide-title'
          } ${onDark ? 'text-white' : 'text-ink'}`}
        >
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal dir="up" delay={0.05}>
          <p
            className={`mt-3 max-w-3xl text-body-lg ${
              centered ? 'mx-auto' : ''
            } ${onDark ? 'text-white/80' : 'text-body'}`}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </RevealGroup>
  )
}
