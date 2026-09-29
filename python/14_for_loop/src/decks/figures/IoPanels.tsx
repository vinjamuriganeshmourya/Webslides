import { colors } from '@/design/tokens'
import { RevealGroup, Reveal } from '@/motion/Reveal'

/**
 * WHAT GOES IN, AND WHAT SHOULD COME OUT: two labelled literal panels.
 *
 * The reference deck draws these on every problem frame and every
 * identify-the-mistake frame, and they are the only two facts those frames
 * carry. `CodeOutput` cannot render them, and deliberately so: its output panel
 * is headed `Output` in the component, because everything it shows is a real run
 * (course rule R3). These frames need two things it cannot say.
 *
 * ONE, AN INPUT. `a = input()` is meaningless without the value the room is to
 * assume; "wrong input" is the first thing a learner blames when a trace does
 * not match.
 *
 * TWO, AN **EXPECTED** OUTPUT. On `Identify the Mistake` the program does NOT
 * print what the panel shows, which is the entire exercise. Rendering that
 * through a component whose panel is headed `Output` would state, in the chrome,
 * that the buggy program printed the right answer. So the heading is a prop, the
 * call site writes `Expected output`, and R3 is kept honestly: nothing here
 * claims to be a run unless it is one.
 *
 * ONE `<div>` PER LINE, EACH `whitespace-pre`. `CodeOutput`'s own panel records
 * why: `align-check.mjs` divides a text block's height by its line-height to
 * spot a wrapped token, and a six-line `<pre>` reads as one token wrapped six
 * times. The trailing space on each row of the star pattern is real output and
 * survives because nothing here re-wraps.
 */

export interface IoPanel {
  /** `Input`, `Output`, `Expected output`. Says what the panel IS. */
  label: string
  /** Exactly the characters, newlines included. Never composed prose. */
  text: string
  /** Green for what goes in, red for what comes out. The reference's own pair. */
  tone?: 'in' | 'out'
}

const TONE = { in: colors.success, out: colors.danger } as const

export function IoPanels({
  panels,
  fontSize = 17,
  className = '',
}: {
  panels: IoPanel[]
  fontSize?: number
  className?: string
}) {
  return (
    <RevealGroup className={`flex flex-col gap-5 ${className}`} stagger={0.1}>
      {panels.map((p, i) => {
        const paint = TONE[p.tone ?? (i === 0 ? 'in' : 'out')]
        return (
          <Reveal key={p.label} dir="up">
            <div className="overflow-hidden rounded-card border border-line bg-white shadow-card-soft">
              <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-2">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: paint }} />
                <span className="font-heading text-body-sm font-bold uppercase tracking-wider text-body">
                  {p.label}
                </span>
              </div>
              <div className="px-4 py-3">
                {p.text.replace(/\n$/, '').split('\n').map((line, j) => (
                  <div
                    key={j}
                    className="whitespace-pre font-mono leading-relaxed"
                    style={{ fontSize, color: colors.ink }}
                  >
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
