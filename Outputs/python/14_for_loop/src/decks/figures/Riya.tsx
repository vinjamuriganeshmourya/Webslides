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
import { useId, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'
import { useInstant } from '@/motion/instant'
import { SoftLight, CastShadow } from './lighting'

export function Riya({ width = 120, mood = 'happy' }: { width?: number; mood?: 'happy' | 'worried' }) {
  const worried = mood === 'worried'
  /* Unique gradient ids: she appears twice on some frames, and a duplicate id
     makes the second one inherit the first's paint. */
  const u = useId().replace(/:/g, '')
  const g = (n: string) => `ry-${n}-${u}`

  return (
    <svg viewBox="0 0 200 300" width={width} role="img" aria-label="Riya, a college student">
      {/* VOLUME, IN THE ORDER LIGHT WORKS. Light comes from the upper left, the
          same direction as the bank beside her, so the two read as one scene:
          a gradient on every large form, occlusion where a form turns away, a
          rim light on the lit edge, and a soft contact shadow on the ground.
          Flat fills made her a sticker next to a shaded piggy bank. */}
      <defs>
        <linearGradient id={g('kurta')} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#7FD0F5" />
          <stop offset="45%" stopColor="#3FB5E5" />
          <stop offset="100%" stopColor="#1E7FAC" />
        </linearGradient>
        <linearGradient id={g('sleeve')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5FC3EC" />
          <stop offset="100%" stopColor="#2189B8" />
        </linearGradient>
        <radialGradient id={g('face')} cx="0.38" cy="0.32" r="0.75">
          <stop offset="0%" stopColor="#FFDCBC" />
          <stop offset="55%" stopColor="#F0C29B" />
          <stop offset="100%" stopColor="#D8A276" />
        </radialGradient>
        <linearGradient id={g('skin')} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#F2C59F" />
          <stop offset="100%" stopColor="#D09A6E" />
        </linearGradient>
        <linearGradient id={g('hair')} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#4A3A33" />
          <stop offset="45%" stopColor="#2E1E1A" />
          <stop offset="100%" stopColor="#1A100D" />
        </linearGradient>
        <radialGradient id={g('ground')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#1E3A5F" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#1E3A5F" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={g('occ')} cx="0.5" cy="0.2" r="0.85">
          <stop offset="55%" stopColor="#0B3D56" stopOpacity="0" />
          <stop offset="100%" stopColor="#0B3D56" stopOpacity="0.4" />
        </radialGradient>
        {/* Matte: cloth and skin turn, but they do not gleam. */}
        <SoftLight id={g('lit')} />
        <CastShadow id={g('drop')} dy={4} blur={3.5} opacity={0.34} />
        <CastShadow id={g('soft')} dy={6} blur={6} opacity={0.22} />
      </defs>

      <ellipse cx="100" cy="292" rx="66" ry="9" fill={`url(#${g('ground')})`} />

      {/* hair, behind everything */}
      <path
        d="M100 30 C60 30 44 60 46 96 C47 120 44 150 40 168 L62 168 C60 140 60 116 62 96 C78 82 122 82 138 96 C140 116 140 140 138 168 L160 168 C156 150 153 120 154 96 C156 60 140 30 100 30 Z"
        fill={`url(#${g('hair')})`}
      />

      {/* kurta */}
      <g filter={`url(#${g('lit')})`}>
        <path
          d="M66 176 C46 186 40 214 40 288 L160 288 C160 214 154 186 134 176 L118 172 L82 172 Z"
          fill={`url(#${g('kurta')})`}
        />
      </g>
      <path
        d="M66 176 C46 186 40 214 40 288 L160 288 C160 214 154 186 134 176 L118 172 L82 172 Z"
        fill={`url(#${g('occ')})`}
      />
      <path d="M86 172 L100 200 L114 172 Z" fill="#EAF8FE" />
      <path d="M100 200 L100 288" stroke="#1B6E96" strokeWidth="2" opacity=".45" />
      {/* Rim light down the lit edge of the kurta. */}
      <path
        d="M67 180 C52 192 47 218 46 284"
        fill="none"
        stroke="#BFEAFB"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* arms */}
      {/* THE ARMS ARE IN FRONT OF THE TORSO, so they throw a shadow onto it.
          That single shadow does more for depth than any gradient on the arm. */}
      <g filter={`url(#${g('drop')})`}>
        <path d="M62 184 C46 196 40 224 42 252" stroke={`url(#${g('sleeve')})`} strokeWidth="24" fill="none" strokeLinecap="round" />
        <path d="M138 184 C154 196 160 222 158 248" stroke={`url(#${g('sleeve')})`} strokeWidth="24" fill="none" strokeLinecap="round" />
        <circle cx="42" cy="258" r="11" fill={`url(#${g('skin')})`} />
        <circle cx="158" cy="254" r="11" fill={`url(#${g('skin')})`} />
      </g>

      {/* neck, in shadow under the chin */}
      <rect x="90" y="150" width="20" height="28" rx="9" fill="#C68F62" />

      {/* head */}
      <g filter={`url(#${g('lit')})`}>
        <circle cx="100" cy="112" r="44" fill={`url(#${g('face')})`} />
      </g>
      {/* The chin's shadow ON THE NECK -- not on the chin. It is what makes the
          head sit on the body instead of beside it. */}
      <path d="M90 152 q10 8 20 0 l0 12 q-10 5 -20 0 z" fill="#A8703F" opacity="0.45" />
      <ellipse cx="56" cy="114" rx="7" ry="10" fill={`url(#${g('skin')})`} />
      <ellipse cx="144" cy="114" rx="7" ry="10" fill={`url(#${g('skin')})`} />

      {/* fringe, in front of the face, with a sheen along the top */}
      <g filter={`url(#${g('drop')})`}>
        <path
          d="M58 106 C56 68 78 52 100 52 C124 52 146 68 144 108 C136 86 122 76 100 76 C80 76 66 86 58 106 Z"
          fill={`url(#${g('hair')})`}
        />
      </g>
      <path d="M70 76 C82 62 104 58 122 64" fill="none" stroke="#6B5449" strokeWidth="3.5" strokeLinecap="round" opacity="0.5" />
      <circle cx="136" cy="80" r="7" fill="#F25C8A" />
      <circle cx="134" cy="78" r="2.4" fill="#FFB3C9" opacity="0.8" />

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
      <circle cx="72" cy="130" r="6.5" fill="#F29B9B" opacity=".45" />
      <circle cx="128" cy="130" r="6.5" fill="#F29B9B" opacity=".45" />

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
