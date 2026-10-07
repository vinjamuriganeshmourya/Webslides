import { useId } from 'react'
import { colors } from '@/design/tokens'
import { Reveal, RevealGroup } from '@/motion/Reveal'

/**
 * PORTAL SLIDE 15, "Extended Slicing": the three numbers inside the brackets,
 * each in its own colour, and the same three colours on the boxes and cards.
 *
 * The boxes are the INDICES 0 to 8, not characters: this frame is about the
 * numbers the slice lands on. 1, 3, 5, 7 are landed on; 8 is the stop, drawn
 * dashed in the stop's colour, because the slice stops before it.
 */
const START = colors.brandDark
const STOP = '#C2185B'
const STEP = '#7C3AED'

const W = 62
const GAP = 12
const cx = (i: number) => i * (W + GAP) + W / 2

export function ExtendedSlicing() {
  const hops = [1, 3, 5]
  const head = `hop-head-${useId().replace(/:/g, '')}`
  return (
    <RevealGroup className="mx-auto flex flex-col items-center" stagger={0.18}>
      <Reveal dir="up">
        <p className="font-mono text-[44px] font-semibold leading-none">
          <span style={{ color: colors.ink }}>variable</span>
          <span style={{ color: colors.muted }}>[</span>
          <span style={{ color: START }}>start_index</span>
          <span style={{ color: colors.muted }}>:</span>
          <span style={{ color: STOP }}>end_index</span>
          <span style={{ color: colors.muted }}>:</span>
          <span style={{ color: STEP }}>step</span>
          <span style={{ color: colors.muted }}>]</span>
        </p>
      </Reveal>

      <Reveal dir="up">
        <div className="mt-6 flex items-end gap-8">
          <div className="relative" style={{ width: 9 * (W + GAP) - GAP }}>
            {/* the +2 hops: SVG for the curves only, the labels are DOM */}
            {/* Each hop leaves the right shoulder of its box and lands on the left
                shoulder of the next, so an arrowhead never touches the next hop's
                start. The head is an SVG marker oriented on the curve's own
                tangent, so it always points along the line it ends. */}
            <svg width={9 * (W + GAP)} height={62} className="block overflow-visible" aria-hidden>
              <defs>
                <marker id={head} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto">
                  <path d="M0 0.8 L9.5 5 L0 9.2 Z" fill={STEP} strokeLinejoin="round" />
                </marker>
              </defs>
              {hops.map((i) => {
                const a = cx(i) + 12
                const b = cx(i + 2) - 12
                return (
                  <path
                    key={i}
                    d={`M${a} 58 Q ${(a + b) / 2} 2 ${b} 55`}
                    fill="none"
                    stroke={STEP}
                    strokeWidth="3"
                    strokeLinecap="round"
                    markerEnd={`url(#${head})`}
                  />
                )
              })}
            </svg>
            {hops.map((i) => (
              <span
                key={i}
                className="absolute font-mono text-[18px] font-bold"
                style={{ top: -14, left: (cx(i) + cx(i + 2)) / 2, transform: 'translateX(-50%)', color: STEP }}
              >
                +2
              </span>
            ))}
            <div className="flex" style={{ gap: GAP }}>
              {Array.from({ length: 9 }, (_, i) => {
                const hit = i === 1 || i === 3 || i === 5 || i === 7
                const stop = i === 8
                return (
                  <span
                    key={i}
                    className="grid h-[72px] place-items-center rounded-xl font-mono text-[34px] font-semibold"
                    style={{
                      width: W,
                      background: hit ? colors.surface2 : stop ? '#FDEBF2' : colors.white,
                      color: hit ? START : stop ? STOP : colors.muted,
                      border: `${hit ? 3 : 2}px ${stop ? 'dashed' : 'solid'} ${hit ? START : stop ? STOP : colors.line}`,
                    }}
                  >
                    {i}
                  </span>
                )
              })}
            </div>
          </div>
          <span className="rounded-card bg-white px-6 py-3 font-mono text-[34px] font-semibold shadow-card-soft ring-1 ring-line">
            <span style={{ color: colors.ink }}>[ </span>
            <span style={{ color: START }}>1</span>
            <span style={{ color: colors.ink }}> : </span>
            <span style={{ color: STOP }}>8</span>
            <span style={{ color: colors.ink }}> : </span>
            <span style={{ color: STEP }}>2</span>
            <span style={{ color: colors.ink }}> ]</span>
          </span>
        </div>
      </Reveal>

      <Reveal dir="up">
        <div className="mt-8 flex gap-5">
          {[
            { name: 'start_index', text: 'Where the slice begins', c: START },
            { name: 'end_index', text: 'It stops before this one', c: STOP },
            { name: 'step', text: 'How far each jump goes', c: STEP },
          ].map((p) => (
            <div key={p.name} className="w-[270px] rounded-card bg-white px-5 py-4 shadow-card-soft ring-1 ring-line">
              <p className="font-mono text-[22px] font-bold" style={{ color: p.c }}>{p.name}</p>
              <p className="mt-1 text-[19px]" style={{ color: colors.body }}>{p.text}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </RevealGroup>
  )
}
