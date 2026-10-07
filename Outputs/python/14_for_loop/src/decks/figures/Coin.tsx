/* A coin with a body, not a yellow circle.
 *
 * DOM, NOT SVG (content rule 17): a coin on these frames always carries an
 * amount, and anything with a label is a real element.
 *
 * WHAT MAKES IT READ AS METAL, in the order light does it:
 *   1. an off-centre radial gradient, so the lit side is up and to the left
 *   2. a struck rim, drawn as an inset ring rather than a border, so the edge
 *      catches light on top and goes dark underneath
 *   3. one specular highlight, small and soft
 *   4. a contact shadow on the ground, tight and dark, not a blur halo
 *
 * The face colour is a warm brown rather than the deck's ink: black on gold
 * reads as a printed token, brown as struck metal.
 */
import type { ReactNode } from 'react'

export function Coin({
  children,
  size = 44,
  dim = false,
  className = '',
}: {
  children: ReactNode
  size?: number
  /** A coin that has not been earned yet: the metal goes to grey. */
  dim?: boolean
  className?: string
}) {
  const face = dim ? '#8A94A2' : '#6B4A05'
  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: dim
          ? 'radial-gradient(circle at 32% 26%, #F2F5F9 0%, #DBE2EA 48%, #B7C1CD 100%)'
          : 'radial-gradient(circle at 32% 26%, #FFEFBA 0%, #FBC63F 42%, #E09C00 74%, #B87A00 100%)',
        boxShadow: dim
          ? 'inset 0 -2px 3px rgba(40,55,75,0.22), inset 0 2px 3px rgba(255,255,255,0.8), 0 2px 3px rgba(20,35,60,0.18)'
          : 'inset 0 -2.5px 4px rgba(120,70,0,0.45), inset 0 2px 3px rgba(255,255,255,0.65), 0 2px 4px rgba(90,55,0,0.35)',
      }}
    >
      {/* The struck rim. Inset so it reads as part of the disc's thickness
          rather than as an outline drawn round it. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[3px] rounded-full"
        style={{
          boxShadow: dim
            ? 'inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(40,55,75,0.25)'
            : 'inset 0 1px 1px rgba(255,248,214,0.9), inset 0 -1px 1px rgba(120,70,0,0.5)',
        }}
      />
      {/* One highlight, up and to the left, matching the gradient's light. */}
      <span
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{
          width: size * 0.34,
          height: size * 0.2,
          left: size * 0.16,
          top: size * 0.14,
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 70%)',
          transform: 'rotate(-20deg)',
        }}
      />
      <span
        className="relative font-heading font-bold leading-none"
        style={{ fontSize: Math.round(size * 0.38), color: face }}
      >
        {children}
      </span>
    </span>
  )
}
