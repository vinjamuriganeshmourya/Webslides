import { useCallback, useEffect, useState, type ComponentType } from 'react'
import { api } from './api'
import SessionPicker from './components/SessionPicker'
import AgentPanel from './components/AgentPanel'
import ExportStage from './stages/ExportStage'
import GenerateStage from './stages/GenerateStage'
import PlanStage from './stages/PlanStage'
import ReviewStage from './stages/ReviewStage'
import TrStage from './stages/TrStage'
import type { SessionState, Stage, StageProps } from './types'
import { useAgent } from './useAgent'

/** The seven steps of the pipeline; two of them are sign-offs inside another step's pane. */
const STEPS: { label: string; stage: Stage; done: (s: SessionState) => boolean }[] = [
  { label: 'TR doc', stage: 'tr', done: (s) => s.tr },
  { label: 'Plan', stage: 'plan', done: (s) => s.plan !== 'missing' },
  { label: 'Plan sign-off', stage: 'plan', done: (s) => s.plan === 'signed' },
  { label: 'Generate', stage: 'generate', done: (s) => s.built },
  { label: 'Review', stage: 'review', done: (s) => s.deckSigned || (s.built && s.review.total > 0 && s.review.open === 0) },
  { label: 'Deck sign-off', stage: 'review', done: (s) => s.deckSigned },
  { label: 'Export', stage: 'export', done: (s) => s.deckSigned && s.built && !s.buildStale },
]

const PANES: Record<Stage, ComponentType<StageProps>> = {
  tr: TrStage, plan: PlanStage, generate: GenerateStage, review: ReviewStage, export: ExportStage,
}

export default function App() {
  const [sessions, setSessions] = useState<SessionState[]>([])
  const [selected, setSelected] = useState(() => localStorage.getItem('studio.session') ?? '')
  const [state, setState] = useState<SessionState | null>(null)
  const [stage, setStage] = useState<Stage | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [course, name] = selected ? selected.split('/') : []

  const loadSessions = useCallback(() => api.sessions().then(setSessions).catch((e) => setToast(String(e))), [])
  useEffect(() => { loadSessions() }, [loadSessions])

  // State is derived from files on the server, so it is polled: Claude Code
  // writes plan.md or rebuilds the deck, and the UI follows within seconds.
  const refresh = useCallback(async () => {
    if (!course || !name) return
    try { setState(await api.state(course, name)) } catch (e) { setToast(String(e)) }
  }, [course, name])
  useEffect(() => {
    setState(null)
    setStage(null)
    refresh()
    const timer = setInterval(refresh, 3000)
    return () => clearInterval(timer)
  }, [refresh])

  // Opening a session lands on its first unfinished step.
  useEffect(() => {
    if (state && stage === null) setStage((STEPS.find((s) => !s.done(state)) ?? STEPS[STEPS.length - 1]).stage)
  }, [state, stage])

  const agent = useAgent(course, name)
  const send = useCallback((command: string) => {
    const ok = agent.prompt(command)
    setToast(ok ? `Sent to Claude: ${command}` : 'Claude is not connected yet')
    return ok
  }, [agent.prompt])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  const choose = (key: string) => {
    setSelected(key)
    localStorage.setItem('studio.session', key)
  }
  const create = async (c: string, n: string) => {
    try {
      const s = await api.create(c, n)
      await loadSessions()
      choose(`${s.course}/${s.name}`)
    } catch (e) { setToast(String(e)) }
  }
  const newConversation = async () => {
    if (!course || !name) return
    await api.newClaudeSession(course, name)
    await refresh()
    agent.reconnect()
  }

  const Pane = stage ? PANES[stage] : null
  return (
    <div className="app">
      <header className="top">
        <h1>Deck Studio</h1>
        <SessionPicker sessions={sessions} selected={selected} onChoose={choose} onCreate={create} />
        {state && <span className="muted">{state.title}</span>}
      </header>
      {state && stage && (
        <nav className="stepper">
          {STEPS.map((s) => (
            <button
              key={s.label}
              className={`step ${s.done(state) ? 'done' : ''} ${s.stage === stage ? 'current' : ''}`}
              onClick={() => setStage(s.stage)}
            >
              <span className="dot" />{s.label}
            </button>
          ))}
        </nav>
      )}
      <div className="body">
        <main className="pane">
          {!selected && <p className="empty">Pick a session, or create one.</p>}
          {state && Pane && <Pane state={state} refresh={refresh} send={send} />}
        </main>
        <AgentPanel agent={agent} state={state} onNewConversation={newConversation} />
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
