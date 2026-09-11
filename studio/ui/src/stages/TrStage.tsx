import { useEffect, useState } from 'react'
import { api, studioCommand } from '../api'
import type { StageProps } from '../types'

export default function TrStage({ state, refresh, send }: StageProps) {
  const { course, name } = state
  const [text, setText] = useState('')
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    api.text(course, name, 'tr').then((r) => { setText(r.text ?? ''); setDirty(false) })
  }, [course, name])

  const edit = (value: string) => { setText(value); setDirty(true) }
  const save = async () => {
    await api.saveText(course, name, 'tr', text)
    setDirty(false)
    await refresh()
  }

  return (
    <section className="stage">
      <header>
        <h2>1 · TR document</h2>
        <p>The teaching resource this session is planned from. Saved as <code>{course}/session_plans/{name}/tr.md</code>.</p>
      </header>
      <div className="row">
        <label className="btn">
          Upload .md / .txt
          <input type="file" accept=".md,.markdown,.txt" hidden onChange={(e) => e.target.files?.[0]?.text().then(edit)} />
        </label>
        <button className="btn" onClick={save} disabled={!dirty}>Save</button>
        <span className="grow" />
        <button
          className="btn primary"
          disabled={!state.allowed.request_plan || dirty}
          title={dirty ? 'Save first' : ''}
          onClick={() => send(studioCommand('plan', state))}
        >
          Request plan in Claude Code →
        </button>
      </div>
      <textarea className="editor" value={text} onChange={(e) => edit(e.target.value)} placeholder="Paste the TR document here, or upload it." />
    </section>
  )
}
