import type { ReactNode } from 'react'

/**
 * A FIGURE DRAWN AT A FIXED SIZE, SHOWN SMALLER.
 *
 * `RegionMap`, `Meter` and `PlaceLadder` are built at one size each and have
 * no width prop. Where this deck puts one beside a capture, in a card or in a
 * recap row, it is scaled with a transform inside a box of the scaled size, so
 * layout sees the small box and the figure keeps its proportions. Nothing goes
 * below 0.45 here: a 17 px label at 0.45 is under 8 px and unreadable.
 */
export function Scaled({ w, h, scale, children, className = '' }: { w: number; h: number; scale: number; children: ReactNode; className?: string }) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: Math.round(w * scale), height: Math.round(h * scale) }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: w, height: h, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  )
}
