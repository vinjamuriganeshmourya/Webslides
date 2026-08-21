import type { ReactNode } from 'react'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import { Kicker } from './primitives'
import { accentByTone, type Tone } from '@/design/tokens'

/**
 * The standard content-slide header: an accent rail + kicker + title + lead.
 * Self-animates its parts on slide entry.
 */
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
      className={`relative ${centered ? 'text-center' : ''} ${className}`}
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
