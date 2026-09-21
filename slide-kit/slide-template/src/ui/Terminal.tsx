
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

/* Amber, the same "look here" as `Shot`'s highlight box, and a colour no
   terminal `kind` already uses: green means success and red means error, so
   neither can double as emphasis. Applied to the line box rather than the text,
   so a wrapped line marks as one block. */
const MARK = (on: boolean) =>
  on
    ? { background: 'rgba(245,158,11,0.20)', boxShadow: '0 0 0 1.5px rgba(245,158,11,0.75)', borderRadius: 4 }
    : undefined

export function Terminal({
  /** The folder the prompt sits in, e.g. `C:\ecommerce\backend`. */
  path,
  lines,
  /** Caption under the panel saying what this terminal is for. */
  caption,
  fontSize = 15,
  /**
   * Line numbers to mark, 1-based over `lines`, the same shape and the same
   * 1-based counting as `CodeBlock`'s `highlight`.
   *
   * For the one line in a transcript the room has to DO something with: a value
   * to copy, the flag that buys the behaviour. `kind: 'ok'` already colours a
   * success line green, and green among grey is not enough when the task is
   * "copy exactly this" or "this flag is the whole change".
   *
   * Keep it to one line. A panel with three marked lines has none.
   */
  highlight,
  className = '',
}: {
  path: string
  lines: TerminalLine[]
  caption?: string
  fontSize?: number
  highlight?: number[]
  className?: string
}) {
  const marked = new Set(highlight ?? [])
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
                <div key={i} className="whitespace-pre-wrap break-words" style={MARK(marked.has(i + 1))}>
                  <span style={{ color: '#5A9BD5' }}>{`PS ${path}> `}</span>
                  <span style={{ color: '#F2F2F2' }}>{l.text}</span>
                </div>
              )
            }
            return (
              <div
                key={i}
                className="whitespace-pre-wrap break-words"
                style={{ color: kind === 'ok' ? '#4EC9A0' : '#B9B9B9', ...MARK(marked.has(i + 1)) }}
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
