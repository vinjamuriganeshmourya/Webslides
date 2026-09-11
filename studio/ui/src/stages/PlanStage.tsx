import { useEffect, useState } from 'react'
import { api, studioCommand } from '../api'
import Markdown from '../components/Markdown'
import type { StageProps } from '../types'

export default function PlanStage({ state, refresh, send }: StageProps) {
  const { course, name } = state
  const [text, setText] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [notes, setNotes] = useState(state.notes ?? '')

  // Reload whenever the file changes on disk, which is how a plan Claude Code just wrote appears.
  useEffect(() => { api.text(course, name, 'plan').then((r) => setText(r.text)) }, [course, name, state.planMtime])
  useEffect(() => setNotes(state.notes ?? ''), [state.notes])

  const then = (p: Promise<unknown>) => p.then(refresh)
  const save = () => then(api.saveText(course, name, 'plan', draft)).then(() => setEditing(false))
  const sendNotes = async () => {
    await api.saveNotes(course, name, notes.trim() || null)
    send(studioCommand('plan', state))
  }

  if (text === null) {
    return (
      <section className="stage">
        <header>
          <h2>2 · Plan</h2>
          <p>No plan yet at <code>{course}/session_plans/{name}/plan.md</code>.</p>
        </header>
        <div className="row">
          <button className="btn primary" disabled={!state.allowed.request_plan} onClick={() => send(studioCommand('plan', state))}>
            Request plan in Claude Code →
          </button>
          {!state.tr && <span className="muted">Add the TR document first.</span>}
        </div>
      </section>
    )
  }

  return (
    <section className="stage split">
      <div className="main">
        <header className="row">
          <h2>2 · Plan</h2>
          <span className={`pill ${state.plan}`}>{state.statusLine ?? 'no STATUS line'}</span>
          <span className="grow" />
          {editing ? (
            <>
              <button className="btn primary" onClick={save}>Save</button>
              <button className="btn" onClick={() => setEditing(false)}>Cancel</button>
            </>
          ) : (
            <button className="btn" onClick={() => { setDraft(text); setEditing(true) }}>Edit</button>
          )}
          <button className="btn primary" disabled={!state.allowed.sign_plan} onClick={() => then(api.signPlan(course, name))}>
            Sign off plan ✓
          </button>
          <button className="btn" disabled={!state.allowed.reopen_plan} onClick={() => then(api.reopenPlan(course, name))}>
            Reopen
          </button>
        </header>
        {editing ? <textarea className="editor" value={draft} onChange={(e) => setDraft(e.target.value)} /> : <Markdown text={text} />}
      </div>
      <aside className="side">
        <h3>Revision notes</h3>
        <p className="muted">What should change. Saved beside the plan and handed to Claude Code, which revises the plan and clears them.</p>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Concept 2 needs the failure beat before the fix…" />
        <button className="btn primary" disabled={!notes.trim()} onClick={sendNotes}>Send to Claude Code →</button>
      </aside>
    </section>
  )
}
