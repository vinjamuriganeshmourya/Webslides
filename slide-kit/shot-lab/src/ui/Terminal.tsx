
/**
 * A VS Code terminal panel.
 *
 * The kit's `CodeBlock` is a *file* view (traffic lights, a filename, line
 * numbers), which is wrong for commands: students run these in the integrated
 * terminal, and the thing they actually have to recognise is the panel tab plus
 * the prompt path telling them *which folder* they are in. So this renders the
 * VS Code chrome instead, and each command carries its real `PS <path>>` prompt.
 *
 * One `Terminal` is one terminal. Two terminals means two of these side by
 * side, never two prompts inside one panel.
 */

export interface TerminalLine {
  text: string
  /** `cmd` gets the prompt prefix; `out` is program output; `ok` is a success line. */
  kind?: 'cmd' | 'out' | 'ok'
}

const TABS = ['PROBLEMS', 'OUTPUT', 'TERMINAL']

export function Terminal({
  /** The folder the prompt sits in, e.g. `C:\ecommerce\backend`. */
  path,
  lines,
  /** Caption under the panel saying what this terminal is for. */
  caption,
  fontSize = 15,
  className = '',
}: {
  path: string
  lines: TerminalLine[]
  caption?: string
  fontSize?: number
  className?: string
}) {
  return (
    <div className={className}>
      <div className="overflow-hidden rounded-card shadow-card" style={{ background: '#1E1E1E' }}>
        {/* Panel tab strip */}
        <div className="flex items-center gap-4 px-4" style={{ background: '#252526' }}>
          {TABS.map((t) => {
            const active = t === 'TERMINAL'
            return (
              <span
                key={t}
                className="py-2 text-[11px] font-semibold tracking-wider"
                style={{
                  color: active ? '#E7E7E7' : '#8A8A8A',
                  borderBottom: `1.5px solid ${active ? '#0B5FFF' : 'transparent'}`,
                }}
              >
                {t}
              </span>
            )
          })}
          <span className="ml-auto py-2 text-[11px]" style={{ color: '#8A8A8A' }}>
            powershell
          </span>
        </div>

        {/* Body */}
        <div className="px-4 py-3.5 font-mono" style={{ fontSize, lineHeight: 1.65 }}>
          {lines.map((l, i) => {
            const kind = l.kind ?? 'out'
            if (kind === 'cmd') {
              return (
                <div key={i} className="whitespace-pre-wrap break-words">
                  <span style={{ color: '#5A9BD5' }}>{`PS ${path}> `}</span>
                  <span style={{ color: '#F2F2F2' }}>{l.text}</span>
                </div>
              )
            }
            return (
              <div
                key={i}
                className="whitespace-pre-wrap break-words"
                style={{ color: kind === 'ok' ? '#4EC9A0' : '#B9B9B9' }}
              >
                {l.text || '\u00A0'}
              </div>
            )
          })}
        </div>
      </div>
      {caption && (
        <p className="mt-2 text-center text-body-sm font-semibold text-ink">{caption}</p>
      )}
    </div>
  )
}
