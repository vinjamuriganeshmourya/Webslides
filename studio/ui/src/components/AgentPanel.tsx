import { useEffect, useRef, useState } from 'react'
import type { AgentEvent, AskEvent, SessionState, ToolUseEvent } from '../types'
import type { useAgent } from '../useAgent'
import Markdown from './Markdown'

type Agent = ReturnType<typeof useAgent>
type Props = { agent: Agent; state: SessionState | null; onNewConversation: () => void }

/** The assistant, in the right-hand column: conversation, tool activity, approval and question cards, composer. */
export default function AgentPanel({ agent, state, onNewConversation }: Props) {
  const [wide, setWide] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [text, setText] = useState('')
  const scroller = useRef<HTMLDivElement>(null)
  useEffect(() => scroller.current?.scrollTo(0, scroller.current.scrollHeight), [agent.events, agent.streaming, agent.pending])

  const submit = () => {
    if (text.trim() && agent.prompt(text.trim())) setText('')
  }
  const results = new Map(agent.events.filter((e): e is Extract<AgentEvent, { type: 'tool_result' }> => e.type === 'tool_result').map((e) => [e.tool_use_id, e]))

  if (collapsed) {
    return (
      <aside className="assist collapsed">
        <button className="rail" onClick={() => setCollapsed(false)} title="Show Claude">
          <span>Claude</span>
          {agent.pending.length > 0 && <span className="badge">{agent.pending.length}</span>}
          {agent.status === 'working' && <span className="badge working">…</span>}
        </button>
      </aside>
    )
  }

  return (
    <aside className={`assist ${wide ? 'wide' : ''}`}>
      <header className="assist-head">
        <strong>Claude</strong>
        <span className={`pill ${agent.connected ? agent.status : 'closed'}`}>{agent.connected ? STATUS_LABEL[agent.status] : 'disconnected'}</span>
        {agent.sessionId && <span className="mono muted">{agent.sessionId.slice(0, 8)}{state?.claudeResumes ? ' · resumed' : ''}</span>}
        <span className="grow" />
        {agent.status === 'working' && <button className="btn small" onClick={agent.interrupt}>Stop</button>}
        {!agent.connected && <button className="btn small" onClick={agent.reconnect}>Reconnect</button>}
        <button className="btn small" onClick={onNewConversation} disabled={!state} title="Start a fresh conversation; the current one stays on record">New chat</button>
        <button className="btn small" onClick={() => setWide((w) => !w)} title={wide ? 'Narrower' : 'Wider'}>{wide ? '⇥' : '⇤'}</button>
        <button className="btn small" onClick={() => setCollapsed(true)} title="Hide">✕</button>
      </header>

      <div ref={scroller} className="assist-body">
        {agent.events.length === 0 && !agent.streaming && (
          <p className="muted center">Nothing yet. Use a stage button above, or ask something below.</p>
        )}
        {agent.events.map((e, i) => <EventRow key={i} e={e} result={e.type === 'tool_use' ? results.get(e.id) : undefined} />)}
        {agent.streaming && <div className="msg assistant streaming"><Markdown text={agent.streaming} /></div>}
        {agent.pending.map((ask) => (
          ask.kind === 'question'
            ? <QuestionCard key={ask.id} ask={ask} onAnswer={(answers) => agent.answer(ask.id, { answers })} />
            : <PermissionCard key={ask.id} ask={ask} onAnswer={(payload) => agent.answer(ask.id, payload)} />
        ))}
      </div>

      <footer className="composer">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
          placeholder={agent.connected ? 'Ask Claude, or give an instruction… (Enter to send)' : 'Not connected'}
          disabled={!agent.connected}
          rows={1}
        />
        <button className="btn primary" onClick={submit} disabled={!agent.connected || !text.trim()}>Send</button>
      </footer>
    </aside>
  )
}

const STATUS_LABEL = { idle: 'idle', working: 'working…', waiting: 'waiting for you', stopped: 'stopped' } as const

