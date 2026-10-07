import { api, studioCommand } from '../api'
import { JobLog, useJob } from '../components/JobLog'
import type { StageProps } from '../types'

export default function GenerateStage({ state, send }: StageProps) {
  const { course, name } = state
  const job = useJob()

  return (
    <section className="stage">
      <header>
        <h2>4 · Generate the deck</h2>
        <p>
          Claude Code runs the <code>generate-slides</code> procedure for <code>{course}/{name}</code>: the plan gate,
          the kit, the verification pass, and the single-file build.
        </p>
      </header>
      {!state.allowed.generate && (
        <p className="notice">
          Held at the gate: the plan is {state.plan === 'missing' ? 'missing' : 'not signed off'}. Sign it off in the Plan stage first.
        </p>
      )}
      <div className="row">
        <button className="btn primary" disabled={!state.allowed.generate} onClick={() => send(studioCommand('generate', state))}>
          Generate in Claude Code →
        </button>
        <button className="btn" disabled={!state.deck || !!job.running} onClick={() => job.run(api.jobUrl(course, name, 'build'), 'npm run build:html')}>
          Build HTML
        </button>
      </div>
      <dl className="facts">
        <dt>Deck folder</dt>
        <dd>{state.deck ? `${course}/${name}/ · ${state.slideCount ?? '?'} slides` : 'not scaffolded yet'}</dd>
        <dt>Single-file build</dt>
        <dd>{state.built ? (state.buildStale ? 'built, but older than the source' : 'built and current') : 'none'}</dd>
      </dl>
      <JobLog lines={job.lines} />
    </section>
  )
}
