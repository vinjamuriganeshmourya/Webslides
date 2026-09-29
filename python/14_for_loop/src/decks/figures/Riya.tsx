/* Riya, the student the savings story belongs to.
 *
 * Drawn here, in the reference's own palette and proportions (`svg.rs-riya` in
 * `14_for_loop_student_view_new_design.html`), so the deck and the handout show
 * recognisably the same person. Course rule R1 bans stock art. The first cut
 * was the reference's file lifted byte for byte and read as a flat sticker at
 * deck scale; this one keeps her colours and her braid and redraws the head,
 * the fringe and the arms so she holds up at 108px next to a speech bubble.
 *
 * Her mouth is the one moving part. She smiles on a day a coin goes in and
 * frets on the day the sum gets too big to do by hand, which is the beat the
 * whole story exists to reach.
 */
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'
import { useInstant } from '@/motion/instant'

export function Riya({ width = 120, mood = 'happy' }: { width?: number; mood?: 'happy' | 'worried' }) {
  const worried = mood === 'worried'
  return (
    <svg viewBox="0 0 200 300" width={width} role="img" aria-label="Riya, a college student">
      <ellipse cx="100" cy="292" rx="62" ry="7" fill="#1E3A5F" opacity=".10" />

      {/* hair, behind everything */}
      <path d="M100 30 C60 30 44 60 46 96 C47 120 44 150 40 168 L62 168 C60 140 60 116 62 96 C78 82 122 82 138 96 C140 116 140 140 138 168 L160 168 C156 150 153 120 154 96 C156 60 140 30 100 30 Z" fill="#2E1E1A" />

      {/* kurta */}
      <path d="M66 176 C46 186 40 214 40 288 L160 288 C160 214 154 186 134 176 L118 172 L82 172 Z" fill="#3FB5E5" />
      <path d="M86 172 L100 200 L114 172 Z" fill="#E9F7FD" />
      <path d="M100 200 L100 288" stroke="#2C93C7" strokeWidth="2" opacity=".5" />

      {/* arms */}
      <path d="M62 184 C46 196 40 224 42 252" stroke="#3FB5E5" strokeWidth="24" fill="none" strokeLinecap="round" />
      <path d="M138 184 C154 196 160 222 158 248" stroke="#3FB5E5" strokeWidth="24" fill="none" strokeLinecap="round" />
      <circle cx="42" cy="258" r="11" fill="#E8B48A" />
      <circle cx="158" cy="254" r="11" fill="#E8B48A" />

      {/* neck and head */}
      <rect x="90" y="150" width="20" height="28" rx="9" fill="#E0A77C" />
      <circle cx="100" cy="112" r="44" fill="#F0C29B" />
      <ellipse cx="56" cy="114" rx="7" ry="10" fill="#F0C29B" />
      <ellipse cx="144" cy="114" rx="7" ry="10" fill="#F0C29B" />

      {/* fringe, in front of the face */}
      <path d="M58 106 C56 68 78 52 100 52 C124 52 146 68 144 108 C136 86 122 76 100 76 C80 76 66 86 58 106 Z" fill="#2E1E1A" />
      <circle cx="136" cy="80" r="7" fill="#F25C8A" />

      {/* eyes */}
      <ellipse cx="84" cy="114" rx="4.5" ry="6" fill="#1E2227" />
      <ellipse cx="116" cy="114" rx="4.5" ry="6" fill="#1E2227" />
      <circle cx="85.6" cy="112" r="1.5" fill="#fff" />
      <circle cx="117.6" cy="112" r="1.5" fill="#fff" />
      <path
        d={worried ? 'M76 101 Q84 105 92 100' : 'M76 102 Q84 97 92 101'}
        stroke="#2E1E1A"
        strokeWidth="2.8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={worried ? 'M108 100 Q116 105 124 101' : 'M108 101 Q116 97 124 102'}
        stroke="#2E1E1A"
        strokeWidth="2.8"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="72" cy="130" r="6.5" fill="#F29B9B" opacity=".5" />
      <circle cx="128" cy="130" r="6.5" fill="#F29B9B" opacity=".5" />

      {/* the one moving part */}
      {worried ? (
        <ellipse cx="100" cy="138" rx="6" ry="7.5" fill="#8A3B2E" />
      ) : (
        <path d="M88 134 Q100 146 112 134" stroke="#8A3B2E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      )}
    </svg>
  )
}

/* One bubble per press. `from` picks the speaker, which sets the tail side and
   the trim: blue when Riya talks, pink when the bank answers, exactly as the
   reference distinguishes its `.rs-bub.r` from its `.rs-bub.p`. */
export function SpeechBubble({
  children,
  from = 'riya',
  className = '',
}: {
  children: ReactNode
  from?: 'riya' | 'pig'
  className?: string
}) {
  const instant = useInstant()
  const riya = from === 'riya'
  const edge = riya ? '#9BD3EE' : '#F4B6CD'
  const fill = riya ? '#FFFFFF' : '#FFF5F9'
  return (
    <motion.div
      className={`relative rounded-card border-2 px-5 py-3 text-left shadow-card-soft ${className}`}
      style={{ borderColor: edge, background: fill }}
      initial={instant ? false : { opacity: 0, scale: 0.94, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: T.label, ease: c4(E.pop) }}
    >
      <span
        aria-hidden
        className="absolute top-[26px] h-[16px] w-[16px] rotate-45 border-b-2 border-l-2"
        style={{
          borderColor: edge,
          background: fill,
          left: riya ? -10 : undefined,
          right: riya ? undefined : -10,
          transform: riya ? 'rotate(45deg)' : 'rotate(-135deg)',
        }}
      />
      <p className="font-heading text-body font-semibold leading-snug" style={{ color: colors.body }}>
        {children}
      </p>
    </motion.div>
  )
}
