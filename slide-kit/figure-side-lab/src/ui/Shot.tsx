/**
 * A real screen capture, framed for a slide.
 *
 * Hard rule 11: a raw capture is evidence, not a slide asset. Crop before it
 * gets here, keep the context that carries meaning (a terminal keeps its
 * `PS <path>>` prompt, a browser keeps its address bar), and never retouch the
 * pixels: if a capture is wrong, re-run the command and capture again.
 *
 * The `highlight` prop is deliberately optional and deliberately singular.
 * Cropping is mandatory, boxing is not. A deck where every capture wears a box
 * teaches the learner to ignore boxes, so add one only when the crop alone does
 * not put the claim under the eye, and only ever one per capture.
 */

import type { ReactNode } from 'react'

export interface ShotHighlight {
  /** Box position as a percentage of the image, so it survives any render size. */
  left: number
  top: number
  width: number
  height: number
  /** Optional label placed just below the box. */
  label?: ReactNode
}

export function Shot({
  src,
  alt,
  caption,
  highlight,
  className = '',
}: {
  src: string
  alt: string
  /** What the learner is looking at. Not a repeat of the slide title. */
  caption?: ReactNode
  highlight?: ShotHighlight
  className?: string
}) {
  return (
    <figure className={`m-0 ${className}`}>
      <div className="relative overflow-hidden rounded-card shadow-card ring-1 ring-black/10">
        <img src={src} alt={alt} draggable={false} className="block h-auto w-full select-none" />

        {highlight && (
          <>
            {/* The box. Amber reads as "look here" on both light and dark captures
                and does not collide with the deck's blue or with terminal green. */}
            <span
              aria-hidden
              className="pointer-events-none absolute rounded-[4px]"
              style={{
                left: `${highlight.left}%`,
                top: `${highlight.top}%`,
                width: `${highlight.width}%`,
                height: `${highlight.height}%`,
                border: '3px solid #F59E0B',
                boxShadow: '0 0 0 3px rgba(245,158,11,0.28)',
              }}
            />
            {highlight.label && (
              <span
                aria-hidden
                className="pointer-events-none absolute whitespace-nowrap rounded-full px-3 py-1 font-mono"
                style={{
                  left: `${highlight.left}%`,
                  top: `calc(${highlight.top + highlight.height}% + 8px)`,
                  fontSize: 13,
                  color: '#7C3E00',
                  background: '#FDE68A',
                }}
              >
                {highlight.label}
              </span>
            )}
          </>
        )}
      </div>

      {caption && (
        <figcaption className="mt-2 text-center text-[13px] leading-snug text-ink-soft">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
