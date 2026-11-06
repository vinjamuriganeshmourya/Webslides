import type { CSSProperties, ReactNode } from 'react'
import * as Lucide from 'lucide-react'
import { CvIcon } from '@/decks/figures/net/fx'
import type { IconRef } from './types'

/**
 * AN ICON BY NAME, FROM DATA. Three sources, one string:
 *   "Shield"            a lucide icon (PascalCase name)
 *   "lib:server-stack"  a 3D library render in `src/decks/figures/net/icons/` (R7.1 people live here too)
 *   "img:<url>"         an image of the session's own (the build turns `images/x.png` into its URL)
 * An unknown name renders nothing and warns once, so a typo is visible in the console, not a crash.
 */
const warned = new Set<string>()
export function Icon({ name, size = 18, className = '', style }: { name?: IconRef; size?: number; className?: string; style?: CSSProperties }): ReactNode {
  if (!name) return null
  if (name.startsWith('lib:')) return <CvIcon name={name.slice(4)} w={size} className={className} style={style} />
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
  const parts = text.split(/(`[^`]+`)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('`') && p.endsWith('`') ? (
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
