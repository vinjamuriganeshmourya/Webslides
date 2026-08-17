import type { ReactNode } from 'react'
import { Step } from '@/motion/Stepper'
import { accentByTone, type Tone } from '@/design/tokens'
import { iconByName, type IconName } from './icons'

/* ------------------------------------------------------------------ */
/* BulletList — staggered, iconed list                                 */
/* ------------------------------------------------------------------ */

export interface BulletItem {
  text: ReactNode
  sub?: ReactNode
  icon?: IconName
  tone?: Tone
}

export function BulletList({
  items,
  tone = 'brand',
  marker = 'check',
  className = '',
  onDark = false,
}: {
  items: (BulletItem | string)[]
  tone?: Tone
  marker?: IconName
  className?: string
  onDark?: boolean
}) {
  return (
    <ul className={`space-y-4 ${className}`}>
      {items.map((raw, i) => {
        const item: BulletItem = typeof raw === 'string' ? { text: raw } : raw
        const t = item.tone ?? tone
        const color = accentByTone[t]
        const Icon = iconByName[item.icon ?? marker]
        return (
          <Step as="li" dir="up" key={i} className="flex items-start gap-4">
            <span
              className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl"
              style={{ background: `${color}1a`, color }}
            >
              <Icon width={18} height={18} />
            </span>
            <span className="pt-0.5">
              <span
                className={`block text-body-lg font-medium ${onDark ? 'text-white' : 'text-ink'}`}
              >
                {item.text}
              </span>
              {item.sub && (
                <span className={`mt-0.5 block text-body-sm ${onDark ? 'text-white/70' : 'text-body'}`}>
                  {item.sub}
                </span>
              )}
            </span>
          </Step>
        )
      })}
    </ul>
  )
}

/* ------------------------------------------------------------------ */
/* Card — surface tile with optional icon/title                        */
/* ------------------------------------------------------------------ */

export function Card({
  icon,
  title,
  children,
  tone = 'brand',
  className = '',
}: {
  icon?: IconName
  title?: ReactNode
  children?: ReactNode
  tone?: Tone
  className?: string
}) {
  const color = accentByTone[tone]
  const Icon = icon ? iconByName[icon] : null
  return (
    <div
      className={`rounded-card border border-line bg-white p-6 shadow-card-soft ${className}`}
    >
      {Icon && (
        <span
          className="mb-4 grid h-12 w-12 place-items-center rounded-2xl"
          style={{ background: `${color}14`, color }}
        >
          <Icon width={24} height={24} />
        </span>
      )}
      {title && <h3 className="mb-1.5 font-heading text-xl font-bold text-ink">{title}</h3>}
      {children && <div className="text-body">{children}</div>}
    </div>
  )
}

/** Grid of cards that reveals with stagger. */
export function CardGrid({
  cols = 3,
  className = '',
  children,
}: {
  cols?: 2 | 3 | 4
  className?: string
  children: ReactNode
}) {
  const gridCols = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }[cols]
  return (
    <div className={`grid ${gridCols} gap-5 ${className}`}>
      {Array.isArray(children)
        ? children.map((c, i) => (
            <Step dir="up" key={i}>
              {c}
            </Step>
          ))
        : children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* StatTile — big metric                                               */
/* ------------------------------------------------------------------ */

export function StatTile({
  value,
  label,
  tone = 'brand',
}: {
  value: ReactNode
  label: ReactNode
  tone?: Tone
}) {
  const color = accentByTone[tone]
  return (
    <div className="rounded-card border border-line bg-white p-6 text-center shadow-card-soft">
      <div className="font-heading text-5xl font-extrabold" style={{ color }}>
        {value}
      </div>
      <div className="mt-1 text-body-sm font-medium text-body">{label}</div>
    </div>
  )
}
