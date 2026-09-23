import { api } from '../api'
import { JobLog, useJob } from '../components/JobLog'
import type { StageProps } from '../types'

const JOBS = [
  ['build', 'npm run build:html'],
  ['video-safe', 'node video-safe.mjs'],
  ['qa', 'node qa.mjs'],
  ['preview', 'node preview.mjs'],
] as const

export default function ExportStage({ state }: StageProps) {
  const { course, name } = state
  const job = useJob()
  const busy = !!job.running || !state.deck

  return (
    <section className="stage">
      <header>
        <h2>7 · Export</h2>
        <p>The deliverable is <code>{course}/{name}/dist-single/*.html</code>: one file, fonts and images inlined, opened by double-click.</p>
      </header>
      {!state.deckSigned && <p className="notice">The deck is not signed off yet.</p>}
      {state.buildStale && <p className="notice">The source is newer than the last build. Build again before exporting.</p>}
      <div className="row">
        {JOBS.map(([id, label]) => (
          <button key={id} className="btn" disabled={busy} onClick={() => job.run(api.jobUrl(course, name, id), label)}>{label}</button>
        ))}
        <span className="grow" />
        {state.allowed.export ? (
          <a className="btn primary" href={api.exportUrl(course, name)} download>Download HTML ↓</a>
        ) : (
          <button className="btn primary" disabled>Download HTML ↓</button>
        )}
      </div>
      <p className="muted">
        <code>video-safe</code> must print CLEAN and <code>qa</code> should flag only slide 1; both are the session's own harness scripts.
      </p>
      <JobLog lines={job.lines} />
      {job.exitCode !== null && <p className={job.exitCode === 0 ? 'ok' : 'bad'}>exit {job.exitCode}</p>}
    </section>
  )
}
