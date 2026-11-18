import type { CSSProperties, ReactNode } from 'react'
import * as Lucide from 'lucide-react'
import { CvIcon } from '@/decks/figures/net/fx'
import type { IconRef, TableCell } from './types'
import { STILL } from '@/decks/figures/scene'
import { Ico3D, type Ico3DName } from './icons3d'
const STILL_CLS = STILL ? 'grid place-items-center' : 'cvx-ticon grid place-items-center'

/**
 * AN ICON BY NAME, FROM DATA. Three sources, one string:
 *   "Shield"            a lucide icon (PascalCase name)
 *   "lib:server-stack"  a 3D library render in `src/decks/figures/net/icons/` (R7.1 people live here too)
 *   "img:<url>"         an image of the session's own (the build turns `images/x.png` into its URL)
 *   "i3d:<name>"        a glossy 3D icon from `./icons3d` (standing correction 17), drawn 1.4x the size asked for so
 *                       it fills the same tile a line icon sits in; its quiet bob runs on its own span (a table's
 *                       float wraps it, both transform-only)
 * An unknown name renders nothing and warns once, so a typo is visible in the console, not a crash.
 */
const warned = new Set<string>()
export function Icon({ name, size = 18, className = '', style }: { name?: IconRef; size?: number; className?: string; style?: CSSProperties }): ReactNode {
  if (!name) return null
  if (name.startsWith('lib:')) return <CvIcon name={name.slice(4)} w={size} className={className} style={style} />
  if (name.startsWith('i3d:')) return <Ico3D name={name.slice(4) as Ico3DName} size={Math.round(size * 1.4)} loop="bob" style={style} />
  if (name.startsWith('img:')) return <img src={name.slice(4)} alt="" aria-hidden draggable={false} className={`block h-auto select-none ${className}`} style={{ width: size, ...style }} />
  const L = (Lucide as unknown as Record<string, (p: { size?: number; className?: string; style?: CSSProperties; 'aria-hidden'?: boolean }) => ReactNode>)[name]
  if (!L) {
    if (!warned.has(name)) {
      warned.add(name)
      console.warn(`[deck] unknown icon "${name}"`)
    }
    return null
  }
  return <L size={size} className={className} style={style} aria-hidden />
}

/** A string with `backtick` spans rendered in mono (identifiers, CIDRs, commands). */
export function Rich({ text }: { text: string }): ReactNode {
  // `code` is a code chip; [[words]] is a phrase the TR asks to highlight (Session 16 TR 14: "highlight the 0.0.0.0/0
  // cell and the 'left active' cell in red"), ringed in the template orange (rule 51), never recoloured text (rule 55)
  const parts = text.split(/(`[^`]+`|\[\[[^\]]+\]\])/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('[[') && p.endsWith(']]') ? (
          <span key={i} data-mark="ring" className="rounded-[6px] px-1 py-[1px]" style={{ boxShadow: 'inset 0 0 0 2px #FF8A3D', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>
            <Rich text={p.slice(2, -2)} />
          </span>
        ) : p.startsWith('`') && p.endsWith('`') ? (
          <code key={i} className="rounded-[6px] px-1.5 py-[1px] font-mono text-[0.92em]" style={{ background: '#EEF3FF', color: '#1D3FD6' }}>
            {p.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

/** A table cell from data: plain words, or words after a row of official marks, with an optional owner tint (Session 12). */
export function cellNode(c: string | TableCell, key: number): ReactNode {
  if (typeof c === 'string') return <Rich key={key} text={c} />
  if (!c.icons?.length) return <Rich key={key} text={c.text} />
  return (
    <span key={key} className="flex items-center gap-2.5">
      <span className="flex shrink-0 items-center gap-1.5">
        {c.icons.map((ic, i) => (
          <span key={i} aria-hidden className="grid h-[34px] w-[34px] place-items-center rounded-[8px] [&_img]:!h-[24px] [&_img]:!w-[24px] [&_img]:object-contain [&_svg]:h-[18px] [&_svg]:w-[18px]" style={{ background: '#FFFFFF', boxShadow: 'inset 0 0 0 1.5px #2F5BEA2e, 0 3px 8px -6px #1A3BB855' }}>
            <span className={STILL_CLS} style={{ animationDelay: `${-(key * 3 + i) * 0.45}s` }}>
              <Icon name={ic} size={24} />
            </span>
          </span>
        ))}
      </span>
      <span className="min-w-0"><Rich text={c.text} /></span>
    </span>
  )
}
export const cellTone = (c: string | TableCell) => (typeof c === 'string' ? undefined : c.tone)
