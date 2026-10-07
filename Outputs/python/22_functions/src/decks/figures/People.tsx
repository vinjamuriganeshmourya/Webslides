import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'

/**
 * THE DRAWN WORLD OF PF 22: Teja's party (spec note 2). Course rule R5:
 * a hook is drawn as the real thing, a cake with candles, a phone, people;
 * R5b: a person who says the line says it in a speech bubble.
 *
 * Skin, hair, wood and icing are the illustration's own natural colours, as
 * session 18's characters kept theirs; every UI colour is a token (content
 * rule 37). Lit from the top left (STYLE_GUIDE section 9): a lighter top, a
 * soft shadow below.
 */

const SKINS = ['#C98B5E', '#A86F48', '#E0A97E']
const HAIR = '#2B1B14'

/** One person, head and shoulders down to the waist. */
export function Person({
  shirt,
  skin = 0,
  height = 170,
  hat = false,
  apron = false,
  arms = 'down',
  mouth = 'smile',
  hair = 'short',
  flip = false,
  hold,
}: {
  shirt: string
  skin?: number
  height?: number
  hat?: boolean
  apron?: boolean
  arms?: 'down' | 'out' | 'up'
  mouth?: 'smile' | 'open' | 'flat'
  hair?: 'short' | 'long'
  flip?: boolean
  /** something in the hands, drawn in front at chest height (a cake box) */
  hold?: ReactNode
}) {
  const s = SKINS[skin % SKINS.length]
  const w = (height * 140) / 220
  return (
    <svg width={w} height={height} viewBox="0 0 140 220" aria-hidden className="shrink-0 overflow-visible" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      {hair === 'long' && <path d="M38 58 C 34 102 44 132 50 140 L 90 140 C 96 132 106 102 102 58 Z" fill={HAIR} />}
      {/* arms behind the body when down */}
      {arms === 'up' && (
        <>
          <path d="M34 128 C 20 104 18 84 22 66" stroke={shirt} strokeWidth={16} strokeLinecap="round" fill="none" />
          <circle cx={22} cy={62} r={9} fill={s} />
          <path d="M106 128 C 120 104 122 84 118 66" stroke={shirt} strokeWidth={16} strokeLinecap="round" fill="none" />
          <circle cx={118} cy={62} r={9} fill={s} />
        </>
      )}
      <path d="M18 220 C 18 160 40 128 70 126 C 100 128 122 160 122 220 Z" fill={shirt} />
      <path d="M18 220 C 18 160 40 128 70 126 C 100 128 122 160 122 220 Z" fill="url(#ppl-shade)" />
      {apron && <path d="M46 150 H 94 V 220 H 46 Z" fill="#FFFFFF" stroke={colors.line} strokeWidth={1.5} />}
      {apron && <path d="M58 150 C 58 136 82 136 82 150" fill="none" stroke={colors.line} strokeWidth={2} />}
      <rect x={60} y={98} width={20} height={30} rx={8} fill={s} />
      <ellipse cx={40} cy={70} rx={7} ry={10} fill={s} />
      <ellipse cx={100} cy={70} rx={7} ry={10} fill={s} />
      <ellipse cx={70} cy={68} rx={30} ry={34} fill={s} />
      {!hat && <path d="M40 66 C 38 32 56 24 72 24 C 92 24 104 36 100 66 C 92 46 82 42 70 42 C 58 42 46 48 40 66 Z" fill={HAIR} />}
      {hat && (
        <>
          <path d="M44 44 C 30 40 30 16 50 16 C 52 4 88 4 90 16 C 110 16 110 40 96 44 Z" fill="#FFFFFF" stroke={colors.line} strokeWidth={1.5} />
          <rect x={44} y={40} width={52} height={10} rx={3} fill="#FFFFFF" stroke={colors.line} strokeWidth={1.5} />
        </>
      )}
      <circle cx={59} cy={70} r={3.6} fill={colors.ink} />
      <circle cx={81} cy={70} r={3.6} fill={colors.ink} />
      <circle cx={52} cy={82} r={5} fill="#E07A5F" opacity={0.25} />
      <circle cx={88} cy={82} r={5} fill="#E07A5F" opacity={0.25} />
      {mouth === 'smile' && <path d="M60 86 Q 70 95 80 86" stroke="#7A3E22" strokeWidth={3} strokeLinecap="round" fill="none" />}
      {mouth === 'open' && <ellipse cx={70} cy={89} rx={7} ry={6} fill="#7A3E22" />}
      {mouth === 'flat' && <path d="M62 89 H 78" stroke="#7A3E22" strokeWidth={3} strokeLinecap="round" />}
      {arms === 'out' && (
        <>
          <path d="M30 150 C 30 170 44 176 58 170" stroke={shirt} strokeWidth={15} strokeLinecap="round" fill="none" />
          <path d="M110 150 C 110 170 96 176 82 170" stroke={shirt} strokeWidth={15} strokeLinecap="round" fill="none" />
          <circle cx={62} cy={169} r={8} fill={s} />
          <circle cx={78} cy={169} r={8} fill={s} />
        </>
      )}
      {hold && <g transform="translate(30 132)">{hold}</g>}
      <defs>
        <linearGradient id="ppl-shade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.18" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.12" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/** The birthday cake: two tiers, icing words, candles. `lit` flames. */
export function Cake({ width = 260, words = 'Happy Birthday Teja', lit = true }: { width?: number; words?: string; lit?: boolean }) {
  const h = (width * 200) / 260
  return (
    <svg width={width} height={h} viewBox="0 0 260 200" aria-hidden className="shrink-0 overflow-visible">
      <ellipse cx={130} cy={190} rx={120} ry={10} fill="#000000" opacity={0.25} />
      <rect x={10} y={176} width={240} height={10} rx={5} fill="#E8E2D6" />
      {/* bottom tier */}
      <rect x={24} y={110} width={212} height={68} rx={12} fill="#8A4B2A" />
      <path d="M24 122 Q 40 136 56 122 Q 72 136 88 122 Q 104 136 120 122 Q 136 136 152 122 Q 168 136 184 122 Q 200 136 216 122 Q 228 132 236 122 V 110 H 24 Z" fill="#FFF3E6" />
      <text x={130} y={160} textAnchor="middle" fontSize={17} fontWeight={700} fill="#FFF3E6" fontFamily="Poppins, system-ui, sans-serif">
        {words}
      </text>
      {/* top tier */}
      <rect x={66} y={64} width={128} height={50} rx={10} fill="#A85B33" />
      <path d="M66 74 Q 82 86 98 74 Q 114 86 130 74 Q 146 86 162 74 Q 178 86 194 74 V 64 H 66 Z" fill="#FFF3E6" />
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 86 + i * 22
        return (
          <g key={i}>
            <rect x={x - 3.5} y={36} width={7} height={30} rx={2} fill={[colors.brand, colors.accent, colors.teal, colors.warning, colors.brand][i]} />
            {lit && (
              <>
                <ellipse cx={x} cy={26} rx={7} ry={11} fill="#FFC46A" opacity={0.35} />
                <path d={`M ${x} 16 C ${x + 6} 26 ${x + 4} 34 ${x} 34 C ${x - 4} 34 ${x - 6} 26 ${x} 16 Z`} fill="#FF9F3D" />
                <path d={`M ${x} 24 C ${x + 2.5} 28 ${x + 2} 32 ${x} 32 C ${x - 2} 32 ${x - 2.5} 28 ${x} 24 Z`} fill="#FFF1C2" />
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}

/** A cake box with a ribbon and the words on its lid label. */
export function CakeBox({ width = 110, words = 'Happy Birthday Teja' }: { width?: number; words?: string }) {
  const h = (width * 80) / 110
  return (
    <svg width={width} height={h} viewBox="0 0 110 80" aria-hidden className="overflow-visible">
      <rect x={4} y={14} width={102} height={62} rx={6} fill="#FFFFFF" stroke={colors.line} strokeWidth={2} />
      <rect x={0} y={8} width={110} height={14} rx={4} fill="#FFF4EC" stroke={colors.accent} strokeWidth={2} />
      <rect x={50} y={8} width={10} height={68} fill={colors.accent} />
      <path d="M55 8 C 40 -6 32 4 46 9 M55 8 C 70 -6 78 4 64 9" stroke={colors.accent} strokeWidth={3} fill="none" />
      <rect x={10} y={34} width={36} height={26} rx={4} fill={colors.surface2} />
      <text x={28} y={45} textAnchor="middle" fontSize={7} fontWeight={700} fill={colors.brandDark} fontFamily="Inter, sans-serif">
        {words.split(' ').slice(0, 2).join(' ')}
      </text>
      <text x={28} y={54} textAnchor="middle" fontSize={7} fontWeight={700} fill={colors.brandDark} fontFamily="Inter, sans-serif">
        {words.split(' ').slice(2).join(' ')}
      </text>
    </svg>
  )
}

/** A speech bubble with its tail pointing at the speaker. */
export function Bubble({ children, tail = 'left', tone = 'plain', size = 18, className = '' }: { children: ReactNode; tail?: 'left' | 'right' | 'down'; tone?: 'plain' | 'shout'; size?: number; className?: string }) {
  const shout = tone === 'shout'
  const bg = shout ? '#FFF4EC' : colors.white
  const ring = shout ? colors.accent : colors.line
  return (
    <div className={`relative rounded-2xl px-4 py-2.5 font-semibold leading-snug ${className}`} style={{ background: bg, boxShadow: `inset 0 0 0 2px ${ring}, 0 8px 18px -10px rgba(16,32,58,0.35)`, color: colors.ink, fontSize: size }}>
      {children}
      <span
        aria-hidden
        className="absolute"
        style={{
          width: 16,
          height: 16,
          background: bg,
          boxShadow: `inset 2px 2px 0 0 ${ring}`,
          ...(tail === 'left' ? { left: -7, top: '50%', transform: 'translateY(-50%) rotate(-45deg)' } : tail === 'right' ? { right: -7, top: '50%', transform: 'translateY(-50%) rotate(135deg)' } : { left: 28, bottom: -7, transform: 'rotate(-135deg)' }),
        }}
      />
    </div>
  )
}
