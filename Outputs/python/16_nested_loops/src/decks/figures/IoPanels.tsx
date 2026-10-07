import { colors } from '@/design/tokens'
import { RevealGroup, Reveal } from '@/motion/Reveal'

/**
 * WHAT GOES IN, AND WHAT SHOULD COME OUT: two labelled literal panels.
 *
 * Session 14's `IoPanels`, carried over. The reference draws these on every
 * problem frame and every wrong-iteration frame, and they are the only two
 * facts those frames carry. `CodeOutput` cannot render them, and deliberately
 * so: its output panel is headed `Output` because everything it shows is a real
 * run (course rule R3). These frames need an INPUT the room is to assume, and
 * on Wrong Iteration the panel shows what the buggy program really printed, so
 * the heading is a prop and the call site says which it is.
 *
 * `row` lays the panels side by side (PF 16 puts INPUT beside OUTPUT on every
 * question frame); the default is session 14's column.
 */
export interface IoPanel {
  label: string
  text: string
  tone?: 'in' | 'out'
}

/* Blue is the value you hand the program, green is what it handed back. */
const TONE = { in: colors.brand, out: colors.success } as const

export function IoPanels({ panels, fontSize = 20, row = false, className = '' }: { panels: IoPanel[]; fontSize?: number; row?: boolean; className?: string }) {
  return (
    <RevealGroup className={`flex ${row ? 'flex-row items-start' : 'flex-col'} gap-5 ${className}`} stagger={0.1}>
      {panels.map((p, i) => {
        const paint = TONE[p.tone ?? (i === 0 ? 'in' : 'out')]
        return (
          <Reveal key={p.label} dir="up">
            <div className="min-w-[150px] overflow-hidden rounded-card border border-line bg-white" style={{ boxShadow: '0 1px 2px rgba(16,32,58,0.07), 0 6px 14px -6px rgba(16,32,58,0.13)' }}>
              <div className="flex items-center gap-2.5 border-b border-line px-4 py-2" style={{ background: `${paint}14` }}>
                <span className="inline-block h-3 w-3 rounded-full" style={{ background: paint }} />
                <span className="font-heading text-[16px] font-bold uppercase tracking-wider" style={{ color: colors.body }}>
                  {p.label}
                </span>
              </div>
              <div className="px-4 py-3">
                {p.text.replace(/\n$/, '').split('\n').map((line, j) => (
                  <div key={j} className="whitespace-pre font-mono leading-relaxed" style={{ fontSize, color: colors.ink }}>
                    {line || ' '}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )
      })}
    </RevealGroup>
  )
}
