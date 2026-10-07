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

/* INPUT is blue, OUTPUT is green. `out` used to be `colors.danger`, which was
   survivable while the tone was a 2px dot and became a lie the moment it tinted
   the whole header: a correct run's output sat under a red bar that reads as an
   error. Blue is the value you hand the program, green is what it handed back. */
const TONE = { in: colors.brand, out: colors.success } as const

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
            <div
              className="overflow-hidden rounded-card border border-line bg-white"
              style={{ boxShadow: '0 1px 2px rgba(16,32,58,0.07), 0 6px 14px -6px rgba(16,32,58,0.13)' }}
            >
              {/* THE HEADER CARRIES THE PANEL'S OWN TINT, not one neutral grey
                  for both. INPUT and OUTPUT are the two ends of the same run
                  and the room has to tell them apart at a glance from the back;
                  a 2px dot was doing all of that work. */}
              <div
                className="flex items-center gap-2.5 border-b border-line px-4 py-2.5"
                style={{ background: `${paint}14` }}
              >
                <span className="inline-block h-3 w-3 rounded-full" style={{ background: paint }} />
                <span
                  className="font-heading text-body font-bold uppercase tracking-wider"
                  style={{ color: colors.body }}
                >
                  {p.label}
                </span>
              </div>
              <div className="px-4 py-3.5">
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
