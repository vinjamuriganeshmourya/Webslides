import { useState } from 'react'
import { colors } from '@/design/tokens'

/**
 * A CODE PANEL WITH BLANKS THE INSTRUCTOR CAN ACTUALLY TYPE INTO.
 *
 * WHY NOT UNDERSCORES. Worksheet task 3 asks the room to write the loop line,
 * and the frame showed `___________________________`. A run of underscores is a
 * picture of a blank: nothing can go in it, so when the room calls out an answer
 * the instructor has to say it back rather than put it on the wall, and the two
 * blanks can never be seen to agree. These are real inputs, so an answer taken
 * from the room is typed in front of them and the whole card becomes the check
 * it was written to be.
 *
 * THE TWO BLANKS HAVE TO AGREE, which is the point of the task, so they are
 * sized from the answer they expect rather than stretched to fill the line.
 *
 * DOM, never SVG (content rule 17). Colours from tokens. The panel matches
 * `CodeBlock`'s chrome so a slide carrying both does not show two kinds of
 * code panel.
 */

const PANEL = '#111A2E'

export interface CodeLine {
  /** Text before the blank. */
  before: string
  /** Characters wide, sized to the answer this blank expects. */
  blank?: number
  /** Text after the blank. */
  after?: string
  placeholder?: string
}

export function FillableCode({
  lines,
  filename = 'Python',
  fontSize = 17,
  className = '',
}: {
  lines: CodeLine[]
  filename?: string
  fontSize?: number
  className?: string
}) {
  const [values, setValues] = useState<Record<number, string>>({})

  return (
    <div className={`overflow-hidden rounded-card shadow-card ${className}`} style={{ background: PANEL }}>
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        <span className="ml-auto rounded-pill bg-white/10 px-2 py-0.5 font-mono text-xs uppercase tracking-wide text-white/50">
          {filename}
        </span>
      </div>

      <div className="px-5 py-4 font-mono" style={{ fontSize, lineHeight: 1.85 }}>
        {lines.map((l, i) => (
          <div key={i} className="flex items-center whitespace-pre text-white/90">
            <span className="select-none pr-4 text-white/25">{i + 1}</span>
            <span>{l.before}</span>
            {l.blank !== undefined && (
              <input
                aria-label={`blank on line ${i + 1}`}
                value={values[i] ?? ''}
                placeholder={l.placeholder ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [i]: e.target.value }))}
                spellCheck={false}
                className="mx-1 rounded-md border-2 border-dashed bg-transparent px-2 text-center font-mono outline-none"
                style={{
                  width: `${l.blank}ch`,
                  fontSize,
                  borderColor: values[i] ? colors.success : 'rgba(255,255,255,0.35)',
                  color: colors.white,
                }}
              />
            )}
            {l.after && <span>{l.after}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
