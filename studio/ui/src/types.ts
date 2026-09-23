export type Stage = 'tr' | 'plan' | 'generate' | 'review' | 'export'

export type Action = 'request_plan' | 'sign_plan' | 'reopen_plan' | 'generate' | 'review' | 'sign_deck' | 'export'

/** One session, as the server derives it from the files. See server/repo.py. */
export type SessionState = {
  course: string
  name: string
  title: string
  tr: boolean
  plan: 'missing' | 'draft' | 'signed'
  statusLine: string | null
  notes: string | null
  deck: boolean
  slideCount: number | null
  built: boolean
  buildStale: boolean
  review: { open: number; done: number; total: number; approved: number; changes: number }
  deckSigned: boolean
  claudeSessionId: string | null
  claudeResumes: boolean
  planMtime: number | null
  reviewMtime: number | null
  htmlMtime: number | null
  allowed: Record<Action, boolean>
}

export type CommentStatus = 'open' | 'done' | 'wont-fix'
export type Verdict = 'pending' | 'approved' | 'changes-requested'
export type Comment = { id: string; status: CommentStatus; component: string; note: string; created: string }
export type ReviewSlide = { id: string; n: number | null; verdict: Verdict; comments: Comment[] }
export type Review = { slides: Record<string, ReviewSlide> }

/** What a running deck publishes on window.__DECK__ (src/deck/Deck.tsx in the kit). */
export type SlideRef = { n: number; id: string; label: string | null }
export type DeckManifest = { total: number; current: number; slides: SlideRef[] }

export type AgentStatus = 'idle' | 'working' | 'waiting' | 'stopped'
export type ToolUseEvent = { type: 'tool_use'; id: string; name: string; input: unknown; parent: string | null }
export type AskEvent = { type: 'ask'; id: string; kind: 'permission' | 'question'; tool: string; input: unknown; description: string | null }

/** What the server relays from headless Claude Code. See server/agent.py. */
export type AgentEvent =
  | { type: 'history'; events: AgentEvent[]; status: AgentStatus; session_id: string | null }
  | { type: 'status'; status: AgentStatus }
  | { type: 'init'; session_id: string; model: string | null }
  | { type: 'user'; text: string }
  | { type: 'delta'; text: string; parent: string | null }
  | { type: 'text'; text: string; parent: string | null }
  | ToolUseEvent
  | { type: 'tool_result'; tool_use_id: string; content: string; is_error: boolean; parent: string | null }
  | AskEvent
  | { type: 'answered'; id: string }
  | { type: 'result'; subtype: string; turns: number; duration_ms: number; cost: number | null; is_error: boolean }
  | { type: 'error'; message: string }
  | { type: 'log'; text: string }

export type StageProps = {
  state: SessionState
  refresh: () => Promise<void>
  /** Type a command into the live Claude Code terminal. False if it is not connected. */
  send: (command: string) => boolean
}
