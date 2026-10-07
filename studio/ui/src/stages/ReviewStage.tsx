import { useEffect, useRef, useState } from 'react'
import { api, studioCommand } from '../api'
import { JobLog, useJob } from '../components/JobLog'
import type { CommentStatus, DeckManifest, Review, StageProps, Verdict } from '../types'

type DeckWindow = Window & { __DECK__?: DeckManifest }
const VERDICTS: Verdict[] = ['approved', 'changes-requested', 'pending']

export default function ReviewStage({ state, refresh, send }: StageProps) {
  const { course, name } = state
  const frame = useRef<HTMLIFrameElement>(null)
  const [deck, setDeck] = useState<DeckManifest | null>(null)
  const [current, setCurrent] = useState(1)
  const [review, setReview] = useState<Review>({ slides: {} })
  const [note, setNote] = useState('')
  const job = useJob()

  useEffect(() => {
    api.review(course, name).then(setReview).catch(() => setReview({ slides: {} }))
  }, [course, name, state.reviewMtime])

  // The deck publishes window.__DECK__ (ids in order, current slide). It is
  // polled because in-deck navigation uses replaceState, which fires no event.
  useEffect(() => {
    const timer = setInterval(() => {
      const m = (frame.current?.contentWindow as DeckWindow | null)?.__DECK__
      if (!m) return
      setDeck((prev) => (prev && prev.total === m.total && prev.slides[0]?.id === m.slides[0]?.id ? prev : m))
      setCurrent(m.current)
    }, 300)
    return () => clearInterval(timer)
  }, [state.htmlMtime])

  const go = (n: number) => {
    const win = frame.current?.contentWindow
    if (win) win.location.hash = `#/${n}`
  }
  const ref = deck?.slides[current - 1]
  const slide = ref ? review.slides[ref.id] : undefined
  const order = deck?.slides ?? []
  const apply = (p: Promise<Review>) => p.then(setReview).then(refresh)

  const addComment = () => {
    if (!ref || !note.trim()) return
    apply(api.addComment(course, name, { slide: ref.id, n: ref.n, note, order }))
    setNote('')
  }
  const setStatus = (id: string, status: CommentStatus | 'deleted') => apply(api.setComment(course, name, id, status, order))
  const setVerdict = (verdict: Verdict) => ref && apply(api.setVerdict(course, name, { slide: ref.id, n: ref.n, verdict, order }))
  const build = () => job.run(api.jobUrl(course, name, 'build'), 'npm run build:html')

  if (!state.built) {
    return (
      <section className="stage">
        <header>
          <h2>5 · Review</h2>
          <p>There is no single-file build to review yet.</p>
        </header>
        <button className="btn primary" disabled={!state.deck || !!job.running} onClick={build}>Build HTML</button>
        <JobLog lines={job.lines} />
      </section>
    )
  }

  return (
    <section className="stage">
      <header className="row">
        <h2>5 · Review</h2>
        <span className="muted">
          {state.review.open} open · {state.review.done} done · {state.review.approved} approved
        </span>
        <span className="grow" />
        <button className="btn" disabled={!!job.running} onClick={build}>Rebuild</button>
        <button className="btn" disabled={state.review.open === 0} onClick={() => send(studioCommand('review', state))}>
          Send fixes to Claude Code →
        </button>
        <button className="btn primary" disabled={!state.allowed.sign_deck} onClick={() => api.signDeck(course, name).then(refresh)}>
          Sign off deck ✓
        </button>
      </header>
      {state.buildStale && <p className="notice">The source is newer than this build. Rebuild before trusting what you see.</p>}
      <div className="review-body">
        <div className="deck">
          <iframe key={state.htmlMtime ?? 0} ref={frame} title="deck" src={`${api.deckUrl(course, name)}?all`} />
          <div className="filmstrip">
            {deck?.slides.map((s) => {
              const r = review.slides[s.id]
              const open = r?.comments.some((c) => c.status === 'open')
              return (
                <button
                  key={s.id}
                  className={`chip ${s.n === current ? 'current' : ''} ${r?.verdict ?? ''} ${open ? 'open' : ''}`}
                  title={s.label ?? s.id}
                  onClick={() => go(s.n)}
                >
                  {s.n}
                </button>
              )
            })}
          </div>
        </div>
        <aside className="side">
          {ref ? (
            <>
              <h3>Slide {ref.n} <span className="mono muted">{ref.id}</span></h3>
              <div className="row">
                {VERDICTS.map((v) => (
                  <button key={v} className={`btn small ${slide?.verdict === v ? 'on' : ''}`} onClick={() => setVerdict(v)}>
                    {v === 'pending' ? 'clear' : v.replace('-', ' ')}
                  </button>
                ))}
              </div>
              <ul className="comments">
                {slide?.comments.map((c) => (
                  <li key={c.id} className={c.status}>
                    <span className="note">{c.note}</span>
                    <span className="row small">
                      <span className="muted">{c.component} · {c.created}</span>
                      {c.status !== 'done' && <button className="link" onClick={() => setStatus(c.id, 'done')}>done</button>}
                      {c.status !== 'wont-fix' && <button className="link" onClick={() => setStatus(c.id, 'wont-fix')}>won't fix</button>}
                      {c.status !== 'open' && <button className="link" onClick={() => setStatus(c.id, 'open')}>reopen</button>}
                      <button className="link" onClick={() => setStatus(c.id, 'deleted')}>delete</button>
                    </span>
                  </li>
                ))}
              </ul>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) addComment() }}
                placeholder="What is wrong on this slide?"
              />
              <button className="btn primary" disabled={!note.trim()} onClick={addComment}>Add comment (Ctrl+Enter)</button>
            </>
          ) : (
            <p className="muted">Waiting for the deck to load…</p>
          )}
        </aside>
      </div>
      <JobLog lines={job.lines} />
    </section>
  )
}
