import { useEffect, useRef, useState, type ReactNode } from 'react'
import { SLIDE_WIDTH, SLIDE_HEIGHT } from '@/design/tokens'

/**
 * Fits the fixed 1280×720 slide canvas into whatever space is available,
 * preserving the 16:9 aspect ratio (letterboxed). Every slide is authored at
 * exact 1280×720 px so layouts are pixel-deterministic — this component just
 * scales the whole thing to the viewport.
 *
 * WHY THE CENTRING IS DONE WITH A TRANSLATE, NOT `place-items-center`
 * `transform: scale()` shrinks what you SEE, never the layout box: the inner
 * div still occupies 1280×720 no matter the scale. Inside a centred grid that
 * is fine while the container is bigger than the canvas — but the moment it is
 * smaller (any window or IFRAME under 1280×720) the item overflows, and CSS
 * alignment then falls back to `start` rather than letting content spill off
 * the top-left. The slide ended up pinned to the container's left edge with the
 * scaled result hanging off the right, which reads as a black bar down one side
 * and a cropped slide down the other.
 *
 * Absolute positioning plus `translate(-50%, -50%)` centres by the element's
 * OWN size, so it stays centred whether the container is larger or smaller.
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
      className="relative h-full w-full overflow-hidden"
      style={{ perspective: 2000 }}
    >
      <div
        /*
          NAMED so tooling can find the slide's own coordinate system.

          This is the box that is exactly SLIDE_WIDTH x SLIDE_HEIGHT, and its
          `getBoundingClientRect()` therefore carries the current scale. The review
          app converts a click into slide coordinates against this rect, the same
          way `AnnotationLayer` converts a pen stroke — a comment pinned at
          "x 820, y 300" means the same place on a laptop and on a projector.
        */
        data-slide-stage=""
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          /* translate first (by the element's own 1280×720), then scale about
             that centre — the order the browser applies these in is right to
             left, so the centring is unaffected by the scale factor. */
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
        }}
        className="relative"
      >
        {children}
      </div>
    </div>
  )
}
