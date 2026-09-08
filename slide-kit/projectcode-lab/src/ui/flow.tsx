import type { ReactNode } from 'react'
import { Step } from '@/motion/Stepper'
import { accentByTone, type Tone } from '@/design/tokens'
import { iconByName, type IconName } from './icons'
import { NumberBadge } from './primitives'

/* ------------------------------------------------------------------ */
/* StepList — numbered procedure with a connecting rail                */
/* ------------------------------------------------------------------ */

export interface Step {
  title: ReactNode
  detail?: ReactNode
  icon?: IconName
  /**
   * A tail fragment of the title that claims a build step OF ITS OWN, revealed
   * one click after the row it sits in.
   *
   * For the "ask, then confirm" beat: the row states the need the room just
   * worked out ("a directory to store the files") and the next click puts the
   * concrete value beside it (`/app`). Without the second step the answer is on
   * screen before the room has been asked for it.
   */
  value?: ReactNode
}

export function StepList({
  steps,
  tone = 'brand',
  className = '',
}: {
  steps: Step[]
  tone?: Tone
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      {/* vertical rail */}
      <span
        className="absolute left-[22px] top-3 bottom-6 w-[2px] rounded-pill"
        style={{ background: `${accentByTone[tone]}33` }}
      />
      <ol className="space-y-5">
        {steps.map((s, i) => (
          <Step as="li" dir="left" key={i} className="relative flex items-start gap-5">
            <NumberBadge n={i + 1} tone={tone} className="relative z-10 h-11 w-11" />
            <div className="rounded-card border border-line bg-white px-5 py-3.5 shadow-card-soft flex-1">
              <p className="font-heading text-lg font-bold text-ink">
                {s.title}
                {/*
                  Nested inside the row's own `Step`, so it claims the NEXT step
                  number. It carries its own `animate`, which is what stops the
                  parent's variants from propagating in and revealing it early.
                  `inline-block` because framer animates a transform.
                */}
                {s.value != null && (
                  <Step as="span" dir="fade" className="ml-2 inline-block">
                    {s.value}
                  </Step>
                )}
              </p>
              {s.detail && <p className="mt-0.5 text-body">{s.detail}</p>}
            </div>
          </Step>
        ))}
      </ol>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* FlowChart — linear node → arrow → node sequence                     */
/* ------------------------------------------------------------------ */

export interface FlowNode {
  label: ReactNode
  caption?: ReactNode
  icon?: IconName
  tone?: Tone
  shape?: 'box' | 'pill' | 'diamond'
}

export function FlowChart({
  nodes,
  direction = 'horizontal',
  className = '',
}: {
  nodes: FlowNode[]
  direction?: 'horizontal' | 'vertical'
  className?: string
}) {
  const horizontal = direction === 'horizontal'
  const Arrow = iconByName.arrow

  // Flatten to a single list of direct <Reveal> children so the group
  // staggers node → arrow → node in order.
  const children: ReactNode[] = []
  nodes.forEach((n, i) => {
    const tone = n.tone ?? (['brand', 'teal', 'accent'] as Tone[])[i % 3]
    const color = accentByTone[tone]
    const Icon = n.icon ? iconByName[n.icon] : null
    const diamond = n.shape === 'diamond'
    const pill = n.shape === 'pill'
    children.push(
      <Step dir="scale" key={`n${i}`} className={horizontal ? 'flex-1' : ''}>
        <div
          className={`relative mx-auto grid place-items-center border-2 bg-white text-center shadow-card-soft ${
            diamond ? 'rotate-45 rounded-2xl' : pill ? 'rounded-pill' : 'rounded-card'
          }`}
          style={{
            borderColor: color,
            minWidth: horizontal ? 150 : 210,
            minHeight: diamond ? 128 : 92,
            padding: diamond ? 18 : '16px 20px',
          }}
        >
          <div className={diamond ? '-rotate-45' : ''}>
            {Icon && (
              <span
                className="mx-auto mb-1 grid h-9 w-9 place-items-center rounded-xl"
                style={{ background: `${color}18`, color }}
              >
                <Icon width={18} height={18} />
              </span>
            )}
            <p className="font-heading font-bold leading-tight text-ink">{n.label}</p>
            {n.caption && <p className="mt-0.5 text-body-sm text-body">{n.caption}</p>}
          </div>
        </div>
      </Step>,
    )
    if (i < nodes.length - 1) {
      children.push(
        <Step dir="fade" key={`a${i}`}>
          <span className={`grid place-items-center ${horizontal ? 'px-1' : 'py-1'}`} style={{ color }}>
            <Arrow width={26} height={26} style={{ transform: horizontal ? 'none' : 'rotate(90deg)' }} />
          </span>
        </Step>,
      )
    }
  })

  return (
    <div
      className={`flex ${horizontal ? 'flex-row items-center' : 'flex-col items-center'} ${className}`}
    >
      {children}
    </div>
  )
}