/** One line per tool call: the tool and the one input a person cares about. */
function summarize(e: ToolUseEvent): string {
  const input = e.input as Record<string, unknown>
  const s = (k: string) => (typeof input[k] === 'string' ? (input[k] as string) : '')
  switch (e.name) {
    case 'Read': case 'Write': case 'Edit': return s('file_path').replace(/^.*\/Web Slides\//, '')
    case 'Bash': return s('description') || s('command')
    case 'Grep': return s('pattern')
    case 'Glob': return s('pattern')
    case 'Skill': return s('skill') + (s('args') ? ` ${s('args')}` : '')
    case 'Task': return s('description')
    case 'WebFetch': return s('url')
    default: return JSON.stringify(e.input).slice(0, 120)
  }
}

function EventRow({ e, result }: { e: AgentEvent; result?: Extract<AgentEvent, { type: 'tool_result' }> }) {
  const [open, setOpen] = useState(false)
  switch (e.type) {
    case 'user': return <div className="msg user">{e.text}</div>
    case 'text': return <div className={`msg assistant ${e.parent ? 'sub' : ''}`}><Markdown text={e.text} /></div>
    case 'tool_use':
      return (
        <div className={`tool ${e.parent ? 'sub' : ''} ${result?.is_error ? 'error' : ''}`}>
          <button className="tool-line" onClick={() => setOpen((o) => !o)}>
            <span className="tool-name">{e.name}</span>
            <span className="tool-summary">{summarize(e)}</span>
            <span className="muted">{result ? (result.is_error ? 'error' : 'done') : '…'}</span>
          </button>
          {open && (
            <div className="tool-detail">
              <pre>{JSON.stringify(e.input, null, 2)}</pre>
              {result && <pre className={result.is_error ? 'bad' : ''}>{result.content || '(no output)'}</pre>}
            </div>
          )}
        </div>
      )
    case 'result':
      return <div className={`meta ${e.is_error ? 'bad' : ''}`}>{e.subtype} · {e.turns} turn{e.turns === 1 ? '' : 's'} · {Math.round(e.duration_ms / 1000)}s</div>
    case 'error': return <div className="meta bad">{e.message}</div>
    case 'log': return <div className="meta mono">{e.text}</div>
    default: return null
  }
}

function PermissionCard({ ask, onAnswer }: { ask: AskEvent; onAnswer: (p: { allow: boolean; always?: boolean; message?: string }) => void }) {
  const [reason, setReason] = useState('')
  const input = ask.input as Record<string, unknown>
  const shown = ask.tool === 'Bash' ? String(input.command ?? '') : JSON.stringify(input, null, 2)
  return (
    <div className="card">
      <h4>Allow <code>{ask.tool}</code>?</h4>
      {ask.description && <p className="muted">{ask.description}</p>}
      <pre>{shown}</pre>
      <div className="row">
        <button className="btn primary small" onClick={() => onAnswer({ allow: true })}>Allow once</button>
        <button className="btn small" onClick={() => onAnswer({ allow: true, always: true })}>Allow {ask.tool} for this conversation</button>
        <span className="grow" />
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="why not / what instead (optional)" />
        <button className="btn small" onClick={() => onAnswer({ allow: false, message: reason || undefined })}>Deny</button>
      </div>
    </div>
  )
}

type Question = { question: string; header: string; multiSelect?: boolean; options: { label: string; description?: string }[] }

function QuestionCard({ ask, onAnswer }: { ask: AskEvent; onAnswer: (answers: Record<string, string | string[]>) => void }) {
  const questions = ((ask.input as { questions?: Question[] }).questions ?? [])
  const [picked, setPicked] = useState<Record<string, string[]>>({})
  const [other, setOther] = useState<Record<string, string>>({})
  const toggle = (q: Question, label: string) =>
    setPicked((p) => {
      const cur = p[q.question] ?? []
      const next = q.multiSelect ? (cur.includes(label) ? cur.filter((l) => l !== label) : [...cur, label]) : [label]
      return { ...p, [q.question]: next }
    })
  const answers = Object.fromEntries(questions.map((q) => {
    const free = other[q.question]?.trim()
    const chosen = picked[q.question] ?? []
    const value = free ? [...chosen, free] : chosen
    return [q.question, q.multiSelect ? value : value[0] ?? '']
  }))
  const complete = questions.every((q) => (answers[q.question] as string | string[]).length > 0)
  return (
    <div className="card">
      <h4>Claude has a question</h4>
      {questions.map((q) => (
        <div key={q.question} className="question">
          <div><span className="pill">{q.header}</span> {q.question}</div>
          {q.options.map((o) => (
            <label key={o.label} className="option">
              <input type={q.multiSelect ? 'checkbox' : 'radio'} name={q.question} checked={(picked[q.question] ?? []).includes(o.label)} onChange={() => toggle(q, o.label)} />
              <span><strong>{o.label}</strong>{o.description ? ` — ${o.description}` : ''}</span>
            </label>
          ))}
          <input placeholder="Other…" value={other[q.question] ?? ''} onChange={(e) => setOther((p) => ({ ...p, [q.question]: e.target.value }))} />
        </div>
      ))}
      <button className="btn primary small" disabled={!complete} onClick={() => onAnswer(answers)}>Answer</button>
    </div>
  )
}
