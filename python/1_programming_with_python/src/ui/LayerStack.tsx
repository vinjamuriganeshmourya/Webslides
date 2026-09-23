import type { ReactNode } from 'react'
import { Step } from '@/motion/Stepper'
import { colors } from '@/design/tokens'

/**
 * A stack of the layers an application sits on — bottom-up: OS, runtime,
 * framework, your code.
 *
 * The session returns to this figure three times, so the shape is one
 * component with a per-layer `state` rather than three drawings:
 *
 *   `ships`  the layer that actually travels with a `git push` (solid brand)
 *   `host`   re-supplied by whatever machine receives it (grey, dashed)
 *   `breaks` the layer where this particular machine fails (danger tint)
 *   `shared` borrowed rather than duplicated — the kernel (teal)
 *
 * Layers are listed **top-first** so the array reads the way the figure looks.
 * Each layer is a `Step`, so the stack builds under the deck's Stepper.
 */

export type LayerState = 'ships' | 'host' | 'breaks' | 'shared'

export interface Layer {
  label: ReactNode
  /** Small right-aligned annotation — the version, or what breaks here. */
  note?: ReactNode
  state?: LayerState
}

const STATE: Record<LayerState, { bg: string; border: string; text: string; dashed?: boolean }> = {
  ships: { bg: colors.brand, border: colors.brand, text: '#FFFFFF' },
  host: { bg: '#F1F5F9', border: colors.line, text: colors.body, dashed: true },
  breaks: { bg: '#FEF2F2', border: colors.danger, text: '#991B1B' },
  shared: { bg: '#E6FAF7', border: colors.teal, text: '#0E6B63' },
}

export function LayerStack({
  title,
  caption,
  layers,
  width = 300,
  stepped = true,
  className = '',
}: {
  /** Label above the stack — the machine this stack belongs to. */
  title?: ReactNode
  /** One-line verdict under the stack. */
  caption?: ReactNode
  /** Top layer first. */
  layers: Layer[]
  width?: number
  /** False renders every layer immediately (side-by-side comparisons). */
  stepped?: boolean
  className?: string
}) {
  return (
    <div className={`flex flex-col items-center ${className}`} style={{ width }}>
      {title && (
        <p className="mb-2 font-heading text-base font-bold text-ink">{title}</p>
      )}
      <div className="flex w-full flex-col gap-1.5">
        {layers.map((l, i) => {
          const s = STATE[l.state ?? 'host']
          const box = (
            <div
              className="flex items-center justify-between gap-2 rounded-xl px-4 py-2.5"
              style={{
                background: s.bg,
                border: `2px ${s.dashed ? 'dashed' : 'solid'} ${s.border}`,
                color: s.text,
              }}
            >
              <span className="text-body-sm font-semibold leading-tight">{l.label}</span>
              {l.note && (
                <span className="shrink-0 font-mono text-xs opacity-80">{l.note}</span>
              )}
            </div>
          )
          return stepped ? (
            <Step dir="up" key={i}>
              {box}
            </Step>
          ) : (
            <div key={i}>{box}</div>
          )
        })}
      </div>
      {caption && (
        <p className="mt-2.5 text-center text-body-sm leading-snug text-body">{caption}</p>
      )}
    </div>
  )
}

/**
 * The gap the code has to cross. Sits between two `LayerStack`s and carries the
 * question the figure ends on.
 */
export function LayerGap({ label, className = '' }: { label?: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center px-3 ${className}`}>
      <svg width="52" height="26" viewBox="0 0 52 26" fill="none" aria-hidden>
        <path
          d="M2 13h44M38 6l8 7-8 7"
          stroke={colors.brand}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label && (
        <span className="mt-1 text-center text-xs font-semibold uppercase tracking-wider text-brand-600">
          {label}
        </span>
      )}
    </div>
  )
}
