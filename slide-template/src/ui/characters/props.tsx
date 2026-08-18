/**
 * Decorative prop SVGs used to build character scenes and concept
 * illustrations. All use the NxtWave-Evolve palette and rounded, glossy,
 * flat-vector styling to match the Nova mascot.
 */
import { useId } from 'react'

function useGrad(from: string, to: string, vertical = true) {
  const id = useId().replace(/:/g, '')
  const el = (
    <linearGradient id={id} x1="0" y1="0" x2={vertical ? '0' : '1'} y2={vertical ? '1' : '0'}>
      <stop offset="0%" stopColor={from} />
      <stop offset="100%" stopColor={to} />
    </linearGradient>
  )
  return { id, el }
}

export function QuestionMark({ className }: { className?: string }) {
  const g = useGrad('#4C80FF', '#12B5A8')
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden>
      <defs>{g.el}</defs>
      <path
        d="M60 78 C 60 40 92 20 122 30 C 156 41 160 82 132 104 C 116 117 108 126 108 150 L 82 150 C 82 116 96 104 116 90 C 132 79 130 58 112 54 C 96 51 86 62 86 78 Z"
        fill={`url(#${g.id})`}
      />
      <circle cx="95" cy="188" r="18" fill="#FF8A3D" />
      <circle cx="90" cy="182" r="5" fill="#FFFFFF" fillOpacity="0.7" />
    </svg>
  )
}

export function Laptop({ className }: { className?: string }) {
  const screen = useGrad('#0B5FFF', '#0E9285')
  return (
    <svg viewBox="0 0 260 190" className={className} aria-hidden>
      <defs>{screen.el}</defs>
      {/* lid */}
      <rect x="46" y="24" width="168" height="112" rx="12" fill="#0B1A2B" />
      <rect x="56" y="34" width="148" height="92" rx="7" fill={`url(#${screen.id})`} />
      {/* abstract code bars (no text) */}
      {[
        [66, 48, 60], [66, 62, 84], [78, 76, 48], [66, 90, 96], [78, 104, 40],
      ].map(([x, y, w], i) => (
        <rect key={i} x={x} y={y} width={w} height="7" rx="3.5" fill="#FFFFFF" fillOpacity={0.85 - i * 0.08} />
      ))}
      <circle cx="176" cy="58" r="12" fill="#FF8A3D" fillOpacity="0.9" />
      {/* base */}
      <path d="M28 136 H232 L246 164 H14 Z" fill="#D8E3F5" />
      <rect x="108" y="146" width="44" height="7" rx="3.5" fill="#8A99A8" />
    </svg>
  )
}

export function StarBubble({ className }: { className?: string }) {
  const g = useGrad('#EAF1FF', '#FFFFFF')
  return (
    <svg viewBox="0 0 240 190" className={className} aria-hidden>
      <defs>{g.el}</defs>
      <path
        d="M28 20 H212 C 224 20 232 28 232 40 V120 C 232 132 224 140 212 140 H96 L60 172 V140 H28 C 16 140 8 132 8 120 V40 C 8 28 16 20 28 20 Z"
        fill={`url(#${g.id})`}
        stroke="#D8E3F5"
        strokeWidth="2"
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} cx={44 + i * 38} cy={78} r={16} filled={i < 4} />
      ))}
    </svg>
  )
}

export function Star({
  cx,
  cy,
  r,
  filled = true,
}: {
  cx: number
  cy: number
  r: number
  filled?: boolean
}) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const ang = (Math.PI / 5) * i - Math.PI / 2
    const rad = i % 2 === 0 ? r : r * 0.45
    return `${cx + Math.cos(ang) * rad},${cy + Math.sin(ang) * rad}`
  }).join(' ')
  return (
    <polygon
      points={pts}
      fill={filled ? '#FF8A3D' : '#FFFFFF'}
      stroke="#FF8A3D"
      strokeWidth={filled ? 0 : 2.5}
      strokeLinejoin="round"
    />
  )
}

export function ChecklistCard({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 210 240" className={className} aria-hidden>
      <rect x="20" y="16" width="170" height="212" rx="16" fill="#FFFFFF" stroke="#D8E3F5" strokeWidth="2" />
      <rect x="72" y="12" width="66" height="20" rx="10" fill="#0B5FFF" />
      {[0, 1, 2, 3].map((i) => {
        const y = 64 + i * 42
        return (
          <g key={i}>
            <circle cx="52" cy={y} r="14" fill={i < 3 ? '#16A34A' : '#E8F0FF'} />
            {i < 3 && (
              <path
                d={`M45 ${y} l5 6 l9 -11`}
                stroke="#FFFFFF"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            <rect x="76" y={y - 8} width={i < 3 ? 92 : 64} height="7" rx="3.5" fill="#D8E3F5" />
            <rect x="76" y={y + 4} width={i < 3 ? 64 : 44} height="7" rx="3.5" fill="#E8F0FF" />
          </g>
        )
      })}
    </svg>
  )
}
