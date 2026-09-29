/* Riya, the student the savings story belongs to.
 *
 * The drawing is the pedagogy team's own, lifted verbatim from
 * `14_for_loop_student_view_new_design.html` (`svg.rs-riya`), so the deck and
 * the handout show the same person. Course rule R1 bans stock art; this is not
 * stock, it is the reference's asset. Do not redraw it: if she changes there,
 * re-extract, do not freehand.
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
  return (
    <svg viewBox="0 0 236 300" width={width} role="img" aria-label="Riya, a college student">
      <ellipse cx="110" cy="290" rx="70" ry="8" fill="#1E3A5F" opacity=".10" />
      <path d="M150 70 C188 78 190 132 168 156 C176 124 166 100 146 92 Z" fill="#2E1E1A" />
      <path d="M52 288 C52 214 72 176 110 176 C148 176 168 214 168 288 Z" fill="#3FB5E5" />
      <path d="M92 178 L110 206 L128 178 Z" fill="#E9F7FD" />
      <rect x="30" y="196" width="26" height="74" rx="13" fill="#3FB5E5" transform="rotate(14 43 196)" />
      <rect x="164" y="190" width="26" height="70" rx="13" fill="#3FB5E5" transform="rotate(-38 177 190)" />
      <circle cx="42" cy="268" r="13" fill="#E8B48A" />
      <circle cx="206" cy="150" r="13" fill="#E8B48A" />
      <rect x="98" y="148" width="24" height="32" rx="10" fill="#E0A77C" />
      <circle cx="110" cy="104" r="50" fill="#F0C29B" />
      <path d="M60 104 C56 58 86 42 112 44 C146 44 166 66 160 104 C150 82 132 70 108 72 C88 74 72 86 60 104 Z" fill="#2E1E1A" />
      <circle cx="152" cy="74" r="9" fill="#F25C8A" />
      <ellipse cx="92" cy="106" rx="5" ry="6.5" fill="#1E2227" />
      <ellipse cx="128" cy="106" rx="5" ry="6.5" fill="#1E2227" />
      <circle cx="94" cy="104" r="1.6" fill="#fff" />
      <circle cx="130" cy="104" r="1.6" fill="#fff" />
      <path d="M84 94 Q92 89 100 93" stroke="#2E1E1A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M120 93 Q128 89 136 94" stroke="#2E1E1A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="80" cy="124" r="7" fill="#F29B9B" opacity=".55" />
      <circle cx="140" cy="124" r="7" fill="#F29B9B" opacity=".55" />
      {mood === 'happy' ? (
        <path d="M96 126 Q110 140 124 126" stroke="#8A3B2E" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      ) : (
        <ellipse cx="110" cy="132" rx="7" ry="8" fill="#8A3B2E" />
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
