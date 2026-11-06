import type { ComponentType, ReactNode } from 'react'
import { BigVpc, VpcScene } from '@/decks/figures/net/frames'
import { VisualTable } from '@/decks/figures/net/vtable'
import { figures as customFigures } from '@custom'
import { Diagram, diagramSteps } from './Diagram'
import { Icon, Rich } from './icon'
import type { Figure } from './types'

/**
 * A FIGURE FROM DATA. `diagram` (the generic parts renderer), `image`, `table`,
 * `kit` (a course drawing the engine already has, by name) or `custom` (the
 * session's own one-off figure). Every figure gets the slide's `step`.
 */

/** the course kits: drawings that recur across a course, set by props. Add a new one here once, reuse it everywhere. */
const KIT: Record<string, ComponentType<Record<string, unknown>>> = {
  BigVpc: BigVpc as unknown as ComponentType<Record<string, unknown>>,
  VpcScene: VpcScene as unknown as ComponentType<Record<string, unknown>>,
}

/** how many presses the figure builds over (0 = shown whole) */
export function figureSteps(f: Figure): number {
  if (f.type === 'diagram') return diagramSteps(f)
  if (f.type === 'table') return f.rows.length
  const p = (f as { props?: { steps?: number } }).props
  return typeof p?.steps === 'number' ? p.steps : 0
}

export function FigureView({ fig, step, w, h }: { fig: Figure; step: number; w?: number; h?: number }): ReactNode {
  switch (fig.type) {
    case 'diagram':
      return <Diagram spec={fig} step={step} />
    case 'image':
      return <img src={fig.src} alt={fig.alt ?? ''} draggable={false} className="block select-none" style={{ width: fig.w ?? w ?? '100%', height: fig.h ?? 'auto', margin: '0 auto' }} />
    case 'table':
      return (
        <VisualTable
          size={fig.size ?? 16}
          shown={step}
          highlight={fig.highlight ?? []}
          columns={fig.columns.map((c) => ({ label: c.label, weight: c.weight, icon: c.icon ? <Icon name={c.icon} size={16} /> : undefined }))}
          rows={fig.rows.map((r) => ({ icon: r.icon ? <Icon name={r.icon} size={18} /> : undefined, cells: r.cells.map((c, i) => <Rich key={i} text={c} />) }))}
        />
      )
    case 'kit': {
      const K = KIT[fig.name]
      if (!K) throw new Error(`[deck] no kit figure "${fig.name}" (known: ${Object.keys(KIT).join(', ')})`)
      return <K step={step} w={w} h={h} {...(fig.props ?? {})} />
    }
    case 'custom': {
      const C = (customFigures as Record<string, ComponentType<Record<string, unknown>>>)[fig.name]
      if (!C) throw new Error(`[deck] no custom figure "${fig.name}" in custom/index.tsx`)
      return <C step={step} w={w} h={h} {...(fig.props ?? {})} />
    }
  }
}
