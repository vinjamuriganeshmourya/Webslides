import { useEffect, useRef, useState, type ReactNode } from 'react'
import { SLIDE_WIDTH, SLIDE_HEIGHT } from '@/design/tokens'

/**
 * Fits the fixed 1280×720 slide canvas into whatever space is available,
 * preserving the 16:9 aspect ratio (letterboxed). Every slide is authored
 * at exact 1280×720 px so layouts are pixel-deterministic — this component
 * just scales the whole thing to the viewport.
 */
export function SlideStage({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const compute = () => {
      const { width, height } = el.getBoundingClientRect()
      setScale(Math.min(width / SLIDE_WIDTH, height / SLIDE_HEIGHT))
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={wrapRef}
      className="grid h-full w-full place-items-center"
      style={{ perspective: 2000 }}
    >
      <div
        style={{
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
        className="relative shrink-0"
      >
        {children}
      </div>
    </div>
  )
}
