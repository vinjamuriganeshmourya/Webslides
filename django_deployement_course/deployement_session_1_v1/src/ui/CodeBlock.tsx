import { Fragment } from 'react'

/**
 * Lightweight, dependency-free code panel with a title bar and a conservative
 * syntax highlighter (comments, strings, numbers, and a keyword set). It never
 * mangles code: unmatched text is rendered verbatim and HTML is escaped.
 */

const KEYWORDS = new Set([
  // python
  'def', 'class', 'return', 'import', 'from', 'as', 'if', 'elif', 'else', 'for',
  'while', 'in', 'not', 'and', 'or', 'True', 'False', 'None', 'self', 'with',
  'try', 'except', 'raise', 'lambda', 'yield', 'pass', 'async', 'await',
  // js/ts
  'const', 'let', 'var', 'function', 'export', 'default', 'new', 'this',
  'typeof', 'interface', 'type', 'extends', 'implements', 'public', 'private',
  'null', 'undefined', 'true', 'false',
])

const COLORS = {
  comment: '#6B87A8',
  string: '#7FE3D8',
  number: '#FFB055',
  keyword: '#7FA6FF',
  func: '#4C80FF',
}

// One tokenizer regex: comment | string | number | identifier | other.
const TOKEN = /(#[^\n]*|\/\/[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|([^A-Za-z0-9_$#"'`]+|.)/g

function highlightLine(line: string) {
  const out: React.ReactNode[] = []
  let m: RegExpExecArray | null
  TOKEN.lastIndex = 0
  let key = 0
  while ((m = TOKEN.exec(line)) !== null) {
    const [full, comment, str, num, ident] = m
    if (comment) out.push(<span key={key++} style={{ color: COLORS.comment, fontStyle: 'italic' }}>{comment}</span>)
    else if (str) out.push(<span key={key++} style={{ color: COLORS.string }}>{str}</span>)
    else if (num) out.push(<span key={key++} style={{ color: COLORS.number }}>{num}</span>)
    else if (ident) {
      if (KEYWORDS.has(ident)) out.push(<span key={key++} style={{ color: COLORS.keyword, fontWeight: 600 }}>{ident}</span>)
      else {
        // function call? peek next char
        const next = line[TOKEN.lastIndex]
        if (next === '(') out.push(<span key={key++} style={{ color: COLORS.func }}>{ident}</span>)
        else out.push(<Fragment key={key++}>{ident}</Fragment>)
      }
    } else out.push(<Fragment key={key++}>{full}</Fragment>)
  }
  return out
}

export function CodeBlock({
  code,
  filename,
  language = 'python',
  highlight = [],
  showLineNumbers = true,
  className = '',
  maxHeight = 470,
}: {
  code: string
  filename?: string
  language?: string
  /** 1-based line numbers to emphasize */
  highlight?: number[]
  showLineNumbers?: boolean
  className?: string
  /**
   * Hard cap (px) on the scrollable code area so a long snippet can never
   * push its slide out of the 1280×720 frame — it scrolls inside instead.
   */
  maxHeight?: number
}) {
  const lines = code.replace(/\n$/, '').split('\n')
  const hl = new Set(highlight)
  return (
    <div className={`overflow-hidden rounded-card bg-night-2 shadow-card ${className}`}>
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        {filename && (
          <span className="ml-2 font-mono text-body-sm text-white/60">{filename}</span>
        )}
        <span className="ml-auto rounded-pill bg-white/10 px-2 py-0.5 font-mono text-xs uppercase tracking-wide text-white/50">
          {language}
        </span>
      </div>
      <pre
        className="overflow-auto px-4 py-4 font-mono text-code leading-relaxed"
        style={{ maxHeight }}
      >
        <code className="grid">
          {lines.map((line, i) => (
            <span
              key={i}
              className="grid grid-cols-[auto_1fr] gap-4 rounded px-1"
              style={hl.has(i + 1) ? { background: 'rgba(11,95,255,0.18)' } : undefined}
            >
              {showLineNumbers && (
                <span className="select-none text-right text-white/25">{i + 1}</span>
              )}
              <span className="text-white/90">{line ? highlightLine(line) : ' '}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}
