import { useState } from 'react'
import type { SessionState } from '../types'

type Props = {
  sessions: SessionState[]
  selected: string
  onChoose: (key: string) => void
  onCreate: (course: string, name: string) => void
}

export default function SessionPicker({ sessions, selected, onChoose, onCreate }: Props) {
  const [creating, setCreating] = useState(false)
  const [course, setCourse] = useState('')
  const [name, setName] = useState('')
  const courses = [...new Set(sessions.map((s) => s.course))]

  if (creating) {
    return (
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault()
          onCreate(course.trim(), name.trim())
          setCreating(false)
        }}
      >
        <input list="courses" placeholder="course folder" value={course} onChange={(e) => setCourse(e.target.value)} required />
        <datalist id="courses">{courses.map((c) => <option key={c} value={c} />)}</datalist>
        <input
          placeholder="session folder, e.g. deployement_session_9"
          value={name}
          onChange={(e) => setName(e.target.value)}
          pattern="[A-Za-z0-9_.-]+"
          required
        />
        <button className="btn primary" type="submit">Create</button>
        <button className="btn" type="button" onClick={() => setCreating(false)}>Cancel</button>
      </form>
    )
  }
  return (
    <div className="row">
      <select value={selected} onChange={(e) => onChoose(e.target.value)}>
        <option value="">— pick a session —</option>
        {courses.map((c) => (
          <optgroup key={c} label={c}>
            {sessions.filter((s) => s.course === c).map((s) => (
              <option key={s.name} value={`${s.course}/${s.name}`}>{s.name}</option>
            ))}
          </optgroup>
        ))}
      </select>
      <button className="btn" onClick={() => setCreating(true)}>New session…</button>
    </div>
  )
}
