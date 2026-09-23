import type { CommentStatus, Review, SessionState, SlideRef, Verdict } from './types'

async function call<T>(url: string, method = 'GET', body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!res.ok) throw new Error((await res.text()) || res.statusText)
  return res.json() as Promise<T>
}

const base = (c: string, n: string) => `/api/sessions/${encodeURIComponent(c)}/${encodeURIComponent(n)}`

export const api = {
  sessions: () => call<SessionState[]>('/api/sessions'),
  create: (course: string, name: string) => call<SessionState>('/api/sessions', 'POST', { course, name }),
  state: (c: string, n: string) => call<SessionState>(base(c, n)),

  text: (c: string, n: string, file: 'tr' | 'plan') => call<{ text: string | null }>(`${base(c, n)}/${file}`),
  saveText: (c: string, n: string, file: 'tr' | 'plan', text: string) =>
    call<SessionState>(`${base(c, n)}/${file}`, 'PUT', { text }),
  saveNotes: (c: string, n: string, notes: string | null) => call<SessionState>(`${base(c, n)}/notes`, 'PUT', { notes }),

  signPlan: (c: string, n: string) => call<SessionState>(`${base(c, n)}/plan/sign-off`, 'POST'),
  reopenPlan: (c: string, n: string) => call<SessionState>(`${base(c, n)}/plan/reopen`, 'POST'),
  signDeck: (c: string, n: string) => call<SessionState>(`${base(c, n)}/deck/sign-off`, 'POST'),
  newClaudeSession: (c: string, n: string) => call<SessionState>(`${base(c, n)}/claude/new`, 'POST'),

  review: (c: string, n: string) => call<Review>(`${base(c, n)}/review`),
  addComment: (c: string, n: string, body: { slide: string; n: number; component?: string; note: string; order: SlideRef[] }) =>
    call<Review>(`${base(c, n)}/review/comments`, 'POST', body),
  setComment: (c: string, n: string, id: string, status: CommentStatus | 'deleted', order: SlideRef[]) =>
    call<Review>(`${base(c, n)}/review/comments/${id}`, 'PATCH', { status, order }),
  setVerdict: (c: string, n: string, body: { slide: string; n: number; verdict: Verdict; order: SlideRef[] }) =>
    call<Review>(`${base(c, n)}/review/verdict`, 'PUT', body),

  deckUrl: (c: string, n: string) => `${base(c, n)}/deck.html`,
  exportUrl: (c: string, n: string) => `${base(c, n)}/export`,
  jobUrl: (c: string, n: string, job: string) => `${base(c, n)}/jobs/${job}`,
}

/** The one command each model step boils down to; the skill lives at .claude/skills/studio. */
export const studioCommand = (step: 'plan' | 'generate' | 'review', s: { course: string; name: string }) =>
  `/studio ${step} ${s.course}/${s.name}`
