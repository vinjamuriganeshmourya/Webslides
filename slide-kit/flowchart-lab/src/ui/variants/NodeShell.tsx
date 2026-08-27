import { useId, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { iconByName } from '@/ui/icons'
import { E, c4 } from '@/ui/figureTiming'
import type { FcNode } from './flowchartFigure'

/**
 * ONE CARD, ONE PADDING SCALE, ONE HOVER, FOR EVERY VARIANT.
 *
 * Three variants were each growing their own copy of the card chrome, and the
 * padding had already drifted between them by the second one. Six figures that
 * differ in geometry must not also differ in how much air is inside a box, or
 * the comparison measures the padding instead of the design.
 *
 * THE PADDING SCALE, STATED ONCE
 *
 * | Slot        | Padding      | Why                                          |
 * |-------------|--------------|----------------------------------------------|
 * | card, x     | 16px         | the label can reach 2 lines and still breathe |
 * | card, y     | 12px         | with 76 to 92px slots, keeps text off the rule |
 * | icon to text| 10px         | one step below the text's own leading         |
 * | label to caption | 4px     | they are one unit; more reads as two          |
 * | popover     | 14px / 12px  | denser than a card: it is an aside, not a step |
 *
 * Nothing here uses an arbitrary value. If a variant needs different air, it is
 * saying its slot is the wrong size, and the slot is the thing to change.
 *
 * WHY HOVER IS A DIFFERENT TIER FROM THE FIGURE'S ENTRANCE
 *
 * The figure assembles at the EXPLANATORY tier: 520ms entrances, because it is
 * read once from the back of a room. A hover is the opposite case. The presenter
 * triggers it deliberately, repeatedly, and is waiting for the answer, so it is
 * squarely in the `animate` skill's UI tier and takes UI numbers: 160ms for the
 * lift, 180ms for the popover. Reusing the figure's 520ms here would feel broken,
 * and it is the mistake to avoid when a slide gains an interaction.
 *
 * Two consequences, both deliberate:
 *
 *   - **The lift is a CSS transition, not framer.** It is interruptible, it
 *     retargets from wherever it is when the pointer leaves, and it runs off the
 *     main thread. Keyframes and JS both restart from zero on a fast in-out.
 *     `.fc-node` in `index.css` owns it, gated behind
 *     `@media (hover: hover) and (pointer: fine)` so a touch device does not fire
 *     a false hover on tap.
 *   - **The popover is framer**, because it mounts and unmounts and needs an exit.
 *
 * THE POPOVER IS NEVER IN THE DOM UNLESS IT IS OPEN
 *
 * `qa.mjs`, `video-safe.mjs` and `align-check.mjs` measure static DOM rectangles.
 * A detail panel parked at `opacity: 0` would be measured, would be reported as
 * overflowing the frame or intruding on the instructor-video rectangle, and would
 * be wrong every time. `AnimatePresence` keeps it out of the tree entirely until
 * a pointer is on the node.
 *
 * It also means the slide is complete without it. The room cannot hover a
 * projector, so `detail` is an aside for the presenter and never the teaching.
 */

export type NodeLook = 'step' | 'terminal' | 'decision'

export function lookOf(node: FcNode): NodeLook {
  if (node.kind === 'start' || node.kind === 'end') return 'terminal'
  if (node.kind === 'decision') return 'decision'
  return 'step'
}

/** Where the popover sits relative to the node it explains. */
type Side = 'top' | 'bottom'

export function NodeShell({
  node,
  look,
  paint,
  /** `row` puts the icon beside the text; `stack` puts it above. */
  layout = 'stack',
  /**
   * The silhouette. `card` is the house rounded rectangle; `pill` and `diamond`
   * exist for `CircuitMap`, which argues for the classic notation. Kept here
   * rather than in that variant so hover, padding and the detail popover behave
   * identically whatever shape a variant chooses.
   */
  shape = 'card',
  side = 'top',
  className = '',
  children,
}: {
  node: FcNode
  look: NodeLook
  paint: string
  layout?: 'row' | 'stack'
  shape?: 'card' | 'pill' | 'diamond'
  side?: Side
  className?: string
  /** Replaces the default body entirely, for a variant with its own shape. */
  children?: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const id = useId()
  const Icon = node.icon ? iconByName[node.icon as keyof typeof iconByName] : null
  const filled = look === 'terminal'
  const decision = look === 'decision'
  const hasDetail = Boolean(node.detail)

  const radius =
    shape === 'pill' ? 'rounded-pill' : shape === 'diamond' ? 'rounded-lg' : 'rounded-card'
  const chrome = filled
    ? `${radius} shadow-card`
    : decision
      ? `${shape === 'diamond' ? 'rounded-lg' : 'rounded-xl2'} shadow-card-soft`
      : `${radius} border border-line bg-white shadow-card-soft`

  return (
    <div
      className={`relative h-full w-full ${className}`}
      onPointerEnter={() => hasDetail && setOpen(true)}
      onPointerLeave={() => setOpen(false)}
    >
      <div
        className={`fc-node flex h-full w-full ${
          shape === 'diamond' ? 'rotate-45 px-2 py-2' : 'px-4 py-3'
        } ${chrome} ${
          layout === 'row' ? 'items-center gap-2.5' : 'flex-col items-center justify-center gap-1 text-center'
        } ${hasDetail ? 'fc-node--hoverable' : ''}`}
        style={
          filled
            ? { background: paint }
            : decision
              ? { background: `${paint}12`, border: `2px solid ${paint}` }
              : undefined
        }
        aria-describedby={open ? id : undefined}
      >
        {children ?? (
          <span
            className={
              shape === 'diamond'
                ? '-rotate-45 flex flex-col items-center gap-1 px-1 text-center'
                : 'contents'
            }
          >
            {Icon && (
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                style={
                  filled
                    ? { background: 'rgba(255,255,255,0.22)', color: '#FFFFFF' }
                    : { background: `${paint}18`, color: paint }
                }
              >
                <Icon width={15} height={15} />
              </span>
            )}
            <span className={layout === 'row' ? 'min-w-0' : ''}>
              <span
                className="block font-heading text-[15px] font-bold leading-tight"
                style={{ color: filled ? '#FFFFFF' : decision ? paint : colors.ink }}
              >
                {node.label}
              </span>
              {node.caption && (
                <span
                  className="mt-1 block text-[11.5px] leading-snug"
                  style={{ color: filled ? 'rgba(255,255,255,0.82)' : colors.body }}
                >
                  {node.caption}
                </span>
              )}
            </span>
          </span>
        )}

        {/* A hover affordance the room can see without a pointer: a small dot
            saying this node has more behind it. Without it, the detail is a
            secret only the person holding the mouse knows exists. */}
        {hasDetail && (
          <span
            aria-hidden
            className="fc-node__more absolute right-2 top-2 h-1.5 w-1.5 rounded-full"
            style={{ background: filled ? 'rgba(255,255,255,0.55)' : `${paint}66` }}
          />
        )}
      </div>

      <AnimatePresence>
        {open && node.detail && (
          <motion.span
            id={id}
            role="tooltip"
            className="pointer-events-none absolute left-1/2 z-30 block w-[268px] rounded-card border border-line bg-white px-3.5 py-3 text-left text-[12.5px] leading-snug shadow-float"
            style={{
              color: colors.body,
              [side === 'top' ? 'bottom' : 'top']: 'calc(100% + 10px)',
              /* Scales from the edge nearest the node, so it reads as coming OUT
                 of the node rather than appearing beside it. The `animate`
                 skill's origin-aware rule; modals are the exception, not this. */
              transformOrigin: side === 'top' ? 'bottom center' : 'top center',
            }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateX(-50%) scale(0.96)' }}
            animate={{ opacity: 1, transform: 'translateX(-50%) scale(1)' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateX(-50%) scale(0.98)' }}
            transition={{ duration: 0.18, ease: c4(E.out) }}
          >
            <span
              className="mb-1 block font-heading text-[11px] font-bold uppercase tracking-wide"
              style={{ color: paint }}
            >
              {node.label}
            </span>
            {node.detail}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
